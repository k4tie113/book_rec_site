# PART 2 COLAB Filter

import gzip                # for reading compressed .json.gz interaction file
import json                # for parsing JSON lines
import os                  # for file path checks and directory creation
import pandas as pd        # for tabular data handling
import numpy as np         # for numerical operations
from scipy.sparse import lil_matrix, csr_matrix # Import csr_matrix for efficient SVD
from scipy.sparse.linalg import svds         # for truncated SVD (matrix factorization)
import time                # for performance benchmarking
import sys
import traceback           # for printing full tracebacks in error handling

# === STEP 1: Load interaction data with rating > 0 ===
def load_valid_interactions(file_path, max_records=150_000):
    # Construct the cache path relative to this script
    # This assumes a structure like: my_project/backend/src/colab_filter.py
    # and cache directory: my_project/backend/cache/
    # If your structure is different, adjust the '../backend/cache/' part.
    cache_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../cache'))
    cache_path = os.path.join(cache_dir, 'user_scores.parquet')

    # Ensure the cache directory exists.
    # Note: On Render, files written to the project directory are ephemeral.
    # This cache will be cleared on restarts or new deployments.
    # For persistence, consider committing the .parquet file to git or using external storage.
    os.makedirs(cache_dir, exist_ok=True)
    print(f"DEBUG: Cache directory: {cache_dir}")
    print(f"DEBUG: Cache file path: {cache_path}")

    # If the cleaned parquet version already exists, load from cache
    if os.path.exists(cache_path):
        print(f"DEBUG: Loading interactions from cache: {cache_path}")
        return pd.read_parquet(cache_path)

    # Otherwise, parse the .json.gz file line-by-line and collect records with ratings > 0
    print(f"DEBUG: Cache not found, processing {file_path}")
    interactions = []
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= max_records:
                print(f"DEBUG: Reached max_records ({max_records}), stopping parsing.")
                break
            try:
                record = json.loads(line)
                if record.get("rating", 0) > 0: # Ensure rating exists and is positive
                    interactions.append(record)
            except json.JSONDecodeError as e:
                print(f"ERROR: Could not decode JSON line {i} in {file_path}: {e}")
                continue # Skip problematic line

    # Convert to DataFrame and save to disk for future runs within the same container lifecycle
    df = pd.DataFrame(interactions)
    try:
        df.to_parquet(cache_path)
        print(f"DEBUG: Successfully saved interactions to cache: {cache_path}")
    except Exception as e:
        print(f"ERROR: Could not save to parquet cache {cache_path}: {e}")
        # Continue without caching if saving fails, to allow the process to proceed
    return df


