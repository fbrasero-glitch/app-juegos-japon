// Fix remaining 3 missions: jewel render, fish, compare
const fs = require('fs');
let lines = fs.readFileSync('missions.js', 'utf8').split('\n');

// Helper: replace range of lines
function replaceLines(startLine, endLine, newContent) {
    // startLine/endLine are 1-indexed
    const before = lines.slice(0, startLine - 1);
    const after = lines.slice(endLine);
    lines = [...before, ...newContent.split('\n'), ...after];
}

// 1. Replace day_22_fish (lines 6182-6197)
// Find actual line numbers by content
let fishStart = lines.findIndex(l => l.includes('"day_22_fish"'));
let fishEnd = fishStart;
let depth = 0;
for (let i = fishStart; i < lines.length; i++) {
    depth += (lines[i].match(/{/g)||[]).length - (lines[i].match(/}/g)||[]).length;
    if (depth <= 0 && i > fishStart) { fishEnd = i; break; }
}
console.log(`fish: ${fishStart+1} to ${fishEnd+1}`);

const newFish = `    "day_22_fish": {
        tag: "economy",
        day: 22,
        title: "Logística del Pescado",
        role: "kid14",
        xp: 15,
        location: "Toyosu",
        correctAnswer: "Instalaciones modernas, mejor cadena de frío, higiene, más espacio",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> INFORME LOGÍSTICO REQUERIDO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:10px;">El mercado mayorista de pescado más grande del mundo se trasladó de Tsukiji a Toyosu en 2018. Estás pisando las nuevas instalaciones.</p>
            <div style="background:#0a0a0a; border-left:3px solid #0f0; padding:10px; margin:10px 0; border-radius:0 6px 6px 0;">
                <p style="color:#888; font-size:0.85rem;">📋 MISIÓN: Analiza el entorno. ¿Por qué crees que movieron el mercado? Busca pistas visuales: la limpieza, el tamaño, la tecnología...</p>
            </div>
            <textarea id="f-ans" placeholder=">>> Escribe tu análisis aquí..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px; font-family:monospace;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">📤 Transmitir Informe</button>
        </div>
    \`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('f-ans').value;
            if(val.length < 15) { showAlert('Incompleto', 'Tu análisis necesita más detalle. Mínimo 2-3 razones.'); return; }
            submitMission('day_22_fish', {type:'text', data:val});
        }); }
    },`;
lines.splice(fishStart, fishEnd - fishStart + 1, ...newFish.split('\n'));

// Re-find compare after splice
let compStart = lines.findIndex(l => l.includes('"day_22_compare"'));
let compEnd = compStart;
depth = 0;
for (let i = compStart; i < lines.length; i++) {
    depth += (lines[i].match(/{/g)||[]).length - (lines[i].match(/}/g)||[]).length;
    if (depth <= 0 && i > compStart) { compEnd = i; break; }
}
console.log(`compare: ${compStart+1} to ${compEnd+1}`);

