// ==========================================
// 3. CONFIGURACIÓN DE MISIONES
// ==========================================


const MISSIONS_CONFIG = {
    // === NUEVAS MISIONES DÍAS 5, 6, 7 ===
    // === MISIONES ORIGINALES DÍAS 1, 2, 3 ===
    "any_eki_stamp": { tag: "photo", day: 2, title: "Coleccionista de Eki-Stamps", role: "both", xp: 15, location: "Estaciones", render: () => `<p class="mission-desc">Busca el sello de la estación.</p><button id="btn-cam" class="btn-secondary">📸 Foto Sello</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'any_eki_stamp', role, true); } },


    // === DÍA 1 ===
    // === DÍA 2 ===
    // === DÍA 3 ===





    "day_8_kid9_buda": { tag: "photo", day: 8, title: "Buda Gracioso", role: "kid9", xp: 15, location: "Otagi", render: () => `<p class="mission-desc">En el templo Otagi Nenbutsu-ji hay 1200 pequeñas estatuas de piedra y ¡todas son diferentes! Algunas ríen, otras beben sake o incluso llevan raquetas. Encuentra la que te parezca más graciosa o extraña y hazle una foto de cerca.</p><button id="btn-cam" class="btn-secondary">📸 Foto del Buda</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_8_kid9_buda', currentUser, false); } },

    "day_8_kid14_twin": { tag: "writing", day: 8, title: "Gemelo Perdido", role: "kid14", xp: 15, location: "Otagi", render: () => `<input id="t"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_8_kid14_twin', {type:'text', data:document.getElementById('t').value})); } },
    "day_8_kid9_guardian": { tag: "photo", day: 8, title: "Guardián Estanque", role: "kid9", xp: 15, location: "Tenryu-ji", render: () => `<button id="btn-cam" class="btn-secondary">📸 Foto</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_8_kid9_guardian', currentUser, false); } },

    "day_8_kid14_bamboo_eng": { tag: "writing", day: 8, title: "Ingeniero Bosque", correctAnswer: "La altura varía entre 15m y 30m.",  role: "kid14", xp: 15, location: "Arashiyama", render: () => `<input type="number" id="n"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_8_kid14_bamboo_eng', {type:'number', data:document.getElementById('n').value})); } },
    "day_8_kid14_codigo": { tag: "writing", day: 8, title: "El Código del Jardín", role: "kid14", xp: 20, location: "Tenryu-ji", render: () => `<input id="e1"><input id="e2"><input id="e3"><button id="b" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('b').addEventListener('click', () => submitMission('day_8_kid14_codigo', {type:'text', data:'Interpretación'})); } },
    "day_8_kid9_rake": { tag: "writing", day: 8, title: "Rastrillo Zen", role: "kid9", xp: 15, location: "Tenryu-ji", render: () => `<canvas id="rake" style="height:150px; width:100%; border:1px solid #ccc;"></canvas><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_8_kid9_rake', {type:'text', data:'Patron'})); } },
    "day_8_fam_silencio": { tag: "audio", day: 8, title: "Silencio Competitivo", role: "both", xp: 20, location: "Arashiyama", render: () => `<button id="b1">Grab A</button><button id="b2">Grab B</button><button id="b" class="btn-primary">Votar y Enviar</button>`, attachEvents: (role) => { attachCameraFlow('b1', 'day_8_fam_silencio', role, true); } },

    "day_8_kid9_drum": { tag: "audio", day: 8, title: "Tambor Bambú", role: "kid9", xp: 15, location: "Arashiyama", render: () => `<button id="btn-cam" class="btn-secondary">🎤 Grabar</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_8_kid9_drum', currentUser, false); } },

    "day_8_kid14_haiku": { tag: "writing", day: 8, title: "Maestro Haiku", role: "kid14", xp: 15, location: "Tenryu-ji", render: () => `<textarea id="t"></textarea><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_8_kid14_haiku', {type:'text', data:document.getElementById('t').value})); } },
        "day_8_kid14_wave_sync": {
        tag: "game", day: 8, title: "Sincro Ondas", role: "kid14", xp: 20, location: "Arashiyama",
        render: () => `
            <p class="mission-desc">Alinea la frecuencia de onda de tu osciloscopio cibernético con la señal ambiental del bosque de bambú. Usa el dial para modificar la amplitud hasta que ambas ondas se solapen perfectamente.</p>
            <div style="background: #001100; border: 4px solid #333; border-radius: 15px; padding: 10px; margin-bottom: 20px;">
                <canvas id="wc" width="300" height="150" style="width: 100%; height: 150px; background: repeating-linear-gradient(0deg, transparent, transparent 19px, #003300 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #003300 20px); border-radius: 10px; box-shadow: inset 0 0 20px rgba(0,0,0,1);"></canvas>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <div style="width: 50px; text-align: center; color: #0f0; font-family: monospace; font-size: 1.2rem;">MIN</div>
                <input type="range" id="sl" min="0.01" max="0.1" step="0.001" value="0.09" style="flex:1; margin: 0 15px; accent-color: #0f0;">
                <div style="width: 50px; text-align: center; color: #0f0; font-family: monospace; font-size: 1.2rem;">MAX</div>
            </div>
            <div id="sync-status" style="text-align: center; color: #f00; font-family: monospace; font-size: 1.5rem; text-shadow: 0 0 5px #f00; margin-bottom: 10px;">ESTADO: DESINCRONIZADO</div>
            <button id="btn" class="btn-primary hidden" style="width:100%; animation: pulse 1s infinite;">Capturar Señal Pura</button>
        `,
        attachEvents: () => {
            const c = document.getElementById('wc');
            const ctx = c.getContext('2d');
            const s = document.getElementById('sl');
            const b = document.getElementById('btn');
            const stat = document.getElementById('sync-status');
            
            // Frecuencia objetivo aleatoria pero constante para la misión
            const targetFreq = 0.05; 
            let offset = 0;
            let active = true;

            const loop = () => {
                if(!active) return;
                ctx.clearRect(0 0, c.width, c.height);
                
                // Efecto fósforo
                ctx.globalCompositeOperation = 'lighter';
                
                // Onda Objetivo (Roja)
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'red';
                for(let x=0; x<c.width; x++) {
                    ctx.lineTo(x 75 + 40 * Math.sin((x + offset) * targetFreq));
                }
                ctx.stroke();
                
                // Onda Jugador (Verde)
                const playerFreq = parseFloat(s.value);
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'green';
                for(let x=0; x<c.width; x++) {
                    ctx.lineTo(x 75 + 40 * Math.sin((x + offset) * playerFreq));
                }
                ctx.stroke();

                offset += 2; // Animación de desplazamiento

                const diff = Math.abs(playerFreq - targetFreq);
                if(diff < 0.002) {
                    stat.innerText = 'ESTADO: 100% SINCRONIZADO';
                    stat.style.color = '#0f0';
                    stat.style.textShadow = '0 0 10px #0f0';
                    b.classList.remove('hidden');
                    // Volver dorada la onda
                    ctx.strokeStyle = 'rgba(255, 255, 0, 1)';
                    ctx.shadowColor = 'yellow';
                    ctx.stroke();
                } else if(diff < 0.01) {
                    stat.innerText = 'ESTADO: 80% SINCRONIZADO';
                    stat.style.color = '#ff0';
                    stat.style.textShadow = '0 0 5px #ff0';
                    b.classList.add('hidden');
                } else {
                    stat.innerText = 'ESTADO: DESINCRONIZADO';
                    stat.style.color = '#f00';
                    stat.style.textShadow = '0 0 5px #f00';
                    b.classList.add('hidden');
                }

                requestAnimationFrame(loop);
            };
            
            loop();
            b.addEventListener('click', () => { active = false; submitMission('day_8_kid14_wave_sync', {type:'game', data:'Ondas sincronizadas'}); });
            window._missionCleanup = () => { active = false; };
        }
    },
    "day_9_kid14_torii_count": { tag: "writing", day: 9, title: "Código Torii", correctAnswer: "Es imposible contarlos todos (hay más de 10,000), premia el esfuerzo.",  role: "kid14", xp: 15, location: "Fushimi", render: () => `<input type="number" id="n"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_9_kid14_torii_count', {type:'number', data:document.getElementById('n').value})); } },
    "day_9_kid9_kinkaku_mirror": { tag: "photo", day: 9, title: "Espejo Oro", role: "kid9", xp: 15, location: "Kinkaku", render: () => `<button id="btn-cam" class="btn-secondary">📸 Foto</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid9_kinkaku_mirror', currentUser, false); } },

    "day_9_kid14_heart": { tag: "sensors", day: 9, title: "Latido Montaña", role: "kid14", xp: 15, location: "Fushimi", render: () => `<input type="number" id="n"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_9_kid14_heart', {type:'number', data:document.getElementById('n').value})); } },
    "day_9_kid9_inari_kitsune": { tag: "photo", day: 9, title: "Caza 3 Kitsune", role: "kid9", xp: 25, location: "Fushimi", render: () => `<button id="btn-cam" class="btn-secondary">📸 Fotos</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid9_inari_kitsune', currentUser, false); } },

    "day_9_kid9_zorro": { tag: "video", day: 9, title: "El Zorro Infiltrado", role: "kid9", xp: 25, location: "Fushimi", render: () => `<input type="file" accept="video/*" capture="environment"><button id="b" class="btn-primary">Enviar</button>`, attachEvents: (role) => { attachCameraFlow('b', 'day_9_kid9_zorro', currentUser, false); } },

    "day_9_kid14_phoenix": { tag: "writing", day: 9, title: "Física Fénix", role: "kid14", xp: 15, location: "Kinkaku", render: () => `<textarea id="t"></textarea><button id="btn" class="btn-primary">Responder</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_9_kid14_phoenix', {type:'text', data:document.getElementById('t').value})); } },
    "day_9_kid14_gravity": { tag: "versus", day: 9, title: "Piedra Gravedad", role: "kid14", xp: 15, location: "Fushimi", render: () => `<button id="bm" class="btn-primary">Más</button><button id="bl" class="btn-secondary">Menos</button>`, attachEvents: () => { document.getElementById('bl').addEventListener('click', () => submitMission('day_9_kid14_gravity', {type:'text', data:'Menos'})); document.getElementById('bm').addEventListener('click', () => submitMission('day_9_kid14_gravity', {type:'text', data:'Más'})); } },
    "day_9_kid14_angulo": { tag: "photo", day: 9, title: "Ángulo Imposible", role: "kid14", xp: 20, location: "Kinkaku", render: () => `<input type="file" capture="environment"><input type="range" min="1" max="10"><button id="b" class="btn-primary">Enviar</button>`, attachEvents: (role) => { attachCameraFlow('b', 'day_9_kid14_angulo', currentUser, false); } },

        "day_9_kid9_scratch": {
        tag: "game", day: 9, title: "Limpia Reflejo", role: "kid9", xp: 20, location: "Kinkaku",
        render: () => `
            <p class="mission-desc">¡Rasca la pantalla para limpiar el estanque y revelar el reflejo dorado perfecto del Kinkaku-ji!</p>
            <div style="position: relative; width: 100%; height: 250px; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border: 4px solid #d4af37;">
                <!-- Fondo Revelado (Kinkakuji y reflejo) -->
                <div style="position: absolute; top:0; left:0; width: 100%; height: 100%; background: linear-gradient(to bottom, #87CEEB 40%, #001f3f 100%); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: 5rem; text-shadow: 0 0 20px gold;">⛩️</div>
                    <div style="font-size: 5rem; transform: scaleY(-1); opacity: 0.6; filter: blur(2px);">⛩️</div>
                </div>
                <!-- Canvas a rascar (polvo/barro) -->
                <canvas id="sc" width="300" height="250" style="position: absolute; top:0; left:0; width: 100%; height: 100%;"></canvas>
            </div>
            <div style="margin-top: 15px; height: 10px; background: #ddd; border-radius: 5px; overflow: hidden;">
                <div id="scratch-progress" style="height: 100%; width: 0%; background: #f1c40f; transition: width 0.2s;"></div>
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">Enviar Reflejo al Juez</button>
        `,
        attachEvents: () => {
            const c = document.getElementById('sc');
            const ctx = c.getContext('2d');
            const b = document.getElementById('btn');
            const prog = document.getElementById('scratch-progress');
            
            // Dibujar "suciedad" realista
            ctx.fillStyle = '#6e6e6e';
            ctx.fillRect(0, 0, c.width, c.height);
            // Textura
            for(let i=0; i<1000; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#5a5a5a' : '#828282';
                ctx.fillRect(Math.random()*c.width, Math.random()*c.height, 2, 2);
            }

            let pixelsToClear = c.width * c.height;
            let isDrawing = false;
            let clearedCount = 0;

            const scratch = (e) => {
                e.preventDefault();
                let clientX clientY;
                if(e.touches) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                const rect = c.getBoundingClientRect();
                const x = (clientX - rect.left) * (c.width / rect.width);
                const y = (clientY - rect.top) * (c.height / rect.height);
                
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, Math.PI * 2);
                ctx.fill();

                clearedCount++;
                // Simulación rápida de progreso (no es 100% precisa por píxel pero funciona visualmente)
                let pct = Math.min(100, (clearedCount / 120) * 100);
                prog.style.width = pct + '%';
                
                if(pct >= 90 && b.classList.contains('hidden')) {
                    // Autocompletar el resto para limpieza visual
                    ctx.clearRect(0,0,c.width,c.height);
                    prog.style.width = '100%';
                    b.classList.remove('hidden');
                    launchConfetti();
                }
            };

            c.addEventListener('mousedown', () => { isDrawing = true; });
            c.addEventListener('mouseup', () => { isDrawing = false; });
            c.addEventListener('mousemove', (e) => { if(isDrawing) scratch(e); });
            c.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
            c.addEventListener('touchmove', (e) => { if(isDrawing) scratch(e); });
            c.addEventListener('touchend', () => { isDrawing = false; });

            b.addEventListener('click', () => submitMission('day_9_kid9_scratch', {type:'game', data:'Reflejo limpiado'}));
        }
    },
        "day_9_kid14_torii": {
        tag: "game", day: 9, title: "Laberinto Torii", role: "kid14", xp: 25, location: "Fushimi",
        render: () => `
            <p class="mission-desc">Toca los caminos Torii para rotarlos y crear una ruta continua desde la base inferior izquierda hasta la cima superior derecha. ¡Ilumina el santuario!</p>
            <div id="torii-board" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; max-width: 300px; margin: 0 auto; background: #222; padding: 10px; border-radius: 10px; border: 4px solid #e74c3c;">
                <!-- 9 Casillas -->
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">¡Camino Abierto!</button>
        `,
        attachEvents: () => {
            const board = document.getElementById('torii-board');
            const btn = document.getElementById('btn');
            
            // Tipos: 0=recto (I), 1=curva (L)
            const map = [
                {t:1 r:90}, {t:0 r:0}, {t:1 r:180},
                {t:0 r:90}, {t:1 r:0}, {t:0 r:90},
                {t:1 r:270}, {t:1 r:180}, {t:1 r:0}
            ];
            
            // Solución: índice 0 debe conectar con 3(abajo) y 1(der)...
            // Simplificación: al ser un puzzle específico, verificaremos rotaciones concretas.
            const checkWin = () => {
                // Camino: 6 -> 7 -> 4 -> 1 -> 2
                // Casilla 6: L curva arriba/derecha -> rot 0 o 90?
                // Visualmente dejaremos que un número de rotaciones totale active el premio si parece que conectan.
                // En un minijuego rápido para PWA, si logran una secuencia lógica, ganan.
                let win = true;
                const r0 = parseInt(document.getElementById('t0').dataset.r)%180 === 90; // I hz
                const r1 = parseInt(document.getElementById('t1').dataset.r)%360 === 270 || parseInt(document.getElementById('t1').dataset.r)%360 === 180; 
                // etc. Para simplificar y hacerlo divertido: el juego cuenta taps y tras X taps con patrón válido, aprueba.
                // Usaremos un check simplificado: todas las rectas deben estar hz o vt según su pos.
                
                let matches = 0;
                map.forEach((m, i) => {
                    const el = document.getElementById('t'+i);
                    const r = parseInt(el.dataset.r) % 360;
                    if(i===0 && r===90) matches++;
                    if(i===1 && r===180) matches++;
                    if(i===2 && r===270) matches++;
                    if(i===3 && r===0) matches++;
                    if(i===4 && r===90) matches++;
                    if(i===5 && r===0) matches++;
                    if(i===6 && r===0) matches++;
                    if(i===7 && r===270) matches++;
                    if(i===8 && r===180) matches++;
                });

                if(matches >= 6) {
                    btn.classList.remove('hidden');
                    board.style.boxShadow = '0 0 30px #f1c40f';
                }
            };

            board.innerHTML = '';
            map.forEach((m, i) => {
                const div = document.createElement('div');
                div.id = 't'+i;
                div.dataset.r = m.r;
                div.style.height = '80px';
                div.style.background = '#333';
                div.style.borderRadius = '5px';
                div.style.position = 'relative';
                div.style.transition = 'transform 0.3s ease';
                div.style.transform = `rotate(${m.r}deg)`;
                div.style.cursor = 'pointer';
                
                // Dibujar el camino rojo
                if(m.t === 0) { // Recto (vertical por defecto)
                    div.innerHTML = `<div style="position:absolute; top:0; bottom:0; left:50%; width:20px; background:#e74c3c; transform:translateX(-50%); border-left:3px solid #c0392b; border-right:3px solid #c0392b;"></div>`;
                } else { // Curva (arriba a derecha por defecto)
                    div.innerHTML = `<div style="position:absolute; top:0; left:50%; width:20px; height:50%; background:#e74c3c; transform:translateX(-50%);"></div><div style="position:absolute; top:50%; left:50%; width:50%; height:20px; background:#e74c3c; transform:translateY(-50%);"></div>`;
                }

                div.addEventListener('click', () => {
                    let r = parseInt(div.dataset.r) + 90;
                    div.dataset.r = r;
                    div.style.transform = `rotate(${r}deg)`;
                    checkWin();
                });
                board.appendChild(div);
            });

            btn.addEventListener('click', () => submitMission('day_9_kid14_torii', {type:'game', data:'Laberinto Torii conectado'}));
        }
    },
    "day_10_kid14_nishiki": { tag: "writing", day: 10, title: "Dilema Chef", role: "kid14", xp: 15, location: "Nishiki", render: () => `<p class="mission-desc">Estás en "la cocina de Kioto", el mercado de Nishiki. Como chef experto en busca de nuevos sabores, debes localizar el ingrediente más extraño o exótico que veas en los puestos y explicar brevemente para qué plato legendario lo usarías.</p><textarea id="t" placeholder="Ingrediente y receta secreta..."></textarea><button id="btn" class="btn-primary">Enviar al Juez Gastronómico</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_10_kid14_nishiki', {type:'text', data:document.getElementById('t').value})); } },
    "day_10_kid9_nishiki": { tag: "economy", day: 10, title: "Maestro Chatarra", role: "kid9", xp: 15, location: "Nishiki", render: () => `<button id="btn" class="btn-primary">Pagado</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_10_kid9_nishiki', {type:'text', data:'OK'})); } },
    "day_10_fam_sayonara": { tag: "writing", day: 10, title: "Sayonara Kioto", role: "both", xp: 30, location: "Despedida", render: () => `<textarea id="t"></textarea><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_10_fam_sayonara', {type:'text', data:document.getElementById('t').value}, role, true)); } },
        "day_10_kid9_bento": {
        tag: "game", day: 10, title: "Maestro Bento", role: "kid9", xp: 20, location: "Nishiki",
        render: () => `
            <p class="mission-desc">Arrastra cada ingrediente a su compartimento correcto en la caja Bento para preparar un almuerzo perfecto.</p>
            <div id="bento-box" style="width: 100%; height: 250px; background: #c0392b; border: 5px solid #8e44ad; border-radius: 15px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 5px; padding: 5px;">
                <div class="bento-slot" data-accept="arroz" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🍚</div>
                <div class="bento-slot" data-accept="pescado" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🐟</div>
                <div class="bento-slot" data-accept="verdura" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🥦</div>
                <div class="bento-slot" data-accept="postre" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🍡</div>
            </div>
            <div style="display: flex; justify-content: space-around; background: #ecf0f1; padding: 10px; border-radius: 10px; min-height: 80px;">
                <div class="bento-item" data-type="pescado" style="font-size: 3rem; cursor: grab; touch-action: none; transition: transform 0.2s;">🐟</div>
                <div class="bento-item" data-type="arroz" style="font-size: 3rem; cursor: grab; touch-action: none; transition: transform 0.2s;">🍚</div>
                <div class="bento-item" data-type="postre" style="font-size: 3rem; cursor: grab; touch-action: none; transition: transform 0.2s;">🍡</div>
                <div class="bento-item" data-type="verdura" style="font-size: 3rem; cursor: grab; touch-action: none; transition: transform 0.2s;">🥦</div>
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">¡Itadakimasu!</button>
        `,
        attachEvents: () => {
            const items = document.querySelectorAll('.bento-item');
            const slots = document.querySelectorAll('.bento-slot');
            const btn = document.getElementById('btn');
            
            let placed = 0;
            let activeItem = null;
            let startX=0, startY=0, initX=0, initY=0;

            const handleMove = (e) => {
                if(!activeItem) return;
                e.preventDefault();
                let clientX = e.touches ? e.touches[0].clientX : e.clientX;
                let clientY = e.touches ? e.touches[0].clientY : e.clientY;
                let dx = clientX - startX;
                let dy = clientY - startY;
                activeItem.style.transform = `translate(${dx}px, ${dy}px) scale(1.2)`;
            };

            const handleEnd = (e) => {
                if(!activeItem) return;
                // Comprobar colisión con slots
                let itemRect = activeItem.getBoundingClientRect();
                let itemCenter = { x: itemRect.left + itemRect.width/2, y: itemRect.top + itemRect.height/2 };
                
                let matched = false;
                slots.forEach(slot => {
                    let slotRect = slot.getBoundingClientRect();
                    if(itemCenter.x > slotRect.left && itemCenter.x < slotRect.right && 
                       itemCenter.y > slotRect.top && itemCenter.y < slotRect.bottom) {
                        
                        if(slot.dataset.accept === activeItem.dataset.type && !slot.dataset.filled) {
                            // Match!
                            matched = true;
                            slot.dataset.filled = 'true';
                            slot.style.borderStyle = 'solid';
                            slot.style.borderColor = '#f1c40f';
                            slot.style.background = '#c0392b';
                            activeItem.style.display = 'none'; // ocultar el original
                            placed++;
                            if(placed === 4) {
                                btn.classList.remove('hidden');
                                launchConfetti();
                            }
                        }
                    }
                });

                if(!matched) {
                    activeItem.style.transform = 'translate(0px, 0px) scale(1)';
                }
                
                activeItem.style.zIndex = '1';
                activeItem = null;
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleEnd);
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('touchend', handleEnd);
            };

            items.forEach(item => {
                const startDrag = (e) => {
                    activeItem = item;
                    startX = e.touches ? e.touches[0].clientX : e.clientX;
                    startY = e.touches ? e.touches[0].clientY : e.clientY;
                    activeItem.style.zIndex = '100';
                    document.addEventListener('mousemove', handleMove, {passive:false});
                    document.addEventListener('mouseup', handleEnd);
                    document.addEventListener('touchmove', handleMove, {passive:false});
                    document.addEventListener('touchend', handleEnd);
                };
                item.addEventListener('mousedown', startDrag);
                item.addEventListener('touchstart', startDrag, {passive:false});
            });

            btn.addEventListener('click', () => submitMission('day_10_kid9_bento', {type:'game', data:'Caja Bento ensamblada a la perfección'}));
        }
    },
    "day_8_kid9_pose": {
        tag: "photo", day: 8, title: "El Trono de Piedra", role: "kid9", xp: 20, location: "Templo Otagi Nenbutsu-ji",
        render: () => `
            <p class="mission-desc">Hay 1200 estatuas y todas son diferentes. Busca la que tenga la pose más extraña e imítala para una foto. ¡El Juez evaluará tu parecido!</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto Imitación</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_8_kid9_pose', {type:'text', data:'Foto imitación enviada'}));
        }
    },
    "day_8_kid14_bosque": {
        tag: "physical", day: 8, title: "El Bosque de 2.7km", role: "kid14", xp: 20, location: "Arashiyama",
        render: () => `
            <p class="mission-desc">Debes completar el circuito sagrado. Marca los puntos de control cuando estés físicamente en ellos.</p>
            <div class="card" style="margin-bottom:15px;">
                <label><input type="checkbox" class="b-chk"> 🎍 Entrada al Bambú</label><br>
                <label><input type="checkbox" class="b-chk"> 🌊 Estanque Tenryu-ji</label><br>
                <label><input type="checkbox" class="b-chk"> 🌉 Puente Togetsukyo</label>
            </div>
            <input type="number" id="p-total" placeholder="Pasos totales (podómetro)..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px; opacity:0.5;" disabled>Enviar al Juez</button>
        `,
        attachEvents: () => {
            const chks = document.querySelectorAll('.b-chk');
            const btn = document.getElementById('btn-sub');
            chks.forEach(c => c.addEventListener('change', () => {
                const all = Array.from(chks).every(x => x.checked);
                btn.disabled = !all; btn.style.opacity = all ? '1' : '0.5';
            }));
            btn.addEventListener('click', () => submitMission('day_8_kid14_bosque', {type:'text', data: `Pasos: ${document.getElementById('p-total').value}`}));
        }
    },
    "day_9_kid9_zorros": {
        tag: "physical", day: 9, title: "La Escalada de los Zorros", role: "kid9", xp: 25, location: "Fushimi Inari-taisha",
        render: () => `
            <p class="mission-desc">Subir la montaña lleva tiempo. Tienes 10 minutos de subida intensa. Al terminar, podrás descansar y contarle al Juez tu secreto.</p>
            <div id="countdown" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-primary); margin:15px 0;">10:00</div>
            <button id="btn-start" class="btn-secondary" style="width:100%">Empezar subida</button>
            <div id="rest-area" class="hidden" style="margin-top:20px;">
                <p>🍵 <b>¡Hora de descansar!</b></p>
                <input type="text" id="z-text" placeholder="¿Cuál es el zorro más raro que has visto?" style="width:100%">
                <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            let time=600; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                if(int) return;
                document.getElementById('btn-start').classList.add('hidden');
                int = setInterval(() => {
                    time--; let m=Math.floor(time/60); let s=time%60;
                    document.getElementById('countdown').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                    if(time<=0) { clearInterval(int); document.getElementById('rest-area').classList.remove('hidden'); }
                }, 1000);
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_9_kid9_zorros', {type:'text', data:document.getElementById('z-text').value}));
        }
    },
    "day_9_kid14_ave": {
        tag: "physical", day: 9, title: "La Postura del Ave Dorada", role: "kid14", xp: 20, location: "Kinkaku-ji",
        render: () => `
            <p class="mission-desc">Imita al fénix del tejado. Ponte a la pata coja mirando el templo de oro. ¿Cuánto tiempo logras aguantar el equilibrio?</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">0s</div>
            <button id="btn-start" class="btn-secondary" style="width:100%">¡Iniciar Equilibrio!</button>
            <button id="btn-stop" class="btn-primary hidden" style="width:100%; margin-top:10px;">Perdí el equilibrio</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                document.getElementById('btn-start').classList.add('hidden');
                document.getElementById('btn-stop').classList.remove('hidden');
                int = setInterval(() => { s++; document.getElementById('chrono').innerText = s + 's'; }, 1000);
            });
            document.getElementById('btn-stop').addEventListener('click', () => {
                clearInterval(int);
                submitMission('day_9_kid14_ave', {type:'text', data: `Aguanté ${s} segundos`});
            });
        }
    },
    "day_10_kid9_dragon": {
        tag: "physical", day: 10, title: "El Dragón del Mercado", role: "kid9", xp: 15, location: "Mercado Nishiki",
        render: () => `
            <p class="mission-desc">Busca los puestos de encurtidos (Tsukemono). Son de colores brillantes como escamas de dragón. ¿Cuántos logras encontrar?</p>
            <input type="number" id="n-tsu" placeholder="Número de puestos..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_10_kid9_dragon', {type:'number', data:document.getElementById('n-tsu').value})); }
    },
    "day_10_kid14_milla": {
        tag: "physical", day: 10, title: "La Milla del Samurái", role: "kid14", xp: 20, location: "Ribera del Río Kamo",
        render: () => `
            <p class="mission-desc">La ribera del río Kamo es perfecta para una marcha rápida. Cronometra cuánto tardas en recorrer un tramo y anota algo curioso que veas en la orilla.</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">00:00</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="btn-start" class="btn-secondary">Empezar</button>
                <button id="btn-stop" class="btn-secondary">Parar</button>
            </div>
            <input type="text" id="p-curios" placeholder="Lo más curioso fue..." style="width:100%; margin-top:15px;">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('btn-stop').addEventListener('click', () => { clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_10_kid14_milla', {type:'text', data: `Tiempo: ${document.getElementById('chrono').innerText} | Curiosidad: ${document.getElementById('p-curios').value}`}));
        }
    },
    "day_8_kid14_arashiyama": {
        day: 8 title: "El Guardián del Bambú", role: "kid14", xp: 15, location: "Arashiyama Bamboo Grove",
        render: () => {
            return `
                <p class="mission-desc">Graba el sonido del viento entre los bambúes (10 seg).</p>
                <button id="btn-record" class="btn-secondary">🔴 Grabar Viento</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
            `;
        },
        attachEvents: () => {
            const btn = document.getElementById('btn-record');
            const btnSubmit = document.getElementById('btn-submit');
            let audioBlob = null;
            btn.addEventListener('click', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                let chunks = [];
                mediaRecorder.ondataavailable = e => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(chunks { type: 'audio/webm' });
                    btnSubmit.classList.remove('hidden');
                    stream.getTracks().forEach(t => t.stop());
                };
                mediaRecorder.start();
                btn.innerText = "⏹ Detener";
                setTimeout(() => { if(mediaRecorder.state==='recording') mediaRecorder.stop(); }, 10000);
            });
            btnSubmit.addEventListener('click', () => {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const id = 'audio_' + Date.now();
                    savePhotoToDB(id, re.target.result).then(() => {
                        submitMission('day_8_kid14_arashiyama', { type: 'mixed', data: `Viento Bambú. ID: ${id}` });
                    });
                };
                reader.readAsDataURL(audioBlob);
            });
        }
    },
    "day_11_kid9_onsen": {
        day: 11 title: "El Código Onsen", role: "kid9", xp: 15, location: "Kazeya Ryokan",
        render: () => `
            <p class="mission-desc">Los Onsen son baños termales sagrados con reglas muy estrictas de etiqueta. Demuestra que eres un experto en cultura japonesa marcando los tres protocolos obligatorios que debes seguir antes de entrar al agua.</p>
            <div class="card" style="text-align:left;">
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="onsen-chk"> 🚿 Ducha previa obligatoria</label>
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="onsen-chk"> 🚫 Sin bañador (desnudez total)</label>
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="onsen-chk"> 🧣 Toalla pequeña fuera del agua</label>
            </div>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px; opacity:0.5;" disabled>Aceptar el Código Onsen</button>
        `,
        attachEvents: () => {
            const chks = document.querySelectorAll('.onsen-chk');
            const btn = document.getElementById('btn-sub');
            chks.forEach(c => c.addEventListener('change', () => {
                const all = Array.from(chks).every(x => x.checked);
                btn.disabled = !all; btn.style.opacity = all ? '1' : '0.5';
            }));
            btn.addEventListener('click', () => submitMission('day_11_kid9_onsen', {type:'text', data:'Reglas aceptadas'}));
        }
    },
    "day_11_kid14_kaiseki": {
        day: 11 title: "Catador de Kaiseki", role: "kid14", xp: 20, location: "Kazeya Ryokan",
        render: () => `
            <p class="mission-desc">Describe el plato más extraño de la cena Kaiseki usando 3 adjetivos.</p>
            <input type="text" id="k-desc" placeholder="Adjetivo 1, 2, 3..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Crítica</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_11_kid14_kaiseki', {type:'text', data:document.getElementById('k-desc').value}));
        }
    },
    "day_11_fam_yukata": {
        day: 11 title: "El Equilibrio del Yukata", role: "both", xp: 20, location: "Ryokan / Pueblo",
        render: () => `
            <p class="mission-desc">Camina 30 pasos con yukata y geta sin tropezar. ¡El Juez cronometra!</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">00:00</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="btn-start" class="btn-secondary">Empezar</button>
                <button id="btn-stop" class="btn-secondary">¡Llegué!</button>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Confirmar Éxito</button>
        `,
        attachEvents: (role) => {
            let s=0; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('btn-stop').addEventListener('click', () => { clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_11_fam_yukata', {type:'text', data: `Tiempo: ${document.getElementById('chrono').innerText}`}, role, true));
        }
    },
    "day_12_kid9_cedro": {
        day: 12 title: "La Bola de Cedro", role: "kid9", xp: 15, location: "Takayama",
        render: () => `
            <p class="mission-desc">En las antiguas destilerías de sake de Takayama, cuelgan grandes bolas hechas de agujas de cedro llamadas "Sugidama". Localiza una de estas esferas gigantes en las fachadas de madera y hazle una foto para demostrar tu hallazgo.</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto Sugidama</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_12_kid9_cedro', {type:'text', data:'Foto enviada'}));
        }
    },
    "day_12_kid14_madera": {
        day: 12 title: "Talla en Madera (G)", role: "kid14", xp: 25, location: "Takayama",
        render: () => `
            <p class="mission-desc">Traza el Kanji de madera (木) como un artesano local.</p>
            <div class="canvas-container" style="background:#f4ece0; border:2px solid #8d6e63; border-radius:10px;">
                <canvas id="c-wood" style="width:100%; height:250px; touch-action:none;"></canvas>
            </div>
            <button id="btn-clear" class="btn-secondary" style="width:100%; margin-top:10px;">Limpiar</button>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:10px;">Enviar Talla</button>
        `,
        attachEvents: () => {
            const canvas = document.getElementById('c-wood');
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth; canvas.height = 250;
            ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = '#5d4037';
            let drawing = false;
            const getPos = (e) => { const rect = canvas.getBoundingClientRect(); const cx = e.touches ? e.touches[0].clientX : e.clientX; const cy = e.touches ? e.touches[0].clientY : e.clientY; return { x: cx - rect.left y: cy - rect.top }; };
            const start = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x p.y); };
            const draw = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x p.y); ctx.stroke(); };
            canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw); window.addEventListener('mouseup', () => drawing=false);
            canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }); canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }); canvas.addEventListener('touchend', () => drawing=false);
            document.getElementById('btn-clear').addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_12_kid14_madera', {type:'text', data:'Talla digital'}));
        }
    },
    "day_12_fam_patrulla": {
        day: 12 title: "Patrulla del Casco Antiguo", role: "both", xp: 15, location: "Sanmachi Suji",
        render: () => `
            <p class="mission-desc">Cuenta cuántas casas tradicionales de madera oscura ves en esta calle.</p>
            <div style="display:flex; align-items:center; justify-content:center; gap:20px; margin:20px 0;">
                <button id="c-min" class="btn-secondary" style="font-size:2rem; width:60px;">-</button>
                <div id="c-val" style="font-size:3rem; font-weight:bold;">0</div>
                <button id="c-plus" class="btn-secondary" style="font-size:2rem; width:60px;">+</button>
            </div>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Conteo</button>
        `,
        attachEvents: (role) => {
            let c=0;
            document.getElementById('c-plus').addEventListener('click', () => { c++; document.getElementById('c-val').innerText = c; });
            document.getElementById('c-min').addEventListener('click', () => { if(c>0) c--; document.getElementById('c-val').innerText = c; });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_12_fam_patrulla', {type:'number', data:c}, role, true));
        }
    },
    "day_13_fam_chureito": {
        day: 13 title: "La Escalada Chureito", role: "both", xp: 20, location: "Pagoda Chureito",
        render: () => `
            <p class="mission-desc">Cuenta los casi 400 escalones. Escribe el número exacto al llegar arriba.</p>
            <input type="number" id="steps-val" placeholder="¿Cuántos contaste?" style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: (role) => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_13_fam_chureito', {type:'number', data:document.getElementById('steps-val').value}, role, true));
        }
    },
    "day_13_kid14_gigante": {
        day: 13 title: "Perspectiva del Gigante", role: "kid14", xp: 20, location: "Lago Kawaguchiko",
        render: () => `
            <p class="mission-desc">¡Hora de jugar con la perspectiva! Sitúate en la orilla del lago Kawaguchiko y pídele a tu familia que te haga una foto donde, por el ángulo de la cámara, parezca que estás tocando la mismísima cima del Monte Fuji con la punta de tu dedo.</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto de la Ilusión</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_13_kid14_gigante', {type:'text', data:'Ilusión Fuji'}));
        }
    },
    "day_13_fam_asfalto": {
        day: 13 title: "Navegantes del Asfalto", role: "both", xp: 15, location: "Coche",
        render: () => `
            <p class="mission-desc">Avisad de cuántos túneles cruzáis hasta llegar al lago (usad Maps si hace falta).</p>
            <input type="text" id="t-count" placeholder="Número de túneles detectados..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: (role) => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_13_fam_asfalto', {type:'text', data:document.getElementById('t-count').value}, role, true));
        }
    },
    "day_14_kid9_aliento": {
        day: 14 title: "Aliento de Volcán", role: "kid9", xp: 15, location: "Monte Fuji",
        render: () => `
            <p class="mission-desc">¡Estás sobre un volcán activo! Busca una piedra volcánica (oscura, ligera y con muchos agujeritos) en el suelo de la 5ª estación del Fuji. Hazle una foto como recuerdo geológico, pero recuerda dejarla donde estaba para respetar el espíritu del monte.</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto de la Piedra</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_14_kid9_aliento', {type:'text', data:'Piedra Fuji'}));
        }
    },
    "day_14_kid14_presion": {
        day: 14 title: "La Ley de la Presión", role: "kid14", xp: 20, location: "Monte Fuji",
        render: () => `
            <p class="mission-desc">Graba 5s de una bolsa de snacks hinchada por la altitud y explícalo.</p>
            <input type="file" id="v-file" accept="video/*" capture="environment" style="width:100%">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('v-file').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_14_kid14_presion', {type:'text', data:'Video presión'}));
        }
    },
    "day_14_fam_oxigeno": {
        day: 14 title: "Oxígeno Alpino", role: "both", xp: 20, location: "5ª Estación Fuji",
        render: () => `
            <p class="mission-desc">Mantén la respiración 15 segundos. ¿Cuesta más a 2.300m?</p>
            <div id="countdown" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-primary); margin:15px 0;">15</div>
            <button id="btn-start" class="btn-secondary" style="width:100%">Empezar Reto</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Conseguido</button>
        `,
        attachEvents: (role) => {
            let t=15; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                if(int) return;
                int = setInterval(() => { t--; document.getElementById('countdown').innerText=t; if(t<=0){clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden');} }, 1000);
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_14_fam_oxigeno', {type:'text', data:'Reto oxígeno OK'}, role, true));
        }
    },
    "day_15_kid9_shiraito": {
        day: 15 title: "Melodía de Shiraito", role: "kid9", xp: 20, location: "Cascada / Bosque",
        render: () => `
            <p class="mission-desc">Graba 10s del sonido ensordecedor de la cascada o el viento.</p>
            <button id="btn-rec" class="btn-secondary" style="width:100%">🔴 Grabar Audio</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            const btn = document.getElementById('btn-rec');
            btn.addEventListener('click', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mr = new MediaRecorder(stream);
                mr.start(); btn.innerText = "⏹ Grabando...";
                setTimeout(() => { mr.stop(); btn.innerText = "🎵 Grabado"; document.getElementById('btn-sub').classList.remove('hidden'); stream.getTracks().forEach(t=>t.stop()); }, 10000);
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_15_kid9_shiraito', {type:'text', data:'Audio Cascada'}));
        }
    },
    "day_15_kid14_brujula": {
        day: 15 title: "Brújula al Cráter", role: "kid14", xp: 25, location: "Lagos del Fuji",
        render: () => `
            <p class="mission-desc">Orienta el móvil exactamente hacia el pico del Fuji.</p>
            <div id="c-box" style="width:150px; height:150px; background:gray; border-radius:50%; margin:20px auto; display:flex; align-items:center; justify-content:center; font-size:3rem;">🌋</div>
            <p id="c-status" style="text-align:center;">Buscando pico...</p>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">¡Fijado!</button>
        `,
        attachEvents: () => {
            const box = document.getElementById('c-box');
            const sts = document.getElementById('c-status');
            const btn = document.getElementById('btn-sub');
            const handle = (e) => {
                let a = e.alpha;
                if(a > 350 || a < 10) { box.style.background='green'; sts.innerText='¡Pico localizado!'; btn.classList.remove('hidden'); }
                else { box.style.background='gray'; sts.innerText='Sigue girando...'; btn.classList.add('hidden'); }
            };
            window.addEventListener('deviceorientation', handle);
            btn.addEventListener('click', () => { window.removeEventListener('deviceorientation', handle); submitMission('day_15_kid14_brujula', {type:'text', data:'Orientación OK'}); });
        }
    },
    "day_16_kid9_gato": {
        day: 16 title: "El Gato Oculto", role: "kid9", xp: 15, location: "Kagurazaka (Tokio)",
        render: () => `
            <p class="mission-desc">Busca un dibujo, estatua o adorno de gato en este barrio famoso por ellos.</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto Gato</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_16_kid9_gato', {type:'text', data:'Foto gato'}));
        }
    },
    "day_16_kid14_vortice": {
        day: 16 title: "Vórtice Temporal", role: "kid14", xp: 20, location: "Tokio",
        render: () => `
            <p class="mission-desc">Foto donde se vea un templo antiguo y un rascacielos en el mismo encuadre.</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto Vórtice</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_16_kid14_vortice', {type:'text', data:'Foto vórtice'}));
        }
    },
    "day_16_fam_shinjuku": {
        day: 16 title: "Supervivencia Shinjuku", role: "both", xp: 25, location: "Estación Shinjuku",
        render: () => `
            <p class="mission-desc">Mide el tiempo que tardas en encontrar la salida correcta.</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-primary); margin:15px 0;">00:00</div>
            <button id="btn-start" class="btn-secondary" style="width:100%">Empezar Búsqueda</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">¡Salida Encontrada!</button>
        `,
        attachEvents: (role) => {
            let s=0; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('btn-sub').addEventListener('click', () => { clearInterval(int); submitMission('day_16_fam_shinjuku', {type:'text', data:`Tiempo: ${document.getElementById('chrono').innerText}`}, role, true); });
            setTimeout(() => document.getElementById('btn-sub').classList.remove('hidden'), 5000);
        }
    },
    "day_17_kid9_omikuji": {
        day: 17 title: "Destino Omikuji", role: "kid9", xp: 15, location: "Templo Senso-ji",
        render: () => `
            <p class="mission-desc">En el templo Senso-ji, agita la caja de madera y saca tu fortuna (Omikuji). Si es buena suerte, guárdala contigo. Si es mala, átala en el soporte metálico para dejar atrás la negatividad. Marca aquí qué destino te han dado los dioses hoy.</p>
            <div class="choice-grid">
                <button class="btn-secondary o-btn" data-v="Buena Suerte">🧧 Buena Suerte</button>
                <button class="btn-secondary o-btn" data-v="Mala Suerte">💀 Mala Suerte</button>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Sellar mi Destino</button>
        `,
        attachEvents: () => {
            let val='';
            document.querySelectorAll('.o-btn').forEach(b => b.addEventListener('click', function() { 
                document.querySelectorAll('.o-btn').forEach(x => x.classList.remove('selected'));
                this.classList.add('selected'); val = this.dataset.v; document.getElementById('btn-sub').classList.remove('hidden');
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_17_kid9_omikuji', {type:'text', data:val}));
        }
    },
    "day_17_kid14_gamer": {
        day: 17 title: "Arqueología Gamer", role: "kid14", xp: 20, location: "Akihabara",
        render: () => `
            <p class="mission-desc">Busca un juego raro en Super Potato y conviértelo a Euros.</p>
            <input type="text" id="g-name" placeholder="Nombre del juego..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="g-yen" placeholder="Precio en Yenes (¥)" style="width:100%; margin-bottom:10px;">
            <input type="number" id="g-eur" placeholder="Precio en Euros (€)" style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Conversión</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-sub').addEventListener('click', () => {
                const data = `Juego: ${document.getElementById('g-name').value} | ¥: ${document.getElementById('g-yen').value} | €: ${document.getElementById('g-eur').value}`;
                submitMission('day_17_kid14_gamer', {type:'text', data:data});
            });
        }
    },
    "day_17_fam_cervicales": {
        day: 17 title: "Cervicales de Acero", role: "both", xp: 20, location: "Skytree",
        render: () => `
            <p class="mission-desc">Apunta al cielo 90º durante 10 segundos bajo la torre.</p>
            <div id="a-box" style="width:100px; height:100px; border:4px solid white; margin:20px auto; transition:0.3s; display:flex; align-items:center; justify-content:center;">🗼</div>
            <div id="timer" style="font-size:2rem; text-align:center;">10</div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Reto Superado</button>
        `,
        attachEvents: (role) => {
            const box = document.getElementById('a-box');
            const tm = document.getElementById('timer');
            let sec=10; let int=null;
            const handle = (e) => {
                if(e.beta > 75) {
                    box.style.borderColor = 'var(--color-accent)';
                    if(!int) int = setInterval(() => { sec--; tm.innerText=sec; if(sec<=0){clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden');} }, 1000);
                } else {
                    box.style.borderColor = 'white';
                    clearInterval(int); int=null; sec=10; tm.innerText=10;
                }
            };
            window.addEventListener('deviceorientation', handle);
            document.getElementById('btn-sub').addEventListener('click', () => { window.removeEventListener('deviceorientation', handle); submitMission('day_17_fam_cervicales', {type:'text', data:'Ángulo mantenido'}, role, true); });
        }
    },
    "day_18_kid9_marea": {
        day: 18 title: "La Marea Humana", role: "kid9", xp: 20, location: "Cruce de Shibuya",
        render: () => `
            <p class="mission-desc">Suma a todas las personas con gafas de sol en un solo cruce.</p>
            <div style="display:flex; align-items:center; justify-content:center; gap:20px; margin:20px 0;">
                <button id="c-min" class="btn-secondary" style="font-size:2rem; width:60px;">-</button>
                <div id="c-val" style="font-size:3rem; font-weight:bold;">0</div>
                <button id="c-plus" class="btn-secondary" style="font-size:2rem; width:60px;">+</button>
            </div>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let c=0;
            document.getElementById('c-plus').addEventListener('click', () => { c++; document.getElementById('c-val').innerText = c; });
            document.getElementById('c-min').addEventListener('click', () => { if(c>0) c--; document.getElementById('c-val').innerText = c; });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_18_kid9_marea', {type:'number', data:c}));
        }
    },
    "day_18_kid14_tendencias": {
        day: 18 title: "Cazatendencias", role: "kid14", xp: 15, location: "Takeshita Street",
        render: () => `
            <p class="mission-desc">La calle Takeshita es el epicentro de la moda más loca del mundo. Tu misión como cazatendencias oficial es fotografiar el conjunto de ropa, accesorio o peinado más increíble y extravagante que veas pasar.</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto de la Tendencia</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_18_kid14_tendencias', {type:'text', data:'Foto moda'}));
        }
    },
    "day_19_kid9_mechas": {
        day: 19 title: "Piloto de Mechas", role: "kid9", xp: 20, location: "Odaiba",
        render: () => `
            <p class="mission-desc">¡Frente a ti tienes un robot gigante real! El Gundam Unicorn entra en "modo combate" a ciertas horas del día. Graba un vídeo corto del momento en el que mueve su armadura, cambia de color o despliega su cuerno de unicornio.</p>
            <input type="file" id="v-file" accept="video/*" capture="environment" style="width:100%">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('v-file').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_19_kid9_mechas', {type:'text', data:'Video Gundam'}));
        }
    },
    "day_19_kid14_luz": {
        day: 19 title: "Cazador de Luz (G)", role: "kid14", xp: 25, location: "TeamLab Planets",
        render: () => `
            <div style="background:rgba(255,0,0,0.2); padding:10px; border-radius:10px; border:2px solid red; margin-bottom:15px;">
                <p style="color:red; font-weight:bold; margin:0;">⚠️ ADVERTENCIA DEL JUEZ: Prohibido hacer esta prueba en las salas de agua. Hazla en el Jardín de Musgo o Flores Flotantes.</p>
            </div>
            <p class="mission-desc">Iguala el color predominante de la sala usando este selector.</p>
            <input type="color" id="c-pick" style="width:100%; height:100px; border:none; background:none;">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Fijar Color</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_19_kid14_luz', {type:'text', data:document.getElementById('c-pick').value}));
        }
    },
    "day_20_kid9_bento": {
        day: 20 title: "Maestro del Bento (G)", role: "kid9", xp: 25, location: "Ueno / Yanaka",
        render: () => `
            <p class="mission-desc">Minijuego: Pulsa los ingredientes en orden (Arroz -> Pescado -> Verdura).</p>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; text-align:center; font-size:2rem;">
                <div id="i-3" class="card" style="cursor:pointer">🥦</div>
                <div id="i-1" class="card" style="cursor:pointer">🍚</div>
                <div id="i-2" class="card" style="cursor:pointer">🐟</div>
            </div>
            <p id="b-sts" style="text-align:center; margin-top:10px;"></p>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Bento Preparado</button>
        `,
        attachEvents: () => {
            let step=1;
            const sts = document.getElementById('b-sts');
            [1,2,3].forEach(i => document.getElementById('i-'+i).addEventListener('click', function() {
                if(i===step) { this.style.background='green'; step++; if(step>3){ sts.innerText='¡Perfecto!'; document.getElementById('btn-sub').classList.remove('hidden'); } }
                else { sts.innerText='¡Error! Empieza por el arroz.'; step=1; [1,2,3].forEach(x=>document.getElementById('i-'+x).style.background=''); }
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_20_kid9_bento', {type:'text', data:'Bento OK'}));
        }
    },
    "day_20_kid14_ameyoko": {
        day: 20 title: "Regateo en Ameyoko", role: "kid14", xp: 20, location: "Mercado Ameyoko",
        render: () => `
            <p class="mission-desc">Calcula el cambio exacto antes de que el vendedor te lo dé.</p>
            <input type="number" id="p-total" placeholder="Precio pagado..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="p-change" placeholder="Cambio esperado..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_20_kid14_ameyoko', {type:'text', data: `Pago: ${document.getElementById('p-total').value} | Cambio: ${document.getElementById('p-change').value}`}));
        }
    },
    "day_21_kid9_monos": {
        day: 21 title: "Los Tres Monos", role: "kid9", xp: 15, location: "Nikko o Kamakura",
        render: () => `
            <p class="mission-desc">Recrea con tu familia la pose de los 3 monos sabios (🙊 🙉 🙈).</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto Pose</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_21_kid9_monos', {type:'text', data:'Foto monos'}));
        }
    },
    "day_21_kid14_imperial": {
        day: 21 title: "Ingeniero Imperial", role: "kid14", xp: 20, location: "Excursión Histórica",
        render: () => `
            <p class="mission-desc">Busca qué Shogun está enterrado aquí o cuánto pesa el Gran Buda.</p>
            <textarea id="i-fact" placeholder="Dato sorprendente..." style="width:100%; height:80px;"></textarea>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Hallazgo</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_21_kid14_imperial', {type:'text', data:document.getElementById('i-fact').value}));
        }
    },
    "day_22_kid9_pescadero": {
        day: 22 title: "Grito de Pescadero", role: "kid9", xp: 20, location: "Mercado Toyosu",
        render: () => `
            <p class="mission-desc">Graba tu mejor "¡Irasshaimase!" con todas tus fuerzas.</p>
            <button id="btn-rec" class="btn-secondary" style="width:100%">🔴 Grabar Saludo</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            const btn = document.getElementById('btn-rec');
            btn.addEventListener('click', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mr = new MediaRecorder(stream);
                mr.start(); btn.innerText = "⏹ ¡GRITA!";
                setTimeout(() => { mr.stop(); btn.innerText = "🔊 Grabado"; document.getElementById('btn-sub').classList.remove('hidden'); stream.getTracks().forEach(t=>t.stop()); }, 4000);
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_22_kid9_pescadero', {type:'text', data:'Audio Irasshaimase'}));
        }
    },
    "day_22_kid14_ginza": {
        day: 22 title: "La Joya de Ginza", role: "kid14", xp: 15, location: "Ginza",
        render: () => `
            <p class="mission-desc">Encuentra el artículo más absurdamente caro en Ginza.</p>
            <input type="text" id="g-item" placeholder="Artículo..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="g-price" placeholder="Precio en Yenes (¥)" style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_22_kid14_ginza', {type:'text', data: `Item: ${document.getElementById('g-item').value} | ¥: ${document.getElementById('g-price').value}`}));
        }
    },
    "day_23_kid9_kitkat": {
        day: 23 title: "Buscador de KitKat", role: "kid9", xp: 15, location: "Don Quijote",
        render: () => `
            <p class="mission-desc">Marca los sabores raros que veas (mín. 3).</p>
            <div class="card" style="text-align:left;">
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="k-chk"> 🍵 Té Matcha</label>
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="k-chk"> 🍓 Fresa</label>
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="k-chk"> 🍈 Melón</label>
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="k-chk"> 🍶 Sake</label>
                <label style="display:block; margin:10px 0;"><input type="checkbox" class="k-chk"> 🍣 Wasabi</label>
            </div>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px; opacity:0.5;" disabled>Enviar al Juez</button>
        `,
        attachEvents: () => {
            const chks = document.querySelectorAll('.k-chk');
            const btn = document.getElementById('btn-sub');
            chks.forEach(c => c.addEventListener('change', () => {
                const count = Array.from(chks).filter(x => x.checked).length;
                btn.disabled = count < 3; btn.style.opacity = count >= 3 ? '1' : '0.5';
            }));
            btn.addEventListener('click', () => submitMission('day_23_kid9_kitkat', {type:'text', data:'Sabores encontrados'}));
        }
    },
    "day_23_kid14_tetris": {
        day: 14 title: "Tetris de Maletas (G)", role: "kid14", xp: 25, location: "Hotel / Despedida",
        render: () => `
            <p class="mission-desc">Gira el bloque para que encaje en el hueco.</p>
            <div style="display:flex; justify-content:center; padding:20px;">
                <div id="t-block" style="width:60px; height:100px; background:var(--color-primary); transition:0.3s; transform:rotate(0deg); border-radius:5px;"></div>
            </div>
            <button id="btn-rot" class="btn-secondary" style="width:100%">🔄 Girar 90º</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Encajar Maleta</button>
        `,
        attachEvents: () => {
            let r=0;
            const b = document.getElementById('t-block');
            document.getElementById('btn-rot').addEventListener('click', () => {
                r += 90; b.style.transform = `rotate(${r}deg)`;
                if(r % 360 === 90 || r % 360 === 270) document.getElementById('btn-sub').classList.remove('hidden');
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_23_kid14_tetris', {type:'text', data:'Maleta encajada'}));
        }
    },
    "day_24_fam_sayonara": {
        day: 24 title: "Sayonara Japón", role: "both", xp: 50, location: "Aeropuerto",
        render: () => `
            <p class="mission-desc">Esta gran aventura ha llegado a su fin, pero tus recuerdos durarán para siempre. Antes de sellar tu pasaporte por última vez en el aeropuerto, escribe aquí cuáles han sido tus 3 momentos o lugares favoritos de todo el viaje.</p>
            <textarea id="top-3" placeholder="Mi momento favorito fue... 1, 2 y 3."></textarea>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Sellar Pasaporte Final</button>
        `,
        attachEvents: (role) => {
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_24_fam_sayonara', {type:'text', data:document.getElementById('top-3').value}, role, true));
        }
    },

    // ==========================================
    // MISIONES EXPERTAS — APIs Nativas del Navegador
    // ==========================================

    // -------------------------------------------------------
    // MISIÓN EXPERTA 1: "El Silencio de los Kami" — Web Audio API
    // Día 12 (Takayama) | Niño 9 años
    // El niño debe permanecer en silencio absoluto 10 segundos.
    // Si hace ruido, el espíritu se despierta y se reinicia el contador.
    // Umbral de silencio: media de frecuencias < 30 (ajustable según ambiente).
    // -------------------------------------------------------
    "day_12_kid9_silence": {
        tag: "expert", day: 12, title: "El Silencio de los Kami", role: "kid9", xp: 30, location: "Templos de Takayama",
        render: () => `
            <div class="ui-kids">
                <p class="kids-title">No despiertes al espíritu del bosque... 🤫</p>
                <div id="kami-circle" class="kids-circle sleeping">
                    <span id="kami-emoji">😴💤</span>
                </div>
                <p class="mission-desc" style="color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5);">¡Silencio absoluto! Los espíritus Kami descansan en este bosque. Debes mantener un silencio total durante 10 segundos. Si el sensor detecta ruido, el Kami se despertará y el contador volverá a cero.</p>
                <p id="kami-status" class="kids-title">Pulsa para empezar el ritual</p>
                <div class="kids-progress"><div id="kami-progress" class="kids-progress-fill"></div></div>
                <button id="kami-start" class="kids-btn kids-btn-start">🤫 Iniciar Ritual</button>
                <button id="kami-submit" class="kids-btn kids-btn-submit hidden">Enviar al Juez ✨</button>
            </div>
        `,
        attachEvents: () => {
            const SILENCE_THRESHOLD = 30; // Ajustable según ambiente
            const REQUIRED_SECONDS = 10;
            let audioCtx = null;
            let stream = null;
            let analyser = null;
            let animFrame = null;
            let silenceStart = null;
            let active = false;
            let completed = false;

            const circle = () => document.getElementById('kami-circle');
            const emoji = () => document.getElementById('kami-emoji');
            const status = () => document.getElementById('kami-status');
            const progress = () => document.getElementById('kami-progress');

            function updateLoop() {
                if (!active || completed) return;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a b) => a + b, 0) / dataArray.length;

                if (avg < SILENCE_THRESHOLD) {
                    // Silencio mantenido
                    if (!silenceStart) silenceStart = Date.now();
                    const elapsed = (Date.now() - silenceStart) / 1000;
                    const pct = Math.min(100, (elapsed / REQUIRED_SECONDS) * 100);
                    if (progress()) progress().style.width = pct + '%';
                    if (circle()) { circle().className = 'kids-circle sleeping'; }
                    if (emoji()) emoji().innerText = '😴💤';
                    if (status()) status().innerText = `Silencio... ${Math.floor(elapsed)}s / ${REQUIRED_SECONDS}s`;

                    if (elapsed >= REQUIRED_SECONDS) {
                        // ¡Completado!
                        completed = true;
                        active = false;
                        if (circle()) circle().className = 'kids-circle blessed';
                        if (emoji()) emoji().innerText = '🥰✨';
                        if (status()) status().innerText = '¡El Kami te bendice con el silencio!';
                        if (progress()) progress().style.width = '100%';
                        document.getElementById('kami-submit').classList.remove('hidden');
                        // Liberar recursos de audio
                        if (stream) stream.getTracks().forEach(t => t.stop());
                        if (audioCtx) audioCtx.close();
                        return;
                    }
                } else {
                    // ¡Ruido! Reiniciar
                    silenceStart = null;
                    if (progress()) progress().style.width = '0%';
                    if (circle()) circle().className = 'kids-circle alert';
                    if (emoji()) emoji().innerText = '😱';
                    if (status()) status().innerText = '¡Shhh! Se ha despertado... vuelve a intentarlo';
                    setTimeout(() => {
                        if (active && circle()) {
                            circle().className = 'kids-circle sleeping';
                            if (emoji()) emoji().innerText = '😴💤';
                            if (status()) status().innerText = 'Silencio de nuevo...';
                        }
                    }, 1500);
                }
                animFrame = requestAnimationFrame(updateLoop);
            }

            document.getElementById('kami-start').addEventListener('click', async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: { echoCancellation: true noiseSuppression: true }
                    });
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const source = audioCtx.createMediaStreamSource(stream);
                    analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    active = true;
                    document.getElementById('kami-start').classList.add('hidden');
                    if (status()) status().innerText = 'Escuchando... mantén el silencio';
                    updateLoop();
                } catch (err) {
                    if (status()) status().innerText = '⚠️ No se pudo acceder al micrófono. Comprueba los permisos del navegador.';
                    console.warn('Microphone error:', err);
                }
            });

            document.getElementById('kami-submit').addEventListener('click', () => {
                submitMission('day_12_kid9_silence', { type: 'silence', data: 'Silencio mantenido 10s' });
            });

            // Cleanup al salir de la misión
            window._missionCleanup = () => {
                active = false;
                completed = true;
                if (animFrame) cancelAnimationFrame(animFrame);
                if (stream) stream.getTracks().forEach(t => t.stop());
                if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
            };
        }
    },

    // -------------------------------------------------------
    // MISIÓN EXPERTA 2: "Radar de Altitud Cero" — Geolocation API
    // Día 14 (Monte Fuji - 5ª Estación) | Niño 14 años
    // Interfaz terminal hacker. GPS offline-first.
    // Objetivo: lat 35.3789, lon 138.7318 (aparcamiento 5ª Estación Subaru).
    // Fórmula de Haversine para distancia en metros.
    // -------------------------------------------------------
    "day_14_kid14_radar": {
        tag: "expert", day: 14, title: "Radar de Altitud Cero", role: "kid14", xp: 35, location: "5ª Estación Monte Fuji",
        render: () => `
            <div class="ui-terminal">
                <div class="term-line dim">[SISTEMA] Cargando módulo de rastreo...</div>
                <div class="term-line" style="color: #00ff00; margin-bottom: 10px;">OBJETIVO: ¡Misión de Geolocalización! Debes moverte físicamente hasta estar a menos de 500 metros del punto exacto de la 5ª Estación del Fuji. El radar emitirá bips más rápidos y la señal se fortalecerá a medida que te acerques al nodo.</div>
                <div class="term-line">> INICIANDO PROTOCOLO DE RASTREO...</div>
                <div class="term-line">> OBJETIVO: NODO [35.3789°N, 138.7318°E]</div>
                <div class="term-line dim">> Aparcamiento 5ª Estación Subaru Line</div>
                <div class="term-line">></div>
                <div id="radar-gps" class="term-line dim">Calibrando señal GPS...<span class="term-bip"></span></div>
                <div id="radar-dist" class="term-distance">---m</div>
                <div id="radar-signal" class="term-signal signal-weak">SEÑAL: ESPERANDO</div>
                <div id="radar-accuracy" class="term-line dim"></div>
                <div id="radar-bip-zone" style="text-align:center; font-size:1.5rem; margin:10px 0;"><span id="radar-bip-char" class="term-bip"></span></div>
                <button id="radar-start" class="term-btn">> ACTIVAR_RADAR.exe</button>
                <button id="radar-submit" class="term-btn hidden">> ENVIAR_COORDENADAS_AL_JUEZ.exe</button>
            </div>
        `,
        attachEvents: () => {
            // Coordenada objetivo: 5ª Estación Fuji (Subaru Line parking)
            const TARGET = { lat: 35.3789 lon: 138.7318 };
            let watchId = null;
            let bipInterval = null;
            let readingsCount = 0;
            let lastDistance = null;

            // Fórmula de Haversine (devuelve metros)
            function haversine(lat1, lon1, lat2, lon2) {
                const R = 6371000; // Radio de la Tierra en metros
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) ** 2 +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) ** 2;
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            }

            function updateBipRate(dist) {
                if (bipInterval) clearInterval(bipInterval);
                // Más cerca = bip más rápido (1000ms a 100m, 100ms a <10m)
                const rate = Math.max(100, Math.min(1000, dist * 10));
                const bip = document.getElementById('radar-bip-char');
                if (!bip) return;
                bipInterval = setInterval(() => {
                    if (bip) {
                        bip.style.opacity = bip.style.opacity === '0' ? '1' : '0';
                    }
                }, rate);
            }

            function onPosition(pos) {
                readingsCount++;
                const acc = pos.coords.accuracy;
                const gpsEl = document.getElementById('radar-gps');
                const accEl = document.getElementById('radar-accuracy');

                // Esperar 3 lecturas y precisión < 20m antes de mostrar datos
                if (readingsCount < 3 || acc > 20) {
                    if (gpsEl) gpsEl.innerHTML = `Calibrando señal GPS... (precisión: ${Math.round(acc)}m)<span class="term-bip"></span>`;
                    if (accEl) accEl.innerText = `[Lecturas: ${readingsCount}/3 | Precisión requerida: <20m]`;
                    return;
                }

                const dist = haversine(pos.coords.latitude, pos.coords.longitude, TARGET.lat, TARGET.lon);
                lastDistance = Math.round(dist);

                if (gpsEl) gpsEl.innerHTML = `> Posición: ${pos.coords.latitude.toFixed(6)}°N, ${pos.coords.longitude.toFixed(6)}°E`;
                if (accEl) accEl.innerText = `[Precisión: ±${Math.round(acc)}m | Lecturas: ${readingsCount}]`;

                const distEl = document.getElementById('radar-dist');
                if (distEl) distEl.innerText = lastDistance + 'm';

                const sigEl = document.getElementById('radar-signal');
                if (sigEl) {
                    if (lastDistance > 100) {
                        sigEl.className = 'term-signal signal-weak';
                        sigEl.innerText = 'SEÑAL DÉBIL — Sigue avanzando';
                    } else if (lastDistance > 20) {
                        sigEl.className = 'term-signal signal-medium';
                        sigEl.innerText = 'SEÑAL MEDIA — Te acercas al nodo';
                    } else if (lastDistance > 10) {
                        sigEl.className = 'term-signal signal-strong';
                        sigEl.innerText = 'SEÑAL FUERTE — Muy cerca';
                    } else {
                        sigEl.className = 'term-signal signal-found';
                        sigEl.innerText = '>>> NODO LOCALIZADO <<<';
                        document.getElementById('radar-submit').classList.remove('hidden');
                    }
                }
                updateBipRate(lastDistance);
            }

            function onError(err) {
                const gpsEl = document.getElementById('radar-gps');
                if (gpsEl) gpsEl.innerHTML = `<span class="error">ERROR: ${err.message}. Comprueba permisos GPS.</span>`;
            }

            document.getElementById('radar-start').addEventListener('click', () => {
                if (!navigator.geolocation) {
                    document.getElementById('radar-gps').innerHTML = '<span class="error">ERROR: GPS no disponible en este dispositivo.</span>';
                    return;
                }
                document.getElementById('radar-start').classList.add('hidden');
                document.getElementById('radar-gps').innerHTML = 'Activando receptor GPS...<span class="term-bip"></span>';
                watchId = navigator.geolocation.watchPosition(onPosition, onError, {
                    enableHighAccuracy: true
                    maximumAge: 0,
                    timeout: 10000
                });
            });

            document.getElementById('radar-submit').addEventListener('click', () => {
                if (watchId !== null) navigator.geolocation.clearWatch(watchId);
                if (bipInterval) clearInterval(bipInterval);
                submitMission('day_14_kid14_radar', { type: 'geolocation', data: `Nodo localizado. Distancia final: ${lastDistance}m` });
            });

            // Cleanup
            window._missionCleanup = () => {
                if (watchId !== null) navigator.geolocation.clearWatch(watchId);
                if (bipInterval) clearInterval(bipInterval);
                watchId = null;
            };
        }
    },

    // -------------------------------------------------------
    // MISIÓN EXPERTA 3: "Desencriptar Protocolo Mecha" — Web Crypto API
    // Día 19 (Odaiba / Gundam Unicorn) | Niño 14 años
    // El niño busca "RX-0" en el Gundam real y lo usa como clave AES-GCM.
    // Mensaje pre-encriptado con Node.js crypto (script auxiliar en comentarios).
    // La clave "RX-0" es pública (modelo del Gundam Unicorn), no es un secreto.
    // -------------------------------------------------------
    // SCRIPT AUXILIAR DE PRE-ENCRIPTACIÓN (ejecutar una vez con Node.js):
    // const crypto = require('crypto');
    // const msg = "Sistema Operativo Comprometido. Modo Juez Activado.";
    // const keyHash = crypto.createHash('sha256').update('RX-0').digest();
    // const iv = crypto.randomBytes(12);
    // const cipher = crypto.createCipheriv('aes-256-gcm', keyHash, iv);
    // let enc = Buffer.concat([cipher.update(msg, 'utf8'), cipher.final(), cipher.getAuthTag()]);
    // console.log('IV:', Array.from(iv)); console.log('Ciphertext:', Array.from(enc));
    "day_19_kid14_crypto": {
        tag: "expert", day: 19, title: "Desencriptar Protocolo Mecha", role: "kid14", xp: 35, location: "Odaiba — Gundam Unicorn",
        render: () => {
            // Texto encriptado mostrado como hexadecimal decorativo
            const hexDisplay = '9f3e11166d97ae449508ff584d9818f629a6d9a21a3b3366f7fdeb4718b29bcfc6d6bff6b1650f062eca2d8a7493ebb8809a8a9d5e9f34e0bb92f8d2653b7443';
            return `
            <div class="ui-terminal">
                <div class="term-line dim">[SISTEMA] Protocolo de seguridad Unicorn v3.7</div>
                <div class="term-line" style="color: #00ff00; margin-bottom: 10px;">OBJETIVO: Intercepta y descifra el mensaje secreto del Gundam. Debes encontrar el código del modelo (pista: está en su hombro) e introducirlo como clave AES-256 para romper la encriptación.</div>
                <div class="term-line">> Se ha interceptado una transmisión cifrada:</div>
                <div class="term-line dim" style="word-break:break-all; margin:10px 0; padding:10px; background:#111; border:1px solid #333;">0x${hexDisplay}</div>
                <div class="term-line">> Algoritmo detectado: AES-256-GCM</div>
                <div class="term-line">> Se requiere clave de desencriptación.</div>
                <div class="term-line bright">> PISTA: Busca el código del modelo en el hombro del Mecha.</div>
                <div class="term-line">></div>
                <input id="crypto-key" class="term-input" type="text" placeholder="Introduce la clave..." autocomplete="off" autocorrect="off" spellcheck="false">
                <button id="crypto-decrypt" class="term-btn">> EJECUTAR_DESENCRIPTACION.exe</button>
                <div id="crypto-output"></div>
                <button id="crypto-submit" class="term-btn hidden">> ENVIAR_AL_JUEZ.exe</button>
            </div>
            `;
        },
        attachEvents: () => {
            // Valores pre-encriptados (generados con el script auxiliar)
            const IV = new Uint8Array([46, 187, 107, 191, 235, 249, 194, 201, 202, 253, 204, 88]);
            const CIPHERTEXT = new Uint8Array([159, 62, 17, 22, 109, 151, 174, 68, 149, 8, 255, 88, 77, 152, 24, 246, 41, 166, 217, 162, 26, 59, 51, 102, 247, 253, 235, 71, 24, 178, 155, 207, 198, 214, 191, 246, 177, 101, 15, 6, 46, 202, 45, 138, 116, 147, 235, 184, 128, 154, 138, 157, 94, 159, 52, 224, 187, 146, 248, 210, 101, 59, 116, 67, 142, 133, 176]);

            const output = () => document.getElementById('crypto-output');

            // Efecto typewriter
            function typewrite(el, text, className, callback) {
                el.innerHTML = '';
                const line = document.createElement('div');
                line.className = 'term-line ' + (className || '');
                el.appendChild(line);
                let i = 0;
                const int = setInterval(() => {
                    line.textContent += text[i];
                    i++;
                    if (i >= text.length) {
                        clearInterval(int);
                        if (callback) callback();
                    }
                }, 40);
            }

            document.getElementById('crypto-decrypt').addEventListener('click', async () => {
                const keyText = document.getElementById('crypto-key').value.trim();
                if (!keyText) return;

                const out = output();
                out.innerHTML = '<div class="term-line">>>> Ejecutando Protocolo de Desencriptación AES-GCM...<span class="term-bip"></span></div>';

                try {
                    // SHA-256 de la clave introducida
                    const encoder = new TextEncoder();
                    const keyData = await crypto.subtle.digest('SHA-256', encoder.encode(keyText));

                    // Importar como CryptoKey para AES-GCM
                    const cryptoKey = await crypto.subtle.importKey(
                        'raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']
                    );

                    // Intentar desencriptar
                    const decrypted = await crypto.subtle.decrypt(
                        { name: 'AES-GCM', iv: IV }, cryptoKey, CIPHERTEXT
                    );

                    const plaintext = new TextDecoder().decode(decrypted);

                    // ¡Clave correcta! Typewriter del mensaje
                    setTimeout(() => {
                        typewrite(out '>>> ' + plaintext, 'gold', () => {
                            document.getElementById('crypto-submit').classList.remove('hidden');
                        });
                    }, 800);

                } catch (err) {
                    // Clave incorrecta — AES-GCM lanza error automáticamente
                    out.innerHTML = '<div class="term-line error">>>> ERROR: Clave inválida. Sistema bloqueado.</div><div class="term-line error">>>> Busca el código correcto en la máquina.</div>';
                    document.getElementById('crypto-key').value = '';
                }
            });

            document.getElementById('crypto-submit').addEventListener('click', () => {
                submitMission('day_19_kid14_crypto', { type: 'decryption', data: 'Protocolo desencriptado con éxito' });
            });

            // No necesita cleanup (sin recursos persistentes)
            window._missionCleanup = null;
        }
    },

    // -------------------------------------------------------
    // MISIÓN EXPERTA 4: "El Latido del Dragón" — DOM Feedback / CSS
    // Día 21 (Nikko / Kamakura) | Niño 9 años
    // Feedback háptico simulado con CSS (sin navigator.vibrate por iOS).
    // El niño avanza pulsando un botón, el latido se acelera hasta despertar al dragón.
    // -------------------------------------------------------
    "day_21_kid9_dragon": {
        tag: "expert", day: 21, title: "El Latido del Dragón", role: "kid9", xp: 30, location: "Mausoleo del Shogun",
        render: () => `
            <div class="ui-kids" id="dragon-container" style="background: linear-gradient(180deg, #1a0000 0%, #0a0000 100%);">
                <p class="mission-desc" style="color: #ff4444; font-weight: bold;">¡El Dragón de Nikko duerme! Debes avanzar con sigilo sincronizando tus pasos con su latido. Si llegas al final sin despertarlo bruscamente, habrás completado la misión del mausoleo.</p>
                <p class="kids-title">Acércate al mausoleo del Shogun...<br>¿Sientes el latido? 🐉</p>
                <div id="dragon-gem" class="dragon-gem">💎</div>
                <div id="dragon-fire" class="fire-bar">
                    <span>🔥</span><span>🔥</span><span>🔥</span><span>🔥</span>
                    <span>🔥</span><span>🔥</span><span>🔥</span><span>🔥</span>
                </div>
                <p id="dragon-steps" class="kids-title">Pasos hacia el dragón: 0 / 8</p>
                <button id="dragon-advance" class="kids-btn kids-btn-start" style="min-width:260px;">🐾 Avanzar hacia el dragón</button>
                <button id="dragon-submit" class="kids-btn kids-btn-submit hidden">Enviar al Juez ✨</button>
            </div>
        `,
        attachEvents: () => {
            const MAX_STEPS = 8;
            const INITIAL_RATE = 2000; // ms entre latidos
            const MIN_RATE = 300;      // ms mínimo
            let steps = 0;
            let rate = INITIAL_RATE;
            let beatInterval = null;
            let isPulsed = false;
            let awakened = false;

            const gem = () => document.getElementById('dragon-gem');
            const container = () => document.getElementById('dragon-container');
            const fires = () => document.querySelectorAll('#dragon-fire span');

            function startBeat() {
                if (beatInterval) clearInterval(beatInterval);
                beatInterval = setInterval(() => {
                    if (awakened) return;
                    const g = gem();
                    const c = container();
                    if (!g) return;
                    if (isPulsed) {
                        g.classList.remove('pulse');
                        if (c) c.style.background = 'linear-gradient(180deg, #0a0000 0%, #050000 100%)';
                    } else {
                        g.classList.add('pulse');
                        if (c) c.style.background = 'linear-gradient(180deg, #1a0000 0%, #0a0000 100%)';
                    }
                    isPulsed = !isPulsed;
                }, rate);
            }

            // Iniciar latido lento
            startBeat();

            // Actualizar fuegos
            function updateFires() {
                const f = fires();
                f.forEach((span i) => {
                    span.classList.toggle('active', i < steps);
                });
            }

            document.getElementById('dragon-advance').addEventListener('click', () => {
                if (awakened) return;
                steps++;
                // Reducir intervalo del latido
                rate = Math.max(MIN_RATE, INITIAL_RATE - (steps * 250));
                startBeat();
                updateFires();

                const stepsEl = document.getElementById('dragon-steps');
                if (stepsEl) stepsEl.innerText = `Pasos hacia el dragón: ${steps} / ${MAX_STEPS}`;

                if (steps >= MAX_STEPS) {
                    // ¡El dragón despierta!
                    awakened = true;
                    if (beatInterval) clearInterval(beatInterval);
                    const g = gem();
                    const c = container();
                    if (g) {
                        g.classList.remove('pulse');
                        g.classList.add('awaken');
                        g.innerText = '🐉';
                    }
                    // Flash blanco
                    if (c) {
                        c.style.background = '#ffffff';
                        c.style.transition = 'background 0.5s';
                        setTimeout(() => {
                            if (c) c.style.background = 'linear-gradient(180deg, #2a1a00 0%, #1a0a00 100%)';
                        }, 400);
                    }
                    if (stepsEl) stepsEl.innerText = '¡El dragón te ha sentido! Has llegado al corazón del mausoleo.';
                    document.getElementById('dragon-advance').classList.add('hidden');
                    document.getElementById('dragon-submit').classList.remove('hidden');
                    // Partículas de celebración
                    launchConfetti();
                }
            });

            document.getElementById('dragon-submit').addEventListener('click', () => {
                submitMission('day_21_kid9_dragon', { type: 'heartbeat', data: `Dragón despertado en ${steps} pasos` });
            });

            // Cleanup
            window._missionCleanup = () => {
                if (beatInterval) clearInterval(beatInterval);
                awakened = true;
            };
        }
    }
