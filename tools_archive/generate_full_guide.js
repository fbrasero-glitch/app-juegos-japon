const fs = require('fs');
const vm = require('vm');

let content = fs.readFileSync('missions.js', 'utf8');

// Mocking everything needed to execute missions.js in Node
const mockCode = `
const gameState = { kid14: { missions: {} }, kid9: { missions: {} }, both: { missions: {} } };
const currentUser = 'both';
const currentDay = 1;
const currentDayMissions = [];
const TAG_ICONS = {};
function submitMission() {}
function attachCameraFlow() {}
function launchConfetti() {}
function showAlert() {}
function compressImage() {}
function savePhotoToDB() {}
function saveMedia() {}
const window = { 
    addEventListener: () => {}, 
    removeEventListener: () => {}, 
    scrollTo: () => {},
    speechSynthesis: { speak: () => {} }
};
const document = { 
    getElementById: () => ({ 
        addEventListener: () => {}, 
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} },
        style: {},
        getContext: () => ({ drawImage: () => {}, fillRect: () => {}, beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {} }),
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
        dataset: {}
    }), 
    querySelectorAll: () => [],
    createElement: () => ({ 
        addEventListener: () => {}, 
        style: {}, 
        classList: { add: () => {}, remove: () => {} },
        getContext: () => ({})
    })
};
class SpeechSynthesisUtterance {}
`;

try {
    const scriptContent = mockCode + content + '\nmodule.exports = MISSIONS_CONFIG;';
    const missionsConfig = vm.runInNewContext(scriptContent, { 
        module: { exports: {} },
        console: { log: () => {}, error: () => {} },
        require: require,
        Date: Date,
        Math: Math,
        URL: { createObjectURL: () => "" },
        Blob: class {},
        FileReader: class { readAsDataURL() {} },
        MediaRecorder: class { start() {} stop() {} },
        navigator: { mediaDevices: { getUserMedia: () => Promise.resolve() }, geolocation: { watchPosition: () => {} } }
    });

    let output = "# 📜 GUÍA COMPLETA DE MISIONES: PASAPORTE JAPÓN 🇯🇵\n\n";
    output += "Esta guía contiene el itinerario táctico y las misiones interactivas para el viaje a Japón 2026.\n\n";

    const days = {};
    for (const id in missionsConfig) {
        const m = missionsConfig[id];
        if (!days[m.day]) days[m.day] = [];
        days[m.day].push({ id, ...m });
    }

    const sortedDays = Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b));

    sortedDays.forEach(day => {
        output += `## 🗓️ DÍA ${day}\n\n`;
        
        // Sort missions by role to group them
        const dayMissions = days[day].sort((a, b) => {
            const order = { kid9: 1, kid14: 2, both: 3 };
            return order[a.role] - order[b.role];
        });

        dayMissions.forEach(m => {
            const roleMap = { both: "👨‍👩‍👧‍👦 Conjunta", kid9: "🦊 Explorador de 9 (Kid)", kid14: "🐉 Navegante de 14 (Teen)" };
            const role = roleMap[m.role] || m.role;
            const tagIconMap = { 
                photo: '📸', video: '🎬', audio: '🎙️', writing: '✍️',
                expert: '⚡', economy: '💰', sensors: '📡', physical: '🏃',
                game: '🎮', culture: '🏯', mixed: '🔀'
            };
            const tagIcon = tagIconMap[m.tag] || '❓';
            
            output += `### ${tagIcon} ${m.title}\n`;
            output += `- **Rol:** ${role}\n`;
            output += `- **XP:** \`${m.xp} XP\`\n`;
            output += `- **Ubicación:** 📍 ${m.location || 'Varios'}\n`;
            
            let desc = "";
            try {
                if (typeof m.render === 'function') {
                    const html = m.render(m.role);
                    // Extract text from mission-desc paragraphs or just strip tags
                    const pMatch = html.match(/<p class="mission-desc">([\s\S]*?)<\/p>/);
                    if (pMatch) {
                        desc = pMatch[1].replace(/<[^>]+>/g, '').trim();
                    } else {
                        desc = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    }
                }
            } catch (err) {
                desc = "[Error al extraer descripción interactiva]";
            }
            
            if (desc) {
                output += `- **Misión:** ${desc}\n`;
            }
            output += `\n---\n\n`;
        });
    });

    output += "\n---\n**¡BUEN VIAJE Y BUENA SUERTE CON LAS MISIONES!** ⛩️🏯🚅\n";

    fs.writeFileSync('GUIA_MISIONES_COMPLETA.md', output, 'utf8');
    console.log("Guía generada con éxito en 'GUIA_MISIONES_COMPLETA.md'");

} catch (e) {
    console.error("Error al procesar missions.js:", e);
}
