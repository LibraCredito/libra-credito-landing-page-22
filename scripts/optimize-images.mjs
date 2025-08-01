import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const imagesDir = path.resolve(process.cwd(), 'public/images');
const optimizedDir = path.resolve(process.cwd(), 'public/images/optimized');

const imagesToOptimize = [
  { name: 'timelibra2.webp', width: 480 },
  { name: 'media/estadao-logo.png', width: 200 },
  { name: 'logo-header.jpg', width: 150 },
  { name: 'media/g1-logo (1).webp', width: 200 },
  { name: 'video-thumbnail.webp', width: 480 },
  { name: 'media/revide-logo.webp', width: 200 },
];

async function optimizeImages() {
  try {
    await fs.mkdir(optimizedDir, { recursive: true });

    for (const image of imagesToOptimize) {
      const inputPath = path.join(imagesDir, image.name);
      const optimizedName = image.name.replace(/\.(png|jpg|jpeg|webp)$/, '.webp');
      const outputPath = path.join(optimizedDir, optimizedName);

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
