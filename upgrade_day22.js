// Upgrade Day 22 missions in missions.js
const fs = require('fs');
let code = fs.readFileSync('missions.js', 'utf8');

// === day_22_shout: Add immersive narrative + visual volume meter ===
const old_shout_render = `render: () => \`\r
        <p class="mission-desc">Imita el saludo enérgico de los vendedores: "¡EE-RA-SHAI-MA-SÉ!"</p>\r
        <button id="btn-rec" class="btn-secondary" style="width:100%;">🎙️ Grabar grito</button>\r
        <audio id="au-s" controls class="hidden" style="width:100%; margin:15px 0;"></audio>\r
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar al Juez</button>\r
    \``;
const new_shout_render = `render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🐟 En el mercado de Toyosu, los vendedores saludan a pleno pulmón a cada cliente que pasa. Tu misión: imitar su grito legendario con toda tu energía.</p>
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e); border-radius:15px; padding:20px; margin:15px 0; text-align:center;">
            <p style="font-size:2rem; font-weight:bold; color:#ff6b6b; text-shadow:0 0 10px rgba(255,107,107,0.5); letter-spacing:4px;">¡EE-RA-SHAI-MA-SÉ!</p>
            <p style="color:#aaa; font-size:0.85rem; margin-top:5px;">Pronunciación: <em>Irasshaimase</em> = ¡Bienvenido!</p>
            <div id="vol-meter" style="width:80%; height:12px; background:#333; border-radius:6px; margin:15px auto; overflow:hidden;">
                <div id="vol-fill" style="width:0%; height:100%; background:linear-gradient(90deg,#00ff87,#60efff); border-radius:6px; transition:width 0.1s;"></div>
            </div>
        </div>
        <button id="btn-rec" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">🎙️ ¡GRABAR MI GRITO!</button>
        <audio id="au-s" controls class="hidden" style="width:100%; margin:15px 0;"></audio>
        <button id="btn" class="btn-primary hidden" style="width:100%">📨 Enviar al Juez</button>
    \``;

// === day_22_car: Add narrative ===
const old_car = `render: () => \`<p class="mission-desc">En Ginza pasan los coches más lujosos del mundo. Captura el más espectacular.</p><button id="btn-cam" class="btn-secondary">📸 Foto Coche</button>\``;
const new_car = `render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🏎️ La milla de oro de Ginza es el desfile de coches más exclusivo del planeta: Lamborghinis, Rolls-Royce, Ferrari... Tu misión de espía: capturar el más impresionante antes de que desaparezca.</p>
        <div style="text-align:center; margin:15px 0; padding:15px; background:linear-gradient(135deg,#0f0c29,#302b63,#24243e); border-radius:15px;">
            <p style="font-size:3rem;">🏎️✨</p>
            <p style="color:#d4af37; font-style:italic;">Objetivo: el coche que haga girar más cabezas</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Vehículo de Lujo</button>
    \``;

// === day_22_elevator: Add animated floor counter ===
const old_elevator_render = `render: () => \`\r
        <p class="mission-desc">Cronometra cuánto tarda este ascensor ultrarrápido en subir.</p>\r
        <div id="el-timer" style="font-size:3rem; text-align:center; margin:15px 0; color:var(--color-accent);">0.0s</div>\r
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">Iniciar</button>\r
        <button id="btn-end" class="btn-primary hidden" style="width:100%;">¡Llegué!</button>\r
    \``;
