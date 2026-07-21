// Auto-generated block of missions
if (typeof MISSIONS_CONFIG === 'undefined') {
    var MISSIONS_CONFIG = {};
}

Object.assign(MISSIONS_CONFIG, {
"day_17_omikuji": {
        tag: "expert",
        day: 17,
        title: "Destino Omikuji",
        role: "kid9",
        xp: 15,
        location: "Senso-ji",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fffde7 0%, #fff9c4 100%); border-radius:15px; border:3px solid #fbc02d; color:#f57f17; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🏮 Oráculo Omikuji 🏮</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#f9a825;">Agita la caja de bambú sagrada (o pulsa el botón) para revelar tu destino de la suerte en Senso-ji:</p>
                
                <div id="shaking-cup" style="font-size:4rem; margin:15px auto; width:100px; height:100px; display:flex; align-items:center; justify-content:center; transition: transform 0.1s;">🎋</div>
                <div id="omikuji-result" style="display:none; font-size:1.8rem; font-weight:bold; color:#d84315; margin:15px 0;"></div>
                <div id="omikuji-description" style="display:none; font-size:0.85rem; color:#f57f17; margin-bottom:15px;"></div>
                
                <div id="tie-area" style="display:none; background:#fff; border-radius:10px; padding:12px; border:2px dashed #d84315; margin-bottom:15px;">
                    <p style="font-size:0.8rem; color:#d84315; font-weight:bold; margin-bottom:8px;">🏮 ¡MALA SUERTE DETECTADA! 🏮</p>
                    <p style="font-size:0.75rem; color:#888; margin-bottom:8px;">Para no llevarte el mal augurio a casa, dibuja un lazo protector en el lienzo para atarlo al poste del templo:</p>
                    <canvas id="tie-canvas" width="200" height="100" style="width:200px; height:100px; border:1px solid #ffab91; background:#fff5f2; border-radius:6px; touch-action:none; display:block; margin:0 auto;"></canvas>
                </div>
                
                <button id="btn-shake" class="btn-primary" style="width:100%; border-radius:25px; background:#fbc02d; border-color:#fbc02d; color:#fff; font-weight:bold;">⚡ AGITAR CAJA</button>
                <button id="btn-submit-omikuji" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#ccc; border-color:#ccc; color:#666; font-weight:bold;" disabled>📨 Registrar Destino</button>
            </div>
        `,
        attachEvents: (role) => {
            const cup = document.getElementById('shaking-cup');
            const resultEl = document.getElementById('omikuji-result');
            const descEl = document.getElementById('omikuji-description');
            const tieArea = document.getElementById('tie-area');
            const shakeBtn = document.getElementById('btn-shake');
            const submitBtn = document.getElementById('btn-submit-omikuji');
            const canvas = document.getElementById('tie-canvas');
            
            let shaking = false;
            let result = '';
            let motionRegistered = false;
            
            const outcomes = [
                { res: 'Buena Suerte', msg: '🌟 ¡Gran Fortuna! La suerte te sonríe en tu viaje por Japón.' },
                { res: 'Suerte Regular', msg: '😐 Suerte Moderada. Todo marchará sobre ruedas si eres precavida.' },
                { res: 'Mala Suerte', msg: '💀 Mala Suerte. ¡Peligro! Debes atar este papel en el poste sagrado del templo.' }
            ];
            
            const handleMotion = (e) => {
                if (shaking || result) return;
                const acc = e.acceleration || {x:0, y:0, z:0};
                const totalAcc = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
                if (totalAcc > 12) {
                    motionRegistered = true;
                    startShake();
                }
            };
            
            const startShake = () => {
                if (shaking) return;
                shaking = true;
                shakeBtn.setAttribute('disabled', 'true');
                shakeBtn.innerText = '⏳ Agitando...';
                
                if (window.playProceduralSound) playProceduralSound('click');
                
                // Add CSS shake animation
                cup.style.animation = 'shake 0.5s infinite';
                const styleSheet = document.createElement("style");
                styleSheet.innerText = `@keyframes shake { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 10%, 30%, 50%, 70%, 90% { transform: translate(-5px, 2px) rotate(-8deg); } 20%, 40%, 60%, 80% { transform: translate(5px, -2px) rotate(8deg); } }`;
                document.head.appendChild(styleSheet);
                
                setTimeout(() => {
                    cup.style.animation = '';
                    shaking = false;
                    
                    const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
                    result = pick.res;
                    
                    resultEl.innerText = (result === 'Buena Suerte' ? '🌟 ' : result === 'Suerte Regular' ? '😐 ' : '💀 ') + result;
                    resultEl.style.display = 'block';
                    descEl.innerText = pick.msg;
                    descEl.style.display = 'block';
                    shakeBtn.classList.add('hidden');
                    
                    if (result === 'Mala Suerte') {
                        if (window.playProceduralSound) playProceduralSound('error');
                        tieArea.style.display = 'block';
                        initTieCanvas();
                    } else {
                        if (window.playProceduralSound) playProceduralSound('success');
                        enableSubmit();
                    }
                }, 2000);
            };
            
            const enableSubmit = () => {
                submitBtn.classList.remove('hidden');
                submitBtn.removeAttribute('disabled');
                submitBtn.style.background = '#fbc02d';
                submitBtn.style.borderColor = '#fbc02d';
                submitBtn.style.color = '#fff';
            };
            
            const initTieCanvas = () => {
                const ctx = canvas.getContext('2d');
                ctx.strokeStyle = '#d84315';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                
                let drawing = false;
                let points = 0;
                
                const getPos = (e) => {
                    const rect = canvas.getBoundingClientRect();
                    const cx = e.touches ? e.touches[0].clientX : e.clientX;
                    const cy = e.touches ? e.touches[0].clientY : e.clientY;
                    return { x: cx - rect.left, y: cy - rect.top };
                };
                
                const start = (e) => {
                    drawing = true;
                    const p = getPos(e);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                };
                
                const draw = (e) => {
                    if (!drawing) return;
                    e.preventDefault();
                    const p = getPos(e);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                    points++;
                    if (points >= 12) {
                        enableSubmit();
                        tieArea.style.background = '#e8f5e9';
                        tieArea.style.borderColor = '#2e7d32';
                        document.querySelector('#tie-area p').innerText = '✓ ¡Destino atado y purificado!';
                        document.querySelector('#tie-area p').style.color = '#2e7d32';
                    }
                };
                
                const stop = () => { drawing = false; };
                
                canvas.addEventListener('mousedown', start);
                canvas.addEventListener('mousemove', draw);
                canvas.addEventListener('mouseup', stop);
                canvas.addEventListener('touchstart', start, { passive: false });
                canvas.addEventListener('touchmove', draw, { passive: false });
                canvas.addEventListener('touchend', stop);
            };
            
            shakeBtn.addEventListener('click', startShake);
            
            if (typeof DeviceMotionEvent !== 'undefined') {
                window.addEventListener('devicemotion', handleMotion);
            }
            
            submitBtn.addEventListener('click', () => {
                if (!result) return;
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_17_omikuji', { type: 'text', data: `Destino Omikuji: ${result}` }, role);
            });
            
            window._missionCleanup = () => {
                window.removeEventListener('devicemotion', handleMotion);
            };
        }
    },

"day_17_incense": {
        tag: "photo", day: 17, title: "Humo de la Fortuna", role: "kid9", xp: 15, location: "Senso-ji",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">💨 En Senso-ji hay un enorme incensario del que sale humo sagrado. Los japoneses se lo echan por encima para atraer la suerte. ¡Haz lo mismo y captura el momento!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#2c2c2c,#555,#888); border-radius:15px;">
            <p style="font-size:3rem;">🏯💨✨</p>
            <p style="color:#ddd; font-style:italic;">El humo que trae buena suerte</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar el Humo Sagrado</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_17_incense', currentUser, false); }
    },

"day_17_gashapon": {
        tag: "photo", day: 17, title: "Gashapon Perfecto", role: "kid9", xp: 15, location: "Akihabara",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🎰 Los gashapon son máquinas de cápsulas sorpresa que están POR TODAS PARTES en Japón. Encuentra la máquina más rara o la cápsula más extraña y fotografíala.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#ff1493,#ff69b4,#ffb6c1); border-radius:15px;">
            <p style="font-size:3rem;">🎰🔮🎁</p>
            <p style="color:#fff; font-weight:bold;">¿Qué misterio esconde la cápsula?</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Gashapon</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_17_gashapon', currentUser, false); }
    },
    "day_17_p2p_receiver": {
        tag: "expert",
        day: 17,
        title: "Sincronización P2P (Receptor)",
        role: "kid9",
        xp: 25,
        location: "Akihabara",
        render: () => `
            <div class="ui-terminal" style="padding:20px; border-radius:12px; font-family:monospace; background:#0a0e12; border:1px solid #ffd700; color:#ffd700; box-shadow:0 4px 15px rgba(255,215,0,0.15); line-height:1.5;">
                <p>>>> RECEPTORA P2P: PANEL DE CONEXIÓN</p>
                <p style="color:#aaa; font-size:0.85rem; margin-bottom:15px;">Pídele a Iván que te dicte el orden de conexión secreto (secuencia de 4 colores). Pulsa los botones en ese orden exacto para alinear la señal:</p>
                
                <div style="background:#111b24; padding:15px; border-radius:10px; border:1px dashed #ffd700; margin-bottom:15px; text-align:center;">
                    <p style="margin:0 0 10px 0; font-size:0.8rem; color:#aaa;">PUERTOS DE RED CONECTADOS:</p>
                    <div style="display:flex; justify-content:center; gap:8px; margin-bottom:15px;">
                        <div id="p2p-port-0" style="width:40px; height:40px; border:2px solid #555; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.8rem; background:#222; color:#aaa;">P1</div>
                        <div id="p2p-port-1" style="width:40px; height:40px; border:2px solid #555; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.8rem; background:#222; color:#aaa;">P2</div>
                        <div id="p2p-port-2" style="width:40px; height:40px; border:2px solid #555; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.8rem; background:#222; color:#aaa;">P3</div>
                        <div id="p2p-port-3" style="width:40px; height:40px; border:2px solid #555; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.8rem; background:#222; color:#aaa;">P4</div>
                    </div>
                    
                    <p style="margin:0 0 10px 0; font-size:0.8rem; color:#aaa;">SELECCIONA COLORES DE RED:</p>
                    <div style="display:flex; justify-content:center; gap:10px;">
                        <button class="p2p-btn-color" data-color="amarillo" style="width:45px; height:45px; border-radius:8px; background:#ffd700; border:none; cursor:pointer; font-weight:bold; box-shadow:0 3px 6px rgba(0,0,0,0.3);"></button>
                        <button class="p2p-btn-color" data-color="azul" style="width:45px; height:45px; border-radius:8px; background:#00e5ff; border:none; cursor:pointer; font-weight:bold; box-shadow:0 3px 6px rgba(0,0,0,0.3);"></button>
                        <button class="p2p-btn-color" data-color="rojo" style="width:45px; height:45px; border-radius:8px; background:#ff4081; border:none; cursor:pointer; font-weight:bold; box-shadow:0 3px 6px rgba(0,0,0,0.3);"></button>
                        <button class="p2p-btn-color" data-color="verde" style="width:45px; height:45px; border-radius:8px; background:#00ff99; border:none; cursor:pointer; font-weight:bold; box-shadow:0 3px 6px rgba(0,0,0,0.3);"></button>
                    </div>
                    <button id="p2p-reset" style="margin-top:15px; background:transparent; border:1px solid #ff4081; color:#ff4081; border-radius:15px; padding:3px 12px; font-size:0.75rem; font-family:monospace; cursor:pointer;">🧹 Reiniciar Puertos</button>
                </div>
                
                <button id="btn-p2p-receiver-submit" class="btn-primary hidden" style="width:100%; border-color:#ffd700; color:#ffd700; background:transparent; font-family:monospace; font-family:'Quicksand', sans-serif;">🔌 TRANSMITIR DATOS SINCRO</button>
            </div>
        `,
        attachEvents: (role) => {
            const ports = [
                document.getElementById('p2p-port-0'),
                document.getElementById('p2p-port-1'),
                document.getElementById('p2p-port-2'),
                document.getElementById('p2p-port-3')
            ];
            const colorBtns = document.querySelectorAll('.p2p-btn-color');
            const resetBtn = document.getElementById('p2p-reset');
            const submitBtn = document.getElementById('btn-p2p-receiver-submit');
            
            const correctSequence = ['amarillo', 'azul', 'rojo', 'verde'];
            let userSequence = [];
            
            const colorHex = {
                amarillo: '#ffd700',
                azul: '#00e5ff',
                rojo: '#ff4081',
                verde: '#00ff99'
            };
            
            const resetSequence = () => {
                userSequence = [];
                ports.forEach((p, idx) => {
                    p.innerText = 'P' + (idx + 1);
                    p.style.background = '#222';
                    p.style.borderColor = '#555';
                    p.style.color = '#aaa';
                });
                submitBtn.classList.add('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
            };
            
            colorBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (userSequence.length >= 4) return;
                    const color = this.dataset.color;
                    userSequence.push(color);
                    
                    const currentIdx = userSequence.length - 1;
                    const port = ports[currentIdx];
                    port.innerText = '🔌';
                    port.style.background = colorHex[color];
                    port.style.borderColor = colorHex[color];
                    port.style.color = '#000';
                    
                    if (window.playProceduralSound) playProceduralSound('click');
                    
                    if (userSequence.length === 4) {
                        let win = true;
                        for (let i = 0; i < 4; i++) {
                            if (userSequence[i] !== correctSequence[i]) {
                                win = false;
                                break;
                            }
                        }
                        
                        if (win) {
                            submitBtn.classList.remove('hidden');
                            if (window.playProceduralSound) playProceduralSound('success');
                            if (window.launchConfetti) launchConfetti();
                        } else {
                            if (window.playProceduralSound) playProceduralSound('error');
                            showAlert('SEÑAL INCORRECTA', 'Los cables no están en los puertos indicados. La señal se ha perdido. ¡Sincronízate con Iván y reinicia el panel!');
                        }
                    }
                });
            });
            
            resetBtn.addEventListener('click', resetSequence);
            
            submitBtn.addEventListener('click', () => {
                submitMission('day_17_p2p_receiver', {type:'game', data:'P2P Sincronizado correctamente con Iván (Amarillo, Azul, Rojo, Verde)'}, role);
            });
        }
    },

"day_17_retro": {
        tag: "economy",
        day: 17,
        title: "Arqueología Gamer",
        role: "kid14",
        xp: 20,
        location: "Akihabara",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> BUSCANDO JUEGO RETRO EN SUPER POTATO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:12px;">Encuentra un juego retro en la mítica tienda Super Potato. Introduce su nombre y precio en yenes para calcular su tasación en euros (rango realista: ¥200 - ¥90.000):</p>
                
                <div style="margin-bottom:10px;">
                    <label style="font-size:0.75rem; color:#aaa; display:block; margin-bottom:4px;">NOMBRE DEL JUEGO:</label>
                    <input type="text" id="r-game" placeholder="Ej: Super Mario Bros..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:4px; font-family:inherit; box-sizing:border-box;">
                </div>
                
                <div style="margin-bottom:15px;">
                    <label style="font-size:0.75rem; color:#aaa; display:block; margin-bottom:4px;">PRECIO EN YENES (¥):</label>
                    <input type="number" id="r-yen" placeholder="Ej: 3200..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:4px; font-family:inherit; box-sizing:border-box;">
                </div>
                
                <button id="btn-calc" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>Convertir a Euros</button>
                
                <div id="r-res" style="color:#ffd700; margin:15px 0 0 0; font-weight:bold; font-size:1.1rem; text-align:center;"></div>
                <button id="btn" class="btn-primary hidden" style="width:100%; margin-top:10px; border-color:#00ff99; color:#111; background:#00ff99;">Enviar tasación</button>
            </div>
        `,
        attachEvents: (role) => {
            const gameInput = document.getElementById('r-game');
            const yenInput = document.getElementById('r-yen');
            const calcBtn = document.getElementById('btn-calc');
            const resEl = document.getElementById('r-res');
            const submitBtn = document.getElementById('btn');
            
            let eur = 0;
            
            const checkInputs = () => {
                const name = gameInput.value.trim();
                const yen = parseInt(yenInput.value);
                if (name.length >= 3 && !isNaN(yen) && yen > 0) {
                    calcBtn.removeAttribute('disabled');
                    calcBtn.style.borderColor = '#00ff99';
                    calcBtn.style.color = '#00ff99';
                } else {
                    calcBtn.setAttribute('disabled', 'true');
                    calcBtn.style.borderColor = '#555';
                    calcBtn.style.color = '#555';
                }
            };
            
            gameInput.addEventListener('input', checkInputs);
            yenInput.addEventListener('input', checkInputs);
            
            calcBtn.addEventListener('click', () => {
                const name = gameInput.value.trim();
                const yen = parseInt(yenInput.value);
                if (name.length < 3 || isNaN(yen) || yen < 200 || yen > 90000) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('RANGO FUERA DE LÍMITES', 'El precio indicado en yenes debe estar entre ¥200 y ¥90.000 para ser un juego coleccionable realista de Super Potato.');
                    return;
                }
                
                eur = (yen / 160).toFixed(2);
                resEl.innerText = `Aprox: ${eur} € (Cambio: 160 JPY/EUR)`;
                submitBtn.classList.remove('hidden');
                if (window.playProceduralSound) playProceduralSound('success');
            });
            
            submitBtn.addEventListener('click', () => {
                const name = gameInput.value.trim();
                const yen = parseInt(yenInput.value);
                submitMission('day_17_retro', {
                    type: 'text',
                    data: `Juego: ${name}. Precio: ${yen}¥ (${eur}€)`
                }, role);
            });
        }
    },

"day_17_skytree": {
        tag: "sensors",
        day: 17,
        title: "Cervicales de Acero",
        role: "kid14",
        xp: 20,
        location: "Skytree",
        render: () => `
        <div class="ui-terminal" style="padding:15px; border-radius:8px;">
            <p>>>> APUNTANDO A LA CIMA (60s). Mantén el móvil hacia arriba.</p>
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
                if(!int) int = setInterval(()=>{ progress += 100 / 60; bar.style.width = Math.min(100, progress)+'%'; if(progress>=100) { active=false; clearInterval(int); btn.classList.remove('hidden'); btnS.classList.add('hidden'); window.removeEventListener('deviceorientation', handleOri); } }, 1000);
            } else { if(int) { clearInterval(int); int=null; } }
        };
        btnS.addEventListener('click', () => {
            active = true; btnS.innerText = "Apuntando...";
            if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(r => {
                        if(r === 'granted') {
                            window.addEventListener('deviceorientation', handleOri);
                        } else {
                            showAlert('Permiso Denegado', 'Esta misión requiere acceso a los sensores de movimiento. Por favor, habilítalos en los ajustes de tu dispositivo.');
                            btnS.innerText = "Reintentar sensor";
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        showAlert('Error', 'No se pudo activar el sensor de movimiento.');
                        btnS.innerText = "Reintentar sensor";
                    });
            } else { window.addEventListener('deviceorientation', handleOri); }
        });
        btn.addEventListener('click', () => submitMission('day_17_skytree', {type:'game', data:'60s apuntando a Skytree'}));
        window._missionCleanup = () => { active=false; clearInterval(int); window.removeEventListener('deviceorientation', handleOri); };
    }
    },

"day_17_p2p_sender": {
        tag: "expert",
        day: 17,
        title: "Sincronización P2P (Emisor)",
        role: "kid14",
        xp: 25,
        location: "Akihabara",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; font-family:monospace; background:#0a0e12; border:1px solid #00e5ff; color:#00e5ff; box-shadow:0 4px 15px rgba(0,229,255,0.15); line-height:1.5;">
            <p>>>> EMISOR P2P: CENTRALITA DE DATOS</p>
            <p style="color:#aaa; font-size:0.85rem;">Calcula la suma total del presupuesto retro de Akihabara para desencriptar la señal de la centralita:</p>
            <p style="font-weight:bold; color:#ffeb3b; text-align:center; margin:10px 0;">Famicom (14.800¥) + Neo Geo (58.000¥) = ?</p>
            <input type="number" id="p2p-ans" style="width:100%; background:#111; color:#00e5ff; border:1px solid #00e5ff; padding:10px; border-radius:6px; font-family:monospace; font-size:1.2rem; text-align:center; box-sizing:border-box; margin-bottom:15px;" placeholder="Suma total en Yenes...">
            <button id="btn-calc" class="btn-secondary" style="width:100%; border-color:#00e5ff; color:#00e5ff; background:transparent;">🔓 DESENCRIPTAR CENTRALITA</button>
            
            <div id="code-area" class="hidden" style="margin-top:20px; background:#111b24; padding:15px; border-radius:8px; border:1px solid #ffeb3b; text-align:center;">
                <p style="color:#ffeb3b; font-weight:bold; margin-bottom:5px;">⚡ CENTRALITA DESBLOQUEADA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Actuarás como el descifrador. Deberás ver las reglas en tu panel (izquierda del Canvas) y dictar el orden correcto a Laura (derecha del Canvas) para conectar los cables de red.</p>
                <button id="btn" class="btn-primary" style="width:100%;">🎮 ABRIR CENTRALITA COOPERATIVA</button>
            </div>
        </div>
    `,
        attachEvents: () => {
        document.getElementById('btn-calc').addEventListener('click', () => {
            if(document.getElementById('p2p-ans').value == 72800) { 
                document.getElementById('code-area').classList.remove('hidden'); 
                document.getElementById('btn-calc').classList.add('hidden'); 
                if (window.playProceduralSound) playProceduralSound('success');
            } else { 
                if (window.playProceduralSound) playProceduralSound('error');
                showAlert('Error', 'Suma incorrecta. Vuelve a calcular.'); 
            }
        });
        document.getElementById('btn').addEventListener('click', () => {
            submitMission('day_17_p2p_sender', {type:'game', data:'Código enviado a receptora'});
        });
    }
    },

    "day_17_height": {
        tag: "economy",
        day: 17,
        title: "Altura del Cielo",
        role: "kid14",
        xp: 15,
        location: "Skytree",
        render: () => `
            <div class="ui-terminal" style="padding:20px; border-radius:12px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> DETECTOR DE ALTURA SKYLINE: TOKYO SKYTREE</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Ingresa la altura exacta en metros de la torre de telecomunicaciones más alta del mundo para calibrar los sensores.</p>
                
                <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #333; margin-bottom:15px; text-align:center;">
                    <span style="color:#aaa; font-size:0.75rem;">REGISTRO DE METRADURA (METROS)</span>
                    <input type="number" id="h-ans" placeholder="000" style="width:100%; text-align:center; background:transparent; color:#00ff99; border:none; border-bottom:2px solid #00ff99; font-size:2.5rem; font-family:monospace; outline:none; margin-top:10px; box-sizing:border-box;">
                </div>
                
                <div id="h-msg" style="color:#ff6b6b; font-size:0.85rem; margin-bottom:15px; text-align:center; min-height:20px; font-weight:bold;"></div>
                
                <button id="btn-height" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; font-weight:bold; letter-spacing:1px;">⚡ ENVIAR LECTURA TELEMÉTRICA</button>
            </div>
        `,
        attachEvents: (role) => {
            let fails = 0;
            const btn = document.getElementById('btn-height');
            const input = document.getElementById('h-ans');
            const msg = document.getElementById('h-msg');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim();
                if (val == '634') {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_17_height', {type:'number', data: 634}, role);
                } else {
                    fails++;
                    if (window.playProceduralSound) playProceduralSound('error');
                    if (fails === 1) {
                        msg.innerText = ">>> ERROR: Pista: El número se lee 'mu-sa-shi' (antigua provincia).";
                    } else {
                        msg.innerText = ">>> ACCESO DENEGADO: Altura no válida.";
                    }
                }
            });
        }
    },

    "day_17_sumida": {
        tag: "video",
        day: 17,
        title: "Navegando el Sumida",
        role: "both",
        xp: 20,
        location: "Río Sumida",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%); border-radius:15px; border:3px solid #00acc1; color:#006064; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🚢 Travesía del Río Sumida 🚢</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#00838f;">Grabad un vídeo corto (10s) desde el barco turístico (Water Bus) mientras cruzáis bajo alguno de los coloridos puentes históricos.</p>
                
                <div style="position:relative; background:#1a1a24; border-radius:12px; overflow:hidden; border:2px solid #00acc1; margin-bottom:15px; min-height:180px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <video id="v-sum" autoplay playsinline muted style="width:100%; display:none; border-radius:10px; object-fit:cover;"></video>
                    <div id="boat-wheel" style="font-size:4rem; animation: rotate 8s linear infinite;">🎡</div>
                    <div id="video-timer" style="position:absolute; right:15px; bottom:15px; color:#00acc1; font-family:monospace; font-weight:bold; font-size:1.1rem; background:rgba(0,0,0,0.6); padding:3px 8px; border-radius:5px;">10.0s</div>
                </div>
                
                <button id="btn-rec" class="btn-primary" style="width:100%; border-radius:25px; background:#00acc1; border-color:#00acc1; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;">🎬 GRABAR PASEO FLAVIAL (10s)</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; margin-top:10px; padding:12px;">📨 Enviar Vídeo al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec');
            const vid = document.getElementById('v-sum');
            const btnSubmit = document.getElementById('btn-submit');
            const wheel = document.getElementById('boat-wheel');
            const timerEl = document.getElementById('video-timer');
            
            let mr = null;
            let stream = null;
            let blobId = null;
            let timeLeft = 10.0;
            let interval = null;
            
            btnRec.addEventListener('click', async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:true});
                    vid.srcObject = stream;
                    vid.style.display = 'block';
                    wheel.style.display = 'none';
                    vid.play();
                    
                    mr = new MediaRecorder(stream);
                    let chunks = [];
                    mr.ondataavailable = e => chunks.push(e.data);
                    
                    mr.onstop = () => {
                        vid.srcObject = null;
                        const blob = new Blob(chunks, {'type':'video/mp4'});
                        vid.src = URL.createObjectURL(blob);
                        vid.controls = true;
                        vid.muted = false;
                        
                        btnRec.classList.add('hidden');
                        btnSubmit.classList.remove('hidden');
                        
                        const r = new FileReader();
                        r.readAsDataURL(blob);
                        r.onloadend = () => { blobId = r.result; };
                        
                        stream.getTracks().forEach(t => t.stop());
                    };
                    
                    mr.start();
                    btnRec.disabled = true;
                    btnRec.innerText = '⏳ Grabando...';
                    timeLeft = 10.0;
                    timerEl.innerText = '10.0s';
                    
                    interval = setInterval(() => {
                        timeLeft -= 0.1;
                        if (timeLeft <= 0) {
                            timeLeft = 0;
                            clearInterval(interval);
                            if (mr.state === 'recording') mr.stop();
                        } else {
                            timerEl.innerText = `${timeLeft.toFixed(1)}s`;
                        }
                    }, 100);
                    
                } catch(e) {
                    console.error(e);
                    showAlert("Error", "Cámara o micrófono no disponibles.");
                }
            });
            
            btnSubmit.addEventListener('click', async () => {
                if (blobId) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    const videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                    await savePhotoToDB(videoId, blobId);
                    submitMission('day_17_sumida', {type:'video', data: videoId}, role, true);
                }
            });
            
            window._missionCleanup = () => {
                clearInterval(interval);
                if (stream) stream.getTracks().forEach(t => t.stop());
            };
        }
    },

