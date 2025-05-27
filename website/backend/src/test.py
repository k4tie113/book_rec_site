import gzip
import json

file_path = "../data/goodreads_valid_interactions_young_adult.json.gz"  # adjust path if needed

with gzip.open(file_path, 'rt', encoding='utf-8') as f:
    for i, line in enumerate(f):
        record = json.loads(line)
        print(record)
        if i >= 10:  # print first 10 records only
            break