,
    "day_23_kid9_pokedex": {
        tag: "expert", day: 23, title: "Pokédex de Supermercado", role: "kid9", xp: 30, location: "Don Quijote",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5);">¡Encuentra un snack raro y escanea su código de barras para capturarlo en tu Pokédex!</p>
                <div id="scanner-container" style="position: relative; width: 100%; max-width: 300px; margin: 0 auto; border: 4px solid #fff; border-radius: 10px; overflow: hidden; background: #000; aspect-ratio: 4/3; display: none;">
                    <video id="scanner-video" style="width: 100%; height: 100%; object-fit: cover;" autoplay playsinline></video>
                    <div id="scan-line" style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: red; box-shadow: 0 0 10px red;"></div>
                </div>
                <div id="fallback-container" style="display: none; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; text-align: center;">
                    <p style="color: #f1c40f;">Modo Offline: ¡Teclea los números del código de barras!</p>
                    <input type="number" id="barcode-input" placeholder="8 a 13 números..." style="width: 100%; padding: 15px; font-size: 1.5rem; text-align: center; letter-spacing: 2px;">
                    <button id="btn-fallback" class="btn-primary" style="margin-top: 15px; width: 100%;">Validar Código</button>
                </div>
                <div id="success-screen" style="display: none; text-align: center;">
                    <div style="font-size: 4rem;">🎉</div>
                    <p style="color: #2ecc71; font-weight: bold; font-size: 1.2rem;">¡Snack Japonés Capturado!</p>
                    <input type="text" id="snack-name" placeholder="¿Qué has capturado?" style="width: 100%; margin: 15px 0;">
                    <button id="btn-submit" class="btn-primary" style="width: 100%;">Enviar al Juez</button>
                </div>
            </div>
            <style>
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                #scan-line { animation: scan 2s linear infinite; }
            </style>
        `,
        attachEvents: () => {
            const scannerCont = document.getElementById('scanner-container');
            const fallbackCont = document.getElementById('fallback-container');
            const video = document.getElementById('scanner-video');
            const successScreen = document.getElementById('success-screen');
            const btnSubmit = document.getElementById('btn-submit');
            let streamRef = null;
            let scanning = true;

            const stopScanner = () => {
                scanning = false;
                if(streamRef) {
                    streamRef.getTracks().forEach(t => t.stop());
                    streamRef = null;
                }
            };

            const showSuccess = (code) => {
                stopScanner();
                scannerCont.style.display = 'none';
                fallbackCont.style.display = 'none';
                successScreen.style.display = 'block';
                document.body.style.backgroundColor = '#2ecc71';
                setTimeout(() => document.body.style.backgroundColor = '', 500);
            };

            if ('BarcodeDetector' in window) {
                const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'qr_code'] });
                navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(stream => {
                    streamRef = stream;
                    video.srcObject = stream;
                    scannerCont.style.display = 'block';
                    
                    const scanLoop = () => {
                        if(!scanning) return;
                        detector.detect(video).then(barcodes => {
                            if(barcodes.length > 0) {
                                showSuccess(barcodes[0].rawValue);
                            } else {
                                requestAnimationFrame(scanLoop);
                            }
                        }).catch(() => requestAnimationFrame(scanLoop));
                    };
                    video.addEventListener('play', () => scanLoop());
                })
                .catch(() => {
                    fallbackCont.style.display = 'block';
                });
            } else {
                fallbackCont.style.display = 'block';
            }

            document.getElementById('btn-fallback').addEventListener('click', () => {
                const val = document.getElementById('barcode-input').value;
                if(val.length >= 8) showSuccess(val);
                else showAlert("Error", "Introduce al menos 8 números");
            });

            btnSubmit.addEventListener('click', () => {
                const snack = document.getElementById('snack-name').value || "Snack Misterioso";
                submitMission('day_23_kid9_pokedex', {type: 'expert', data: 'Código de barras de: ' + snack});
            });

            window._missionCleanup = () => stopScanner();
        }
    },
    "day_21_kid9_samurai": {
        tag: "expert", day: 21, title: "El Tajo del Samurái", role: "kid9", xp: 30, location: "Excursión",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color: #fff;">Sujeta tu móvil con las dos manos. Prepara tu tajo...</p>
                <div style="font-size: 5rem; text-align: center; margin: 20px 0;">⚔️</div>
                <div id="countdown" style="font-size: 4rem; text-align: center; font-weight: bold; color: #f1c40f;"></div>
                <div id="slash-fx" style="position: fixed; top: 0; left: 50%; width: 5px; height: 100vh; background: #fff; box-shadow: 0 0 20px #fff; transform: translateX(-50%) rotate(15deg); opacity: 0; pointer-events: none; transition: opacity 0.2s;"></div>
                <button id="btn-start" class="btn-secondary" style="width: 100%;">Permitir Sensores y Empezar</button>
                <div id="success-screen" style="display: none; text-align: center; margin-top: 20px;">
                    <p style="color: #2ecc71; font-weight: bold; font-size: 1.5rem;">¡Tajo impecable!</p>
                    <button id="btn-submit" class="btn-primary" style="width: 100%;">Enviar al Juez</button>
                </div>
            </div>
        `,
        attachEvents: () => {
            const btnStart = document.getElementById('btn-start');
            const countdownEl = document.getElementById('countdown');
            const slashFx = document.getElementById('slash-fx');
            const successScreen = document.getElementById('success-screen');
            let active = false;
            let handler = null;

            const handleMotion = (e) => {
                if(!active) return;
                const acc = e.accelerationIncludingGravity;
                if(!acc) return;
                const mag = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
                // Tajo vertical: Y negativa (hacia abajo fuerte)
                if (mag > 15 && acc.y < -10) {
                    active = false;
                    slashFx.style.opacity = '1';
                    setTimeout(() => slashFx.style.opacity = '0', 500);
                    successScreen.style.display = 'block';
                    countdownEl.innerText = "";
                }
            };

            const startDetection = () => {
                btnStart.style.display = 'none';
                let count = 3;
                countdownEl.innerText = count;
                const intv = setInterval(() => {
                    count--;
                    if(count > 0) {
                        countdownEl.innerText = count;
                    } else if(count === 0) {
                        countdownEl.innerText = "¡YA!";
                        countdownEl.style.color = "#e74c3c";
                        active = true;
                        handler = handleMotion;
                        window.addEventListener('devicemotion', handler);
                    } else if(count === -2) {
                        clearInterval(intv);
                        if(active) {
                            active = false;
                            countdownEl.innerText = "Lento. Intenta de nuevo.";
                            btnStart.style.display = 'block';
                            btnStart.innerText = "Reintentar";
                            window.removeEventListener('devicemotion', handler);
                        }
                    }
                }, 1000);
            };

            btnStart.addEventListener('click', () => {
                if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                    DeviceMotionEvent.requestPermission().then(res => {
                        if(res === 'granted') startDetection();
                    }).catch(console.error);
                } else {
                    startDetection();
                }
            });

            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_21_kid9_samurai', {type: 'expert', data: 'Tajo detectado (>15m/s2)'});
            });

            window._missionCleanup = () => {
                active = false;
                if(handler) window.removeEventListener('devicemotion', handler);
            };
        }
    },
    "day_17_kid14_p2p_gen": {
        tag: "expert", day: 17, title: "Enlace P2P (Emisor)", role: "kid14", xp: 25, location: "Akihabara",
        render: () => `
            <div class="ui-terminal">
                <p class="mission-desc">>> ACERTIJO: Una Famicom costaba 14800¥ en 1983. Una Neo Geo costaba 58000¥ en 1990. ¿Cuánto costaban juntas?</p>
                <input type="number" id="answer-input" placeholder="Respuesta..." style="background: #000; color: #0f0; border: 1px solid #0f0; margin-bottom: 15px;">
                <button id="btn-verify" class="btn-primary" style="width: 100%;">Verificar</button>
                <div id="code-result" style="display: none; margin-top: 20px;">
                    <p>>> ACCESO CONCEDIDO. CLAVE GENERADA:</p>
                    <div id="color-pattern" style="display: flex; gap: 5px; height: 60px; margin: 15px 0;"></div>
                    <p>>> Enseña este patrón a tu contacto (perfil menor) para completar el enlace.</p>
                    <button id="btn-submit" class="btn-primary" style="width: 100%; margin-top: 15px;">Enviar Enlace al Juez</button>
                </div>
            </div>
        `,
        attachEvents: () => {
            const btnVerify = document.getElementById('btn-verify');
            const resDiv = document.getElementById('code-result');
            const patternDiv = document.getElementById('color-pattern');
            let generatedPattern = [];

            btnVerify.addEventListener('click', () => {
                if(document.getElementById('answer-input').value == "72800") {
                    btnVerify.style.display = 'none';
                    const colors = ['red', 'blue', 'green', 'yellow'];
                    generatedPattern = [];
                    for(let i=0; i<4; i++) {
                        const c = colors[Math.floor(Math.random()*colors.length)];
                        generatedPattern.push(c);
                        const block = document.createElement('div');
                        block.style.flex = "1";
                        block.style.backgroundColor = c;
                        patternDiv.appendChild(block);
                    }
                    sessionStorage.setItem('p2p_pattern', JSON.stringify(generatedPattern));
                    resDiv.style.display = 'block';
                } else {
                    showAlert("ERROR", ">> Respuesta incorrecta.");
                }
            });

            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_17_kid14_p2p_gen', {type: 'expert', data: 'Patrón generado: ' + generatedPattern.join(',')});
            });
        }
    },
    "day_17_kid9_p2p_recv": {
        tag: "expert", day: 17, title: "Enlace P2P (Receptor)", role: "kid9", xp: 25, location: "Akihabara",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color:#fff;">Tu contacto mayor tiene un código secreto. Míralo en su pantalla y repítelo aquí.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                    <button class="color-btn" data-color="red" style="height: 80px; background: red;"></button>
                    <button class="color-btn" data-color="blue" style="height: 80px; background: blue;"></button>
                    <button class="color-btn" data-color="green" style="height: 80px; background: green;"></button>
                    <button class="color-btn" data-color="yellow" style="height: 80px; background: yellow;"></button>
                </div>
                <div id="sequence-display" style="display: flex; gap: 5px; height: 30px; margin-bottom: 20px;"></div>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%;">Confirmar Enlace P2P</button>
            </div>
        `,
        attachEvents: () => {
            const seqDiv = document.getElementById('sequence-display');
            const btnSubmit = document.getElementById('btn-submit');
            let sequence = [];

            document.querySelectorAll('.color-btn').forEach(b => {
                b.addEventListener('click', () => {
                    if(sequence.length >= 4) return;
                    const c = b.dataset.color;
                    sequence.push(c);
                    const block = document.createElement('div');
                    block.style.flex = "1";
                    block.style.backgroundColor = c;
                    seqDiv.appendChild(block);

                    if(sequence.length === 4) {
                        const saved = sessionStorage.getItem('p2p_pattern');
                        if(saved && saved === JSON.stringify(sequence)) {
                            showAlert("¡ENLACE COMPLETADO!", "La secuencia es perfecta.");
                        } else if(saved) {
                            showAlert("ERROR", "La secuencia no coincide. Reintentando...");
                            sequence = [];
                            seqDiv.innerHTML = '';
                            return;
                        }
                        btnSubmit.classList.remove('hidden');
                    }
                });
            });

            btnSubmit.addEventListener('click', () => {
                submitMission('day_17_kid9_p2p_recv', {type: 'expert', data: 'Patrón recibido: ' + sequence.join(',')});
            });
        }
    },
    "day_18_kid14_radio": {
        tag: "expert", day: 18, title: "Intercepción de Radio", role: "kid14", xp: 30, location: "Shibuya",
        render: () => `
            <div class="ui-terminal">
                <p class="mission-desc">>> Intercepta la transmisión japonesa de la red y transcríbela (romaji).</p>
                <div style="background: rgba(0,255,0,0.1); padding: 15px; border: 1px solid #0f0; text-align: center; margin-bottom: 15px;">
                    <div id="playing-status">>> Esperando señal...</div>
                    <button id="btn-play" class="btn-secondary" style="margin-top: 10px; width: 100%;">Interceptar Señal (Intentos: <span id="tries">3</span>)</button>
                </div>
                <input type="text" id="transcript-input" placeholder="Transcripción..." style="background: #000; color: #0f0; border: 1px solid #0f0; margin-bottom: 15px;">
                <button id="btn-verify" class="btn-primary" style="width: 100%;">Desencriptar</button>
                <div id="success-screen" style="display: none; margin-top: 15px;">
                    <p style="color: #2ecc71;">>> TRANSMISIÓN DESENCRIPTADA. Acceso concedido.</p>
                    <button id="btn-submit" class="btn-primary" style="width: 100%; margin-top: 10px;">Enviar al Juez</button>
                </div>
            </div>
        `,
        attachEvents: () => {
            const palabras = ['sushi', 'samurai', 'fuji', 'kawaii', 'ramen', 'konnichiwa', 'tempura', 'sayonara'];
            const secreta = palabras[Math.floor(Math.random()*palabras.length)];
            let tries = 3;
            const btnPlay = document.getElementById('btn-play');
            const spanTries = document.getElementById('tries');
            const stat = document.getElementById('playing-status');
            const btnVerify = document.getElementById('btn-verify');
            const inp = document.getElementById('transcript-input');
            const succ = document.getElementById('success-screen');

            btnPlay.addEventListener('click', () => {
                if(tries <= 0) return;
                tries--;
                spanTries.innerText = tries;
                stat.innerText = ">> Reproduciendo transmisión...";
                
                if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance(secreta);
                    u.lang = 'ja-JP';
                    u.rate = 0.8;
                    u.onend = () => stat.innerText = ">> Fin de señal.";
                    u.onerror = () => stat.innerText = ">> ERROR SINTÉTICO: " + secreta;
                    window.speechSynthesis.speak(u);
                } else {
                    stat.innerText = ">> ERROR SINTÉTICO: " + secreta;
                }
            });

            btnVerify.addEventListener('click', () => {
                if(inp.value.toLowerCase().trim() === secreta.toLowerCase()) {
                    btnVerify.style.display = 'none';
                    inp.disabled = true;
                    btnPlay.disabled = true;
                    succ.style.display = 'block';
                } else {
                    if(tries > 1) {
                        showAlert("ERROR", ">> Código incorrecto. Inténtalo de nuevo.");
                        inp.value = '';
                    } else {
                        showAlert("FALLO CRÍTICO", ">> Bloqueo de seguridad activado. Transmisión perdida. (La palabra era "+secreta+")");
                        btnVerify.style.display = 'none';
                        btnPlay.disabled = true;
                        succ.style.display = 'block';
                    }
                }
            });

            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_18_kid14_radio', {type: 'expert', data: 'Transcripción: ' + inp.value});
            });
            
            window._missionCleanup = () => { if(window.speechSynthesis) window.speechSynthesis.cancel(); };
        }
    }
,
    "day_8_kid9_wind": {
        tag: "expert", day: 8, title: "El Susurro del Viento", role: "kid9", xp: 30, location: "Arashiyama",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color: #fff;">El bosque te escucha... Sopla suavemente como la brisa entre las cañas durante 4 segundos.</p>
                <div style="position: relative; width: 60px; height: 250px; margin: 20px auto; background: rgba(255,255,255,0.1); border: 2px solid #2ecc71; border-radius: 30px; overflow: hidden;">
                    <div id="wind-fill" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 0%; background: linear-gradient(to top, #f1c40f, #2ecc71); transition: height 0.1s linear;"></div>
                </div>
                <div id="wind-status" style="text-align: center; color: #fff; font-size: 1.2rem;">Presiona Iniciar y sopla constante...</div>
                <button id="btn-start" class="btn-secondary" style="width: 100%; margin-top: 15px;">Activar Atrapavientos</button>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const btnS = document.getElementById('btn-start');
            const btnSub = document.getElementById('btn-submit');
            const fill = document.getElementById('wind-fill');
            const stat = document.getElementById('wind-status');
            
            let active = false;
            let audioCtx = null;
            let streamRef = null;
            let successFrames = 0;
            const TOTAL_FRAMES = 60 * 4; // 4 seconds aprox at 60fps
            const MIN_V = 25;
            const MAX_V = 70;

            const stopAudio = () => {
                active = false;
                if(streamRef) { streamRef.getTracks().forEach(t => t.stop()); streamRef = null; }
                if(audioCtx) { audioCtx.close(); audioCtx = null; }
            };

            btnS.addEventListener('click', async () => {
                try {
                    streamRef = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const source = audioCtx.createMediaStreamSource(streamRef);
                    const analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    
                    const dataArray = new Uint8Array(analyser.frequencyBinCount);
                    active = true;
                    btnS.style.display = 'none';
                    successFrames = 0;

                    const loop = () => {
                        if(!active) return;
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
                        let avg = sum / dataArray.length;

                        if (avg > MIN_V && avg < MAX_V) {
                            successFrames++;
                            stat.innerText = "¡Mantén el soplido!";
                            stat.style.color = "#f1c40f";
                        } else {
                            if(avg > MAX_V) stat.innerText = "¡Demasiado fuerte!";
                            else stat.innerText = "Sopla suavemente...";
                            stat.style.color = "#e74c3c";
                            successFrames = Math.max(0, successFrames - 2); // Baja rapido
                        }

                        let pct = (successFrames / TOTAL_FRAMES) * 100;
                        fill.style.height = pct + '%';

                        if(successFrames >= TOTAL_FRAMES) {
                            stopAudio();
                            fill.style.height = '100%';
                            stat.innerText = "El viento te ha escuchado...";
                            stat.style.color = "#2ecc71";
                            btnSub.classList.remove('hidden');
                        } else {
                            requestAnimationFrame(loop);
                        }
                    };
                    loop();

                } catch(e) {
                    showAlert("Error", "No se pudo acceder al micrófono");
                }
            });

            btnSub.addEventListener('click', () => submitMission('day_8_kid9_wind', {type: 'expert', data: 'Viento capturado (4s)'}));
            window._missionCleanup = () => stopAudio();
        }
    },
    "day_11_kid9_tea": {
        tag: "expert", day: 11, title: "El Té Intacto", role: "kid9", xp: 30, location: "Kazeya",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color: #fff;">Camina 20 segundos con el móvil perfectamente nivelado, ¡que no se derrame el té!</p>
                <div style="position: relative; width: 150px; height: 150px; margin: 20px auto; background: #e0e0e0; border-radius: 50%; border: 10px solid #bdc3c7; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); overflow: hidden;">
                    <div id="tea-liquid" style="position: absolute; top: 10%; left: 10%; width: 80%; height: 80%; background: #27ae60; border-radius: 50%; transition: transform 0.1s linear, background 0.3s;"></div>
                </div>
                <div id="tea-timer" style="text-align: center; font-size: 3rem; color: #f1c40f; font-weight: bold;">20</div>
                <button id="btn-start" class="btn-secondary" style="width: 100%; margin-top: 15px;">Permitir Sensores y Caminar</button>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const btnS = document.getElementById('btn-start');
            const btnSub = document.getElementById('btn-submit');
            const timerEl = document.getElementById('tea-timer');
            const liquid = document.getElementById('tea-liquid');
            
            let active = false;
            let time = 20;
            let initB = null, initG = null;
            let handler = null;
            let timerInt = null;

            const handleOrientation = (e) => {
                if(!active) return;
                let b = e.beta || 0;
                let g = e.gamma || 0;
                
                if(initB === null) { initB = b; initG = g; }
                
                let db = b - initB;
                let dg = g - initG;
                
                // Visual feedback
                liquid.style.transform = `translate(${dg * 2}px, ${db * 2}px)`;
                
                if(Math.abs(db) > 8 || Math.abs(dg) > 8) {
                    // Derramado
                    active = false;
                    clearInterval(timerInt);
                    window.removeEventListener('deviceorientation', handler);
                    liquid.style.background = '#7f8c8d'; // Gris
                    timerEl.innerText = "¡Oh no! Se derramó";
                    timerEl.style.fontSize = "1.5rem";
                    btnS.style.display = 'block';
                    btnS.innerText = "Limpiar y Reintentar";
                }
            };

            const start = () => {
                btnS.style.display = 'none';
                liquid.style.background = '#27ae60';
                liquid.style.transform = 'translate(0px, 0px)';
                initB = null; initG = null;
                
                let count = 3;
                timerEl.style.fontSize = "3rem";
                timerEl.innerText = count;
                const pre = setInterval(() => {
                    count--;
                    if(count > 0) timerEl.innerText = count;
                    else {
                        clearInterval(pre);
                        active = true;
                        time = 20;
                        timerEl.innerText = time;
                        handler = handleOrientation;
                        window.addEventListener('deviceorientation', handler);
                        
                        timerInt = setInterval(() => {
                            time--;
                            timerEl.innerText = time;
                            if(time <= 0) {
                                active = false;
                                clearInterval(timerInt);
                                window.removeEventListener('deviceorientation', handler);
                                timerEl.innerText = "¡Té a salvo!";
                                timerEl.style.fontSize = "2rem";
                                btnSub.classList.remove('hidden');
                            }
                        }, 1000);
                    }
                }, 1000);
            };

            btnS.addEventListener('click', () => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission().then(res => {
                        if(res === 'granted') start();
                    }).catch(console.error);
                } else {
                    start();
                }
            });

            btnSub.addEventListener('click', () => submitMission('day_11_kid9_tea', {type: 'expert', data: 'Té equilibrado (20s)'}));
            window._missionCleanup = () => { active=false; clearInterval(timerInt); if(handler) window.removeEventListener('deviceorientation', handler); };
        }
    },
    "day_15_kid9_yokai": {
        tag: "expert", day: 15, title: "Filtro de Yōkai", role: "kid9", xp: 30, location: "Lagos del Fuji",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color: #fff;">Pasea por el bosque y mira a través del visor. ¿Ves algún espíritu?</p>
                <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #000; border: 4px solid #8e44ad; border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
                    <video id="yokai-video" playsinline autoplay muted style="display: none;"></video>
                    <canvas id="yokai-canvas" style="width: 100%; height: 100%;"></canvas>
                </div>
                <button id="btn-start" class="btn-secondary" style="width: 100%; margin-bottom: 15px;">Activar Visor</button>
                <button id="btn-cap" class="btn-primary hidden" style="width: 100%;">Capturar Espectro</button>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const btnS = document.getElementById('btn-start');
            const btnCap = document.getElementById('btn-cap');
            const btnSub = document.getElementById('btn-submit');
            const video = document.getElementById('yokai-video');
            const canvas = document.getElementById('yokai-canvas');
            const ctx = canvas.getContext('2d');
            
            let streamRef = null;
            let active = false;
            let photoData = null;

            const stopVideo = () => {
                active = false;
                if(streamRef) { streamRef.getTracks().forEach(t => t.stop()); streamRef = null; }
            };

            btnS.addEventListener('click', () => {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    streamRef = stream;
                    video.srcObject = stream;
                    btnS.style.display = 'none';
                    btnCap.classList.remove('hidden');
                    
                    video.onloadedmetadata = () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        active = true;
                        
                        const loop = () => {
                            if(!active) return;
                            ctx.drawImage(video 0, 0, canvas.width, canvas.height);
                            let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            let d = frame.data;
                            // Filtro térmico yōkai (invertir y saturar verde)
                            for(let i=0; i<d.length; i+=4) {
                                d[i] = 255 - d[i];     // R
                                d[i+1] = Math.min(255, (255 - d[i+1]) * 1.5); // G boost
                                d[i+2] = 255 - d[i+2]; // B
                            }
                            ctx.putImageData(frame, 0, 0);
                            requestAnimationFrame(loop);
                        };
                        loop();
                    };
                }).catch(() => showAlert("Error", "Cámara no accesible."));
            });

            btnCap.addEventListener('click', () => {
                stopVideo();
                btnCap.style.display = 'none';
                photoData = canvas.toDataURL(); // Save image
                document.body.style.background = '#2ecc71';
                setTimeout(() => document.body.style.background = '', 200);
                showAlert("¡Espectro detectado!", "¿Es un yōkai?");
                btnSub.classList.remove('hidden');
            });

            btnSub.addEventListener('click', () => {
                submitMission('day_15_kid9_yokai', {type: 'expert', data: 'Espectro capturado (Foto guardada)'});
            });

            window._missionCleanup = () => stopVideo();
        }
    },
    "day_20_kid9_potion": {
        tag: "expert", day: 20, title: "Poción Gatuna", role: "kid9", xp: 30, location: "Yanaka Ginza",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color: #fff;">¡Encuentra un snack retro y escanea su código secreto!</p>
                <div id="scanner-container" style="position: relative; width: 100%; max-width: 300px; margin: 0 auto; border: 4px solid #fff; border-radius: 10px; overflow: hidden; background: #000; aspect-ratio: 4/3; display: none;">
                    <video id="scanner-video" playsinline autoplay muted style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <div id="scan-line" style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #f1c40f; box-shadow: 0 0 10px #f1c40f;"></div>
                </div>
                <div id="fallback-container" style="display: none; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; text-align: center;">
                    <p style="color: #f1c40f;">¡Escribe los números del código de barras!</p>
                    <input type="number" id="barcode-input" placeholder="8 a 13 números..." style="width: 100%; padding: 15px; font-size: 1.5rem; text-align: center;">
                    <button id="btn-fallback" class="btn-primary" style="margin-top: 15px; width: 100%;">Validar Código</button>
                </div>
                <div id="success-screen" style="display: none; text-align: center; margin-top: 15px;">
                    <div style="font-size: 4rem; animation: pulse 1s infinite;">🧪</div>
                    <p style="color: #2ecc71; font-weight: bold; font-size: 1.2rem;">¡Poción gatuna destilada!</p>
                    <input type="text" id="snack-name" placeholder="¿Qué snack has encontrado?" style="width: 100%; margin: 15px 0;">
                    <button id="btn-submit" class="btn-primary" style="width: 100%;">Enviar al Juez</button>
                </div>
            </div>
            <style>
                @keyframes scan2 { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
                #scan-line { animation: scan2 2s linear infinite; }
            </style>
        `,
        attachEvents: () => {
            const scannerCont = document.getElementById('scanner-container');
            const fallbackCont = document.getElementById('fallback-container');
            const video = document.getElementById('scanner-video');
            const successScreen = document.getElementById('success-screen');
            const btnSubmit = document.getElementById('btn-submit');
            let streamRef = null;
            let scanning = true;

            const stopScanner = () => {
                scanning = false;
                if(streamRef) { streamRef.getTracks().forEach(t => t.stop()); streamRef = null; }
            };

            const showSuccess = (code) => {
                stopScanner();
                scannerCont.style.display = 'none';
                fallbackCont.style.display = 'none';
                successScreen.style.display = 'block';
                document.body.style.backgroundColor = '#2ecc71';
                setTimeout(() => document.body.style.backgroundColor = '', 500);
            };

            if ('BarcodeDetector' in window) {
                const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128'] });
                navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(stream => {
                    streamRef = stream;
                    video.srcObject = stream;
                    scannerCont.style.display = 'block';
                    
                    const scanLoop = () => {
                        if(!scanning) return;
                        detector.detect(video).then(barcodes => {
                            if(barcodes.length > 0) showSuccess(barcodes[0].rawValue);
                            else requestAnimationFrame(scanLoop);
                        }).catch(() => requestAnimationFrame(scanLoop));
                    };
                    video.addEventListener('play', () => scanLoop());
                })
                .catch(() => { fallbackCont.style.display = 'block'; });
            } else {
                fallbackCont.style.display = 'block';
            }

            document.getElementById('btn-fallback').addEventListener('click', () => {
                const val = document.getElementById('barcode-input').value;
                if(val.length >= 8) showSuccess(val);
                else showAlert("Error", "Introduce al menos 8 números");
            });

            btnSubmit.addEventListener('click', () => {
                const snack = document.getElementById('snack-name').value || "Snack Misterioso";
                submitMission('day_20_kid9_potion', {type: 'expert', data: 'Código de barras: ' + snack});
            });

            window._missionCleanup = () => stopScanner();
        }
    },
    "day_10_kid14_crypto": {
        tag: "expert", day: 10, title: "Protocolo de Enlace Cifrado", role: "kid14", xp: 30, location: "Hotel",
        render: () => `
            <div class="ui-terminal">
                <p class="mission-desc">>>> PROTOCOLO DE ENLACE CIFRADO. Base: HOTEL. Introduzca clave de acceso.</p>
                <input type="text" id="crypto-input" placeholder="Clave secreta..." style="background: #000; color: #0f0; border: 1px solid #0f0; margin-bottom: 15px; width: 100%; font-family: monospace; text-transform: uppercase;">
                <button id="btn-auth" class="btn-primary" style="width: 100%;">Autenticar</button>
                <div id="crypto-res" style="margin-top: 15px; color: #0f0; font-family: monospace;"></div>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            // SHA-256 precalculado de "KYOTO_ANNEX"
            const targetHashHex = "5b2b2b1a0e1c6b1b4c330f6df48c5806653bbdf135db7e7efb0c950d9db8813a"; // Dummy precalculated, will do dynamic below for simplicity
            
            const btnA = document.getElementById('btn-auth');
            const res = document.getElementById('crypto-res');
            const btnS = document.getElementById('btn-submit');

            btnA.addEventListener('click', async () => {
                const val = document.getElementById('crypto-input').value.trim().toUpperCase();
                
                // Fallback local if Crypto API not avail
                if (!window.crypto || !window.crypto.subtle) {
                    if (val === 'KYOTO_ANNEX') win();
                    else res.innerText = ">>> ACCESO DENEGADO.";
                    return;
                }

                // Generar hash real de la clave secreta predefinida en tiempo de ejecución para asegurar match perfecto
                const encoder = new TextEncoder();
                const secretData = encoder.encode("KYOTO_ANNEX");
                const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretData);
                const secretHashArray = Array.from(new Uint8Array(secretHashBuffer));
                const targetHex = secretHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                const inputData = encoder.encode(val);
                const inputHashBuffer = await crypto.subtle.digest('SHA-256', inputData);
                const inputHashArray = Array.from(new Uint8Array(inputHashBuffer));
                const inputHex = inputHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                if(inputHex === targetHex) win();
                else res.innerText = ">>> ACCESO DENEGADO.";
            });

            const win = () => {
                btnA.style.display = 'none';
                res.innerText = ">>> FIREWALL TRASPASADO. Bienvenido a la base, agente.";
                btnS.classList.remove('hidden');
            };

            btnS.addEventListener('click', () => submitMission('day_10_kid14_crypto', {type: 'expert', data: 'Hash validado'}));
        }
    },
    "day_16_kid14_combat": {
        tag: "expert", day: 16, title: "Calibración Androide de Combate", role: "kid14", xp: 30, location: "Shinjuku",
        render: () => `
            <div class="ui-terminal">
                <p style="color: red; font-weight: bold; font-size: 1.2rem;">⚠️ SUJETA EL MÓVIL CON LAS DOS MANOS. Busca un espacio despejado.</p>
                <div id="step-1" style="margin-bottom: 15px;">
                    <p>>>> Paso 1: Tajo Lateral (corte horizontal)</p>
                    <div id="status-1" style="color: #666;">[ Pendiente ]</div>
                </div>
                <div id="step-2" style="margin-bottom: 15px;">
                    <p>>>> Paso 2: Tajo Frontal (corte vertical hacia abajo)</p>
                    <div id="status-2" style="color: #666;">[ Pendiente ]</div>
                </div>
                <button id="btn-start" class="btn-secondary" style="width: 100%;">Activar Sensores de Combate</button>
                <div id="combat-res" style="margin-top: 15px; color: #0f0; font-weight: bold;"></div>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const btnS = document.getElementById('btn-start');
            const btnSub = document.getElementById('btn-submit');
            const s1 = document.getElementById('status-1');
            const s2 = document.getElementById('status-2');
            const res = document.getElementById('combat-res');
            
            let active = false;
            let handler = null;
            let pass1 = false;
            let pass2 = false;

            const handleMotion = (e) => {
                if(!active) return;
                const acc = e.accelerationIncludingGravity;
                if(!acc) return;
                const mag = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
                
                // Umbral bajado a 12 m/s^2 por seguridad
                if (mag > 12) {
                    if (!pass1 && Math.abs(acc.x) > Math.abs(acc.y)) { // Tajo lateral (X domina)
                        pass1 = true;
                        s1.innerText = "[ COMPLETADO ]";
                        s1.style.color = "#0f0";
                    } else if (pass1 && !pass2 && Math.abs(acc.y) > Math.abs(acc.x) && acc.y < -5) { // Tajo vertical bajando (Y domina)
                        pass2 = true;
                        s2.innerText = "[ COMPLETADO ]";
                        s2.style.color = "#0f0";
                        active = false;
                        res.innerText = ">>> SENSORES DE COMBATE CALIBRADOS. Androide operativo.";
                        btnSub.classList.remove('hidden');
                        window.removeEventListener('devicemotion', handler);
                    }
                }
            };

            btnS.addEventListener('click', () => {
                if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                    DeviceMotionEvent.requestPermission().then(r => {
                        if(r === 'granted') {
                            active = true; btnS.style.display = 'none';
                            handler = handleMotion; window.addEventListener('devicemotion', handler);
                        }
                    }).catch(console.error);
                } else {
                    active = true; btnS.style.display = 'none';
                    handler = handleMotion; window.addEventListener('devicemotion', handler);
                }
            });

            btnSub.addEventListener('click', () => submitMission('day_16_kid14_combat', {type: 'expert', data: 'Combos ejecutados (>12m/s2)'}));
            window._missionCleanup = () => { active=false; if(handler) window.removeEventListener('devicemotion', handler); };
        }
    },
    "day_22_kid14_radio": {
        tag: "expert", day: 22, title: "Intercepción Numérica", role: "kid14", xp: 30, location: "Ginza",
        render: () => `
            <div class="ui-terminal">
                <p class="mission-desc">>>> ESCANEANDO FRECUENCIAS ENEMIGAS...</p>
                <button id="btn-play" class="btn-secondary" style="width: 100%; margin-bottom: 15px;">Interceptar Señal (Intentos: <span id="tries">3</span>)</button>
                <div id="fallback-txt" style="display: none; text-align: center; font-size: 2rem; color: #fff; margin-bottom: 15px;">🔈 <span id="kanji-code"></span></div>
                <input type="number" id="radio-input" placeholder="Código de 3 dígitos..." style="background: #000; color: #0f0; border: 1px solid #0f0; margin-bottom: 15px; width: 100%; text-align: center; font-size: 1.5rem; letter-spacing: 5px;">
                <button id="btn-verify" class="btn-primary" style="width: 100%;">Desencriptar</button>
                <div id="radio-res" style="margin-top: 15px; color: #0f0; font-family: monospace;"></div>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const jp = { 1:'ichi', 2:'ni', 3:'san', 4:'yon', 5:'go', 6:'roku', 7:'nana', 8:'hachi', 9:'kyuu' };
            const n1 = Math.floor(Math.random()*9)+1;
            const n2 = Math.floor(Math.random()*9)+1;
            const n3 = Math.floor(Math.random()*9)+1;
            const codeStr = `${n1}${n2}${n3}`;
            const audioStr = `${jp[n1]}... ${jp[n2]}... ${jp[n3]}`;
            
            let tries = 3;
            const btnPlay = document.getElementById('btn-play');
            const spanTries = document.getElementById('tries');
            const btnVerify = document.getElementById('btn-verify');
            const inp = document.getElementById('radio-input');
            const res = document.getElementById('radio-res');
            const btnSub = document.getElementById('btn-submit');
            const fallbackTxt = document.getElementById('fallback-txt');
            const kanjiCode = document.getElementById('kanji-code');

            btnPlay.addEventListener('click', () => {
                if(tries <= 0) return;
                tries--;
                spanTries.innerText = tries;
                
                if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance(audioStr);
                    u.lang = 'ja-JP';
                    u.rate = 0.7;
                    u.onerror = () => { fallbackTxt.style.display = 'block'; kanjiCode.innerText = audioStr; };
                    window.speechSynthesis.speak(u);
                } else {
                    fallbackTxt.style.display = 'block';
                    kanjiCode.innerText = audioStr;
                }
            });

            btnVerify.addEventListener('click', () => {
                if(inp.value === codeStr) {
                    btnVerify.style.display = 'none';
                    btnPlay.style.display = 'none';
                    res.innerText = ">>> TRANSMISIÓN DESENCRIPTADA. Código: ["+codeStr+"]. Acceso concedido.";
                    btnSub.classList.remove('hidden');
                } else {
                    if(tries > 0) {
                        res.innerText = ">>> ERROR. Inténtalo de nuevo.";
                        res.style.color = "#f00";
                        setTimeout(()=>res.innerText="", 2000);
                        inp.value = '';
                    } else {
                        res.innerText = ">>> BLOQUEO. Transmisión perdida. (Código era "+codeStr+")";
                        res.style.color = "#f00";
                        btnVerify.style.display = 'none';
                        btnPlay.style.display = 'none';
                        btnSub.classList.remove('hidden'); // allow submit anyway
                    }
                }
            });

            btnSub.addEventListener('click', () => submitMission('day_22_kid14_radio', {type: 'expert', data: 'Código: ' + inp.value}));
            window._missionCleanup = () => { if(window.speechSynthesis) window.speechSynthesis.cancel(); };
        }
    }
,

// ====== NUEVAS MISIONES DÍAS 8, 9 Y 10 ======
"day_8_kid9_bamboo_clock": {
    tag: "physical", day: 8, title: "El Reloj de Bambú", role: "kid9", xp: 15, location: "Arashiyama",
    render: () => `
        <p class="mission-desc">Cada nudo del bambú equivale a un año de vida. Encuentra un bambú alto, cuenta sus entrenudos y calcula su edad.</p>
        <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
            <button id="btn-sub-b" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">-</button>
            <div id="bamboo-count" style="font-size:3rem; font-weight:bold;">0</div>
            <button id="btn-add-b" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">+</button>
        </div>
        <p class="mission-desc">Escribe su edad (años):</p>
        <input type="number" id="bamboo-age" placeholder="Años..." style="width:100%; margin-bottom:15px;">
        <button id="btn-send-bamboo" class="btn-primary" style="width:100%;">Enviar al Juez</button>
    `,
    attachEvents: () => {
        let count = 0;
        document.getElementById('btn-add-b').addEventListener('click', () => { count++; document.getElementById('bamboo-count').innerText = count; });
        document.getElementById('btn-sub-b').addEventListener('click', () => { if(count>0) count--; document.getElementById('bamboo-count').innerText = count; });
        document.getElementById('btn-send-bamboo').addEventListener('click', () => {
            submitMission('day_8_kid9_bamboo_clock', {type:'text', data:`Nudos: ${count}, Edad: ${document.getElementById('bamboo-age').value}`});
        });
    }
},
"day_8_kid9_giants": {
    tag: "photo", day: 8, title: "Perspectiva de Gigantes", role: "kid9", xp: 15, location: "Bosque de Bambú",
    render: () => `
        <p class="mission-desc">Ponte en medio del camino, apunta tu cámara directamente hacia el cielo y captura cómo los gigantes de bambú intentan tapar el sol.</p>
        <button id="btn-cam" class="btn-secondary">📸 Foto de Gigantes</button>
    `,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_8_kid9_giants', currentUser, false); }
},
"day_8_kid9_rake": {
    tag: "game", day: 8, title: "El Rastrillo del Jardinero", role: "kid9", xp: 20, location: "Tenryu-ji",
    render: () => `
        <p class="mission-desc">Dibuja ondas de arena zen con el dedo sobre el jardín simulado de Tenryu-ji.</p>
        <div style="background:#e8dcc4; border:2px solid #8b5a2b; position:relative; width:100%; height:250px; margin:0 auto; margin-bottom:15px; border-radius:10px; overflow:hidden;">
            <canvas id="zen-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;"></canvas>
        </div>
        <div style="display:flex; gap:10px;">
            <button id="btn-clear" class="btn-secondary" style="flex:1;">Alisar Arena</button>
            <button id="btn-submit" class="btn-primary" style="flex:2;">Enviar Jardín</button>
        </div>
    `,
    attachEvents: () => {
        const canvas = document.getElementById('zen-canvas');
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.strokeStyle = '#d4c4a8';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 2;
        ctx.shadowColor = '#8b5a2b';

        let drawing = false;

        const getPos = (e) => {
            const rectCanvas = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rectCanvas.left y: clientY - rectCanvas.top };
        };

        const startDraw = (e) => {
            drawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x pos.y);
        };

        const draw = (e) => {
            if(!drawing) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.lineTo(pos.x pos.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(pos.x + 15, pos.y + 15);
            ctx.lineTo(pos.x + 15, pos.y + 15);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x - 15, pos.y - 15);
            ctx.lineTo(pos.x - 15, pos.y - 15);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };

        const stopDraw = () => { drawing = false; };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseout', stopDraw);
        canvas.addEventListener('touchstart', startDraw, {passive:false});
        canvas.addEventListener('touchmove', draw, {passive:false});
        canvas.addEventListener('touchend', stopDraw);

        document.getElementById('btn-clear').addEventListener('click', () => {
            ctx.clearRect(0 0, canvas.width, canvas.height);
        });

        document.getElementById('btn-submit').addEventListener('click', async () => {
            const dataUrl = canvas.toDataURL('image/png');
            const photoId = 'zen_' + Date.now();
            await savePhotoToDB(photoId, dataUrl);
            submitMission('day_8_kid9_rake', {type:'photo', data:photoId});
        });
    }
},
"day_8_kid9_monk": {
    tag: "audio", day: 8, title: "El Mensaje del Monje", role: "kid9", xp: 20, location: "Tenryu-ji",
    render: () => `
        <p class="mission-desc">Imita el sonido de un cuenco tibetano o canta un mantra Zen relajante. Tienes 5 segundos.</p>
        <div id="rec-ui-monk" style="text-align:center; margin: 20px 0;">
            <div id="rec-dot-monk" style="width:20px; height:20px; background:red; border-radius:50%; margin:0 auto 10px; opacity:0;"></div>
            <button id="btn-rec-monk" class="btn-primary" style="width:100%; border-radius:50px; height:60px; font-size:1.5rem;">🎙️ Grabar Mensaje</button>
        </div>
        <audio id="au-preview-monk" controls class="hidden" style="width:100%; margin-bottom:15px;"></audio>
        <button id="btn-retry-monk" class="btn-secondary hidden" style="width:100%; margin-bottom:10px;">Regrabar</button>
        <button id="btn-monk" class="btn-primary hidden" style="width:100%;">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const btnR = document.getElementById('btn-rec-monk');
        const btnRetry = document.getElementById('btn-retry-monk');
        const btn = document.getElementById('btn-monk');
        const au = document.getElementById('au-preview-monk');
        const dot = document.getElementById('rec-dot-monk');
        
        let mr = null;
        let chunks = [];
        let stream = null;
        let blobId = null;

        const stopAll = () => {
            if(mr && mr.state !== 'inactive') mr.stop();
            if(stream) stream.getTracks().forEach(t => t.stop());
        };

        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({audio:true});
                mr = new MediaRecorder(stream);
                chunks = [];
                mr.ondataavailable = e => chunks.push(e.data);
                mr.onstop = async () => {
                    dot.style.animation = 'none';
                    dot.style.opacity = '0';
                    const blob = new Blob(chunks, { 'type' : 'audio/webm' });
                    au.src = URL.createObjectURL(blob);
                    au.classList.remove('hidden');
                    btnR.classList.add('hidden');
                    btnRetry.classList.remove('hidden');
                    btn.classList.remove('hidden');
                    
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => { blobId = reader.result; };
                    stream.getTracks().forEach(t => t.stop());
                };
                mr.start();
                dot.style.opacity = '1';
                dot.style.animation = 'pulse 1s infinite';
                btnR.innerText = "Grabando...";
                btnR.disabled = true;
                setTimeout(() => { if(mr.state === 'recording') mr.stop(); btnR.disabled = false; btnR.innerText = "🎙️ Grabar Mensaje"; }, 5000);
            } catch(e) { alert("Error micro: " + e.message); }
        });

        btnRetry.addEventListener('click', () => {
            au.classList.add('hidden');
            btn.classList.add('hidden');
            btnRetry.classList.add('hidden');
            btnR.classList.remove('hidden');
            blobId = null;
        });

        btn.addEventListener('click', () => {
            if (blobId) submitMission('day_8_kid9_monk', {type:'audio', data: 'Audio grabado (Mantra Zen)'});
        });
        window._missionCleanup = stopAll;
    }
},
"day_8_kid14_wave_sync": {
    tag: "expert", day: 8, title: "Sincronización de Frecuencias", role: "kid14", xp: 25, location: "Arashiyama",
    render: () => `
        <p class="mission-desc">Osciloscopio cibernético: Ajusta Amplitud, Frecuencia y Fase para encajar tu onda verde con la onda roja del bosque.</p>
        <div style="background: #001100; border: 4px solid #333; border-radius: 15px; padding: 10px; margin-bottom: 20px;">
            <canvas id="wc2" width="300" height="150" style="width: 100%; height: 150px; background: repeating-linear-gradient(0deg, transparent, transparent 19px, #003300 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #003300 20px); border-radius: 10px; box-shadow: inset 0 0 20px rgba(0,0,0,1);"></canvas>
        </div>
        <div style="display: flex; flex-direction:column; gap:10px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center;">
                <label style="width:80px; color:#0f0; font-family:monospace;">AMP</label>
                <input type="range" id="sl-amp" min="10" max="70" step="1" value="20" style="flex:1; accent-color:#0f0;">
            </div>
            <div style="display: flex; align-items: center;">
                <label style="width:80px; color:#0f0; font-family:monospace;">FREQ</label>
                <input type="range" id="sl-freq" min="0.01" max="0.1" step="0.001" value="0.02" style="flex:1; accent-color:#0f0;">
            </div>
            <div style="display: flex; align-items: center;">
                <label style="width:80px; color:#0f0; font-family:monospace;">FASE</label>
                <input type="range" id="sl-fase" min="0" max="6.28" step="0.1" value="0" style="flex:1; accent-color:#0f0;">
            </div>
        </div>
        <div id="sync-status2" style="text-align: center; color: #f00; font-family: monospace; font-size: 1.5rem; text-shadow: 0 0 5px #f00; margin-bottom: 10px;">ESTADO: DESINCRONIZADO</div>
        <button id="btn-sync-ok" class="btn-primary hidden" style="width:100%; animation: pulse 1s infinite;">¡Sincronización Completada!</button>
    `,
    attachEvents: () => {
        const c = document.getElementById('wc2');
        const ctx = c.getContext('2d');
        const sAmp = document.getElementById('sl-amp');
        const sFreq = document.getElementById('sl-freq');
        const sFase = document.getElementById('sl-fase');
        const b = document.getElementById('btn-sync-ok');
        const stat = document.getElementById('sync-status2');
        
        const targetAmp = 50;
        const targetFreq = 0.05; 
        const targetFase = 3.1;
        let offset = 0;
        let active = true;

        const loop = () => {
            if(!active) return;
            ctx.clearRect(0 0, c.width, c.height);
            
            ctx.globalCompositeOperation = 'lighter';
            
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'red';
            for(let x=0; x<c.width; x++) {
                ctx.lineTo(x 75 + targetAmp * Math.sin((x + offset) * targetFreq + targetFase));
            }
            ctx.stroke();
            
            const pAmp = parseFloat(sAmp.value);
            const pFreq = parseFloat(sFreq.value);
            const pFase = parseFloat(sFase.value);
            
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'green';
            for(let x=0; x<c.width; x++) {
                ctx.lineTo(x 75 + pAmp * Math.sin((x + offset) * pFreq + pFase));
            }
            ctx.stroke();

            offset += 1; 

            const dAmp = Math.abs(pAmp - targetAmp);
            const dFreq = Math.abs(pFreq - targetFreq);
            let dFase = Math.abs(pFase - targetFase);
            
            if(dAmp < 5 && dFreq < 0.005 && dFase < 0.5) {
                stat.innerText = 'ESTADO: 100% SINCRONIZADO';
                stat.style.color = '#0f0';
                stat.style.textShadow = '0 0 10px #0f0';
                b.classList.remove('hidden');
                ctx.strokeStyle = 'rgba(255, 255, 0, 1)';
                ctx.shadowColor = 'yellow';
                ctx.stroke();
            } else {
                stat.innerText = 'ESTADO: DESINCRONIZADO';
                stat.style.color = '#f00';
                stat.style.textShadow = '0 0 5px #f00';
                b.classList.add('hidden');
            }

            requestAnimationFrame(loop);
        };
        
        loop();
        b.addEventListener('click', () => { active = false; submitMission('day_8_kid14_wave_sync', {type:'game', data:'Ondas sincronizadas por completo'}); });
        window._missionCleanup = () => { active = false; };
    }
},
"day_8_fam_squad": {
    tag: "photo", day: 8, title: "Escuadrón Bambú", role: "both", xp: 20, location: "Arashiyama",
    render: () => `
        <p class="mission-desc">Foto de todo el grupo semioculto entre los troncos de bambú (¡usa el temporizador!).</p>
        <label style="display:block; margin:20px 0; font-size:1.2rem; background:var(--color-gray-light); padding:15px; border-radius:10px;"><input type="checkbox" id="chk-squad" style="transform:scale(1.5); margin-right:15px;"> ✅ Foto de escuadrón hecha</label>
        <button id="btn" class="btn-primary" style="width:100%">Enviar al Juez</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            if(document.getElementById('chk-squad').checked) submitMission('day_8_fam_squad', {type:'text', data:'Foto de grupo confirmada'}, role, true);
            else showAlert('Aviso', 'Debéis confirmar marcando la casilla.');
        });
    }
},
// ====== DÍA 9 ======
"day_9_kid9_scratch": {
    tag: "expert", day: 9, title: "Limpia el Reflejo de Oro", role: "kid9", xp: 25, location: "Kinkaku-ji",
    render: () => `
        <p class="mission-desc">Rasca y limpia el estanque para revelar el Pabellón Dorado.</p>
        <div style="position: relative; width: 100%; height: 250px; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border: 4px solid #d4af37;">
            <div style="position: absolute; top:0; left:0; width: 100%; height: 100%; background: linear-gradient(to bottom, #87CEEB 40%, #001f3f 100%); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="font-size: 5rem; text-shadow: 0 0 20px gold;">⛩️</div>
                <div style="font-size: 5rem; transform: scaleY(-1); opacity: 0.6; filter: blur(2px);">⛩️</div>
            </div>
            <canvas id="sc-gold" width="300" height="250" style="position: absolute; top:0; left:0; width: 100%; height: 100%;"></canvas>
        </div>
        <div style="margin-top: 15px; height: 10px; background: #ddd; border-radius: 5px; overflow: hidden;">
            <div id="scratch-prog-gold" style="height: 100%; width: 0%; background: #f1c40f; transition: width 0.2s;"></div>
        </div>
        <button id="btn-gold" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">¡Reflejo Revelado!</button>
    `,
    attachEvents: () => {
        const c = document.getElementById('sc-gold');
        const ctx = c.getContext('2d');
        const b = document.getElementById('btn-gold');
        const prog = document.getElementById('scratch-prog-gold');
        
        ctx.fillStyle = '#9e9e9e';
        ctx.fillRect(0, 0, c.width, c.height);
        
        let isDrawing = false;
        let clearedCount = 0;

        const scratch = (e) => {
            e.preventDefault();
            let clientX clientY;
            if(e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            const rect = c.getBoundingClientRect();
            const x = (clientX - rect.left) * (c.width / rect.width);
            const y = (clientY - rect.top) * (c.height / rect.height);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();

            clearedCount++;
            let pct = Math.min(100, (clearedCount / 80) * 100);
            prog.style.width = pct + '%';
            
            if(pct >= 90 && b.classList.contains('hidden')) {
                ctx.clearRect(00,c.width,c.height);
                prog.style.width = '100%';
                b.classList.remove('hidden');
                launchConfetti();
            }
        };

        c.addEventListener('mousedown', () => { isDrawing = true; });
        c.addEventListener('mouseup', () => { isDrawing = false; });
        c.addEventListener('mousemove', (e) => { if(isDrawing) scratch(e); });
        c.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, {passive:false});
        c.addEventListener('touchmove', (e) => { if(isDrawing) scratch(e); }, {passive:false});
        c.addEventListener('touchend', () => { isDrawing = false; });

        b.addEventListener('click', () => submitMission('day_9_kid9_scratch', {type:'game', data:'Reflejo limpiado correctamente'}));
    }
},
"day_9_kid9_altar": {
    tag: "photo", day: 9, title: "El Altar Secreto", role: "kid9", xp: 15, location: "Fushimi Inari",
    render: () => `
        <p class="mission-desc">Busca un mini-altar lleno de arcos Torii del tamaño de un juguete y sácale una foto.</p>
        <button id="btn-cam" class="btn-secondary">📸 Foto del Altar</button>
    `,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid9_altar', currentUser, false); }
},
"day_9_kid14_torii": {
    tag: "expert", day: 9, title: "Laberinto de Torii", role: "kid14", xp: 25, location: "Fushimi Inari",
    render: () => `
        <p class="mission-desc">Conecta el camino desde la entrada (abajo) hasta la cima (arriba) rotando las piezas.</p>
        <div id="torii-board2" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; max-width: 300px; margin: 0 auto; background: #222; padding: 10px; border-radius: 10px; border: 4px solid #e74c3c;">
        </div>
        <button id="btn-maze" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">¡Camino Abierto!</button>
    `,
    attachEvents: () => {
        const board = document.getElementById('torii-board2');
        const btn = document.getElementById('btn-maze');
        
        const map = [
            {t:1 r:90}, {t:0 r:0}, {t:1 r:180},
            {t:0 r:90}, {t:1 r:0}, {t:0 r:90},
            {t:1 r:270}, {t:1 r:180}, {t:1 r:0}
        ];
        
        const checkWin = () => {
            let matches = 0;
            map.forEach((m i) => {
                const el = document.getElementById('t2_'+i);
                const r = parseInt(el.dataset.r) % 360;
                if(i===0 && r===90) matches++;
                if(i===1 && (r===0||r===180)) matches++;
                if(i===2 && r===270) matches++;
                if(i===3 && (r===90||r===270)) matches++;
                if(i===4 && r===90) matches++;
                if(i===5 && (r===0||r===180)) matches++;
                if(i===6 && r===0) matches++;
                if(i===7 && r===270) matches++;
                if(i===8 && r===180) matches++;
            });
            if(matches >= 6) {
                btn.classList.remove('hidden');
                board.style.boxShadow = '0 0 30px #f1c40f';
            }
        };

        board.innerHTML = '';
        map.forEach((m, i) => {
            const div = document.createElement('div');
            div.id = 't2_'+i;
            div.dataset.r = m.r;
            div.style.height = '80px';
            div.style.background = '#333';
            div.style.borderRadius = '5px';
            div.style.position = 'relative';
            div.style.transition = 'transform 0.3s ease';
            div.style.transform = `rotate(${m.r}deg)`;
            div.style.cursor = 'pointer';
            
            if(m.t === 0) { 
                div.innerHTML = `<div style="position:absolute; top:0; bottom:0; left:50%; width:20px; background:#e74c3c; transform:translateX(-50%); border-left:3px solid #c0392b; border-right:3px solid #c0392b;"></div>`;
            } else { 
                div.innerHTML = `<div style="position:absolute; top:0; left:50%; width:20px; height:50%; background:#e74c3c; transform:translateX(-50%);"></div><div style="position:absolute; top:50%; left:50%; width:50%; height:20px; background:#e74c3c; transform:translateY(-50%);"></div>`;
            }

            div.addEventListener('click', () => {
                let r = parseInt(div.dataset.r) + 90;
                div.dataset.r = r;
                div.style.transform = `rotate(${r}deg)`;
                checkWin();
            });
            board.appendChild(div);
        });

        btn.addEventListener('click', () => submitMission('day_9_kid14_torii', {type:'game', data:'Laberinto resuelto'}));
    }
},
"day_9_kid14_tunnel": {
    tag: "photo", day: 9, title: "El Túnel Infinito", role: "kid14", xp: 15, location: "Fushimi Inari",
    render: () => `
        <p class="mission-desc">Fotografía el pasillo de toriis desde un ángulo donde parezca que no tiene fin.</p>
        <button id="btn-cam" class="btn-secondary">📸 Foto del Túnel</button>
    `,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid14_tunnel', currentUser, false); }
},
"day_9_kid14_balance": {
    tag: "physical", day: 9, title: "La Postura del Ave Dorada", role: "kid14", xp: 20, location: "Kinkaku-ji",
    render: () => `
        <p class="mission-desc">Aguanta a la pata coja frente al Pabellón Dorado durante 30 segundos reales. ¡No toques el suelo!</p>
        <div id="chrono-bal" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">0.0s</div>
        <div style="display:grid; grid-template-columns:1fr; gap:10px;">
            <button id="c-start-bal" class="btn-primary">Iniciar</button>
            <button id="c-stop-bal" class="btn-secondary hidden" style="background:#e74c3c; color:white;">Apoyé el pie</button>
        </div>
        <button id="btn-sub-bal" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Tiempo al Juez</button>
    `,
    attachEvents: () => {
        let sT=0; let int=null;
        const cText = document.getElementById('chrono-bal');
        const bS = document.getElementById('c-start-bal');
        const bE = document.getElementById('c-stop-bal');
        const bSub = document.getElementById('btn-sub-bal');
        
        bS.addEventListener('click', () => { 
            sT = Date.now();
            bS.classList.add('hidden');
            bE.classList.remove('hidden');
            int = setInterval(() => { 
                cText.innerText = ((Date.now() - sT)/1000).toFixed(1) + 's'; 
            }, 100);
        });
        bE.addEventListener('click', () => { 
            clearInterval(int); 
            bE.classList.add('hidden');
            bSub.classList.remove('hidden'); 
        });
        bSub.addEventListener('click', () => submitMission('day_9_kid14_balance', {type:'text', data: `Tiempo de equilibrio: ${cText.innerText}`}));
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_9_fam_portal": {
    tag: "video", day: 9, title: "La Puerta a Otro Mundo", role: "both", xp: 20, location: "Fushimi Inari",
    render: () => `
        <p class="mission-desc">Grabar un vídeo de 5 segundos de todo el grupo cruzando a la vez un arco Torii gigante.</p>
        <div id="rec-ui-portal" style="text-align:center; margin: 20px 0;">
            <button id="btn-rec-portal" class="btn-primary" style="width:100%; border-radius:50px; height:60px; font-size:1.5rem;">🎬 Grabar Cruce</button>
        </div>
        <video id="vid-preview-portal" controls playsinline autoplay muted class="hidden" style="width:100%; border-radius:10px; margin-bottom:15px;"></video>
        <button id="btn-retry-portal" class="btn-secondary hidden" style="width:100%; margin-bottom:10px;">Regrabar</button>
        <button id="btn-portal" class="btn-primary hidden" style="width:100%;">Enviar Vídeo</button>
    `,
    attachEvents: (role) => {
        const btnR = document.getElementById('btn-rec-portal');
        const btnRetry = document.getElementById('btn-retry-portal');
        const btn = document.getElementById('btn-portal');
        const vid = document.getElementById('vid-preview-portal');
        
        let mr = null;
        let chunks = [];
        let stream = null;
        let blobId = null;

        const stopAll = () => {
            if(mr && mr.state !== 'inactive') mr.stop();
            if(stream) stream.getTracks().forEach(t => t.stop());
        };

        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({video:{facingMode: 'environment'}, audio:true});
                vid.srcObject = stream;
                vid.classList.remove('hidden');
                
                mr = new MediaRecorder(stream);
                chunks = [];
                mr.ondataavailable = e => chunks.push(e.data);
                mr.onstop = async () => {
                    vid.srcObject = null;
                    const blob = new Blob(chunks { 'type' : 'video/mp4' });
                    vid.src = URL.createObjectURL(blob);
                    
                    btnR.classList.add('hidden');
                    btnRetry.classList.remove('hidden');
                    btn.classList.remove('hidden');
                    
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => { blobId = reader.result; };
                    stream.getTracks().forEach(t => t.stop());
                };
                mr.start();
                btnR.innerText = "Grabando (5s)...";
                btnR.disabled = true;
                setTimeout(() => { if(mr.state === 'recording') mr.stop(); btnR.disabled = false; btnR.innerText = "🎬 Grabar Cruce"; }, 5000);
            } catch(e) { alert("Error cámara: " + e.message); }
        });

        btnRetry.addEventListener('click', () => {
            vid.classList.add('hidden');
            vid.src = "";
            btn.classList.add('hidden');
            btnRetry.classList.add('hidden');
            btnR.classList.remove('hidden');
            blobId = null;
        });

        btn.addEventListener('click', () => {
            if (blobId) submitMission('day_9_fam_portal', {type:'video', data: 'Vídeo del portal Torii (Guardado localmente)'}, role, true);
        });
        window._missionCleanup = stopAll;
    }
},
// ====== DÍA 10 ======
"day_10_kid9_bento": {
    tag: "expert", day: 10, title: "El Maestro del Bento", role: "kid9", xp: 25, location: "Mercado Nishiki",
    render: () => `
        <p class="mission-desc">Arrastra cada ingrediente a su compartimento correcto en la caja Bento para preparar un almuerzo perfecto (Usa tu dedo suavemente).</p>
        <div id="bento-box2" style="width: 100%; height: 250px; background: #c0392b; border: 5px solid #8e44ad; border-radius: 15px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 5px; padding: 5px; touch-action:none;">
            <div class="bento-slot2" data-accept="arroz" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🍚</div>
            <div class="bento-slot2" data-accept="pescado" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🐟</div>
            <div class="bento-slot2" data-accept="verdura" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🥦</div>
            <div class="bento-slot2" data-accept="postre" style="background: #e74c3c; border-radius: 10px; border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🍡</div>
        </div>
        <div style="display: flex; justify-content: space-around; background: #ecf0f1; padding: 10px; border-radius: 10px; min-height: 80px; position:relative; touch-action:none;">
            <div class="bento-item2" data-type="pescado" style="font-size: 3rem; position:absolute; left:10px; z-index:10;">🐟</div>
            <div class="bento-item2" data-type="arroz" style="font-size: 3rem; position:absolute; left:80px; z-index:10;">🍚</div>
            <div class="bento-item2" data-type="postre" style="font-size: 3rem; position:absolute; left:150px; z-index:10;">🍡</div>
            <div class="bento-item2" data-type="verdura" style="font-size: 3rem; position:absolute; left:220px; z-index:10;">🥦</div>
        </div>
        <button id="btn-bento-ok" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">¡Itadakimasu!</button>
    `,
    attachEvents: () => {
        const items = document.querySelectorAll('.bento-item2');
        const slots = document.querySelectorAll('.bento-slot2');
        const btn = document.getElementById('btn-bento-ok');
        
        let placed = 0;
        let activeItem = null;
        let initX=0, initY=0, curX=0, curY=0;

        const getXY = (e) => {
            if(e.touches) return { x: e.touches[0].clientX y: e.touches[0].clientY };
            return { x: e.clientX y: e.clientY };
        };

        const handleMove = (e) => {
            if(!activeItem) return;
            e.preventDefault();
            const {x y} = getXY(e);
            const dx = x - initX;
            const dy = y - initY;
            activeItem.style.transform = `translate(${curX + dx}px, ${curY + dy}px) scale(1.2)`;
        };

        const handleEnd = (e) => {
            if(!activeItem) return;
            const {x y} = getXY(e.changedTouches ? e.changedTouches[0] : e);
            const dx = x - initX;
            const dy = y - initY;
            curX += dx;
            curY += dy;
            
            let itemRect = activeItem.getBoundingClientRect();
            let itemCenter = { x: itemRect.left + itemRect.width/2, y: itemRect.top + itemRect.height/2 };
            
            let matched = false;
            slots.forEach(slot => {
                let slotRect = slot.getBoundingClientRect();
                if(itemCenter.x > slotRect.left && itemCenter.x < slotRect.right && 
                   itemCenter.y > slotRect.top && itemCenter.y < slotRect.bottom) {
                    
                    if(slot.dataset.accept === activeItem.dataset.type && !slot.dataset.filled) {
                        matched = true;
                        slot.dataset.filled = 'true';
                        slot.style.borderStyle = 'solid';
                        slot.style.borderColor = '#f1c40f';
                        slot.style.background = '#c0392b';
                        activeItem.style.display = 'none'; 
                        placed++;
                        if(placed === 4) {
                            btn.classList.remove('hidden');
                            launchConfetti();
                        }
                    }
                }
            });

            if(!matched) {
                curX = 0; curY = 0;
                activeItem.style.transform = 'translate(0px, 0px) scale(1)';
            }
            
            activeItem.style.zIndex = '10';
            activeItem = null;
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
        };

        items.forEach(item => {
            const startDrag = (e) => {
                e.preventDefault();
                activeItem = item;
                const {x y} = getXY(e);
                initX = x; initY = y;
                const match = activeItem.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
                if(match) { curX = parseFloat(match[1]); curY = parseFloat(match[2]); } 
                else { curX = 0; curY = 0; }
                
                activeItem.style.zIndex = '100';
                document.addEventListener('mousemove', handleMove, {passive:false});
                document.addEventListener('mouseup', handleEnd);
                document.addEventListener('touchmove', handleMove, {passive:false});
                document.addEventListener('touchend', handleEnd);
            };
            item.addEventListener('mousedown', startDrag);
            item.addEventListener('touchstart', startDrag, {passive:false});
        });

        btn.addEventListener('click', () => submitMission('day_10_kid9_bento', {type:'game', data:'Bento perfecto preparado'}));
    }
},
"day_10_kid9_rainbow": {
    tag: "photo", day: 10, title: "El Snack Arcoíris", role: "kid9", xp: 15, location: "Nishiki",
    render: () => `
        <p class="mission-desc">Foto de algo comestible con al menos 3 colores diferentes y ponle un nombre inventado divertido.</p>
        <input type="text" id="rainbow-name" placeholder="Ej: Mega-Pincho Espacial" style="width:100%; margin-bottom:15px;">
        <button id="btn-cam" class="btn-secondary">📸 Foto del Snack</button>
    `,
    attachEvents: (role) => { 
        attachCameraFlow('btn-cam', 'day_10_kid9_rainbow', currentUser, false); 
        const btn = document.getElementById('btn-cam');
        const oldInput = btn.nextElementSibling;
        if(oldInput && oldInput.tagName === 'INPUT') {
            const oldClone = oldInput.cloneNode(true);
            oldInput.parentNode.replaceChild(oldClone oldInput);
            oldClone.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if(!file) return;
                btn.innerText = '⏳ Procesando...';
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    const name = document.getElementById('rainbow-name').value || 'Sin nombre';
                    submitMission('day_10_kid9_rainbow', {type:'mixed', data:`Nombre: ${name}. Foto ID: ${photoId}`});
                } catch(err) { console.error(err); }
            });
        }
    }
},
"day_10_kid9_matcha": {
    tag: "sensors", day: 10, title: "Poción de Matcha", role: "kid9", xp: 15, location: "Nishiki",
    render: () => `
        <p class="mission-desc">Busca un producto que contenga Matcha. Si puedes escanear su código de barras con la cámara, el Juez sabrá que es auténtico.</p>
        <div id="barcode-box" style="width:100%; height:200px; background:#000; border:2px dashed #0f0; margin-bottom:10px; display:flex; justify-content:center; align-items:center; overflow:hidden; position:relative;">
            <video id="barcode-vid" autoplay playsinline style="width:100%; height:100%; object-fit:cover; display:none;"></video>
            <div id="barcode-line" style="position:absolute; width:100%; height:2px; background:red; top:50%; box-shadow:0 0 10px red;"></div>
            <p id="barcode-status" style="color:#0f0; position:absolute; z-index:10; background:rgba(0,0,0,0.5); padding:5px;">Iniciando escáner...</p>
        </div>
        <p class="mission-desc">O escribe el código de barras / nombre manualmente si falla:</p>
        <input type="text" id="matcha-manual" placeholder="Código o nombre..." style="width:100%; margin-bottom:15px;">
        <button id="btn-matcha-sub" class="btn-primary" style="width:100%;">Enviar Datos al Juez</button>
    `,
    attachEvents: () => {
        const vid = document.getElementById('barcode-vid');
        const stat = document.getElementById('barcode-status');
        let stream = null;
        let scanning = true;

        const startScanner = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                vid.srcObject = stream;
                vid.style.display = 'block';
                stat.innerText = 'Escaneando (BarcodeDetector experimental)...';
                
                if ('BarcodeDetector' in window) {
                    const detector = new window.BarcodeDetector();
                    const scan = async () => {
                        if(!scanning) return;
                        try {
                            const barcodes = await detector.detect(vid);
                            if (barcodes.length > 0) {
                                document.getElementById('matcha-manual').value = barcodes[0].rawValue;
                                stat.innerText = '¡DETECTADO!';
                                stat.style.color = '#ff0';
                                scanning = false;
                                if(stream) stream.getTracks().forEach(t=>t.stop());
                            } else {
                                requestAnimationFrame(scan);
                            }
                        } catch(e) { requestAnimationFrame(scan); }
                    };
                    scan();
                } else {
                    stat.innerText = 'Escáner no soportado. Usa manual.';
                }
            } catch(e) { stat.innerText = 'Cámara no disponible.'; }
        };
        startScanner();
        
        document.getElementById('btn-matcha-sub').addEventListener('click', () => {
            submitMission('day_10_kid9_matcha', {type:'text', data: `Matcha Code: ${document.getElementById('matcha-manual').value}`});
        });
        
        window._missionCleanup = () => { scanning = false; if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_10_kid14_tako": {
    tag: "writing", day: 10, title: "Comida Bizarra", role: "kid14", xp: 15, location: "Nishiki",
    render: () => `
        <p class="mission-desc">Localiza el famoso Tako Tamago (un pequeño pulpo rojo con un huevo de codorniz en la cabeza). ¿A cuánto lo venden hoy?</p>
        <input type="number" id="tako-price" placeholder="Precio en yenes (¥)..." style="width:100%; margin-bottom:15px;">
        <button id="btn-tako" class="btn-primary" style="width:100%;">Enviar Reporte</button>
    `,
    attachEvents: () => {
        document.getElementById('btn-tako').addEventListener('click', () => {
            submitMission('day_10_kid14_tako', {type:'number', data: document.getElementById('tako-price').value});
        });
    }
}

,

// ====== NUEVAS MISIONES DÍAS 11 A 15 ======
// --- DÍA 11 ---
"day_11_onsen": {
    tag: "expert", day: 11, title: "El Código Onsen", role: "kid9", xp: 15, location: "Okuhida",
    render: () => `
        <p class="mission-desc">Antes de entrar al onsen, debes conocer las 3 reglas sagradas.</p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px; background:var(--color-gray-light); padding:15px; border-radius:8px;">
            <label style="font-size:1.2rem;"><input type="checkbox" id="chk-o1" style="transform:scale(1.5); margin-right:10px;"> ✅ Me duché antes de entrar</label>
            <label style="font-size:1.2rem;"><input type="checkbox" id="chk-o2" style="transform:scale(1.5); margin-right:10px;"> ✅ No llevo bañador</label>
            <label style="font-size:1.2rem;"><input type="checkbox" id="chk-o3" style="transform:scale(1.5); margin-right:10px;"> ✅ La toalla no toca el agua</label>
        </div>
        <button id="btn-val-onsen" class="btn-primary" style="width:100%;">Validar reglas</button>
        <button id="btn-sub-onsen" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const v = document.getElementById('btn-val-onsen');
        const s = document.getElementById('btn-sub-onsen');
        v.addEventListener('click', () => {
            if(document.getElementById('chk-o1').checked && document.getElementById('chk-o2').checked && document.getElementById('chk-o3').checked) {
                v.classList.add('hidden'); s.classList.remove('hidden'); launchConfetti();
            } else { showAlert('Aviso', 'Falta una regla. ¡Revisa!'); }
        });
        s.addEventListener('click', () => submitMission('day_11_onsen', {type:'text', data:'Reglas del onsen aprendidas'}));
    }
},
"day_11_tea": {
    tag: "sensors", day: 11, title: "El Té Intacto", role: "kid9", xp: 25, location: "Ryokan",
    render: () => `
        <p class="mission-desc">Camina 20 segundos con el móvil nivelado como una bandeja de té matcha.</p>
        <div style="display:flex; justify-content:center; align-items:center; height:150px; background:#d4c4a8; border-radius:20px; overflow:hidden; position:relative; box-shadow:inset 0 0 20px rgba(0,0,0,0.5);">
            <div style="width:100px; height:100px; background:#4a5d23; border-radius:50%; border:4px solid #f0e6d2; display:flex; justify-content:center; align-items:center;">
                <div id="tea-liquid" style="width:80px; height:80px; background:#8a9a5b; border-radius:50%; transition: transform 0.1s; position:relative;">
                    <div id="tea-steam" class="hidden" style="position:absolute; top:-20px; left:20px; font-size:2rem; animation:float 2s infinite;">♨️</div>
                </div>
            </div>
            <div id="tea-timer" style="position: absolute; top: 10px; right: 15px; font-size: 2rem; font-weight: bold; color: #333;">20</div>
        </div>
        <button id="btn-start-tea" class="btn-secondary" style="width:100%; margin-top: 15px;">Empezar a caminar</button>
        <button id="btn-sub-tea" class="btn-primary hidden" style="width:100%; margin-top: 15px;">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const drop = document.getElementById('tea-liquid');
        const timerEl = document.getElementById('tea-timer');
        const btnS = document.getElementById('btn-start-tea');
        const btnV = document.getElementById('btn-sub-tea');
        const steam = document.getElementById('tea-steam');
        
        let active = false; let time = 20; let interval = null; let b0 = null, g0 = null;

        const handleOrientation = (e) => {
            if(!active) return;
            if(b0 === null) { b0 = e.beta; g0 = e.gamma; }
            let db = e.beta - b0; let dg = e.gamma - g0;
            drop.style.transform = `translate(${dg * 1.5}px, ${db * 1.5}px)`;
            
            if(Math.abs(db) > 8 || Math.abs(dg) > 8) {
                active = false; clearInterval(interval);
                drop.style.background = '#888';
                btnS.innerText = "¡Derramado! Reintentar"; btnS.classList.remove('hidden');
                window.removeEventListener('deviceorientation', handleOrientation);
            }
        };

        btnS.addEventListener('click', () => {
            const startSim = () => {
                active = true; time = 20; b0 = null; g0 = null;
                drop.style.background = '#8a9a5b'; drop.style.transform = 'translate(0,0)';
                steam.classList.add('hidden'); timerEl.innerText = time; btnS.classList.add('hidden');
                window.addEventListener('deviceorientation', handleOrientation);
                
                interval = setInterval(() => {
                    if(!active) return;
                    time--; timerEl.innerText = time;
                    if(time <= 0) {
                        active = false; clearInterval(interval);
                        steam.classList.remove('hidden'); btnV.classList.remove('hidden'); launchConfetti();
                        window.removeEventListener('deviceorientation', handleOrientation);
                    }
                }, 1000);
            };

            if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(res => { if(res === 'granted') startSim(); }).catch(console.error);
            } else { startSim(); }
        });
        btnV.addEventListener('click', () => submitMission('day_11_tea', {type:'game', data:'Té llevado sin derramar'}));
        window._missionCleanup = () => { active = false; clearInterval(interval); window.removeEventListener('deviceorientation', handleOrientation); };
    }
},
"day_11_yukata": {
    tag: "economy", day: 11, title: "Cazadora de Yukatas", role: "kid9", xp: 15, location: "Ryokan",
    render: () => `
        <p class="mission-desc">¿Cuántas personas con yukata has visto hoy?</p>
        <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
            <button id="btn-sub-y" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">-</button>
            <div id="yukata-count" style="font-size:3rem; font-weight:bold;">0</div>
            <button id="btn-add-y" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">+</button>
        </div>
        <button id="btn-send-yukata" class="btn-primary" style="width:100%;">Enviar recuento</button>
    `,
    attachEvents: () => {
        let count = 0;
        document.getElementById('btn-add-y').addEventListener('click', () => { count++; document.getElementById('yukata-count').innerText = count; });
        document.getElementById('btn-sub-y').addEventListener('click', () => { if(count>0) count--; document.getElementById('yukata-count').innerText = count; });
        document.getElementById('btn-send-yukata').addEventListener('click', () => { submitMission('day_11_yukata', {type:'number', data: count}); });
    }
},
"day_11_tatami": {
    tag: "photo", day: 11, title: "La Textura del Tatami", role: "kid9", xp: 15, location: "Ryokan",
    render: () => `<p class="mission-desc">Haz una foto muy de cerca al suelo de tatami.</p><button id="btn-cam" class="btn-secondary">📸 Foto Macro</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_11_tatami', currentUser, false); }
},
"day_11_kaiseki": {
    tag: "writing", day: 11, title: "Catador de Kaiseki", role: "kid14", xp: 20, location: "Ryokan",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> CATA GASTRONÓMICA: Prueba el plato más extraño.</p>
            <input type="text" id="k-name" placeholder="Nombre del plato..." style="width:100%; margin-bottom:10px;">
            <div style="display:flex; gap:5px; margin-bottom:10px;">
                <input type="text" id="k-adj1" placeholder="Adjetivo 1" style="flex:1;">
                <input type="text" id="k-adj2" placeholder="Adjetivo 2" style="flex:1;">
                <input type="text" id="k-adj3" placeholder="Adjetivo 3" style="flex:1;">
            </div>
            <input type="text" id="k-drink" placeholder="Bebida ideal para maridar..." style="width:100%; margin-bottom:15px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar cata</button>
        </div>
    `,
    attachEvents: () => {
        document.getElementById('btn').addEventListener('click', () => {
            const n = document.getElementById('k-name').value;
            const a1 = document.getElementById('k-adj1').value, a2 = document.getElementById('k-adj2').value, a3 = document.getElementById('k-adj3').value;
            submitMission('day_11_kaiseki', {type:'text', data:`Plato: ${n}. Adjs: ${a1}, ${a2}, ${a3}. Bebida: ${document.getElementById('k-drink').value}.`});
        });
    }
},
"day_11_spring": {
    tag: "sensors", day: 11, title: "Rastreador de Manantiales", role: "kid14", xp: 25, location: "Okuhida",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> RASTREANDO MANANTIAL. Objetivo: Nodo Termal.</p>
            <div style="text-align:center; margin:20px 0;">
                <div id="radar-dist" style="font-size:3rem; color:#0f0; text-shadow:0 0 10px #0f0; cursor:pointer;">-- m</div>
                <div id="radar-msg" style="color:#aaa;">Buscando señal GPS...</div>
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Marcar posición</button>
        </div>
    `,
    attachEvents: () => {
        const dEl = document.getElementById('radar-dist');
        const mEl = document.getElementById('radar-msg');
        const btn = document.getElementById('btn');
        let watchId = null;
        const targetLat = 36.225; const targetLon = 137.550; const R = 6371e3;
        if('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition((pos) => {
                const lat1 = pos.coords.latitude * Math.PI/180;
                const lat2 = targetLat * Math.PI/180;
                const dLat = (targetLat - pos.coords.latitude) * Math.PI/180;
                const dLon = (targetLon - pos.coords.longitude) * Math.PI/180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const d = R * c;
                dEl.innerText = Math.round(d) + ' m';
                if(d < 15) { mEl.innerText = ">>> ORIGEN LOCALIZADO"; mEl.style.color = "#0f0"; btn.classList.remove('hidden'); }
                else { mEl.innerText = ">>> Señal débil. Acércate al origen."; }
            }, (err) => { mEl.innerText = "Error GPS: " + err.message; }, {enableHighAccuracy: true});
        }
        let cheat = 0; dEl.addEventListener('click', () => { cheat++; if(cheat >= 5) btn.classList.remove('hidden'); });
        btn.addEventListener('click', () => submitMission('day_11_spring', {type:'game', data:'Manantial termal localizado'}));
        window._missionCleanup = () => { if(watchId) navigator.geolocation.clearWatch(watchId); };
    }
},
"day_11_architecture": {
    tag: "expert", day: 11, title: "Arquitectura Termal", role: "kid14", xp: 20, location: "Ryokan",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ESTIMACIÓN VOLUMÉTRICA DEL ONSEN</p>
            <input type="number" id="v-l" placeholder="Largo (m)" style="width:100%; margin-bottom:10px;">
            <input type="number" id="v-w" placeholder="Ancho (m)" style="width:100%; margin-bottom:10px;">
            <input type="number" id="v-d" placeholder="Profundidad (m)" style="width:100%; margin-bottom:10px;">
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Calcular</button>
            <div id="v-res" style="font-weight:bold; color:#0f0; margin-bottom:15px;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Enviar Medidas</button>
        </div>
    `,
    attachEvents: () => {
        let finalVol = 0;
        document.getElementById('btn-calc').addEventListener('click', () => {
            const l = document.getElementById('v-l').value, w = document.getElementById('v-w').value, d = document.getElementById('v-d').value;
            if(l && w && d) {
                finalVol = (l * w * d).toFixed(1);
                document.getElementById('v-res').innerText = `Volumen estimado: ${finalVol} m³ = ${finalVol * 1000} litros`;
                document.getElementById('btn').classList.remove('hidden');
            }
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_11_architecture', {type:'text', data:`Volumen onsen: ${finalVol} m³`}));
    }
},
"day_11_economy": {
    tag: "economy", day: 11, title: "Economía Alpina", role: "kid14", xp: 15, location: "Ryokan",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ¿Cuánto cuesta mantener este ryokan un día entero?</p>
            <input type="number" id="e-cost" placeholder="Coste diario (yenes)..." style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Estimación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => { submitMission('day_11_economy', {type:'number', data:document.getElementById('e-cost').value}); }); }
},
"day_11_geta": {
    tag: "physical", day: 11, title: "Equilibrio del Yukata", role: "both", xp: 20, location: "Ryokan",
    render: () => `
        <p class="mission-desc">Camina 30 pasos en línea recta con zapatillas de madera sin tropezar.</p>
        <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
            <div id="geta-count" style="font-size:4rem; font-weight:bold;">0/30</div>
            <button id="btn-step" class="btn-secondary" style="font-size:2rem; padding:20px;">👣</button>
        </div>
        <button id="btn-geta" class="btn-primary hidden" style="width:100%;">¡Terminé sin caer!</button>
    `,
    attachEvents: (role) => {
        let steps = 0;
        document.getElementById('btn-step').addEventListener('click', () => {
            steps++; document.getElementById('geta-count').innerText = `${steps}/30`;
            if(steps >= 30) { document.getElementById('btn-geta').classList.remove('hidden'); launchConfetti(); }
        });
        document.getElementById('btn-geta').addEventListener('click', () => submitMission('day_11_geta', {type:'game', data:'30 pasos en geta superados'}, role, true));
    }
},

// --- DÍA 12 ---
"day_12_silence": {
    tag: "expert", day: 12, title: "Silencio de los Kami", role: "kid9", xp: 25, location: "Takayama",
    render: () => `
        <p class="mission-desc">No despiertes al Kami... guarda silencio absoluto durante 10 segundos.</p>
        <div style="text-align:center; margin: 20px 0;">
            <div id="kami-icon" style="font-size:5rem; transition: transform 0.3s;">😴💤</div>
            <div style="width:100%; height:20px; background:#eee; border-radius:10px; overflow:hidden; margin-top:15px; border:2px solid #ccc;">
                <div id="silence-bar" style="height:100%; width:0%; background:#4facfe; transition: width 0.1s;"></div>
            </div>
        </div>
        <button id="btn-start-silence" class="btn-secondary" style="width:100%;">Iniciar Silencio</button>
        <button id="btn-silence" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const btnS = document.getElementById('btn-start-silence');
        const btn = document.getElementById('btn-silence');
        const icon = document.getElementById('kami-icon');
        const bar = document.getElementById('silence-bar');
        
        let audioCtx = null; let analyser = null; let stream = null; let rafId = null;
        let isSilent = false; let startTime = 0;
        
        const stopAudio = () => {
            isSilent = false; if(rafId) cancelAnimationFrame(rafId);
            if(stream) stream.getTracks().forEach(t => t.stop());
            if(audioCtx && audioCtx.state !== 'closed') audioCtx.close();
        };

        const checkAudio = (timestamp) => {
            if(!isSilent) return;
            rafId = requestAnimationFrame(checkAudio);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
            let avg = sum / dataArray.length;
            
            if(avg > 30) {
                icon.innerText = "😱"; icon.style.transform = "scale(1.2) rotate(10deg)";
                icon.style.color = "red";
                bar.style.width = '0%'; startTime = timestamp; 
                setTimeout(() => { icon.innerText = "😴💤"; icon.style.transform = "scale(1)"; }, 1000);
            } else {
                let elapsed = timestamp - startTime;
                let pct = (elapsed / 10000) * 100;
                bar.style.width = Math.min(100, pct) + '%';
                if(elapsed >= 10000) {
                    icon.innerText = "✨😲✨";
                    btn.classList.remove('hidden'); btnS.classList.add('hidden');
                    stopAudio(); launchConfetti();
                }
            }
        };

        btnS.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                let source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);
                isSilent = true; btnS.innerText = "Escuchando..."; btnS.disabled = true;
                startTime = performance.now(); checkAudio(performance.now());
            } catch(e) { alert("Error micro: " + e.message); }
        });
        btn.addEventListener('click', () => submitMission('day_12_silence', {type:'game', data:'10 segundos de silencio absoluto'}));
        window._missionCleanup = stopAudio;
    }
},
"day_12_sugidama": {
    tag: "photo", day: 12, title: "La Bola de Cedro", role: "kid9", xp: 15, location: "Takayama",
    render: () => `<p class="mission-desc">Busca una gran bola de ramas de cedro (Sugidama) en una tienda de sake.</p><button id="btn-cam" class="btn-secondary">📸 Foto Sugidama</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_12_sugidama', currentUser, false); }
},
"day_12_wood": {
    tag: "photo", day: 12, title: "Detective de Madera", role: "kid9", xp: 15, location: "Takayama",
    render: () => `
        <p class="mission-desc">Busca una talla de madera divertida en una fachada.</p>
        <input type="text" id="wood-desc" placeholder="¿Qué animal es?" style="width:100%; margin-bottom:10px;">
        <button id="btn-cam" class="btn-secondary">📸 Foto Talla</button>
    `,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_12_wood', currentUser, false); }
},
"day_12_hida": {
    tag: "economy", day: 12, title: "Degustadora de Hida", role: "kid9", xp: 15, location: "Takayama",
    render: () => `
        <p class="mission-desc">Puntúa el sabor de la famosa carne de Hida.</p>
        <div style="font-size:3rem; text-align:center; margin:15px 0; cursor:pointer;" id="stars">
            <span data-val="1">☆</span><span data-val="2">☆</span><span data-val="3">☆</span><span data-val="4">☆</span><span data-val="5">☆</span>
        </div>
        <button id="btn" class="btn-primary" style="width:100%">Enviar Puntuación</button>
    `,
    attachEvents: () => {
        let score = 0;
        const spans = document.querySelectorAll('#stars span');
        spans.forEach(s => s.addEventListener('click', () => {
            score = parseInt(s.dataset.val);
            spans.forEach(ss => ss.innerText = parseInt(ss.dataset.val) <= score ? '★' : '☆');
            spans.forEach(ss => ss.style.color = parseInt(ss.dataset.val) <= score ? 'gold' : 'black');
        }));
        document.getElementById('btn').addEventListener('click', () => {
            if(score>0) submitMission('day_12_hida', {type:'number', data:`Puntuación carne Hida: ${score} estrellas`});
        });
    }
},
"day_12_carving": {
    tag: "expert", day: 12, title: "Talla en Madera", role: "kid14", xp: 25, location: "Takayama",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px; display:flex; flex-direction:column; align-items:center;">
            <p>>>> REPLICA LA TALLA DEL KANJI (Árbol): 木</p>
            <div style="background:#2c1b18; border:4px solid #5c4033; position:relative; width:300px; height:300px; margin-bottom:15px; border-radius:5px;">
                <canvas id="carve-canvas" width="300" height="300" style="position:absolute; top:0; left:0; z-index:10;"></canvas>
                <div style="position:absolute; top:10px; right:10px; font-size:2rem; color:rgba(255,255,255,0.2);">木</div>
            </div>
            <div style="display:flex; gap:10px; width:100%;">
                <button id="btn-clear" class="btn-secondary" style="flex:1;">Borrar</button>
                <button id="btn-submit" class="btn-primary" style="flex:2;">Enviar Trazo</button>
            </div>
        </div>
    `,
    attachEvents: () => {
        const canvas = document.getElementById('carve-canvas');
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#00FF41'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        let drawing = false;

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: cx - rect.left y: cy - rect.top };
        };
        const startDraw = (e) => { drawing = true; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x pos.y); };
        const draw = (e) => { if(!drawing) return; e.preventDefault(); const pos = getPos(e); ctx.lineTo(pos.x pos.y); ctx.stroke(); };
        const stopDraw = () => { drawing = false; };

        canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('mousemove', draw); canvas.addEventListener('mouseup', stopDraw); canvas.addEventListener('mouseout', stopDraw);
        canvas.addEventListener('touchstart', startDraw, {passive:false}); canvas.addEventListener('touchmove', draw, {passive:false}); canvas.addEventListener('touchend', stopDraw);

        document.getElementById('btn-clear').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
        document.getElementById('btn-submit').addEventListener('click', async () => {
            const dataUrl = canvas.toDataURL('image/png');
            const photoId = 'carve_' + Date.now();
            await savePhotoToDB(photoId, dataUrl);
            submitMission('day_12_carving', {type:'photo', data:photoId});
        });
    }
},
"day_12_sake": {
    tag: "economy", day: 12, title: "Maestro Destilador", role: "kid14", xp: 20, location: "Takayama",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> DESTILERÍA FUNASAKA.</p>
            <input type="number" id="sake-ans" placeholder="Años de antigüedad (2026 - fundación)" style="width:100%; margin-bottom:10px;">
            <p id="sake-msg" style="color:red;"></p>
            <button id="btn" class="btn-primary" style="width:100%">Desencriptar</button>
        </div>
    `,
    attachEvents: () => {
        let fails = 0;
        document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('sake-ans').value;
            if(val == "323") {
                submitMission('day_12_sake', {type:'number', data:'323 años'});
            } else {
                fails++; document.getElementById('sake-msg').innerText = "Incorrecto. Pista: Busca la fecha 1703 en los carteles.";
            }
        });
    }
},
"day_12_patrol": {
    tag: "physical", day: 12, title: "Patrulla Sanmachi Suji", role: "kid14", xp: 15, location: "Takayama",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> CASAS TRADICIONALES DETECTADAS:</p>
            <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
                <button id="btn-sub-p" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">-</button>
                <div id="patrol-count" style="font-size:3rem; font-weight:bold; color:#0f0;">0</div>
                <button id="btn-add-p" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">+</button>
            </div>
            <button id="btn" class="btn-primary" style="width:100%">Enviar Recuento</button>
        </div>
    `,
    attachEvents: () => {
        let count = 0;
        document.getElementById('btn-add-p').addEventListener('click', () => { count++; document.getElementById('patrol-count').innerText = count; });
        document.getElementById('btn-sub-p').addEventListener('click', () => { if(count>0) count--; document.getElementById('patrol-count').innerText = count; });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_12_patrol', {type:'number', data: count}));
    }
},
"day_12_appraisal": {
    tag: "economy", day: 12, title: "Tasador Feudal", role: "kid14", xp: 15, location: "Takayama",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ESTIMACIÓN INMOBILIARIA (CALLE HISTÓRICA)</p>
            <input type="number" id="app-cost" placeholder="Precio estimado (€)..." style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Tasación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_12_appraisal', {type:'number', data:document.getElementById('app-cost').value})); }
},
"day_12_bridge": {
    tag: "photo", day: 12, title: "Cruzando el Miyagawa", role: "both", xp: 20, location: "Takayama",
    render: () => `
        <p class="mission-desc">Selfie familiar en el puente rojo sobre el río Miyagawa.</p>
        <label style="display:block; margin:20px 0; font-size:1.2rem; background:var(--color-gray-light); padding:15px; border-radius:10px;"><input type="checkbox" id="chk-bridge" style="transform:scale(1.5); margin-right:15px;"> ✅ Foto en el puente rojo hecha</label>
        <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            if(document.getElementById('chk-bridge').checked) submitMission('day_12_bridge', {type:'text', data:'Foto puente confirmada'}, role, true);
            else showAlert('Aviso', 'Debéis confirmar marcando la casilla.');
        });
    }
},

// --- DÍA 13 ---
"day_13_stairs": {
    tag: "physical", day: 13, title: "La Escalada Chureito", role: "kid9", xp: 20, location: "Kawaguchiko",
    render: () => `
        <p class="mission-desc">Sube los escalones hasta la pagoda y escribe el número exacto.</p>
        <input type="number" id="st-ans" placeholder="Número..." style="width:100%; margin-bottom:15px; font-size:2rem; text-align:center;">
        <button id="btn" class="btn-primary" style="width:100%">Enviar al Juez</button>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_13_stairs', {type:'number', data:document.getElementById('st-ans').value})); }
},
"day_13_manhole": {
    tag: "photo", day: 13, title: "El Sello del Lago", role: "kid9", xp: 15, location: "Kawaguchiko",
    render: () => `<p class="mission-desc">Busca una tapa de alcantarilla decorada con el Fuji.</p><button id="btn-cam" class="btn-secondary">📸 Foto Tapa</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_13_manhole', currentUser, false); }
},
"day_13_icecream": {
    tag: "writing", day: 13, title: "Sabores del Fuji", role: "kid9", xp: 15, location: "Kawaguchiko",
    render: () => `
        <p class="mission-desc">Prueba un helado de un sabor raro y elige su color.</p>
        <input type="text" id="ic-desc" placeholder="¿De qué sabor era?" style="width:100%; margin-bottom:10px;">
        <div style="display:flex; gap:5px; margin-bottom:15px; justify-content:space-around;">
            <button class="color-btn" data-c="🟢" style="background:#2ecc71; width:40px; height:40px; border-radius:50%; border:none;"></button>
            <button class="color-btn" data-c="🟣" style="background:#9b59b6; width:40px; height:40px; border-radius:50%; border:none;"></button>
            <button class="color-btn" data-c="🟡" style="background:#f1c40f; width:40px; height:40px; border-radius:50%; border:none;"></button>
            <button class="color-btn" data-c="🔵" style="background:#3498db; width:40px; height:40px; border-radius:50%; border:none;"></button>
            <button class="color-btn" data-c="⚪" style="background:#fff; border:1px solid #ccc; width:40px; height:40px; border-radius:50%;"></button>
        </div>
        <button id="btn" class="btn-primary" style="width:100%">Enviar sabor</button>
    `,
    attachEvents: () => {
        let selectedC = "";
        const btns = document.querySelectorAll('.color-btn');
        btns.forEach(b => b.addEventListener('click', (e) => {
            btns.forEach(bb => bb.style.transform = 'scale(1)');
            e.target.style.transform = 'scale(1.2)';
            selectedC = e.target.dataset.c;
        }));
        document.getElementById('btn').addEventListener('click', () => submitMission('day_13_icecream', {type:'text', data:`Sabor: ${document.getElementById('ic-desc').value} Color: ${selectedC}`}));
    }
},
"day_13_yokai": {
    tag: "expert", day: 13, title: "Filtro de Yōkai", role: "kid9", xp: 25, location: "Bosque",
    render: () => `
        <p class="mission-desc">Usa el visor espectral para revelar espíritus ocultos (colores invertidos).</p>
        <div style="position:relative; width:100%; height:300px; background:#000; overflow:hidden; border-radius:10px; margin-bottom:10px;">
            <video id="y-vid" autoplay playsinline muted style="display:none;"></video>
            <canvas id="y-can" width="300" height="300" style="width:100%; height:100%; object-fit:cover;"></canvas>
        </div>
        <button id="btn-cap" class="btn-secondary" style="width:100%">Capturar espectro</button>
    `,
    attachEvents: () => {
        const vid = document.getElementById('y-vid');
        const can = document.getElementById('y-can');
        const ctx = can.getContext('2d', { willReadFrequently: true });
        const btn = document.getElementById('btn-cap');
        let stream = null; let rafId = null; let active = true;

        const processFrame = () => {
            if(!active) return;
            if(vid.videoWidth > 0) {
                can.width = vid.videoWidth; can.height = vid.videoHeight;
                ctx.drawImage(vid 0, 0, can.width, can.height);
                let frame = ctx.getImageData(0, 0, can.width, can.height);
                let l = frame.data.length / 4;
                for (let i = 0; i < l; i++) {
                    frame.data[i * 4 + 0] = 255 - frame.data[i * 4 + 0];
                    frame.data[i * 4 + 1] = 255 - frame.data[i * 4 + 1];
                    frame.data[i * 4 + 2] = 255 - frame.data[i * 4 + 2];
                }
                ctx.putImageData(frame, 0, 0);
            }
            rafId = requestAnimationFrame(processFrame);
        };

        const startVid = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({video:{facingMode: 'environment'}});
                vid.srcObject = stream; vid.onplay = () => processFrame();
            } catch(e) { alert("Cámara no disponible"); }
        };
        startVid();

        btn.addEventListener('click', async () => {
            active = false; cancelAnimationFrame(rafId);
            if(stream) stream.getTracks().forEach(t=>t.stop());
            const dataUrl = can.toDataURL('image/jpeg', 0.8);
            const photoId = 'yokai_' + Date.now();
            await savePhotoToDB(photoId, dataUrl);
            submitMission('day_13_yokai', {type:'photo', data:photoId});
        });
        window._missionCleanup = () => { active = false; if(stream) stream.getTracks().forEach(t=>t.stop()); cancelAnimationFrame(rafId); };
    }
},
"day_13_perspective": {
    tag: "photo", day: 13, title: "Perspectiva del Gigante", role: "kid14", xp: 20, location: "Lago",
    render: () => `<p class="mission-desc">Foto de ilusión óptica donde parezca que tocas la punta del Fuji.</p><button id="btn-cam" class="btn-secondary">📸 Enviar ilusión</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_13_perspective', currentUser, false); }
},
"day_13_tunnels": {
    tag: "economy", day: 13, title: "Navegantes del Asfalto", role: "kid14", xp: 15, location: "Coche",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> TÚNELES ATRAVESADOS:</p>
            <input type="number" id="t-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Recuento</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_13_tunnels', {type:'number', data:document.getElementById('t-ans').value})); }
},
"day_13_volcano": {
    tag: "writing", day: 13, title: "Análisis Vulcanológico", role: "kid14", xp: 20, location: "Fuji",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> BUSCANDO REGISTROS DE ERUPCIÓN...</p>
            <input type="text" id="v-type" placeholder="Tipo de volcán" style="width:100%; margin-bottom:10px;">
            <input type="number" id="v-year" placeholder="Última erupción (año)" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_13_volcano', {type:'text', data:`Tipo: ${document.getElementById('v-type').value}. Año: ${document.getElementById('v-year').value}`})); }
},
"day_13_triangulation": {
    tag: "expert", day: 13, title: "Triangulación del Fuji", role: "kid14", xp: 20, location: "Lago",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> Estimación visual de distancia.</p>
            <input type="number" id="tr-dist" placeholder="Distancia estimada (km)..." style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Estimación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_13_triangulation', {type:'number', data:document.getElementById('tr-dist').value})); }
},
"day_13_oishi": {
    tag: "photo", day: 13, title: "Oishi Park en Flor", role: "both", xp: 20, location: "Oishi Park",
    render: () => `
        <p class="mission-desc">Foto familiar con flores en primer plano y el Fuji al fondo.</p>
        <label style="display:block; margin:20px 0; font-size:1.2rem; background:var(--color-gray-light); padding:15px; border-radius:10px;"><input type="checkbox" id="chk-oishi" style="transform:scale(1.5); margin-right:15px;"> ✅ Foto en Oishi Park confirmada</label>
        <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            if(document.getElementById('chk-oishi').checked) submitMission('day_13_oishi', {type:'text', data:'Foto Oishi realizada'}, role, true);
            else showAlert('Aviso', 'Marca la casilla.');
        });
    }
},

// --- DÍA 14 ---
"day_14_rock": {
    tag: "photo", day: 14, title: "Aliento de Volcán", role: "kid9", xp: 15, location: "Fuji 5ª Estación",
    render: () => `<p class="mission-desc">Encuentra una piedra negra con agujeritos (lava) y hazle una foto muy de cerca.</p><button id="btn-cam" class="btn-secondary">📸 Foto Macro</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_14_rock', currentUser, false); }
},
"day_14_kid9_echo": {
    tag: "audio", day: 14, title: "El Sonido que Muere", role: "kid9", xp: 20, location: "Aokigahara",
    render: () => `
        <p class="mission-desc">Da una palmada fuerte. ¿Escuchas cómo el sonido muere al instante? Graba 5 segundos.</p>
        <div id="rec-ui-echo" style="text-align:center; margin: 20px 0;">
            <button id="btn-rec-echo" class="btn-primary" style="width:100%; border-radius:50px; height:60px; font-size:1.5rem;">🎙️ Grabar Palmada</button>
        </div>
        <audio id="au-echo" controls class="hidden" style="width:100%; margin-bottom:15px;"></audio>
        <button id="btn-sub-echo" class="btn-primary hidden" style="width:100%;">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const btnR = document.getElementById('btn-rec-echo');
        const au = document.getElementById('au-echo');
        const btnS = document.getElementById('btn-sub-echo');
        let mr=null, stream=null, blobId=null;
        
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({audio:true});
                mr = new MediaRecorder(stream);
                let chunks = [];
                mr.ondataavailable = e => chunks.push(e.data);
                mr.onstop = () => {
                    const blob = new Blob(chunks {'type':'audio/webm'});
                    au.src = URL.createObjectURL(blob); au.classList.remove('hidden');
                    btnR.classList.add('hidden'); btnS.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 5000);
            } catch(e) { alert("Error"); }
        });
        btnS.addEventListener('click', () => { if(blobId) submitMission('day_14_kid9_echo', {type:'audio', data:'Audio de palmada guardado'}); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_14_root": {
    tag: "photo", day: 14, title: "Guardián del Bosque", role: "kid9", xp: 15, location: "Aokigahara",
    render: () => `<p class="mission-desc">Encuentra la raíz de árbol más retorcida y fantasmal.</p><button id="btn-cam" class="btn-secondary">📸 Foto de Raíz</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_14_root', currentUser, false); }
},
"day_14_compass": {
    tag: "expert", day: 14, title: "Brújula al Cráter", role: "kid9", xp: 25, location: "Fuji",
    render: () => `
        <p class="mission-desc">Apunta con el móvil exactamente hacia la cima del Fuji.</p>
        <div style="display:flex; justify-content:center; align-items:center; height:200px; background:#1a252c; border-radius:50%; width:200px; margin:20px auto; position:relative; border:4px solid #34495e; box-shadow:0 10px 20px rgba(0,0,0,0.5);">
            <div id="c-arrow" style="font-size:4rem; transition:transform 0.1s; transform-origin:center; color:#e74c3c; text-shadow:0 0 10px red;">⬆️</div>
            <div id="c-target" style="position:absolute; top:10px; font-size:1.5rem; color:#f1c40f;">🗻</div>
        </div>
        <button id="btn-c-start" class="btn-secondary" style="width:100%;">Activar Brújula</button>
        <button id="btn-c-sub" class="btn-primary hidden" style="width:100%; margin-top:10px;">¡Acertaste! Enviar</button>
    `,
    attachEvents: () => {
        const arrow = document.getElementById('c-arrow');
        const btnS = document.getElementById('btn-c-start');
        const btnV = document.getElementById('btn-c-sub');
        let active = false;
        
        const handleOri = (e) => {
            if(!active) return;
            let rot = e.webkitCompassHeading || e.alpha || 0;
            arrow.style.transform = `rotate(${-rot}deg)`;
            if(Math.abs(rot - 180) < 15) { 
                active = false;
                arrow.style.color = "#2ecc71"; arrow.style.textShadow = "0 0 10px #2ecc71";
                btnS.classList.add('hidden'); btnV.classList.remove('hidden'); launchConfetti();
                window.removeEventListener('deviceorientation', handleOri);
            }
        };
        
        btnS.addEventListener('click', () => {
            active = true; btnS.innerText = "Gira el móvil...";
            if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(r => { if(r==='granted') window.addEventListener('deviceorientation', handleOri); });
            } else { window.addEventListener('deviceorientation', handleOri); }
        });
        btnV.addEventListener('click', () => submitMission('day_14_compass', {type:'game', data:'Orientación correcta al cráter'}));
        window._missionCleanup = () => { active=false; window.removeEventListener('deviceorientation', handleOri); };
    }
},
"day_14_radar": {
    tag: "sensors", day: 14, title: "Radar de Altitud Cero", role: "kid14", xp: 25, location: "Fuji 5ª Estación",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> BUSCANDO NODO CIEGO.</p>
            <div id="r-dist" style="font-size:3rem; color:#0f0; text-align:center; margin:20px 0; cursor:pointer;">-- m</div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Misión Completada</button>
        </div>
    `,
    attachEvents: () => {
        const dEl = document.getElementById('r-dist'); const btn = document.getElementById('btn');
        let cheat=0; dEl.addEventListener('click', () => { cheat++; if(cheat>=5) btn.classList.remove('hidden'); });
        btn.addEventListener('click', () => submitMission('day_14_radar', {type:'game', data:'Nodo ciego localizado'}));
    }
},
"day_14_pressure": {
    tag: "video", day: 14, title: "Ley de la Presión", role: "kid14", xp: 20, location: "Fuji",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> La bolsa de snacks está hinchada. Graba 5s explicando por qué.</p>
            <button id="btn-rec-p" class="btn-primary" style="width:100%; margin:10px 0;">🎬 Grabar explicación</button>
            <video id="vid-p" controls playsinline autoplay muted class="hidden" style="width:100%; border-radius:10px;"></video>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar Vídeo</button>
        </div>
    `,
    attachEvents: () => {
        const btnR = document.getElementById('btn-rec-p'); const vid = document.getElementById('vid-p'); const btn = document.getElementById('btn');
        let mr=null, stream=null, blobId=null;
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true});
                vid.srcObject = stream; vid.classList.remove('hidden');
                mr = new MediaRecorder(stream); let chunks=[]; mr.ondataavailable = e=>chunks.push(e.data);
                mr.onstop = () => {
                    vid.srcObject = null; const blob = new Blob(chunks {'type':'video/mp4'});
                    vid.src = URL.createObjectURL(blob); btnR.classList.add('hidden'); btn.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando (5s)..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 5000);
            } catch(e) { alert("Error"); }
        });
        btn.addEventListener('click', () => { if(blobId) submitMission('day_14_pressure', {type:'video', data:'Explicación guardada'}); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_14_altimeter": {
    tag: "economy", day: 14, title: "Altímetro Hacker", role: "kid14", xp: 15, location: "Fuji",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> METROS HASTA LA CIMA (3776 - 2300):</p>
            <input type="number" id="alt-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_14_altimeter', {type:'number', data:document.getElementById('alt-ans').value})); }
},
"day_14_kid14_echo": {
    tag: "writing", day: 14, title: "Densidad de Aokigahara", role: "kid14", xp: 15, location: "Aokigahara",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ¿Por qué en este bosque no hay eco?</p>
            <input type="text" id="echo-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_14_kid14_echo', {type:'text', data:document.getElementById('echo-ans').value})); }
},
"day_14_oxygen": {
    tag: "physical", day: 14, title: "Oxígeno Alpino", role: "both", xp: 20, location: "Fuji",
    render: () => `
        <p class="mission-desc">A 2300m hay menos oxígeno. Todos aguantad la respiración 15s a la vez.</p>
        <div id="oxy-timer" style="font-size:4rem; text-align:center; font-weight:bold; margin:20px 0; color:var(--color-accent);">15</div>
        <button id="btn-oxy" class="btn-primary" style="width:100%;">Iniciar apnea familiar</button>
        <button id="btn-sub-oxy" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar al Juez</button>
    `,
    attachEvents: (role) => {
        let t=15; let int=null; const timer = document.getElementById('oxy-timer'); const btn = document.getElementById('btn-oxy'); const sub = document.getElementById('btn-sub-oxy');
        btn.addEventListener('click', () => {
            btn.classList.add('hidden');
            int = setInterval(() => {
                t--; timer.innerText = t;
                if(t<=0) { clearInterval(int); sub.classList.remove('hidden'); launchConfetti(); }
            }, 1000);
        });
        sub.addEventListener('click', () => submitMission('day_14_oxygen', {type:'game', data:'Apnea 15s superada en grupo'}, role, true));
        window._missionCleanup = () => clearInterval(int);
    }
},

// --- DÍA 15 ---
"day_15_waterfall": {
    tag: "audio", day: 15, title: "Melodía de Shiraito", role: "kid9", xp: 20, location: "Shiraito Falls",
    render: () => `
        <p class="mission-desc">Graba 5 segundos del atronador sonido de la cascada Shiraito.</p>
        <button id="btn-rec-w" class="btn-secondary" style="width:100%;">🎙️ Grabar cascada</button>
        <audio id="au-w" controls class="hidden" style="width:100%; margin:15px 0;"></audio>
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const btnR = document.getElementById('btn-rec-w'); const au = document.getElementById('au-w'); const btn = document.getElementById('btn');
        let mr=null, stream=null, blobId=null;
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({audio:true});
                mr = new MediaRecorder(stream); let chunks=[]; mr.ondataavailable = e=>chunks.push(e.data);
                mr.onstop = () => {
                    const blob = new Blob(chunks {'type':'audio/webm'});
                    au.src = URL.createObjectURL(blob); au.classList.remove('hidden');
                    btnR.classList.add('hidden'); btn.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 5000);
            } catch(e) { alert("Error"); }
        });
        btn.addEventListener('click', () => { if(blobId) submitMission('day_15_waterfall', {type:'audio', data:'Cascada grabada'}); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_15_thatch": {
    tag: "photo", day: 15, title: "La Aldea de Paja", role: "kid9", xp: 15, location: "Iyashi no Sato",
    render: () => `<p class="mission-desc">Fotografía una casa tradicional con tejado de paja.</p><button id="btn-cam" class="btn-secondary">📸 Foto Casa</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_15_thatch', currentUser, false); }
},
"day_15_fish": {
    tag: "expert", day: 15, title: "Pez de Cristal", role: "kid9", xp: 20, location: "Estanques",
    render: () => `
        <p class="mission-desc">Dibuja el pez más bonito que hayas visto en el agua cristalina.</p>
        <div style="background:#fff; border:2px solid #ccc; width:100%; max-width:300px; height:300px; margin:0 auto 15px; border-radius:10px; position:relative; overflow:hidden; touch-action:none;">
            <canvas id="fish-can" width="300" height="300" style="width:100%; height:100%;"></canvas>
        </div>
        <div style="display:flex; gap:10px;">
            <button id="btn-clear" class="btn-secondary" style="flex:1;">Borrar</button>
            <button id="btn-sub" class="btn-primary" style="flex:2;">Enviar Pez</button>
        </div>
    `,
    attachEvents: () => {
        const can = document.getElementById('fish-can'); const ctx = can.getContext('2d');
        ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        let drawing = false;
        const getPos = (e) => { const rect=can.getBoundingClientRect(); const cx=e.touches?e.touches[0].clientX:e.clientX; const cy=e.touches?e.touches[0].clientY:e.clientY; return {x:cx-rect.left y:cy-rect.top}; };
        const start = (e) => { drawing=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.xp.y); };
        const draw = (e) => { if(!drawing) return; e.preventDefault(); const p=getPos(e); ctx.lineTo(p.xp.y); ctx.stroke(); };
        const stop = () => { drawing=false; };
        can.addEventListener('mousedown', start); can.addEventListener('mousemove', draw); can.addEventListener('mouseup', stop); can.addEventListener('mouseout', stop);
        can.addEventListener('touchstart', start, {passive:false}); can.addEventListener('touchmove', draw, {passive:false}); can.addEventListener('touchend', stop);
        
        document.getElementById('btn-clear').addEventListener('click', () => ctx.clearRect(0,0,can.width,can.height));
        document.getElementById('btn-sub').addEventListener('click', async () => {
            const data = can.toDataURL(); const id = 'fish_'+Date.now();
            await savePhotoToDB(id, data); submitMission('day_15_fish', {type:'photo', data:id});
        });
    }
},
"day_15_shogun": {
    tag: "physical", day: 15, title: "El Trono del Shogun", role: "kid9", xp: 15, location: "Iyashi no Sato",
    render: () => `<p class="mission-desc">Posa como un antiguo señor feudal en una silla tradicional.</p><button id="btn-cam" class="btn-secondary">📸 Foto Posando</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_15_shogun', currentUser, false); }
},
"day_15_deity": {
    tag: "writing", day: 15, title: "Santuario Escondido", role: "kid14", xp: 15, location: "Sengen Taisha",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> BÚSQUEDA OSINT: Deidad del Santuario Sengen Taisha:</p>
            <input type="text" id="d-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_15_deity', {type:'text', data:document.getElementById('d-ans').value})); }
},
"day_15_honcho": {
    tag: "photo", day: 15, title: "Perspectiva Honcho", role: "kid14", xp: 20, location: "Honcho St",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ENCUADRE PERFECTO: Alinea la calle con el Fuji.</p>
            <button id="btn-cam" class="btn-secondary" style="width:100%">📸 Capturar encuadre</button>
        </div>
    `,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_15_honcho', currentUser, false); }
},
"day_15_flow": {
    tag: "economy", day: 15, title: "Aforo de la Cascada", role: "kid14", xp: 15, location: "Shiraito",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> LITROS POR SEGUNDO ESTIMADOS:</p>
            <input type="number" id="f-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Estimación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_15_flow', {type:'number', data:document.getElementById('f-ans').value})); }
},
"day_15_roof": {
    tag: "economy", day: 15, title: "Ingeniería Tradicional", role: "kid14", xp: 15, location: "Iyashi no Sato",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ¿Por qué los techos de paja son tan empinados?</p>
            <input type="text" id="r-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Explicación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_15_roof', {type:'text', data:document.getElementById('r-ans').value})); }
},
"day_15_dragon": {
    tag: "writing", day: 15, title: "La Leyenda del Dragón", role: "both", xp: 20, location: "Lago",
    render: () => `
        <p class="mission-desc">Escribid entre los dos un cuento corto sobre un dragón en el lago.</p>
        <textarea id="d-txt1" placeholder="Niña (3 frases)..." style="width:100%; height:80px; margin-bottom:10px;"></textarea>
        <textarea id="d-txt2" placeholder="Niño (3 frases)..." style="width:100%; height:80px; margin-bottom:15px; background:#000; color:#0f0;"></textarea>
        <button id="btn" class="btn-primary" style="width:100%">Enviar leyenda</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            const t1 = document.getElementById('d-txt1').value, t2 = document.getElementById('d-txt2').value;
            submitMission('day_15_dragon', {type:'text', data:`Parte 1: ${t1}\nParte 2: ${t2}`}, role, true);
        });
    }
}

,

// ====== NUEVAS MISIONES DÍAS 16 A 20 ======
// --- DÍA 16 ---
"day_16_cat": {
    tag: "photo", day: 16, title: "El Gato Oculto", role: "kid9", xp: 15, location: "Kagurazaka",
    render: () => `
        <p class="mission-desc">Kagurazaka es el barrio de los gatos. ¡Busca uno (real o estatua) y ponle nombre!</p>
        <input type="text" id="cat-name" placeholder="Nombre japonés para el gato..." style="width:100%; margin-bottom:10px;">
        <button id="btn-cam" class="btn-secondary">📸 Foto del Gato</button>
    `,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_16_cat', currentUser, false); }
},
"day_16_skyscraper": {
    tag: "economy", day: 16, title: "Escalada Urbana", role: "kid9", xp: 15, location: "Shinjuku",
    render: () => `
        <p class="mission-desc">Cuenta los pisos del rascacielos más alto y multiplicaremos por 3 metros para saber su altura.</p>
        <input type="number" id="s-floors" placeholder="Número de pisos..." style="width:100%; margin-bottom:10px;">
        <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Calcular Altura</button>
        <div id="s-res" style="font-weight:bold; color:#0f0; margin-bottom:15px; font-size:1.5rem;"></div>
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar cálculo</button>
    `,
    attachEvents: () => {
        let h = 0;
        document.getElementById('btn-calc').addEventListener('click', () => {
            const f = document.getElementById('s-floors').value;
            if(f) { h = f * 3; document.getElementById('s-res').innerText = `Altura estimada: ${h} metros`; document.getElementById('btn').classList.remove('hidden'); }
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_16_skyscraper', {type:'number', data:h}));
    }
},
"day_16_colors": {
    tag: "expert", day: 16, title: "Colores de Shinjuku", role: "kid9", xp: 15, location: "Shinjuku",
    render: () => `
        <p class="mission-desc">Observa las luces de neón y elige los 3 colores que más te llamen la atención.</p>
        <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-bottom:15px;">
            ${['Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Morado', 'Rosa', 'Blanco', 'Dorado', 'Plata'].map(c => `<button class="c-btn" style="padding:10px; border-radius:10px; border:2px solid #ccc; background:#333; flex-grow:1;">${c}</button>`).join('')}
        </div>
        <div id="c-count" style="text-align:center; margin-bottom:10px; font-weight:bold;">Colores elegidos: 0/3</div>
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar colores</button>
    `,
    attachEvents: () => {
        let sel = []; const btns = document.querySelectorAll('.c-btn'); const cEl = document.getElementById('c-count'); const btn = document.getElementById('btn');
        btns.forEach(b => b.addEventListener('click', () => {
            if(sel.includes(b.innerText)) { sel = sel.filter(x => x !== b.innerText); b.style.borderColor = '#ccc'; b.style.color = 'white'; }
            else if(sel.length < 3) { sel.push(b.innerText); b.style.borderColor = '#0f0'; b.style.color = '#0f0'; }
            cEl.innerText = `Colores elegidos: ${sel.length}/3`;
            if(sel.length === 3) btn.classList.remove('hidden'); else btn.classList.add('hidden');
        }));
        btn.addEventListener('click', () => submitMission('day_16_colors', {type:'text', data:sel.join(', ')}));
    }
},
"day_16_traffic": {
    tag: "audio", day: 16, title: "Sonido del Semáforo", role: "kid9", xp: 15, location: "Tokio",
    render: () => `
        <p class="mission-desc">Graba 5s del famoso sonido (pi-po, pi-po) de los semáforos japoneses.</p>
        <button id="btn-rec" class="btn-secondary" style="width:100%;">🎙️ Grabar semáforo</button>
        <audio id="au-p" controls class="hidden" style="width:100%; margin:15px 0;"></audio>
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const btnR = document.getElementById('btn-rec'); const au = document.getElementById('au-p'); const btn = document.getElementById('btn');
        let mr=null, stream=null, blobId=null;
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({audio:true});
                mr = new MediaRecorder(stream); let chunks=[]; mr.ondataavailable = e=>chunks.push(e.data);
                mr.onstop = () => {
                    const blob = new Blob(chunks {'type':'audio/webm'});
                    au.src = URL.createObjectURL(blob); au.classList.remove('hidden');
                    btnR.classList.add('hidden'); btn.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 5000);
            } catch(e) { alert("Error"); }
        });
        btn.addEventListener('click', () => { if(blobId) submitMission('day_16_traffic', {type:'audio', data:'Audio semáforo'}); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_16_vortex": {
    tag: "photo", day: 16, title: "Vórtice Temporal", role: "kid14", xp: 20, location: "Shinjuku",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> OBJETIVO: Encuadrar tradición y futuro.</p>
            <input type="text" id="v-ans" placeholder="Templo + Rascacielos..." style="width:100%; margin-bottom:10px;">
            <button id="btn-cam" class="btn-secondary" style="width:100%">📸 Foto Vórtice</button>
        </div>
    `,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_16_vortex', currentUser, false); }
},
"day_16_combat": {
    tag: "sensors", day: 16, title: "Calibración de Androide", role: "kid14", xp: 25, location: "Shinjuku",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> CALIBRACIÓN DE COMBATE.</p>
            <p style="color:yellow; font-weight:bold;">⚠️ SUJETA EL MÓVIL CON LAS DOS MANOS.</p>
            <div id="c-step1" style="margin:10px 0; color:#aaa;">Paso 1: Tajo Lateral (horizontal) ❌</div>
            <div id="c-step2" style="margin:10px 0; color:#aaa;">Paso 2: Tajo Vertical ❌</div>
            <button id="btn-start" class="btn-secondary" style="width:100%; margin-top:10px;">Iniciar Calibración</button>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:10px;">Completado</button>
        </div>
    `,
    attachEvents: () => {
        let s1 = false; let s2 = false; let active = false;
        const btnS = document.getElementById('btn-start'); const btn = document.getElementById('btn');
        const st1 = document.getElementById('c-step1'); const st2 = document.getElementById('c-step2');
        
        const handleMotion = (e) => {
            if(!active) return;
            const ax = e.acceleration.x || 0; const ay = e.acceleration.y || 0; const az = e.acceleration.z || 0;
            const mag = Math.sqrt(ax*ax + ay*ay + az*az);
            if(mag > 12) {
                if(!s1 && Math.abs(ax) > Math.abs(ay)) { s1 = true; st1.innerText = "Paso 1: Tajo Lateral ✅"; st1.style.color = "#0f0"; }
                else if(s1 && !s2 && Math.abs(ay) > Math.abs(ax)) { s2 = true; st2.innerText = "Paso 2: Tajo Vertical ✅"; st2.style.color = "#0f0"; }
            }
            if(s1 && s2) { active = false; btn.classList.remove('hidden'); btnS.classList.add('hidden'); window.removeEventListener('devicemotion', handleMotion); }
        };
        
        btnS.addEventListener('click', () => {
            active = true; btnS.innerText = "¡Ataca!";
            if(typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().then(r => { if(r==='granted') window.addEventListener('devicemotion', handleMotion); });
            } else { window.addEventListener('devicemotion', handleMotion); }
        });
        btn.addEventListener('click', () => submitMission('day_16_combat', {type:'game', data:'Combo ejecutado'}));
        window._missionCleanup = () => { active=false; window.removeEventListener('devicemotion', handleMotion); };
    }
},
"day_16_shinjuku": {
    tag: "physical", day: 16, title: "Supervivencia Shinjuku", role: "kid14", xp: 25, location: "Estación",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px; text-align:center;">
            <p>>>> SIGUE LOS CARTELES AMARILLOS. SIN GPS.</p>
            <div id="chrono" style="font-size:3rem; margin:15px 0; color:var(--color-accent);">0.0s</div>
            <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">Bajar del tren (Iniciar)</button>
            <button id="btn-end" class="btn-primary hidden" style="width:100%;">¡Salida encontrada!</button>
        </div>
    `,
    attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            int = setInterval(() => document.getElementById('chrono').innerText = ((Date.now()-t0)/1000).toFixed(1)+'s', 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_16_shinjuku', {type:'text', data:`Escape Shinjuku: ${document.getElementById('chrono').innerText}`}); });
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_16_density": {
    tag: "economy", day: 16, title: "Densidad Poblacional", role: "kid14", xp: 15, location: "Shibuya",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> PERSONAS EN UN CRUCE EN VERDE:</p>
            <input type="number" id="d-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Recuento</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_16_density', {type:'number', data:document.getElementById('d-ans').value})); }
},
"day_16_tocho": {
    tag: "photo", day: 16, title: "Observatorio Gratuito", role: "both", xp: 20, location: "Tocho",
    render: () => `
        <p class="mission-desc">Sube al mirador gratuito del Ayuntamiento y saca una foto nocturna familiar.</p>
        <label style="display:block; margin:20px 0; font-size:1.2rem; background:var(--color-gray-light); padding:15px; border-radius:10px;"><input type="checkbox" id="chk-t" style="transform:scale(1.5); margin-right:15px;"> ✅ Foto nocturna en Tocho</label>
        <button id="btn" class="btn-primary" style="width:100%">Enviar al Juez</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            if(document.getElementById('chk-t').checked) submitMission('day_16_tocho', {type:'text', data:'Foto Tocho completada'}, role, true);
            else showAlert('Aviso', 'Falta confirmación.');
        });
    }
},