"day_18_shibuya": {
        tag: "economy",
        day: 18,
        title: "La Marea Humana",
        role: "kid9",
        xp: 20,
        location: "Shibuya",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #cfd8dc 100%); border-radius:15px; border:3px solid #607d8b; color:#37474f; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🚶 Marea Humana en Shibuya 🚶</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#455a64;">Inicia el cronómetro verde del semáforo (30s) y pulsa el botón cada vez que cruce alguien con gafas de sol:</p>
                
                <div style="background:#fff; border-radius:10px; padding:15px; border:2px solid #607d8b; margin-bottom:15px; display:flex; align-items:center; justify-content:space-around;">
                    <div>
                        <span style="font-size:0.75rem; color:#888; display:block;">GAFAS DETECTADAS:</span>
                        <span style="font-size:2.8rem; font-weight:bold; color:#37474f;" id="s-count">0</span>
                    </div>
                    <div>
                        <span style="font-size:0.75rem; color:#888; display:block;">TIEMPO RESTANTE:</span>
                        <span style="font-size:2.8rem; font-weight:bold; color:#e53935; font-family:monospace;" id="s-timer">30.0s</span>
                    </div>
                </div>
                
                <button id="btn-plus" class="btn-secondary" style="width:100%; height:75px; font-size:3rem; margin-bottom:12px; background:#cfd8dc; border-color:#607d8b; color:#37474f; font-weight:bold; border-radius:12px;" disabled>+</button>
                <button id="btn-start" class="btn-primary" style="width:100%; border-radius:25px; background:#607d8b; border-color:#607d8b; color:#fff; font-weight:bold; padding:12px;">🚦 INICIAR SEMÁFORO VERDE</button>
                <button id="btn" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-weight:bold; padding:12px;">📨 Enviar Recuento</button>
            </div>
        `,
        attachEvents: (role) => {
            let c = 0, t = 30.0, int = null, active = false;
            const count = document.getElementById('s-count');
            const timer = document.getElementById('s-timer');
            const plusBtn = document.getElementById('btn-plus');
            const startBtn = document.getElementById('btn-start');
            const submitBtn = document.getElementById('btn');
            
            plusBtn.addEventListener('click', () => {
                if (active) {
                    c++;
                    count.innerText = c;
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            });
            
            startBtn.addEventListener('click', () => {
                active = true;
                c = 0;
                t = 30.0;
                count.innerText = '0';
                timer.innerText = '30.0s';
                
                startBtn.classList.add('hidden');
                plusBtn.removeAttribute('disabled');
                plusBtn.style.background = '#90caf9';
                plusBtn.style.borderColor = '#1976d2';
                plusBtn.style.color = '#0d47a1';
                
                if (window.playProceduralSound) playProceduralSound('click');
                
                int = setInterval(() => {
                    t -= 0.1;
                    if (t <= 0) {
                        t = 0;
                        active = false;
                        clearInterval(int);
                        plusBtn.setAttribute('disabled', 'true');
                        plusBtn.style.background = '#cfd8dc';
                        plusBtn.style.borderColor = '#607d8b';
                        plusBtn.style.color = '#37474f';
                        
                        if (c === 0) {
                            if (window.playProceduralSound) playProceduralSound('error');
                            showAlert('RECUENTO NULO', 'No habéis contado a ningún transeúnte con gafas de sol. Shibuya está lleno de peatones. ¡Busca bien e inténtalo de nuevo!');
                            startBtn.classList.remove('hidden');
                            startBtn.innerText = '🚦 REINTENTAR SEMÁFORO';
                            timer.innerText = '30.0s';
                        } else {
                            if (window.playProceduralSound) playProceduralSound('success');
                            submitBtn.classList.remove('hidden');
                            count.innerText = `Final: ${c}`;
                        }
                    } else {
                        timer.innerText = t.toFixed(1) + 's';
                    }
                }, 100);
            });
            
            submitBtn.addEventListener('click', () => {
                if (c <= 0) return;
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_18_shibuya', { type: 'number', data: c }, role);
            });
            
            window._missionCleanup = () => clearInterval(int);
        }
    },

"day_18_hachiko": {
        tag: "photo", day: 18, title: "Guardián Hachiko", role: "kid9", xp: 15, location: "Shibuya",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🐕 Hachiko esperó a su dueño durante 9 AÑOS en esta estación. Es el perro más fiel de la historia de Japón. Hazte una foto con su estatua y demuéstrale que alguien sigue viniendo a verle.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#cd7f32,#daa520,#f7c948); border-radius:15px;">
            <p style="font-size:3rem;">🐕💛🌸</p>
            <p style="color:#5a3e1b; font-weight:bold;">9 años esperando... El perro más fiel</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto con Hachiko</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_18_hachiko', currentUser, false); }
    },

    "day_18_ema": {
        tag: "writing",
        day: 18,
        title: "Mensaje del Emperador",
        role: "kid9",
        xp: 15,
        location: "Meiji Jingu",
        render: () => `
            <div style="text-align:center; padding:18px; background:linear-gradient(135deg, #ffecb3 0%, #ffe082 100%); border-radius:15px; border:4px solid #b57c1e; color:#5d4037; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15); position:relative;">
                <div style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); width:25px; height:25px; border-radius:50%; background:#b57c1e; display:flex; justify-content:center; align-items:center; color:#fff; font-size:0.7rem;">🏮</div>
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-top:10px; margin-bottom:5px;">⛩️ Vuestro Deseo en la Ema ⛩️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">En Meiji Jingu, la gente cuelga tablillas de madera (ema) con deseos. Escribe un deseo sincero para toda vuestra familia.</p>
                
                <div style="background:#fffcf4; border:2px dashed #b57c1e; border-radius:10px; padding:15px; margin-bottom:15px;">
                    <p style="font-size:2.5rem; margin:5px 0;">📜🖋️✨</p>
                    <textarea id="e-ans" placeholder="Deseo familiar..." style="width:100%; height:90px; border:none; background:transparent; font-family:'Quicksand', sans-serif; font-size:1.1rem; text-align:center; color:#5d4037; outline:none; resize:none; box-sizing:border-box;"></textarea>
                </div>
                
                <button id="btn-ema" class="btn-primary" style="width:100%; border-radius:25px; background:#b57c1e; border-color:#b57c1e; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;">🏮 COLGAR EMA DE DESEO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-ema');
            const input = document.getElementById('e-ans');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim();
                if (val.length < 8) {
                    showAlert('Deseo muy corto', 'Escribe un deseo un poco más largo y especial para tu familia.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_18_ema', {type:'text', data: val}, role);
            });
        }
    },

    "day_18_crepe": {
        tag: "writing",
        day: 18,
        title: "Crepe de Harajuku",
        role: "kid9",
        xp: 15,
        location: "Harajuku",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); border-radius:15px; border:3px solid #ec407a; color:#880e4f; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px;">🍓 Diseñador de Crepes de Harajuku 🍓</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#c2185b;">Elige tus ingredientes favoritos para montar un crepe gigante digital y cuéntanos si te ha gustado el real.</p>
                
                <div style="background:#fff; border-radius:12px; padding:10px; border:2px dashed #ec407a; margin-bottom:15px;">
                    <div id="crepe-visual" style="font-size:3.5rem; margin:10px 0; transition: transform 0.3s;">🥞</div>
                    <div id="ingredients-list" style="font-size:0.9rem; font-weight:bold; color:#ec407a; min-height:24px; margin-bottom:10px;">Crepe vacío</div>
                    
                    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-bottom:15px;">
                        <button class="btn-ing" data-emoji="🍦" data-name="Nata Dulce" style="background:#fce4ec; border:1px solid #ec407a; border-radius:15px; padding:5px 10px; font-size:0.85rem; cursor:pointer; font-family:'Quicksand', sans-serif;">🍦 + Nata</button>
                        <button class="btn-ing" data-emoji="🍓" data-name="Fresas Frescas" style="background:#fce4ec; border:1px solid #ec407a; border-radius:15px; padding:5px 10px; font-size:0.85rem; cursor:pointer; font-family:'Quicksand', sans-serif;">🍓 + Fresas</button>
                        <button class="btn-ing" data-emoji="🍨" data-name="Helado de Vainilla" style="background:#fce4ec; border:1px solid #ec407a; border-radius:15px; padding:5px 10px; font-size:0.85rem; cursor:pointer; font-family:'Quicksand', sans-serif;">🍨 + Helado</button>
                        <button class="btn-ing" data-emoji="🍫" data-name="Sirope Chocolate" style="background:#fce4ec; border:1px solid #ec407a; border-radius:15px; padding:5px 10px; font-size:0.85rem; cursor:pointer; font-family:'Quicksand', sans-serif;">🍫 + Sirope</button>
                    </div>
                </div>
                
                <textarea id="cr-ans" placeholder="¿Cómo estaba tu crepe real? Describe tu experiencia..." style="width:100%; height:70px; border:2px solid #f8bbd0; border-radius:10px; padding:10px; font-family:inherit; font-size:0.95rem; box-sizing:border-box; margin-bottom:15px;"></textarea>
                
                <button id="btn-crepe" class="btn-primary" style="width:100%; border-radius:25px; background:#ec407a; border-color:#ec407a; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;">🍰 ENVIAR CREPE Y OPINIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-crepe');
            const reviewInput = document.getElementById('cr-ans');
            const visual = document.getElementById('crepe-visual');
            const ingList = document.getElementById('ingredients-list');
            
            let selected = [];
            
            document.querySelectorAll('.btn-ing').forEach(button => {
                button.addEventListener('click', (e) => {
                    const name = button.dataset.name;
                    const emoji = button.dataset.emoji;
                    
                    if (selected.includes(name)) {
                        selected = selected.filter(x => x !== name);
                        button.style.background = '#fce4ec';
                    } else {
                        selected.push(name);
                        button.style.background = '#f8bbd0';
                    }
                    
                    if (window.playProceduralSound) playProceduralSound('click');
                    
                    if (selected.length === 0) {
                        ingList.innerText = 'Crepe vacío';
                        visual.innerText = '🥞';
                    } else {
                        ingList.innerText = selected.join(' + ');
                        const emojis = selected.map(n => {
                            if (n === 'Nata Dulce') return '🍦';
                            if (n === 'Fresas Frescas') return '🍓';
                            if (n === 'Helado de Vainilla') return '🍨';
                            return '🍫';
                        }).join('');
                        visual.innerText = '🥞' + emojis;
                    }
                    
                    visual.style.transform = 'scale(1.2)';
                    setTimeout(() => visual.style.transform = 'scale(1)', 150);
                });
            });
            
            btn.addEventListener('click', () => {
                const review = reviewInput.value.trim();
                if (selected.length === 0) {
                    showAlert('Crepe vacío', 'Elige al menos un ingrediente para tu crepe.');
                    return;
                }
                if (review.length < 8) {
                    showAlert('Reseña requerida', 'Describe brevemente qué tal estaba el crepe real.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_18_crepe', {type:'text', data: `Ingredientes: ${selected.join(', ')} | Reseña: ${review}`}, role);
            });
        }
    },

    "day_18_radio": {
        tag: "expert",
        day: 18,
        title: "Intercepción de Radio",
        role: "kid14",
        xp: 25,
        location: "Harajuku",
        render: () => `
            <div class="ui-terminal" style="padding:20px; border-radius:12px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CONSOLA DE INTERCEPCIÓN RADIOFÓNICA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Escucha la modulación vocal robótica e ingresa la palabra secreta japonesa transcrita en rōmaji.</p>
                
                <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #333; margin-bottom:15px; display:flex; align-items:center; justify-content:space-around;">
                    <button id="btn-play" class="btn-secondary" style="border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; padding:10px 15px;">🔊 ESCUCHAR SEÑAL</button>
                    <div style="display:flex; gap:3px; height:30px; align-items:flex-end;">
                        <div class="audio-bar" style="width:4px; height:10px; background:#00ff99;"></div>
                        <div class="audio-bar" style="width:4px; height:22px; background:#00ff99;"></div>
                        <div class="audio-bar" style="width:4px; height:15px; background:#00ff99;"></div>
                        <div class="audio-bar" style="width:4px; height:28px; background:#00ff99;"></div>
                        <div class="audio-bar" style="width:4px; height:8px; background:#00ff99;"></div>
                    </div>
                </div>
                
                <div style="margin-bottom:15px;">
                    <label style="color:#00ff99; font-size:0.75rem; display:block; margin-bottom:5px;">PALABRA TRANSCRITA (RŌMAJI):</label>
                    <input type="text" id="ra-ans" placeholder="Escribe la palabra..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <div id="radio-attempts" style="color:#ffb300; font-size:0.8rem; margin-bottom:15px; text-align:center;">Intentos restantes: 3</div>
                
                <button id="btn-decrypt" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; font-weight:bold;">🔓 DESENCRIPTAR FRECUENCIA</button>
            </div>
        `,
        attachEvents: (role) => {
            const words = ['sushi', 'samurai', 'kawaii', 'fuji', 'ramen'];
            const target = words[Math.floor(Math.random() * words.length)];
            let lives = 3;
            
            const btnPlay = document.getElementById('btn-play');
            const btnDecrypt = document.getElementById('btn-decrypt');
            const input = document.getElementById('ra-ans');
            const attBox = document.getElementById('radio-attempts');
            const bars = document.querySelectorAll('.audio-bar');
            
            let barInt = null;
            const animateBars = () => {
                barInt = setInterval(() => {
                    bars.forEach(b => {
                        const h = Math.floor(Math.random() * 25) + 5;
                        b.style.height = h + 'px';
                    });
                }, 100);
            };
            
            btnPlay.addEventListener('click', () => {
                if (lives <= 0) return;
                if (window.playProceduralSound) playProceduralSound('click');
                
                animateBars();
                setTimeout(() => {
                    clearInterval(barInt);
                    bars.forEach(b => b.style.height = '10px');
                }, 1500);
                
                const u = new SpeechSynthesisUtterance(target);
                u.lang = 'ja-JP';
                u.rate = 0.7;
                window.speechSynthesis.speak(u);
            });
            
            btnDecrypt.addEventListener('click', () => {
                const val = input.value.toLowerCase().trim();
                if (val === target) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_18_radio', {type:'game', data:`Interceptado: ${target}`}, role);
                } else {
                    lives--;
                    if (window.playProceduralSound) playProceduralSound('error');
                    if (lives <= 0) {
                        attBox.innerText = "SISTEMA BLOQUEADO. Misión fallida. Reinicia.";
                        btnDecrypt.disabled = true;
                    } else {
                        attBox.innerText = `Intentos restantes: ${lives}`;
                        showAlert('Error', 'Modulación vocal no coincide.');
                    }
                }
            });
            
            window._missionCleanup = () => {
                clearInterval(barInt);
            };
        }
    },

    "day_18_trend": {
        tag: "photo",
        day: 18,
        title: "Cazatendencias",
        role: "kid14",
        xp: 20,
        location: "Harajuku",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> ANÁLISIS DE MODA URBANA: HARAJUKU TREND</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Captura a la persona con el outfit más alternativo y atrevido que veas en la calle Takeshita y analiza su estilo.</p>
                
                <textarea id="tr-ans" placeholder=">>> Describe el look (colores, prendas, peinado, accesorios)..." style="width:100%; height:80px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">📸 CAPTURAR LOOK + TRANSMITIR</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            const descInput = document.getElementById('tr-ans');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const desc = descInput.value.trim();
                if (desc.length < 10) {
                    showAlert('Descripción requerida', 'Introduce un análisis de la tendencia de moda antes de subir la imagen.');
                    fileInput.value = '';
                    return;
                }
                
                btn.innerText = '⏳ Transmitiendo archivo visual...';
                btn.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_18_trend', {type:'mixed', data:`Desc: ${desc} | Foto: ${photoId}`}, role);
                } catch(err) {
                    console.error(err);
                    btn.innerText = '📸 CAPTURAR LOOK + TRANSMITIR';
                    btn.disabled = false;
                    showAlert('Error', 'Fallo en la transmisión de datos.');
                }
            });
        }
    },

    "day_18_flow": {
        tag: "economy",
        day: 18,
        title: "Flujo del Cruce",
        role: "kid14",
        xp: 15,
        location: "Shibuya",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> MODELADOR DE TRÁFICO PEATONAL: SHIBUYA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Estima el flujo de personas por ciclo verde y calcula el volumen por hora. Los aforos en Shibuya varían habitualmente entre 1.000 y 3.000 cruces por cada luz verde:</p>
                
                <div style="margin:15px 0; padding:15px; background:rgba(0,255,153,0.03); border:1px dashed #00ff99; border-radius:5px; text-align:center;">
                    <span style="font-size:0.8rem; color:#aaa;">CRUCES POR VERDE ESTIMADOS:</span>
                    <div id="flow-disp" style="font-size:2.2rem; font-weight:bold; color:#ffd700; margin:10px 0;">2.000 Pers.</div>
                    <input type="range" id="flow-slider" min="100" max="5000" step="100" value="2000" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                    <div id="flow-calc" style="font-size:0.85rem; color:#ffb300; margin-top:5px;">Est. por hora (~24 verdes/h): 48.000 pers/h</div>
                    <div id="flow-status" style="font-size:0.75rem; color:#00ff99; margin-top:8px;">✓ Caudal en rango de aforo regular (1.000 - 3.000 pers/ciclo)</div>
                </div>
                
                <button id="btn-flow" class="btn-primary" style="width:100%; border-color:#00ff99; color:#111; background:#00ff99; font-family:monospace;">💾 REGISTRAR AFORO ESTIMADO</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('flow-slider');
            const disp = document.getElementById('flow-disp');
            const calc = document.getElementById('flow-calc');
            const btn = document.getElementById('btn-flow');
            const statusEl = document.getElementById('flow-status');
            
            const checkValidity = (val) => {
                if (val >= 1000 && val <= 3000) {
                    btn.removeAttribute('disabled');
                    btn.style.borderColor = '#00ff99';
                    btn.style.color = '#111';
                    btn.style.background = '#00ff99';
                } else {
                    btn.setAttribute('disabled', 'true');
                    btn.style.borderColor = '#555';
                    btn.style.color = '#555';
                    btn.style.background = 'transparent';
                }
            };
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                disp.innerText = val.toLocaleString('es-ES') + ' Pers.';
                const hourly = val * 24;
                calc.innerText = `Est. por hora (~24 verdes/h): ${hourly.toLocaleString('es-ES')} pers/h`;
                if (window.playProceduralSound) playProceduralSound('click');
                
                if (val < 1000) {
                    statusEl.innerText = '⚠ Muy bajo. En las horas activas de Shibuya, el cruce es masivo y supera las 1.000 personas.';
                    statusEl.style.color = '#e74c3c';
                } else if (val > 3000) {
                    statusEl.innerText = '⚠ Muy alto. Excepto en fin de año o eventos extremos, no se superan las 3.000 personas por ciclo.';
                    statusEl.style.color = '#e74c3c';
                } else {
                    statusEl.innerText = '✓ Caudal en rango de aforo regular (1.000 - 3.000 pers/ciclo)';
                    statusEl.style.color = '#00ff99';
                }
                checkValidity(val);
            });
            
            btn.addEventListener('click', () => {
                const val = parseInt(slider.value);
                if (val < 1000 || val > 3000) return;
                
                const hourly = val * 24;
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_18_flow', {type:'number', data: hourly}, role);
            });
            
            // Initial check
            checkValidity(parseInt(slider.value));
        }
    },

    "day_18_silence": {
        tag: "economy",
        day: 18,
        title: "Silencio en la Ciudad",
        role: "kid14",
        xp: 15,
        location: "Meiji Jingu",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> DIAGNÓSTICO ACÚSTICO: BOSQUE DE MEIJI JINGU</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Deduce por qué al adentrarte en el santuario el ruido ensordecedor de Shibuya desaparece por completo (Pista: analiza la densidad de su vegetación).</p>
                
                <textarea id="s-ans" placeholder=">>> Escribe tu deducción física/acústica..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                
                <button id="btn-silence" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">💾 REGISTRAR REPORTE ACÚSTICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-silence');
            const input = document.getElementById('s-ans');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim();
                if (val.length < 15) {
                    showAlert('Análisis incompleto', 'Explica de forma más amplia cómo influyen los árboles en detener las ondas sonoras.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_18_silence', {type:'text', data: val}, role);
            });
        }
    },

    "day_18_crossing": {
        tag: "video",
        day: 18,
        title: "Cruzando Shibuya",
        role: "both",
        xp: 20,
        location: "Shibuya",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #cfd8dc 100%); border-radius:15px; border:3px solid #78909c; color:#37474f; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🚶 Marea Humana en Shibuya 🚶</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#455a64;">Grabad un vídeo corto (15s) de la familia cruzando el mítico cruce diagonal de Shibuya rodeados por cientos de personas.</p>
                
                <div style="position:relative; background:#1a1a24; border-radius:12px; overflow:hidden; border:2px solid #78909c; margin-bottom:15px; min-height:180px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <video id="v-cross" autoplay playsinline muted style="width:100%; display:none; border-radius:10px; object-fit:cover;"></video>
                    <div id="cross-light" style="width:50px; height:50px; border-radius:50%; background:#e53935; display:flex; justify-content:center; align-items:center; font-size:1.5rem; color:#fff; border:3px solid #fff;">🛑</div>
                    <div id="cross-timer" style="position:absolute; right:15px; bottom:15px; color:#cfd8dc; font-family:monospace; font-weight:bold; font-size:1.1rem; background:rgba(0,0,0,0.6); padding:3px 8px; border-radius:5px;">15.0s</div>
                </div>
                
                <button id="btn-rec" class="btn-primary" style="width:100%; border-radius:25px; background:#78909c; border-color:#78909c; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;">🎬 GRABAR CRUCE DIAGONAL (15s)</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; margin-top:10px; padding:12px;">📨 Enviar Vídeo al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec');
            const vid = document.getElementById('v-cross');
            const btnSubmit = document.getElementById('btn-submit');
            const light = document.getElementById('cross-light');
            const timerEl = document.getElementById('cross-timer');
            
            let mr = null;
            let stream = null;
            let blobId = null;
            let timeLeft = 15.0;
            let interval = null;
            
            btnRec.addEventListener('click', async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:true});
                    vid.srcObject = stream;
                    vid.style.display = 'block';
                    light.style.background = '#4caf50';
                    light.innerText = '🚶';
                    vid.play();
                    
                    mr = new MediaRecorder(stream);
                    let chunks = [];
                    mr.ondataavailable = e => chunks.push(e.data);
                    
                    mr.onstop = () => {
                        vid.srcObject = null;
                        const blob = new Blob(chunks, {'type':'video/mp4'});
                        vid.src = URL.createObjectURL(blob);
                        vid.controls = true;
                        vid.muted = false;
                        light.style.background = '#888';
                        light.innerText = '💤';
                        
                        btnRec.classList.add('hidden');
                        btnSubmit.classList.remove('hidden');
                        
                        const r = new FileReader();
                        r.readAsDataURL(blob);
                        r.onloadend = () => { blobId = r.result; };
                        
                        stream.getTracks().forEach(t => t.stop());
                    };
                    
                    mr.start();
                    btnRec.disabled = true;
                    btnRec.innerText = '⏳ Grabando...';
                    timeLeft = 15.0;
                    timerEl.innerText = '15.0s';
                    
                    interval = setInterval(() => {
                        timeLeft -= 0.1;
                        if (timeLeft <= 0) {
                            timeLeft = 0;
                            clearInterval(interval);
                            if (mr.state === 'recording') mr.stop();
                        } else {
                            timerEl.innerText = `${timeLeft.toFixed(1)}s`;
                        }
                    }, 100);
                    
                } catch(e) {
                    console.error(e);
                    showAlert("Error", "Cámara o micrófono no disponibles.");
                }
            });
            
            btnSubmit.addEventListener('click', async () => {
                if (blobId) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    const videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                    await savePhotoToDB(videoId, blobId);
                    submitMission('day_18_crossing', {type:'video', data: videoId}, role, true);
                }
            });
            
            window._missionCleanup = () => {
                clearInterval(interval);
                if (stream) stream.getTracks().forEach(t => t.stop());
            };
        }
    },

    "day_19_gundam": {
        tag: "video",
        day: 19,
        title: "Piloto de Mechas",
        role: "kid9",
        xp: 20,
        location: "Odaiba",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fce4ec 0%, #f1f8e9 100%); border-radius:15px; border:3px solid #e91e63; color:#880e4f; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px;">🤖 Transformación Unicorn Gundam 🤖</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#c2185b;">El gigante Gundam de Odaiba se transforma. Graba 15s de su modo Destroy con tu mira táctica de combate activa.</p>
                
                <div style="position:relative; background:#1a1a24; border-radius:12px; overflow:hidden; border:2px solid #e91e63; margin-bottom:15px; min-height:180px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <video id="v-g" autoplay playsinline muted style="width:100%; display:none; border-radius:10px; object-fit:cover;"></video>
                    
                    <!-- HUD overlay -->
                    <div id="gundam-hud" style="position:absolute; top:10px; left:10px; right:10px; bottom:10px; border:2px solid rgba(233,30,99,0.3); pointer-events:none; display:none; flex-direction:column; justify-content:space-between; padding:5px; box-sizing:border-box;">
                        <div style="display:flex; justify-content:space-between; color:#e91e63; font-size:0.65rem; font-family:monospace;"><span>LOCK-ON MODE</span><span>SYSTEM OK</span></div>
                        <div style="width:40px; height:40px; border:2px solid #e91e63; border-radius:50%; margin:0 auto; display:flex; justify-content:center; align-items:center; color:#e91e63; font-size:0.8rem; animation: pulse 0.5s infinite alternate;">➕</div>
                        <div style="display:flex; justify-content:space-between; color:#e91e63; font-size:0.65rem; font-family:monospace;"><span>PWR: 99%</span><span>TRGT: UNICORN</span></div>
                    </div>
                    
                    <div id="g-mecha-emoji" style="font-size:4.5rem;">🤖</div>
                    <div id="gundam-timer" style="position:absolute; right:15px; bottom:15px; color:#ff80ab; font-family:monospace; font-weight:bold; font-size:1.1rem; background:rgba(0,0,0,0.6); padding:3px 8px; border-radius:5px;">15.0s</div>
                </div>
                
                <button id="btn-rec" class="btn-primary" style="width:100%; border-radius:25px; background:#e91e63; border-color:#e91e63; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;">🎬 APUNTAR + GRABAR MECHA (15s)</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; margin-top:10px; padding:12px;">📨 Transmitir Vídeo al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec');
            const vid = document.getElementById('v-g');
            const btnSubmit = document.getElementById('btn-submit');
            const emoji = document.getElementById('g-mecha-emoji');
            const hud = document.getElementById('gundam-hud');
            const timerEl = document.getElementById('gundam-timer');
            
            let mr = null;
            let stream = null;
            let blobId = null;
            let timeLeft = 15.0;
            let interval = null;
            
            btnRec.addEventListener('click', async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:true});
                    vid.srcObject = stream;
                    vid.style.display = 'block';
                    hud.style.display = 'flex';
                    emoji.style.display = 'none';
                    vid.play();
                    
                    mr = new MediaRecorder(stream);
                    let chunks = [];
                    mr.ondataavailable = e => chunks.push(e.data);
                    
                    mr.onstop = () => {
                        vid.srcObject = null;
                        const blob = new Blob(chunks, {'type':'video/mp4'});
                        vid.src = URL.createObjectURL(blob);
                        vid.controls = true;
                        vid.muted = false;
                        hud.style.display = 'none';
                        
                        btnRec.classList.add('hidden');
                        btnSubmit.classList.remove('hidden');
                        
                        const r = new FileReader();
                        r.readAsDataURL(blob);
                        r.onloadend = () => { blobId = r.result; };
                        
                        stream.getTracks().forEach(t => t.stop());
                    };
                    
                    mr.start();
                    btnRec.disabled = true;
                    btnRec.innerText = '⏳ Fijando Blanco...';
                    timeLeft = 15.0;
                    timerEl.innerText = '15.0s';
                    
                    interval = setInterval(() => {
                        timeLeft -= 0.1;
                        if (timeLeft <= 0) {
                            timeLeft = 0;
                            clearInterval(interval);
                            if (mr.state === 'recording') mr.stop();
                        } else {
                            timerEl.innerText = `${timeLeft.toFixed(1)}s`;
                        }
                    }, 100);
                    
                } catch(e) {
                    console.error(e);
                    showAlert("Error", "Cámara o micrófono no disponibles.");
                }
            });
            
            btnSubmit.addEventListener('click', async () => {
                if (blobId) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    const videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                    await savePhotoToDB(videoId, blobId);
                    submitMission('day_19_gundam', {type:'video', data: videoId}, role);
                }
            });
            
            window._missionCleanup = () => {
                clearInterval(interval);
                if (stream) stream.getTracks().forEach(t => t.stop());
            };
        }
    },

    "day_19_color": {
        tag: "expert",
        day: 19,
        title: "Cazador de Luz",
        role: "kid9",
        xp: 25,
        location: "TeamLab",
        render: () => `
            <div style="text-align:center; padding:18px; background:linear-gradient(135deg, #121212 0%, #1e1e1e 100%); border-radius:15px; border:3px solid #bb86fc; color:#fff; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.4);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px; color:#bb86fc;">🔮 Mimetismo Cromático 🔮</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#e0e0e0;">En TeamLab las salas cambian de color constantemente. Usa el selector mágico para capturar y replicar el color exacto de tu sala en este instante.</p>
                
                <div style="display:flex; flex-direction:column; align-items:center; margin:20px 0;">
                    <div id="color-glow-ring" style="width:110px; height:110px; border-radius:50%; background:#ff0000; box-shadow:0 0 25px #ff0000; display:flex; justify-content:center; align-items:center; margin-bottom:15px; transition: background 0.2s, box-shadow 0.2s;">
                        <span style="font-size:1.8rem;">🎨</span>
                    </div>
                    <input type="color" id="c-picker" value="#ff0000" style="width:80px; height:40px; border:none; border-radius:5px; background:transparent; cursor:pointer;">
                </div>
                
                <button id="btn-color" class="btn-primary" style="width:100%; border-radius:25px; background:#bb86fc; border-color:#bb86fc; color:#000; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;">🔮 CONFIGURAR COLOR DE SALA</button>
            </div>
        `,
        attachEvents: (role) => {
            const picker = document.getElementById('c-picker');
            const ring = document.getElementById('color-glow-ring');
            const btn = document.getElementById('btn-color');
            
            picker.addEventListener('input', (e) => {
                const c = e.target.value;
                ring.style.background = c;
                ring.style.boxShadow = `0 0 25px ${c}`;
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btn.addEventListener('click', () => {
                const finalColor = picker.value;
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_19_color', {type:'game', data: `Color capturado: ${finalColor}`}, role);
            });
        }
    },

"day_19_teamlab": {
        tag: "expert",
        day: 19,
        title: "Sueños Digitales",
        role: "kid9",
        xp: 20,
        location: "TeamLab",
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
        const getPos = (e) => { const rect=can.getBoundingClientRect(); const cx=e.touches?e.touches[0].clientX:e.clientX; const cy=e.touches?e.touches[0].clientY:e.clientY; return {x:cx-rect.left, y:cy-rect.top}; };
        const start = (e) => { drawing=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
        const draw = (e) => { if(!drawing) return; e.preventDefault(); const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); };
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
        tag: "photo",
        day: 19,
        title: "La Libertad Nipona",
        role: "kid9",
        xp: 15,
        location: "Odaiba",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f7fa 0%, #80deea 100%); border-radius:15px; border:3px solid #00acc1; color:#006064; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🗽 La Libertad de Odaiba 🗽</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#00838f;">Toma una foto de ilusión óptica tocando la estatua, y responde a la trivia de origen histórico:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #00acc1; margin-bottom:15px; text-align:left;">
                    <label style="font-size:0.8rem; font-weight:bold; color:#006064; display:block; margin-bottom:5px;">🗼 ¿DE DÓNDE PROVIENE ESTA ESTATUA DE LA LIBERTAD?</label>
                    <select id="liberty-trivia" style="width:100%; padding:8px; border:1px solid #00acc1; border-radius:5px; background:#fff; color:#006064; font-family:'Quicksand'; font-size:0.85rem;">
                        <option value="">-- Selecciona --</option>
                        <option value="ny">Nueva York (copia donada por el alcalde de Nueva York)</option>
                        <option value="paris">París (réplica francesa instalada por el Año de Francia en Japón)</option>
                        <option value="tokio">Tokio (un diseño hecho por artesanos locales en metal reciclado)</option>
                    </select>
                </div>

                <input type="file" id="file-input-liberty" accept="image/*" style="display:none;">
                <div id="liberty-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #00acc1; padding:5px; background:#fff;">
                    <span style="font-size:0.75rem; color:#00acc1; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto de la estatua registrada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-liberty" class="btn-secondary" style="flex:1; background:#b2ebf2; border-color:#00acc1; color:#006064; font-weight:bold; border-radius:25px;">📸 Hacer Foto</button>
                    <button id="btn-submit-liberty" class="btn-primary" style="flex:1; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:25px;" disabled>📨 Enviar Reporte</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let selectedOpt = '';
            let photoId = null;
            
            const selectTrivia = document.getElementById('liberty-trivia');
            const fileInput = document.getElementById('file-input-liberty');
            const selectBtn = document.getElementById('btn-select-liberty');
            const submitBtn = document.getElementById('btn-submit-liberty');
            const previewEl = document.getElementById('liberty-preview');
            
            const checkValidity = () => {
                if (selectedOpt && photoId) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#00acc1';
                    submitBtn.style.borderColor = '#00acc1';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = '#ccc';
                    submitBtn.style.borderColor = '#ccc';
                    submitBtn.style.color = '#666';
                }
            };
            
            selectTrivia.addEventListener('change', () => {
                selectedOpt = selectTrivia.value;
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });
            
            selectBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'liberty_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (!selectedOpt || !photoId) return;
                
                if (selectedOpt !== 'paris') {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('RESPUESTA INCORRECTA', 'En 1998, Francia prestó la estatua original de París a Tokio durante un año para celebrar los lazos bilaterales. Fue tan sumamente popular que, al devolverla, los tokiotas construyeron esta réplica permanente autorizada.');
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_19_liberty', {
                    type: 'photo',
                    data: photoId,
                    metadata: { answer: selectedOpt }
                }, role);
            });
        }
    },

