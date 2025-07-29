from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Initialize Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()

# ---------- Sentence Embedding Model ----------
model = SentenceTransformer('all-MiniLM-L6-v2')  # Loads locally

@app.route('/embed', methods=['POST'])
def embed():
    data = request.get_json()
    texts = data.get('sentences', [])
    embeddings = model.encode(texts).tolist()
    return jsonify({'vectors': embeddings})

# ---------- MongoDB + FAISS Search ----------
# MongoDB setup
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
    embedding = np.array(data['embedding']).astype('float32').reshape(1, -1)
    k = int(data.get('top_k', 5))
    threshold = float(data.get('threshold', 0.3))

    D, I = index.search(embedding, k)

    similar_ids = []
    for dist, idx in zip(D[0], I[0]):
        if idx == -1:
            continue
        if dist <= threshold:
            similar_ids.append(doc_ids[idx])

    return jsonify({"similar_ids": similar_ids})

@app.route('/add', methods=['POST'])
def add_to_index():
    data = request.json
    embedding = np.array(data['embedding']).astype('float32').reshape(1, -1)
    doc_id = data['id']

    index.add(embedding)
    doc_ids.append(doc_id)

    return jsonify({"message": "Added to FAISS", "index_size": index.ntotal})

# ---------- Run ----------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Single port for all endpoints
