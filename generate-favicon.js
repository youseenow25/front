// generate-favicon.js - Run this to create proper favicon sizes
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  const sourceImage = 'public/hublogo.png';
  
  if (!fs.existsSync(sourceImage)) {
    console.error('Source image not found at public/hublogo.png');
    return;
  }

  const sizes = [
    { name: 'favicon.ico', size: 32 },
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  for (const icon of sizes) {
    try {
      if (icon.name === 'favicon.ico') {
        // Generate ICO file (simplified - you might need online converter)
        await sharp(sourceImage)
          .resize(icon.size, icon.size)
          .png()
          .toFile(`public/${icon.name.replace('.ico', '.png')}`);
        console.log(`Generated: public/${icon.name.replace('.ico', '.png')}`);
        console.log('Convert this PNG to ICO using: https://favicon.io/favicon-converter/');
      } else {
        await sharp(sourceImage)
          .resize(icon.size, icon.size)
          .png()
          .toFile(`public/${icon.name}`);
        console.log(`Generated: public/${icon.name}`);
      }
    } catch (error) {
      console.error(`Error generating ${icon.name}:`, error);
    }
  }
}

generateFavicon();