"day_19_crypto": {
        tag: "expert",
        day: 19,
        title: "Desencriptar Protocolo",
        role: "kid14",
        xp: 25,
        location: "Odaiba",
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
        tag: "economy",
        day: 19,
        title: "Lógica de Iluminación",
        role: "kid14",
        xp: 20,
        location: "TeamLab",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> INFORME ÓPTICO: SISTEMA DE ESPEJOS INFINITOS (INFINITE REFLECTION)</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Deduce científicamente cómo consiguen que las salas de TeamLab parezcan tener un tamaño infinito usando espejos y luces colgantes.</p>
                
                <div style="background:#111; padding:10px; border:1px dashed #00ff99; border-radius:5px; font-size:0.75rem; color:#888; margin-bottom:15px; text-align:center;">
                    📐 ESTRUCTURA DE COMPOSICIÓN: [Espejo Suelo] ⇆ [Espejo Pared] + Luces LED verticales
                </div>
                
                <textarea id="m-ans" placeholder=">>> Escribe tu explicación física de la proyección de rayos..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                
                <button id="btn-mirrors" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">💾 REGISTRAR EXPLICACIÓN ÓPTICA</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-mirrors');
            const input = document.getElementById('m-ans');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim();
                if (val.length < 15) {
                    showAlert('Explicación corta', 'Completa más detalladamente cómo actúan las superficies reflejantes.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_19_mirrors', {type:'text', data: val}, role);
            });
        }
    },

    "day_19_weight": {
        tag: "economy",
        day: 19,
        title: "Estructura de Gundam",
        role: "kid14",
        xp: 15,
        location: "Odaiba",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> PESO DEL MECHA: UNICORN GUNDAM SCALE 1:1</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Averigua el peso neto en toneladas de la estatua de escala real del Gundam. (Pista: está fabricada de acero y plástico reforzado).</p>
                
                <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #333; margin-bottom:15px; text-align:center;">
                    <span style="color:#aaa; font-size:0.75rem;">REGISTRO DE TONELAJE (T)</span>
                    <input type="number" id="w-ans" placeholder="00" style="width:100%; text-align:center; background:transparent; color:#00ff99; border:none; border-bottom:2px solid #00ff99; font-size:2.5rem; font-family:monospace; outline:none; margin-top:10px; box-sizing:border-box;">
                </div>
                
                <div id="w-msg" style="color:#ff6b6b; font-size:0.85rem; margin-bottom:15px; text-align:center; min-height:20px; font-weight:bold;"></div>
                
                <button id="btn-weight" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; font-weight:bold;">⚡ REGISTRAR TONELAJE OPERATIVO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-weight');
            const input = document.getElementById('w-ans');
            const msg = document.getElementById('w-msg');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim();
                const w = parseFloat(val);
                if (w >= 45 && w <= 52) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_19_weight', {type:'number', data: w}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    msg.innerText = ">>> ERROR: Peso fuera de rango. Investiga un poco más.";
                }
            });
        }
    },

    "day_19_monorail": {
        tag: "physical",
        day: 19,
        title: "Monorriel Yurikamome",
        role: "kid14",
        xp: 15,
        location: "Tren",
        render: () => `
            <div class="ui-terminal" style="padding:20px; border-radius:12px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15); text-align:center;">
                <p>>>> CRONOMETRAJE TÁCTICO: TREN YURIKAMOME (SIN CONDUCTOR)</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px; text-align:left;">Mide cuánto tarda exactamente el monorriel autónomo en recorrer el trayecto entre dos estaciones consecutivas (rango esperado: 15s a 180s).</p>
                
                <div style="background:#111; padding:20px; border-radius:10px; border:1px solid #333; margin-bottom:15px; position:relative; overflow:hidden;">
                    <div id="chrono" style="font-size:3.5rem; font-weight:bold; color:#00ff99; text-shadow:0 0 20px rgba(0,255,153,0.4); font-family:monospace;">0.0s</div>
                    <div id="speedo" style="font-size:0.85rem; color:#ffd700; margin-top:5px;">Velocidad: 0 km/h (Inactivo)</div>
                </div>
                
                <button id="btn-start" class="btn-secondary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; padding:12px; margin-bottom:10px;">🚀 SALIDA DE ESTACIÓN</button>
                <button id="btn-end" class="btn-primary hidden" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; padding:12px;">🏁 DETENCIÓN EN SIGUIENTE</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnStart = document.getElementById('btn-start');
            const btnEnd = document.getElementById('btn-end');
            const clock = document.getElementById('chrono');
            const speedo = document.getElementById('speedo');
            
            let t0 = 0;
            let int = null;
            let finalSecs = 0;
            
            btnStart.addEventListener('click', () => {
                t0 = Date.now();
                btnStart.classList.add('hidden');
                btnEnd.classList.remove('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
                
                int = setInterval(() => {
                    const elapsed = (Date.now() - t0) / 1000;
                    clock.innerText = elapsed.toFixed(1) + 's';
                    finalSecs = elapsed;
                    
                    let speed = 0;
                    if (elapsed < 10) speed = Math.floor(elapsed * 5.5);
                    else if (elapsed > 45) speed = Math.max(0, Math.floor(55 - (elapsed-45)*6));
                    else speed = 50 + Math.floor(Math.sin(elapsed) * 4);
                    
                    speedo.innerText = `Velocidad: ${speed} km/h (Autónomo)`;
                }, 100);
            });
            
            btnEnd.addEventListener('click', () => {
                clearInterval(int);
                if (finalSecs < 15 || finalSecs > 180) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('TIEMPO INCOHERENTE', 'El monorriel de la línea Yurikamome circula de forma regular y tarda entre 15s y 180s entre paradas. Asegúrate de medir un trayecto real.');
                    btnStart.classList.remove('hidden');
                    btnStart.innerText = '🚀 REINTENTAR MEDIDA';
                    btnEnd.classList.add('hidden');
                    clock.innerText = '0.0s';
                    speedo.innerText = 'Velocidad: 0 km/h (Inactivo)';
                    return;
                }
                
                const finalTime = clock.innerText;
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_19_monorail', {type:'text', data:`Tiempo de tránsito Yurikamome: ${finalTime}`}, role);
            });
            
            window._missionCleanup = () => {
                clearInterval(int);
            };
        }
    },

    "day_19_immersive": {
        tag: "photo",
        day: 19,
        title: "Inmersión Total",
        role: "both",
        xp: 20,
        location: "TeamLab",
        render: () => `
            <div style="text-align:center; padding:20px; background:linear-gradient(135deg, #1f1c2c 0%, #928dab 100%); border-radius:18px; border:3px solid #bb86fc; color:#e0e0e0; font-family:'Quicksand', sans-serif; box-shadow:0 6px 20px rgba(0,0,0,0.3);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.2rem; margin-bottom:10px; color:#bb86fc;">🌌 Reflejos de TeamLab 🌌</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#cfd8dc;">Conseguid una foto familiar artística usando las superficies infinitas reflejantes de la sala de luces o agua.</p>
                
                <input type="file" id="file-input-immersive" accept="image/*" style="display:none;">
                <div id="immersive-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #bb86fc; padding:5px; background:rgba(255,255,255,0.05); text-align:center;">
                    <span style="font-size:0.75rem; color:#bb86fc; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto familiar inmersiva cargada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-immersive" class="btn-secondary" style="flex:1; background:rgba(187,134,252,0.15); border-color:#bb86fc; color:#bb86fc; font-weight:bold; border-radius:25px; padding:12px;">📸 Seleccionar Foto</button>
                    <button id="btn-im" class="btn-primary" style="flex:1; border-radius:25px; background:#ccc; border-color:#ccc; color:#666; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;" disabled>📨 Enviar Registro</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let photoId = null;
            const btnSelect = document.getElementById('btn-select-immersive');
            const fileInput = document.getElementById('file-input-immersive');
            const submitBtn = document.getElementById('btn-im');
            const previewEl = document.getElementById('immersive-preview');
            
            btnSelect.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'teamlab_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        
                        submitBtn.removeAttribute('disabled');
                        submitBtn.style.background = '#bb86fc';
                        submitBtn.style.borderColor = '#bb86fc';
                        submitBtn.style.color = '#000';
                        
                        if (window.playProceduralSound) playProceduralSound('success');
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (!photoId) return;
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_19_immersive', {
                    type: 'photo',
                    data: photoId,
                    metadata: { type: 'immersive_reflection' }
                }, role, true);
            });
        }
    },

    "day_20_bento": {
        tag: "expert",
        day: 20,
        title: "Maestro del Bento (Cooperativo)",
        role: "kid9",
        xp: 25,
        location: "Ueno",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius:15px; border:3px solid #ff9800; color:#e65100; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🍱 Preparación del Bento 🍱</p>
                <p style="font-size:0.85rem; margin-bottom:12px; color:#e65100;">Atrapad los ingredientes tradicionales (arroz 🍚, pescado 🐟, pepino 🥒, tortilla 🍳) moviendo la caja de bento. ¡Atrapad 5 para completar la comida!</p>
                
                <div style="background:#111; padding:5px; border-radius:10px; border:2px solid #ff9800; margin-bottom:12px; position:relative;">
                    <canvas id="bento-canvas" width="280" height="180" style="width:100%; height:180px; display:block; background:#1a1a24; border-radius:5px;"></canvas>
                    <div id="bento-score" style="position:absolute; right:15px; top:15px; color:#ff9800; font-weight:bold; font-family:monospace; font-size:1rem;">Ingredientes: 0/5</div>
                </div>
                
                <div id="bento-controls" style="display:none; gap:15px; margin-bottom:12px; justify-content:center;">
                    <button id="btn-left" class="btn-secondary" style="flex:1; background:#ffe0b2; border-color:#ff9800; color:#e65100; font-weight:bold; font-size:1.2rem; padding:10px 0; border-radius:10px;">⬅️ Izquierda</button>
                    <button id="btn-right" class="btn-secondary" style="flex:1; background:#ffe0b2; border-color:#ff9800; color:#e65100; font-weight:bold; font-size:1.2rem; padding:10px 0; border-radius:10px;">Derecha ➡️</button>
                </div>
                
                <button id="btn-play" class="btn-primary" style="width:100%; border-radius:25px; background:#ff9800; border-color:#ff9800; color:#fff; font-weight:bold;">🎮 EMPEZAR PREPARACIÓN</button>
                <button id="btn-submit-bento" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-weight:bold;">📨 Enviar Bento Terminado</button>
            </div>
        `,
        attachEvents: (role) => {
            const canvas = document.getElementById('bento-canvas');
            const ctx = canvas.getContext('2d');
            const scoreDisp = document.getElementById('bento-score');
            const controls = document.getElementById('bento-controls');
            const playBtn = document.getElementById('btn-play');
            const submitBtn = document.getElementById('btn-submit-bento');
            const btnLeft = document.getElementById('btn-left');
            const btnRight = document.getElementById('btn-right');
            
            let score = 0;
            let gameActive = false;
            let animationFrame = null;
            let boxX = 110;
            const boxWidth = 60;
            const boxHeight = 15;
            let ingredient = { x: 140, y: 0, emoji: '🍚', speed: 2.5 };
            
            const emojis = ['🍚', '🐟', '🥒', '🍳'];
            
            const resetIngredient = () => {
                ingredient.x = 20 + Math.random() * (canvas.width - 40);
                ingredient.y = 0;
                ingredient.emoji = emojis[Math.floor(Math.random() * emojis.length)];
                ingredient.speed = 2.0 + Math.random() * 1.5;
            };
            
            const draw = () => {
                if (!gameActive) return;
                
                // Clear
                ctx.fillStyle = '#1a1a24';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw Catcher (Bento Box)
                ctx.fillStyle = '#ff9800';
                ctx.fillRect(boxX, canvas.height - boxHeight - 5, boxWidth, boxHeight);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px sans-serif';
                ctx.fillText('🍱 BENTO', boxX + 8, canvas.height - 8);
                
                // Update and draw ingredient
                ingredient.y += ingredient.speed;
                ctx.font = '20px sans-serif';
                ctx.fillText(ingredient.emoji, ingredient.x - 10, ingredient.y);
                
                // Collision check
                if (ingredient.y >= canvas.height - boxHeight - 15) {
                    if (ingredient.x >= boxX && ingredient.x <= boxX + boxWidth) {
                        score++;
                        scoreDisp.innerText = `Ingredientes: ${score}/5`;
                        if (window.playProceduralSound) playProceduralSound('success');
                        
                        if (score >= 5) {
                            endGame(true);
                            return;
                        }
                        resetIngredient();
                    } else if (ingredient.y > canvas.height) {
                        if (window.playProceduralSound) playProceduralSound('error');
                        resetIngredient();
                    }
                }
                
                animationFrame = requestAnimationFrame(draw);
            };
            
            const endGame = (win) => {
                gameActive = false;
                cancelAnimationFrame(animationFrame);
                controls.style.display = 'none';
                
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#4caf50';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✓ BENTO COMPLETADO', canvas.width / 2, canvas.height / 2);
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitBtn.classList.remove('hidden');
            };
            
            playBtn.addEventListener('click', () => {
                score = 0;
                scoreDisp.innerText = 'Ingredientes: 0/5';
                boxX = 110;
                resetIngredient();
                
                gameActive = true;
                playBtn.classList.add('hidden');
                controls.style.display = 'flex';
                
                // Clear any leftover drawings
                ctx.textAlign = 'left';
                
                draw();
            });
            
            btnLeft.addEventListener('click', () => {
                if (boxX > 10) boxX -= 30;
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btnRight.addEventListener('click', () => {
                if (boxX < canvas.width - boxWidth - 10) boxX += 30;
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            // Allow arrow keys for desktop users
            const handleKeyDown = (e) => {
                if (!gameActive) return;
                if (e.key === 'ArrowLeft' && boxX > 10) {
                    boxX -= 20;
                } else if (e.key === 'ArrowRight' && boxX < canvas.width - boxWidth - 10) {
                    boxX += 20;
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            
            submitBtn.addEventListener('click', () => {
                if (score < 5) return;
                submitMission('day_20_bento', { type: 'game', data: 'Bento tradicional completado con 5 ingredientes' }, role);
            });
            
            window._missionCleanup = () => {
                gameActive = false;
                cancelAnimationFrame(animationFrame);
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    },

"day_20_potion": {
        tag: "expert",
        day: 20,
        title: "Poción Gatuna",
        role: "kid9",
        xp: 20,
        location: "Yanaka Ginza",
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
        tag: "photo",
        day: 20,
        title: "El Pato del Estanque",
        role: "kid9",
        xp: 15,
        location: "Ueno",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg,#e8f5e9 0%,#a5d6a7 100%); border-radius:15px; border:3px solid #2e7d32; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🦆 Vida en Shinobazu 🪷</p>
                <p style="font-size:0.85rem; margin-bottom:12px; color:#2e7d32;">Parque de Ueno. Fotografía un pato o una flor de loto gigante del estanque Shinobazu y responde a la trivia biológica:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #2e7d32; margin-bottom:15px; text-align:left;">
                    <label style="font-size:0.8rem; font-weight:bold; color:#1b5e20; display:block; margin-bottom:5px;">🔍 ¿QUÉ HAS FOTOGRAFIADO?</label>
                    <select id="pond-type" style="width:100%; padding:8px; border:1px solid #2e7d32; border-radius:5px; background:#fff; color:#1b5e20; font-family:inherit; font-size:0.85rem; margin-bottom:10px;">
                        <option value="">-- Elige un elemento --</option>
                        <option value="duck">🦆 Un Pato Gracioso</option>
                        <option value="lotus">🪷 Una Flor de Loto Hermosa</option>
                    </select>
                    
                    <div id="pond-duck-trivia" style="display:none; margin-bottom:5px;">
                        <label style="font-size:0.75rem; color:#555; display:block; margin-bottom:4px;">🦆 ¿Cómo se llama el pato de cuello verde brillante muy común aquí?</label>
                        <select id="duck-ans" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px; font-size:0.8rem; font-family:inherit; background:#fff; color:#333;">
                            <option value="">-- Elige respuesta --</option>
                            <option value="magamo">Ánade azulón (Magamo) - Cuello verde metálico</option>
                            <option value="oshidori">Pato mandarín (Oshidori) - Colores de fantasía</option>
                        </select>
                    </div>

                    <div id="pond-lotus-trivia" style="display:none; margin-bottom:5px;">
                        <label style="font-size:0.75rem; color:#555; display:block; margin-bottom:4px;">🪷 ¿En qué época florecen con esplendor los lotos de Ueno?</label>
                        <select id="lotus-ans" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px; font-size:0.8rem; font-family:inherit; background:#fff; color:#333;">
                            <option value="">-- Elige respuesta --</option>
                            <option value="verano">Pleno Verano (Julio - Agosto)</option>
                            <option value="invierno">Pleno Invierno (Diciembre - Enero)</option>
                        </select>
                    </div>
                </div>

                <input type="file" id="file-input-pond" accept="image/*" style="display:none;">
                <div id="pond-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #2e7d32; padding:5px; background:#fff;">
                    <span style="font-size:0.75rem; color:#2e7d32; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto del estanque registrada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-pond" class="btn-secondary" style="flex:1; background:#c8e6c9; border-color:#2e7d32; color:#1b5e20; font-weight:bold; border-radius:25px;">📸 Hacer Foto</button>
                    <button id="btn-submit-pond" class="btn-primary" style="flex:1; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:25px;" disabled>📨 Enviar Registro</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let pondType = '';
            let triviaSelected = '';
            let photoId = null;
            
            const pondSelect = document.getElementById('pond-type');
            const duckDiv = document.getElementById('pond-duck-trivia');
            const lotusDiv = document.getElementById('pond-lotus-trivia');
            const duckSelect = document.getElementById('duck-ans');
            const lotusSelect = document.getElementById('lotus-ans');
            
            const fileInput = document.getElementById('file-input-pond');
            const selectBtn = document.getElementById('btn-select-pond');
            const submitBtn = document.getElementById('btn-submit-pond');
            const previewEl = document.getElementById('pond-preview');
            
            const checkValidity = () => {
                let triviaOk = false;
                if (pondType === 'duck' && duckSelect.value) triviaOk = true;
                if (pondType === 'lotus' && lotusSelect.value) triviaOk = true;
                
                if (triviaOk && photoId) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#2e7d32';
                    submitBtn.style.borderColor = '#2e7d32';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = '#ccc';
                    submitBtn.style.borderColor = '#ccc';
                    submitBtn.style.color = '#666';
                }
            };
            
            pondSelect.addEventListener('change', () => {
                pondType = pondSelect.value;
                duckDiv.style.display = 'none';
                lotusDiv.style.display = 'none';
                
                if (pondType === 'duck') duckDiv.style.display = 'block';
                if (pondType === 'lotus') lotusDiv.style.display = 'block';
                
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });
            
            duckSelect.addEventListener('change', () => {
                triviaSelected = duckSelect.value;
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });
            
            lotusSelect.addEventListener('change', () => {
                triviaSelected = lotusSelect.value;
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });
            
            selectBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'pond_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (!photoId) return;
                
                if (pondType === 'duck' && duckSelect.value !== 'magamo') {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('RESPUESTA INCORRECTA', 'El Ánade azulón (Magamo) es el pato silvestre migratorio más común de Shinobazu, célebre por su cuello y cabeza verdes metálicos brillantes en los machos.');
                    return;
                }
                
                if (pondType === 'lotus' && lotusSelect.value !== 'verano') {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('RESPUESTA INCORRECTA', 'Los lotos del estanque Shinobazu florecen majestuosamente durante el caluroso verano japonés (Julio a Agosto), cubriendo casi toda la superficie de verde y rosa.');
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_20_pond', {
                    type: 'photo',
                    data: photoId,
                    metadata: { type: pondType, answer: triviaSelected }
                }, role);
            });
        }
    },

    "day_20_weight": {
        tag: "photo",
        day: 20,
        title: "El Peso del Tesoro",
        role: "kid9",
        xp: 15,
        location: "Ameyoko",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f2f1 0%, #80cbc4 100%); border-radius:15px; border:3px solid #009688; color:#004d40; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px;">⚖️ Adivino de Peso en Ameyoko ⚖️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#00796b;">Encuentra un objeto de comida o souvenir en el mercado, hazle una foto y estima su peso real deslizando la balanza.</p>
                
                <div style="background:#fff; border-radius:12px; padding:15px; border:2px dashed #009688; margin-bottom:15px; position:relative;">
                    <div id="scale-beam" style="font-size:3.5rem; transition: transform 0.2s; display:inline-block;">⚖️</div>
                    <div id="weight-disp" style="font-size:2rem; font-weight:bold; color:#004d40; margin:10px 0;">250 gramos</div>
                    <input type="range" id="weight-slider" min="10" max="1500" step="10" value="250" style="width:100%; accent-color:#009688; cursor:pointer;">
                </div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; background:#009688; border-color:#009688; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; border-radius:25px; padding:12px;">📸 Foto del Objeto + Enviar</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('weight-slider');
            const disp = document.getElementById('weight-disp');
            const beam = document.getElementById('scale-beam');
            const btn = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                disp.innerText = val + ' gramos';
                
                const angle = ((val - 750) / 750) * 20;
                beam.style.transform = `rotate(${angle}deg)`;
                
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const grams = slider.value;
                btn.innerText = '⏳ Pesando tesoro...';
                btn.disabled = true;
                
                try {
                    const comp = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, comp);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_20_weight', {type:'mixed', data:`Peso estimado: ${grams}g | Foto: ${photoId}`}, role);
                } catch(err) {
                    console.error(err);
                    btn.innerText = '📸 Foto del Objeto + Enviar';
                    btn.disabled = false;
                    showAlert('Error', 'Fallo al procesar imagen.');
                }
            });
        }
    },

"day_20_change": {
        tag: "economy",
        day: 20,
        title: "Regateo en Ameyoko",
        role: "kid14",
        xp: 20,
        location: "Ameyoko",
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
        tag: "economy",
        day: 20,
        title: "Arquitectura del Museo",
        role: "kid14",
        xp: 15,
        location: "Ueno",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> REPORTE ANALÍTICO: CONTRASTE ARQUITECTÓNICO (UENO)</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Estudia el edificio principal del Museo Nacional de Tokio (Honkan, estilo Imperial Crown) y compáralo con los rascacielos circundantes. Escribe al menos 30 caracteres incluyendo palabras clave de contraste.</p>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                    <div style="background:#111; padding:8px; border-radius:5px; border:1px solid #333; text-align:center; font-size:0.75rem;">
                        🏯 CLÁSICO / TEJADOS<br><span style="color:#aaa;">Madera, tejas, corona, arcos</span>
                    </div>
                    <div style="background:#111; padding:8px; border-radius:5px; border:1px solid #333; text-align:center; font-size:0.75rem;">
                        🏢 MODERNO / TOKIO<br><span style="color:#aaa;">Vidrio, acero, altura</span>
                    </div>
                </div>
                
                <textarea id="m-ans" placeholder=">>> Describe las principales diferencias visuales (mín. 30 caracteres)..." style="width:100%; height:80px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                
                <button id="btn-museum" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">💾 ENVIAR ANÁLISIS ESTRUCTURAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-museum');
            const input = document.getElementById('m-ans');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim().toLowerCase();
                if (val.length < 30) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('RESEÑA INSUFICIENTE', 'Tu reseña debe ser más descriptiva (al menos 30 caracteres) para analizar el contraste del edificio Honkan.');
                    return;
                }
                const keywords = ['vidrio', 'tejas', 'madera', 'corona', 'acero'];
                const found = keywords.filter(w => val.includes(w));
                if (found.length < 2) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('FALTAN PALABRAS CLAVE', `Para enriquecer tu análisis, menciona al menos 2 materiales o términos clave (como: ${keywords.join(', ')}).`);
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_20_museum', {type:'text', data: input.value}, role);
            });
        }
    },

    "day_20_vintage": {
        tag: "economy",
        day: 20,
        title: "Análisis de Precios Retro",
        role: "kid14",
        xp: 15,
        location: "Ameyoko",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> PROTOCOLO DE EVALUACIÓN DE BIENES RETRO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Encuentra una tienda de coleccionismo o segunda mano en Ameyoko. Registra un objeto vintage y su valor.</p>
                
                <div style="margin-bottom:10px;">
                    <label style="font-size:0.75rem; color:#00ff99;">ARTÍCULO RETRO:</label>
                    <input type="text" id="v-name" placeholder="Ej: Reloj Seiko 1970..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <div style="margin-bottom:15px;">
                    <label style="font-size:0.75rem; color:#00ff99;">VALOR EN YENES (¥):</label>
                    <input type="number" id="v-price" placeholder="0000" style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <div id="v-calc" style="font-size:0.85rem; color:#ffd700; margin-bottom:15px; text-align:center; min-height:18px;"></div>
                
                <button id="btn-vintage" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">💾 REGISTRAR TASACIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-vintage');
            const nameIn = document.getElementById('v-name');
            const priceIn = document.getElementById('v-price');
            const calc = document.getElementById('v-calc');
            
            priceIn.addEventListener('input', () => {
                const y = parseFloat(priceIn.value);
                if (y > 0) {
                    const eur = (y / 160).toFixed(2);
                    calc.innerText = `Valor convertible: ~ ${eur} EUR`;
                } else {
                    calc.innerText = '';
                }
            });
            
            btn.addEventListener('click', () => {
                const name = nameIn.value.trim();
                const price = priceIn.value.trim();
                
                if (name.length < 3 || !price) {
                    showAlert('Datos insuficientes', 'Ingresa la descripción y el precio en yenes del artículo.');
                    return;
                }
                const eur = (parseFloat(price) / 160).toFixed(2);
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_20_vintage', {type:'text', data:`Objeto: ${name} | Precio: ${price}¥ (${eur}€)`}, role);
            });
        }
    },

    "day_20_stairs": {
        tag: "physical",
        day: 20,
        title: "Escaleras del Atardecer",
        role: "kid14",
        xp: 15,
        location: "Yanaka Ginza",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CENSOR DE ESCALONES: YUYAKE DANDAN</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Sube o baja las famosas escaleras que conducen al barrio histórico y cuenta con precisión cada escalón de piedra.</p>
                
                <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #333; margin-bottom:15px; text-align:center;">
                    <span style="color:#aaa; font-size:0.75rem;">REGISTRO DE ESCALONES</span>
                    <input type="number" id="s-ans" placeholder="00" style="width:100%; text-align:center; background:transparent; color:#00ff99; border:none; border-bottom:2px solid #00ff99; font-size:2.5rem; font-family:monospace; outline:none; margin-top:10px; box-sizing:border-box;">
                </div>
                
                <div id="s-msg" style="color:#ff6b6b; font-size:0.85rem; margin-bottom:15px; text-align:center; min-height:20px; font-weight:bold;"></div>
                
                <button id="btn-stairs" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; font-weight:bold;">⚡ VERIFICAR CONTEO FÍSICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-stairs');
            const input = document.getElementById('s-ans');
            const msg = document.getElementById('s-msg');
            
            btn.addEventListener('click', () => {
                const val = parseInt(input.value);
                if (val >= 34 && val <= 38) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_20_stairs', {type:'number', data: val}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    msg.innerText = ">>> ACCESO DENEGADO: El conteo difiere del registro catastral.";
                }
            });
        }
    },

    "day_20_tasting": {
        tag: "writing",
        day: 20,
        title: "Degustación Callejera",
        role: "both",
        xp: 20,
        location: "Calle",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius:15px; border:3px solid #ff9800; color:#e65100; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px;">🍡 Delicias de Yanaka Ginza 🍡</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#f57c00;">De todos los puestos callejeros y snacks probados hoy (brochetas, croquetas, dulces de gato), ¿cuál ha sido vuestro favorito y por qué?</p>
                
                <div style="background:#fff; border-radius:12px; padding:15px; border:2px dashed #ff9800; margin-bottom:15px;">
                    <textarea id="t-ans" placeholder="El mejor bocado de hoy fue... (mínimo 15 caracteres)" style="width:100%; height:70px; border:none; background:transparent; font-family:inherit; font-size:0.95rem; text-align:center; color:#e65100; outline:none; resize:none; box-sizing:border-box; margin-bottom:10px;"></textarea>
                    
                    <input type="file" id="file-input-tasting" accept="image/*" style="display:none;">
                    <div id="tasting-preview" style="display:none; border-radius:8px; overflow:hidden; border:1px solid #ffe0b2; padding:5px; background:#fff5e6; text-align:center; margin-top:8px;">
                        <span style="font-size:0.75rem; color:#ff9800; font-weight:bold;">✓ Foto del snack registrada</span>
                    </div>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-photo-tasting" class="btn-secondary" style="flex:1; background:#ffe0b2; border-color:#ff9800; color:#e65100; font-weight:bold; border-radius:25px;">📸 Foto Snack</button>
                    <button id="btn-tasting" class="btn-primary" style="flex:1; border-radius:25px; background:#ccc; border-color:#ccc; color:#666; font-family:'Quicksand', sans-serif; font-weight:bold;" disabled>😋 Registrar Degustación</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let photoId = null;
            const btn = document.getElementById('btn-tasting');
            const photoBtn = document.getElementById('btn-photo-tasting');
            const fileInput = document.getElementById('file-input-tasting');
            const previewEl = document.getElementById('tasting-preview');
            const input = document.getElementById('t-ans');
            
            const checkValidity = () => {
                const textVal = input.value.trim();
                if (photoId && textVal.length >= 15) {
                    btn.removeAttribute('disabled');
                    btn.style.background = '#ff9800';
                    btn.style.borderColor = '#ff9800';
                    btn.style.color = '#fff';
                } else {
                    btn.setAttribute('disabled', 'true');
                    btn.style.background = '#ccc';
                    btn.style.borderColor = '#ccc';
                    btn.style.color = '#666';
                }
            };
            
            input.addEventListener('input', checkValidity);
            photoBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'tasting_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            btn.addEventListener('click', () => {
                const val = input.value.trim();
                if (!photoId || val.length < 15) return;
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_20_tasting', {
                    type: 'photo',
                    data: photoId,
                    metadata: { review: val }
                }, role, true);
            });
        }
    },

"day_21_monkeys": {
        tag: "photo", day: 21, title: "Los Tres Monos", role: "kid9", xp: 15, location: "Nikko",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🙈🙉🙊 En el templo de Nikko se esconde la talla más famosa de Japón: los tres monos sabios. Uno no ve, otro no oye, y el tercero no habla. ¡Encuéntralos e imita sus poses en la foto!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B4513,#D2691E,#DEB887); border-radius:15px;">
            <p style="font-size:3rem;">🙈🙉🙊</p>
            <p style="color:#fff; font-weight:bold;">No ver, no oír, no hablar</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto Imitando a los Monos</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_21_monkeys', currentUser, false); }
    },

"day_21_dragon": {
        tag: "expert",
        day: 21,
        title: "El Latido del Dragón",
        role: "kid9",
        xp: 25,
        location: "Nikko",
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
            clicks++; speed = Math.max(300, speed - 300);
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
        tag: "expert",
        day: 21,
        title: "El Tajo del Samurái",
        role: "kid9",
        xp: 25,
        location: "Kamakura",
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
        tag: "culture",
        day: 21,
        title: "Guardián de Piedra",
        role: "kid9",
        xp: 15,
        location: "Kamakura",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #4caf50; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px;">🗿 Los Jizo de Babero Rojo 🗿</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">Encuentra una figura de piedra Jizo con su característico babero de tela roja. Hazle una foto e investiga a quiénes protege.</p>
                
                <div style="background:#fff; border-radius:12px; padding:10px; border:2px dashed #4caf50; margin-bottom:15px;">
                    <span style="font-size:3rem;">🗿🔴✨</span>
                    <input type="text" id="j-ans" placeholder="Protege a..." style="width:100%; border:2px solid #81c784; border-radius:20px; padding:8px 15px; font-family:inherit; font-size:1rem; box-sizing:border-box; margin-top:5px; text-align:center;">
                </div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; border-radius:25px; padding:12px;">📸 Sacar Foto del Jizo</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            const answer = document.getElementById('j-ans');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const ans = answer.value.trim();
                if (ans.length < 4) {
                    showAlert('Respuesta requerida', 'Averigua y escribe brevemente a quién protege la estatua Jizo (viajeros, niños...).');
                    fileInput.value = '';
                    return;
                }
                
                btn.innerText = '⏳ Procesando estatua...';
                btn.disabled = true;
                
                try {
                    const comp = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, comp);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_21_jizo', {type:'mixed', data:`Protege a: ${ans} | Foto: ${photoId}`}, role);
                } catch(err) {
                    console.error(err);
                    btn.innerText = '📸 Sacar Foto del Jizo';
                    btn.disabled = false;
                    showAlert('Error', 'Fallo al guardar imagen.');
                }
            });
        }
    },

    "day_21_buddha": {
        tag: "culture",
        day: 21,
        title: "Ingeniero Imperial",
        role: "kid14",
        xp: 20,
        location: "Kamakura",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> REGISTRO ARQUEOLÓGICO: DAIBUTSU DE KAMAKURA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Investiga los anales históricos del Gran Buda de Kamakura y registra el material metálico de fundición y su año exacto de construcción.</p>
                
                <div style="margin-bottom:10px;">
                    <label style="font-size:0.75rem; color:#00ff99;">MATERIAL DE LA ESTRUCTURA:</label>
                    <input type="text" id="b-mat" placeholder="Ej: Bronce" style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:5px; font-family:monospace; box-sizing:border-box; text-transform:uppercase;">
                </div>
                
                <div style="margin-bottom:15px;">
                    <label style="font-size:0.75rem; color:#00ff99;">AÑO DE FUNDICIÓN:</label>
                    <input type="number" id="b-year" placeholder="1200" style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <div id="b-msg" style="color:#ff6b6b; font-size:0.85rem; margin-bottom:15px; text-align:center; min-height:20px; font-weight:bold;"></div>
                
                <button id="btn-buddha" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; font-weight:bold;">🔓 ACCEDER AL ARCHIVO HISTÓRICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-buddha');
            const matIn = document.getElementById('b-mat');
            const yearIn = document.getElementById('b-year');
            const msg = document.getElementById('b-msg');
            
            btn.addEventListener('click', () => {
                const mat = matIn.value.trim().toLowerCase();
                const year = yearIn.value.trim();
                
                const correctMat = ['bronce', 'bronze'];
                
                if (correctMat.includes(mat) && year == '1252') {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_21_buddha', {type:'text', data:`Material: ${matIn.value}, Año: ${year}`}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    msg.innerText = ">>> ACCESO RECHAZADO: Datos incompatibles.";
                }
            });
        }
    },

"day_21_gold": {
        tag: "economy",
        day: 21,
        title: "Análisis de Pan de Oro",
        role: "kid14",
        xp: 20,
        location: "Templo",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #ffd700; color:#ffd700; box-shadow:0 4px 15px rgba(255,215,0,0.15);">
                <p>>>> ESTADÍSTICAS DEL TEMPLO DORADO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:12px;">Calcula el peso total en kg del oro empleado para cubrir el templo. Datos físicos:<br>• Superficie: 200 m²<br>• Grosor del pan de oro: 0,0001 m (0,1 mm)<br>• Densidad del oro: 19.300 kg/m³</p>
                
                <input type="number" id="g-ans" placeholder="Introduce el peso en kg..." style="width:100%; background:#111; color:#ffd700; border:1px solid #ffd700; padding:8px; border-radius:4px; font-family:inherit; box-sizing:border-box; margin-bottom:10px;">
                
                <button id="btn-calc" class="btn-primary" style="width:100%; border-color:#ffd700; color:#111; background:#ffd700;">Calcular Realidad</button>
                <div id="g-res" style="color:#ffd700; margin:15px 0; font-weight:bold; text-align:center;"></div>
                <button id="btn" class="btn-primary hidden" style="width:100%; border-color:#ffd700; color:#ffd700; background:transparent;">Enviar tasación</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCalc = document.getElementById('btn-calc');
            const submitBtn = document.getElementById('btn');
            const input = document.getElementById('g-ans');
            const resEl = document.getElementById('g-res');
            
            btnCalc.addEventListener('click', () => {
                const w = parseFloat(input.value);
                if (isNaN(w) || w < 380 || w > 392) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('CÁLCULO ERRÓNEO', 'El peso introducido no es correcto. Multiplica la superficie (200 m²) por el grosor (0,0001 m) y por la densidad del oro (19.300 kg/m³) para obtener la masa total real.');
                    return;
                }
                
                resEl.innerText = `Resultado analítico: ~${w.toFixed(1)} kg (Estimación Exacta)`;
                submitBtn.classList.remove('hidden');
                if (window.playProceduralSound) playProceduralSound('success');
            });
            
            submitBtn.addEventListener('click', () => {
                const w = parseFloat(input.value);
                submitMission('day_21_gold', { type: 'number', data: w }, role);
            });
        }
    },

    "day_21_tracking": {
        tag: "sensors",
        day: 21,
        title: "Rastreo de la Naturaleza",
        role: "kid14",
        xp: 25,
        location: "Nikko",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> RADAR DE SEGUIMIENTO GPS: COORDENADA NATURAL</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Calibra la distancia en tiempo real hacia los senderos históricos del bosque o cascadas de Nikko.</p>
                
                <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #333; margin-bottom:15px; display:flex; flex-direction:column; align-items:center; position:relative; overflow:hidden;">
                    <canvas id="radar-canvas" width="160" height="160" style="width:160px; height:160px; background:#050b07; border-radius:50%; border:2px solid #00ff99;"></canvas>
                    <div id="trk-dist" style="font-size:2.2rem; font-weight:bold; color:#00ff99; text-shadow:0 0 10px rgba(0,255,153,0.5); margin-top:10px;">--- m</div>
                </div>
                
                <button id="btn-start" class="btn-secondary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; padding:12px; margin-bottom:10px;">📡 INICIAR ESCANER SATELITAL</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; padding:12px;">🏁 PUNTO ALCANZADO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnStart = document.getElementById('btn-start');
            const btnSub = document.getElementById('btn-submit');
            const distEl = document.getElementById('trk-dist');
            const canvas = document.getElementById('radar-canvas');
            const ctx = canvas.getContext('2d');
            
            let watchId = null;
            const TARGET = {lat: 36.7381, lon: 139.5005};
            
            let angle = 0;
            let radarFrame = null;
            
            const drawRadar = () => {
                ctx.clearRect(0,0,canvas.width,canvas.height);
                
                ctx.strokeStyle = 'rgba(0, 255, 153, 0.2)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(80, 80, 70, 0, Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.arc(80, 80, 45, 0, Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.arc(80, 80, 20, 0, Math.PI*2); ctx.stroke();
                
                ctx.strokeStyle = '#00ff99';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(80, 80);
                const x = 80 + Math.cos(angle) * 78;
                const y = 80 + Math.sin(angle) * 78;
                ctx.lineTo(x, y);
                ctx.stroke();
                
                angle += 0.05;
                radarFrame = requestAnimationFrame(drawRadar);
            };
            
            btnStart.addEventListener('click', () => {
                btnStart.innerText = "ESCANEO ACTIVO...";
                btnStart.disabled = true;
                drawRadar();
                
                if ("geolocation" in navigator) {
                    watchId = navigator.geolocation.watchPosition((pos) => {
                        const R = 6371e3;
                        const φ1 = pos.coords.latitude * Math.PI/180;
                        const φ2 = TARGET.lat * Math.PI/180;
                        const Δφ = (TARGET.lat - pos.coords.latitude) * Math.PI/180;
                        const Δλ = (TARGET.lon - pos.coords.longitude) * Math.PI/180;
                        
                        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                                  Math.cos(φ1) * Math.cos(φ2) *
                                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
                        const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        
                        distEl.innerText = d.toFixed(1) + " m";
                        
                        if (d < 15 || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                            distEl.innerText = "🎯 BLANCO EN RANGO";
                            distEl.style.color = '#ffd700';
                            btnSub.classList.remove('hidden');
                            btnStart.classList.add('hidden');
                            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
                        }
                    }, (err) => {
                        console.error(err);
                        distEl.innerText = "🎯 LOCALIZACIÓN MANUAL";
                        btnSub.classList.remove('hidden');
                        btnStart.classList.add('hidden');
                    }, {enableHighAccuracy:true, maximumAge:0});
                } else {
                    distEl.innerText = "NO GPS SUPPORT";
                    btnSub.classList.remove('hidden');
                    btnStart.classList.add('hidden');
                }
            });
            
            btnSub.addEventListener('click', () => {
                cancelAnimationFrame(radarFrame);
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_21_tracking', {type:'game', data:'Coordenada Nikko localizada'}, role);
            });
            
            window._missionCleanup = () => {
                cancelAnimationFrame(radarFrame);
                if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            };
        }
    },

    "day_21_defense": {
        tag: "economy",
        day: 21,
        title: "Defensa del Shogunato",
        role: "kid14",
        xp: 15,
        location: "Templo/Castillo",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> MÓDULO ESTRATÉGICO MILITAR: CASTILLO DE ODAWARA / NIKKO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Analiza la topografía defensiva (fosos de agua, colinas escarpadas, murallas en zigzag) y escribe por qué era difícil de invadir. Mínimo 30 caracteres.</p>
                
                <div style="background:#111; padding:10px; border:1px dashed #00ff99; border-radius:5px; font-size:0.75rem; color:#888; margin-bottom:15px;">
                    🛡️ PARÁMETROS GEOPOLÍTICOS: foso, colina, muro, piedra, defensa.
                </div>
                
                <textarea id="d-ans" placeholder=">>> Redacta tu análisis táctico del perímetro (mín. 30 carac.)..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                
                <button id="btn-defense" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">💾 ENVIAR ANÁLISIS DE BALUARTE</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-defense');
            const input = document.getElementById('d-ans');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim().toLowerCase();
                if (val.length < 30) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('ANÁLISIS INCOMPLETO', 'Tu análisis estratégico debe tener al menos 30 caracteres.');
                    return;
                }
                const keywords = ['foso', 'colina', 'muro', 'piedra', 'defensa'];
                const found = keywords.filter(w => val.includes(w));
                if (found.length < 2) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('FALTAN TÉRMINOS CLAVE', `Menciona al menos 2 elementos militares clave de la lista: ${keywords.join(', ')}.`);
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_21_defense', {type:'text', data: input.value}, role);
            });
        }
    },

    "day_21_silence": {
        tag: "audio",
        day: 21,
        title: "La Paz de la Montaña",
        role: "both",
        xp: 20,
        location: "Templo/Tumba",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%); border-radius:15px; border:3px solid #0288d1; color:#01579b; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px;">🌸 Meditación Zen Colectiva 🌸</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#0288d1;">Frente a la tumba del Shogun, mantened silencio absoluto en familia durante 30 segundos. Si habláis o hacéis ruido, el sensor os detectará y reiniciará el tiempo.</p>
                
                <div style="display:flex; flex-direction:column; align-items:center; margin:20px 0;">
                    <div id="lotus-pulse" style="font-size:4.5rem; transition: transform 1s ease-in-out; display:inline-block;">🪷</div>
                    <div id="si-timer" style="font-size:3rem; font-weight:bold; color:#01579b; margin-top:10px; font-family:monospace;">30.0s</div>
                    <div id="si-mic-level" style="font-size:0.8rem; color:#0288d1; margin-top:5px;">Micrófono inactivo</div>
                </div>
                
                <button id="btn-start" class="btn-primary" style="width:100%; border-radius:25px; background:#0288d1; border-color:#0288d1; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;">🧘 INICIAR MINUTOS DE PAZ</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px; margin-top:10px;">📨 Sellar Acto de Silencio</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnStart = document.getElementById('btn-start');
            const btnSub = document.getElementById('btn-submit');
            const timer = document.getElementById('si-timer');
            const lotus = document.getElementById('lotus-pulse');
            const micLevelEl = document.getElementById('si-mic-level');
            
            let t = 30.0;
            let int = null;
            let lotusInt = null;
            let stream = null;
            let audioContext = null;
            let analyser = null;
            let source = null;
            let active = false;
            
            const resetMeditation = () => {
                active = false;
                clearInterval(int);
                clearInterval(lotusInt);
                t = 30.0;
                timer.innerText = '30.0s';
                timer.style.color = '#01579b';
                lotus.style.transform = 'scale(1)';
                btnStart.classList.remove('hidden');
                btnStart.innerText = '🧘 RECOMPONER MEDITACIÓN';
                micLevelEl.innerText = 'Silencio interrumpido';
                micLevelEl.style.color = '#e74c3c';
                
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                if (audioContext) {
                    audioContext.close();
                }
            };
            
            const startMeditation = async () => {
                btnStart.classList.add('hidden');
                active = true;
                t = 30.0;
                
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioContext.createAnalyser();
                    source = audioContext.createMediaStreamSource(stream);
                    source.connect(analyser);
                    analyser.fftSize = 256;
                    
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    
                    micLevelEl.innerText = '🎤 Monitorizando silencio...';
                    micLevelEl.style.color = '#2e7d32';
                    
                    const checkSilence = () => {
                        if (!active) return;
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        let average = sum / bufferLength;
                        
                        // Noise threshold: if average volume is high (e.g. > 35)
                        if (average > 35) {
                            if (window.playProceduralSound) playProceduralSound('error');
                            showAlert('RUIDO DETECTADO', 'Se ha interrumpido el recogimiento acústico. Volved a concentraros en silencio total para reiniciar la prueba.');
                            resetMeditation();
                            return;
                        }
                        requestAnimationFrame(checkSilence);
                    };
                    requestAnimationFrame(checkSilence);
                    
                } catch (e) {
                    console.log('Microphone not available, using timer-only fallback', e);
                    micLevelEl.innerText = '⚠ Micrófono no disponible (modo temporizador)';
                    micLevelEl.style.color = '#e65100';
                }
                
                if (window.playProceduralSound) playProceduralSound('click');
                
                let grow = true;
                lotusInt = setInterval(() => {
                    lotus.style.transform = grow ? 'scale(1.2)' : 'scale(1)';
                    grow = !grow;
                }, 1500);
                
                int = setInterval(() => {
                    t -= 0.1;
                    if (t <= 0) {
                        t = 0;
                        active = false;
                        clearInterval(int);
                        clearInterval(lotusInt);
                        timer.innerText = '✨ Silencio Completado';
                        timer.style.color = '#2e7d32';
                        micLevelEl.innerText = '🎤 Sesión Zen Cerrada';
                        micLevelEl.style.color = '#2e7d32';
                        btnSub.classList.remove('hidden');
                        
                        if (stream) stream.getTracks().forEach(track => track.stop());
                        
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                    } else {
                        timer.innerText = t.toFixed(1) + 's';
                    }
                }, 100);
            };
            
            btnStart.addEventListener('click', startMeditation);
            
            btnSub.addEventListener('click', () => {
                if (t > 0) return;
                submitMission('day_21_silence', { type: 'game', data: 'Silencio de 30s completado en Nikko' }, role, true);
            });
            
            window._missionCleanup = () => {
                active = false;
                clearInterval(int);
                clearInterval(lotusInt);
                if (stream) stream.getTracks().forEach(track => track.stop());
                if (audioContext) audioContext.close();
            };
        }
    },

"day_22_shout": {
        tag: "audio",
        day: 22,
        title: "Grito de Pescadero",
        role: "kid9",
        xp: 20,
        location: "Toyosu",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius:15px; border:3px solid #ff6b6b; color:#fff; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px; color:#ff6b6b;">🎙️ Saludo del Mercado Toyosu 🎙️</p>
                <p style="font-size:0.85rem; margin-bottom:12px; color:#aaa;">Los pescaderos de Toyosu saludan con fuerza extrema. Graba tu voz gritando el saludo tradicional. Se requiere al menos un 15% de pico de volumen:</p>
                
                <div style="background:rgba(255,255,255,0.05); border-radius:10px; padding:15px; border:1px solid rgba(255,255,255,0.1); margin-bottom:12px; text-align:center;">
                    <p style="font-size:1.8rem; font-weight:bold; color:#ff6b6b; text-shadow:0 0 10px rgba(255,107,107,0.5); letter-spacing:4px; margin:0 0 5px 0;">¡EE-RA-SHAI-MA-SÉ!</p>
                    <p style="color:#aaa; font-size:0.75rem; margin:0 0 10px 0;">(Irasshaimase - Significa "¡Bienvenidos!")</p>
                    <div id="vol-meter" style="width:85%; height:12px; background:#333; border-radius:6px; margin:10px auto; overflow:hidden;">
                        <div id="vol-fill" style="width:0%; height:100%; background:linear-gradient(90deg,#00ff87,#60efff); border-radius:6px; transition:width 0.1s;"></div>
                    </div>
                </div>
                
                <button id="btn-rec" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:12px; border-radius:25px; background:rgba(255,107,107,0.15); border-color:#ff6b6b; color:#ff6b6b; font-weight:bold;">🎙️ GRABAR SALUDO (3s)</button>
                <audio id="au-s" controls class="hidden" style="width:100%; margin:12px 0;"></audio>
                <button id="btn" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#ff6b6b; border-color:#ff6b6b; color:#fff; font-weight:bold; padding:12px;">📨 Enviar al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnR = document.getElementById('btn-rec');
            const au = document.getElementById('au-s');
            const btn = document.getElementById('btn');
            const volFill = document.getElementById('vol-fill');
            
            let mr = null;
            let stream = null;
            let blobId = null;
            let audioCtx = null;
            let analyser = null;
            let maxVolume = 0;
            
            btnR.addEventListener('click', async () => {
                maxVolume = 0;
                volFill.style.width = '0%';
                
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioCtx.createAnalyser();
                    const source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);
                    analyser.fftSize = 256;
                    
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    
                    let recording = true;
                    const updateMeter = () => {
                        if (!recording) return;
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        let val = sum / bufferLength;
                        let pct = Math.min(100, Math.floor((val / 128) * 100));
                        volFill.style.width = pct + '%';
                        if (pct > maxVolume) maxVolume = pct;
                        requestAnimationFrame(updateMeter);
                    };
                    updateMeter();
                    
                    mr = new MediaRecorder(stream);
                    let chunks = [];
                    mr.ondataavailable = e => chunks.push(e.data);
                    
                    mr.onstop = () => {
                        recording = false;
                        if (audioCtx) audioCtx.close();
                        
                        const blob = new Blob(chunks, { 'type': 'audio/webm' });
                        
                        if (maxVolume < 15) {
                            if (window.playProceduralSound) playProceduralSound('error');
                            showAlert('GRITO DEMASIADO SUAVE', `Tu saludo solo alcanzó un ${maxVolume}% de volumen. ¡Los mercaderes gritan con el alma! Vuelve a grabarlo con más potencia.`);
                            btnR.removeAttribute('disabled');
                            btnR.innerText = '🎙️ GRABAR OTRA VEZ';
                            volFill.style.width = '0%';
                            
                            if (stream) stream.getTracks().forEach(t => t.stop());
                        } else {
                            if (window.playProceduralSound) playProceduralSound('success');
                            au.src = URL.createObjectURL(blob);
                            au.classList.remove('hidden');
                            btnR.classList.add('hidden');
                            btn.classList.remove('hidden');
                            btn.innerText = `📨 Enviar al Juez (Volumen: ${maxVolume}%)`;
                            
                            const r = new FileReader();
                            r.readAsDataURL(blob);
                            r.onloadend = () => {
                                blobId = r.result;
                            };
                            
                            if (stream) stream.getTracks().forEach(t => t.stop());
                        }
                    };
                    
                    mr.start();
                    btnR.innerText = "🎤 GRABANDO...";
                    btnR.setAttribute('disabled', 'true');
                    
                    if (window.playProceduralSound) playProceduralSound('click');
                    
                    setTimeout(() => {
                        if (mr && mr.state === 'recording') mr.stop();
                    }, 3000);
                    
                } catch (e) {
                    showAlert('ERROR DE AUDIO', 'No se ha podido acceder al micrófono para verificar la potencia del grito.');
                }
            });
            
            btn.addEventListener('click', () => {
                if (blobId) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_22_shout', {
                        type: 'audio',
                        data: blobId,
                        metadata: { peakVolume: maxVolume }
                    }, role);
                }
            });
            
            window._missionCleanup = () => {
                if (stream) stream.getTracks().forEach(t => t.stop());
                if (audioCtx) audioCtx.close();
            };
        }
    },

"day_22_car": {
        tag: "photo",
        day: 22,
        title: "Vehículo de Lujo",
        role: "kid9",
        xp: 15,
        location: "Ginza",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg,#0f0c29 0%,#302b63 100%); border-radius:15px; border:3px solid #ffd700; color:#fff; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px; color:#ffd700;">🏎️ Superdeportivo en Ginza 🏎️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#e0e0e0;">Ginza. Fotografía un vehículo de alta gama y escribe su marca/modelo:</p>
                
                <div style="background:rgba(255,255,255,0.05); border-radius:10px; padding:12px; border:1px solid rgba(255,255,255,0.1); margin-bottom:15px; text-align:left;">
                    <label style="font-size:0.75rem; color:#aaa; display:block; margin-bottom:4px;">MARCA Y MODELO:</label>
                    <input type="text" id="car-desc" placeholder="Ej: Ferrari F8 Tributo..." style="width:100%; background:#111; color:#ffd700; border:1px solid #ffd700; padding:8px; border-radius:4px; font-family:inherit; box-sizing:border-box; margin-bottom:10px;">
                </div>

                <input type="file" id="file-input-car" accept="image/*" style="display:none;">
                <div id="car-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #ffd700; padding:5px; background:rgba(255,255,255,0.03);">
                    <span style="font-size:0.75rem; color:#ffd700; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto del vehículo registrada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-car" class="btn-secondary" style="flex:1; background:rgba(255,215,0,0.1); border-color:#ffd700; color:#ffd700; font-weight:bold; border-radius:25px;">📸 Hacer Foto</button>
                    <button id="btn-submit-car" class="btn-primary" style="flex:1; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:25px;" disabled>📨 Enviar Reporte</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let photoId = null;
            
            const fileInput = document.getElementById('file-input-car');
            const selectBtn = document.getElementById('btn-select-car');
            const submitBtn = document.getElementById('btn-submit-car');
            const previewEl = document.getElementById('car-preview');
            const descInput = document.getElementById('car-desc');
            
            const checkValidity = () => {
                const desc = descInput.value.trim();
                if (photoId && desc.length >= 3) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#ffd700';
                    submitBtn.style.borderColor = '#ffd700';
                    submitBtn.style.color = '#000';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = '#ccc';
                    submitBtn.style.borderColor = '#ccc';
                    submitBtn.style.color = '#666';
                }
            };
            
            descInput.addEventListener('input', checkValidity);
            selectBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'car_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                const desc = descInput.value.trim();
                if (!photoId || desc.length < 3) return;
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_22_car', {
                    type: 'photo',
                    data: photoId,
                    metadata: { description: desc }
                }, role);
            });
        }
    },

"day_22_elevator": {
        tag: "physical",
        day: 22,
        title: "Ascensor Infinito",
        role: "kid9",
        xp: 15,
        location: "Roppongi",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🏢 El ascensor de Roppongi Hills sube 52 pisos en segundos. ¡Es como un cohete! Cronometra cuánto tarda en llegar arriba.</p>
        <div style="background:linear-gradient(180deg,#0a0a2e,#1a1a3e); border-radius:15px; padding:20px; margin:15px 0; text-align:center; position:relative; overflow:hidden;">
            <div id="el-bg" style="position:absolute; bottom:0; left:0; width:100%; height:0%; background:linear-gradient(180deg,#00ff87,#60efff); opacity:0.15; transition:height 0.3s;"></div>
            <p style="font-size:1rem; color:#888; margin-bottom:5px;">⏱️ CRONÓMETRO DE ASCENSOR</p>
            <div id="el-timer" style="font-size:3.5rem; font-weight:bold; color:#00ff87; text-shadow:0 0 20px rgba(0,255,135,0.4); font-family:monospace;">0.0s</div>
            <div id="el-floor" style="font-size:1rem; color:#60efff; margin-top:5px;">Planta: 0</div>
        </div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px; font-size:1.1rem; padding:15px;">🚀 Puertas cerradas ¡SUBIMOS!</button>
        <button id="btn-end" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">🏁 ¡Hemos llegado!</button>
    `,
        attachEvents: () => {
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
        document.getElementById('btn-end').addEventListener('click', () => { clearInterval(int); submitMission('day_22_elevator', {type:'text', data:`Tiempo ascensor: ${document.getElementById('el-timer').innerText}`}); });
        window._missionCleanup = () => clearInterval(int);
    }
    },

