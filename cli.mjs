import { readFile } from 'node:fs/promises';
import { reviewSnapshot } from './review.mjs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node cli.mjs <input.json>');
  process.exitCode = 2;
} else {
  try {
    const input = JSON.parse(await readFile(path, 'utf8'));
    const now = input.sampleNow ? new Date(input.sampleNow) : new Date();
    const result = reviewSnapshot(input, now);
    console.log(JSON.stringify(result, null, 2));
    if (result.result !== 'healthy') process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
