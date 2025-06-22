#unused - filtered books to only english and only non-duplicates

import gzip
import json
import pandas as pd

def load_books(file_path, max_records=100000):
    books = []
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= max_records:
                break
            books.append(json.loads(line))
    return pd.DataFrame(books)

def filter_english_and_deduplicate(df):
    df = df[df['language_code'].isin(['eng', 'en-US', 'en-GB', 'english'])]

    # Convert ratings_count to numeric to sort
    df['ratings_count'] = pd.to_numeric(df['ratings_count'], errors='coerce')

    # Sort by ratings count and drop duplicates by title
    df = df.sort_values(by='ratings_count', ascending=False)
    df = df.drop_duplicates(subset='title', keep='first')

    return df

def save_to_json_gz(df, output_path):
    with gzip.open(output_path, 'wt', encoding='utf-8') as f:
        for record in df.to_dict(orient='records'):
            json.dump(record, f)
            f.write('\n')

if __name__ == "__main__":
    books_df = load_books("../unfiltered_data/goodreads_books_young_adult.json.gz")
    english_books = filter_english_and_deduplicate(books_df)
    save_to_json_gz(english_books, "../data/goodreads_valid_books_young_adult.json.gz")