"day_22_tower": {
        tag: "photo",
        day: 22,
        title: "Réplica Eiffel",
        role: "kid9",
        xp: 15,
        location: "Torre de Tokio",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🗼 ¡Ilusión óptica! Colócate lejos de la Torre de Tokio, extiende la mano y haz que parezca que la sostienes entre tus dedos como si fuera un juguete.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#ff6b35,#f7c948); border-radius:15px;">
            <p style="font-size:1rem; color:#fff;">🤏 Truco: aléjate, extiende el brazo, junta pulgar e índice</p>
            <p style="font-size:4rem; margin:10px 0;">🗼🤏</p>
            <p style="color:rgba(255,255,255,0.8); font-size:0.85rem;">¡Que parezca que la torre cabe entre tus dedos!</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Ilusión Óptica</button>
    `,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_22_tower', currentUser, false); }
    },

"day_22_jewel": {
        tag: "economy",
        day: 22,
        title: "La Joya de Ginza",
        role: "kid14",
        xp: 15,
        location: "Ginza",
        render: () => `
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
        tag: "expert",
        day: 22,
        title: "Intercepción Numérica",
        role: "kid14",
        xp: 25,
        location: "Calle",
        render: () => `
            <div class="ui-terminal" style="padding:20px; border-radius:12px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15); line-height:1.5;">
                <p>>>> INTERCEPTOR DE CLAVES DE TRANSMISIÓN (COOPERATIVO)</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Para habilitar el descifrador de la transmisión del cortafuegos de Ginza, realiza una calibración de audio digitando '123' tras escuchar el dictado de prueba:</p>
                
                <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #333; margin-bottom:15px; display:flex; align-items:center; justify-content:space-around;">
                    <button id="btn-play" class="btn-secondary" style="border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; padding:10px 15px;">🔊 ESCUCHAR CALIBRACIÓN</button>
                    <div style="font-size:1.8rem; letter-spacing:3px; color:#ffd700;" id="code-dots">***</div>
                </div>
                
                <div style="margin-bottom:15px;">
                    <input type="number" id="n-ans" placeholder="Ingresa '123'..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:12px; border-radius:6px; font-family:monospace; font-size:1.5rem; text-align:center; box-sizing:border-box; letter-spacing:5px;">
                </div>
                
                <div id="num-attempts" style="color:#ffb300; font-size:0.8rem; margin-bottom:15px; text-align:center;">Prueba de audio: 123 se pronuncia 'ichi-ni-san'.</div>
                
                <button id="btn-decrypt" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; font-weight:bold;">⚡ HABILITAR INTERCEPCIÓN CANVASS</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnPlay = document.getElementById('btn-play');
            const btnDecrypt = document.getElementById('btn-decrypt');
            const input = document.getElementById('n-ans');
            const dots = document.getElementById('code-dots');
            
            btnPlay.addEventListener('click', () => {
                if (window.playProceduralSound) playProceduralSound('click');
                const u = new SpeechSynthesisUtterance("ichi... ni... san");
                u.lang = 'ja-JP';
                u.rate = 0.75;
                window.speechSynthesis.speak(u);
            });
            
            input.addEventListener('input', (e) => {
                const len = e.target.value.length;
                dots.innerText = '*'.repeat(Math.min(3, len));
            });
            
            btnDecrypt.addEventListener('click', () => {
                const val = input.value.trim();
                if (val === '123') {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_22_numbers', {type:'game', data:`Calibrado listo`}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('Error', 'Código incorrecto. Escribe 123 para calibrar el audio.');
                }
            });
        }
    },

"day_22_fish": {
        tag: "economy",
        day: 22,
        title: "Logística del Pescado",
        role: "kid14",
        xp: 15,
        location: "Toyosu",
        correctAnswer: "Instalaciones modernas, mejor cadena de frío, higiene, más espacio",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> INFORME LOGÍSTICO REQUERIDO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:10px;">El mercado mayorista de pescado más grande del mundo se trasladó de Tsukiji a Toyosu en 2018. Estás pisando las nuevas instalaciones.</p>
            <div style="background:#0a0a0a; border-left:3px solid #0f0; padding:10px; margin:10px 0; border-radius:0 6px 6px 0;">
                <p style="color:#888; font-size:0.85rem;">📋 MISIÓN: Analiza el entorno. ¿Por qué crees que movieron el mercado? Busca pistas visuales: la limpieza, el tamaño, la tecnología...</p>
            </div>
            <textarea id="f-ans" placeholder=">>> Escribe tu análisis aquí..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px; font-family:monospace;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">📤 Transmitir Informe</button>
        </div>
    `,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => {
            const val = document.getElementById('f-ans').value;
            if(val.length < 15) { showAlert('Incompleto', 'Tu análisis necesita más detalle. Mínimo 2-3 razones.'); return; }
            submitMission('day_22_fish', {type:'text', data:val});
        }); }
    },

