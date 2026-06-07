// Upgrade Day 24 missions
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

// === day_24_meal: Emotional farewell photo ===
replaceMission('day_24_meal', `    "day_24_meal": {
        tag: "photo",
        day: 24,
        title: "Comida Aérea",
        role: "kid9",
        xp: 10,
        location: "Avión",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🍱 ¡Tu última comida japonesa! Pero esta vez... ¡estás volando a 10.000 metros de altura! Fotografía la bandeja del avión antes de devorarla. ¿Qué lleva?</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#87CEEB,#4682B4); border-radius:15px;">
            <p style="font-size:3rem;">✈️🍱☁️</p>
            <p style="color:#fff; font-style:italic; margin-top:10px;">Última comida del cielo nipón</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Fotografiar Bandeja Aérea</button>
    \`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_24_meal', currentUser, false); }
    },`);

// === day_24_clouds: Poetic sky photo ===
replaceMission('day_24_clouds', `    "day_24_clouds": {
        tag: "photo",
        day: 24,
        title: "Nubes sobre Europa",
        role: "kid9",
        xp: 10,
        location: "Avión",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">☁️ Mira por la ventanilla. Estás cruzando el cielo entre dos mundos: Japón queda atrás, Europa se acerca. Captura la foto más bonita del cielo desde las nubes. ¡La última foto del viaje!</p>
        <div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(180deg,#1a1a2e,#e94560,#f7c948); border-radius:15px;">
            <p style="font-size:3rem;">🌅✨☁️</p>
            <p style="color:#fff; font-weight:bold; margin-top:10px;">El cielo entre dos mundos</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar el Cielo</button>
    \`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_24_clouds', currentUser, false); }
    },`);

// === day_24_turbulence: Dramatic stopwatch ===
replaceMission('day_24_turbulence', `    "day_24_turbulence": {
        tag: "physical",
        day: 24,
        title: "Cinturón Abrochado",
        role: "kid9",
        xp: 15,
        location: "Avión",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">⚠️ ¡TURBULENCIAS! Cuando el avión empiece a temblar, inicia el cronómetro. ¿Cuánto dura el zarandeo? ¡Agárrate fuerte!</p>
        <div style="background:linear-gradient(135deg,#1a0a0a,#2a1a1a); border-radius:15px; padding:20px; margin:15px 0; text-align:center; border:1px solid rgba(255,0,0,0.2);">
            <p style="font-size:2rem; margin-bottom:5px;">⚠️✈️💨</p>
            <div id="tu-timer" style="font-size:3.5rem; font-weight:bold; color:#ff6b6b; text-shadow:0 0 20px rgba(255,107,107,0.4); font-family:monospace;">0.0s</div>
            <div id="tu-shake" style="font-size:0.9rem; color:#888; margin-top:5px;">Esperando turbulencia...</div>
        </div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px; font-size:1.1rem; padding:15px;">💺 ¡Empieza a temblar!</button>
        <button id="btn-end" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">✅ ¡Ya pasó!</button>
    \`,
        attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            document.getElementById('tu-shake').innerText = '¡¡TEMBLANDO!!';
            document.getElementById('tu-shake').style.color = '#ff6b6b';
            int = setInterval(() => {
                const el = (Date.now()-t0)/1000;
                document.getElementById('tu-timer').innerText = el.toFixed(1)+'s';
            }, 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int);
            document.getElementById('tu-shake').innerText = '¡Superviviente!';
            document.getElementById('tu-shake').style.color = '#4ade80';
            submitMission('day_24_turbulence', {type:'text', data:\`Turbulencia: \${document.getElementById('tu-timer').innerText}\`}); });
        window._missionCleanup = () => clearInterval(int);
    }
    },`);

