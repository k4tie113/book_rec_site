from flask import Flask, request, jsonify
import pandas as pd
import json
import gzip
import sys
import os
import re
from flask_cors import CORS
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/src')))

from recommend import (
    load_clean_books,
    recommend_books,
    compute_collab_scores,
    combine_scores,
    filter_shelves
)


app = Flask(__name__)
CORS(app)

import psutil, os

# Load book data once at startup

books_df = load_clean_books(os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/goodreads_valid_books_young_adult.json.gz')))
print("Memory (MB)", psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024)


@app.route("/health")
def health_check():
    return "Hello, World!",200

# --- ADDED: Function to clean the title of series info ---
def clean_book_title(title):
    return re.sub(r'\s*\([^)]*\)\s*$', '', title)
# --------------------------------------------------------

@app.route('/api/recommend', methods=['POST'])
def recommend_endpoint():
    data = request.get_json()

    genre = data.get("genre")
    min_pages = data.get("min_pages")
    max_pages = data.get("max_pages")
    user_feedback = data.get("user_feedback", [])
    user_feedback = [item for item in user_feedback if item['title'] != '']
    print("USER FEEDBACK:", user_feedback)

    content_scored = recommend_books(books_df, genre, min_pages, max_pages)

    if len(user_feedback) > 1:
        collab_scored = compute_collab_scores(user_feedback, books_df)
    else:
        collab_scored = pd.DataFrame(columns=['book_id', 'collab_score'])

    final_df = combine_scores(content_scored, collab_scored, alpha=1.0)
    initial_recommendations = final_df[['title', 'description', 'image_url', 'url', 'final_score']].head(50).to_dict(orient='records') 

    # title cleaning and duplicate removal logic
    cleaned_unique_recommendations = []
    seen_clean_titles = set()
    
    for book in initial_recommendations:
        original_title = book['title']
        clean_title = clean_book_title(original_title)
        
        if clean_title not in seen_clean_titles:
            book['title'] = clean_title 
            cleaned_unique_recommendations.append(book)
            seen_clean_titles.add(clean_title)
        

        if len(cleaned_unique_recommendations) >= 5: #only return the top 5 unique ones
            break

    result = cleaned_unique_recommendations #use the cleaned and unique list

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
