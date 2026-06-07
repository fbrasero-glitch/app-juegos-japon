import sys
import codecs

js_code = r'''
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
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone, oldInput);
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
        const TARGET = {lat: 36.7381, lon: 139.5005}; // Cascadas Kegon aprox (Fake/Test)
        
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
                }, (err) => alert('Error GPS'), {enableHighAccuracy:true, maximumAge:0});
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
        let t = 30, int = null;
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
                    const blob = new Blob(chunks, {'type':'audio/webm'});
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
            const clone = oldInput.cloneNode(true); oldInput.parentNode.replaceChild(clone, oldInput);
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
'''

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

last_idx = content.rfind('};')
if last_idx != -1:
    new_content = content[:last_idx] + ',\n' + js_code + '\n};' + content[last_idx+2:]
    with codecs.open('missions.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Missions for Days 21 to 24 injected successfully.")
else:
    print("Could not find the end of MISSIONS_CONFIG.")
