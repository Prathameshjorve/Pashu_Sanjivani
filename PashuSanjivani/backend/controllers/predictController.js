const PredictService = require('../services/predictService')
const User = require('../models/userModel')

async function predictAnimal(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' })
    }
    const result = await PredictService.predictAnimal(req.file)
    res.json(result)
  } catch (err) {
    console.error('Error in predictAnimal controller:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function predictDisease(req, res) {
  const userId = req.user?.id || null
  const data = req.body
  
  try {
    const prediction = await PredictService.predictDisease(data)

    // Save report in DB
    try {
      await User.createReport({
        user_id: userId,
        animal_type: data.Animal_Type || prediction.animal,
        symptoms: data.Symptom_1, // Primary symptom
        disease: prediction.disease,
        severity: prediction.severity,
        confidence: prediction.confidence,
        detected_animal: data.Animal_Type,
        selected_symptoms: [data.Symptom_1, data.Symptom_2, data.Symptom_3, data.Symptom_4],
        chatbot_conversation: [], // Could be passed if needed
        suggestion: prediction.recommendations,
        image_path: data.image
      })
    } catch (err) {
      console.error('Error saving report', err)
    }

    res.json(prediction)
  } catch (err) {
    console.error('Error in predictDisease controller:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function getReports(req, res) {
  try {
    const rows = await User.getReports()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch reports' })
  }
}

module.exports = { predictAnimal, predictDisease, getReports }
