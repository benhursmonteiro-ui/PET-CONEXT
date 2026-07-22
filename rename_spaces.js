const fs = require('fs');
const filesToUpdate = ['public/app.js', 'public/index.html', 'server.js'];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Pet Connect/gi, 'Conexão Pet');
    content = content.replace(/conexção pet/gi, 'Conexão Pet'); // just in case they typed it somewhere
    fs.writeFileSync(file, content, 'utf8');
});
