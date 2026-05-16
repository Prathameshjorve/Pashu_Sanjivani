import joblib
import pandas as pd

model = joblib.load(r'D:\EDI SEM 4\PashuSanjivani\Model training\disease_prediction_model.pkl')
print("Model features:", model.feature_names_in_)
