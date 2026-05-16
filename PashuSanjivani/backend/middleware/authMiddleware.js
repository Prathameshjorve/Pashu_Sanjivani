const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'Unauthorized' })
  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = auth
