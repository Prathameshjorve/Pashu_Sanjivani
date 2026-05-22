const express = require('express')
const router = express.Router()
const Chat = require('../controllers/chatController')
const { auth } = require('../middleware/authMiddleware')

router.post('/chat', auth, Chat.chat)

module.exports = router
