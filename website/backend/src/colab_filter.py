import gzip                # for reading compressed .json.gz interaction file
import json                # for parsing JSON lines
import os                  # for file path checks and directory creation
import pandas as pd        # for tabular data handling
import numpy as np         # for numerical operations
from scipy.sparse import lil_matrix          # for creating a sparse matrix
from scipy.sparse.linalg import svds         # for truncated SVD (matrix factorization)
import time                # for performance benchmarking

# === STEP 1: Load interaction data with rating > 0 ===
def load_valid_interactions(file_path, max_records=1_000_000):
    cache_path = "../cache/interactions_cleaned.parquet"  # local cache to avoid repeated parsing

    # If the cleaned parquet version already exists, load from cache
    if os.path.exists(cache_path):
        return pd.read_parquet(cache_path)

    # Otherwise, parse the .json.gz file line-by-line and collect records with ratings > 0
    interactions = []
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= max_records:  # stop early if exceeding max allowed
                break
            record = json.loads(line)
            if record.get("rating", 0) > 0:  # only keep rated interactions
                interactions.append(record)

    # Convert to DataFrame and save to disk for future runs
    df = pd.DataFrame(interactions)
    os.makedirs("cache", exist_ok=True)
    df.to_parquet(cache_path)
    return df

# === STEP 2: Compute collaborative filtering scores for a synthetic user ===
def compute_collab_scores(user_feedback, books_df, interactions_path="../data/goodreads_valid_interactions_young_adult.json.gz"):
    start = time.time()

    # Load preprocessed user-book interaction dataset
    df = load_valid_interactions(interactions_path)
    print(f"[TIMING] load valid took {time.time() - start:.2f} seconds")

    # Filter to only include books in the content-filtered list
    valid_book_ids = set(books_df['book_id'])
    df = df[df['book_id'].isin(valid_book_ids)]

    # Get unique user and book IDs from the dataset
    user_ids = df['user_id'].unique()
    book_ids = df['book_id'].unique()

    # Build mappings from IDs to indices in matrix
    user_map = {uid: idx for idx, uid in enumerate(user_ids)}
    book_map = {bid: idx for idx, bid in enumerate(book_ids)}
    reverse_book_map = {idx: bid for bid, idx in book_map.items()}  # to map predictions back to book_id

    # Create matrix size: add 1 row for the synthetic (new) user
    num_users = len(user_map) + 1
    num_books = len(book_map)

    # Map user_id and book_id columns to their matrix indices
    df['user_idx'] = df['user_id'].map(user_map)
    df['book_idx'] = df['book_id'].map(book_map)

    # === STEP 3: Build the user-book rating matrix R ===
    R = lil_matrix((num_users, num_books))  # sparse matrix of shape (users, books)

    # Bulk populate known ratings from real users
    user_indices = df['user_idx'].to_numpy()
    book_indices = df['book_idx'].to_numpy()
    ratings = df['rating'].to_numpy()
    R[user_indices, book_indices] = ratings
    print(f"[TIMING] iterrows took {time.time() - start:.2f} seconds")

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
    print(f"[TIMING] for entry took {time.time() - start:.2f} seconds")

    # === STEP 5: Perform matrix factorization using Truncated SVD ===
    # Decomposes R into latent user and item factors
    U, sigma, Vt = svds(R.toarray(), k=10)  # smaller k improves speed
    sigma = np.diag(sigma)  # convert vector to diagonal matrix

    # Predict missing values by reconstructing the matrix: U × Σ × Vᵗ
    predictions = np.dot(np.dot(U, sigma), Vt)
    print(f"[TIMING] svd took {time.time() - start:.2f} seconds")

    # Extract the predicted scores for the synthetic user (last row)
    user_scores = predictions[synthetic_user_idx]
    print(f"[TIMING] compute_collab_scores took {time.time() - start:.2f} seconds")

    # Return a DataFrame of book_id and its collaborative filtering score
    return pd.DataFrame({
        'book_id': [reverse_book_map[i] for i in range(len(user_scores))],
        'collab_score': user_scores
    })
