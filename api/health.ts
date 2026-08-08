import { sql } from 'drizzle-orm'
import { appMeta, catalogSnapshots } from '../db/schema.js'
import { database } from '../server/db.js'

const headers = { 'Cache-Control': 'no-store' }

export default async function handler(request: Request) {
  if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405, headers })

  try {
    await database.execute(sql`select 1`)
    const [snapshot] = await database.select({ version: catalogSnapshots.version, counts: catalogSnapshots.counts, publishedAt: catalogSnapshots.publishedAt }).from(catalogSnapshots).limit(1)
    const [schemaVersion] = await database.select({ value: appMeta.value }).from(appMeta).where(sql`${appMeta.key} = 'schema_version'`).limit(1)
    return Response.json({
      ok: true,
      database: 'connected',
      schemaVersion: schemaVersion?.value ?? null,
      catalog: snapshot ?? null,
    }, { headers })
  } catch (error) {
    console.error('Database health check failed', error)
    return Response.json({ ok: false, database: 'unavailable' }, { status: 503, headers })
  }
}
