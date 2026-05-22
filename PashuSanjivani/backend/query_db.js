require('dotenv').config();
const pool = require('./config/db');

async function run() {
  try {
    const res = await pool.query('SELECT DISTINCT disease, COUNT(*) FROM reports GROUP BY disease');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
