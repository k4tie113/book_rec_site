# run this script through python to test out the content and collab filters
import numpy as np
import pandas as pd
from content_filter import recommend_books, filter_shelves
from colab_filter import compute_collab_scores
import gzip
import json

# === Load and clean books ===
def load_clean_books(file_path):
    books = []
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for line in f:
            books.append(json.loads(line))
    df = pd.DataFrame(books)

    print("[DEBUG] After loading raw books:", df.columns.tolist())
    print("[DEBUG] Sample image_url:", df['image_url'].dropna().head(3).tolist())

    df['popular_shelves'] = df['popular_shelves'].apply(filter_shelves)
    return df


# === Combine scores ===
def combine_scores(content_df, collab_df, alpha=1.0):
    if collab_df.empty:
        content_df['collab_score'] = 0  # pad missing column
        content_df['final_score'] = content_df['score']
        merged = content_df
        # SQUARE ROOT SCALLING
        if not merged.empty:
            min_final_score = merged['final_score'].min()
            max_final_score = merged['final_score'].max()

        if max_final_score > min_final_score:
            # normalize scores to a 0-1 range
            normalized_scores = (merged['final_score'] - min_final_score) / (max_final_score - min_final_score)
            # Apply the square root , scale to 100
            # scale to 0-100
            merged['final_score'] = np.sqrt(normalized_scores) * 100
        else:
            merged['final_score'] = 50 if len(merged) > 1 else 90

        return merged.sort_values(by='final_score', ascending=False)

    merged = pd.merge(content_df, collab_df, on='book_id', how='left')
    # Scale collaborative scores to the same range as content scores
    collab_min = merged['collab_score'].min()
    collab_max = merged['collab_score'].max()
    if collab_max > collab_min:
        merged['collab_score'] = (merged['collab_score'] - collab_min) / (collab_max - collab_min)
        merged['collab_score'] *= merged['score'].max()  # bring it up to same scale
    else:
        merged['collab_score'] = 0


    merged['final_score'] = merged['score'] + alpha * merged['collab_score']

    #SQUARE ROOT SCALING
    if not merged.empty:
        min_final_score = merged['final_score'].min()
        max_final_score = merged['final_score'].max()

        if max_final_score > min_final_score:
            normalized_scores = (merged['final_score'] - min_final_score) / (max_final_score - min_final_score)
            merged['final_score'] = np.sqrt(normalized_scores) * 100
        else:
            merged['final_score'] = 50 if len(merged) > 1 else 90

    return merged.sort_values(by='final_score', ascending=False)

# main entry
def start_process():
    books_df = load_clean_books("../../data/goodreads_valid_books_young_adult.json.gz")

    genre_keyword = "mystery"
    min_pages = 200
    max_pages = 600

    user_feedback = [
        {"title": "One of Us Is Lying", "liked": True},
        {"title": "Twilight", "liked": False},
    ]

    # Attach book titles to books_df so colab_filter can access them
    books_df['title'] = books_df.get('title', '')  # ensure title column exists

    content_scored = recommend_books(
        books_df,
        genre_keyword=genre_keyword,
        min_pages=min_pages,
        max_pages=max_pages
    )
    print("[DEBUG] After recommend_books:", content_scored.columns.tolist())
    print("[DEBUG] Sample image_url after recommend_books:", content_scored.get('image_url', 'MISSING'))

    print("\n🟦 Columns BEFORE combine_scores (content_scored):")
    print(content_scored.columns.tolist())

    if user_feedback:
        collab_scored = compute_collab_scores(user_feedback, books_df)
    else:
        collab_scored = pd.DataFrame(columns=['book_id', 'collab_score'])

    combined = combine_scores(content_scored, collab_scored, alpha=1.0)
    print("\n🟨 Columns AFTER combine_scores (combined):")
    print(combined.columns.tolist())

    print("\n\U0001F4DA Top Hybrid Recommendations:\n")
    print(combined[['title', 'final_score']].head(10).to_string(index=False))

if __name__ == "__main__":
    start_process()
