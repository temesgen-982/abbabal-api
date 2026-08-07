import 'dotenv/config';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, '../data/proverbs.db');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const MODEL_NAME = 'gemini-2.5-flash';
const BATCH_SIZE = 50;
const TARGET_RPM = 15;
const SLEEP_MS = Math.ceil((60 * 1000) / TARGET_RPM);

const MODEL_SOURCE = `Gemini ${MODEL_NAME.replace('gemini-', '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`;

const ProverbResultSchema = z.object({
  id: z.number(),
  english_translation: z.string(),
  amharic_meaning: z.string(),
  english_meaning: z.string(),
  confidence: z.number().min(0).max(1),
  needs_review: z.number().min(0).max(1),
});

const BatchResultSchema = z.array(ProverbResultSchema);

const SYSTEM_INSTRUCTION = `You are an expert translator specializing in Amharic proverbs and idioms.
You will be provided with a JSON array containing pairs of IDs and raw Amharic proverbs.
Your task is to analyze each proverb and return a strictly formatted JSON array containing the translation and meanings.

For each ID provided, you must return an object with the following structure:
[
  {
    "id": <the original number id provided>,
    "english_translation": "The direct, accurate translation into English",
    "amharic_meaning": "The deeper meaning or context of the proverb explained in Amharic",
    "english_meaning": "The deeper meaning or context of the proverb explained in English",
    "confidence": 0.95,
    "needs_review": 0.0
  }
]
The confidence score should be a float between 0.0 (utterly unsure) and 1.0 (perfectly confident).
If you find a proverb confusing or ambiguous, lower the confidence score and set needs_review to 1.0.
CRITICAL: Do not hallucinate new IDs. Only return objects for the IDs provided in the input array.`;

function getUnprocessedProverbs(db, limit) {
  return db.prepare(`
    SELECT p.id, p.text FROM proverbs p
    WHERE NOT EXISTS (
      SELECT 1 FROM interpretations i
      WHERE i.proverb_id = p.id AND i.type = 'translation' AND i.language = 'en'
    )
    ORDER BY p.id ASC
    LIMIT ?
  `).all(limit);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processBatch(db, batch) {
  const expectedIds = new Set(batch.map((p) => p.id));
  console.log(`Sending batch of ${batch.length} proverbs to Gemini...`);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const payload = batch.map((p) => ({ id: p.id, text: p.text }));

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Here is the input array:\n${JSON.stringify(payload, null, 2)}` }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const text = result.response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error('Gemini returned invalid JSON. Failing batch.');
      return null;
    }

    if (!Array.isArray(parsed)) {
      console.error('Gemini response is not a JSON array. Failing batch.');
      return null;
    }

    const validated = BatchResultSchema.safeParse(parsed);
    if (!validated.success) {
      console.error('Schema validation failed:', validated.error.message);
      return null;
    }

    const returnedIds = new Set();
    const validatedResults = [];

    for (const item of validated.data) {
      if (!expectedIds.has(item.id)) {
        console.warn(`Ignoring unexpected ID ${item.id}`);
        continue;
      }
      if (returnedIds.has(item.id)) {
        console.warn(`Ignoring duplicate ID ${item.id}`);
        continue;
      }
      returnedIds.add(item.id);
      validatedResults.push(item);
    }

    const missingIds = [...expectedIds].filter((id) => !returnedIds.has(id));
    if (missingIds.length > 0) {
      console.error(`Gemini response missing ${missingIds.length} IDs: ${missingIds.slice(0, 10)}. Failing batch.`);
      return null;
    }

    if (validatedResults.length === 0) {
      console.error('No valid items remained after validation. Failing batch.');
      return null;
    }

    return validatedResults;
  } catch (e) {
    if (String(e).includes('429') || String(e).includes('Quota exceeded') || String(e).includes('SAFETY')) {
      console.error('Rate limit or safety block. Stopping.');
      return null;
    }
    console.error('Error calling Gemini API:', e);
    return null;
  }
}

function updateProverbsAiData(db, results) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO interpretations (proverb_id, type, language, content, model, confidence, needs_review, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const updateProverb = db.prepare(`UPDATE proverbs SET updated_at = ? WHERE id = ?`);

  const now = new Date().toISOString();
  db.exec('BEGIN');
  try {
    for (const r of results) {
      if (r.english_translation) {
        insert.run(r.id, 'translation', 'en', r.english_translation, MODEL_SOURCE, r.confidence, r.needs_review > 0 ? 1 : 0, now);
      }
      if (r.amharic_meaning) {
        insert.run(r.id, 'meaning', 'am', r.amharic_meaning, MODEL_SOURCE, r.confidence, r.needs_review > 0 ? 1 : 0, now);
      }
      if (r.english_meaning) {
        insert.run(r.id, 'meaning', 'en', r.english_meaning, MODEL_SOURCE, r.confidence, r.needs_review > 0 ? 1 : 0, now);
      }
      updateProverb.run(now, r.id);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

async function main() {
  console.log('Starting AI augmentation processor...');
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL');

  let totalProcessed = 0;
  while (true) {
    const batch = getUnprocessedProverbs(db, BATCH_SIZE);
    if (batch.length === 0) {
      console.log('No more unprocessed proverbs found. Done!');
      break;
    }
    console.log(`\nFetched ${batch.length} unprocessed rows. (Total: ${totalProcessed})`);

    const aiResults = await processBatch(db, batch);
    if (aiResults) {
      try {
        updateProverbsAiData(db, aiResults);
        totalProcessed += aiResults.length;
        console.log(`Successfully wrote ${aiResults.length} parsed results.`);
      } catch (e) {
        console.error('Failed to write batch:', e);
        break;
      }
    } else {
      console.log('Failed to get valid response from Gemini. Stopping.');
      break;
    }
    console.log(`Sleeping ${SLEEP_MS / 1000}s to respect ${TARGET_RPM} RPM limit...`);
    await sleep(SLEEP_MS);
  }

  db.close();
  console.log(`\nFinished. Total proverbs augmented: ${totalProcessed}`);
}

main().catch((e) => { console.error('Processing failed:', e); process.exit(1); });
