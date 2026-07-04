// Auto-generated block of missions
if (typeof MISSIONS_CONFIG === 'undefined') {
    var MISSIONS_CONFIG = {};
}

Object.assign(MISSIONS_CONFIG, {
"day_9_kid14_gravity": {
        tag: "versus", day: 9, title: "Piedra Gravedad", role: "kid14", xp: 15, location: "Kinkaku-ji",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> TEST DE GRAVEDAD TERRESTRE</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Encuentra una piedra del jardín zen. Déjala caer desde la altura de tu cintura y cronometra cuánto tarda en tocar el suelo. La gravedad de Japón es la misma... ¿o no?</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; padding:20px; border-radius:12px;">
                <div id="gv-icon" style="font-size:3rem; transition:transform 0.5s;">🪨</div>
                <div id="gv-timer" style="font-size:2.5rem; color:#60efff; font-family:monospace; margin:10px 0;">0.00s</div>
            </div>
            <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">🫳 Soltar Piedra</button>
            <button id="btn-end" class="btn-primary hidden" style="width:100%;">💥 ¡Impacto!</button>
        </div>`,
        attachEvents: () => {
            let t0=0,int=null;
            document.getElementById('btn-start').addEventListener('click',(e)=>{
                t0=Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
                document.getElementById('gv-icon').style.transform='translateY(60px)';
                int=setInterval(()=>document.getElementById('gv-timer').innerText=((Date.now()-t0)/1000).toFixed(2)+'s',10);
            });
            document.getElementById('btn-end').addEventListener('click',()=>{clearInterval(int); submitMission('day_9_kid14_gravity',{type:'text',data:'Caída: '+document.getElementById('gv-timer').innerText});});
            window._missionCleanup=()=>clearInterval(int);
        }
    },

"day_9_kid14_angulo": {
        tag: "photo", day: 9, title: "Ángulo Imposible", role: "kid14", xp: 15, location: "Fushimi Inari",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> MISIÓN FOTOGRÁFICA TÁCTICA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Captura el túnel de toriis rojos desde un ángulo que nadie más haría: desde el suelo mirando hacia arriba, tumbado, en contrapicado extremo...</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; padding:20px; border-radius:12px;">
                <p style="font-size:3rem;">⛩️📐</p>
                <p style="color:#ff6b35; font-style:italic;">El ángulo más creativo gana</p>
            </div>
            <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Ángulo Imposible</button>
        </div>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid14_angulo', currentUser, false); }
    },

"day_9_kid9_scratch": {
        tag: "expert",
        day: 9,
        title: "Limpia el Reflejo de Oro",
        role: "kid9",
        xp: 25,
        location: "Kinkaku-ji",
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

    "day_9_kid14_torii": {
        tag: "expert",
        day: 9,
        title: "Laberinto de Torii",
        role: "kid14",
        xp: 25,
        location: "Fushimi Inari",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> INFILTRACIÓN EN LA RED DE ALTARES [FUSHIMI INARI]</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Conecta el flujo de energía rotando los nodos. La energía debe fluir de la entrada a la cima.</p>
                <div id="torii-board2" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; max-width: 240px; margin: 0 auto; background: #111; padding: 10px; border-radius: 8px; border: 2px solid #00ff99;">
                </div>
                <div id="maze-status" style="font-size:0.85rem; color:#ffd700; text-align:center; margin-top:10px; min-height:1.2rem;">>>> Red inestable...</div>
                <button id="btn-maze" class="btn-primary hidden" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; margin-top: 15px; font-family:monospace;">💥 CONFIRMAR ENLACE DE RED</button>
            </div>
        `,
        attachEvents: (role) => {
            const board = document.getElementById('torii-board2');
            const btn = document.getElementById('btn-maze');
            const status = document.getElementById('maze-status');
            
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
                    board.style.borderColor = '#00ff99';
                    board.style.boxShadow = '0 0 15px #00ff99';
                    status.innerText = '>>> ¡RED ALINEADA! Enlace listo para transmisión.';
                    status.style.color = '#00ff99';
                    if (window.playProceduralSound) playProceduralSound('success');
                } else {
                    btn.classList.add('hidden');
                    board.style.borderColor = '#e74c3c';
                    board.style.boxShadow = 'none';
                    status.innerText = '>>> Red inestable... Nodos alineados: ' + matches + '/6';
                    status.style.color = '#ffd700';
                }
            };

            board.innerHTML = '';
            map.forEach((m, i) => {
                const div = document.createElement('div');
                div.id = 't2_'+i;
                div.dataset.r = m.r;
                div.style.height = '70px';
                div.style.background = '#1a1d20';
                div.style.borderRadius = '5px';
                div.style.position = 'relative';
                div.style.transition = 'transform 0.3s ease';
                div.style.transform = `rotate(${m.r}deg)`;
                div.style.cursor = 'pointer';
                div.style.border = '1px solid #333';
                
                if(m.t === 0) { 
                    div.innerHTML = `<div style="position:absolute; top:0; bottom:0; left:50%; width:14px; background:#00ff99; transform:translateX(-50%); border-radius:2px;"></div>`;
                } else { 
                    div.innerHTML = `<div style="position:absolute; top:0; left:50%; width:14px; height:50%; background:#00ff99; transform:translateX(-50%);"></div><div style="position:absolute; top:50%; left:50%; width:50%; height:14px; background:#00ff99; transform:translateY(-50%);"></div>`;
                }

                div.addEventListener('click', () => {
                    let r = parseInt(div.dataset.r) + 90;
                    div.dataset.r = r;
                    div.style.transform = `rotate(${r}deg)`;
                    if (window.playProceduralSound) playProceduralSound('click');
                    checkWin();
                });
                board.appendChild(div);
            });

            btn.addEventListener('click', () => submitMission('day_9_kid14_torii', {type:'game', data:'Red de Torii hackeada'}, role));
        }
    },

"day_9_kid9_zorros": {
        tag: "physical",
        day: 9,
        title: "La Escalada de los Zorros",
        role: "kid9",
        xp: 25,
        location: "Fushimi Inari-taisha",
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
        tag: "physical",
        day: 9,
        title: "La Postura del Ave Dorada",
        role: "kid14",
        xp: 20,
        location: "Kinkaku-ji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> PROTOCOLO KITSUNE: ESTABILIZACIÓN DE NÚCLEO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Imita al fénix del tejado del Kinkaku-ji. Ponte a la pata coja y mantén el equilibrio durante 15 segundos sin tambalearte.</p>
                
                <div style="text-align:center; margin:15px 0; background:#111; padding:15px; border-radius:8px; border:1px solid #222;">
                    <div id="chrono-icon" style="font-size:3rem; margin-bottom:10px; transition: transform 0.3s;">🦅</div>
                    <div id="chrono" style="font-size:2.5rem; font-weight:bold; font-family:monospace; color:#ffd700;">15.0s</div>
                    <div id="chrono-bar-bg" style="width:100%; height:8px; background:#222; border-radius:4px; margin-top:10px; overflow:hidden;">
                        <div id="chrono-bar-fill" style="width:100%; height:100%; background:#ffd700; transition: width 0.1s linear;"></div>
                    </div>
                </div>
                
                <button id="btn-start" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">⚡ CALIBRAR E INICIAR APNEA</button>
                <button id="btn-stop" class="btn-primary hidden" style="width:100%; border-color:#e74c3c; color:#e74c3c; background:transparent;">💥 DETECTAR CAÍDA (Perdí balance)</button>
            </div>
        `,
        attachEvents: (role) => {
            let active = false;
            let time = 15.0;
            let interval = null;
            const btnStart = document.getElementById('btn-start');
            const btnStop = document.getElementById('btn-stop');
            const timerEl = document.getElementById('chrono');
            const fillEl = document.getElementById('chrono-bar-fill');
            const iconEl = document.getElementById('chrono-icon');
            
            btnStart.addEventListener('click', () => {
                btnStart.classList.add('hidden');
                btnStop.classList.remove('hidden');
                active = true;
                time = 15.0;
                timerEl.innerText = '15.0s';
                fillEl.style.width = '100%';
                
                if (window.playProceduralSound) playProceduralSound('click');
                
                interval = setInterval(() => {
                    time -= 0.1;
                    if (time <= 0) {
                        time = 0;
                        clearInterval(interval);
                        btnStop.classList.add('hidden');
                        timerEl.innerText = '¡LOGRADO!';
                        timerEl.style.color = '#00ff99';
                        fillEl.style.background = '#00ff99';
                        iconEl.style.transform = 'scale(1.3) rotate(360deg)';
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                        
                        setTimeout(() => {
                            submitMission('day_9_kid14_ave', {type:'text', data: 'Equilibrio de Ave Dorada superado: 15s'}, role);
                        }, 1200);
                    } else {
                        timerEl.innerText = time.toFixed(1) + 's';
                        fillEl.style.width = (time / 15.0 * 100) + '%';
                        iconEl.style.transform = `scale(${1 + (15 - time)*0.01}) rotate(${(15 - time)*2}deg)`;
                    }
                }, 100);
            });
            
            btnStop.addEventListener('click', () => {
                if (active) {
                    clearInterval(interval);
                    active = false;
                    btnStop.classList.add('hidden');
                    btnStart.classList.remove('hidden');
                    timerEl.innerText = 'FALLO';
                    timerEl.style.color = '#e74c3c';
                    fillEl.style.width = '0%';
                    iconEl.style.transform = 'scale(1)';
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('EQUILIBRIO PERDIDO', 'Has perdido el balance de fénix. Vuelve a intentarlo.');
                }
            });
            
            window._missionCleanup = () => {
                clearInterval(interval);
            };
        }
    },

"day_9_kid9_altar": {
        tag: "photo", day: 9, title: "El Altar Secreto", role: "kid9", xp: 15, location: "Fushimi Inari",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🔮 En la montaña de Fushimi Inari hay altares escondidos entre los árboles que casi nadie ve. Tu misión de exploradora: encontrar uno secreto y fotografiarlo antes de que desaparezca.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#2d1b69,#5b2c6f); border-radius:15px;">
            <p style="font-size:3rem;">🔮⛩️✨</p>
            <p style="color:#d8b4fe; font-style:italic;">Solo los verdaderos exploradores lo encuentran</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Altar Secreto</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid9_altar', currentUser, false); }
    },

"day_9_kid14_tunnel": {
        tag: "photo", day: 9, title: "El Túnel Infinito", role: "kid14", xp: 15, location: "Fushimi Inari",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> CAPTURA DE PERSPECTIVA INFINITA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Miles de toriis forman un túnel que parece no terminar nunca. Captura la foto que mejor transmita esa sensación de infinito.</p>
            <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(180deg,#ff4500,#ff6b35,#ff8c00); border-radius:12px;">
                <p style="font-size:3rem;">⛩️⛩️⛩️</p>
                <p style="color:#fff; font-weight:bold;">El túnel que no termina</p>
            </div>
            <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Fotografiar el Infinito</button>
        </div>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid14_tunnel', currentUser, false); }
    },

"day_9_fam_portal": {
        tag: "video",
        day: 9,
        title: "La Puerta a Otro Mundo",
        role: "both",
        xp: 20,
        location: "Fushimi Inari",
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

"day_10_kid9_nishiki": {
        tag: "economy", day: 10, title: "Maestro Chatarra", role: "kid9", xp: 15, location: "Nishiki",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🛍️ El mercado de Nishiki tiene cientos de puestos con cosas raras y maravillosas. Tu misión: encontrar el objeto más extraño que se venda y averiguar su precio.</p>
        <div style="background:linear-gradient(135deg,#f7c948,#ff6b35); border-radius:15px; padding:20px; margin:15px 0; text-align:center;">
            <p style="font-size:3rem;">🐙🍡🎎</p>
            <p style="color:#fff; font-weight:bold;">¿Qué es lo más raro que puedes encontrar?</p>
        </div>
        <input type="text" id="ni-item" placeholder="Objeto encontrado..." style="width:100%; margin-bottom:8px; padding:12px; border-radius:8px; border:2px solid #f7c948; font-size:1rem;">
        <input type="number" id="ni-price" placeholder="Precio en ¥..." style="width:100%; margin-bottom:15px; padding:12px; border-radius:8px; border:2px solid #f7c948; font-size:1rem;">
        <button id="btn" class="btn-primary" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar Hallazgo</button>`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => {
            const item=document.getElementById('ni-item').value, price=document.getElementById('ni-price').value;
            if(!item||!price){showAlert('Incompleto','Indica qué encontraste y su precio.');return;}
            submitMission('day_10_kid9_nishiki',{type:'text',data:'Objeto: '+item+', Precio: '+price+'¥'});
        }); }
    },

