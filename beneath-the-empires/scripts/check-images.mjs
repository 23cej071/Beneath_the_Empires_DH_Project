import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const archivesPath = path.resolve(__dirname, '..', 'src', 'data', 'archives.json');
const archivesData = JSON.parse(fs.readFileSync(archivesPath, 'utf8'));

console.log(`Checking ${archivesData.items.length} archival image URLs in archives.json...\n`);

let failures = 0;
let successes = 0;

for (const item of archivesData.items) {
  const url = item.image.url;
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'BeneathTheEmpiresBot/1.0 (Digital Humanities Archival Research; contact@digitalhumanities.edu)',
        'Accept': 'image/*,*/*'
      }
    });

    if (res.ok) {
      console.log(`[PASS] ${res.status} ${res.statusText}: ${item.id} -> ${res.url}`);
      successes++;
    } else {
      console.error(`[FAIL] ${res.status} ${res.statusText}: ${item.id} (${url})`);
      failures++;
    }
  } catch (err) {
    console.error(`[ERROR] ${item.id} (${url}):`, err.message);
    failures++;
  }
}

console.log(`\nResults: ${successes} passed, ${failures} failed.`);

if (failures > 0) {
  process.exit(1);
} else {
  console.log('All archival image URLs verified successfully with full redirects followed.');
}
