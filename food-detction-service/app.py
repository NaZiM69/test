import os
import io
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load class names
try:
    with open('classes.txt', 'r') as f:
        class_names = [line.strip() for line in f.readlines()]
except FileNotFoundError:
    print("Error: classes.txt not found!")
    class_names = []

# Load nutrition data
try:
    with open('nutrition_data.json', 'r') as f:
        nutrition_data = json.load(f)
except FileNotFoundError:
    print("Error: nutrition_data.json not found!")
    nutrition_data = {}

# Build model
model = models.resnet50()
model.fc = nn.Sequential(
    nn.Dropout(p=0.4),
    nn.Linear(2048, 101)
)

# Load weights
try:
    model.load_state_dict(torch.load('best_food101_pro.pth', map_location=device, weights_only=True))
    print("Model loaded successfully!")
except Exception as e:
    print(f"Failed to load model weights: {e}")

model = model.to(device)
model.eval()

# Preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        input_tensor = preprocess(img).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)[0]
        
        # Get top 3 predictions
        top3_prob, top3_idx = torch.topk(probs, 3)

        results = []
        for i in range(3):
            name = class_names[top3_idx[i].item()]
            score = top3_prob[i].item() * 100
            
            # Get nutrition info (per 100g)
            nutrition = nutrition_data.get(name, {"calories": 0, "protein": 0, "carbs": 0})
            
            results.append({
                "name": name,
                "confidence": float(f"{score:.2f}"),
                "nutrition_per_100g": nutrition
            })

        return jsonify({"predictions": results})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
