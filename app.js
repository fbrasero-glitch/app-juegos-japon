// ==========================================
// 1. BASE DE DATOS Y ESTADO (localStorage + IndexedDB)
// ==========================================

const DEFAULT_STATE = {
    kid9: { name: "Explorador Pequeño", xp: 0, level: 1, missions: {} },
    kid14: { name: "Navegante Mayor", xp: 0, level: 1, missions: {} },
    judgePIN: "1234"
};

let gameState = null;
let currentUser = null; // 'kid9', 'kid14', 'judge'
let currentDay = null; // Día que se está visualizando
let currentDayMissions = []; // Misiones del día actual
let debugUnlockAll = false; // Flag para pruebas

function loadState() {
    const saved = localStorage.getItem('japanMissionsState');
    if (saved) {
        gameState = JSON.parse(saved);
    } else {
        gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
    }
}

function saveState() {
    localStorage.setItem('japanMissionsState', JSON.stringify(gameState));
}

// Inicializar misiones vacías si no existen
function initMissionsForDay(dayStr, missionIds) {
    ['kid9', 'kid14'].forEach(kid => {
        missionIds.forEach(id => {
            if (!gameState[kid].missions[id]) {
                gameState[kid].missions[id] = { status: "unlocked", submission: null, day: dayStr };
            }
        });
    });
    saveState();
}

// --- IndexedDB para Imágenes ---
const DB_NAME = "JapanMissionsDB";
const STORE_NAME = "photos";
let idbStore = null;

function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        request.onsuccess = event => {
            idbStore = event.target.result;
            resolve();
        };
        request.onerror = event => reject(event.target.error);
    });
}

