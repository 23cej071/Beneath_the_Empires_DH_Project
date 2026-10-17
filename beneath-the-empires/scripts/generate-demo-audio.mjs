import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioPath = path.resolve(__dirname, '..', 'public', 'audio', 'ovi-demo.mp3');

// Generate 30 seconds of 8000Hz 8-bit mono WAV audio (240,000 bytes)
// Generating a gentle subtle grinding stone pulse rhythm (every 2 seconds)
const sampleRate = 8000;
const durationSeconds = 30;
const numSamples = sampleRate * durationSeconds;
const headerLength = 44;
const buffer = Buffer.alloc(headerLength + numSamples);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
buffer.writeUInt16LE(1, 22); // NumChannels (1 mono)
buffer.writeUInt32LE(sampleRate, 24); // SampleRate
buffer.writeUInt32LE(sampleRate, 28); // ByteRate
buffer.writeUInt16LE(1, 32); // BlockAlign
buffer.writeUInt16LE(8, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples, 40);

// Populate with a gentle periodic stone-grinding rotation tone (128 is center)
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  // A gentle periodic pulse simulating the stone chakki rotation (approx 0.5 Hz)
  const pulse = Math.sin(2 * Math.PI * 0.5 * t);
  const tone = Math.sin(2 * Math.PI * 180 * t);
  const sample = 128 + Math.floor(18 * pulse * tone);
  buffer[headerLength + i] = Math.max(0, Math.min(255, sample));
}

fs.writeFileSync(audioPath, buffer);
console.log(`Generated 30s demonstration audio at ${audioPath} (${buffer.length} bytes)`);
