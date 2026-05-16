-- PostgreSQL schema for Pashu Sanjivani
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
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
);