"day_22_compare": {
        tag: "economy",
        day: 22,
        title: "Altura Relativa",
        role: "kid14",
        xp: 15,
        location: "Torre de Tokio",
        correctAnswer: "Aprox. 1.9 (redondeando: 2)",
        render: () => `
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
    `,
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
    },

"day_22_neon": {
        tag: "photo",
        day: 22,
        title: "Luces de Neón",
        role: "both",
        xp: 20,
        location: "Ginza/Roppongi",
        render: () => `
            <div style="text-align:center; padding:20px; background:linear-gradient(135deg,#0f0c29 0%,#24243e 100%); border-radius:18px; border:3px solid #a78bfa; color:#e0e0e0; font-family:'Quicksand', sans-serif; box-shadow:0 6px 20px rgba(0,0,0,0.3);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.2rem; margin-bottom:10px; color:#a78bfa;">🌃 Luces de Neón 🌃</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#cfd8dc;">Conseguid una foto familiar nocturna rodeados de los espectaculares neones de Tokio.</p>
                
                <input type="file" id="file-input-neon" accept="image/*" style="display:none;">
                <div id="neon-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #a78bfa; padding:5px; background:rgba(255,255,255,0.05); text-align:center;">
                    <span style="font-size:0.75rem; color:#a78bfa; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto familiar nocturna registrada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-neon" class="btn-secondary" style="flex:1; background:rgba(167,139,250,0.15); border-color:#a78bfa; color:#a78bfa; font-weight:bold; border-radius:25px; padding:12px;">📸 Seleccionar Foto</button>
                    <button id="btn" class="btn-primary" style="flex:1; border-radius:25px; background:#ccc; border-color:#ccc; color:#666; font-family:'Quicksand', sans-serif; font-weight:bold; padding:12px;" disabled>📨 Enviar Foto</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let photoId = null;
            const btnSelect = document.getElementById('btn-select-neon');
            const fileInput = document.getElementById('file-input-neon');
            const submitBtn = document.getElementById('btn');
            const previewEl = document.getElementById('neon-preview');
            
            btnSelect.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'neon_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        
                        submitBtn.removeAttribute('disabled');
                        submitBtn.style.background = '#a78bfa';
                        submitBtn.style.borderColor = '#a78bfa';
                        submitBtn.style.color = '#000';
                        
                        if (window.playProceduralSound) playProceduralSound('success');
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (!photoId) return;
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_22_neon', {
                    type: 'photo',
                    data: photoId,
                    metadata: { type: 'tokyo_neon' }
                }, role, true);
            });
        }
    },

"day_23_kitkat": {
        tag: "economy",
        day: 23,
        title: "Buscador de KitKat",
        role: "kid9",
        xp: 15,
        location: "Don Quijote",
        render: () => `
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
    `,
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
            if(checked.length >= 3) submitMission('day_23_kitkat', {type:'text', data:`KitKats: ${checked.join(', ')}`});
            else showAlert('¡Sigue buscando!', 'Necesitas encontrar al menos 3 sabores raros.');
        });
    }
    },

"day_23_pokedex": {
        tag: "expert",
        day: 23,
        title: "Pokédex de Supermercado",
        role: "kid9",
        xp: 25,
        location: "Tienda",
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
        tag: "photo",
        day: 23,
        title: "Oráculo de Monedas",
        role: "kid9",
        xp: 15,
        location: "Calle",
        render: () => `
            <div style="text-align:center; padding:18px; background:linear-gradient(135deg, #f5f5f5 0%, #cfd8dc 100%); border-radius:15px; border:3px solid #d4af37; color:#37474f; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.15rem; margin-bottom:10px;">🪙 El Oráculo del Retorno 🪙</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#455a64;">Tira tus últimas monedas de yenes al suelo, hazles una foto y deja que los antiguos dioses de Japón revelen vuestro destino.</p>
                
                <div style="background:#fff; border-radius:12px; padding:15px; border:2px dashed #d4af37; margin-bottom:15px; position:relative; overflow:hidden;">
                    <div id="fortune-wheel" style="font-size:4rem; margin:10px 0; display:inline-block; transition: transform 3s cubic-bezier(0.1, 0.8, 0.2, 1);">🪙</div>
                    <div id="o-pred" class="hidden" style="margin-top:10px; padding:12px; background:#fffcf0; border:1px solid #d4af37; border-radius:8px; font-family:'Georgia', serif; font-size:1.1rem; color:#856404; font-style:italic; line-height:1.4;"></div>
                </div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; background:#d4af37; border-color:#d4af37; color:#000; font-family:'Quicksand', sans-serif; font-weight:bold; border-radius:25px; padding:12px;">📸 Foto Monedas + Revelar Fortuna</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; margin-top:10px; padding:12px;">📨 Enviar Profecía al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCam = document.getElementById('btn-cam');
            const btnSubmit = document.getElementById('btn-submit');
            const fileInput = document.getElementById('p-cam');
            const predBox = document.getElementById('o-pred');
            const wheel = document.getElementById('fortune-wheel');
            
            let finalProphecy = '';
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                btnCam.innerText = '⏳ Conectando con los espíritus...';
                btnCam.disabled = true;
                
                const degrees = 1800 + Math.floor(Math.random() * 360);
                wheel.style.transform = `rotate(${degrees}deg)`;
                
                try {
                    const comp = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, comp);
                    
                    const preds = [
                        "Volveréis a Japón antes de lo que creéis 🗾",
                        "Un gato de la suerte (Maneki-Neko) os traerá fortuna 🐱",
                        "Encontraréis un tesoro inesperado al llegar a casa 🎁",
                        "El gran espíritu del Monte Fuji siempre os guiará 🗻",
                        "Vuestro próximo viaje familiar será aún más legendario ✈️"
                    ];
                    finalProphecy = preds[Math.floor(Math.random() * preds.length)];
                    
                    setTimeout(() => {
                        predBox.innerText = `"${finalProphecy}"`;
                        predBox.classList.remove('hidden');
                        btnCam.classList.add('hidden');
                        btnSubmit.classList.remove('hidden');
                        
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                    }, 3000);
                    
                } catch(err) {
                    console.error(err);
                    btnCam.innerText = '📸 Foto Monedas + Revelar Fortuna';
                    btnCam.disabled = false;
                    showAlert('Error', 'Fallo en la conexión sagrada.');
                }
            });
            
            btnSubmit.addEventListener('click', () => {
                if (finalProphecy) {
                    submitMission('day_23_coins', {type:'mixed', data:`Profecía: ${finalProphecy}`}, role);
                }
            });
        }
    },

