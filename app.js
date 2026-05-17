// ==========================================
// 1. BASE DE DATOS Y ESTADO (localStorage + IndexedDB)
// ==========================================

const DEFAULT_STATE = {
    kid9: { 
        name: "Laura", xp: 0, level: 0, missions: {}, 
        badges: [], counters: { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true }, album: {}, album: {} 
    },
    kid14: { 
        name: "Iván", xp: 0, level: 0, missions: {},
        badges: [], counters: { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true } 
    },
    judgePIN: "1234"
};

const LEVELS_LAURA = [
    { xp: 0, title: 'Pasajera Curiosa', icon: '✈️' },
    { xp: 100, title: 'Cazadora de Yōkais', icon: '👻' },
    { xp: 200, title: 'Aprendiz de Kitsune', icon: '🦊' },
    { xp: 350, title: 'Acróbata del Bambú', icon: '🎋' },
    { xp: 550, title: 'Domadora de Ciervos', icon: '🦌' },
    { xp: 800, title: 'Gimnasta del Templo', icon: '⛩️' },
    { xp: 1150, title: 'Bailarina del Kintsugi', icon: '✨' },
    { xp: 1450, title: 'Guardiana de la Montaña', icon: '🗻' },
    { xp: 1800, title: 'Maga de los Elementos', icon: '🌪️' },
    { xp: 2200, title: 'Leyenda del Sol Naciente', icon: '👑' }
];

const LEVELS_IVAN = [
    { xp: 0, title: 'Recluta de Datos', icon: '💾' },
    { xp: 100, title: 'Analista Callejero', icon: '📊' },
    { xp: 200, title: 'Hacker de Neón', icon: '🔌' },
    { xp: 350, title: 'Operativo en las Sombras', icon: '🗡️' },
    { xp: 550, title: 'Mercenario de Rango C', icon: '⚔️' },
    { xp: 800, title: 'Estratega del Shogunato', icon: '🏯' },
    { xp: 1150, title: 'Superviviente de la Niebla', icon: '🌫️' },
    { xp: 1450, title: 'Replicante de Combate', icon: '🤖' },
    { xp: 1800, title: 'Maestro de la Materia', icon: '🔮' },
    { xp: 2200, title: 'Ronin Legendario', icon: '👑' }
];

let gameState = null;
let currentUser = null; // 'kid9', 'kid14', 'judge'
let currentDay = null; // Día que se está visualizando
let currentDayMissions = []; // Misiones del día actual
let debugUnlockAll = false; // Flag para pruebas


// ==========================================
// CONFIGURACIÓN DEL ÁLBUM DEL COLECCIONISTA
// ==========================================
const ALBUM_CONFIG = {
    "sellos": {
        id: "sellos", title: "Herbario de Sellos", emoji: "💮",
        description: "Encuentra y fotografía los sellos de tinta de estaciones y templos.",
        roles: ["kid9", "kid14"],
        slots: 9,
        hints: ["Estación de Tokio", "Templo Senso-ji", "Aeropuerto", "Estación de Kioto", "Santuario Fushimi", "Castillo Nijo"]
    },
    "tecnologia": {
        id: "tecnologia", title: "Catálogo de Tecnología", emoji: "🤖",
        description: "Documenta máquinas expendedoras raras, robots y consolas retro.",
        roles: ["kid14"],
        slots: 9,
        hints: ["Vending machine rara", "Lata con diseño anime", "Gundam en Odaiba", "Consola en Akihabara", "Gadget absurdo"]
    },
    "bestiario": {
        id: "bestiario", title: "Bestiario Mágico", emoji: "🦊",
        description: "Fotografía criaturas reales o mitológicas que te encuentres.",
        roles: ["kid9"],
        slots: 9,
        hints: ["Ciervo de Nara", "Zorro Kitsune", "Guardián Jizo", "Monos de Nikko", "Gato callejero", "Mascota de tienda"]
    },
    "arte_urbano": {
        id: "arte_urbano", title: "Galería de Arte Urbano", emoji: "🕳️",
        description: "En Japón, las tapas de alcantarilla son obras de arte. ¡Encuentra las mejores!",
        roles: ["kid9", "kid14"],
        slots: 9,
        hints: ["Alcantarilla de Osaka", "Alcantarilla de Kioto", "Alcantarilla de Fuji", "Alcantarilla de Nara", "Alcantarilla de Tokio"]
    },
    "sabores": {
        id: "sabores", title: "Almacén de Sabores Extraños", emoji: "🍡",
        description: "Una checklist visual de las comidas más raras y únicas que pruebes.",
        roles: ["kid9", "kid14"],
        slots: 9,
        hints: ["KitKat Raro", "Tako Tamago", "Marisco extraño", "Crepe de Harajuku", "Dulce tradicional"]
    },
    "simbolismo": {
        id: "simbolismo", title: "Archivo de Simbolismo", emoji: "⛩️",
        description: "Documenta amuletos, tablillas de deseos y símbolos de las familias.",
        roles: ["kid9", "kid14"],
        slots: 9,
        hints: ["Omikuji (Papel suerte)", "Tablilla Ema", "Gran Buda", "Amuleto Omamori", "Escudo Tokugawa"]
    },
    "texturas_sonidos": {
        id: "texturas_sonidos", title: "Auditoría de Texturas y Sonidos", emoji: "🎋",
        description: "Guarda texturas interesantes (fotos macro) y graba sonidos típicos.",
        roles: ["kid9", "kid14"],
        slots: 9,
        hints: ["Sonido de estación", "Textura de Tatami", "Madera tallada", "Sonido de cascada", "Textura de Bambú"]
    }
};

