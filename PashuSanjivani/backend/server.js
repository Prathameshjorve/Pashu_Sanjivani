const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
dotenv.config()

const db = require('./config/db')
const authRoutes = require('./routes/auth')
const predictRoutes = require('./routes/predict')
const chatRoutes = require('./routes/chat')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Expose uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api', predictRoutes)
app.use('/api', chatRoutes)

const PORT = process.env.PORT || 5000

async function ensureTables() {
  const usersSql = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );`

  const reportsSql = `CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    animal_type TEXT,
    symptoms TEXT,
    disease TEXT,
    severity TEXT,
    confidence TEXT,
    detected_animal TEXT,
    selected_symptoms JSONB,
    chatbot_conversation JSONB,
    suggestion TEXT,
    image_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );`

  await db.query(usersSql)
  await db.query(reportsSql)
}

app.get('/', (req, res) => res.json({ message: 'Pashu Sanjivani API' }))

app.listen(PORT, async () => {
  try {
    await ensureTables()
    console.log(`Server running on port ${PORT}`)
  } catch (err) {
    console.error('Error ensuring tables', err)
  }
})
