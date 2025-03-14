const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
});

(async () => {
  try {
    await pool.connect();
    console.log('✅ Connected to PostgreSQL Database');
  } catch (err) {
    console.error('❌ Database connection error:', err.stack);
    process.exit(1); // Exit the application if the DB fails to connect
  }
})();

// Gracefully shut down the pool when the process is terminated
process.on('SIGTERM', async () => {
  await pool.end();
  console.log('🛑 PostgreSQL pool has ended');
});

process.on('SIGINT', async () => {
  await pool.end();
  console.log('🛑 PostgreSQL pool has ended due to app termination');
});

module.exports = pool;
