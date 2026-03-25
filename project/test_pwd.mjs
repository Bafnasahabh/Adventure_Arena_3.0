import fs from 'fs';
import mysql from 'mysql2/promise';

async function testPassword(pwd) {
  console.log(`Testing: ${pwd}`);
  try {
    const connection = await mysql.createConnection({
      host: 'ballast.proxy.rlwy.net',
      port: 52662,
      user: 'root',
      password: pwd,
      database: 'railway'
    });
    console.log('SUCCESS with password:', pwd);
    await connection.end();
    return true;
  } catch (e) {
    console.error(`Failed ${pwd}:`, e.message);
    return false;
  }
}

testPassword('vlluZQzfaEcxJPewVfQQSgijGlVTRHOo');
