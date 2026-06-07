import codecs

js_code = r'''
    // ==========================================
    // DÍA 5
    // ==========================================
    "day_5_gymnast": {
        tag: "physical", day: 5, title: "La Gimnasta del Parque", role: "kid9", xp: 20, location: "Parque de Nara",
        render: () => `
            <p class="mission-desc">Encuentra una zona despejada y haz tu mejor pose de gimnasia (un salto, un puente o un equilibrio) imitando la elegancia de un ciervo. ¡Que la foto quede espectacular!</p>
            <button id="btn-cam" class="btn-secondary">📸 Foto de la Pose</button>
        `,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_5_gymnast', role, false); }
    },
    "day_5_monk": {
        tag: "game", day: 5, title: "Control Monje", role: "kid9", xp: 20, location: "Buda",
        render: () => `
            <p class="mission-desc">Demuestra el control de un monje Zen. Mantén pulsada la esfera de meditación durante 15 segundos sin soltar.</p>
            <div id="monk-sphere" style="width:100px; height:100px; border-radius:50%; background:var(--color-primary); margin:0 auto 20px; transition: transform 0.5s;"></div>
            <p id="monk-timer" style="text-align:center; font-size:2rem; font-weight:bold;">15s</p>
        `,
        attachEvents: (role) => {
            let active = false; let timeLeft = 15; let timerInt;
            const sphere = document.getElementById('monk-sphere');
            const startMeditation = (e) => {
                e.preventDefault();
                active = true;
                sphere.style.transform = "scale(1.5)";
                timerInt = setInterval(() => {
                    timeLeft--;
                    document.getElementById('monk-timer').innerText = timeLeft + 's';
                    if(timeLeft <= 0) {
                        active = false; clearInterval(timerInt);
                        submitMission('day_5_monk', {type:'game', data:'Meditación lograda'}, role);
                    }
                }, 1000);
            };
            const stopMeditation = () => {
                if(!active) return;
                active = false; clearInterval(timerInt); timeLeft = 15;
                document.getElementById('monk-timer').innerText = '15s';
                sphere.style.transform = "scale(1)";
                showAlert("Fallo", "Has perdido la concentración.");
            };
            sphere.addEventListener('mousedown', startMeditation);
            sphere.addEventListener('mouseup', stopMeditation);
            sphere.addEventListener('mouseout', stopMeditation);
            sphere.addEventListener('touchstart', startMeditation, {passive:false});
            sphere.addEventListener('touchend', stopMeditation);
            window._missionCleanup = () => { active=false; clearInterval(timerInt); };
        }
    },
    "day_5_deer_galaxy": {
        tag: "physical", day: 5, title: "La Galaxia de los Ciervos", role: "kid9", xp: 20, location: "Parque de Nara",
        render: () => `
            <p class="mission-desc">¡Hay ciervos por todas partes! Tienes 2 minutos para contar todos los que veas a tu alrededor. Usa los botones para llevar la cuenta.</p>
            <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
                <button id="btn-sub" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">-</button>
                <div id="deer-count" style="font-size:3rem; font-weight:bold;">0</div>
                <button id="btn-add" class="btn-secondary" style="font-size:2rem; padding:10px 20px;">+</button>
            </div>
            <button id="btn-start" class="btn-primary" style="width:100%">Comenzar (2m)</button>
        `,
        attachEvents: (role) => {
            let count = 0;
            document.getElementById('btn-add').addEventListener('click', () => { count++; document.getElementById('deer-count').innerText = count; });
            document.getElementById('btn-sub').addEventListener('click', () => { if(count>0) count--; document.getElementById('deer-count').innerText = count; });
            document.getElementById('btn-start').addEventListener('click', (e) => {
                e.target.classList.add('hidden');
                setTimeout(() => submitMission('day_5_deer_galaxy', {type:'physical', data:`Contados: ${count} ciervos`}, role), 120000);
            });
        }
    },
    "day_5_ribbon": {
        tag: "sensors", day: 5, title: "La Danza de la Cinta", role: "kid9", xp: 30, location: "Nara",
        render: () => `
            <p class="mission-desc">¡Hipnotiza al ciervo! Mueve el móvil haciendo círculos suaves en el aire durante 10 segundos para trazar una cinta virtual.</p>
            <div id="ribbon-val" style="font-size:3rem; text-align:center; color:var(--color-primary); margin:20px 0;">0</div>
            <button id="btn-scan" class="btn-primary" style="width:100%">Iniciar Danza</button>
        `,
        attachEvents: (role) => {
            let active = false; let int;
            document.getElementById('btn-scan').addEventListener('click', async (e) => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const p = await DeviceOrientationEvent.requestPermission();
                    if(p !== 'granted') return showAlert('Error', 'Permiso denegado.');
                }
                e.target.classList.add('hidden'); active = true;
                let val = 0;
                const h = (ev) => { 
                    if(!active) return;
                    val += Math.abs(ev.alpha || 0) + Math.abs(ev.beta || 0); 
                    document.getElementById('ribbon-val').innerText = Math.floor(val/100); 
                };
                window.addEventListener('deviceorientation', h);
                setTimeout(() => {
                    active = false; window.removeEventListener('deviceorientation', h);
                    submitMission('day_5_ribbon', {type:'sensors', data:'Danza de la cinta: ' + Math.floor(val/100) + ' ptos'}, role);
                }, 10000);
            });
        }
    },
    "day_5_investor": {
        tag: "economy", day: 5, title: "El Inversor del Daibutsu", role: "kid14", xp: 15, location: "Nara",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ACTIVO IDENTIFICADO. ¿Cuál es el recuerdo más rentable que has visto hoy (mejor relación calidad-precio)?</p>
                <input type="text" id="t1" style="width:100%; margin-bottom:10px;" placeholder="Ej: Amuleto omamori de madera...">
                <p>>>> ANÁLISIS DE ROI. Justifica por qué mantendrá su valor cuando vuelvas a casa.</p>
                <input type="text" id="t2" style="width:100%; margin-bottom:15px;" placeholder="Ej: Es de artesanía local y no caduca...">
                <button id="btn" class="btn-primary" style="width:100%">Enviar Análisis</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                const i = document.getElementById('t1').value;
                const r = document.getElementById('t2').value;
                submitMission('day_5_investor', {type:'text', data:`Activo: ${i} | Análisis: ${r}`}, role);
            });
        }
    },
    "day_5_zen": {
        tag: "writing", day: 5, title: "Caligrafía Zen", role: "kid14", xp: 15, location: "Nara",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> PRUEBA DE CONCENTRACIÓN.</p>
                <p>Escribe el Kanji de "Persona" (人) o "Montaña" (山) instalando el teclado japonés o usando romaji que se convierta a Kanji.</p>
                <input type="text" id="ans" style="width:100%; margin-bottom:10px; text-align:center; font-size:2rem;">
                <button id="btn" class="btn-primary" style="width:100%">VALIDAR TRAZO</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_5_zen', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_5_engineer": {
        tag: "expert", day: 5, title: "Ingeniero Todai-ji", role: "kid14", xp: 20, location: "Todai-ji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ANÁLISIS ESTRUCTURAL.</p>
                <p>El Todai-ji es el edificio de madera más grande del mundo. Estima cuántos pisos equivaldría su altura en un edificio moderno de España.</p>
                <input type="number" id="ans" placeholder="Pisos estimados..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR CÁLCULO</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_5_engineer', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_5_guardian": {
        tag: "physical", day: 5, title: "El Guardián de la Suerte", role: "kid14", xp: 20, location: "Todai-ji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ESCANEO BIOMÉTRICO DE PILARES.</p>
                <p>Los pilares de Todai-ji son inmensos. Intenta abrazar uno (o simúlalo si hay gente). ¿Tus manos se tocan?</p>
                <button id="btn-1" class="btn-primary" style="width:100%; margin-bottom:10px;">Sí, se tocan</button>
                <button id="btn-2" class="btn-secondary" style="width:100%">Faltan metros</button>
            </div>
        `,
        attachEvents: (role) => { 
            document.getElementById('btn-1').addEventListener('click', () => submitMission('day_5_guardian', {type:'text', data:'Sí, se tocan'}, role)); 
            document.getElementById('btn-2').addEventListener('click', () => submitMission('day_5_guardian', {type:'text', data:'Faltan metros'}, role)); 
        }
    },
    "day_5_mochi": {
        tag: "game", day: 5, title: "El Ritmo del Mochi", role: "both", xp: 25, location: "Nara",
        render: () => `
            <p class="mission-desc">Uno golpea el mazo, el otro pone la mano. ¡Alternaos sin fallar!</p>
            <div style="text-align:center; margin-bottom:10px;">
                <div id="mochi-status" style="font-size:3rem;">⚪</div>
                <div id="mochi-score" style="font-weight:bold; font-size:1.2rem; color:var(--color-accent);">Golpes: 0/15</div>
                <div id="mochi-timer" style="font-size:1.5rem; margin-top:5px;">15s</div>
            </div>
            <div id="mochi-target" style="text-align:center; font-size:1.5rem; color:var(--color-black); margin-bottom:15px;">Preparados...</div>
            <div style="display:flex; gap:10px; height:150px;">
                <button id="btn-mazo" class="btn-secondary" style="flex:1; font-size:2rem; background:#cd7f32; color:#fff;" disabled>🔨 MAZO</button>
                <button id="btn-mano" class="btn-secondary" style="flex:1; font-size:2rem; background:#e0ac69; color:#fff;" disabled>🤚 MANO</button>
            </div>
            <button id="btn-start" class="btn-primary" style="width:100%; margin-top:15px;">Comenzar</button>
            <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: (role) => {
            const btnS = document.getElementById('btn-start');
            const btnMazo = document.getElementById('btn-mazo');
            const btnMano = document.getElementById('btn-mano');
            const btnSubmit = document.getElementById('btn-submit');
            const st = document.getElementById('mochi-status');
            const sc = document.getElementById('mochi-score');
            const tm = document.getElementById('mochi-timer');
            const targetEl = document.getElementById('mochi-target');
            
            let hits = 0; let fails = 0; let time = 15; let active = false; let nextTarget = ''; let interval = null; let isDebounced = false;

            const updateTarget = () => {
                nextTarget = nextTarget === 'mazo' ? 'mano' : 'mazo';
                targetEl.innerText = nextTarget === 'mazo' ? '¡TURNO DEL MAZO! 🔨' : '¡TURNO DE LA MANO! 🤚';
            };

            const fail = () => {
                fails++; st.innerText = '💥';
                setTimeout(() => { if(active) st.innerText = '⚪'; }, 300);
                if(fails > 2) endGame(false);
            };

            const hit = (type) => {
                if(!active || isDebounced) return;
                if(type !== nextTarget) { fail(); return; }
                isDebounced = true; setTimeout(() => isDebounced = false, 100);
                
                hits++; sc.innerText = `Golpes: ${hits}/15`; st.innerText = '✨';
                setTimeout(() => { if(active) st.innerText = '⚪'; }, 100);
                
                if(hits >= 15) endGame(true); else updateTarget();
            };

            const endGame = (win) => {
                active = false; clearInterval(interval); btnMazo.disabled = true; btnMano.disabled = true;
                if(win) {
                    st.innerText = '🍡'; targetEl.innerText = '¡Mochi perfecto!';
                    btnSubmit.classList.remove('hidden'); launchConfetti();
                } else {
                    st.innerText = '💥'; targetEl.innerText = '¡Mochi estropeado! Reintentar';
                    btnS.classList.remove('hidden'); btnS.innerText = 'Reintentar';
                }
            };

            btnS.addEventListener('click', () => {
                btnS.classList.add('hidden'); btnMazo.disabled = false; btnMano.disabled = false;
                hits = 0; fails = 0; time = 15; active = true; sc.innerText = `Golpes: 0/15`; st.innerText = '⚪';
                nextTarget = Math.random() > 0.5 ? 'mazo' : 'mano'; updateTarget();
                
                interval = setInterval(() => {
                    if(!active) return;
                    time--; tm.innerText = time + 's';
                    if(time <= 0) endGame(false);
                }, 1000);
            });

            btnMazo.addEventListener('touchstart', (e) => { e.preventDefault(); hit('mazo'); }, {passive:false});
            btnMano.addEventListener('touchstart', (e) => { e.preventDefault(); hit('mano'); }, {passive:false});
            btnMazo.addEventListener('mousedown', () => hit('mazo')); btnMano.addEventListener('mousedown', () => hit('mano'));

            btnSubmit.addEventListener('click', () => submitMission('day_5_mochi', {type:'game', data:'¡Mochi Perfecto en equipo!'}, role, true));
            window._missionCleanup = () => { active = false; clearInterval(interval); };
        }
    },

    // ==========================================
    // DÍA 6
    // ==========================================
    "day_6_seal": {
        tag: "expert", day: 6, title: "El Sello del Shogun", role: "kid9", xp: 15, location: "Castillo Nijo",
        render: () => `
            <p class="mission-desc">El símbolo de la familia Tokugawa (tres hojas de malva) está escondido por todo el castillo. Encuentra el más brillante y captúralo.</p>
            <button id="btn-cam" class="btn-secondary">📸 Foto del Sello</button>
        `,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_6_seal', role, false); }
    },
    "day_6_evasion": {
        tag: "physical", day: 6, title: "Técnica de Evasión", role: "kid9", xp: 20, location: "Nijo",
        render: () => `
            <p class="mission-desc">Cruza el puente de piedra del jardín en menos de 30 segundos dando pasos completamente silenciosos y rozando el suelo.</p>
            <button id="btn" class="btn-primary" style="width:100%">¡He cruzado en silencio!</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_evasion', {type:'physical', data:'Logrado'}, role)); }
    },
    "day_6_clouds": {
        tag: "writing", day: 6, title: "Jardín de Nubes", role: "kid9", xp: 15, location: "Palacio",
        render: () => `
            <p class="mission-desc">Los pinos del Palacio Imperial están podados para parecer nubes. Busca el que tenga la forma más extraña y descríbelo: ¿a qué animal se parece?</p>
            <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Enviar</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_clouds', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_6_ninja_steps": {
        tag: "game", day: 6, title: "Pasos de Ninja", role: "kid9", xp: 20, location: "Nijo",
        render: () => `
            <p class="mission-desc">Para no hacer sonar el suelo ruiseñor, debes sincronizar tus pasos. Toca la pantalla en el momento exacto en el que el sello de pie llegue a la zona roja inferior.</p>
            <div id="ninja-track" style="width:100px; height:300px; background:#ddd; margin:0 auto 20px; position:relative; overflow:hidden; border:2px solid #333;">
                <div id="ninja-target" style="position:absolute; bottom:20px; width:100px; height:40px; background:rgba(255,0,0,0.5);"></div>
                <div id="ninja-foot" style="position:absolute; top:-50px; left:25px; width:50px; height:50px; font-size:2rem;">🥷</div>
            </div>
            <button id="btn-step" class="btn-primary" style="width:100%">PISAR</button>
        `,
        attachEvents: (role) => {
            let hits = 0; let int; let active=true; let pos = -50;
            const foot = document.getElementById('ninja-foot');
            const loop = () => {
                if(!active) return;
                pos += 5;
                foot.style.top = pos + 'px';
                if(pos > 350) { pos = -50; }
                int = requestAnimationFrame(loop);
            };
            loop();
            document.getElementById('btn-step').addEventListener('click', () => {
                if(pos >= 230 && pos <= 280) {
                    hits++; pos = -50;
                    if(hits >= 3) { active=false; submitMission('day_6_ninja_steps', {type:'game', data:'Pasos sincronizados'}, role); }
                } else {
                    showAlert('Ruido', 'El suelo ha chirriado. Concéntrate.');
                }
            });
            window._missionCleanup = () => { active=false; cancelAnimationFrame(int); };
        }
    },
    "day_6_tactical": {
        tag: "expert", day: 6, title: "Infiltración Táctica", role: "kid14", xp: 20, location: "Nijo",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ANALIZANDO PERÍMETRO DEL CASTILLO.</p>
                <p>Identifica 2 puntos ciegos reales (esquinas, puertas, árboles) y describe la ruta exacta para llegar al tejado sin activar los suelos de ruiseñor.</p>
                <textarea id="ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR AL JUEZ</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_tactical', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_6_edict": {
        tag: "writing", day: 6, title: "Edicto Imperial", role: "kid14", xp: 15, location: "Palacio",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> REDACCIÓN DE LEYES.</p>
                <p>Eres el Emperador por un día. Escribe un decreto absurdo que todos los visitantes del palacio deban cumplir a partir de ahora.</p>
                <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">PROMULGAR</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_edict', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_6_time_travel": {
        tag: "photo", day: 6, title: "Viaje en el Tiempo", role: "kid14", xp: 15, location: "Sannenzaka",
        render: () => `<div class="ui-terminal" style="padding:15px; border-radius:8px;"><p>>>> TOMA HISTÓRICA: Saca una foto de la calle Sannenzaka intentando que no salga NINGUNA persona moderna, móvil o cable de luz. Solo estética 1600.</p></div>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_6_time_travel', role, false)
    },
    "day_6_ring": {
        tag: "physical", day: 6, title: "El Anillo Imperial", role: "kid14", xp: 20, location: "Palacio Imperial",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> CRONÓMETRO DE RECONOCIMIENTO.</p>
                <p>Mide tu velocidad imperial. Cronometra cuánto tardas en dar 100 pasos exactos por el recinto del palacio.</p>
                <input type="text" id="ans" placeholder="Tiempo en 100 pasos..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR TIEMPO</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_ring', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_6_clan": {
        tag: "photo", day: 6, title: "El Retrato del Clan", role: "both", xp: 20, location: "Castillo Nijo",
        render: () => `<p class="mission-desc">Buscad un fondo espectacular en los muros. Configurad el temporizador del móvil y posad todos con expresión seria y marcial, como un auténtico clan feudal.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_6_clan', role, false, true)
    },

    // ==========================================
    // DÍA 7
    // ==========================================
    "day_7_kimono": {
        tag: "photo", day: 7, title: "Cazadora de Kimonos", role: "kid9", xp: 15, location: "Sannenzaka",
        render: () => `<p class="mission-desc">Cuenta cuántas personas ves con kimono tradicional en Sannenzaka y cuando veas un grupo colorido pídeles hacerles una foto desde lejos.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_7_kimono', role, false)
    },
    "day_7_kintsugi": {
        tag: "game", day: 7, title: "La Vasija Rota", role: "kid9", xp: 20, location: "Kioto",
        render: () => `
            <p class="mission-desc">Este plato está roto. Dibuja líneas doradas sobre las grietas para repararlo con la técnica Kintsugi.</p>
            <div style="background:#000; position:relative; width:100%; height:250px; border-radius:10px; overflow:hidden;">
                <div style="position:absolute; border:2px dashed #333; width:200px; height:200px; border-radius:50%; top:25px; left:calc(50% - 100px); opacity:0.5;"></div>
                <canvas id="kintsugi-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%;"></canvas>
            </div>
            <button id="btn-kint" class="btn-primary" style="width:100%; margin-top:10px;">Completar Restauración</button>
        `,
        attachEvents: (role) => {
            const canvas = document.getElementById('kintsugi-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.parentElement.getBoundingClientRect().width;
            canvas.height = 250;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FFD700';

            let drawing = false;
            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.touches ? e.touches[0].clientX : e.clientX;
                const y = e.touches ? e.touches[0].clientY : e.clientY;
                return { x: x - rect.left, y: y - rect.top };
            };
            const drawStart = (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
            const drawMove = (e) => { if(drawing) { e.preventDefault(); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } };
            const drawEnd = () => { drawing = false; };

            canvas.addEventListener('mousedown', drawStart);
            canvas.addEventListener('mousemove', drawMove);
            canvas.addEventListener('mouseup', drawEnd);
            canvas.addEventListener('touchstart', drawStart, {passive:false});
            canvas.addEventListener('touchmove', drawMove, {passive:false});
            canvas.addEventListener('touchend', drawEnd);

            document.getElementById('btn-kint').addEventListener('click', async () => {
                const dataUrl = canvas.toDataURL('image/png');
                await savePhotoToDB('kintsugi_' + Date.now(), dataUrl);
                submitMission('day_7_kintsugi', {type:'game', data:'Plato restaurado con oro'}, role);
            });
        }
    },
    "day_7_tea": {
        tag: "sensors", day: 7, title: "Té del Shogun", role: "kid9", xp: 25, location: "Sannenzaka",
        render: () => `
            <p class="mission-desc">Imagina que llevas una bandeja con té hirviendo para el Shogun. Caminarás 20 metros manteniendo el móvil totalmente plano. Si se inclina demasiado, ¡se derrama!</p>
            <div id="tea-lvl" style="width:100px; height:100px; border-radius:50%; border:5px solid var(--color-primary); margin:20px auto; position:relative;">
                <div id="tea-drop" style="width:20px; height:20px; background:#4a3b32; border-radius:50%; position:absolute; top:40px; left:40px;"></div>
            </div>
            <button id="btn-start" class="btn-primary" style="width:100%">Iniciar Transporte</button>
        `,
        attachEvents: (role) => {
            let active = false;
            document.getElementById('btn-start').addEventListener('click', async (e) => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const p = await DeviceOrientationEvent.requestPermission();
                    if(p !== 'granted') return showAlert('Error', 'Permiso denegado.');
                }
                e.target.classList.add('hidden');
                active = true;
                const drop = document.getElementById('tea-drop');
                const h = (ev) => {
                    if(!active) return;
                    const x = ev.gamma; const y = ev.beta;
                    drop.style.transform = `translate(${x}px, ${y}px)`;
                    if(Math.abs(x) > 30 || Math.abs(y) > 30) {
                        active = false; showAlert("Fallo", "¡Se ha derramado el té!");
                        document.getElementById('btn-start').classList.remove('hidden');
                    }
                };
                window.addEventListener('deviceorientation', h);
                setTimeout(() => {
                    if(active) { active = false; window.removeEventListener('deviceorientation', h); submitMission('day_7_tea', {type:'sensors', data:'Té transportado'}, role); }
                }, 20000);
            });
            window._missionCleanup = () => active = false;
        }
    },
    "day_7_stone_guardian": {
        tag: "physical", day: 7, title: "El Guardián de Piedra", role: "kid9", xp: 15, location: "Kiyomizu-dera",
        render: () => `
            <p class="mission-desc">Los pilares de madera de este templo son legendarios. Intenta abrazar uno de los pilares gigantes (o imagina que lo haces si hay mucha gente). ¿Llegan tus manos a tocarse?</p>
            <button id="btn" class="btn-primary" style="width:100%">¡Lo he medido!</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_7_stone_guardian', {type:'physical', data:'Pilar medido'}, role)); }
    },
    "day_7_structural": {
        tag: "expert", day: 7, title: "Cálculo de Cargas", role: "kid14", xp: 20, location: "Kiyomizu-dera",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ANÁLISIS ESTRUCTURAL.</p>
                <p>NÚMERO DE PILARES en la primera fila frontal de la terraza. Cuenta y multiplica por 5 (toneladas de peso que soporta aprox cada uno).</p>
                <input type="number" id="ans" placeholder="Resultado en toneladas..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR CÁLCULO</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_7_structural', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_7_survival": {
        tag: "expert", day: 7, title: "Supervivencia al Maleficio", role: "kid14", xp: 15, location: "Sannenzaka",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> AMENAZA DETECTADA: Maldición por caída en Sannenzaka.</p>
                <p>Revisa tu inventario actual (mochila). ¿Qué 3 objetos reales usarías para contrarrestar la maldición y sobrevivir al día?</p>
                <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">APLICAR ANTÍDOTO</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_7_survival', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_7_anti_quake": {
        tag: "game", day: 7, title: "Anti-Sismo", role: "kid14", xp: 25, location: "Kiyomizu",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> PROTOCOLO SÍSMICO INICIADO.</p>
                <p>Kiyomizu-dera no usa clavos para resistir sismos. Mantén tu móvil plano como una mesa durante 15 segundos para evitar que la estructura colapse.</p>
                <button id="btn-start" class="btn-primary" style="width:100%">INICIAR CALIBRACIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            let active = false;
            document.getElementById('btn-start').addEventListener('click', async (e) => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const p = await DeviceOrientationEvent.requestPermission();
                    if(p !== 'granted') return showAlert('Error', 'Permiso denegado.');
                }
                e.target.classList.add('hidden');
                active = true;
                const h = (ev) => {
                    if(!active) return;
                    if(Math.abs(ev.gamma) > 15 || Math.abs(ev.beta) > 15) {
                        active = false; showAlert("Colapso", "Sismo detectado. Has fallado la estructura.");
                        document.getElementById('btn-start').classList.remove('hidden');
                    }
                };
                window.addEventListener('deviceorientation', h);
                setTimeout(() => {
                    if(active) { active = false; window.removeEventListener('deviceorientation', h); submitMission('day_7_anti_quake', {type:'game', data:'Estructura estabilizada'}, role); }
                }, 15000);
            });
            window._missionCleanup = () => active = false;
        }
    },
    "day_7_stairs": {
        tag: "physical", day: 7, title: "La Conquista de las Escaleras", role: "kid14", xp: 20, location: "Subida Kiyomizu",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> REGISTRO DE ELEVACIÓN.</p>
                <p>Kioto está lleno de cuestas. Cuenta cuántos escalones subes desde la base de Sannenzaka hasta la entrada del templo.</p>
                <input type="number" id="ans" placeholder="Total de escalones..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR INFORME</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_7_stairs', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_7_geisha": {
        tag: "photo", day: 7, title: "Código Geisha", role: "both", xp: 15, location: "Gion",
        render: () => `<p class="mission-desc">Explora las callejuelas de Gion al atardecer. Encontrad un farolillo de papel tradicional (Chōchin) encendido frente a una casa de té y capturadlo.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_7_geisha', role, false, true)
    }
'''

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

last_idx = content.rfind('};')
if last_idx != -1:
    new_content = content[:last_idx] + ',\n' + js_code + '\n};' + content[last_idx+2:]
    with codecs.open('missions.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Days 5-7 appended to missions.js successfully.")
else:
    print("Could not find the end of MISSIONS_CONFIG.")
