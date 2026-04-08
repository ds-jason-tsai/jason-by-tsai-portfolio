const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/images/Jason6.jpg');
const outputPath = path.join(__dirname, '../public/images/Jason6.webp');

async function optimizeImage() {
  try {
    if (!fs.existsSync(inputPath)) {
      console.error('Input file does not exist:', inputPath);
      return;
    }

    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log('Successfully optimized image to WebP format.');
    console.log('Output path:', outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    console.log(`Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`Optimized size: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.log(`Reduction: ${(((originalSize - optimizedSize) / originalSize) * 100).toFixed(2)}%`);
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

optimizeImage();
