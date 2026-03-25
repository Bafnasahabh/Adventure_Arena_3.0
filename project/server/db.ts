import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded from the project root (not depending on runtime cwd).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

function getSslOptionsFromDatabaseUrl(databaseUrl?: string) {
  if (!databaseUrl) return undefined;
  try {
    const u = new URL(databaseUrl);
    // Railway uses TLS; accepting self-signed certs avoids handshake failures.
    if (u.hostname.includes('rlwy') || u.hostname.includes('railway')) {
      return { rejectUnauthorized: false };
    }
  } catch {
    // ignore invalid URL format
  }
  return undefined;
}

function buildPoolOptions(): mysql.PoolOptions {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (databaseUrl) {
    return { uri: databaseUrl, ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : getSslOptionsFromDatabaseUrl(databaseUrl) };
  }

  const host = process.env.MYSQL_HOST;
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306;
  const user = process.env.MYSQL_USER || process.env.MYSQL_ROOT_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!host || !password || !database) {
    throw new Error(
      'MySQL config missing. Set DATABASE_URL (recommended) or provide MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.'
    );
  }

  const ssl =
    process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

  return { host, port, user, password, database, ssl };
}

const pool = mysql.createPool(buildPoolOptions());

export default pool;
