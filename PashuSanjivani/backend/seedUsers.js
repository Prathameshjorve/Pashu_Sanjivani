const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pashu_sanjivani',
  password: process.env.DB_PASSWORD || '1562',
  port: process.env.DB_PORT || 5432,
});

const demoUsers = [
  {
    name: 'Demo Farmer',
    email: 'farmer@test.com',
    password: 'farmer123',
    role: 'farmer'
  },
  {
    name: 'Demo Vet',
    email: 'vet@test.com',
    password: 'vet123',
    role: 'vet'
  },
  {
    name: 'Demo Admin',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  }
];

async function seedUsers() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    // 1. Safe migration: Add role column if it doesn't exist
    console.log('Running safe migration...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'farmer';
    `);
    console.log('Migration completed.');

    // 2. Create or assign demo accounts
    console.log('Seeding demo accounts...');
    
    for (const user of demoUsers) {
      const password_hash = await bcrypt.hash(user.password, 10);
      
      // Check if user exists
      const res = await client.query('SELECT id FROM users WHERE email = $1', [user.email]);
      
      if (res.rows.length > 0) {
        // Update existing user with new role and password
        await client.query(
          'UPDATE users SET role = $1, password_hash = $2 WHERE email = $3',
          [user.role, password_hash, user.email]
        );
        console.log(`Updated existing user: ${user.email} as ${user.role}`);
      } else {
        // Create new user
        await client.query(
          'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
          [user.name, user.email, password_hash, user.role]
        );
        console.log(`Created new user: ${user.email} as ${user.role}`);
      }
    }

    console.log('\nSeed completed successfully!');
    console.log('Demo Credentials:');
    demoUsers.forEach(u => {
      console.log(`Role: ${u.role} | Email: ${u.email} | Password: ${u.password}`);
    });

  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    await client.end();
  }
}

seedUsers();
