import sys
import codecs

js_code = r'''
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
            return { x: clientX - rectCanvas.left, y: clientY - rectCanvas.top };
        };

        const startDraw = (e) => {
            drawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if(!drawing) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            ctx.clearRect(0, 0, c.width, c.height);
            
            ctx.globalCompositeOperation = 'lighter';
            
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'red';
            for(let x=0; x<c.width; x++) {
                ctx.lineTo(x, 75 + targetAmp * Math.sin((x + offset) * targetFreq + targetFase));
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
                ctx.lineTo(x, 75 + pAmp * Math.sin((x + offset) * pFreq + pFase));
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
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();

            clearedCount++;
            let pct = Math.min(100, (clearedCount / 80) * 100);
            prog.style.width = pct + '%';
            
            if(pct >= 90 && b.classList.contains('hidden')) {
                ctx.clearRect(0,0,c.width,c.height);
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
            {t:1, r:90}, {t:0, r:0}, {t:1, r:180},
            {t:0, r:90}, {t:1, r:0}, {t:0, r:90},
            {t:1, r:270}, {t:1, r:180}, {t:1, r:0}
        ];
        
        const checkWin = () => {
            let matches = 0;
            map.forEach((m, i) => {
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
                    const blob = new Blob(chunks, { 'type' : 'video/mp4' });
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
            if(e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            return { x: e.clientX, y: e.clientY };
        };

        const handleMove = (e) => {
            if(!activeItem) return;
            e.preventDefault();
            const {x, y} = getXY(e);
            const dx = x - initX;
            const dy = y - initY;
            activeItem.style.transform = `translate(${curX + dx}px, ${curY + dy}px) scale(1.2)`;
        };

        const handleEnd = (e) => {
            if(!activeItem) return;
            const {x, y} = getXY(e.changedTouches ? e.changedTouches[0] : e);
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
                const {x, y} = getXY(e);
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
            oldInput.parentNode.replaceChild(oldClone, oldInput);
            oldClone.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if(!file) return;
                btn.innerText = '⏳ Procesando...';
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    const name = document.getElementById('rainbow-name').value || 'Sin nombre';
                    submitMission('day_10_kid9_rainbow', {type:'mixed', data:\`Nombre: ${name}. Foto ID: ${photoId}\`});
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
            submitMission('day_10_kid9_matcha', {type:'text', data: \`Matcha Code: ${document.getElementById('matcha-manual').value}\`});
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
'''

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

last_idx = content.rfind('};')
if last_idx != -1:
    new_content = content[:last_idx] + ',\n' + js_code + '\n};' + content[last_idx+2:]
    with codecs.open('missions.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Missions injected successfully.")
else:
    print("Could not find the end of MISSIONS_CONFIG.")
