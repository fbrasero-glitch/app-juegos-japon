// Upgrade Day 23 missions
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
    console.log(`Replaced ${key} (was lines ${start+1}-${end+1})`);
}

// === day_23_kitkat: Add immersive treasure hunt narrative ===
replaceMission('day_23_kitkat', `    "day_23_kitkat": {
        tag: "economy",
        day: 23,
        title: "Buscador de KitKat",
        role: "kid9",
        xp: 15,
        location: "Don Quijote",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🍫 ¡Misión de reconocimiento en Don Quijote! Japón tiene sabores de KitKat que no existen en ningún otro país del mundo. Explora las estanterías y marca cada sabor raro que encuentres.</p>
        <div style="background:linear-gradient(135deg,#8B0000,#cc0000); border-radius:15px; padding:15px; margin:15px 0;">
            <p style="color:#fff; text-align:center; font-weight:bold; margin-bottom:10px;">🔍 Sabores Detectados (mínimo 3)</p>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <label style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.15); padding:12px; border-radius:10px; color:#fff; font-size:1.05rem; cursor:pointer;"><input type="checkbox" class="k-chk" value="Matcha" style="transform:scale(1.5); accent-color:#4ade80;"> 🍵 Matcha (Té Verde)</label>
                <label style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.15); padding:12px; border-radius:10px; color:#fff; font-size:1.05rem; cursor:pointer;"><input type="checkbox" class="k-chk" value="Sake" style="transform:scale(1.5); accent-color:#4ade80;"> 🍶 Sake (Licor de Arroz)</label>
                <label style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.15); padding:12px; border-radius:10px; color:#fff; font-size:1.05rem; cursor:pointer;"><input type="checkbox" class="k-chk" value="Fresa" style="transform:scale(1.5); accent-color:#4ade80;"> 🍓 Fresa (Ichigo)</label>
                <label style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.15); padding:12px; border-radius:10px; color:#fff; font-size:1.05rem; cursor:pointer;"><input type="checkbox" class="k-chk" value="Wasabi" style="transform:scale(1.5); accent-color:#4ade80;"> 🔥 Wasabi (¡Picante!)</label>
                <label style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.15); padding:12px; border-radius:10px; color:#fff; font-size:1.05rem; cursor:pointer;"><input type="checkbox" class="k-chk" value="Melón" style="transform:scale(1.5); accent-color:#4ade80;"> 🍈 Melón (Yūbari)</label>
            </div>
            <div id="k-count" style="text-align:center; color:#ffd700; font-weight:bold; margin-top:10px;">Encontrados: 0/5</div>
        </div>
        <button id="btn" class="btn-primary" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar Informe de Sabores</button>
    \`,
        attachEvents: () => {
        document.querySelectorAll('.k-chk').forEach(cb => {
            cb.addEventListener('change', () => {
                const count = document.querySelectorAll('.k-chk:checked').length;
                document.getElementById('k-count').innerText = 'Encontrados: ' + count + '/5';
                document.getElementById('k-count').style.color = count >= 3 ? '#4ade80' : '#ffd700';
            });
        });
        document.getElementById('btn').addEventListener('click', () => {
            const checked = Array.from(document.querySelectorAll('.k-chk:checked')).map(cb => cb.value);
            if(checked.length >= 3) submitMission('day_23_kitkat', {type:'text', data:\`KitKats: \${checked.join(', ')}\`});
            else showAlert('¡Sigue buscando!', 'Necesitas encontrar al menos 3 sabores raros.');
        });
    }
    },`);

// === day_23_mascot: Add emotional farewell narrative ===
replaceMission('day_23_mascot', `    "day_23_mascot": {
        tag: "photo",
        day: 23,
        title: "Mascotas de Viaje",
        role: "kid9",
        xp: 15,
        location: "Hotel",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🧸 Tu compañero de viaje favorito (peluche, llavero o juguete) ha estado contigo en TODA la aventura. Antes de volver a casa, hazle un retrato de despedida de Japón. ¡Se lo merece!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#ffecd2,#fcb69f); border-radius:15px;">
            <p style="font-size:4rem;">🧸✨🗾</p>
            <p style="color:#8B4513; font-style:italic; margin-top:10px;">Gracias por acompañarme, pequeño viajero</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Retrato de Despedida</button>
    \`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_23_mascot', currentUser, false); }
    },`);

