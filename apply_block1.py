import codecs

js_code = r'''
    // ==========================================
    // DÍA 1
    // ==========================================
    "day_1_bingo": {
        tag: "game", day: 1, title: "Bingo Aeroportuario", role: "kid9", xp: 15, location: "Aeropuerto",
        render: () => `
            <p class="mission-desc">¡Entrenamiento de observación activado! Encuentra 4 objetos típicos en el aeropuerto. Toca el sello correspondiente cuando lo localices.</p>
            <div class="bingo-grid" id="b-grid">
                <div class="bingo-card" data-val="av">✈️<br><span style="font-size:1rem">Avión Jumbo</span></div>
                <div class="bingo-card" data-val="pi">👨‍✈️<br><span style="font-size:1rem">Piloto</span></div>
                <div class="bingo-card" data-val="ma">🧳<br><span style="font-size:1rem">Maleta Roja</span></div>
                <div class="bingo-card" data-val="pa">🛂<br><span style="font-size:1rem">Pasaporte</span></div>
            </div>
            <button id="btn-b" class="btn-primary hidden" style="width:100%; margin-top:15px;">¡Bingo Completado!</button>
        `,
        attachEvents: (role) => {
            let found = 0;
            document.querySelectorAll('.bingo-card').forEach(c => {
                c.addEventListener('click', function() {
                    if(!this.classList.contains('flipped')) {
                        this.classList.add('flipped');
                        found++;
                        if(found === 4) document.getElementById('btn-b').classList.remove('hidden');
                    }
                });
            });
            document.getElementById('btn-b').addEventListener('click', () => submitMission('day_1_bingo', {type:'game', data:'Bingo 4/4'}, role));
        }
    },
    "day_1_balance": {
        tag: "sensors", day: 1, title: "Equilibrio a 10.000 Metros", role: "kid9", xp: 20, location: "Avión",
        render: () => `
            <p class="mission-desc">Entrena el pulso de un samurái. Coloca el móvil plano sobre la bandeja. La gota no debe salir del círculo durante 15 segundos.</p>
            <div class="level-container">
                <div class="target-zone"></div>
                <div class="bubble" id="lvl-bubble"></div>
            </div>
            <p id="lvl-timer" style="text-align:center; font-size:2rem; font-weight:bold;">15.0s</p>
            <button id="btn-start" class="btn-primary" style="width:100%">Calibrar y Empezar</button>
        `,
        attachEvents: (role) => {
            let active = false; let timeLeft = 15; let timerInt;
            const bubble = document.getElementById('lvl-bubble');
            const handleOrient = (e) => {
                if(!active) return;
                const x = e.gamma; const y = e.beta;
                bubble.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                if(Math.abs(x) > 30 || Math.abs(y) > 30) {
                    active = false; clearInterval(timerInt);
                    showAlert("Fallo", "¡Se ha derramado el té! Vuelve a intentarlo.");
                    document.getElementById('btn-start').classList.remove('hidden');
                }
            };
            document.getElementById('btn-start').addEventListener('click', async (e) => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const p = await DeviceOrientationEvent.requestPermission();
                    if(p !== 'granted') return showAlert('Error', 'Permiso denegado.');
                }
                e.target.classList.add('hidden');
                active = true; timeLeft = 15;
                window.addEventListener('deviceorientation', handleOrient);
                timerInt = setInterval(() => {
                    timeLeft -= 0.1;
                    document.getElementById('lvl-timer').innerText = timeLeft.toFixed(1) + 's';
                    if(timeLeft <= 0) {
                        active = false; clearInterval(timerInt); window.removeEventListener('deviceorientation', handleOrient);
                        submitMission('day_1_balance', {type:'sensors', data:'15s completados'}, role);
                    }
                }, 100);
            });
            window._missionCleanup = () => { active=false; clearInterval(timerInt); window.removeEventListener('deviceorientation', handleOrient); };
        }
    },
    "day_1_engine": {
        tag: "audio", day: 1, title: "El Escáner de Frecuencias", role: "kid9", xp: 15, location: "Avión",
        render: () => `
            <p class="mission-desc">Acerca el móvil a la ventanilla. ¡Captura el sonido del motor!</p>
            <button id="btn-rec" class="btn-primary" style="width:100%; height:80px; border-radius:40px; font-size:1.5rem">🎤 Grabar 5s</button>
        `,
        attachEvents: (role) => attachCameraFlow('btn-rec', 'day_1_engine', role, false)
    },
    "day_1_clouds": {
        tag: "photo", day: 1, title: "Cazador de Formas", role: "kid9", xp: 10, location: "Avión",
        render: () => `<p class="mission-desc">Haz una foto por la ventanilla y busca una forma extraña en las nubes.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_1_clouds', role, false)
    },
    "day_1_navigator": {
        tag: "writing", day: 1, title: "Navegante de Altura", role: "kid14", xp: 15, location: "Avión",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> PROTOCOLO DE VUELO: ACTIVO</p>
                <input type="number" id="nav-alt" placeholder="Altitud (pies)..." style="width:100%; margin-bottom:10px;">
                <input type="number" id="nav-spd" placeholder="Velocidad (km/h)..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR DATOS TELEMÉTRICOS</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                submitMission('day_1_navigator', {type:'text', data:`Alt: ${document.getElementById('nav-alt').value}ft, Vel: ${document.getElementById('nav-spd').value}km/h`}, role);
            });
        }
    },
    "day_1_timezone": {
        tag: "economy", day: 1, title: "Reloj Samurái del Sueño", role: "kid14", xp: 15, location: "Avión",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> CÁLCULO DE JETLAG.</p>
                <p>Japón va 7 horas por delante (o +8 según horario de verano/invierno). Si en Madrid son las 22:00, ¿qué hora es en Tokio?</p>
                <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">VALIDAR</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_1_timezone', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_1_customs": {
        tag: "expert", day: 1, title: "Infiltración en Aduanas", role: "kid14", xp: 25, location: "Aeropuerto",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ACCEDIENDO A PROTOCOLO DE ADUANAS...</p>
                <p>Lee el formulario de aduanas japonés. ¿Cuál es el límite legal de yenes en efectivo que puedes introducir sin declarar?</p>
                <input type="number" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">EJECUTAR</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_1_customs', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_1_exchange": {
        tag: "economy", day: 1, title: "El Precio del Yen", role: "kid14", xp: 15, location: "Aeropuerto",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> COTIZACIÓN EN TIEMPO REAL.</p>
                <p>Revisa la pizarra de cambio del aeropuerto. ¿Cuántos yenes te dan HOY por 1 Euro?</p>
                <input type="number" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR AL JUEZ</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_1_exchange', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_1_bets": {
        tag: "writing", day: 1, title: "Apuesta del Aterrizaje", role: "both", xp: 25, location: "Avión",
        render: () => `
            <p class="mission-desc">¡Misión de equipo! Escribid juntos 3 cosas raras, locas o increíbles que creéis que veréis en Japón durante el viaje.</p>
            <textarea id="ans" style="width:100%; height:100px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Sellar Apuesta</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_1_bets', {type:'text', data:document.getElementById('ans').value}, role, true)); }
    },

    // ==========================================
    // DÍA 2
    // ==========================================
    "day_2_yokai": {
        tag: "photo", day: 2, title: "Caza del Yōkai Oficial", role: "kid9", xp: 15, location: "Calle",
        render: () => `<p class="mission-desc">¡Alerta Yōkai! Encuentra una mascota oficial de alguna tienda japonesa o un cartel manga gigante en las calles y captúralo.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_2_yokai', role, false)
    },
    "day_2_posture": {
        tag: "physical", day: 2, title: "Equilibrio Silencioso", role: "kid9", xp: 20, location: "Metro",
        render: () => `
            <p class="mission-desc">Regla de oro nipona: Silencio y respeto en el metro. Mantente 2 minutos totalmente inmóvil, sentado o bien sujeto, sin hablar.</p>
            <button id="btn-start" class="btn-primary" style="width:100%">Iniciar Crono Zen</button>
            <p id="timer" class="hidden" style="text-align:center; font-size:2rem; font-weight:bold; margin-top:10px;">120s</p>
        `,
        attachEvents: (role) => {
            let int;
            document.getElementById('btn-start').addEventListener('click', (e) => {
                e.target.classList.add('hidden');
                let t = 120;
                document.getElementById('timer').classList.remove('hidden');
                int = setInterval(() => {
                    t--; document.getElementById('timer').innerText = t + 's';
                    if(t<=0) { clearInterval(int); submitMission('day_2_posture', {type:'text', data:'Logrado'}, role); }
                }, 1000);
            });
            window._missionCleanup = () => clearInterval(int);
        }
    },
    "day_2_melody": {
        tag: "audio", day: 2, title: "Melodía Subterránea", role: "kid9", xp: 20, location: "Metro",
        render: () => `<p class="mission-desc">Cuando suene la musiquita de la estación para anunciar un tren, ¡grábala!</p>
                       <button id="btn-rec" class="btn-primary" style="width:100%; height:80px; border-radius:40px; font-size:1.5rem">🎤 Grabar 5s</button>`,
        attachEvents: (role) => attachCameraFlow('btn-rec', 'day_2_melody', role, false)
    },
    "day_2_vending": {
        tag: "photo", day: 2, title: "El Detective de Vending", role: "kid9", xp: 15, location: "Calle",
        render: () => `<p class="mission-desc">Las máquinas expendedoras en Japón venden cosas locas. Haz foto a la Vending Machine más rara que veas hoy.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_2_vending', role, false)
    },
    "day_2_shogun": {
        tag: "expert", day: 2, title: "Protocolo Shōgun", role: "kid14", xp: 25, location: "Calles",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> MODO GUÍA: ON.</p>
                <p>Guía a la familia desde la estación hasta el hotel o restaurante objetivo usando un mapa local de la estación, sin que los padres usen Google Maps.</p>
                <button id="btn" class="btn-primary" style="width:100%">Misión Completada (El Juez confirmará)</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_2_shogun', {type:'text', data:'Ruta guiada con éxito'}, role)); }
    },
    "day_2_maze": {
        tag: "expert", day: 2, title: "Mapeo del Laberinto", role: "kid14", xp: 20, location: "Metro",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> INFILTRACIÓN SUBTERRÁNEA.</p>
                <p>Cronometra cuánto tardáis desde que bajáis del tren hasta salir a la calle pisando la acera.</p>
                <input type="number" id="ans" placeholder="Segundos..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR REPORTE</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_2_maze', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_2_kanji": {
        tag: "writing", day: 2, title: "Kanjis de Emergencia", role: "kid14", xp: 15, location: "Metro",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> BUSCANDO SALIDA DE EMERGENCIA (非常口).</p>
                <p>Escribe en tu teclado exactamente la palabra en rōmaji o español que significa salida.</p>
                <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">TRANSMITIR</button>
            </div>
        `,
        attachEvents: (role) => { 
            document.getElementById('btn').addEventListener('click', () => {
                const txt = document.getElementById('ans').value.toLowerCase().trim();
                submitMission('day_2_kanji', {type:'text', data:txt}, role);
            }); 
        }
    },
    "day_2_audit": {
        tag: "economy", day: 2, title: "Auditoría de Vending", role: "kid14", xp: 15, location: "Calle",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> Observa una máquina de bebidas estándar.</p>
                <p>¿Cuánto cuesta la botella de agua mineral estándar (normalmente Suntory o similar)?</p>
                <input type="number" id="ans" placeholder="Precio en yenes..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_2_audit', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_2_ekistamp": {
        tag: "photo", day: 2, title: "Coleccionista de Eki-Stamps", role: "both", xp: 15, location: "Estaciones",
        render: () => `<p class="mission-desc">Las estaciones tienen sellos únicos (Eki-Stamps). Buscad la mesa de sellado y fotografiad el primer sello impreso en vuestra libreta.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_2_ekistamp', role, false, true)
    },

    // ==========================================
    // DÍA 3
    // ==========================================
    "day_3_glico": {
        tag: "photo", day: 3, title: "Glico Man", role: "kid9", xp: 15, location: "Dotonbori",
        render: () => `<p class="mission-desc">¡Llegada a Dotonbori! Imita la pose clásica del Glico Man frente al gran cartel luminoso y hazte una foto.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_glico', role, false)
    },
    "day_3_ninja": {
        tag: "photo", day: 3, title: "Ninja de las Sombras", role: "kid9", xp: 10, location: "Calles",
        render: () => `<p class="mission-desc">Busca una luz en la calle que proyecte tu sombra grande en la pared. Haz una pose ninja y fotografía la sombra.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_ninja', role, false)
    },
    "day_3_bridge": {
        tag: "physical", day: 3, title: "Foso del Castillo", role: "kid9", xp: 20, location: "Castillo Osaka",
        render: () => `
            <p class="mission-desc">El foso es inmenso. Cruza el puente principal contando en voz alta tus pasos. ¿Cuántos pasos has dado en total para cruzar?</p>
            <input type="number" id="ans" style="width:100%; margin-bottom:10px;" placeholder="Número de pasos...">
            <button id="btn" class="btn-primary" style="width:100%">Reportar</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_3_bridge', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_3_umeda": {
        tag: "photo", day: 3, title: "Umeda Sky (Superhéroe)", role: "kid9", xp: 15, location: "Umeda Sky",
        render: () => `<p class="mission-desc">Juega con la perspectiva: haz que te tomen una foto donde parezca que estás sujetando o levantando el enorme edificio Umeda Sky Building.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_umeda', role, false)
    },
    "day_3_architect": {
        tag: "expert", day: 3, title: "Arquitecto del Castillo", role: "kid14", xp: 20, location: "Castillo Osaka",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ANÁLISIS DEFENSIVO DEL SHOGUN.</p>
                <p>Observa el foso y los enormes bloques de piedra. Estima el ancho del foso en metros basándote en tu propia visión.</p>
                <input type="number" id="ans" placeholder="Metros estimados..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR CÁLCULO</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_3_architect', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_3_neon": {
        tag: "photo", day: 3, title: "Filtro Cyberpunk", role: "kid14", xp: 15, location: "Dotonbori",
        render: () => `<div class="ui-terminal" style="padding:15px; border-radius:8px;"><p>>>> TOMA NOCTURNA: Busca una callejuela iluminada por neones y toma una foto angular estilo cyberpunk.</p></div>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_neon', role, false)
    },
    "day_3_rush": {
        tag: "physical", day: 3, title: "El Asalto al Shogun", role: "kid14", xp: 20, location: "Castillo Osaka",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> CRONÓMETRO TÁCTICO INICIADO.</p>
                <p>Desde la puerta exterior hasta la base de la torre principal. Mide el tiempo a pie (sin correr para no alterar a los guardias).</p>
                <input type="text" id="ans" placeholder="Minutos y segundos..." style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">REPORTAR TIEMPO</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_3_rush', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_3_flow": {
        tag: "sensors", day: 3, title: "Visión de Flujo Vital", role: "kid14", xp: 30, location: "Dotonbori",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ESCANEO DE MULTITUDES (Orientación).</p>
                <p>Apunta el dispositivo hacia el letrero más luminoso (Glico u otro) y mantenlo estable para medir el magnetismo.</p>
                <div id="sensor-val" style="font-size:2rem; color:#00ff99; margin:10px 0;">--</div>
                <button id="btn-scan" class="btn-primary" style="width:100%">INICIAR ESCANEO</button>
            </div>
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
                const h = (ev) => { val = Math.floor(Math.abs(ev.alpha || 0)); document.getElementById('sensor-val').innerText = val + ' Hz'; };
                window.addEventListener('deviceorientation', h);
                setTimeout(() => {
                    active = false; window.removeEventListener('deviceorientation', h);
                    submitMission('day_3_flow', {type:'sensors', data:'Escaneo: ' + val + 'Hz'}, role);
                }, 5000);
            });
        }
    },
    "day_3_reflect": {
        tag: "photo", day: 3, title: "El Reflejo Infinito", role: "both", xp: 25, location: "Osaka",
        render: () => `<p class="mission-desc">Buscad un espejo, cristal o charco donde se refleje la ciudad y vuestra familia junta. ¡Foto artística cooperativa!</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_reflect', role, false, true)
    },

    // ==========================================
    // DÍA 4
    // ==========================================
    "day_4_bestiary": {
        tag: "writing", day: 4, title: "Bestiario Kuromon", role: "kid9", xp: 15, location: "Kuromon",
        render: () => `
            <p class="mission-desc">Kuromon Ichiba tiene comida muy extraña. Encuentra el pez o marisco más raro y ponle un nombre alienígena inventado.</p>
            <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
            <button id="btn" class="btn-primary" style="width:100%">Registrar Criatura</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_bestiary', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_4_gachapon": {
        tag: "game", day: 4, title: "Gachapon", role: "kid9", xp: 15, location: "Tiendas",
        render: () => `
            <p class="mission-desc">Desliza el dedo en círculo sobre la ruleta virtual para abrir tu cápsula digital.</p>
            <div id="roulette" style="width:150px; height:150px; border-radius:50%; border:10px dashed var(--color-primary); margin:0 auto 20px; transition: transform 2s ease-out;"></div>
            <button id="btn" class="btn-primary" style="width:100%">Girar Manivela</button>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', (e) => {
                document.getElementById('roulette').style.transform = "rotate(720deg)";
                setTimeout(() => submitMission('day_4_gachapon', {type:'game', data:'Cápsula obtenida'}, role), 2000);
            });
        }
    },
    "day_4_vending_roulette": {
        tag: "photo", day: 4, title: "Ruleta Vending Anime", role: "kid9", xp: 15, location: "Calle",
        render: () => `<p class="mission-desc">Encuentra una lata de bebida que tenga dibujado a un personaje de anime famoso o mascota adorable y hazle una foto.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_4_vending_roulette', role, false)
    },
    "day_4_crab": {
        tag: "physical", day: 4, title: "Paso del Cangrejo", role: "kid9", xp: 15, location: "Puente / Calles",
        render: () => `
            <p class="mission-desc">Debes cruzar el próximo paso de cebra o puente moviéndote de lado como los cangrejos gigantes de Dotonbori. Confirma cuando lo hagas.</p>
            <button id="btn" class="btn-primary" style="width:100%">¡Hecho, clip, clap!</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_crab', {type:'physical', data:'Logrado'}, role)); }
    },
    "day_4_knife": {
        tag: "writing", day: 4, title: "El Cuchillo Samurái", role: "kid14", xp: 15, location: "Doguyasuji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ARMERÍA LOCALIZADA.</p>
                <p>Encuentra el cuchillo de chef más caro en un escaparate. ¿Para qué crees que se usa (pescado, carne, verduras)?</p>
                <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_knife', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_4_500yen": {
        tag: "economy", day: 4, title: "Reto 500 Yenes", role: "kid14", xp: 20, location: "Kombini",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> GESTIÓN DE RECURSOS.</p>
                <p>Entra en un Lawson/7-Eleven. Forma el mejor combo de snacks/bebidas sumando exactamente 500¥ (o lo más cerca posible sin pasarte). Escribe el combo.</p>
                <textarea id="ans" style="width:100%; height:80px; margin-bottom:10px;"></textarea>
                <button id="btn" class="btn-primary" style="width:100%">REGISTRAR COMPRA</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_500yen', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_4_isshinji": {
        tag: "writing", day: 4, title: "Secreto Isshinji", role: "kid14", xp: 15, location: "Isshinji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> ANALIZANDO ESTRUCTURA OSÉA...</p>
                <p>El templo Isshinji tiene Budas hechos con un material único y algo tétrico. Descubre qué es y regístralo.</p>
                <input type="text" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">ENVIAR</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_isshinji', {type:'text', data:document.getElementById('ans').value}, role)); }
    },
    "day_4_tracker": {
        tag: "physical", day: 4, title: "Rastreador de Kobe", role: "kid14", xp: 15, location: "Kuromon",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> CONTADOR DE OBJETIVOS.</p>
                <p>Cruza el mercado y anota mentalmente cuántos puestos sirven carne de Wagyu/Kobe en brochetas.</p>
                <input type="number" id="ans" style="width:100%; margin-bottom:10px;">
                <button id="btn" class="btn-primary" style="width:100%">TRANSMITIR CIFRA</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_tracker', {type:'number', data:document.getElementById('ans').value}, role)); }
    },
    "day_4_yakiniku": {
        tag: "photo", day: 4, title: "Maestro Yakiniku", role: "both", xp: 20, location: "Restaurante",
        render: () => `<p class="mission-desc">Misión conjunta: Haced una foto perfecta de la parrilla con la carne humeante mientras uno la voltea.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_4_yakiniku', role, false, true)
    }
'''

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

last_idx = content.rfind('};')
if last_idx != -1:
    new_content = content[:last_idx] + ',\n' + js_code + '\n};' + content[last_idx+2:]
    with codecs.open('missions.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Block 1 appended to missions.js successfully.")
else:
    print("Could not find the end of MISSIONS_CONFIG.")
