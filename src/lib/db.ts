import postgres from 'postgres'
import type { Brief, BriefRow, ArchiveSummary } from './types'

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  max: 5,
})

export default sql

export async function getLatestBrief(): Promise<BriefRow | null> {
  const rows = await sql<BriefRow[]>`
    SELECT * FROM briefs ORDER BY date DESC LIMIT 1
  `
  return rows[0] ?? null
}

export async function getBriefByDate(date: string): Promise<BriefRow | null> {
  const rows = await sql<BriefRow[]>`
    SELECT * FROM briefs WHERE date = ${date}
  `
  return rows[0] ?? null
}

export async function getAllBriefDates(): Promise<ArchiveSummary[]> {
  const rows = await sql<ArchiveSummary[]>`
    SELECT date::text, headline FROM briefs ORDER BY date DESC
  `
  return rows
}

export async function storeBrief(brief: Brief, date: string): Promise<void> {
  await sql`
    INSERT INTO briefs (date, headline, macro_environment, what_happened, under_the_surface, watch_list, raw_json)
    VALUES (
      ${date},
      ${brief.headline},
      ${sql.json(brief.macro_environment as never)},
      ${sql.json(brief.what_happened as never)},
      ${sql.json(brief.under_the_surface as never)},
      ${sql.json(brief.watch_list as never)},
      ${sql.json(brief as never)}
    )
    ON CONFLICT (date) DO UPDATE SET
      headline = EXCLUDED.headline,
      macro_environment = EXCLUDED.macro_environment,
      what_happened = EXCLUDED.what_happened,
      under_the_surface = EXCLUDED.under_the_surface,
      watch_list = EXCLUDED.watch_list,
      raw_json = EXCLUDED.raw_json
  `
}
