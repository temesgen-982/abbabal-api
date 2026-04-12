import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { Role } from '../src/common/enums/role.enum';

for (const p of [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env')]) {
  if (existsSync(p)) { config({ path: p }); break; }
}

import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!username || !plainPassword) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env');
  }

  const existing = await db.query.users.findFirst({ where: eq(schema.users.username, username) });

  if (existing) {
    console.log(`User "${username}" already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  await db.insert(schema.users).values({ username, password: hashedPassword, role: Role.ADMIN });
  console.log(`Seeded admin user "${username}"`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
