import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' })

async function migrate() {
  console.log('Running migration...')

  await sql`
    CREATE TABLE IF NOT EXISTS briefs (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW(),
      date DATE UNIQUE,
      headline TEXT,
      macro_environment JSONB,
      what_happened JSONB,
      under_the_surface JSONB,
      watch_list JSONB,
      raw_json JSONB
    )
  `

  await sql`
    CREATE INDEX IF NOT EXISTS idx_briefs_date ON briefs (date DESC)
  `

  console.log('Migration complete.')
  await sql.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
