import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDb = async () => {
  logger.info('[Database Init] Reading schema.sql...');
  const schemaPath = path.resolve(__dirname, '../../sql/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  const client = await pool.connect();
  try {
    logger.info('[Database Init] Executing schema DDL against PostgreSQL...');
    await client.query('BEGIN');
    await client.query(schemaSql);
    await client.query('COMMIT');
    logger.info('[Database Init] Tables and indexes created successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('[Database Init] Error executing schema DDL:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

if (process.argv[1] && process.argv[1].endsWith('initDb.ts')) {
  initDb()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