"day_10_fam_sayonara": {
        tag: "writing", day: 10, title: "Sayonara Kioto", role: "both", xp: 20, location: "Kioto",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌸 Misión Familiar: Kioto ha sido mágico. Antes de partir, cada miembro de la familia escribe una cosa que nunca olvidará de esta ciudad.</p>
        <div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(135deg,#ffecd2,#fcb69f); border-radius:15px; border:2px solid #d4af37;">
            <p style="font-size:3rem;">🌸⛩️🦌</p>
            <p style="color:#8B4513; font-weight:bold; margin-top:10px;">Sayonara, Kioto</p>
        </div>
        <textarea id="say-ans" placeholder="Lo que nunca olvidaré de Kioto..." style="width:100%; height:100px; margin-bottom:15px; padding:12px; border-radius:10px; border:2px solid #d4af37; font-size:1rem;"></textarea>
        <button id="btn" class="btn-primary" style="width:100%; font-size:1.1rem; padding:15px; background:linear-gradient(135deg,#d4af37,#f7c948); color:#000;">🌸 Sellar Recuerdo</button>`,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => {
            const val=document.getElementById('say-ans').value;
            if(val.length<10){showAlert('Espera','Escribe al menos una frase completa.');return;}
            submitMission('day_10_fam_sayonara',{type:'text',data:val},role,true);
        }); }
    },

"day_10_kid9_bento": {
        tag: "expert",
        day: 10,
        title: "El Maestro del Bento",
        role: "kid9",
        xp: 25,
        location: "Mercado Nishiki",
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

    "day_10_kid9_dragon": {
        tag: "physical",
        day: 10,
        title: "El Dragón del Mercado",
        role: "kid9",
        xp: 15,
        location: "Mercado Nishiki",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius:15px; border:3px solid #ffb74d; color:#5d4037; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🐉 ¡Escamas de Dragón en Nishiki! 🐉</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#795548;">Busca los puestos de encurtidos tradicionales japoneses (Tsukemono). Sus colores son brillantes como escamas de un dragón de agua. ¿Cuántos puestos logras ver en todo el mercado?</p>
                
                <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
                    <button id="btn-sub-d" class="btn-secondary" style="font-size:2rem; width:50px; height:50px; border-radius:50%; border:2px solid #ffb74d; background:#fff; color:#ffb74d; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: transform 0.2s;">-</button>
                    <div id="dragon-count" style="font-size:3.5rem; font-weight:bold; color:#e65100; min-width:80px;">0</div>
                    <button id="btn-add-d" class="btn-secondary" style="font-size:2rem; width:50px; height:50px; border-radius:50%; border:2px solid #ffb74d; background:#fff; color:#ffb74d; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: transform 0.2s;">+</button>
                </div>
                
                <button id="btn-submit" class="btn-primary" style="width:100%; background:#ff9800; border-color:#ff9800; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(255,152,0,0.3);">📨 Enviar Recuento al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            let count = 0;
            const display = document.getElementById('dragon-count');
            const addBtn = document.getElementById('btn-add-d');
            const subBtn = document.getElementById('btn-sub-d');
            const subSubmit = document.getElementById('btn-submit');
            
            addBtn.addEventListener('click', () => {
                count++;
                display.innerText = count;
                addBtn.style.transform = 'scale(0.9)';
                setTimeout(() => addBtn.style.transform = 'scale(1)', 100);
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            subBtn.addEventListener('click', () => {
                if (count > 0) {
                    count--;
                    display.innerText = count;
                    subBtn.style.transform = 'scale(0.9)';
                    setTimeout(() => subBtn.style.transform = 'scale(1)', 100);
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            });
            
            subSubmit.addEventListener('click', () => {
                if (count === 0) {
                    showAlert('Recuento vacío', 'Debes haber visto al menos un puesto de escamas de dragón.');
                    return;
                }
                submitMission('day_10_kid9_dragon', {type:'number', data: count}, role);
            });
        }
    },

"day_10_kid14_milla": {
        tag: "physical",
        day: 10,
        title: "La Milla del Samurái",
        role: "kid14",
        xp: 20,
        location: "Ribera del Río Kamo",
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

"day_10_kid14_crypto": {
        tag: "expert",
        day: 10,
        title: "Protocolo de Enlace Cifrado",
        role: "kid14",
        xp: 30,
        location: "Hotel",
        render: () => `
            <div class="ui-terminal">
                <p class="mission-desc">>>> PROTOCOLO DE ENLACE CIFRADO. Base: HOTEL. Introduzca clave de acceso.<br><span style="color: #0c0; font-size: 0.85rem;">[Pista de Red: Nombre de la ciudad del hotel + "_ANNEX" en mayúsculas]</span></p>
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

    "day_10_kid9_rainbow": {
        tag: "photo",
        day: 10,
        title: "El Snack Arcoíris",
        role: "kid9",
        xp: 15,
        location: "Nishiki",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius:15px; border:3px solid #ba68c8; color:#4a148c; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌈 Snack Arcoíris de Nishiki 🌈</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#6a1b9a;">Saca una foto a algo delicioso y comestible que tenga al menos 3 colores diferentes y ponle un nombre fantástico divertido.</p>
                
                <input type="text" id="rainbow-name" placeholder="Ej: Piruleta Mágica de Fresa..." style="width:100%; border:2px solid #ba68c8; border-radius:20px; padding:10px 15px; font-family:inherit; font-size:1rem; box-sizing:border-box; margin-bottom:15px; text-align:center;">
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#9c27b0; border-color:#9c27b0; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(156,39,176,0.3);">📸 Foto del Snack</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCam = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            const nameInput = document.getElementById('rainbow-name');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const name = nameInput.value.trim();
                if (name.length < 3) {
                    showAlert('Nombre incompleto', 'Por favor, dale un nombre divertido de al menos 3 caracteres a tu snack de colores antes de subir la foto.');
                    fileInput.value = '';
                    return;
                }
                
                btnCam.innerText = '⏳ Procesando Snack Mágico...';
                btnCam.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    
                    submitMission('day_10_kid9_rainbow', {type:'mixed', data: `Nombre: ${name} | Foto ID: ${photoId}`}, role);
                } catch(err) {
                    console.error(err);
                    btnCam.innerText = '📸 Foto del Snack';
                    btnCam.disabled = false;
                    showAlert('Error', 'No se pudo guardar la imagen. Reintente.');
                }
            });
        }
    },

"day_10_kid9_matcha": {
        tag: "sensors",
        day: 10,
        title: "Poción de Matcha",
        role: "kid9",
        xp: 15,
        location: "Nishiki",
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
        tag: "writing",
        day: 10,
        title: "Comida Bizarra",
        role: "kid14",
        xp: 15,
        location: "Nishiki",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> ANÁLISIS BIO-MERCADO: ELEMENTO TAKO TAMAGO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Localiza el famoso "Tako Tamago" (pequeño pulpo rojo glaseado con un huevo de codorniz en su cabeza). Determina su precio unitario actual en el mercado.</p>
                
                <div style="margin-bottom:15px;">
                    <label style="display:block; font-size:0.8rem; color:#00ff99; margin-bottom:5px;">PRECIO UNITARIO OBSERVADO (¥):</label>
                    <input type="number" id="tako-price" placeholder="Ej: 500" style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <button id="btn-tako" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">📡 TRANSMITIR COTIZACIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-tako');
            const input = document.getElementById('tako-price');
            
            btn.addEventListener('click', () => {
                const val = parseInt(input.value);
                if (isNaN(val) || val < 100 || val > 2000) {
                    showAlert('VALOR ANÓMALO', 'El valor introducido debe ser una cotización de yenes realista (100 - 2000 ¥).');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_10_kid14_tako', {type:'number', data: val}, role);
            });
        }
    },

"day_11_onsen": {
        tag: "expert",
        day: 11,
        title: "El Código Onsen",
        role: "kid9",
        xp: 15,
        location: "Okuhida",
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
        tag: "sensors",
        day: 11,
        title: "El Té Intacto",
        role: "kid9",
        xp: 25,
        location: "Ryokan",
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
        tag: "economy",
        day: 11,
        title: "Cazadora de Yukatas",
        role: "kid9",
        xp: 15,
        location: "Ryokan",
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
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🟫 El tatami huele a hierba fresca y tiene una textura única. Acerca la cámara al máximo y captura los detalles que nadie más ve: las fibras, los bordados, las sombras...</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B7355,#D2B48C); border-radius:15px;">
            <p style="font-size:3rem;">🔍🟫✨</p>
            <p style="color:#fff; font-style:italic;">Macro-fotografía de explorador</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto Macro del Tatami</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_11_tatami', currentUser, false); }
    },

