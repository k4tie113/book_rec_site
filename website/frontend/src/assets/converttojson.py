import pandas as pd

df = pd.read_csv("book_titles.csv")
titles = df["title"].dropna().unique().tolist()

# Format as list of { value, label } for react-select
formatted = [{"value": t, "label": t} for t in titles]

import json
with open("book_titles.json", "w", encoding="utf-8") as f:
    json.dump(formatted, f, ensure_ascii=False, indent=2)

print(f"Saved {len(formatted)} titles to book_titles.json")
