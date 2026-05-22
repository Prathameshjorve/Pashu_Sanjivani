const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pashu_sanjivani',
  password: process.env.DB_PASSWORD || '1562',
  port: process.env.DB_PORT || 5432,
});

async function updateSchema() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL to update schema...');

    const queries = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'farmer';`,
      `ALTER TABLE reports ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending';`,
      `ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_id INTEGER;`,
      `ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_diagnosis TEXT;`,
      `ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_advice TEXT;`,
      `ALTER TABLE reports ADD COLUMN IF NOT EXISTS vet_medicine TEXT;`,
      `ALTER TABLE reports ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN;`,
      `ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;`
    ];

    for (let query of queries) {
      console.log(`Executing: ${query}`);
      await client.query(query);
    }

    console.log('Schema update completed successfully.');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await client.end();
  }
}

updateSchema();
