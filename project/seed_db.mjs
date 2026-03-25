import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSslOptionsFromDatabaseUrl(databaseUrl) {
  if (!databaseUrl) return undefined;
  try {
    const u = new URL(databaseUrl);
    if (u.hostname.includes('rlwy') || u.hostname.includes('railway')) {
      return { rejectUnauthorized: false };
    }
  } catch {
    // ignore
  }
  return undefined;
}

function buildConnectionOptions() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (databaseUrl) {
    return {
      uri: databaseUrl,
      multipleStatements: true,
      ssl:
        process.env.MYSQL_SSL === 'true'
          ? { rejectUnauthorized: false }
          : getSslOptionsFromDatabaseUrl(databaseUrl),
    };
  }

  const host = process.env.MYSQL_HOST;
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306;
  const user = process.env.MYSQL_USER || process.env.MYSQL_ROOT_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!host || !password || !database) {
    throw new Error('MySQL config missing. Set DATABASE_URL (recommended) or MYSQL_HOST + MYSQL_PASSWORD + MYSQL_DATABASE.');
  }

  return {
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };
}

async function seed() {
  console.log('Connecting to DB using DATABASE_URL from .env...');
  try {
    const connection = await mysql.createConnection(buildConnectionOptions());

    console.log('Connected! Reading SQL file...');
    const sqlPath = path.join(__dirname, 'mysql_setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Got SQL script, length:', sql.length);
    await connection.query(sql);
    console.log('Successfully seeded database!');
    await connection.end();
  } catch (e) {
    console.error('Error seeding DB:', e);
  }
}

seed();