function loadState() {
    const saved = localStorage.getItem('japanMissionsState');
    if (saved) {
        gameState = JSON.parse(saved);
        // Migración de datos para usuarios antiguos
        ['kid9', 'kid14'].forEach(kid => {
            if (gameState[kid].level === 1 && gameState[kid].xp === 0) gameState[kid].level = 0; // Ajustar a nivel 0 (0-9)
            if (!gameState[kid].badges) gameState[kid].badges = [];
            if (!gameState[kid].counters) gameState[kid].counters = { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true };
            if (!gameState[kid].album) gameState[kid].album = {};
        });
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

// IndexedDB: funciones provistas por dbHelper.js (savePhotoToDB, getMedia, saveMedia, initIndexedDB)
// getPhotoFromDB es un alias de getMedia para compatibilidad con el panel del juez
function getPhotoFromDB(id) {
    return window.getMedia ? window.getMedia(id) : Promise.resolve(null);
}

// ==========================================
// 2. UTILIDADES
// ==========================================

const TAG_ICONS = {
    photo: '📸', video: '🎬', audio: '🎙️', writing: '✍️',
    expert: '⚡', economy: '💰', sensors: '📡', physical: '🏃',
    game: '🎮', culture: '🏯', mixed: '🔀'
};


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

function checkLevelUp(kidId) {
    const xp = gameState[kidId].xp;
    const currentLevelIndex = gameState[kidId].level;
    const levelsArr = kidId === 'kid9' ? LEVELS_LAURA : LEVELS_IVAN;
    
    let newLevelIndex = currentLevelIndex;
    for (let i = 0; i < levelsArr.length; i++) {
        if (xp >= levelsArr[i].xp) {
            newLevelIndex = i;
        } else {
            break;
        }
    }

    if (newLevelIndex > currentLevelIndex) {
        gameState[kidId].level = newLevelIndex;
        saveState();
        showLevelUpAnimation(kidId, levelsArr[newLevelIndex]);
        return true;
    }
    return false;
}

function checkBadges(kidId, missionId) {
    const config = MISSIONS_CONFIG[missionId];
    if (!config) return [];
    
    const counters = gameState[kidId].counters || { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true };
    gameState[kidId].counters = counters; // asegura que existe
    const badges = gameState[kidId].badges || [];
    gameState[kidId].badges = badges;
    
    let newBadges = [];

    // medalla_olimpica (5 físicas aprobadas)
    if (config.tag === 'physical') {
        counters.physicalStreak++;
        if (counters.physicalStreak >= 5 && !badges.includes('medalla_olimpica')) {
            badges.push('medalla_olimpica');
            newBadges.push({id: 'medalla_olimpica', title: 'Medalla Olímpica', icon: '🥇'});
        }
    }

    // bateria_inagotable (3 enviadas en horario extremo)
    const hour = new Date().getHours();
    if (hour < 8 || hour >= 22) {
        counters.earlyLateSubmissions++;
        if (counters.earlyLateSubmissions >= 3 && !badges.includes('bateria_inagotable')) {
            badges.push('bateria_inagotable');
            newBadges.push({id: 'bateria_inagotable', title: 'Batería Inagotable', icon: '🔋'});
        }
    }

    // sincronizacion_perfecta
    if (config.role === 'both') {
        counters.perfectJointMissions++;
        if (counters.perfectJointMissions >= 5 && !badges.includes('sincronizacion_perfecta')) {
            badges.push('sincronizacion_perfecta');
            newBadges.push({id: 'sincronizacion_perfecta', title: 'Sincronización Perfecta', icon: '🤝'});
        }
    }
    
    // estomago_acero (comida rara)
    const titleLower = config.title.toLowerCase();
    if (titleLower.includes('takoyaki') || titleLower.includes('vending') || titleLower.includes('bento') || titleLower.includes('mochi')) {
        counters.foodMissions = (counters.foodMissions || 0) + 1;
        if (counters.foodMissions >= 3 && !badges.includes('estomago_acero')) {
            badges.push('estomago_acero');
            newBadges.push({id: 'estomago_acero', title: 'Estómago de Acero', icon: '🍜'});
        }
    }
    
    // criptografo_elite
    if (config.tag === 'expert' || titleLower.includes('código') || titleLower.includes('terminal')) {
        counters.expertMissions = (counters.expertMissions || 0) + 1;
        if (counters.expertMissions >= 3 && !badges.includes('criptografo_elite') && counters.cryptoSolvedFirstTry) {
            badges.push('criptografo_elite');
            newBadges.push({id: 'criptografo_elite', title: 'Criptógrafo de Élite', icon: '🔐'});
        }
    }

    saveState();
    return newBadges;
}

function showLevelUpAnimation(kidId, levelData) {
    const modal = document.getElementById('level-up-modal');
    if (!modal) return;
    
    document.getElementById('level-up-title').innerText = "¡NUEVO RANGO ALCANZADO!";
    document.getElementById('level-up-rank').innerText = levelData.title;
    document.getElementById('level-up-icon').innerText = levelData.icon;
    
    modal.classList.remove('hidden');
    
    if (kidId === 'kid9') {
        launchSakuraParticles();
    } else {
        launchMatrixCode();
    }
}

// Dummy functions for animations until we implement them in DOM
function launchSakuraParticles() { launchConfetti(); }
function launchMatrixCode() { launchConfetti(); }
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

    // Lógica Bottom Nav
    const bottomNav = document.getElementById('bottom-nav');
    if (viewId === 'view-days' || viewId === 'view-passport' || viewId === 'view-album' || viewId === 'view-album-category') {
        bottomNav.classList.remove('hidden');
        // Actualizar tabs activas
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        if (viewId === 'view-days') document.getElementById('nav-btn-missions').classList.add('active');
        if (viewId === 'view-passport') document.getElementById('nav-btn-passport').classList.add('active');
    } else {
        bottomNav.classList.add('hidden');
    }
}

function renderDaysList(role) {
    currentUser = role;
    currentDay = null;
    currentDayMissions = [];
    const list = document.getElementById('days-list');
    list.innerHTML = '';
    
    // Aplicar Tema Dinámico
    document.body.className = role === 'kid9' ? 'theme-laura' : 'theme-ivan';
    
    // Header Stats y Lógica de Niveles
    const levelsArr = role === 'kid9' ? LEVELS_LAURA : LEVELS_IVAN;
    const currentLevelIdx = gameState[role].level;
    const currentLevelData = levelsArr[currentLevelIdx];
    const nextLevelData = currentLevelIdx < levelsArr.length - 1 ? levelsArr[currentLevelIdx + 1] : null;
    
    document.getElementById('user-level').innerText = `Lvl ${currentLevelIdx}`;
    document.getElementById('user-xp').innerText = gameState[role].xp;
    
    if (nextLevelData) {
        document.getElementById('user-next-xp').innerText = nextLevelData.xp;
        const xpInLevel = gameState[role].xp - currentLevelData.xp;
        const xpRequiredForNext = nextLevelData.xp - currentLevelData.xp;
        const percent = Math.min(100, Math.floor((xpInLevel / xpRequiredForNext) * 100));
        document.getElementById('user-xp-fill').style.width = `${percent}%`;
    } else {
        document.getElementById('user-next-xp').innerText = "MAX";
        document.getElementById('user-xp-fill').style.width = `100%`;
    }
    
    // Mostrar Título y Badge del nivel actual
    const levelTitleDiv = document.getElementById('user-level-title');
    if(levelTitleDiv) {
        levelTitleDiv.innerText = `${currentLevelData.icon} ${currentLevelData.title}`;
    }

    // Renderizar Clasificación (Leaderboard)
    renderLeaderboard(list);

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

function renderLeaderboard(container) {
    const card = document.createElement('div');
    card.className = 'card leaderboard-card';
    card.innerHTML = `<h3 style="margin-bottom:10px;">🏆 Clasificación Hermanos</h3>`;
    
    ['kid9', 'kid14'].forEach(kid => {
        const levelsArr = kid === 'kid9' ? LEVELS_LAURA : LEVELS_IVAN;
        const currentLvlIdx = gameState[kid].level;
        const currentLvlData = levelsArr[currentLvlIdx];
        const nextLvlData = currentLvlIdx < levelsArr.length - 1 ? levelsArr[currentLvlIdx + 1] : null;
        
        let percent = 100;
        if(nextLvlData) {
            const xpInLevel = gameState[kid].xp - currentLvlData.xp;
            const xpRequired = nextLvlData.xp - currentLvlData.xp;
            percent = Math.min(100, Math.floor((xpInLevel / xpRequired) * 100));
        }

        const badgesHtml = (gameState[kid].badges || []).map(bId => {
            // Find badge icon (we can map it quickly)
            const bMap = {
                'medalla_olimpica': '🥇',
                'criptografo_elite': '🔐',
                'estomago_acero': '🍜',
                'bateria_inagotable': '🔋',
                'sincronizacion_perfecta': '🤝'
            };
            return `<span title="${bId}" style="font-size:1.5rem;">${bMap[bId] || '🏅'}</span>`;
        }).join(' ');

        const row = document.createElement('div');
        row.className = `leaderboard-row ${kid === currentUser ? 'active' : ''}`;
        row.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                <strong>${gameState[kid].name}</strong>
                <span>${currentLvlData.icon} Lvl ${currentLvlIdx} (${gameState[kid].xp} XP)</span>
            </div>
            <div class="xp-bar" style="height:8px; margin-bottom:5px;">
                <div class="xp-fill ${kid === 'kid9' ? 'laura-fill' : 'ivan-fill'}" style="width: ${percent}%;"></div>
            </div>
            <div class="badges-container">${badgesHtml}</div>
        `;
        card.appendChild(row);
    });
    
    container.appendChild(card);
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
        // Misión conjunta: marcar pending para AMBOS perfiles inmediatamente
        const submission = { ...submissionData, timestamp: new Date().toISOString() };
        ['kid9', 'kid14'].forEach(kid => {
            if (gameState[kid].missions[missionId]) {
                gameState[kid].missions[missionId].status = 'pending';
                gameState[kid].missions[missionId].submission = submission;
            }
        });
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
            let parts = p.data.submission.data.split('. Foto ID: ');
            if (parts.length === 1) parts = p.data.submission.data.split('. Foto: ');
            
            if (parts.length > 1) {
                const photoData = await getPhotoFromDB(parts[parts.length - 1]);
                const textData = parts.slice(0, -1).join('. ');
                dataHtml = `<b>${textData}</b><br><img src="${photoData}" alt="Evidencia" style="width:100%; border-radius:10px; margin-top:10px;">`;
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
    let leveledUp = false;
    let newBadges = [];

    if (isFamily) {
        gameState['kid9'].missions[missionId].status = 'approved';
        gameState['kid14'].missions[missionId].status = 'approved';
        gameState['kid9'].xp += xp;
        gameState['kid14'].xp += xp;
        
        let l1 = checkLevelUp('kid9');
        let l2 = checkLevelUp('kid14');
        leveledUp = l1 || l2;
        
        let b1 = checkBadges('kid9', missionId);
        let b2 = checkBadges('kid14', missionId);
        if(b1.length) newBadges.push(...b1);
        if(b2.length) newBadges.push(...b2);

    } else {
        gameState[kid].missions[missionId].status = 'approved';
        gameState[kid].xp += xp;
        
        leveledUp = checkLevelUp(kid);
        newBadges = checkBadges(kid, missionId);
    }
    saveState();
    
    if (newBadges.length > 0) {
        showAlert('¡Insignia Desbloqueada!', `Has conseguido: ${newBadges.map(b => b.icon + ' ' + b.title).join(', ')}`);
    }

    if (!leveledUp) {
        launchConfetti(); // Si subió de nivel ya lanza su propia animación
    }
    renderJudgePanel();
};

window.rejectMission = (kid, missionId) => {
    gameState[kid].missions[missionId].status = 'unlocked';
    gameState[kid].missions[missionId].submission = null;
    
    // Si falla, rompemos las rachas (para medalla olimpica o criptografo_elite)
    if(gameState[kid].counters) {
        gameState[kid].counters.physicalStreak = 0;
        if(MISSIONS_CONFIG[missionId] && (MISSIONS_CONFIG[missionId].tag === 'expert' || MISSIONS_CONFIG[missionId].title.includes('Terminal'))) {
            gameState[kid].counters.cryptoSolvedFirstTry = false;
        }
    }
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

document.getElementById('nav-btn-home').addEventListener('click', () => {
    switchView('view-home', false);
    currentUser = null;
    document.body.className = ''; // Limpiar tema
});

document.getElementById('nav-btn-missions').addEventListener('click', () => {
    if (currentUser && currentUser !== 'judge') {
        renderDaysList(currentUser);
    }
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

document.getElementById('nav-btn-passport').addEventListener('click', () => {
    if (!currentUser || currentUser === 'judge') {
        showAlert('Atención', 'Selecciona un explorador primero para ver el pasaporte.');
        return;
    }
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
        btn.style.color = 'var(--color-bg)';
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
    if (window.initIndexedDB) await window.initIndexedDB();
    switchView('view-home', false);
};

// ==========================================
// LÓGICA DEL ÁLBUM DEL COLECCIONISTA
// ==========================================
let currentAlbumCategory = null;

document.getElementById('btn-open-album').addEventListener('click', () => {
    if (!currentUser || currentUser === 'judge') return;
    renderAlbumList();
});

function renderAlbumList() {
    const listContainer = document.getElementById('album-categories-list');
    listContainer.innerHTML = '';
    
    // Filtramos las categorías disponibles para el usuario activo
    const availableCategories = Object.values(ALBUM_CONFIG).filter(cat => cat.roles.includes(currentUser));
    
    availableCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-title">${cat.emoji} ${cat.title}</div>
            <p style="font-size:0.9rem; color:var(--color-gray-dark)">${cat.description}</p>
        `;
        card.addEventListener('click', () => renderAlbumCategory(cat.id));
        listContainer.appendChild(card);
    });
    
    switchView('view-album', true, "Álbum del Coleccionista");
}

async function renderAlbumCategory(categoryId) {
    currentAlbumCategory = categoryId;
    const cat = ALBUM_CONFIG[categoryId];
    
    document.getElementById('album-category-title').innerText = cat.emoji + " " + cat.title;
    document.getElementById('album-category-desc').innerText = cat.description;
    
    const grid = document.getElementById('album-grid');
    grid.innerHTML = ''; // Limpiar
    
    // Verificar que existe el array de estado del álbum
    if (!gameState[currentUser].album[categoryId]) {
        gameState[currentUser].album[categoryId] = [];
    }
    // Compatibilidad si se creó como objeto
    if (!Array.isArray(gameState[currentUser].album[categoryId])) {
        gameState[currentUser].album[categoryId] = [];
    }
    
    const savedIndexes = gameState[currentUser].album[categoryId];
    
    let maxIndex = cat.slots - 1;
    if (savedIndexes.length > 0) {
        maxIndex = Math.max(maxIndex, Math.max(...savedIndexes));
    }
    
    // Calculamos los slots a renderizar: Todos los fijos, los dinámicos llenos, y UN hueco extra siempre al final.
    const renderCount = maxIndex + 2; 
    
    for (let i = 0; i < renderCount; i++) {
        const slotId = `album_${currentUser}_${categoryId}_${i}`;
        
        const div = document.createElement('div');
        div.className = 'album-slot';
        
        let dataUrl = null;
        if (window.getMedia) {
            // Para no sobrecargar IndexedDB, solo buscamos si está en los índices salvados, o si pertenece a los cat.slots originales
            if (i < cat.slots || savedIndexes.includes(i)) {
                dataUrl = await window.getMedia(slotId);
                if (dataUrl && !savedIndexes.includes(i)) {
                    savedIndexes.push(i);
                    saveState();
                }
            }
        }
        
        if (dataUrl) {
            div.classList.add('filled');
            if (dataUrl.startsWith('data:audio')) {
                div.classList.add('audio-slot');
                div.innerText = '🔊';
                div.addEventListener('click', () => {
                    const audio = new Audio(dataUrl);
                    audio.play();
                });
            } else {
                const img = document.createElement('img');
                img.src = dataUrl;
                div.appendChild(img);
                
                div.addEventListener('click', () => {
                    if (confirm('¿Quieres borrar esta foto del álbum?')) {
                        if(window.deleteMedia) {
                            window.deleteMedia(slotId).then(() => {
                                const indexToRemove = savedIndexes.indexOf(i);
                                if (indexToRemove > -1) {
                                    savedIndexes.splice(indexToRemove, 1);
                                    saveState();
                                }
                                renderAlbumCategory(categoryId);
                            });
                        }
                    }
                });
            }
        } else {
            // Slot vacío
            let hint = cat.hints[i];
            let isExtraSlot = false;
            
            if (i >= cat.slots) {
                hint = 'Añadir más...';
                isExtraSlot = true;
            } else if (!hint) {
                hint = 'Buscar...';
            }
            
            div.innerHTML = `
                <div class="album-icon" ${isExtraSlot ? 'style="color: var(--color-primary);"' : ''}>${categoryId === 'texturas_sonidos' ? '📸/🎙️' : (isExtraSlot ? '➕' : '📸')}</div>
                <div class="album-hint" ${isExtraSlot ? 'style="color: var(--color-primary);"' : ''}>${hint}</div>
            `;
            
            if (isExtraSlot) {
                div.style.borderStyle = 'dashed';
                div.style.borderColor = 'var(--color-primary)';
            }
            
            div.addEventListener('click', () => {
                const input = document.getElementById('album-camera-input');
                if (categoryId === 'texturas_sonidos' && confirm('¿Quieres grabar un Sonido en lugar de tomar una Foto?')) {
                    input.accept = 'audio/*';
                    input.removeAttribute('capture'); 
                } else {
                    input.accept = 'image/*';
                    input.setAttribute('capture', 'environment');
                }
                
                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    try {
                        let resultDataUrl = "";
                        if (file.type.startsWith('audio/')) {
                            const reader = new FileReader();
                            reader.onload = async (re) => {
                                await window.saveMedia(slotId, re.target.result);
                                if (!savedIndexes.includes(i)) savedIndexes.push(i);
                                saveState();
                                renderAlbumCategory(categoryId);
                            };
                            reader.readAsDataURL(file);
                            return;
                        } else {
                            const bmp = await createImageBitmap(file);
                            const canvas = document.createElement('canvas');
                            const MAX = 800;
                            let w = bmp.width;
                            let h = bmp.height;
                            if (w > h) { if (w > MAX) { h *= MAX/w; w = MAX; } } 
                            else { if (h > MAX) { w *= MAX/h; h = MAX; } }
                            canvas.width = w; canvas.height = h;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(bmp, 0, 0, w, h);
                            resultDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                            
                            await window.saveMedia(slotId, resultDataUrl);
                            if (!savedIndexes.includes(i)) savedIndexes.push(i);
                            saveState();
                            renderAlbumCategory(categoryId);
                        }
                    } catch (err) {
                        showAlert('Error', 'No se pudo guardar la captura.');
                        console.error(err);
                    }
                };
                
                input.click();
            });
        }
        
        grid.appendChild(div);
    }
    
    switchView('view-album-category', true, cat.title);
}
