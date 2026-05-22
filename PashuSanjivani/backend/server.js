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

const vetRoutes = require("./routes/vetRoutes");

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Expose uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api', predictRoutes)
app.use('/api', chatRoutes)
app.use("/api/vet", vetRoutes);
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

  // Add missing columns safely
  const alterUsersSql = `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'farmer';`
  await db.query(alterUsersSql)

  const alterReportsSql = `
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending';
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_id INTEGER;
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_diagnosis TEXT;
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_advice TEXT;
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_medicine TEXT;
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT false;
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;
  `
  await db.query(alterReportsSql)
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
