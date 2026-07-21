// Auto-generated block of missions
if (typeof MISSIONS_CONFIG === 'undefined') {
    var MISSIONS_CONFIG = {};
}

Object.assign(MISSIONS_CONFIG, {
    "day_1_clouds": {
        tag: "photo", day: 1, title: "Formas en las Nubes", role: "kid9", xp: 10, location: "Avión",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(180deg, #a1c4fd 0%, #c2e9fb 100%); border-radius:15px; border:3px solid #ffb3d9; color:#333; position:relative; overflow:hidden;">
                <p class="mission-desc" style="font-weight:bold; margin-bottom:10px; font-family:'Quicksand', sans-serif;">☁️ ¡Dibuja la silueta de nube mágica que ves por la ventana! 🎨</p>
                <div style="background:#fff; border-radius:10px; padding:5px; border:2px solid #ffb3d9; margin-bottom:10px;">
                    <canvas id="cloud-paint-canvas" width="280" height="150" style="display:block; width:100%; height:150px; background:#fff; border-radius:8px; cursor:crosshair; touch-action:none;"></canvas>
                </div>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <button id="btn-clear-paint" class="btn-secondary" style="flex:1; background:#ff80b3; border-color:#ff80b3; color:#fff; border-radius:20px; font-size:0.9rem; padding:5px; font-family:'Quicksand', sans-serif;">🧹 Borrar</button>
                    <button id="btn-save-paint" class="btn-primary" style="flex:1; background:#4caf50; border-color:#4caf50; color:#fff; border-radius:20px; font-size:0.9rem; padding:5px; font-family:'Quicksand', sans-serif;">💾 Confirmar Dibujo</button>
                </div>
                <div id="cam-section" class="hidden">
                    <p style="font-size:0.85rem; color:#666; font-style:italic; margin-bottom:10px;">¡Dibujo guardado! Ahora toma la foto de la nube real para contrastar:</p>
                    <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#ff80b3; border-color:#ff80b3; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px; box-shadow:0 4px 10px rgba(255,128,179,0.3);">📸 Capturar Nube Real</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            const canvas = document.getElementById('cloud-paint-canvas');
            const ctx = canvas.getContext('2d');
            const btnClear = document.getElementById('btn-clear-paint');
            const btnSave = document.getElementById('btn-save-paint');
            const camSec = document.getElementById('cam-section');
            
            ctx.strokeStyle = '#a1c4fd';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            let drawing = false;
            let strokes = 0;
            
            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * (canvas.width / rect.width),
                    y: (clientY - rect.top) * (canvas.height / rect.height)
                };
            };
            
            const startDraw = (e) => {
                e.preventDefault();
                drawing = true;
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                strokes++;
                if (window.playProceduralSound) playProceduralSound('click');
            };
            
            const draw = (e) => {
                if (!drawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            };
            
            const stopDraw = () => {
                drawing = false;
            };
            
            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDraw);
            canvas.addEventListener('mouseleave', stopDraw);
            
            canvas.addEventListener('touchstart', startDraw, { passive: false });
            canvas.addEventListener('touchmove', draw, { passive: false });
            canvas.addEventListener('touchend', stopDraw);
            
            btnClear.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                strokes = 0;
                camSec.classList.add('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btnSave.addEventListener('click', () => {
                if (strokes === 0) {
                    showAlert('DIBUJO VACÍO', '¡Dibuja algo en el cielo primero!');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                camSec.classList.remove('hidden');
            });
            
            attachCameraFlow('btn-cam', 'day_1_clouds', role, false);
        }
    },

    "day_1_customs": {
        tag: "expert",
        day: 1,
        title: "Infiltración en Aduanas",
        role: "kid14",
        xp: 25,
        location: "Aeropuerto",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99;">
                <p>>>> INFILTRACIÓN DE DATOS DE FRONTERA</p>
                <p style="color:#aaa;">Japón requiere declarar divisas por encima de cierto valor.</p>
                <div style="margin:15px 0; padding:10px; background:rgba(0,255,153,0.1); border:1px dashed #00ff99; border-radius:5px;">
                    <p style="margin:0; font-size:1.2rem; text-align:center;">LÍMITE LEGAL REQUERIDO:</p>
                    <p id="customs-display" style="font-size:2.2rem; font-weight:bold; text-align:center; margin:10px 0; color:#ffd700;">¥ 500.000</p>
                    <input type="range" id="customs-slider" min="100000" max="3000000" step="100000" value="500000" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                </div>
                <p id="customs-status" style="font-size:0.85rem; color:#ffd700; text-align:center; min-height:1.2rem;">>>> Ajusta el dial al límite legal</p>
                <button id="btn-customs" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; margin-top:10px;">EJECUTAR HACKING</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('customs-slider');
            const display = document.getElementById('customs-display');
            const status = document.getElementById('customs-status');
            const btn = document.getElementById('btn-customs');
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                display.innerText = '¥ ' + val.toLocaleString('ja-JP');
                if (val === 1000000) {
                    status.innerText = '>>> ¡VALOR CORRECTO DETECTADO! (1.000.000 ¥)';
                    status.style.color = '#00ff99';
                } else {
                    status.innerText = '>>> Límite incorrecto. Ajustando frecuencias...';
                    status.style.color = '#ffd700';
                }
            });
            btn.addEventListener('click', () => {
                const val = parseInt(slider.value);
                if (val === 1000000) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_1_customs', {type:'number', data: 1000000}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('ERROR DE HACKEO', 'El valor no coincide con el protocolo oficial de aduanas japonés.');
                }
            });
        }
    },

    "day_1_bingo": {
        tag: "game",
        day: 1,
        title: "Bingo Aeroportuario",
        role: "kid9",
        xp: 15,
        location: "Aeropuerto",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius:15px; border:3px solid #ffb74d; color:#5d4037;">
                <p class="mission-desc" style="font-family:'Quicksand', sans-serif; font-weight:bold;">✨ ¡Colecciona los Cromos del Aeropuerto! ✨</p>
                <p style="font-size:0.8rem; margin-bottom:15px; color:#795548;">Busca y toca cada uno en la realidad. También debes tomar al menos una foto de prueba.</p>
                <div class="bingo-grid" id="b-grid" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; margin-bottom:15px;">
                    <div class="bingo-card" data-val="av" style="padding:15px; background:#fff; border:2px dashed #ffb74d; border-radius:10px; cursor:pointer; font-size:2rem; transition:all 0.3s ease; position:relative;">
                        ✈️<br><span style="font-size:0.8rem; font-weight:bold; color:#795548;">Letrero VLC</span>
                        <div class="sticker-sparkle" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,215,0,0.15); border-radius:8px; opacity:0; pointer-events:none;"></div>
                    </div>
                    <div class="bingo-card" data-val="pi" style="padding:15px; background:#fff; border:2px dashed #ffb74d; border-radius:10px; cursor:pointer; font-size:2rem; transition:all 0.3s ease; position:relative;">
                        👨‍✈️<br><span style="font-size:0.8rem; font-weight:bold; color:#795548;">Piloto</span>
                        <div class="sticker-sparkle" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,215,0,0.15); border-radius:8px; opacity:0; pointer-events:none;"></div>
                    </div>
                    <div class="bingo-card" data-val="ma" style="padding:15px; background:#fff; border:2px dashed #ffb74d; border-radius:10px; cursor:pointer; font-size:2rem; transition:all 0.3s ease; position:relative;">
                        🧳<br><span style="font-size:0.8rem; font-weight:bold; color:#795548;">Maleta Roja</span>
                        <div class="sticker-sparkle" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,215,0,0.15); border-radius:8px; opacity:0; pointer-events:none;"></div>
                    </div>
                    <div class="bingo-card" data-val="pa" style="padding:15px; background:#fff; border:2px dashed #ffb74d; border-radius:10px; cursor:pointer; font-size:2rem; transition:all 0.3s ease; position:relative;">
                        🛂<br><span style="font-size:0.8rem; font-weight:bold; color:#795548;">Pasaporte</span>
                        <div class="sticker-sparkle" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,215,0,0.15); border-radius:8px; opacity:0; pointer-events:none;"></div>
                    </div>
                </div>
                <div style="margin-bottom:15px;">
                    <button id="btn-bingo-photo" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#ffb74d; border-color:#ffb74d; color:#fff; font-weight:bold; border-radius:20px; padding:8px 15px;">📸 Tomar Foto de Prueba</button>
                    <input type="file" id="input-bingo-photo" accept="image/*" capture="environment" style="display:none;">
                    <p id="bingo-photo-status" style="font-size:0.8rem; color:#795548; margin-top:5px;">(Falta foto de prueba)</p>
                </div>
                <button id="btn-b" class="btn-primary hidden" style="width:100%; font-family:'Quicksand', sans-serif; background:#ff9800; border-color:#ff9800; color:#fff; font-weight:bold; border-radius:20px; box-shadow:0 4px 10px rgba(255,152,0,0.4);">🎉 ¡Bingo Completado! 🎉</button>
            </div>
        `,
        attachEvents: (role) => {
            let found = 0;
            let photoId = null;
            const cards = document.querySelectorAll('.bingo-card');
            const btn = document.getElementById('btn-b');
            const btnPhoto = document.getElementById('btn-bingo-photo');
            const inputPhoto = document.getElementById('input-bingo-photo');
            const photoStatus = document.getElementById('bingo-photo-status');
            
            const checkCompletion = () => {
                if (found === 4 && photoId) {
                    btn.classList.remove('hidden');
                } else {
                    btn.classList.add('hidden');
                }
            };
            
            cards.forEach(c => {
                c.addEventListener('click', function() {
                    if (!this.classList.contains('flipped')) {
                        this.classList.add('flipped');
                        this.style.background = '#fff9c4';
                        this.style.borderStyle = 'solid';
                        this.style.borderColor = '#ffeb3b';
                        this.style.boxShadow = '0 0 10px #ffeb3b';
                        const sparkle = this.querySelector('.sticker-sparkle');
                        if (sparkle) sparkle.style.opacity = '1';
                        found++;
                        if (window.playProceduralSound) playProceduralSound('click');
                        checkCompletion();
                    }
                });
            });
            
            btnPhoto.addEventListener('click', () => {
                inputPhoto.click();
            });
            
            inputPhoto.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                btnPhoto.innerText = '⏳ Procesando...';
                btnPhoto.disabled = true;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const MAX_SIZE = 800;
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressed = canvas.toDataURL('image/jpeg', 0.7);
                        
                        photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                        try {
                            await window.savePhotoToDB(photoId, compressed);
                            photoStatus.innerText = '✅ ¡Foto de prueba lista!';
                            photoStatus.style.color = '#4caf50';
                            photoStatus.style.fontWeight = 'bold';
                            btnPhoto.innerText = '📸 Cambiar Foto';
                            btnPhoto.disabled = false;
                            if (window.playProceduralSound) playProceduralSound('success');
                            checkCompletion();
                        } catch (err) {
                            console.error(err);
                            showAlert('Error', 'No se pudo guardar la foto.');
                            btnPhoto.innerText = '📸 Tomar Foto de Prueba';
                            btnPhoto.disabled = false;
                        }
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });

            btn.addEventListener('click', () => {
                if (found === 4 && photoId) {
                    submitMission('day_1_bingo', {type:'photo', data: photoId}, role);
                }
            });
        }
    },

    "day_1_balance": {
        tag: "sensors",
        day: 1,
        title: "Equilibrio a 10.000 Metros",
        role: "kid9",
        xp: 20,
        location: "Avión",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(180deg, #fffde7 0%, #fff9c4 100%); border-radius:15px; border:3px solid #ffd54f; color:#5d4037; font-family:'Quicksand', sans-serif;">
                <p class="mission-desc" style="font-weight:bold;">🍵 El Té del Emperador 🍵</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#795548;">Entrena el pulso de un samurái. Coloca el móvil plano sobre la bandeja. No inclines la taza más de 15 grados durante 20 segundos.</p>
                
                <div style="width:140px; height:140px; border-radius:50%; background:#fff; border:4px solid #ffd54f; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow:inset 0 2px 5px rgba(0,0,0,0.1);">
                    <div id="lvl-bubble-container" style="position:relative; width:100%; height:100%; transition:transform 0.1s ease-out;">
                        <span id="lvl-tea-cup" style="font-size:4rem; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); transition: transform 0.1s ease; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));">🍵</span>
                    </div>
                    <div style="position:absolute; width:40px; height:40px; border:2px dashed #ff5722; border-radius:50%; pointer-events:none;"></div>
                </div>
                
                <p id="lvl-timer" style="font-size:2.2rem; font-weight:bold; margin:10px 0; font-family:monospace;">20.0s</p>
                <button id="btn-start-balance" class="btn-primary" style="width:100%; border-radius:25px; background:#ffd54f; border-color:#ffd54f; color:#5d4037; font-weight:bold; font-family:'Quicksand', sans-serif;">Calibrar y Empezar</button>
            </div>
        `,
        attachEvents: (role) => {
            let active = false;
            let timeLeft = 20.0;
            let timerInt = null;
            const cup = document.getElementById('lvl-tea-cup');
            const timerDisp = document.getElementById('lvl-timer');
            const startBtn = document.getElementById('btn-start-balance');
            
            const handleOrient = (e) => {
                if (!active) return;
                const x = e.gamma || 0;
                const y = e.beta || 0;
                
                cup.style.transform = `translate(-50%, -50%) translate(${x * 1.5}px, ${y * 1.5}px) rotate(${x}deg)`;
                
                if (Math.abs(x) > 20 || Math.abs(y) > 20) {
                    active = false;
                    clearInterval(timerInt);
                    window.removeEventListener('deviceorientation', handleOrient);
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert("¡Se ha derramado el té!", "¡Mantén el pulso firme y no inclines tanto el dispositivo! Vuelve a intentarlo.");
                    startBtn.classList.remove('hidden');
                    cup.style.transform = 'translate(-50%, -50%) rotate(90deg)';
                    timerDisp.innerText = '20.0s';
                }
            };
            
            startBtn.addEventListener('click', async (e) => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    try {
                        const p = await DeviceOrientationEvent.requestPermission();
                        if (p !== 'granted') {
                            showAlert('Permiso Denegado', 'Esta misión requiere acceso a los sensores de movimiento.');
                            return;
                        }
                    } catch (err) {
                        console.error(err);
                        showAlert('Error', 'No se pudo activar el sensor de movimiento.');
                        return;
                    }
                }
                
                startBtn.classList.add('hidden');
                active = true;
                timeLeft = 20.0;
                cup.style.transform = 'translate(-50%, -50%)';
                timerDisp.innerText = '20.0s';
                
                window.addEventListener('deviceorientation', handleOrient);
                if (window.playProceduralSound) playProceduralSound('click');
                
                timerInt = setInterval(() => {
                    timeLeft -= 0.1;
                    timerDisp.innerText = timeLeft.toFixed(1) + 's';
                    if (timeLeft <= 0) {
                        active = false;
                        clearInterval(timerInt);
                        window.removeEventListener('deviceorientation', handleOrient);
                        if (window.playProceduralSound) playProceduralSound('success');
                        submitMission('day_1_balance', {type:'sensors', data:'Equilibrio 20s completado sin derrames'}, role);
                    }
                }, 100);
            });
            
            window._missionCleanup = () => {
                active = false;
                clearInterval(timerInt);
                window.removeEventListener('deviceorientation', handleOrient);
            };
        }
    },

    "day_1_engine": {
        tag: "audio",
        day: 1,
        title: "El Escáner de Frecuencias",
        role: "kid9",
        xp: 15,
        location: "Avión",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); border-radius:15px; border:3px solid #f48fb1; color:#880e4f; font-family:'Quicksand', sans-serif;">
                <p class="mission-desc" style="font-weight:bold;">🎙️ ¡Escáner de Magia del Motor!</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#ad1457;">Acerca el micrófono a la ventanilla y mira cómo bailan las ondas de sonido.</p>
                <div style="background:#1a1a24; padding:10px; border-radius:10px; margin-bottom:15px; border:2px solid #f48fb1; position:relative;">
                    <canvas id="engine-wave" width="280" height="80" style="width:100%; height:80px; display:block; background:#111; border-radius:5px;"></canvas>
                    <div id="engine-timer" style="position:absolute; right:15px; bottom:15px; color:#ff4081; font-family:monospace; font-size:1.1rem; font-weight:bold; text-shadow:0 0 5px #000;">05.0s</div>
                </div>
                <button id="btn-rec-engine" class="btn-primary" style="width:100%; border-radius:25px; background:#ff4081; border-color:#ff4081; color:#fff; font-weight:bold;">🎤 Iniciar Escaneo (5s)</button>
                
                <div id="engine-quiz" class="hidden" style="margin-top:15px; padding:10px; background:rgba(255,255,255,0.4); border-radius:10px; border:1px dashed #f48fb1; text-align:left;">
                    <p style="font-size:0.85rem; font-weight:bold; color:#880e4f; margin-bottom:10px;">⚡ ANALIZADOR DE FRECUENCIAS:</p>
                    <p style="font-size:0.8rem; color:#ad1457; margin-bottom:8px;">Según el escaneo de ondas, ¿cuál es el tono predominante del zumbido del motor?</p>
                    <div style="display:flex; gap:10px;">
                        <button id="btn-freq-grave" class="btn-secondary" style="flex:1; background:#880e4f; border-color:#880e4f; color:#fff; font-size:0.8rem; border-radius:15px; padding:5px; font-family:'Quicksand', sans-serif;">Grave (<150 Hz)</button>
                        <button id="btn-freq-agudo" class="btn-secondary" style="flex:1; background:#ad1457; border-color:#ad1457; color:#fff; font-size:0.8rem; border-radius:15px; padding:5px; font-family:'Quicksand', sans-serif;">Agudo (>1000 Hz)</button>
                    </div>
                </div>
                
                <button id="btn-submit-engine" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-weight:bold; margin-top:10px; font-family:'Quicksand', sans-serif;">Enviar Análisis</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec-engine');
            const btnSubmit = document.getElementById('btn-submit-engine');
            const canvas = document.getElementById('engine-wave');
            const ctx = canvas.getContext('2d');
            const timerEl = document.getElementById('engine-timer');
            const quizEl = document.getElementById('engine-quiz');
            const btnGrave = document.getElementById('btn-freq-grave');
            const btnAgudo = document.getElementById('btn-freq-agudo');
            
            let recording = false;
            let audioCtx = null;
            let analyser = null;
            let source = null;
            let stream = null;
            let animationFrame = null;
            let dataArray = [];
            let timeLeft = 5.0;
            let interval = null;
            let selectedFreq = '';
            
            const drawWave = () => {
                if (!recording) return;
                animationFrame = requestAnimationFrame(drawWave);
                
                analyser.getByteTimeDomainData(dataArray);
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.lineWidth = 3;
                const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
                grad.addColorStop(0, '#ff4081');
                grad.addColorStop(0.5, '#e040fb');
                grad.addColorStop(1, '#ff4081');
                ctx.strokeStyle = grad;
                ctx.beginPath();
                
                const sliceWidth = canvas.width / dataArray.length;
                let x = 0;
                
                for (let i = 0; i < dataArray.length; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * canvas.height) / 2;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            };
            
            btnRec.addEventListener('click', async () => {
                if (recording) return;
                
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    audioCtx = new AudioContextClass();
                    analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 256;
                    
                    source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);
                    
                    dataArray = new Uint8Array(analyser.frequencyBinCount);
                    recording = true;
                    timeLeft = 5.0;
                    timerEl.innerText = '05.0s';
                    btnRec.disabled = true;
                    btnRec.innerText = '⏳ Grabando...';
                    
                    drawWave();
                    
                    interval = setInterval(() => {
                        timeLeft -= 0.1;
                        if (timeLeft <= 0) {
                            timeLeft = 0;
                            clearInterval(interval);
                            recording = false;
                            cancelAnimationFrame(animationFrame);
                            
                            stream.getTracks().forEach(t => t.stop());
                            if (audioCtx) audioCtx.close();
                            
                            ctx.fillStyle = '#111';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.beginPath();
                            ctx.moveTo(0, canvas.height/2);
                            ctx.lineTo(canvas.width, canvas.height/2);
                            ctx.strokeStyle = '#ff4081';
                            ctx.stroke();
                            
                            timerEl.innerText = '00.0s';
                            btnRec.innerText = '✨ Grabado';
                            quizEl.classList.remove('hidden');
                            if (window.playProceduralSound) playProceduralSound('success');
                        } else {
                            timerEl.innerText = `${timeLeft.toFixed(1)}s`;
                        }
                    }, 100);
                    
                } catch (err) {
                    console.error(err);
                    showAlert('Error', 'No se pudo acceder al micrófono para el escaneo.');
                }
            });
            
            btnGrave.addEventListener('click', () => {
                selectedFreq = 'Grave';
                btnGrave.style.border = '2px solid #4caf50';
                btnAgudo.style.border = 'none';
                btnSubmit.classList.remove('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btnAgudo.addEventListener('click', () => {
                selectedFreq = 'Agudo';
                btnAgudo.style.border = '2px solid #f44336';
                btnGrave.style.border = 'none';
                btnSubmit.classList.add('hidden');
                if (window.playProceduralSound) playProceduralSound('error');
                showAlert('FRECUENCIA ERRÓNEA', 'Los motores a reacción emiten un zumbido subsónico de baja frecuencia (Grave). Revisa tu respuesta.');
            });

            btnSubmit.addEventListener('click', () => {
                if (selectedFreq === 'Grave') {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_1_engine', {type: 'audio', data: 'Sonido del motor analizado. Frecuencia correctamente identificada como Grave (<150Hz).'}, role);
                }
            });

            window._missionCleanup = () => {
                recording = false;
                clearInterval(interval);
                if (animationFrame) cancelAnimationFrame(animationFrame);
                if (stream) stream.getTracks().forEach(t => t.stop());
                if (audioCtx) audioCtx.close();
            };
        }
    },

    "day_1_navigator": {
        tag: "writing",
        day: 1,
        title: "Navegante de Altura",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> PROTOCOLO DE VUELO: NAVEGADOR DE ALTURA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:10px;">Consulta la pantalla del avión e introduce la telemetría actual.</p>
                <input type="number" id="nav-alt" placeholder="Altitud actual (pies, ej: 35000)..." style="width:100%; margin-bottom:10px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; box-sizing:border-box;">
                <input type="number" id="nav-spd" placeholder="Velocidad actual (km/h, ej: 900)..." style="width:100%; margin-bottom:10px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; box-sizing:border-box;">
                
                <p style="color:#ffd700; font-size:0.8rem; margin:15px 0 5px 0;">⚡ RETO DE CÁLCULO DE NAVEGACIÓN:</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:10px;">Si quedan <span style="color:#00ff99; font-weight:bold;">3.600 km</span> para llegar a Tokio y viajas a la velocidad indicada, ¿cuántas horas exactas de vuelo quedan?</p>
                <input type="number" step="0.1" id="nav-eta" placeholder="Horas restantes (ej: 4.0)..." style="width:100%; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; box-sizing:border-box;">
                
                <button id="btn-nav-submit" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">ENVIAR DATOS TELEMÉTRICOS</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn-nav-submit').addEventListener('click', () => {
                const alt = document.getElementById('nav-alt').value;
                const spd = parseFloat(document.getElementById('nav-spd').value);
                const eta = parseFloat(document.getElementById('nav-eta').value);
                
                if (!alt || !spd || !eta) {
                    showAlert('DATOS INCOMPLETOS', 'Por favor, rellena todos los parámetros telemétricos.');
                    return;
                }
                
                const expectedEta = parseFloat((3600 / spd).toFixed(1));
                const difference = Math.abs(eta - expectedEta);
                
                if (difference <= 0.2) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_1_navigator', {type:'text', data:`Alt: ${alt}ft, Vel: ${spd}km/h, ETA calculado: ${eta}h (Esperado: ${expectedEta}h)`}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('CÁLCULO ERRÓNEO', `Tu estimación de tiempo restante (${eta}h) no coincide con los datos físicos (3600 km / ${spd} km/h = ${expectedEta}h). Recalcula con precisión.`);
                }
            });
        }
    },

    "day_1_timezone": {
        tag: "economy",
        day: 1,
        title: "Reloj Samurái del Sueño",
        role: "kid14",
        xp: 15,
        location: "Avión",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> SENSOR DE SUEÑO Y CRONOBIOLOGÍA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:10px;">Calcula el desfase para mitigar el jetlag en vuelo. Japón va <span style="color:#00ff99; font-weight:bold;">+7 horas</span> por delante de Madrid.</p>
                
                <div style="background:rgba(255,255,255,0.05); border:1px solid #00ff99; border-radius:5px; padding:12px; margin-bottom:15px; text-align:center;">
                    <p style="margin:0 0 10px 0; font-size:0.9rem; font-weight:bold; color:#ffd700;">🔮 ENIGMA DE BIOCRONOLOGÍA:</p>
                    <p style="margin:0; font-size:0.8rem; line-height:1.4;">"Si quieres acostarte en Tokio a las <span style="color:#00ff99; font-weight:bold;">22:00</span> para adaptarte al horario nipón, ¿qué hora marcaría tu reloj biológico de Madrid en ese preciso instante?"</p>
                </div>
                
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                    <input type="number" id="timezone-ans-h" placeholder="Hora (0-23)..." style="flex:1; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; font-family:monospace; box-sizing:border-box;">
                    <span style="font-weight:bold; color:#00ff99;">:</span>
                    <input type="number" id="timezone-ans-m" placeholder="Minutos (0-59)..." style="flex:1; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; font-family:monospace; box-sizing:border-box;" value="0">
                </div>
                
                <button id="btn-timezone" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">SINCRONIZAR CRONOS</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-timezone');
            btn.addEventListener('click', () => {
                const h = parseInt(document.getElementById('timezone-ans-h').value);
                const m = parseInt(document.getElementById('timezone-ans-m').value);
                
                if (isNaN(h) || isNaN(m)) {
                    showAlert('VALOR INCOMPLETO', 'Por favor, introduce la hora y los minutos.');
                    return;
                }
                
                if (h === 15 && m === 0) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_1_timezone', {type:'text', data: '22:00 Tokio = 15:00 Madrid (Jetlag Sincronizado)'}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('HORA INCORRECTA', 'Ese desfase alteraría tu ciclo del sueño. Resta 7 horas a las 22:00.');
                }
            });
        }
    },

    "day_1_exchange": {
        tag: "economy",
        day: 1,
        title: "El Precio del Yen",
        role: "kid14",
        xp: 15,
        location: "Aeropuerto",
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
        tag: "writing",
        day: 1,
        title: "Apuesta del Aterrizaje",
        role: "both",
        xp: 25,
        location: "Avión",
        render: () => `
            <p class="mission-desc">¡Misión de equipo! Escribid juntos 3 cosas raras, locas o increíbles que creéis que veréis en Japón durante el viaje.</p>
            <textarea id="ans" style="width:100%; height:100px; margin-bottom:10px;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">Sellar Apuesta</button>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_1_bets', {type:'text', data:document.getElementById('ans').value}, role, true)); }
    },

"day_2_vending": {
        tag: "photo",
        day: 2,
        title: "El Detective de Vending",
        role: "kid9",
        xp: 15,
        location: "Calle",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius:15px; border:3px solid #1e88e5; color:#0d47a1; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🥤 Detective de Vending 🥤</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#1565c0;">Las máquinas expendedoras en Japón venden cosas locas. Encuentra una máquina real, sácale una foto y selecciona al menos una bebida exótica o curiosa que hayas visto en ella:</p>
                
                <div style="background:#fff; border-radius:10px; padding:10px; border:2px dashed #1e88e5; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#1e88e5; margin:0 0 8px 0;">BEBIDAS EXTRAÑAS OBSERVADAS:</p>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px;">
                        <button type="button" class="btn-drink-tag" data-val="Té verde caliente" style="padding:6px; font-size:0.75rem; border:1px solid #ccc; background:#fff; border-radius:5px; cursor:pointer; font-family:'Quicksand';">🍵 Té Verde</button>
                        <button type="button" class="btn-drink-tag" data-val="Café en lata" style="padding:6px; font-size:0.75rem; border:1px solid #ccc; background:#fff; border-radius:5px; cursor:pointer; font-family:'Quicksand';">☕ Café en lata</button>
                        <button type="button" class="btn-drink-tag" data-val="Sopa de maíz caliente" style="padding:6px; font-size:0.75rem; border:1px solid #ccc; background:#fff; border-radius:5px; cursor:pointer; font-family:'Quicksand';">🌽 Sopa de maíz</button>
                        <button type="button" class="btn-drink-tag" data-val="Refresco de uva" style="padding:6px; font-size:0.75rem; border:1px solid #ccc; background:#fff; border-radius:5px; cursor:pointer; font-family:'Quicksand';">🍇 Jelly de uva</button>
                    </div>
                </div>

                <div style="margin-bottom:15px;">
                    <button type="button" id="btn-select-file" class="btn-secondary" style="width:100%; margin-bottom:8px; font-family:'Quicksand';">📸 Hacer Foto de la Máquina</button>
                    <input type="file" id="vending-photo-input" accept="image/*" style="display:none;">
                    <div id="vending-photo-preview" style="display:none; margin-top:10px; font-size:0.85rem; color:#2e7d32; font-weight:bold;">✅ ¡Foto cargada correctamente!</div>
                </div>
                
                <button id="btn-submit-vending" class="btn-primary" style="width:100%; border-radius:25px; font-family:'Quicksand'; font-weight:bold;" disabled>Enviar Reporte</button>
            </div>
        `,
        attachEvents: (role) => {
            const selectFileBtn = document.getElementById('btn-select-file');
            const fileInput = document.getElementById('vending-photo-input');
            const previewEl = document.getElementById('vending-photo-preview');
            const submitBtn = document.getElementById('btn-submit-vending');
            const drinkTags = document.querySelectorAll('.btn-drink-tag');
            
            let photoId = null;
            let selectedDrinks = [];
            
            drinkTags.forEach(tag => {
                tag.addEventListener('click', () => {
                    const drinkVal = tag.dataset.val;
                    if (selectedDrinks.includes(drinkVal)) {
                        selectedDrinks = selectedDrinks.filter(d => d !== drinkVal);
                        tag.style.background = '#fff';
                        tag.style.borderColor = '#ccc';
                        tag.style.color = '#333';
                    } else {
                        selectedDrinks.push(drinkVal);
                        tag.style.background = '#e3f2fd';
                        tag.style.borderColor = '#1e88e5';
                        tag.style.color = '#0d47a1';
                    }
                    if (window.playProceduralSound) playProceduralSound('click');
                    checkValidity();
                });
            });

            selectFileBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'vending_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });

            const checkValidity = () => {
                if (photoId && selectedDrinks.length > 0) {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            };

            submitBtn.addEventListener('click', () => {
                submitMission('day_2_vending', {
                    type: 'photo',
                    data: photoId,
                    metadata: { drinks: selectedDrinks }
                }, role);
            });
        }
    },

    "day_2_maze": {
        tag: "expert",
        day: 2,
        title: "Infiltración en la Terminal",
        role: "kid14",
        xp: 20,
        location: "Aeropuerto KIX",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99;">
                <p>>>> OPERATIVO DE ATERRIZAJE - TIEMPO DE DESEMBARQUE</p>
                <p style="color:#aaa;">Inicia el cronómetro cuando pongas un pie fuera del avión y deténlo cuando salgas a la calle tras recoger maletas y pasar inmigración.</p>
                <div id="chrono-container" style="margin:20px 0;"></div>
                <input type="hidden" id="ans" value="">
                <button id="btn-maze" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">ENVIAR REPORTE TÁCTICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const container = document.getElementById('chrono-container');
            const input = document.getElementById('ans');
            const btn = document.getElementById('btn-maze');
            
            initSpyStopwatch(container, (timeStr) => {
                input.value = timeStr;
            });

            btn.addEventListener('click', () => {
                if (!input.value || input.value === '00:00.0') {
                    showAlert('ERROR DE TELEMETRÍA', 'Debes iniciar y pausar el cronómetro para registrar un tiempo real.');
                    return;
                }
                submitMission('day_2_maze', {type:'text', data:`Tiempo de escape: ${input.value}`}, role);
            });
        }
    },

    "day_2_kanji": {
        tag: "writing",
        day: 2,
        title: "Kanjis de Emergencia",
        role: "kid14",
        xp: 15,
        location: "Aeropuerto / Hotel",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99;">
                <p>>>> PROTOCOLO DE ORIENTACIÓN: SEÑALES DE EVACUACIÓN</p>
                <p style="color:#aaa;">Haz clic sobre el cartel verde oficial que representa la "Salida de Emergencia":</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin:15px 0;">
                    <div class="kanji-option" data-correct="false" style="padding:12px; border:1px solid #333; border-radius:5px; text-align:center; cursor:pointer; background:#111;">
                        <span style="font-size:1.5rem; font-weight:bold; color:#ff5555;">出口</span><br>
                        <span style="font-size:0.75rem; color:#666;">(Salida común)</span>
                    </div>
                    <div class="kanji-option" data-correct="true" style="padding:12px; border:1px solid #333; border-radius:5px; text-align:center; cursor:pointer; background:#111; display:flex; align-items:center; justify-content:center; gap:10px;">
                        <div style="width:24px; height:24px; background:#00aa50; border-radius:3px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.8rem; font-weight:bold;">🏃</div>
                        <div>
                            <span style="font-size:1.5rem; font-weight:bold; color:#00ff00;">非常口</span>
                        </div>
                    </div>
                    <div class="kanji-option" data-correct="false" style="padding:12px; border:1px solid #333; border-radius:5px; text-align:center; cursor:pointer; background:#111;">
                        <span style="font-size:1.5rem; font-weight:bold; color:#5555ff;">改札口</span><br>
                        <span style="font-size:0.75rem; color:#666;">(Tornos de billetes)</span>
                    </div>
                </div>
                <div id="translation-section" class="hidden">
                    <p style="color:#00ff99;">>>> Cartel verificado. Introduce la traducción al rōmaji o español (ej: "hijouguchi" o "salida de emergencia"):</p>
                    <input type="text" id="kanji-ans" style="width:100%; margin-bottom:10px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:5px;">
                    <button id="btn-kanji" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">EJECUTAR DECODIFICACIÓN</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            const options = document.querySelectorAll('.kanji-option');
            const transSection = document.getElementById('translation-section');
            const input = document.getElementById('kanji-ans');
            const btn = document.getElementById('btn-kanji');
            
            options.forEach(opt => {
                opt.addEventListener('click', function() {
                    options.forEach(o => o.style.borderColor = '#333');
                    if (this.dataset.correct === 'true') {
                        this.style.borderColor = '#00ff00';
                        transSection.classList.remove('hidden');
                        if (window.playProceduralSound) playProceduralSound('click');
                    } else {
                        this.style.borderColor = '#ff0000';
                        transSection.classList.add('hidden');
                        if (window.playProceduralSound) playProceduralSound('error');
                        showAlert('SEÑAL INCORRECTA', 'Ese cartel no corresponde a la salida de emergencia de evacuación verde.');
                    }
                });
            });

            btn.addEventListener('click', () => {
                const txt = input.value.toLowerCase().trim();
                const valid = ['hijouguchi', 'hijoguchi', 'hijōguchi', 'salida de emergencia', 'salida de urgencia', 'salida de escape', 'salida'];
                if (valid.includes(txt)) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_2_kanji', {type:'text', data: txt}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('ERROR DE TRADUCCIÓN', 'La traducción no es correcta. Inténtalo de nuevo.');
                }
            });
        }
    },

    "day_2_audit": {
        tag: "economy",
        day: 2,
        title: "Auditoría de Vending",
        role: "kid14",
        xp: 15,
        location: "Calle",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99;">
                <p>>>> SIMULADOR DE MÁQUINA DE VENDING (JIDOHANBAIKI)</p>
                <p style="color:#aaa;">Registra el precio real observado para la botella de agua mineral:</p>
                <div style="margin-bottom:15px;">
                    <input type="number" id="vending-observed-price" placeholder="Precio en yenes (ej: 110)..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:5px;">
                    <button id="btn-vending-set" class="btn-secondary" style="width:100%; margin-top:5px; font-size:0.8rem;">ESTABLECER PRECIO DE VENTA</button>
                </div>
                <div id="vending-machine-ui" class="hidden" style="background:#222; border:3px solid #444; border-radius:10px; padding:15px; color:#fff;">
                    <div style="display:flex; justify-content:space-between; background:#111; padding:5px; border-radius:5px; margin-bottom:15px; font-family:monospace;">
                        <span style="color:#00ff00;">CREDIT: <span id="vending-inserted">0</span>¥</span>
                        <span style="color:#ffd700;">PRICE: <span id="vending-target-price">0</span>¥</span>
                    </div>
                    <div style="text-align:center; background:#333; padding:10px; border-radius:5px; margin-bottom:15px; border:2px solid #555;">
                        <span style="font-size:2.5rem;">💧</span><br>
                        <span style="font-size:0.8rem; font-weight:bold; color:#00a2ff;">SUNTORY WATER</span><br>
                        <button id="btn-buy-water" style="margin-top:5px; background:#e74c3c; border:none; color:#fff; padding:3px 10px; border-radius:3px; font-size:0.7rem; font-weight:bold; cursor:pointer;" disabled>VENTA</button>
                    </div>
                    <p style="margin:0 0 5px 0; font-size:0.8rem; color:#aaa; text-align:center;">Hacer clic para insertar monedas:</p>
                    <div style="display:flex; justify-content:center; gap:10px;">
                        <button class="coin-btn" data-val="100" style="width:40px; height:40px; border-radius:50%; background:#ccc; color:#333; border:2px solid #999; font-weight:bold; font-size:0.75rem; cursor:pointer;">100¥</button>
                        <button class="coin-btn" data-val="50" style="width:40px; height:40px; border-radius:50%; background:#bfa38a; color:#333; border:2px solid #9e8067; font-weight:bold; font-size:0.75rem; cursor:pointer;">50¥</button>
                        <button class="coin-btn" data-val="10" style="width:40px; height:40px; border-radius:50%; background:#d48a37; color:#fff; border:2px solid #b36e22; font-weight:bold; font-size:0.75rem; cursor:pointer;">10¥</button>
                    </div>
                </div>
                <div id="vending-success-ui" class="hidden" style="text-align:center; margin-top:15px;">
                    <p style="color:#00ff00; font-weight:bold;">🍾 ¡AGUA EXPULSADA CON ÉXITO!</p>
                    <button id="btn-vending-submit" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">TRANSMITIR REPORTE DE AUDITORÍA</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            const priceInput = document.getElementById('vending-observed-price');
            const btnSet = document.getElementById('btn-vending-set');
            const machineUI = document.getElementById('vending-machine-ui');
            const successUI = document.getElementById('vending-success-ui');
            const insertedEl = document.getElementById('vending-inserted');
            const targetEl = document.getElementById('vending-target-price');
            const coinBtns = document.querySelectorAll('.coin-btn');
            const buyBtn = document.getElementById('btn-buy-water');
            const submitBtn = document.getElementById('btn-vending-submit');
            
            let targetPrice = 0;
            let inserted = 0;
            
            btnSet.addEventListener('click', () => {
                const p = parseInt(priceInput.value);
                if (isNaN(p) || p < 80 || p > 180) {
                    showAlert('PRECIO NO VÁLIDO', 'El precio observado debe estar entre 80¥ y 180¥.');
                    return;
                }
                targetPrice = p;
                targetEl.innerText = p;
                inserted = 0;
                insertedEl.innerText = 0;
                machineUI.classList.remove('hidden');
                successUI.classList.add('hidden');
                buyBtn.disabled = true;
                buyBtn.style.background = '#888';
                priceInput.disabled = true;
                btnSet.disabled = true;
            });

            coinBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = parseInt(btn.dataset.val);
                    inserted += val;
                    insertedEl.innerText = inserted;
                    if (window.playProceduralSound) playProceduralSound('click');
                    
                    if (inserted >= targetPrice) {
                        buyBtn.disabled = false;
                        buyBtn.style.background = '#00ff00';
                        buyBtn.style.boxShadow = '0 0 10px #00ff00';
                    }
                });
            });

            buyBtn.addEventListener('click', () => {
                if (inserted >= targetPrice) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    machineUI.classList.add('hidden');
                    successUI.classList.remove('hidden');
                }
            });

            submitBtn.addEventListener('click', () => {
                submitMission('day_2_audit', {type:'number', data: targetPrice}, role);
            });
        }
    },

    "day_2_yokai": {
        tag: "photo",
        day: 2,
        title: "Caza del Yōkai Oficial",
        role: "kid9",
        xp: 15,
        location: "Calle",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif;">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">👾 Radar Yōkai de las Calles 👾</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Encuentra una mascota, muñeco, estatua o cartel manga en la calle y captúralo con el Radar:</p>
                
                <div style="width:120px; height:120px; border-radius:50%; background:#1a1a24; border:5px solid #8d6e63; margin:0 auto 15px; position:relative; overflow:hidden; box-shadow:inset 0 3px 10px rgba(0,0,0,0.5);">
                    <div id="radar-sweep" style="position:absolute; top:50%; left:50%; width:80px; height:80px; background:linear-gradient(45deg, rgba(244,143,177,0.4), transparent); transform-origin: top left; animation: radarSweep 3s linear infinite; pointer-events:none;"></div>
                    <div id="radar-blip" style="position:absolute; width:10px; height:10px; border-radius:50%; background:#ff4081; top:35%; left:65%; animation: blipBlink 1.5s infinite; opacity:0; pointer-events:none;"></div>
                    <div style="display:flex; align-items:center; justify-content:center; height:100%; font-size:2.5rem; position:relative; z-index:2;">📡</div>
                </div>
                
                <p id="radar-status" style="font-size:0.8rem; color:#8d6e63; font-style:italic; min-height:1.2rem; margin-bottom:15px;">>>> Escaneando espectro espiritual...</p>
                
                <div style="background:#fff; border-radius:10px; padding:10px; border:2px dashed #8d6e63; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#8d6e63; margin:0 0 5px 0;">🛡️ CLASIFICACIÓN DEL ESPÍRITU:</p>
                    <select id="yokai-type" style="width:100%; padding:8px; border:1px solid #8d6e63; border-radius:5px; background:#fff; font-family:'Quicksand', sans-serif; font-size:0.8rem;">
                        <option value="">-- Selecciona tipo de Yōkai --</option>
                        <option value="tsukumogami">Tsukumogami (Espíritu de objeto inanimado)</option>
                        <option value="kitsune">Kitsune/Tanuki (Espíritu animal con poderes)</option>
                        <option value="oni">Oni/Tengu (Gigante, demonio o espíritu de la montaña)</option>
                        <option value="yurei">Yūrei (Fantasma o aparición humana)</option>
                    </select>
                </div>

                <div style="margin-bottom:15px;">
                    <button type="button" id="btn-select-yokai-file" class="btn-secondary" style="width:100%; margin-bottom:8px; font-family:'Quicksand'; font-weight:bold; background:#8d6e63; border-color:#8d6e63; color:#fff;">📸 Fotografiar Criatura</button>
                    <input type="file" id="yokai-photo-input" accept="image/*" style="display:none;">
                    <div id="yokai-photo-preview" style="display:none; margin-top:10px; font-size:0.85rem; color:#2e7d32; font-weight:bold;">✅ ¡Espíritu registrado en la base de datos!</div>
                </div>

                <button id="btn-submit-yokai" class="btn-primary" style="width:100%; border-radius:25px; font-family:'Quicksand'; font-weight:bold;" disabled>Sellar Registro Yōkai</button>
            </div>
        `,
        attachEvents: (role) => {
            const blip = document.getElementById('radar-blip');
            const status = document.getElementById('radar-status');
            const selectFileBtn = document.getElementById('btn-select-yokai-file');
            const fileInput = document.getElementById('yokai-photo-input');
            const previewEl = document.getElementById('yokai-photo-preview');
            const submitBtn = document.getElementById('btn-submit-yokai');
            const typeSelect = document.getElementById('yokai-type');

            let photoId = null;

            setTimeout(() => {
                if (blip) {
                    blip.style.opacity = '1';
                    status.innerText = '⚠️ YŌKAI DETECTADO A 15 METROS';
                    status.style.color = '#ff4081';
                    status.style.fontWeight = 'bold';
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            }, 2000);

            selectFileBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'yokai_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });

            typeSelect.addEventListener('change', () => {
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });

            const checkValidity = () => {
                if (photoId && typeSelect.value !== "") {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            };

            submitBtn.addEventListener('click', () => {
                submitMission('day_2_yokai', {
                    type: 'photo',
                    data: photoId,
                    metadata: { yokaiType: typeSelect.value }
                }, role);
            });
        }
    },

    "day_2_posture": {
        tag: "physical",
        day: 2,
        title: "Equilibrio Silencioso",
        role: "kid9",
        xp: 20,
        location: "Hotel",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #81c784; color:#1b5e20; font-family:'Quicksand', sans-serif;">
                <p class="mission-desc" style="font-weight:bold;">🦊 El Jardín del Silencio Kitsune 🌸</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">El zorrito Kitsune está meditando. Mantén un silencio total durante 30 segundos. Si haces ruido, ¡el zorro se despertará y el tiempo se reiniciará!</p>
                <div id="kitsune-garden" style="height:150px; background:#fff; border-radius:10px; border:2px solid #81c784; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <span id="kitsune-character" style="font-size:4.5rem; transition:transform 0.5s ease; z-index:2;">🦊</span>
                    <span id="kitsune-status-txt" style="font-size:0.8rem; font-weight:bold; color:#2e7d32; margin-top:5px; z-index:2;">(Esperando calma...)</span>
                    <div id="silence-bar-container" style="width:80%; height:8px; background:#e0e0e0; border-radius:4px; margin-top:5px; z-index:2; overflow:hidden; border:1px solid #ccc;">
                        <div id="silence-bar-fill" style="width:0%; height:100%; background:#4caf50; transition:width 0.1s ease;"></div>
                    </div>
                    <canvas id="sakura-canvas" width="280" height="150" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; pointer-events:none;"></canvas>
                </div>
                <p id="crono-disp" style="font-size:2.2rem; font-weight:bold; margin:10px 0; font-family:monospace;">30.0s</p>
                <button id="btn-start-kitsune" class="btn-primary" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold;">Iniciar Meditación Zen</button>
            </div>
        `,
        attachEvents: (role) => {
            const startBtn = document.getElementById('btn-start-kitsune');
            const cronoDisp = document.getElementById('crono-disp');
            const kitsune = document.getElementById('kitsune-character');
            const statusTxt = document.getElementById('kitsune-status-txt');
            const silenceFill = document.getElementById('silence-bar-fill');
            const canvas = document.getElementById('sakura-canvas');
            const ctx = canvas.getContext('2d');
            
            let timer = 30.0;
            let interval = null;
            let animating = false;
            let animFrame = null;
            let audioCtx = null;
            let analyser = null;
            let source = null;
            let stream = null;
            let micCheckInterval = null;
            
            const petals = [];
            for(let i=0; i<15; i++) {
                petals.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * -canvas.height,
                    r: Math.random() * 4 + 2,
                    d: Math.random() * 1 + 0.5,
                    angle: Math.random() * 360
                });
            }
            
            const animateSakura = () => {
                if (!animating) return;
                animFrame = requestAnimationFrame(animateSakura);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(255, 182, 193, 0.75)';
                
                petals.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                    
                    p.y += p.d;
                    p.x += Math.sin(p.y / 20) * 0.5;
                    if (p.y > canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                });
            };
            
            startBtn.addEventListener('click', async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    audioCtx = new AudioContextClass();
                    analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 512;
                    source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);
                } catch (err) {
                    console.error(err);
                    showAlert('Micrófono requerido', 'Esta misión requiere el micrófono para medir el nivel de silencio real.');
                    return;
                }
                
                startBtn.classList.add('hidden');
                timer = 30.0;
                cronoDisp.innerText = '30.0s';
                cronoDisp.style.color = '#1b5e20';
                kitsune.innerText = '🦊';
                statusTxt.innerText = '¡Shh! Meditando...';
                
                animating = true;
                animateSakura();
                
                if (window.playProceduralSound) playProceduralSound('click');
                
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                micCheckInterval = setInterval(() => {
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / bufferLength;
                    const pct = Math.min(100, (average / 80) * 100);
                    silenceFill.style.width = pct + '%';
                    
                    if (average > 28) {
                        if (window.playProceduralSound) playProceduralSound('error');
                        timer = 30.0;
                        cronoDisp.innerText = '¡RUIDO DETECTADO!';
                        cronoDisp.style.color = '#f44336';
                        kitsune.innerText = '🦊💥';
                        statusTxt.innerText = '¡El Kitsune se ha asustado! Silencio...';
                        silenceFill.style.background = '#f44336';
                        setTimeout(() => {
                            if (animating) {
                                kitsune.innerText = '🦊';
                                statusTxt.innerText = '¡Shh! Meditando...';
                                silenceFill.style.background = '#4caf50';
                                cronoDisp.style.color = '#1b5e20';
                            }
                        }, 1200);
                    }
                }, 100);
                
                interval = setInterval(() => {
                    timer -= 0.1;
                    if (timer > 0) {
                        cronoDisp.innerText = `${timer.toFixed(1)}s`;
                        kitsune.style.transform = Math.floor(timer) % 2 === 0 ? 'scale(1.1)' : 'scale(1)';
                    } else {
                        clearInterval(interval);
                        clearInterval(micCheckInterval);
                        animating = false;
                        cancelAnimationFrame(animFrame);
                        if (stream) stream.getTracks().forEach(t => t.stop());
                        if (audioCtx) audioCtx.close();
                        
                        kitsune.innerText = '🦊✨';
                        statusTxt.innerText = '¡Meditación superada con honor!';
                        silenceFill.style.width = '0%';
                        cronoDisp.innerText = '¡LOGRADO!';
                        cronoDisp.style.color = '#4caf50';
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                        
                        setTimeout(() => {
                            submitMission('day_2_posture', {type:'text', data:'Meditación Zen 30 segundos completada en silencio real'}, role);
                        }, 1500);
                    }
                }, 100);
            });
            
            window._missionCleanup = () => {
                animating = false;
                clearInterval(interval);
                clearInterval(micCheckInterval);
                if (animFrame) cancelAnimationFrame(animFrame);
                if (stream) stream.getTracks().forEach(t => t.stop());
                if (audioCtx) audioCtx.close();
            };
        }
    },

    "day_2_melody": {
        tag: "audio",
        day: 2,
        title: "Melodía del Konbini",
        role: "kid9",
        xp: 20,
        location: "Konbini",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #4caf50; color:#1b5e20; font-family:'Quicksand', sans-serif;">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🏪 Melodía del Konbini 🎵</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">Cuando entres a un konbini (como FamilyMart) y suene el famoso timbre musical de bienvenida, graba 5 segundos y clasifícalo:</p>
                
                <div style="margin-bottom:15px;">
                    <button type="button" id="btn-record-melody" class="btn-primary" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; font-weight:bold; font-family:'Quicksand';">🎤 Grabar Melodía (5s)</button>
                    <div id="melody-status" style="margin-top:10px; font-size:0.85rem; color:#1b5e20; font-style:italic;">Listo para grabar.</div>
                </div>

                <div id="melody-classification" class="hidden" style="background:#fff; border-radius:10px; padding:10px; border:2px dashed #4caf50; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#4caf50; margin:0 0 8px 0;">🎹 ANÁLISIS DE LA MELODÍA:</p>
                    <p style="font-size:0.8rem; margin:0 0 5px 0; font-weight:bold; color:#1b5e20;">¿Qué instrumento destaca más?</p>
                    <select id="melody-instrument" style="width:100%; padding:6px; border:1px solid #4caf50; border-radius:5px; font-family:'Quicksand'; font-size:0.8rem; margin-bottom:10px; background:#fff;">
                        <option value="">-- Elige el instrumento --</option>
                        <option value="bell">Campanillas / Xilófono cristalino</option>
                        <option value="synth">Sintetizador electrónico futurista</option>
                        <option value="piano">Piano / Clavicordio clásico</option>
                    </select>

                    <p style="font-size:0.8rem; margin:0 0 5px 0; font-weight:bold; color:#1b5e20;">¿Cómo es el ritmo?</p>
                    <select id="melody-tempo" style="width:100%; padding:6px; border:1px solid #4caf50; border-radius:5px; font-family:'Quicksand'; font-size:0.8rem; background:#fff;">
                        <option value="">-- Elige la velocidad --</option>
                        <option value="rapido">Rápido y alegre (¡Apúrate que se va!)</option>
                        <option value="lento">Lento y relajante</option>
                    </select>
                </div>

                <button id="btn-submit-melody" class="btn-primary" style="width:100%; border-radius:25px; font-family:'Quicksand'; font-weight:bold;" disabled>Transmitir Melodía</button>
            </div>
        `,
        attachEvents: (role) => {
            const recordBtn = document.getElementById('btn-record-melody');
            const statusEl = document.getElementById('melody-status');
            const classificationDiv = document.getElementById('melody-classification');
            const instrumentSelect = document.getElementById('melody-instrument');
            const tempoSelect = document.getElementById('melody-tempo');
            const submitBtn = document.getElementById('btn-submit-melody');
            
            let mediaRecorder = null;
            let audioChunks = [];
            let audioBlobId = null;
            let recording = false;
            
            recordBtn.addEventListener('click', async () => {
                if (recording) return;
                recording = true;
                recordBtn.disabled = true;
                recordBtn.innerText = '🔴 Grabando...';
                statusEl.innerText = 'Escuchando el andén de la estación...';
                audioChunks = [];
                
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
                    
                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            audioBlobId = 'melody_' + Date.now();
                            window.savePhotoToDB(audioBlobId, event.target.result);
                            statusEl.innerText = '✅ Grabación finalizada correctamente.';
                            recordBtn.innerText = '🎤 Volver a Grabar';
                            recordBtn.disabled = false;
                            recording = false;
                            classificationDiv.classList.remove('hidden');
                            checkValidity();
                        };
                        reader.readAsDataURL(audioBlob);
                        stream.getTracks().forEach(t => t.stop());
                    };
                    
                    mediaRecorder.start();
                    setTimeout(() => {
                        if (mediaRecorder.state !== 'inactive') {
                            mediaRecorder.stop();
                        }
                    }, 5000);
                } catch (err) {
                    console.error(err);
                    showAlert('ERROR DE AUDIO', 'No se pudo acceder al micrófono del dispositivo. Permite el acceso para continuar.');
                    recordBtn.disabled = false;
                    recordBtn.innerText = '🎤 Grabar 5s';
                    statusEl.innerText = 'Error al abrir micrófono.';
                    recording = false;
                }
            });

            const checkValidity = () => {
                if (audioBlobId && instrumentSelect.value && tempoSelect.value) {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            };

            instrumentSelect.addEventListener('change', checkValidity);
            tempoSelect.addEventListener('change', checkValidity);

            submitBtn.addEventListener('click', () => {
                submitMission('day_2_melody', {
                    type: 'audio',
                    data: audioBlobId,
                    metadata: {
                        instrument: instrumentSelect.value,
                        tempo: tempoSelect.value
                    }
                }, role);
            });
        }
    },

"day_2_shogun": {
        tag: "expert",
        day: 2,
        title: "Protocolo Shōgun",
        role: "kid14",
        xp: 25,
        location: "Calles",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px;">
                <p>>>> MODO GUÍA: ON.</p>
                <p>Guía a la familia desde la estación hasta el hotel o restaurante objetivo usando un mapa local de la estación, sin que los padres usen Google Maps.</p>
                <button id="btn" class="btn-primary" style="width:100%">Misión Completada (El Juez confirmará)</button>
            </div>
        `,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => submitMission('day_2_shogun', {type:'text', data:'Ruta guiada con éxito'}, role)); }
    },

