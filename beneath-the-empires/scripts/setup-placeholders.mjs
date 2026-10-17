import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '..', 'public');
const aiDir = path.join(publicDir, 'ai');
const audioDir = path.join(publicDir, 'audio');

fs.mkdirSync(aiDir, { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });

// Valid minimal 1x1 JPEG
const minimalJpgBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
const minimalJpg = Buffer.from(minimalJpgBase64, 'base64');

for (let i = 1; i <= 5; i++) {
  const filePath = path.join(aiDir, `ai-0${i}.jpg`);
  fs.writeFileSync(filePath, minimalJpg);
  console.log(`Created ${filePath}`);
}

const minimalMp3 = Buffer.from([0xFF, 0xFB, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const audioPath = path.join(audioDir, 'ovi-demo.mp3');
fs.writeFileSync(audioPath, minimalMp3);
console.log(`Created ${audioPath}`);
