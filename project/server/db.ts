import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load from parent dir
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing in .env');
}

const pool = mysql.createPool(process.env.DATABASE_URL as string);

export default pool;
