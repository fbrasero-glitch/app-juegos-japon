// ==========================================
// 1. BASE DE DATOS Y ESTADO (localStorage + IndexedDB)
// ==========================================

const DEFAULT_STATE = {
    kid9: { 
        name: "Laura", xp: 0, level: 0, missions: {}, 
        badges: [], counters: { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true }, album: {}, rewards: {} 
    },
    kid14: { 
        name: "Iván", xp: 0, level: 0, missions: {},
        badges: [], counters: { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true }, album: {}, rewards: {} 
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
let currentJudgeTab = 'pending'; // Pestaña activa del juez ('pending' | 'approved')
let judgeListenersBound = false;


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
            if (!gameState[kid].rewards) gameState[kid].rewards = {};
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
    
    // Si hay una misión en curso y se muestra un error, fallo o advertencia, incrementamos el contador de intentos
    if (window._missionStartTime) {
        const t = title.toLowerCase();
        const m = message.toLowerCase();
        const keywords = ['error', 'fallo', 'incorrecto', 'intentos', 'fallaste', 'revisa', 'de nuevo', 'inválido'];
        const hasKeyword = keywords.some(k => t.includes(k) || m.includes(k));
        if (hasKeyword) {
            window._missionAttempts = (window._missionAttempts || 1) + 1;
            console.log(`Intento de misión fallido detectado. Total intentos: ${window._missionAttempts}`);
        }
    }
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
    if (!gameState) return pending;
    ['kid9', 'kid14'].forEach(kid => {
        if (!gameState[kid] || !gameState[kid].missions) return;
        Object.keys(gameState[kid].missions).forEach(mId => {
            if (gameState[kid].missions[mId] && gameState[kid].missions[mId].status === 'pending') {
                if (!MISSIONS_CONFIG[mId]) {
                    console.warn(`Mission config not found for key: ${mId}. Skipping to prevent crashes.`);
                    return;
                }
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

function getApprovedMissions() {
    const approved = [];
    if (!gameState) return approved;
    ['kid9', 'kid14'].forEach(kid => {
        if (!gameState[kid] || !gameState[kid].missions) return;
        Object.keys(gameState[kid].missions).forEach(mId => {
            if (gameState[kid].missions[mId] && gameState[kid].missions[mId].status === 'approved') {
                if (!MISSIONS_CONFIG[mId]) {
                    console.warn(`Mission config not found for key: ${mId}. Skipping to prevent crashes.`);
                    return;
                }
                approved.push({
                    kid: kid,
                    missionId: mId,
                    data: gameState[kid].missions[mId],
                    config: MISSIONS_CONFIG[mId]
                });
            }
        });
    });
    // Ordenar de más reciente a más antiguo según la fecha de envío
    approved.sort((a, b) => {
        const tA = (a.data.submission && a.data.submission.timestamp) ? new Date(a.data.submission.timestamp) : 0;
        const tB = (b.data.submission && b.data.submission.timestamp) ? new Date(b.data.submission.timestamp) : 0;
        return tB - tA;
    });
    return approved;
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

        const isLocked = false;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-title">Día ${dayNum} ${allApproved ? '✅' : '🚀'}</div>
            <p style="font-size:0.9rem; color:var(--color-gray-dark)">${mKeys.length} misiones</p>
        `;
        card.addEventListener('click', () => renderDayMissions(role, dayNum, mKeys));
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
        
        let feedbackHtml = '';
        if (state.feedback) {
            feedbackHtml = `
                <div class="feedback-badge" style="margin-top: 8px; padding: 6px 10px; background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; border-radius: 4px; font-size: 0.8rem; color: #b91c1c; text-align: left; line-height: 1.3;">
                    <strong>❌ Nota del Juez:</strong> "${state.feedback}"
                </div>
            `;
        }
        
        const tagIcon = TAG_ICONS[conf.tag] || '❓';
        const tagLabel = conf.tag ? conf.tag.charAt(0).toUpperCase() + conf.tag.slice(1) : 'Misión';
        const tagHtml = conf.tag ? `<div class="mission-tag tag-${conf.tag}">${tagIcon} ${tagLabel}</div>` : '';

        card.innerHTML = `
            ${tagHtml}
            <div class="card-title">${conf.title} <span style="font-size:0.8rem; color:var(--color-accent)">+${conf.xp}XP</span></div>
            <div style="font-size:0.8rem; color:var(--color-gray-dark); margin-bottom:5px;">📍 ${conf.location || 'Cualquier lugar'}</div>
            ${statusHtml}
            ${feedbackHtml}
        `;
        
        card.addEventListener('click', () => {
            if (state.status === 'pending') {
                showAlert('En revisión', 'El Juez Supremo está evaluando tu entrega. Esta prueba estará bloqueada hasta que el juez la analice.');
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
    
    // Iniciar contadores para medir intentos y tiempo empleado
    window._missionStartTime = Date.now();
    window._missionAttempts = 1;
    console.log(`Misión iniciada: ${missionId}. Temporizador e intentos reiniciados.`);

    const conf = MISSIONS_CONFIG[missionId];
    const container = document.getElementById('mission-content');
    
    const state = gameState[role].missions[missionId];
    let warningHtml = '';
    if (state && state.status === 'approved') {
        warningHtml = `
            <div class="mission-warning-card" style="background: rgba(255, 193, 7, 0.1); border: 2px solid #ffc107; border-radius: var(--radius-main); padding: 15px; margin-bottom: 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; flex-direction: column;">
                <span style="font-size: 2rem;">⚠️</span>
                <div>
                    <strong style="color: #ffc107; font-size: 1.05rem;">Prueba Ya Puntuada</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">Puedes repetir esta prueba para jugar, pero ya no sumará más XP ni se enviará al juez.</p>
                </div>
            </div>
        `;
    }
    
    if (state && state.feedback) {
        warningHtml += `
            <div class="mission-warning-card" style="background: rgba(239, 68, 68, 0.08); border: 2px solid #ef4444; border-radius: var(--radius-main); padding: 15px; margin-bottom: 20px; text-align: left; display: flex; align-items: flex-start; gap: 10px; flex-direction: row; box-shadow: var(--shadow-soft);">
                <span style="font-size: 1.8rem; line-height: 1;">❌</span>
                <div>
                    <strong style="color: #b91c1c; font-size: 1.05rem;">Prueba Rechazada por el Juez</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9; line-height: 1.4; color: #7f1d1d;"><strong>Motivo:</strong> "${state.feedback}"</p>
                </div>
            </div>
        `;
    }

    const day3MissionsLaura = ['day_3_glico', 'day_3_ninja', 'day_3_bridge', 'day_3_umeda', 'day_3_reflect'];
    const day3MissionsIvan = ['day_3_architect', 'day_3_neon', 'day_3_rush', 'day_3_flow', 'day_3_reflect'];
    const day4MissionsIvan = ['day_4_knife', 'day_4_500yen', 'day_4_isshinji', 'day_4_tracker', 'day_4_yakiniku'];
    const day4MissionsLaura = ['day_4_bestiary', 'day_4_gachapon', 'day_4_vending_roulette', 'day_4_crab', 'day_4_yakiniku'];
    const day5MissionsLaura = ['day_5_gymnast', 'day_5_mochi', 'day_5_monk', 'day_5_deer_galaxy', 'day_5_ribbon'];
    const day5MissionsIvan = ['day_5_investor', 'day_5_mochi', 'day_5_zen', 'day_5_engineer', 'day_5_guardian'];
    const day6MissionsLaura = ['day_6_evasion', 'day_6_seal', 'day_6_clouds', 'day_6_ninja_steps', 'day_6_clan'];
    const day6MissionsIvan = ['day_6_tactical', 'day_6_edict', 'day_6_time_travel', 'day_6_ring', 'day_6_clan'];
    const day7MissionsLaura = ['day_7_kimono', 'day_7_kintsugi', 'day_7_tea', 'day_7_stone_guardian', 'day_7_geisha'];
    const day7MissionsIvan = ['day_7_structural', 'day_7_survival', 'day_7_anti_quake', 'day_7_stairs', 'day_7_geisha'];
    const day8MissionsLaura = ['day_8_kid9_rake', 'day_8_kid9_pose', 'day_8_kid9_wind', 'day_8_kid9_bamboo_clock', 'day_8_kid9_giants', 'day_8_kid9_monk', 'day_8_fam_squad'];
    const day8MissionsIvan = ['day_8_kid14_wave_sync', 'day_8_kid14_bosque', 'day_8_kid14_arashiyama', 'day_8_fam_squad'];
    const day9MissionsLaura = ['day_9_kid9_scratch', 'day_9_kid9_zorros', 'day_9_kid9_altar', 'day_9_fam_portal'];
    const day9MissionsIvan = ['day_9_kid14_torii', 'day_9_kid14_gravity', 'day_9_kid14_angulo', 'day_9_kid14_ave', 'day_9_kid14_tunnel', 'day_9_fam_portal'];
    const day10MissionsLaura = ['day_10_kid9_bento', 'day_10_kid9_nishiki', 'day_10_kid9_dragon', 'day_10_kid9_rainbow', 'day_10_kid9_matcha', 'day_10_fam_sayonara'];
    const day10MissionsIvan = ['day_10_kid14_crypto', 'day_10_kid14_milla', 'day_10_kid14_tako', 'day_10_fam_sayonara'];
    const day11MissionsLaura = ['day_11_onsen', 'day_11_tea', 'day_11_yukata', 'day_11_tatami', 'day_11_geta'];
    const day11MissionsIvan = ['day_11_kaiseki', 'day_11_spring', 'day_11_architecture', 'day_11_economy', 'day_11_geta'];
    const day12MissionsLaura = ['day_12_silence', 'day_12_sugidama', 'day_12_wood', 'day_12_hida', 'day_12_bridge'];
    const day12MissionsIvan = ['day_12_carving', 'day_12_sake', 'day_12_patrol', 'day_12_appraisal', 'day_12_bridge'];
    const day13MissionsLaura = ['day_13_stairs', 'day_13_manhole', 'day_13_icecream', 'day_13_yokai', 'day_13_oishi'];
    const day13MissionsIvan = ['day_13_perspective', 'day_13_tunnels', 'day_13_volcano', 'day_13_triangulation', 'day_13_oishi'];
    const day14MissionsLaura = ['day_14_rock', 'day_14_kid9_echo', 'day_14_root', 'day_14_compass', 'day_14_oxygen'];
    const day14MissionsIvan = ['day_14_radar', 'day_14_pressure', 'day_14_altimeter', 'day_14_kid14_echo', 'day_14_oxygen'];
    const day15MissionsLaura = ['day_15_waterfall', 'day_15_thatch', 'day_15_fish', 'day_15_shogun', 'day_15_dragon'];
    const day15MissionsIvan = ['day_15_deity', 'day_15_honcho', 'day_15_flow', 'day_15_roof', 'day_15_dragon'];
    const day16MissionsLaura = ['day_16_cat', 'day_16_skyscraper', 'day_16_colors', 'day_16_traffic', 'day_16_tocho'];
    const day16MissionsIvan = ['day_16_vortex', 'day_16_combat', 'day_16_shinjuku', 'day_16_density', 'day_16_tocho'];
    const day17MissionsLaura = ['day_17_omikuji', 'day_17_incense', 'day_17_gashapon', 'day_17_p2p_receiver', 'day_17_sumida'];
    const day17MissionsIvan = ['day_17_retro', 'day_17_skytree', 'day_17_p2p_sender', 'day_17_height', 'day_17_sumida'];
    const day18MissionsLaura = ['day_18_shibuya', 'day_18_hachiko', 'day_18_ema', 'day_18_crepe', 'day_18_crossing'];
    const day18MissionsIvan = ['day_18_radio', 'day_18_trend', 'day_18_flow', 'day_18_silence', 'day_18_crossing'];
    const day19MissionsLaura = ['day_19_gundam', 'day_19_color', 'day_19_teamlab', 'day_19_liberty', 'day_19_immersive'];
    const day19MissionsIvan = ['day_19_crypto', 'day_19_mirrors', 'day_19_weight', 'day_19_monorail', 'day_19_immersive'];
    const day20MissionsLaura = ['day_20_bento', 'day_20_potion', 'day_20_pond', 'day_20_weight', 'day_20_tasting'];
    const day20MissionsIvan = ['day_20_change', 'day_20_museum', 'day_20_vintage', 'day_20_stairs', 'day_20_tasting'];
    const day21MissionsLaura = ['day_21_monkeys', 'day_21_dragon', 'day_21_slash', 'day_21_jizo', 'day_21_silence'];
    const day21MissionsIvan = ['day_21_buddha', 'day_21_gold', 'day_21_tracking', 'day_21_defense', 'day_21_silence'];
    const day22MissionsLaura = ['day_22_shout', 'day_22_car', 'day_22_elevator', 'day_22_tower', 'day_22_neon'];
    const day22MissionsIvan = ['day_22_jewel', 'day_22_numbers', 'day_22_fish', 'day_22_compare', 'day_22_neon'];
    const day23MissionsLaura = ['day_23_kitkat', 'day_23_pokedex', 'day_23_coins', 'day_23_mascot', 'day_23_stamp'];
    const day23MissionsIvan = ['day_23_tetris', 'day_23_audit', 'day_23_security', 'day_23_weight', 'day_23_stamp'];

    const isMinigameMission = (role === 'kid9' && (
        day3MissionsLaura.includes(missionId) || day4MissionsLaura.includes(missionId) || day5MissionsLaura.includes(missionId) ||
        day6MissionsLaura.includes(missionId) || day7MissionsLaura.includes(missionId) || day8MissionsLaura.includes(missionId) ||
        day9MissionsLaura.includes(missionId) || day10MissionsLaura.includes(missionId) || day11MissionsLaura.includes(missionId) ||
        day12MissionsLaura.includes(missionId) || day13MissionsLaura.includes(missionId) || day14MissionsLaura.includes(missionId) ||
        day15MissionsLaura.includes(missionId) || day16MissionsLaura.includes(missionId) || day17MissionsLaura.includes(missionId) ||
        day18MissionsLaura.includes(missionId) || day19MissionsLaura.includes(missionId) ||
        day20MissionsLaura.includes(missionId) || day21MissionsLaura.includes(missionId) ||
        day22MissionsLaura.includes(missionId) || day23MissionsLaura.includes(missionId)
    )) || (role === 'kid14' && (
        day3MissionsIvan.includes(missionId) || day4MissionsIvan.includes(missionId) || day5MissionsIvan.includes(missionId) ||
        day6MissionsIvan.includes(missionId) || day7MissionsIvan.includes(missionId) || day8MissionsIvan.includes(missionId) ||
        day9MissionsIvan.includes(missionId) || day10MissionsIvan.includes(missionId) || day11MissionsIvan.includes(missionId) ||
        day12MissionsIvan.includes(missionId) || day13MissionsIvan.includes(missionId) || day14MissionsIvan.includes(missionId) ||
        day15MissionsIvan.includes(missionId) || day16MissionsIvan.includes(missionId) || day17MissionsIvan.includes(missionId) ||
        day18MissionsIvan.includes(missionId) || day19MissionsIvan.includes(missionId) ||
        day20MissionsIvan.includes(missionId) || day21MissionsIvan.includes(missionId) ||
        day22MissionsIvan.includes(missionId) || day23MissionsIvan.includes(missionId)
    ));

    let minigameButtonHtml = '';
    if (isMinigameMission) {
        minigameButtonHtml = `
            <div class="minigame-promo-card" style="margin: 15px 0; padding: 15px; background: linear-gradient(135deg, rgba(255, 123, 84, 0.15) 0%, rgba(255, 154, 158, 0.05) 100%); border: 2px solid var(--color-primary); border-radius: var(--radius-main); text-align: center; box-shadow: var(--shadow-soft);">
                <span style="font-size: 1.6rem; display: block; margin-bottom: 5px;">🎮 ¡Bonus de Juego!</span>
                <p style="margin: 0 0 12px 0; font-size: 0.85rem; opacity: 0.9; line-height: 1.4; color: var(--color-text);">Al finalizar esta prueba jugarás automáticamente. O practica ahora haciendo clic aquí:</p>
                <button id="btn-replay-minigame-direct" class="btn-secondary" style="width:100%; background: #ff7b54; border-color: #ff7b54; color: white; font-weight: bold; border-radius: 20px; box-shadow: 0 4px 10px rgba(255,123,84,0.25); cursor:pointer;">🎮 Jugar Minijuego (Entrenamiento)</button>
            </div>
        `;
    }

    container.innerHTML = `
        <h2 class="mission-title">${conf.title}</h2>
        <div style="text-align:center; color:var(--color-accent); margin-bottom:15px; font-weight:bold;">📍 ${conf.location || 'Cualquier lugar'}</div>
        ${warningHtml}
        ${minigameButtonHtml}
        ${conf.render(role)}
    `;
    switchView('view-mission', true, "Misión");
    conf.attachEvents(role);

    if (isMinigameMission) {
        const btnReplay = document.getElementById('btn-replay-minigame-direct');
        if (btnReplay) {
            btnReplay.addEventListener('click', () => {
                window.pendingSubmission = null; // No submit upon win
                if (window.MinigamesManager && typeof window.MinigamesManager.launch === 'function') {
                    window.MinigamesManager.launch(missionId);
                }
            });
        }
    }
}

function submitMission(missionId, submissionData, role = currentUser, isFamily = false, bypassMinigame = false) {
    const mState = gameState[role].missions[missionId];
        const day3MissionsLaura = ['day_3_glico', 'day_3_ninja', 'day_3_bridge', 'day_3_umeda', 'day_3_reflect'];
    const day3MissionsIvan = ['day_3_architect', 'day_3_neon', 'day_3_rush', 'day_3_flow', 'day_3_reflect'];
    const day4MissionsIvan = ['day_4_knife', 'day_4_500yen', 'day_4_isshinji', 'day_4_tracker', 'day_4_yakiniku'];
    const day4MissionsLaura = ['day_4_bestiary', 'day_4_gachapon', 'day_4_vending_roulette', 'day_4_crab', 'day_4_yakiniku'];
    const day5MissionsLaura = ['day_5_gymnast', 'day_5_mochi', 'day_5_monk', 'day_5_deer_galaxy', 'day_5_ribbon'];
    const day5MissionsIvan = ['day_5_investor', 'day_5_mochi', 'day_5_zen', 'day_5_engineer', 'day_5_guardian'];
    const day6MissionsLaura = ['day_6_evasion', 'day_6_seal', 'day_6_clouds', 'day_6_ninja_steps', 'day_6_clan'];
    const day6MissionsIvan = ['day_6_tactical', 'day_6_edict', 'day_6_time_travel', 'day_6_ring', 'day_6_clan'];
    const day7MissionsLaura = ['day_7_kimono', 'day_7_kintsugi', 'day_7_tea', 'day_7_stone_guardian', 'day_7_geisha'];
    const day7MissionsIvan = ['day_7_structural', 'day_7_survival', 'day_7_anti_quake', 'day_7_stairs', 'day_7_geisha'];
    const day8MissionsLaura = ['day_8_kid9_rake', 'day_8_kid9_pose', 'day_8_kid9_wind', 'day_8_kid9_bamboo_clock', 'day_8_kid9_giants', 'day_8_kid9_monk', 'day_8_fam_squad'];
    const day8MissionsIvan = ['day_8_kid14_wave_sync', 'day_8_kid14_bosque', 'day_8_kid14_arashiyama', 'day_8_fam_squad'];
    const day9MissionsLaura = ['day_9_kid9_scratch', 'day_9_kid9_zorros', 'day_9_kid9_altar', 'day_9_fam_portal'];
    const day9MissionsIvan = ['day_9_kid14_torii', 'day_9_kid14_gravity', 'day_9_kid14_angulo', 'day_9_kid14_ave', 'day_9_kid14_tunnel', 'day_9_fam_portal'];
    const day10MissionsLaura = ['day_10_kid9_bento', 'day_10_kid9_nishiki', 'day_10_kid9_dragon', 'day_10_kid9_rainbow', 'day_10_kid9_matcha', 'day_10_fam_sayonara'];
    const day10MissionsIvan = ['day_10_kid14_crypto', 'day_10_kid14_milla', 'day_10_kid14_tako', 'day_10_fam_sayonara'];
    const day11MissionsLaura = ['day_11_onsen', 'day_11_tea', 'day_11_yukata', 'day_11_tatami', 'day_11_geta'];
    const day11MissionsIvan = ['day_11_kaiseki', 'day_11_spring', 'day_11_architecture', 'day_11_economy', 'day_11_geta'];
    const day12MissionsLaura = ['day_12_silence', 'day_12_sugidama', 'day_12_wood', 'day_12_hida', 'day_12_bridge'];
    const day12MissionsIvan = ['day_12_carving', 'day_12_sake', 'day_12_patrol', 'day_12_appraisal', 'day_12_bridge'];
    const day13MissionsLaura = ['day_13_stairs', 'day_13_manhole', 'day_13_icecream', 'day_13_yokai', 'day_13_oishi'];
    const day13MissionsIvan = ['day_13_perspective', 'day_13_tunnels', 'day_13_volcano', 'day_13_triangulation', 'day_13_oishi'];
    const day14MissionsLaura = ['day_14_rock', 'day_14_kid9_echo', 'day_14_root', 'day_14_compass', 'day_14_oxygen'];
    const day14MissionsIvan = ['day_14_radar', 'day_14_pressure', 'day_14_altimeter', 'day_14_kid14_echo', 'day_14_oxygen'];
    const day15MissionsLaura = ['day_15_waterfall', 'day_15_thatch', 'day_15_fish', 'day_15_shogun', 'day_15_dragon'];
    const day15MissionsIvan = ['day_15_deity', 'day_15_honcho', 'day_15_flow', 'day_15_roof', 'day_15_dragon'];
    const day16MissionsLaura = ['day_16_cat', 'day_16_skyscraper', 'day_16_colors', 'day_16_traffic', 'day_16_tocho'];
    const day16MissionsIvan = ['day_16_vortex', 'day_16_combat', 'day_16_shinjuku', 'day_16_density', 'day_16_tocho'];
    const day17MissionsLaura = ['day_17_omikuji', 'day_17_incense', 'day_17_gashapon', 'day_17_p2p_receiver', 'day_17_sumida'];
    const day17MissionsIvan = ['day_17_retro', 'day_17_skytree', 'day_17_p2p_sender', 'day_17_height', 'day_17_sumida'];
    const day18MissionsLaura = ['day_18_shibuya', 'day_18_hachiko', 'day_18_ema', 'day_18_crepe', 'day_18_crossing'];
    const day18MissionsIvan = ['day_18_radio', 'day_18_trend', 'day_18_flow', 'day_18_silence', 'day_18_crossing'];
    const day19MissionsLaura = ['day_19_gundam', 'day_19_color', 'day_19_teamlab', 'day_19_liberty', 'day_19_immersive'];
    const day19MissionsIvan = ['day_19_crypto', 'day_19_mirrors', 'day_19_weight', 'day_19_monorail', 'day_19_immersive'];
    const day20MissionsLaura = ['day_20_bento', 'day_20_potion', 'day_20_pond', 'day_20_weight', 'day_20_tasting'];
    const day20MissionsIvan = ['day_20_change', 'day_20_museum', 'day_20_vintage', 'day_20_stairs', 'day_20_tasting'];
    const day21MissionsLaura = ['day_21_monkeys', 'day_21_dragon', 'day_21_slash', 'day_21_jizo', 'day_21_silence'];
    const day21MissionsIvan = ['day_21_buddha', 'day_21_gold', 'day_21_tracking', 'day_21_defense', 'day_21_silence'];
    const day22MissionsLaura = ['day_22_shout', 'day_22_car', 'day_22_elevator', 'day_22_tower', 'day_22_neon'];
    const day22MissionsIvan = ['day_22_jewel', 'day_22_numbers', 'day_22_fish', 'day_22_compare', 'day_22_neon'];
    const day23MissionsLaura = ['day_23_kitkat', 'day_23_pokedex', 'day_23_coins', 'day_23_mascot', 'day_23_stamp'];
    const day23MissionsIvan = ['day_23_tetris', 'day_23_audit', 'day_23_security', 'day_23_weight', 'day_23_stamp'];

    const isMinigameMission = (role === 'kid9' && (
        day3MissionsLaura.includes(missionId) || day4MissionsLaura.includes(missionId) || day5MissionsLaura.includes(missionId) ||
        day6MissionsLaura.includes(missionId) || day7MissionsLaura.includes(missionId) || day8MissionsLaura.includes(missionId) ||
        day9MissionsLaura.includes(missionId) || day10MissionsLaura.includes(missionId) || day11MissionsLaura.includes(missionId) ||
        day12MissionsLaura.includes(missionId) || day13MissionsLaura.includes(missionId) || day14MissionsLaura.includes(missionId) ||
        day15MissionsLaura.includes(missionId) || day16MissionsLaura.includes(missionId) || day17MissionsLaura.includes(missionId) ||
        day18MissionsLaura.includes(missionId) || day19MissionsLaura.includes(missionId) ||
        day20MissionsLaura.includes(missionId) || day21MissionsLaura.includes(missionId) ||
        day22MissionsLaura.includes(missionId) || day23MissionsLaura.includes(missionId)
    )) || (role === 'kid14' && (
        day3MissionsIvan.includes(missionId) || day4MissionsIvan.includes(missionId) || day5MissionsIvan.includes(missionId) ||
        day6MissionsIvan.includes(missionId) || day7MissionsIvan.includes(missionId) || day8MissionsIvan.includes(missionId) ||
        day9MissionsIvan.includes(missionId) || day10MissionsIvan.includes(missionId) || day11MissionsIvan.includes(missionId) ||
        day12MissionsIvan.includes(missionId) || day13MissionsIvan.includes(missionId) || day14MissionsIvan.includes(missionId) ||
        day15MissionsIvan.includes(missionId) || day16MissionsIvan.includes(missionId) || day17MissionsIvan.includes(missionId) ||
        day18MissionsIvan.includes(missionId) || day19MissionsIvan.includes(missionId) ||
        day20MissionsIvan.includes(missionId) || day21MissionsIvan.includes(missionId) ||
        day22MissionsIvan.includes(missionId) || day23MissionsIvan.includes(missionId)
    ));

    if (isMinigameMission && !bypassMinigame) {
        window.pendingSubmission = { missionId, submissionData, role, isFamily };
        if (window.MinigamesManager && typeof window.MinigamesManager.launch === 'function') {
            window.MinigamesManager.launch(missionId);
            return;
        }
    }

    const timeTaken = window._missionStartTime ? Math.round((Date.now() - window._missionStartTime) / 1000) : null;
    const attempts = window._missionAttempts || 1;

    const enrichedSubmission = {
        ...submissionData,
        attempts: attempts,
        timeTaken: timeTaken,
        timestamp: new Date().toISOString()
    };

    if (isFamily) {
        // Misión conjunta: marcar pending para AMBOS perfiles inmediatamente
        ['kid9', 'kid14'].forEach(kid => {
            if (gameState[kid].missions[missionId]) {
                gameState[kid].missions[missionId].status = 'pending';
                gameState[kid].missions[missionId].submission = enrichedSubmission;
                gameState[kid].missions[missionId].feedback = null; // Limpiar feedback anterior
            }
        });
    } else {
        gameState[role].missions[missionId].status = 'pending';
        gameState[role].missions[missionId].submission = enrichedSubmission;
        gameState[role].missions[missionId].feedback = null; // Limpiar feedback anterior
    }

    // Limpiar contadores globales
    window._missionStartTime = null;
    window._missionAttempts = 1;

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

function generateJudgeGuide(p) {
    const kidName = gameState[p.kid] ? gameState[p.kid].name : p.kid;
    const isKid9 = p.kid === 'kid9';
    
    // 1. Explicación de la prueba según su tag
    let explanation = '';
    const tag = p.config ? p.config.tag : 'generic';
    switch (tag) {
        case 'photo':
            explanation = 'Esta es una prueba de fotografía. El niño debe localizar un elemento en Japón y capturarlo. Evalúa si la foto corresponde a lo pedido.';
            break;
        case 'audio':
            explanation = 'Esta es una prueba de grabación de sonido. El niño debe capturar el sonido del entorno. Reproduce el audio o pide que te lo muestren.';
            break;
        case 'writing':
            explanation = 'Esta es una prueba escrita. El niño debe dar una respuesta corta, un cálculo aproximado o reflexionar sobre lo observado.';
            break;
        case 'sensors':
            explanation = 'Esta es una prueba física validada por sensores (orientación del dispositivo, movimiento, giroscopio, etc.). El sistema se valida al completarla.';
            break;
        case 'versus':
            explanation = 'Esta es una prueba competitiva o minijuego físico de reflejos. El niño debe completar una meta física o reto familiar.';
            break;
        case 'economy':
            explanation = 'Esta es una prueba económica o de cálculo matemático. Consiste en contar monedas, calcular importes o realizar sumas.';
            break;
        case 'game':
            explanation = 'Esta es una prueba lógica o puzzle interactivo digital jugado y completado en el propio dispositivo.';
            break;
        default:
            explanation = 'Esta es una prueba general. Evalúa la respuesta enviada para asegurar que se ha completado la tarea con honestidad.';
    }

    // 2. Respuesta esperada sugerida
    let expected = '';
    if (p.config && p.config.correctAnswer) {
        expected = p.config.correctAnswer;
    } else {
        switch (tag) {
            case 'photo':
                expected = 'Una fotografía nítida e inequívoca del objeto, cartel o vista solicitada.';
                break;
            case 'audio':
                expected = 'Una grabación de audio limpia donde se perciba el sonido correspondiente (ej. agua, semáforo, voz).';
                break;
            case 'writing':
                expected = 'Una respuesta escrita coherente con la pregunta que demuestre que el explorador ha investigado.';
                break;
            case 'sensors':
                expected = 'Que el sistema de orientación/GPS del móvil haya verificado los parámetros (umbral, distancia, etc.).';
                break;
            case 'game':
                expected = 'El puzzle lógico o juego completado en pantalla (validación automática).';
                break;
            default:
                expected = 'Verificar que la tarea se haya realizado según las reglas de la misión.';
        }
    }

    // 3. Comentarios graciosos y dinámicos para el niño
    const suggestions = [];
    const attempts = p.data.submission.attempts || 1;
    const timeTaken = p.data.submission.timeTaken;
    
    // Emojis específicos
    const emoji = isKid9 ? '🦊' : '🐉';
    
    // Sugerencias basadas en intentos
    if (attempts === 1) {
        suggestions.push(`"¡Impresionante, ${kidName}! Lo has clavado a la primera. ¡Tienes el foco de un auténtico ninja! ${emoji}🎯"`);
    } else if (attempts > 1 && attempts < 4) {
        suggestions.push(`"¡Buena constancia, ${kidName}! Te costó ${attempts} intentos, pero el tesón de un samurái siempre da frutos. ${emoji}⚔️"`);
    } else {
        suggestions.push(`"¡Eso es persistencia, ${kidName}! ${attempts} intentos demuestran que no te rindes ante ningún reto. ${emoji}🔥"`);
    }

    // Sugerencias basadas en velocidad (si existe)
    if (timeTaken !== null && timeTaken !== undefined) {
        if (timeTaken < 15) {
            suggestions.push(`"¡Has resuelto esta prueba a velocidad de tren bala Shinkansen! (${timeTaken} segundos). 🚅💨"`);
        } else if (timeTaken > 120) {
            const minutes = Math.floor(timeTaken / 60);
            suggestions.push(`"Has actuado con la paciencia Zen de un maestro del té (${minutes} min de concentración). 🧘‍♂️🍵"`);
        } else {
            suggestions.push(`"Buen ritmo y equilibrio entre velocidad y destreza, digno de un maestro artesano. 🎋✨"`);
        }
    }

    // Sugerencias por tipo de prueba
    if (tag === 'photo') {
        suggestions.push(`"¡Menudo encuadre! Esta foto merece guardarse en el álbum imperial de Japón. 📸⛩️"`);
    } else if (tag === 'audio') {
        suggestions.push(`"¡Excelente captura acústica! Escuchar este sonido nos transporta de lleno al lugar. 🎧🎙️"`);
    } else if (tag === 'writing') {
        suggestions.push(`"¡Excelente razonamiento! Tus palabras tienen la sabiduría de un pergamino antiguo. 📜💡"`);
    }

    // Comentario extra
    suggestions.push(`"¡Misión aprobada con honor! Reclama tu recompensa y prepárate para la siguiente aventura. 🌸🗻"`);

    return {
        explanation: explanation,
        expectedAnswer: expected,
        suggestions: suggestions
    };
}

function initJudgeTabListeners() {
    if (judgeListenersBound) return;
    
    const pendingTab = document.getElementById('btn-judge-tab-pending');
    const approvedTab = document.getElementById('btn-judge-tab-approved');
    
    if (pendingTab && approvedTab) {
        pendingTab.addEventListener('click', () => {
            currentJudgeTab = 'pending';
            pendingTab.classList.add('active');
            pendingTab.style.borderBottomColor = 'var(--color-primary)';
            pendingTab.style.color = 'var(--color-primary)';
            
            approvedTab.classList.remove('active');
            approvedTab.style.borderBottomColor = 'transparent';
            approvedTab.style.color = 'var(--color-gray-dark)';
            
            document.getElementById('judge-pending-section').classList.remove('hidden');
            document.getElementById('judge-approved-section').classList.add('hidden');
            renderJudgePanel();
        });
        
        approvedTab.addEventListener('click', () => {
            currentJudgeTab = 'approved';
            approvedTab.classList.add('active');
            approvedTab.style.borderBottomColor = 'var(--color-primary)';
            approvedTab.style.color = 'var(--color-primary)';
            
            pendingTab.classList.remove('active');
            pendingTab.style.borderBottomColor = 'transparent';
            pendingTab.style.color = 'var(--color-gray-dark)';
            
            document.getElementById('judge-pending-section').classList.add('hidden');
            document.getElementById('judge-approved-section').classList.remove('hidden');
            renderJudgePanel();
        });
        
        judgeListenersBound = true;
    }
}

async function renderSubmissionData(submission) {
    if (!submission) return 'Sin entrega';
    let dataHtml = '';
    if (submission.type === 'number' || submission.type === 'text') {
        dataHtml = `<b>Respuesta:</b> ${submission.data}`;
    } else if (submission.type === 'photo') {
        const photoData = await getPhotoFromDB(submission.data);
        dataHtml = `<img src="${photoData}" alt="Evidencia" style="width:100%; border-radius:10px; max-height: 250px; object-fit: contain; background: #eaeaea;">`;
    } else if (submission.type === 'photos') {
        let imgHtml = '';
        const ids = submission.data;
        const labels = [
            "1. Aeropuerto KIX", "2. El Vehículo", "3. Pasajeros", "4. Taxímetro",
            "5. Gran Puente", "6. Entrada Ciudad", "7. Los Neones", "8. Llegada Osaka"
        ];
        if (Array.isArray(ids)) {
            for (let i = 0; i < ids.length; i++) {
                const photoData = ids[i] ? await getPhotoFromDB(ids[i]) : null;
                if (photoData) {
                    imgHtml += `
                        <div style="flex: 1 1 22%; min-width: 90px; margin: 6px; text-align: center; border: 1px solid #cbd5e1; padding: 4px; background: #f8fafc; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <img src="${photoData}" alt="${labels[i]}" style="width:100%; border-radius:4px; max-height: 90px; object-fit: cover; background: #eaeaea;">
                            <div style="font-size:0.6rem; color:#475569; font-weight:bold; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${labels[i]}</div>
                        </div>
                    `;
                }
            }
        }
        dataHtml = `<div style="display:flex; flex-wrap:wrap; justify-content:center; background:#f1f5f9; padding:8px; border-radius:8px;">${imgHtml}</div>`;
    } else if (submission.type === 'video' || submission.type === 'audio') {
        dataHtml = `<b>Evidencia Multimedia:</b> ${submission.data}`;
    } else if (submission.type === 'game') {
        dataHtml = `<b>Resultado de la Prueba:</b> ${submission.data}`;
    } else if (submission.type === 'photo_choice') {
        const photoData = await getPhotoFromDB(submission.data.photoId);
        dataHtml = `
            <img src="${photoData}" alt="Evidencia" style="width:100%; border-radius:10px; max-height: 250px; object-fit: contain; background: #eaeaea; margin-bottom:10px;"><br>
            <b>Elección:</b> ${submission.data.choice}
        `;
    } else if (submission.type === 'mixed') {
        let parts = submission.data.split('. Foto ID: ');
        if (parts.length === 1) parts = submission.data.split('. Foto: ');
        
        if (parts.length > 1) {
            const photoData = await getPhotoFromDB(parts[parts.length - 1]);
            const textData = parts.slice(0, -1).join('. ');
            dataHtml = `<b>${textData}</b><br><img src="${photoData}" alt="Evidencia" style="width:100%; border-radius:10px; max-height: 250px; object-fit: contain; background: #eaeaea; margin-top:10px;">`;
        } else {
            dataHtml = `<b>Respuesta:</b> ${submission.data}`;
        }
    } else if (submission.type === 'family') {
        dataHtml = `<b>¡Hazaña completada en equipo!</b>`;
    }
    return dataHtml;
}

async function renderJudgePanel() {
    currentUser = 'judge';
    initJudgeTabListeners();

    if (currentJudgeTab === 'pending') {
        const list = document.getElementById('pending-missions-list');
        list.innerHTML = '';

        const pendings = getPendingMissions();
        
        if (pendings.length === 0) {
            list.innerHTML = '<p style="text-align:center; padding:20px;">No hay misiones pendientes.</p>';
        }

        for (const p of pendings) {
            try {
                const kidName = gameState[p.kid] ? gameState[p.kid].name : p.kid;
                
                if (!p.data || !p.data.submission) {
                    console.warn(`Submission data missing for mission: ${p.missionId}`);
                    continue;
                }

                const dataHtml = await renderSubmissionData(p.data.submission);

                // Calcular métricas
                const timeTaken = p.data.submission.timeTaken;
                let formattedTime = 'No medido';
                if (timeTaken !== null && timeTaken !== undefined) {
                    if (timeTaken < 60) {
                        formattedTime = `${timeTaken} segundos`;
                    } else {
                        const mins = Math.floor(timeTaken / 60);
                        const secs = timeTaken % 60;
                        formattedTime = `${mins}m ${secs}s`;
                    }
                }

                const attempts = p.data.submission.attempts || 1;
                let attemptsText = `${attempts} intento`;
                if (attempts === 1) {
                    attemptsText += ' (¡A la primera! 🎯)';
                } else {
                    attemptsText = `${attempts} intentos`;
                }

                // Generar la guía y comentarios dinámicos
                const guide = generateJudgeGuide(p);
                const missionXP = p.config ? p.config.xp : 15;

                let actionsHtml = `
                    <button class="btn-reject" style="flex: 1; min-width: 100px;" onclick="rejectMission('${p.kid}', '${p.missionId}')">❌ Rechazar</button>
                    <button class="btn-approve" style="flex: 1; min-width: 100px;" onclick="approveMission('${p.kid}', '${p.missionId}', ${missionXP}, ${p.data.submission.type === 'family'})">✅ Aprobar</button>
                    <button class="btn-approve" style="flex: 1; min-width: 85px; background-color: #20bf6b;" onclick="approveMission('${p.kid}', '${p.missionId}', ${missionXP + 5}, ${p.data.submission.type === 'family'})">⭐ +5 XP</button>
                    <button class="btn-approve" style="flex: 1; min-width: 85px; background-color: #f7b731; color: black;" onclick="approveMission('${p.kid}', '${p.missionId}', ${missionXP + 10}, ${p.data.submission.type === 'family'})">🌟 +10 XP</button>
                `;

                if (p.missionId === 'day_5_gymnast') {
                    actionsHtml = `
                    <div style="width:100%; margin-bottom:10px; background:var(--color-black); border-radius:10px; padding:10px;">
                        <p style="text-align:center; font-size:0.9rem; margin-bottom:5px; color: white;">Puntuación de Estilo Extra:</p>
                        <div style="display:flex; justify-content:space-between; gap:5px;">
                            <button class="btn-secondary" style="flex:1; font-size:0.8rem; padding:5px; border-color:#cd7f32; color:#cd7f32;" onclick="approveMission('${p.kid}', '${p.missionId}', ${missionXP + 5}, false)">🥉 +5</button>
                            <button class="btn-secondary" style="flex:1; font-size:0.8rem; padding:5px; border-color:#c0c0c0; color:#c0c0c0;" onclick="approveMission('${p.kid}', '${p.missionId}', ${missionXP + 10}, false)">🥈 +10</button>
                            <button class="btn-primary" style="flex:1; font-size:0.8rem; padding:5px; background:#ffd700; color:#000;" onclick="approveMission('${p.kid}', '${p.missionId}', ${missionXP + 15}, false)">🥇 +15</button>
                        </div>
                    </div>
                    ` + actionsHtml;
                }

                const card = document.createElement('div');
                card.className = 'card submission-item';
                card.style.borderLeft = '5px solid var(--color-primary)';
                card.style.padding = '18px';
                card.style.marginBottom = '20px';
                card.style.position = 'relative';

                card.innerHTML = `
                    <!-- Cabecera de la Tarjeta -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 10px;">
                        <div>
                            <div class="card-title" style="font-size: 1.2rem; font-weight: 900; margin-bottom: 4px; color: var(--color-primary); text-align: left;">
                                ${p.config ? p.config.title : p.missionId}
                            </div>
                            <div style="font-size: 0.82rem; color: var(--color-gray-dark); text-align: left;">
                                👤 <strong>${kidName}</strong> | 📅 Día ${p.config ? p.config.day : 'N/A'} | 📍 ${p.config ? (p.config.location || 'N/A') : 'N/A'}
                            </div>
                        </div>
                        <div style="background: var(--color-primary); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: bold; white-space: nowrap;">
                            +${missionXP} XP
                        </div>
                    </div>

                    <!-- Guía e Instrucción de Evaluación -->
                    <div style="background: rgba(141, 110, 99, 0.05); border: 1px solid rgba(141, 110, 99, 0.15); border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; font-size: 0.85rem; text-align: left; line-height: 1.4;">
                        <div style="font-weight: 900; color: var(--color-primary-dark); margin-bottom: 2px;">📖 Qué evalúas:</div>
                        <p style="margin: 0; opacity: 0.95; color: #3e2723;">${guide.explanation}</p>
                        <div style="font-weight: 900; color: var(--color-accent); margin-top: 8px; margin-bottom: 2px;">💡 Respuesta correcta esperada:</div>
                        <p style="margin: 0; font-style: italic; opacity: 0.95; color: #5d4037;">${guide.expectedAnswer}</p>
                    </div>

                    <!-- Métricas de Rendimiento -->
                    <div style="display: flex; gap: 10px; margin-bottom: 14px;">
                        <div style="flex: 1; background: #fdfbf7; border: 1px solid #efebe9; border-radius: 8px; padding: 8px; text-align: center; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
                            <div style="font-size: 1.1rem; margin-bottom: 2px;">⏱️</div>
                            <div style="font-size: 0.7rem; color: var(--color-gray-dark); text-transform: uppercase; font-weight: bold; letter-spacing: 0.3px;">Tiempo Empleado</div>
                            <div style="font-size: 0.85rem; font-weight: bold; color: #4e342e; margin-top: 2px;">${formattedTime}</div>
                        </div>
                        <div style="flex: 1; background: #fdfbf7; border: 1px solid #efebe9; border-radius: 8px; padding: 8px; text-align: center; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
                            <div style="font-size: 1.1rem; margin-bottom: 2px;">🎯</div>
                            <div style="font-size: 0.7rem; color: var(--color-gray-dark); text-transform: uppercase; font-weight: bold; letter-spacing: 0.3px;">Intentos</div>
                            <div style="font-size: 0.85rem; font-weight: bold; color: #4e342e; margin-top: 2px;">${attemptsText}</div>
                        </div>
                    </div>

                    <!-- Evidencia Entregada -->
                    <div style="background: white; border: 1px solid #efebe9; border-radius: 10px; padding: 12px; margin-bottom: 14px; text-align: left; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                        <div style="font-size: 0.78rem; font-weight: bold; text-transform: uppercase; color: var(--color-primary-dark); margin-bottom: 8px; border-bottom: 1px solid #f5f2f0; padding-bottom: 4px; letter-spacing: 0.3px;">📥 Evidencia del explorador:</div>
                        <div style="font-size: 0.95rem; color: #3e2723; word-break: break-word;">${dataHtml}</div>
                    </div>

                    <!-- Sugerencias de Feedback Interactivas -->
                    <div style="background: #fafafa; border: 1px dashed var(--color-primary); border-radius: 10px; padding: 12px; margin-bottom: 18px; text-align: left;">
                        <div style="font-weight: bold; color: var(--color-primary-dark); font-size: 0.82rem; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 5px; letter-spacing: 0.3px;">
                            <span>💬</span> Sugerencias de Feedback (clic para copiar):
                        </div>
                        <ul style="margin: 0; padding-left: 18px; font-size: 0.82rem; color: #5d4037; display: flex; flex-direction: column; gap: 8px;">
                            ${guide.suggestions.map(s => {
                                const escapedVal = s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                                return `<li style="line-height: 1.4; cursor: pointer; padding: 3px 0; transition: color 0.15s;" onclick="navigator.clipboard.writeText('${escapedVal}'); showAlert('Copiado', '¡Comentario copiado al portapapeles!');" title="Haz clic para copiar">${s} 📋</li>`;
                            }).join('')}
                        </ul>
                    </div>

                    <!-- Botones de Acción -->
                    <div class="judge-actions" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
                        ${actionsHtml}
                    </div>
                `;
                list.appendChild(card);
            } catch (err) {
                console.error(`Error rendering pending mission ${p.missionId}:`, err);
            }
        }


        const rewardsList = document.getElementById('pending-rewards-list');
        if (rewardsList) {
            rewardsList.innerHTML = '';
            const requestedRewards = getRequestedRewards();
            
            if (requestedRewards.length === 0) {
                rewardsList.innerHTML = '<p style="text-align:center; padding:20px; color: var(--color-gray-dark);">No hay recompensas pendientes de otorgar.</p>';
            } else {
                requestedRewards.forEach(req => {
                    const card = document.createElement('div');
                    card.className = 'card submission-item';
                    card.style.borderLeft = '5px solid var(--color-primary)';
                    
                    const kidName = gameState[req.kidId].name;
                    card.innerHTML = `
                        <div class="card-title">${req.config.icon} ${req.config.title}</div>
                        <div class="submission-meta">👤 Reclamado por: <strong>${kidName}</strong></div>
                        <p style="margin: 5px 0 15px 0; font-size: 0.95rem;">${req.config.desc}</p>
                        <div class="judge-actions" style="display:flex; gap:10px;">
                            <button class="btn-reject" style="flex:1;" onclick="rejectReward('${req.kidId}', '${req.rewardId}')">❌ Denegar</button>
                            <button class="btn-approve" style="flex:1;" onclick="approveReward('${req.kidId}', '${req.rewardId}')">✅ Otorgar</button>
                        </div>
                    `;
                    rewardsList.appendChild(card);
                });
            }
        }
    } else if (currentJudgeTab === 'approved') {
        const list = document.getElementById('approved-missions-list');
        list.innerHTML = '';

        const approvedList = getApprovedMissions();
        if (approvedList.length === 0) {
            list.innerHTML = '<p style="text-align:center; padding:20px; color: var(--color-gray-dark);">No hay misiones aprobadas en el historial.</p>';
        }

        for (const p of approvedList) {
            try {
                const kidName = gameState[p.kid] ? gameState[p.kid].name : p.kid;
                
                if (!p.data || !p.data.submission) {
                    continue;
                }

                const dataHtml = await renderSubmissionData(p.data.submission);
                const awardedXP = p.data.awardedXP !== undefined ? p.data.awardedXP : (p.config ? p.config.xp : 15);

                const card = document.createElement('div');
                card.className = 'card submission-item';
                card.style.borderLeft = '5px solid #2e7d32';
                card.style.padding = '18px';
                card.style.marginBottom = '20px';
                card.style.position = 'relative';

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 10px;">
                        <div>
                            <div class="card-title" style="font-size: 1.2rem; font-weight: 900; margin-bottom: 4px; color: #2e7d32; text-align: left;">
                                ${p.config ? p.config.title : p.missionId}
                            </div>
                            <div style="font-size: 0.82rem; color: var(--color-gray-dark); text-align: left;">
                                👤 <strong>${kidName}</strong> | 📅 Día ${p.config ? p.config.day : 'N/A'} | 📍 ${p.config ? (p.config.location || 'N/A') : 'N/A'}
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="background: #2e7d32; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: bold; white-space: nowrap;">
                                +${awardedXP} XP
                            </div>
                            <button class="btn-reject" style="font-size: 0.8rem; padding: 5px 10px; border-radius: 20px; min-height: unset; cursor: pointer; border: none; background: #e53935; color: white;" onclick="undoApproveMission('${p.kid}', '${p.missionId}')">↩️ Deshacer</button>
                        </div>
                    </div>

                    <!-- Evidencia Entregada -->
                    <div style="background: white; border: 1px solid #efebe9; border-radius: 10px; padding: 12px; text-align: left; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                        <div style="font-size: 0.78rem; font-weight: bold; text-transform: uppercase; color: #2e7d32; margin-bottom: 8px; border-bottom: 1px solid #f5f2f0; padding-bottom: 4px; letter-spacing: 0.3px;">📥 Evidencia entregada:</div>
                        <div style="font-size: 0.95rem; color: #3e2723; word-break: break-word;">${dataHtml}</div>
                    </div>
                `;
                list.appendChild(card);
            } catch (err) {
                console.error(`Error rendering approved mission ${p.missionId}:`, err);
            }
        }
    }

    switchView('view-judge', true, "Panel del Juez");
}

window.approveMission = (kid, missionId, xp, isFamily) => {
    let leveledUp = false;
    let newBadges = [];

    if (isFamily) {
        gameState['kid9'].missions[missionId].status = 'approved';
        gameState['kid14'].missions[missionId].status = 'approved';
        gameState['kid9'].missions[missionId].awardedXP = xp;
        gameState['kid14'].missions[missionId].awardedXP = xp;
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
        gameState[kid].missions[missionId].awardedXP = xp;
        gameState[kid].xp += xp;
        
        leveledUp = checkLevelUp(kid);
        newBadges = checkBadges(kid, missionId);
    }
    saveState();
    
    if (newBadges.length > 0) {
        showNewBadges(newBadges);
    }

    if (!leveledUp) {
        launchConfetti(); // Si subió de nivel ya lanza su propia animación
    }
    renderJudgePanel();
};

window.rejectMission = (kid, missionId) => {
    const feedback = prompt("Escribe el motivo del rechazo (para guiar al explorador en su próximo intento):");
    if (feedback === null) {
        // Cancelado por el juez, no se rechaza la misión
        return;
    }
    
    const reason = feedback.trim() || "No se especificó un motivo concreto.";
    const missionState = gameState[kid].missions[missionId];
    const isFamily = missionState && missionState.submission && missionState.submission.type === 'family';

    if (isFamily) {
        ['kid9', 'kid14'].forEach(k => {
            if (gameState[k].missions[missionId]) {
                gameState[k].missions[missionId].status = 'unlocked';
                gameState[k].missions[missionId].submission = null;
                gameState[k].missions[missionId].feedback = reason;
                if (gameState[k].counters) {
                    gameState[k].counters.physicalStreak = 0;
                    if(MISSIONS_CONFIG[missionId] && (MISSIONS_CONFIG[missionId].tag === 'expert' || MISSIONS_CONFIG[missionId].title.includes('Terminal'))) {
                        gameState[k].counters.cryptoSolvedFirstTry = false;
                    }
                }
            }
        });
    } else {
        gameState[kid].missions[missionId].status = 'unlocked';
        gameState[kid].missions[missionId].submission = null;
        gameState[kid].missions[missionId].feedback = reason;
        
        // Si falla, rompemos las rachas (para medalla olimpica o criptografo_elite)
        if(gameState[kid].counters) {
            gameState[kid].counters.physicalStreak = 0;
            if(MISSIONS_CONFIG[missionId] && (MISSIONS_CONFIG[missionId].tag === 'expert' || MISSIONS_CONFIG[missionId].title.includes('Terminal'))) {
                gameState[kid].counters.cryptoSolvedFirstTry = false;
            }
        }
    }
    
    saveState();
    renderJudgePanel();
};

function recalculateLevel(kidId) {
    const xp = gameState[kidId].xp;
    const levelsArr = kidId === 'kid9' ? LEVELS_LAURA : LEVELS_IVAN;
    let correctLevelIndex = 0;
    for (let i = 0; i < levelsArr.length; i++) {
        if (xp >= levelsArr[i].xp) {
            correctLevelIndex = i;
        } else {
            break;
        }
    }
    gameState[kidId].level = correctLevelIndex;
    saveState();
}

window.undoApproveMission = (kid, missionId) => {
    const m = gameState[kid].missions[missionId];
    if (!m || m.status !== 'approved') return;

    const xpToSubtract = m.awardedXP !== undefined ? m.awardedXP : (MISSIONS_CONFIG[missionId] ? MISSIONS_CONFIG[missionId].xp : 15);
    const isFamily = m.submission && m.submission.type === 'family';

    if (isFamily) {
        ['kid9', 'kid14'].forEach(k => {
            const km = gameState[k].missions[missionId];
            if (km && km.status === 'approved') {
                const kXpToSubtract = km.awardedXP !== undefined ? km.awardedXP : xpToSubtract;
                gameState[k].xp = Math.max(0, gameState[k].xp - kXpToSubtract);
                km.status = 'pending';
                km.feedback = null;
                recalculateLevel(k);
            }
        });
        showAlert('Deshecho', 'Se ha devuelto la misión conjunta al estado pendiente y restado la experiencia a ambos exploradores.');
    } else {
        gameState[kid].xp = Math.max(0, gameState[kid].xp - xpToSubtract);
        m.status = 'pending';
        m.feedback = null;
        recalculateLevel(kid);
        showAlert('Deshecho', `Se ha devuelto la misión al estado pendiente y restado la experiencia a ${gameState[kid].name}.`);
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

document.getElementById('btn-judge-reset-all').addEventListener('click', () => {
    if (confirm("⚠️ ¿Estás COMPLETAMENTE seguro de que quieres resetear TODA la aplicación? Se perderá todo el progreso de ambos niños (Laura e Iván), sus niveles, recompensas, fotos, audios y dibujos guardados. Esta acción es irreversible.")) {
        // 1. Limpiar localStorage
        localStorage.removeItem('japanMissionsState');
        
        // 2. Limpiar base de datos IndexedDB de multimedia
        if (window.indexedDB) {
            try {
                const DB_NAME = 'JapanTravelDB';
                const req = indexedDB.deleteDatabase(DB_NAME);
                req.onsuccess = () => {
                    console.log("IndexedDB eliminada correctamente.");
                    location.reload();
                };
                req.onerror = () => {
                    console.error("Error al eliminar IndexedDB.");
                    location.reload();
                };
                req.onblocked = () => {
                    console.warn("Borrado bloqueado temporalmente. Recargando igualmente.");
                    location.reload();
                };
            } catch (err) {
                console.error("Error durante el borrado de IndexedDB:", err);
                location.reload();
            }
        } else {
            location.reload();
        }
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

// ==========================================
// CONFIGURACIÓN DE LOGROS XBOX Y RECOMPENSAS
// ==========================================

const BADGES_CONFIG = {
    'medalla_olimpica': { title: 'Medalla Olímpica', icon: '🥇', points: 150, desc: 'Completa 5 desafíos físicos (misión con 🏃) seguidos sin fallar.' },
    'bateria_inagotable': { title: 'Batería Inagotable', icon: '🔋', points: 100, desc: 'Envía 3 pruebas al Juez antes de las 8:00 o después de las 22:00.' },
    'sincronizacion_perfecta': { title: 'Sincronización Perfecta', icon: '🤝', points: 150, desc: 'Completa 5 misiones conjuntas aprobadas.' },
    'estomago_acero': { title: 'Estómago de Acero', icon: '🍜', points: 100, desc: 'Completa 3 misiones de probar platos extraños, snacks raros o takoyaki.' },
    'criptografo_elite': { title: 'Criptógrafo de Élite', icon: '🔐', points: 200, desc: 'Supera 3 misiones tipo "Terminal" al primer intento.' }
};

const REWARDS_CONFIG = {
    "combini_sweet": {
        id: "combini_sweet",
        title: "Dulce del Combini",
        desc: "Elegir un helado o dulce en un Combini o máquina expendedora.",
        pointsRequired: 100,
        icon: "🍦"
    },
    "dinner_choice": {
        id: "dinner_choice",
        title: "Elección de Cena",
        desc: "Elegir el restaurante o plato para la cena de hoy.",
        pointsRequired: 200,
        icon: "🍣"
    },
    "gachapon_extra": {
        id: "gachapon_extra",
        title: "Gachapon/Garra Extra",
        desc: "Una tirada extra de gachapon o intento en máquina de garra arcade.",
        pointsRequired: 350,
        icon: "🧸"
    },
    "supreme_wish": {
        id: "supreme_wish",
        title: "Deseo Supremo",
        desc: "Un deseo especial concedido por el Juez Supremo (dentro de lo razonable).",
        pointsRequired: 500,
        icon: "⛩️"
    }
};

function getGamerscore(kidId) {
    const badges = gameState[kidId].badges || [];
    let score = 0;
    badges.forEach(bId => {
        if (BADGES_CONFIG[bId]) {
            score += BADGES_CONFIG[bId].points;
        }
    });
    return score;
}

function playXboxSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const playTone = (freq, startTime, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        };
        
        const now = ctx.currentTime;
        playTone(1046.50, now, 0.4);       // C6
        playTone(1318.51, now + 0.08, 0.4); // E6
        playTone(1567.98, now + 0.16, 0.4); // G6
        playTone(2093.00, now + 0.24, 0.6); // C7
    } catch (e) {
        console.error("Audio Context fallido", e);
    }
}

function showXboxAchievementToast(badge) {
    const toast = document.createElement('div');
    toast.className = 'xbox-toast';
    
    const points = BADGES_CONFIG[badge.id] ? BADGES_CONFIG[badge.id].points : 100;
    
    toast.innerHTML = `
        <div class="xbox-toast-ring">${badge.icon}</div>
        <div class="xbox-toast-text">
            <span class="xbox-toast-title">¡Logro desbloqueado!</span>
            <span class="xbox-toast-msg">${badge.title} <span class="xbox-toast-score">${points}G</span></span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Reproducir chime de Xbox
    playXboxSound();
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 600);
    }, 4000);
}

function showNewBadges(newBadges) {
    newBadges.forEach((b, idx) => {
        setTimeout(() => {
            showXboxAchievementToast(b);
        }, idx * 4500);
    });
}

function getRequestedRewards() {
    const requested = [];
    ['kid9', 'kid14'].forEach(kidId => {
        const rewards = gameState[kidId].rewards || {};
        Object.keys(rewards).forEach(rewardId => {
            if (rewards[rewardId] === 'requested') {
                requested.push({
                    kidId: kidId,
                    rewardId: rewardId,
                    config: REWARDS_CONFIG[rewardId]
                });
            }
        });
    });
    return requested;
}

window.requestReward = (kidId, rewardId) => {
    if (!gameState[kidId].rewards) gameState[kidId].rewards = {};
    gameState[kidId].rewards[rewardId] = 'requested';
    saveState();
    showAlert('Reclamado', '¡Se ha enviado tu solicitud al Juez Supremo!');
    renderPassportView(kidId);
};

window.approveReward = (kidId, rewardId) => {
    if (!gameState[kidId].rewards) gameState[kidId].rewards = {};
    gameState[kidId].rewards[rewardId] = 'claimed';
    saveState();
    launchConfetti();
    showAlert('Recompensa Otorgada', `Has concedido la recompensa "${REWARDS_CONFIG[rewardId].title}" a ${gameState[kidId].name}.`);
    renderJudgePanel();
};

window.rejectReward = (kidId, rewardId) => {
    if (!gameState[kidId].rewards) gameState[kidId].rewards = {};
    gameState[kidId].rewards[rewardId] = 'unlocked';
    saveState();
    showAlert('Recompensa Denegada', `Has denegado la recompensa a ${gameState[kidId].name}. Volverá a estar disponible para reclamar.`);
    renderJudgePanel();
};

function renderPassportView(viewedKidId) {
    const isMe = (viewedKidId === currentUser);
    const kidData = gameState[viewedKidId];
    const siblingId = viewedKidId === 'kid9' ? 'kid14' : 'kid9';
    const siblingData = gameState[siblingId];
    
    const container = document.getElementById('passport-content');
    container.innerHTML = '';
    
    const levelsArr = viewedKidId === 'kid9' ? LEVELS_LAURA : LEVELS_IVAN;
    const currentLevelIdx = kidData.level || 0;
    const levelData = levelsArr[currentLevelIdx];
    const gamerscore = getGamerscore(viewedKidId);
    
    const heroCard = document.createElement('div');
    heroCard.className = 'passport-hero-card card';
    
    heroCard.innerHTML = `
        <div class="hero-header-info">
            <span class="hero-avatar">${viewedKidId === 'kid9' ? '🦊' : '🐉'}</span>
            <div class="hero-text">
                <h2 style="margin: 0; font-size: 1.8rem; line-height: 1.2;">${kidData.name}</h2>
                <div class="hero-rank" style="font-size: 0.95rem; font-weight: bold; margin-top: 4px;">${levelData.icon} ${levelData.title}</div>
            </div>
            <div class="hero-gamerscore">
                <span class="gs-icon">G</span>
                <span class="gs-value">${gamerscore}</span>
            </div>
        </div>
        <div class="hero-stats-row" style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
            <span>Nivel ${currentLevelIdx}</span>
            <span>${kidData.xp} XP</span>
        </div>
    `;
    container.appendChild(heroCard);
    
    const achievementsTitle = document.createElement('h3');
    achievementsTitle.className = 'passport-section-title';
    achievementsTitle.innerText = `Logros (${kidData.badges.length} / 5)`;
    container.appendChild(achievementsTitle);
    
    const grid = document.createElement('div');
    grid.className = 'achievements-grid';
    
    Object.keys(BADGES_CONFIG).forEach(badgeId => {
        const badge = BADGES_CONFIG[badgeId];
        const isUnlocked = kidData.badges.includes(badgeId);
        
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        if (isUnlocked) {
            badgeCard.innerHTML = `
                <div class="badge-icon-wrapper">
                    <span class="badge-icon">${badge.icon}</span>
                </div>
                <div class="badge-info">
                    <h4>${badge.title}</h4>
                    <p>${badge.desc}</p>
                    <span class="badge-points">+${badge.points}G</span>
                </div>
            `;
        } else {
            let currentProg = 0;
            let maxProg = 5;
            const counters = kidData.counters || {};
            if (badgeId === 'medalla_olimpica') {
                currentProg = counters.physicalStreak || 0;
                maxProg = 5;
            } else if (badgeId === 'bateria_inagotable') {
                currentProg = counters.earlyLateSubmissions || 0;
                maxProg = 3;
            } else if (badgeId === 'sincronizacion_perfecta') {
                currentProg = counters.perfectJointMissions || 0;
                maxProg = 5;
            } else if (badgeId === 'estomago_acero') {
                currentProg = counters.foodMissions || 0;
                maxProg = 3;
            } else if (badgeId === 'criptografo_elite') {
                currentProg = counters.expertMissions || 0;
                maxProg = 3;
                if (counters.cryptoSolvedFirstTry === false) {
                    currentProg = 0;
                }
            }
            
            const percent = Math.min(100, Math.floor((currentProg / maxProg) * 100));
            
            badgeCard.innerHTML = `
                <div class="badge-icon-wrapper">
                    <span class="badge-icon">🔒</span>
                </div>
                <div class="badge-info">
                    <h4>${badge.title} <span style="font-size:0.8rem; opacity:0.6; font-weight:normal;">(${badge.points}G)</span></h4>
                    <p>${badge.desc}</p>
                    <div class="badge-progress-container">
                        <div class="badge-progress-bar">
                            <div class="badge-progress-fill" style="width: ${percent}%;"></div>
                        </div>
                        <span class="badge-progress-text">${currentProg} / ${maxProg}</span>
                    </div>
                </div>
            `;
        }
        grid.appendChild(badgeCard);
    });
    container.appendChild(grid);
    
    const rewardsTitle = document.createElement('h3');
    rewardsTitle.className = 'passport-section-title';
    rewardsTitle.innerText = `Recompensas del Juez`;
    container.appendChild(rewardsTitle);
    
    const rewardsContainer = document.createElement('div');
    rewardsContainer.className = 'rewards-grid';
    
    if (!kidData.rewards) kidData.rewards = {};
    
    Object.keys(REWARDS_CONFIG).forEach(rewardId => {
        const reward = REWARDS_CONFIG[rewardId];
        const status = kidData.rewards[rewardId] || 'locked';
        
        let finalStatus = status;
        if (status === 'locked' && gamerscore >= reward.pointsRequired) {
            finalStatus = 'unlocked';
        } else if (status !== 'claimed' && status !== 'requested' && gamerscore < reward.pointsRequired) {
            finalStatus = 'locked';
        }
        
        const rewardCard = document.createElement('div');
        rewardCard.className = `reward-card card reward-${finalStatus}`;
        
        let actionBtnHtml = '';
        if (isMe) {
            if (finalStatus === 'unlocked') {
                actionBtnHtml = `<button class="btn-primary btn-claim-reward" onclick="requestReward('${viewedKidId}', '${rewardId}')">🎁 Reclamar al Juez</button>`;
            } else if (finalStatus === 'requested') {
                actionBtnHtml = `<div class="reward-status-label status-pending">⏳ Esperando al Juez</div>`;
            } else if (finalStatus === 'claimed') {
                actionBtnHtml = `<div class="reward-status-label status-approved">✅ Concedido por el Juez</div>`;
            } else {
                actionBtnHtml = `<div class="reward-status-label reward-locked-label">🔒 Requiere ${reward.pointsRequired}G</div>`;
            }
        } else {
            if (finalStatus === 'claimed') {
                actionBtnHtml = `<div class="reward-status-label status-approved">✅ Conseguido por ${kidData.name}</div>`;
            } else if (finalStatus === 'requested') {
                actionBtnHtml = `<div class="reward-status-label status-pending">⏳ Solicitado por ${kidData.name}</div>`;
            } else {
                actionBtnHtml = `<div class="reward-status-label reward-locked-label">${finalStatus === 'locked' ? '🔒' : '🔓'} ${reward.pointsRequired}G</div>`;
            }
        }
        
        rewardCard.innerHTML = `
            <div class="reward-header">
                <span class="reward-icon">${reward.icon}</span>
                <div class="reward-title-group">
                    <h4>${reward.title}</h4>
                    <span class="reward-cost">${reward.pointsRequired}G</span>
                </div>
            </div>
            <p class="reward-desc">${reward.desc}</p>
            <div class="reward-action-area">
                ${actionBtnHtml}
            </div>
        `;
        rewardsContainer.appendChild(rewardCard);
    });
    container.appendChild(rewardsContainer);
}

document.getElementById('btn-passport-me').addEventListener('click', () => {
    document.getElementById('btn-passport-me').classList.add('active');
    document.getElementById('btn-passport-sibling').classList.remove('active');
    renderPassportView(currentUser);
});

document.getElementById('btn-passport-sibling').addEventListener('click', () => {
    document.getElementById('btn-passport-sibling').classList.add('active');
    document.getElementById('btn-passport-me').classList.remove('active');
    const siblingId = currentUser === 'kid9' ? 'kid14' : 'kid9';
    renderPassportView(siblingId);
});

document.getElementById('btn-passport').addEventListener('click', () => {
    if (!currentUser || currentUser === 'judge') {
        currentUser = 'kid9'; 
        renderDaysList('kid9'); 
    }
    document.getElementById('nav-btn-passport').click();
});

document.getElementById('nav-btn-passport').addEventListener('click', () => {
    if (!currentUser || currentUser === 'judge') {
        showAlert('Atención', 'Selecciona un explorador primero para ver el pasaporte.');
        return;
    }
    const siblingId = currentUser === 'kid9' ? 'kid14' : 'kid9';
    document.getElementById('btn-passport-sibling').innerText = `Logros de ${gameState[siblingId].name}`;
    
    document.getElementById('btn-passport-me').classList.add('active');
    document.getElementById('btn-passport-sibling').classList.remove('active');
    
    renderPassportView(currentUser);
    switchView('view-passport', true, "Pasaporte");
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
    
    // Comprobación de versión automática al iniciar la app
    setTimeout(() => {
        checkAppUpdates(false);
    }, 1000);
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
                
                // Limpiar valor anterior para asegurar que se dispare onchange si eligen el mismo archivo
                input.value = '';
                
                if (categoryId === 'texturas_sonidos') {
                    if (confirm('¿Quieres grabar un Sonido en lugar de tomar una Foto?')) {
                        input.accept = 'audio/*';
                        input.removeAttribute('capture'); 
                    } else {
                        input.accept = 'image/*';
                        input.setAttribute('capture', 'environment');
                    }
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

// ==========================================
// LÓGICA DE COMPROBACIÓN DE ACTUALIZACIÓN (GITHUB)
// ==========================================

let isRefreshingApp = false;

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isRefreshingApp) return;
        isRefreshingApp = true;
        window.location.reload();
    });
}

function getVersionFromText(text) {
    const match = text.match(/CACHE_NAME\s*=\s*['"]japan-missions-v([^'"]+)['"]/);
    return match ? match[1] : null;
}

async function checkAppUpdates(isManual = false) {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') {
        const versionLabel = document.getElementById('app-version-label');
        if (versionLabel) versionLabel.innerText = 'Versión: Local (Desarrollo)';
        if (isManual) showAlert('Actualizaciones', 'El Service Worker no está activo en este protocolo (ej. archivo local).');
        return;
    }

    const versionLabel = document.getElementById('app-version-label');
    const checkBtn = document.getElementById('btn-check-update');

    if (isManual && checkBtn) {
        checkBtn.disabled = true;
        checkBtn.innerText = 'Comprobando...';
    }

    try {
        const localRes = await fetch('./sw.js?t=' + Date.now());
        if (!localRes.ok) throw new Error('No se pudo acceder al Service Worker local.');
        const localText = await localRes.text();
        const localVersion = getVersionFromText(localText);

        if (!localVersion) {
            if (versionLabel) versionLabel.innerText = 'Versión: Indeterminada';
            if (isManual) showAlert('Error', 'No se pudo leer la versión local en sw.js.');
            return;
        }

        if (versionLabel) {
            versionLabel.innerText = `Versión actual: v${localVersion}`;
        }

        // Usamos la rama master detectada localmente con cache-buster
        const githubRes = await fetch('https://raw.githubusercontent.com/fbrasero-glitch/app-juegos-japon/master/sw.js?t=' + Date.now());
        if (!githubRes.ok) throw new Error('No se pudo conectar con GitHub.');
        const githubText = await githubRes.text();
        const githubVersion = getVersionFromText(githubText);

        if (!githubVersion) {
            if (isManual) showAlert('Error', 'No se pudo leer la versión remota.');
            return;
        }

        const localNum = parseInt(localVersion, 10);
        const remoteNum = parseInt(githubVersion, 10);

        if (!isNaN(localNum) && !isNaN(remoteNum) && remoteNum > localNum) {
            const toast = document.getElementById('update-toast');
            const toastVer = document.getElementById('update-toast-version');
            if (toast && toastVer) {
                toastVer.innerText = `v${githubVersion}`;
                toast.classList.remove('hidden');
            }
            if (isManual) {
                showAlert('Nueva Versión', `Se ha encontrado una versión más reciente (v${githubVersion}). Iniciando actualización...`);
                triggerSWUpdate();
            }
        } else {
            if (isManual) {
                showAlert('Al día', `La aplicación ya está en su versión más moderna (v${localVersion}).`);
            }
        }
    } catch (err) {
        console.error('Error al comprobar actualización:', err);
        if (isManual) {
            showAlert('Error de conexión', 'No se pudo conectar a GitHub. Comprueba tu conexión a Internet.');
        }
    } finally {
        if (isManual && checkBtn) {
            checkBtn.disabled = false;
            checkBtn.innerText = 'Buscar actualización';
        }
    }
}

async function triggerSWUpdate() {
    if ('serviceWorker' in navigator) {
        const updateBtn = document.getElementById('btn-update-now');
        if (updateBtn) {
            updateBtn.disabled = true;
            updateBtn.innerText = 'Actualizando...';
        }
        try {
            const reg = await navigator.serviceWorker.ready;
            await reg.update();
            console.log('Actualización forzada en el Service Worker.');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (err) {
            console.error('Error al actualizar Service Worker:', err);
            showAlert('Error', 'No se pudo completar la actualización automática.');
            if (updateBtn) {
                updateBtn.disabled = false;
                updateBtn.innerText = 'Actualizar';
            }
        }
    }
}

// Eventos del updater
const btnCheckUpdate = document.getElementById('btn-check-update');
if (btnCheckUpdate) {
    btnCheckUpdate.addEventListener('click', () => checkAppUpdates(true));
}
const btnUpdateNow = document.getElementById('btn-update-now');
if (btnUpdateNow) {
    btnUpdateNow.addEventListener('click', triggerSWUpdate);
}
const btnUpdateClose = document.getElementById('btn-update-close');
if (btnUpdateClose) {
    btnUpdateClose.addEventListener('click', () => {
        const toast = document.getElementById('update-toast');
        if (toast) toast.classList.add('hidden');
    });
}

// ==========================================
// 5. AUDIO SINTETIZADOR PROCEDIMENTAL Y UTILIDADES
// ==========================================
window.playProceduralSound = function(type) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        const playTone = (freq, start, duration, oscType = 'sine', gainVal = 0.1) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = oscType;
            osc.frequency.setValueAtTime(freq, start);
            
            gainNode.gain.setValueAtTime(0, start);
            gainNode.gain.linearRampToValueAtTime(gainVal, start + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start(start);
            osc.stop(start + duration);
            return { osc, gain: gainNode };
        };
        
        if (type === 'click') {
            playTone(800, now, 0.05, 'triangle', 0.15);
        } else if (type === 'success') {
            playTone(523.25, now, 0.12, 'sine', 0.1);       // C5
            playTone(659.25, now + 0.06, 0.12, 'sine', 0.1);  // E5
            playTone(783.99, now + 0.12, 0.12, 'sine', 0.1);  // G5
            playTone(1046.50, now + 0.18, 0.25, 'sine', 0.15); // C6
        } else if (type === 'error') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(90, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'jump') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'collect') {
            playTone(987.77, now, 0.08, 'sine', 0.15); // B5
            playTone(1318.51, now + 0.04, 0.2, 'sine', 0.15); // E6
        } else if (type === 'damage') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(250, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'rotate') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.linearRampToValueAtTime(550, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'win') {
            playTone(523.25, now, 0.2, 'sine', 0.1);
            playTone(659.25, now + 0.05, 0.2, 'sine', 0.1);
            playTone(783.99, now + 0.1, 0.2, 'sine', 0.1);
            playTone(987.77, now + 0.15, 0.25, 'sine', 0.1);
            playTone(1046.50, now + 0.2, 0.6, 'sine', 0.15);
        }
    } catch (e) {
        console.warn("Fallo en sonido procedimental:", e);
    }
};
