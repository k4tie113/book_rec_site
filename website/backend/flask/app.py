# backend/app.py
from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)
titles_df = pd.read_csv("book_titles.csv")
titles = titles_df["title"].dropna().unique()

@app.route('/api/search_books')
def search_books():
    q = request.args.get('q', '').lower()
    matches = [
        {"label": t, "value": t}
        for t in titles
        if t.lower().startswith(q)
    ][:20]  # limit to 20 results
    return jsonify(matches)

if __name__ == "__main__":
    app.run(debug=True)
