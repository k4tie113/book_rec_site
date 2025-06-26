#PART 2 COLAB Filter

import gzip                # for reading compressed .json.gz interaction file
import json                # for parsing JSON lines
import os                  # for file path checks and directory creation
import pandas as pd        # for tabular data handling
import numpy as np         # for numerical operations
from scipy.sparse import lil_matrix          # for creating a sparse matrix
from scipy.sparse.linalg import svds         # for truncated SVD (matrix factorization)
import time                # for performance benchmarking
import sys
def load_valid_interactions(file_path, max_records=1_000_000):
    cache_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/cache/user_scores.parquet'))
    os.makedirs(os.path.dirname(cache_path), exist_ok=True)

    
    if os.path.exists(cache_path):
        return pd.read_parquet(cache_path)


    interactions = []
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= max_records:
                break
            record = json.loads(line)
            if record.get("rating", 0) > 0:
                interactions.append(record)

    df = pd.DataFrame(interactions)
    df.to_parquet(cache_path)  
    return df


def compute_collab_scores(user_feedback, books_df, interactions_path=os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data/goodreads_valid_interactions_young_adult.json.gz'))):
    start = time.time()

    df = load_valid_interactions(interactions_path)
    print(f"[TIMING] load valid took {time.time() - start:.2f} seconds")

    valid_book_ids = set(books_df['book_id'])
    df = df[df['book_id'].isin(valid_book_ids)]

    user_ids = df['user_id'].unique()
    book_ids = df['book_id'].unique()

    user_map = {uid: idx for idx, uid in enumerate(user_ids)}
    book_map = {bid: idx for idx, bid in enumerate(book_ids)}
    reverse_book_map = {idx: bid for bid, idx in book_map.items()}  # to map predictions back to book_id

    num_users = len(user_map) + 1
    num_books = len(book_map)

    df['user_idx'] = df['user_id'].map(user_map)
    df['book_idx'] = df['book_id'].map(book_map)

    R = lil_matrix((num_users, num_books))  # sparse matrix of shape (users, books)

    user_indices = df['user_idx'].to_numpy()
    book_indices = df['book_idx'].to_numpy()
    ratings = df['rating'].to_numpy()
    R[user_indices, book_indices] = ratings
    print(f"[TIMING] iterrows took {time.time() - start:.2f} seconds")

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


    U, sigma, Vt = svds(R.toarray(), k=10)  # smaller k improves speed
    sigma = np.diag(sigma)

    #predict missing values by reconstructing the matrix: U × Σ × Vᵗ
    predictions = np.dot(np.dot(U, sigma), Vt)
    print(f"[TIMING] svd took {time.time() - start:.2f} seconds")

    user_scores = predictions[synthetic_user_idx]
    print(f"[TIMING] compute_collab_scores took {time.time() - start:.2f} seconds")

    return pd.DataFrame({
        'book_id': [reverse_book_map[i] for i in range(len(user_scores))],
        'collab_score': user_scores
    })
