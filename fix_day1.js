const fs = require('fs');
let lines = fs.readFileSync('missions.js', 'utf8').split('\n');
function replaceMission(key, newCode) {
    const start = lines.findIndex(l => l.includes(`"${key}"`));
    if (start === -1) { console.log('NOT FOUND: ' + key); return; }
    let end = start, depth = 0;
    for (let i = start; i < lines.length; i++) {
        depth += (lines[i].match(/{/g)||[]).length - (lines[i].match(/}/g)||[]).length;
        if (depth <= 0 && i > start) { end = i; break; }
    }
    lines.splice(start, end - start + 1, ...newCode.split('\n'));
    console.log(`OK ${key}`);
}
replaceMission('day_1_clouds', `    "day_1_clouds": {
        tag: "photo", day: 1, title: "Formas en las Nubes", role: "kid9", xp: 10, location: "Avión",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">☁️ ¡Mira por la ventanilla del avión! Las nubes tienen formas secretas: dragones, castillos, animales... Encuentra la nube más rara y captura la foto antes de que cambie de forma.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(180deg,#87CEEB,#fff); border-radius:15px;">
            <p style="font-size:3rem;">☁️🐉✨</p>
            <p style="color:#4682B4; font-style:italic;">¿Qué esconden las nubes?</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Nube Mágica</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_1_clouds', currentUser, false); }
    },`);
fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
console.log('Done!');