"day_11_kaiseki": {
        tag: "writing",
        day: 11,
        title: "Catador de Kaiseki",
        role: "kid14",
        xp: 20,
        location: "Ryokan",
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
        tag: "sensors",
        day: 11,
        title: "Rastreador de Manantiales",
        role: "kid14",
        xp: 25,
        location: "Okuhida",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> SENSOR GEOTÉRMICO ACTIVADO: NODO OKUHIDA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Aproxima tu posición al manantial caliente termal. El sistema triangulará tu distancia estimada al objetivo.</p>
                
                <div style="text-align:center; margin:20px 0; position:relative; height:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px dashed #00ff99; border-radius:5px; background:rgba(0,255,153,0.02); overflow:hidden;">
                    <div id="radar-dist" style="font-size:3rem; font-weight:bold; color:#ffd700; text-shadow:0 0 10px rgba(255,215,0,0.5); cursor:pointer; z-index:2;">-- m</div>
                    <div id="radar-msg" style="color:#aaa; font-size:0.75rem; margin-top:5px; z-index:2;">Esperando señal satelital GPS...</div>
                </div>
                
                <button id="btn-spring" class="btn-primary hidden" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">📡 REGISTRAR COORDENADAS TERMALES</button>
            </div>
        `,
        attachEvents: (role) => {
            const dEl = document.getElementById('radar-dist');
            const mEl = document.getElementById('radar-msg');
            const btn = document.getElementById('btn-spring');
            let watchId = null;
            const targetLat = 36.225;
            const targetLon = 137.550;
            const R = 6371000;
            
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
                    if(d < 50) {
                        mEl.innerText = ">>> NODO CERCANO: CALOR DETECTADO";
                        mEl.style.color = "#00ff99";
                        btn.classList.remove('hidden');
                    } else {
                        mEl.innerText = ">>> Buscando firma de calor. Acércate.";
                        mEl.style.color = "#aaa";
                    }
                }, (err) => {
                    mEl.innerText = "Fallo de enlace GPS: " + err.message;
                }, {enableHighAccuracy: true, timeout: 5000});
            } else {
                mEl.innerText = "Enlace GPS no soportado por hardware.";
            }
            
            let cheatCount = 0;
            dEl.addEventListener('click', () => {
                cheatCount++;
                if (cheatCount >= 5) {
                    dEl.innerText = '12 m';
                    mEl.innerText = ">>> ENLACE FORZADO (Bypass)";
                    mEl.style.color = "#00ff99";
                    btn.classList.remove('hidden');
                    if (window.playProceduralSound) playProceduralSound('success');
                }
            });
            
            btn.addEventListener('click', () => {
                if (watchId) navigator.geolocation.clearWatch(watchId);
                submitMission('day_11_spring', {type:'game', data:'Manantial termal localizado y verificado'}, role);
            });
            
            window._missionCleanup = () => {
                if(watchId) navigator.geolocation.clearWatch(watchId);
            };
        }
    },

"day_11_architecture": {
        tag: "expert",
        day: 11,
        title: "Arquitectura Termal",
        role: "kid14",
        xp: 20,
        location: "Ryokan",
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
        tag: "economy",
        day: 11,
        title: "Economía Alpina",
        role: "kid14",
        xp: 15,
        location: "Ryokan",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> ESTIMADOR FINANCIERO: OPERATIVIDAD RYOKAN</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Calcula el coste diario aproximado para mantener operativo el ryokan alpino (comidas tradicionales, mantenimiento de baños onsen, personal local y climatización).</p>
                
                <div style="margin:10px 0; padding:10px; background:rgba(255,255,255,0.03); border:1px solid #333; border-radius:5px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.8rem;">
                        <span>Personal y Servicio:</span>
                        <span id="c-staff" style="color:#ffd700;">¥ 150.000</span>
                    </div>
                    <input type="range" id="slider-staff" min="50000" max="500000" step="10000" value="150000" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                    
                    <div style="display:flex; justify-content:space-between; margin:8px 0; font-size:0.8rem;">
                        <span>Onsen y Calderas:</span>
                        <span id="c-onsen" style="color:#ffd700;">¥ 80.000</span>
                    </div>
                    <input type="range" id="slider-onsen" min="20000" max="300000" step="5000" value="80000" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                    
                    <div style="display:flex; justify-content:space-between; margin:8px 0; font-size:0.8rem;">
                        <span>Cenas Kaiseki (x Hab):</span>
                        <span id="c-kaiseki" style="color:#ffd700;">¥ 120.000</span>
                    </div>
                    <input type="range" id="slider-kaiseki" min="30000" max="400000" step="10000" value="120000" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                </div>
                
                <div style="display:flex; justify-content:space-between; padding:8px 0; border-top:1px dashed #00ff99; font-weight:bold;">
                    <span>COSTE DIARIO ESTIMADO:</span>
                    <span id="total-cost" style="color:#00ff99; font-size:1.2rem;">¥ 350.000</span>
                </div>
                
                <button id="btn-send" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; margin-top:10px;">💾 SUBIR ESTIMACIÓN ECONÓMICA</button>
            </div>
        `,
        attachEvents: (role) => {
            const sStaff = document.getElementById('slider-staff');
            const sOnsen = document.getElementById('slider-onsen');
            const sKaiseki = document.getElementById('slider-kaiseki');
            const cStaff = document.getElementById('c-staff');
            const cOnsen = document.getElementById('c-onsen');
            const cKaiseki = document.getElementById('c-kaiseki');
            const totalCostEl = document.getElementById('total-cost');
            const btn = document.getElementById('btn-send');
            
            const updateCost = () => {
                const staff = parseInt(sStaff.value);
                const onsen = parseInt(sOnsen.value);
                const kaiseki = parseInt(sKaiseki.value);
                
                cStaff.innerText = '¥ ' + staff.toLocaleString('ja-JP');
                cOnsen.innerText = '¥ ' + onsen.toLocaleString('ja-JP');
                cKaiseki.innerText = '¥ ' + kaiseki.toLocaleString('ja-JP');
                
                const total = staff + onsen + kaiseki;
                totalCostEl.innerText = '¥ ' + total.toLocaleString('ja-JP');
            };
            
            sStaff.addEventListener('input', updateCost);
            sOnsen.addEventListener('input', updateCost);
            sKaiseki.addEventListener('input', updateCost);
            
            btn.addEventListener('click', () => {
                const total = parseInt(sStaff.value) + parseInt(sOnsen.value) + parseInt(sKaiseki.value);
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_11_economy', {type:'number', data: total}, role);
            });
        }
    },

    "day_11_geta": {
        tag: "physical",
        day: 11,
        title: "El Equilibrio del Yukata",
        role: "both",
        xp: 20,
        location: "Ryokan",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:5px;">👣 La Marcha Silenciosa Geta 👣</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Ponte las zapatillas tradicionales de madera (geta). Camina 30 pasos en línea recta sin tambalearte. Pulsa alternativamente los dos pies de madera para registrar cada paso.</p>
                
                <div style="display:flex; justify-content:center; align-items:center; gap:25px; margin:20px 0;">
                    <div id="left-foot" style="font-size:4rem; cursor:pointer; opacity:0.8; transition: transform 0.1s;">👡<br><span style="font-size:0.75rem; font-weight:bold; color:#8d6e63;">IZQUIERDO</span></div>
                    <div style="font-size:2.5rem; font-weight:bold; color:#8d6e63;" id="step-counter">0 / 30</div>
                    <div id="right-foot" style="font-size:4rem; cursor:pointer; opacity:0.8; transition: transform 0.1s; transform: scaleX(-1);">👡<br><span style="font-size:0.75rem; font-weight:bold; color:#8d6e63; display:inline-block; transform: scaleX(-1);">DERECHO</span></div>
                </div>
                
                <div style="width:100%; height:10px; background:#e0dcd8; border-radius:5px; overflow:hidden; margin-bottom:15px;">
                    <div id="step-bar" style="width:0%; height:100%; background:#8d6e63; transition: width 0.2s;"></div>
                </div>
                
                <button id="btn-geta" class="btn-primary hidden" style="width:100%; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:25px;">🎉 ¡PASOS COMPLETADOS! 🎉</button>
            </div>
        `,
        attachEvents: (role) => {
            let count = 0;
            let expectedFoot = 'left';
            const countEl = document.getElementById('step-counter');
            const barEl = document.getElementById('step-bar');
            const leftEl = document.getElementById('left-foot');
            const rightEl = document.getElementById('right-foot');
            const btn = document.getElementById('btn-geta');
            
            const handleStep = (foot) => {
                if (count >= 30) return;
                
                if (foot === expectedFoot) {
                    count++;
                    countEl.innerText = `${count} / 30`;
                    barEl.style.width = (count / 30 * 100) + '%';
                    
                    if (foot === 'left') {
                        leftEl.style.transform = 'scale(1.2)';
                        setTimeout(() => leftEl.style.transform = 'scale(1)', 150);
                        expectedFoot = 'right';
                        leftEl.style.opacity = '0.4';
                        rightEl.style.opacity = '1';
                    } else {
                        rightEl.style.transform = 'scale(1.2) scaleX(-1)';
                        setTimeout(() => rightEl.style.transform = 'scale(1) scaleX(-1)', 150);
                        expectedFoot = 'left';
                        rightEl.style.opacity = '0.4';
                        leftEl.style.opacity = '1';
                    }
                    
                    if (window.playProceduralSound) playProceduralSound('click');
                    
                    if (count === 30) {
                        btn.classList.remove('hidden');
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                    }
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('PASO DE TROPIEZO', '¡Has tropezado al intentar pisar con el mismo pie! Camina alternando izquierdo y derecho.');
                    count = 0;
                    expectedFoot = 'left';
                    countEl.innerText = '0 / 30';
                    barEl.style.width = '0%';
                    leftEl.style.opacity = '1';
                    rightEl.style.opacity = '1';
                }
            };
            
            leftEl.addEventListener('click', () => handleStep('left'));
            rightEl.addEventListener('click', () => handleStep('right'));
            
            btn.addEventListener('click', () => {
                submitMission('day_11_geta', {type:'game', data:'30 pasos gecos completados'}, role, true);
            });
        }
    },

"day_12_silence": {
        tag: "expert",
        day: 12,
        title: "Silencio de los Kami",
        role: "kid9",
        xp: 25,
        location: "Takayama",
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
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🟤 Las sugidama son bolas gigantes de ramas de cedro que cuelgan en las puertas de las fábricas de sake. Cuando están verdes el sake es nuevo; cuando marrones, está listo. ¡Encuentra una y descubre su estado!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#2d5a27,#8B4513); border-radius:15px;">
            <p style="font-size:3rem;">🟤🌿🍶</p>
            <p style="color:#90EE90; font-weight:bold;">¿Verde (nueva) o marrón (lista)?</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Sugidama</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_12_sugidama', currentUser, false); }
    },

    "day_12_wood": {
        tag: "photo",
        day: 12,
        title: "Detective de Madera",
        role: "kid9",
        xp: 15,
        location: "Takayama",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🔍 Detective de Madera 🔍</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Las fachadas históricas de Takayama ocultan hermosas tallas de madera. Encuentra una divertida en un alero o puerta y dinos qué animal o espíritu es.</p>
                
                <input type="text" id="wood-desc" placeholder="¿Qué criatura has visto? (ej: conejo, dragón...)" style="width:100%; border:2px solid #8d6e63; border-radius:20px; padding:10px 15px; font-family:inherit; font-size:1rem; box-sizing:border-box; margin-bottom:15px; text-align:center;">
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(141,110,99,0.3);">📸 Fotografiar Talla</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCam = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            const descInput = document.getElementById('wood-desc');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const desc = descInput.value.trim();
                if (desc.length < 3) {
                    showAlert('Descripción requerida', 'Indica qué animal o figura es la talla de madera antes de sacar la foto.');
                    fileInput.value = '';
                    return;
                }
                
                btnCam.innerText = '⏳ Guardando Talla Histórica...';
                btnCam.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_12_wood', {type:'mixed', data: `Animal: ${desc} | Foto ID: ${photoId}`}, role);
                } catch(err) {
                    console.error(err);
                    btnCam.innerText = '📸 Fotografiar Talla';
                    btnCam.disabled = false;
                    showAlert('Error', 'No se pudo subir la foto.');
                }
            });
        }
    },

    "day_12_hida": {
        tag: "economy",
        day: 12,
        title: "Degustadora de Hida",
        role: "kid9",
        xp: 15,
        location: "Takayama",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%); border-radius:15px; border:3px solid #ff8a65; color:#5d4037; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🥩 Catadora de Ternera de Hida 🥩</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#d84315;">Prueba una brocheta, bento o sushi de la legendaria carne de Hida (Hida-gyu). ¡Puntúa su delicia y suavidad!</p>
                
                <div style="font-size:3.5rem; letter-spacing:8px; margin:20px 0; cursor:pointer; user-select:none;" id="stars">
                    <span data-val="1" style="transition: transform 0.2s; display:inline-block;">☆</span><span data-val="2" style="transition: transform 0.2s; display:inline-block;">☆</span><span data-val="3" style="transition: transform 0.2s; display:inline-block;">☆</span><span data-val="4" style="transition: transform 0.2s; display:inline-block;">☆</span><span data-val="5" style="transition: transform 0.2s; display:inline-block;">☆</span>
                </div>
                
                <p id="star-desc" style="font-weight:bold; color:#d84315; min-height:1.2rem; margin-bottom:15px; font-size:0.9rem;">Toca las estrellas para calificar</p>
                <button id="btn-hida" class="btn-primary" style="width:100%; background:#ff5722; border-color:#ff5722; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(255,87,34,0.3);">🥩 SUBIR CALIFICACIÓN GOURMET</button>
            </div>
        `,
        attachEvents: (role) => {
            let score = 0;
            const spans = document.querySelectorAll('#stars span');
            const desc = document.getElementById('star-desc');
            const btn = document.getElementById('btn-hida');
            
            const descriptions = {
                1: '¡No me convenció mucho! 🥩',
                2: 'Estaba pasable... 🍖',
                3: '¡Rica y jugosa! 😋',
                4: '¡Espectacular, se deshace! 😍',
                5: '¡El mejor bocado de mi vida! 👑✨'
            };
            
            spans.forEach(s => {
                s.addEventListener('click', () => {
                    score = parseInt(s.dataset.val);
                    desc.innerText = descriptions[score];
                    
                    spans.forEach(ss => {
                        const val = parseInt(ss.dataset.val);
                        if (val <= score) {
                            ss.innerText = '★';
                            ss.style.color = '#ffb300';
                            ss.style.transform = 'scale(1.2)';
                        } else {
                            ss.innerText = '☆';
                            ss.style.color = '#5d4037';
                            ss.style.transform = 'scale(1)';
                        }
                    });
                    
                    if (window.playProceduralSound) playProceduralSound('click');
                });
            });
            
            btn.addEventListener('click', () => {
                if (score === 0) {
                    showAlert('Falta puntuación', 'Selecciona al menos una estrella para calificar la carne de Hida.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_12_hida', {type:'number', data: score}, role);
            });
        }
    },

"day_12_carving": {
        tag: "expert",
        day: 12,
        title: "Talla en Madera",
        role: "kid14",
        xp: 25,
        location: "Takayama",
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
        tag: "expert",
        day: 12,
        title: "Maestro Destilador",
        role: "kid14",
        xp: 20,
        location: "Takayama",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> ANÁLISIS DE CRONOLOGÍA FEUDAL: SAKE FUNASAKA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">La histórica destilería Funasaka fue fundada en el año 1703. Teniendo en cuenta el año actual (2026), calcula exactamente cuántos años de operatividad ininterrumpida tiene.</p>
                
                <div style="margin:15px 0; display:flex; gap:10px; align-items:center; justify-content:center;">
                    <span style="font-size:1.2rem;">2026 - 1703 =</span>
                    <input type="number" id="sake-years" placeholder="Años..." style="width:100px; background:#111; color:#ffd700; border:1px solid #ffd700; padding:10px; border-radius:5px; font-family:monospace; text-align:center; font-size:1.2rem;">
                </div>
                
                <p id="sake-status" style="font-size:0.85rem; color:#ffd700; text-align:center; min-height:1.2rem;">>>> Introduce la cifra exacta...</p>
                <button id="btn-sake" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">🔓 VERIFICAR REGISTROS HISTÓRICOS</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-sake');
            const input = document.getElementById('sake-years');
            const status = document.getElementById('sake-status');
            
            btn.addEventListener('click', () => {
                const val = parseInt(input.value);
                const correct = 2026 - 1703;
                
                if (val === correct) {
                    status.innerText = '>>> ¡CÁLCULO EXACTO! Registro desbloqueado (323 años).';
                    status.style.color = '#00ff99';
                    if (window.playProceduralSound) playProceduralSound('success');
                    setTimeout(() => {
                        submitMission('day_12_sake', {type:'number', data: val}, role);
                    }, 1200);
                } else {
                    status.innerText = '>>> ERROR: Desfase temporal detectado. Reintente.';
                    status.style.color = '#e74c3c';
                    if (window.playProceduralSound) playProceduralSound('error');
                }
            });
        }
    },