// === day_24_badges: Fix localStorage key + visual trophy count ===
replaceMission('day_24_badges', `    "day_24_badges": {
        tag: "economy",
        day: 24,
        title: "Recuento de Sellos",
        role: "kid9",
        xp: 15,
        location: "Avión",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🏆 Es hora de contar tus victorias. La app revisará todas las misiones que has completado durante los 24 días. ¿Cuántas has superado?</p>
        <div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(135deg,#1a1a2e,#2a1a3e); border-radius:15px; border:1px solid rgba(212,175,55,0.3);">
            <div id="bdg-icon" style="font-size:4rem;">🏆</div>
            <div id="bdg-res" style="font-size:2.5rem; font-weight:bold; color:#d4af37; text-shadow:0 0 15px rgba(212,175,55,0.4); margin:10px 0;">...</div>
            <div id="bdg-label" style="color:#888; font-size:0.9rem;">Calculando...</div>
        </div>
        <button id="btn" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar Recuento al Juez</button>
    \`,
        attachEvents: () => {
        let count = 0;
        try {
            const gs = JSON.parse(localStorage.getItem('japanMissionsState'));
            if(gs && gs.kid9 && gs.kid9.missions) {
                count = Object.values(gs.kid9.missions).filter(m => m.status === 'approved').length;
            }
        } catch(e) {}
        const total = Object.keys(MISSIONS_CONFIG).filter(k => MISSIONS_CONFIG[k].role === 'kid9' || MISSIONS_CONFIG[k].role === 'both').length;
        document.getElementById('bdg-res').innerText = count + ' misiones';
        document.getElementById('bdg-label').innerText = \`de \${total} posibles • ¡\${count > total*0.8 ? 'LEYENDA' : count > total*0.5 ? 'Increíble' : 'Bien hecho'}!\`;
        document.getElementById('btn').classList.remove('hidden');
        document.getElementById('btn').addEventListener('click', () => submitMission('day_24_badges', {type:'number', data:count}));
    }
    },`);

// === day_24_timezones: REWRITE with visual clocks ===
replaceMission('day_24_timezones', `    "day_24_timezones": {
        tag: "economy",
        day: 24,
        title: "Husos Horarios",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> ANÁLISIS DE SINCRONIZACIÓN TEMPORAL</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">En este momento, tres relojes del mundo marcan horas distintas. Investiga y registra la hora simultánea en cada zona.</p>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin:15px 0;">
                <div style="text-align:center; background:#0a0a1a; padding:12px; border-radius:10px; border:1px solid #0f02;">
                    <p style="font-size:2rem;">🗼</p>
                    <p style="color:#ff6b35; font-size:0.8rem; font-weight:bold;">JAPÓN</p>
                    <p style="color:#666; font-size:0.7rem;">UTC+9</p>
                </div>
                <div style="text-align:center; background:#0a0a1a; padding:12px; border-radius:10px; border:1px solid #0f02;">
                    <p style="font-size:2rem;">🇪🇸</p>
                    <p style="color:#ff6b35; font-size:0.8rem; font-weight:bold;">ESPAÑA</p>
                    <p style="color:#666; font-size:0.7rem;">UTC+2</p>
                </div>
                <div style="text-align:center; background:#0a0a1a; padding:12px; border-radius:10px; border:1px solid #0f02;">
                    <p style="font-size:2rem;">✈️</p>
                    <p style="color:#ff6b35; font-size:0.8rem; font-weight:bold;">AVIÓN</p>
                    <p style="color:#666; font-size:0.7rem;">¿?</p>
                </div>
            </div>
            <label style="color:#0f0; font-size:0.8rem;">HORA EN JAPÓN:</label>
            <input type="text" id="tz-jap" placeholder="Ej: 23:30" style="width:100%; margin-bottom:8px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <label style="color:#0f0; font-size:0.8rem;">HORA EN ESPAÑA:</label>
            <input type="text" id="tz-esp" placeholder="Ej: 16:30" style="width:100%; margin-bottom:8px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <label style="color:#0f0; font-size:0.8rem;">HORA EN EL AVIÓN:</label>
            <input type="text" id="tz-air" placeholder="Ej: 19:30" style="width:100%; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <button id="btn" class="btn-primary" style="width:100%">📤 Transmitir Sincronización</button>
        </div>
    \`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => {
            const j=document.getElementById('tz-jap').value, e=document.getElementById('tz-esp').value, a=document.getElementById('tz-air').value;
            if(!j||!e||!a) { showAlert('Incompleto','Rellena las 3 horas.'); return; }
            submitMission('day_24_timezones', {type:'text', data:\`JP: \${j}, ES: \${e}, AV: \${a}\`});
        }); }
    },`);

