import { readFile, writeFile } from 'fs/promises';
import Critters from 'critters';

const critters = new Critters({
  path: 'dist'
});

const html = await readFile('dist/index.html', 'utf8');
const processed = await critters.process(html);
await writeFile('dist/index.html', processed);

