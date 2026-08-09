import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH
  ? resolve(__dirname, '..', process.env.DB_PATH)
  : resolve(__dirname, '../data/proverbs.db');

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON');
db.exec('PRAGMA journal_mode = WAL');

db.exec('PRAGMA wal_checkpoint(TRUNCATE)');

const [{ before }] = db.prepare('SELECT COUNT(*) as before FROM proverbs').all();
const [{ uniqueTexts }] = db.prepare('SELECT COUNT(DISTINCT text) as uniqueTexts FROM proverbs').all();

// Load ONLY duplicated texts once.
const dupRows = db
  .prepare(
    `SELECT p.id, p.text, p.views, p.forwards,
            (SELECT COUNT(*) FROM interpretations i WHERE i.proverb_id = p.id) AS interpCount,
            (SELECT COUNT(*) FROM interpretations i WHERE i.proverb_id = p.id AND i.needs_review = 0) AS approvedCount
     FROM proverbs p
     WHERE p.text IN (
       SELECT text FROM proverbs GROUP BY text HAVING COUNT(*) > 1
     )
     ORDER BY p.id`
  )
  .all() as {
    id: number;
    text: string;
    views: number | null;
    forwards: number | null;
    interpCount: number;
    approvedCount: number;
  }[];

const groups = new Map<string, typeof dupRows>();
for (const row of dupRows) {
  const list = groups.get(row.text) ?? [];
  list.push(row);
  groups.set(row.text, list);
}

console.log(`Rows before: ${before} | unique texts: ${uniqueTexts} | duplicate groups: ${groups.size}`);

let reParented = 0;
let mergedViews = 0;
let removed = 0;
let groupIndex = 0;

const toDelete: number[] = [];

for (const [text, rows] of groups) {
  // Prefer row with interpretations; tiebreak most approved, then earliest id.
  const sorted = [...rows].sort((a, b) =>
    b.approvedCount - a.approvedCount ||
    b.interpCount - a.interpCount ||
    a.id - b.id
  );
  const keep = sorted[0];

  const maxViews = Math.max(keep.views ?? 0, ...rows.map((r) => r.views ?? 0));
  const maxForwards = Math.max(keep.forwards ?? 0, ...rows.map((r) => r.forwards ?? 0));
  if (maxViews !== (keep.views ?? 0) || maxForwards !== (keep.forwards ?? 0)) {
    db.prepare('UPDATE proverbs SET views = ?, forwards = ? WHERE id = ?').run(
      maxViews, maxForwards, keep.id
    );
    mergedViews++;
  }

for (const row of rows) {
    if (row.id === keep.id) continue;
    // Re-parent all interpretations onto the canonical proverb.
    const moved = db.prepare(
      'UPDATE interpretations SET proverb_id = ? WHERE proverb_id = ?'
    ).run(keep.id, row.id).changes;
    reParented += Number(moved);

    toDelete.push(row.id);
    removed++;
  }

  if (++groupIndex % 100 === 0) {
    console.log(`Progress: ${groupIndex}/${groups.size} groups, ${removed} removed`);
  }
}

// Delete duplicate proverb rows in one batch.
if (toDelete.length > 0) {
  const stmt = db.prepare('DELETE FROM proverbs WHERE id = ?');
  db.exec('BEGIN');
  for (const id of toDelete) stmt.run(id);
  db.exec('COMMIT');
}

// Collapse duplicate (proverb_id, type, language) interpretations produced by
// re-parenting: keep the best one (approved, highest confidence, then lowest id).
db.exec(`
  DELETE FROM interpretations
  WHERE id IN (
    SELECT i.id
    FROM interpretations i
    JOIN interpretations j
      ON j.proverb_id = i.proverb_id
     AND j.type = i.type
     AND j.language = i.language
     AND (
       j.needs_review < i.needs_review
       OR (j.needs_review = i.needs_review AND j.confidence > i.confidence)
       OR (j.needs_review = i.needs_review AND j.confidence = i.confidence AND j.id < i.id)
     )
  )
`);

// Enforce uniqueness going forward.
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_proverbs_text ON proverbs(text)');
db.exec(
  'CREATE UNIQUE INDEX IF NOT EXISTS idx_interpretations_unique ON interpretations(proverb_id, type, language)'
);

const [{ after }] = db.prepare('SELECT COUNT(*) as after FROM proverbs').all();
console.log(`Rows after:  ${after} | removed: ${removed} | interpretations re-parented: ${reParented} | groups with merged views: ${mergedViews}`);
console.log('Unique indexes created: idx_proverbs_text, idx_interpretations_unique');

db.close();