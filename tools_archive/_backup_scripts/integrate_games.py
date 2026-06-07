import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

NEW_MISSIONS = {
    # 1. Niño 9 años - Día 6 - Pasos de Ninja (Ritmo)
    "day_6_kid9_ninja_steps": """{
        day: 6, title: "Pasos de Ninja (Ritmo)", role: "kid9", xp: 20, location: "Castillo Nijo",
        render: () => `
            <p class="mission-desc">Toca las huellas cuando entren en la zona azul. ¡No hagas ruido!</p>
            <div id="ninja-game" class="game-container" style="height:400px;">
                <div class="rhythm-zone"></div>
                <div id="ninja-score" style="position:absolute; top:10px; right:10px; font-weight:bold; color:var(--color-primary);">Aciertos: 0/5</div>
            </div>
            <button id="btn-start-ninja" class="btn-primary" style="width:100%">Empezar Entrenamiento</button>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Enviar Victoria al Juez</button>
        `,
        attachEvents: () => {
            const container = document.getElementById('ninja-game');
            const scoreDisp = document.getElementById('ninja-score');
            const btnStart = document.getElementById('btn-start-ninja');
            const btnVictory = document.getElementById('btn-victory');
            let score = 0;
            let active = false;
            let footsteps = [];
            
            const spawnFootstep = () => {
                if(!active) return;
                const foot = document.createElement('div');
                foot.innerHTML = '👣';
                foot.style.position = 'absolute';
                foot.style.top = '-50px';
                foot.style.left = 'calc(50% - 25px)';
                foot.style.fontSize = '3rem';
                foot.dataset.hit = 'false';
                container.appendChild(foot);
                footsteps.push({ el: foot, top: -50 });
                setTimeout(spawnFootstep, 1500 + Math.random() * 1000);
            };

            const loop = () => {
                if(!active) return;
                footsteps.forEach((f, index) => {
                    f.top += 3; // Velocidad de caída
                    f.el.style.top = f.top + 'px';
                    
                    if(f.top > 400) {
                        f.el.remove();
                        footsteps.splice(index, 1);
                    }
                });
                requestAnimationFrame(loop);
            };

            container.addEventListener('touchstart', (e) => {
                if(!active) return;
                e.preventDefault();
                footsteps.forEach(f => {
                    if(f.top > 300 && f.top < 380 && f.el.dataset.hit === 'false') {
                        f.el.dataset.hit = 'true';
                        f.el.style.color = 'var(--color-primary)';
                        f.el.style.transform = 'scale(1.5)';
                        score++;
                        scoreDisp.innerText = `Aciertos: \${score}/5`;
                        if(score >= 5) {
                            active = false;
                            btnVictory.classList.remove('hidden');
                            showAlert("¡Maestro Ninja!", "Tus pasos son silenciosos como el viento.");
                        }
                    }
                });
            });

            btnStart.addEventListener('click', () => {
                btnStart.classList.add('hidden');
                active = true;
                spawnFootstep();
                loop();
            });

            btnVictory.addEventListener('click', () => {
                submitMission('day_6_kid9_ninja_steps', { type: 'text', data: 'Minijuego superado (Aciertos: 5)' });
            });
        }
    }""",

    # 2. Niño 9 años - Día 9 - Limpia el Reflejo (Rasca)
    "day_9_kid9_scratch": """{
        day: 9, title: "Limpia el Reflejo (Zen)", role: "kid9", xp: 20, location: "Kinkaku-ji",
        render: () => `
            <p class="mission-desc">Frota el agua turbia para revelar el reflejo dorado del templo.</p>
            <div class="scratch-container">
                <img src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500" class="scratch-bg">
                <canvas id="scratch-canvas" class="scratch-canvas"></canvas>
            </div>
            <div id="scratch-progress" style="text-align:center; margin:10px 0; color:var(--color-primary); font-weight:bold;">Limpio: 0%</div>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Revelar Victoria</button>
        `,
        attachEvents: () => {
            const canvas = document.getElementById('scratch-canvas');
            const ctx = canvas.getContext('2d');
            const progressDisp = document.getElementById('scratch-progress');
            const btnVictory = document.getElementById('btn-victory');
            
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            ctx.fillStyle = '#78909c';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '20px Outfit';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText('Frota aquí...', canvas.width/2, canvas.height/2);

            let isDrawing = false;
            let scratchedPixels = 0;

            const scratch = (x, y) => {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, 30, 0, Math.PI * 2);
                ctx.fill();
                checkProgress();
            };

            const checkProgress = () => {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let transparent = 0;
                for (let i = 3; i < imageData.length; i += 40) {
                    if (imageData[i] === 0) transparent++;
                }
                const percent = Math.round((transparent / (imageData.length / 40)) * 100);
                progressDisp.innerText = `Limpio: \${percent}%`;
                if(percent > 70) {
                    canvas.style.opacity = '0';
                    btnVictory.classList.remove('hidden');
                }
            };

            canvas.addEventListener('touchstart', (e) => { isDrawing = true; const r = canvas.getBoundingClientRect(); scratch(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); e.preventDefault(); });
            canvas.addEventListener('touchmove', (e) => { if(isDrawing) { const r = canvas.getBoundingClientRect(); scratch(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); } e.preventDefault(); });
            canvas.addEventListener('touchend', () => { isDrawing = false; });

            btnVictory.addEventListener('click', () => {
                submitMission('day_9_kid9_scratch', { type: 'text', data: 'Reflejo revelado (70%+)' });
            });
        }
    }""",

    # 3. Niño 9 años - Día 10 - Maestro del Bento (Drag)
    "day_10_kid9_bento": """{
        day: 10, title: "Maestro del Bento", role: "kid9", xp: 20, location: "Mercado Nishiki",
        render: () => `
            <p class="mission-desc">Arrastra cada ingrediente a su hueco en la caja.</p>
            <div class="bento-tray">
                <div class="bento-slot" data-target="🍣">🍱</div>
                <div class="bento-slot" data-target="🍙">🍱</div>
                <div class="bento-slot" data-target="🍤">🍱</div>
                <div class="bento-slot" data-target="🍡">🍱</div>
            </div>
            <div class="bento-ingredients">
                <div class="ingredient" data-type="🍣" style="position:relative;">🍣</div>
                <div class="ingredient" data-type="🍙" style="position:relative;">🍙</div>
                <div class="ingredient" data-type="🍤" style="position:relative;">🍤</div>
                <div class="ingredient" data-type="🍡" style="position:relative;">🍡</div>
            </div>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%; margin-top:20px;">Presentar Bento</button>
        `,
        attachEvents: () => {
            const ingredients = document.querySelectorAll('.ingredient');
            const slots = document.querySelectorAll('.bento-slot');
            const btnVictory = document.getElementById('btn-victory');
            let placed = 0;

            ingredients.forEach(ing => {
                ing.addEventListener('touchstart', (e) => {
                    ing.style.zIndex = 1000;
                });

                ing.addEventListener('touchmove', (e) => {
                    const touch = e.touches[0];
                    ing.style.position = 'fixed';
                    ing.style.left = (touch.clientX - 25) + 'px';
                    ing.style.top = (touch.clientY - 25) + 'px';
                    e.preventDefault();
                });

                ing.addEventListener('touchend', (e) => {
                    const touch = e.changedTouches[0];
                    let hit = false;
                    slots.forEach(slot => {
                        const rect = slot.getBoundingClientRect();
                        if(touch.clientX > rect.left && touch.clientX < rect.right &&
                           touch.clientY > rect.top && touch.clientY < rect.bottom &&
                           slot.dataset.target === ing.dataset.type && !slot.innerHTML.includes(ing.dataset.type)) {
                            slot.innerHTML = ing.dataset.type;
                            ing.style.display = 'none';
                            placed++;
                            hit = true;
                            if(placed === 4) btnVictory.classList.remove('hidden');
                        }
                    });
                    if(!hit) {
                        ing.style.position = 'relative';
                        ing.style.left = '0';
                        ing.style.top = '0';
                    }
                });
            });

            btnVictory.addEventListener('click', () => {
                submitMission('day_10_kid9_bento', { type: 'text', data: 'Bento completado con éxito' });
            });
        }
    }""",

    # 4. Niño 14 años - Día 9 - Laberinto de Torii (Rotación)
    "day_9_kid14_torii": """{
        day: 9, title: "Laberinto de Torii", role: "kid14", xp: 25, location: "Fushimi Inari",
        render: () => `
            <p class="mission-desc">Toca los Torii para rotarlos y conectar el camino.</p>
            <div class="torii-grid" id="torii-grid">
                \${Array(9).fill(0).map((_, i) => `
                    <div class="torii-piece" data-index="\${i}" data-rot="0">
                        <svg viewBox="0 0 100 100">
                            <path d="\${i%2===0 ? 'M50,0 L50,100 M0,50 L100,50' : 'M50,0 Q50,50 100,50'}" />
                        </svg>
                    </div>
                `).join('')}
            </div>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Misión Cumplida</button>
        `,
        attachEvents: () => {
            const pieces = document.querySelectorAll('.torii-piece');
            const btnVictory = document.getElementById('btn-victory');
            
            pieces.forEach(p => {
                p.addEventListener('click', () => {
                    let rot = parseInt(p.dataset.rot) + 90;
                    p.dataset.rot = rot;
                    p.style.transform = \`rotate(\${rot}deg)\`;
                    checkConnection();
                });
            });

            const checkConnection = () => {
                let totalRots = 0;
                pieces.forEach(p => totalRots += parseInt(p.dataset.rot));
                if(totalRots >= 720) btnVictory.classList.remove('hidden');
            };

            btnVictory.addEventListener('click', () => {
                submitMission('day_9_kid14_torii', { type: 'text', data: 'Laberinto resuelto' });
            });
        }
    }""",

    # 5. Niño 14 años - Día 7 - Ingeniería Antisísmica (Giroscopio)
    "day_7_kid14_anti_seismic": """{
        day: 7, title: "Ingeniería Antisísmica", role: "kid14", xp: 20, location: "Kiyomizu-dera",
        render: () => `
            <p class="mission-desc">Mantén el móvil plano durante 15s. ¡Cuidado con el terremoto!</p>
            <div class="level-container">
                <div class="target-zone"></div>
                <div id="bubble" class="bubble"></div>
            </div>
            <div id="level-timer" style="font-size:2rem; text-align:center; font-weight:bold;">15s</div>
            <button id="btn-start-level" class="btn-secondary" style="width:100%; margin-top:20px;">Calibrar y Empezar</button>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Enviar Estabilidad</button>
        `,
        attachEvents: () => {
            const bubble = document.getElementById('bubble');
            const timerDisp = document.getElementById('level-timer');
            const btnStart = document.getElementById('btn-start-level');
            const btnVictory = document.getElementById('btn-victory');
            let timeLeft = 15;
            let active = false;
            let interval = null;

            const handleOrientation = (e) => {
                if(!active) return;
                const x = e.gamma;
                const y = e.beta;
                
                const moveX = Math.max(-80, Math.min(80, x * 2));
                const moveY = Math.max(-80, Math.min(80, y * 2));
                bubble.style.transform = \`translate(calc(-50% + \${moveX}px), calc(-50% + \${moveY}px))\`;

                if(Math.abs(x) > 10 || Math.abs(y) > 10) {
                    if(navigator.vibrate) navigator.vibrate(100);
                    timeLeft = 15;
                    timerDisp.style.color = 'red';
                } else {
                    timerDisp.style.color = 'var(--color-primary)';
                }
            };

            btnStart.addEventListener('click', async () => {
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const permission = await DeviceOrientationEvent.requestPermission();
                    if(permission !== 'granted') return alert("Permiso denegado");
                }
                btnStart.classList.add('hidden');
                active = true;
                window.addEventListener('deviceorientation', handleOrientation);
                interval = setInterval(() => {
                    if(active) {
                        timeLeft--;
                        timerDisp.innerText = timeLeft + 's';
                        if(timeLeft <= 0) {
                            clearInterval(interval);
                            active = false;
                            btnVictory.classList.remove('hidden');
                        }
                    }
                }, 1000);
            });

            btnVictory.addEventListener('click', () => {
                window.removeEventListener('deviceorientation', handleOrientation);
                submitMission('day_7_kid14_anti_seismic', { type: 'text', data: 'Estabilidad mantenida 15s' });
            });
        }
    }""",

    # 6. Niño 14 años - Día 8 - Sincronización de Ondas (Math)
    "day_8_kid14_wave_sync": """{
        day: 8, title: "Sincronización de Ondas", role: "kid14", xp: 20, location: "Arashiyama",
        render: () => `
            <p class="mission-desc">Ajusta tu onda (roja) para que coincida con la del bosque (verde).</p>
            <canvas id="wave-canvas" class="wave-canvas"></canvas>
            <div class="wave-controls">
                <div class="wave-control-group">
                    <label>Amplitud</label><input type="range" id="w-amp" min="10" max="80" value="30">
                </div>
                <div class="wave-control-group">
                    <label>Frecuencia</label><input type="range" id="w-freq" min="0.01" max="0.1" step="0.01" value="0.05">
                </div>
                <div class="wave-control-group">
                    <label>Fase</label><input type="range" id="w-phase" min="0" max="6.28" step="0.1" value="0">
                </div>
            </div>
            <div id="wave-error" style="text-align:center; margin-top:10px; font-weight:bold;">Error: 100%</div>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%; margin-top:15px;">Sincronizar</button>
        `,
        attachEvents: () => {
            const canvas = document.getElementById('wave-canvas');
            const ctx = canvas.getContext('2d');
            const sliders = ['w-amp', 'w-freq', 'w-phase'].map(id => document.getElementById(id));
            const errorDisp = document.getElementById('wave-error');
            const btnVictory = document.getElementById('btn-victory');

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const target = { amp: 50, freq: 0.03, phase: 1.5 };

            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const user = { amp: sliders[0].value, freq: sliders[1].value, phase: sliders[2].value };

                ctx.beginPath();
                ctx.strokeStyle = '#2ecc71';
                ctx.lineWidth = 3;
                for(let x=0; x<canvas.width; x++) {
                    const y = canvas.height/2 + target.amp * Math.sin(x * target.freq + target.phase);
                    if(x===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = '#e74c3c';
                ctx.lineWidth = 3;
                let totalErr = 0;
                for(let x=0; x<canvas.width; x++) {
                    const yUser = canvas.height/2 + user.amp * Math.sin(x * user.freq + user.phase);
                    const yTarget = canvas.height/2 + target.amp * Math.sin(x * target.freq + target.phase);
                    totalErr += Math.abs(yUser - yTarget);
                    if(x===0) ctx.moveTo(x, yUser); else ctx.lineTo(x, yUser);
                }
                ctx.stroke();

                const avgErr = Math.round((totalErr / (canvas.width * 50)) * 100);
                errorDisp.innerText = \`Error: \${avgErr}%\`;
                if(avgErr < 5) btnVictory.classList.remove('hidden');
                requestAnimationFrame(draw);
            };

            sliders.forEach(s => s.addEventListener('input', () => {}));
            draw();

            btnVictory.addEventListener('click', () => {
                submitMission('day_8_kid14_wave_sync', { type: 'text', data: 'Ondas sincronizadas (Error < 5%)' });
            });
        }
    }"""
}

for mId, mCode in NEW_MISSIONS.items():
    if f'"{mId}":' in content:
        # Reemplazo multilínea más robusto
        pattern = rf'"{mId}": \{{.*?\}\n    \}(?=[,\n])'
        content = re.sub(pattern, f'"{mId}": {mCode}', content, flags=re.DOTALL)
    else:
        insertion_point = content.find('};', content.find('const MISSIONS_CONFIG = {'))
        content = content[:insertion_point] + f'    "{mId}": {mCode},\n' + content[insertion_point:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Nuevos minijuegos integrados en app.js")
