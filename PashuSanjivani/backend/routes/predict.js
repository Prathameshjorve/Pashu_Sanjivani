const express = require('express')
const router = express.Router()
const Predict = require('../controllers/predictController')
const auth = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.post('/predict-animal', auth, upload.single('image'), Predict.predictAnimal)
router.post('/predict-disease', auth, Predict.predictDisease)
router.get('/reports', auth, Predict.getReports)

module.exports = router
