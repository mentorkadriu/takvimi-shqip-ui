const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_URL =
  'https://raw.githubusercontent.com/drilonjaha/kohet-e-namazit-kosove-json/main/kosovo-prayer-times.json';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'kosovo-prayer-times.json');

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => resolve(data));
        } else {
          reject(new Error(`Failed to download: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

async function fetchPrayerTimes() {
  ensureDirectoryExists(OUTPUT_DIR);

  console.log('Downloading Kosovo prayer times from drilonjaha/kohet-e-namazit-kosove-json...');
  const data = await downloadFile(REPO_URL);

  // Validate and minify
  const parsed = JSON.parse(data);
  if (!parsed.prayer_times) {
    throw new Error('Invalid data: missing prayer_times field');
  }

  const months = Object.keys(parsed.prayer_times);
  console.log(`  Found ${months.length} months: ${months.join(', ')}`);

  const totalDays = months.reduce((sum, m) => sum + parsed.prayer_times[m].length, 0);
  console.log(`  Total days: ${totalDays}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(parsed, null, 2), 'utf8');
  console.log(`\nSaved to ${OUTPUT_FILE}`);
  console.log('Done! Prayer times data is ready for offline use.');
}

fetchPrayerTimes().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
