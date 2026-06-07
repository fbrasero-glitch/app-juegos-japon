import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Definición de misiones (Mezcla de interactivas y estándar)
# He actualizado las misiones de Kioto con la lógica de juego avanzada
MISSIONS = {
    # DÍA 1
    "day_1_fam_bet": """{
        day: 1, title: "Apuesta del Aterrizaje", role: "both", xp: 25, location: "Avión / Aeropuerto",
        render: () => `
            <p class="mission-desc">Escribe 3 locuras o cosas que crees que vas a ver en Japón.</p>
            <input type="text" id="bet-1" placeholder="Predicción 1..." style="width:100%; margin-bottom:10px;">
            <input type="text" id="bet-2" placeholder="Predicción 2..." style="width:100%; margin-bottom:10px;">
            <input type="text" id="bet-3" placeholder="Predicción 3..." style="width:100%; margin-bottom:10px;">
            <button id="btn-submit" class="btn-primary" style="width:100%">Sellar Predicciones</button>
        `,
        attachEvents: (role) => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const b1 = document.getElementById('bet-1').value;
                const b2 = document.getElementById('bet-2').value;
                const b3 = document.getElementById('bet-3').value;
                if(b1 && b2 && b3) submitMission('day_1_fam_bet', { type: 'text', data: `${b1}, ${b2}, ${b3}` }, role, true);
            });
        }
    }""",
    "day_1_kid9_bingo": """{
        day: 1, title: "Bingo Aeroportuario", role: "kid9", xp: 15, location: "Aeropuerto",
        render: () => `
            <p class="mission-desc">Encuentra 4 objetos en el aeropuerto:</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button class="btn-secondary bingo-item">🎎 Muñeca</button>
                <button class="btn-secondary bingo-item">🍵 Té Verde</button>
                <button class="btn-secondary bingo-item">🚅 Tren</button>
                <button class="btn-secondary bingo-item">🍣 Sushi</button>
                <button class="btn-secondary bingo-item">🏮 Farolillo</button>
                <button class="btn-secondary bingo-item">🐱 Maneki-neko</button>
            </div>
            <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">¡Bingo!</button>
        `,
        attachEvents: () => {
            let count = 0;
            document.querySelectorAll('.bingo-item').forEach(b => {
                b.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    count = document.querySelectorAll('.bingo-item.selected').length;
                    if(count >= 4) document.getElementById('btn-submit').classList.remove('hidden');
                });
            });
            document.getElementById('btn-submit').addEventListener('click', () => submitMission('day_1_kid9_bingo', { type: 'text', data: 'Bingo completado' }));
        }
    }""",
    "day_1_kid14_nav": """{
        day: 1, title: "Navegante de Altura", role: "kid14", xp: 15, location: "Avión",
        render: () => `
            <p class="mission-desc">Anota la velocidad y usa la brújula.</p>
            <div id="compass-val" style="font-size:2rem; text-align:center; font-weight:bold;">0°</div>
            <input type="number" id="plane-speed" placeholder="Velocidad (km/h)" style="width:100%; margin-top:15px;">
            <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar</button>
        `,
        attachEvents: () => {
            const val = document.getElementById('compass-val');
            window.addEventListener('deviceorientation', (e) => { if(e.alpha) val.innerText = Math.round(e.alpha) + "°"; });
            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_1_kid14_nav', { type: 'text', data: "Vel: " + document.getElementById('plane-speed').value + " km/h" });
            });
        }
    }""",
    "day_1_kid14_jetlag": """{
        day: 1, title: "Reloj Samurái del Sueño", role: "kid14", xp: 15, location: "Avión / Hotel",
        render: () => `
            <p class="mission-desc">Calcula tu hora de dormir (+7h desde España).</p>
            <input type="time" id="jl-time" style="width:100%; padding:15px;">
            <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_1_kid14_jetlag', { type: 'text', data: document.getElementById('jl-time').value });
            });
        }
    }""",

    # DÍA 2
    "day_2_kid9_yokai": """{
        day: 2, title: "Caza del Yōkai Oficial", role: "kid9", xp: 20, location: "Calle",
        render: () => `
            <p class="mission-desc">Foto de mascota o cartel manga.</p>
            <input type="file" id="cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('cam').click()" class="btn-secondary">📸 Foto</button>
        `,
        attachEvents: () => {
            document.getElementById('cam').addEventListener('change', async (e) => {
                if(e.target.files[0]) {
                    const p = await compressImage(e.target.files[0]);
                    const id = 'photo_'+Date.now();
                    savePhotoToDB(id, p).then(() => submitMission('day_2_kid9_yokai', { type: 'photo', data: id }));
                }
            });
        }
    }""",
    "any_eki_stamp": """{
        day: 2, title: "Coleccionista de Eki-Stamps", role: "both", xp: 15, location: "Estaciones",
        render: () => `<p class="mission-desc">Busca el sello de la estación.</p><input type="file" id="cam" accept="image/*" capture="environment">`,
        attachEvents: () => {
            document.getElementById('cam').addEventListener('change', async (e) => {
                if(e.target.files[0]) {
                    const p = await compressImage(e.target.files[0]);
                    savePhotoToDB('st_'+Date.now(), p).then(() => submitMission('any_eki_stamp', { type: 'text', data: 'Sello subido' }));
                }
            });
        }
    }""",
    "day_2_kid14_protocol": """{
        day: 2, title: "Protocolo Shōgun", role: "kid14", xp: 20, location: "Metro / Tren",
        render: () => `<p class="mission-desc">Guía a la familia al hotel.</p><button id="btn-done" class="btn-primary">Llegamos</button>`,
        attachEvents: () => {
            document.getElementById('btn-done').addEventListener('click', () => submitMission('day_2_kid14_protocol', { type: 'text', data: 'Llegada guiada' }));
        }
    }""",

    # DÍA 3
    "day_3_kid14_architect": """{
        day: 3, title: "Arquitecto del Castillo", role: "kid14", xp: 20, location: "Castillo Osaka",
        render: () => `<p class="mission-desc">Mide la distancia con Google Maps Satélite.</p><input type="number" id="dist" placeholder="Metros..."><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_3_kid14_architect', { type: 'number', data: document.getElementById('dist').value }));
        }
    }""",
    "day_3_kid14_audio": """{
        day: 3, title: "Jingle de Estación", role: "kid14", xp: 15, location: "Estación",
        render: () => `<p class="mission-desc">Graba el jingle del tren.</p><button id="btn-rec" class="btn-secondary">🔴 Grabar</button>`,
        attachEvents: () => {
            document.getElementById('btn-rec').addEventListener('click', () => submitMission('day_3_kid14_audio', { type: 'text', data: 'Audio grabado' }));
        }
    }""",
    "day_3_kid14_filtro": """{
        day: 3, title: "Filtro Cyberpunk", role: "kid14", xp: 10, location: "Umeda Sky",
        render: () => `<p class="mission-desc">Foto con filtro.</p><input type="file" id="cam" accept="image/*">`,
        attachEvents: () => {
            document.getElementById('cam').addEventListener('change', () => submitMission('day_3_kid14_filtro', { type: 'text', data: 'Foto enviada' }));
        }
    }""",
    "day_3_kid9_glico": """{
        day: 3, title: "Glico Man", role: "kid9", xp: 10, location: "Dotonbori",
        render: () => `<p class="mission-desc">Imita al Glico Man.</p><button id="btn-cam" class="btn-secondary">📸 Selfie</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_3_kid9_glico', { type: 'text', data: 'Glico Kid' }));
        }
    }""",
    "day_3_kid9_ninja": """{
        day: 3, title: "Ninja de las Sombras", role: "kid9", xp: 10, location: "Jardines",
        render: () => `<p class="mission-desc">Foto de tu sombra ninja.</p><button id="btn-cam" class="btn-secondary">📸 Sombra</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_3_kid9_ninja', { type: 'text', data: 'Sombra Ninja' }));
        }
    }""",
    "day_3_kid9_puente": """{
        day: 3, title: "Puente del Castillo", role: "kid9", xp: 15, location: "Castillo",
        render: () => `<p class="mission-desc">Cuenta los pasos.</p><input type="number" id="pasos"><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_3_kid9_puente', { type: 'number', data: document.getElementById('pasos').value }));
        }
    }""",
    "day_3_kid14_tribunal": """{
        day: 3, title: "Tribunal del Cartel", role: "kid14", xp: 15, location: "Dotonbori",
        render: () => `<p class="mission-desc">Foto del cartel más raro.</p><button id="btn-cam" class="btn-secondary">📸 Cartel</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_3_kid14_tribunal', { type: 'text', data: 'Cartel evaluado' }));
        }
    }""",
    "day_3_kid9_umeda": """{
        day: 3, title: "Umeda Sky (Superhéroe)", role: "kid9", xp: 10, location: "Umeda Sky",
        render: () => `<p class="mission-desc">Sujeta el edificio.</p><button id="btn-cam" class="btn-secondary">📸 Foto</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_3_kid9_umeda', { type: 'text', data: 'Sujetando Umeda' }));
        }
    }""",

    # DÍA 4
    "day_4_kid9_bestiario": """{
        day: 4, title: "Bestiario Kuromon", role: "kid9", xp: 15, location: "Kuromon",
        render: () => `<p class="mission-desc">Animal marino alienígena.</p><input type="text" id="name" placeholder="Nombre..."><button id="btn" class="btn-primary">Bautizar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid9_bestiario', { type: 'text', data: document.getElementById('name').value }));
        }
    }""",
    "day_4_kid14_cuchillo": """{
        day: 4, title: "El Cuchillo Samurái", role: "kid14", xp: 10, location: "Doguyasuji",
        render: () => `<p class="mission-desc">Elige cuchillo y plato.</p><input type="text" id="p" placeholder="Plato..."><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid14_cuchillo', { type: 'text', data: document.getElementById('p').value }));
        }
    }""",
    "day_4_kid14_conbini": """{
        day: 4, title: "Reto 500 Yenes", role: "kid14", xp: 15, location: "Lawson",
        render: () => `<p class="mission-desc">Gasta max 500¥.</p><input type="number" id="v" placeholder="Total..."><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid14_conbini', { type: 'number', data: document.getElementById('v').value }));
        }
    }""",
    "day_4_kid14_isshinji": """{
        day: 4, title: "Secreto Isshinji", role: "kid14", xp: 15, location: "Isshinji",
        render: () => `<p class="mission-desc">¿De qué están hechas las estatuas?</p><input type="text" id="ans"><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid14_isshinji', { type: 'text', data: document.getElementById('ans').value }));
        }
    }""",
    "day_4_kid9_gachapon": """{
        day: 4, title: "Gachapon", role: "kid9", xp: 10, location: "Tiendas",
        render: () => `<p class="mission-desc">Prueba suerte.</p><button id="btn" class="btn-primary">¡Girar!</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_4_kid9_gachapon', { type: 'text', data: 'Gachapon obtenido' }));
        }
    }""",
    "day_4_fam_yakiniku": """{
        day: 4, title: "Maestro Yakiniku", role: "both", xp: 20, location: "Restaurante",
        render: () => `<p class="mission-desc">Trabajo en equipo.</p><button id="btn" class="btn-primary">Comer!</button>`,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_4_fam_yakiniku', { type: 'text', data: 'OK' }, role, true));
        }
    }""",
    "day_4_kid14_meditacion": """{
        day: 4, title: "Meditación Zen", role: "kid14", xp: 15, location: "Namba Parks",
        render: () => `<p class="mission-desc">Foto sin gente.</p><button id="btn-cam" class="btn-secondary">📸 Foto</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_4_kid14_meditacion', { type: 'text', data: 'Meditación' }));
        }
    }""",
    "day_4_kid9_vending": """{
        day: 4, title: "Ruleta Vending", role: "kid9", xp: 15, location: "Calle",
        render: () => `<p class="mission-desc">Busca la bebida.</p><button id="btn-cam" class="btn-secondary">📸 Foto Bebida</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_4_kid9_vending', { type: 'text', data: 'Bebida encontrada' }));
        }
    }""",
    "day_4_fam_kuromon": """{
        day: 4, title: "Subasta Kuromon", role: "both", xp: 20, location: "Kuromon",
        render: () => `<p class="mission-desc">Menú ideal 1000¥.</p><textarea id="t"></textarea><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: (role) => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_4_fam_kuromon', { type: 'text', data: document.getElementById('t').value }, role, true));
        }
    }""",

    # DÍA 5
    "day_5_kid14_kanji": """{
        day: 5, title: "Caligrafía Zen", role: "kid14", xp: 15, location: "Nara",
        render: () => `<p class="mission-desc">Dibuja Kanji.</p><canvas id="c" style="border:1px solid #ccc; width:100%; height:200px;"></canvas><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid14_kanji', { type: 'text', data: 'Kanji enviado' }));
        }
    }""",
    "day_5_kid9_deer": """{
        day: 5, title: "Coreógrafo Ciervos", role: "kid9", xp: 25, location: "Nara",
        render: () => `<p class="mission-desc">Vídeo ciervo.</p><button id="btn-cam" class="btn-secondary">🎥 Grabar</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_5_kid9_deer', { type: 'text', data: 'Vídeo enviado' }));
        }
    }""",
    "day_5_kid9_silence": """{
        day: 5, title: "Control Monje", role: "kid9", xp: 20, location: "Buda",
        render: () => `<p class="mission-desc">20 seg mentales.</p><button id="btn" class="btn-primary">Empezar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid9_silence', { type: 'text', data: 'Silencio' }));
        }
    }""",
    "day_5_kid14_rascacielos": """{
        day: 5, title: "Rascacielos Madera", role: "kid14", xp: 10, location: "Todai-ji",
        render: () => `<p class="mission-desc">¿Cuántos pisos?</p><input type="number" id="n"><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid14_rascacielos', { type: 'number', data: document.getElementById('n').value }));
        }
    }""",
    "day_5_kid9_embajador": """{
        day: 5, title: "Embajador Ciervos", role: "kid9", xp: 20, location: "Nara",
        render: () => `<p class="mission-desc">Selfie con 3 ciervos.</p><button id="btn-cam" class="btn-secondary">📸 Selfie</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_5_kid9_embajador', { type: 'text', data: 'Foto enviada' }));
        }
    }""",
    "day_5_kid14_eng": """{
        day: 5, title: "Ingeniero", role: "kid14", xp: 20, location: "Todai-ji",
        render: () => `<p class="mission-desc">Área base templo.</p><input type="text" id="a"><button id="btn" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid14_eng', { type: 'text', data: document.getElementById('a').value }));
        }
    }""",
    "day_5_kid9_buda": """{
        day: 5, title: "Iluminación Buda", role: "kid9", xp: 15, location: "Todai-ji",
        render: () => `<p class="mission-desc">Pilar o deseo.</p><button id="btn" class="btn-primary">Hecho</button>`,
        attachEvents: () => {
            document.getElementById('btn').addEventListener('click', () => submitMission('day_5_kid9_buda', { type: 'text', data: 'Iluminado' }));
        }
    }""",
    "day_5_kid14_geographic": """{
        day: 5, title: "Nara Geographic", role: "kid14", xp: 15, location: "Nara",
        render: () => `<p class="mission-desc">Foto ciervo con titular.</p><input type="text" id="t"><button id="btn-cam" class="btn-secondary">📸 Foto</button>`,
        attachEvents: () => {
            document.getElementById('btn-cam').addEventListener('click', () => submitMission('day_5_kid14_geographic', { type: 'text', data: 'Publicado' }));
        }
    }""",

    # DÍA 6-10 (JUEGOS INTERACTIVOS)
    "day_6_kid9_ninja_steps": """{
        day: 6, title: "Pasos de Ninja (Ritmo)", role: "kid9", xp: 20, location: "Castillo Nijo",
        render: () => `
            <p class="mission-desc">Toca las huellas cuando entren en la zona azul.</p>
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
            let score = 0; let active = false; let footsteps = [];
            const spawn = () => {
                if(!active) return;
                const foot = document.createElement('div');
                foot.innerHTML = '👣'; foot.style.position = 'absolute'; foot.style.top = '-50px'; foot.style.left = 'calc(50% - 25px)';
                foot.style.fontSize = '3rem'; foot.dataset.hit = 'false';
                container.appendChild(foot);
                footsteps.push({ el: foot, top: -50 });
                setTimeout(spawn, 1500 + Math.random() * 1000);
            };
            const loop = () => {
                if(!active) return;
                footsteps.forEach((f, i) => {
                    f.top += 3; f.el.style.top = f.top + 'px';
                    if(f.top > 400) { f.el.remove(); footsteps.splice(i, 1); }
                });
                requestAnimationFrame(loop);
            };
            container.addEventListener('touchstart', (e) => {
                if(!active) return;
                footsteps.forEach(f => {
                    if(f.top > 300 && f.top < 380 && f.el.dataset.hit === 'false') {
                        f.el.dataset.hit = 'true'; f.el.style.color = 'var(--color-primary)';
                        score++; scoreDisp.innerText = `Aciertos: ${score}/5`;
                        if(score >= 5) { active = false; btnVictory.classList.remove('hidden'); }
                    }
                });
            });
            btnStart.addEventListener('click', () => { btnStart.classList.add('hidden'); active = true; spawn(); loop(); });
            btnVictory.addEventListener('click', () => submitMission('day_6_kid9_ninja_steps', { type: 'text', data: 'Superado' }));
        }
    }""",
    "day_9_kid9_scratch": """{
        day: 9, title: "Limpia el Reflejo", role: "kid9", xp: 20, location: "Kinkaku-ji",
        render: () => `
            <p class="mission-desc">Revela el reflejo dorado frotando el agua.</p>
            <div class="scratch-container">
                <img src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500" class="scratch-bg">
                <canvas id="scratch-canvas" class="scratch-canvas"></canvas>
            </div>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Misión Cumplida</button>
        `,
        attachEvents: () => {
            const canvas = document.getElementById('scratch-canvas');
            const ctx = canvas.getContext('2d');
            const btn = document.getElementById('btn-victory');
            canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
            ctx.fillStyle = '#78909c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            let scratched = 0;
            const scratch = (x, y) => {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
                scratched++; if(scratched > 50) btn.classList.remove('hidden');
            };
            canvas.addEventListener('touchmove', (e) => {
                const r = canvas.getBoundingClientRect();
                scratch(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
                e.preventDefault();
            });
            btn.addEventListener('click', () => submitMission('day_9_kid9_scratch', { type: 'text', data: 'Revelado' }));
        }
    }""",
    "day_10_kid9_bento": """{
        day: 10, title: "Maestro del Bento", role: "kid9", xp: 20, location: "Nishiki",
        render: () => `
            <p class="mission-desc">Arrastra los 4 ingredientes a la caja.</p>
            <div class="bento-tray">
                <div class="bento-slot" data-target="🍣">🍱</div>
                <div class="bento-slot" data-target="🍙">🍱</div>
                <div class="bento-slot" data-target="🍤">🍱</div>
                <div class="bento-slot" data-target="🍡">🍱</div>
            </div>
            <div class="bento-ingredients">
                <div class="ingredient" data-type="🍣">🍣</div>
                <div class="ingredient" data-type="🍙">🍙</div>
                <div class="ingredient" data-type="🍤">🍤</div>
                <div class="ingredient" data-type="🍡">🍡</div>
            </div>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Enviar Bento</button>
        `,
        attachEvents: () => {
            const ings = document.querySelectorAll('.ingredient');
            const slots = document.querySelectorAll('.bento-slot');
            const btn = document.getElementById('btn-victory');
            let placed = 0;
            ings.forEach(ing => {
                ing.addEventListener('touchmove', (e) => {
                    const t = e.touches[0];
                    ing.style.position = 'fixed'; ing.style.left = (t.clientX - 25) + 'px'; ing.style.top = (t.clientY - 25) + 'px';
                    e.preventDefault();
                });
                ing.addEventListener('touchend', (e) => {
                    const t = e.changedTouches[0];
                    slots.forEach(s => {
                        const r = s.getBoundingClientRect();
                        if(t.clientX > r.left && t.clientX < r.right && t.clientY > r.top && t.clientY < r.bottom && s.dataset.target === ing.dataset.type) {
                            s.innerHTML = ing.dataset.type; ing.style.display = 'none'; placed++;
                            if(placed === 4) btn.classList.remove('hidden');
                        }
                    });
                });
            });
            btn.addEventListener('click', () => submitMission('day_10_kid9_bento', { type: 'text', data: 'Bento OK' }));
        }
    }""",
    "day_9_kid14_torii": """{
        day: 9, title: "Laberinto de Torii", role: "kid14", xp: 25, location: "Fushimi",
        render: () => `
            <p class="mission-desc">Rota los Torii para conectar el camino.</p>
            <div class="torii-grid">
                ${Array(9).fill(0).map((_, i) => `<div class="torii-piece" data-rot="0"><svg viewBox="0 0 100 100"><path d="M50,0 L50,100 M0,50 L100,50" /></svg></div>`).join('')}
            </div>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Misión Cumplida</button>
        `,
        attachEvents: () => {
            const pieces = document.querySelectorAll('.torii-piece');
            const btn = document.getElementById('btn-victory');
            pieces.forEach(p => {
                p.addEventListener('click', () => {
                    let r = parseInt(p.dataset.rot) + 90; p.dataset.rot = r; p.style.transform = `rotate(${r}deg)`;
                    if(Array.from(pieces).every(x => parseInt(x.dataset.rot) > 0)) btn.classList.remove('hidden');
                });
            });
            btn.addEventListener('click', () => submitMission('day_9_kid14_torii', { type: 'text', data: 'Camino Conectado' }));
        }
    }""",
    "day_7_kid14_anti_seismic": """{
        day: 7, title: "Ingeniería Antisísmica", role: "kid14", xp: 20, location: "Kiyomizu",
        render: () => `
            <p class="mission-desc">Mantén el móvil plano 15s.</p>
            <div class="level-container"><div id="bubble" class="bubble"></div></div>
            <div id="timer" style="text-align:center; font-size:2rem;">15s</div>
            <button id="btn-start" class="btn-primary" style="width:100%">Empezar</button>
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Enviar</button>
        `,
        attachEvents: () => {
            const bubble = document.getElementById('bubble'); const timer = document.getElementById('timer');
            const btnS = document.getElementById('btn-start'); const btnV = document.getElementById('btn-victory');
            let time = 15; let active = false;
            window.addEventListener('deviceorientation', (e) => {
                if(!active) return;
                bubble.style.transform = `translate(calc(-50% + ${e.gamma*2}px), calc(-50% + ${e.beta*2}px))`;
                if(Math.abs(e.gamma) > 10 || Math.abs(e.beta) > 10) time = 15;
            });
            btnS.addEventListener('click', () => {
                active = true; btnS.classList.add('hidden');
                setInterval(() => { if(active) { time--; timer.innerText = time + 's'; if(time<=0) { active=false; btnV.classList.remove('hidden'); } } }, 1000);
            });
            btnV.addEventListener('click', () => submitMission('day_7_kid14_anti_seismic', { type: 'text', data: 'Estable' }));
        }
    }""",
    "day_8_kid14_wave_sync": """{
        day: 8, title: "Sincronización Ondas", role: "kid14", xp: 20, location: "Arashiyama",
        render: () => `
            <p class="mission-desc">Ajusta tu onda roja a la verde.</p>
            <canvas id="canvas" class="wave-canvas"></canvas>
            <input type="range" id="freq" min="0.01" max="0.1" step="0.01" style="width:100%">
            <button id="btn-victory" class="btn-primary hidden" style="width:100%">Sincronizar</button>
        `,
        attachEvents: () => {
            const canvas = document.getElementById('canvas'); const ctx = canvas.getContext('2d');
            const slider = document.getElementById('freq'); const btn = document.getElementById('btn-victory');
            canvas.width = canvas.offsetWidth; canvas.height = 200;
            const draw = () => {
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.beginPath(); ctx.strokeStyle='#2ecc71'; for(let x=0; x<canvas.width; x++) ctx.lineTo(x, 100 + 40*Math.sin(x*0.05)); ctx.stroke();
                ctx.beginPath(); ctx.strokeStyle='#e74c3c'; for(let x=0; x<canvas.width; x++) ctx.lineTo(x, 100 + 40*Math.sin(x*slider.value)); ctx.stroke();
                if(Math.abs(slider.value - 0.05) < 0.01) btn.classList.remove('hidden');
                requestAnimationFrame(draw);
            };
            draw();
            btn.addEventListener('click', () => submitMission('day_8_kid14_wave_sync', { type: 'text', data: 'Sincro OK' }));
        }
    }"""
}

# Construir el bloque MISSIONS_CONFIG
config_entries = []
for k, v in MISSIONS.items():
    config_entries.append(f'    "{k}": {v}')

new_config_block = "const MISSIONS_CONFIG = {\n" + ",\n".join(config_entries) + "\n};"
new_content = re.sub(r'const MISSIONS_CONFIG = \{.*?\n\};', new_config_block, content, flags=re.DOTALL)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("MISSIONS_CONFIG with games updated successfully.")
