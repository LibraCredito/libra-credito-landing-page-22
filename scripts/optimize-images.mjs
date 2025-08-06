import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const imagesDir = path.resolve(process.cwd(), 'public/images');

const imagesToOptimize = [
  { name: 'timelibra2.webp', width: 480 },
  { name: 'media/time-libra.webp', width: 480 },
  { name: 'media/estadao-logo.png', width: 200 },
  { name: 'logo-header.webp', width: 150 },
  // Updated G1 logo path
  { name: 'media/G1-logo-1.png', width: 200 },
  { name: 'video-thumbnail.webp', width: 480 },
  { name: 'media/revide-logo.webp', width: 200 },
];

async function optimizeImages() {
  try {
    for (const image of imagesToOptimize) {
      const inputPath = path.join(imagesDir, image.name);
      const optimizedName = image.name.replace(/\.(png|jpg|jpeg|webp)$/, '.webp');
      const outputPath = path.join(imagesDir, optimizedName);

      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      await sharp(inputPath)
        .resize({ width: image.width })
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`Optimized ${image.name} to ${outputPath}`);
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