"day_23_mascot": {
        tag: "photo",
        day: 23,
        title: "Mascotas de Viaje",
        role: "kid9",
        xp: 15,
        location: "Hotel",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🧸 Tu compañero de viaje favorito (peluche, llavero o juguete) ha estado contigo en TODA la aventura. Antes de volver a casa, hazle un retrato de despedida de Japón. ¡Se lo merece!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#ffecd2,#fcb69f); border-radius:15px;">
            <p style="font-size:4rem;">🧸✨🗾</p>
            <p style="color:#8B4513; font-style:italic; margin-top:10px;">Gracias por acompañarme, pequeño viajero</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Retrato de Despedida</button>
    `,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_23_mascot', currentUser, false); }
    },

"day_23_tetris": {
        tag: "expert",
        day: 23,
        title: "Tetris de Maletas",
        role: "kid14",
        xp: 25,
        location: "Hotel",
        render: () => `
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
    `,
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
                tg.style.transform = `rotate(${val}deg)`;
                checkWin();
            });
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_23_tetris', {type:'game', data:'Equipaje optimizado'}));
    }
    },

"day_23_audit": {
        tag: "economy",
        day: 23,
        title: "Auditoría Final",
        role: "kid14",
        xp: 15,
        location: "Hotel",
        render: () => `
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
    `,
        attachEvents: () => {
        let tot = 0;
        document.getElementById('btn-calc').addEventListener('click', () => {
            const t1 = Number(document.getElementById('a-t1').value||0);
            const t2 = Number(document.getElementById('a-t2').value||0);
            const t3 = Number(document.getElementById('a-t3').value||0);
            const t4 = Number(document.getElementById('a-t4').value||0);
            tot = t1+t2+t3+t4;
            const eur = (tot/160).toFixed(2);
            document.getElementById('a-res').innerText = `>>> TOTAL: ${tot}¥ (≈${eur}€)`;
            document.getElementById('btn').classList.remove('hidden');
        });
        document.getElementById('btn').addEventListener('click', () => submitMission('day_23_audit', {type:'number', data:tot}));
    }
    },

"day_23_security": {
        tag: "physical",
        day: 23,
        title: "Protocolo de Embarque",
        role: "kid14",
        xp: 15,
        location: "Aeropuerto",
        render: () => `
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
    `,
        attachEvents: () => {
            let t0 = 0;
            let int = null;
            document.getElementById('btn-start').addEventListener('click', (e) => {
                t0 = Date.now();
                e.target.classList.add('hidden');
                document.getElementById('btn-end').classList.remove('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
                
                int = setInterval(() => {
                    const elapsed = (Date.now() - t0) / 1000;
                    document.getElementById('sec-timer').innerText = elapsed.toFixed(1) + 's';
                    document.getElementById('sec-fill').style.width = Math.min(100, elapsed / 300 * 100) + '%';
                }, 100);
            });
            document.getElementById('btn-end').addEventListener('click', () => {
                clearInterval(int);
                const elapsed = (Date.now() - t0) / 1000;
                if (elapsed < 10 || elapsed > 300) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('TIEMPO NO VÁLIDO', 'El tiempo registrado de paso de seguridad no coincide con los parámetros de la cola del aeropuerto (debe ser entre 10s y 300s).');
                    document.getElementById('btn-start').classList.remove('hidden');
                    document.getElementById('btn-start').innerText = '🚶 REINICIAR CONTROL';
                    document.getElementById('btn-end').classList.add('hidden');
                    document.getElementById('sec-timer').innerText = '0.0s';
                    document.getElementById('sec-fill').style.width = '0%';
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_23_security', { type: 'text', data: `Control de seguridad: ${elapsed.toFixed(1)}s` });
            });
            window._missionCleanup = () => clearInterval(int);
        }
    },

"day_23_weight": {
        tag: "economy",
        day: 23,
        title: "Peso de Carga",
        role: "kid14",
        xp: 15,
        location: "Aeropuerto",
        render: () => `
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
    `,
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
    },

"day_23_stamp": {
        tag: "photo",
        day: 23,
        title: "El Sello Final",
        role: "both",
        xp: 30,
        location: "Aeropuerto",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🔴 Misión Legendaria Conjunta: En las estaciones y aeropuertos de Japón hay tampones de tinta para sellar recuerdos. Buscad uno y conseguid el <strong>ÚLTIMO SELLO</strong> de vuestro Pasaporte de Misiones. ¡Esto es historia!</p>
        <div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(135deg,#1a0a0a,#3d0a0a); border-radius:15px; border:2px solid #d4af37;">
            <p style="font-size:4rem;">🔴✨📜</p>
            <p style="color:#d4af37; font-weight:bold; font-size:1.2rem; margin-top:10px;">El Sello que cierra la aventura</p>
            <p style="color:#888; font-size:0.85rem; margin-top:5px;">30 XP por jugador • Misión Familiar</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar el Sello Final</button>
    `,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_23_stamp', currentUser, true); }
    },