function savePhotoToDB(id, base64Data) {
    return new Promise((resolve, reject) => {
        const tx = idbStore.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put({ id: id, data: base64Data });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

function getPhotoFromDB(id) {
    return new Promise((resolve, reject) => {
        const tx = idbStore.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => reject(req.error);
    });
}

// ==========================================
// 2. UTILIDADES
// ==========================================

function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
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
                // Comprimir a JPEG con 0.6 de calidad
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const emojis = ['🌸', '🦊', '✨', '🎉', '🍣', '🗻'];
    container.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
        const span = document.createElement('span');
        span.className = 'confetti-piece';
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (Math.random() * 2 + 2) + 's';
        span.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(span);
    }

    setTimeout(() => { container.innerHTML = ''; }, 5000);
}

function showAlert(title, message) {
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-message').innerText = message;
    document.getElementById('alert-modal').classList.remove('hidden');
}

document.getElementById('btn-alert-ok').addEventListener('click', () => {
    document.getElementById('alert-modal').classList.add('hidden');
});

function addXP(player, amount) {
    gameState[player].xp += amount;
    const oldLevel = gameState[player].level;
    gameState[player].level = Math.floor(gameState[player].xp / 100) + 1;
    saveState();
    return gameState[player].level > oldLevel;
}

function getPendingMissions() {
    const pending = [];
    ['kid9', 'kid14'].forEach(kid => {
        Object.keys(gameState[kid].missions).forEach(mId => {
            if (gameState[kid].missions[mId].status === 'pending') {
                pending.push({
                    kid: kid,
                    missionId: mId,
                    data: gameState[kid].missions[mId],
                    config: MISSIONS_CONFIG[mId]
                });
            }
        });
    });
    return pending;
}

// ==========================================
// 4. CONTROLADORES UI Y ENRUTAMIENTO
// ==========================================

function switchView(viewId, showHeader = true, headerTitle = "Misiones") {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    
    const header = document.getElementById('main-header');
    if (showHeader) {
        header.classList.remove('hidden');
        document.getElementById('header-title').innerText = headerTitle;
    } else {
        header.classList.add('hidden');
    }
}

function renderDaysList(role) {
    currentUser = role;
    currentDay = null;
    currentDayMissions = [];
    const list = document.getElementById('days-list');
    list.innerHTML = '';
    
    // Header Stats
    document.getElementById('user-level').innerText = `Lvl ${gameState[role].level}`;
    document.getElementById('user-xp').innerText = gameState[role].xp;
    document.getElementById('user-next-xp').innerText = gameState[role].level * 100;
    const percent = (gameState[role].xp % 100);
    document.getElementById('user-xp-fill').style.width = `${percent}%`;

    // Group missions by day
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    let prevDayApproved = true;

    days.forEach(dayNum => {
        // Encontrar misiones del usuario para este día
        const mKeys = Object.keys(MISSIONS_CONFIG).filter(k => 
            MISSIONS_CONFIG[k].day === dayNum && (MISSIONS_CONFIG[k].role === role || MISSIONS_CONFIG[k].role === 'both')
        );
        if (mKeys.length === 0) return;

        // Asegurarse de que existan en el state
        initMissionsForDay(`day_${dayNum}`, mKeys);

        // Check if all missions in this day are approved
        let allApproved = true;
        let anyPending = false;
        mKeys.forEach(k => {
            const m = gameState[role].missions[k];
            if (m.status !== 'approved') allApproved = false;
            if (m.status === 'pending') anyPending = true;
        });

        const isLocked = !prevDayApproved && !debugUnlockAll;
        
        const card = document.createElement('div');
        card.className = `card ${isLocked ? 'locked' : ''}`;
        card.innerHTML = `
            <div class="card-title">Día ${dayNum} ${isLocked ? '🔒' : (allApproved ? '✅' : '🚀')}</div>
            <p style="font-size:0.9rem; color:var(--color-gray-dark)">${mKeys.length} misiones</p>
        `;
        if (!isLocked) {
            card.addEventListener('click', () => renderDayMissions(role, dayNum, mKeys));
        }
        list.appendChild(card);

        prevDayApproved = allApproved; // Para el día siguiente
    });

    switchView('view-days', true, gameState[role].name);
}

function renderDayMissions(role, dayNum, missionKeys) {
    currentDay = dayNum;
    currentDayMissions = missionKeys;
    const list = document.getElementById('days-list');
    list.innerHTML = ''; // Reutilizamos el contenedor para mostrar las misiones del día

    missionKeys.forEach(k => {
        const conf = MISSIONS_CONFIG[k];
        const state = gameState[role].missions[k];
        const card = document.createElement('div');
        card.className = 'card';
        
        let statusHtml = '';
        if (state.status === 'pending') statusHtml = `<span class="status-badge status-pending">⏳ Esperando Juez</span>`;
        else if (state.status === 'approved') statusHtml = `<span class="status-badge status-approved">✅ Completada</span>`;
        
        const tagIcon = TAG_ICONS[conf.tag] || '❓';
        const tagLabel = conf.tag ? conf.tag.charAt(0).toUpperCase() + conf.tag.slice(1) : 'Misión';
        const tagHtml = conf.tag ? `<div class="mission-tag tag-${conf.tag}">${tagIcon} ${tagLabel}</div>` : '';

        card.innerHTML = `
            ${tagHtml}
            <div class="card-title">${conf.title} <span style="font-size:0.8rem; color:var(--color-accent)">+${conf.xp}XP</span></div>
            <div style="font-size:0.8rem; color:var(--color-gray-dark); margin-bottom:5px;">📍 ${conf.location || 'Cualquier lugar'}</div>
            ${statusHtml}
        `;
        
        card.addEventListener('click', () => {
            if (state.status === 'approved' && !debugUnlockAll) {
                showAlert('Misión completada', '¡Ya has superado esta prueba! Activa el Modo Test en el inicio para volver a realizarla.');
            } else if (state.status === 'pending' && !debugUnlockAll) {
                showAlert('En revisión', 'El Juez Supremo está evaluando tu entrega. Activa el Modo Test en el inicio para volver a realizarla.');
            } else {
                renderMissionDetail(k, role);
            }
        });
        
        list.appendChild(card);
    });

    switchView('view-days', true, `Día ${dayNum}`);
}

function renderMissionDetail(missionId, role) {
    // Limpiar recursos de la misión anterior (AudioContext, GPS, timers...)
    if (window._missionCleanup) { window._missionCleanup(); window._missionCleanup = null; }
    const conf = MISSIONS_CONFIG[missionId];
    const container = document.getElementById('mission-content');
    container.innerHTML = `
        <h2 class="mission-title">${conf.title}</h2>
        <div style="text-align:center; color:var(--color-accent); margin-bottom:15px; font-weight:bold;">📍 ${conf.location || 'Cualquier lugar'}</div>
        ${conf.render(role)}
    `;
    switchView('view-mission', true, "Misión");
    conf.attachEvents(role);
}

function submitMission(missionId, submissionData, role = currentUser, isFamily = false) {
    if (isFamily) {
        // Lógica especial si es familia: si ambos marcaron sus checks, pasa a pending
        if (submissionData.data.kid9 && submissionData.data.kid14) {
            gameState['kid9'].missions[missionId].status = 'pending';
            gameState['kid9'].missions[missionId].submission = submissionData;
            gameState['kid14'].missions[missionId].status = 'pending';
            gameState['kid14'].missions[missionId].submission = submissionData;
        } else {
            // Solo guarda estado parcial
            gameState['kid9'].missions[missionId].data = submissionData.data;
            gameState['kid14'].missions[missionId].data = submissionData.data;
            saveState();
            showAlert('Guardado', 'Esperando a que el otro explorador complete su parte.');
            return;
        }
    } else {
        gameState[role].missions[missionId].status = 'pending';
        gameState[role].missions[missionId].submission = {
            ...submissionData,
            timestamp: new Date().toISOString()
        };
    }
    saveState();
    showAlert('Enviado', '¡Tu misión ha sido enviada al Juez Supremo!');
    renderDayMissions(role, currentDay, currentDayMissions);
}

window.attachCameraFlow = function(btnId, missionId, role = currentUser, isFamily = false) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    if (btn.nextElementSibling && btn.nextElementSibling.classList.contains('hidden-camera-input')) {
        return; // Event listeners already attached
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.capture = 'environment';
    input.className = 'hidden-camera-input';
    input.style.display = 'none';
    btn.parentNode.insertBefore(input, btn.nextSibling);
    
    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const originalText = btn.innerText;
        btn.innerText = '⏳ Procesando...';
        btn.disabled = true;
        
        try {
            if (file.type.startsWith('video/')) {
                submitMission(missionId, {type: 'video', data: 'Vídeo guardado en la galería del explorador. ¡Pídele que te lo enseñe!'}, role, isFamily);
            } else {
                const compressed = await compressImage(file);
                const photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                await savePhotoToDB(photoId, compressed);
                submitMission(missionId, {type: 'photo', data: photoId}, role, isFamily);
            }
        } catch (err) {
            console.error(err);
            showAlert('Error', 'No se pudo procesar el archivo. Reinténtalo.');
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

    btn.addEventListener('click', () => {
        input.click();
    });
};

// ==========================================
// 5. PANEL DEL JUEZ
// ==========================================

async function renderJudgePanel() {
    currentUser = 'judge';
    const list = document.getElementById('pending-missions-list');
    list.innerHTML = '';

    const pendings = getPendingMissions();
    
    if (pendings.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px;">No hay misiones pendientes.</p>';
    }

    for (const p of pendings) {
        const card = document.createElement('div');
        card.className = 'card submission-item';
        
        const kidName = gameState[p.kid].name;
        let dataHtml = '';

        if (p.data.submission.type === 'number' || p.data.submission.type === 'text') {
            dataHtml = `<b>Respuesta:</b> ${p.data.submission.data}`;
        } else if (p.data.submission.type === 'photo') {
            const photoData = await getPhotoFromDB(p.data.submission.data);
            dataHtml = `<img src="${photoData}" alt="Evidencia" style="width:100%; border-radius:10px;">`;
        } else if (p.data.submission.type === 'video' || p.data.submission.type === 'audio') {
            dataHtml = `<b>Evidencia Multimedia:</b> ${p.data.submission.data}`;
        } else if (p.data.submission.type === 'game') {
            dataHtml = `<b>Resultado de la Prueba:</b> ${p.data.submission.data}`;
        } else if (p.data.submission.type === 'photo_choice') {
            const photoData = await getPhotoFromDB(p.data.submission.data.photoId);
            dataHtml = `
                <img src="${photoData}" alt="Evidencia" style="width:100%; border-radius:10px; margin-bottom:10px;"><br>
                <b>Elección:</b> ${p.data.submission.data.choice}
            `;
        } else if (p.data.submission.type === 'mixed') {
            const parts = p.data.submission.data.split('. Foto ID: ');
            if (parts.length > 1) {
                const photoData = await getPhotoFromDB(parts[1]);
                dataHtml = `<b>${parts[0]}</b><br><img src="${photoData}" alt="Evidencia" style="width:100%; border-radius:10px; margin-top:10px;">`;
            } else {
                dataHtml = `<b>Respuesta:</b> ${p.data.submission.data}`;
            }
        } else if (p.data.submission.type === 'family') {
            dataHtml = `<b>¡Hazaña completada en equipo!</b>`;
        }
        
        if (p.config.correctAnswer) {
            dataHtml += `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--color-gray-light);">
                <b style="color: var(--color-accent);">💡 Respuesta Esperada:</b><br>
                <span style="font-size: 0.9rem; color: var(--color-gray-dark);">${p.config.correctAnswer}</span>
            </div>`;
        }

        let actionsHtml = `
            <button class="btn-reject" onclick="rejectMission('${p.kid}', '${p.missionId}')">❌ Rechazar</button>
            <button class="btn-approve" onclick="approveMission('${p.kid}', '${p.missionId}', ${p.config.xp}, ${p.data.submission.type === 'family'})">✅ Aprobar</button>
        `;

        if (p.missionId === 'day_5_gymnast') {
            actionsHtml = `
            <div style="width:100%; margin-bottom:10px; background:var(--color-black); border-radius:10px; padding:10px;">
                <p style="text-align:center; font-size:0.9rem; margin-bottom:5px;">Puntuación de Estilo Extra:</p>
                <div style="display:flex; justify-content:space-between; gap:5px;">
                    <button class="btn-secondary" style="flex:1; font-size:0.8rem; padding:5px; border-color:#cd7f32; color:#cd7f32;" onclick="approveMission('${p.kid}', '${p.missionId}', ${p.config.xp + 5}, false)">🥉 +5</button>
                    <button class="btn-secondary" style="flex:1; font-size:0.8rem; padding:5px; border-color:#c0c0c0; color:#c0c0c0;" onclick="approveMission('${p.kid}', '${p.missionId}', ${p.config.xp + 10}, false)">🥈 +10</button>
                    <button class="btn-primary" style="flex:1; font-size:0.8rem; padding:5px; background:#ffd700; color:#000;" onclick="approveMission('${p.kid}', '${p.missionId}', ${p.config.xp + 15}, false)">🥇 +15</button>
                </div>
            </div>
            ` + actionsHtml;
        }

        card.innerHTML = `
            <div class="card-title">${p.config.title}</div>
            <div class="submission-meta">👤 ${kidName} | 📅 Día ${p.config.day} | 📍 ${p.config.location || 'N/A'}</div>
            <div class="submission-data">${dataHtml}</div>
            <div class="judge-actions" style="flex-wrap:wrap;">
                ${actionsHtml}
            </div>
        `;
        list.appendChild(card);
    }

    switchView('view-judge', true, "Panel del Juez");
}

window.approveMission = (kid, missionId, xp, isFamily) => {
    if (isFamily) {
        gameState['kid9'].missions[missionId].status = 'approved';
        gameState['kid14'].missions[missionId].status = 'approved';
        addXP('kid9', xp);
        addXP('kid14', xp);
    } else {
        gameState[kid].missions[missionId].status = 'approved';
        addXP(kid, xp);
    }
    saveState();
    launchConfetti();
    renderJudgePanel();
};

window.rejectMission = (kid, missionId) => {
    gameState[kid].missions[missionId].status = 'unlocked';
    gameState[kid].missions[missionId].submission = null;
    saveState();
    renderJudgePanel();
};

// ==========================================
// 6. EVENT LISTENERS Y ARRANQUE
// ==========================================

document.getElementById('btn-judge-secret').addEventListener('click', () => {
    document.getElementById('judge-modal').classList.remove('hidden');
    document.getElementById('judge-pin-input').value = '';
});

document.getElementById('btn-judge-cancel').addEventListener('click', () => {
    document.getElementById('judge-modal').classList.add('hidden');
});

document.getElementById('btn-judge-login').addEventListener('click', () => {
    const pin = document.getElementById('judge-pin-input').value;
    if (pin === gameState.judgePIN) {
        document.getElementById('judge-modal').classList.add('hidden');
        renderJudgePanel();
    } else {
        showAlert('Error', 'PIN incorrecto');
    }
});

document.querySelectorAll('.btn-profile').forEach(btn => {
    btn.addEventListener('click', function() {
        const role = this.getAttribute('data-role');
        renderDaysList(role);
    });
});

document.getElementById('btn-switch-user').addEventListener('click', () => {
    switchView('view-home', false);
    currentUser = null;
});

document.getElementById('btn-back').addEventListener('click', () => {
    // Limpiar recursos de misión activa al navegar atrás
    if (window._missionCleanup) { window._missionCleanup(); window._missionCleanup = null; }
    
    if (currentUser === 'judge') {
        switchView('view-home', false);
    } else if (currentUser) {
        const isMissionView = !document.getElementById('view-mission').classList.contains('hidden');
        const isPassportView = !document.getElementById('view-passport').classList.contains('hidden');
        
        if (isMissionView) {
            // Estábamos en una prueba -> volver al día
            renderDayMissions(currentUser, currentDay, currentDayMissions);
        } else if (isPassportView) {
            // Estábamos en el pasaporte -> volver a la lista de días o home
            renderDaysList(currentUser);
        } else {
            // Estamos en view-days
            if (currentDay !== null) {
                // Estábamos en un día concreto -> volver a elección de día
                renderDaysList(currentUser);
            } else {
                // Estábamos en elección de día -> volver al menú inicial
                switchView('view-home', false);
                currentUser = null;
            }
        }
    } else {
        // En cualquier otro caso, ir al inicio
        switchView('view-home', false);
    }
});

document.getElementById('btn-passport').addEventListener('click', () => {
    // Simple render para el pasaporte
    const gallery = document.getElementById('passport-gallery');
    gallery.innerHTML = `
        <div class="card">
            <h3>🦊 ${gameState.kid9.name}</h3>
            <p>Nivel ${gameState.kid9.level} (${gameState.kid9.xp} XP)</p>
        </div>
        <div class="card">
            <h3>🐉 ${gameState.kid14.name}</h3>
            <p>Nivel ${gameState.kid14.level} (${gameState.kid14.xp} XP)</p>
        </div>
    `;
    switchView('view-passport', true, "Pasaporte");
});

document.getElementById('btn-debug-unlock').addEventListener('click', () => {
    debugUnlockAll = !debugUnlockAll;
    const btn = document.getElementById('btn-debug-unlock');
    if (debugUnlockAll) {
        btn.style.backgroundColor = 'var(--color-accent)';
        btn.style.color = 'var(--color-white)';
    } else {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = 'var(--color-accent)';
    }
    showAlert('Modo Pruebas', debugUnlockAll ? '✅ Todas las misiones desbloqueadas para pruebas.' : '❌ Modo pruebas desactivado.');
});

document.getElementById('btn-close-celebration').addEventListener('click', () => {
    document.getElementById('celebration-modal').classList.add('hidden');
    switchView('view-home', false);
});

// Inicialización
window.onload = async () => {
    loadState();
    await initIndexedDB();
    switchView('view-home', false);
};
