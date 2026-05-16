# =========================================================
# PASHU SANJIVANI - ANIMAL IMAGE DETECTION MODEL
# =========================================================
# SAVE THIS FILE AS:
# train_animal_image.py
#
# RUN USING:
# py -3.10 train_animal_image.py
# =========================================================

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
import os

# =========================================================
# DATASET PATH
# =========================================================

# CHANGE THIS PATH TO YOUR DATASET PATH

dataset_path = r"D:\EDI SEM 4\PashuSanjivani\animal prediction\Farm Harmful Animal Dataset\train"

# =========================================================
# IMAGE SETTINGS
# =========================================================

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10

# =========================================================
# IMAGE PREPROCESSING
# =========================================================

train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

# =========================================================
# TRAINING DATA
# =========================================================

train_data = train_datagen.flow_from_directory(
    dataset_path,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

# =========================================================
# VALIDATION DATA
# =========================================================

val_data = train_datagen.flow_from_directory(
    dataset_path,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# =========================================================
# PRINT CLASS NAMES
# =========================================================

print("\nDetected Animal Classes:\n")
print(train_data.class_indices)

# =========================================================
# LOAD PRETRAINED MODEL
# =========================================================

base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Freeze pretrained layers

for layer in base_model.layers:
    layer.trainable = False

# =========================================================
# CUSTOM LAYERS
# =========================================================

x = base_model.output
x = GlobalAveragePooling2D()(x)

x = Dense(256, activation='relu')(x)
x = Dropout(0.3)(x)

predictions = Dense(
    train_data.num_classes,
    activation='softmax'
)(x)

# =========================================================
# FINAL MODEL
# =========================================================

model = Model(
    inputs=base_model.input,
    outputs=predictions
)

# =========================================================
# COMPILE MODEL
# =========================================================

model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# =========================================================
# MODEL SUMMARY
# =========================================================

model.summary()

# =========================================================
# TRAIN MODEL
# =========================================================

history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS
)

# =========================================================
# SAVE MODEL
# =========================================================

model.save("animal_detection_model.h5")

print("\n===================================")
print("MODEL TRAINING COMPLETED SUCCESSFULLY!")
print("Model saved as animal_detection_model.h5")
print("===================================\n")

# =========================================================
# PLOT ACCURACY GRAPH
# =========================================================

plt.figure(figsize=(10,5))

plt.plot(
    history.history['accuracy'],
    label='Training Accuracy'
)

plt.plot(
    history.history['val_accuracy'],
    label='Validation Accuracy'
)

plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.title("Training vs Validation Accuracy")
plt.legend()

plt.show()

# =========================================================
# PLOT LOSS GRAPH
# =========================================================

plt.figure(figsize=(10,5))

plt.plot(
    history.history['loss'],
    label='Training Loss'
)

plt.plot(
    history.history['val_loss'],
    label='Validation Loss'
)

plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Training vs Validation Loss")
plt.legend()

plt.show()