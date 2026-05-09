// ==========================================
// 3. CONFIGURACIÓN DE MISIONES
// ==========================================

const TAG_ICONS = { photo: "📷", video: "🎬", audio: "🎙️", writing: "✍️", versus: "⚔️", game: "🎮", sensors: "🧭", economy: "💰", physical: "🏃", expert: "⚡" };
const MISSIONS_CONFIG = {
    "day_1_fam_bet": { tag: "writing", day: 1, title: "Apuesta del Aterrizaje", role: "both", xp: 25, location: "Avión / Aeropuerto", render: () => `<p class="mission-desc">¡Bienvenidos a bordo! Antes de aterrizar en tierras niponas, escribid 3 cosas locas, raras o increíbles que creéis que veréis durante este gran viaje de 24 días en Japón.</p><input type="text" id="b1" placeholder="Locura 1..."><input type="text" id="b2" placeholder="Locura 2..."><input type="text" id="b3" placeholder="Locura 3..."><button id="btn" class="btn-primary" style="width:100%">Sellar Apuesta</button>`, attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_1_fam_bet', {type:'text', data:document.getElementById('b1').value}, role, true)); } },
        "day_1_kid9_bingo": {
        tag: "game", day: 1, title: "Bingo Aeroportuario", role: "kid9", xp: 15, location: "Aeropuerto",
        render: () => `
            <p class="mission-desc">¡Entrenamiento de observación activado! Encuentra 4 objetos típicos en el aeropuerto. Toca el sello correspondiente cuando lo localices.</p>
            <div id="bingo-board" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; perspective: 1000px;">
                ${['🎎', '🍵', '🚅', '🍣', '🏮', '🐱', '⛩️', '🍱', '🌸'].map((emoji, i) => `
                    <div class="bingo-cell" data-idx="${i}" style="background: var(--color-white); border: 2px solid var(--color-gray-light); border-radius: 10px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s; transform-style: preserve-3d; cursor: pointer; position: relative;">
                        <div class="emoji-face">${emoji}</div>
                        <div class="stamp-face hidden" style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(255, 0, 0, 0.05); border-radius: 8px;">
                            <span style="color: #d32f2f; font-size: 3rem; font-weight: bold; transform: rotate(-25deg); border: 3px solid #d32f2f; border-radius: 5px; opacity: 0.9; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">💮</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%; animation: pulse 1s infinite;">¡BINGO LOCALIZADO!</button>
        `,
        attachEvents: () => {
            let stamped = 0;
            const cells = document.querySelectorAll('.bingo-cell');
            cells.forEach(c => {
                c.addEventListener('click', function() {
                    if (this.dataset.stamped === 'true') return;
                    this.dataset.stamped = 'true';
                    this.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        this.querySelector('.emoji-face').style.opacity = '0.3';
                        this.querySelector('.stamp-face').classList.remove('hidden');
                        this.style.transform = 'scale(1)';
                        this.style.borderColor = '#d32f2f';
                        stamped++;
                        if(stamped === 4) {
                            document.getElementById('btn').classList.remove('hidden');
                            launchConfetti();
                        }
                    }, 150);
                });
            });
            document.getElementById('btn').addEventListener('click', () => submitMission('day_1_kid9_bingo', {type:'game', data:'Bingo completado con 4 sellos'}));
        }
    },
    "day_1_kid14_nav": { tag: "sensors", day: 1, title: "Navegante de Altura", role: "kid14", xp: 15, location: "Avión", render: () => `<p class="mission-desc">Como navegante oficial del equipo, usa la pantalla del avión para anotar la velocidad de crucero actual y utiliza la brújula digital de este dispositivo para verificar el rumbo hacia Japón.</p><div id="compass" style="font-size:2rem; text-align:center;">0°</div><input type="number" id="s" placeholder="Velocidad km/h"><button id="btn" class="btn-primary" style="width:100%">Enviar Reporte de Vuelo</button>`, attachEvents: () => { window.addEventListener('deviceorientation', (e) => { if(e.alpha) document.getElementById('compass').innerText = Math.round(e.alpha)+'°'; }); document.getElementById('btn').addEventListener('click', () => submitMission('day_1_kid14_nav', {type:'text', data:document.getElementById('s').value + ' km/h'})); } },
    "day_1_kid14_jetlag": { tag: "writing", day: 1, title: "Reloj Samurái del Sueño", role: "kid14", xp: 15, location: "Avión / Hotel", render: () => `<p class="mission-desc">Calcula tu hora de dormir (+7h).</p><input type="time" id="t"><button id="btn" class="btn-primary" style="width:100%">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_1_kid14_jetlag', {type:'text', data:document.getElementById('t').value})); } },
    "day_2_kid9_yokai": { tag: "photo", day: 2, title: "Caza del Yōkai Oficial", role: "kid9", xp: 20, location: "Calle", render: () => `<p class="mission-desc">¡Alerta Yōkai! Estos espíritus se esconden en todas partes. Encuentra una mascota oficial de alguna tienda japonesa o un cartel llamativo de estilo manga en las calles y captúralo con tu cámara antes de que desaparezca.</p><button id="btn-cam" class="btn-secondary">📸 Capturar Yōkai</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_2_kid9_yokai', currentUser, false); } },

    "any_eki_stamp": { tag: "photo", day: 2, title: "Coleccionista de Eki-Stamps", role: "both", xp: 15, location: "Estaciones", render: () => `<p class="mission-desc">Busca el sello de la estación.</p><button id="btn-cam" class="btn-secondary">📸 Foto Sello</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'any_eki_stamp', role, true); } },

    "day_2_kid14_protocol": { tag: "versus", day: 2, title: "Protocolo Shōgun", role: "kid14", xp: 20, location: "Metro / Tren", render: () => `<p class="mission-desc">Guía a la familia al hotel.</p><button id="btn" class="btn-primary" style="width:100%">Llegamos</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_2_kid14_protocol', {type:'text', data:'OK'})); } },
    "day_3_kid14_architect": { tag: "writing", day: 3, title: "Arquitecto del Castillo", correctAnswer: "~70m a 90m (Foso del castillo)",  role: "kid14", xp: 20, location: "Castillo Osaka", render: () => `<p class="mission-desc">Analiza la defensa del Shogun. Abre Google Maps en modo satélite y utiliza la herramienta de medida para calcular la distancia real aproximada (en metros) del foso de agua que protege el Castillo de Osaka.</p><input type="number" id="d" placeholder="Metros calculados..."><button id="btn" class="btn-primary">Enviar Informe de Asedio</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_3_kid14_architect', {type:'number', data:document.getElementById('d').value})); } },
    "day_3_kid14_audio": { tag: "audio", day: 3, title: "Jingle de Estación", role: "kid14", xp: 15, location: "Estación", render: () => `<p class="mission-desc">Cada estación de tren en Japón tiene su propia melodía característica (Hassha Melody). Espera en el andén y graba el sonido que suena justo antes de que el tren cierre sus puertas.</p><button id="btn-cam" class="btn-secondary">🎤 Grabar Melodía</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_3_kid14_audio', currentUser, false); } },

    "day_3_kid14_filtro": { tag: "photo", day: 3, title: "Filtro Cyberpunk", role: "kid14", xp: 10, location: "Umeda Sky", render: () => `<p class="mission-desc">Foto con filtro neón.</p><button id="btn-cam" class="btn-secondary">📸 Foto</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_3_kid14_filtro', currentUser, false); } },

    "day_3_kid9_glico": { tag: "photo", day: 3, title: "Glico Man", role: "kid9", xp: 10, location: "Dotonbori", render: () => `<p class="mission-desc">¡Llegada a Dotonbori! Busca el famoso cartel luminoso del corredor de Glico. Debes imitar su pose clásica (brazos arriba y una pierna flexionada) y pedirle a alguien que te haga un selfie o foto de cuerpo entero.</p><button id="btn-cam" class="btn-secondary">📸 Hacer la pose Glico</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_3_kid9_glico', currentUser, false); } },

    "day_3_kid9_ninja": { tag: "photo", day: 3, title: "Ninja de las Sombras", role: "kid9", xp: 10, location: "Jardines", render: () => `<p class="mission-desc">Foto de tu sombra ninja.</p><button id="btn-cam" class="btn-secondary">📸 Sombra</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_3_kid9_ninja', currentUser, false); } },

    "day_3_kid9_puente": { tag: "writing", day: 3, title: "Puente del Castillo", correctAnswer: "Depende de sus pasos, generalmente entre 40 y 60.",  role: "kid9", xp: 15, location: "Castillo", render: () => `<p class="mission-desc">Cuenta los pasos del puente.</p><input type="number" id="p"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_3_kid9_puente', {type:'number', data:document.getElementById('p').value})); } },
    "day_3_kid14_tribunal": { tag: "photo", day: 3, title: "Tribunal del Cartel", role: "kid14", xp: 15, location: "Dotonbori", render: () => `<p class="mission-desc">Foto del cartel más exagerado.</p><button id="btn-cam" class="btn-secondary">📸 Foto</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_3_kid14_tribunal', currentUser, false); } },

    "day_3_kid9_umeda": { tag: "photo", day: 3, title: "Umeda Sky (Superhéroe)", role: "kid9", xp: 10, location: "Umeda Sky", render: () => `<p class="mission-desc">Sujeta el edificio.</p><button id="btn-cam" class="btn-secondary">📸 Foto</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_3_kid9_umeda', currentUser, false); } },

    "day_4_kid9_bestiario": { tag: "writing", day: 4, title: "Bestiario Kuromon", role: "kid9", xp: 15, location: "Kuromon", render: () => `<p class="mission-desc">Pon nombre a un animal marino alienígena.</p><input type="text" id="n"><button id="btn" class="btn-primary">Bautizar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid9_bestiario', {type:'text', data:document.getElementById('n').value})); } },
    "day_4_kid14_cuchillo": { tag: "writing", day: 4, title: "El Cuchillo Samurái", role: "kid14", xp: 10, location: "Doguyasuji", render: () => `<p class="mission-desc">En la calle Doguyasuji se fabrican los mejores utensilios de cocina del mundo. Localiza una tienda de cuchillos artesanales, elige el que más te guste y dinos qué plato estrella japonés cocinarías con él.</p><input type="text" id="p" placeholder="Cuchillo y plato..."><button id="btn" class="btn-primary">Enviar Elección</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid14_cuchillo', {type:'text', data:document.getElementById('p').value})); } },
    "day_4_kid14_conbini": { tag: "economy", day: 4, title: "Reto 500 Yenes", role: "kid14", xp: 15, location: "Lawson", render: () => `<p class="mission-desc">Gasta max 500¥.</p><input type="number" id="v"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid14_conbini', {type:'number', data:document.getElementById('v').value})); } },
    "day_4_kid14_isshinji": { tag: "writing", day: 4, title: "Secreto Isshinji", correctAnswer: "Están hechas de cenizas de difuntos (Okotsu Butsu).",  role: "kid14", xp: 15, location: "Isshinji", render: () => `<p class="mission-desc">¿De qué están hechas las estatuas?</p><input type="text" id="a"><button id="btn" class="btn-primary">Responder</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid14_isshinji', {type:'text', data:document.getElementById('a').value})); } },
        "day_4_kid9_gachapon": {
        tag: "game", day: 4, title: "Gachapon", role: "kid9", xp: 10, location: "Tiendas",
        render: () => `
            <p class="mission-desc">Las máquinas Gachapon contienen tesoros impredecibles. ¡Gira la manivela virtual arrastrándola en círculo para sacar tu cápsula!</p>
            <div id="gacha-machine" style="width: 200px; height: 300px; margin: 0 auto; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); border-radius: 20px; border: 4px solid #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.2); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 10px; left: 10px; right: 10px; height: 120px; background: rgba(255,255,255,0.5); border-radius: 10px; border: 2px solid #fff; overflow: hidden;" id="gacha-glass">
                    <div style="font-size: 2rem; position: absolute; bottom: 10px; left: 20px;">🔴</div><div style="font-size: 2rem; position: absolute; bottom: 30px; right: 30px;">🔵</div><div style="font-size: 2rem; position: absolute; top: 20px; left: 50px;">🟡</div>
                </div>
                <div id="gacha-wheel" style="width: 80px; height: 80px; background: #fff; border-radius: 50%; position: absolute; bottom: 80px; left: 60px; border: 4px solid #ddd; box-shadow: inset 0 0 10px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; touch-action: none;">
                    <div style="width: 20px; height: 60px; background: #ccc; border-radius: 10px;"></div>
                </div>
                <div id="gacha-hole" style="width: 60px; height: 40px; background: #333; position: absolute; bottom: 20px; left: 70px; border-radius: 30px 30px 10px 10px; border: 2px solid #555;"></div>
                <div id="gacha-capsule" style="font-size: 3rem; position: absolute; bottom: 60px; left: 75px; opacity: 0; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">🎁</div>
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top: 20px; animation: pulse 1s infinite;">Abrir Cápsula al Juez</button>
        `,
        attachEvents: () => {
            const wheel = document.getElementById('gacha-wheel');
            const cap = document.getElementById('gacha-capsule');
            const btn = document.getElementById('btn');
            let angle = 0;
            let startY = 0;
            let won = false;

            wheel.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; });
            wheel.addEventListener('touchmove', (e) => {
                if(won) return;
                const dy = e.touches[0].clientY - startY;
                angle += (dy > 0 ? 5 : -5);
                wheel.style.transform = "rotate(" + angle + "deg)";
                startY = e.touches[0].clientY;
                if(Math.abs(angle) > 360) {
                    won = true;
                    wheel.style.transform = 'rotate(0deg)';
                    cap.style.opacity = '1';
                    cap.style.bottom = '15px';
                    setTimeout(() => {
                        cap.style.transform = 'scale(1.5)';
                        const prizes = ['🧸', '🐉', '⛩️', '🍱', '🦊'];
                        cap.innerText = prizes[Math.floor(Math.random()*5)];
                        btn.classList.remove('hidden');
                        launchConfetti();
                    }, 600);
                }
            });
            btn.addEventListener('click', () => submitMission('day_4_kid9_gachapon', {type:'game', data: "Objeto sagrado: " + cap.innerText}));
        }
    },
    "day_4_fam_yakiniku": { tag: "versus", day: 4, title: "Maestro Yakiniku", role: "both", xp: 20, location: "Restaurante", render: () => `<p class="mission-desc">Trabajo en equipo en la barbacoa.</p><button id="btn" class="btn-primary">Completado</button>`, attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_fam_yakiniku', {type:'text', data:'OK'}, role, true)); } },
    "day_4_kid14_meditacion": { tag: "photo", day: 4, title: "Meditación Zen", role: "kid14", xp: 15, location: "Namba Parks", render: () => `<p class="mission-desc">Namba Parks es un oasis de paz en medio del caos. Encuentra un rincón tranquilo en sus jardines colgantes y haz una foto que transmita paz y silencio, intentando que no aparezca ninguna persona en el encuadre.</p><button id="btn-cam" class="btn-secondary">📸 Foto Zen</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_4_kid14_meditacion', currentUser, false); } },

    "day_4_kid9_vending": { tag: "photo", day: 4, title: "Ruleta Vending", role: "kid9", xp: 15, location: "Calle", render: () => `<p class="mission-desc">En Japón hay máquinas expendedoras en cada esquina. Tu misión es encontrar una bebida que tenga un dibujo de un animal o un personaje famoso y sacarle una foto como prueba.</p><button id="btn-cam" class="btn-secondary">📸 Foto de la Bebida</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_4_kid9_vending', currentUser, false); } },

    "day_4_fam_kuromon": { tag: "economy", day: 4, title: "Subasta Kuromon", role: "both", xp: 20, location: "Kuromon", render: () => `<p class="mission-desc">Menú ideal 1000¥.</p><textarea id="t"></textarea><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_4_fam_kuromon', {type:'text', data:document.getElementById('t').value}, role, true)); } },
    "day_5_kid14_kanji": { tag: "writing", day: 5, title: "Caligrafía Zen", role: "kid14", xp: 15, location: "Nara", render: () => `<p class="mission-desc">La caligrafía Shodō es un arte milenario. Usando tu dedo como si fuera un pincel de bambú, dibuja el Kanji de "Persona" (人) o "Montaña" (山) en este lienzo digital.</p><canvas id="c" style="border:1px solid #ccc; height:200px; width:100%;"></canvas><button id="btn" class="btn-primary">Enviar Caligrafía</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid14_kanji', {type:'text', data:'Kanji'})); } },
    "day_5_kid9_deer": { tag: "video", day: 5, title: "Coreógrafo Ciervos", role: "kid9", xp: 25, location: "Nara", render: () => `<p class="mission-desc">Vídeo ciervo divertido.</p><button id="btn-cam" class="btn-secondary">🎥 Grabar</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_5_kid9_deer', currentUser, false); } },

        "day_5_kid9_silence": {
        tag: "game", day: 5, title: "Control Monje", role: "kid9", xp: 20, location: "Buda",
        render: () => `
            <p class="mission-desc">Demuestra el control de un monje Zen. Mantén pulsada la esfera de meditación durante 15 segundos sin soltar. Sincroniza tu respiración con la esfera.</p>
            <div style="height: 250px; display: flex; align-items: center; justify-content: center; position: relative; background: #1a1a2e; border-radius: 20px; overflow: hidden; margin-bottom: 20px;">
                <div id="zen-ring" style="width: 150px; height: 150px; border: 4px solid rgba(255,255,255,0.2); border-radius: 50%; position: absolute; transition: transform 4s ease-in-out;"></div>
                <div id="zen-orb" style="width: 100px; height: 100px; background: radial-gradient(circle, #00f2fe 0%, #4facfe 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; cursor: pointer; user-select: none; touch-action: none; box-shadow: 0 0 20px rgba(79, 172, 254, 0.5); z-index: 10;">🧘</div>
                <div id="zen-progress" style="position: absolute; bottom: 10px; width: 80%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                    <div id="zen-bar" style="width: 0%; height: 100%; background: #00f2fe; transition: width 0.1s linear;"></div>
                </div>
            </div>
            <p id="zen-status" style="text-align: center; color: var(--color-gray-dark); font-weight: bold;">Mantén pulsado para meditar</p>
            <button id="btn" class="btn-primary hidden" style="width:100%;">Misión Cumplida</button>
        `,
        attachEvents: () => {
            const orb = document.getElementById('zen-orb');
            const ring = document.getElementById('zen-ring');
            const bar = document.getElementById('zen-bar');
            const status = document.getElementById('zen-status');
            const btn = document.getElementById('btn');
            let timer = null;
            let time = 0;
            const TOTAL = 15;
            let breathInt = null;
            let isBreathingIn = false;

            const breathLoop = () => {
                isBreathingIn = !isBreathingIn;
                ring.style.transform = isBreathingIn ? 'scale(1.8)' : 'scale(1)';
                orb.style.boxShadow = isBreathingIn ? '0 0 50px rgba(79, 172, 254, 0.8)' : '0 0 20px rgba(79, 172, 254, 0.5)';
            };

            const start = (e) => {
                e.preventDefault();
                if(time >= TOTAL) return;
                orb.innerText = '😌';
                status.innerText = 'Inhala... Exhala...';
                breathLoop();
                breathInt = setInterval(breathLoop, 4000);
                timer = setInterval(() => {
                    time += 0.1;
                    bar.style.width = (time/TOTAL)*100 + "%";
                    if(time >= TOTAL) {
                        clearInterval(timer); clearInterval(breathInt);
                        orb.innerText = '✨';
                        status.innerText = '¡Iluminación alcanzada!';
                        btn.classList.remove('hidden');
                        launchConfetti();
                    }
                }, 100);
            };
            const stop = (e) => {
                if(e) e.preventDefault();
                if(time >= TOTAL) return;
                clearInterval(timer); clearInterval(breathInt);
                time = 0; bar.style.width = '0%';
                orb.innerText = '🧘';
                status.innerText = 'Concentración rota. Vuelve a intentar.';
                ring.style.transform = 'scale(1)';
                orb.style.boxShadow = '0 0 20px rgba(79, 172, 254, 0.5)';
            };

            orb.addEventListener('touchstart', start);
            orb.addEventListener('touchend', stop);
            orb.addEventListener('mousedown', start);
            orb.addEventListener('mouseup', stop);
            orb.addEventListener('mouseleave', stop);

            btn.addEventListener('click', () => submitMission('day_5_kid9_silence', {type:'game', data:"Meditación de " + TOTAL + "s completada"}));
            window._missionCleanup = () => { stop(); };
        }
    },
    "day_5_kid14_rascacielos": { tag: "writing", day: 5, title: "Rascacielos Madera", role: "kid14", xp: 10, location: "Todai-ji", render: () => `<p class="mission-desc">¿Cuántos pisos modernos?</p><input type="number" id="n"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid14_rascacielos', {type:'number', data:document.getElementById('n').value})); } },
    "day_5_kid9_embajador": { tag: "photo", day: 5, title: "Embajador Ciervos", role: "kid9", xp: 20, location: "Nara", render: () => `<p class="mission-desc">Selfie con 3 ciervos.</p><button id="btn-cam" class="btn-secondary">📸 Selfie</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_5_kid9_embajador', currentUser, false); } },

    "day_5_kid14_eng": { tag: "writing", day: 5, title: "Ingeniero Todai-ji", correctAnswer: "El área es inmensa, cualquier cálculo de ~2500m2 a 3000m2 es válido.",  role: "kid14", xp: 20, location: "Todai-ji", render: () => `<p class="mission-desc">Cálculo área base.</p><input type="text" id="a"><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid14_eng', {type:'text', data:document.getElementById('a').value})); } },
        "day_5_kid9_buda": {
        tag: "game", day: 5, title: "Iluminación Buda", role: "kid9", xp: 15, location: "Todai-ji",
        render: () => `
            <p class="mission-desc">Dentro del Todai-ji hay un pilar con un agujero del mismo tamaño que la fosa nasal del Gran Buda. ¡Usa el acelerómetro inclinando tu móvil para guiar la esfera de luz a través del pilar!</p>
            <div id="buda-game" style="width: 100%; height: 300px; background: #8b5a2b; border: 4px solid #5c3a21; border-radius: 10px; position: relative; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
                <div style="width: 80px; height: 80px; background: #111; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 4px solid #4a2e1b; box-shadow: inset 0 0 10px #000;"></div>
                <div id="buda-ball" style="width: 30px; height: 30px; background: radial-gradient(circle, #fff, #f39c12); border-radius: 50%; position: absolute; top: 20px; left: 20px; box-shadow: 0 0 15px #f39c12; transition: transform 0.1s linear;"></div>
            </div>
            <button id="btn" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">¡Agujero Cruzado!</button>
            <button id="btn-start-gyro" class="btn-secondary" style="width:100%; margin-top: 15px;">Activar Sensor Físico</button>
        `,
        attachEvents: () => {
            const ball = document.getElementById('buda-ball');
            const game = document.getElementById('buda-game');
            const btn = document.getElementById('btn');
            const btnStart = document.getElementById('btn-start-gyro');
            
            let x = 20, y = 20;
            let vx = 0, vy = 0;
            let active = false;
            let won = false;

            const updatePhysics = () => {
                if(!active || won) return;
                x += vx; y += vy;
                // Colisiones bordes
                if(x < 0) { x = 0; vx = 0; }
                if(x > game.clientWidth - 30) { x = game.clientWidth - 30; vx = 0; }
                if(y < 0) { y = 0; vy = 0; }
                if(y > game.clientHeight - 30) { y = game.clientHeight - 30; vy = 0; }
                
                ball.style.transform = "translate(" + x + "px, " + y + "px)";
                
                // Comprobar colisión agujero central (centro es game.clientWidth/2, game.clientHeight/2)
                const cx = game.clientWidth / 2 - 15;
                const cy = game.clientHeight / 2 - 15;
                const dist = Math.sqrt((x - cx)*(x - cx) + (y - cy)*(y - cy));
                
                if(dist < 20) {
                    won = true;
                    ball.style.transform = "translate(" + cx + "px, " + cy + "px) scale(0)";
                    setTimeout(() => {
                        game.style.background = '#f1c40f';
                        btn.classList.remove('hidden');
                        launchConfetti();
                    }, 300);
                }
                if(!won) requestAnimationFrame(updatePhysics);
            };

            const handleOrientation = (e) => {
                if(!active) return;
                let gamma = e.gamma; // izq/der
                let beta = e.beta;   // arriba/abajo
                // Limitar
                if (gamma >  90) gamma =  90;
                if (gamma < -90) gamma = -90;
                vx = gamma / 5;
                vy = beta / 5;
            };

            btnStart.addEventListener('click', () => {
                // Request permission para iOS 13+
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission().then(res => {
                        if (res === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                            active = true; btnStart.classList.add('hidden'); updatePhysics();
                        }
                    }).catch(console.error);
                } else {
                    window.addEventListener('deviceorientation', handleOrientation);
                    active = true; btnStart.classList.add('hidden'); updatePhysics();
                }
            });

            btn.addEventListener('click', () => submitMission('day_5_kid9_buda', {type:'game', data:'Prueba del agujero superada con acelerómetro'}));
            window._missionCleanup = () => { window.removeEventListener('deviceorientation', handleOrientation); active = false; };
        }
    },
    "day_5_kid14_geographic": { tag: "photo", day: 5, title: "Nara Geographic", role: "kid14", xp: 15, location: "Nara", render: () => `<p class="mission-desc">Foto ciervo con titular.</p><input type="text" id="t"><button id="btn" class="btn-primary">Publicar</button>`, attachEvents: (role) => { attachCameraFlow('btn', 'day_5_kid14_geographic', currentUser, false); } },

    "day_6_fam_decreto": { tag: "versus", day: 6, title: "El Duelo del Decreto", role: "both", xp: 25, location: "Palacio Imperial", render: () => `<div id="v-p1"><p>Escribid vuestros decretos en secreto.</p><input type="password" id="d9" placeholder="Niña..."><input type="password" id="d14" placeholder="Niño..."><button id="btn-r" class="btn-primary">Revelar</button></div><div id="v-p2" class="hidden"><p id="res"></p><button id="btn-s" class="btn-primary">Enviar al Juez</button></div>`, attachEvents: () => { const btnR=document.getElementById('btn-r'); btnR.addEventListener('click', () => { document.getElementById('res').innerText = '9: ' + document.getElementById('d9').value + ' | 14: ' + document.getElementById('d14').value; document.getElementById('v-p1').classList.add('hidden'); document.getElementById('v-p2').classList.remove('hidden'); }); document.getElementById('btn-s').addEventListener('click', () => submitMission('day_6_fam_decreto', {type:'text', data:'Duelo OK'}, 'both', true)); } },
    "day_6_kid14_edicto": { tag: "writing", day: 6, title: "Edicto Imperial", role: "kid14", xp: 15, location: "Palacio", render: () => `<p class="mission-desc">Imagina que eres el nuevo Emperador por un día. Escribe un decreto o ley absurda que todos los visitantes del palacio deban cumplir a partir de ahora (por ejemplo: "Prohibido caminar sin saltar").</p><textarea id="t" placeholder="Yo, el Emperador, ordeno que..."></textarea><button id="btn" class="btn-primary">Proclamar Edicto</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_kid14_edicto', {type:'text', data:document.getElementById('t').value})); } },
    "day_6_kid9_jardin": { tag: "writing", day: 6, title: "Jardín Nubes", role: "kid9", xp: 15, location: "Palacio", render: () => `<p class="mission-desc">Los pinos del Palacio Imperial están podados para parecer nubes. Busca el que tenga la forma más extraña o divertida y descríbelo: ¿a qué animal u objeto se parece?</p><input type="text" id="t" placeholder="Se parece a..."><button id="btn" class="btn-primary">Enviar Descripción</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_kid9_jardin', {type:'text', data:document.getElementById('t').value})); } },
    "day_6_kid9_ruisenor": { tag: "audio", day: 6, title: "Suelo Ruiseñor", role: "kid9", xp: 15, location: "Nijo", render: () => `<p class="mission-desc">En el Castillo Nijo, los suelos fueron diseñados para "cantar" como ruiseñores cuando alguien camina sobre ellos, para detectar espías. Camina con cuidado por los pasillos y graba el sonido del chirrido real de la madera bajo tus pies.</p><button id="btn-cam" class="btn-secondary">🎤 Grabar el "Canto"</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_6_kid9_ruisenor', currentUser, false); } },

    "day_6_kid9_ruisenor_video": { tag: "video", day: 6, title: "El Espía del Suelo", role: "kid9", xp: 20, location: "Nijo", render: () => `<p class="mission-desc">Vídeo 10s y descripción.</p><input type="file" accept="video/*" capture="environment" id="v"><input type="text" id="d" placeholder="Me recuerda a..."><button id="b" class="btn-primary">Enviar</button>`, attachEvents: (role) => { attachCameraFlow('b', 'day_6_kid9_ruisenor_video', currentUser, false); } },

    "day_6_kid14_ninja_plan": { tag: "writing", day: 6, title: "Plan Infiltración Ninja", role: "kid14", xp: 15, location: "Nijo", render: () => `<p class="mission-desc">Escribe tu plan (2 frases).</p><textarea id="t"></textarea><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_6_kid14_ninja_plan', {type:'text', data:document.getElementById('t').value})); } },
    "day_6_kid14_tiempo": { tag: "photo", day: 6, title: "Viaje Tiempo", role: "kid14", xp: 15, location: "Sannenzaka", render: () => `<p class="mission-desc">Foto época 1600.</p><button id="btn-cam" class="btn-secondary">📸 Foto</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_6_kid14_tiempo', currentUser, false); } },

    "day_6_kid14_foto_1600": { tag: "writing", day: 6, title: "Fotógrafo de 1600", role: "kid14", xp: 20, location: "Sannenzaka", render: () => { const dep=gameState.kid14.missions['day_6_kid14_tiempo']; if(!dep || dep.status!=='approved') return `<p>🔒 Completa "Viaje Tiempo" primero.</p>`; return `<textarea id="h" placeholder="Contexto histórico..."></textarea><button id="b" class="btn-primary">Enviar</button>`; }, attachEvents: () => { const b=document.getElementById('b'); if(b) b.addEventListener('click', () => submitMission('day_6_kid14_foto_1600', {type:'text', data:document.getElementById('h').value})); } },
        "day_6_kid9_ninja_steps": {
        tag: "game", day: 6, title: "Pasos de Ninja", role: "kid9", xp: 20, location: "Nijo",
        render: () => `
            <p class="mission-desc">¡Pisa con cuidado! Para no hacer sonar el suelo ruiseñor, debes sincronizar tus pasos. Toca la pantalla en el momento exacto en el que el sello de pie llegue a la zona roja inferior.</p>
            <div id="ninja-game" style="width: 100%; height: 350px; background: #2c3e50; position: relative; overflow: hidden; border-radius: 10px; border: 3px solid #34495e;">
                <div style="position: absolute; bottom: 30px; width: 100%; height: 60px; background: rgba(231, 76, 60, 0.4); border-top: 2px solid #e74c3c; border-bottom: 2px solid #e74c3c; pointer-events: none;"></div>
                <div id="ninja-score" style="position: absolute; top: 10px; right: 15px; color: #fff; font-size: 2rem; font-weight: bold; text-shadow: 0 0 5px #000;">0 / 10</div>
                <div id="ninja-msg" style="position: absolute; top: 50%; left: 0; width: 100%; text-align: center; color: #f1c40f; font-size: 2rem; font-weight: bold; opacity: 0; transition: opacity 0.2s;">¡PERFECTO!</div>
            </div>
            <button id="btn-start" class="btn-primary" style="width:100%; margin-top: 15px;">Iniciar Infiltración</button>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%; margin-top: 15px; animation: pulse 1s infinite;">Enviar Reporte Ninja</button>
        `,
        attachEvents: () => {
            const cont = document.getElementById('ninja-game');
            const sc = document.getElementById('ninja-score');
            const msg = document.getElementById('ninja-msg');
            const btnS = document.getElementById('btn-start');
            const btnV = document.getElementById('btn-victory');
            
            let score = 0;
            let active = false;
            let foots = [];
            let spawnInt = null;

            const showMsg = (text, color) => {
                msg.innerText = text; msg.style.color = color;
                msg.style.opacity = '1';
                setTimeout(() => { msg.style.opacity = '0'; }, 500);
            };

            const spawn = () => {
                if(!active) return;
                const f = document.createElement('div');
                f.innerText = '👣';
                f.style.position = 'absolute';
                f.style.top = '-60px';
                f.style.left = Math.floor(Math.random() * 60 + 20) + '%';
                f.style.fontSize = '3rem';
                f.dataset.hit = 'false';
                cont.appendChild(f);
                foots.push({ el: f, y: -60, speed: Math.random() * 2 + 3 });
            };

            const loop = () => {
                if(!active) return;
                for(let i=foots.length-1; i>=0; i--) {
                    const f = foots[i];
                    f.y += f.speed;
                    f.el.style.top = f.y + 'px';
                    if(f.y > 350) {
                        if(f.el.dataset.hit === 'false') showMsg('¡Fallaste!', '#e74c3c');
                        f.el.remove();
                        foots.splice(i, 1);
                    }
                }
                requestAnimationFrame(loop);
            };

            const handleTap = (e) => {
                if(!active) return;
                e.preventDefault();
                let hitAny = false;
                for(let i=0; i<foots.length; i++) {
                    const f = foots[i];
                    // Zona: 350-30-60 = 260 a 320 aprox
                    if(f.y > 240 && f.y < 310 && f.el.dataset.hit === 'false') {
                        f.el.dataset.hit = 'true';
                        f.el.style.transform = 'scale(1.5)';
                        f.el.style.opacity = '0';
                        score++;
                        sc.innerText = score + ' / 10';
                        showMsg('¡PERFECTO!', '#2ecc71');
                        hitAny = true;
                        if(score >= 10) {
                            active = false;
                            clearInterval(spawnInt);
                            showMsg('¡NINJA!', '#f1c40f');
                            btnV.classList.remove('hidden');
                            launchConfetti();
                        }
                        break; // Solo hit 1 por tap
                    }
                }
                if(!hitAny && score < 10) { showMsg('¡Ruido!', '#e74c3c'); }
            };

            cont.addEventListener('touchstart', handleTap);
            cont.addEventListener('mousedown', handleTap);

            btnS.addEventListener('click', () => {
                btnS.classList.add('hidden');
                active = true;
                score = 0; sc.innerText = '0 / 10';
                spawnInt = setInterval(spawn, 1000);
                loop();
            });

            btnV.addEventListener('click', () => submitMission('day_6_kid9_ninja_steps', {type:'game', data:`Juego de ritmo completado (${score} perfectos)`}));
            
            window._missionCleanup = () => { active = false; clearInterval(spawnInt); };
        }
    },
    "day_7_fam_gion": { tag: "photo", day: 7, title: "Código Geisha", role: "both", xp: 15, location: "Gion", render: () => `<p class="mission-desc">Explora las misteriosas callejuelas de Gion al atardecer. Tu misión es encontrar un farolillo de papel tradicional (Chōchin) que esté iluminado frente a una antigua casa de té y capturar su luz con una foto.</p><button id="btn-cam" class="btn-secondary">📸 Capturar el Farolillo</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_7_fam_gion', role, true); } },

    "day_7_kid14_guia": { tag: "video", day: 7, title: "Guía en 60s", role: "kid14", xp: 20, location: "Gion", render: () => `<div id="timer">60</div><input type="file" accept="video/*" capture="environment" id="v"><button id="b" class="btn-primary">Enviar</button>`, attachEvents: (role) => { attachCameraFlow('b', 'day_7_kid14_guia', currentUser, false); } },

    "day_7_kid9_tea": { tag: "sensors", day: 7, title: "Té Shogun", role: "kid9", xp: 15, location: "Sannenzaka", render: () => `<p class="mission-desc">Imagínate que llevas una bandeja con té hirviendo para el Shogun. Debes caminar 20 metros manteniendo el móvil totalmente plano (como una bandeja). Si se inclina demasiado, ¡el té se derrama!</p><button id="btn" class="btn-primary">Iniciar Servicio</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_7_kid9_tea', {type:'text', data:'OK'})); } },
    "day_7_kid9_force": { tag: "photo", day: 7, title: "Fuerza Benkei", role: "kid9", xp: 15, location: "Kiyomizu", render: () => `<p class="mission-desc">Foto levantando armas Benkei.</p><button id="btn-cam" class="btn-secondary">📸 Foto</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_7_kid9_force', currentUser, false); } },

    "day_7_fam_stones": { tag: "photo", day: 7, title: "Piedras Destino", role: "both", xp: 10, location: "Jishu Shrine", render: () => `<p class="mission-desc">Selfie ojos cerrados entre piedras.</p><button id="btn-cam" class="btn-secondary">📸 Selfie</button>`, attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_7_fam_stones', role, true); } },

    "day_7_fam_otowa": { tag: "versus", day: 7, title: "Reto Agua Sagrada", role: "both", xp: 30, location: "Kiyomizu", render: () => `<p>Elegid un don en secreto.</p><select id="s9"><option value="estudios">Estudios</option><option value="amor">Amor</option><option value="salud">Salud</option></select><select id="s14"><option value="estudios">Estudios</option><option value="amor">Amor</option><option value="salud">Salud</option></select><button id="b" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('b').addEventListener('click', () => submitMission('day_7_fam_otowa', {type:'text', data:'Dones'}, 'both', true)); } },
    "day_7_kid9_otowa": { tag: "versus", day: 7, title: "Chorros Destino", role: "kid9", xp: 15, location: "Kiyomizu", render: () => `<p class="mission-desc">Elige SOLO UN chorro.</p><button id="btn" class="btn-primary">Beber</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_7_kid9_otowa', {type:'text', data:'Bebido'})); } },
    "day_7_kid14_madera": { tag: "writing", day: 7, title: "Magia Madera", correctAnswer: "Se ensambla con un sistema de encaje de madera (Kigumi) que resiste sismos.",  role: "kid14", xp: 15, location: "Kiyomizu", render: () => `<p class="mission-desc">Explica cómo aguanta sin clavos.</p><textarea id="t"></textarea><button id="btn" class="btn-primary">Enviar</button>`, attachEvents: () => { document.getElementById('btn').addEventListener('click', () => submitMission('day_7_kid14_madera', {type:'text', data:document.getElementById('t').value})); } },
        "day_7_kid14_anti_seismic": {
        tag: "game", day: 7, title: "Anti-Sismo", role: "kid14", xp: 20, location: "Kiyomizu",
        render: () => `
            <p class="mission-desc">El templo de madera de Kiyomizu-dera no usa clavos, ¡usa el peso y la gravedad para resistir terremotos! Mantén tu móvil plano como una mesa durante 15 segundos para evitar que la pagoda virtual colapse.</p>
            <div style="width: 100%; height: 300px; background: #87CEEB; position: relative; border-radius: 10px; overflow: hidden; border: 3px solid #2980b9;">
                <div style="position: absolute; bottom: 0; width: 100%; height: 50px; background: #27ae60;"></div>
                <div id="pagoda-base" style="position: absolute; bottom: 50px; left: 50%; width: 100px; height: 10px; background: #c0392b; transform: translateX(-50%); transform-origin: center bottom;">
                    <div style="position: absolute; bottom: 10px; left: 10px; width: 80px; height: 40px; background: #e74c3c; border: 2px solid #c0392b;"></div>
                    <div style="position: absolute; bottom: 50px; left: -20px; width: 140px; height: 20px; background: #2c3e50; clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);"></div>
                    <div style="position: absolute; bottom: 70px; left: 20px; width: 60px; height: 40px; background: #e74c3c; border: 2px solid #c0392b;"></div>
                    <div style="position: absolute; bottom: 110px; left: -10px; width: 120px; height: 20px; background: #2c3e50; clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);"></div>
                    <div style="position: absolute; bottom: 130px; left: 30px; width: 40px; height: 40px; background: #e74c3c; border: 2px solid #c0392b;"></div>
                    <div style="position: absolute; bottom: 170px; left: 0px; width: 100px; height: 20px; background: #2c3e50; clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);"></div>
                    <div style="position: absolute; bottom: 190px; left: 45px; width: 10px; height: 50px; background: #f1c40f;"></div>
                </div>
                <div id="seismic-timer" style="position: absolute; top: 10px; right: 10px; font-size: 3rem; font-weight: bold; color: #fff; text-shadow: 0 0 5px #000;">15</div>
                <div id="seismic-msg" style="position: absolute; top: 50%; width: 100%; text-align: center; font-size: 2rem; color: #e74c3c; font-weight: bold; text-shadow: 0 0 10px #fff; opacity: 0; pointer-events: none;">¡TERREMOTO!</div>
            </div>
            <button id="btn-start-seis" class="btn-secondary" style="width:100%; margin-top: 15px;">Activar Simulador</button>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%; margin-top: 15px;">Enviar Datos de Estabilidad</button>
        `,
        attachEvents: () => {
            const pagoda = document.getElementById('pagoda-base');
            const timerEl = document.getElementById('seismic-timer');
            const msg = document.getElementById('seismic-msg');
            const btnS = document.getElementById('btn-start-seis');
            const btnV = document.getElementById('btn-victory');

            let active = false;
            let time = 15;
            let angle = 0;
            let vel = 0;
            let interval = null;

            const updatePhysics = () => {
                if(!active) return;
                // Simular inercia y gravedad si se inclina
                angle += vel;
                pagoda.style.transform = `translateX(-50%) rotate(${angle}deg)`;
                
                if(Math.abs(angle) > 45) {
                    // Colapso
                    active = false;
                    clearInterval(interval);
                    msg.innerText = "¡COLAPSO!";
                    msg.style.opacity = '1';
                    pagoda.style.bottom = '-100px';
                    pagoda.style.opacity = '0';
                    pagoda.style.transition = 'all 1s';
                    btnS.innerText = "Reintentar";
                    btnS.classList.remove('hidden');
                } else {
                    requestAnimationFrame(updatePhysics);
                }
            };

            const handleOrientation = (e) => {
                if(!active) return;
                // e.gamma es inclinación izq/der en grados (-90 a 90)
                let gamma = e.gamma || 0;
                // Añadir un poco de dificultad pseudo-aleatoria (viento/sismo)
                let sismo = (Math.random() - 0.5) * 2;
                vel = (gamma * 0.1) + sismo;
            };

            btnS.addEventListener('click', () => {
                if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission().then(res => {
                        if(res === 'granted') startSim();
                    }).catch(console.error);
                } else {
                    startSim();
                }
            });

            function startSim() {
                active = true; time = 15; angle = 0; vel = 0;
                pagoda.style.transition = 'none';
                pagoda.style.bottom = '50px';
                pagoda.style.opacity = '1';
                msg.style.opacity = '0';
                timerEl.innerText = time;
                btnS.classList.add('hidden');
                window.addEventListener('deviceorientation', handleOrientation);
                updatePhysics();

                interval = setInterval(() => {
                    if(!active) return;
                    time--;
                    timerEl.innerText = time;
                    if(time <= 0) {
                        active = false;
                        clearInterval(interval);
                        msg.innerText = "¡ESTABLE!";
                        msg.style.color = '#2ecc71';
                        msg.style.opacity = '1';
                        btnV.classList.remove('hidden');
                        launchConfetti();
                    }
                }, 1000);
            }

            btnV.addEventListener('click', () => submitMission('day_7_kid14_anti_seismic', {type:'game', data:'Pagoda estabilizada 15s'}));
            window._missionCleanup = () => { active = false; clearInterval(interval); window.removeEventListener('deviceorientation', handleOrientation); };
        }
    },
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
                ctx.clearRect(0, 0, c.width, c.height);
                
                // Efecto fósforo
                ctx.globalCompositeOperation = 'lighter';
                
                // Onda Objetivo (Roja)
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'red';
                for(let x=0; x<c.width; x++) {
                    ctx.lineTo(x, 75 + 40 * Math.sin((x + offset) * targetFreq));
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
                    ctx.lineTo(x, 75 + 40 * Math.sin((x + offset) * playerFreq));
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
                let clientX, clientY;
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
                {t:1, r:90}, {t:0, r:0}, {t:1, r:180},
                {t:0, r:90}, {t:1, r:0}, {t:0, r:90},
                {t:1, r:270}, {t:1, r:180}, {t:1, r:0}
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
    "day_3_kid9_foso": {
        tag: "physical", day: 3, title: "Pasos de Gigante", role: "kid9", xp: 15, location: "Fosos del Castillo de Osaka",
        render: () => `
            <p class="mission-desc">El foso de este castillo es inmenso para proteger al Shogun. Camina por el borde y cuenta cuántos pasos de gigante necesitas para cruzar el puente principal.</p>
            <input type="number" id="p-pasos" placeholder="Número de pasos..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_3_kid9_foso', {type:'number', data:document.getElementById('p-pasos').value})); }
    },
    "day_3_kid14_asalto": {
        tag: "physical", day: 3, title: "El Asalto al Shogun", role: "kid14", xp: 20, location: "Castillo de Osaka",
        render: () => `
            <p class="mission-desc">Debes llegar a las puertas del castillo antes de que den la alarma. Inicia la marcha rápida y detén el cronómetro cuando llegues a la entrada principal.</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">00:00</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="c-start" class="btn-secondary">Iniciar Marcha</button>
                <button id="c-stop" class="btn-secondary">Parar</button>
            </div>
            <input type="text" id="p-word" placeholder="Palabra de Samurái..." style="width:100%; margin-top:15px;">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('c-start').addEventListener('click', () => { 
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('c-stop').addEventListener('click', () => { clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_3_kid14_asalto', {type:'text', data: `Tiempo: ${document.getElementById('chrono').innerText} | Palabra: ${document.getElementById('p-word').value}`}));
        }
    },
    "day_4_kid9_cangrejo": {
        tag: "physical", day: 4, title: "El Paso del Cangrejo", role: "kid9", xp: 15, location: "Puente Sorihashi (Sumiyoshi)",
        render: () => `
            <p class="mission-desc">Este puente es tan curvo que parece una montaña. ¡Súbelo con cuidado! Cuéntale al Juez cómo has logrado vencer la gravedad.</p>
            <div class="choice-grid">
                <button class="btn-secondary c-btn" data-v="Cangrejo">🦀 Subí de lado</button>
                <button class="btn-secondary c-btn" data-v="Frente">🚶 Subí de frente</button>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Elección</button>
        `,
        attachEvents: () => {
            let val='';
            document.querySelectorAll('.c-btn').forEach(b => b.addEventListener('click', function() { 
                document.querySelectorAll('.c-btn').forEach(x => x.classList.remove('selected'));
                this.classList.add('selected'); val = this.dataset.v; document.getElementById('btn-sub').classList.remove('hidden');
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_4_kid9_cangrejo', {type:'text', data:val}));
        }
    },
    "day_4_kid14_kuromon": {
        tag: "physical", day: 4, title: "El Rastreador de Kuromon", role: "kid14", xp: 15, location: "Mercado Kuromon Ichiba",
        render: () => `
            <p class="mission-desc">Camina ágil (¡SIN CORRER!) por el mercado. Debes contar cuántos puestos de comida exótica (Carne de Kobe o Cangrejo vivo) logras detectar en tu camino.</p>
            <input type="number" id="n-puestos" placeholder="Número de puestos..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_4_kid14_kuromon', {type:'number', data:document.getElementById('n-puestos').value})); }
    },
    "day_5_kid9_galax": {
        tag: "physical", day: 5, title: "La Galaxia de los Ciervos", role: "kid9", xp: 20, location: "Parque de Nara",
        render: () => `
            <p class="mission-desc">¡Hay ciervos por todas partes! Tienes 5 minutos para contar todos los que veas a tu alrededor. Usa los botones para llevar la cuenta.</p>
            <div style="display:flex; align-items:center; justify-content:center; gap:20px; margin:20px 0;">
                <button id="cnt-min" class="btn-secondary" style="font-size:2rem; width:60px;">-</button>
                <div id="cnt-val" style="font-size:3rem; font-weight:bold;">0</div>
                <button id="cnt-plus" class="btn-secondary" style="font-size:2rem; width:60px;">+</button>
            </div>
            <button id="btn-calc" class="btn-secondary" style="width:100%">Calcular total en media hora</button>
            <p id="res-calc" class="hidden" style="text-align:center; margin-top:10px; font-weight:bold; color:var(--color-accent);"></p>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let c=0;
            const update = () => document.getElementById('cnt-val').innerText = c;
            document.getElementById('cnt-plus').addEventListener('click', () => { c++; update(); });
            document.getElementById('cnt-min').addEventListener('click', () => { if(c>0) c--; update(); });
            document.getElementById('btn-calc').addEventListener('click', () => {
                const total = c * 6;
                document.getElementById('res-calc').innerText = `¡A este ritmo verás ${total} ciervos en media hora!`;
                document.getElementById('res-calc').classList.remove('hidden');
                document.getElementById('btn-sub').classList.remove('hidden');
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_5_kid9_galax', {type:'text', data:document.getElementById('res-calc').innerText}));
        }
    },
    "day_5_kid14_suerte": {
        tag: "physical", day: 5, title: "El Guardián de la Suerte", role: "kid14", xp: 20, location: "Templo Todai-ji",
        render: () => `
            <p class="mission-desc">La arquitectura de este templo es colosal. Para entender su escala, debes medirlo con tu propio cuerpo.</p>
            <input type="number" id="i1" placeholder="¿Cuántos pilares exteriores hay?" style="width:100%; margin-bottom:10px;">
            <input type="number" id="i2" placeholder="¿Cuántas brazadas tuyas mide un pilar?" style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_5_kid14_suerte', {type:'text', data: `Pilares: ${document.getElementById('i1').value} | Brazadas: ${document.getElementById('i2').value}`})); }
    },
    "day_6_kid9_huida": {
        tag: "physical", day: 6, title: "La Huida del Ninja", role: "kid9", xp: 20, location: "Jardines del Castillo Nijo",
        render: () => `
            <p class="mission-desc">¡Debes escapar del palacio sin ser visto! Elige cómo has caminado por los jardines para no hacer ruido.</p>
            <div id="q1">
                <div class="choice-grid">
                    <button class="btn-secondary n-btn" data-v="Normal">Normal</button>
                    <button class="btn-secondary n-btn" data-v="De puntillas">De puntillas</button>
                    <button class="btn-secondary n-btn" data-v="Agachado">Agachado</button>
                </div>
            </div>
            <div id="q2" class="hidden">
                <p style="margin-top:15px;"><b>¿Cuál de esas posturas te ha cansado más?</b></p>
                <div class="choice-grid">
                    <button class="btn-secondary n-btn2" data-v="Normal">Normal</button>
                    <button class="btn-secondary n-btn2" data-v="De puntillas">De puntillas</button>
                    <button class="btn-secondary n-btn2" data-v="Agachado">Agachado</button>
                </div>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Huida</button>
        `,
        attachEvents: () => {
            let res1=''; let res2='';
            document.querySelectorAll('.n-btn').forEach(b => b.addEventListener('click', function() {
                res1 = this.dataset.v; document.getElementById('q2').classList.remove('hidden');
            }));
            document.querySelectorAll('.n-btn2').forEach(b => b.addEventListener('click', function() {
                res2 = this.dataset.v; document.getElementById('btn-sub').classList.remove('hidden');
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_6_kid9_huida', {type:'text', data: `Misión: ${res1} | Cansancio: ${res2}`}));
        }
    },
    "day_6_kid14_anillo": {
        tag: "physical", day: 6, title: "El Anillo Imperial", role: "kid14", xp: 20, location: "Palacio Imperial de Kioto",
        render: () => `
            <p class="mission-desc">Mide tu velocidad imperial. Cronometra cuánto tardas en dar 100 pasos exactos por el recinto del palacio.</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">00:00</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="c-start" class="btn-secondary">Iniciar</button>
                <button id="c-stop" class="btn-secondary">Parar</button>
            </div>
            <input type="number" id="i-calc" placeholder="¿Vueltas para una Maratón (42km)?" style="width:100%; margin-top:15px;">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Cálculo</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('c-start').addEventListener('click', () => { 
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('c-stop').addEventListener('click', () => { clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_6_kid14_anillo', {type:'text', data: `Tiempo 100p: ${document.getElementById('chrono').innerText} | Calc Maratón: ${document.getElementById('i-calc').value}`}));
        }
    },
    "day_7_kid9_pilar": {
        tag: "physical", day: 7, title: "El Guardián de Piedra", role: "kid9", xp: 15, location: "Templo Kiyomizu-dera",
        render: () => `
            <p class="mission-desc">Los pilares de madera de este templo son legendarios. Intenta abrazar uno de los pilares gigantes (o imagina que lo haces si hay mucha gente). ¿Llegan tus manos a tocarse?</p>
            <div class="choice-grid">
                <button class="btn-secondary p-btn" data-v="Toca">Mis dedos se tocan</button>
                <button class="btn-secondary p-btn" data-v="Casi">Casi se tocan</button>
                <button class="btn-secondary p-btn" data-v="Imposible">Necesito otros 2 brazos</button>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let val='';
            document.querySelectorAll('.p-btn').forEach(b => b.addEventListener('click', function() {
                val = this.dataset.v; document.getElementById('btn-sub').classList.remove('hidden');
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_7_kid9_pilar', {type:'text', data:val}));
        }
    },
    "day_7_kid14_escaleras": {
        tag: "physical", day: 7, title: "La Conquista de las Escaleras", role: "kid14", xp: 20, location: "Subida a Kiyomizu-dera",
        render: () => `
            <p class="mission-desc">Kioto está lleno de cuestas. Cuenta cuántos escalones subes desde la base de la calle Sannenzaka hasta la entrada del templo.</p>
            <input type="number" id="n-steps" placeholder="Número de escalones..." style="width:100%">
            <p id="bonus-msg" class="hidden" style="color:var(--color-primary); font-weight:bold; margin-top:10px;">✨ ¡Has alcanzado el rango de Monje Alpino! (+5 XP extra al validar)</p>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            const inp = document.getElementById('n-steps');
            const msg = document.getElementById('bonus-msg');
            inp.addEventListener('input', () => { if(inp.value >= 100) msg.classList.remove('hidden'); else msg.classList.add('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_7_kid14_escaleras', {type:'number', data:inp.value}));
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
    "day_6_kid14_ninja": {
        day: 6, title: "Plan de Infiltración Ninja", role: "kid14", xp: 15, location: "Castillo de Nijo",
        render: () => {
            return `
                <p class="mission-desc">¿Cómo entrarías al castillo sin que te oigan los "suelos cantores"? Escribe tu plan (2 frases).</p>
                <textarea id="ninja-plan" placeholder="Mi plan es..." style="width:100%; height:100px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Plan</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('ninja-plan').value;
                submitMission('day_6_kid14_ninja', { type: 'text', data: val });
            });
        }
    },
    "day_7_kid14_kitsune": {
        day: 7, title: "La Cacería de Kitsunes", role: "kid14", xp: 15, location: "Templos de Kioto",
        render: () => {
            return `
                <p class="mission-desc">Encuentra 3 estatuas de zorros (Kitsune) diferentes.</p>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                    <div id="k1" class="coin-slot">🦊</div>
                    <div id="k2" class="coin-slot">🦊</div>
                    <div id="k3" class="coin-slot">🦊</div>
                </div>
                <button id="btn-kitsune" class="btn-primary" style="width:100%; margin-top:15px;">Marcar Zorro</button>
            `;
        },
        attachEvents: () => {
            let count = 0;
            document.getElementById('btn-kitsune').addEventListener('click', () => {
                count++; if(count<=3) document.getElementById('k'+count).style.background="var(--color-primary)";
                if(count>=3) setTimeout(() => submitMission('day_7_kid14_kitsune', { type: 'text', data: '3 Kitsunes encontrados' }), 1000);
            });
        }
    },
    "day_8_kid14_arashiyama": {
        day: 8, title: "El Guardián del Bambú", role: "kid14", xp: 15, location: "Arashiyama Bamboo Grove",
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
                    audioBlob = new Blob(chunks, { type: 'audio/webm' });
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
        day: 11, title: "El Código Onsen", role: "kid9", xp: 15, location: "Kazeya Ryokan",
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
        day: 11, title: "Catador de Kaiseki", role: "kid14", xp: 20, location: "Kazeya Ryokan",
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
        day: 11, title: "El Equilibrio del Yukata", role: "both", xp: 20, location: "Ryokan / Pueblo",
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
        day: 12, title: "La Bola de Cedro", role: "kid9", xp: 15, location: "Takayama",
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
        day: 12, title: "Talla en Madera (G)", role: "kid14", xp: 25, location: "Takayama",
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
            const getPos = (e) => { const rect = canvas.getBoundingClientRect(); const cx = e.touches ? e.touches[0].clientX : e.clientX; const cy = e.touches ? e.touches[0].clientY : e.clientY; return { x: cx - rect.left, y: cy - rect.top }; };
            const start = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
            const draw = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
            canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw); window.addEventListener('mouseup', () => drawing=false);
            canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }); canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }); canvas.addEventListener('touchend', () => drawing=false);
            document.getElementById('btn-clear').addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_12_kid14_madera', {type:'text', data:'Talla digital'}));
        }
    },
    "day_12_fam_patrulla": {
        day: 12, title: "Patrulla del Casco Antiguo", role: "both", xp: 15, location: "Sanmachi Suji",
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
        day: 13, title: "La Escalada Chureito", role: "both", xp: 20, location: "Pagoda Chureito",
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
        day: 13, title: "Perspectiva del Gigante", role: "kid14", xp: 20, location: "Lago Kawaguchiko",
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
        day: 13, title: "Navegantes del Asfalto", role: "both", xp: 15, location: "Coche",
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
        day: 14, title: "Aliento de Volcán", role: "kid9", xp: 15, location: "Monte Fuji",
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
        day: 14, title: "La Ley de la Presión", role: "kid14", xp: 20, location: "Monte Fuji",
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
        day: 14, title: "Oxígeno Alpino", role: "both", xp: 20, location: "5ª Estación Fuji",
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
        day: 15, title: "Melodía de Shiraito", role: "kid9", xp: 20, location: "Cascada / Bosque",
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
        day: 15, title: "Brújula al Cráter", role: "kid14", xp: 25, location: "Lagos del Fuji",
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
        day: 16, title: "El Gato Oculto", role: "kid9", xp: 15, location: "Kagurazaka (Tokio)",
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
        day: 16, title: "Vórtice Temporal", role: "kid14", xp: 20, location: "Tokio",
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
        day: 16, title: "Supervivencia Shinjuku", role: "both", xp: 25, location: "Estación Shinjuku",
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
        day: 17, title: "Destino Omikuji", role: "kid9", xp: 15, location: "Templo Senso-ji",
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
        day: 17, title: "Arqueología Gamer", role: "kid14", xp: 20, location: "Akihabara",
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
        day: 17, title: "Cervicales de Acero", role: "both", xp: 20, location: "Skytree",
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
        day: 18, title: "La Marea Humana", role: "kid9", xp: 20, location: "Cruce de Shibuya",
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
        day: 18, title: "Cazatendencias", role: "kid14", xp: 15, location: "Takeshita Street",
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
        day: 19, title: "Piloto de Mechas", role: "kid9", xp: 20, location: "Odaiba",
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
        day: 19, title: "Cazador de Luz (G)", role: "kid14", xp: 25, location: "TeamLab Planets",
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
        day: 20, title: "Maestro del Bento (G)", role: "kid9", xp: 25, location: "Ueno / Yanaka",
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
        day: 20, title: "Regateo en Ameyoko", role: "kid14", xp: 20, location: "Mercado Ameyoko",
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
        day: 21, title: "Los Tres Monos", role: "kid9", xp: 15, location: "Nikko o Kamakura",
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
        day: 21, title: "Ingeniero Imperial", role: "kid14", xp: 20, location: "Excursión Histórica",
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
        day: 22, title: "Grito de Pescadero", role: "kid9", xp: 20, location: "Mercado Toyosu",
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
        day: 22, title: "La Joya de Ginza", role: "kid14", xp: 15, location: "Ginza",
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
        day: 23, title: "Buscador de KitKat", role: "kid9", xp: 15, location: "Don Quijote",
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
        day: 14, title: "Tetris de Maletas (G)", role: "kid14", xp: 25, location: "Hotel / Despedida",
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
        day: 24, title: "Sayonara Japón", role: "both", xp: 50, location: "Aeropuerto",
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
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

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
                        audio: { echoCancellation: true, noiseSuppression: true }
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
            const TARGET = { lat: 35.3789, lon: 138.7318 };
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
                    enableHighAccuracy: true,
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
                        typewrite(out, '>>> ' + plaintext, 'gold', () => {
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
                f.forEach((span, i) => {
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
    "day_5_kid9_dance": {
        tag: "expert", day: 5, title: "La Danza de la Cinta", role: "kid9", xp: 30, location: "Nara",
        render: () => `
            <div class="ui-kids">
                <p class="mission-desc" style="color: #fff;">¡Hipnotiza al ciervo! Mueve el móvil haciendo círculos suaves en el aire.</p>
                <div style="position: relative; width: 250px; height: 250px; margin: 0 auto; background: #000; border: 4px solid #f1c40f; border-radius: 50%; overflow: hidden;">
                    <canvas id="dance-canvas" width="250" height="250"></canvas>
                    <div id="deer-emoji" style="position: absolute; top: 10px; right: 20px; font-size: 3rem; transition: transform 0.3s;">🦌</div>
                </div>
                <div id="dance-timer" style="text-align: center; color: #fff; font-size: 1.5rem; margin-top: 10px;">10</div>
                <button id="btn-start" class="btn-secondary" style="width: 100%; margin-top: 15px;">Permitir Sensores y Empezar</button>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const btnS = document.getElementById('btn-start');
            const btnSub = document.getElementById('btn-submit');
            const canvas = document.getElementById('dance-canvas');
            const ctx = canvas.getContext('2d');
            const timerEl = document.getElementById('dance-timer');
            const deer = document.getElementById('deer-emoji');
            
            let active = false;
            let time = 10;
            let lastX = 125, lastY = 125;
            let visitedCells = new Set();
            let hue = 0;
            let handler = null;
            let timerInt = null;

            const handleOrientation = (e) => {
                if(!active) return;
                // Usar beta (adelante/atrás -180 a 180) y gamma (izq/der -90 a 90)
                let b = e.beta || 0;
                let g = e.gamma || 0;
                
                // Mapeo
                let x = ((g + 90) / 180) * 250;
                let y = ((b + 180) / 360) * 250;
                
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.lineWidth = 4;
                ctx.stroke();
                
                lastX = x; lastY = y;
                hue = (hue + 5) % 360;

                // Grid 5x5
                let cellX = Math.floor(x / 50);
                let cellY = Math.floor(y / 50);
                visitedCells.add(`${cellX},${cellY}`);
            };

            const win = () => {
                active = false;
                clearInterval(timerInt);
                window.removeEventListener('deviceorientation', handler);
                deer.innerText = '🦌✨';
                deer.style.transform = 'scale(1.5)';
                showAlert("¡ÉXITO!", "¡Ciervo hipnotizado!");
                btnSub.classList.remove('hidden');
                
                for(let i=0; i<30; i++) {
                    ctx.fillStyle = 'gold';
                    ctx.beginPath();
                    ctx.arc(Math.random()*250, Math.random()*250, 2, 0, Math.PI*2);
                    ctx.fill();
                }
            };

            const start = () => {
                btnS.style.display = 'none';
                active = true;
                ctx.clearRect(0,0,250,250);
                visitedCells.clear();
                time = 10;
                deer.innerText = '🦌';
                deer.style.transform = 'scale(1)';
                
                handler = handleOrientation;
                window.addEventListener('deviceorientation', handler);
                
                timerInt = setInterval(() => {
                    time--;
                    timerEl.innerText = time;
                    if(visitedCells.size >= 15) {
                        win();
                    } else if(time <= 0) {
                        active = false;
                        clearInterval(timerInt);
                        window.removeEventListener('deviceorientation', handler);
                        deer.innerText = '🦌💤';
                        btnS.style.display = 'block';
                        btnS.innerText = "Despertó. ¡Reintentar!";
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

            btnSub.addEventListener('click', () => submitMission('day_5_kid9_dance', {type: 'expert', data: 'Danza completada. Celdas: ' + visitedCells.size}));
            window._missionCleanup = () => { active=false; clearInterval(timerInt); if(handler) window.removeEventListener('deviceorientation', handler); };
        }
    },
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
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
    "day_3_kid14_vital": {
        tag: "expert", day: 3, title: "Visión de Flujo Vital", role: "kid14", xp: 30, location: "Dotonbori",
        render: () => `
            <div class="ui-terminal">
                <p class="mission-desc">>>> Escaneando flujo de energía... Apunta a los neones rojos/amarillos.</p>
                <div style="position: relative; width: 100%; aspect-ratio: 4/3; background: #000; border: 2px solid #0f0; margin-bottom: 15px;">
                    <video id="vital-video" playsinline autoplay muted style="display: none;"></video>
                    <canvas id="vital-canvas" style="width: 100%; height: 100%;"></canvas>
                </div>
                <div style="color: #0f0; font-family: monospace;">ENERGÍA VITAL: <span id="vital-pct">0</span>%</div>
                <div style="width: 100%; height: 15px; border: 1px solid #0f0; margin: 10px 0;">
                    <div id="vital-bar" style="width: 0%; height: 100%; background: #0f0; transition: width 0.1s;"></div>
                </div>
                <button id="btn-start" class="btn-secondary" style="width: 100%; margin-bottom: 15px;">Activar Escáner</button>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const btnS = document.getElementById('btn-start');
            const btnSub = document.getElementById('btn-submit');
            const video = document.getElementById('vital-video');
            const canvas = document.getElementById('vital-canvas');
            const ctx = canvas.getContext('2d');
            const pctEl = document.getElementById('vital-pct');
            const bar = document.getElementById('vital-bar');
            
            let streamRef = null;
            let active = false;
            let chargeFrames = 0;

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
                    
                    video.onloadedmetadata = () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        active = true;
                        
                        const loop = () => {
                            if(!active) return;
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            let d = frame.data;
                            let hit = 0;
                            
                            for(let i=0; i<d.length; i+=4) {
                                let r = d[i], g = d[i+1], b = d[i+2];
                                let lum = (r+g+b)/3;
                                if (lum > 150 && (r > 180 || (r+g-b) > 200)) {
                                    d[i] = 0; d[i+1] = 255; d[i+2] = 80; // Verde esmeralda
                                    hit++;
                                }
                            }
                            ctx.putImageData(frame, 0, 0);
                            
                            let pct = (hit / (canvas.width * canvas.height)) * 100;
                            pctEl.innerText = pct.toFixed(1);
                            
                            if (pct > 10) {
                                chargeFrames++;
                                bar.style.width = Math.min(100, (chargeFrames / 60) * 100) + '%';
                                if (chargeFrames >= 120) { // 2 sec at 60fps
                                    stopVideo();
                                    showAlert("CARGA COMPLETA", ">>> ENERGÍA EXTRAÍDA. Sistema cargado.");
                                    btnSub.classList.remove('hidden');
                                    bar.style.width = '100%';
                                    return; // stop loop
                                }
                            } else {
                                chargeFrames = Math.max(0, chargeFrames - 1);
                                bar.style.width = Math.min(100, (chargeFrames / 60) * 100) + '%';
                            }
                            
                            requestAnimationFrame(loop);
                        };
                        loop();
                    };
                }).catch(() => showAlert("Error", "Cámara no accesible."));
            });

            btnSub.addEventListener('click', () => submitMission('day_3_kid14_vital', {type: 'expert', data: 'Flujo vital extraído'}));
            window._missionCleanup = () => stopVideo();
        }
    },
    "day_7_kid14_sync": {
        tag: "expert", day: 7, title: "Sincronización de la Atalaya", role: "kid14", xp: 30, location: "Kiyomizu-dera",
        render: () => `
            <div class="ui-terminal">
                <p class="mission-desc">>>> OBJETIVO: BALCÓN DE KIYOMIZU. Distancia: <span id="dist">Calculando...</span>m</p>
                <div style="background: rgba(0,255,0,0.1); border: 1px solid #0f0; padding: 15px; margin-bottom: 15px;">
                    <div id="sync-msg">>>> Muévete al objetivo.</div>
                    <div id="sync-prog" style="color: #0f0; font-weight: bold; margin-top: 10px;"></div>
                </div>
                <button id="btn-sync" class="btn-primary hidden" style="width: 100%;">Iniciar Sincronización</button>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            const distEl = document.getElementById('dist');
            const btnSync = document.getElementById('btn-sync');
            const btnSub = document.getElementById('btn-submit');
            const msg = document.getElementById('sync-msg');
            const prog = document.getElementById('sync-prog');
            
            const target = { lat: 34.9948, lon: 135.7847 };
            let watchId = null;
            let currentDist = 99999;
            let syncTimer = null;

            // Haversine
            const getDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371e3;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                return R * c;
            };

            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition((pos) => {
                    currentDist = getDistance(pos.coords.latitude, pos.coords.longitude, target.lat, target.lon);
                    distEl.innerText = Math.round(currentDist);
                    if (currentDist <= 20 && btnSync.dataset.done !== 'true') {
                        btnSync.classList.remove('hidden');
                        msg.innerText = ">>> OBJETIVO ALCANZADO. Listo para sincronizar.";
                    } else if (currentDist > 20) {
                        btnSync.classList.add('hidden');
                        msg.innerText = ">>> Lejos del objetivo.";
                        if(syncTimer) {
                            clearInterval(syncTimer); syncTimer = null;
                            prog.innerText = ">>> Sincronización perdida por distancia.";
                        }
                    }
                }, (err) => {
                    distEl.innerText = "ERROR GEO";
                    // Fallback para testing
                    btnSync.classList.remove('hidden'); 
                    msg.innerText = ">>> Error de señal. Sincronización manual permitida.";
                }, { enableHighAccuracy: true });
            }

            btnSync.addEventListener('click', () => {
                btnSync.style.display = 'none';
                let time = 8;
                prog.innerText = `Sincronizando... ${time}s`;
                syncTimer = setInterval(() => {
                    time--;
                    prog.innerText = `Sincronizando... ${time}s`;
                    if(time <= 0) {
                        clearInterval(syncTimer);
                        btnSync.dataset.done = 'true';
                        if(watchId) navigator.geolocation.clearWatch(watchId);
                        msg.innerText = ">>> ATALAYA SINCRONIZADA. Coordenadas fijadas.";
                        prog.innerText = "";
                        btnSub.classList.remove('hidden');
                    }
                }, 1000);
            });

            btnSub.addEventListener('click', () => submitMission('day_7_kid14_sync', {type: 'expert', data: 'Sincronizado a ' + Math.round(currentDist) + 'm'}));
            window._missionCleanup = () => { if(watchId) navigator.geolocation.clearWatch(watchId); clearInterval(syncTimer); };
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
};