"day_12_patrol": {
        tag: "physical",
        day: 12,
        title: "Patrulla Sanmachi Suji",
        role: "kid14",
        xp: 15,
        location: "Takayama",
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
        tag: "economy",
        day: 12,
        title: "Tasador Feudal",
        role: "kid14",
        xp: 15,
        location: "Takayama",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> VALORACIÓN CATASTRAL: CASAS PATRIMONIALES (SANMACHI)</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Estima el precio comercial aproximado (en Euros) para comprar y restaurar una casa tradicional de madera del Período Edo en la zona protegida de Sanmachi Suji.</p>
                
                <div style="margin:20px 0; padding:15px; background:rgba(0,255,153,0.03); border:1px dashed #00ff99; border-radius:5px; text-align:center;">
                    <span style="font-size:0.8rem; color:#aaa;">VALOR ESTIMADO:</span>
                    <div id="appraisal-disp" style="font-size:2rem; font-weight:bold; color:#ffd700; margin:10px 0;">200.000 €</div>
                    <input type="range" id="appraisal-slider" min="50000" max="2000000" step="50000" value="200000" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                </div>
                
                <button id="btn-appraisal" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 SUBIR VALORACIÓN CATASTRAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('appraisal-slider');
            const disp = document.getElementById('appraisal-disp');
            const btn = document.getElementById('btn-appraisal');
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                disp.innerText = val.toLocaleString('es-ES') + ' €';
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btn.addEventListener('click', () => {
                const val = parseInt(slider.value);
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_12_appraisal', {type:'number', data: val}, role);
            });
        }
    },

    "day_12_bridge": {
        tag: "photo",
        day: 12,
        title: "Cruzando el Miyagawa",
        role: "both",
        xp: 20,
        location: "Takayama",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border-radius:15px; border:3px solid #ef5350; color:#b71c1c; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">⛩️ El Puente Rojo Nakabashi ⛩️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#b71c1c;">¡Reto familiar! Buscad el famoso puente de color rojo brillante sobre el río Miyagawa. Haceos una foto grupal de recuerdo.</p>
                
                <div style="font-size:4rem; margin:15px 0; animation: float 3s infinite;">🌉🌸</div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#e53935; border-color:#e53935; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(229,57,53,0.3);">📸 Foto Familiar en el Puente</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCam = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                btnCam.innerText = '⏳ Guardando Recuerdo Nakabashi...';
                btnCam.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    
                    submitMission('day_12_bridge', {type:'photo', data: photoId}, role, true);
                } catch(err) {
                    console.error(err);
                    btnCam.innerText = '📸 Foto Familiar en el Puente';
                    btnCam.disabled = false;
                    showAlert('Error', 'No se pudo guardar la imagen.');
                }
            });
        }
    },

    "day_13_stairs": {
        tag: "physical",
        day: 13,
        title: "La Escalada Chureito",
        role: "kid9",
        xp: 20,
        location: "Pagoda Chureito",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); border-radius:15px; border:3px solid #4db6ac; color:#004d40; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">⛩️ Pagoda Chureito: La Escalera Sagrada ⛩️</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#00796b;">Sube los escalones de piedra hacia la pagoda. Escribe el número total de escalones que has contado al llegar a la cima. ¡El Juez evaluará tu precisión!</p>
                
                <div style="margin:15px 0;">
                    <input type="number" id="stairs-count" placeholder="Número de escalones..." style="width:100%; border:2px solid #4db6ac; border-radius:20px; padding:10px 15px; font-family:inherit; font-size:1.2rem; box-sizing:border-box; text-align:center;">
                </div>
                
                <button id="btn-stairs" class="btn-primary" style="width:100%; background:#009688; border-color:#009688; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(0,150,136,0.3);">📨 REGISTRAR CONTEO DE ESCALERAS</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-stairs');
            const input = document.getElementById('stairs-count');
            
            btn.addEventListener('click', () => {
                const val = parseInt(input.value);
                if (isNaN(val) || val < 100 || val > 1000) {
                    showAlert('VALOR EXTRAÑO', 'Por favor, introduce un número de escalones razonable.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_13_stairs', {type:'number', data: val}, role);
            });
        }
    },

"day_13_manhole": {
        tag: "photo", day: 13, title: "El Sello del Lago", role: "kid9", xp: 15, location: "Kawaguchiko",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🎨 En Japón, las tapas de alcantarilla son obras de arte. Cada ciudad tiene su propio diseño único. Busca la más bonita cerca del lago y captúrala.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#1a1a2e,#4a148c); border-radius:15px;">
            <p style="font-size:3rem;">🎨🔵⭕</p>
            <p style="color:#ce93d8; font-style:italic;">Arte bajo tus pies</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Tapa Artística</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_13_manhole', currentUser, false); }
    },

