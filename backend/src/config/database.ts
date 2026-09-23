import pg, { QueryResultRow } from 'pg';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000
});

let isConnected = false;

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    isConnected = true;
    logger.info(`[Database] PostgreSQL connection established successfully: ${result.rows[0].now}`);
    return true;
  } catch (err: unknown) {
    isConnected = false;
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`[Database] PostgreSQL connection failed (${msg}). Running in development fallback mode with realistic synthetic state.`);
    return false;
  }
};

export const isDbAvailable = (): boolean => isConnected;

export const dbQuery = async <T extends QueryResultRow = any>(text: string, params: unknown[] = []): Promise<pg.QueryResult<T>> => {
  if (!isConnected) {
    throw new Error('DATABASE_OFFLINE_FALLBACK');
  }
  return pool.query<T>(text, params);
};

export default pool;