# === STEP 2: Compute collaborative filtering scores for a synthetic user ===
def compute_collab_scores(user_feedback, books_df,
                          # The interactions_path is now passed as an argument.
                          # Ensure this path is correct relative to colab_filter.py's location
                          # in your deployed environment. '../../data/' assumes colab_filter.py
                          # is in 'my_project/backend/src/' and 'data/' is in 'my_project/'
                          interactions_path=os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/goodreads_valid_interactions_young_adult.json.gz'))
                         ):
    start = time.time()

    print(f"DEBUG: Starting compute_collab_scores. Interactions file path: {interactions_path}")

    # Load preprocessed user-book interaction dataset
    try:
        df = load_valid_interactions(interactions_path)
    except Exception as e:
        print(f"ERROR: Failed to load valid interactions from {interactions_path}: {e}")
        # Return an empty DataFrame to gracefully handle the failure
        return pd.DataFrame(columns=['book_id', 'collab_score'])

    print(f"[TIMING] load_valid_interactions took {time.time() - start:.2f} seconds")

    # Filter to only include books in the content-filtered list
    valid_book_ids = set(books_df['book_id'])
    df = df[df['book_id'].isin(valid_book_ids)]
    print(f"DEBUG: Filtered interactions to {len(df)} records based on valid_book_ids.")


    if df.empty:
        print("WARNING: No valid interactions found after filtering by books_df. Cannot perform collaborative filtering.")
        return pd.DataFrame(columns=['book_id', 'collab_score'])


    # Get unique user and book IDs from the dataset
    user_ids = df['user_id'].unique()
    book_ids = df['book_id'].unique()

    # Build mappings from IDs to indices in matrix
    user_map = {uid: idx for idx, uid in enumerate(user_ids)}
    book_map = {bid: idx for idx, bid in enumerate(book_ids)}
    reverse_book_map = {idx: bid for bid, idx in book_map.items()}  # to map predictions back to book_id
    print(f"DEBUG: Unique users: {len(user_ids)}, Unique books: {len(book_ids)}")

    # Create matrix size: add 1 row for the synthetic (new) user
    num_users = len(user_map) + 1
    num_books = len(book_map)

    # Map user_id and book_id columns to their matrix indices
    df['user_idx'] = df['user_id'].map(user_map)
    df['book_idx'] = df['book_id'].map(book_map)

    # Handle potential NaNs from map, convert to int AFTER mapping
    df['user_idx'] = df['user_idx'].fillna(-1).astype(int)
    df['book_idx'] = df['book_idx'].fillna(-1).astype(int)


    # === STEP 3: Build the user-book rating matrix R ===
    R = lil_matrix((num_users, num_books))  # sparse matrix of shape (users, books)

    # Bulk populate known ratings from real users
    user_indices = df['user_idx'].to_numpy()
    book_indices = df['book_idx'].to_numpy()
    ratings = df['rating'].to_numpy()

    # Check for NaN or Inf in ratings or indices before assigning
    # Filter out entries where user_idx or book_idx is -1 (due to fillna for NaN/missing mappings)
    valid_mask = (user_indices != -1) & (book_indices != -1) & \
                 ~np.isnan(ratings) & ~np.isinf(ratings) & \
                 (user_indices >= 0) & (user_indices < num_users) & \
                 (book_indices >= 0) & (book_indices < num_books) # Ensure indices are within bounds and non-negative

    user_indices = user_indices[valid_mask].astype(int)
    book_indices = book_indices[valid_mask].astype(int)
    ratings = ratings[valid_mask]
    print(f"DEBUG: Filtered out {len(df) - len(user_indices)} invalid entries for matrix population.")


    R[user_indices, book_indices] = ratings
    print(f"[TIMING] Sparse matrix creation took {time.time() - start:.2f} seconds")

    # === STEP 4: Add synthetic user's feedback (likes/dislikes) ===
    synthetic_user_idx = num_users - 1  # index of the synthetic user (last row)
    for entry in user_feedback:
        title = entry['title'].lower().strip()  # normalize title
        liked = entry['liked']  # boolean
        # Try to find book by matching title
        match = books_df[books_df['title'].str.lower().str.strip() == title]
        if not match.empty:
            book_id = match.iloc[0]['book_id']
            if book_id in book_map:
                book_idx = book_map[book_id]
                R[synthetic_user_idx, book_idx] = 5 if liked else 1  # high for liked, low for disliked
                print(f"DEBUG: Added synthetic user feedback for book '{title}' (ID: {book_id}) as {'liked' if liked else 'disliked'}.")
            else:
                print(f"DEBUG: Book ID {book_id} for title '{title}' not found in book_map. Skipping.")
        else:
            print(f"DEBUG: Book title '{title}' not found in books_df. Skipping synthetic user feedback.")

    print(f"[TIMING] Adding synthetic user feedback took {time.time() - start:.2f} seconds")

    # === STEP 5: Perform matrix factorization using Truncated SVD ===
    # Convert to CSR format for efficient SVD computation.
    # THIS AVOIDS THE MEMORY CONSUMING .toarray() CALL
    R_sparse_csr = R.tocsr()
    print(f"DEBUG: Sparse matrix dimensions (CSR): {R_sparse_csr.shape}")

    # Define k for SVD
    k = 10 # This must be less than min(rows, columns) of the matrix

    # Handle the case where the matrix might be too small or have no non-zero elements
    # for SVD with k > 0.
    if R_sparse_csr.nnz == 0 or min(R_sparse_csr.shape) <= k:
        print(f"WARNING: Matrix (shape: {R_sparse_csr.shape}, non-zeros: {R_sparse_csr.nnz}) is too sparse or too small for SVD with k={k}. Returning empty collab_score.")
        return pd.DataFrame(columns=['book_id', 'collab_score'])

    try:
        # Decomposes R_sparse_csr into latent user and item factors
        U, sigma, Vt = svds(R_sparse_csr, k=k)  # Pass the sparse matrix directly, use defined k
        sigma = np.diag(sigma)  # convert vector to diagonal matrix

        # Predict missing values by reconstructing the matrix: U × Σ × Vᵗ
        predictions = np.dot(np.dot(U, sigma), Vt)
        print(f"[TIMING] SVD computation and reconstruction took {time.time() - start:.2f} seconds")

        # Extract the predicted scores for the synthetic user (last row)
        user_scores = predictions[synthetic_user_idx]
        print(f"[TIMING] compute_collab_scores finished in {time.time() - start:.2f} seconds")

        # Return a DataFrame of book_id and its collaborative filtering score
        return pd.DataFrame({
            'book_id': [reverse_book_map[i] for i in range(len(user_scores))],
            'collab_score': user_scores
        })
    except Exception as e:
        print(f"ERROR: SVD computation failed: {e}")
        # Log the full traceback for more details in Render logs
        traceback.print_exc()
        # Return empty DataFrame on failure
        return pd.DataFrame(columns=['book_id', 'collab_score'])