"day_24_meal": {
        tag: "photo",
        day: 24,
        title: "Comida Aérea",
        role: "kid9",
        xp: 10,
        location: "Avión",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius:15px; border:3px solid #1e88e5; color:#0d47a1; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🍱 Comida A bordo ✈️</p>
                <p style="font-size:0.85rem; margin-bottom:12px; color:#1e88e5;">Toma una foto de tu bandeja de comida a 10.000 metros de altitud y califícala:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #1e88e5; margin-bottom:15px;">
                    <span style="font-size:0.75rem; color:#aaa; display:block; margin-bottom:5px;">VALORACIÓN CULINARIA:</span>
                    <div id="star-rating" style="display:flex; justify-content:center; gap:8px; font-size:2rem; cursor:pointer;">
                        <span class="star" data-val="1" style="opacity:0.3; transition:opacity 0.2s;">⭐</span>
                        <span class="star" data-val="2" style="opacity:0.3; transition:opacity 0.2s;">⭐</span>
                        <span class="star" data-val="3" style="opacity:0.3; transition:opacity 0.2s;">⭐</span>
                        <span class="star" data-val="4" style="opacity:0.3; transition:opacity 0.2s;">⭐</span>
                        <span class="star" data-val="5" style="opacity:0.3; transition:opacity 0.2s;">⭐</span>
                    </div>
                </div>

                <input type="file" id="file-input-meal" accept="image/*" style="display:none;">
                <div id="meal-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #1e88e5; padding:5px; background:#fff;">
                    <span style="font-size:0.75rem; color:#1e88e5; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto de la bandeja registrada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-meal" class="btn-secondary" style="flex:1; background:#90caf9; border-color:#1e88e5; color:#0d47a1; font-weight:bold; border-radius:25px;">📸 Hacer Foto</button>
                    <button id="btn-submit-meal" class="btn-primary" style="flex:1; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:25px;" disabled>📨 Enviar Comida</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let rating = 0;
            let photoId = null;
            
            const stars = document.querySelectorAll('#star-rating .star');
            const fileInput = document.getElementById('file-input-meal');
            const selectBtn = document.getElementById('btn-select-meal');
            const submitBtn = document.getElementById('btn-submit-meal');
            const previewEl = document.getElementById('meal-preview');
            
            const checkValidity = () => {
                if (rating > 0 && photoId) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#1e88e5';
                    submitBtn.style.borderColor = '#1e88e5';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = '#ccc';
                    submitBtn.style.borderColor = '#ccc';
                    submitBtn.style.color = '#666';
                }
            };
            
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    rating = parseInt(star.dataset.val);
                    stars.forEach((s, idx) => {
                        s.style.opacity = (idx < rating) ? '1.0' : '0.3';
                    });
                    if (window.playProceduralSound) playProceduralSound('click');
                    checkValidity();
                });
            });
            
            selectBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'meal_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (rating <= 0 || !photoId) return;
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_24_meal', {
                    type: 'photo',
                    data: photoId,
                    metadata: { stars: rating }
                }, role);
            });
        }
    },