// === day_23_tetris: REWRITE with proper grid puzzle ===
replaceMission('day_23_tetris', `    "day_23_tetris": {
        tag: "expert",
        day: 23,
        title: "Tetris de Maletas",
        role: "kid14",
        xp: 25,
        location: "Hotel",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> SISTEMA DE OPTIMIZACIÓN DE EQUIPAJE v2.0</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Gira cada pieza hasta que todas encajen en posición vertical. Las piezas correctas brillarán en verde.</p>
            <div style="display:flex; justify-content:space-around; align-items:center; padding:20px; background:linear-gradient(180deg,#0a0a1a,#1a1a2e); border-radius:12px; margin:15px 0; min-height:200px; border:1px solid #0f02;">
                <div style="text-align:center;">
                    <p style="color:#0f0; font-size:0.75rem; margin-bottom:8px;">CAMISA</p>
                    <div id="pt1" style="width:35px; height:70px; background:linear-gradient(135deg,#00ffff,#0088aa); margin:0 auto 12px; border-radius:4px; transition:all 0.4s cubic-bezier(.4,0,.2,1); transform:rotate(90deg); box-shadow:0 0 10px rgba(0,255,255,0.3);"></div>
                    <button class="btn-secondary btn-rot" data-target="pt1" data-val="90" style="font-size:0.9rem; padding:8px 16px;">Girar 🔄</button>
                </div>
                <div style="text-align:center;">
                    <p style="color:#0f0; font-size:0.75rem; margin-bottom:8px;">PANTALÓN</p>
                    <div id="pt2" style="width:55px; height:35px; background:linear-gradient(135deg,#ff00ff,#aa0088); margin:0 auto 12px; border-radius:4px; transition:all 0.4s cubic-bezier(.4,0,.2,1); transform:rotate(180deg); box-shadow:0 0 10px rgba(255,0,255,0.3);"></div>
                    <button class="btn-secondary btn-rot" data-target="pt2" data-val="180" style="font-size:0.9rem; padding:8px 16px;">Girar 🔄</button>
                </div>
                <div style="text-align:center;">
                    <p style="color:#0f0; font-size:0.75rem; margin-bottom:8px;">SOUVENIRS</p>
                    <div id="pt3" style="width:40px; height:40px; background:linear-gradient(135deg,#ffff00,#aa8800); margin:0 auto 12px; border-radius:4px; transition:all 0.4s cubic-bezier(.4,0,.2,1); transform:rotate(270deg); box-shadow:0 0 10px rgba(255,255,0,0.3);"></div>
                    <button class="btn-secondary btn-rot" data-target="pt3" data-val="270" style="font-size:0.9rem; padding:8px 16px;">Girar 🔄</button>
                </div>
            </div>
            <div id="tet-status" style="text-align:center; color:#ff0; font-weight:bold; margin-bottom:10px; min-height:20px;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">✅ Empaquetado Perfecto</button>
        </div>
    \`,
        attachEvents: () => {
        const checkWin = () => {
            let p1 = parseInt(document.querySelector('.btn-rot[data-target="pt1"]').dataset.val) % 360;
            let p2 = parseInt(document.querySelector('.btn-rot[data-target="pt2"]').dataset.val) % 360;
            let p3 = parseInt(document.querySelector('.btn-rot[data-target="pt3"]').dataset.val) % 360;
            // Check each piece
            const el1 = document.getElementById('pt1');
            const el2 = document.getElementById('pt2');
            const el3 = document.getElementById('pt3');
            el1.style.boxShadow = (p1===0) ? '0 0 20px #0f0' : '0 0 10px rgba(0,255,255,0.3)';
            el2.style.boxShadow = (p2===0||p2===180) ? '0 0 20px #0f0' : '0 0 10px rgba(255,0,255,0.3)';
            el3.style.boxShadow = '0 0 20px #0f0'; // square always ok
            if(p1 === 0 && (p2 === 0 || p2 === 180)) {
                document.getElementById('tet-status').innerText = '>>> CONFIGURACIÓN ÓPTIMA DETECTADA';
                document.getElementById('tet-status').style.color = '#0f0';
                document.getElementById('btn').classList.remove('hidden');
            } else {
                document.getElementById('tet-status').innerText = '>>> Ajustando piezas...';
                document.getElementById('tet-status').style.color = '#ff0';
                document.getElementById('btn').classList.add('hidden');
            }
        };
        document.querySelectorAll('.btn-rot').forEach(b => {
            b.addEventListener('click', (e) => {
                const tg = document.getElementById(e.target.dataset.target);
                let val = parseInt(e.target.dataset.val) + 90;
                e.target.dataset.val = val;
                tg.style.transform = \`rotate(\${val}deg)\`;
                checkWin();
            });
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_23_tetris', {type:'game', data:'Equipaje optimizado'}));
    }
    },`);

