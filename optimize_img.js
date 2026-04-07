const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'public', 'images', 'Jason6.jpg');
const outputPath = path.join(__dirname, 'public', 'images', 'Jason6_optimized.jpg');

sharp(inputPath)
  .resize(1200) // Resize to 1200px width (height proportional)
  .jpeg({ quality: 85, mozjpeg: true }) // High quality compression
  .toFile(outputPath)
  .then(info => {
    console.log('Image optimized:', info);
    console.log('Original size: 8,361,694 bytes');
    console.log('New size:', info.size, 'bytes');
  })
  .catch(err => {
    console.error('Error:', err);
  });
