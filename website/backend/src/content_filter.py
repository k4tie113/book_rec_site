import json
import pandas as pd
import numpy as np
import time
ACCEPTED_SHELVES = set([
    'young-adult', 'fiction', 'romance', 'teen', 'contemporary', 'fantasy', 'adventure',
    'realistic-fiction', 'mystery', 'high-school', 'supernatural', 'science-fiction',
    'coming-of-age', 'sci-fi', 'magic', 'urban-fantasy', 'action', 'family', 'dystopian',
    'drama', 'thriller', 'suspense', 'paranormal-romance', 'children’s', 'adult', 'kids', 'teens', 'youth', 'survival',
    'trilogy', 'post-apocalyptic', 'mythology', 'childhood-books', 'vampires', 'crime',
    'futuristic', 'lgbtq'
])

def filter_shelves(shelves):
    return [s for s in shelves if s['name'].lower() in ACCEPTED_SHELVES]

def extract_top_shelf_info(shelves, genre_keyword, top_n=6):
    sorted_shelves = sorted(shelves, key=lambda s: int(s['count']), reverse=True)
    top_shelves = sorted_shelves[:top_n]
    top_names = set(s['name'].lower() for s in top_shelves)
    genre_count = next((int(s['count']) for s in shelves if s['name'].lower() == genre_keyword.lower()), 0)
    return pd.Series([top_names, genre_count])

def recommend_books(df, genre_keyword, min_pages, max_pages):
    start = time.time()
    df = df.dropna(subset=['num_pages', 'average_rating', 'popular_shelves', 'ratings_count'])
    df['num_pages'] = pd.to_numeric(df['num_pages'], errors='coerce')
    df['average_rating'] = pd.to_numeric(df['average_rating'], errors='coerce')
    df['ratings_count'] = pd.to_numeric(df['ratings_count'], errors='coerce')

    df = df[
        (df['ratings_count'] > 1000) &
        (df['popular_shelves'].apply(lambda s: any(int(s['count']) >= 500 for s in s if 'count' in s))) &
        (df['language_code'].isin(['eng', 'en-US', 'en-GB', 'english']))
    ]

    df = df.sort_values(by='ratings_count', ascending=False)
    df = df.drop_duplicates(subset='title', keep='first')

    df[['top_shelf_names', 'genre_shelf_count']] = df['popular_shelves'].apply(
        lambda s: extract_top_shelf_info(s, genre_keyword)
    )

    filtered = df[
        (df['num_pages'] >= min_pages) &
        (df['num_pages'] <= max_pages) &
        (df['top_shelf_names'].apply(lambda names: genre_keyword.lower() in names))
    ].copy()

    w1, w2, w3 = 5, 2, 2
    filtered['score'] = (
        w1 * filtered['average_rating'] +
        w2 * np.log1p(filtered['ratings_count']) +
        w3 * np.log1p(filtered['genre_shelf_count'])
    )
    print(f"[TIMING] content filter took {time.time() - start:.2f} seconds")
    print("[DEBUG] Final returned columns from content filter:", filtered.columns.tolist())

    return filtered[['book_id', 'title', 'score', 'description', 'image_url']]

