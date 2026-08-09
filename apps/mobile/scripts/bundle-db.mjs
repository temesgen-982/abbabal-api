import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../../data/proverbs.db');
const destDir = resolve(here, '../static/assets/databases');
const dest = resolve(destDir, 'proverbs.db');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Bundled proverbs.db (${src}) -> ${dest}`);
