const fs = require('fs');
const path = require('path');
const https = require('https');

const YEARS = ['2025'];  // Only fetch 2025 data
const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const BASE_URL = 'https://raw.githubusercontent.com/mentorkadriu/takvimi-shqip-api/main/api/takvimi';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data', 'takvimi');

// Create directories if they don't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Download file from URL
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve(data);
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Save data to file
function saveFile(data, outputPath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, data, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Main function to fetch all prayer times
async function fetchPrayerTimes() {
  for (const year of YEARS) {
    const yearDir = path.join(OUTPUT_DIR, year);
    ensureDirectoryExists(yearDir);
    
    for (const month of MONTHS) {
      const url = `${BASE_URL}/${year}/${month}.json`;
      const outputPath = path.join(yearDir, `${month}.json`);
      
      try {
        console.log(`Downloading ${year}/${month}.json...`);
        const data = await downloadFile(url);
        
        // Parse and format the data to ensure it's valid JSON
        const jsonData = JSON.stringify(JSON.parse(data), null, 2);
        
        await saveFile(jsonData, outputPath);
        console.log(`Successfully downloaded ${year}/${month}.json`);
      } catch (error) {
        console.error(`Error downloading ${year}/${month}.json:`, error.message);
      }
    }
  }
}

// Run the script
fetchPrayerTimes().then(() => {
  console.log('Finished downloading prayer times data');
}).catch((error) => {
  console.error('Error:', error);
  process.exit(1);
}); 