import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDb = async () => {
  logger.info('[Database Seed] Reading seed.sql...');
  const seedPath = path.resolve(__dirname, '../../sql/seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  const client = await pool.connect();
  try {
    logger.info('[Database Seed] Executing realistic seed data against PostgreSQL...');
    await client.query('BEGIN');
    await client.query(seedSql);
    await client.query('COMMIT');
    logger.info('[Database Seed] Seed data inserted successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('[Database Seed] Error executing seed data:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedDb.ts')) {
  seedDb()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
