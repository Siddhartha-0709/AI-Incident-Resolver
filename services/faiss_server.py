from flask import Flask, request, jsonify
import faiss
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Connect to MongoDB
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client["inteli-resolve"]
collection = db["incidents"]

# Load all embeddings
def load_embeddings():
    docs = list(collection.find({"embedding": {"$exists": True, "$ne": []}}, {"_id": 1, "embedding": 1}))
    embeddings = [doc['embedding'] for doc in docs]
    ids = [str(doc['_id']) for doc in docs]
    return np.array(embeddings).astype('float32'), ids

# Initialize FAISS
embeddings, doc_ids = load_embeddings()
index = faiss.IndexFlatL2(384)
if len(embeddings) > 0:
    index.add(embeddings)

@app.route('/similar', methods=['POST'])
def find_similar():
    data = request.json

    # Parse embedding input
    embedding = np.array(data['embedding']).astype('float32').reshape(1, -1)
    k = int(data.get('top_k', 5))
    threshold = float(data.get('threshold', 0.3))  # Lower = more similar (L2)

    # Perform FAISS search
    D, I = index.search(embedding, k)
    print("Distances:", D[0])

    # Gather matching IDs within threshold
    similar_ids = []
    for dist, idx in zip(D[0], I[0]):
        if idx == -1:
            continue  # Skip invalid
        if dist <= threshold:  # L2: smaller = more similar
            similar_ids.append(doc_ids[idx])

    return jsonify({"similar_ids": similar_ids})

@app.route('/add', methods=['POST'])
def add_to_index():
    data = request.json
    embedding = np.array(data['embedding']).astype('float32').reshape(1, -1)
    doc_id = data['id']

    index.add(embedding)
    doc_ids.append(doc_id)  # Keep it in sync

    return jsonify({"message": "Added to FAISS", "index_size": index.ntotal})


if __name__ == '__main__':
    app.run(port=5002)
