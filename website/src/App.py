from flask import Flask, request, jsonify
import pandas as pd
import json
import gzip
import sys
import os
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


# Load book data once at startup
books_df = load_clean_books("../data/goodreads_valid_books_young_adult.json.gz")

@app.route('/api/recommend', methods=['POST'])
def recommend_endpoint():
    data = request.get_json()

    genre = data.get("genre")
    min_pages = data.get("min_pages")
    max_pages = data.get("max_pages")
    user_feedback = data.get("user_feedback", [])

    content_scored = recommend_books(books_df, genre, min_pages, max_pages)

    if user_feedback:
        collab_scored = compute_collab_scores(user_feedback, books_df)
    else:
        collab_scored = pd.DataFrame(columns=['book_id', 'collab_score'])

    final_df = combine_scores(content_scored, collab_scored, alpha=1.0)
    result = final_df[['title', 'final_score']].head(10).to_dict(orient='records')

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
