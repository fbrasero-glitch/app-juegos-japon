# Código de la Misión: day_17_sumida (Navegando el Sumida)

Este documento contiene la implementación completa de la misión del Día 17 del río Sumida. Incluye tanto la interfaz de la misión (render y envío de video) como el minijuego interactivo del canvas.

## 1. Definición de la Misión (Interficie, Render y Eventos)
Archivo: `missions_days_17_24.js`

```javascript
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
            
            btnSubmit.addEventListener('click', () => {
                if (blobId) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    if (window.launchConfetti) launchConfetti();
                    submitMission('day_17_sumida', {type:'video', data: 'Video barco Sumida'}, role, true);
                }
            });
            
            window._missionCleanup = () => {
                clearInterval(interval);
                if (stream) stream.getTracks().forEach(t => t.stop());
            };
        }
    },

```

---

## 2. Minijuego Canvas (Mecánicas de Juego, Loop y Colisiones)
Archivo: `games.js`

```javascript
    // 9. day_17_sumida: Navegando el Sumida (Deriva hidrodinámica del Himiko y Sakura petals vortex)
    setupSumida() {
        this.gameData = {
            boatX: 400,
            boatAngle: 0,
            boatVx: 0,
            progress: 0,
            crossedCount: 0,
            bridgesPassed: 0,
            lives: 3,
            maxLives: 5,
            
            // Shooting
            bullets: [],
            shootCooldown: 0,
            autoFire: true, // Auto-fire ON by default for mobile friendliness
            
            // Power-ups state
            shieldActive: false,
            doubleShotTimer: 0,
            
            // Obstacles
            obstacles: [],
            obstacleSpawnTimer: 1.0,
            
            // Power-ups in the water
            powerups: [],
            
            // Custom particles (wake foam, score text)
            customParticles: [],
            
            // Historic Sumida bridges (10 bridges instead of 5, making the game longer)
            bridges: [
                { y: -300, name: '1. Sakura Bridge (Rosa)', color: '#ff80ab', gateX: 240, gateWidth: 140, crossed: false },
                { y: -950, name: '2. Kototoi Bridge (Gris)', color: '#90a4ae', gateX: 560, gateWidth: 140, crossed: false },
                { y: -1600, name: '3. Azuma Bridge (Rojo)', color: '#ff1744', gateX: 300, gateWidth: 140, crossed: false },
                { y: -2250, name: '4. Komagata Bridge (Azul)', color: '#29b6f6', gateX: 500, gateWidth: 140, crossed: false },
                { y: -2900, name: '5. Umaya Bridge (Verde)', color: '#66bb6a', gateX: 400, gateWidth: 140, crossed: false },
                { y: -3550, name: '6. Kuramae Bridge (Amarillo)', color: '#ffca28', gateX: 260, gateWidth: 140, crossed: false },
                { y: -4200, name: '7. Kiyosu Bridge (Celeste)', color: '#00e5ff', gateX: 540, gateWidth: 140, crossed: false },
                { y: -4850, name: '8. Eitai Bridge (Azul)', color: '#3f51b5', gateX: 330, gateWidth: 140, crossed: false },
                { y: -5500, name: '9. Chuo Bridge (Blanco)', color: '#ffffff', gateX: 470, gateWidth: 140, crossed: false },
                { y: -6150, name: '10. Tsukiji Bridge (Plateado)', color: '#cfd8dc', gateX: 400, gateWidth: 140, crossed: false }
            ],
            
            // Floating sakura petals
            sakuraPetals: Array.from({length: 30}, () => ({
                x: 150 + Math.random() * 500,
                y: Math.random() * 600,
                vy: 80 + Math.random() * 40,
                rotSpeed: 0.5 + Math.random() * 1.5,
                angle: Math.random() * Math.PI * 2,
                size: 3 + Math.random() * 5
            })),
            
            waterScroll: 0,
            invulnTimer: 0
        };
        this.score = 0;
    },
    updateSumida(dt) {
        const gd = this.gameData;
        if (!gd) return;
        
        // Cooldowns and invulnerability timers
        if (gd.shootCooldown > 0) gd.shootCooldown -= dt;
        if (gd.doubleShotTimer > 0) gd.doubleShotTimer -= dt;
        if (gd.invulnTimer > 0) gd.invulnTimer -= dt;
        
        // Water scroll and engine time
        gd.waterScroll = (gd.waterScroll + dt * 150) % 600;
        
        // Steering controls (híbrido: botones táctiles en pantalla y arrastrar con ratón/toque)
        let isButtonPressed = false;
        
        if (this.mouse.isDown) {
            // Check Left Button area (bottom left)
            if (this.mouse.x >= 30 && this.mouse.x <= 130 && this.mouse.y >= 520 && this.mouse.y <= 590) {
                gd.boatX -= 320 * dt;
                gd.boatAngle = lerp(gd.boatAngle, -0.25, 0.12);
                isButtonPressed = true;
            }
            // Check Right Button area (bottom right)
            else if (this.mouse.x >= 670 && this.mouse.x <= 770 && this.mouse.y >= 520 && this.mouse.y <= 590) {
                gd.boatX += 320 * dt;
                gd.boatAngle = lerp(gd.boatAngle, 0.25, 0.12);
                isButtonPressed = true;
            }
        }
        
        if (!isButtonPressed) {
            // Standard touch/mouse dragging follow
            const targetX = this.mouse.x;
            
            // Only follow if mouse is clicked/held (on mobile) or hover (on desktop)
            const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
            if (this.mouse.isDown || !isTouchDevice) {
                // If they are not touching the bottom controls bar
                if (!(this.mouse.isDown && this.mouse.y > 510)) {
                    const dx = targetX - gd.boatX;
                    gd.boatAngle = lerp(gd.boatAngle, dx * 0.003, 0.08); // Tilt on turn
                    gd.boatVx = lerp(gd.boatVx, dx * 2.2, 0.05); // Latency drift
                    gd.boatX += gd.boatVx * dt;
                }
            } else {
                // Return boat to upright position when not steering
                gd.boatAngle = lerp(gd.boatAngle, 0, 0.1);
                gd.boatVx = lerp(gd.boatVx, 0, 0.1);
            }
        } else {
            gd.boatVx = 0; // Reset velocity drift if using steering buttons
        }

        if (gd.boatX < 180) { gd.boatX = 180; gd.boatVx = 0; }
        if (gd.boatX > 620) { gd.boatX = 620; gd.boatVx = 0; }

        // Auto-fire logic
        if (gd.autoFire && gd.shootCooldown <= 0 && this.state === 'playing') {
            if (gd.doubleShotTimer > 0) {
                gd.bullets.push({ x: gd.boatX - 15, y: 440, vy: -550 });
                gd.bullets.push({ x: gd.boatX + 15, y: 440, vy: -550 });
            } else {
                gd.bullets.push({ x: gd.boatX, y: 440, vy: -550 });
            }
            gd.shootCooldown = 0.28; // Shoot every 280ms
            if (window.playProceduralSound) window.playProceduralSound('jump');
        }

        // Spawn boat wake foam particles
        if (Math.random() < 0.3) {
            gd.customParticles.push({
                x: gd.boatX + (Math.random() - 0.5) * 12,
                y: 505,
                vx: (Math.random() - 0.5) * 15,
                vy: 120 + Math.random() * 40,
                size: 3 + Math.random() * 5,
                alpha: 0.6,
                life: 1.0,
                decay: 1.8,
                type: 'foam'
            });
        }

        // Update custom particles
        for (let i = gd.customParticles.length - 1; i >= 0; i--) {
            const p = gd.customParticles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt * (p.decay || 1);
            if (p.life <= 0) {
                gd.customParticles.splice(i, 1);
            }
        }

        // Update sakura petals (swirl when near boat)
        gd.sakuraPetals.forEach(p => {
            p.y += p.vy * dt;
            p.angle += p.rotSpeed * dt;
            
            // Swirl around the boat's tail
            if (p.y > 440 && p.y < 530 && Math.abs(p.x - gd.boatX) < 70) {
                p.x += (p.x > gd.boatX ? 60 : -60) * dt;
            }
            if (p.y > 600) {
                p.y = 0;
                p.x = 150 + Math.random() * 500;
            }
        });

        // Spawn obstacles
        gd.obstacleSpawnTimer -= dt;
        if (gd.obstacleSpawnTimer <= 0) {
            // Spawn timer gets shorter as player crosses more bridges
            gd.obstacleSpawnTimer = 1.4 + Math.random() * 1.2 - (gd.bridgesPassed * 0.1);
            if (gd.obstacleSpawnTimer < 0.7) gd.obstacleSpawnTimer = 0.7;
            
            const types = ['bomb', 'bomb', 'boat', 'airplane'];
            const type = types[Math.floor(Math.random() * types.length)];
            const x = 190 + Math.random() * (610 - 190);
            
            let obstacle = {
                id: Math.random(),
                x: x,
                y: -50,
                type: type,
                vx: 0,
                vy: 0,
                hp: 1,
                maxHp: 1,
                animTime: Math.random() * 10
            };
            
            if (type === 'bomb') {
                obstacle.vy = 90 + Math.random() * 40;
            } else if (type === 'boat') {
                obstacle.vy = 120 + Math.random() * 40;
                obstacle.hp = 3;
                obstacle.maxHp = 3;
            } else if (type === 'airplane') {
                obstacle.vy = 260 + Math.random() * 70;
                obstacle.vx = (Math.random() - 0.5) * 80; // fly diagonally
            }
            
            gd.obstacles.push(obstacle);
        }

        // Update bullets
        for (let i = gd.bullets.length - 1; i >= 0; i--) {
            const b = gd.bullets[i];
            b.y += b.vy * dt;
            
            if (b.y < -20) {
                gd.bullets.splice(i, 1);
                continue;
            }
            
            // Check collision with obstacles
            let bulletRemoved = false;
            for (let j = gd.obstacles.length - 1; j >= 0; j--) {
                const o = gd.obstacles[j];
                let collided = false;
                
                if (o.type === 'bomb') {
                    collided = Math.hypot(b.x - o.x, b.y - o.y) < 16;
                } else if (o.type === 'boat') {
                    collided = b.x > o.x - 18 && b.x < o.x + 18 && b.y > o.y - 30 && b.y < o.y + 30;
                } else if (o.type === 'airplane') {
                    collided = b.x > o.x - 20 && b.x < o.x + 20 && b.y > o.y - 20 && b.y < o.y + 20;
                }
                
                if (collided) {
                    o.hp--;
                    this.createExplosion(b.x, b.y, '#ffffff', 5, 0.4);
                    
                    if (o.hp <= 0) {
                        // Destroy obstacle
                        const color = o.type === 'bomb' ? '#ff3d00' : (o.type === 'boat' ? '#ffb300' : '#b0bec5');
                        this.createExplosion(o.x, o.y, color, 15, 1.0);
                        
                        // Drop powerup
                        this.dropSumidaPowerup(o.x, o.y);
                        
                        // Add points
                        let pts = 10;
                        if (o.type === 'boat') pts = 30;
                        if (o.type === 'airplane') pts = 20;
                        this.score += pts;
                        this.addSumidaTextParticle(o.x, o.y, `+${pts}`, '#ffd54f');
                        
                        if (window.playProceduralSound) window.playProceduralSound('error'); // Deep boom
                        gd.obstacles.splice(j, 1);
                    } else {
                        if (window.playProceduralSound) window.playProceduralSound('click');
                    }
                    
                    gd.bullets.splice(i, 1);
                    bulletRemoved = true;
                    break;
                }
            }
        }

        // Update obstacles & player collisions
        for (let i = gd.obstacles.length - 1; i >= 0; i--) {
            const o = gd.obstacles[i];
            o.y += o.vy * dt;
            o.x += o.vx * dt;
            
            // Bounce on river borders
            if (o.x < 170) { o.x = 170; o.vx = -o.vx; }
            if (o.x > 630) { o.x = 630; o.vx = -o.vx; }
            
            if (o.y > 620) {
                gd.obstacles.splice(i, 1);
                continue;
            }
            
            // Check collision with player boat (center at gd.boatX, 480)
            let hit = false;
            if (o.type === 'bomb') {
                hit = Math.hypot(gd.boatX - o.x, 480 - o.y) < 28;
            } else if (o.type === 'boat') {
                hit = Math.abs(gd.boatX - o.x) < 32 && Math.abs(480 - o.y) < 45;
            } else if (o.type === 'airplane') {
                hit = Math.hypot(gd.boatX - o.x, 480 - o.y) < 32;
            }
            
            if (hit) {
                // Destroy obstacle
                this.createExplosion(o.x, o.y, '#ff3d00', 15, 1.1);
                gd.obstacles.splice(i, 1);
                
                // Damage player
                if (gd.invulnTimer <= 0) {
                    if (gd.shieldActive) {
                        gd.shieldActive = false;
                        gd.invulnTimer = 1.0;
                        this.triggerShake(12);
                        this.addSumidaTextParticle(gd.boatX, 430, "¡Escudo Roto!", "#00e5ff");
                        if (window.playProceduralSound) window.playProceduralSound('error');
                        this.createExplosion(gd.boatX, 480, '#00e5ff', 20, 1.1);
                    } else {
                        gd.lives--;
                        gd.invulnTimer = 1.5;
                        this.triggerShake(20);
                        this.addSumidaTextParticle(gd.boatX, 430, "-1 Vida", "#ff1744");
                        if (window.playProceduralSound) window.playProceduralSound('damage');
                        this.createExplosion(gd.boatX, 480, '#ff1744', 30, 1.4);
                        
                        if (gd.lives <= 0) {
                            this.gameOver();
                        }
                    }
                }
            }
        }

        // Update powerups
        for (let i = gd.powerups.length - 1; i >= 0; i--) {
            const p = gd.powerups[i];
            p.y += p.vy * dt;
            p.pulseTime += dt;
            
            if (p.y > 620) {
                gd.powerups.splice(i, 1);
                continue;
            }
            
            if (Math.hypot(gd.boatX - p.x, 480 - p.y) < 30) {
                // Collected!
                if (p.type === 'shield') {
                    gd.shieldActive = true;
                    this.addSumidaTextParticle(p.x, p.y, "+ESCUDO", "#00e5ff");
                } else if (p.type === 'double') {
                    gd.doubleShotTimer = 6.0;
                    this.addSumidaTextParticle(p.x, p.y, "+DOBLE DISPARO", "#ff9100");
                } else if (p.type === 'heart') {
                    gd.lives = Math.min(gd.maxLives, gd.lives + 1);
                    this.addSumidaTextParticle(p.x, p.y, "+1 VIDA", "#ff4081");
                }
                
                if (window.playProceduralSound) window.playProceduralSound('collect');
                this.createExplosion(p.x, p.y, p.type === 'shield' ? '#00e5ff' : (p.type === 'double' ? '#ff9100' : '#ff4081'), 12, 0.8);
                gd.powerups.splice(i, 1);
            }
        }

        // Update bridges
        gd.bridges.forEach(b => {
            b.y += dt * 170;
            
            if (b.y > 440 && !b.crossed) {
                b.crossed = true;
                gd.bridgesPassed++;
                
                const inGate = (gd.boatX >= b.gateX - b.gateWidth / 2) && (gd.boatX <= b.gateX + b.gateWidth / 2);
                
                if (inGate) {
                    gd.crossedCount++;
                    this.score = Math.round((gd.crossedCount / 10) * 100);
                    this.addSumidaTextParticle(gd.boatX, 420, "¡Excelente!", "#00e676");
                    if (window.playProceduralSound) window.playProceduralSound('success');
                } else {
                    if (gd.invulnTimer <= 0) {
                        if (gd.shieldActive) {
                            gd.shieldActive = false;
                            gd.invulnTimer = 1.2;
                            this.triggerShake(15);
                            this.addSumidaTextParticle(gd.boatX, 420, "¡Escudo Roto!", "#00e5ff");
                            if (window.playProceduralSound) window.playProceduralSound('error');
                            this.createExplosion(gd.boatX, 480, '#00e5ff', 25, 1.2);
                        } else {
                            gd.lives--;
                            gd.invulnTimer = 1.8;
                            this.triggerShake(25);
                            this.addSumidaTextParticle(gd.boatX, 420, "-1 Vida", "#ff1744");
                            if (window.playProceduralSound) window.playProceduralSound('damage');
                            this.createExplosion(gd.boatX, 480, '#ff1744', 30, 1.4);
                            
                            if (gd.lives <= 0) {
                                this.gameOver();
                                return;
                            }
                        }
                    }
                }
                
                // Win check: when all 10 bridges have passed, win if alive
                if (gd.bridgesPassed >= 10 && gd.lives > 0) {
                    setTimeout(() => this.win(), 800);
                }
            }
        });
    },
    drawSumida() {
        const ctx = this.ctx;
        const gd = this.gameData;
        if (!gd) return;

        // River water background
        ctx.fillStyle = '#00838f';
        ctx.fillRect(0, 0, 800, 600);

        // Water current wave lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 7; i++) {
            const y = (gd.waterScroll + i * 100) % 600;
            ctx.beginPath();
            ctx.moveTo(150, y);
            ctx.lineTo(650, y);
            ctx.stroke();
        }

        // River banks (concrete shores)
        ctx.fillStyle = '#78909c';
        ctx.fillRect(0, 0, 150, 600);
        ctx.fillRect(650, 0, 150, 600);
        
        // Bank walkways lines
        ctx.strokeStyle = '#546e7a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(150, 0); ctx.lineTo(150, 600);
        ctx.moveTo(650, 0); ctx.lineTo(650, 600);
        ctx.stroke();

        // Draw scrolling cherry blossom trees on the banks
        const drawTree = (ctx, tx, ty, animTime) => {
            ctx.save();
            ctx.shadowBlur = 0;
            
            // Trunk
            ctx.fillStyle = '#5d4037';
            ctx.beginPath();
            ctx.moveTo(tx - 6, ty + 40);
            ctx.lineTo(tx + 6, ty + 40);
            ctx.lineTo(tx + 4, ty - 10);
            ctx.lineTo(tx - 4, ty - 10);
            ctx.closePath();
            ctx.fill();
            
            // Branches
            ctx.strokeStyle = '#5d4037';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx - 15, ty - 20);
            ctx.moveTo(tx, ty - 5);
            ctx.lineTo(tx + 18, ty - 25);
            ctx.stroke();
            
            // Foliage (Sakura clouds)
            const wobble = Math.sin(animTime * 1.5) * 3;
            const foliage = [
                { dx: 0, dy: -25, r: 24, c: '#ff80ab' },
                { dx: -15, dy: -18, r: 20, c: '#f8bbd0' },
                { dx: 15, dy: -22, r: 22, c: '#f8bbd0' },
                { dx: -8, dy: -32, r: 18, c: '#ff4081' },
                { dx: 8, dy: -30, r: 20, c: '#ff80ab' }
            ];
            
            foliage.forEach(f => {
                ctx.fillStyle = f.c;
                ctx.beginPath();
                ctx.arc(tx + f.dx + wobble, ty + f.dy, f.r, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.restore();
        };

        for (let i = 0; i < 4; i++) {
            const y = (i * 200 + gd.waterScroll) % 700 - 80;
            drawTree(ctx, 60, y, this.gameTime + i);
            drawTree(ctx, 740, y, this.gameTime + i + 2.5);
        }

        // Bridges
        gd.bridges.forEach(b => {
            // Support pillars on shore
            ctx.fillStyle = '#455a64';
            ctx.fillRect(115, b.y, 35, 50);
            ctx.fillRect(650, b.y, 35, 50);
            
            // Bridge deck (Left and Right parts leaving the gate passage empty)
            ctx.fillStyle = b.color;
            ctx.fillRect(150, b.y + 10, b.gateX - b.gateWidth / 2 - 150, 30);
            ctx.fillRect(b.gateX + b.gateWidth / 2, b.y + 10, 650 - (b.gateX + b.gateWidth / 2), 30);
            
            // Steel arch above bridge spanning the entire width
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(400, b.y + 65, 255, Math.PI + 0.3, Math.PI * 2 - 0.3);
            ctx.stroke();
            
            // Vertical hanger cables
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = 1.5;
            for (let x = 175; x < 625; x += 30) {
                if (x < b.gateX - b.gateWidth / 2 || x > b.gateX + b.gateWidth / 2) {
                    const dist = Math.abs(400 - x);
                    const archY = b.y - 30 + (dist * dist) * 0.00085;
                    if (archY < b.y + 10) {
                        ctx.beginPath();
                        ctx.moveTo(x, b.y + 10);
                        ctx.lineTo(x, archY);
                        ctx.stroke();
                    }
                }
            }

            // Glowing navigation passage borders
            ctx.save();
            ctx.strokeStyle = '#00ff99';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00ff99';
            ctx.shadowBlur = 8;
            
            ctx.beginPath();
            ctx.moveTo(b.gateX - b.gateWidth / 2, b.y - 10);
            ctx.lineTo(b.gateX - b.gateWidth / 2, b.y + 60);
            ctx.moveTo(b.gateX + b.gateWidth / 2, b.y - 10);
            ctx.lineTo(b.gateX + b.gateWidth / 2, b.y + 60);
            ctx.stroke();
            
            // Pulsing green navigation arrows
            const arrowPulse = Math.floor(this.gameTime * 7) % 3;
            ctx.fillStyle = '#00ff99';
            for (let i = 0; i < 2; i++) {
                const arrY = b.y + i * 18 - 8 + arrowPulse;
                ctx.beginPath();
                ctx.moveTo(b.gateX - 8, arrY);
                ctx.lineTo(b.gateX, arrY + 8);
                ctx.lineTo(b.gateX + 8, arrY);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();

            // Bridge labels
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 4;
            ctx.fillText(b.name, 400, b.y + 30);
            ctx.shadowBlur = 0;
        });

        // Sakura petals floating on water
        ctx.fillStyle = '#ff80ab';
        gd.sakuraPetals.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw custom particles (foam, text)
        gd.customParticles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha * p.life;
            if (p.type === 'foam') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (1.3 - p.life * 0.4), 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'text') {
                ctx.fillStyle = p.color || '#ffffff';
                ctx.font = `bold ${p.size}px Outfit, sans-serif`;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 5;
                ctx.textAlign = 'center';
                ctx.fillText(p.text, p.x, p.y);
            }
            ctx.restore();
        });

        // Bullets (Laser beams)
        gd.bullets.forEach(b => {
            ctx.save();
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x, b.y + 15);
            ctx.stroke();
            
            // White core
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + 2);
            ctx.lineTo(b.x, b.y + 13);
            ctx.stroke();
            ctx.restore();
        });

        // Obstacles
        gd.obstacles.forEach(o => {
            if (o.type === 'bomb') {
                // Floating naval mine
                ctx.save();
                ctx.translate(o.x, o.y);
                
                // Spikes
                ctx.strokeStyle = '#546e7a';
                ctx.lineWidth = 2.5;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(a) * 17, Math.sin(a) * 17);
                    ctx.stroke();
                    
                    // Spike tips
                    ctx.fillStyle = '#ff1744';
                    ctx.beginPath();
                    ctx.arc(Math.cos(a) * 17, Math.sin(a) * 17, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Mine body
                ctx.fillStyle = '#37474f';
                ctx.strokeStyle = '#212121';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 11, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                
                // Glowing pulsing LED
                const flash = Math.sin(this.gameTime * 14) > 0;
                ctx.fillStyle = flash ? '#ff1744' : '#37000b';
                ctx.shadowColor = '#ff1744';
                ctx.shadowBlur = flash ? 8 : 0;
                ctx.beginPath();
                ctx.arc(0, 0, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
            } else if (o.type === 'boat') {
                // Traditional Yakatabune pleasure boat
                ctx.save();
                ctx.translate(o.x, o.y);
                
                // Foam wake (on top/rear since it bajan)
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                ctx.arc(0, -32, 10 + Math.sin(this.gameTime * 10) * 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Wooden hull
                ctx.fillStyle = '#8d6e63';
                ctx.strokeStyle = '#3e2723';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(0, 32); // Pointy bow pointing down
                ctx.lineTo(-14, 20);
                ctx.lineTo(-14, -28); // stern
                ctx.lineTo(14, -28);
                ctx.lineTo(14, 20);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                
                // Cabin structure
                ctx.fillStyle = '#4e342e';
                ctx.fillRect(-10, -22, 20, 38);
                
                // Cabin windows/yellow lanterns rows on sides
                for (let ly = -18; ly <= 10; ly += 7) {
                    ctx.fillStyle = '#ffd54f';
                    ctx.shadowColor = '#ffd54f';
                    ctx.shadowBlur = 4;
                    ctx.beginPath();
                    ctx.arc(-11, ly, 2.5, 0, Math.PI * 2);
                    ctx.arc(11, ly, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.shadowBlur = 0;
                
                // Boss HP bar (only if damaged)
                if (o.hp < o.maxHp) {
                    ctx.fillStyle = 'rgba(0,0,0,0.5)';
                    ctx.fillRect(-15, -36, 30, 4);
                    ctx.fillStyle = '#00e676';
                    ctx.fillRect(-15, -36, 30 * (o.hp / o.maxHp), 4);
                }
                ctx.restore();
                
            } else if (o.type === 'airplane') {
                // Overhead commercial plane
                // 1. Water shadow (drawn offset)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
                ctx.save();
                ctx.translate(o.x, o.y + 45);
                ctx.beginPath();
                // Fuselage shadow
                ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
                // Wings shadow
                ctx.ellipse(0, 0, 6, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                // 2. High altitude plane fuselage
                ctx.save();
                ctx.translate(o.x, o.y);
                
                // Wings
                ctx.fillStyle = '#b0bec5';
                ctx.strokeStyle = '#455a64';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(0, 0, 5, 23, 0, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                
                // Fuselage body
                ctx.fillStyle = '#eceff1';
                ctx.strokeStyle = '#455a64';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(0, 0, 24, 7, 0, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                
                // Tail wings
                ctx.beginPath();
                ctx.ellipse(-18, 0, 3, 9, 0, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                
                // Blinking wingtip nav lights
                const flash = Math.floor(this.gameTime * 8) % 2 === 0;
                if (flash) {
                    // Left wing (port) red light
                    ctx.fillStyle = '#ff1744';
                    ctx.beginPath(); ctx.arc(0, -22, 3, 0, Math.PI * 2); ctx.fill();
                    // Right wing (starboard) green light
                    ctx.fillStyle = '#00e676';
                    ctx.beginPath(); ctx.arc(0, 22, 3, 0, Math.PI * 2); ctx.fill();
                }
                ctx.restore();
            }
        });

        // Draw Power-ups
        gd.powerups.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            
            // Neon pulse outer circle
            ctx.strokeStyle = p.type === 'shield' ? '#00e5ff' : (p.type === 'double' ? '#ff9100' : '#ff4081');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 16 + Math.sin(p.pulseTime * 8) * 3, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner circle
            ctx.fillStyle = 'rgba(33, 33, 33, 0.85)';
            ctx.strokeStyle = p.type === 'shield' ? '#00e5ff' : (p.type === 'double' ? '#ff9100' : '#ff4081');
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            
            // Icon
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let symbol = '🛡️';
            if (p.type === 'double') symbol = '⚡';
            if (p.type === 'heart') symbol = '❤️';
            ctx.fillText(symbol, 0, 0);
            ctx.restore();
        });

        // Draw Boat Himiko
        ctx.save();
        ctx.translate(gd.boatX, 480);
        ctx.rotate(gd.boatAngle);
        
        // Thruster flame
        if (gd.lives > 0) {
            const flameSize = 14 + Math.sin(this.gameTime * 22) * 7;
            ctx.fillStyle = '#00e5ff';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(-7, 30);
            ctx.lineTo(0, 30 + flameSize);
            ctx.lineTo(7, 30);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(-3, 30);
            ctx.lineTo(0, 30 + flameSize * 0.6);
            ctx.lineTo(3, 30);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Side stabilizers (wings)
        ctx.fillStyle = '#9e9e9e';
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-16, 5);
        ctx.lineTo(-25, 20);
        ctx.lineTo(-16, 25);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(16, 5);
        ctx.lineTo(25, 20);
        ctx.lineTo(16, 25);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Main metal hull
        ctx.fillStyle = '#e0e0e0';
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -35); // Pointy nose
        ctx.bezierCurveTo(-16, -20, -16, 15, -16, 30); // Left side
        ctx.lineTo(16, 30); // Rear
        ctx.bezierCurveTo(16, 15, 16, -20, 0, -35); // Right side
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Detail panel lines
        ctx.strokeStyle = '#9e9e9e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(0, -10);
        ctx.moveTo(-16, 10);
        ctx.lineTo(16, 10);
        ctx.stroke();

        // Canopy windows (Green emerald glass)
        ctx.fillStyle = 'rgba(0, 230, 118, 0.35)';
        ctx.strokeStyle = '#00e676';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.bezierCurveTo(-10, -8, -10, 12, -10, 24);
        ctx.lineTo(10, 24);
        ctx.bezierCurveTo(10, 12, 10, -8, 0, -18);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Reflection highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-4, 0, 2, 12, Math.PI / 12, 0, Math.PI * 2);
        ctx.fill();

        // Shield bubble
        if (gd.shieldActive) {
            ctx.restore();
            ctx.save();
            ctx.translate(gd.boatX, 480);
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 3 + Math.sin(this.gameTime * 6) * 0.8;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, 42 + Math.sin(this.gameTime * 8) * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.translate(gd.boatX, 480);
            ctx.rotate(gd.boatAngle);
        }
        
        // Flash red when invulnerable
        if (gd.invulnTimer > 0 && Math.floor(this.gameTime * 15) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 23, 73, 0.35)';
            ctx.beginPath();
            ctx.moveTo(0, -35);
            ctx.bezierCurveTo(-16, -20, -16, 15, -16, 30);
            ctx.lineTo(16, 30);
            ctx.bezierCurveTo(16, 15, 16, -20, 0, -35);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // HUD Layout
        // 1. Score
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(`Puntos: ${this.score}`, 180, 35);
        
        // 2. Upcoming Bridge
        if (gd.bridgesPassed < 10) {
            const nextB = gd.bridges[gd.bridgesPassed];
            ctx.fillStyle = '#ffd54f';
            ctx.font = 'bold 16px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`Siguiente: ${nextB.name}`, 400, 35);
            
            // Double shot timer remaining
            if (gd.doubleShotTimer > 0) {
                ctx.fillStyle = '#ff9100';
                ctx.font = '14px Outfit, sans-serif';
                ctx.fillText(`Doble Disparo: ${gd.doubleShotTimer.toFixed(1)}s`, 400, 500);
            }
        } else {
            ctx.fillStyle = '#00ff99';
            ctx.font = 'bold 16px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("¡Ruta Completada!", 400, 35);
        }
        
        // 3. Lives hearts (top right)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText("Vidas: ", 700, 34);
        for (let i = 0; i < gd.maxLives; i++) {
            ctx.fillStyle = i < gd.lives ? '#ff4081' : 'rgba(255, 255, 255, 0.2)';
            ctx.font = '18px Outfit, sans-serif';
            ctx.fillText("❤️", 715 + i * 22, 36);
        }
        ctx.shadowBlur = 0;

        // 4. Progression Timeline on Left Bank
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(40, 130);
        ctx.lineTo(40, 470);
        ctx.stroke();
        
        const shortNames = ['Sakura', 'Kototoi', 'Azuma', 'Komagata', 'Umaya', 'Kuramae', 'Kiyosu', 'Eitai', 'Chuo', 'Tsukiji'];
        for (let i = 0; i < 10; i++) {
            const tickY = 130 + i * 37.7;
            ctx.fillStyle = gd.bridgesPassed > i ? '#00ff99' : '#ffffff';
            ctx.beginPath();
            ctx.arc(40, tickY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw name next to tick only for current/past bridges to avoid cluttering
            if (i === gd.bridgesPassed || i === gd.bridgesPassed - 1 || i === gd.bridgesPassed + 1) {
                ctx.fillStyle = gd.bridgesPassed > i ? '#00ff99' : 'rgba(255, 255, 255, 0.6)';
                ctx.font = '9px Outfit, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(shortNames[i], 52, tickY + 3);
            }
        }
        
        let timelineFrac = 0;
        if (gd.bridgesPassed < 10) {
            const nextBridge = gd.bridges[gd.bridgesPassed];
            const startY = -300 - gd.bridgesPassed * 650;
            const range = 440 - startY;
            const currentTravel = nextBridge.y - startY;
            timelineFrac = clamp(currentTravel / range, 0, 1.0);
        }
        
        const playerTimelineY = 130 + gd.bridgesPassed * 37.7 + (gd.bridgesPassed < 10 ? timelineFrac * 37.7 : 0);
        ctx.fillStyle = '#ff9100';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(40, clamp(playerTimelineY, 130, 470), 6, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // 5. Draw On-Screen Mobile Controls Panel (at the bottom)
        ctx.save();
        ctx.shadowBlur = 0;
        
        // Draw controls bar background (dark translucent grey panel)
        ctx.fillStyle = 'rgba(20, 26, 30, 0.85)';
        ctx.strokeStyle = '#37474f';
        ctx.lineWidth = 2;
        ctx.fillRect(0, 520, 800, 80);
        ctx.beginPath();
        ctx.moveTo(0, 520);
        ctx.lineTo(800, 520);
        ctx.stroke();
        
        // Helper to draw a glowing button
        const drawButton = (x, y, w, h, label, active, isPress) => {
            ctx.save();
            ctx.fillStyle = isPress ? 'rgba(0, 229, 255, 0.25)' : 'rgba(38, 50, 56, 0.8)';
            ctx.strokeStyle = active ? '#00e5ff' : '#546e7a';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = active ? '#00e5ff' : 'transparent';
            ctx.shadowBlur = active ? 6 : 0;
            
            // Rounded button
            ctx.beginPath();
            ctx.arc(x + 10, y + 10, 10, Math.PI, Math.PI * 1.5);
            ctx.arc(x + w - 10, y + 10, 10, Math.PI * 1.5, 0);
            ctx.arc(x + w - 10, y + h - 10, 10, 0, Math.PI * 0.5);
            ctx.arc(x + 10, y + h - 10, 10, Math.PI * 0.5, Math.PI);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            
            ctx.fillStyle = active ? '#ffffff' : '#b0bec5';
            ctx.font = 'bold 16px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x + w / 2, y + h / 2);
            ctx.restore();
        };

        const mouseIsDown = this.mouse.isDown;
        const mx = this.mouse.x;
        const my = this.mouse.y;

        // Button States based on mouse coordinates when down
        const isLeftPress = mouseIsDown && mx >= 30 && mx <= 130 && my >= 520 && my <= 590;
        const isRightPress = mouseIsDown && mx >= 670 && mx <= 770 && my >= 520 && my <= 590;
        const isAutoPress = mouseIsDown && mx >= 330 && mx <= 470 && my >= 520 && my <= 590;

        // Draw Left Button
        drawButton(30, 530, 100, 55, '◀ IZQ', true, isLeftPress);
        
        // Draw Right Button
        drawButton(670, 530, 100, 55, 'DER ▶', true, isRightPress);
        
        // Draw Auto-Fire Toggle Button
        const autoLabel = gd.autoFire ? 'AUTO: SÍ' : 'AUTO: NO';
        drawButton(330, 530, 140, 55, autoLabel, gd.autoFire, isAutoPress);
        
        // Draw helper label for controls
        ctx.fillStyle = '#90a4ae';
        ctx.font = '11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Controles duales: Usa los botones de abajo o arrastra directamente en el río.', 400, 592);
        ctx.restore();
    },
    inputSumidaPress(x, y) {
        const gd = this.gameData;
        if (!gd || gd.lives <= 0 || this.state !== 'playing') return;
        
        // 1. Toggle Auto-Fire button check
        if (x >= 330 && x <= 470 && y >= 520 && y <= 590) {
            gd.autoFire = !gd.autoFire;
            if (window.playProceduralSound) window.playProceduralSound('click');
            return;
        }
        
        // 2. Ignore steer button areas (they are handled in updateSumida continuously)
        if ((x >= 30 && x <= 130 && y >= 520 && y <= 590) || (x >= 670 && x <= 770 && y >= 520 && y <= 590)) {
            return;
        }
        
        // 3. Manual firing (only if Auto-Fire is OFF)
        if (!gd.autoFire && gd.shootCooldown <= 0) {
            if (gd.doubleShotTimer > 0) {
                gd.bullets.push({ x: gd.boatX - 15, y: 440, vy: -550 });
                gd.bullets.push({ x: gd.boatX + 15, y: 440, vy: -550 });
            } else {
                gd.bullets.push({ x: gd.boatX, y: 440, vy: -550 });
            }
            gd.shootCooldown = 0.22;
            if (window.playProceduralSound) window.playProceduralSound('jump');
        }
    },
    dropSumidaPowerup(x, y) {
        const gd = this.gameData;
        if (!gd || Math.random() > 0.25) return;
        
        const types = ['shield', 'double', 'heart'];
        const weights = [0.5, 0.35, 0.15];
        
        const rand = Math.random();
        let type = 'shield';
        if (rand < weights[0]) {
            type = 'shield';
        } else if (rand < weights[0] + weights[1]) {
            type = 'double';
        } else {
            type = 'heart';
        }
        
        gd.powerups.push({
            x: x,
            y: y,
            vy: 110,
            type: type,
            pulseTime: 0
        });
    },
    addSumidaTextParticle(x, y, text, color) {
        const gd = this.gameData;
        if (!gd) return;
        
        gd.customParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 20,
            vy: -70 - Math.random() * 30,
            text: text,
            color: color,
            alpha: 1.0,
            size: 15,
            life: 1.0,
            decay: 1.6,
            type: 'text'
        });
    },


```