"day_2_ekistamp": {
        tag: "photo",
        day: 2,
        title: "Coleccionista de Eki-Stamps",
        role: "both",
        xp: 15,
        location: "Aeropuerto KIX (Estación)",
        render: () => `<p class="mission-desc">Las estaciones tienen sellos únicos (Eki-Stamps). Buscad la mesa de sellado y fotografiad el primer sello impreso en vuestra libreta.</p>
                       <button id="btn-cam" class="btn-secondary">📸 Tomar Foto</button>`,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_2_ekistamp', role, false, true)
    },

    "day_3_glico": {
        tag: "photo",
        day: 3,
        title: "Glico Man",
        role: "kid9",
        xp: 15,
        location: "Dotonbori",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ff4081 0%, #3f51b5 100%); border-radius:15px; border:3px solid #ffd700; color:#fff; font-family:'Quicksand', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:12px;">🏃‍♂️ ¡El Desafío del Glico Man! 🏃‍♂️</p>
                <p style="font-size:0.9rem; margin-bottom:15px; color:#e0e0e0;">¡Llegada al canal de Dotonbori! Busca el cartel de neón gigante e imita la postura clásica del corredor cruzando la meta.</p>
                <div style="background:rgba(255,255,255,0.1); border-radius:10px; padding:10px; margin-bottom:15px; border:1px dashed #ffd700;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#ffd700; margin:0 0 5px 0;">📐 GUÍA DE POSTURA:</p>
                    <div style="font-size:2.5rem; margin:10px 0;">🙆‍♂️✨👟</div>
                    <span style="font-size:0.8rem;">1. Brazos en alto en forma de "V"<br>2. Flexiona una pierna hacia atrás<br>3. Sonrisa gigante frente al gran cartel</span>
                </div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#ffd700; border-color:#ffd700; color:#222; font-weight:bold; font-size:1.1rem; border-radius:25px; box-shadow:0 4px 10px rgba(255,215,0,0.3);">📸 Tomar Foto Imitación</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_glico', role, false)
    },

    "day_3_ninja": {
        tag: "photo",
        day: 3,
        title: "El Cangrejo de Dotonbori",
        role: "kid9",
        xp: 15,
        location: "Dotonbori",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%); border-radius:15px; border:3px solid #f57c00; color:#e65100; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🦀 El Cangrejo Gigante de Dotonbori 🦀</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">¡Busca el restaurante Kani Doraku con el cangrejo gigante mecánico! Sácate una foto imitando su pose con las manos en forma de pinzas y responde al enigma:</p>
                
                <div style="background:#fff; border-radius:10px; padding:10px; border:2px dashed #f57c00; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#f57c00; margin:0 0 5px 0;">💬 OBSERVACIÓN DE NAVEGACIÓN:</p>
                    <p style="font-size:0.8rem; color:#5d4037; margin:0 0 10px 0;">¿Cómo se mueven las patas y las pinzas de este cangrejo mecánico gigante?</p>
                    <select id="crab-observation" style="width:100%; padding:8px; border:1px solid #f57c00; border-radius:5px; background:#fff; font-family:'Quicksand', sans-serif; font-size:0.8rem;">
                        <option value="">-- Elige lo que ves --</option>
                        <option value="estatico">No se mueven, es una estatua fija</option>
                        <option value="lento">Se mueven lentamente de lado a lado de forma coordinada</option>
                        <option value="luces">Solo parpadean luces rojas de discoteca</option>
                    </select>
                </div>
                
                <button id="btn-cam-crab" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#f57c00; border-color:#f57c00; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px; box-shadow:0 4px 10px rgba(245,124,0,0.3);">📸 Capturar Pose de Cangrejo</button>
            </div>
        `,
        attachEvents: (role) => {
            const select = document.getElementById('crab-observation');
            const btnCam = document.getElementById('btn-cam-crab');
            
            btnCam.addEventListener('click', (e) => {
                const obs = select.value;
                if (!obs) {
                    e.stopImmediatePropagation();
                    showAlert('RETO INCOMPLETO', 'Primero observa el cangrejo gigante y selecciona cómo se mueve.');
                    return;
                }
                if (obs !== 'lento') {
                    e.stopImmediatePropagation();
                    showAlert('OBSERVACIÓN ERRÓNEA', '¡Mira con atención el cangrejo de la fachada! Sus pinzas y patas tienen un movimiento articulado continuo.');
                    return;
                }
            }, true);
            
            attachCameraFlow('btn-cam-crab', 'day_3_ninja', role, false);
        }
    },

    "day_3_bridge": {
        tag: "physical",
        day: 3,
        title: "Foso del Castillo",
        role: "kid9",
        xp: 20,
        location: "Castillo Osaka",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); border-radius:15px; border:3px solid #009688; color:#004d40; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🏯 Cruzando el Foso del Shogun 🏯</p>
                <p style="font-size:0.85rem; margin-bottom:15px;">El foso de agua es gigantesco. Empieza a cruzar el puente de madera y cuenta tus pasos reales en voz alta.</p>
                <div style="background:#fff; border-radius:10px; padding:15px; margin-bottom:15px; border:2px solid #009688;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#00796b; margin-bottom:5px;">REGISTRO DE PASOS REALIZADOS:</div>
                    <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:10px 0;">
                        <button id="btn-sub-step" class="btn-secondary" style="font-size:1.5rem; width:45px; height:45px; border-radius:50%; background:#009688; color:#fff; border:none; line-height:1; cursor:pointer;">-</button>
                        <span id="bridge-steps-count" style="font-size:2.5rem; font-weight:bold; min-width:80px; color:#004d40;">0</span>
                        <button id="btn-add-step" class="btn-secondary" style="font-size:1.5rem; width:45px; height:45px; border-radius:50%; background:#009688; color:#fff; border:none; line-height:1; cursor:pointer;">+</button>
                    </div>
                </div>
                <input type="hidden" id="ans" value="0">
                <button id="btn" class="btn-primary" style="width:100%; background:#00796b; border-color:#00796b; font-family:'Quicksand', sans-serif; font-weight:bold; border-radius:20px;">🎖️ Enviar Registro de Pasos</button>
            </div>
        `,
        attachEvents: (role) => {
            let steps = 0;
            const countEl = document.getElementById('bridge-steps-count');
            const ansInput = document.getElementById('ans');
            
            document.getElementById('btn-add-step').addEventListener('click', () => {
                steps += 5;
                countEl.innerText = steps;
                ansInput.value = steps;
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            document.getElementById('btn-sub-step').addEventListener('click', () => {
                if (steps >= 5) {
                    steps -= 5;
                    countEl.innerText = steps;
                    ansInput.value = steps;
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            });
            
            document.getElementById('btn').addEventListener('click', () => {
                if (steps <= 0) {
                    showAlert('CÓMPUTO VACÍO', '¡Camina y registra al menos algunos pasos para cruzar el foso!');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_3_bridge', {type:'number', data: steps}, role);
            });
        }
    },

    "day_3_umeda": {
        tag: "photo",
        day: 3,
        title: "Umeda Sky (Superhéroe)",
        role: "kid9",
        xp: 15,
        location: "Umeda Sky",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%); border-radius:15px; border:3px solid #607d8b; color:#263238; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🛸 Fuerza Titán en Umeda Sky 🏢</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#455a64;">Juega con la perspectiva: pídele a tu familia que te haga una foto desde abajo donde parezca que sostienes el rascacielos flotante con tus manos.</p>
                <div style="background:#fff; border-radius:10px; padding:10px; margin-bottom:15px; border:1px solid #b0bec5; display:flex; align-items:center; justify-content:center; gap:15px;">
                    <span style="font-size:2.5rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🦸‍♀️</span>
                    <span style="font-size:1.5rem; color:#b0bec5;">⚡</span>
                    <span style="font-size:2.5rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🏢</span>
                </div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#607d8b; border-color:#607d8b; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px;">📸 Tomar Foto Ilusión</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_umeda', role, false)
    },

    "day_3_architect": {
        tag: "expert",
        day: 3,
        title: "Arquitecto del Castillo",
        role: "kid14",
        xp: 20,
        location: "Castillo Osaka",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> ANÁLISIS DEFENSIVO SENGOKU / MÓDULO GEOMÉTRICO</p>
                <p style="color:#aaa; font-size:0.85rem;">Estima el ancho del foso en metros. El simulador calculará la parábola requerida para proyectiles de asedio.</p>
                
                <div style="margin:15px 0; padding:10px; background:rgba(0,255,153,0.05); border:1px dashed #00ff99; border-radius:5px; text-align:center;">
                    <span style="font-size:0.8rem; color:#ffd700;">DISTANCIA AL BLANCO (ESTIMACIÓN):</span>
                    <div style="font-size:2rem; font-weight:bold; margin:5px 0;" id="arch-dist-display">40 m</div>
                    <input type="range" id="arch-slider" min="10" max="150" value="40" step="5" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                </div>
                
                <div style="margin-bottom:15px; border:1px solid #333; border-radius:4px; overflow:hidden; background:#111; height:80px; position:relative;">
                    <canvas id="arch-canvas" width="280" height="80" style="display:block; width:100%; height:80px;"></canvas>
                </div>
                
                <button id="btn-arch" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace; font-weight:bold;">CONFIGURAR ARMA DE ASEDIO</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('arch-slider');
            const display = document.getElementById('arch-dist-display');
            const canvas = document.getElementById('arch-canvas');
            const ctx = canvas.getContext('2d');
            const btn = document.getElementById('btn-arch');
            
            const drawSimulation = (dist) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw ground
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 70);
                ctx.lineTo(canvas.width, 70);
                ctx.stroke();
                
                // Draw moat (foso)
                ctx.fillStyle = '#0055ff';
                ctx.fillRect(40, 70, canvas.width - 80, 10);
                
                // Draw castle wall
                ctx.fillStyle = '#666';
                ctx.fillRect(canvas.width - 30, 20, 20, 50);
                
                // Draw trajectory
                ctx.strokeStyle = '#00ff99';
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(20, 70);
                
                // Parabola peak is halfway
                const midX = (canvas.width - 25 + 20) / 2;
                const peakY = 10;
                
                ctx.quadraticCurveTo(midX, peakY, canvas.width - 25, 20);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Draw ball
                ctx.fillStyle = '#ff5722';
                ctx.beginPath();
                ctx.arc(canvas.width - 25, 20, 3, 0, Math.PI * 2);
                ctx.fill();
            };
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                display.innerText = val + ' m';
                drawSimulation(val);
            });
            
            drawSimulation(40);
            
            btn.addEventListener('click', () => {
                const val = parseInt(slider.value);
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_3_architect', {type:'number', data: val}, role);
            });
        }
    },

    "day_3_neon": {
        tag: "photo",
        day: 3,
        title: "Filtro Cyberpunk",
        role: "kid14",
        xp: 15,
        location: "Dotonbori",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0c0812; border:1px solid #ff007f; color:#ff007f; box-shadow: 0 4px 20px rgba(255,0,127,0.25);">
                <p>>>> RASTREO ÓPTICO NOCTURNO // DOTONBORI NEÓN</p>
                <p style="color:#00f0ff; font-size:0.85rem;">Busca una callejuela angosta iluminada con letreros de neón brillantes y tómale una foto de perspectiva angular estilo Neo-Tokio. Luego responde la pregunta de criptografía lingüística:</p>
                
                <div style="background:rgba(0,240,255,0.05); border:1px solid #00f0ff; border-radius:5px; padding:10px; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#00f0ff; margin:0 0 5px 0;">💬 LINGÜÍSTICA DE CARTELES:</p>
                    <p style="font-size:0.75rem; color:#ccc; margin:0 0 8px 0;">¿Qué silabario japonés se usa principalmente en los neones para transcribir fonéticamente palabras de origen extranjero (como "Coffee" o "Hotel")?</p>
                    <select id="neon-alphabet" style="width:100%; padding:8px; border:1px solid #00f0ff; border-radius:5px; background:#0c0812; color:#00f0ff; font-family:monospace; font-size:0.8rem;">
                        <option value="">-- Selecciona el silabario --</option>
                        <option value="hiragana">Hiragana (para gramática y palabras nativas)</option>
                        <option value="katakana">Katakana (para préstamos y nombres extranjeros)</option>
                        <option value="kanji">Kanji (ideogramas de origen chino)</option>
                    </select>
                </div>

                <div style="margin-bottom:15px;">
                    <button type="button" id="btn-select-neon-file" class="btn-secondary" style="width:100%; margin-bottom:8px; font-family:monospace; background:#ff007f; border-color:#ff007f; color:#fff; font-weight:bold;">📸 Capturar Óptica Cyberpunk</button>
                    <input type="file" id="neon-photo-input" accept="image/*" style="display:none;">
                    <div id="neon-photo-preview" style="display:none; margin-top:10px; font-size:0.8rem; color:#00f0ff; font-weight:bold;">>>> FOTO CARGADA EN MEMORIA DE LA CENTRAL</div>
                </div>
                
                <button id="btn-submit-neon" class="btn-primary" style="width:100%; border-color:#ff007f; color:#ff007f; background:transparent; font-family:monospace; font-weight:bold;" disabled>TRANSMITIR REPORTE OPTICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const selectFileBtn = document.getElementById('btn-select-neon-file');
            const fileInput = document.getElementById('neon-photo-input');
            const previewEl = document.getElementById('neon-photo-preview');
            const alphabetSelect = document.getElementById('neon-alphabet');
            const submitBtn = document.getElementById('btn-submit-neon');
            
            let photoId = null;
            
            selectFileBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'neon_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            alphabetSelect.addEventListener('change', () => {
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });

            const checkValidity = () => {
                if (photoId && alphabetSelect.value === 'katakana') {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#ff007f';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = 'transparent';
                    submitBtn.style.color = '#ff007f';
                }
            };
            
            submitBtn.addEventListener('click', () => {
                if (alphabetSelect.value !== 'katakana') {
                    showAlert('DECODIFICACIÓN ERRÓNEA', 'Ese silabario no se corresponde con las transcripciones de términos foráneos.');
                    return;
                }
                submitMission('day_3_neon', {type:'photo', data: photoId}, role);
            });
        }
    },

    "day_3_rush": {
        tag: "physical",
        day: 3,
        title: "El Asalto al Shogun",
        role: "kid14",
        xp: 20,
        location: "Castillo Osaka",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> CRONÓMETRO DE INFILTRACIÓN TÁCTICA</p>
                <p style="color:#aaa; font-size:0.85rem;">Mide a paso normal (sin correr) el tiempo desde la puerta exterior de piedra del castillo hasta la base de la torre principal.</p>
                
                <div style="text-align:center; padding:15px; background:rgba(255,255,255,0.05); border-radius:5px; margin:15px 0;">
                    <div id="rush-chrono" style="font-size:2.5rem; font-weight:bold; font-family:monospace; color:#ffd700; text-shadow:0 0 10px rgba(255,215,0,0.5);">00:00.0</div>
                    <div style="display:flex; justify-content:center; gap:10px; margin-top:10px;">
                        <button id="btn-rush-start" style="padding:5px 15px; background:#00ff99; border:none; color:#222; font-weight:bold; border-radius:3px; cursor:pointer;">INICIAR</button>
                        <button id="btn-rush-stop" style="padding:5px 15px; background:#ff5722; border:none; color:#fff; font-weight:bold; border-radius:3px; cursor:pointer;" disabled>DETENER</button>
                        <button id="btn-rush-reset" style="padding:5px 15px; background:#444; border:none; color:#fff; border-radius:3px; cursor:pointer;">RESET</button>
                    </div>
                </div>

                <div id="rush-observation" class="hidden" style="background:rgba(255,215,0,0.05); border:1px solid #ffd700; border-radius:5px; padding:10px; margin-bottom:15px; text-align:left; color:#ffd700;">
                    <p style="font-size:0.8rem; font-weight:bold; margin:0 0 5px 0;">🏰 VERIFICACIÓN DE ENTRADA AL CASTILLO:</p>
                    <p style="font-size:0.75rem; color:#ccc; margin:0 0 8px 0;">¿Cuántos fosos concéntricos (líneas de agua/defensas) tuviste que cruzar para llegar a la base de la torre principal?</p>
                    <input type="number" id="rush-moats-count" style="width:100%; background:#0a0e12; color:#ffd700; border:1px solid #ffd700; padding:8px; font-family:monospace; font-size:0.85rem;" placeholder="Escribe el número de fosos...">
                </div>

                <input type="hidden" id="ans" value="">
                <button id="btn-submit" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>ENVIAR REGISTRO TELEMÉTRICO</button>
            </div>
        `,
        attachEvents: (role) => {
            let timer = null;
            let startTime = 0;
            let elapsedTime = 0;
            const display = document.getElementById('rush-chrono');
            const btnStart = document.getElementById('btn-rush-start');
            const btnStop = document.getElementById('btn-rush-stop');
            const btnReset = document.getElementById('btn-rush-reset');
            const btnSubmit = document.getElementById('btn-submit');
            const ansInput = document.getElementById('ans');
            const obsDiv = document.getElementById('rush-observation');
            const moatsInput = document.getElementById('rush-moats-count');
            
            const updateTime = () => {
                const now = Date.now();
                const totalMs = now - startTime + elapsedTime;
                const m = Math.floor(totalMs / 60000);
                const s = Math.floor((totalMs % 60000) / 1000);
                const ms = Math.floor((totalMs % 1000) / 100);
                display.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
            };
            
            btnStart.addEventListener('click', () => {
                if (timer) return;
                startTime = Date.now();
                timer = setInterval(updateTime, 100);
                btnStart.disabled = true;
                btnStop.disabled = false;
                btnSubmit.disabled = true;
                obsDiv.classList.add('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btnStop.addEventListener('click', () => {
                if (!timer) return;
                clearInterval(timer);
                timer = null;
                elapsedTime += Date.now() - startTime;
                btnStart.disabled = false;
                btnStart.innerText = 'REANUDAR';
                btnStop.disabled = true;
                ansInput.value = display.innerText;
                obsDiv.classList.remove('hidden');
                checkValidity();
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btnReset.addEventListener('click', () => {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                elapsedTime = 0;
                display.innerText = '00:00.0';
                btnStart.disabled = false;
                btnStart.innerText = 'INICIAR';
                btnStop.disabled = true;
                btnSubmit.disabled = true;
                ansInput.value = '';
                moatsInput.value = '';
                obsDiv.classList.add('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
            });

            const checkValidity = () => {
                const moats = parseInt(moatsInput.value);
                if (ansInput.value && ansInput.value !== '00:00.0' && moats === 2) {
                    btnSubmit.removeAttribute('disabled');
                    btnSubmit.style.borderColor = '#00ff99';
                    btnSubmit.style.color = '#00ff99';
                } else {
                    btnSubmit.setAttribute('disabled', 'true');
                    btnSubmit.style.borderColor = '#555';
                    btnSubmit.style.color = '#555';
                }
            };

            moatsInput.addEventListener('input', checkValidity);
            
            btnSubmit.addEventListener('click', () => {
                const moats = parseInt(moatsInput.value);
                if (moats !== 2) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('OBSERVACIÓN DE ASALTO INEXACTA', 'El Shogun de Osaka diseñó el castillo con un número específico de anillos concéntricos defensivos (el foso interior y exterior) para repeler invasores. Cuenta bien cuántos has cruzado.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_3_rush', {type:'text', data: `Tiempo de asalto: ${ansInput.value} | Fosos: ${moats}`}, role);
            });
            
            window._missionCleanup = () => {
                if (timer) clearInterval(timer);
            };
        }
    },

    "day_3_flow": {
        tag: "sensors",
        day: 3,
        title: "Visión de Flujo Vital",
        role: "kid14",
        xp: 30,
        location: "Dotonbori",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> ESCANEO MAGNÉTICO DE FLUJO URBANO</p>
                <p style="color:#aaa; font-size:0.85rem;">Encuentra el gran neón de Glico. Apunta tu dispositivo hacia él y pulsa escanear. Mantén el pulso para sincronizar la firma electromagnética.</p>
                
                <div style="position:relative; width:150px; height:150px; border-radius:50%; border:2px solid #00ff99; margin:15px auto; overflow:hidden; background:rgba(0,255,153,0.05); display:flex; align-items:center; justify-content:center;">
                    <div id="radar-beam" style="position:absolute; width:100%; height:100%; background:linear-gradient(45deg, rgba(0,255,153,0.2), transparent); transform-origin:center; top:0; left:0; border-radius:50%; animation: radar-spin 3s linear infinite; display:none;"></div>
                    <div style="font-size:2.5rem; z-index:2;" id="radar-emoji">📡</div>
                </div>
                
                <div id="flow-sensor-val" style="font-size:1.8rem; color:#ffd700; text-align:center; font-family:monospace; margin-bottom:15px;">-- Hz</div>
                
                <button id="btn-scan" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">INICIAR ESCANEO DE CAMPO</button>
                
                <style>
                    @keyframes radar-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `,
        attachEvents: (role) => {
            let active = false;
            let handler = null;
            const btn = document.getElementById('btn-scan');
            const valEl = document.getElementById('flow-sensor-val');
            const beam = document.getElementById('radar-beam');
            const emoji = document.getElementById('radar-emoji');
            
            btn.addEventListener('click', async () => {
                if (active) return;
                
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    try {
                        const p = await DeviceOrientationEvent.requestPermission();
                        if (p !== 'granted') {
                            showAlert('Error', 'Permiso denegado.');
                            return;
                        }
                    } catch (err) {
                        console.error(err);
                        showAlert('Error', 'No se pudieron pedir permisos del sensor.');
                        return;
                    }
                }
                
                btn.style.display = 'none';
                beam.style.display = 'block';
                emoji.innerText = '🌀';
                active = true;
                
                let lastVal = 45;
                
                handler = (ev) => {
                    if (!active) return;
                    const val = Math.floor(Math.abs(ev.alpha || 0) + Math.abs(ev.beta || 0));
                    lastVal = val;
                    valEl.innerText = `${val} Hz`;
                };
                
                window.addEventListener('deviceorientation', handler);
                if (window.playProceduralSound) playProceduralSound('click');
                
                setTimeout(() => {
                    active = false;
                    window.removeEventListener('deviceorientation', handler);
                    beam.style.display = 'none';
                    emoji.innerText = '✅';
                    valEl.innerText = `${lastVal} Hz [BLOQUEADO]`;
                    if (window.playProceduralSound) playProceduralSound('success');
                    
                    setTimeout(() => {
                        submitMission('day_3_flow', {type:'sensors', data: `Frecuencia neón: ${lastVal} Hz`}, role);
                    }, 1500);
                }, 5000);
            });
            
            window._missionCleanup = () => {
                active = false;
                if (handler) window.removeEventListener('deviceorientation', handler);
            };
        }
    },

    "day_3_reflect": {
        tag: "photo",
        day: 3,
        title: "El Reflejo Infinito",
        role: "both",
        xp: 25,
        location: "Osaka",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🪞 El Reflejo Infinito en Osaka 🖼️</p>
                <p style="font-size:0.85rem; margin-bottom:15px;">Misión conjunta de equipo. Buscad un espejo, cristalera gigante de un edificio o un gran charco donde se reflejen los neones y toda vuestra familia junta.</p>
                <div style="font-size:2.5rem; margin:10px 0;">✨👨‍👩‍👧‍👦✨</div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px;">📸 Tomar Foto Familiar</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_3_reflect', role, false, true)
    },

    "day_4_bestiary": {
        tag: "writing",
        day: 4,
        title: "Bestiario Kuromon",
        role: "kid9",
        xp: 15,
        location: "Kuromon",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fffde7 0%, #fff9c4 100%); border-radius:15px; border:3px solid #fbc02d; color:#574300; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🐙 El Bestiario Mágico de Kuromon 🦑</p>
                <p style="font-size:0.85rem; margin-bottom:15px;">En el mercado de Kuromon hay pescados y mariscos con formas muy locas. Encuentra uno raro y bautízalo con un nombre de criatura alienígena.</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; margin-bottom:15px; border:2px solid #fbc02d; text-align:left;">
                    <label style="font-size:0.8rem; font-weight:bold; color:#f57f17; display:block; margin-bottom:5px;">👾 CLASIFICACIÓN DE LA CRIATURA:</label>
                    <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;" id="best-tags">
                        <button type="button" class="tag-btn" data-tag="Tentaculos" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #fbc02d; background:#fff; cursor:pointer;">🐙 Tentáculos</button>
                        <button type="button" class="tag-btn" data-tag="Pinchos" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #fbc02d; background:#fff; cursor:pointer;">🐡 Pinchos</button>
                        <button type="button" class="tag-btn" data-tag="Mutante" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #fbc02d; background:#fff; cursor:pointer;">👾 Mutante</button>
                        <button type="button" class="tag-btn" data-tag="Gigante" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #fbc02d; background:#fff; cursor:pointer;">🦕 Gigante</button>
                    </div>
                    
                    <label style="font-size:0.8rem; font-weight:bold; color:#f57f17; display:block; margin-bottom:5px;">✍️ NOMBRE INVENTADO:</label>
                    <input type="text" id="ans" style="width:100%; border:1px solid #ccc; border-radius:5px; padding:8px; font-family:inherit; font-size:1rem; box-sizing:border-box;" placeholder="Ej: Octopulpo Mutante X...">
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; background:#f57f17; border-color:#f57f17; color:#fff; font-weight:bold; border-radius:20px;">🛡️ Registrar Criatura en el Pasaporte</button>
            </div>
        `,
        attachEvents: (role) => {
            let selectedTag = '';
            const tagBtns = document.querySelectorAll('.tag-btn');
            
            tagBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    tagBtns.forEach(b => {
                        b.style.background = '#fff';
                        b.style.color = '#333';
                    });
                    btn.style.background = '#ffd54f';
                    btn.style.color = '#574300';
                    selectedTag = btn.dataset.tag;
                    if (window.playProceduralSound) playProceduralSound('click');
                });
            });
            
            document.getElementById('btn').addEventListener('click', () => {
                const name = document.getElementById('ans').value.trim();
                if (!name) {
                    showAlert('FALTA NOMBRE', '¡Ponle un nombre divertido a la criatura para registrarla!');
                    return;
                }
                const result = selectedTag ? `[${selectedTag}] ${name}` : name;
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_4_bestiary', {type:'text', data: result}, role);
            });
        }
    },

    "day_4_gachapon": {
        tag: "photo",
        day: 4,
        title: "Gachapon",
        role: "kid9",
        xp: 15,
        location: "Tiendas",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%); border-radius:15px; border:3px solid #0288d1; color:#01579b; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15); overflow:hidden;">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🔮 ¡Desafío Gachapon Real! 🔮</p>
                <p style="font-size:0.85rem; margin-bottom:15px;">Encuentra una máquina expendedora real de Gachapon en la tienda. Gira la manivela física, saca un juguete sorpresa, sácale una foto y clasifícalo:</p>
                
                <div style="background:#fff; border-radius:10px; padding:10px; border:2px dashed #0288d1; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#0288d1; margin:0 0 5px 0;">🧸 CLASIFICACIÓN DE TU JUGUETE:</p>
                    <select id="gachapon-category" style="width:100%; padding:8px; border:1px solid #0288d1; border-radius:5px; background:#fff; font-family:'Quicksand', sans-serif; font-size:0.8rem;">
                        <option value="">-- Elige la categoría --</option>
                        <option value="anime">Personaje de Anime / Manga / Videojuegos</option>
                        <option value="animal">Animal kawaii (gato, perro, criatura...)</option>
                        <option value="objeto">Objeto miniatura / Comida realista / Llavero raro</option>
                        <option value="otro">Otro tipo de juguete</option>
                    </select>
                </div>
                
                <button id="btn-cam-gachapon" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#0288d1; border-color:#0288d1; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px; box-shadow:0 4px 10px rgba(2,136,209,0.3);">📸 Fotografiar Juguete Obtenido</button>
            </div>
        `,
        attachEvents: (role) => {
            const select = document.getElementById('gachapon-category');
            const btnCam = document.getElementById('btn-cam-gachapon');
            
            btnCam.addEventListener('click', (e) => {
                const category = select.value;
                if (!category) {
                    e.stopImmediatePropagation();
                    showAlert('RETO INCOMPLETO', 'Por favor, selecciona primero la categoría de tu juguete obtenido.');
                    return;
                }
            }, true);
            
            attachCameraFlow('btn-cam-gachapon', 'day_4_gachapon', role, false);
        }
    },

    "day_4_vending_roulette": {
        tag: "photo",
        day: 4,
        title: "Ruleta Vending Anime",
        role: "kid9",
        xp: 15,
        location: "Calle",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%); border-radius:15px; border:3px solid #ff9800; color:#e65100; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🥤 Refrescos Anime Adorables 🥤</p>
                <p style="font-size:0.85rem; margin-bottom:15px;">Las máquinas de bebidas en Japón suelen tener latas con personajes de anime famosos (Pokémon, Dragon Ball, Sailor Moon) o mascotas. ¡Encuentra una y hazle una foto!</p>
                
                <div style="background:#1a1a24; border:3px solid #444; border-radius:12px; padding:15px; display:inline-block; margin-bottom:15px; width:150px; text-align:center; position:relative;">
                    <div style="width:100%; height:20px; background:#ffd700; border-radius:3px; margin-bottom:10px; font-weight:bold; font-size:0.75rem; color:#111; display:flex; align-items:center; justify-content:center;">JIDOHANBAIKI</div>
                    <div style="font-size:3rem; margin:10px 0; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));" id="vending-carousel-emoji">👾</div>
                    <div style="font-size:0.6rem; color:#aaa;">PULSA A LA DERECHA PARA BUSCAR:</div>
                    <button type="button" id="vending-carousel-next" style="margin-top:5px; background:#ff9800; border:none; color:#fff; border-radius:50%; width:30px; height:30px; font-weight:bold; cursor:pointer;">➡️</button>
                </div>
                
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#ff9800; border-color:#ff9800; color:#fff; font-weight:bold; border-radius:25px;">📸 Fotografiar Lata Anime</button>
            </div>
        `,
        attachEvents: (role) => {
            const emojis = ['👾', '🐱', '🐹', '🦖', '🐼', '🦊'];
            let idx = 0;
            const emojiEl = document.getElementById('vending-carousel-emoji');
            
            document.getElementById('vending-carousel-next').addEventListener('click', () => {
                idx = (idx + 1) % emojis.length;
                emojiEl.innerText = emojis[idx];
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            attachCameraFlow('btn-cam', 'day_4_vending_roulette', role, false);
        }
    },

    "day_4_crab": {
        tag: "physical",
        day: 4,
        title: "Paso del Cangrejo",
        role: "kid9",
        xp: 15,
        location: "Puente / Calles",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border-radius:15px; border:3px solid #f44336; color:#b71c1c; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🦀 El Baile del Cangrejo Gigante 🦀</p>
                <p style="font-size:0.85rem; margin-bottom:15px;">Dotonbori es famoso por sus cangrejos mecánicos gigantes (Kani Doraku). Cruza el puente de lado, caminando como un cangrejo, y graba un vídeo corto (5s) demostrando tus habilidades de crustáceo:</p>
                
                <button id="btn-video-crab" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#f44336; border-color:#f44336; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px; box-shadow:0 4px 10px rgba(244,67,54,0.3);">🎬 Grabar Vídeo Cangrejo</button>
            </div>
        `,
        attachEvents: (role) => {
            attachCameraFlow('btn-video-crab', 'day_4_crab', role, false);
        }
    },

    "day_4_knife": {
        tag: "writing",
        day: 4,
        title: "El Cuchillo Samurái",
        role: "kid14",
        xp: 15,
        location: "Doguyasuji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0e0805; border:1px solid #ff5722; color:#ff5722; box-shadow:0 4px 20px rgba(255,87,34,0.2);">
                <p>>>> ESCÁNER DE FRAGUA Y ACERO EN DOGUYASUJI</p>
                <p style="color:#ffd700; font-size:0.85rem;">Busca un escaparate de cuchillos de chef de gama alta. Selecciona el tipo de hoja estimada y escribe su precio máximo en Yenes.</p>
                
                <div style="margin:15px 0; padding:10px; background:rgba(255,87,34,0.05); border:1px dashed #ff5722; border-radius:5px;">
                    <label style="font-size:0.8rem; color:#ff5722; display:block; margin-bottom:5px;">SELECCIÓN DE FILO / USO:</label>
                    <select id="knife-type" style="width:100%; background:#111; color:#ff5722; border:1px solid #ff5722; padding:5px; font-family:monospace; margin-bottom:10px;">
                        <option value="Gyuto (Carne)">Gyuto (Carne)</option>
                        <option value="Santoku (Multipropósito)">Santoku (Multipropósito)</option>
                        <option value="Yanagiba (Sashimi)">Yanagiba (Sashimi)</option>
                        <option value="Nakiri (Verduras)">Nakiri (Verduras)</option>
                    </select>
                    
                    <label style="font-size:0.8rem; color:#ff5722; display:block; margin-bottom:5px;">PRECIO MÁXIMO OBSERVADO (¥):</label>
                    <input type="number" id="ans" style="width:100%; background:#111; color:#ff5722; border:1px solid #ff5722; padding:5px; font-family:monospace;" placeholder="Ej: 45000">
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; border-color:#ff5722; color:#ff5722; background:transparent;">ENVIAR ANÁLISIS DE PRECIOS</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                const type = document.getElementById('knife-type').value;
                const price = document.getElementById('ans').value;
                if (!price) {
                    showAlert('VALOR REQUERIDO', 'Introduce el precio estimado del cuchillo.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_4_knife', {type:'text', data:`Tipo: ${type} | Precio: ¥${price}`}, role);
            });
        }
    },

    "day_4_500yen": {
        tag: "economy",
        day: 4,
        title: "Reto 500 Yenes",
        role: "kid14",
        xp: 20,
        location: "Kombini",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> PROTOCOLO KOBINI: RETO DE RECURSOS CERRADO</p>
                <p style="color:#aaa; font-size:0.85rem;">En un Lawson/FamilyMart/7-Eleven, consigue snacks/bebidas sumando un máximo de 500¥. Simula tu cesta aquí antes de pagar en la vida real.</p>
                
                <div style="background:#111; padding:10px; border-radius:5px; border:1px solid #333; margin:15px 0;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span>🛒 CESTA VIRTUAL:</span>
                        <span id="basket-sum" style="color:#ffd700; font-weight:bold;">0 ¥ / 500 ¥</span>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr auto; gap:8px; max-height:100px; overflow-y:auto; font-size:0.8rem; border-bottom:1px solid #333; padding-bottom:8px; margin-bottom:8px;" id="basket-items">
                        <span style="color:#666;">Cesta vacía...</span>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:5px;">
                        <button type="button" class="add-snack" data-name="🍙 Onigiri" data-price="150" style="padding:3px; background:#222; border:1px solid #00ff99; color:#00ff99; font-size:0.75rem; cursor:pointer;">+ 🍙 (150¥)</button>
                        <button type="button" class="add-snack" data-name="🍵 Té Verde" data-price="130" style="padding:3px; background:#222; border:1px solid #00ff99; color:#00ff99; font-size:0.75rem; cursor:pointer;">+ 🍵 (130¥)</button>
                        <button type="button" class="add-snack" data-name="🥖 Melonpan" data-price="160" style="padding:3px; background:#222; border:1px solid #00ff99; color:#00ff99; font-size:0.75rem; cursor:pointer;">+ 🥖 (160¥)</button>
                        <button type="button" class="add-snack" data-name="🍫 Pocky" data-price="180" style="padding:3px; background:#222; border:1px solid #00ff99; color:#00ff99; font-size:0.75rem; cursor:pointer;">+ 🍫 (180¥)</button>
                    </div>
                </div>
                
                <textarea id="ans" style="width:100%; height:60px; background:#111; color:#00ff99; border:1px solid #00ff99; font-family:monospace; padding:8px; box-sizing:border-box;" placeholder="Escribe aquí los productos que compraste físicamente..."></textarea>
                <button id="btn" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; margin-top:10px;">REGISTRAR COMPRA EFECTIVA</button>
            </div>
        `,
        attachEvents: (role) => {
            let total = 0;
            const items = [];
            const sumEl = document.getElementById('basket-sum');
            const itemsEl = document.getElementById('basket-items');
            
            document.querySelectorAll('.add-snack').forEach(btn => {
                btn.addEventListener('click', () => {
                    const price = parseInt(btn.dataset.price);
                    const name = btn.dataset.name;
                    
                    if (total + price > 500) {
                        showAlert('EXCESO DE PRESUPUESTO', '¡Ese snack excede el presupuesto límite de 500¥!');
                        return;
                    }
                    
                    total += price;
                    items.push({name, price});
                    
                    // Render items
                    itemsEl.innerHTML = items.map((it, idx) => `
                        <span>${it.name}</span>
                        <span style="color:#00ff99;">${it.price}¥</span>
                    `).join('');
                    
                    sumEl.innerText = `${total} ¥ / 500 ¥`;
                    if (window.playProceduralSound) playProceduralSound('click');
                });
            });
            
            document.getElementById('btn').addEventListener('click', () => {
                const text = document.getElementById('ans').value.trim();
                if (!text) {
                    showAlert('VALOR REQUERIDO', 'Describe los productos reales que compraste en el Lawson/7-Eleven.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_4_500yen', {type:'text', data: `Cesta simulada: ${total}¥ | Real: ${text}`}, role);
            });
        }
    },

    "day_4_isshinji": {
        tag: "writing",
        day: 4,
        title: "Secreto Isshinji",
        role: "kid14",
        xp: 15,
        location: "Isshinji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0c0a0f; border:1px solid #e91e63; color:#e91e63; box-shadow:0 4px 20px rgba(233,30,99,0.25);">
                <p>>>> REGISTRO DE ESPECTRO ANCESTRAL // ISSHINJI</p>
                <p style="color:#aaa; font-size:0.85rem;">El templo tiene una estatua de Buda (Okotsu Butsu) hecha con un componente único y tétrico. Investiga o lee el cartel informativo.</p>
                
                <div style="margin:15px 0; padding:10px; background:rgba(233,30,99,0.05); border:1px solid #333; border-radius:5px;">
                    <p style="color:#ffd700; font-size:0.75rem; margin:0 0 5px 0;">💡 INDICIO HACKER:</p>
                    <span style="font-size:0.8rem; color:#fff;">Busca qué hacen con las cenizas de las personas fallecidas en este templo desde 1887...</span>
                </div>
                
                <input type="text" id="ans" style="width:100%; background:#111; color:#e91e63; border:1px solid #e91e63; padding:8px; font-family:monospace; box-sizing:border-box; margin-bottom:10px;" placeholder="¿De qué material está hecho?">
                <button id="btn" class="btn-primary" style="width:100%; border-color:#e91e63; color:#e91e63; background:transparent;">ENVIAR DECODIFICACIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                const text = document.getElementById('ans').value.toLowerCase().trim();
                if (!text) {
                    showAlert('VALOR REQUERIDO', 'Por favor, escribe tu respuesta sobre el material de la estatua.');
                    return;
                }
                const correctTerms = ['cenizas', 'ceniza', 'hueso', 'huesos', 'cenizas humanas', 'kotsu', 'okotsu'];
                const matched = correctTerms.some(t => text.includes(t));
                
                if (matched) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_4_isshinji', {type:'text', data: text}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('DECODIFICACIÓN INCORRECTA', 'La firma material no coincide. Revisa las placas informativas del templo.');
                }
            });
        }
    },

    "day_4_tracker": {
        tag: "physical",
        day: 4,
        title: "Rastreador de Kobe",
        role: "kid14",
        xp: 15,
        location: "Kuromon",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> RASTREO TÁCTICO DE MERCANCÍAS // WAGYU-KOBE</p>
                <p style="color:#aaa; font-size:0.85rem;">Camina por el mercado de Kuromon, incrementa el contador por cada puesto que veas sirviendo carne de Kobe/Wagyu y reporta su tasación comercial:</p>
                
                <div style="background:#111; padding:12px; border-radius:5px; border:1px solid #333; margin:15px 0; text-align:center;">
                    <div style="font-size:0.8rem; color:#ffd700; margin-bottom:5px;">WAGYU DETECTADOS EN EL ENTORNO:</div>
                    <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:10px 0;">
                        <button type="button" id="btn-sub-wagyu" style="width:35px; height:35px; background:#333; border:none; color:#fff; border-radius:5px; font-weight:bold; cursor:pointer;">-</button>
                        <span id="wagyu-count" style="font-size:2.2rem; font-weight:bold; min-width:50px;">0</span>
                        <button type="button" id="btn-add-wagyu" style="width:35px; height:35px; background:#00ff99; border:none; color:#222; border-radius:5px; font-weight:bold; cursor:pointer;">+</button>
                    </div>
                </div>

                <div id="wagyu-pricing-box" class="hidden" style="background:rgba(0,255,153,0.05); border:1px solid #00ff99; border-radius:5px; padding:10px; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#00ff99; margin:0 0 5px 0;">💰 TASACIÓN COMERCIAL:</p>
                    <p style="font-size:0.75rem; color:#ccc; margin:0 0 8px 0;">¿Cuál es el precio aproximado (en Yenes) de la brocheta o porción de Kobe/Wagyu más barata que has observado?</p>
                    <input type="number" id="wagyu-price-input" style="width:100%; background:#0a0e12; color:#00ff99; border:1px solid #00ff99; padding:8px; font-family:monospace; font-size:0.85rem;" placeholder="Introduce precio en ¥...">
                </div>
                
                <input type="hidden" id="ans" value="0">
                <button id="btn-submit-kobe" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>ENVIAR REPORTE AL CUARTEL</button>
            </div>
        `,
        attachEvents: (role) => {
            let count = 0;
            const countEl = document.getElementById('wagyu-count');
            const ansInput = document.getElementById('ans');
            const priceBox = document.getElementById('wagyu-pricing-box');
            const priceInput = document.getElementById('wagyu-price-input');
            const submitBtn = document.getElementById('btn-submit-kobe');
            
            const checkValidity = () => {
                const price = parseInt(priceInput.value);
                if (count > 0 && price >= 1000 && price <= 5000) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#00ff99';
                    submitBtn.style.color = '#00ff99';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                }
            };
            
            document.getElementById('btn-add-wagyu').addEventListener('click', () => {
                count++;
                countEl.innerText = count;
                ansInput.value = count;
                priceBox.classList.remove('hidden');
                checkValidity();
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            document.getElementById('btn-sub-wagyu').addEventListener('click', () => {
                if (count > 0) {
                    count--;
                    countEl.innerText = count;
                    ansInput.value = count;
                    if (count === 0) {
                        priceBox.classList.add('hidden');
                        priceInput.value = '';
                    }
                    checkValidity();
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            });

            priceInput.addEventListener('input', checkValidity);
            
            submitBtn.addEventListener('click', () => {
                const price = parseInt(priceInput.value);
                if (price < 1000 || price > 5000) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('TASACIÓN INCOHERENTE', 'El precio ingresado no se corresponde con las tasas de mercado habituales de carne de Kobe en brochetas en Kuromon (rango típico: 1,000 ¥ a 5,000 ¥). Investiga con atención.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_4_tracker', {
                    type: 'mixed',
                    data: `Puestos: ${count} | Precio unitario min: ¥${price}`
                }, role);
            });
        }
    },

    "day_4_yakiniku": {
        tag: "photo",
        day: 4,
        title: "Maestro Yakiniku",
        role: "both",
        xp: 20,
        location: "Restaurante",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ffd54f 0%, #ff8f00 100%); border-radius:15px; border:3px solid #e65100; color:#5d4037; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🔥 Ritual Yakiniku Familiar 🔥</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">¡Misión cooperativa familiar! En el restaurante Yakiniku, capturad la foto perfecta de la carne humeando en la parrilla justo en el instante en que uno le da la vuelta con las pinzas.</p>
                <div style="background:rgba(255,255,255,0.2); border-radius:8px; padding:10px; margin-bottom:15px; font-weight:bold;">
                    👨&zwj;👩&zwj;👧&zwj;👦 Fotógrafo + Volteador de carne = ¡Combo Perfecto!
                </div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#e65100; border-color:#e65100; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px;">📸 Tomar Foto Yakiniku</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_4_yakiniku', role, false, true)
    },

    "day_5_gymnast": {
        tag: "physical",
        day: 5,
        title: "La Gimnasta del Parque",
        role: "kid9",
        xp: 20,
        location: "Parque de Nara",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); border-radius:15px; border:3px solid #f06292; color:#880e4f; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌸 Pose de la Gacela de Nara 🦌</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#ad1457;">Busca un prado verde en el parque de Nara. Haz tu mejor salto o pose de equilibrio imitando la elegancia de un ciervo, sácale una foto y responde:</p>
                
                <div style="background:#fff; border-radius:10px; padding:10px; border:2px dashed #f06292; margin-bottom:15px; text-align:left; color:#880e4f;">
                    <p style="font-size:0.8rem; font-weight:bold; margin:0 0 5px 0;">🍘 TRIVIA DE CIERVOS:</p>
                    <p style="font-size:0.75rem; color:#ad1457; margin:0 0 8px 0;">¿Cómo se llaman las galletas redondas tradicionales que se venden para alimentar a los ciervos de Nara?</p>
                    <select id="gymnast-food" style="width:100%; padding:8px; border:1px solid #f06292; border-radius:5px; background:#fff; font-family:'Quicksand', sans-serif; font-size:0.8rem; color:#880e4f;">
                        <option value="">-- Selecciona una respuesta --</option>
                        <option value="mochi">Mochi de Matcha</option>
                        <option value="senbei">Shika-senbei (Galleta de ciervo)</option>
                        <option value="dango">Mitarashi Dango</option>
                    </select>
                </div>

                <div style="margin-bottom:15px;">
                    <button type="button" id="btn-select-gymnast-file" class="btn-secondary" style="width:100%; margin-bottom:8px; font-family:'Quicksand'; font-weight:bold; background:#f06292; border-color:#f06292; color:#fff;">📸 Foto de la Pose Sagrada</button>
                    <input type="file" id="gymnast-photo-input" accept="image/*" style="display:none;">
                    <div id="gymnast-photo-preview" style="display:none; margin-top:10px; font-size:0.85rem; color:#2e7d32; font-weight:bold;">✅ ¡Foto de acrobacia guardada!</div>
                </div>

                <button id="btn-submit-gymnast" class="btn-primary" style="width:100%; border-radius:25px; font-family:'Quicksand'; font-weight:bold; background:#f06292; border-color:#f06292; color:#fff;" disabled>Enviar Reporte Gacela</button>
            </div>
        `,
        attachEvents: (role) => {
            const selectFileBtn = document.getElementById('btn-select-gymnast-file');
            const fileInput = document.getElementById('gymnast-photo-input');
            const previewEl = document.getElementById('gymnast-photo-preview');
            const foodSelect = document.getElementById('gymnast-food');
            const submitBtn = document.getElementById('btn-submit-gymnast');
            
            let photoId = null;

            selectFileBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'gymnast_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });

            foodSelect.addEventListener('change', () => {
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });

            const checkValidity = () => {
                if (photoId && foodSelect.value === 'senbei') {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            };

            submitBtn.addEventListener('click', () => {
                if (foodSelect.value !== 'senbei') {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('TRIVIA INCORRECTA', 'Investiga el nombre de las galletas especiales. Se elaboran con salvado de trigo y harina de arroz, y están registradas oficialmente como Shika-senbei.');
                    return;
                }
                submitMission('day_5_gymnast', {
                    type: 'photo',
                    data: photoId,
                    metadata: { foodSelection: foodSelect.value }
                }, role);
            });
        }
    },

    "day_5_investor": {
        tag: "economy",
        day: 5,
        title: "El Inversor del Daibutsu",
        role: "kid14",
        xp: 15,
        location: "Nara",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0c0a05; border:1px solid #ffb300; color:#ffb300; box-shadow:0 4px 20px rgba(255,179,0,0.25);">
                <p>>>> MÓDULO ANÁLISIS DE ACTIVOS COMERCIALES</p>
                <p style="color:#aaa; font-size:0.85rem;">Identifica el souvenir más rentable de Nara hoy. Calcula su valor proyectado e introduce la justificación financiera.</p>
                
                <div style="margin:15px 0; padding:10px; background:rgba(255,179,0,0.05); border:1px dashed #ffb300; border-radius:5px;">
                    <label style="font-size:0.8rem; color:#ffb300; display:block; margin-bottom:5px;">ACTIVO IDENTIFICADO:</label>
                    <input type="text" id="t1" style="width:100%; background:#111; color:#ffb300; border:1px solid #ffb300; padding:6px; font-family:monospace; margin-bottom:10px;" placeholder="Ej: Omamori de Nara...">
                    
                    <label style="font-size:0.8rem; color:#ffb300; display:block; margin-bottom:5px;">CÁLCULO DEL ROI Y JUSTIFICACIÓN:</label>
                    <input type="text" id="t2" style="width:100%; background:#111; color:#ffb300; border:1px solid #ffb300; padding:6px; font-family:monospace;" placeholder="Ej: Es único, hecho a mano y mantendrá su valor histórico...">
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; border-color:#ffb300; color:#ffb300; background:transparent;">ENVIAR ANÁLISIS DE CARTERA</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                const i = document.getElementById('t1').value.trim();
                const r = document.getElementById('t2').value.trim();
                if (!i || !r) {
                    showAlert('VALOR INCOMPLETO', 'Por favor, introduce el activo y el análisis de ROI.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_5_investor', {type:'text', data:`Activo: ${i} | Análisis: ${r}`}, role);
            });
        }
    },

    "day_5_mochi": {
        tag: "game",
        day: 5,
        title: "El Ritmo del Mochi",
        role: "both",
        xp: 25,
        location: "Nara",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #4caf50; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🔨 ¡Ritmo del Mochi Nakatanidou! 🍡</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">¡Cooperativo! Uno de vosotros es el MAZO y el otro es la MANO. Alternad los botones a toda velocidad sin fallar cuando toque.</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #4caf50; margin-bottom:15px; text-align:center;">
                    <div id="mochi-status" style="font-size:3.5rem; transition: transform 0.1s ease;">⚪</div>
                    <div id="mochi-score" style="font-weight:bold; font-size:1.3rem; color:#4caf50; margin:5px 0;">Golpes: 0/50</div>
                    <div id="mochi-timer" style="font-size:1.5rem; font-weight:bold; color:#f44336;">60s</div>
                </div>
                
                <div id="mochi-target" style="font-size:1.2rem; font-weight:bold; color:#1b5e20; margin-bottom:15px; min-height:1.5rem;">Preparados...</div>
                
                <div style="display:flex; gap:10px; height:100px;">
                    <button id="btn-mazo" class="btn-secondary" style="flex:1; font-size:1.3rem; background:#cd7f32; border-color:#cd7f32; color:#fff; font-weight:bold; border-radius:10px;" disabled>🔨 MAZO</button>
                    <button id="btn-mano" class="btn-secondary" style="flex:1; font-size:1.3rem; background:#e0ac69; border-color:#e0ac69; color:#fff; font-weight:bold; border-radius:10px;" disabled>🤚 MANO</button>
                </div>
                
                <button id="btn-start" class="btn-primary" style="width:100%; margin-top:15px; background:#4caf50; border-color:#4caf50; font-weight:bold; border-radius:20px;">Comenzar Amasado</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px; background:#2e7d32; border-color:#2e7d32; font-weight:bold; border-radius:20px;">Enviar Reporte</button>
            </div>
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
            
            let hits = 0; let fails = 0; let time = 60; let active = false; let nextTarget = ''; let interval = null; let isDebounced = false;

            const updateTarget = () => {
                nextTarget = nextTarget === 'mazo' ? 'mano' : 'mazo';
                targetEl.innerText = nextTarget === 'mazo' ? '¡TURNO DEL MAZO! 🔨' : '¡TURNO DE LA MANO! 🤚';
            };

            const fail = () => {
                fails++; st.innerText = '💥';
                if (window.playProceduralSound) playProceduralSound('error');
                setTimeout(() => { if(active) st.innerText = '⚪'; }, 300);
                if(fails > 2) endGame(false);
            };

            const hit = (type) => {
                if(!active || isDebounced) return;
                if(type !== nextTarget) { fail(); return; }
                isDebounced = true; setTimeout(() => isDebounced = false, 100);
                
                hits++; sc.innerText = `Golpes: ${hits}/50`; st.innerText = '✨';
                st.style.transform = 'scale(1.2)';
                setTimeout(() => { 
                    if(active) st.innerText = '⚪'; 
                    st.style.transform = 'scale(1)';
                }, 100);
                if (window.playProceduralSound) playProceduralSound('click');
                
                if(hits >= 50) endGame(true); else updateTarget();
            };

            const endGame = (win) => {
                active = false; clearInterval(interval); btnMazo.disabled = true; btnMano.disabled = true;
                if(win) {
                    st.innerText = '🍡'; targetEl.innerText = '¡Mochi perfecto!';
                    btnSubmit.classList.remove('hidden'); 
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                } else {
                    st.innerText = '💥'; targetEl.innerText = '¡Mochi estropeado! Reintentar';
                    btnS.classList.remove('hidden'); btnS.innerText = 'Reintentar';
                }
            };

            btnS.addEventListener('click', () => {
                btnS.classList.add('hidden'); btnMazo.disabled = false; btnMano.disabled = false;
                hits = 0; fails = 0; time = 60; active = true; sc.innerText = `Golpes: 0/50`; st.innerText = '⚪';
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

    "day_5_monk": {
        tag: "game",
        day: 5,
        title: "Control Monje",
        role: "kid9",
        xp: 20,
        location: "Buda",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🧘 El Trono de Loto del Gran Buda 🧘</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">El Todai-ji custodia una estatua colosal de bronce de Buda sentado sobre un gigantesco loto. Contempla la base de la estatua y averigua:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px dashed #8d6e63; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#8d6e63; margin:0 0 5px 0;">🪷 PÉTALOS DE BRONCE:</p>
                    <p style="font-size:0.75rem; color:#5d4037; margin:0 0 8px 0;">¿Cuántos pétalos gigantes grabados componen el trono de loto de bronce del Daibutsu?</p>
                    <input type="number" id="monk-petals" style="width:100%; padding:8px; border:1px solid #8d6e63; border-radius:5px; font-family:'Quicksand'; font-size:0.85rem;" placeholder="Escribe el número de pétalos...">
                    <p style="font-size:0.7rem; color:#8d6e63; margin:5px 0 0 0; font-style:italic;">Pista: Es un número par mayor de 50 y menor de 60.</p>
                </div>

                <button id="btn-submit-monk" class="btn-primary" style="width:100%; border-radius:25px; font-family:'Quicksand'; font-weight:bold; background:#8d6e63; border-color:#8d6e63; color:#fff;" disabled>Enviar Respuesta Zen</button>
            </div>
        `,
        attachEvents: (role) => {
            const petalsInput = document.getElementById('monk-petals');
            const submitBtn = document.getElementById('btn-submit-monk');

            const checkValidity = () => {
                const val = parseInt(petalsInput.value);
                if (val === 56) {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            };

            petalsInput.addEventListener('input', checkValidity);

            submitBtn.addEventListener('click', () => {
                const val = parseInt(petalsInput.value);
                if (val !== 56) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('CÓDIGO INEXACTO', 'Ese número no es correcto. Observa el pedestal del Buda o consulta los folletos del Todai-ji. El loto tiene exactamente 56 pétalos de bronce esculpidos.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_5_monk', {type:'game', data:`Pétalos de loto del Buda: ${val}`}, role);
            });
        }
    },

    "day_5_deer_galaxy": {
        tag: "physical",
        day: 5,
        title: "La Galaxia de los Ciervos",
        role: "kid9",
        xp: 20,
        location: "Parque de Nara",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f7fa 0%, #80deea 100%); border-radius:15px; border:3px solid #00acc1; color:#006064; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">✨ El Registro Galáctico de Ciervos 🦌</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#00838f;">¡Hay cientos de ciervos libres en Nara! Cuéntalos con el panel táctil y estima la proporción de astas en el rebaño:</p>
                
                <div style="background:#fff; border-radius:10px; padding:15px; border:2px solid #00acc1; margin-bottom:15px;">
                    <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin-bottom:10px;">
                        <button type="button" id="btn-sub" style="font-size:1.5rem; width:45px; height:45px; border-radius:50%; background:#00acc1; color:#fff; border:none; line-height:1; cursor:pointer;">-</button>
                        <div id="deer-count" style="font-size:2.5rem; font-weight:bold; color:#006064; min-width:60px;">0</div>
                        <button type="button" id="btn-add" style="font-size:1.5rem; width:45px; height:45px; border-radius:50%; background:#00acc1; color:#fff; border:none; line-height:1; cursor:pointer;">+</button>
                    </div>
                    
                    <div id="deer-grid" style="display:flex; flex-wrap:wrap; justify-content:center; gap:4px; min-height:40px; max-height:80px; overflow-y:auto; border-top:1px dashed #b2ebf2; padding-top:8px;">
                        <span style="color:#aaa; font-size:0.8rem;">(Añade ciervos para verlos aparecer)</span>
                    </div>
                </div>

                <div id="deer-horns-box" class="hidden" style="background:#fff; border-radius:10px; padding:12px; border:2px dashed #00acc1; margin-bottom:15px; text-align:left;">
                    <p style="font-size:0.8rem; font-weight:bold; color:#00acc1; margin:0 0 5px 0;">🦌 ESTIMACIÓN DE ASTAS:</p>
                    <p style="font-size:0.75rem; color:#00838f; margin:0 0 8px 0;">¿Qué porcentaje aproximado de los ciervos contados tienen astas visibles?</p>
                    <input type="range" id="deer-horns-ratio" min="0" max="100" value="30" style="width:100%; cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#00838f; font-weight:bold; margin-top:5px;">
                        <span>0% (Ninguno)</span>
                        <span id="horns-val">30%</span>
                        <span>100% (Todos)</span>
                    </div>
                </div>
                
                <button id="btn-submit-deer" class="btn-primary" style="width:100%; background:#00acc1; border-color:#00acc1; font-weight:bold; border-radius:20px;" disabled>Enviar Censo de Ciervos</button>
            </div>
        `,
        attachEvents: (role) => {
            let count = 0;
            const countEl = document.getElementById('deer-count');
            const gridEl = document.getElementById('deer-grid');
            const submitBtn = document.getElementById('btn-submit-deer');
            const hornsBox = document.getElementById('deer-horns-box');
            const hornsRatio = document.getElementById('deer-horns-ratio');
            const hornsVal = document.getElementById('horns-val');
            
            const updateDeerVisual = () => {
                countEl.innerText = count;
                if (count === 0) {
                    gridEl.innerHTML = '<span style="color:#aaa; font-size:0.8rem;">(Añade ciervos para verlos aparecer)</span>';
                    hornsBox.classList.add('hidden');
                } else {
                    gridEl.innerHTML = '🦌'.repeat(count);
                    hornsBox.classList.remove('hidden');
                }
                checkValidity();
            };

            const checkValidity = () => {
                if (count > 0) {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            };
            
            document.getElementById('btn-add').addEventListener('click', () => {
                count++;
                updateDeerVisual();
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            document.getElementById('btn-sub').addEventListener('click', () => {
                if (count > 0) {
                    count--;
                    updateDeerVisual();
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            });

            hornsRatio.addEventListener('input', () => {
                hornsVal.innerText = hornsRatio.value + '%';
            });
            
            submitBtn.addEventListener('click', () => {
                if (count <= 0) return;
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_5_deer_galaxy', {
                    type:'physical', 
                    data:`Contados: ${count} ciervos | Proporción de astas: ${hornsRatio.value}%`
                }, role);
            });
        }
    },

    "day_5_ribbon": {
        tag: "sensors",
        day: 5,
        title: "La Danza de la Cinta",
        role: "kid9",
        xp: 30,
        location: "Nara",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%); border-radius:15px; border:3px solid #0288d1; color:#01579b; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌀 Cinta Mágica de Nara 🪄</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#0288d1;">Mueve el móvil en círculos suaves por el aire trazando una cinta mágica virtual para saludar a los ciervos.</p>
                
                <div style="background:#fff; border-radius:10px; border:2px solid #0288d1; height:120px; overflow:hidden; position:relative; margin-bottom:15px;">
                    <canvas id="ribbon-canvas" width="280" height="120" style="display:block; width:100%; height:120px;"></canvas>
                    <div id="ribbon-val" style="position:absolute; bottom:5px; right:10px; font-weight:bold; color:#0288d1; font-size:1.5rem;">0 %</div>
                </div>
                
                <button id="btn-scan" class="btn-primary" style="width:100%; background:#0288d1; border-color:#0288d1; font-weight:bold; border-radius:20px;">🪄 Iniciar Danza de Cinta</button>
            </div>
        `,
        attachEvents: (role) => {
            let active = false;
            let handler = null;
            let timer = null;
            const btn = document.getElementById('btn-scan');
            const valEl = document.getElementById('ribbon-val');
            const canvas = document.getElementById('ribbon-canvas');
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            let points = [];
            let score = 0;
            
            const drawRibbon = () => {
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                if (points.length < 2) return;
                
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#0288d1';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#0288d1';
                
                ctx.moveTo(points[0].x, points[0].y);
                for(let i=1; i<points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                if (points.length > 30) points.shift();
            };
            
            btn.addEventListener('click', async () => {
                if (active) return;
                
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    try {
                        const p = await DeviceOrientationEvent.requestPermission();
                        if (p !== 'granted') {
                            showAlert('Permiso Denegado', 'Esta misión requiere acceso a los sensores de movimiento. Por favor, habilítalos en los ajustes de tu dispositivo.');
                            return;
                        }
                    } catch (err) {
                        console.error(err);
                        showAlert('Error', 'No se pudo activar el sensor de movimiento.');
                        return;
                    }
                }
                
                btn.style.display = 'none';
                active = true;
                score = 0;
                points = [];
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                handler = (ev) => {
                    if(!active) return;
                    const x = Math.min(canvas.width, Math.max(0, canvas.width / 2 + (ev.gamma || 0) * 4));
                    const y = Math.min(canvas.height, Math.max(0, canvas.height / 2 + (ev.beta || 0) * 3));
                    points.push({x, y});
                    drawRibbon();
                    
                    score += Math.abs(ev.alpha || 0) / 10;
                    const percent = Math.min(100, Math.floor((score / 150) * 100));
                    valEl.innerText = percent + ' %';
                };
                
                window.addEventListener('deviceorientation', handler);
                if (window.playProceduralSound) playProceduralSound('click');
                
                timer = setTimeout(() => {
                    active = false;
                    window.removeEventListener('deviceorientation', handler);
                    
                    if (score < 150) {
                        if (window.playProceduralSound) playProceduralSound('error');
                        showAlert('DANZA INSUFICIENTE', 'La cinta mágica apenas se ha dibujado en el aire. Mueve tu brazo trazando círculos amplios para saludar con elegancia a los ciervos de Nara.');
                        btn.style.display = 'block';
                        valEl.innerText = '0 %';
                        points = [];
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    } else {
                        valEl.innerText = '100% [COMPLETA]';
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                        
                        setTimeout(() => {
                            submitMission('day_5_ribbon', {type:'sensors', data:'Danza de la cinta: ' + Math.floor(score) + ' ptos'}, role);
                        }, 1200);
                    }
                }, 10000);
            });
            
            window._missionCleanup = () => {
                active = false;
                if (handler) window.removeEventListener('deviceorientation', handler);
                if (timer) clearTimeout(timer);
            };
        }
    },

    "day_5_zen": {
        tag: "writing",
        day: 5,
        title: "Caligrafía Zen",
        role: "kid14",
        xp: 15,
        location: "Nara",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0e0f0a; border:1px solid #cddc39; color:#cddc39; box-shadow:0 4px 20px rgba(205,220,57,0.25);">
                <p>>>> PRUEBA DE CONCENTRACIÓN Y CALIGRAFÍA SHODO</p>
                <p style="color:#aaa; font-size:0.85rem;">Escribe el Kanji de "Persona" (人) o "Montaña" (山). Puedes usar el teclado en japonés o romaji.</p>
                
                <div style="background:#fff; border-radius:8px; border:3px solid #cddc39; padding:5px; margin:15px 0; height:120px; position:relative; overflow:hidden;">
                    <canvas id="shodo-canvas" width="280" height="120" style="display:block; width:100%; height:120px; cursor:crosshair; background:#fff;"></canvas>
                </div>
                
                <input type="text" id="ans" style="width:100%; background:#111; color:#cddc39; border:1px solid #cddc39; padding:8px; font-family:monospace; text-align:center; font-size:1.5rem; box-sizing:border-box; margin-bottom:10px;" placeholder="人 / 山">
                <button id="btn" class="btn-primary" style="width:100%; border-color:#cddc39; color:#cddc39; background:transparent;">VALIDAR TRAZO Y KANJI</button>
            </div>
        `,
        attachEvents: (role) => {
            const canvas = document.getElementById('shodo-canvas');
            const ctx = canvas.getContext('2d');
            const btn = document.getElementById('btn');
            const input = document.getElementById('ans');
            
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            let drawing = false;
            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.touches ? e.touches[0].clientX : e.clientX;
                const y = e.touches ? e.touches[0].clientY : e.clientY;
                return { x: x - rect.left, y: y - rect.top };
            };
            
            canvas.addEventListener('mousedown', (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
            canvas.addEventListener('mousemove', (e) => { if(drawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } });
            canvas.addEventListener('mouseup', () => drawing = false);
            canvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, {passive:false});
            canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if(drawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } }, {passive:false});
            canvas.addEventListener('touchend', () => drawing = false);
            
            btn.addEventListener('click', () => {
                const txt = input.value.trim();
                if (!txt || (!txt.includes('人') && !txt.includes('山') && !txt.toLowerCase().includes('hito') && !txt.toLowerCase().includes('yama') && !txt.toLowerCase().includes('persona') && !txt.toLowerCase().includes('montaña'))) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('TRAZO INCORRECTO', 'El Kanji ingresado no corresponde a Persona (人) o Montaña (山).');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_5_zen', {type:'text', data: `Kanji: ${txt}`}, role);
            });
        }
    },

    "day_5_engineer": {
        tag: "expert",
        day: 5,
        title: "Ingeniero Todai-ji",
        role: "kid14",
        xp: 20,
        location: "Todai-ji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a1014; border:1px solid #00bcd4; color:#00bcd4; box-shadow:0 4px 20px rgba(0,188,212,0.25);">
                <p>>>> MÓDULO ANÁLISIS ESTRUCTURAL TODAI-JI</p>
                <p style="color:#aaa; font-size:0.85rem;">Todai-ji es el edificio de madera más grande del mundo. Estima su altura en pisos de un edificio residencial convencional.</p>
                
                <div style="margin:15px 0; padding:10px; background:rgba(0,188,212,0.05); border:1px dashed #00bcd4; border-radius:5px; text-align:center;">
                    <label style="font-size:0.8rem; color:#ffd700; display:block; margin-bottom:5px;">ALTURA ESTIMADA (EN PISOS):</label>
                    <div id="eng-display" style="font-size:2rem; font-weight:bold; margin:5px 0;">15 Pisos</div>
                    <input type="range" id="ans-range" min="5" max="30" value="15" style="width:100%; accent-color:#00bcd4; cursor:pointer;">
                </div>
                
                <div style="margin-bottom:15px; border:1px solid #222; border-radius:4px; overflow:hidden; background:#111; height:80px; display:flex; align-items:flex-end; justify-content:center; gap:20px; padding-bottom:5px;">
                    <div style="text-align:center;">
                        <span style="font-size:1.8rem;">⛩️</span><br>
                        <span style="font-size:0.6rem; color:#aaa;">Todai-ji</span>
                    </div>
                    <div style="width:2px; height:60px; background:#333;"></div>
                    <div style="text-align:center; display:flex; flex-direction:column; align-items:center;">
                        <div id="eng-building-block" style="width:20px; height:45px; background:#00bcd4; border-radius:2px; transition:height 0.2s ease;"></div>
                        <span style="font-size:0.6rem; color:#aaa; margin-top:2px;">Tu Estimación</span>
                    </div>
                </div>
                
                <input type="hidden" id="ans" value="15">
                <button id="btn" class="btn-primary" style="width:100%; border-color:#00bcd4; color:#00bcd4; background:transparent;">TRANSMITIR VECTOR DE CARGAS</button>
            </div>
        `,
        attachEvents: (role) => {
            const range = document.getElementById('ans-range');
            const display = document.getElementById('eng-display');
            const block = document.getElementById('eng-building-block');
            const ansInput = document.getElementById('ans');
            const btn = document.getElementById('btn');
            
            range.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                display.innerText = val + ' Pisos';
                ansInput.value = val;
                
                // Map range 5-30 to height 15-60px
                const height = 15 + ((val - 5) / 25) * 45;
                block.style.height = height + 'px';
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btn.addEventListener('click', () => {
                const val = parseInt(ansInput.value);
                if (val < 12 || val > 20) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('CÁLCULO INEXACTO', 'La altura real del pabellón principal del Todai-ji es de 49 metros. Aproxímate a su equivalencia real en plantas de edificio convencional (cada planta mide ~3 metros). Reajusta el slider entre 12 y 20 plantas.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_5_engineer', {type:'number', data: val}, role);
            });
        }
    },

    "day_5_guardian": {
        tag: "physical",
        day: 5,
        title: "El Guardián de la Suerte",
        role: "kid14",
        xp: 20,
        location: "Todai-ji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0f0f0a; border:1px solid #ff9800; color:#ff9800; box-shadow:0 4px 20px rgba(255,152,0,0.25);">
                <p>>>> ESCANEO BIOMÉTRICO DE PILARES SAGRADOS</p>
                <p style="color:#aaa; font-size:0.85rem;">En el Todai-ji hay un pilar con un agujero del tamaño de una fosa nasal del Buda. Abrázalo o simúlalo e introduce la respuesta correcta del enigma:</p>
                
                <div style="background:#111; padding:15px; border-radius:5px; border:1px solid #333; margin:15px 0; text-align:center;">
                    <div style="font-size:3rem; margin-bottom:10px;" id="pillar-emoji">🪵</div>
                    <label style="font-size:0.8rem; color:#ff9800; display:block; margin-bottom:10px;">¿QUÉ PARTE DE LA ANATOMÍA DEL BUDA TIENE EL MISMO TAMAÑO QUE EL AGUJERO DEL PILAR DE LA SUERTE?</label>
                    <select id="pillar-anatomia" style="width:100%; padding:8px; border:1px solid #ff9800; border-radius:5px; background:#0f0f0a; color:#ff9800; font-family:monospace; font-size:0.85rem;">
                        <option value="">-- Elige la opción --</option>
                        <option value="oreja">Su oreja gigante (que escucha todas las plegarias)</option>
                        <option value="dedo">Su dedo pulgar (que da la bendición)</option>
                        <option value="fosanasal">Su fosa nasal (por donde respira el Gran Buda)</option>
                    </select>
                </div>
                
                <button id="btn-submit" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>ENVIAR REPORTE BIOMÉTRICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const selectOption = document.getElementById('pillar-anatomia');
            const submitBtn = document.getElementById('btn-submit');
            const emojiEl = document.getElementById('pillar-emoji');
            
            selectOption.addEventListener('change', () => {
                const val = selectOption.value;
                if (val === 'fosanasal') {
                    emojiEl.innerText = '👃✨';
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#ff9800';
                    submitBtn.style.color = '#ff9800';
                } else {
                    emojiEl.innerText = '🪵';
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                }
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            submitBtn.addEventListener('click', () => {
                if (selectOption.value !== 'fosanasal') {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('ESCANEO ERRÓNEO', 'El agujero en la columna trasera del templo Todai-ji tiene exactamente las mismas dimensiones que una fosa nasal del Gran Buda (Daibutsu). Los valientes que logran pasar por el agujero obtienen la iluminación en la siguiente vida.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_5_guardian', {type:'text', data: 'Fosa nasal de Buda confirmada'}, role);
            });
        }
    },

    "day_6_evasion": {
        tag: "physical",
        day: 6,
        title: "Técnica de Evasión",
        role: "kid9",
        xp: 20,
        location: "Nijo",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🥷 Sigilo en el Castillo Nijo 🥷</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Cruza el puente exterior de piedra dando pasos extremadamente silenciosos. Si haces ruido, activarás los sensores de alerta. Mantén el silencio por 15 segundos:</p>
                
                <div style="background:#fff; border-radius:10px; padding:15px; border:2px solid #8d6e63; margin-bottom:15px;">
                    <div style="font-size:1.1rem; font-weight:bold; color:#5d4037; margin-bottom:10px;">🔊 AUDITORÍA DE RUIDO REAL:</div>
                    <div style="width:100%; background:#eee; height:15px; border-radius:8px; overflow:hidden; border:1px solid #ccc; margin-bottom:8px;">
                        <div id="noise-meter" style="width:0%; height:100%; background:#4caf50; transition:width 0.1s ease;"></div>
                    </div>
                    <div id="noise-txt" style="font-size:0.8rem; font-weight:bold; color:#4caf50; margin-bottom:10px;">LISTO PARA ESCUCHAR</div>
                    <div id="escape-timer" style="font-size:2rem; font-weight:bold; color:#8d6e63;">15s</div>
                </div>
                
                <button id="btn-start-escape" class="btn-primary" style="width:100%; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:20px; font-family:'Quicksand';">🔇 Activar Sensores y Cruzar</button>
            </div>
        `,
        attachEvents: (role) => {
            const startBtn = document.getElementById('btn-start-escape');
            const meter = document.getElementById('noise-meter');
            const txt = document.getElementById('noise-txt');
            const timerEl = document.getElementById('escape-timer');
            
            let audioCtx = null;
            let analyser = null;
            let stream = null;
            let interval = null;
            let active = false;
            let timeLeft = 15;
            
            startBtn.addEventListener('click', async () => {
                if (active) return;
                
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioCtx.createAnalyser();
                    const source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);
                    
                    analyser.fftSize = 256;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    
                    active = true;
                    startBtn.style.display = 'none';
                    timeLeft = 15;
                    timerEl.innerText = '15s';
                    
                    interval = setInterval(() => {
                        if (!active) return;
                        
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        const avg = sum / bufferLength;
                        
                        const pct = Math.min(100, Math.floor((avg / 60) * 100));
                        meter.style.width = pct + '%';
                        
                        if (avg > 28) {
                            meter.style.background = '#f44336';
                            txt.innerText = '¡ALERTA DE RUIDO! PISADA FUERTE';
                            txt.style.color = '#f44336';
                            timeLeft = 15;
                            timerEl.innerText = '15s';
                            if (window.playProceduralSound) playProceduralSound('error');
                            timerEl.style.transform = 'scale(1.2)';
                            setTimeout(() => { timerEl.style.transform = 'scale(1)'; }, 200);
                        } else if (avg > 12) {
                            meter.style.background = '#ffd54f';
                            txt.innerText = 'SUSURRO/ROCE DETECTADO';
                            txt.style.color = '#ffd54f';
                        } else {
                            meter.style.background = '#4caf50';
                            txt.innerText = 'SILENCIO ABSOLUTO';
                            txt.style.color = '#4caf50';
                        }
                        
                        timeLeft -= 0.25;
                        const dispTime = Math.max(0, Math.ceil(timeLeft));
                        timerEl.innerText = dispTime + 's';
                        
                        if (timeLeft <= 0) {
                            active = false;
                            clearInterval(interval);
                            stream.getTracks().forEach(t => t.stop());
                            audioCtx.close();
                            
                            timerEl.innerText = '¡LOGRADO!';
                            timerEl.style.color = '#4caf50';
                            if (window.playProceduralSound) playProceduralSound('success');
                            if (window.launchConfetti) launchConfetti();
                            
                            setTimeout(() => {
                                submitMission('day_6_evasion', {type:'physical', data:'Puente cruzado en silencio auditado con micrófono real'}, role);
                            }, 1200);
                        }
                    }, 250);
                    
                } catch (err) {
                    console.error(err);
                    showAlert('MICRÓFONO REQUERIDO', 'Para cruzar el puente de piedra de Nijo en silencio absoluto es necesario activar el micrófono del dispositivo.');
                }
            });
            
            window._missionCleanup = () => {
                active = false;
                if (interval) clearInterval(interval);
                if (stream) stream.getTracks().forEach(t => t.stop());
                if (audioCtx) audioCtx.close();
            };
        }
    },

    "day_6_clan": {
        tag: "photo",
        day: 6,
        title: "El Retrato del Clan",
        role: "both",
        xp: 20,
        location: "Castillo Nijo",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #263238 0%, #37474f 100%); border-radius:15px; border:3px solid #b0bec5; color:#fff; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.3);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🏯 Retrato del Clan Feudal ⚔️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#cfd8dc;">Buscad un muro del castillo espectacular. Configurad el temporizador de la cámara y posad toda la familia con la postura y mirada más seria de samuráis feudales.</p>
                <div style="font-size:3rem; margin:15px 0;">🥋🛡️⚔️</div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#cfd8dc; border-color:#cfd8dc; color:#222; font-weight:bold; font-size:1.1rem; border-radius:25px;">📸 Retrato de Clan</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_6_clan', role, false, true)
    },

    "day_6_seal": {
        tag: "photo",
        day: 6,
        title: "El Sello del Shogun",
        role: "kid9",
        xp: 15,
        location: "Castillo Nijo",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fff9c4 0%, #fff176 100%); border-radius:15px; border:3px solid #fbc02d; color:#f57f17; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">⚜️ El Escudo Tokugawa de Malva ⚜️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#e65100;">El emblema de tres hojas de malva del clan Shogun está tallado en vigas, tejas y portones de oro del castillo. ¡Encuentra uno y hazle una foto!</p>
                
                <div style="background:#fff; border-radius:10px; padding:10px; border:2px solid #fbc02d; display:inline-block; margin-bottom:15px;">
                    <div style="font-size:3rem; filter:drop-shadow(0 2px 4px rgba(245,127,23,0.3));">🍀</div>
                </div>
                
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#fbc02d; border-color:#fbc02d; color:#222; font-weight:bold; border-radius:25px;">📸 Foto del Sello Shogunal</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_6_seal', role, false)
    },

    "day_6_clouds": {
        tag: "writing",
        day: 6,
        title: "Jardín de Nubes",
        role: "kid9",
        xp: 15,
        location: "Palacio",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%); border-radius:15px; border:3px solid #0288d1; color:#01579b; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌲 Pinos Nube del Palacio ☁️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#0288d1;">Los pinos del Palacio Imperial de Kioto están esculpidos para parecer nubes. Encuentra uno, elige a qué se parece y descríbelo en detalle:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #0288d1; text-align:left; margin-bottom:15px;">
                    <label style="font-size:0.8rem; font-weight:bold; color:#0288d1; display:block; margin-bottom:5px;">🦖 GUÍA DE ANIMALES IMAGINADOS:</label>
                    <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;">
                        <button type="button" class="cloud-tag-btn" data-tag="Dragón" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #0288d1; background:#fff; cursor:pointer; font-family:'Quicksand';">🐉 Dragón</button>
                        <button type="button" class="cloud-tag-btn" data-tag="Zorro" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #0288d1; background:#fff; cursor:pointer; font-family:'Quicksand';">🦊 Zorro</button>
                        <button type="button" class="cloud-tag-btn" data-tag="Pájaro" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #0288d1; background:#fff; cursor:pointer; font-family:'Quicksand';">🦅 Pájaro</button>
                        <button type="button" class="cloud-tag-btn" data-tag="Tortuga" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #0288d1; background:#fff; cursor:pointer; font-family:'Quicksand';">🐢 Tortuga</button>
                    </div>
                    <input type="text" id="ans" style="width:100%; border:1px solid #ccc; border-radius:5px; padding:8px; font-family:inherit; font-size:0.85rem; box-sizing:border-box;" placeholder="Descríbelo con al menos 10 letras...">
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; background:#0288d1; border-color:#0288d1; color:#fff; font-weight:bold; border-radius:20px;" disabled>📨 Mandar Reporte</button>
            </div>
        `,
        attachEvents: (role) => {
            let selectedTag = '';
            const tagBtns = document.querySelectorAll('.cloud-tag-btn');
            const textInput = document.getElementById('ans');
            const submitBtn = document.getElementById('btn');
            
            const checkValidity = () => {
                const text = textInput.value.trim();
                if (selectedTag && text.length >= 10) {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            };
            
            tagBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    tagBtns.forEach(b => {
                        b.style.background = '#fff';
                        b.style.color = '#333';
                    });
                    btn.style.background = '#b3e5fc';
                    btn.style.color = '#01579b';
                    selectedTag = btn.dataset.tag;
                    if (window.playProceduralSound) playProceduralSound('click');
                    checkValidity();
                });
            });

            textInput.addEventListener('input', checkValidity);
            
            submitBtn.addEventListener('click', () => {
                const text = textInput.value.trim();
                if (text.length < 10) return;
                const result = `[Tipo ${selectedTag}] ${text}`;
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_6_clouds', {type:'text', data: result}, role);
            });
        }
    },

    "day_6_ninja_steps": {
        tag: "game",
        day: 6,
        title: "Pasos de Ninja",
        role: "kid9",
        xp: 20,
        location: "Nijo",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border-radius:15px; border:3px solid #f44336; color:#b71c1c; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">👣 Evita el Suelo Ruiseñor 👣</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#c62828;">El suelo de Nijo chirría como un pájaro para delatar intrusos. Toca la pantalla en el momento exacto en el que el pie cruce la zona roja.</p>
                
                <div style="background:#3e2723; border:3px solid #d7ccc8; border-radius:10px; padding:15px; position:relative; width:150px; height:240px; margin:0 auto 15px; overflow:hidden;">
                    <div id="ninja-target" style="position:absolute; bottom:20px; width:120px; height:45px; background:rgba(255,0,0,0.4); border-radius:5px; border:2px dashed #ff1744; left:15px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:bold;">ZONA SILENCIOSA</div>
                    <div id="ninja-foot" style="position:absolute; top:-50px; left:50px; width:50px; height:50px; font-size:2.8rem; transition: transform 0.05s ease;">🥷</div>
                </div>
                
                <button id="btn-step" class="btn-primary" style="width:100%; background:#f44336; border-color:#f44336; color:#fff; font-weight:bold; border-radius:20px; height:45px;">PISAR AHORA</button>
            </div>
        `,
        attachEvents: (role) => {
            let hits = 0;
            let int;
            let active = true;
            let pos = -50;
            const foot = document.getElementById('ninja-foot');
            const btn = document.getElementById('btn-step');
            
            const loop = () => {
                if(!active) return;
                pos += 4;
                foot.style.top = pos + 'px';
                if(pos > 240) { pos = -50; }
                int = requestAnimationFrame(loop);
            };
            loop();
            
            btn.addEventListener('click', () => {
                if (!active) return;
                if(pos >= 165 && pos <= 215) {
                    hits++;
                    pos = -50;
                    if (window.playProceduralSound) playProceduralSound('click');
                    
                    if(hits >= 3) {
                        active = false;
                        cancelAnimationFrame(int);
                        foot.innerText = '🥷✨';
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                        
                        setTimeout(() => {
                            submitMission('day_6_ninja_steps', {type:'game', data:'Pasos de ninja sincronizados en el suelo'}, role);
                        }, 1200);
                    } else {
                        btn.innerText = `¡SILENCIO! (${hits}/3)`;
                    }
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('¡CHIRRIDO!', '¡El suelo de madera ha sonado como un ruiseñor! Concéntrate y pisa solo en la zona roja.');
                }
            });
            window._missionCleanup = () => { active=false; cancelAnimationFrame(int); };
        }
    },

    "day_6_tactical": {
        tag: "expert",
        day: 6,
        title: "Infiltración Táctica",
        role: "kid14",
        xp: 20,
        location: "Nijo",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#080b0e; border:1px solid #00e5ff; color:#00e5ff; box-shadow:0 4px 20px rgba(0,229,255,0.25);">
                <p>>>> ANÁLISIS DE PERÍMETRO Y PUNTOS CIEGOS // CASTILLO NIJO</p>
                <p style="color:#aaa; font-size:0.85rem;">Localiza 2 puntos ciegos (árboles, esquinas de muros, pasillos exteriores) e introduce tu ruta de escape sin pisar los suelos ruiseñor.</p>
                
                <div style="background:#111; border:1px solid #333; padding:10px; border-radius:5px; margin:15px 0;">
                    <div style="font-size:0.75rem; color:#ffd700; margin-bottom:5px;">⚙️ COORDENADAS RECOMENDADAS:</div>
                    <div style="font-size:0.8rem; display:flex; flex-direction:column; gap:4px; color:#fff;">
                        <span>🛡️ P1: Muro Exterior del Foso</span>
                        <span>🏯 P2: Jardín Ninomaru</span>
                    </div>
                </div>
                
                <textarea id="ans" style="width:100%; height:80px; background:#111; color:#00e5ff; border:1px solid #00e5ff; font-family:monospace; padding:8px; box-sizing:border-box; margin-bottom:10px;" placeholder=">>> Escribe tu informe de ruta táctica... (pared, foso, silencio, ruiseñor...)"></textarea>
                <button id="btn" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>TRANSMITIR VECTOR DE ESCAPE</button>
            </div>
        `,
        attachEvents: (role) => {
            const submitBtn = document.getElementById('btn');
            const textarea = document.getElementById('ans');
            
            const checkValidity = () => {
                const text = textarea.value.trim().toLowerCase();
                const keywords = ['pared', 'silencio', 'ruiseñor', 'sombra', 'jardín', 'jardin', 'foso', 'puente'];
                const hasKeyword = keywords.some(kw => text.includes(kw));
                if (text.length >= 15 && hasKeyword) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#00e5ff';
                    submitBtn.style.color = '#111';
                    submitBtn.style.background = '#00e5ff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                    submitBtn.style.background = 'transparent';
                }
            };

            textarea.addEventListener('input', checkValidity);

            submitBtn.addEventListener('click', () => {
                const text = textarea.value.trim();
                const keywords = ['pared', 'silencio', 'ruiseñor', 'sombra', 'jardín', 'jardin', 'foso', 'puente'];
                const hasKeyword = keywords.some(kw => text.toLowerCase().includes(kw));
                if (text.length < 15 || !hasKeyword) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('RUTA INCOMPLETA', 'El cuartel ninja requiere un vector con al menos 15 caracteres y términos de referencia topográfica (pared, silencio, ruiseñor, foso, sombra, jardín) para certificar el análisis.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_6_tactical', {type:'text', data: text}, role);
            });
        }
    },

    "day_6_edict": {
        tag: "writing",
        day: 6,
        title: "Edicto Imperial",
        role: "kid14",
        xp: 15,
        location: "Palacio",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#12080a; border:1px solid #ff1744; color:#ff1744; box-shadow:0 4px 20px rgba(255,23,68,0.25);">
                <p>>>> REDACCIÓN DE EDICITOS IMPERIALES // PROTOCOLO ABSURDO</p>
                <p style="color:#aaa; font-size:0.85rem;">Eres el Emperador por un día en el Palacio de Kioto. Redacta un decreto ridículo que todos los visitantes deban obedecer.</p>
                
                <div style="margin:15px 0; padding:12px; background:#fff; border-radius:6px; border:2px solid #ff1744; color:#222; text-align:center; position:relative; font-family:Georgia, serif;">
                    <div style="font-size:1.5rem; font-weight:bold; margin-bottom:10px;">📜 DECRETO REAL 📜</div>
                    <textarea id="ans" style="width:100%; height:60px; border:1px dashed #ff1744; background:transparent; font-family:inherit; padding:5px; font-size:0.95rem; box-sizing:border-box;" placeholder="Todos los súbditos deberán caminar a la pata coja en el palacio... (mínimo 20 caracteres)"></textarea>
                    <div style="position:absolute; bottom:5px; right:10px; font-size:2rem; opacity:0.8;">💮</div>
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>PROMULGAR DECRETO REAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const textarea = document.getElementById('ans');
            const submitBtn = document.getElementById('btn');

            const checkValidity = () => {
                const val = textarea.value.trim();
                if (val.length >= 20) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#ff1744';
                    submitBtn.style.color = '#fff';
                    submitBtn.style.background = '#ff1744';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                    submitBtn.style.background = 'transparent';
                }
            };

            textarea.addEventListener('input', checkValidity);

            submitBtn.addEventListener('click', () => {
                const val = textarea.value.trim();
                if (val.length < 20) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('EDICTO INSIGNIFICANTE', 'Un edicto imperial debe ser solemne y descriptivo. Escribe al menos 20 caracteres de decreto absurdo.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_6_edict', {type:'text', data: val}, role);
            });
        }
    },

    "day_6_time_travel": {
        tag: "photo",
        day: 6,
        title: "Viaje en el Tiempo",
        role: "kid14",
        xp: 15,
        location: "Castillo de Nijo",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0c0812; border:1px solid #d500f9; color:#d500f9; box-shadow:0 4px 20px rgba(213,0,249,0.25);">
                <p>>>> TOMA FOTOGRÁFICA CRONOLÓGICA // ERA EDO</p>
                <p style="color:#00f0ff; font-size:0.85rem;">Encuentra una vista en el Castillo de Nijo que emule la época medieval. Toma una foto intentando evitar elementos modernos (turistas con móvil, cables de luz, carteles plásticos).</p>
                <div style="margin:15px 0; padding:10px; background:rgba(213,0,249,0.05); border:1px dashed #d500f9; border-radius:5px; text-align:center; font-size:0.8rem; color:#fff;">
                    ⚡ REQUISITO TÁCTICO: Ángulo limpio sin contaminación tecnológica.
                </div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:monospace; background:#d500f9; border-color:#d500f9; color:#fff; font-weight:bold;">📸 ABRIR OPTICA TEMPORAL</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_6_time_travel', role, false)
    },

    "day_6_ring": {
        tag: "physical",
        day: 6,
        title: "El Anillo Imperial",
        role: "kid14",
        xp: 20,
        location: "Palacio Imperial",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> CÁLCULO DE PERÍMETROS DE SEGURIDAD // PALACIO IMPERIAL</p>
                <p style="color:#aaa; font-size:0.85rem;">El palacio imperial está rodeado por grandes murallas y fosos rectangulares de defensa. Resuelve el cálculo perimetral de escala:</p>
                
                <div style="background:#111; padding:15px; border-radius:5px; border:1px solid #333; margin:15px 0; text-align:left;">
                    <p style="font-size:0.8rem; color:#ffd700; margin:0 0 8px 0; font-weight:bold;">📐 ENIGMA GEOMÉTRICO:</p>
                    <p style="font-size:0.75rem; color:#ccc; margin:0 0 10px 0;">Sabiendo que el muro exterior del recinto palaciego mide aproximadamente 1.300 metros en sus lados más largos (Norte-Sur) y 700 metros en sus lados más cortos (Este-Oeste), ¿cuántos kilómetros totales (km) recorre su muralla en un perímetro completo?</p>
                    <input type="number" id="ring-perimeter-ans" step="0.1" style="width:100%; background:#0a0e12; color:#ffd700; border:1px solid #ffd700; padding:8px; font-family:monospace; font-size:0.85rem;" placeholder="Escribe el perímetro en km (ej: 3.5)...">
                </div>
                
                <button id="btn-submit" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>ENVIAR DATOS A CONTROL</button>
            </div>
        `,
        attachEvents: (role) => {
            const periInput = document.getElementById('ring-perimeter-ans');
            const submitBtn = document.getElementById('btn-submit');
            
            const checkValidity = () => {
                const val = parseFloat(periInput.value);
                if (val === 4 || val === 4.0) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#00ff99';
                    submitBtn.style.color = '#00ff99';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                }
            };
            
            periInput.addEventListener('input', checkValidity);
            
            submitBtn.addEventListener('click', () => {
                const val = parseFloat(periInput.value);
                if (val !== 4 && val !== 4.0) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('CÁLCULO INCORRECTO', 'El perímetro exterior es la suma de los cuatro lados del rectángulo (1300 + 700 + 1300 + 700 = 4000 metros). Convierte este valor exactamente a kilómetros.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_6_ring', {type:'number', data: val}, role);
            });
        }
    },

    "day_7_kimono": {
        tag: "photo",
        day: 7,
        title: "Cazadora de Kimonos",
        role: "kid9",
        xp: 15,
        location: "Sannenzaka",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); border-radius:15px; border:3px solid #e91e63; color:#880e4f; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">👘 Detective de Kimonos Tradicionales 👘</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#ad1457;">En Sannenzaka la gente viste hermosos kimonos. Observa respetuosamente a las personas con estas vestimentas y responde los detalles del diseño antes de tomar la foto:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #e91e63; margin-bottom:15px; text-align:left; display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="font-size:0.8rem; font-weight:bold; color:#ad1457; display:block; margin-bottom:5px;">🎨 DETALLES DEL PATRÓN MÁS BONITO:</label>
                        <div style="display:flex; flex-wrap:wrap; gap:5px;" id="kimono-pattern">
                            <button type="button" class="kimono-btn" data-tag="Flores" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #e91e63; background:#fff; cursor:pointer; font-family:'Quicksand';">🌸 Flores</button>
                            <button type="button" class="kimono-btn" data-tag="Grullas" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #e91e63; background:#fff; cursor:pointer; font-family:'Quicksand';">🦅 Grullas</button>
                            <button type="button" class="kimono-btn" data-tag="Geométrico" style="padding:4px 8px; font-size:0.75rem; border-radius:15px; border:1px solid #e91e63; background:#fff; cursor:pointer; font-family:'Quicksand';">🌀 Geométrico</button>
                        </div>
                    </div>
                    <div>
                        <label style="font-size:0.8rem; font-weight:bold; color:#ad1457; display:block; margin-bottom:5px;">🌈 COLOR DOMINANTE DEL KIMONO:</label>
                        <select id="kimono-color" style="width:100%; padding:6px; border:1px solid #e91e63; border-radius:5px; background:#fff; color:#ad1457; font-family:'Quicksand'; font-size:0.8rem;">
                            <option value="">-- Selecciona el color --</option>
                            <option value="Rosa">Rosa pastel (Sakura)</option>
                            <option value="Rojo">Rojo intenso (Carmesí/Tsubaki)</option>
                            <option value="Azul">Azul profundo (Indigo/Aoi)</option>
                            <option value="Verde">Verde bosque (Matsu)</option>
                            <option value="Amarillo">Amarillo / Dorado (Kiku)</option>
                        </select>
                    </div>
                </div>

                <input type="file" id="file-input-kimono" accept="image/*" style="display:none;">
                <div id="kimono-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #e91e63; padding:5px; background:#fff;">
                    <span style="font-size:0.75rem; color:#ad1457; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto cargada correctamente</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-file" class="btn-secondary" style="flex:1; font-family:'Quicksand', sans-serif; background:#f8bbd0; border-color:#e91e63; color:#ad1457; font-weight:bold; border-radius:25px;">📸 Hacer Foto</button>
                    <button id="btn-submit-kimono" class="btn-primary" style="flex:1; font-family:'Quicksand', sans-serif; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:25px;" disabled>📨 Mandar Reporte</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let selectedPattern = '';
            let photoId = null;
            const btns = document.querySelectorAll('.kimono-btn');
            const colorSelect = document.getElementById('kimono-color');
            const fileInput = document.getElementById('file-input-kimono');
            const selectFileBtn = document.getElementById('btn-select-file');
            const submitBtn = document.getElementById('btn-submit-kimono');
            const previewEl = document.getElementById('kimono-preview');
            
            const checkValidity = () => {
                if (selectedPattern && colorSelect.value && photoId) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#e91e63';
                    submitBtn.style.borderColor = '#e91e63';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = '#ccc';
                    submitBtn.style.borderColor = '#ccc';
                    submitBtn.style.color = '#666';
                }
            };
            
            btns.forEach(btn => btn.addEventListener('click', () => {
                btns.forEach(b => { b.style.background = '#fff'; b.style.color = '#333'; });
                btn.style.background = '#f8bbd0';
                btn.style.color = '#ad1457';
                selectedPattern = btn.dataset.tag;
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            }));

            colorSelect.addEventListener('change', () => {
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });

            selectFileBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'kimono_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (!selectedPattern || !colorSelect.value || !photoId) return;
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_7_kimono', {
                    type: 'photo',
                    data: photoId,
                    metadata: {
                        pattern: selectedPattern,
                        color: colorSelect.value
                    }
                }, role);
            });
        }
    },

    "day_7_kintsugi": {
        tag: "game",
        day: 7,
        title: "La Vasija Rota",
        role: "kid9",
        xp: 20,
        location: "Kioto",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🏺 El Arte del Kintsugi 🏺</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Este plato de cerámica antiguo se ha roto. Desliza el dedo con cuidado para rellenar las grietas con pegamento de oro y devolverle su belleza original.</p>
                
                <div style="background:#1a1a24; position:relative; width:100%; height:200px; border-radius:10px; overflow:hidden; border:2px solid #8d6e63; margin-bottom:15px;">
                    <div style="position:absolute; width:150px; height:150px; border-radius:50%; border:3px solid #d7ccc8; top:25px; left:calc(50% - 75px); opacity:0.4; pointer-events:none;"></div>
                    <canvas id="kintsugi-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%;"></canvas>
                </div>
                
                <button id="btn-kint" class="btn-primary" style="width:100%; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:20px;">🍯 Sellar con Oro y Finalizar</button>
            </div>
        `,
        attachEvents: (role) => {
            const canvas = document.getElementById('kintsugi-canvas');
            const ctx = canvas.getContext('2d');
            
            const initCanvas = () => {
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = 200;
                
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ffd700';
            };
            
            setTimeout(initCanvas, 100);

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
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                const dataUrl = canvas.toDataURL('image/png');
                if (window.savePhotoToDB) await savePhotoToDB('kintsugi_' + Date.now(), dataUrl);
                submitMission('day_7_kintsugi', {type:'game', data:'Plato restaurado con oro'}, role);
            });
        }
    },

    "day_7_tea": {
        tag: "sensors",
        day: 7,
        title: "Té del Shogun",
        role: "kid9",
        xp: 25,
        location: "Sannenzaka",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🍵 Transporte de Té del Shogun 🍵</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Carga una taza de té verde hirviendo. Mantén el móvil totalmente plano durante 20 segundos para evitar que el líquido se derrame.</p>
                
                <div id="tea-lvl" style="width:120px; height:120px; border-radius:50%; border:5px solid #8d6e63; margin:20px auto; position:relative; background:#fff; overflow:hidden; box-shadow:inset 0 2px 5px rgba(0,0,0,0.15);">
                    <div id="tea-liquid" style="width:30px; height:30px; background:#8bc34a; border-radius:50%; position:absolute; top:45px; left:45px; border:2px solid #558b2f; transition:transform 0.1s ease; box-shadow:0 0 10px rgba(139,195,74,0.5);"></div>
                </div>
                
                <button id="btn-start" class="btn-primary" style="width:100%; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:20px;">🍵 Empezar Transporte</button>
            </div>
        `,
        attachEvents: (role) => {
            let active = false;
            let timer = null;
            let handler = null;
            const drop = document.getElementById('tea-liquid');
            const btn = document.getElementById('btn-start');
            
            btn.addEventListener('click', async (e) => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    try {
                        const p = await DeviceOrientationEvent.requestPermission();
                        if (p !== 'granted') {
                            showAlert('Permiso Denegado', 'Esta misión requiere acceso a los sensores de movimiento. Por favor, habilítalos en los ajustes de tu dispositivo.');
                            return;
                        }
                    } catch (err) {
                        console.error(err);
                        showAlert('Error', 'No se pudo activar el sensor de movimiento.');
                        return;
                    }
                }
                
                btn.style.display = 'none';
                active = true;
                
                handler = (ev) => {
                    if(!active) return;
                    const x = (ev.gamma || 0) * 1.5;
                    const y = (ev.beta || 0) * 1.5;
                    drop.style.transform = `translate(${x}px, ${y}px)`;
                    
                    if(Math.abs(ev.gamma || 0) > 25 || Math.abs(ev.beta || 0) > 25) {
                        active = false;
                        window.removeEventListener('deviceorientation', handler);
                        clearTimeout(timer);
                        if (window.playProceduralSound) playProceduralSound('error');
                        showAlert("¡DERRAMADO!", "¡Has inclinado demasiado la taza y el té se ha derramado! Vuelve a calibrar.");
                        btn.style.display = 'block';
                    }
                };
                
                window.addEventListener('deviceorientation', handler);
                if (window.playProceduralSound) playProceduralSound('click');
                
                timer = setTimeout(() => {
                    if(active) {
                        active = false;
                        window.removeEventListener('deviceorientation', handler);
                        if (window.playProceduralSound) playProceduralSound('success');
                        submitMission('day_7_tea', {type:'sensors', data:'Té transportado sin derrames'}, role);
                    }
                }, 20000);
            });
            
            window._missionCleanup = () => {
                active = false;
                if (handler) window.removeEventListener('deviceorientation', handler);
                if (timer) clearTimeout(timer);
            };
        }
    },

    "day_7_stone_guardian": {
        tag: "physical",
        day: 7,
        title: "El Guardián de Piedra",
        role: "kid9",
        xp: 15,
        location: "Kiyomizu-dera",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); border-radius:15px; border:3px solid #009688; color:#004d40; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">❤️ Las Piedras de Amor de Jishu Jinja 🪨</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#004d40;">En el templo Kiyomizu-dera hay dos piedras del amor. Si caminas de una a otra con los ojos cerrados, encontrarás el amor. Toma una foto del lugar e indica la distancia aproximada entre las dos piedras:</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #009688; margin-bottom:15px; text-align:left; display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="font-size:0.8rem; font-weight:bold; color:#004d40; display:block; margin-bottom:5px;">📐 DISTANCIA ENTRE LAS PIEDRAS:</label>
                        <select id="stone-distance" style="width:100%; padding:6px; border:1px solid #009688; border-radius:5px; background:#fff; color:#004d40; font-family:'Quicksand'; font-size:0.8rem;">
                            <option value="">-- Selecciona la distancia --</option>
                            <option value="5">Aproximadamente 5 metros</option>
                            <option value="10">Aproximadamente 10 metros</option>
                            <option value="20">Aproximadamente 20 metros</option>
                        </select>
                    </div>
                </div>

                <input type="file" id="file-input-stone" accept="image/*" style="display:none;">
                <div id="stone-preview" style="display:none; margin-bottom:15px; border-radius:8px; overflow:hidden; border:2px dashed #009688; padding:5px; background:#fff;">
                    <span style="font-size:0.75rem; color:#004d40; font-weight:bold; display:block; margin-bottom:5px;">✓ Foto de Jishu Jinja cargada</span>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-select-file" class="btn-secondary" style="flex:1; font-family:'Quicksand', sans-serif; background:#b2dfdb; border-color:#009688; color:#004d40; font-weight:bold; border-radius:25px;">📸 Hacer Foto</button>
                    <button id="btn-submit-stone" class="btn-primary" style="flex:1; font-family:'Quicksand', sans-serif; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:25px;" disabled>📨 Enviar Datos</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            let photoId = null;
            const distanceSelect = document.getElementById('stone-distance');
            const fileInput = document.getElementById('file-input-stone');
            const selectFileBtn = document.getElementById('btn-select-file');
            const submitBtn = document.getElementById('btn-submit-stone');
            const previewEl = document.getElementById('stone-preview');
            
            const checkValidity = () => {
                if (distanceSelect.value === '10' && photoId) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.background = '#00796b';
                    submitBtn.style.borderColor = '#00796b';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.background = '#ccc';
                    submitBtn.style.borderColor = '#ccc';
                    submitBtn.style.color = '#666';
                }
            };
            
            distanceSelect.addEventListener('change', () => {
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            });

            selectFileBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        photoId = 'stone_' + Date.now();
                        window.savePhotoToDB(photoId, event.target.result);
                        previewEl.style.display = 'block';
                        if (window.playProceduralSound) playProceduralSound('success');
                        checkValidity();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (distanceSelect.value !== '10' || !photoId) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('DISTANCIA INCORRECTA', 'La distancia real entre las dos piedras sagradas del amor de Jishu Jinja es de 10 metros. ¡Vuelve a estimar!');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_7_stone_guardian', {
                    type: 'photo',
                    data: photoId,
                    metadata: { distance: '10 metros' }
                }, role);
            });
        }
    },

    "day_7_structural": {
        tag: "expert",
        day: 7,
        title: "Cálculo de Cargas",
        role: "kid14",
        xp: 20,
        location: "Kiyomizu-dera",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#080a0e; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> CÁLCULO DE VECTORES DE CARGA DE TERRAZA</p>
                <p style="color:#aaa; font-size:0.85rem;">Estima la carga de Kiyomizu-dera. Cuenta el número total de grandes pilares principales de madera de ciprés que sostienen la terraza flotante. Multiplícalo por 5 (toneladas de carga soportadas por pilar).</p>
                
                <div style="margin:15px 0; padding:10px; background:rgba(0,255,153,0.05); border:1px dashed #00ff99; border-radius:5px; text-align:center;">
                    <label style="font-size:0.8rem; color:#ffd700; display:block; margin-bottom:5px;">RESULTADO ESTIMADO (ENTRE 15 Y 50 PILARES x 5 TONELADAS):</label>
                    <input type="number" id="ans" style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; font-family:monospace; text-align:center; font-size:1.5rem; box-sizing:border-box;" placeholder="Carga estimada en toneladas (ej: 150)">
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>TRANSMITIR ANÁLISIS ESTRUCTURAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const valInput = document.getElementById('ans');
            const submitBtn = document.getElementById('btn');
            
            const checkValidity = () => {
                const val = parseInt(valInput.value);
                if (!isNaN(val) && val >= 75 && val <= 250) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#00ff99';
                    submitBtn.style.color = '#00ff99';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                }
            };
            
            valInput.addEventListener('input', checkValidity);
            
            submitBtn.addEventListener('click', () => {
                const val = parseInt(valInput.value);
                if (val < 75 || val > 250) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('CÁLCULO FUERA DE RANGO', 'La famosa terraza suspendida de Kiyomizu-dera se apoya sobre una intrincada celosía de pilares principales. Tu estimación total de carga debe estar en un rango realista (entre 75 y 250 toneladas totales, correspondientes a una estimación de entre 15 y 50 pilares principales).');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_7_structural', {type:'number', data: val}, role);
            });
        }
    },

    "day_7_survival": {
        tag: "expert",
        day: 7,
        title: "Supervivencia al Maleficio",
        role: "kid14",
        xp: 15,
        location: "Sannenzaka",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#120508; border:1px solid #e91e63; color:#e91e63; box-shadow:0 4px 20px rgba(233,30,99,0.25);">
                <p>>>> ALERTA DE AMENAZA PARANORMAL: MALDICIÓN DE SANNENZAKA</p>
                <p style="color:#aaa; font-size:0.85rem;">La leyenda cuenta que tropezar en las escaleras de Sannenzaka acarrea 3 años de mala suerte. Revisa tu mochila e indica 3 objetos o técnicas que usarías para mitigar la maldición (mínimo 15 caracteres y términos clave como: amuleto, omamori, calabaza, rodillera, cuidado, despacio):</p>
                
                <div style="background:#111; border:1px solid #333; border-radius:5px; padding:10px; margin:15px 0;">
                    <label style="font-size:0.8rem; color:#ffd700; display:block; margin-bottom:5px;">EQUIPO SELECCIONADO DE MITIGACIÓN:</label>
                    <input type="text" id="ans" style="width:100%; background:#111; color:#e91e63; border:1px solid #e91e63; padding:8px; font-family:monospace; box-sizing:border-box; font-size:0.85rem;" placeholder="Ej: Amuleto Omamori, calabaza mágica, rodilleras de protección...">
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>EJECUTAR CONTRA-CONJURACIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            const inputVal = document.getElementById('ans');
            const submitBtn = document.getElementById('btn');
            
            const checkValidity = () => {
                const text = inputVal.value.trim().toLowerCase();
                const keywords = ['omamori', 'amuleto', 'calabaza', 'rodillera', 'suerte', 'despacio', 'cuidado', 'antideslizante', 'suela'];
                const hasKeyword = keywords.some(kw => text.includes(kw));
                if (text.length >= 15 && hasKeyword) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#e91e63';
                    submitBtn.style.color = '#e91e63';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                }
            };
            
            inputVal.addEventListener('input', checkValidity);
            
            submitBtn.addEventListener('click', () => {
                const text = inputVal.value.trim();
                const keywords = ['omamori', 'amuleto', 'calabaza', 'rodillera', 'suerte', 'despacio', 'cuidado', 'antideslizante', 'suela'];
                const hasKeyword = keywords.some(kw => text.toLowerCase().includes(kw));
                if (text.length < 15 || !hasKeyword) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('CONJURACIÓN INSUFICIENTE', 'Para contrarrestar la maldición de Sannenzaka debes detallar una estrategia real de al menos 15 letras con términos como: omamori, calabaza (tradicionalmente vendida allí para capturar la mala suerte), amuleto o elementos físicos de protección.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_7_survival', {type:'text', data: text}, role);
            });
        }
    },

    "day_7_anti_quake": {
        tag: "game",
        day: 7,
        title: "Anti-Sismo",
        role: "kid14",
        xp: 25,
        location: "Kiyomizu",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#050c05; border:1px solid #00e676; color:#00e676; box-shadow:0 4px 20px rgba(0,230,118,0.25);">
                <p>>>> PROTOCOLO DE ESTABILIZACIÓN DINÁMICA SÍSMICA</p>
                <p style="color:#aaa; font-size:0.85rem;">Kiyomizu-dera resiste terremotos usando vigas entrelazadas de madera sin un solo clavo. Calibra el sensor del móvil en plano y mantenlo inmóvil durante 15 segundos.</p>
                
                <div style="background:#111; border:1px solid #333; border-radius:5px; height:80px; margin:15px 0; overflow:hidden; position:relative;">
                    <canvas id="seismic-canvas" width="280" height="80" style="display:block; width:100%; height:80px;"></canvas>
                    <div id="seismic-timer" style="position:absolute; right:10px; bottom:5px; font-size:1.5rem; font-weight:bold; color:#ffd700;">15s</div>
                </div>
                
                <button id="btn-start" class="btn-primary" style="width:100%; border-color:#00e676; color:#00e676; background:transparent;">INICIAR PROTOCOLO SÍSMICO</button>
            </div>
        `,
        attachEvents: (role) => {
            let active = false;
            let interval = null;
            let handler = null;
            let timeLeft = 15;
            const btn = document.getElementById('btn-start');
            const timerEl = document.getElementById('seismic-timer');
            const canvas = document.getElementById('seismic-canvas');
            const ctx = canvas.getContext('2d');
            
            let points = new Array(50).fill(40);
            
            const drawTremors = (tilt) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = '#00e676';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 40);
                
                points.shift();
                points.push(40 + tilt);
                
                const step = canvas.width / points.length;
                for(let i=0; i<points.length; i++) {
                    ctx.lineTo(i * step, points[i]);
                }
                ctx.stroke();
            };
            
            btn.addEventListener('click', async (e) => {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    try {
                        const p = await DeviceOrientationEvent.requestPermission();
                        if (p !== 'granted') {
                            showAlert('Permiso Denegado', 'Esta misión requiere acceso a los sensores de movimiento. Por favor, habilítalos en los ajustes de tu dispositivo.');
                            return;
                        }
                    } catch (err) {
                        console.error(err);
                        showAlert('Error', 'No se pudo activar el sensor de movimiento.');
                        return;
                    }
                }
                
                btn.style.display = 'none';
                active = true;
                timeLeft = 15;
                timerEl.innerText = '15s';
                
                handler = (ev) => {
                    if(!active) return;
                    const tilt = Math.max(Math.abs(ev.gamma || 0), Math.abs(ev.beta || 0));
                    drawTremors((Math.random() - 0.5) * tilt * 2);
                    
                    if(Math.abs(ev.gamma || 0) > 15 || Math.abs(ev.beta || 0) > 15) {
                        active = false;
                        window.removeEventListener('deviceorientation', handler);
                        clearInterval(interval);
                        if (window.playProceduralSound) playProceduralSound('error');
                        showAlert("ESTRUCTURA INESTABLE", "¡Se ha detectado oscilación crítica! Calibra el sensor e inténtalo de nuevo.");
                        btn.style.display = 'block';
                    }
                };
                
                window.addEventListener('deviceorientation', handler);
                if (window.playProceduralSound) playProceduralSound('click');
                
                interval = setInterval(() => {
                    timeLeft--;
                    timerEl.innerText = timeLeft + 's';
                    if (timeLeft <= 0) {
                        active = false;
                        window.removeEventListener('deviceorientation', handler);
                        clearInterval(interval);
                        if (window.playProceduralSound) playProceduralSound('success');
                        submitMission('day_7_anti_quake', {type:'game', data:'Estructura estabilizada en sismo simulado'}, role);
                    }
                }, 1000);
            });
            
            window._missionCleanup = () => {
                active = false;
                if (handler) window.removeEventListener('deviceorientation', handler);
                if (interval) clearInterval(interval);
            };
        }
    },

    "day_7_stairs": {
        tag: "physical",
        day: 7,
        title: "La Conquista de las Escaleras",
        role: "kid14",
        xp: 20,
        location: "Subida Kiyomizu",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#080b0e; border:1px solid #00e5ff; color:#00e5ff; box-shadow:0 4px 20px rgba(0,229,255,0.25);">
                <p>>>> CONTADOR DE CUESTAS SAGRADAS // KIOTO ELEVACIÓN</p>
                <p style="color:#aaa; font-size:0.85rem;">Cuenta los escalones de piedra reales que subes desde la base de Sannenzaka hasta la entrada del recinto principal de Kiyomizu-dera.</p>
                
                <div style="margin:15px 0; padding:10px; background:rgba(0,229,255,0.05); border:1px dashed #00e5ff; border-radius:5px; text-align:center;">
                    <label style="font-size:0.8rem; color:#ffd700; display:block; margin-bottom:5px;">REGISTRO DE ESCALONES TOTALES:</label>
                    <input type="number" id="ans" style="width:100%; background:#111; color:#00e5ff; border:1px solid #00e5ff; padding:8px; font-family:monospace; text-align:center; font-size:1.5rem; box-sizing:border-box;" placeholder="Ej: 154">
                </div>
                
                <button id="btn" class="btn-primary" style="width:100%; border-color:#00e5ff; color:#00e5ff; background:transparent;">TRANSMITIR VECTOR DE ELEVACIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                const val = document.getElementById('ans').value;
                if (!val || parseInt(val) <= 0) {
                    showAlert('VALOR INCORRECTO', 'Introduce una cifra válida de escalones.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_7_stairs', {type:'number', data: parseInt(val)}, role);
            });
        }
    },

    "day_7_geisha": {
        tag: "photo",
        day: 7,
        title: "Código Geisha",
        role: "both",
        xp: 15,
        location: "Gion",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🏮 Faroles de Gion al Atardecer 🏮</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Misión cooperativa familiar: buscad un farolillo tradicional de papel (Chōchin) encendido en las oscuras callejuelas de Gion e inmortalizadlo.</p>
                <div style="font-size:3rem; margin:10px 0; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🏮✨🏮</div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; font-size:1.1rem; border-radius:25px;">📸 Tomar Foto Cooperativa</button>
            </div>
        `,
        attachEvents: (role) => attachCameraFlow('btn-cam', 'day_7_geisha', role, false, true)
    },

    "day_8_kid14_wave_sync": {
        tag: "expert",
        day: 8,
        title: "Sincronización de Frecuencias",
        role: "kid14",
        xp: 25,
        location: "Arashiyama",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#001100; border:1px solid #00ff00; color:#00ff00; box-shadow:0 4px 20px rgba(0,255,0,0.25);">
                <p>>>> OSCILOSCOPIO CIBERNÉTICO DE ARASHIYAMA</p>
                <p style="color:#aaa; font-size:0.85rem;">Sintoniza los deslizadores de Amplitud, Frecuencia y Fase para ajustar tu onda telemétrica (verde) con el patrón de resonancia del bosque (rojo).</p>
                
                <div style="background: #000a00; border: 2px solid #00ff00; border-radius: 8px; padding: 5px; margin: 15px 0;">
                    <canvas id="wc2" width="280" height="120" style="width: 100%; height: 120px; background: repeating-linear-gradient(0deg, transparent, transparent 19px, #002200 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #002200 20px); border-radius: 5px;"></canvas>
                </div>
                
                <div style="display: flex; flex-direction:column; gap:10px; margin-bottom: 15px; background:rgba(0,255,0,0.05); padding:10px; border-radius:5px; border:1px dashed #00ff00;">
                    <div style="display: flex; align-items: center;">
                        <label style="width:60px; color:#0f0; font-size:0.75rem;">AMP</label>
                        <input type="range" id="sl-amp" min="10" max="70" step="1" value="20" style="flex:1; accent-color:#0f0;">
                    </div>
                    <div style="display: flex; align-items: center;">
                        <label style="width:60px; color:#0f0; font-size:0.75rem;">FREQ</label>
                        <input type="range" id="sl-freq" min="0.01" max="0.1" step="0.001" value="0.02" style="flex:1; accent-color:#0f0;">
                    </div>
                    <div style="display: flex; align-items: center;">
                        <label style="width:60px; color:#0f0; font-size:0.75rem;">FASE</label>
                        <input type="range" id="sl-fase" min="0" max="6.28" step="0.1" value="0" style="flex:1; accent-color:#0f0;">
                    </div>
                </div>
                
                <div id="sync-status2" style="text-align: center; color: #f00; font-size: 1.1rem; font-weight:bold; margin-bottom: 10px;">ESTADO: DESINCRONIZADO</div>
                <button id="btn-sync-ok" class="btn-primary hidden" style="width:100%; border-color:#00ff00; color:#00ff00; background:transparent;">¡Sincronización Completada!</button>
            </div>
        `,
        attachEvents: () => {
            const c = document.getElementById('wc2');
            const ctx = c.getContext('2d');
            const sAmp = document.getElementById('sl-amp');
            const sFreq = document.getElementById('sl-freq');
            const sFase = document.getElementById('sl-fase');
            const b = document.getElementById('btn-sync-ok');
            const stat = document.getElementById('sync-status2');
            
            const targetAmp = 40;
            const targetFreq = 0.06; 
            const targetFase = 3.1;
            let offset = 0;
            let active = true;

            const loop = () => {
                if(!active) return;
                ctx.clearRect(0, 0, c.width, c.height);
                
                ctx.beginPath();
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                for(let x=0; x<c.width; x++) {
                    ctx.lineTo(x, 60 + targetAmp * Math.sin((x + offset) * targetFreq + targetFase));
                }
                ctx.stroke();
                
                const pAmp = parseFloat(sAmp.value);
                const pFreq = parseFloat(sFreq.value);
                const pFase = parseFloat(sFase.value);
                
                ctx.beginPath();
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.9)';
                for(let x=0; x<c.width; x++) {
                    ctx.lineTo(x, 60 + pAmp * Math.sin((x + offset) * pFreq + pFase));
                }
                ctx.stroke();

                offset += 1.2; 

                const dAmp = Math.abs(pAmp - targetAmp);
                const dFreq = Math.abs(pFreq - targetFreq);
                const dFase = Math.abs(pFase - targetFase);
                
                if(dAmp < 5 && dFreq < 0.005 && dFase < 0.5) {
                    stat.innerText = 'ESTADO: 100% SINCRONIZADO';
                    stat.style.color = '#00ff00';
                    b.classList.remove('hidden');
                } else {
                    stat.innerText = 'ESTADO: DESINCRONIZADO';
                    stat.style.color = '#ff1744';
                    b.classList.add('hidden');
                }

                requestAnimationFrame(loop);
            };
            
            loop();
            
            [sAmp, sFreq, sFase].forEach(s => s.addEventListener('input', () => {
                if (window.playProceduralSound) playProceduralSound('click');
            }));
            
            b.addEventListener('click', () => { 
                active = false; 
                submitMission('day_8_kid14_wave_sync', {type:'game', data:'Ondas sincronizadas por completo'}); 
            });
            window._missionCleanup = () => { active = false; };
        }
    },

    "day_8_kid9_pose": {
        tag: "photo",
        day: 8,
        title: "El Trono de Piedra",
        role: "kid9",
        xp: 20,
        location: "Templo Otagi Nenbutsu-ji",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🗿 Esculturas Raras de Otagi 🗿</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Hay 1200 estatuas de piedra de monjes y todas son graciosas o diferentes. Busca la que haga la pose más extraña, imítala frente a tu familia y saca la foto de imitación.</p>
                
                <div style="font-size:3rem; margin:15px 0;">🤪🗿✨</div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold;">📸 Capturar Pose de Monje</button>
                <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px; font-weight:bold; border-radius:20px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            let photoId = '';
            document.getElementById('p-cam').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const btnSub = document.getElementById('btn-sub');
                // Buscamos el botón de capturar que precede a btn-sub
                const btnCam = document.querySelector('button[onclick*="p-cam"]');
                const originalCamText = btnCam ? btnCam.innerText : '📸 Capturar Pose de Monje';
                
                if (btnCam) {
                    btnCam.innerText = '⏳ Procesando foto...';
                    btnCam.disabled = true;
                }
                
                try {
                    const compressed = await compressImage(file);
                    photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                    await savePhotoToDB(photoId, compressed);
                    
                    btnSub.classList.remove('hidden');
                    if (window.playProceduralSound) playProceduralSound('click');
                } catch (err) {
                    console.error(err);
                    showAlert('Error', 'No se pudo procesar la foto de la pose. Reinténtalo.');
                } finally {
                    if (btnCam) {
                        btnCam.innerText = originalCamText;
                        btnCam.disabled = false;
                    }
                }
            });
            document.getElementById('btn-sub').addEventListener('click', () => {
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_8_kid9_pose', {type:'photo', data: photoId});
            });
        }
    },

    "day_8_kid14_bosque": {
        tag: "physical",
        day: 8,
        title: "El Bosque de 2.7km",
        role: "kid14",
        xp: 20,
        location: "Arashiyama",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#080b0e; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> RASTREO TÁCTICO DE RUTA SAGRADA // ARASHIYAMA</p>
                <p style="color:#aaa; font-size:0.85rem;">Completa el circuito de 2.7 km. Marca los nodos cuando tu cuadrícula física llegue a ellos y escribe la estimación final de pasos.</p>
                
                <div style="background:#111; padding:12px; border-radius:5px; border:1px solid #333; margin:15px 0; display:flex; flex-direction:column; gap:8px;">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" class="b-chk" style="transform:scale(1.3); accent-color:#00ff99;"> 
                        <span>🎋 Entrada al Sendero Bambú</span>
                    </label>
                    <label style="cursor:pointer; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" class="b-chk" style="transform:scale(1.3); accent-color:#00ff99;"> 
                        <span>🌊 Estanque de Tenryu-ji</span>
                    </label>
                    <label style="cursor:pointer; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" class="b-chk" style="transform:scale(1.3); accent-color:#00ff99;"> 
                        <span>🌉 Puente Togetsukyo</span>
                    </label>
                </div>
                
                <input type="number" id="p-total" placeholder="Introduce pasos totales (entre 2000 y 6000)..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; font-family:monospace; box-sizing:border-box;">
                <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px; border-color:#555; color:#555; background:transparent;" disabled>TRANSMITIR RECONOCIMIENTO</button>
            </div>
        `,
        attachEvents: () => {
            const chks = document.querySelectorAll('.b-chk');
            const btn = document.getElementById('btn-sub');
            const stepsInput = document.getElementById('p-total');
            
            const checkValidity = () => {
                const allChecked = Array.from(chks).every(x => x.checked);
                const stepsVal = parseInt(stepsInput.value);
                if (allChecked && !isNaN(stepsVal) && stepsVal >= 2000 && stepsVal <= 6000) {
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
            
            chks.forEach(c => c.addEventListener('change', () => {
                if (window.playProceduralSound) playProceduralSound('click');
                checkValidity();
            }));

            stepsInput.addEventListener('input', checkValidity);
            
            btn.addEventListener('click', () => {
                const stepsVal = parseInt(stepsInput.value);
                if (isNaN(stepsVal) || stepsVal < 2000 || stepsVal > 6000) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('ESTIMACIÓN DE PASOS ERRÓNEA', 'Una caminata de 2.7 km en Arashiyama equivale aproximadamente a un rango de entre 2.000 y 6.000 pasos de zancada humana. Por favor, reajusta tu estimación dentro de este límite lógico.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_8_kid14_bosque', {type:'text', data: `Pasos: ${stepsVal}`});
            });
        }
    },

    "day_8_kid14_arashiyama": {
        tag: "writing",
        day: 8,
        title: "El Guardián del Bambú",
        role: "kid14",
        xp: 15,
        location: "Arashiyama",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#080b0e; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 20px rgba(0,255,153,0.15);">
                <p>>>> REPORTE DE ANOMALÍAS DE CAMPO // ARASHIYAMA</p>
                <p style="color:#aaa; font-size:0.85rem;">Estás en uno de los lugares más fotografiados del planeta. Escribe un informe de reconocimiento sensorial: ¿cómo se siente la luz entre el bambú, qué sonido hace al mecerse, qué vibración transmite? (mínimo 30 caracteres)</p>
                
                <textarea id="ar-ans" placeholder=">>> Escribe tu informe de campo..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                <button id="btn" class="btn-primary" style="width:100%; border-color:#555; color:#555; background:transparent;" disabled>TRANSMITIR REPORTE TÁCTICO</button>
            </div>
        `,
        attachEvents: () => { 
            const textInput = document.getElementById('ar-ans');
            const submitBtn = document.getElementById('btn');

            const checkValidity = () => {
                const val = textInput.value.trim();
                if (val.length >= 30) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.style.borderColor = '#00ff99';
                    submitBtn.style.color = '#111';
                    submitBtn.style.background = '#00ff99';
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                    submitBtn.style.borderColor = '#555';
                    submitBtn.style.color = '#555';
                    submitBtn.style.background = 'transparent';
                }
            };

            textInput.addEventListener('input', checkValidity);
            
            submitBtn.addEventListener('click', () => {
                const val = textInput.value.trim();
                if (val.length < 30) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('INFORME INSOPORTABLE', 'El reporte de Arashiyama debe detallar tus sensaciones sensoriales con al menos 30 caracteres.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_8_kid14_arashiyama', {type:'text', data: val});
            }); 
        }
    },

    "day_8_kid9_wind": {
        tag: "expert",
        day: 8,
        title: "El Susurro del Viento",
        role: "kid9",
        xp: 30,
        location: "Arashiyama",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #4caf50; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🎍 El Atrapavientos de Arashiyama 🎋</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">El bosque de bambú susurra con el viento. Sopla suavemente de forma constante en el micrófono durante 4 segundos para calmar al bosque.</p>
                
                <div style="position: relative; width: 60px; height: 160px; margin: 15px auto; background: rgba(255,255,255,0.4); border: 2px solid #4caf50; border-radius: 30px; overflow: hidden;">
                    <div id="wind-fill" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 0%; background: linear-gradient(to top, #ffeb3b, #4caf50); transition: height 0.1s linear;"></div>
                </div>
                
                <div id="wind-status" style="text-align: center; color: #1b5e20; font-size: 1.1rem; font-weight:bold; min-height:1.5rem;">Cargando sensores...</div>
                <button id="btn-start" class="btn-secondary" style="width: 100%; margin-top: 15px; background:#4caf50; border-color:#4caf50; color:#fff; font-weight:bold; border-radius:20px;">🎙️ Activar Micrófono</button>
                <button id="btn-submit" class="btn-primary hidden" style="width: 100%; margin-top: 15px; font-weight:bold; border-radius:20px;">Enviar Medición</button>
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
            const TOTAL_FRAMES = 60 * 4; 
            const MIN_V = 25;
            const MAX_V = 70;
            
            stat.innerText = "Pulsa el botón e inicia";

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
                            stat.innerText = "¡Mantén el soplido suave!";
                            stat.style.color = "#f1c40f";
                        } else {
                            if(avg > MAX_V) stat.innerText = "¡Demasiado fuerte! Más suave...";
                            else stat.innerText = "Sopla suavemente en el micro...";
                            stat.style.color = "#e74c3c";
                            successFrames = Math.max(0, successFrames - 2); 
                        }

                        let pct = (successFrames / TOTAL_FRAMES) * 100;
                        fill.style.height = pct + '%';

                        if(successFrames >= TOTAL_FRAMES) {
                            stopAudio();
                            fill.style.height = '100%';
                            stat.innerText = "El bosque te ha escuchado... ✅";
                            stat.style.color = "#4caf50";
                            btnSub.classList.remove('hidden');
                            if (window.playProceduralSound) playProceduralSound('success');
                        } else {
                            requestAnimationFrame(loop);
                        }
                    };
                    loop();

                } catch(e) {
                    showAlert("Error", "No se pudo acceder al micrófono.");
                }
            });

            btnSub.addEventListener('click', () => submitMission('day_8_kid9_wind', {type: 'expert', data: 'Viento capturado (4s)'}));
            window._missionCleanup = stopAudio;
        }
    },

    "day_8_kid9_bamboo_clock": {
        tag: "physical",
        day: 8,
        title: "El Reloj de Bambú",
        role: "kid9",
        xp: 15,
        location: "Arashiyama",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #81c784; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🎋 Cronología del Bambú Sagrado 🎋</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">Cada anillo horizontal en el tronco de un bambú equivale aproximadamente a un año de crecimiento. Encuentra un tallo alto, cuenta sus nudos y registra los años calculados.</p>
                
                <div style="background:#fff; border-radius:10px; padding:12px; border:2px solid #81c784; margin-bottom:15px;">
                    <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin-bottom:10px;">
                        <button id="btn-sub-b" class="btn-secondary" style="font-size:1.5rem; width:45px; height:45px; border-radius:50%; background:#81c784; color:#fff; border:none; line-height:1; cursor:pointer;">-</button>
                        <div id="bamboo-count" style="font-size:2.5rem; font-weight:bold; color:#1b5e20; min-width:60px;">0</div>
                        <button id="btn-add-b" class="btn-secondary" style="font-size:1.5rem; width:45px; height:45px; border-radius:50%; background:#81c784; color:#fff; border:none; line-height:1; cursor:pointer;">+</button>
                    </div>
                    
                    <label style="font-size:0.8rem; font-weight:bold; color:#2e7d32; display:block; margin-bottom:5px;">EDAD APROXIMADA (AÑOS):</label>
                    <input type="number" id="bamboo-age" placeholder="Años..." style="width:100%; border:1px solid #ccc; border-radius:5px; padding:8px; font-family:inherit; text-align:center; box-sizing:border-box;">
                </div>
                
                <button id="btn-send-bamboo" class="btn-primary" style="width:100%; background:#81c784; border-color:#81c784; color:#fff; font-weight:bold; border-radius:20px;">🎋 Registrar Edad del Bambú</button>
            </div>
        `,
        attachEvents: () => {
            let count = 0;
            const cnt = document.getElementById('bamboo-count');
            const ageInput = document.getElementById('bamboo-age');
            
            document.getElementById('btn-add-b').addEventListener('click', () => {
                count++;
                cnt.innerText = count;
                ageInput.value = count;
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            document.getElementById('btn-sub-b').addEventListener('click', () => {
                if (count > 0) {
                    count--;
                    cnt.innerText = count;
                    ageInput.value = count;
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            });
            
            document.getElementById('btn-send-bamboo').addEventListener('click', () => {
                const age = ageInput.value;
                if (!age || parseInt(age) <= 0) {
                    showAlert('VALOR INCOMPLETO', 'Introduce los años estimados.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_8_kid9_bamboo_clock', {type:'text', data:`Nudos: ${count}, Edad: ${age}`});
            });
        }
    },

    "day_8_kid9_giants": {
        tag: "photo",
        day: 8,
        title: "Perspectiva de Gigantes",
        role: "kid9",
        xp: 15,
        location: "Bosque de Bambú",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #81c784; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🎋 Mirada hacia los Gigantes de Bambú 🎋</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">Ponte en medio del sendero y apunta tu cámara totalmente en vertical hacia el cielo. Captura cómo las copas de bambú casi ocultan el sol.</p>
                <div style="font-size:3rem; margin:15px 0;">🌤️🎋🕶️</div>
                <button id="btn-cam" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#81c784; border-color:#81c784; color:#fff; font-weight:bold; border-radius:25px;">📸 Capturar Gigantes</button>
            </div>
        `,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_8_kid9_giants', currentUser, false); }
    },
    "day_8_kid9_monk": {
        tag: "audio",
        day: 8,
        title: "El Mensaje del Monje",
        role: "kid9",
        xp: 20,
        location: "Tenryu-ji",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%); border-radius:15px; border:3px solid #78909c; color:#263238; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🎙️ Mantra Zen y Cuenco Tibetano 🎙️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#37474f;">Imita el resonar de un cuenco tibetano metálico o canta un mantra Zen de meditación relajante durante 5 segundos continuos.</p>
                
                <div id="rec-ui-monk" style="text-align:center; margin: 15px 0; background:#fff; border-radius:10px; padding:15px; border:2px solid #78909c;">
                    <div id="rec-dot-monk" style="width:20px; height:20px; background:#f44336; border-radius:50%; margin:0 auto 10px; opacity:0; box-shadow:0 0 10px #f44336;"></div>
                    <button id="btn-rec-monk" class="btn-primary" style="width:100%; border-radius:50px; height:50px; font-size:1.1rem; font-weight:bold; background:#78909c; border-color:#78909c; font-family:'Quicksand';">🎙️ Grabar Mantra</button>
                </div>
                
                <audio id="au-preview-monk" controls class="hidden" style="width:100%; margin-bottom:15px;"></audio>
                <button id="btn-retry-monk" class="btn-secondary hidden" style="width:100%; margin-bottom:10px; font-weight:bold; border-radius:20px; font-family:'Quicksand';">Regrabar</button>
                <button id="btn-monk" class="btn-primary hidden" style="width:100%; background:#263238; border-color:#263238; font-weight:bold; border-radius:20px; font-family:'Quicksand';">Enviar al Juez</button>
            </div>
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
                        
                        // Active volume verification using AudioContext
                        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        const arrayBuffer = await blob.arrayBuffer();
                        try {
                            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                            const channelData = audioBuffer.getChannelData(0);
                            let sumSquares = 0;
                            for (let i = 0; i < channelData.length; i++) {
                                sumSquares += channelData[i] * channelData[i];
                            }
                            const rms = Math.sqrt(sumSquares / channelData.length);
                            const volumePercent = Math.min(100, Math.floor(rms * 1000));
                            
                            if (volumePercent < 15) {
                                if (window.playProceduralSound) playProceduralSound('error');
                                showAlert('MANTRA SOLEMNE REQUERIDO', 'El sonido o murmullo grabado es demasiado bajo. Canta tu mantra con voz firme o acerca más el cuenco tibetano al micrófono.');
                                btnR.classList.remove('hidden');
                                btnR.disabled = false;
                                btnR.innerText = "🎙️ Volver a Intentar";
                                return;
                            }
                            
                            au.src = URL.createObjectURL(blob);
                            au.classList.remove('hidden');
                            btnR.classList.add('hidden');
                            btnRetry.classList.remove('hidden');
                            btn.classList.remove('hidden');
                            
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => { blobId = reader.result; };
                            if (window.playProceduralSound) playProceduralSound('success');
                        } catch (err) {
                            console.error(err);
                            // Fallback
                            au.src = URL.createObjectURL(blob);
                            au.classList.remove('hidden');
                            btnR.classList.add('hidden');
                            btnRetry.classList.remove('hidden');
                            btn.classList.remove('hidden');
                        }
                        
                        stream.getTracks().forEach(t => t.stop());
                    };
                    mr.start();
                    dot.style.opacity = '1';
                    dot.style.animation = 'pulse 1s infinite';
                    btnR.innerText = "Grabando (5s)...";
                    btnR.disabled = true;
                    
                    if (window.playProceduralSound) playProceduralSound('click');
                    
                    setTimeout(() => { 
                        if(mr && mr.state === 'recording') mr.stop(); 
                        btnR.disabled = false; 
                        btnR.innerText = "🎙️ Grabar Mantra"; 
                    }, 5000);
                } catch(e) { 
                    showAlert("Micro error", "No se pudo acceder al micrófono para el canto."); 
                }
            });

            btnRetry.addEventListener('click', () => {
                au.classList.add('hidden');
                btn.classList.add('hidden');
                btnRetry.classList.add('hidden');
                btnR.classList.remove('hidden');
                blobId = null;
                if (window.playProceduralSound) playProceduralSound('click');
            });

            btn.addEventListener('click', () => {
                if (blobId) submitMission('day_8_kid9_monk', {type:'audio', data: 'Audio grabado (Mantra Zen)'});
            });
            window._missionCleanup = stopAll;
        }
    },

    "day_8_kid9_rake": {
        tag: "game",
        day: 8,
        title: "El Rastrillo del Jardinero",
        role: "kid9",
        xp: 20,
        location: "Tenryu-ji",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:5px;">🎋 El Rastrillo del Jardinero Zen 🎋</p>
                <p style="font-size:0.8rem; margin-bottom:10px; color:#5d4037;">Pasa el rastrillo (tu dedo) sobre los 5 círculos concéntricos de arena zen para armonizar el jardín de Tenryu-ji.</p>
                
                <div style="background:#e8dcc4; border:2px solid #8b5a2b; position:relative; width:100%; height:200px; margin:0 auto; margin-bottom:15px; border-radius:10px; overflow:hidden;">
                    <canvas id="zen-canvas" width="280" height="200" style="display:block; width:100%; height:100%; z-index:10; cursor:crosshair;"></canvas>
                    <div id="zen-help-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,255,255,0.75); z-index:5; pointer-events:none;">
                        <span style="font-size:2.5rem; margin-bottom:5px;">🎋🌊</span>
                        <p style="font-size:0.8rem; color:#8d6e63; font-weight:bold; margin:0;">Toca y arrastra en la arena para limpiar</p>
                    </div>
                </div>
                
                <div style="display:flex; gap:10px;">
                    <button id="btn-open-game" class="btn-secondary" style="flex:1; background:#a1887f; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:20px; font-family:'Quicksand';">🎮 Minijuego Completo</button>
                    <button id="btn-submit-rake" class="btn-primary" style="flex:1; background:#ccc; border-color:#ccc; color:#666; font-weight:bold; border-radius:20px; font-family:'Quicksand';" disabled>📨 Enviar Armonización</button>
                </div>
            </div>
        `,
        attachEvents: (role) => {
            const openBtn = document.getElementById('btn-open-game');
            const submitBtn = document.getElementById('btn-submit-rake');
            const overlay = document.getElementById('zen-help-overlay');
            const canvas = document.getElementById('zen-canvas');
            const ctx = canvas.getContext('2d');
            
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width || 280;
            canvas.height = rect.height || 200;
            
            ctx.fillStyle = '#e8dcc4';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const targets = [
                {x: canvas.width * 0.2, y: canvas.height * 0.3, cleared: false, radius: 15},
                {x: canvas.width * 0.8, y: canvas.height * 0.25, cleared: false, radius: 15},
                {x: canvas.width * 0.5, y: canvas.height * 0.5, cleared: false, radius: 15},
                {x: canvas.width * 0.25, y: canvas.height * 0.75, cleared: false, radius: 15},
                {x: canvas.width * 0.75, y: canvas.height * 0.8, cleared: false, radius: 15}
            ];
            
            const drawScene = () => {
                ctx.fillStyle = '#e8dcc4';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.strokeStyle = '#dfcfb2';
                ctx.lineWidth = 3;
                for (let i = 10; i < canvas.height; i += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.bezierCurveTo(canvas.width*0.25, i-10, canvas.width*0.75, i+10, canvas.width, i);
                    ctx.stroke();
                }
                
                targets.forEach(t => {
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
                    if (t.cleared) {
                        ctx.fillStyle = '#81c784';
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = '#81c784';
                    } else {
                        ctx.fillStyle = '#8d6e63';
                        ctx.shadowBlur = 0;
                    }
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    ctx.strokeStyle = t.cleared ? '#2e7d32' : '#5d4037';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.radius + 6, 0, Math.PI * 2);
                    ctx.stroke();
                });
            };
            
            drawScene();
            
            let drawing = false;
            
            const getPos = (e) => {
                const r = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - r.left,
                    y: clientY - r.top
                };
            };
            
            const startDraw = (e) => {
                drawing = true;
                if (overlay) overlay.style.display = 'none';
                handleMove(e);
            };
            
            const handleMove = (e) => {
                if (!drawing) return;
                const pos = getPos(e);
                
                let changed = false;
                targets.forEach(t => {
                    const dx = pos.x - t.x;
                    const dy = pos.y - t.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < t.radius + 15 && !t.cleared) {
                        t.cleared = true;
                        changed = true;
                        if (window.playProceduralSound) playProceduralSound('click');
                    }
                });
                
                if (changed) {
                    drawScene();
                    const allCleared = targets.every(t => t.cleared);
                    if (allCleared) {
                        submitBtn.removeAttribute('disabled');
                        submitBtn.style.background = '#8d6e63';
                        submitBtn.style.borderColor = '#8d6e63';
                        submitBtn.style.color = '#fff';
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                    }
                }
            };
            
            const endDraw = () => {
                drawing = false;
            };
            
            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', endDraw);
            
            canvas.addEventListener('touchstart', startDraw, {passive: true});
            canvas.addEventListener('touchmove', handleMove, {passive: true});
            window.addEventListener('touchend', endDraw);
            
            openBtn.addEventListener('click', () => {
                if (window.MinigamesManager && typeof window.MinigamesManager.launch === 'function') {
                    window.MinigamesManager.launch('day_8_kid9_rake');
                } else {
                    submitMission('day_8_kid9_rake', {type:'game', data:'Jardín zen completado en minijuego'}, role);
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_8_kid9_rake', {type:'game', data:'Jardín zen armonizado localmente'}, role);
            });
            
            window._missionCleanup = () => {
                canvas.removeEventListener('mousedown', startDraw);
                canvas.removeEventListener('mousemove', handleMove);
                window.removeEventListener('mouseup', endDraw);
                canvas.removeEventListener('touchstart', startDraw);
                canvas.removeEventListener('touchmove', handleMove);
                window.removeEventListener('touchend', endDraw);
            };
        }
    },

    "day_8_fam_squad": {
        tag: "photo",
        day: 8,
        title: "Escuadrón Bambú",
        role: "both",
        xp: 20,
        location: "Arashiyama",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #81c784; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">📸 Escuadrón Camuflado de Bambú 📸</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">Misión conjunta: Haceos una foto familiar asomando vuestras cabezas de forma graciosa por detrás de diferentes troncos de bambú.</p>
                
                <label style="display:flex; align-items:center; justify-content:center; gap:10px; margin:20px 0; font-size:1.1rem; background:#fff; padding:12px; border-radius:10px; border:1px solid #81c784; cursor:pointer;">
                    <input type="checkbox" id="chk-squad" style="transform:scale(1.4); accent-color:#81c784;"> 
                    <span style="font-weight:bold; color:#1b5e20;">✅ Foto de Escuadrón Realizada</span>
                </label>
                
                <button id="btn" class="btn-primary" style="width:100%; background:#2e7d32; border-color:#2e7d32; color:#fff; font-weight:bold; border-radius:20px;">🛡️ Enviar Reporte del Escuadrón</button>
            </div>
        `,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => {
                if(document.getElementById('chk-squad').checked) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_8_fam_squad', {type:'text', data:'Foto de grupo confirmada'}, role, true);
                } else {
                    showAlert('FALTA CONFIRMACIÓN', 'Debéis confirmar marcando la casilla de verificación.');
                }
            });
        }
    },
});
