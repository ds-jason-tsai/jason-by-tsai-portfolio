const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, 'public', 'images');

const imagesToOptimize = [
  'Jason6.jpg',
  'aflac_mockup.png',
  'chartbar_mockup.png',
  'milkshop_cover.png',
  'bike_share_cover.png',
  'aflac_cover.png'
];

async function optimizeImages() {
  for (const imgName of imagesToOptimize) {
    const inputPath = path.join(imagesDir, imgName);
    if (!fs.existsSync(inputPath)) continue;

    const ext = path.extname(imgName).toLowerCase();
    const outputPath = path.join(imagesDir, `${path.basename(imgName, ext)}_opt${ext}`);

    let pipeline = sharp(inputPath).resize({ width: 1500, withoutEnlargement: true });

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ palette: true, quality: 80 });
    }

    try {
      const info = await pipeline.toFile(outputPath);
      const originalSize = fs.statSync(inputPath).size;
      console.log(`Optimized ${imgName}: ${originalSize} -> ${info.size} bytes (${((1 - info.size / originalSize) * 100).toFixed(2)}% reduction)`);
      // Update original
      fs.renameSync(outputPath, inputPath);
      console.log(`  Replaced original ${imgName}`);
    } catch (err) {
      console.error(`  Error optimizing ${imgName}:`, err);
    }
  }
}

optimizeImages();