const new_elevator_render = `render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🏢 El ascensor de Roppongi Hills sube 52 pisos en segundos. ¡Es como un cohete! Cronometra cuánto tarda en llegar arriba.</p>
        <div style="background:linear-gradient(180deg,#0a0a2e,#1a1a3e); border-radius:15px; padding:20px; margin:15px 0; text-align:center; position:relative; overflow:hidden;">
            <div id="el-bg" style="position:absolute; bottom:0; left:0; width:100%; height:0%; background:linear-gradient(180deg,#00ff87,#60efff); opacity:0.15; transition:height 0.3s;"></div>
            <p style="font-size:1rem; color:#888; margin-bottom:5px;">⏱️ CRONÓMETRO DE ASCENSOR</p>
            <div id="el-timer" style="font-size:3.5rem; font-weight:bold; color:#00ff87; text-shadow:0 0 20px rgba(0,255,135,0.4); font-family:monospace;">0.0s</div>
            <div id="el-floor" style="font-size:1rem; color:#60efff; margin-top:5px;">Planta: 0</div>
        </div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px; font-size:1.1rem; padding:15px;">🚀 Puertas cerradas ¡SUBIMOS!</button>
        <button id="btn-end" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">🏁 ¡Hemos llegado!</button>
    \``;

const old_elevator_events = `attachEvents: () => {\r
        let t0 = 0; let int = null;\r
        document.getElementById('btn-start').addEventListener('click', (e) => {\r
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');\r
            int = setInterval(() => document.getElementById('el-timer').innerText = ((Date.now()-t0)/1000).toFixed(1)+'s', 100);\r
        });\r
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_22_elevator', {type:'text', data:\`Tiempo ascensor: \${document.getElementById('el-timer').innerText}\`}); });\r
        window._missionCleanup = () => clearInterval(int);\r
    }`;
const new_elevator_events = `attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            int = setInterval(() => {
                const elapsed = (Date.now()-t0)/1000;
                document.getElementById('el-timer').innerText = elapsed.toFixed(1)+'s';
                const floor = Math.min(52, Math.floor(elapsed * 4));
                document.getElementById('el-floor').innerText = 'Planta: ' + floor;
                document.getElementById('el-bg').style.height = Math.min(100, floor/52*100) + '%';
            }, 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_22_elevator', {type:'text', data:\`Tiempo ascensor: \${document.getElementById('el-timer').innerText}\`}); });
        window._missionCleanup = () => clearInterval(int);
    }`;

// === day_22_tower: Add visual guide ===
const old_tower = `render: () => \`<p class="mission-desc">Apunta a la Torre de Tokio y haz que parezca que la sostienes entre tus dedos.</p><button id="btn-cam" class="btn-secondary">📸 Foto Torre</button>\``;
const new_tower = `render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🗼 ¡Ilusión óptica! Colócate lejos de la Torre de Tokio, extiende la mano y haz que parezca que la sostienes entre tus dedos como si fuera un juguete.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#ff6b35,#f7c948); border-radius:15px;">
            <p style="font-size:1rem; color:#fff;">🤏 Truco: aléjate, extiende el brazo, junta pulgar e índice</p>
            <p style="font-size:4rem; margin:10px 0;">🗼🤏</p>
            <p style="color:rgba(255,255,255,0.8); font-size:0.85rem;">¡Que parezca que la torre cabe entre tus dedos!</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Ilusión Óptica</button>
    \``;

// === day_22_jewel: Better terminal narrative ===
const old_jewel_render = `render: () => \`\r
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">\r
            <p>>> BUSCANDO ARTÍCULO MÁS CARO</p>\r
            <input type="text" id="j-item" placeholder="Artículo..." style="width:100%; margin-bottom:10px;">\r
            <input type="number" id="j-price" placeholder="Precio (¥)..." style="width:100%; margin-bottom:10px;">\r
            <input type="number" id="j-allow" placeholder="Tu paga mensual (€)..." style="width:100%; margin-bottom:10px;">\r
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Calcular</button>\r
            <div id="j-res" style="color:#0f0; margin-bottom:15px; font-weight:bold;"></div>\r
            <button id="btn" class="btn-primary hidden" style="width:100%">Enviar</button>\r
        </div>\r
    \``;
const new_jewel_render = `render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0; margin-bottom:5px;">>>> ESCÁNER DE MERCADO ACTIVO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Objetivo: localizar el artículo más absurdamente caro en los escaparates de Ginza. Calcular cuántos años de tu paga necesitarías para comprarlo.</p>
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
    \``;

