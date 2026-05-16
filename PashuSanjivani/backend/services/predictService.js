const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function predictAnimal(imageFile) {
  try {
    const formData = new FormData();
    const imagePath = path.join(__dirname, '..', `uploads/${imageFile.filename}`);
    
    if (fs.existsSync(imagePath)) {
        formData.append('image', fs.createReadStream(imagePath));
    }

    const response = await axios.post(`${ML_SERVICE_URL}/predict-animal`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error calling ML service for animal detection:', error.message);
    return { error: 'Failed to detect animal' };
  }
}

async function predictDisease(data) {
  try {
    // Send as JSON now
    const response = await axios.post(`${ML_SERVICE_URL}/predict-disease`, data);

    console.log('ML Service Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling ML service for disease prediction:', error.message);
    return {
      disease: 'Error connecting to AI service',
      severity: 'Unknown',
      confidence: '0%',
      recommendations: 'Please try again later or consult a veterinarian manually.'
    };
  }
}

module.exports = { predictDisease, predictAnimal };
