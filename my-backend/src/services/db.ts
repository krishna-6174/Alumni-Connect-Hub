import mysql from 'mysql2/promise';
import { dbConfig } from '../../config-local';

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Event listeners to check the connection status
pool.on('connection', (connection) => {
  console.log('A new connection has been established.');
});

// pool.on('error', (err) => {
//   console.error('Database connection error:', err);
// });
async function testConnection(): Promise<void> {
  try {
    // Execute a simple query to test the connection
    await pool.query('SELECT 1');
    console.log('Database connection is working.');
  } catch (err) {
    console.error('Database connection test failed:', err);
  }
}
testConnection()
export default pool;