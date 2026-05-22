const db = require('../config/db')

async function createUser({ name, email, password_hash, role }) {
  const res = await db.query(
    `INSERT INTO users (name, email, password_hash, role) 
     VALUES ($1, $2, $3, COALESCE($4, 'farmer')) 
     RETURNING id, name, email, role`,
    [name, email, password_hash, role || 'farmer']
  )
  return res.rows[0]
}

async function findByEmail(email) {
  const res = await db.query('SELECT id, name, email, password_hash, role FROM users WHERE email=$1', [email])
  return res.rows[0]
}

async function createReport({ user_id, animal_type, symptoms, disease, severity, confidence, detected_animal, selected_symptoms, chatbot_conversation, suggestion, image_path }) {
  const res = await db.query(
    'INSERT INTO reports (user_id, animal_type, symptoms, disease, severity, confidence, detected_animal, selected_symptoms, chatbot_conversation, suggestion, image_path) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
    [user_id, animal_type, symptoms, disease, severity, confidence, detected_animal, JSON.stringify(selected_symptoms), JSON.stringify(chatbot_conversation), suggestion, image_path]
  )
  return res.rows[0]
}

async function getReports(userId, role) {
  let query = 'SELECT * FROM reports ORDER BY created_at DESC'
  let params = []
  
  if (role === 'farmer') {
    query = 'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC'
    params = [userId]
  }
  
  const res = await db.query(query, params)
  return res.rows
}

module.exports = { createUser, findByEmail, createReport, getReports }