// === day_23_audit: Better terminal aesthetics ===
replaceMission('day_23_audit', `    "day_23_audit": {
        tag: "economy",
        day: 23,
        title: "Auditoría Final",
        role: "kid14",
        xp: 15,
        location: "Hotel",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> MÓDULO DE AUDITORÍA FINANCIERA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Recopila los últimos 4 tickets de compra del viaje. Introduce cada importe y ejecuta el cálculo total.</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:15px;">
                <div><label style="color:#0f0; font-size:0.75rem;">TICKET #1</label><input type="number" id="a-t1" placeholder="¥..." style="width:100%; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;"></div>
                <div><label style="color:#0f0; font-size:0.75rem;">TICKET #2</label><input type="number" id="a-t2" placeholder="¥..." style="width:100%; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;"></div>
                <div><label style="color:#0f0; font-size:0.75rem;">TICKET #3</label><input type="number" id="a-t3" placeholder="¥..." style="width:100%; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;"></div>
                <div><label style="color:#0f0; font-size:0.75rem;">TICKET #4</label><input type="number" id="a-t4" placeholder="¥..." style="width:100%; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;"></div>
            </div>
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">⚡ Ejecutar Suma</button>
            <div id="a-res" style="color:#ff0; margin-bottom:15px; font-weight:bold; font-size:1.2rem; text-align:center; min-height:24px;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">📤 Transmitir Auditoría</button>
        </div>
    \`,
        attachEvents: () => {
        let tot = 0;
        document.getElementById('btn-calc').addEventListener('click', () => {
            const t1 = Number(document.getElementById('a-t1').value||0);
            const t2 = Number(document.getElementById('a-t2').value||0);
            const t3 = Number(document.getElementById('a-t3').value||0);
            const t4 = Number(document.getElementById('a-t4').value||0);
            tot = t1+t2+t3+t4;
            const eur = (tot/160).toFixed(2);
            document.getElementById('a-res').innerText = \`>>> TOTAL: \${tot}¥ (≈\${eur}€)\`;
            document.getElementById('btn').classList.remove('hidden');
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_23_audit', {type:'number', data:tot}));
    }
    },`);