// === day_24_distance: REWRITE with flight visualization ===
replaceMission('day_24_distance', `    "day_24_distance": {
        tag: "economy",
        day: 24,
        title: "Kilometraje Total",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> REGISTRO DE DISTANCIA DE VUELO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Consulta la pantalla del asiento. ¿Cuántos kilómetros separan Tokio de casa?</p>
            <div style="text-align:center; margin:15px 0; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.5rem;">🗼</span>
                    <div style="flex:1; height:3px; background:linear-gradient(90deg,#ff6b35,#0f0); margin:0 10px; border-radius:2px; position:relative;">
                        <span style="position:absolute; top:-12px; left:50%; transform:translateX(-50%);">✈️</span>
                    </div>
                    <span style="font-size:1.5rem;">🏠</span>
                </div>
                <p style="color:#888; font-size:0.8rem; margin-top:8px;">Tokio → Madrid ≈ 10.500 km</p>
            </div>
            <label style="color:#0f0; font-size:0.8rem;">DISTANCIA TOTAL (km):</label>
            <input type="number" id="d-ans" placeholder="Ej: 10764" style="width:100%; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:12px; border-radius:6px; font-size:1.3rem; text-align:center;">
            <button id="btn" class="btn-primary" style="width:100%">📤 Registrar Distancia</button>
        </div>
    \`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('d-ans').value;
            if(!val) { showAlert('Error','Introduce la distancia.'); return; }
            submitMission('day_24_distance', {type:'number', data:val});
        }); }
    },`);

// === day_24_speed: REWRITE with speedometer ===
replaceMission('day_24_speed', `    "day_24_speed": {
        tag: "physical",
        day: 24,
        title: "Velocidad de Retorno",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> LECTURA DE VELOCÍMETRO AÉREO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">La pantalla del entretenimiento muestra la velocidad en tiempo real. Anota la velocidad máxima que alcance el avión.</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; border-radius:12px; padding:20px; border:1px solid #0f02;">
                <p style="font-size:3rem;">🛩️💨</p>
                <div id="sp-display" style="font-size:2rem; color:#60efff; font-weight:bold; margin:10px 0; font-family:monospace;">--- km/h</div>
                <p style="color:#666; font-size:0.8rem;">Velocidad crucero típica: 850-920 km/h</p>
            </div>
            <label style="color:#0f0; font-size:0.8rem;">VELOCIDAD MÁXIMA REGISTRADA (km/h):</label>
            <input type="number" id="v-ans" placeholder="Ej: 912" style="width:100%; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:12px; border-radius:6px; font-size:1.3rem; text-align:center;">
            <button id="btn" class="btn-primary" style="width:100%">📤 Registrar Velocidad</button>
        </div>
    \`,
        attachEvents: () => {
        document.getElementById('v-ans').addEventListener('input', (e) => {
            const v = e.target.value;
            document.getElementById('sp-display').innerText = v ? v + ' km/h' : '--- km/h';
            document.getElementById('sp-display').style.color = v > 900 ? '#4ade80' : '#60efff';
        });
        document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('v-ans').value;
            if(!val) { showAlert('Error','Introduce la velocidad.'); return; }
            submitMission('day_24_speed', {type:'number', data:val});
        });
    }
    },`);

// === day_24_log: Better hacker bitácora ===
replaceMission('day_24_log', `    "day_24_log": {
        tag: "writing",
        day: 24,
        title: "Análisis del Viaje",
        role: "kid14",
        xp: 20,
        location: "Avión",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> BITÁCORA FINAL DEL AGENTE</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:5px;">Misión: JAPÓN 2026 • Estado: COMPLETADA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Redacta tu informe final como agente operativo. Resume la misión, evalúa su éxito y destaca los momentos clave de la operación.</p>
            <div style="background:#0a0a0a; border-left:3px solid #0f0; padding:10px; margin-bottom:15px; border-radius:0 6px 6px 0;">
                <p style="color:#666; font-size:0.8rem; font-family:monospace;">Plantilla: "La operación Japón 2026 ha sido [ÉXITO/PARCIAL]. Los objetivos principales [se cumplieron/superaron]. Destaco..."</p>
            </div>
            <textarea id="l-ans" placeholder=">>> Escribe tu informe final aquí..." style="width:100%; height:120px; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:12px; border-radius:6px; font-family:monospace; font-size:0.95rem;"></textarea>
            <div id="l-count" style="color:#666; font-size:0.8rem; text-align:right; margin-bottom:10px;">0 caracteres</div>
            <button id="btn" class="btn-primary" style="width:100%">📤 Transmitir Bitácora Final</button>
        </div>
    \`,
        attachEvents: () => {
        document.getElementById('l-ans').addEventListener('input', (e) => {
            document.getElementById('l-count').innerText = e.target.value.length + ' caracteres';
        });
        document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('l-ans').value;
            if(val.length < 30) { showAlert('Incompleto', 'Tu informe final merece al menos un párrafo completo.'); return; }
            submitMission('day_24_log', {type:'text', data:val});
        });
    }
    },`);

