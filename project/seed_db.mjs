import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  console.log('Connecting to DB using DATABASE_URL from .env...');
  try {
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
      multipleStatements: true
    });

    console.log('Connected! Reading SQL file...');
    const sql = fs.readFileSync('C:\\Users\\shrey\\.gemini\\antigravity\\brain\\3a98877a-5dcb-4e45-b132-0e47e69e9c95\\mysql_setup.sql', 'utf8');

    console.log('Got SQL script, length:', sql.length);
    await connection.query(sql);
    console.log('Successfully seeded database!');
    await connection.end();
  } catch (e) {
    console.error('Error seeding DB:', e);
  }
}

seed();
