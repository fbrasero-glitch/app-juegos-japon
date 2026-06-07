import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Definir TODAS las misiones correctamente
# He recopilado estas de la historia de la conversación
MISSIONS = {
    "day_1_kid14_jetlag": """{
        day: 1, title: "Reloj Samurái del Sueño", role: "kid14", xp: 15, location: "Avión / Hotel",
        render: () => {
            let html = `<p class="mission-desc">Calcula tu hora de dormir. Suma 7 horas a la hora española.</p>`;
            html += `<div style="display:flex; gap:10px; margin-bottom:15px;">`;
            html += `<select id="jl-hour" style="flex:1"><option value="">Hora...</option>`;
            for(let i=0; i<24; i++) html += `<option value="${i}">${i.toString().padStart(2,'0')}</option>`;
            html += `</select><select id="jl-min" style="flex:1"><option value="">Minutos...</option>`;
            for(let i=0; i<60; i+=5) html += `<option value="${i}">${i.toString().padStart(2,'0')}</option>`;
            html += `</select></div>`;
            html += `<p id="jl-result" style="font-weight:bold; color:var(--color-primary); font-size:1.2rem; text-align:center;"></p><br>`;
            html += `<p id="jl-msg" style="text-align:center; color:var(--color-accent); font-weight:bold; display:none;">¡Jet Lag vencido!</p>`;
            html += `<button id="btn-submit-mission" class="btn-primary" style="width:100%" disabled>Enviar al Juez</button>`;
            return html;
        },
        attachEvents: () => {
            const h = document.getElementById('jl-hour');
            const m = document.getElementById('jl-min');
            const res = document.getElementById('jl-result');
            const msg = document.getElementById('jl-msg');
            const btn = document.getElementById('btn-submit-mission');
            const update = () => {
                if(h.value && m.value) {
                    res.innerText = `Hora Japón: ${h.value.padStart(2,'0')}:${m.value.padStart(2,'0')}`;
                    msg.style.display = 'block';
                    btn.disabled = false;
                }
            };
            h.addEventListener('change', update);
            m.addEventListener('change', update);
            btn.addEventListener('click', () => {
                submitMission('day_1_kid14_jetlag', { type: 'text', data: res.innerText });
            });
        }
    }""",
    "day_1_kid14_nav": """{
        day: 1, title: "Navegante de Altura", role: "kid14", xp: 15, location: "Avión",
        render: () => {
            return `
                <p class="mission-desc">Anota la velocidad del avión y orienta el móvil hacia el Norte con la brújula.</p>
                <div style="text-align:center; margin-bottom:15px;">
                    <div id="compass-val" style="font-size:2rem; font-weight:bold;">0°</div>
                    <div id="compass-dir" style="color:var(--color-primary);">N</div>
                </div>
                <input type="number" id="plane-speed" placeholder="Velocidad (km/h)" style="width:100%; padding:15px; margin-bottom:15px;">
                <button id="btn-submit" class="btn-primary" style="width:100%">Enviar Datos de Vuelo</button>
            `;
        },
        attachEvents: () => {
            const val = document.getElementById('compass-val');
            const dir = document.getElementById('compass-dir');
            const handleOrientation = (e) => {
                const alpha = e.alpha;
                if(alpha !== null) {
                    val.innerText = Math.round(alpha) + "°";
                    if(alpha > 337 || alpha <= 22) dir.innerText = "NORTE";
                    else if(alpha > 22 && alpha <= 67) dir.innerText = "NE";
                    else if(alpha > 67 && alpha <= 112) dir.innerText = "ESTE";
                    else dir.innerText = "...";
                }
            };
            window.addEventListener('deviceorientation', handleOrientation);
            document.getElementById('btn-submit').addEventListener('click', () => {
                window.removeEventListener('deviceorientation', handleOrientation);
                const s = document.getElementById('plane-speed').value;
                submitMission('day_1_kid14_nav', { type: 'text', data: "Velocidad: " + s + " km/h. Rumbo: " + val.innerText });
            });
        }
    }""",
    "day_1_fam_bet": """{
        day: 1, title: "Apuesta del Aterrizaje", role: "both", xp: 25, location: "Avión / Aeropuerto",
        render: () => {
            return `
                <p class="mission-desc">Escribe 3 locuras o cosas que crees que vas a ver en Japón. El día 23 las leeremos.</p>
                <input type="text" id="bet-1" placeholder="Predicción 1..." style="width:100%; padding:10px; margin-bottom:10px;">
                <input type="text" id="bet-2" placeholder="Predicción 2..." style="width:100%; padding:10px; margin-bottom:10px;">
                <input type="text" id="bet-3" placeholder="Predicción 3..." style="width:100%; padding:10px; margin-bottom:10px;">
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:10px;">Sellar Predicciones</button>
            `;
        },
        attachEvents: (role) => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const b1 = document.getElementById('bet-1').value;
                const b2 = document.getElementById('bet-2').value;
                const b3 = document.getElementById('bet-3').value;
                if(b1 && b2 && b3) {
                    let stateObj = gameState['kid9'].missions['day_1_fam_bet']?.data || { kid9: '', kid14: '' };
                    stateObj[role] = `${b1} | ${b2} | ${b3}`;
                    submitMission('day_1_fam_bet', { type: 'family', data: stateObj }, role, true);
                }
            });
        }
    }""",
    "day_2_kid9_yokai": """{
        day: 2, title: "Caza del Yōkai Oficial", role: "kid9", xp: 20, location: "En la calle (Tokio/Osaka)",
        render: () => {
            return `
                <p class="mission-desc">Fotografía una mascota o cartel de aviso con estilo manga.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Abrir Cámara</button>
                    <img id="camera-preview" class="camera-preview">
                </div>
                <div id="classification-buttons" class="hidden" style="margin-top:20px; display:flex; gap:10px;">
                    <button class="btn-secondary" style="flex:1; font-size:1.2rem;" id="btn-animal">🐾 Era un animal</button>
                    <button class="btn-secondary" style="flex:1; font-size:1.2rem;" id="btn-human">👤 Era humano/objeto</button>
                </div>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto;
                    prev.style.display = 'block';
                    document.getElementById('classification-buttons').classList.remove('hidden');
                }
            });
            const submit = (type, isAnimal) => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_2_kid9_yokai', { type: 'photo_choice', data: { photoId: photoId, choice: type } });
                });
            };
            document.getElementById('btn-animal').addEventListener('click', () => submit('Animal', true));
            document.getElementById('btn-human').addEventListener('click', () => submit('Humano/Objeto', false));
        }
    }""",
    "day_2_kid14_protocol": """{
        day: 2, title: "Protocolo Shōgun", role: "kid14", xp: 20, location: "Metro / Tren",
        render: () => {
            return `
                <p class="mission-desc">Guía a la familia al hotel.</p>
                <div class="choice-grid" id="train-choices">
                    <button class="btn-choice" data-val="Yamanote">Línea Yamanote</button>
                    <button class="btn-choice" data-val="Midosuji">Línea Midosuji</button>
                    <button class="btn-choice" data-val="Chuo">Línea Chuo</button>
                </div><br>
                <div class="camera-container" id="step2" style="display:none">
                    <p>Haz foto del destino / andén:</p>
                    <input type="file" id="camera-input-p" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input-p').click()">📸 Foto</button>
                    <img id="camera-preview-p" class="camera-preview">
                </div><br>
                <div id="step3" style="display:none; text-align:center;">
                    <label><input type="checkbox" id="chk-arrived" style="width:auto; transform: scale(1.5); margin-right:10px;"> Hemos llegado al hotel</label><br><br>
                    <button id="btn-submit-protocol" class="btn-primary" style="width:100%" disabled>Misión cumplida</button>
                </div>
            `;
        },
        attachEvents: () => {
            let train = null;
            let currentPhoto = null;
            const btnSubmit = document.getElementById('btn-submit-protocol');
            const chk = document.getElementById('chk-arrived');
            
            document.querySelectorAll('#train-choices .btn-choice').forEach(b => {
                b.addEventListener('click', function() {
                    document.querySelectorAll('#train-choices .btn-choice').forEach(x => x.classList.remove('selected'));
                    this.classList.add('selected');
                    train = this.getAttribute('data-val');
                    if (train === 'Midosuji') {
                        document.getElementById('step2').style.display = 'flex';
                    } else {
                        document.getElementById('step2').style.display = 'none';
                        document.getElementById('step3').style.display = 'none';
                    }
                });
            });
            document.getElementById('camera-input-p').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview-p');
                    prev.src = currentPhoto;
                    prev.style.display = 'block';
                    document.getElementById('step3').style.display = 'block';
                }
            });
            chk.addEventListener('change', () => {
                btnSubmit.disabled = !chk.checked;
            });
            btnSubmit.addEventListener('click', () => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_2_kid14_protocol', { type: 'mixed', data: `Tren: ${train}. Foto ID: ${photoId}` });
                });
            });
        }
    }""",
    "any_eki_stamp": """{
        day: 2, title: "Coleccionista de Eki-Stamps", role: "both", xp: 15, location: "Estaciones de Tren",
        render: () => {
            return `
                <p class="mission-desc">Busca el sello (stamp) de la estación y estámpalo en tu libreta.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input-s" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input-s').click()">📸 Foto del Sello</button>
                    <img id="camera-preview-s" class="camera-preview">
                </div>
                <button id="btn-submit-stamp" class="btn-primary hidden" style="width:100%; margin-top:15px;">Subir a la Colección</button>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input-s').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview-s');
                    prev.src = currentPhoto;
                    prev.style.display = 'block';
                    document.getElementById('btn-submit-stamp').classList.remove('hidden');
                }
            });
            document.getElementById('btn-submit-stamp').addEventListener('click', () => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('any_eki_stamp', { type: 'mixed', data: `Eki Stamp. Foto ID: ${photoId}` });
                });
            });
        }
    }""",
    "day_3_kid9_puente": """{
        day: 3, title: "Puente del Castillo", role: "kid9", xp: 15, location: "Castillo de Osaka",
        render: () => {
            return `
                <p class="mission-desc">Cuenta los pasos para cruzar el puente.</p>
                <input type="number" id="puente-pasos" placeholder="Número de pasos" style="width:100%; padding:15px; font-size:1.2rem; margin-bottom:15px;">
                <button id="btn-comprobar-puente" class="btn-secondary" style="width:100%; margin-bottom:15px;">Comprobar</button>
                <p id="puente-msg" style="color:var(--color-primary); font-weight:bold; display:none; margin-bottom:15px;"></p>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%">Enviar al Juez</button>
            `;
        },
        attachEvents: () => {
            const input = document.getElementById('puente-pasos');
            const btnComprobar = document.getElementById('btn-comprobar-puente');
            const msg = document.getElementById('puente-msg');
            const btnSubmit = document.getElementById('btn-submit');

            btnComprobar.addEventListener('click', () => {
                const pasos = parseInt(input.value);
                if (pasos > 0) {
                    msg.innerText = `Un samurái daría 20 pasos, tú lo hiciste en ${pasos}. ¡Eres más rápido que un mensajero!`;
                    msg.style.display = 'block';
                    btnSubmit.classList.remove('hidden');
                }
            });
            btnSubmit.addEventListener('click', () => {
                submitMission('day_3_kid9_puente', { type: 'number', data: parseInt(input.value) });
            });
        }
    }""",
    "day_3_kid14_architect": """{
        day: 3, title: "Arquitecto del Castillo", role: "kid14", xp: 20, location: "Castillo de Osaka",
        render: () => {
            return `
                <p class="mission-desc">Usa Google Maps (Satelite) para medir la distancia desde el parque exterior hasta la Torre Principal.</p>
                <label>Metros calculados:</label>
                <input type="number" id="dist-m" placeholder="Distancia en metros..." style="width:100%; padding:15px; margin-bottom:15px;">
                <button id="btn-submit" class="btn-primary" style="width:100%">Enviar Cálculo</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const d = document.getElementById('dist-m').value;
                submitMission('day_3_kid14_architect', { type: 'number', data: d });
            });
        }
    }""",
    "day_3_kid9_umeda": """{
        day: 3, title: "Umeda Sky (Superhéroe)", role: "kid9", xp: 10, location: "Umeda Sky Building",
        render: () => {
            return `
                <p class="mission-desc">Toma una foto donde parezca que sujetas el edificio.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Abrir Cámara</button>
                    <img id="camera-preview" class="camera-preview">
                </div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">¡Lo tengo!</button>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto;
                    prev.style.display = 'block';
                    document.getElementById('btn-submit').classList.remove('hidden');
                }
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_3_kid9_umeda', { type: 'photo_choice', data: { photoId: photoId, choice: 'Superhéroe' } });
                });
            });
        }
    }""",
    "day_3_kid14_filtro": """{
        day: 3, title: "Filtro Cyberpunk", role: "kid14", xp: 10, location: "Umeda Sky Building",
        render: () => {
            return `
                <p class="mission-desc">Toma una foto desde el mirador y aplícale un filtro.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Foto</button>
                    <img id="camera-preview" class="camera-preview" style="transition: filter 0.3s;">
                </div>
                <div id="filters" class="hidden" style="margin-top:15px; display:flex; gap:5px;">
                    <button class="btn-secondary" style="flex:1; padding:10px; font-size:0.9rem;" onclick="applyFilter('saturate(2) hue-rotate(45deg)')">Neon</button>
                    <button class="btn-secondary" style="flex:1; padding:10px; font-size:0.9rem;" onclick="applyFilter('grayscale(100%)')">Grayscale</button>
                    <button class="btn-secondary" style="flex:1; padding:10px; font-size:0.9rem;" onclick="applyFilter('contrast(1.5) saturate(1.5)')">Saturado</button>
                </div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Publicar en Neo-Osaka</button>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            let selectedFilter = '';
            window.applyFilter = (filter) => {
                document.getElementById('camera-preview').style.filter = filter;
                selectedFilter = filter;
            };
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto;
                    prev.style.display = 'block';
                    document.getElementById('filters').classList.remove('hidden');
                    document.getElementById('btn-submit').classList.remove('hidden');
                }
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_3_kid14_filtro', { type: 'mixed', data: `Filtro: ${selectedFilter}. Foto ID: ${photoId}` });
                });
            });
        }
    }""",
    "day_3_kid9_glico": """{
        day: 3, title: "Glico Man", role: "kid9", xp: 10, location: "Dotonbori",
        render: () => {
            return `
                <p class="mission-desc">Hazte un selfie imitando al Glico Man.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="user" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Selfie Glico</button>
                    <div style="position:relative; margin-top:10px;">
                        <img id="camera-preview" class="camera-preview">
                        <div id="glico-frame" class="hidden" style="position:absolute; top:0; left:0; right:0; bottom:0; border:4px solid #0ff; box-shadow: 0 0 10px #0ff inset; display:flex; align-items:flex-end; justify-content:center; padding-bottom:20px;">
                            <span style="color:#0ff; font-weight:bold; font-size:2rem; text-shadow: 0 0 5px #0ff; background:rgba(0,0,0,0.5); padding:5px 15px; border-radius:10px;">Glico Kid</span>
                        </div>
                    </div>
                </div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Completar Misión</button>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto;
                    prev.style.display = 'block';
                    document.getElementById('glico-frame').classList.remove('hidden');
                    document.getElementById('btn-submit').classList.remove('hidden');
                }
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_3_kid9_glico', { type: 'photo_choice', data: { photoId: photoId, choice: 'Pose Glico Man' } });
                });
            });
        }
    }""",
    "day_3_kid14_tribunal": """{
        day: 3, title: "Tribunal del Cartel Ridículo", role: "kid14", xp: 15, location: "Dotonbori",
        render: () => {
            return `
                <p class="mission-desc">Toma foto del cartel más exagerado y que el tribunal vote.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Foto Cartel</button>
                    <img id="camera-preview" class="camera-preview">
                </div>
                <div id="tribunal" class="hidden" style="text-align:left; margin-top:15px;">
                    <p>Votos a favor de su ridiculez:</p>
                    <label style="display:block; margin:10px 0;"><input type="checkbox" class="tribunal-chk"> Papá</label>
                    <label style="display:block; margin:10px 0;"><input type="checkbox" class="tribunal-chk"> Mamá</label>
                    <label style="display:block; margin:10px 0;"><input type="checkbox" class="tribunal-chk"> Hermano</label>
                    <label style="display:block; margin:10px 0;"><input type="checkbox" class="tribunal-chk"> Yo</label>
                    <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Veredicto</button>
                </div>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto;
                    prev.style.display = 'block';
                    document.getElementById('tribunal').classList.remove('hidden');
                }
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                const checked = document.querySelectorAll('.tribunal-chk:checked').length;
                if (checked >= 3) {
                    const photoId = 'photo_' + Date.now();
                    savePhotoToDB(photoId, currentPhoto).then(() => {
                        submitMission('day_3_kid14_tribunal', { type: 'mixed', data: `Votos: ${checked}/4. Foto ID: ${photoId}` });
                    });
                } else {
                    showAlert('Votos insuficientes', 'Necesitas al menos 3 votos del tribunal familiar.');
                }
            });
        }
    }""",
    "day_3_kid14_audio": """{
        day: 3, title: "Caza de Sonidos: Jingle de Estación", role: "kid14", xp: 15, location: "Estaciones de Tren",
        render: () => {
            return `
                <p class="mission-desc">Graba el jingle de una estación de tren o el sonido del semáforo (el pájaro).</p>
                <div id="audio-ui" style="text-align:center;">
                    <div id="mic-icon" class="audio-feedback">🎤</div>
                    <p id="audio-status">Pulsa para grabar (5 seg)</p>
                    <button id="btn-record" class="btn-secondary">🔴 Grabar Sonido</button>
                </div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Sonido al Juez</button>
            `;
        },
        attachEvents: () => {
            const btn = document.getElementById('btn-record');
            const icon = document.getElementById('mic-icon');
            const status = document.getElementById('audio-status');
            const btnSubmit = document.getElementById('btn-submit');
            let recording = false;
            let audioBlob = null;

            btn.addEventListener('click', async () => {
                if(!recording) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        const mediaRecorder = new MediaRecorder(stream);
                        let chunks = [];
                        mediaRecorder.ondataavailable = e => chunks.push(e.data);
                        mediaRecorder.onstop = () => {
                            audioBlob = new Blob(chunks, { type: 'audio/webm' });
                            icon.innerText = "🎵";
                            status.innerText = "¡Sonido capturado!";
                            btnSubmit.classList.remove('hidden');
                            stream.getTracks().forEach(t => t.stop());
                        };
                        mediaRecorder.start();
                        recording = true;
                        btn.innerText = "⏹ Detener";
                        icon.classList.add('pulse');
                        setTimeout(() => { if(mediaRecorder.state==='recording') mediaRecorder.stop(); }, 5000);
                    } catch(e) { showAlert('Error', 'No se pudo acceder al micrófono.'); }
                }
            });
            btnSubmit.addEventListener('click', () => {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const audioId = 'audio_' + Date.now();
                    savePhotoToDB(audioId, re.target.result).then(() => {
                        submitMission('day_3_kid14_audio', { type: 'mixed', data: `Audio Jingle. ID: ${audioId}` });
                    });
                };
                reader.readAsDataURL(audioBlob);
            });
        }
    }""",
    "day_4_kid9_gachapon": """{
        day: 4, title: "Misión Gachapon", role: "kid9", xp: 10, location: "Cualquier tienda de Gachapon",
        render: () => {
            return `
                <p class="mission-desc">Consigue un juguete de Gachapon y revela su rareza.</p>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button class="btn-secondary" id="btn-comun" style="flex:1;">Común</button>
                    <button class="btn-primary" id="btn-raro" style="flex:1;">¡RARO!</button>
                </div>
                <div id="gacha-anim" style="font-size:4rem; text-align:center; display:none; margin-bottom:20px;"></div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%">Enviar recompensa</button>
            `;
        },
        attachEvents: () => {
            const anim = document.getElementById('gacha-anim');
            const btnSubmit = document.getElementById('btn-submit');
            let resultado = "";
            document.getElementById('btn-comun').addEventListener('click', () => {
                anim.innerText = "🥚"; anim.style.display = "block";
                resultado = "Común"; btnSubmit.classList.remove('hidden');
            });
            document.getElementById('btn-raro').addEventListener('click', () => {
                anim.innerText = "🔮"; anim.style.display = "block";
                resultado = "Raro"; btnSubmit.classList.remove('hidden');
            });
            btnSubmit.addEventListener('click', () => {
                submitMission('day_4_kid9_gachapon', { type: 'text', data: `Obtuvo cápsula: ${resultado}` });
            });
        }
    }""",
    "day_4_kid14_meditacion": """{
        day: 4, title: "Meditación Fotográfica", role: "kid14", xp: 15, location: "Namba Parks",
        render: () => {
            return `
                <p class="mission-desc">Toma una foto del jardín zen sin que salga NINGUNA persona.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Foto Zen</button>
                    <img id="camera-preview" class="camera-preview">
                </div>
                <div id="meditation-checks" class="hidden" style="margin-top:15px; display:flex; gap:10px;">
                    <button id="btn-ok" class="btn-primary" style="flex:1;">Nadie salió</button>
                    <button id="btn-retry" class="btn-secondary" style="flex:1;">Hay alguien, reintentar</button>
                </div>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto; prev.style.display = 'block';
                    document.getElementById('meditation-checks').classList.remove('hidden');
                }
            });
            document.getElementById('btn-ok').addEventListener('click', () => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_4_kid14_meditacion', { type: 'mixed', data: `Foto sin gente. ID: ${photoId}` });
                });
            });
        }
    }""",
    "day_4_fam_yakiniku": """{
        day: 4, title: "Maestro Yakiniku (Familiar)", role: "both", xp: 20, location: "Restaurante Yakiniku",
        render: (userRole) => {
            return `
                <p class="mission-desc">Trabajo en equipo en la barbacoa.</p>
                <div style="display:flex; flex-direction:column; gap:15px;">
                    <button id="btn-fam-9" class="btn-secondary">🥩 Yo volteé la carne (Kid9)</button>
                    <button id="btn-fam-14" class="btn-secondary">👨‍🍳 Cociné bocado perfecto (Kid14)</button>
                </div><br>
                <button id="btn-submit-fam" class="btn-primary" style="width:100%">Enviar hazaña</button>
            `;
        },
        attachEvents: (userRole) => {
            let kid9Done = gameState['kid9'].missions['day_4_fam_yakiniku']?.data?.kid9 || false;
            let kid14Done = gameState['kid14'].missions['day_4_fam_yakiniku']?.data?.kid14 || false;
            document.getElementById('btn-fam-9').addEventListener('click', () => { kid9Done = !kid9Done; });
            document.getElementById('btn-fam-14').addEventListener('click', () => { kid14Done = !kid14Done; });
            document.getElementById('btn-submit-fam').addEventListener('click', () => {
                submitMission('day_4_fam_yakiniku', { type: 'family', data: { kid9: kid9Done, kid14: kid14Done } }, userRole, true);
            });
        }
    }""",
    "day_4_kid14_conbini": """{
        day: 4, title: "El Reto de la Moneda de 500", role: "kid14", xp: 15, location: "Lawson / 7-Eleven",
        render: () => {
            return `
                <p class="mission-desc">Tienes exactamente 500 yenes. Compra bebida, snack salado y dulce sin pasarte.</p>
                <div style="background:var(--color-bg); padding:15px; border-radius:10px;">
                    <label>Bebida (¥):</label> <input type="number" id="p1" class="budget-in" style="width:100%; margin-bottom:10px;">
                    <label>Snack Salado (¥):</label> <input type="number" id="p2" class="budget-in" style="width:100%; margin-bottom:10px;">
                    <label>Snack Dulce (¥):</label> <input type="number" id="p3" class="budget-in" style="width:100%; margin-bottom:10px;">
                    <div style="font-size:1.5rem; font-weight:bold; text-align:center; margin-top:10px;">Total: <span id="budget-total">0</span>¥</div>
                </div>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;" disabled>Enviar Ticket</button>
            `;
        },
        attachEvents: () => {
            const inputs = document.querySelectorAll('.budget-in');
            const totalDisp = document.getElementById('budget-total');
            const btn = document.getElementById('btn-submit');
            const update = () => {
                let total = 0;
                inputs.forEach(i => total += (parseInt(i.value) || 0));
                totalDisp.innerText = total;
                totalDisp.style.color = total > 500 ? 'red' : 'var(--color-primary)';
                btn.disabled = total === 0 || total > 500;
            };
            inputs.forEach(i => i.addEventListener('input', update));
            btn.addEventListener('click', () => {
                submitMission('day_4_kid14_conbini', { type: 'number', data: totalDisp.innerText });
            });
        }
    }""",
    "day_4_fam_kuromon": """{
        day: 4, title: "Subasta Ciega del Kuromon", role: "both", xp: 20, location: "Mercado Kuromon",
        render: () => {
            return `
                <p class="mission-desc">Imagina que tienes 1.000 ¥. Diseña tu Menú Ideal sin pasarte del presupuesto.</p>
                <textarea id="menu-text" placeholder="Mi menú ideal (item: ¥)..." style="width:100%; height:120px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:10px;">Enviar Menú al Juez</button>
            `;
        },
        attachEvents: (role) => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('menu-text').value;
                if(val.length > 10) {
                    let stateObj = gameState['kid9'].missions['day_4_fam_kuromon']?.data || { kid9: '', kid14: '' };
                    stateObj[role] = val;
                    submitMission('day_4_fam_kuromon', { type: 'family', data: stateObj }, role, true);
                }
            });
        }
    }""",
    "day_5_kid9_embajador": """{
        day: 5, title: "Embajador de los Ciervos", role: "kid9", xp: 20, location: "Parque de Nara",
        render: () => {
            return `
                <p class="mission-desc">Hazte un selfie donde salgan al menos 3 ciervos.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="user" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Selfie con Ciervos</button>
                    <img id="camera-preview" class="camera-preview">
                </div>
                <div id="deer-btns" class="hidden" style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
                    <button id="btn-success" class="btn-primary">¡Conseguí los 3 ciervos!</button>
                    <button id="btn-fail" class="btn-secondary">No pude, pero lo intenté</button>
                </div>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto; prev.style.display = 'block';
                    document.getElementById('deer-btns').classList.remove('hidden');
                }
            });
            const submit = (msg) => {
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_5_kid9_embajador', { type: 'mixed', data: `${msg}. ID: ${photoId}` });
                });
            };
            document.getElementById('btn-success').addEventListener('click', () => submit('Éxito: 3 ciervos'));
            document.getElementById('btn-fail').addEventListener('click', () => submit('Intento: Menos de 3'));
        }
    }""",
    "day_5_kid14_geographic": """{
        day: 5, title: "Nara Geographic", role: "kid14", xp: 15, location: "Parque de Nara",
        render: () => {
            return `
                <p class="mission-desc">Toma foto de un ciervo fotogénico y ponle titular.</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Foto Portada</button>
                    <img id="camera-preview" class="camera-preview">
                </div>
                <div id="title-section" class="hidden" style="margin-top:15px;">
                    <input type="text" id="doc-title" placeholder="Titular del documental" style="width:100%; padding:15px;">
                    <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:10px;">Publicar Revista</button>
                </div>
            `;
        },
        attachEvents: () => {
            let currentPhoto = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    currentPhoto = await compressImage(file);
                    const prev = document.getElementById('camera-preview');
                    prev.src = currentPhoto; prev.style.display = 'block';
                    document.getElementById('title-section').classList.remove('hidden');
                }
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('doc-title').value;
                const photoId = 'photo_' + Date.now();
                savePhotoToDB(photoId, currentPhoto).then(() => {
                    submitMission('day_5_kid14_geographic', { type: 'mixed', data: `Titular: ${val}. ID: ${photoId}` });
                });
            });
        }
    }""",
    "day_5_kid9_buda": """{
        day: 5, title: "La Iluminación del Buda", role: "kid9", xp: 15, location: "Templo Todai-ji",
        render: () => {
            return `
                <p class="mission-desc">Pasa por el pilar del Buda o pide un deseo.</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
                    <button id="btn-pilar" class="btn-secondary">📸 Me hice foto saliendo del pilar</button>
                    <button id="btn-cola" class="btn-primary">Había cola, pero pedí un deseo</button>
                </div>
                <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-pilar').addEventListener('click', () => document.getElementById('camera-input').click());
            document.getElementById('btn-cola').addEventListener('click', () => {
                submitMission('day_5_kid9_buda', { type: 'text', data: 'No pudo pasar el pilar, pero pidió un deseo.' });
            });
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if(file) {
                    const photo = await compressImage(file);
                    const photoId = 'photo_' + Date.now();
                    savePhotoToDB(photoId, photo).then(() => {
                        submitMission('day_5_kid9_buda', { type: 'photo_choice', data: { photoId: photoId, choice: 'Paso por el pilar' } });
                    });
                }
            });
        }
    }""",
    "day_5_kid14_rascacielos": """{
        day: 5, title: "El Rascacielos de Madera", role: "kid14", xp: 10, location: "Templo Todai-ji",
        render: () => {
            return `
                <p class="mission-desc">Si el templo mide 50m y cada piso moderno son 3m, ¿cuántos pisos tendría?</p>
                <input type="number" id="pisos-num" placeholder="Número de pisos" style="width:100%; padding:15px;">
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Reflexión</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('pisos-num').value;
                submitMission('day_5_kid14_rascacielos', { type: 'text', data: `Cálculo: ${val} pisos.` });
            });
        }
    }""",
    "day_5_kid9_silence": """{
        day: 5, title: "El Control del Monje", role: "kid9", xp: 20, location: "Frente al Gran Buda",
        render: () => {
            return `
                <p class="mission-desc">Cuenta 20 segundos en tu cabeza con los ojos cerrados. Pulsa al empezar y al terminar.</p>
                <div style="text-align:center; padding:20px;">
                    <button id="btn-timer-action" class="btn-primary" style="width:150px; height:150px; border-radius:50%; font-size:1.2rem;">INICIAR MEDITACIÓN</button>
                    <p id="timer-status" style="margin-top:15px; font-weight:bold;"></p>
                </div>
            `;
        },
        attachEvents: () => {
            let startTime = 0;
            const btn = document.getElementById('btn-timer-action');
            const status = document.getElementById('timer-status');
            btn.addEventListener('click', () => {
                if(startTime === 0) {
                    startTime = Date.now(); btn.innerText = "TERMINAR";
                    status.innerText = "Cierra los ojos y cuenta...";
                } else {
                    const diff = (Date.now() - startTime) / 1000;
                    startTime = 0;
                    const success = diff >= 18 && diff <= 22;
                    status.innerText = `Tiempo: ${diff.toFixed(1)}s. ${success ? '¡PERFECTO!' : 'Casi...'}`;
                    setTimeout(() => { submitMission('day_5_kid9_silence', { type: 'number', data: diff.toFixed(1) }); }, 2000);
                }
            });
        }
    }""",
    "day_5_kid14_kanji": """{
        day: 5, title: "Caligrafía Zen", role: "kid14", xp: 15, location: "Templos de Nara",
        render: () => {
            return `
                <p class="mission-desc">Dibuja el Kanji de AGUA (水) o MONTAÑA (山) con pincel virtual.</p>
                <div class="canvas-container canvas-zen">
                    <canvas id="kanji-canvas"></canvas>
                </div>
                <button id="btn-clear" class="btn-secondary" style="width:100%; margin-bottom:10px;">Limpiar Pincel</button>
                <button id="btn-submit" class="btn-primary" style="width:100%">Enviar Caligrafía</button>
            `;
        },
        attachEvents: () => {
            const canvas = document.getElementById('kanji-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth; canvas.height = 250;
            ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
            let drawing = false;
            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return { x: clientX - rect.left, y: clientY - rect.top };
            };
            const start = (e) => { drawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); };
            const draw = (e) => { if(!drawing) return; const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); };
            const end = () => { drawing = false; };
            canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw); window.addEventListener('mouseup', end);
            canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }); canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }); canvas.addEventListener('touchend', end);
            document.getElementById('btn-clear').addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));
            document.getElementById('btn-submit').addEventListener('click', () => {
                savePhotoToDB('drawing_'+Date.now(), canvas.toDataURL()).then(() => {
                    submitMission('day_5_kid14_kanji', { type: 'text', data: 'Caligrafía enviada.' });
                });
            });
        }
    }""",
    "day_5_kid9_deer": """{
        day: 5, title: "Coreógrafo de Ciervos", role: "kid9", xp: 25, location: "Parque de Nara",
        render: () => {
            return `
                <p class="mission-desc">Graba un vídeo de máximo 10 segundos de un ciervo haciendo algo divertido.</p>
                <div class="camera-container">
                    <input type="file" id="video-input" accept="video/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('video-input').click()">🎥 Grabar Clip</button>
                    <video id="video-preview" class="camera-preview" controls style="display:none; width:100%;"></video>
                </div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Clip al Juez</button>
            `;
        },
        attachEvents: () => {
            let videoBlob = null;
            document.getElementById('video-input').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    const prev = document.getElementById('video-preview');
                    prev.src = url; prev.style.display = 'block';
                    document.getElementById('btn-submit').classList.remove('hidden');
                    videoBlob = file;
                }
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const videoId = 'video_' + Date.now();
                    savePhotoToDB(videoId, re.target.result).then(() => {
                        submitMission('day_5_kid9_deer', { type: 'video', data: videoId });
                    });
                };
                reader.readAsDataURL(videoBlob);
            });
        }
    }""",
    "day_5_kid14_eng": """{
        day: 5, title: "Ingeniero Estructural", role: "kid14", xp: 20, location: "Templo Todai-ji",
        render: () => {
            return `
                <p class="mission-desc">El templo mide 50m de alto. Busca sus dimensiones y calcula el Área de la base.</p>
                <textarea id="calc-text" placeholder="Operación: Base x Altura = ..." style="width:100%; height:80px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:10px;">Enviar al Juez</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('calc-text').value;
                submitMission('day_5_kid14_eng', { type: 'text', data: val });
            });
        }
    }""",
    "day_6_kid14_edicto": """{
        day: 6, title: "El Edicto del Emperador", role: "kid14", xp: 15, location: "Palacio Imperial de Kioto",
        render: () => {
            return `
                <p class="mission-desc">Escribe un "Decreto Imperial" absurdo para tu familia y recítalo con voz solemne.</p>
                <textarea id="edicto-text" placeholder="Por la presente, ordeno que..." style="width:100%; height:100px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Proclamar Edicto</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('edicto-text').value;
                submitMission('day_6_kid14_edicto', { type: 'text', data: val });
            });
        }
    }""",
    "day_6_kid9_jardin": """{
        day: 6, title: "El Jardín de las Nubes Verdes", role: "kid9", xp: 15, location: "Palacio Imperial de Kioto",
        render: () => {
            return `
                <p class="mission-desc">Dibuja o describe la forma del pino más raro que veas.</p>
                <textarea id="pino-text" placeholder="El pino parece un..." style="width:100%; height:80px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Observación</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('pino-text').value;
                submitMission('day_6_kid9_jardin', { type: 'text', data: val });
            });
        }
    }""",
    "day_6_kid9_ruisenor": """{
        day: 6, title: "El Piso del Ruiseñor", role: "kid9", xp: 15, location: "Castillo de Nijo",
        render: () => {
            return `
                <p class="mission-desc">Primero intenta caminar como un ninja (sin ruido). Luego graba el chirrido real del suelo.</p>
                <div id="audio-ui" style="text-align:center;">
                    <div id="mic-icon" style="font-size:3rem;">🎤</div>
                    <button id="btn-record" class="btn-secondary">🔴 Grabar Chirrido</button>
                </div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
            `;
        },
        attachEvents: () => {
            const btn = document.getElementById('btn-record');
            const btnSubmit = document.getElementById('btn-submit');
            let audioBlob = null;
            btn.addEventListener('click', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                let chunks = [];
                mediaRecorder.ondataavailable = e => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    btnSubmit.classList.remove('hidden');
                    stream.getTracks().forEach(t => t.stop());
                };
                mediaRecorder.start();
                btn.innerText = "⏹ Detener";
                setTimeout(() => { if(mediaRecorder.state==='recording') mediaRecorder.stop(); }, 5000);
            });
            btnSubmit.addEventListener('click', () => {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const audioId = 'audio_' + Date.now();
                    savePhotoToDB(audioId, re.target.result).then(() => {
                        submitMission('day_6_kid9_ruisenor', { type: 'mixed', data: `Chirrido Castillo. ID: ${audioId}` });
                    });
                };
                reader.readAsDataURL(audioBlob);
            });
        }
    }""",
    "day_6_kid14_ninja": """{
        day: 6, title: "Plan de Infiltración Ninja", role: "kid14", xp: 15, location: "Castillo de Nijo",
        render: () => {
            return `
                <p class="mission-desc">¿Cómo entrarías al castillo sin que te oigan los "suelos cantores"? Escribe tu plan (2 frases).</p>
                <textarea id="ninja-plan" placeholder="Mi plan es..." style="width:100%; height:100px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar Plan</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                const val = document.getElementById('ninja-plan').value;
                submitMission('day_6_kid14_ninja', { type: 'text', data: val });
            });
        }
    }""",
    "day_6_kid14_tiempo": """{
        day: 6, title: "Viaje en el Tiempo", role: "kid14", xp: 15, location: "Sannenzaka / Ninenzaka",
        render: () => {
            return `
                <p class="mission-desc">Toma una foto donde parezca que estás en el año 1600. ¡Cero objetos modernos!</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Foto 1600</button>
                    <img id="camera-preview" class="camera-preview">
                </div>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
            `;
        },
        attachEvents: () => {
            let photo = null;
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if(file) {
                    photo = await compressImage(file);
                    document.getElementById('camera-preview').src = photo;
                    document.getElementById('camera-preview').style.display = 'block';
                    document.getElementById('btn-submit').classList.remove('hidden');
                }
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                const id = 'photo_'+Date.now();
                savePhotoToDB(id, photo).then(() => {
                    submitMission('day_6_kid14_tiempo', { type: 'mixed', data: `Foto época. ID: ${id}` });
                });
            });
        }
    }""",
    "day_7_fam_gion": """{
        day: 7, title: "El Código Geisha", role: "both", xp: 15, location: "Gion / Pontocho",
        render: () => {
            return `
                <p class="mission-desc">Busca un farolillo de papel iluminado y hazle una foto. ¡Respeta a las Geishas!</p>
                <div class="camera-container">
                    <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none">
                    <button class="btn-secondary" onclick="document.getElementById('camera-input').click()">📸 Foto Farolillo</button>
                </div>
            `;
        },
        attachEvents: (role) => {
            document.getElementById('camera-input').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if(file) {
                    const photo = await compressImage(file);
                    const id = 'photo_'+Date.now();
                    savePhotoToDB(id, photo).then(() => {
                        submitMission('day_7_fam_gion', { type: 'mixed', data: `Foto Gion. ID: ${id}` }, role, true);
                    });
                }
            });
        }
    }""",
    "day_7_kid9_tea": """{
        day: 7, title: "La Bandeja del Té del Shogun", role: "kid9", xp: 15, location: "Sannenzaka",
        render: () => {
            return `
                <p class="mission-desc">Baja las escaleras manteniendo el móvil plano como una bandeja de té.</p>
                <div id="tea-sensor" class="sensor-feedback sensor-flat">🍵</div>
                <button id="btn-start-tea" class="btn-primary" style="width:100%; margin-top:15px;">Empezar Reto</button>
            `;
        },
        attachEvents: () => {
            const box = document.getElementById('tea-sensor');
            const btn = document.getElementById('btn-start-tea');
            let active = false; let errors = 0;
            const handle = (e) => {
                if(!active) return;
                if(Math.abs(e.beta)>20 || Math.abs(e.gamma)>20) { box.className='sensor-feedback sensor-tilted'; box.innerText='⚠️'; errors++; }
                else { box.className='sensor-feedback sensor-flat'; box.innerText='🍵'; }
            };
            btn.addEventListener('click', async () => {
                if(!active) {
                    if(typeof DeviceOrientationEvent.requestPermission==='function') await DeviceOrientationEvent.requestPermission();
                    active = true; btn.innerText="¡LLEGUÉ!"; window.addEventListener('deviceorientation', handle);
                } else {
                    active = false; window.removeEventListener('deviceorientation', handle);
                    submitMission('day_7_kid9_tea', { type: 'number', data: errors });
                }
            });
        }
    }""",
    "day_7_kid14_kitsune": """{
        day: 7, title: "La Cacería de Kitsunes", role: "kid14", xp: 15, location: "Templos de Kioto",
        render: () => {
            return `
                <p class="mission-desc">Encuentra 3 estatuas de zorros (Kitsune) diferentes.</p>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                    <div id="k1" class="coin-slot">🦊</div>
                    <div id="k2" class="coin-slot">🦊</div>
                    <div id="k3" class="coin-slot">🦊</div>
                </div>
                <button id="btn-kitsune" class="btn-primary" style="width:100%; margin-top:15px;">Marcar Zorro</button>
            `;
        },
        attachEvents: () => {
            let count = 0;
            document.getElementById('btn-kitsune').addEventListener('click', () => {
                count++; if(count<=3) document.getElementById('k'+count).style.background="var(--color-primary)";
                if(count>=3) setTimeout(() => submitMission('day_7_kid14_kitsune', { type: 'text', data: '3 Kitsunes encontrados' }), 1000);
            });
        }
    }""",
    "day_7_kid9_otowa": """{
        day: 7, title: "Los Chorros del Destino", role: "kid9", xp: 15, location: "Templo Kiyomizu-dera",
        render: () => {
            return `
                <p class="mission-desc">Elige SOLO UN chorro para beber. ¡Beber los tres da mala suerte!</p>
                <button class="btn-choice-otowa" data-title="Sabio del Agua">🎓 Éxito Escolar</button>
                <button class="btn-choice-otowa" data-title="Corazón de Oro">❤️ Amor</button>
                <button class="btn-choice-otowa" data-title="Eterno Viajero">🐢 Longevidad</button>
            `;
        },
        attachEvents: () => {
            document.querySelectorAll('.btn-choice-otowa').forEach(btn => {
                btn.addEventListener('click', function() {
                    submitMission('day_7_kid9_otowa', { type: 'text', data: this.getAttribute('data-title') });
                });
            });
        }
    }""",
    "day_8_kid9_rake": """{
        day: 8, title: "El Rastrillo del Jardinero", role: "kid9", xp: 15, location: "Templo Tenryu-ji",
        render: () => {
            return `
                <p class="mission-desc">Imita los patrones de la arena del jardín zen con tu dedo.</p>
                <div class="canvas-container canvas-arena"><canvas id="rake-canvas"></canvas></div>
                <button id="btn-submit" class="btn-primary" style="width:100%">Enviar Patrón</button>
            `;
        },
        attachEvents: () => {
            const canvas = document.getElementById('rake-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth; canvas.height = 250;
            ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(100,100,100,0.3)';
            let drawing = false;
            const start = (e) => { drawing = true; ctx.beginPath(); };
            const draw = (e) => {
                if(!drawing) return;
                const rect = canvas.getBoundingClientRect();
                const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
                const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
                ctx.arc(x, y, 5, 0, Math.PI*2); ctx.stroke();
            };
            canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw); window.addEventListener('mouseup', () => drawing=false);
            canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }); canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }); canvas.addEventListener('touchend', () => drawing=false);
            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_8_kid9_rake', { type: 'text', data: 'Patrón de arena enviado.' });
            });
        }
    }""",
    "day_8_kid14_arashiyama": """{
        day: 8, title: "El Guardián del Bambú", role: "kid14", xp: 15, location: "Arashiyama Bamboo Grove",
        render: () => {
            return `
                <p class="mission-desc">Graba el sonido del viento entre los bambúes (10 seg).</p>
                <button id="btn-record" class="btn-secondary">🔴 Grabar Viento</button>
                <button id="btn-submit" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
            `;
        },
        attachEvents: () => {
            const btn = document.getElementById('btn-record');
            const btnSubmit = document.getElementById('btn-submit');
            let audioBlob = null;
            btn.addEventListener('click', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                let chunks = [];
                mediaRecorder.ondataavailable = e => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    btnSubmit.classList.remove('hidden');
                    stream.getTracks().forEach(t => t.stop());
                };
                mediaRecorder.start();
                btn.innerText = "⏹ Detener";
                setTimeout(() => { if(mediaRecorder.state==='recording') mediaRecorder.stop(); }, 10000);
            });
            btnSubmit.addEventListener('click', () => {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const id = 'audio_' + Date.now();
                    savePhotoToDB(id, re.target.result).then(() => {
                        submitMission('day_8_kid14_arashiyama', { type: 'mixed', data: `Viento Bambú. ID: ${id}` });
                    });
                };
                reader.readAsDataURL(audioBlob);
            });
        }
    }""",
    "day_9_kid14_heart": """{
        day: 9, title: "El Latido de la Montaña", role: "kid14", xp: 15, location: "Fushimi Inari",
        render: () => {
            return `
                <p class="mission-desc">Mide tus pulsaciones tras subir. Cuenta los latidos durante 15 segundos.</p>
                <div id="heart-timer" style="font-size:3rem; color:red; text-align:center;">15</div>
                <button id="btn-start-heart" class="btn-secondary" style="width:100%">Iniciar 15s</button>
                <div id="heart-input" class="hidden"><br>
                    <input type="number" id="bpm" placeholder="Pulsaciones (latidos x 4)" style="width:100%; padding:15px;">
                    <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:10px;">Enviar</button>
                </div>
            `;
        },
        attachEvents: () => {
            const btn = document.getElementById('btn-start-heart');
            const timer = document.getElementById('heart-timer');
            btn.addEventListener('click', () => {
                btn.disabled = true; let sec = 15;
                const it = setInterval(() => {
                    sec--; timer.innerText = sec;
                    if(sec <= 0) { clearInterval(it); document.getElementById('heart-input').classList.remove('hidden'); }
                }, 1000);
            });
            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_9_kid14_heart', { type: 'number', data: document.getElementById('bpm').value });
            });
        }
    }""",
    "day_9_kid14_gravity": """{
        day: 9, title: "La Piedra de la Gravedad", role: "kid14", xp: 15, location: "Fushimi Inari",
        render: () => {
            return `
                <p class="mission-desc">Levanta la piedra Omokaruishi. ¿Pesó más o menos de lo que imaginabas?</p>
                <button id="btn-mas" class="btn-secondary">➕ Pesó MÁS</button>
                <button id="btn-menos" class="btn-primary">➖ Pesó MENOS</button>
            `;
        },
        attachEvents: () => {
            const sub = (msg) => submitMission('day_9_kid14_gravity', { type: 'text', data: msg });
            document.getElementById('btn-mas').addEventListener('click', () => sub("Deseo tardará"));
            document.getElementById('btn-menos').addEventListener('click', () => sub("Deseo pronto"));
        }
    }""",
    "day_10_kid14_nishiki": """{
        day: 10, title: "El Dilema del Chef", role: "kid14", xp: 15, location: "Mercado Nishiki",
        render: () => {
            return `
                <p class="mission-desc">Busca el ingrediente más caro y diseña un menú imperial de 3 ingredientes.</p>
                <textarea id="menu-imperial" placeholder="Mi menú..." style="width:100%; height:80px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%; margin-top:15px;">Enviar</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_10_kid14_nishiki', { type: 'text', data: document.getElementById('menu-imperial').value });
            });
        }
    }""",
    "day_10_kid9_nishiki": """{
        day: 10, title: "El Maestro de la Chatarra", role: "kid9", xp: 15, location: "Mercado Nishiki",
        render: () => {
            return `
                <p class="mission-desc">Paga el importe exacto con monedas para no recibir cambio.</p>
                <button id="btn-submit" class="btn-primary" style="width:100%">Confirmar Pago</button>
            `;
        },
        attachEvents: () => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_10_kid9_nishiki', { type: 'text', data: 'Pago exacto realizado' });
            });
        }
    }""",
    "day_10_fam_sayonara": """{
        day: 10, title: "Sayonara Kioto (Familiar)", role: "both", xp: 30, location: "Restaurante Despedida",
        render: () => {
            return `
                <p class="mission-desc">¿Qué tradición japonesa te llevarías a España?</p>
                <textarea id="tradicion-text" placeholder="Mi respuesta..." style="width:100%; height:100px; padding:15px;"></textarea>
                <button id="btn-submit" class="btn-primary" style="width:100%">Enviar</button>
            `;
        },
        attachEvents: (role) => {
            document.getElementById('btn-submit').addEventListener('click', () => {
                submitMission('day_10_fam_sayonara', { type: 'text', data: document.getElementById('tradicion-text').value }, role, true);
            });
        }
    }"""
}

# Construir el bloque MISSIONS_CONFIG
config_entries = []
for k, v in MISSIONS.items():
    config_entries.append(f'    "{k}": {v}')

new_config_block = "const MISSIONS_CONFIG = {\n" + ",\n".join(config_entries) + "\n};"

# Reemplazar en el archivo
# Buscamos el inicio y fin del bloque MISSIONS_CONFIG actual
# (O simplemente reemplazamos todo lo que hay entre const MISSIONS_CONFIG = { y };)
new_content = re.sub(r'const MISSIONS_CONFIG = \{.*?\n\};', new_config_block, content, flags=re.DOTALL)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("MISSIONS_CONFIG reconstructed successfully.")
