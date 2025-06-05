import gzip
import json
import csv

input_path = '../data/goodreads_valid_books_young_adult.json.gz'
output_path = 'book_titles.csv'

titles = set()

with gzip.open(input_path, 'rt', encoding='utf-8') as f:
    for line in f:
        try:
            book = json.loads(line)
            title = book.get('title', '').strip()
            ratings_count = book.get('ratings_count', 0)
            if title and isinstance(ratings_count, int) and ratings_count > 1000:
                titles.add(title)
        except json.JSONDecodeError:
            continue

# Sort titles for consistency
titles = sorted(titles)

# Write to CSV
with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['title'])
    for title in titles:
        writer.writerow([title])

print(f"Extracted {len(titles)} titles with >1000 ratings into {output_path}")