const newCompare = `    "day_22_compare": {
        tag: "economy",
        day: 22,
        title: "Altura Relativa",
        role: "kid14",
        xp: 15,
        location: "Torre de Tokio",
        correctAnswer: "Aprox. 1.9 (redondeando: 2)",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> ANÁLISIS COMPARATIVO DE ESTRUCTURAS</p>
            <div style="display:flex; justify-content:center; align-items:flex-end; gap:30px; margin:20px 0; height:180px;">
                <div style="text-align:center;">
                    <div style="width:20px; height:120px; background:linear-gradient(180deg,#ff6b35,#ff4500); margin:0 auto; border-radius:4px 4px 0 0; box-shadow:0 0 10px rgba(255,69,0,0.3);"></div>
                    <p style="color:#ff6b35; font-size:0.8rem; margin-top:5px;">Torre Tokio</p>
                    <p style="color:#ff6b35; font-weight:bold;">332.9m</p>
                </div>
                <div style="text-align:center;">
                    <div style="width:14px; height:170px; background:linear-gradient(180deg,#60efff,#00b4d8); margin:0 auto; border-radius:4px 4px 0 0; box-shadow:0 0 10px rgba(96,239,255,0.3);"></div>
                    <p style="color:#60efff; font-size:0.8rem; margin-top:5px;">Skytree</p>
                    <p style="color:#60efff; font-weight:bold;">634m</p>
                </div>
            </div>
            <p style="color:#0a0; font-size:0.9rem; margin-bottom:10px;">¿Cuántas Torres de Tokio necesitarías apilar para igualar la Skytree?</p>
            <input type="number" id="c-ans" step="0.1" placeholder=">>> Respuesta..." style="width:100%; margin-bottom:10px; background:#111; color:#0f0; border:1px solid #0f03; padding:12px; border-radius:6px; font-size:1.2rem; text-align:center;">
            <div id="c-res" style="color:#ff0; text-align:center; min-height:20px; margin-bottom:10px;"></div>
            <button id="btn" class="btn-primary" style="width:100%">⚡ Verificar Cálculo</button>
        </div>
    \`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => {
                const val = parseFloat(document.getElementById('c-ans').value);
                if(!val) { showAlert('Error', 'Introduce un número.'); return; }
                const correct = 634/332.9;
                const diff = Math.abs(val - correct);
                if(diff < 0.3) {
                    document.getElementById('c-res').innerText = '>>> CÁLCULO CORRECTO. Resultado: ' + correct.toFixed(2);
                    document.getElementById('c-res').style.color = '#0f0';
                    setTimeout(() => submitMission('day_22_compare', {type:'number', data:val}), 1000);
                } else {
                    document.getElementById('c-res').innerText = '>>> ERROR. Revisa: 634 ÷ 332.9 = ?';
                    document.getElementById('c-res').style.color = '#f00';
                }
            });
        }
    },`;
lines.splice(compStart, compEnd - compStart + 1, ...newCompare.split('\n'));

// Now fix jewel render (just the render part, lines ~6123-6133)
let jewelStart = lines.findIndex(l => l.includes('"day_22_jewel"'));
// Find the render line
let jewelRenderStart = -1;
for (let i = jewelStart; i < jewelStart + 15; i++) {
    if (lines[i].includes('render:')) { jewelRenderStart = i; break; }
}
// Find the end of render (line with just "`,")
let jewelRenderEnd = -1;
for (let i = jewelRenderStart + 1; i < jewelRenderStart + 20; i++) {
    if (lines[i].trim().startsWith('`,') || lines[i].trim() === '`,') { jewelRenderEnd = i; break; }
}
console.log(`jewel render: ${jewelRenderStart+1} to ${jewelRenderEnd+1}`);

const newJewelRender = `        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0; margin-bottom:5px;">>>> ESCÁNER DE MERCADO ACTIVO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Objetivo: localizar el artículo más absurdamente caro en los escaparates de Ginza. Calcular cuántos años de tu paga necesitarías.</p>
            <label style="color:#0f0; font-size:0.8rem;">ARTÍCULO IDENTIFICADO:</label>
            <input type="text" id="j-item" placeholder="Ej: Reloj Rolex Submariner..." style="width:100%; margin-bottom:10px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <label style="color:#0f0; font-size:0.8rem;">PRECIO DETECTADO (¥):</label>
            <input type="number" id="j-price" placeholder="Ej: 2500000" style="width:100%; margin-bottom:10px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <label style="color:#0f0; font-size:0.8rem;">TU PAGA MENSUAL (€):</label>
            <input type="number" id="j-allow" placeholder="Ej: 30" style="width:100%; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">⚡ Ejecutar Análisis Financiero</button>
            <div id="j-res" style="color:#ff0; margin-bottom:15px; font-weight:bold; font-size:1.1rem; text-align:center; min-height:24px;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">📤 Transmitir Informe</button>
        </div>
    \`,`;
lines.splice(jewelRenderStart, jewelRenderEnd - jewelRenderStart + 1, ...newJewelRender.split('\n'));

fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
console.log('Day 22 remaining fixes applied!');
