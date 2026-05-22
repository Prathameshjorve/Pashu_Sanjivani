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
    return {
      disease: 'Lumpy Skin Disease (Mock AI)',
      severity: 'Medium',
      confidence: '85%',
      recommendations: 'Isolate the animal, maintain hygiene, and consult a local vet for treatment.'
    };
  }
}

module.exports = { predictDisease, predictAnimal };
