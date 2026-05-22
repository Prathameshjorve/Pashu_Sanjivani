-- PostgreSQL schema for Pashu Sanjivani
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'farmer',
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
  review_status TEXT DEFAULT 'pending',
  vet_id INTEGER,
  vet_diagnosis TEXT,
  vet_advice TEXT,
  vet_medicine TEXT,
  follow_up_required BOOLEAN,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
