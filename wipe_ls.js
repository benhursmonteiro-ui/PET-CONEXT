const fs = require('fs');
let c = fs.readFileSync('public/app.js', 'utf8');
c = "localStorage.removeItem('conexaopet_state');\n" + c;
fs.writeFileSync('public/app.js', c);
console.log('Added localStorage reset to app.js');