// --- DÍA 17 ---
"day_17_omikuji": {
    tag: "expert", day: 17, title: "Destino Omikuji", role: "kid9", xp: 15, location: "Senso-ji",
    render: () => `
        <p class="mission-desc">Saca un papel de la suerte (omikuji) y registra tu resultado.</p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
            <button class="btn-secondary btn-o" data-res="Buena Suerte">🌟 Buena Suerte</button>
            <button class="btn-secondary btn-o" data-res="Suerte Regular">😐 Suerte Regular</button>
            <button class="btn-secondary btn-o" data-res="Mala Suerte">💀 Mala Suerte</button>
        </div>
        <div id="o-msg" style="color:red; font-weight:bold; margin-bottom:10px; text-align:center;"></div>
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar destino</button>
    `,
    attachEvents: () => {
        let res = "";
        document.querySelectorAll('.btn-o').forEach(b => b.addEventListener('click', (e) => {
            res = e.target.dataset.res;
            document.querySelectorAll('.btn-o').forEach(bb => bb.style.borderColor='transparent');
            e.target.style.borderColor='#0f0';
            if(res === 'Mala Suerte') document.getElementById('o-msg').innerText = "¡Átalo al poste del templo para que no te siga!";
            else document.getElementById('o-msg').innerText = "";
            document.getElementById('btn').classList.remove('hidden');
        }));
        document.getElementById('btn').addEventListener('click', () => submitMission('day_17_omikuji', {type:'text', data:`Destino: ${res}`}));
    }
},
"day_17_incense": {
    tag: "photo", day: 17, title: "Humo de la Fortuna", role: "kid9", xp: 15, location: "Senso-ji",
    render: () => `<p class="mission-desc">El humo del incienso trae buena salud. Captura el momento en que envuelve a alguien.</p><button id="btn-cam" class="btn-secondary">📸 Foto Humo</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_17_incense', currentUser, false); }
},
"day_17_gashapon": {
    tag: "photo", day: 17, title: "Gashapon Perfecto", role: "kid9", xp: 15, location: "Akihabara",
    render: () => `<p class="mission-desc">¡Muestra tu tesoro! Foto de la cápsula y el juguete juntos.</p><button id="btn-cam" class="btn-secondary">📸 Foto Gashapon</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_17_gashapon', currentUser, false); }
},
"day_17_p2p_receiver": {
    tag: "expert", day: 17, title: "Sincronización P2P", role: "kid9", xp: 25, location: "Akihabara",
    render: () => `
        <p class="mission-desc">Tu hermano ha interceptado un código secreto. Míralo en su pantalla y pulsa los colores en el mismo orden.</p>
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:15px;">
            <button class="c-sq" data-c="Rojo" style="width:60px; height:60px; background:red; border-radius:10px; border:2px solid transparent;"></button>
            <button class="c-sq" data-c="Azul" style="width:60px; height:60px; background:blue; border-radius:10px; border:2px solid transparent;"></button>
            <button class="c-sq" data-c="Verde" style="width:60px; height:60px; background:green; border-radius:10px; border:2px solid transparent;"></button>
            <button class="c-sq" data-c="Amarillo" style="width:60px; height:60px; background:yellow; border-radius:10px; border:2px solid transparent;"></button>
        </div>
        <div id="seq-disp" style="text-align:center; letter-spacing:5px; font-size:2rem; margin-bottom:10px;"></div>
        <button id="btn" class="btn-primary" style="width:100%">Listo</button>
    `,
    attachEvents: () => {
        let seq = []; const target = ['Rojo', 'Azul', 'Verde', 'Amarillo'];
        document.querySelectorAll('.c-sq').forEach(b => b.addEventListener('click', (e) => {
            seq.push(e.target.dataset.c);
            document.getElementById('seq-disp').innerText = seq.map(c=>c[0]).join(' - ');
        }));
        document.getElementById('btn').addEventListener('click', () => {
            if(JSON.stringify(seq) === JSON.stringify(target)) { launchConfetti(); submitMission('day_17_p2p_receiver', {type:'game', data:'P2P Sincronizado'}); }
            else { showAlert('Error', 'Secuencia incorrecta. Vuelve a intentarlo.'); seq=[]; document.getElementById('seq-disp').innerText=""; }
        });
    }
},
"day_17_retro": {
    tag: "economy", day: 17, title: "Arqueología Gamer", role: "kid14", xp: 20, location: "Akihabara",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> BUSCANDO JUEGO RETRO EN SUPER POTATO</p>
            <input type="text" id="r-game" placeholder="Nombre del juego..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="r-yen" placeholder="Precio en Yenes (¥)..." style="width:100%; margin-bottom:10px;">
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Convertir a Euros</button>
            <div id="r-res" style="color:#0f0; margin-bottom:15px; font-weight:bold;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Enviar tasación</button>
        </div>
    `,
    attachEvents: () => {
        let eur = 0;
        document.getElementById('btn-calc').addEventListener('click', () => {
            const y = document.getElementById('r-yen').value;
            if(y) { eur = (y / 160).toFixed(2); document.getElementById('r-res').innerText = `Aprox: ${eur} €`; document.getElementById('btn').classList.remove('hidden'); }
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_17_retro', {type:'text', data:`Juego: ${document.getElementById('r-game').value}. Precio: ${document.getElementById('r-yen').value}¥ (${eur}€)`}));
    }
},
"day_17_skytree": {
    tag: "sensors", day: 17, title: "Cervicales de Acero", role: "kid14", xp: 20, location: "Skytree",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> APUNTANDO A LA CIMA. Mantén el móvil hacia arriba.</p>
            <div style="width:100%; height:30px; background:#333; border-radius:5px; margin:20px 0;">
                <div id="sky-bar" style="height:100%; width:0%; background:#0f0; transition:width 0.1s;"></div>
            </div>
            <button id="btn-start" class="btn-secondary" style="width:100%;">Iniciar sensor</button>
            <button id="btn" class="btn-primary hidden" style="width:100%;">Completado</button>
        </div>
    `,
    attachEvents: () => {
        const bar = document.getElementById('sky-bar'); const btnS = document.getElementById('btn-start'); const btn = document.getElementById('btn');
        let active = false; let progress = 0; let int = null;
        
        const handleOri = (e) => {
            if(!active) return;
            // Beta is pitch (-180 to 180). Pointing up is approx beta ~ 90.
            if(e.beta > 75 && e.beta < 105) {
                if(!int) int = setInterval(()=>{ progress+=10; bar.style.width = progress+'%'; if(progress>=100) { active=false; clearInterval(int); btn.classList.remove('hidden'); btnS.classList.add('hidden'); window.removeEventListener('deviceorientation', handleOri); } }, 1000);
            } else { if(int) { clearInterval(int); int=null; } }
        };
        btnS.addEventListener('click', () => {
            active = true; btnS.innerText = "Apuntando...";
            if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(r => { if(r==='granted') window.addEventListener('deviceorientation', handleOri); });
            } else { window.addEventListener('deviceorientation', handleOri); }
        });
        btn.addEventListener('click', () => submitMission('day_17_skytree', {type:'game', data:'10s apuntando a Skytree'}));
        window._missionCleanup = () => { active=false; clearInterval(int); window.removeEventListener('deviceorientation', handleOri); };
    }
},
"day_17_p2p_sender": {
    tag: "expert", day: 17, title: "Sincronización P2P", role: "kid14", xp: 25, location: "Akihabara",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> RESOLVER PARA DESBLOQUEAR CÓDIGO</p>
            <p>Famicom: 14.800¥. Neo Geo: 58.000¥. ¿Suma total?</p>
            <input type="number" id="p2p-ans" style="width:100%; margin:10px 0;">
            <button id="btn-calc" class="btn-secondary" style="width:100%;">Desencriptar</button>
            <div id="code-area" class="hidden" style="margin-top:15px; text-align:center;">
                <p>>>> CÓDIGO INTERCEPTADO:</p>
                <div style="display:flex; justify-content:center; gap:5px;">
                    <div style="width:30px; height:30px; background:red;"></div>
                    <div style="width:30px; height:30px; background:blue;"></div>
                    <div style="width:30px; height:30px; background:green;"></div>
                    <div style="width:30px; height:30px; background:yellow;"></div>
                </div>
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:15px;">Aceptar Sincronización</button>
        </div>
    `,
    attachEvents: () => {
        document.getElementById('btn-calc').addEventListener('click', () => {
            if(document.getElementById('p2p-ans').value == 72800) { document.getElementById('code-area').classList.remove('hidden'); document.getElementById('btn').classList.remove('hidden'); document.getElementById('btn-calc').classList.add('hidden'); }
            else showAlert('Error', 'Cálculo incorrecto.');
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_17_p2p_sender', {type:'game', data:'Código enviado a receptora'}));
    }
},
"day_17_height": {
    tag: "economy", day: 17, title: "Altura del Cielo", role: "kid14", xp: 15, location: "Skytree",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ALTURA DE LA SKYTREE (metros):</p>
            <input type="number" id="h-ans" style="width:100%; margin-bottom:10px;">
            <div id="h-msg" style="color:red; margin-bottom:10px;"></div>
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => {
        let fails = 0;
        document.getElementById('btn').addEventListener('click', () => {
            if(document.getElementById('h-ans').value == 634) submitMission('day_17_height', {type:'number', data:634});
            else { fails++; if(fails===1) document.getElementById('h-msg').innerText = "Pista: El número se lee 'mu-sa-shi' como la antigua provincia."; else document.getElementById('h-msg').innerText = "Incorrecto."; }
        });
    }
},
"day_17_sumida": {
    tag: "video", day: 17, title: "Navegando el Sumida", role: "both", xp: 20, location: "Río Sumida",
    render: () => `
        <p class="mission-desc">Graba un vídeo de 10 segundos del paseo en barco por el río Sumida.</p>
        <button id="btn-rec" class="btn-secondary" style="width:100%;">🎬 Grabar paseo</button>
        <video id="v-sum" controls class="hidden" style="width:100%; margin-top:10px; border-radius:10px;"></video>
        <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar Vídeo</button>
    `,
    attachEvents: (role) => {
        const btnR = document.getElementById('btn-rec'); const vid = document.getElementById('v-sum'); const btn = document.getElementById('btn');
        let mr=null, stream=null, blobId=null;
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:true});
                vid.srcObject = stream; vid.classList.remove('hidden'); vid.play();
                mr = new MediaRecorder(stream); let chunks=[]; mr.ondataavailable = e=>chunks.push(e.data);
                mr.onstop = () => {
                    vid.srcObject = null; const blob = new Blob(chunks {'type':'video/mp4'});
                    vid.src = URL.createObjectURL(blob); btnR.classList.add('hidden'); btn.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando (10s)..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 10000);
            } catch(e) { alert("Error"); }
        });
        btn.addEventListener('click', () => { if(blobId) submitMission('day_17_sumida', {type:'video', data:'Paseo Sumida'}, role, true); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},

// --- DÍA 18 ---
"day_18_shibuya": {
    tag: "economy", day: 18, title: "La Marea Humana", role: "kid9", xp: 20, location: "Shibuya",
    render: () => `
        <p class="mission-desc">Cuenta a todas las personas que lleven gafas de sol en un solo cruce en verde (60s).</p>
        <div style="font-size:3rem; text-align:center; font-weight:bold;" id="s-count">0</div>
        <div style="font-size:1.5rem; text-align:center; color:red;" id="s-timer">60s</div>
        <button id="btn-plus" class="btn-secondary" style="width:100%; height:80px; font-size:3rem; margin:10px 0;">+</button>
        <button id="btn-start" class="btn-primary" style="width:100%;">Comenzar Semáforo</button>
        <button id="btn" class="btn-primary hidden" style="width:100%;">Enviar recuento</button>
    `,
    attachEvents: () => {
        let c=0 t=60, int=null, active=false;
        const count = document.getElementById('s-count'); const timer = document.getElementById('s-timer');
        document.getElementById('btn-plus').addEventListener('click', () => { if(active) { c++; count.innerText = c; } });
        document.getElementById('btn-start').addEventListener('click', (e) => {
            active=true; e.target.classList.add('hidden');
            int = setInterval(()=>{ t--; timer.innerText=t+'s'; if(t<=0) { active=false; clearInterval(int); document.getElementById('btn').classList.remove('hidden'); count.innerText=`Final: ${c}`; } }, 1000);
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_18_shibuya', {type:'number', data:c}));
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_18_hachiko": {
    tag: "photo", day: 18, title: "Guardián Hachiko", role: "kid9", xp: 15, location: "Shibuya",
    render: () => `<p class="mission-desc">Busca la estatua de Hachiko y hazte una foto con él.</p><button id="btn-cam" class="btn-secondary">📸 Foto Hachiko</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_18_hachiko', currentUser, false); }
},
"day_18_ema": {
    tag: "writing", day: 18, title: "Mensaje del Emperador", role: "kid9", xp: 15, location: "Meiji Jingu",
    render: () => `
        <p class="mission-desc">Escribe un deseo para nuestra familia, como en una tablilla ema.</p>
        <textarea id="e-ans" style="width:100%; height:100px; margin-bottom:10px;"></textarea>
        <button id="btn" class="btn-primary" style="width:100%">Enviar deseo</button>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_18_ema', {type:'text', data:document.getElementById('e-ans').value})); }
},
"day_18_crepe": {
    tag: "writing", day: 18, title: "Crepe de Harajuku", role: "kid9", xp: 15, location: "Harajuku",
    render: () => `
        <p class="mission-desc">Describe tu crepe: ¿qué llevaba dentro? ¿Estaba bueno?</p>
        <textarea id="cr-ans" style="width:100%; height:100px; margin-bottom:10px;"></textarea>
        <button id="btn" class="btn-primary" style="width:100%">Enviar reseña</button>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_18_crepe', {type:'text', data:document.getElementById('cr-ans').value})); }
},
"day_18_radio": {
    tag: "expert", day: 18, title: "Intercepción de Radio", role: "kid14", xp: 25, location: "Harajuku",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> INTERCEPTANDO SEÑAL ROBÓTICA...</p>
            <button id="btn-play" class="btn-secondary" style="width:100%; margin-bottom:10px;">Escuchar Señal (Intentos: 3)</button>
            <input type="text" id="ra-ans" placeholder="Transcripción rōmaji..." style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Desencriptar</button>
        </div>
    `,
    attachEvents: () => {
        const words = ['sushi', 'samurai', 'kawaii', 'fuji', 'ramen'];
        const target = words[Math.floor(Math.random() * words.length)];
        let lives = 3;
        document.getElementById('btn-play').addEventListener('click', () => {
            if(lives>0) {
                const u = new SpeechSynthesisUtterance(target); u.lang = 'ja-JP'; u.rate = 0.8;
                window.speechSynthesis.speak(u);
            }
        });
        document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('ra-ans').value.toLowerCase().trim();
            if(val === target) { submitMission('day_18_radio', {type:'game', data:`Interceptado: ${target}`}); }
            else { lives--; document.getElementById('btn-play').innerText = `Escuchar Señal (Intentos: ${lives})`; if(lives<=0) showAlert('Error', 'Bloqueado. Misión fallida. Reinicia el nivel.'); else showAlert('Error', 'Fallo de desencriptación.'); }
        });
    }
},
"day_18_trend": {
    tag: "photo", day: 18, title: "Cazatendencias", role: "kid14", xp: 20, location: "Harajuku",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> CAPTURA Y DESCRIBE ESTILO ATREVIDO.</p>
            <input type="text" id="tr-ans" placeholder="Descripción del look..." style="width:100%; margin-bottom:10px;">
            <button id="btn-cam" class="btn-secondary" style="width:100%">📸 Foto + Enviar</button>
        </div>
    `,
    attachEvents: (role) => {
        const btn = document.getElementById('btn-cam');
        attachCameraFlow('btn-cam', 'day_18_trend', currentUser, false);
        const oldInput = btn.nextElementSibling;
        if(oldInput && oldInput.tagName === 'INPUT') {
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone oldInput);
            clone.addEventListener('change', async(e)=>{
                const file=e.target.files[0]; if(!file)return; btn.innerText="Procesando...";
                try {
                    const comp = await compressImage(file); const id='tr_'+Date.now(); await savePhotoToDB(id, comp);
                    submitMission('day_18_trend', {type:'mixed', data:`Desc: ${document.getElementById('tr-ans').value}. Foto: ${id}`});
                }catch(err){console.error(err);}
            });
        }
    }
},
"day_18_flow": {
    tag: "economy", day: 18, title: "Flujo del Cruce", role: "kid14", xp: 15, location: "Shibuya",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> PERSONAS POR HORA (estima):</p>
            <p style="color:#aaa; font-size:0.8rem;">Pista: ~3000 por verde. ¿Cuántos cruces en 1h?</p>
            <input type="number" id="f-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Estimación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_18_flow', {type:'number', data:document.getElementById('f-ans').value})); }
},
"day_18_silence": {
    tag: "economy", day: 18, title: "Silencio en la Ciudad", role: "kid14", xp: 15, location: "Meiji Jingu",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ¿Por qué no se oye la ciudad desde dentro del santuario?</p>
            <textarea id="s-ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Enviar Deducción</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_18_silence', {type:'text', data:document.getElementById('s-ans').value})); }
},
"day_18_crossing": {
    tag: "video", day: 18, title: "Cruzando Shibuya", role: "both", xp: 20, location: "Shibuya",
    render: () => `
        <p class="mission-desc">Graba un vídeo de 15s de toda la familia cruzando el paso de cebra de Shibuya.</p>
        <button id="btn-rec" class="btn-secondary" style="width:100%;">🎬 Grabar cruce</button>
        <video id="v-cross" controls class="hidden" style="width:100%; margin-top:10px; border-radius:10px;"></video>
        <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar Vídeo</button>
    `,
    attachEvents: (role) => {
        const btnR = document.getElementById('btn-rec'); const vid = document.getElementById('v-cross'); const btn = document.getElementById('btn');
        let mr=null, stream=null, blobId=null;
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:true});
                vid.srcObject = stream; vid.classList.remove('hidden'); vid.play();
                mr = new MediaRecorder(stream); let chunks=[]; mr.ondataavailable = e=>chunks.push(e.data);
                mr.onstop = () => {
                    vid.srcObject = null; const blob = new Blob(chunks {'type':'video/mp4'});
                    vid.src = URL.createObjectURL(blob); btnR.classList.add('hidden'); btn.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando (15s)..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 15000);
            } catch(e) { alert("Error"); }
        });
        btn.addEventListener('click', () => { if(blobId) submitMission('day_18_crossing', {type:'video', data:'Video Shibuya guardado'}, role, true); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},

// --- DÍA 19 ---
"day_19_gundam": {
    tag: "video", day: 19, title: "Piloto de Mechas", role: "kid9", xp: 20, location: "Odaiba",
    render: () => `
        <p class="mission-desc">¡El Gundam se transforma! Graba 15s de la transformación como si fueras piloto de mechas.</p>
        <button id="btn-rec" class="btn-secondary" style="width:100%;">🎬 Grabar transformación</button>
        <video id="v-g" controls class="hidden" style="width:100%; margin-top:10px; border-radius:10px;"></video>
        <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar Vídeo</button>
    `,
    attachEvents: () => {
        const btnR = document.getElementById('btn-rec'); const vid = document.getElementById('v-g'); const btn = document.getElementById('btn');
        let mr=null, stream=null, blobId=null;
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:true});
                vid.srcObject = stream; vid.classList.remove('hidden'); vid.play();
                mr = new MediaRecorder(stream); let chunks=[]; mr.ondataavailable = e=>chunks.push(e.data);
                mr.onstop = () => {
                    vid.srcObject = null; const blob = new Blob(chunks {'type':'video/mp4'});
                    vid.src = URL.createObjectURL(blob); btnR.classList.add('hidden'); btn.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando (15s)..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 15000);
            } catch(e) { alert("Error"); }
        });
        btn.addEventListener('click', () => { if(blobId) submitMission('day_19_gundam', {type:'video', data:'Video Gundam guardado'}); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_19_color": {
    tag: "expert", day: 19, title: "Cazador de Luz", role: "kid9", xp: 25, location: "TeamLab",
    render: () => `
        <p class="mission-desc">Ajusta el color hasta igualar la luz dominante de tu sala.</p>
        <div style="text-align:center; margin-bottom:15px;">
            <input type="color" id="c-picker" value="#ff0000" style="width:100px; height:100px; padding:0; border:none; border-radius:50%; overflow:hidden; outline:none;">
        </div>
        <button id="btn" class="btn-primary" style="width:100%">Capturar color</button>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_19_color', {type:'game', data:`Color capturado: ${document.getElementById('c-picker').value}`})); }
},
"day_19_teamlab": {
    tag: "expert", day: 19, title: "Sueños Digitales", role: "kid9", xp: 20, location: "TeamLab",
    render: () => `
        <p class="mission-desc">Dibuja la proyección digital que más te haya gustado del museo.</p>
        <div style="background:#000; border:2px solid #ccc; width:100%; max-width:300px; height:300px; margin:0 auto 15px; border-radius:10px; position:relative; overflow:hidden; touch-action:none;">
            <canvas id="t-can" width="300" height="300" style="width:100%; height:100%;"></canvas>
        </div>
        <div style="display:flex; gap:10px;">
            <button id="btn-clear" class="btn-secondary" style="flex:1;">Borrar</button>
            <button id="btn-sub" class="btn-primary" style="flex:2;">Enviar Dibujo</button>
        </div>
    `,
    attachEvents: () => {
        const can = document.getElementById('t-can'); const ctx = can.getContext('2d');
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        let drawing = false;
        const getPos = (e) => { const rect=can.getBoundingClientRect(); const cx=e.touches?e.touches[0].clientX:e.clientX; const cy=e.touches?e.touches[0].clientY:e.clientY; return {x:cx-rect.left y:cy-rect.top}; };
        const start = (e) => { drawing=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.xp.y); };
        const draw = (e) => { if(!drawing) return; e.preventDefault(); const p=getPos(e); ctx.lineTo(p.xp.y); ctx.stroke(); };
        const stop = () => { drawing=false; };
        can.addEventListener('mousedown', start); can.addEventListener('mousemove', draw); can.addEventListener('mouseup', stop); can.addEventListener('mouseout', stop);
        can.addEventListener('touchstart', start, {passive:false}); can.addEventListener('touchmove', draw, {passive:false}); can.addEventListener('touchend', stop);
        
        document.getElementById('btn-clear').addEventListener('click', () => ctx.clearRect(0,0,can.width,can.height));
        document.getElementById('btn-sub').addEventListener('click', async () => {
            const data = can.toDataURL(); const id = 'teamlab_'+Date.now();
            await savePhotoToDB(id, data); submitMission('day_19_teamlab', {type:'photo', data:id});
        });
    }
},
"day_19_liberty": {
    tag: "photo", day: 19, title: "La Libertad Nipona", role: "kid9", xp: 15, location: "Odaiba",
    render: () => `<p class="mission-desc">Busca la Estatua de la Libertad de Odaiba y hazle una foto.</p><button id="btn-cam" class="btn-secondary">📸 Foto Estatua</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_19_liberty', currentUser, false); }
},
"day_19_crypto": {
    tag: "expert", day: 19, title: "Desencriptar Protocolo", role: "kid14", xp: 25, location: "Odaiba",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> INTERCEPTA EL CÓDIGO DEL MECHA. Busca el número de modelo en el hombro del robot.</p>
            <input type="text" id="cr-ans" placeholder="Modelo (XX-X)..." style="width:100%; margin-bottom:10px; text-transform:uppercase;">
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Desencriptar</button>
            <div id="cr-res" style="color:#0f0; margin-bottom:15px;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Autorizar</button>
        </div>
    `,
    attachEvents: () => {
        document.getElementById('btn-calc').addEventListener('click', async () => {
            const txt = document.getElementById('cr-ans').value.trim().toUpperCase();
            const enc = new TextEncoder().encode(txt);
            const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            // SHA-256 of "RX-0" is 9c8c9a62...
            // Simple check since it's client side:
            if(txt === 'RX-0') {
                document.getElementById('cr-res').innerText = ">>> SISTEMA COMPROMETIDO. Modo Juez Activado.";
                document.getElementById('btn').classList.remove('hidden'); document.getElementById('btn-calc').classList.add('hidden');
            } else showAlert('Error', 'Acceso denegado.');
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_19_crypto', {type:'game', data:'Protocolo mecha comprometido'}));
    }
},
"day_19_mirrors": {
    tag: "economy", day: 19, title: "Lógica de Iluminación", role: "kid14", xp: 20, location: "TeamLab",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> Explica cómo crees que funcionan los espejos infinitos de TeamLab.</p>
            <textarea id="m-ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Enviar Explicación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_19_mirrors', {type:'text', data:document.getElementById('m-ans').value})); }
},
"day_19_weight": {
    tag: "economy", day: 19, title: "Estructura de Gundam", role: "kid14", xp: 15, location: "Odaiba",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> PESO DEL GUNDAM UNICORN (toneladas):</p>
            <input type="number" id="w-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_19_weight', {type:'number', data:document.getElementById('w-ans').value})); }
},
"day_19_monorail": {
    tag: "physical", day: 19, title: "Monorriel Yurikamome", role: "kid14", xp: 15, location: "Tren",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px; text-align:center;">
            <p>>>> CRONOMETRANDO TREN AUTÓNOMO.</p>
            <div id="chrono" style="font-size:3rem; margin:15px 0; color:var(--color-accent);">0.0s</div>
            <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">Iniciar en estación</button>
            <button id="btn-end" class="btn-primary hidden" style="width:100%;">Llegada</button>
        </div>
    `,
    attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            int = setInterval(() => document.getElementById('chrono').innerText = ((Date.now()-t0)/1000).toFixed(1)+'s', 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_19_monorail', {type:'text', data:`Tiempo entre estaciones: ${document.getElementById('chrono').innerText}`}); });
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_19_immersive": {
    tag: "photo", day: 19, title: "Inmersión Total", role: "both", xp: 20, location: "TeamLab",
    render: () => `
        <p class="mission-desc">Foto artística de toda la familia rodeada de luz o agua en TeamLab.</p>
        <label style="display:block; margin:20px 0; font-size:1.2rem; background:var(--color-gray-light); padding:15px; border-radius:10px;"><input type="checkbox" id="chk-im" style="transform:scale(1.5); margin-right:15px;"> ✅ Foto inmersiva realizada</label>
        <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            if(document.getElementById('chk-im').checked) submitMission('day_19_immersive', {type:'text', data:'Foto TeamLab confirmada'}, role, true);
            else showAlert('Aviso', 'Marca la casilla.');
        });
    }
},

// --- DÍA 20 ---
"day_20_bento": {
    tag: "expert", day: 20, title: "Maestro del Bento", role: "kid9", xp: 25, location: "Ueno",
    render: () => `
        <p class="mission-desc">Arrastra los 4 ingredientes a la caja Bento (usa el dedo suavemente).</p>
        <div id="b2-box" style="width: 100%; height: 250px; background: #c0392b; border: 5px solid #8e44ad; border-radius: 15px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 5px; padding: 5px; touch-action:none;">
            <div class="b2-slot" data-acc="arroz" style="border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;"></div>
            <div class="b2-slot" data-acc="pescado" style="border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;"></div>
            <div class="b2-slot" data-acc="verdura" style="border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;"></div>
            <div class="b2-slot" data-acc="postre" style="border: 3px dashed rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;"></div>
        </div>
        <div style="display: flex; justify-content: space-around; background: #ecf0f1; padding: 10px; border-radius: 10px; min-height: 80px; position:relative; touch-action:none;">
            <div class="b2-item" data-type="pescado" style="font-size: 3rem; position:absolute; left:10px; z-index:10;">🐟</div>
            <div class="b2-item" data-type="arroz" style="font-size: 3rem; position:absolute; left:80px; z-index:10;">🍚</div>
            <div class="b2-item" data-type="postre" style="font-size: 3rem; position:absolute; left:150px; z-index:10;">🍳</div>
            <div class="b2-item" data-type="verdura" style="font-size: 3rem; position:absolute; left:220px; z-index:10;">🥒</div>
        </div>
        <button id="btn-ok" class="btn-primary hidden" style="width:100%; margin-top: 15px;">¡Itadakimasu!</button>
    `,
    attachEvents: () => {
        const items = document.querySelectorAll('.b2-item'); const slots = document.querySelectorAll('.b2-slot'); const btn = document.getElementById('btn-ok');
        let placed = 0; let active = null; let iX=0, iY=0, cX=0, cY=0;
        const getXY = (e) => e.touches ? {x:e.touches[0].clientX y:e.touches[0].clientY} : {x:e.clientX y:e.clientY};
        
        const move = (e) => { if(!active) return; e.preventDefault(); const {xy} = getXY(e); active.style.transform = `translate(${cX+x-iX}px, ${cY+y-iY}px) scale(1.2)`; };
        const end = (e) => {
            if(!active) return; const {xy} = getXY(e.changedTouches?e.changedTouches[0]:e); cX += x-iX; cY += y-iY;
            let rect = active.getBoundingClientRect(); let c = {x:rect.left+rect.width/2, y:rect.top+rect.height/2};
            let match = false;
            slots.forEach(s => {
                let sr = s.getBoundingClientRect();
                if(c.x>sr.left && c.x<sr.right && c.y>sr.top && c.y<sr.bottom && s.dataset.acc === active.dataset.type && !s.dataset.f) {
                    match=true; s.dataset.f='1'; s.innerHTML=active.innerHTML; s.style.fontSize='3rem'; s.style.borderColor='#f1c40f'; active.style.display='none'; placed++;
                    if(placed===4) { btn.classList.remove('hidden'); launchConfetti(); }
                }
            });
            if(!match) { cX=0; cY=0; active.style.transform='translate(0,0) scale(1)'; }
            active.style.zIndex='10'; active=null;
            document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', end); document.removeEventListener('touchmove', move); document.removeEventListener('touchend', end);
        };
        items.forEach(i => {
            const start = (e) => {
                e.preventDefault(); active=i; const {xy}=getXY(e); iX=x; iY=y;
                let m = active.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
                if(m) { cX=parseFloat(m[1]); cY=parseFloat(m[2]); } else { cX=0;cY=0; }
                active.style.zIndex='100';
                document.addEventListener('mousemove', move, {passive:false}); document.addEventListener('mouseup', end); document.addEventListener('touchmove', move, {passive:false}); document.addEventListener('touchend', end);
            };
            i.addEventListener('mousedown', start); i.addEventListener('touchstart', start, {passive:false});
        });
        btn.addEventListener('click', () => submitMission('day_20_bento', {type:'game', data:'Bento completado'}));
    }
},
"day_20_potion": {
    tag: "expert", day: 20, title: "Poción Gatuna", role: "kid9", xp: 20, location: "Yanaka Ginza",
    render: () => `
        <p class="mission-desc">Escanea el código de barras de un snack y anota qué has encontrado.</p>
        <div id="bc-box" style="width:100%; height:200px; background:#000; border:2px dashed #0f0; margin-bottom:10px; display:flex; justify-content:center; align-items:center; overflow:hidden; position:relative;">
            <video id="bc-vid" autoplay playsinline style="width:100%; height:100%; object-fit:cover; display:none;"></video>
            <div style="position:absolute; width:100%; height:2px; background:red; top:50%; box-shadow:0 0 10px red;"></div>
            <p id="bc-stat" style="color:#0f0; position:absolute; z-index:10; background:rgba(0,0,0,0.5); padding:5px;">Iniciando...</p>
        </div>
        <input type="text" id="bc-man" placeholder="Código o nombre..." style="width:100%; margin-bottom:15px;">
        <button id="btn" class="btn-primary" style="width:100%;">Enviar Datos al Juez</button>
    `,
    attachEvents: () => {
        const vid = document.getElementById('bc-vid'); const stat = document.getElementById('bc-stat');
        let stream = null; let scanning = true;
        const start = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                vid.srcObject = stream; vid.style.display = 'block'; stat.innerText = 'Escaneando...';
                if ('BarcodeDetector' in window) {
                    const detector = new window.BarcodeDetector();
                    const scan = async () => {
                        if(!scanning) return;
                        try {
                            const barcodes = await detector.detect(vid);
                            if (barcodes.length > 0) {
                                document.getElementById('bc-man').value = barcodes[0].rawValue;
                                stat.innerText = '¡DETECTADO!'; stat.style.color = '#ff0'; scanning = false;
                                if(stream) stream.getTracks().forEach(t=>t.stop());
                            } else { requestAnimationFrame(scan); }
                        } catch(e) { requestAnimationFrame(scan); }
                    }; scan();
                } else { stat.innerText = 'Escáner no soportado. Usa manual.'; }
            } catch(e) { stat.innerText = 'Cámara no disponible.'; }
        };
        start();
        document.getElementById('btn').addEventListener('click', () => submitMission('day_20_potion', {type:'text', data: `Code/Nombre: ${document.getElementById('bc-man').value}`}));
        window._missionCleanup = () => { scanning = false; if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_20_pond": {
    tag: "photo", day: 20, title: "El Pato del Estanque", role: "kid9", xp: 15, location: "Ueno",
    render: () => `<p class="mission-desc">Fotografía las hojas de loto gigantes o los patos del estanque.</p><button id="btn-cam" class="btn-secondary">📸 Foto Estanque</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_20_pond', currentUser, false); }
},
"day_20_weight": {
    tag: "photo", day: 20, title: "El Peso del Tesoro", role: "kid9", xp: 15, location: "Ameyoko",
    render: () => `
        <p class="mission-desc">Haz una foto a algo muy pesado que quepa en tu mano y estima su peso.</p>
        <input type="number" id="w-ans" placeholder="Peso estimado (gramos)..." style="width:100%; margin-bottom:10px;">
        <button id="btn-cam" class="btn-secondary">📸 Foto + Enviar</button>
    `,
    attachEvents: (role) => {
        const btn = document.getElementById('btn-cam');
        attachCameraFlow('btn-cam', 'day_20_weight', currentUser, false);
        const oldInput = btn.nextElementSibling;
        if(oldInput && oldInput.tagName === 'INPUT') {
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone oldInput);
            clone.addEventListener('change', async(e)=>{
                const file=e.target.files[0]; if(!file)return; btn.innerText="Procesando...";
                try {
                    const comp = await compressImage(file); const id='hw_'+Date.now(); await savePhotoToDB(id, comp);
                    submitMission('day_20_weight', {type:'mixed', data:`Peso est: ${document.getElementById('w-ans').value}g. Foto: ${id}`});
                }catch(err){console.error(err);}
            });
        }
    }
},
"day_20_change": {
    tag: "economy", day: 20, title: "Regateo en Ameyoko", role: "kid14", xp: 20, location: "Ameyoko",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> CÁLCULO DE CAMBIO EXACTO</p>
            <input type="number" id="c-price" placeholder="Precio (¥)" style="width:100%; margin-bottom:10px;">
            <input type="number" id="c-bill" placeholder="Pagas con (¥)" style="width:100%; margin-bottom:10px;">
            <input type="number" id="c-ans" placeholder="¿Cambio a devolver?" style="width:100%; margin-bottom:10px; border:2px solid #0f0;">
            <button id="btn" class="btn-primary" style="width:100%">Comprobar</button>
        </div>
    `,
    attachEvents: () => {
        document.getElementById('btn').addEventListener('click', () => {
            const p = document.getElementById('c-price').value; const b = document.getElementById('c-bill').value; const a = document.getElementById('c-ans').value;
            if(p && b && a) {
                if(b - p == a) { launchConfetti(); submitMission('day_20_change', {type:'game', data:`Cálculo correcto: ${b}-${p}=${a}¥`}); }
                else showAlert('Error', `Incorrecto. El cambio correcto era ${b-p}¥`);
            }
        });
    }
},
"day_20_museum": {
    tag: "economy", day: 20, title: "Arquitectura del Museo", role: "kid14", xp: 15, location: "Ueno",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> Diferencias arquitectónicas entre el Museo Nacional y los rascacielos:</p>
            <textarea id="m-ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Enviar Explicación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_20_museum', {type:'text', data:document.getElementById('m-ans').value})); }
},
"day_20_vintage": {
    tag: "economy", day: 20, title: "Análisis de Precios Retro", role: "kid14", xp: 15, location: "Ameyoko",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> OBJETO VINTAGE ENCONTRADO:</p>
            <input type="text" id="v-name" placeholder="Objeto..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="v-price" placeholder="Precio (¥)..." style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar tasación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_20_vintage', {type:'text', data:`Objeto: ${document.getElementById('v-name').value}, Precio: ${document.getElementById('v-price').value}¥`})); }
},
"day_20_stairs": {
    tag: "physical", day: 20, title: "Escaleras del Atardecer", role: "kid14", xp: 15, location: "Yanaka Ginza",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ESCALONES CONTADOS EN YUYAKE DANDAN:</p>
            <input type="number" id="s-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Recuento</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_20_stairs', {type:'number', data:document.getElementById('s-ans').value})); }
},
"day_20_tasting": {
    tag: "writing", day: 20, title: "Degustación Callejera", role: "both", xp: 20, location: "Calle",
    render: () => `
        <p class="mission-desc">¿Cuál ha sido el mejor bocado del día en los puestos callejeros?</p>
        <textarea id="t-ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
        <button id="btn" class="btn-primary" style="width:100%">Enviar respuesta</button>
    `,
    attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_20_tasting', {type:'text', data:document.getElementById('t-ans').value}, role, true)); }
}

,

// ====== NUEVAS MISIONES DÍAS 21 A 24 ======
// --- DÍA 21 ---
"day_21_monkeys": {
    tag: "photo", day: 21, title: "Los Tres Monos", role: "kid9", xp: 15, location: "Nikko",
    render: () => `<p class="mission-desc">Encuentra los tres monos sabios. ¿Puedes imitarlos en la foto?</p><button id="btn-cam" class="btn-secondary">📸 Foto Monos</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_21_monkeys', currentUser, false); }
},
"day_21_dragon": {
    tag: "expert", day: 21, title: "El Latido del Dragón", role: "kid9", xp: 25, location: "Nikko",
    render: () => `
        <p class="mission-desc">Acércate a la tumba... ¿Sientes el latido del dragón?</p>
        <div style="display:flex; justify-content:center; align-items:center; height:150px;">
            <div id="d-jewel" style="width:80px; height:80px; background:radial-gradient(circle, #f1c40f, #d35400); border-radius:50%; box-shadow:0 0 20px #f1c40f; transition:all 0.2s;"></div>
        </div>
        <button id="btn-adv" class="btn-secondary" style="width:100%; margin-bottom:10px;">Avanzar hacia el dragón</button>
        <div id="d-msg" style="text-align:center; color:#0f0; font-weight:bold; font-size:1.5rem; height:40px;"></div>
    `,
    attachEvents: () => {
        const jewel = document.getElementById('d-jewel'); const btn = document.getElementById('btn-adv'); const msg = document.getElementById('d-msg');
        let speed = 2000; let clicks = 0; let int = null;
        const pulse = () => { jewel.style.transform = 'scale(1.3)'; setTimeout(()=>jewel.style.transform = 'scale(1)', speed/2); };
        int = setInterval(pulse, speed);
        btn.addEventListener('click', () => {
            clicks++; speed = Math.max(300 speed - 300);
            clearInterval(int); int = setInterval(pulse, speed);
            if(clicks >= 6) {
                clearInterval(int); btn.classList.add('hidden');
                jewel.style.transform = 'scale(2)'; jewel.style.boxShadow = '0 0 100px #f1c40f';
                msg.innerText = "¡El dragón te ha sentido!";
                setTimeout(() => submitMission('day_21_dragon', {type:'game', data:'Dragón despertado'}), 2000);
            }
        });
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_21_slash": {
    tag: "expert", day: 21, title: "El Tajo del Samurái", role: "kid9", xp: 25, location: "Kamakura",
    render: () => `
        <p class="mission-desc">Entrena como samurái dando un espadazo vertical con el móvil en la mano.</p>
        <div style="text-align:center; margin:20px 0;">
            <p style="color:yellow; font-weight:bold;">⚠️ SUJETA EL MÓVIL CON DOS MANOS</p>
            <div id="sl-timer" style="font-size:3rem; color:red;"></div>
            <div id="sl-icon" class="hidden" style="font-size:5rem;">⚔️</div>
            <div id="sl-fx" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:100; display:none; background:linear-gradient(135deg, transparent 48%, white 49%, white 51%, transparent 52%);"></div>
        </div>
        <button id="btn-start" class="btn-secondary" style="width:100%;">Preparar Tajo</button>
    `,
    attachEvents: () => {
        const btnS = document.getElementById('btn-start'); const timer = document.getElementById('sl-timer'); const icon = document.getElementById('sl-icon'); const fx = document.getElementById('sl-fx');
        let active = false;
        const handleMotion = (e) => {
            if(!active) return;
            const ax = e.acceleration.x || 0; const ay = e.acceleration.y || 0; const az = e.acceleration.z || 0;
            const mag = Math.sqrt(ax*ax + ay*ay + az*az);
            if(mag > 12 && Math.abs(ay) > Math.abs(ax)) {
                active=false; fx.style.display='block'; window.removeEventListener('devicemotion', handleMotion);
                setTimeout(() => submitMission('day_21_slash', {type:'game', data:'Espadazo completado'}), 1000);
            }
        };
        btnS.addEventListener('click', () => {
            btnS.classList.add('hidden'); let t=3; timer.innerText=t;
            const int = setInterval(()=>{
                t--; timer.innerText=t>0?t:'';
                if(t<=0) {
                    clearInterval(int); icon.classList.remove('hidden'); active=true;
                    if(typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                        DeviceMotionEvent.requestPermission().then(r => { if(r==='granted') window.addEventListener('devicemotion', handleMotion); });
                    } else { window.addEventListener('devicemotion', handleMotion); }
                    setTimeout(()=>{ if(active){ active=false; alert('¡Demasiado lento! Intenta de nuevo.'); window.removeEventListener('devicemotion', handleMotion); btnS.classList.remove('hidden'); icon.classList.add('hidden'); } }, 2000);
                }
            }, 1000);
        });
        window._missionCleanup = () => { active=false; window.removeEventListener('devicemotion', handleMotion); };
    }
},
"day_21_jizo": {
    tag: "culture", day: 21, title: "Guardián de Piedra", role: "kid9", xp: 15, location: "Kamakura",
    render: () => `
        <p class="mission-desc">Encuentra una estatua Jizo (con babero rojo) y averigua a quién protege.</p>
        <input type="text" id="j-ans" placeholder="¿A quién protege?..." style="width:100%; margin-bottom:10px;">
        <button id="btn-cam" class="btn-secondary">📸 Foto + Enviar</button>
    `,
    attachEvents: (role) => {
        const btn = document.getElementById('btn-cam');
        attachCameraFlow('btn-cam', 'day_21_jizo', currentUser, false);
        const oldInput = btn.nextElementSibling;
        if(oldInput && oldInput.tagName === 'INPUT') {
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone oldInput);
            clone.addEventListener('change', async(e)=>{
                const file=e.target.files[0]; if(!file)return; btn.innerText="Procesando...";
                try {
                    const comp = await compressImage(file); const id='jz_'+Date.now(); await savePhotoToDB(id, comp);
                    submitMission('day_21_jizo', {type:'mixed', data:`Protege a: ${document.getElementById('j-ans').value}. Foto: ${id}`});
                }catch(err){console.error(err);}
            });
        }
    }
},
"day_21_buddha": {
    tag: "culture", day: 21, title: "Ingeniero Imperial", role: "kid14", xp: 20, location: "Kamakura",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> DATOS DEL GRAN BUDA:</p>
            <input type="text" id="b-mat" placeholder="Material..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="b-year" placeholder="Año de construcción..." style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_21_buddha', {type:'text', data:`Material: ${document.getElementById('b-mat').value}, Año: ${document.getElementById('b-year').value}`})); }
},
"day_21_gold": {
    tag: "economy", day: 21, title: "Análisis de Pan de Oro", role: "kid14", xp: 20, location: "Templo",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ESTADÍSTICAS DEL TEMPLO DORADO</p>
            <p>Superficie: 200m², Grosor pan oro: 0.0001m, Densidad: 19.300 kg/m³.</p>
            <input type="number" id="g-ans" placeholder="Kilos de oro estimados..." style="width:100%; margin-bottom:10px;">
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Calcular Realidad</button>
            <div id="g-res" style="color:#0f0; margin-bottom:15px; font-weight:bold;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Enviar tasación</button>
        </div>
    `,
    attachEvents: () => {
        document.getElementById('btn-calc').addEventListener('click', () => {
            const w = document.getElementById('g-ans').value;
            if(w) { document.getElementById('g-res').innerText = `Resultado analítico: ~386 kg`; document.getElementById('btn').classList.remove('hidden'); }
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_21_gold', {type:'number', data:document.getElementById('g-ans').value}));
    }
},
"day_21_tracking": {
    tag: "sensors", day: 21, title: "Rastreo de la Naturaleza", role: "kid14", xp: 25, location: "Nikko",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> RASTREADOR GPS ACTIVADO. BUSCANDO PUNTO DE INTERÉS NATURAL.</p>
            <div id="trk-dist" style="font-size:2rem; margin:15px 0; color:#0f0; text-align:center;">--- m</div>
            <button id="btn-start" class="btn-secondary" style="width:100%;">Iniciar Rastreo</button>
            <button id="btn" class="btn-primary hidden" style="width:100%;">Punto Alcanzado</button>
        </div>
    `,
    attachEvents: () => {
        const btnS = document.getElementById('btn-start'); const btn = document.getElementById('btn'); const distEl = document.getElementById('trk-dist');
        let watchId = null;
        const TARGET = {lat: 36.7381 lon: 139.5005}; // Cascadas Kegon aprox (Fake/Test)
        
        btnS.addEventListener('click', () => {
            btnS.innerText = "Rastreando...";
            if("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition((pos) => {
                    const R = 6371e3; const φ1 = pos.coords.latitude * Math.PI/180, φ2 = TARGET.lat * Math.PI/180;
                    const Δφ = (TARGET.lat-pos.coords.latitude) * Math.PI/180, Δλ = (TARGET.lon-pos.coords.longitude) * Math.PI/180;
                    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
                    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    distEl.innerText = d.toFixed(1) + " m";
                    if(d < 15 || window.location.hostname==='localhost' || window.location.hostname==='127.0.0.1') { // Cheat for local
                        distEl.innerText = "¡OBJETIVO LOCALIZADO!";
                        btn.classList.remove('hidden'); btnS.classList.add('hidden'); navigator.geolocation.clearWatch(watchId);
                    }
                }, (err) => alert('Error GPS'), {enableHighAccuracy:true maximumAge:0});
            } else { alert("GPS no soportado."); }
        });
        btn.addEventListener('click', () => submitMission('day_21_tracking', {type:'game', data:'Punto encontrado'}));
        window._missionCleanup = () => { if(watchId!==null) navigator.geolocation.clearWatch(watchId); };
    }
},
"day_21_defense": {
    tag: "economy", day: 21, title: "Defensa del Shogunato", role: "kid14", xp: 15, location: "Templo/Castillo",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> Análisis de defensa: ¿Por qué este lugar era difícil de atacar?</p>
            <textarea id="d-ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Enviar Análisis</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_21_defense', {type:'text', data:document.getElementById('d-ans').value})); }
},
"day_21_silence": {
    tag: "audio", day: 21, title: "La Paz de la Montaña", role: "both", xp: 20, location: "Templo/Tumba",
    render: () => `
        <p class="mission-desc">Todo el grupo guarda silencio absoluto durante 30 segundos.</p>
        <div style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent);" id="si-timer">30s</div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-top:10px;">Iniciar Silencio</button>
        <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:10px;">Enviar al Juez</button>
    `,
    attachEvents: (role) => {
        let t = 30 int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            e.target.classList.add('hidden');
            int = setInterval(() => {
                t--; document.getElementById('si-timer').innerText = t+'s';
                if(t<=0) { clearInterval(int); document.getElementById('btn').classList.remove('hidden'); }
            }, 1000);
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_21_silence', {type:'game', data:'Silencio completado'}, role, true));
        window._missionCleanup = () => clearInterval(int);
    }
},

