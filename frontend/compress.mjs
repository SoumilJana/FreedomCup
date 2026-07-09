import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = './public/teamlogo';

async function compress() {
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      const filePath = path.join(dir, file);
      const tempPath = path.join(dir, 'temp_' + file);
      
      console.log('Compressing', file);
      await sharp(filePath)
        .resize(256, 256, { fit: 'inside' })
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(tempPath);
        
      await fs.rename(tempPath, filePath);
      console.log('Finished', file);
    }
  }
}

compress().catch(console.error);
