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
import gc


def load_valid_interactions(file_path, max_records=150_000):
    cache_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../cache'))
    cache_path = os.path.join(cache_dir, 'user_scores.parquet')
    os.makedirs(cache_dir, exist_ok=True)

    if os.path.exists(cache_path):
        print(f"DEBUG: Loading interactions from cache: {cache_path}")
        return pd.read_parquet(cache_path)

    print(f"DEBUG: Cache not found, processing {file_path}")

    chunks = []
    chunk_size = 5000  # You can tune this (smaller = less memory)
    current_chunk = []
    count = 0

    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if count >= max_records:
                break
            try:
                record = json.loads(line)
                if record.get("rating", 0) > 0:
                    current_chunk.append(record)
                    count += 1
                if len(current_chunk) >= chunk_size:
                    chunks.append(pd.DataFrame(current_chunk))
                    current_chunk = []  # free memory
            except json.JSONDecodeError as e:
                print(f"ERROR: Line {i} decode error: {e}")
                continue

    if current_chunk:
        chunks.append(pd.DataFrame(current_chunk))  # final chunk

    df = pd.concat(chunks, ignore_index=True)
    print(f"DEBUG: Loaded {len(df)} interactions with rating > 0")

    try:
        df.to_parquet(cache_path)
        print(f"DEBUG: Cached to {cache_path}")
    except Exception as e:
        print(f"ERROR: Cache save failed: {e}")

    return df


def compute_collab_scores(user_feedback, books_df,
                          interactions_path=os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/goodreads_valid_interactions_young_adult.json.gz'))
                         ):
    start = time.time()
    print(f"DEBUG: Starting compute_collab_scores. Interactions file path: {interactions_path}")

    # === STEP 1: Load valid interactions ===
    try:
        df = load_valid_interactions(interactions_path)
    except Exception as e:
        print(f"ERROR: Failed to load interactions: {e}")
        return pd.DataFrame(columns=['book_id', 'collab_score'])

    print(f"[TIMING] load_valid_interactions took {time.time() - start:.2f} seconds")

    # Filter to only include relevant books
    valid_book_ids = set(books_df['book_id'])
    df = df[df['book_id'].isin(valid_book_ids)]
    print(f"DEBUG: Filtered to {len(df)} interactions after book_id filtering.")

    if df.empty:
        print("WARNING: No interactions match the filtered books.")
        return pd.DataFrame(columns=['book_id', 'collab_score'])

    # === STEP 2: Indexing users/books ===
    user_ids = df['user_id'].unique()
    book_ids = df['book_id'].unique()
    user_map = {uid: idx for idx, uid in enumerate(user_ids)}
    book_map = {bid: idx for idx, bid in enumerate(book_ids)}
    reverse_book_map = {idx: bid for bid, idx in book_map.items()}

    num_users = len(user_map) + 1  # extra row for synthetic user
    num_books = len(book_map)

    df['user_idx'] = df['user_id'].map(user_map).fillna(-1).astype(int)
    df['book_idx'] = df['book_id'].map(book_map).fillna(-1).astype(int)

    # === STEP 3: Build sparse matrix ===
    R = lil_matrix((num_users, num_books))
    user_indices = df['user_idx'].to_numpy()
    book_indices = df['book_idx'].to_numpy()
    ratings = df['rating'].to_numpy()

    valid_mask = (
        (user_indices != -1) & (book_indices != -1) &
        ~np.isnan(ratings) & ~np.isinf(ratings) &
        (user_indices >= 0) & (user_indices < num_users) &
        (book_indices >= 0) & (book_indices < num_books)
    )
    R[user_indices[valid_mask], book_indices[valid_mask]] = ratings[valid_mask]
    print(f"[TIMING] Sparse matrix creation took {time.time() - start:.2f} seconds")

    # Free memory from DataFrame and arrays
    del df, user_indices, book_indices, ratings
    gc.collect()

    # === STEP 4: Add synthetic user feedback ===
    synthetic_user_idx = num_users - 1
    book_title_map = books_df.set_index(books_df['title'].str.lower().str.strip())['book_id'].to_dict()

    for entry in user_feedback:
        title = entry['title'].lower().strip()
        liked = entry['liked']
        book_id = book_title_map.get(title)
        if book_id is not None and book_id in book_map:
            book_idx = book_map[book_id]
            R[synthetic_user_idx, book_idx] = 5 if liked else 1
            print(f"DEBUG: Added synthetic feedback for '{title}' as {'liked' if liked else 'disliked'}.")
        else:
            print(f"DEBUG: Skipping synthetic feedback for '{title}' (not found).")

    print(f"[TIMING] Synthetic feedback added at {time.time() - start:.2f} seconds")

    # === STEP 5: SVD and scoring ===
    R_sparse_csr = R.tocsr()
    del R
    gc.collect()

    k = 10
    if R_sparse_csr.nnz == 0 or min(R_sparse_csr.shape) <= k:
        print("WARNING: Matrix too sparse or small for SVD.")
        return pd.DataFrame(columns=['book_id', 'collab_score'])

    try:
        U, sigma, Vt = svds(R_sparse_csr, k=k)
        sigma = np.diag(sigma)

        # Efficiently compute only synthetic user's predictions
        user_vector = U[synthetic_user_idx] @ sigma @ Vt
        user_scores = user_vector

        print(f"[TIMING] SVD done in {time.time() - start:.2f} seconds")

        return pd.DataFrame({
            'book_id': [reverse_book_map[i] for i in range(len(user_scores))],
            'collab_score': user_scores
        })

    except Exception as e:
        print(f"ERROR: SVD failed: {e}")
        traceback.print_exc()
        return pd.DataFrame(columns=['book_id', 'collab_score'])
