import fs from 'fs';
import path from 'path';

const distDir = path.resolve(import.meta.dirname, './dist');
const distMainJsPath = path.resolve(distDir, 'main.js');
const mainJsContent = fs.readFileSync(distMainJsPath, 'utf8');
const shebang = '#!/usr/bin/env node\n';

if (!mainJsContent.startsWith(shebang)) {
  fs.writeFileSync(distMainJsPath, shebang + mainJsContent);
  console.log('Shebang added');
}

console.log('Setup completed successfully!');
