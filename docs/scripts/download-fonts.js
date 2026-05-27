const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

const FONTS_DIR = path.join(__dirname, '../static/fonts');

const fonts = [
  {
    name: 'Domine-VariableFont_wght.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/domine/Domine%5Bwght%5D.ttf',
  },
  {
    name: 'PlusJakartaSans-VariableFont_wght.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf',
  },
];

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirect
          download(response.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download ${url}: status code ${response.statusCode}`,
            ),
          );
          return;
        }
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      })
      .on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function main() {
  console.log('Downloading fonts from Google Fonts...');
  for (const font of fonts) {
    const dest = path.join(FONTS_DIR, font.name);
    console.log(`Downloading ${font.name}...`);
    try {
      await download(font.url, dest);
      console.log(`Successfully downloaded ${font.name}`);
    } catch (err) {
      console.error(`Failed to download ${font.name}:`, err);
      process.exit(1);
    }
  }
  console.log('All fonts downloaded successfully!');
}

main();
