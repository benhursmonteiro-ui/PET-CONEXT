const fs = require('fs');
let c = fs.readFileSync('public/app.js', 'utf8');
c = c.replace(/value="[^"]*@petconect\.com"/g, 'value=""');
fs.writeFileSync('public/app.js', c);
console.log('Removed hardcoded emails from app.js');
