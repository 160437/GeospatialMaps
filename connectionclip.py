from flask import Flask, request, jsonify
from flask_cors import CORS
import clip
import torch
import os
import json
import torch.nn.functional as F
from PIL import Image

app = Flask(__name__)
CORS(app)  # ✅ Allow frontend calls

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

@app.route("/match", methods=["POST"])
def match():
    file = request.files["image"]
    text = request.form["text"]

    print("📥 Image received:", file.filename)
    print("🗣️ Text received:", text)

    image = preprocess(Image.open(file)).unsqueeze(0).to(device)
    text_tokens = clip.tokenize([text]).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text_tokens)
    similarity =F.cosine_similarity(image_features, text_features).item()
    print("🔁 Similarity Score:", similarity)
    return jsonify({"similarity": similarity})

@app.route("/save", methods=["POST"])
def save_to_file():
    try:
        data = request.get_json()
        print("✅ JSON to save:", data)

        file_path = os.path.join(os.path.dirname(__file__), 'placesnew.json')

        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                existing = json.load(f)
        else:
            existing = []

        existing.append(data)

        with open(file_path, "w") as f:
            json.dump(existing, f, indent=2)

        return jsonify({"status": "success"})
    except Exception as e:
        print("❌ Save error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
