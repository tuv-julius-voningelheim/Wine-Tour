import { attachDatabasePool } from '@vercel/functions'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required for server database access.')
}

const globalDatabase = globalThis as typeof globalThis & { vineAtlasPool?: Pool }

export const pool = globalDatabase.vineAtlasPool ?? new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
})

if (process.env.NODE_ENV !== 'production') globalDatabase.vineAtlasPool = pool
attachDatabasePool(pool)

export const database = drizzle(pool, { schema })
