# =========================================================
# PASHU SANJIVANI - STREAMLIT ANIMAL DETECTION APP
# =========================================================
# SAVE FILE AS:
# app.py
#
# RUN USING:
# streamlit run app.py
# =========================================================

import streamlit as st
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import os

# =========================================================
# PAGE CONFIG
# =========================================================

st.set_page_config(
    page_title="Pashu Sanjivani",
    page_icon="🐄",
    layout="centered"
)

# =========================================================
# TITLE
# =========================================================

st.title("🐄 Pashu Sanjivani")
st.subheader("AI Powered Animal Detection System")

st.write(
    "Upload an animal image to detect the animal type."
)

# =========================================================
# LOAD MODEL
# =========================================================

@st.cache_resource
def load_model():
    model = tf.keras.models.load_model(
        "animal_detection_model.h5"
    )
    return model

model = load_model()

# =========================================================
# DATASET PATH
# =========================================================

dataset_path = r"D:\EDI SEM 4\PashuSanjivani\animal prediction\Farm Harmful Animal Dataset\train"

# =========================================================
# CLASS NAMES
# =========================================================

class_names = sorted(os.listdir(dataset_path))

# =========================================================
# FILE UPLOADER
# =========================================================

uploaded_file = st.file_uploader(
    "Upload Animal Image",
    type=["jpg", "jpeg", "png"]
)

# =========================================================
# PREDICTION FUNCTION
# =========================================================

def predict_animal(image):

    # Convert image to numpy array
    img = np.array(image)

    # Resize image
    img = cv2.resize(img, (224, 224))

    # Normalize image
    img = img / 255.0

    # Expand dimensions
    img = np.expand_dims(img, axis=0)

    # Predict
    prediction = model.predict(img)

    predicted_index = np.argmax(prediction)

    confidence = np.max(prediction) * 100

    predicted_animal = class_names[predicted_index]

    return predicted_animal, confidence

# =========================================================
# MAIN LOGIC
# =========================================================

if uploaded_file is not None:

    # Open image
    image = Image.open(uploaded_file)

    # Show uploaded image
    st.image(
        image,
        caption="Uploaded Animal Image",
        use_container_width=True
    )

    # Predict button
    if st.button("Predict Animal"):

        with st.spinner("Detecting Animal..."):

            animal, confidence = predict_animal(image)

        # =================================================
        # RESULT
        # =================================================

        st.success("Prediction Completed!")

        st.markdown("## 🐾 Detection Result")

        st.write(f"### Detected Animal: {animal}")

        st.write(f"### Confidence: {confidence:.2f}%")

        # =================================================
        # CONFIDENCE BAR
        # =================================================

        st.progress(int(confidence))

        # =================================================
        # MESSAGE
        # =================================================

        if confidence > 90:
            st.success("High Confidence Prediction")
        elif confidence > 70:
            st.warning("Medium Confidence Prediction")
        else:
            st.error("Low Confidence Prediction")

# =========================================================
# FOOTER
# =========================================================

st.markdown("---")
st.write("Pashu Sanjivani - AI Animal Health Monitoring System")