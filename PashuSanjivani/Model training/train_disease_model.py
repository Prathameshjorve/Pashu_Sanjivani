# =====================================================
# PASHU SANJIVANI - HYPERPARAMETER TUNING MODEL
# =====================================================

import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import (
    train_test_split,
    RandomizedSearchCV
)

from sklearn.preprocessing import LabelEncoder

from sklearn.metrics import (
    accuracy_score,
    classification_report
)

from xgboost import XGBClassifier

# =====================================================
# LOAD DATASET
# =====================================================

dataset_path = r"D:\EDI SEM 4\PashuSanjivani\animal prediction\animal_disease_dataset.csv"

df = pd.read_csv(dataset_path)

print("\n===================================")
print("DATASET LOADED SUCCESSFULLY!")
print("===================================\n")

# =====================================================
# HANDLE NULL VALUES
# =====================================================

df.fillna("No", inplace=True)

# =====================================================
# CLEAN TARGET COLUMN
# =====================================================

target = "Disease_Prediction"

df[target] = (
    df[target]
    .astype(str)
    .str.lower()
    .str.strip()
)

# =====================================================
# REMOVE RARE DISEASES
# =====================================================

disease_counts = df[target].value_counts()

valid_diseases = disease_counts[disease_counts >= 10].index

df = df[df[target].isin(valid_diseases)]

print("\nVALID DISEASES:\n")

print(df[target].value_counts())

# =====================================================
# CONVERT DURATION
# =====================================================

def convert_duration(duration):

    duration = str(duration).lower().strip()

    try:

        if "day" in duration:
            return int(duration.split()[0])

        elif "week" in duration:
            return int(duration.split()[0]) * 7

        elif "month" in duration:
            return int(duration.split()[0]) * 30

        else:
            return 0

    except:
        return 0

df["Duration_Days"] = df["Duration"].apply(convert_duration)

# =====================================================
# CLEAN TEMPERATURE
# =====================================================

def clean_temperature(temp):

    temp = str(temp).replace("°C", "").strip()

    try:
        return float(temp)

    except:
        return 0

df["Body_Temperature"] = df["Body_Temperature"].apply(clean_temperature)

# =====================================================
# SELECT FEATURES
# =====================================================

features = [

    "Animal_Type",

    "Symptom_1",
    "Symptom_2",
    "Symptom_3",
    "Symptom_4",

    "Appetite_Loss",
    "Vomiting",
    "Diarrhea",
    "Coughing",

    "Body_Temperature",

    "Duration_Days"
]

# =====================================================
# KEEP REQUIRED COLUMNS
# =====================================================

df = df[features + [target]]

# =====================================================
# LABEL ENCODING
# =====================================================

encoders = {}

for column in features:

    if df[column].dtype == object:

        le = LabelEncoder()

        df[column] = le.fit_transform(
            df[column].astype(str)
        )

        encoders[column] = le

# =====================================================
# ENCODE TARGET
# =====================================================

target_encoder = LabelEncoder()

df[target] = target_encoder.fit_transform(df[target])

# =====================================================
# PREPARE DATA
# =====================================================

X = df[features]

y = df[target]

# =====================================================
# SPLIT DATA
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.2,

    random_state=42,

    stratify=y
)

print("\n===================================")
print("DATA SPLITTING COMPLETED")
print("===================================\n")

# =====================================================
# BASE MODEL
# =====================================================

xgb_model = XGBClassifier(

    objective='multi:softmax',

    eval_metric='mlogloss',

    random_state=42
)

# =====================================================
# HYPERPARAMETER GRID
# =====================================================

param_grid = {

    'n_estimators': [100, 200, 300, 500],

    'max_depth': [3, 5, 7, 10],

    'learning_rate': [0.01, 0.05, 0.1, 0.2],

    'subsample': [0.6, 0.8, 1.0],

    'colsample_bytree': [0.6, 0.8, 1.0],

    'min_child_weight': [1, 3, 5]
}

# =====================================================
# RANDOM SEARCH CV
# =====================================================

print("\n===================================")
print("STARTING HYPERPARAMETER TUNING...")
print("===================================\n")

random_search = RandomizedSearchCV(

    estimator=xgb_model,

    param_distributions=param_grid,

    n_iter=20,

    scoring='accuracy',

    cv=3,

    verbose=2,

    random_state=42,

    n_jobs=-1
)

# =====================================================
# TRAIN TUNED MODEL
# =====================================================

random_search.fit(X_train, y_train)

# =====================================================
# BEST MODEL
# =====================================================

best_model = random_search.best_estimator_

print("\n===================================")
print("BEST PARAMETERS FOUND:")
print("===================================\n")

print(random_search.best_params_)

# =====================================================
# PREDICTIONS
# =====================================================

y_pred = best_model.predict(X_test)

# =====================================================
# ACCURACY
# =====================================================

accuracy = accuracy_score(y_test, y_pred)

print("\n===================================")
print(f"FINAL MODEL ACCURACY: {accuracy * 100:.2f}%")
print("===================================\n")

# =====================================================
# CLASSIFICATION REPORT
# =====================================================

print("\nCLASSIFICATION REPORT:\n")

print(classification_report(y_test, y_pred))

# =====================================================
# FEATURE IMPORTANCE
# =====================================================

print("\n===================================")
print("FEATURE IMPORTANCE")
print("===================================\n")

importance = best_model.feature_importances_

for i in range(len(features)):

    print(f"{features[i]} : {importance[i]:.4f}")

# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(best_model, "disease_prediction_model.pkl")

joblib.dump(encoders, "label_encoders.pkl")

joblib.dump(target_encoder, "target_encoder.pkl")

print("\n===================================")
print("TUNED MODEL SAVED SUCCESSFULLY!")
print("===================================\n")

# =====================================================
# SAMPLE PREDICTION
# =====================================================

print("\n===================================")
print("TESTING SAMPLE PREDICTION")
print("===================================\n")

sample = pd.DataFrame([{

    "Animal_Type": "Dog",

    "Symptom_1": "Fever",
    "Symptom_2": "Vomiting",
    "Symptom_3": "Weakness",
    "Symptom_4": "Loss of Appetite",

    "Appetite_Loss": "Yes",
    "Vomiting": "Yes",
    "Diarrhea": "No",
    "Coughing": "No",

    "Body_Temperature": 39.5,

    "Duration_Days": 3
}])

# =====================================================
# ENCODE SAMPLE
# =====================================================

for column in sample.columns:

    if column in encoders:

        try:

            sample[column] = encoders[column].transform(
                sample[column].astype(str)
            )

        except:

            sample[column] = 0

# =====================================================
# PREDICT
# =====================================================

prediction = best_model.predict(sample)

predicted_disease = target_encoder.inverse_transform(prediction)

print("\n===================================")
print("PREDICTED DISEASE:")
print(predicted_disease[0])
print("===================================\n")