const sharp = require('sharp');
const path = require('path');

const imgPath = path.join(__dirname, 'public', 'images', 'Jason6.jpg');

sharp(imgPath)
  .metadata()
  .then(metadata => {
    console.log('Dimensions:', metadata.width, 'x', metadata.height);
    console.log('Format:', metadata.format);
    console.log('Size:', metadata.size);
  })
  .catch(err => {
    console.error('Error:', err);
  });
