import gzip
import json

def print_first_100_image_urls(file_path):
    count = 0
    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        for line in f:
            book = json.loads(line)
            title = book.get('title', 'Unknown Title')
            image_url = book.get('image_url', 'No image_url')
            print(f"{count+1}. {title} -> {image_url}")
            count += 1
            if count >= 100:
                break

if __name__ == "__main__":
    print_first_100_image_urls("goodreads_valid_books_young_adult.json.gz")