// === day_24_sayonara: Epic finale with fireworks ===
replaceMission('day_24_sayonara', `    "day_24_sayonara": {
        tag: "writing",
        day: 24,
        title: "Sayonara Japón",
        role: "both",
        xp: 50,
        location: "Avión",
        render: () => \`
        <div style="text-align:center; margin-bottom:15px;">
            <p style="font-size:3rem; margin-bottom:5px;">🏆✨🗾✨🏆</p>
            <h2 style="color:var(--color-accent); font-size:1.5rem; margin-bottom:5px;">MISIÓN FINAL</h2>
            <p style="color:#d4af37; font-weight:bold; font-size:1.1rem;">50 XP por jugador</p>
        </div>
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌸 Ha llegado el momento. 24 días de aventuras, risas, descubrimientos y misiones épicas. Antes de cerrar este Pasaporte para siempre, escribe tus <strong>3 momentos favoritos</strong> de todo el viaje.</p>
        <div style="background:linear-gradient(135deg,#1a1a2e,#2a1a3e); border-radius:15px; padding:20px; margin:15px 0; border:2px solid #d4af37;">
            <label style="color:#d4af37; font-size:0.9rem; font-weight:bold;">🥇 Momento #1 (el mejor de todos)</label>
            <input type="text" id="sy-1" placeholder="El momento que nunca olvidaré..." style="width:100%; margin-bottom:12px; background:#111; color:#fff; border:1px solid #d4af3744; padding:12px; border-radius:8px; font-size:1rem;">
            <label style="color:#c0c0c0; font-size:0.9rem; font-weight:bold;">🥈 Momento #2</label>
            <input type="text" id="sy-2" placeholder="Otro momento increíble..." style="width:100%; margin-bottom:12px; background:#111; color:#fff; border:1px solid #c0c0c044; padding:12px; border-radius:8px; font-size:1rem;">
            <label style="color:#cd7f32; font-size:0.9rem; font-weight:bold;">🥉 Momento #3</label>
            <input type="text" id="sy-3" placeholder="Un recuerdo especial..." style="width:100%; margin-bottom:5px; background:#111; color:#fff; border:1px solid #cd7f3244; padding:12px; border-radius:8px; font-size:1rem;">
        </div>
        <button id="btn" class="btn-primary" style="width:100%; background:linear-gradient(135deg,#d4af37,#f7c948); color:#000; font-size:1.2rem; padding:18px; font-weight:bold; border:none; border-radius:12px;">🏆 DESBLOQUEAR SELLO LEGENDARIO</button>
    \`,
        attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            const m1 = document.getElementById('sy-1').value;
            const m2 = document.getElementById('sy-2').value;
            const m3 = document.getElementById('sy-3').value;
            if(m1 && m2 && m3) {
                const cel = document.getElementById('celebration-modal');
                if(cel) {
                    document.getElementById('celebration-results').innerHTML = \`<p style="font-size:1.1rem; margin-bottom:10px;">Tus momentos favoritos:</p><ul style="text-align:left; line-height:2;"><li>🥇 \${m1}</li><li>🥈 \${m2}</li><li>🥉 \${m3}</li></ul><p style="margin-top:15px; color:#d4af37; font-weight:bold;">¡Sois LEYENDAS de Japón!</p>\`;
                    cel.classList.remove('hidden'); launchConfetti();
                }
                submitMission('day_24_sayonara', {type:'text', data:\`1:\${m1}, 2:\${m2}, 3:\${m3}\`}, role, true);
            } else { showAlert('¡Espera!', 'Los 3 momentos son obligatorios. ¡Piénsalo bien!'); }
        });
    }
    },`);

fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
console.log('Day 24 upgrades complete!');
