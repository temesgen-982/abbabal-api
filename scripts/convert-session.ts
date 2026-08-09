import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StringSession } from 'teleproto/sessions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SESSION_PATH = process.env.TELETHON_SESSION_FILE
  ? resolve(__dirname, '..', process.env.TELETHON_SESSION_FILE)
  : resolve(__dirname, '../scraper-dump/ababaloch.session');

const db = new DatabaseSync(SESSION_PATH, { readOnly: true });
const row = db.prepare('SELECT dc_id, server_address, port, auth_key FROM sessions LIMIT 1').get();

if (!row) {
  console.error('No session row found.');
  process.exit(1);
}

const dcId = Number(row.dc_id);
const address = String(row.server_address);
const port = Number(row.port);
const key = Buffer.from(row.auth_key as Uint8Array);

const dcBuf = Buffer.from([dcId]);
const addrLen = Buffer.alloc(2);
addrLen.writeInt16BE(address.length, 0);
const portBuf = Buffer.alloc(2);
portBuf.writeInt16BE(port, 0);

const full = Buffer.concat([dcBuf, addrLen, Buffer.from(address, 'utf8'), portBuf, key]);
const sessionString = '1' + full.toString('base64');

// Verify it parses back correctly.
const session = new StringSession(sessionString);
await session.load();
console.log(`dcId: ${session.dcId}`);
console.log(`serverAddress: ${session.serverAddress}`);
console.log(`port: ${session.port}`);
console.log(`authKey loaded: ${!!session.authKey}`);
console.log();
console.log('STORE THIS AS TG_SESSION secret:');
console.log(sessionString);