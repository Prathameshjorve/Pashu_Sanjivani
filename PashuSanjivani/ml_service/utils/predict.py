import tensorflow as tf
import numpy as np
import joblib
import pandas as pd
import os
import cv2

# Base directory of the ML service
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Model Paths
ANIMAL_MODEL_PATH = os.path.join(BASE_DIR, "models", "animal_detection_model.h5")
DISEASE_MODEL_PATH = os.path.join(BASE_DIR, "models", "disease_prediction_model.pkl")
LABEL_ENCODERS_PATH = os.path.join(BASE_DIR, "models", "label_encoders.pkl")
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, "models", "target_encoder.pkl")

# Animal Class Names (from training dataset)
ANIMAL_CLASSES = [
    "Armadilles", "Bear", "Birds", "Cow", "Crocodile", 
    "Deer", "Elephant", "Goat", "Horse", "Jaguar", 
    "Monkey", "Rabbit", "Skunk", "Tiger", "Wild Boar"
]

# Cache for models
_models = {
    "animal": None,
    "disease": None,
    "encoders": None,
    "target_encoder": None
}

def load_all_models():
    if _models["animal"] is None:
        try:
            _models["animal"] = tf.keras.models.load_model(ANIMAL_MODEL_PATH)
            _models["disease"] = joblib.load(DISEASE_MODEL_PATH)
            _models["encoders"] = joblib.load(LABEL_ENCODERS_PATH)
            _models["target_encoder"] = joblib.load(TARGET_ENCODER_PATH)
            print("All models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}")

def detect_animal(img_array):
    load_all_models()
    if _models["animal"] is None:
        return "Unknown", 0.0
    
    try:
        # Preprocessing is already done (resize to 224, 224 and normalize)
        preds = _models["animal"].predict(img_array)
        idx = np.argmax(preds[0])
        confidence = float(np.max(preds[0]) * 100)
        return ANIMAL_CLASSES[idx], confidence
    except Exception as e:
        print(f"Animal detection error: {e}")
        return "Unknown", 0.0

def predict_disease(data):
    """
    Expects data as a dictionary with keys matching model features.
    """
    load_all_models()
    if _models["disease"] is None:
        return {"error": "Disease model not loaded"}

    try:
        # Prepare feature list exactly as expected by the model
        # features = ["Animal_Type", "Symptom_1", "Symptom_2", "Symptom_3", "Symptom_4", 
        #            "Appetite_Loss", "Vomiting", "Diarrhea", "Coughing", "Body_Temperature", "Duration_Days"]
        
        # Mapping input fields to duration days if needed
        duration = data.get("Duration", "0 days")
        duration_days = 0
        try:
            if "day" in str(duration).lower():
                duration_days = int(str(duration).split()[0])
            elif "week" in str(duration).lower():
                duration_days = int(str(duration).split()[0]) * 7
            else:
                duration_days = int(duration)
        except:
            duration_days = 0

        # Construct input dataframe
        input_data = {
            "Animal_Type": data.get("Animal_Type", "Unknown"),
            "Symptom_1": data.get("Symptom_1", "None"),
            "Symptom_2": data.get("Symptom_2", "None"),
            "Symptom_3": data.get("Symptom_3", "None"),
            "Symptom_4": data.get("Symptom_4", "None"),
            "Appetite_Loss": data.get("Appetite_Loss", "No"),
            "Vomiting": data.get("Vomiting", "No"),
            "Diarrhea": data.get("Diarrhea", "No"),
            "Coughing": data.get("Coughing", "No"),
            "Body_Temperature": float(data.get("Body_Temperature", 38.5)),
            "Duration_Days": duration_days
        }

        df = pd.DataFrame([input_data])

        # Apply Label Encoders
        for col, le in _models["encoders"].items():
            if col in df.columns and df[col].dtype == object:
                try:
                    # Handle unseen labels by mapping to a default (usually 0 or most frequent)
                    # For simplicity, we use the first class if not found
                    val = str(df[col][0])
                    if val in le.classes_:
                        df[col] = le.transform([val])
                    else:
                        df[col] = 0 # Fallback
                except:
                    df[col] = 0

        # Predict
        prediction_idx = _models["disease"].predict(df)
        disease_name = _models["target_encoder"].inverse_transform(prediction_idx)[0]
        
        # Get confidence if model supports it
        confidence = "85%" # Default if not supported
        if hasattr(_models["disease"], "predict_proba"):
            probs = _models["disease"].predict_proba(df)
            confidence = f"{np.max(probs) * 100:.1f}%"

        # Heuristics for severity and recommendations (based on disease name)
        severity = "Medium"
        recommendations = "Consult a veterinarian."
        emergency = False

        disease_lower = disease_name.lower()
        if "fever" in disease_lower or "infection" in disease_lower or "virus" in disease_lower:
            severity = "High"
            recommendations = "Immediate quarantine and veterinary visit required."
            emergency = True
        elif "healthy" in disease_lower:
            severity = "Low"
            recommendations = "Continue regular monitoring and good nutrition."
        
        return {
            "disease": disease_name.replace("_", " ").title(),
            "confidence": confidence,
            "severity": severity,
            "recommendations": recommendations,
            "emergency": emergency
        }

    except Exception as e:
        print(f"Disease prediction error: {e}")
        return {"error": str(e)}
