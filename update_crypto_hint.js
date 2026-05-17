const fs = require('fs');
let content = fs.readFileSync('missions.js', 'utf8');

// We want to add a hint inside day_10_kid14_crypto
const target = `<p class="mission-desc">>>> PROTOCOLO DE ENLACE CIFRADO. Base: HOTEL. Introduzca clave de acceso.</p>`;
const replacement = `<p class="mission-desc">>>> PROTOCOLO DE ENLACE CIFRADO. Base: HOTEL. Introduzca clave de acceso.<br><span style="color: #0c0; font-size: 0.85rem;">[Pista de Red: Nombre de la ciudad del hotel + "_ANNEX" en mayúsculas]</span></p>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('missions.js', content, 'utf8');
    console.log('Successfully updated missions.js with hint!');
} else {
    console.log('Target string not found in missions.js');
}
