const db = require('../config/db')

async function createUser({ name, email, password_hash }) {
  const res = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, password_hash]
  )
  return res.rows[0]
}

async function findByEmail(email) {
  const res = await db.query('SELECT * FROM users WHERE email=$1', [email])
  return res.rows[0]
}

async function createReport({ user_id, animal_type, symptoms, disease, severity, confidence, detected_animal, selected_symptoms, chatbot_conversation, suggestion, image_path }) {
  const res = await db.query(
    'INSERT INTO reports (user_id, animal_type, symptoms, disease, severity, confidence, detected_animal, selected_symptoms, chatbot_conversation, suggestion, image_path) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
    [user_id, animal_type, symptoms, disease, severity, confidence, detected_animal, JSON.stringify(selected_symptoms), JSON.stringify(chatbot_conversation), suggestion, image_path]
  )
  return res.rows[0]
}

async function getReports() {
  const res = await db.query('SELECT * FROM reports ORDER BY created_at DESC')
  return res.rows
}

module.exports = { createUser, findByEmail, createReport, getReports }