// === day_23_security: Better narrative ===
replaceMission('day_23_security', `    "day_23_security": {
        tag: "physical",
        day: 23,
        title: "Protocolo de Embarque",
        role: "kid14",
        xp: 15,
        location: "Aeropuerto",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03; text-align:center;">
            <p style="color:#0f0;">>>> CRONÓMETRO DE INFILTRACIÓN</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">¿Cuánto tarda un agente en cruzar el control de seguridad del aeropuerto? Inicia al entrar en la cola y para al recoger tu bandeja.</p>
            <div style="background:#0a0a1a; border-radius:12px; padding:20px; margin:10px 0;">
                <div id="sec-timer" style="font-size:3.5rem; font-weight:bold; color:#00ff87; text-shadow:0 0 20px rgba(0,255,135,0.4); font-family:monospace;">0.0s</div>
                <div id="sec-bar" style="width:100%; height:4px; background:#222; border-radius:2px; margin-top:10px; overflow:hidden;">
                    <div id="sec-fill" style="width:0%; height:100%; background:linear-gradient(90deg,#0f0,#ff0,#f00); transition:width 0.5s;"></div>
                </div>
            </div>
            <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px; font-size:1.1rem; padding:15px;">🚶 Entrar en cola</button>
            <button id="btn-end" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">✅ ¡Control superado!</button>
        </div>
    \`,
        attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            int = setInterval(() => {
                const elapsed = (Date.now()-t0)/1000;
                document.getElementById('sec-timer').innerText = elapsed.toFixed(1)+'s';
                document.getElementById('sec-fill').style.width = Math.min(100, elapsed/300*100) + '%';
            }, 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_23_security', {type:'text', data:\`Control de seguridad: \${document.getElementById('sec-timer').innerText}\`}); });
        window._missionCleanup = () => clearInterval(int);
    }
    },`);

// === day_23_weight: REWRITE with visual scale ===
replaceMission('day_23_weight', `    "day_23_weight": {
        tag: "economy",
        day: 23,
        title: "Peso de Carga",
        role: "kid14",
        xp: 15,
        location: "Aeropuerto",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> ESTIMACIÓN DE PESO DE EQUIPAJE</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Antes de poner la maleta en la báscula de facturación, adivina su peso exacto. Después comprueba si acertaste.</p>
            <div style="text-align:center; margin:15px 0;">
                <div style="font-size:4rem;">🧳</div>
                <div style="width:120px; height:8px; background:#333; border-radius:4px; margin:10px auto; position:relative;">
                    <div id="w-needle" style="width:4px; height:20px; background:#0f0; border-radius:2px; position:absolute; top:-6px; left:50%; transition:left 0.5s;"></div>
                </div>
                <p style="color:#888; font-size:0.8rem;">Límite máximo: 23 kg</p>
            </div>
            <label style="color:#0f0; font-size:0.8rem;">TU ESTIMACIÓN (kg):</label>
            <input type="number" id="w-ans" placeholder="Ej: 18.5" step="0.1" style="width:100%; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:12px; border-radius:6px; font-size:1.3rem; text-align:center;">
            <button id="btn" class="btn-primary" style="width:100%">📤 Registrar Estimación</button>
        </div>
    \`,
        attachEvents: () => {
        const input = document.getElementById('w-ans');
        input.addEventListener('input', () => {
            const val = parseFloat(input.value) || 0;
            const pct = Math.min(100, Math.max(0, (val/30)*100));
            document.getElementById('w-needle').style.left = pct + '%';
            document.getElementById('w-needle').style.background = val > 23 ? '#f00' : '#0f0';
        });
        document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('w-ans').value;
            if(!val) { showAlert('Error', 'Introduce tu estimación.'); return; }
            submitMission('day_23_weight', {type:'number', data:val});
        });
    }
    },`);

// === day_23_stamp: Epic narrative for 30XP mission ===
replaceMission('day_23_stamp', `    "day_23_stamp": {
        tag: "photo",
        day: 23,
        title: "El Sello Final",
        role: "both",
        xp: 30,
        location: "Aeropuerto",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🔴 Misión Legendaria Conjunta: En las estaciones y aeropuertos de Japón hay tampones de tinta para sellar recuerdos. Buscad uno y conseguid el <strong>ÚLTIMO SELLO</strong> de vuestro Pasaporte de Misiones. ¡Esto es historia!</p>
        <div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(135deg,#1a0a0a,#3d0a0a); border-radius:15px; border:2px solid #d4af37;">
            <p style="font-size:4rem;">🔴✨📜</p>
            <p style="color:#d4af37; font-weight:bold; font-size:1.2rem; margin-top:10px;">El Sello que cierra la aventura</p>
            <p style="color:#888; font-size:0.85rem; margin-top:5px;">30 XP por jugador • Misión Familiar</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar el Sello Final</button>
    \`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_23_stamp', currentUser, true); }
    },`);

fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
console.log('Day 23 upgrades complete!');
