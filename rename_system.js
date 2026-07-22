const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'public/app.js',
    'public/index.html',
    'server.js',
    'database.json',
    'package.json'
];

filesToUpdate.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Substituir as variações de PetConnect por Conexão Pet
        // Evitamos alterar o Firebase config verificando se não está seguido de -app
        
        // PetConnect -> Conexão Pet
        content = content.replace(/PetConnect/g, 'Conexão Pet');
        
        // petconnect (se não for firebase petconnect-app) -> conexão pet
        // Utilizamos um lookahead negativo para ignorar -app
        content = content.replace(/petconnect(?!-app|\.com)/gi, match => {
            if (match === 'petconnect') return 'conexão pet';
            if (match === 'Petconnect') return 'Conexão pet';
            return 'Conexão Pet';
        });

        // petconect -> conexão pet
        content = content.replace(/petconect(?!-app|\.com)/gi, match => {
            if (match === 'petconect') return 'conexão pet';
            if (match === 'Petconect') return 'Conexão pet';
            return 'Conexão Pet';
        });
        
        // pet conext -> conexão pet
        content = content.replace(/pet conext/gi, match => {
            if (match === 'pet conext') return 'conexão pet';
            if (match === 'Pet Conext') return 'Conexão Pet';
            return 'Conexão Pet';
        });

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    } catch (err) {
        console.log(`Could not update ${file}: ${err.message}`);
    }
});
