const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, '..', 'src', 'renderer');
const dest = path.join(__dirname, '..', 'docs');

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
fs.writeFileSync(path.join(dest, '.nojekyll'), '');

console.log('docs/ siap:', fs.readdirSync(dest).length, 'item');