"day_24_clouds": {
        tag: "photo",
        day: 24,
        title: "Nubes sobre Europa",
        role: "kid9",
        xp: 10,
        location: "Avión",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius:15px; border:3px solid #ff9800; color:#e65100; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌅 Nubes sobre Europa ☁️</p>
                <p style="font-size:0.85rem; margin-bottom:12px; color:#e65100;">Mira por la ventanilla del avión, toma una última foto aérea e introduce tus reflexiones del viaje:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #ff9800; margin-bottom:15px;">
                    <textarea id="clouds-reflection" placeholder="Lo que más me gustó de este viaje fue... (mínimo 10 caracteres)" style="width:100%; height:60px; border:none; background:transparent; font-family:inherit; font-size:0.9rem; text-align:center; color:#e65100; outline:none; resize:none; box-sizing:border-box;"></textarea>
                </div>

                <input type="file" id="file-input-clouds" accept="image/*" style="display:none;">
                <div id="clouds-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #ff9800; padding:5px; background:#fff;">
                    <span style="font-size:0.75rem; color:#ff9800; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto de las nubes registrada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-clouds" class="btn-secondary" style="flex:1; background:#ffe0b2; border-color:#ff9800; color:#e65100; font-weight:bold; border-radius:25px;">📸 Hacer Foto</button>
                    <button id="btn-submit-clouds" class="btn-primary" style="flex:1; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:25px;" disabled>📨 Registrar</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let photoId = null;
            
            const fileInput = document.getElementById('file-input-clouds');
            const selectBtn = document.getElementById('btn-select-clouds');
            const submitBtn = document.getElementById('btn-submit-clouds');
            const previewEl = document.getElementById('clouds-preview');
            const refInput = document.getElementById('clouds-reflection');
            
            const checkValidity = () => {
                const txt = refInput.value.trim();
                if (photoId && txt.length >= 10) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#ff9800';
                    submitBtn.style.borderColor = '#ff9800';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = '#ccc';
                    submitBtn.style.borderColor = '#ccc';
                    submitBtn.style.color = '#666';
                }
            };
            
            refInput.addEventListener('input', checkValidity);
            selectBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'clouds_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                const txt = refInput.value.trim();
                if (!photoId || txt.length < 10) return;
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_24_clouds', {
                    type: 'photo',
                    data: photoId,
                    metadata: { reflection: txt }
                }, role);
            });
        }
    },

"day_24_turbulence": {
        tag: "physical",
        day: 24,
        title: "Cinturón Abrochado",
        role: "kid9",
        xp: 15,
        location: "Avión",
        render: () => `
            <div style="background:linear-gradient(135deg, #1a0a0a 0%, #2a1a1a 100%); border-radius:15px; padding:20px; margin:15px 0; text-align:center; border:2px solid #ff3d00; color:#fff; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(255,61,0,0.25);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px; color:#ff3d00;">⚠️ ¡TURBULENCIAS DETECTADAS! ⚠️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#ccc;">Inicia el cronómetro cuando empiece a temblar. El sensor físico debe detectar vibraciones reales agitando el móvil (>1.5 m/s²):</p>
                
                <div style="background:#0a0a0a; border-radius:12px; padding:20px; border:1px solid #ff3d00; margin-bottom:15px;">
                    <div id="tu-timer" style="font-size:3.5rem; font-weight:bold; color:#ff3d00; text-shadow:0 0 20px rgba(255,61,0,0.4); font-family:monospace;">0.0s</div>
                    <div id="tu-shake" style="font-size:0.9rem; color:#888; margin-top:5px;">Esperando turbulencia física...</div>
                </div>
                
                <button id="btn-start" class="btn-primary" style="width:100%; border-radius:25px; background:#ff3d00; border-color:#ff3d00; color:#fff; font-weight:bold; padding:12px;">💺 ¡Empieza a temblar!</button>
                <button id="btn-end" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-weight:bold; padding:12px;">✅ ¡Ya pasó!</button>
            </div>
        `,
        attachEvents: (role) => {
            const startBtn = document.getElementById('btn-start');
            const endBtn = document.getElementById('btn-end');
            const timer = document.getElementById('tu-timer');
            const statusEl = document.getElementById('tu-shake');
            
            let t0 = 0;
            let int = null;
            let active = false;
            let maxAcceleration = 0;
            
            const handleMotion = (e) => {
                if (!active) return;
                const acc = e.acceleration || { x: 0, y: 0, z: 0 };
                const totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
                if (totalAcc > maxAcceleration) {
                    maxAcceleration = totalAcc;
                }
                
                if (totalAcc > 1.5) {
                    statusEl.innerText = `¡¡VIBRACIÓN DETECTADA!! (${totalAcc.toFixed(1)} m/s²)`;
                    statusEl.style.color = '#ffeb3b';
                }
            };
            
            startBtn.addEventListener('click', () => {
                t0 = Date.now();
                active = true;
                maxAcceleration = 0;
                
                startBtn.classList.add('hidden');
                endBtn.classList.remove('hidden');
                
                statusEl.innerText = '¡Agita el móvil para simular turbulencias!';
                statusEl.style.color = '#ff9800';
                
                if (window.playProceduralSound) playProceduralSound('click');
                
                int = setInterval(() => {
                    const elapsed = (Date.now() - t0) / 1000;
                    timer.innerText = elapsed.toFixed(1) + 's';
                }, 100);
                
                if (typeof DeviceMotionEvent !== 'undefined') {
                    window.addEventListener('devicemotion', handleMotion);
                }
            });
            
            endBtn.addEventListener('click', () => {
                clearInterval(int);
                active = false;
                window.removeEventListener('devicemotion', handleMotion);
                
                const elapsed = (Date.now() - t0) / 1000;
                
                if (maxAcceleration < 1.5) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('FALTA VIBRACIÓN', 'El sensor no ha registrado turbulencias. Por favor, vuelve a iniciar y agita el dispositivo con fuerza para simular el zarandeo real del avión.');
                    
                    startBtn.classList.remove('hidden');
                    startBtn.innerText = '💺 REINTENTAR SIMULACIÓN';
                    endBtn.classList.add('hidden');
                    timer.innerText = '0.0s';
                    statusEl.innerText = 'Esperando turbulencia física...';
                    statusEl.style.color = '#888';
                    return;
                }
                
                statusEl.innerText = '¡Superviviente!';
                statusEl.style.color = '#4ade80';
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_24_turbulence', { type: 'text', data: `Turbulencia simulada: ${elapsed.toFixed(1)}s (Pico: ${maxAcceleration.toFixed(1)} m/s²)` }, role);
            });
            
            window._missionCleanup = () => {
                clearInterval(int);
                window.removeEventListener('devicemotion', handleMotion);
            };
        }
    },

"day_24_badges": {
        tag: "economy",
        day: 24,
        title: "Recuento de Sellos",
        role: "kid9",
        xp: 15,
        location: "Avión",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🏆 Es hora de contar tus victorias. La app revisará todas las misiones que has completado durante los 24 días. ¿Cuántas has superado?</p>
        <div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(135deg,#1a1a2e,#2a1a3e); border-radius:15px; border:1px solid rgba(212,175,55,0.3);">
            <div id="bdg-icon" style="font-size:4rem;">🏆</div>
            <div id="bdg-res" style="font-size:2.5rem; font-weight:bold; color:#d4af37; text-shadow:0 0 15px rgba(212,175,55,0.4); margin:10px 0;">...</div>
            <div id="bdg-label" style="color:#888; font-size:0.9rem;">Calculando...</div>
        </div>
        <button id="btn" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar Recuento al Juez</button>
    `,
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
        document.getElementById('bdg-label').innerText = `de ${total} posibles • ¡${count > total*0.8 ? 'LEYENDA' : count > total*0.5 ? 'Increíble' : 'Bien hecho'}!`;
        document.getElementById('btn').classList.remove('hidden');
        document.getElementById('btn').addEventListener('click', () => submitMission('day_24_badges', {type:'number', data:count}));
    }
    },

"day_24_timezones": {
        tag: "economy",
        day: 24,
        title: "Husos Horarios",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> ANÁLISIS DE SINCRONIZACIÓN TEMPORAL</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">En este momento, tres relojes del mundo marcan horas distintas. Investiga y registra la hora simultánea en cada zona (huso horario en verano: España es -7h respecto a Japón).</p>
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
            <label style="color:#0f0; font-size:0.8rem;">HORA EN JAPÓN (HH:MM):</label>
            <input type="text" id="tz-jap" placeholder="Ej: 23:30" style="width:100%; margin-bottom:8px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <label style="color:#0f0; font-size:0.8rem;">HORA EN ESPAÑA (HH:MM):</label>
            <input type="text" id="tz-esp" placeholder="Ej: 16:30" style="width:100%; margin-bottom:8px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <label style="color:#0f0; font-size:0.8rem;">HORA EN EL AVIÓN (HH:MM):</label>
            <input type="text" id="tz-air" placeholder="Ej: 19:30" style="width:100%; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
            <button id="btn" class="btn-primary" style="width:100%">📤 Transmitir Sincronización</button>
        </div>
    `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                const j = document.getElementById('tz-jap').value;
                const e = document.getElementById('tz-esp').value;
                const a = document.getElementById('tz-air').value;
                if (!j || !e || !a) {
                    showAlert('Incompleto', 'Rellena las 3 horas.');
                    return;
                }
                
                const parseMinutes = (timeStr) => {
                    const parts = timeStr.trim().split(':');
                    if (parts.length !== 2) return null;
                    const h = parseInt(parts[0]);
                    const m = parseInt(parts[1]);
                    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
                    return h * 60 + m;
                };
                
                const minJap = parseMinutes(j);
                const minEsp = parseMinutes(e);
                const minAir = parseMinutes(a);
                
                if (minJap === null || minEsp === null || minAir === null) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('FORMATO INCORRECTO', 'Escribe las horas en formato de reloj de 24 horas separado por dos puntos (Ej: 15:30).');
                    return;
                }
                
                // Summer time offset check: Japan (UTC+9) and Spain (UTC+2) has exactly 7 hours diff.
                let diff = (minJap - minEsp + 24 * 60) % (24 * 60);
                if (diff !== 7 * 60) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('HUSO HORARIO INEXACTO', 'La diferencia horaria en verano entre Japón (UTC+9) y España (UTC+2) debe ser exactamente de 7 horas.');
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_24_timezones', { type: 'text', data: `JP: ${j}, ES: ${e}, AV: ${a}` }, role);
            });
        }
    },

"day_24_distance": {
        tag: "economy",
        day: 24,
        title: "Kilometraje Total",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> REGISTRO DE DISTANCIA DE VUELO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Consulta la pantalla del asiento. ¿Cuántos kilómetros separan Tokio de casa? (Ruta típica a Europa: 9.000 - 12.000 km).</p>
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
    `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                const val = parseInt(document.getElementById('d-ans').value);
                if (isNaN(val) || val < 9000 || val > 12000) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('DISTANCIA INCOHERENTE', 'La distancia de vuelo real de vuelta a casa desde Japón debe estar comprendida entre 9.000 km y 12.000 km según el plan de vuelo oficial.');
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_24_distance', { type: 'number', data: val }, role);
            });
        }
    },

"day_24_speed": {
        tag: "physical",
        day: 24,
        title: "Velocidad de Retorno",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> LECTURA DE VELOCÍMETRO AÉREO</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">La pantalla del entretenimiento muestra la velocidad en tiempo real. Anota la velocidad máxima que alcance el avión.</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; border-radius:12px; padding:20px; border:1px solid #0f02;">
                <p style="font-size:3rem;">🛩️💨</p>
                <div id="sp-display" style="font-size:2rem; color:#60efff; font-weight:bold; margin:10px 0; font-family:monospace;">--- km/h</div>
                <p style="color:#666; font-size:0.8rem;">Velocidad crucero típica: 700-1100 km/h</p>
            </div>
            <label style="color:#0f0; font-size:0.8rem;">VELOCIDAD MÁXIMA REGISTRADA (km/h):</label>
            <input type="number" id="v-ans" placeholder="Ej: 912" style="width:100%; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:12px; border-radius:6px; font-size:1.3rem; text-align:center;">
            <button id="btn" class="btn-primary" style="width:100%">📤 Registrar Velocidad</button>
        </div>
    `,
        attachEvents: (role) => {
            const display = document.getElementById('sp-display');
            const ansInput = document.getElementById('v-ans');
            const btn = document.getElementById('btn');
            
            ansInput.addEventListener('input', (e) => {
                const v = e.target.value;
                display.innerText = v ? v + ' km/h' : '--- km/h';
                display.style.color = v >= 700 && v <= 1100 ? '#4ade80' : '#ff3d00';
            });
            btn.addEventListener('click', () => {
                const val = parseInt(ansInput.value);
                if (isNaN(val) || val < 700 || val > 1100) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('VELOCIDAD INCOHERENTE', 'La velocidad máxima de crucero registrada debe corresponder a un avión a reacción comercial (entre 700 y 1.100 km/h).');
                    return;
                }
                
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_24_speed', { type: 'number', data: val }, role);
            });
        }
    },

"day_24_log": {
        tag: "writing",
        day: 24,
        title: "Análisis del Viaje",
        role: "kid14",
        xp: 20,
        location: "Avión",
        render: () => `
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
    `,
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
    },

"day_24_sayonara": {
        tag: "writing",
        day: 24,
        title: "Sayonara Japón",
        role: "both",
        xp: 50,
        location: "Avión",
        render: () => `
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
    `,
        attachEvents: (role) => {
        document.getElementById('btn').addEventListener('click', () => {
            const m1 = document.getElementById('sy-1').value;
            const m2 = document.getElementById('sy-2').value;
            const m3 = document.getElementById('sy-3').value;
            if(m1 && m2 && m3) {
                const cel = document.getElementById('celebration-modal');
                if(cel) {
                    document.getElementById('celebration-results').innerHTML = `<p style="font-size:1.1rem; margin-bottom:10px;">Tus momentos favoritos:</p><ul style="text-align:left; line-height:2;"><li>🥇 ${m1}</li><li>🥈 ${m2}</li><li>🥉 ${m3}</li></ul><p style="margin-top:15px; color:#d4af37; font-weight:bold;">¡Sois LEYENDAS de Japón!</p>`;
                    cel.classList.remove('hidden'); launchConfetti();
                }
                submitMission('day_24_sayonara', {type:'text', data:`1:${m1}, 2:${m2}, 3:${m3}`}, role, true);
            } else { showAlert('¡Espera!', 'Los 3 momentos son obligatorios. ¡Piénsalo bien!'); }
        });
    }
    }
});
