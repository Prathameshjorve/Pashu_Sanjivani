const express = require('express')
const router = express.Router()
const Predict = require('../controllers/predictController')
const { auth, requireRole } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.post('/predict-animal', auth, requireRole('farmer'), upload.single('image'), Predict.predictAnimal)
router.post('/predict-disease', auth, requireRole('farmer'), Predict.predictDisease)
router.get('/reports', auth, Predict.getReports)

module.exports = router