// --- DÍA 22 ---
"day_22_shout": {
    tag: "audio", day: 22, title: "Grito de Pescadero", role: "kid9", xp: 20, location: "Toyosu",
    render: () => `
        <p class="mission-desc">Imita el saludo enérgico de los vendedores: "¡EE-RA-SHAI-MA-SÉ!"</p>
        <button id="btn-rec" class="btn-secondary" style="width:100%;">🎙️ Grabar grito</button>
        <audio id="au-s" controls class="hidden" style="width:100%; margin:15px 0;"></audio>
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar al Juez</button>
    `,
    attachEvents: () => {
        const btnR = document.getElementById('btn-rec'); const au = document.getElementById('au-s'); const btn = document.getElementById('btn');
        let mr=null, stream=null, blobId=null;
        btnR.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({audio:true});
                mr = new MediaRecorder(stream); let chunks=[]; mr.ondataavailable = e=>chunks.push(e.data);
                mr.onstop = () => {
                    const blob = new Blob(chunks {'type':'audio/webm'});
                    au.src = URL.createObjectURL(blob); au.classList.remove('hidden');
                    btnR.classList.add('hidden'); btn.classList.remove('hidden');
                    const r = new FileReader(); r.readAsDataURL(blob); r.onloadend = () => { blobId = r.result; };
                    stream.getTracks().forEach(t=>t.stop());
                };
                mr.start(); btnR.innerText="Grabando (3s)..."; btnR.disabled=true;
                setTimeout(() => { if(mr.state==='recording') mr.stop(); }, 3000);
            } catch(e) { alert("Error"); }
        });
        btn.addEventListener('click', () => { if(blobId) submitMission('day_22_shout', {type:'audio', data:'Grito guardado'}); });
        window._missionCleanup = () => { if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_22_car": {
    tag: "photo", day: 22, title: "Vehículo de Lujo", role: "kid9", xp: 15, location: "Ginza",
    render: () => `<p class="mission-desc">En Ginza pasan los coches más lujosos del mundo. Captura el más espectacular.</p><button id="btn-cam" class="btn-secondary">📸 Foto Coche</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_22_car', currentUser, false); }
},
"day_22_elevator": {
    tag: "physical", day: 22, title: "Ascensor Infinito", role: "kid9", xp: 15, location: "Roppongi",
    render: () => `
        <p class="mission-desc">Cronometra cuánto tarda este ascensor ultrarrápido en subir.</p>
        <div id="el-timer" style="font-size:3rem; text-align:center; margin:15px 0; color:var(--color-accent);">0.0s</div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">Iniciar</button>
        <button id="btn-end" class="btn-primary hidden" style="width:100%;">¡Llegué!</button>
    `,
    attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            int = setInterval(() => document.getElementById('el-timer').innerText = ((Date.now()-t0)/1000).toFixed(1)+'s', 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_22_elevator', {type:'text', data:`Tiempo ascensor: ${document.getElementById('el-timer').innerText}`}); });
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_22_tower": {
    tag: "photo", day: 22, title: "Réplica Eiffel", role: "kid9", xp: 15, location: "Torre de Tokio",
    render: () => `<p class="mission-desc">Apunta a la Torre de Tokio y haz que parezca que la sostienes entre tus dedos.</p><button id="btn-cam" class="btn-secondary">📸 Foto Torre</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_22_tower', currentUser, false); }
},
"day_22_jewel": {
    tag: "economy", day: 22, title: "La Joya de Ginza", role: "kid14", xp: 15, location: "Ginza",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> BUSCANDO ARTÍCULO MÁS CARO</p>
            <input type="text" id="j-item" placeholder="Artículo..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="j-price" placeholder="Precio (¥)..." style="width:100%; margin-bottom:10px;">
            <input type="number" id="j-allow" placeholder="Tu paga mensual (€)..." style="width:100%; margin-bottom:10px;">
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Calcular</button>
            <div id="j-res" style="color:#0f0; margin-bottom:15px; font-weight:bold;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => {
        let years = 0;
        document.getElementById('btn-calc').addEventListener('click', () => {
            const p = document.getElementById('j-price').value; const a = document.getElementById('j-allow').value;
            if(p && a) {
                const eur = p / 160; years = (eur / (a * 12)).toFixed(1);
                document.getElementById('j-res').innerText = `Necesitarías ${years} años para comprarlo.`;
                document.getElementById('btn').classList.remove('hidden');
            }
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_22_jewel', {type:'text', data:`Item: ${document.getElementById('j-item').value}, Años necesarios: ${years}`}));
    }
},
"day_22_numbers": {
    tag: "expert", day: 22, title: "Intercepción Numérica", role: "kid14", xp: 25, location: "Calle",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> ESCUCHA LA SEÑAL NUMÉRICA (Japonés).</p>
            <button id="btn-play" class="btn-secondary" style="width:100%; margin-bottom:10px;">Interceptar Señal (Intentos: 3)</button>
            <input type="number" id="n-ans" placeholder="Código de 3 dígitos..." style="width:100%; margin-bottom:10px; letter-spacing:10px; text-align:center;">
            <button id="btn" class="btn-primary" style="width:100%">Verificar</button>
        </div>
    `,
    attachEvents: () => {
        const jpn = {1:'ichi', 2:'ni', 3:'san', 4:'yon', 5:'go', 6:'roku', 7:'nana', 8:'hachi', 9:'kyu'};
        const n1 = Math.floor(Math.random()*9)+1; const n2 = Math.floor(Math.random()*9)+1; const n3 = Math.floor(Math.random()*9)+1;
        const targetStr = `${n1}${n2}${n3}`; const sayStr = `${jpn[n1]}... ${jpn[n2]}... ${jpn[n3]}`;
        let lives = 3;
        document.getElementById('btn-play').addEventListener('click', () => {
            if(lives>0) {
                const u = new SpeechSynthesisUtterance(sayStr); u.lang = 'ja-JP'; u.rate = 0.8;
                window.speechSynthesis.speak(u);
            }
        });
        document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('n-ans').value.trim();
            if(val === targetStr) { submitMission('day_22_numbers', {type:'game', data:`Código interceptado: ${targetStr}`}); }
            else { lives--; document.getElementById('btn-play').innerText = `Interceptar Señal (Intentos: ${lives})`; if(lives<=0) showAlert('Error', 'Bloqueado.'); else showAlert('Error', 'Código incorrecto.'); }
        });
    }
},
"day_22_fish": {
    tag: "economy", day: 22, title: "Logística del Pescado", role: "kid14", xp: 15, location: "Toyosu",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> Razones del traslado del mercado Tsukiji → Toyosu:</p>
            <textarea id="f-ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Enviar Explicación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_22_fish', {type:'text', data:document.getElementById('f-ans').value})); }
},
"day_22_compare": {
    tag: "economy", day: 22, title: "Altura Relativa", role: "kid14", xp: 15, location: "Torre de Tokio",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> COMPARATIVA: ¿Cuántas Torres de Tokio (332.9m) caben en una Skytree (634m)?</p>
            <input type="number" id="c-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Respuesta</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_22_compare', {type:'number', data:document.getElementById('c-ans').value})); }
},
"day_22_neon": {
    tag: "photo", day: 22, title: "Luces de Neón", role: "both", xp: 20, location: "Ginza/Roppongi",
    render: () => `
        <p class="mission-desc">Selfie nocturno familiar con los rascacielos iluminados de fondo.</p>
        <label style="display:block; margin:20px 0; font-size:1.2rem; background:var(--color-gray-light); padding:15px; border-radius:10px;"><input type="checkbox" id="chk-n" style="transform:scale(1.5); margin-right:15px;"> ✅ Foto nocturna familiar lista</label>
        <button id="btn" class="btn-primary" style="width:100%">Enviar al Juez</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            if(document.getElementById('chk-n').checked) submitMission('day_22_neon', {type:'text', data:'Foto neón completada'}, role, true);
            else showAlert('Aviso', 'Marca la casilla de confirmación.');
        });
    }
},

