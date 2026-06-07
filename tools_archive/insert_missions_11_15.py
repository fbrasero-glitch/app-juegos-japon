import sys
import codecs

js_code = r'''
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
            return { x: cx - rect.left, y: cy - rect.top };
        };
        const startDraw = (e) => { drawing = true; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); };
        const draw = (e) => { if(!drawing) return; e.preventDefault(); const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); };
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
                ctx.drawImage(vid, 0, 0, can.width, can.height);
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
                    const blob = new Blob(chunks, {'type':'audio/webm'});
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
                    vid.srcObject = null; const blob = new Blob(chunks, {'type':'video/mp4'});
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
                    const blob = new Blob(chunks, {'type':'audio/webm'});
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
        const getPos = (e) => { const rect=can.getBoundingClientRect(); const cx=e.touches?e.touches[0].clientX:e.clientX; const cy=e.touches?e.touches[0].clientY:e.clientY; return {x:cx-rect.left, y:cy-rect.top}; };
        const start = (e) => { drawing=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
        const draw = (e) => { if(!drawing) return; e.preventDefault(); const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); };
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
'''

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

last_idx = content.rfind('};')
if last_idx != -1:
    new_content = content[:last_idx] + ',\n' + js_code + '\n};' + content[last_idx+2:]
    with codecs.open('missions.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Missions for Days 11 to 15 injected successfully.")
else:
    print("Could not find the end of MISSIONS_CONFIG.")
