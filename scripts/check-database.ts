import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL_UNPOOLED or DATABASE_URL is required to check the database.')

const expected = {
  regions:222,
  grapes:107,
  producers:203,
  wines:409,
  aromas:77,
  academy_lessons:11,
} as const

const pool = new Pool({ connectionString, max:1 })

try {
  const counts:Record<string,number> = {}
  for (const [table, minimum] of Object.entries(expected)) {
    const result = await pool.query(`select count(*)::int as count from ${table}`)
    counts[table] = result.rows[0].count
    if (counts[table] < minimum) throw new Error(`${table} has ${counts[table]} rows; expected at least ${minimum}`)
  }
  const snapshot = await pool.query("select version, counts, published_at from catalog_snapshots where id='current'")
  if (!snapshot.rowCount) throw new Error('Current catalogue snapshot is missing.')
  if (snapshot.rows[0].counts.articles !== expected.academy_lessons) throw new Error(`Snapshot reports ${snapshot.rows[0].counts.articles} lessons; expected ${expected.academy_lessons}`)
  console.log(JSON.stringify({ ok:true, counts, snapshot:snapshot.rows[0] }))
} finally {
  await pool.end()
}
