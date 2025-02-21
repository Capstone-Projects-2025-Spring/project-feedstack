from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)
CORS(app)

# Load a pre-trained model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@app.route('/api/highlight-terms', methods=['POST'])
def highlight_terms():
    data = request.json
    text = data['text']
    principles = data['principles']

    # Generate embeddings for the text
    text_embedding = model.encode([text])[0]

    highlighted_terms = {}
    for principle in principles:
        key_terms = principle['keyTerms']
        term_embeddings = model.encode(key_terms)

        for term, term_embedding in zip(key_terms, term_embeddings):
            similarity = cosine_similarity(text_embedding, term_embedding)
            if similarity > 0.5:  # You can adjust this threshold
                highlighted_terms[term] = principle['id']

    return jsonify({'highlighted_terms': highlighted_terms})

if __name__ == '__main__':
    app.run(debug=True)