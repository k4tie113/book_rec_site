import gzip
import json
import os
import pandas as pd
import numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import svds
import time
# === Load valid interactions with rating > 0 ===
def load_valid_interactions(file_path, max_records=1_000_000):
    cache_path = "../cache/interactions_cleaned.parquet"

    # Use cached version if it exists
    if os.path.exists(cache_path):
        return pd.read_parquet(cache_path)

    # Else parse and cache
    interactions = []
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= max_records:
                break
            record = json.loads(line)
            if record.get("rating", 0) > 0:
                interactions.append(record)

    df = pd.DataFrame(interactions)
    os.makedirs("cache", exist_ok=True)
    df.to_parquet(cache_path)
    return df

# === Compute collaborative scores for a synthetic user based on liked/disliked titles ===
def compute_collab_scores(user_feedback, books_df, interactions_path="../data/goodreads_valid_interactions_young_adult.json.gz"):
    start = time.time()
    df = load_valid_interactions(interactions_path)
    print(f"[TIMING] load valid took {time.time() - start:.2f} seconds")
    # ✅ Restrict to books we are actually scoring
    valid_book_ids = set(books_df['book_id'])
    df = df[df['book_id'].isin(valid_book_ids)]

    user_ids = df['user_id'].unique()
    book_ids = df['book_id'].unique()

    user_map = {uid: idx for idx, uid in enumerate(user_ids)}
    book_map = {bid: idx for idx, bid in enumerate(book_ids)}
    reverse_book_map = {idx: bid for bid, idx in book_map.items()}

    num_users = len(user_map) + 1  # +1 for synthetic user
    num_books = len(book_map)

    # ✅ Vectorized mapping
    df['user_idx'] = df['user_id'].map(user_map)
    df['book_idx'] = df['book_id'].map(book_map)

    # ✅ Create sparse matrix once
    R = lil_matrix((num_users, num_books))

    # ✅ Bulk insert via numpy arrays
    user_indices = df['user_idx'].to_numpy()
    book_indices = df['book_idx'].to_numpy()
    ratings = df['rating'].to_numpy()
    R[user_indices, book_indices] = ratings

    print(f"[TIMING] iterrows took {time.time() - start:.2f} seconds")

    synthetic_user_idx = num_users - 1
    for entry in user_feedback:
        title = entry['title'].lower().strip()
        liked = entry['liked']
        match = books_df[books_df['title'].str.lower().str.strip() == title]
        if not match.empty:
            book_id = match.iloc[0]['book_id']
            if book_id in book_map:
                book_idx = book_map[book_id]
                R[synthetic_user_idx, book_idx] = 5 if liked else 1
    print(f"[TIMING] for entry took {time.time() - start:.2f} seconds")

    # Matrix factorization (faster with smaller k)
    U, sigma, Vt = svds(R.toarray(), k=10)
    sigma = np.diag(sigma)
    predictions = np.dot(np.dot(U, sigma), Vt)
    print(f"[TIMING] svd took {time.time() - start:.2f} seconds")

    user_scores = predictions[synthetic_user_idx]
    print(f"[TIMING] compute_collab_scores took {time.time() - start:.2f} seconds")
    return pd.DataFrame({
        'book_id': [reverse_book_map[i] for i in range(len(user_scores))],
        'collab_score': user_scores
    })
