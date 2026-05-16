import cv2
import numpy as np

def preprocess_image(image_bytes, target_size=(224, 224)):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image format")

    # Resize image
    img = cv2.resize(img, target_size)
    
    # Convert BGR (OpenCV default) to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Normalize image to [0, 1] as expected by the trained model
    img = img.astype(np.float32) / 255.0
    
    # Add batch dimension
    img = np.expand_dims(img, axis=0)
    
    return img
