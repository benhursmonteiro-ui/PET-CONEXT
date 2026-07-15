const fs = require('fs');
const path = './public/app.js';
let content = fs.readFileSync(path, 'utf8');

// Remove seed default reports
content = content.replace(/\/\/ Seed default reports if empty or undefined[\s\S]*?\];\n    \}/g, '');

// Remove seed default stories
content = content.replace(/\/\/ Seed default stories if empty or undefined[\s\S]*?\];\n    \}/g, '');

// Remove seed default comments and saved status in reels
content = content.replace(/\/\/ Seed default comments and saved status if missing in existing reels[\s\S]*?\}\);\n    \}/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Cleaned remaining seeds in app.js');
