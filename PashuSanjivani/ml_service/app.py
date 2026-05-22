from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.preprocess import preprocess_image
from utils.predict import detect_animal, predict_disease, load_all_models
from utils.translator import translate_text, translate_dict
import os
import json

app = Flask(__name__)
CORS(app)

# Load models at startup
load_all_models()

@app.route('/predict-animal', methods=['POST'])
def api_predict_animal():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    contents = file.read()
    
    # Optional target language for animal name
    target_lang = request.form.get('lang', 'en')
    
    try:
        img_array = preprocess_image(contents)
        animal, confidence = detect_animal(img_array)
        
        # Translate animal name if requested
        # Note: Frontend usually handles animal name translation via keys,
        # but we can return it as is or translated.
        
        return jsonify({
            "animal": animal,
            "confidence": f"{confidence:.1f}%",
            "needs_confirmation": confidence < 85.0
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict-disease', methods=['POST'])
def api_predict_disease():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    target_lang = data.get('lang', 'en')
    # Standardize Marathi code
    if target_lang in ['mar', 'mr-IN']: target_lang = 'mr'
    
    try:
        # 1. Translate symptoms to English for ML model if they are free text
        # (Though our current model uses specific keys, we handle potential translation)
        
        # 2. Predict disease (model works with English keys/labels internally)
        result = predict_disease(data)
        
        if "error" in result:
            return jsonify(result), 500
            
        # 3. Translate result back to user's selected language
        if target_lang != 'en':
            # Do not translate disease and severity to keep them standardized (English) in DB and frontend
            result['recommendations'] = translate_text(result['recommendations'], target_lang, 'en')
        
        return jsonify(result)
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/translate', methods=['POST'])
def api_translate():
    data = request.json
    text = data.get('text')
    target_lang = data.get('target', 'en')
    source_lang = data.get('source', 'auto')
    
    if target_lang in ['mar', 'mr-IN']: target_lang = 'mr'
    if source_lang in ['mar', 'mr-IN']: source_lang = 'mr'
    
    translated = translate_text(text, target_lang, source_lang)
    return jsonify({"translated": translated})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