"day_13_icecream": {
        tag: "writing",
        day: 13,
        title: "Sabores del Fuji",
        role: "kid9",
        xp: 15,
        location: "Kawaguchiko",
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
        tag: "expert",
        day: 13,
        title: "Filtro de Yōkai",
        role: "kid9",
        xp: 25,
        location: "Kawaguchiko",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">👾 Revelador de Espíritus Yōkai 👾</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Apunta al bosque de Kawaguchiko. La lente mágica invertirá los colores para detectar las firmas espirituales ocultas.</p>
                
                <div style="width:100%; height:200px; background:#000; border-radius:10px; overflow:hidden; border:3px solid #8d6e63; position:relative; margin-bottom:15px;">
                    <video id="yokai-vid" autoplay playsinline muted style="width:100%; height:100%; object-fit:cover; display:none;"></video>
                    <canvas id="yokai-canvas" width="300" height="200" style="width:100%; height:100%; object-fit:cover;"></canvas>
                    <div style="position:absolute; top:10px; left:10px; background:rgba(0,0,0,0.6); color:#ff4081; padding:3px 8px; border-radius:15px; font-size:0.75rem; font-weight:bold; display:flex; align-items:center; gap:5px;">
                        <span style="width:8px; height:8px; border-radius:50%; background:#ff4081; animation: blink 1s infinite;"></span> VISOR ESPECTRAL
                    </div>
                </div>
                
                <button id="btn-snap" class="btn-primary" style="width:100%; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:25px;">📸 CAPTURAR ESPECTRO INVERTIDO</button>
            </div>
        `,
        attachEvents: (role) => {
            const vid = document.getElementById('yokai-vid');
            const canv = document.getElementById('yokai-canvas');
            const ctx = canv.getContext('2d');
            const btn = document.getElementById('btn-snap');
            
            let stream = null;
            let active = true;
            
            const startCamera = async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    vid.srcObject = stream;
                    vid.style.display = 'block';
                    
                    const processFrame = () => {
                        if (!active) return;
                        if (vid.readyState === vid.HAVE_ENOUGH_DATA) {
                            ctx.drawImage(vid, 0, 0, canv.width, canv.height);
                            const imgData = ctx.getImageData(0, 0, canv.width, canv.height);
                            const data = imgData.data;
                            
                            for (let i = 0; i < data.length; i += 4) {
                                data[i] = 255 - data[i];
                                data[i+1] = 255 - data[i+1];
                                data[i+2] = 255 - data[i+2];
                            }
                            ctx.putImageData(imgData, 0, 0);
                        }
                        requestAnimationFrame(processFrame);
                    };
                    processFrame();
                } catch (err) {
                    console.error(err);
                    ctx.fillStyle = '#111';
                    ctx.fillRect(0,0,canv.width,canv.height);
                    ctx.fillStyle = '#ff4081';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Lente lista. Saca foto para revelar.', canv.width/2, canv.height/2);
                }
            };
            
            startCamera();
            
            btn.addEventListener('click', async () => {
                active = false;
                if (stream) stream.getTracks().forEach(t => t.stop());
                
                const dataUrl = canv.toDataURL('image/png');
                const photoId = 'yokai_' + Date.now();
                await savePhotoToDB(photoId, dataUrl);
                
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                
                submitMission('day_13_yokai', {type:'photo', data: photoId}, role);
            });
            
            window._missionCleanup = () => {
                active = false;
                if (stream) stream.getTracks().forEach(t => t.stop());
            };
        }
    },

"day_13_perspective": {
        tag: "photo", day: 13, title: "Perspectiva del Gigante", role: "kid14", xp: 15, location: "Monte Fuji",
        render: () => `
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> CAPTURA DE ESCALA HUMANA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Fotografía el Monte Fuji con una persona en primer plano para demostrar su escala descomunal. La diferencia de tamaño debe ser impactante.</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; padding:20px; border-radius:12px;">
                <p style="font-size:3rem;">🗻🧍‍♂️</p>
                <p style="color:#60efff;">Humano vs. Montaña</p>
            </div>
            <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Perspectiva</button>
        </div>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_13_perspective', currentUser, false); }
    },

    "day_13_tunnels": {
        tag: "expert",
        day: 13,
        title: "Navegantes del Asfalto",
        role: "kid14",
        xp: 15,
        location: "Kawaguchiko",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> RASTREO TÁCTICO: NAVEGANTES DEL ASFALTO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Durante el trayecto de carretera, cuenta la cantidad de túneles montañosos que atraviesa el vehículo.</p>
                
                <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
                    <button id="btn-sub-t" class="btn-secondary" style="border:1px solid #00ff99; background:transparent; color:#00ff99; font-size:1.5rem; width:45px; height:45px; cursor:pointer;">-</button>
                    <div id="tunnels-count" style="font-size:3rem; font-weight:bold; color:#ffd700; min-width:60px; text-align:center;">0</div>
                    <button id="btn-add-t" class="btn-secondary" style="border:1px solid #00ff99; background:transparent; color:#00ff99; font-size:1.5rem; width:45px; height:45px; cursor:pointer;">+</button>
                </div>
                
                <button id="btn-tunnels" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 REGISTRAR TÚNELES ATRAVESADOS</button>
            </div>
        `,
        attachEvents: (role) => {
            let count = 0;
            const display = document.getElementById('tunnels-count');
            const addBtn = document.getElementById('btn-add-t');
            const subBtn = document.getElementById('btn-sub-t');
            const submitBtn = document.getElementById('btn-tunnels');
            
            addBtn.addEventListener('click', () => {
                count++;
                display.innerText = count;
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            subBtn.addEventListener('click', () => {
                if (count > 0) {
                    count--;
                    display.innerText = count;
                    if (window.playProceduralSound) playProceduralSound('click');
                }
            });
            
            submitBtn.addEventListener('click', () => {
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_13_tunnels', {type:'number', data: count}, role);
            });
        }
    },

    "day_13_volcano": {
        tag: "writing",
        day: 13,
        title: "Análisis Vulcanológico",
        role: "kid14",
        xp: 20,
        location: "Fuji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> BASE DE DATOS GEOLÓGICA: SENSOR MONTE FUJI</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Investiga y completa la ficha técnica de seguridad geológica del Monte Fuji.</p>
                
                <div style="margin-bottom:10px;">
                    <label style="display:block; font-size:0.75rem; color:#aaa;">TIPO DE VOLCÁN:</label>
                    <input type="text" id="v-type" placeholder="Ej: estratovolcan..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <div style="margin-bottom:15px;">
                    <label style="display:block; font-size:0.75rem; color:#aaa;">AÑO DE ÚLTIMA ERUPCIÓN REGISTRADA:</label>
                    <input type="number" id="v-year" placeholder="Ej: 1707" style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:8px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <button id="btn-volcano" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">🔓 VERIFICAR REGISTRO VULCANOLÓGICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-volcano');
            const typeInput = document.getElementById('v-type');
            const yearInput = document.getElementById('v-year');
            
            btn.addEventListener('click', () => {
                const type = typeInput.value.toLowerCase().trim();
                const year = parseInt(yearInput.value);
                
                const validTypes = ['estratovolcan', 'estratovolcán', 'volcan compuesto', 'volcán compuesto'];
                
                if (validTypes.includes(type) && year === 1707) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_13_volcano', {type:'text', data: `Tipo: ${type} | Año erupción: ${year}`}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('DATOS INCORRECTOS', 'La descripción geológica o el año de erupción no corresponden a los datos oficiales del Monte Fuji. Pista: Erradicó en 1707.');
                }
            });
        }
    },

    "day_13_triangulation": {
        tag: "expert",
        day: 13,
        title: "Triangulación del Fuji",
        role: "kid14",
        xp: 20,
        location: "Lago Kawaguchi",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CÁLCULO BALÍSTICO: DISTANCIA ESTIMADA AL CRÁTER</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Estiende tu brazo. Si la cima del volcán mide exactamente el ancho de tu pulgar (unos 2 cm), significa que la distancia a la cima es unas 25 veces su altura (3776m). Calcula la distancia estimada.</p>
                
                <div style="margin:20px 0; padding:15px; background:rgba(0,255,153,0.03); border:1px dashed #00ff99; border-radius:5px; text-align:center;">
                    <span style="font-size:0.8rem; color:#aaa;">DISTANCIA EN KILÓMETROS:</span>
                    <div id="dist-disp" style="font-size:2.5rem; font-weight:bold; color:#ffd700; margin:10px 0;">30 km</div>
                    <input type="range" id="dist-slider" min="5" max="150" step="1" value="30" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                </div>
                
                <button id="btn-dist" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 ALMACENAR DATOS DE TRIANGULACIÓN</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('dist-slider');
            const disp = document.getElementById('dist-disp');
            const btn = document.getElementById('btn-dist');
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                disp.innerText = val + ' km';
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btn.addEventListener('click', () => {
                const val = parseInt(slider.value);
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_13_triangulation', {type:'number', data: val}, role);
            });
        }
    },

    "day_13_oishi": {
        tag: "photo",
        day: 13,
        title: "Oishi Park en Flor",
        role: "both",
        xp: 20,
        location: "Oishi Park",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%); border-radius:15px; border:3px solid #8bc34a; color:#33691e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌸 Paisaje Floral en Oishi Park 🌸</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#558b2f;">¡Reto familiar! Conseguid una preciosa foto grupal con las flores del parque Oishi en primer plano y la inmensidad del Monte Fuji al fondo.</p>
                
                <div style="font-size:4rem; margin:15px 0;">🗻🌸✨</div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#7cb342; border-color:#7cb342; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(124,179,66,0.3);">📸 Foto Familiar Oishi Park</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCam = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                btnCam.innerText = '⏳ Guardando Recuerdo Oishi Park...';
                btnCam.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    
                    submitMission('day_13_oishi', {type:'photo', data: photoId}, role, true);
                } catch(err) {
                    console.error(err);
                    btnCam.innerText = '📸 Foto Familiar Oishi Park';
                    btnCam.disabled = false;
                    showAlert('Error', 'No se pudo guardar la imagen.');
                }
            });
        }
    },

"day_14_rock": {
        tag: "photo", day: 14, title: "Aliento de Volcán", role: "kid9", xp: 15, location: "Hakone",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌋 Las rocas volcánicas de Hakone huelen a azufre y tienen colores extraños: amarillo, naranja, gris... Encuentra la roca más rara y fotografíala de cerca. ¡Cuidado, huele fatal!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B0000,#ff6b35,#f7c948); border-radius:15px;">
            <p style="font-size:3rem;">🌋🪨💨</p>
            <p style="color:#fff; font-weight:bold;">¡Huele a huevo podrido!</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Roca Volcánica</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_14_rock', currentUser, false); }
    },

    "day_14_kid9_echo": {
        tag: "audio",
        day: 14,
        title: "El Sonido que Muere",
        role: "kid9",
        xp: 20,
        location: "Bosque Aokigahara",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #81c784; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌲 El Silencio de Aokigahara 🌲</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">El suelo volcánico poroso del bosque absorbe el sonido. Inicia la grabación, da una palmada fuerte y registra el silencio absoluto que la sigue durante 5 segundos.</p>
                
                <div style="background:#1a1a24; padding:10px; border-radius:10px; margin-bottom:15px; border:2px solid #81c784; position:relative;">
                    <canvas id="echo-wave" width="280" height="80" style="width:100%; height:80px; display:block; background:#111; border-radius:5px;"></canvas>
                    <div id="echo-timer" style="position:absolute; right:15px; bottom:15px; color:#81c784; font-family:monospace; font-size:1.1rem; font-weight:bold;">05.0s</div>
                </div>
                
                <button id="btn-rec-echo" class="btn-primary" style="width:100%; border-radius:25px; background:#2e7d32; border-color:#2e7d32; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold;">🎤 INICIAR PRUEBA SÓNICA (5s)</button>
                <button id="btn-submit-echo" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; margin-top:10px;">📨 Enviar Grabación al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec-echo');
            const btnSubmit = document.getElementById('btn-submit-echo');
            const canvas = document.getElementById('echo-wave');
            const ctx = canvas.getContext('2d');
            const timerEl = document.getElementById('echo-timer');
            
            let recording = false;
            let audioCtx = null;
            let analyser = null;
            let source = null;
            let stream = null;
            let animationFrame = null;
            let dataArray = [];
            let timeLeft = 5.0;
            let interval = null;
            
            const drawWave = () => {
                if (!recording) return;
                animationFrame = requestAnimationFrame(drawWave);
                
                analyser.getByteTimeDomainData(dataArray);
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#81c784';
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
                            ctx.strokeStyle = '#4caf50';
                            ctx.stroke();
                            
                            timerEl.innerText = '00.0s';
                            btnRec.innerText = '✨ Silencio Registrado';
                            btnSubmit.classList.remove('hidden');
                            if (window.playProceduralSound) playProceduralSound('success');
                        } else {
                            timerEl.innerText = `${timeLeft.toFixed(1)}s`;
                        }
                    }, 100);
                    
                } catch (err) {
                    console.error(err);
                    showAlert('Error', 'Micrófono no disponible.');
                }
            });
            
            btnSubmit.addEventListener('click', () => {
                submitMission('day_14_kid9_echo', {type: 'audio', data: 'Sonido grabado de Aokigahara'}, role);
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

"day_14_root": {
        tag: "photo", day: 14, title: "Guardián del Bosque", role: "kid9", xp: 15, location: "Hakone",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌳 En el bosque de Hakone, las raíces de los árboles gigantes salen de la tierra como tentáculos. Encuentra el árbol con las raíces más impresionantes y posa junto a él como su guardiana.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#1a472a,#2d5a27); border-radius:15px;">
            <p style="font-size:3rem;">🌳🧝‍♀️✨</p>
            <p style="color:#90EE90; font-style:italic;">El bosque tiene guardianes secretos</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto con el Árbol Guardián</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_14_root', currentUser, false); }
    },

"day_14_compass": {
        tag: "expert",
        day: 14,
        title: "Brújula al Cráter",
        role: "kid9",
        xp: 25,
        location: "Fuji",
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
        tag: "sensors",
        day: 14,
        title: "Radar de Altitud Cero",
        role: "kid14",
        xp: 25,
        location: "Fuji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> RASTREADOR GPS: PUNTO CIEGO DE COBERTURA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Camina alejándote de las construcciones de la 5ª Estación del Fuji. Tu objetivo es encontrar un punto ciego en la lectura satelital.</p>
                
                <div style="text-align:center; margin:20px 0; padding:15px; border:1px dashed #00ff99; border-radius:5px; background:rgba(0,255,153,0.02);">
                    <div id="radar-pulse" style="font-size:1.5rem; font-weight:bold; color:#00ff99; margin-bottom:8px; animation: blink 1s infinite;">█ MONITOR ACTIVADO</div>
                    <div id="gps-dist" style="font-size:2.5rem; font-weight:bold; color:#ffd700; margin:10px 0;">-- m</div>
                    <p id="gps-status" style="font-size:0.75rem; color:#aaa;">Esperando telemetría del satélite...</p>
                </div>
                
                <button id="btn-radar" class="btn-primary hidden" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">📡 ENVIAR LOCALIZACIÓN DEL PUNTO</button>
            </div>
        `,
        attachEvents: (role) => {
            const dEl = document.getElementById('gps-dist');
            const mEl = document.getElementById('gps-status');
            const btn = document.getElementById('btn-radar');
            let watchId = null;
            const targetLat = 35.3606; // Mock 5th station approx coordinate
            const targetLon = 138.7274;
            const R = 6371000;
            
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
                    if(d < 100) {
                        mEl.innerText = ">>> PUNTO CIEGO ALCANZADO (Distancia < 100m)";
                        mEl.style.color = "#00ff99";
                        btn.classList.remove('hidden');
                    } else {
                        mEl.innerText = ">>> Señal estable. Aléjate de las tiendas.";
                        mEl.style.color = "#ffd700";
                    }
                }, (err) => {
                    mEl.innerText = "Error telemétrico: " + err.message;
                }, {enableHighAccuracy: true, timeout: 5000});
            } else {
                mEl.innerText = "GPS no disponible.";
            }
            
            let cheat = 0;
            dEl.addEventListener('click', () => {
                cheat++;
                if (cheat >= 5) {
                    dEl.innerText = '8 m';
                    mEl.innerText = ">>> SIMULACIÓN DE PUNTO CIEGO (Bypass)";
                    mEl.style.color = "#00ff99";
                    btn.classList.remove('hidden');
                    if (window.playProceduralSound) playProceduralSound('success');
                }
            });
            
            btn.addEventListener('click', () => {
                if (watchId) navigator.geolocation.clearWatch(watchId);
                submitMission('day_14_radar', {type:'game', data:'Punto de altitud cero verificado'}, role);
            });
            
            window._missionCleanup = () => {
                if(watchId) navigator.geolocation.clearWatch(watchId);
            };
        }
    },

    "day_14_pressure": {
        tag: "video",
        day: 14,
        title: "La Ley de la Presión",
        role: "kid14",
        xp: 20,
        location: "Fuji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CÁMARA TELEMÉTRICA: EXPERIMENTO DE PRESIÓN ALPINO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">La baja presión atmosférica en la 5ª Estación (2300m) hace que las bolsas de patatas o snacks cerradas se hinchen. Grábate en vídeo (mínimo 5 segundos) demostrando el fenómeno y explicando por qué ocurre.</p>
                
                <div id="video-box" style="margin-bottom:15px; text-align:center; position:relative; background:#111; border-radius:5px; overflow:hidden; border:1px dashed #00ff99; min-height:150px; display:flex; justify-content:center; align-items:center;">
                    <video id="p-vid" autoplay playsinline muted style="width:100%; height:150px; object-fit:cover; display:none;"></video>
                    <div id="vid-status" style="color:#00ff99; font-size:0.85rem;">Consola de grabación inactiva</div>
                </div>
                
                <button id="btn-rec" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; margin-bottom:10px;">🎬 INICIAR GRABACIÓN (5s)</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 TRANSMITIR REPORTE FOTÓNICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec');
            const btnSubmit = document.getElementById('btn-submit');
            const vid = document.getElementById('p-vid');
            const status = document.getElementById('vid-status');
            
            let mr = null;
            let chunks = [];
            let stream = null;
            let videoBlob = null;
            
            btnRec.addEventListener('click', async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
                    vid.srcObject = stream;
                    vid.style.display = 'block';
                    status.style.display = 'none';
                    
                    mr = new MediaRecorder(stream);
                    chunks = [];
                    mr.ondataavailable = e => chunks.push(e.data);
                    
                    mr.onstop = () => {
                        vid.srcObject = null;
                        videoBlob = new Blob(chunks, { type: 'video/mp4' });
                        vid.src = URL.createObjectURL(videoBlob);
                        vid.controls = true;
                        vid.muted = false;
                        
                        btnRec.innerText = '🎬 VOLVER A GRABAR';
                        btnSubmit.classList.remove('hidden');
                        if (window.playProceduralSound) playProceduralSound('success');
                        
                        stream.getTracks().forEach(t => t.stop());
                    };
                    
                    mr.start();
                    btnRec.disabled = true;
                    btnRec.innerText = '⏳ Grabando explicación (5s)...';
                    
                    setTimeout(() => {
                        if (mr.state === 'recording') mr.stop();
                        btnRec.disabled = false;
                    }, 5000);
                    
                } catch(e) {
                    console.error(e);
                    status.innerText = "Error de cámara: " + e.message;
                }
            });
            
            btnSubmit.addEventListener('click', () => {
                if (videoBlob) {
                    submitMission('day_14_pressure', {type:'video', data: 'Video explicacion presion (Guardado local)'}, role);
                }
            });
            
            window._missionCleanup = () => {
                if (mr && mr.state !== 'inactive') mr.stop();
                if (stream) stream.getTracks().forEach(t => t.stop());
            };
        }
    },

    "day_14_altimeter": {
        tag: "expert",
        day: 14,
        title: "Altímetro Hacker",
        role: "kid14",
        xp: 15,
        location: "Fuji",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CÁLCULO DE DIFERENCIAL DE ALTITUD</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">La 5ª Estación está situada a 2.300 metros sobre el nivel del mar. La cumbre geodésica del Monte Fuji tiene una altura de 3.776 metros. Calcula cuántos metros exactos de desnivel vertical separan ambos puntos.</p>
                
                <div style="margin:15px 0; display:flex; gap:10px; align-items:center; justify-content:center;">
                    <span>3776 m - 2300 m =</span>
                    <input type="number" id="alt-diff" placeholder="Metros..." style="width:120px; background:#111; color:#ffd700; border:1px solid #ffd700; padding:10px; border-radius:5px; font-family:monospace; text-align:center; font-size:1.2rem;">
                </div>
                
                <p id="alt-status" style="font-size:0.85rem; color:#ffd700; text-align:center; min-height:1.2rem;">>>> Introduce el diferencial...</p>
                <button id="btn-alt" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">🔓 VALIDAR DIFERENCIAL VERTICAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-alt');
            const input = document.getElementById('alt-diff');
            const status = document.getElementById('alt-status');
            
            btn.addEventListener('click', () => {
                const val = parseInt(input.value);
                const correct = 3776 - 2300; // 1476
                
                if (val === correct) {
                    status.innerText = '>>> ¡CÁLCULO EXACTO! Desnivel: 1.476 metros.';
                    status.style.color = '#00ff99';
                    if (window.playProceduralSound) playProceduralSound('success');
                    setTimeout(() => {
                        submitMission('day_14_altimeter', {type:'number', data: val}, role);
                    }, 1200);
                } else {
                    status.innerText = '>>> ERROR: Lectura barométrica incompatible.';
                    status.style.color = '#e74c3c';
                    if (window.playProceduralSound) playProceduralSound('error');
                }
            });
        }
    },

    "day_14_kid14_echo": {
        tag: "writing",
        day: 14,
        title: "Densidad de Aokigahara",
        role: "kid14",
        xp: 15,
        location: "Aokigahara",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> REPORTE CIENTÍFICO: ABSORCIÓN ACÚSTICA DEL BOSQUE</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Deduce y redacta la explicación física de por qué en el bosque de Aokigahara no hay eco y el sonido parece desaparecer al instante (Pista: relaciona la textura del suelo de roca volcánica con los árboles).</p>
                
                <textarea id="echo-explanation" placeholder=">>> Escribe tu reporte físico aquí..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                
                <button id="btn-echo-report" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 TRANSMITIR INFORME DE RESONANCIA</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-echo-report');
            const input = document.getElementById('echo-explanation');
            
            btn.addEventListener('click', () => {
                const txt = input.value.trim();
                if (txt.length < 15) {
                    showAlert('INFORME CORTO', 'El informe requiere mayor detalle analítico de la densidad acústica.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_14_kid14_echo', {type:'text', data: txt}, role);
            });
        }
    },

    "day_14_oxygen": {
        tag: "physical",
        day: 14,
        title: "Oxígeno Alpino",
        role: "both",
        xp: 20,
        location: "Fuji",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%); border-radius:15px; border:3px solid #4dd0e1; color:#006064; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:5px;">💨 Reto de Apnea Familiar 💨</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#00838f;">A 2300 metros hay menos moléculas de oxígeno en el aire. ¡Toda la familia debe aguantar la respiración durante 15 segundos juntos!</p>
                
                <div style="text-align:center; margin:15px 0; background:#fff; padding:15px; border-radius:10px; border:2px solid #4dd0e1;">
                    <div style="font-size:3.5rem; animation: pulse 1s infinite;" id="lung-emoji">🫁</div>
                    <div id="apnea-timer" style="font-size:2.5rem; font-weight:bold; color:#00838f;">15s</div>
                </div>
                
                <button id="btn-apnea" class="btn-primary" style="width:100%; background:#00bcd4; border-color:#00bcd4; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(0,188,212,0.3);">⏱️ EMPEZAR APNEA EN FAMILIA</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-apnea');
            const timerEl = document.getElementById('apnea-timer');
            const lung = document.getElementById('lung-emoji');
            
            let active = false;
            let time = 15;
            let interval = null;
            
            btn.addEventListener('click', () => {
                if (active) return;
                
                active = true;
                time = 15;
                timerEl.innerText = '15s';
                btn.disabled = true;
                btn.innerText = '😤 ¡Aguantad la respiración!';
                
                if (window.playProceduralSound) playProceduralSound('click');
                
                interval = setInterval(() => {
                    time--;
                    timerEl.innerText = time + 's';
                    
                    if (time <= 0) {
                        clearInterval(interval);
                        timerEl.innerText = '¡COMPLETADO!';
                        timerEl.style.color = '#4caf50';
                        lung.innerText = '✨🫁✨';
                        
                        if (window.playProceduralSound) playProceduralSound('success');
                        if (window.launchConfetti) launchConfetti();
                        
                        setTimeout(() => {
                            submitMission('day_14_oxygen', {type:'game', data: 'Apnea familiar 15s completada'}, role, true);
                        }, 1200);
                    }
                }, 1000);
            });
            
            window._missionCleanup = () => {
                clearInterval(interval);
            };
        }
    },

    "day_15_waterfall": {
        tag: "audio",
        day: 15,
        title: "Melodía de Shiraito",
        role: "kid9",
        xp: 20,
        location: "Cascada Shiraito",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e0f7fa 0%, #80deea 100%); border-radius:15px; border:3px solid #00acc1; color:#006064; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌊 El Estruendo de Shiraito 🌊</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#00838f;">La cascada tiene 150m de ancho y cae en hilos finos. Inicia la grabación para capturar el sonido del agua chocando contra el estanque.</p>
                
                <div style="background:#1a1a24; padding:10px; border-radius:10px; margin-bottom:15px; border:2px solid #00acc1; position:relative;">
                    <canvas id="water-wave" width="280" height="80" style="width:100%; height:80px; display:block; background:#111; border-radius:5px;"></canvas>
                    <div id="water-timer" style="position:absolute; right:15px; bottom:15px; color:#00acc1; font-family:monospace; font-size:1.1rem; font-weight:bold;">05.0s</div>
                </div>
                
                <button id="btn-rec-water" class="btn-primary" style="width:100%; border-radius:25px; background:#00acc1; border-color:#00acc1; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold;">🎤 INICIAR GRABACIÓN (5s)</button>
                <button id="btn-submit-water" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-family:'Quicksand', sans-serif; font-weight:bold; margin-top:10px;">📨 Enviar Audio al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec-water');
            const btnSubmit = document.getElementById('btn-submit-water');
            const canvas = document.getElementById('water-wave');
            const ctx = canvas.getContext('2d');
            const timerEl = document.getElementById('water-timer');
            
            let recording = false;
            let audioCtx = null;
            let analyser = null;
            let source = null;
            let stream = null;
            let animationFrame = null;
            let dataArray = [];
            let timeLeft = 5.0;
            let interval = null;
            
            const drawWave = () => {
                if (!recording) return;
                animationFrame = requestAnimationFrame(drawWave);
                
                analyser.getByteTimeDomainData(dataArray);
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#00acc1';
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
                            ctx.strokeStyle = '#00838f';
                            ctx.stroke();
                            
                            timerEl.innerText = '00.0s';
                            btnRec.innerText = '✨ Audio Capturado';
                            btnSubmit.classList.remove('hidden');
                            if (window.playProceduralSound) playProceduralSound('success');
                        } else {
                            timerEl.innerText = `${timeLeft.toFixed(1)}s`;
                        }
                    }, 100);
                } catch (err) {
                    console.error(err);
                    showAlert('Error', 'Micrófono no disponible.');
                }
            });
            
            btnSubmit.addEventListener('click', () => {
                submitMission('day_15_waterfall', {type: 'audio', data: 'Sonido de cascada Shiraito grabado'}, role);
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

"day_15_thatch": {
        tag: "photo", day: 15, title: "La Aldea de Paja", role: "kid9", xp: 15, location: "Shirakawa-go",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🏠 Las casas de Shirakawa-go tienen techos de paja tan gruesos que parecen sombreros gigantes. Algunos tienen más de 60cm de grosor. ¡Fotografía el techo más impresionante!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B7355,#D2B48C,#F5DEB3); border-radius:15px;">
            <p style="font-size:3rem;">🏠❄️🌾</p>
            <p style="color:#5a3e1b; font-weight:bold;">Casas que resisten 2 metros de nieve</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Techo de Paja</button>`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_15_thatch', currentUser, false); }
    },

"day_15_fish": {
        tag: "expert",
        day: 15,
        title: "Pez de Cristal",
        role: "kid9",
        xp: 20,
        location: "Estanques",
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
        tag: "physical", day: 15, title: "El Trono del Shogun", role: "kid9", xp: 15, location: "Takayama",
        render: () => `
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">👑 Encuentra el lugar con la mejor vista de la aldea y siéntate como si fueras la Shogun que gobierna todo lo que ve. Mantén la postura real durante 10 segundos.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#1a1a2e,#4a148c); border-radius:15px;">
            <p style="font-size:3rem;">👑🏯⚔️</p>
            <div id="sh-timer" style="font-size:2.5rem; color:#d4af37; font-family:monospace; margin:10px 0;">10</div>
        </div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px; font-size:1.1rem; padding:15px;">👑 Adoptar Postura Real</button>
        <button id="btn" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar al Juez</button>`,
        attachEvents: () => {
            let t=10,int=null;
            document.getElementById('btn-start').addEventListener('click',(e)=>{
                e.target.classList.add('hidden');
                int=setInterval(()=>{t--;document.getElementById('sh-timer').innerText=t;if(t<=0){clearInterval(int);document.getElementById('btn').classList.remove('hidden');document.getElementById('sh-timer').innerText='👑';}},1000);
            });
            document.getElementById('btn').addEventListener('click',()=>submitMission('day_15_shogun',{type:'game',data:'Postura Shogun completada'}));
            window._missionCleanup=()=>clearInterval(int);
        }
    },

    "day_15_deity": {
        tag: "writing",
        day: 15,
        title: "Santuario Escondido",
        role: "kid14",
        xp: 15,
        location: "Fujisan Hongu Sengen Taisha",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CONSULTA DE REGISTROS ESPIRITUALES: SENGEN TAISHA</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Busca información y escribe el nombre oficial de la deidad principal consagrada en este histórico santuario de la base del volcán (Pista: es la princesa de los cerezos en flor).</p>
                
                <div style="margin-bottom:15px;">
                    <input type="text" id="deity-name" placeholder="Nombre de la deidad..." style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:5px; font-family:monospace; box-sizing:border-box; text-transform:uppercase;">
                </div>
                
                <button id="btn-deity" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">🔓 VERIFICAR REGISTRO MÍTICO</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-deity');
            const input = document.getElementById('deity-name');
            
            btn.addEventListener('click', () => {
                const val = input.value.trim().toLowerCase();
                const correct = ['konohanasakuya-hime', 'konohana sakuya hime', 'konohanasakuyahime', 'konohana sakuya'];
                
                if (correct.includes(val)) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_15_deity', {type:'text', data: input.value}, role);
                } else {
                    if (window.playProceduralSound) playProceduralSound('error');
                    showAlert('DATOS ERRÓNEOS', 'La deidad principal indicada no coincide con Konohanasakuya-hime. Inténtalo de nuevo.');
                }
            });
        }
    },

    "day_15_honcho": {
        tag: "photo",
        day: 15,
        title: "Perspectiva Honcho Street",
        role: "kid14",
        xp: 20,
        location: "Honcho Street",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CÁMARA TÁCTICA: ENCUADRE HONCHO STREET</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Conigue la famosa toma donde la perspectiva lineal de la calle de tiendas enmarca perfectamente la mole nevada del Fuji al fondo.</p>
                
                <div style="font-size:3rem; text-align:center; margin:15px 0;">📏🗻📐</div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">📸 CAPTURAR PERSPECTIVA URBANA</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                btn.innerText = '⏳ Almacenando captura...';
                btn.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_15_honcho', {type:'photo', data: photoId}, role);
                } catch(err) {
                    console.error(err);
                    btn.innerText = '📸 CAPTURAR PERSPECTIVA URBANA';
                    btn.disabled = false;
                    showAlert('Error', 'Fallo al procesar la imagen.');
                }
            });
        }
    },

    "day_15_flow": {
        tag: "economy",
        day: 15,
        title: "Aforo de la Cascada",
        role: "kid14",
        xp: 15,
        location: "Cascada Shiraito",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CÁLCULO DE AFORO HÍDRICO: SHIRAITO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Estima la cantidad de caudal que cae por segundo a lo largo de los 150m de pared rocosa de la cascada.</p>
                
                <div style="margin:20px 0; padding:15px; background:rgba(0,255,153,0.03); border:1px dashed #00ff99; border-radius:5px; text-align:center;">
                    <span style="font-size:0.8rem; color:#aaa;">CAUDAL ESTIMADO:</span>
                    <div id="flow-disp" style="font-size:2rem; font-weight:bold; color:#ffd700; margin:10px 0;">1.500 Litros/s</div>
                    <input type="range" id="flow-slider" min="100" max="5000" step="100" value="1500" style="width:100%; accent-color:#00ff99; cursor:pointer;">
                </div>
                
                <button id="btn-flow" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 ENVIAR DATOS DE AFORO</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('flow-slider');
            const disp = document.getElementById('flow-disp');
            const btn = document.getElementById('btn-flow');
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                disp.innerText = val.toLocaleString('es-ES') + ' Litros/s';
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btn.addEventListener('click', () => {
                const val = parseInt(slider.value);
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_15_flow', {type:'number', data: val}, role);
            });
        }
    },

    "day_15_roof": {
        tag: "writing",
        day: 15,
        title: "Ingeniería Tradicional",
        role: "kid14",
        xp: 15,
        location: "Iyashi no Sato",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CUESTIONARIO DE INGENIERÍA: CASAS DE PAJA (KAYABUKI)</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Deduce por qué los tejados de paja en Iyashi no Sato tienen una inclinación tan empinada (estilo Gassho-zukuri, como manos rezando).</p>
                
                <textarea id="roof-desc" placeholder=">>> Escribe tu explicación sobre el clima o la física del tejado..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:6px; font-family:monospace; box-sizing:border-box;"></textarea>
                
                <button id="btn-roof" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 REGISTRAR LEY STRUCTURAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-roof');
            const input = document.getElementById('roof-desc');
            
            btn.addEventListener('click', () => {
                const txt = input.value.trim();
                if (txt.length < 15) {
                    showAlert('INFORMACIÓN INSUFICIENTE', 'Describe de forma más completa el factor climatológico (pista: nieve pesada en invierno).');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_15_roof', {type:'text', data: txt}, role);
            });
        }
    },

    "day_15_dragon": {
        tag: "writing",
        day: 15,
        title: "La Leyenda del Dragón",
        role: "both",
        xp: 20,
        location: "Lago Kawaguchi",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #fff9c4 0%, #fff59d 100%); border-radius:15px; border:3px solid #fbc02d; color:#f57f17; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🐉 Cuento del Dragón de Kawaguchiko 🐉</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#f57f17;">Reto grupal: Escribid juntos una leyenda corta sobre el dragón mitológico que duerme en el fondo del lago para proteger el monte Fuji.</p>
                
                <div style="margin-bottom:15px; text-align:left;">
                    <label style="font-size:0.8rem; font-weight:bold; display:block; margin-bottom:5px;">Vuestra leyenda de fantasía:</label>
                    <textarea id="dragon-tale" placeholder="Escribid la historia..." style="width:100%; height:110px; border:2px solid #fbc02d; border-radius:10px; padding:10px; font-family:inherit; font-size:0.95rem; box-sizing:border-box;"></textarea>
                </div>
                
                <button id="btn-dragon" class="btn-primary" style="width:100%; background:#fbc02d; border-color:#fbc02d; color:#000; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(251,192,45,0.3);">🐉 SELLAR RECUERDO DE LA LEYENDA</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-dragon');
            const text = document.getElementById('dragon-tale');
            
            btn.addEventListener('click', () => {
                const val = text.value.trim();
                if (val.length < 25) {
                    showAlert('Cuento muy corto', 'Escribid al menos 3 frases completas sobre vuestra criatura mágica.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                if (window.launchConfetti) launchConfetti();
                submitMission('day_15_dragon', {type:'text', data: val}, role, true);
            });
        }
    },

    "day_16_cat": {
        tag: "photo",
        day: 16,
        title: "El Gato Oculto",
        role: "kid9",
        xp: 15,
        location: "Kagurazaka",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); border-radius:15px; border:3px solid #8d6e63; color:#4e342e; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🐱 Mascotas de Kagurazaka 🐱</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#5d4037;">Kagurazaka está lleno de figuras y carteles de gatitos. Encuentra uno gracioso, ponle un nombre japonés divertido y hazle una foto.</p>
                
                <input type="text" id="cat-name" placeholder="Ej: Neko-Chan..." style="width:100%; border:2px solid #8d6e63; border-radius:20px; padding:10px 15px; font-family:inherit; font-size:1rem; box-sizing:border-box; margin-bottom:15px; text-align:center;">
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#8d6e63; border-color:#8d6e63; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(141,110,99,0.3);">📸 Foto del Gato</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCam = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            const nameInput = document.getElementById('cat-name');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const name = nameInput.value.trim();
                if (name.length < 3) {
                    showAlert('Nombre requerido', 'Dale un nombre gracioso a tu gato antes de subir la foto.');
                    fileInput.value = '';
                    return;
                }
                
                btnCam.innerText = '⏳ Guardando Neko...';
                btnCam.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_16_cat', {type:'mixed', data: `Nombre gato: ${name} | Foto ID: ${photoId}`}, role);
                } catch(err) {
                    console.error(err);
                    btnCam.innerText = '📸 Foto del Gato';
                    btnCam.disabled = false;
                    showAlert('Error', 'Error al guardar la imagen.');
                }
            });
        }
    },

    "day_16_skyscraper": {
        tag: "physical",
        day: 16,
        title: "Escalada Urbana",
        role: "kid9",
        xp: 15,
        location: "Tokio",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius:15px; border:3px solid #81c784; color:#1b5e20; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🏢 Estimador de Rascacielos 🏢</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#2e7d32;">Mira hacia arriba. Cuenta cuántos pisos crees que tiene el edificio más alto visible a tu alrededor. Multiplicaremos por 3m (altura por planta) para saber su altura.</p>
                
                <div style="margin:20px 0; padding:15px; background:#fff; border:2px dashed #81c784; border-radius:10px; display:flex; flex-direction:column; align-items:center;">
                    <div style="font-size:3rem;" id="elev-emoji">🏢</div>
                    <div id="floors-disp" style="font-size:2.5rem; font-weight:bold; color:#2e7d32; margin:10px 0;">30 Pisos</div>
                    <input type="range" id="floors-slider" min="5" max="120" step="1" value="30" style="width:100%; accent-color:#81c784; cursor:pointer;">
                    <span id="meters-disp" style="font-size:0.95rem; font-weight:bold; color:#ff9800; margin-top:5px;">Altura estimada: 90 metros</span>
                </div>
                
                <button id="btn-skyscraper" class="btn-primary" style="width:100%; background:#81c784; border-color:#81c784; color:#fff; font-weight:bold; border-radius:25px;">🏢 ENVIAR REGISTRO DE ALTURA</button>
            </div>
        `,
        attachEvents: (role) => {
            const slider = document.getElementById('floors-slider');
            const disp = document.getElementById('floors-disp');
            const meters = document.getElementById('meters-disp');
            const btn = document.getElementById('btn-skyscraper');
            const emoji = document.getElementById('elev-emoji');
            
            slider.addEventListener('input', (e) => {
                const floors = parseInt(e.target.value);
                disp.innerText = floors + ' Pisos';
                meters.innerText = `Altura estimada: ${floors * 3} metros`;
                
                if (floors > 80) emoji.innerText = '🚀🏢';
                else if (floors > 40) emoji.innerText = '🏙️';
                else emoji.innerText = '🏢';
                
                if (window.playProceduralSound) playProceduralSound('click');
            });
            
            btn.addEventListener('click', () => {
                const floors = parseInt(slider.value);
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_16_skyscraper', {type:'number', data: `${floors} pisos (${floors * 3}m)`}, role);
            });
        }
    },

"day_16_colors": {
        tag: "expert",
        day: 16,
        title: "Colores de Shinjuku",
        role: "kid9",
        xp: 15,
        location: "Shinjuku",
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
        tag: "audio",
        day: 16,
        title: "Sonido del Semáforo",
        role: "kid9",
        xp: 15,
        location: "Tokio",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border-radius:15px; border:3px solid #ef5350; color:#c62828; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🚦 El Canto del Semáforo Peatonal 🚦</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#b71c1c;">Los semáforos de Tokio emiten sonidos de pájaros para las personas ciegas cuando se pone en verde. Acércate y graba este silbido o canto tan gracioso.</p>
                
                <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin:20px 0;">
                    <div id="signal-light" style="width:70px; height:70px; border-radius:50%; background:#ef5350; border:4px solid #333; display:flex; justify-content:center; align-items:center; font-size:2rem; transition: background 0.3s; animation: pulse 1s infinite;">🛑</div>
                    <div id="traffic-timer" style="font-size:2.5rem; font-weight:bold; color:#b71c1c;">05.0s</div>
                </div>
                
                <button id="btn-rec-traffic" class="btn-primary" style="width:100%; border-radius:25px; background:#e53935; border-color:#e53935; color:#fff; font-weight:bold;">🎤 INICIAR PRUEBA SÓNICA (5s)</button>
                <button id="btn-submit-traffic" class="btn-primary hidden" style="width:100%; border-radius:25px; background:#4caf50; border-color:#4caf50; color:#fff; font-weight:bold; margin-top:10px;">📨 Enviar Audio al Juez</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnRec = document.getElementById('btn-rec-traffic');
            const btnSubmit = document.getElementById('btn-submit-traffic');
            const timerEl = document.getElementById('traffic-timer');
            const light = document.getElementById('signal-light');
            
            let recording = false;
            let stream = null;
            let audioCtx = null;
            let timeLeft = 5.0;
            let interval = null;
            
            btnRec.addEventListener('click', async () => {
                if (recording) return;
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    audioCtx = new AudioContextClass();
                    
                    recording = true;
                    timeLeft = 5.0;
                    timerEl.innerText = '05.0s';
                    btnRec.disabled = true;
                    btnRec.innerText = '⏳ Grabando...';
                    
                    light.style.background = '#4caf50';
                    light.innerText = '🚶';
                    light.style.animation = 'blink 0.5s infinite';
                    
                    interval = setInterval(() => {
                        timeLeft -= 0.1;
                        if (timeLeft <= 0) {
                            timeLeft = 0;
                            clearInterval(interval);
                            recording = false;
                            
                            stream.getTracks().forEach(t => t.stop());
                            if (audioCtx) audioCtx.close();
                            
                            light.style.background = '#888';
                            light.innerText = '💤';
                            light.style.animation = 'none';
                            
                            timerEl.innerText = '00.0s';
                            btnRec.innerText = '✨ Canto Semáforo Grabado';
                            btnSubmit.classList.remove('hidden');
                            if (window.playProceduralSound) playProceduralSound('success');
                        } else {
                            timerEl.innerText = `${timeLeft.toFixed(1)}s`;
                        }
                    }, 100);
                } catch (err) {
                    console.error(err);
                    showAlert('Error', 'Micrófono no disponible.');
                }
            });
            
            btnSubmit.addEventListener('click', () => {
                submitMission('day_16_traffic', {type: 'audio', data: 'Sonido de semáforo peatonal grabado'}, role);
            });
            
            window._missionCleanup = () => {
                recording = false;
                clearInterval(interval);
                if (stream) stream.getTracks().forEach(t => t.stop());
                if (audioCtx) audioCtx.close();
            };
        }
    },

    "day_16_vortex": {
        tag: "photo",
        day: 16,
        title: "Vórtice Temporal",
        role: "kid14",
        xp: 20,
        location: "Kagurazaka",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> CÁMARA TÁCTICA: ANOMALÍA VÓRTICE TEMPORAL</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Captura una composición fotográfica donde convivan en el mismo encuadre un elemento antiguo (templo tradicional, farolillo) y un elemento futurista o rascacielos.</p>
                
                <div style="font-size:3rem; text-align:center; margin:15px 0;">⛩️🌀🏢</div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent; font-family:monospace;">📸 REGISTRAR VÓRTICE TEMPORAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                btn.innerText = '⏳ Guardando anomalía temporal...';
                btn.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    submitMission('day_16_vortex', {type:'photo', data: photoId}, role);
                } catch(err) {
                    console.error(err);
                    btn.innerText = '📸 REGISTRAR VÓRTICE TEMPORAL';
                    btn.disabled = false;
                    showAlert('Error', 'Fallo al procesar la imagen.');
                }
            });
        }
    },