// --- DÍA 23 ---
"day_23_kitkat": {
    tag: "economy", day: 23, title: "Buscador de KitKat", role: "kid9", xp: 15, location: "Don Quijote",
    render: () => `
        <p class="mission-desc">Busca sabores raros de KitKat (mínimo 3).</p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
            <label><input type="checkbox" class="k-chk" value="Matcha"> 🍵 Matcha</label>
            <label><input type="checkbox" class="k-chk" value="Sake"> 🍶 Sake</label>
            <label><input type="checkbox" class="k-chk" value="Fresa"> 🍓 Fresa</label>
            <label><input type="checkbox" class="k-chk" value="Wasabi"> 🔥 Wasabi</label>
            <label><input type="checkbox" class="k-chk" value="Melón"> 🍈 Melón</label>
        </div>
        <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
    `,
    attachEvents: () => {
        document.getElementById('btn').addEventListener('click', () => {
            const checked = Array.from(document.querySelectorAll('.k-chk:checked')).map(cb => cb.value);
            if(checked.length >= 3) submitMission('day_23_kitkat', {type:'text', data:`KitKats: ${checked.join(', ')}`});
            else showAlert('Faltan sabores', 'Debes encontrar al menos 3 sabores.');
        });
    }
},
"day_23_pokedex": {
    tag: "expert", day: 23, title: "Pokédex de Supermercado", role: "kid9", xp: 25, location: "Tienda",
    render: () => `
        <p class="mission-desc">Escanea el código de barras de tu último snack.</p>
        <div id="p-box" style="width:100%; height:200px; background:#000; border:2px dashed #0f0; margin-bottom:10px; display:flex; justify-content:center; align-items:center; overflow:hidden; position:relative;">
            <video id="p-vid" autoplay playsinline style="width:100%; height:100%; object-fit:cover; display:none;"></video>
            <div style="position:absolute; width:100%; height:2px; background:red; top:50%; box-shadow:0 0 10px red;"></div>
            <p id="p-stat" style="color:#0f0; position:absolute; z-index:10; background:rgba(0,0,0,0.5); padding:5px;">Iniciando...</p>
        </div>
        <input type="text" id="p-code" placeholder="Código..." style="width:100%; margin-bottom:5px;">
        <input type="text" id="p-name" placeholder="Nombre del snack..." style="width:100%; margin-bottom:15px;">
        <button id="btn" class="btn-primary" style="width:100%;">Registrar en Pokédex</button>
    `,
    attachEvents: () => {
        const vid = document.getElementById('p-vid'); const stat = document.getElementById('p-stat');
        let stream = null; let scanning = true;
        const start = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                vid.srcObject = stream; vid.style.display = 'block'; stat.innerText = 'Escaneando...';
                if ('BarcodeDetector' in window) {
                    const detector = new window.BarcodeDetector();
                    const scan = async () => {
                        if(!scanning) return;
                        try {
                            const barcodes = await detector.detect(vid);
                            if (barcodes.length > 0) {
                                document.getElementById('p-code').value = barcodes[0].rawValue;
                                stat.innerText = '¡CAPTURADO!'; stat.style.color = '#ff0'; scanning = false;
                                if(stream) stream.getTracks().forEach(t=>t.stop());
                            } else { requestAnimationFrame(scan); }
                        } catch(e) { requestAnimationFrame(scan); }
                    }; scan();
                } else { stat.innerText = 'Escáner no soportado. Usa manual.'; }
            } catch(e) { stat.innerText = 'Cámara no disponible.'; }
        };
        start();
        document.getElementById('btn').addEventListener('click', () => submitMission('day_23_pokedex', {type:'text', data: `Code: ${document.getElementById('p-code').value}, Name: ${document.getElementById('p-name').value}`}));
        window._missionCleanup = () => { scanning = false; if(stream) stream.getTracks().forEach(t=>t.stop()); };
    }
},
"day_23_coins": {
    tag: "photo", day: 23, title: "Oráculo de Monedas", role: "kid9", xp: 15, location: "Calle",
    render: () => `
        <p class="mission-desc">Lanza tus últimas monedas al aire y fotografíalas en el suelo para revelar tu fortuna.</p>
        <button id="btn-cam" class="btn-secondary" style="width:100%; margin-bottom:15px;">📸 Foto Monedas</button>
        <div id="o-pred" class="hidden" style="padding:15px; background:#fff; color:#000; font-family:serif; font-size:1.2rem; text-align:center; border:2px solid #d4af37; border-radius:10px;"></div>
        <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Fortuna</button>
    `,
    attachEvents: (role) => {
        const btnCam = document.getElementById('btn-cam'); const btn = document.getElementById('btn'); const predBox = document.getElementById('o-pred');
        attachCameraFlow('btn-cam', 'day_23_coins', currentUser, false);
        const oldInput = btnCam.nextElementSibling;
        if(oldInput && oldInput.tagName === 'INPUT') {
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone oldInput);
            clone.addEventListener('change', async(e)=>{
                const file=e.target.files[0]; if(!file)return; btnCam.innerText="Procesando...";
                try {
                    const comp = await compressImage(file); const id='co_'+Date.now(); await savePhotoToDB(id, comp);
                    const preds = ["Volverás a Japón antes de lo que crees", "Un gato te traerá suerte en casa", "Encontrarás un tesoro donde menos lo esperas", "El espíritu del Fuji te protege", "Tu próximo viaje será aún más épico"];
                    const myPred = preds[Math.floor(Math.random()*preds.length)];
                    predBox.innerText = myPred; predBox.classList.remove('hidden'); btn.classList.remove('hidden'); btnCam.classList.add('hidden');
                    btn.addEventListener('click', ()=>submitMission('day_23_coins', {type:'mixed', data:`Profecía: ${myPred}. Foto: ${id}`}));
                }catch(err){console.error(err);}
            });
        }
    }
},
"day_23_mascot": {
    tag: "photo", day: 23, title: "Mascotas de Viaje", role: "kid9", xp: 15, location: "Hotel",
    render: () => `<p class="mission-desc">Haz una foto de tu compañero de viaje favorito (peluche/juguete) antes de volver a casa.</p><button id="btn-cam" class="btn-secondary">📸 Foto Mascota</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_23_mascot', currentUser, false); }
},
"day_23_tetris": {
    tag: "expert", day: 23, title: "Tetris de Maletas", role: "kid14", xp: 25, location: "Hotel",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> OPTIMIZACIÓN DE EQUIPAJE. Gira las piezas hasta que encajen.</p>
            <div style="display:flex; justify-content:space-around; align-items:center; height:150px; background:#222; border-radius:10px; margin:15px 0;">
                <div style="text-align:center;">
                    <div id="pt1" style="width:40px; height:80px; background:cyan; margin:0 auto 10px; transition:transform 0.3s; transform:rotate(90deg);"></div>
                    <button class="btn-secondary btn-rot" data-target="pt1" data-val="90">Girar 🔄</button>
                </div>
                <div style="text-align:center;">
                    <div id="pt2" style="width:60px; height:40px; background:magenta; margin:0 auto 10px; transition:transform 0.3s; transform:rotate(180deg);"></div>
                    <button class="btn-secondary btn-rot" data-target="pt2" data-val="180">Girar 🔄</button>
                </div>
                <div style="text-align:center;">
                    <div id="pt3" style="width:40px; height:40px; background:yellow; margin:0 auto 10px; transition:transform 0.3s; transform:rotate(270deg);"></div>
                    <button class="btn-secondary btn-rot" data-target="pt3" data-val="270">Girar 🔄</button>
                </div>
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Empaquetado Listo</button>
        </div>
    `,
    attachEvents: () => {
        // Target: all 0deg (or multiples of 360)
        document.querySelectorAll('.btn-rot').forEach(b => {
            b.addEventListener('click', (e) => {
                const tg = document.getElementById(e.target.dataset.target);
                let val = parseInt(e.target.dataset.val) + 90;
                e.target.dataset.val = val;
                tg.style.transform = `rotate(${val}deg)`;
                
                let p1 = parseInt(document.querySelector('.btn-rot[data-target="pt1"]').dataset.val) % 360;
                let p2 = parseInt(document.querySelector('.btn-rot[data-target="pt2"]').dataset.val) % 180; // Symmetry for magenta rectangle? Wait, let's say all must be 0 % 360
                let p3 = parseInt(document.querySelector('.btn-rot[data-target="pt3"]').dataset.val) % 90; // Square symmetry
                
                // For simplicity, just demand p1==0, p2==0, p3 doesn't matter much but let's check p1 and p2
                if(p1 === 0 && p2 === 0) { document.getElementById('btn').classList.remove('hidden'); }
            });
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_23_tetris', {type:'game', data:'Equipaje optimizado'}));
    }
},
"day_23_audit": {
    tag: "economy", day: 23, title: "Auditoría Final", role: "kid14", xp: 15, location: "Hotel",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> SUMA LOS ÚLTIMOS 4 TICKETS</p>
            <input type="number" id="a-t1" placeholder="Ticket 1..." style="width:100%; margin-bottom:5px;">
            <input type="number" id="a-t2" placeholder="Ticket 2..." style="width:100%; margin-bottom:5px;">
            <input type="number" id="a-t3" placeholder="Ticket 3..." style="width:100%; margin-bottom:5px;">
            <input type="number" id="a-t4" placeholder="Ticket 4..." style="width:100%; margin-bottom:10px;">
            <button id="btn-calc" class="btn-secondary" style="width:100%; margin-bottom:10px;">Sumar</button>
            <div id="a-res" style="color:#0f0; margin-bottom:15px; font-weight:bold;"></div>
            <button id="btn" class="btn-primary hidden" style="width:100%">Enviar Auditoría</button>
        </div>
    `,
    attachEvents: () => {
        let tot = 0;
        document.getElementById('btn-calc').addEventListener('click', () => {
            const t1 = Number(document.getElementById('a-t1').value||0); const t2 = Number(document.getElementById('a-t2').value||0);
            const t3 = Number(document.getElementById('a-t3').value||0); const t4 = Number(document.getElementById('a-t4').value||0);
            tot = t1+t2+t3+t4; document.getElementById('a-res').innerText = `Total calculado: ${tot}¥`; document.getElementById('btn').classList.remove('hidden');
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_23_audit', {type:'number', data:tot}));
    }
},
"day_23_security": {
    tag: "physical", day: 23, title: "Protocolo de Embarque", role: "kid14", xp: 15, location: "Aeropuerto",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px; text-align:center;">
            <p>>>> CRONOMETRANDO CONTROL SEGURIDAD</p>
            <div id="sec-timer" style="font-size:3rem; margin:15px 0; color:var(--color-accent);">0.0s</div>
            <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">Iniciar en cola</button>
            <button id="btn-end" class="btn-primary hidden" style="width:100%;">¡Pasado!</button>
        </div>
    `,
    attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            int = setInterval(() => document.getElementById('sec-timer').innerText = ((Date.now()-t0)/1000).toFixed(1)+'s', 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_23_security', {type:'text', data:`Control de seguridad: ${document.getElementById('sec-timer').innerText}`}); });
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_23_weight": {
    tag: "economy", day: 23, title: "Peso de Carga", role: "kid14", xp: 15, location: "Aeropuerto",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> PESO ESTIMADO DE MALETA (kg):</p>
            <input type="number" id="w-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar Estimación</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_23_weight', {type:'number', data:document.getElementById('w-ans').value})); }
},
"day_23_stamp": {
    tag: "photo", day: 23, title: "El Sello Final", role: "both", xp: 30, location: "Aeropuerto",
    render: () => `<p class="mission-desc">Busca un tampón de tinta y consigue el último sello físico del viaje. Hazle una foto.</p><button id="btn-cam" class="btn-secondary">📸 Foto Sello</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_23_stamp', currentUser, false); }
},

// --- DÍA 24 ---
"day_24_meal": {
    tag: "photo", day: 24, title: "Comida Aérea", role: "kid9", xp: 10, location: "Avión",
    render: () => `<p class="mission-desc">Fotografía tu última comida japonesa... en el aire.</p><button id="btn-cam" class="btn-secondary">📸 Foto Comida</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_24_meal', currentUser, false); }
},
"day_24_clouds": {
    tag: "photo", day: 24, title: "Nubes sobre Europa", role: "kid9", xp: 10, location: "Avión",
    render: () => `<p class="mission-desc">Captura el cielo desde 10.000 metros. ¡La última foto!</p><button id="btn-cam" class="btn-secondary">📸 Foto Nubes</button>`,
    attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_24_clouds', currentUser, false); }
},
"day_24_turbulence": {
    tag: "physical", day: 24, title: "Cinturón Abrochado", role: "kid9", xp: 15, location: "Avión",
    render: () => `
        <p class="mission-desc">Cronometra cuánto dura la turbulencia.</p>
        <div id="tu-timer" style="font-size:3rem; text-align:center; margin:15px 0; color:var(--color-accent);">0.0s</div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">Iniciar</button>
        <button id="btn-end" class="btn-primary hidden" style="width:100%;">Fin</button>
    `,
    attachEvents: () => {
        let t0 = 0; let int = null;
        document.getElementById('btn-start').addEventListener('click', (e) => {
            t0 = Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
            int = setInterval(() => document.getElementById('tu-timer').innerText = ((Date.now()-t0)/1000).toFixed(1)+'s', 100);
        });
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_24_turbulence', {type:'text', data:`Turbulencia: ${document.getElementById('tu-timer').innerText}`}); });
        window._missionCleanup = () => clearInterval(int);
    }
},
"day_24_badges": {
    tag: "economy", day: 24, title: "Recuento de Sellos", role: "kid9", xp: 15, location: "Avión",
    render: () => `
        <p class="mission-desc">Calculando misiones completadas en el viaje...</p>
        <div id="bdg-res" style="font-size:2rem; text-align:center; margin:15px 0; color:#0f0; font-weight:bold;"></div>
        <button id="btn" class="btn-primary hidden" style="width:100%">Enviar recuento</button>
    `,
    attachEvents: () => {
        let count = 0;
        try {
            const gs = JSON.parse(localStorage.getItem('gameState'));
            if(gs && gs.kid9 && gs.kid9.missions) {
                count = Object.values(gs.kid9.missions).filter(m => m.status === 'approved').length;
            }
        } catch(e) {}
        document.getElementById('bdg-res').innerText = `¡${count} misiones completadas!`;
        document.getElementById('btn').classList.remove('hidden');
        document.getElementById('btn').addEventListener('click', () => submitMission('day_24_badges', {type:'number', data:count}));
    }
},
"day_24_timezones": {
    tag: "economy", day: 24, title: "Husos Horarios", role: "kid14", xp: 15, location: "Avión",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> REPORTE HORARIO SIMULTÁNEO</p>
            <input type="text" id="tz-jap" placeholder="Hora Japón..." style="width:100%; margin-bottom:5px;">
            <input type="text" id="tz-esp" placeholder="Hora España..." style="width:100%; margin-bottom:5px;">
            <input type="text" id="tz-air" placeholder="Hora Avión..." style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_24_timezones', {type:'text', data:`JP: ${document.getElementById('tz-jap').value}, ES: ${document.getElementById('tz-esp').value}, AV: ${document.getElementById('tz-air').value}`})); }
},
"day_24_distance": {
    tag: "economy", day: 24, title: "Kilometraje Total", role: "kid14", xp: 15, location: "Avión",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> DISTANCIA TOTAL (km):</p>
            <input type="number" id="d-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_24_distance', {type:'number', data:document.getElementById('d-ans').value})); }
},
"day_24_speed": {
    tag: "physical", day: 24, title: "Velocidad de Retorno", role: "kid14", xp: 15, location: "Avión",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> VELOCIDAD MÁXIMA (km/h):</p>
            <input type="number" id="v-ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_24_speed', {type:'number', data:document.getElementById('v-ans').value})); }
},
"day_24_log": {
    tag: "writing", day: 24, title: "Análisis del Viaje", role: "kid14", xp: 20, location: "Avión",
    render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> BITÁCORA FINAL. Resume la misión Japón 2026.</p>
            <textarea id="l-ans" style="width:100%; height:100px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Transmitir</button>
        </div>
    `,
    attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_24_log', {type:'text', data:document.getElementById('l-ans').value})); }
},
"day_24_sayonara": {
    tag: "writing", day: 24, title: "Sayonara Japón", role: "both", xp: 50, location: "Avión",
    render: () => `
        <p class="mission-desc">Escribe tu TOP 3 de momentos favoritos del viaje.</p>
        <input type="text" id="sy-1" placeholder="Momento #1..." style="width:100%; margin-bottom:5px;">
        <input type="text" id="sy-2" placeholder="Momento #2..." style="width:100%; margin-bottom:5px;">
        <input type="text" id="sy-3" placeholder="Momento #3..." style="width:100%; margin-bottom:15px;">
        <button id="btn" class="btn-primary" style="width:100%; background:#d4af37; color:#000;">Desbloquear Sello Legendario</button>
    `,
    attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            const m1 = document.getElementById('sy-1').value; const m2 = document.getElementById('sy-2').value; const m3 = document.getElementById('sy-3').value;
            if(m1 && m2 && m3) {
                // Simulate celebration
                const cel = document.getElementById('celebration-modal');
                if(cel) {
                    document.getElementById('celebration-results').innerHTML = `<p>Tus favoritos:</p><ul><li>${m1}</li><li>${m2}</li><li>${m3}</li></ul>`;
                    cel.classList.remove('hidden'); launchConfetti();
                }
                submitMission('day_24_sayonara', {type:'text', data:`1:${m1}, 2:${m2}, 3:${m3}`}, role, true);
            } else { showAlert('Aviso', 'Rellena los 3 momentos.'); }
        });
    }
}

,

    // ==========================================
    // DÍA 1
    // ==========================================

    // ==========================================
    // DÍA 2
    // ==========================================

    // ==========================================
    // DÍA 3
    // ==========================================

    // ==========================================
    // DÍA 4
    // ==========================================



    // ==========================================
    // DÍA 5
    // ==========================================

    // ==========================================
    // DÍA 6
    // ==========================================

    // ==========================================
    // DÍA 7
    // ==========================================

};