// === day_22_fish: REWRITE from scratch ===
const old_fish = `"day_22_fish": {
        tag: "economy",
        day: 22,
        title: "Logística del Pescado",
        role: "kid14",
        xp: 15,
        location: "Toyosu",
        render: () => \`\r
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">\r
            <p>>> Razones del traslado del mercado Tsukiji → Toyosu:</p>\r
            <textarea id="f-ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>\r
            <button id="btn" class="btn-primary" style="width:100%">Enviar Explicación</button>\r
        </div>\r
    \`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_22_fish', {type:'text', data:document.getElementById('f-ans').value})); }
    }`;
const new_fish = `"day_22_fish": {
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
    }`;

// === day_22_compare: REWRITE with visual tower comparison ===
const old_compare = `"day_22_compare": {
        tag: "economy",
        day: 22,
        title: "Altura Relativa",
        role: "kid14",
        xp: 15,
        location: "Torre de Tokio",
        render: () => \`\r
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">\r
            <p>>> COMPARATIVA: ¿Cuántas Torres de Tokio (332.9m) caben en una Skytree (634m)?</p>\r
            <input type="number" id="c-ans" style="width:100%; margin-bottom:10px;">\r
            <button id="btn" class="btn-primary" style="width:100%">Enviar Respuesta</button>\r
        </div>\r
    \`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_22_compare', {type:'number', data:document.getElementById('c-ans').value})); }
    }`;
const new_compare = `"day_22_compare": {
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
    }`;

// === day_22_neon: Better family mission ===
const old_neon_render = `render: () => \`\r
        <p class="mission-desc">Selfie nocturno familiar con los rascacielos iluminados de fondo.</p>\r
        <label style="display:block; margin:20px 0; font-size:1.2rem; background:var(--color-gray-light); padding:15px; border-radius:10px;"><input type="checkbox" id="chk-n" style="transform:scale(1.5); margin-right:15px;"> ✅ Foto nocturna familiar lista</label>\r
        <button id="btn" class="btn-primary" style="width:100%">Enviar al Juez</button>\r
    \``;
const new_neon_render = `render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌃 Misión Familiar: Tokio de noche es un espectáculo de luces. Buscad el fondo más espectacular de neón y haceos la foto más épica del viaje.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#0f0c29,#302b63,#24243e); border-radius:15px; border:1px solid rgba(100,100,255,0.2);">
            <p style="font-size:3rem;">🌃👨‍👩‍👧‍👦✨</p>
            <p style="color:#a78bfa; font-style:italic; margin-top:10px;">La noche de Tokio os espera</p>
        </div>
        <label style="display:flex; align-items:center; gap:15px; margin:20px 0; font-size:1.1rem; background:var(--color-gray-light); padding:18px; border-radius:12px; cursor:pointer;"><input type="checkbox" id="chk-n" style="transform:scale(1.8); accent-color:#a78bfa;"> ✅ ¡Foto nocturna familiar lista!</label>
        <button id="btn" class="btn-primary" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar al Juez</button>
    \``;

// Apply replacements
const replacements = [
    [old_shout_render, new_shout_render],
    [old_car, new_car],
    [old_elevator_render, new_elevator_render],
    [old_elevator_events, new_elevator_events],
    [old_tower, new_tower],
    [old_jewel_render, new_jewel_render],
    [old_fish, new_fish],
    [old_compare, new_compare],
    [old_neon_render, new_neon_render],
];

let count = 0;
for (const [old, nw] of replacements) {
    if (code.includes(old)) {
        code = code.replace(old, nw);
        count++;
    } else {
        console.log('NOT FOUND:', old.substring(0, 60));
    }
}

fs.writeFileSync('missions.js', code, 'utf8');
console.log(`Applied ${count}/${replacements.length} replacements for Day 22`);