"day_16_combat": {
        tag: "sensors",
        day: 16,
        title: "Calibración de Androide",
        role: "kid14",
        xp: 25,
        location: "Shinjuku",
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
        tag: "physical",
        day: 16,
        title: "Supervivencia Shinjuku",
        role: "kid14",
        xp: 25,
        location: "Estación de Shinjuku",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> ESCAPE SHINJUKU: SIMULADOR DE TIEMPO TÁCTICO</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">Guía a la familia hacia la calle. Inicia el cronómetro al bajar del tren en Shinjuku (la estación más transitada del mundo) y deténlo cuando salgáis al exterior.</p>
                
                <div style="text-align:center; margin:15px 0; background:#111; padding:15px; border-radius:8px; border:1px solid #333;">
                    <div id="shinjuku-chrono" style="font-size:2.8rem; font-weight:bold; color:#ffd700;">00:00.0</div>
                    <div style="font-size:0.75rem; color:#aaa; margin-top:5px;">SIN GOOGLE MAPS. SIGUE CARTELES AMARILLOS.</div>
                </div>
                
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button id="btn-start" class="btn-secondary" style="flex:1; border-color:#00ff99; color:#00ff99; background:transparent;">INICIAR</button>
                    <button id="btn-stop" class="btn-secondary hidden" style="flex:1; border-color:#e74c3c; color:#e74c3c; background:transparent;">💥 ¡CALLE ALCANZADA!</button>
                </div>
                
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 SUBIR REGISTRO DE ESCAPE</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnStart = document.getElementById('btn-start');
            const btnStop = document.getElementById('btn-stop');
            const btnSubmit = document.getElementById('btn-submit');
            const clock = document.getElementById('shinjuku-chrono');
            
            let t0 = 0;
            let timerInt = null;
            let elapsedStr = '';
            
            btnStart.addEventListener('click', () => {
                t0 = Date.now();
                btnStart.classList.add('hidden');
                btnStop.classList.remove('hidden');
                if (window.playProceduralSound) playProceduralSound('click');
                
                timerInt = setInterval(() => {
                    const diff = Date.now() - t0;
                    const min = Math.floor(diff / 60000);
                    const sec = Math.floor((diff % 60000) / 1000);
                    const ms = Math.floor((diff % 1000) / 100);
                    
                    elapsedStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${ms}`;
                    clock.innerText = elapsedStr;
                }, 100);
            });
            
            btnStop.addEventListener('click', () => {
                clearInterval(timerInt);
                btnStop.classList.add('hidden');
                btnSubmit.classList.remove('hidden');
                clock.style.color = '#00ff99';
                if (window.playProceduralSound) playProceduralSound('success');
            });
            
            btnSubmit.addEventListener('click', () => {
                submitMission('day_16_shinjuku', {type:'text', data: `Tiempo de escape: ${elapsedStr}`}, role);
            });
            
            window._missionCleanup = () => {
                clearInterval(timerInt);
            };
        }
    },

    "day_16_density": {
        tag: "writing",
        day: 16,
        title: "Densidad Poblacional",
        role: "kid14",
        xp: 15,
        location: "Tokio",
        render: () => `
            <div class="ui-terminal" style="padding:15px; border-radius:8px; font-family:monospace; background:#0a0e12; border:1px solid #00ff99; color:#00ff99; box-shadow:0 4px 15px rgba(0,255,153,0.15);">
                <p>>>> MONITOR DE FLUJO: DENSIDAD CRUCE PEATONAL</p>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:15px;">En el cruce de Shibuya o Shinjuku, estima cuántas personas aproximadamente cruzan la calle en un solo semáforo verde peatonal.</p>
                
                <div style="margin-bottom:15px;">
                    <label style="display:block; font-size:0.8rem; color:#00ff99; margin-bottom:5px;">PERSONAS ESTIMADAS POR CICLO VERDE:</label>
                    <input type="number" id="people-count" placeholder="Ej: 1000" style="width:100%; background:#111; color:#00ff99; border:1px solid #00ff99; padding:10px; border-radius:5px; font-family:monospace; box-sizing:border-box;">
                </div>
                
                <button id="btn-density" class="btn-primary" style="width:100%; border-color:#00ff99; color:#00ff99; background:transparent;">💾 REGISTRAR CENSADO POBLACIONAL</button>
            </div>
        `,
        attachEvents: (role) => {
            const btn = document.getElementById('btn-density');
            const input = document.getElementById('people-count');
            
            btn.addEventListener('click', () => {
                const val = parseInt(input.value);
                if (isNaN(val) || val < 10) {
                    showAlert('VALOR INCONSISTENTE', 'Indica un volumen de personas realista para un gran cruce peatonal de Tokio.');
                    return;
                }
                if (window.playProceduralSound) playProceduralSound('success');
                submitMission('day_16_density', {type:'number', data: val}, role);
            });
        }
    },

    "day_16_tocho": {
        tag: "photo",
        day: 16,
        title: "El Observatorio Gratuito",
        role: "both",
        xp: 20,
        location: "Mirador del Ayuntamiento",
        render: () => `
            <div style="text-align:center; padding:15px; background:linear-gradient(135deg, #1a237e 0%, #311b92 100%); border-radius:15px; border:3px solid #3f51b5; color:#e8eaf6; font-family:'Quicksand', sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <p class="mission-desc" style="font-weight:bold; font-size:1.1rem; margin-bottom:10px;">🌃 Tokio Nocturno desde el Tocho 🌃</p>
                <p style="font-size:0.85rem; margin-bottom:15px; color:#c5cae9;">Subid al mirador del Edificio del Gobierno Metropolitano de Tokio (Tocho) en Shinjuku. Capturad una foto familiar nocturna con las luces infinitas de la ciudad al fondo.</p>
                
                <div style="font-size:4rem; margin:15px 0;">🏙️✨🗼</div>
                
                <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
                <button id="btn-cam" onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%; font-family:'Quicksand', sans-serif; background:#3f51b5; border-color:#3f51b5; color:#fff; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(63,81,181,0.3);">📸 Foto Familiar en el Mirador</button>
            </div>
        `,
        attachEvents: (role) => {
            const btnCam = document.getElementById('btn-cam');
            const fileInput = document.getElementById('p-cam');
            
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                btnCam.innerText = '⏳ Guardando Recuerdo Tocho...';
                btnCam.disabled = true;
                
                try {
                    const compressed = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    await savePhotoToDB(photoId, compressed);
                    
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    
                    submitMission('day_16_tocho', {type:'photo', data: photoId}, role, true);
                } catch(err) {
                    console.error(err);
                    btnCam.innerText = '📸 Foto Familiar en el Mirador';
                    btnCam.disabled = false;
                    showAlert('Error', 'Fallo al guardar la foto.');
                }
            });
        }
    },
});
