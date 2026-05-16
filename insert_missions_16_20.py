import sys
import codecs

js_code = r'''
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
                    vid.srcObject = null; const blob = new Blob(chunks, {'type':'video/mp4'});
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
        let c=0, t=60, int=null, active=false;
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
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone, oldInput);
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
                    vid.srcObject = null; const blob = new Blob(chunks, {'type':'video/mp4'});
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
                    vid.srcObject = null; const blob = new Blob(chunks, {'type':'video/mp4'});
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
        const getXY = (e) => e.touches ? {x:e.touches[0].clientX, y:e.touches[0].clientY} : {x:e.clientX, y:e.clientY};
        
        const move = (e) => { if(!active) return; e.preventDefault(); const {x,y} = getXY(e); active.style.transform = `translate(${cX+x-iX}px, ${cY+y-iY}px) scale(1.2)`; };
        const end = (e) => {
            if(!active) return; const {x,y} = getXY(e.changedTouches?e.changedTouches[0]:e); cX += x-iX; cY += y-iY;
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
                e.preventDefault(); active=i; const {x,y}=getXY(e); iX=x; iY=y;
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
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone, oldInput);
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
'''

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

last_idx = content.rfind('};')
if last_idx != -1:
    new_content = content[:last_idx] + ',\n' + js_code + '\n};' + content[last_idx+2:]
    with codecs.open('missions.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Missions for Days 16 to 20 injected successfully.")
else:
    print("Could not find the end of MISSIONS_CONFIG.")
