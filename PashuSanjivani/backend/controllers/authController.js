const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../models/userModel')

async function signup(req, res) {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
  const existing = await User.findByEmail(email)
  if (existing) return res.status(400).json({ message: 'Email already exists' })
  const password_hash = await bcrypt.hash(password, 10)
  const role = 'farmer' // Force role to farmer for public signups
  const user = await User.createUser({ name, email, password_hash, role })
  res.json({ user })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' })
  const user = await User.findByEmail(email)
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

module.exports = { signup, login }
