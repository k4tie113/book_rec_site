import gzip
import json
import pandas as pd
import numpy as np

ACCEPTED_SHELVES = set([
    'young-adult', 'fiction', 'romance', 'teen', 'contemporary', 'fantasy', 'adventure',
    'realistic-fiction', 'mystery', 'high-school', 'supernatural', 'science-fiction',
    'coming-of-age', 'sci-fi', 'magic', 'urban-fantasy', 'action', 'family', 'dystopian',
    'drama', 'thriller', 'suspense', 'paranormal-romance', 'children’s', 'adult', 'kids', 'teens', 'youth', 'survival',
    'trilogy', 'post-apocalyptic', 'mythology', 'childhood-books', 'vampires', 'crime',
    'futuristic', 'lgbtq'
])


# === Load books from JSON.GZ ===
def load_books(file_path, max_records=10000):
    books = []
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= max_records:
                break
            books.append(json.loads(line))
    return pd.DataFrame(books)

# ---------- if this genre is in the top shelves
def genre_in_top_shelves(shelves, genre_keyword, top_n=6):
    top_shelves = sorted(shelves, key=lambda x: int(x['count']), reverse=True)[:top_n]
    return any(genre_keyword.lower() == s['name'].lower() for s in top_shelves)


# -------------- returns the top n shelves given the shelf list
def simplify_shelves(shelf_list, top_n=3):
    return ", ".join(
        [s['name'] for s in sorted(shelf_list, key=lambda x: int(x['count']), reverse=True)[:top_n]]
    )

# -------------- returns the amount of people that placed a certain in a certain genre specific shelf. this is to test if that book is really a certain genre
def get_shelf_count_for_genre(shelves, genre_keyword):
    for s in shelves:
        if genre_keyword.lower() == s['name'].lower() and 'count' in s:
            return int(s['count'])
    return 0

# -------------- filteres the useless shelf names (ex. wishlist) off
def filter_shelves(shelves):
    return [s for s in shelves if s['name'].lower() in ACCEPTED_SHELVES]


# ------------- returns a list of the filtered books along with a certain score for each of the book
def recommend_books(df, genre_keyword, min_pages, max_pages):
    def has_genre(shelves):
        return any(
            genre_keyword.lower() in s['name'].lower()
            for s in shelves
        )

    # Drop rows with missing data 
    df = df.dropna(subset=['num_pages', 'average_rating', 'popular_shelves', 'ratings_count'])

    # Convert to numeric
    df['num_pages'] = pd.to_numeric(df['num_pages'], errors='coerce')
    df['average_rating'] = pd.to_numeric(df['average_rating'], errors='coerce')
    df['ratings_count'] = pd.to_numeric(df['ratings_count'], errors='coerce')

    # Apply filtering
    df = df[
        (df['ratings_count'] > 500) & # must have more than 500 ratings
        (df['popular_shelves'].apply(lambda s: any(int(s['count']) >= 500 for s in s if 'count' in s))) # must have more than 1000 on the 'popular shelves'
    ]
    df = df[df['language_code'].isin(['eng', 'en-US', 'en-GB', 'english'])]  # or just df['language_code'].str.startswith('en')

    # Remove duplicate titles, keeping the one with the most ratings
    df = df.sort_values(by='ratings_count', ascending=False)
    df = df.drop_duplicates(subset='title', keep='first')


    filtered = df[
    (df['num_pages'] >= min_pages) &
    (df['num_pages'] <= max_pages) &
    (df['popular_shelves'].apply(lambda s: has_genre(s) and genre_in_top_shelves(s, genre_keyword)))
    ].copy()



    # ---------------- computing score for each of the books
    w1, w2, w3 = 5, 2, 2 # these weights are for how importnat the rating vs other stuff is.

    filtered['genre_shelf_count'] = filtered['popular_shelves'].apply(lambda s: get_shelf_count_for_genre(s, genre_keyword))
    filtered['score'] = (
        w1 * filtered['average_rating'] +
        w2 * np.log1p(filtered['ratings_count']) +
        w3 * np.log1p(filtered['genre_shelf_count'])
    )

    #find that book's top shelves
    filtered['top_shelves'] = filtered['popular_shelves'].apply(simplify_shelves)

    # remove the duplicate titles and only keep the "title" with the most ratings
    filtered = filtered.sort_values(by='ratings_count', ascending=False)
    filtered = filtered.drop_duplicates(subset='title', keep='first')

    return filtered

# ------------------ START PROCESS: this method loads in the dataset and called recommend_books. it hardcodes the user preferences
def start_process():
    file_path = "data/goodreads_books_young_adult.json.gz"  # path to the local file
    books_df = load_books(file_path)
    books_df['popular_shelves'] = books_df['popular_shelves'].apply(filter_shelves) # remove the useless shelf titles that aren't in the acceptable genres

    # hardcoded preferences
    user_preferences = {
        "genre_keyword": "mystery",
        "min_pages": 200,
        "max_pages": 1000,
    }

    unsorted_books = recommend_books(
        books_df,
        genre_keyword=user_preferences["genre_keyword"],
        min_pages=user_preferences["min_pages"],
        max_pages=user_preferences["max_pages"],
    )


    sorted_books = unsorted_books.sort_values(by='score', ascending=False).head(5)
    print("\n📚 Top Recommendations:\n")
    print(sorted_books[['title', 'average_rating', 'ratings_count', 'num_pages', 'genre_shelf_count', 'score', 'top_shelves']].to_string(index=False))


#  ---------------- MAIN METHOD
if __name__ == "__main__":
   start_process()



