const fs = require('fs');

// Simple parser for missions.js content
// Instead of VM (which might fail if there are browser globals), we'll use a mix of regex and string manipulation if needed,
// but let's try the VM approach first by stripping things that might break it.

let content = fs.readFileSync('missions.js', 'utf8');

// Mocking things that might be in missions.js but not in Node
const mockCode = `
const gameState = { kid14: { missions: {} }, kid9: { missions: {} }, both: { missions: {} } };
const currentUser = 'both';
const TAG_ICONS = {};
function submitMission() {}
function attachCameraFlow() {}
function launchConfetti() {}
function Persistence() {}
Persistence.setItem = () => {};
const window = { addEventListener: () => {}, removeEventListener: () => {}, scrollTo: () => {} };
const document = { getElementById: () => ({ addEventListener: () => {} }), querySelectorAll: () => [] };
`;

// We want to extract MISSIONS_CONFIG. 
// It's a bit tricky because missions.js is a script, not just a JSON.
// Let's try to isolate the MISSIONS_CONFIG object.

try {
    const vm = require('vm');
    const scriptContent = mockCode + content + '\nmodule.exports = MISSIONS_CONFIG;';
    const missionsConfig = vm.runInNewContext(scriptContent, { 
        module: { exports: {} },
        console: console,
        require: require
    });

    let output = "📜 GUÍA DE MISIONES: PASAPORTE JAPÓN 📜\n";
    output += "========================================\n\n";
    output += "Esta guía contiene todas las misiones que deberéis completar durante vuestro épico viaje por Japón.\n";
    output += "Cada misión os otorgará Puntos de Experiencia (XP) para subir de nivel en vuestro pasaporte digital.\n\n";

    const days = {};
    for (const id in missionsConfig) {
        const m = missionsConfig[id];
        if (!days[m.day]) days[m.day] = [];
        days[m.day].push(m);
    }

    const sortedDays = Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b));

    sortedDays.forEach(day => {
        output += `--- DÍA ${day} ---\n`;
        days[day].forEach(m => {
            const roleMap = { both: "Ambos", kid9: "Niño 9 años", kid14: "Niño 14 años" };
            const role = roleMap[m.role] || m.role;
            const expertTag = m.tag === 'expert' ? ' ⚡ EXPERTO' : '';
            
            output += `📍 ${m.location || 'Varios'} | 🏆 ${m.title} (${m.xp} XP) | 👤 ${role}${expertTag}\n`;
            
            let desc = "";
            if (typeof m.render === 'function') {
                const html = m.render();
                // Extract text from <p class="mission-desc">...</p>
                const match = html.match(/<p class="mission-desc">([\s\S]*?)<\/p>/);
                if (match) {
                    desc = match[1].replace(/<[^>]+>/g, '').trim();
                } else {
                    // Fallback: strip all html
                    desc = html.replace(/<[^>]+>/g, '').trim();
                }
            } else if (typeof m.render === 'string') {
                 desc = m.render.replace(/<[^>]+>/g, '').trim();
            }
            
            if (desc) {
                output += `📝 ${desc}\n`;
            }
            output += "\n";
        });
    });

    output += "========================================\n";
    output += "¡SUERTE EN TU MISIÓN, VIAJERO! ⛩️🏯🚅\n";

    fs.writeFileSync('📜 Guía de Misiones Pasaporte Japón.txt', output, 'utf8');
    console.log("Guía generada con éxito en '📜 Guía de Misiones Pasaporte Japón.txt'");

} catch (e) {
    console.error("Error al procesar missions.js:", e);
}
