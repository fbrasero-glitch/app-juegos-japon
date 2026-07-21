// ==========================================
// 1. BASE DE DATOS Y ESTADO (localStorage + IndexedDB)
// ==========================================

const DEFAULT_STATE = {
    kid9: { 
        name: "Laura", xp: 0, level: 0, missions: {}, wallet: 0,
        badges: [], counters: { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true }, album: {}, rewards: {} 
    },
    kid14: { 
        name: "Iván", xp: 0, level: 0, missions: {}, wallet: 0,
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

var gameState = null;
var currentUser = null; // 'kid9', 'kid14', 'judge'
var currentDay = null; // Día que se está visualizando
var currentDayMissions = []; // Misiones del día actual
var currentJudgeTab = 'pending'; // Pestaña activa del juez ('pending' | 'approved')
var judgeListenersBound = false;

// ==========================================
// CONFIGURACIÓN DE BLOQUEO DE FECHAS (JAPÓN)
// ==========================================
const ENABLE_DATE_LOCK = false; // INACTIVO por defecto durante las pruebas
const TRIP_START_DATE = new Date(2026, 6, 27); // 27 de Julio de 2026 (Mes 6 = Julio)

function isDayLocked(dayNum) {
    if (!ENABLE_DATE_LOCK) return false;
    const japanDate = getJapanCurrentDate();
    const targetDate = new Date(TRIP_START_DATE.getTime());
    targetDate.setDate(TRIP_START_DATE.getDate() + (dayNum - 1));
    return japanDate < targetDate;
}

function getJapanCurrentDate() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
    const parts = formatter.formatToParts(now);
    let year, month, day;
    parts.forEach(p => {
        if (p.type === 'year') year = parseInt(p.value, 10);
        if (p.type === 'month') month = parseInt(p.value, 10) - 1; // constructor de Date usa meses 0-11
        if (p.type === 'day') day = parseInt(p.value, 10);
    });
    return new Date(year, month, day);
}
window.getJapanCurrentDate = getJapanCurrentDate;

function getDayDateString(dayNum) {
    const targetDate = new Date(TRIP_START_DATE.getTime());
    targetDate.setDate(TRIP_START_DATE.getDate() + (dayNum - 1));
    const day = targetDate.getDate();
    const month = targetDate.getMonth() === 6 ? "Julio" : "Agosto";
    return `${day} de ${month}`;
}

function getCurrentTripDay() {
    const japanDate = getJapanCurrentDate();
    const diffTime = japanDate.getTime() - TRIP_START_DATE.getTime();
    if (diffTime < 0) return 0;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function updateSpecialEventsBanner(role) {
    const banner = document.getElementById('special-events-banner');
    if (!banner) return;

    if (!role || role === 'judge') {
        banner.classList.add('hidden');
        return;
    }

    // 1. Obtener todos los eventos especiales para este explorador
    const specialEvents = Object.keys(MISSIONS_CONFIG)
        .filter(k => MISSIONS_CONFIG[k].tag === 'special' && (MISSIONS_CONFIG[k].role === role || MISSIONS_CONFIG[k].role === 'both'))
        .map(k => ({ id: k, ...MISSIONS_CONFIG[k] }))
        .sort((a, b) => {
            if (a.day !== b.day) return a.day - b.day;
            return a.startTime.localeCompare(b.startTime);
        });

    // 2. Encontrar el primer evento que no esté aprobado
    let activeEvent = null;
    for (let ev of specialEvents) {
        const state = gameState[role].missions[ev.id];
        if (state && state.status !== 'approved') {
            activeEvent = ev;
            break;
        }
    }

    if (!activeEvent) {
        banner.innerHTML = `<span>🎉 ¡Felicidades! Has completado todos los eventos especiales del viaje.</span>`;
        banner.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
        banner.style.border = '2px solid #81c784';
        banner.style.color = '#1b5e20';
        banner.classList.remove('hidden');
        return;
    }

    // 3. Determinar el estado temporal del evento seleccionado
    const now = new Date();
    const currentTripDay = getCurrentTripDay();
    const eventDateStr = getDayDateString(activeEvent.day);
    
    const startParts = activeEvent.startTime.split(':');
    const endParts = activeEvent.endTime.split(':');
    const startHour = parseInt(startParts[0], 10);
    const startMin = parseInt(startParts[1], 10);
    const endHour = parseInt(endParts[0], 10);
    const endMin = parseInt(endParts[1], 10);

    const isToday = activeEvent.day === currentTripDay || (!ENABLE_DATE_LOCK && activeEvent.day === 1);
    
    let statusText = '';
    let badgeText = '📅 PRÓXIMO EVENTO';
    let pulseStyle = '';
    let bgColor = 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
    let borderColor = '#ffb74d';
    let textColor = '#5d4037';
    let badgeBg = '#ffe082';
    let badgeColor = '#b77900';

    if (isToday) {
        const currentHourMin = now.getHours() * 100 + now.getMinutes();
        const startVal = startHour * 100 + startMin;
        const endVal = endHour * 100 + endMin;

        if (currentHourMin < startVal) {
            badgeText = '⏰ HOY MÁS TARDE';
            statusText = `<b>${activeEvent.title}</b> de <b>${activeEvent.startTime} a ${activeEvent.endTime}</b> (${activeEvent.location}). Prepárate para el aviso del juez.`;
        } else if (currentHourMin >= startVal && currentHourMin <= endVal) {
            badgeText = '🔥 ¡ACTIVO AHORA!';
            statusText = `<b>${activeEvent.title}</b>. Tienes hasta las <b>${activeEvent.endTime}</b> para entregar tu prueba. ¡Haz clic para abrirla!`;
            pulseStyle = 'animation: pulse-banner 2s infinite;';
            bgColor = 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)';
            borderColor = '#fbc02d';
            textColor = '#f57f17';
            badgeBg = '#f57f17';
            badgeColor = '#ffffff';
        } else {
            badgeText = '⏱️ HOY (FUERA DE HORA)';
            statusText = `<b>${activeEvent.title}</b> finalizó a las <b>${activeEvent.endTime}</b>. Esperando reprogramación o nueva oportunidad.`;
            bgColor = 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)';
            borderColor = '#ffb74d';
            textColor = '#e65100';
        }
    } else {
        let whenText = `${eventDateStr} (Día ${activeEvent.day})`;
        if (currentTripDay > 0 && activeEvent.day === currentTripDay + 1) {
            whenText = `Mañana (${eventDateStr})`;
        }
        statusText = `<b>${activeEvent.title}</b> programado para el <b>${whenText}</b> a las <b>${activeEvent.startTime}</b> (${activeEvent.location}).`;
    }

    if (!document.getElementById('pulse-banner-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-banner-style';
        style.innerHTML = `
            @keyframes pulse-banner {
                0% { transform: scale(1); box-shadow: 0 4px 10px rgba(255, 152, 0, 0.15); }
                50% { transform: scale(1.02); box-shadow: 0 4px 20px rgba(255, 152, 0, 0.35); }
                100% { transform: scale(1); box-shadow: 0 4px 10px rgba(255, 152, 0, 0.15); }
            }
        `;
        document.head.appendChild(style);
    }

    banner.style.background = bgColor;
    banner.style.border = `2px solid ${borderColor}`;
    banner.style.color = textColor;
    banner.style.cssText += pulseStyle;

    banner.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="status-badge" style="margin-top:0; font-size:0.75rem; background: ${badgeBg}; color: ${badgeColor}; padding: 3px 8px; border-radius: 6px;">${badgeText}</span>
                <span style="font-weight: bold; font-size: 0.8rem; color: ${borderColor};">💰 +${activeEvent.xp} XP</span>
            </div>
            <div style="line-height: 1.4;">${statusText}</div>
        </div>
    `;
    
    banner.onclick = () => {
        renderMissionDetail(activeEvent.id, role);
    };
    banner.style.cursor = 'pointer';
    banner.classList.remove('hidden');
}


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
        try {
            gameState = JSON.parse(saved);
            // Migración de datos para usuarios antiguos
            ['kid9', 'kid14'].forEach(kid => {
                if (gameState[kid].level === 1 && gameState[kid].xp === 0) gameState[kid].level = 0; // Ajustar a nivel 0 (0-9)
                if (!gameState[kid].badges) gameState[kid].badges = [];
                if (!gameState[kid].counters) gameState[kid].counters = { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true };
                if (!gameState[kid].album) gameState[kid].album = {};
                if (!gameState[kid].rewards) gameState[kid].rewards = {};
                if (gameState[kid].wallet === undefined) {
                    gameState[kid].wallet = (gameState[kid].xp || 0) * 5;
                }
            });
        } catch (e) {
            console.error("Error parseando estado local. Usando por defecto.", e);
            gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    
    // Inicializar proactivamente todas las misiones en memoria para asegurar sincronización completa
    ensureAllMissionsInitialized();
    // Guardar SOLO localmente (sin subir a Firebase) para no machacar datos remotos al arrancar
    localStorage.setItem('japanMissionsState', JSON.stringify(gameState));
}

function ensureAllMissionsInitialized() {
    if (!gameState || typeof MISSIONS_CONFIG === 'undefined') return;
    ['kid9', 'kid14'].forEach(kid => {
        if (!gameState[kid].missions) gameState[kid].missions = {};
        Object.keys(MISSIONS_CONFIG).forEach(mId => {
            const config = MISSIONS_CONFIG[mId];
            if (config) {
                if (config.role === kid || config.role === 'both') {
                    if (!gameState[kid].missions[mId]) {
                        gameState[kid].missions[mId] = {
                            status: "unlocked",
                            submission: null,
                            day: `day_${config.day}`,
                            statusUpdatedAt: 0
                        };
                    }
                }
            }
        });
    });
}

function saveState(changedFields = null) {
    if (gameState) {
        if (currentUser === 'kid9' || currentUser === 'kid14') {
            gameState[currentUser].lastUpdated = Date.now();
        }
    }
    localStorage.setItem('japanMissionsState', JSON.stringify(gameState));
    
    // Sincronizar remotamente SOLO si es un niño activo
    if (window.FirebaseSync && window.FirebaseSync.isConnected() && gameState) {
        if (currentUser === 'kid9' || currentUser === 'kid14') {
            if (changedFields) {
                window.FirebaseSync.syncProfileFields(currentUser, changedFields);
            } else {
                window.FirebaseSync.syncProfile(currentUser, gameState[currentUser]);
            }
        }
    }
}

// Función exclusiva para cuando el Juez aprueba/rechaza una misión o recompensa
function saveAndSyncJudgeDecision(kidId, changedFields = null) {
    if (!gameState || !gameState[kidId]) return;
    gameState[kidId].lastUpdated = Date.now();
    localStorage.setItem('japanMissionsState', JSON.stringify(gameState));
    if (window.FirebaseSync && window.FirebaseSync.isConnected()) {
        if (changedFields) {
            window.FirebaseSync.syncProfileFields(kidId, changedFields);
        } else {
            window.FirebaseSync.syncProfile(kidId, gameState[kidId]);
        }
    }
}

window.refreshCurrentView = function() {
    if (currentUser === 'judge') {
        renderJudgePanel();
    } else if (currentUser === 'kid9' || currentUser === 'kid14') {
        const role = currentUser;
        if (window.currentSubView === 'mission-detail' && window.activeMissionId) {
            renderMissionDetail(window.activeMissionId, role, true);
        } else if (window.currentSubView === 'day-detail' && currentDay && currentDayMissions) {
            renderDayMissions(role, currentDay, currentDayMissions);
        } else {
            renderDaysList(role);
        }
    }
};

// Inicializar misiones vacías si no existen
function initMissionsForDay(dayStr, missionIds) {
    ['kid9', 'kid14'].forEach(kid => {
        missionIds.forEach(id => {
            if (!gameState[kid].missions[id]) {
                gameState[kid].missions[id] = { status: "unlocked", submission: null, day: dayStr, statusUpdatedAt: 0 };
            }
        });
    });
    saveState();
}

// IndexedDB: funciones provistas por dbHelper.js (savePhotoToDB, getMedia, saveMedia, initIndexedDB)

// Interceptador para subir fotos a Firebase además de guardarlas en IndexedDB local
setTimeout(() => {
    const originalSavePhotoToDB = window.savePhotoToDB;
    window.savePhotoToDB = async function(id, dataUrl) {
        if (originalSavePhotoToDB) {
            await originalSavePhotoToDB(id, dataUrl);
        } else if (window.saveMedia) {
            await window.saveMedia(id, dataUrl);
        }
        if (window.FirebaseSync && window.FirebaseSync.isConnected()) {
            window.FirebaseSync.syncPhoto(id, dataUrl);
        }
    };
}, 100);

// getPhotoFromDB con Caché Híbrida local/nube
async function getPhotoFromDB(id) {
    let localData = null;
    if (window.getMedia) {
        localData = await window.getMedia(id);
    }
    if (localData) {
        return localData;
    }
    
    // Descarga desde la nube bajo demanda
    if (window.FirebaseSync && window.FirebaseSync.isConnected()) {
        const remoteData = await window.FirebaseSync.fetchPhoto(id);
        if (remoteData) {
            if (window.saveMedia) {
                // Desactivar temporalmente la auto-descarga a la galería del dispositivo
                const oldTrigger = window.triggerDeviceDownload;
                window.triggerDeviceDownload = () => {};
                await window.saveMedia(id, remoteData);
                window.triggerDeviceDownload = oldTrigger;
            }
            return remoteData;
        }
    }
    return null;
}

// ==========================================
// 2. UTILIDADES
// ==========================================

const TAG_ICONS = {
    photo: '📸', video: '🎬', audio: '🎙️', writing: '✍️',
    expert: '⚡', economy: '💰', sensors: '📡', physical: '🏃',
    game: '🎮', culture: '🏯', mixed: '🔀', special: '🌟'
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

function getMissionClue(missionId) {
    const clues = {
        "day_1_customs": "El límite legal de divisas para declarar sin impuestos al entrar a Japón es de 1.000.000 de yenes.",
        "day_1_flight_radar": "Los motores a reacción de un avión producen un zumbido grave de muy baja frecuencia.",
        "day_1_eta": "Divide la distancia total de 3600 km entre la velocidad actual para obtener las horas estimadas.",
        "day_1_clock": "Resta exactamente 7 horas a las 22:00 para conocer la hora en España (las 15:00).",
        "day_1_emergency": "Busca el pictograma oficial de color verde donde sale un monigote corriendo por una puerta.",
        "day_1_translation": "El saludo formal en japonés para 'hola' o 'buenas tardes' es 'Konnichiwa' (こんにちは).",
        "day_2_cangrejo": "Observa el cangrejo gigante: mueve sus pinzas hacia arriba/abajo y sus patas lateralmente de forma articulada.",
        "day_2_katana": "El precio promedio de un cuchillo artesanal de alta gama en Kuromon ronda los 15.000 yenes.",
        "day_2_buda": "El Todai-ji es famoso por su Gran Buda de bronce. La flor de loto esculpida en su base tiene exactamente 56 pétalos.",
        "day_2_kanji": "Asegúrate de dibujar los kanjis de Persona (人) y Montaña (山) respetando la dirección de los trazos.",
        "day_2_column": "El agujero en la base de la columna mide lo mismo que una fosa nasal del Gran Buda. ¡Pruébalo!",
        "day_3_ninja": "Camina despacio, pisando con suavidad únicamente sobre las zonas marcadas en rojo para no hacer sonar la madera.",
        "day_4_vending_roulette": "Busca una máquina de vending y selecciona un refresco con sabor original a melón, uva o té verde.",
        "day_6_clouds": "Dibuja un trazo suave que represente la forma de una nube en el canvas antes de pulsar guardar.",
        "day_8_kid14_bamboo_eng": "La altura promedio de los bambúes gigantes en Arashiyama oscila entre los 15 y 30 metros.",
        "day_8_kid14_codigo": "Asocia los números del código a los símbolos tradicionales japoneses en el jardín del templo.",
        "day_8_kid9_rake": "Traza líneas paralelas y ondas concéntricas en la arena digital simulando un rastrillo Zen.",
        "day_8_kid14_haiku": "Un Haiku clásico tiene tres versos de 5, 7 y 5 sílabas respectivamente. Escribe sobre la paz del templo.",
        "day_9_kid14_torii_count": "Es imposible contarlos todos con precisión, pero hay más de 10.000 toriis en Fushimi Inari.",
        "day_9_kid14_heart": "Tu pulso se acelera al subir la montaña. El latido típico al subir escaleras está entre 100 y 130 bpm.",
        "day_9_kid14_phoenix": "El Pabellón Dorado (Kinkaku-ji) tiene un fénix de bronce dorado en su tejado que representa el renacimiento.",
        "day_9_kid9_zorros": "Busca estatuas de zorros (Kitsune), los mensajeros del dios Inari. Suelen llevar una llave en la boca.",
        "day_9_kid14_ave": "Mantén el equilibrio concentrándote en un punto fijo para mantenerte erguido sobre un solo pie.",
        "day_10_kid9_dragon": "El techo de la sala principal del templo Tenryu-ji tiene pintado un enorme dragón que parece mirarte desde cualquier ángulo.",
        "day_10_kid14_milla": "El mercado de Nishiki es estrecho y largo. Se le conoce como 'la cocina de Kioto' y mide unos 400 metros de longitud.",
        "day_11_onsen": "Recuerda que antes de entrar al agua termal (onsen) debes lavarte a fondo y no meter la toalla en la poza.",
        "day_11_yukata": "El cruce de la Yukata debe ser siempre el lado izquierdo sobre el derecho (el derecho encima es para funerales).",
        "day_12_silence": "Mantén el silencio absoluto en el santuario sintoísta para no perturbar a los kamis (espíritus protectores).",
        "day_12_sake": "La destilería tradicional de sake fue fundada en el año 1703 (resta este año a 2026 para los años de antigüedad).",
        "day_12_patrol": "Cuenta las luces tradicionales o farolillos de madera que iluminan las calles del barrio histórico de Sanmachi Suji.",
        "day_13_stairs": "El templo Chureito Pagoda requiere subir una larga escalinata. Tiene exactamente 398 escalones.",
        "day_13_manhole": "Las tapas de alcantarilla en Japón son obras de arte de metal. Busca la que tiene el diseño del Monte Fuji con flores.",
        "day_13_volcano": "El Monte Fuji es un estratovolcán activo, y su última gran erupción histórica ocurrió en el año 1707.",
        "day_13_triangulation": "La distancia en línea recta desde la pagoda de Chureito hasta la cima del Monte Fuji es de aproximadamente 26 km.",
        "day_14_echo": "La roca volcánica porosa de Aokigahara absorbe las ondas sonoras, haciendo que no haya eco en absoluto.",
        "day_15_deity": "La deidad sintoísta consagrada en el santuario de la base del volcán es Konohanasakuya-hime (princesa de las flores).",
        "day_15_roof": "Los tejados de paja empinados de Shirakawa-go evitan que la pesada nieve de invierno se acumule y los hunda.",
        "day_16_traffic": "El sonido audible de los semáforos de peatones en Japón suele imitar el canto del cuco o de un pollito.",
        "day_17_sumida": "Graba el paso del barco bajo alguno de los puentes históricos (como el puente de Azuma o el puente de Kiyosu).",
        "day_18_crossing": "En cada ciclo de semáforo en verde del cruce de Shibuya cruzan unas 3.000 personas de media.",
        "day_19_gundam": "El código del modelo gigante en Odaiba es RX-0 Unicorn Gundam (búscalo en el hombro o en los carteles).",
        "day_20_vintage": "Los videojuegos retro de Akihabara se almacenaban originalmente en cartuchos de plástico de 8 o 16 bits.",
        "day_21_monkeys": "Los macacos japoneses de las montañas de Kioto se bañan en aguas termales para combatir las heladas de invierno.",
        "day_22_shout": "El grito de bienvenida de los vendedores de pescado de Tsukiji/Toyosu debe ser enérgico: '¡Irasshaimase!'",
        "day_23_kitkat": "Busca sabores exóticos de KitKat como Wasabi, Sake, Melón de Hokkaido, Té Matcha o Batata Morada."
    };
    return clues[missionId] || "Revisa la información disponible a tu alrededor, lee con atención las instrucciones de la misión y comprueba tu respuesta.";
}

function showAlert(title, message) {
    let isValidationError = false;
    if (window._missionStartTime && window.activeMissionId) {
        const t = title.toLowerCase();
        const m = message.toLowerCase();
        const keywords = ['error', 'fallo', 'incorrecto', 'intentos', 'fallaste', 'revisa', 'de nuevo', 'inválido', 'inexacto', 'incoherente', 'erróneo', 'errón'];
        isValidationError = keywords.some(k => t.includes(k) || m.includes(k));
    }

    if (isValidationError) {
        const currentFailedAttempt = window._missionAttempts || 1;
        window._missionAttempts = currentFailedAttempt + 1;
        console.log(`Intento de misión fallido detectado. Intento fallido: ${currentFailedAttempt}. Siguiente intento: ${window._missionAttempts}`);

        // Determinar dinámicamente si es opción múltiple con <= 3 opciones para limitar a 2 intentos
        let maxAttempts = 3;
        const wrapper = document.getElementById('mission-form-wrapper');
        if (wrapper) {
            const select = wrapper.querySelector('select');
            if (select) {
                const validOptions = Array.from(select.options).filter(opt => opt.value !== '');
                if (validOptions.length > 0 && validOptions.length <= 3) {
                    maxAttempts = 2;
                }
            }
            const radios = wrapper.querySelectorAll('input[type="radio"]');
            if (radios.length > 0 && radios.length <= 3) {
                maxAttempts = 2;
            }
        }

        if (maxAttempts === 2) {
            if (currentFailedAttempt === 1) {
                // Primer fallo (y único de gracia): mostrar error + pista de inmediato
                const missionId = window.activeMissionId;
                const clue = getMissionClue(missionId);
                document.getElementById('alert-title').innerText = title + ' (¡Pista disponible!)';
                document.getElementById('alert-message').innerText = message + '\n\n💡 PISTA:\n' + clue;
                document.getElementById('alert-modal').classList.remove('hidden');
            } else if (currentFailedAttempt >= 2) {
                // Segundo fallo: Auto-enviar al juez como fallida
                const missionId = window.activeMissionId;
                
                const inputs = document.querySelectorAll('#mission-form-wrapper input, #mission-form-wrapper textarea, #mission-form-wrapper select');
                let dataVal = '';
                if (inputs.length > 0) {
                    const vals = Array.from(inputs).map(input => {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            return input.checked ? (input.nextSibling?.textContent?.trim() || input.value || 'seleccionado') : '';
                        }
                        return input.value;
                    }).filter(Boolean);
                    dataVal = vals.join(', ') || 'Sin valor ingresado';
                } else {
                    dataVal = 'Agotados los 2 intentos';
                }

                const submissionData = {
                    type: 'text',
                    data: `FALLIDA: Agotó los 2 intentos sin acertar (opción múltiple). Último valor ingresado: "${dataVal}"`,
                    failed: true
                };

                window._missionAttempts = 2;
                submitMission(missionId, submissionData, currentUser, false, true);

                document.getElementById('alert-title').innerText = 'Intentos Agotados';
                document.getElementById('alert-message').innerText = 'Has agotado tus 2 intentos en esta prueba de opciones (limitada para evitar adivinar por descarte). La misión ha sido enviada automáticamente al Juez Supremo.';
                document.getElementById('alert-modal').classList.remove('hidden');
            }
        } else {
            // Lógica por defecto de 3 intentos
            if (currentFailedAttempt === 1) {
                // Primer fallo: mostrar alerta de error normal
                document.getElementById('alert-title').innerText = title;
                document.getElementById('alert-message').innerText = message;
                document.getElementById('alert-modal').classList.remove('hidden');
            } else if (currentFailedAttempt === 2) {
                // Segundo fallo: mostrar error + pista
                const missionId = window.activeMissionId;
                const clue = getMissionClue(missionId);
                document.getElementById('alert-title').innerText = title + ' (¡Pista disponible!)';
                document.getElementById('alert-message').innerText = message + '\n\n💡 PISTA:\n' + clue;
                document.getElementById('alert-modal').classList.remove('hidden');
            } else if (currentFailedAttempt >= 3) {
                // Tercer fallo: Auto-enviar al juez como fallida
                const missionId = window.activeMissionId;
                
                const inputs = document.querySelectorAll('#mission-form-wrapper input, #mission-form-wrapper textarea, #mission-form-wrapper select');
                let dataVal = '';
                if (inputs.length > 0) {
                    const vals = Array.from(inputs).map(input => {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            return input.checked ? (input.nextSibling?.textContent?.trim() || input.value || 'seleccionado') : '';
                        }
                        return input.value;
                    }).filter(Boolean);
                    dataVal = vals.join(', ') || 'Sin valor ingresado';
                } else {
                    dataVal = 'Agotados los 3 intentos';
                }

                const submissionData = {
                    type: 'text',
                    data: `FALLIDA: Agotó los 3 intentos sin acertar. Último valor ingresado: "${dataVal}"`,
                    failed: true
                };

                window._missionAttempts = 3;
                submitMission(missionId, submissionData, currentUser, false, true);

                document.getElementById('alert-title').innerText = 'Intentos Agotados';
                document.getElementById('alert-message').innerText = 'Has agotado tus 3 intentos en esta prueba. La misión ha sido enviada automáticamente al Juez Supremo para su evaluación con el resultado final.';
                document.getElementById('alert-modal').classList.remove('hidden');
            }
        }
    } else {
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-message').innerText = message;
        document.getElementById('alert-modal').classList.remove('hidden');
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
    const config = missionId ? MISSIONS_CONFIG[missionId] : null;
    
    const counters = gameState[kidId].counters || { physicalStreak: 0, earlyLateSubmissions: 0, perfectJointMissions: 0, cryptoSolvedFirstTry: true };
    gameState[kidId].counters = counters; // asegura que existe
    const badges = gameState[kidId].badges || [];
    gameState[kidId].badges = badges;
    
    let newBadges = [];
    
    // Auxiliares calculados dinámicamente:
    // 1. Misiones aprobadas
    const approvedMissions = [];
    Object.keys(gameState[kidId].missions).forEach(mId => {
        if (gameState[kidId].missions[mId] && gameState[kidId].missions[mId].status === 'approved') {
            const conf = MISSIONS_CONFIG[mId];
            if (conf) {
                approvedMissions.push({ id: mId, config: conf, state: gameState[kidId].missions[mId] });
            }
        }
    });
    
    const countApproved = approvedMissions.length;
    
    // 2. Fotos/audios en el álbum
    let totalPhotos = 0;
    const albumCategoriesWithAtLeast3 = [];
    if (gameState[kidId].album) {
        Object.keys(gameState[kidId].album).forEach(catId => {
            const arr = gameState[kidId].album[catId];
            if (Array.isArray(arr)) {
                totalPhotos += arr.length;
                if (arr.length >= 3) {
                    albumCategoriesWithAtLeast3.push(catId);
                }
            }
        });
    }

    // Un helper para añadir insignias si no las tiene ya
    const unlockBadge = (id) => {
        if (!badges.includes(id) && BADGES_CONFIG[id]) {
            badges.push(id);
            newBadges.push({ id: id, title: BADGES_CONFIG[id].title, icon: BADGES_CONFIG[id].icon });
        }
    };

    // --- CRITERIOS DE LOGROS ---

    // 1. medalla_olimpica: 5 físicas aprobadas seguidas sin fallar (usamos streak existente)
    if (config && config.tag === 'physical') {
        counters.physicalStreak = (counters.physicalStreak || 0) + 1;
        if (counters.physicalStreak >= 5) {
            unlockBadge('medalla_olimpica');
        }
    }

    // 2. bateria_inagotable: 3 enviadas en horario extremo (usamos earlyLateSubmissions existente)
    if (config) {
        const hour = new Date().getHours();
        if (hour < 8 || hour >= 22) {
            counters.earlyLateSubmissions = (counters.earlyLateSubmissions || 0) + 1;
            if (counters.earlyLateSubmissions >= 3) {
                unlockBadge('bateria_inagotable');
            }
        }
    }

    // 3. sincronizacion_perfecta: 5 misiones conjuntas aprobadas
    if (config && config.role === 'both') {
        counters.perfectJointMissions = (counters.perfectJointMissions || 0) + 1;
        if (counters.perfectJointMissions >= 5) {
            unlockBadge('sincronizacion_perfecta');
        }
    }

    // 4. estomago_acero: 3 misiones de comida
    if (config) {
        const titleLower = config.title.toLowerCase();
        if (titleLower.includes('takoyaki') || titleLower.includes('vending') || titleLower.includes('bento') || titleLower.includes('mochi')) {
            counters.foodMissions = (counters.foodMissions || 0) + 1;
            if (counters.foodMissions >= 3) {
                unlockBadge('estomago_acero');
            }
        }
    }

    // 5. criptografo_elite: 3 misiones tipo expert/terminal al primer intento
    if (config) {
        const titleLower = config.title.toLowerCase();
        if (config.tag === 'expert' || titleLower.includes('código') || titleLower.includes('terminal')) {
            counters.expertMissions = (counters.expertMissions || 0) + 1;
            if (counters.expertMissions >= 3 && counters.cryptoSolvedFirstTry !== false) {
                unlockBadge('criptografo_elite');
            }
        }
    }

    // 6. primer_paso: Completa tu primera misión
    if (countApproved >= 1) {
        unlockBadge('primer_paso');
    }

    // 7. explorador_novato: Completa 10 misiones
    if (countApproved >= 10) {
        unlockBadge('explorador_novato');
    }

    // 8. veterano_tokio: Completa 25 misiones
    if (countApproved >= 25) {
        unlockBadge('veterano_tokio');
    }

    // 9. leyenda_viaje: Completa 50 misiones
    if (countApproved >= 50) {
        unlockBadge('leyenda_viaje');
    }

    // 10. cazador_recuerdos: 5 elementos en el album
    if (totalPhotos >= 5) {
        unlockBadge('cazador_recuerdos');
    }

    // 11. coleccionista_supremo: 3 categorías con >= 3 fotos cada una
    if (albumCategoriesWithAtLeast3.length >= 3) {
        unlockBadge('coleccionista_supremo');
    }

    // 12. amigo_animales: 3 misiones de animales
    const animalMissionsCount = approvedMissions.filter(m => {
        const title = m.config.title.toLowerCase();
        const loc = (m.config.location || '').toLowerCase();
        return title.includes('ciervo') || title.includes('zorro') || title.includes('gato') || 
               title.includes('mono') || title.includes('animal') || title.includes('kitsune') || 
               loc.includes('nara') || loc.includes('nikko') || title.includes('fauna');
    }).length;
    if (animalMissionsCount >= 3) {
        unlockBadge('amigo_animales');
    }

    // 13. maestro_palillos: 3 misiones gastronómicas
    const foodMissionsCount = approvedMissions.filter(m => {
        const title = m.config.title.toLowerCase();
        return title.includes('comida') || title.includes('plato') || title.includes('cena') || 
               title.includes('restaurante') || title.includes('probar') || title.includes('snack') || 
               title.includes('bento') || title.includes('mochi') || title.includes('sushi') || 
               title.includes('ramen') || title.includes('dulce') || title.includes('comer') || 
               title.includes('takoyaki') || title.includes('bebida') || title.includes('gastronom');
    }).length;
    if (foodMissionsCount >= 3) {
        unlockBadge('maestro_palillos');
    }

    // 14. hacker_neon: 5 misiones en Akihabara, Odaiba, Shinjuku, Shibuya
    const neonMissionsCount = approvedMissions.filter(m => {
        const loc = (m.config.location || '').toLowerCase();
        const title = m.config.title.toLowerCase();
        return loc.includes('akihabara') || loc.includes('odaiba') || loc.includes('shinjuku') || 
               loc.includes('shibuya') || title.includes('neón') || title.includes('neon') || 
               title.includes('hacker') || title.includes('arcade') || title.includes('retro');
    }).length;
    if (neonMissionsCount >= 5) {
        unlockBadge('hacker_neon');
    }

    // 15. espiritu_shinto: 3 misiones en templos o santuarios
    const shintoMissionsCount = approvedMissions.filter(m => {
        const title = m.config.title.toLowerCase();
        const loc = (m.config.location || '').toLowerCase();
        return title.includes('templo') || title.includes('santuario') || title.includes('torii') || 
               title.includes('monje') || title.includes('jizo') || title.includes('amuleto') || 
               title.includes('deseo') || title.includes('ema') || title.includes('omikuji') || 
               title.includes('omamori') || loc.includes('templo') || loc.includes('santuario') || 
               loc.includes('senso') || loc.includes('fushimi') || loc.includes('meiji') || 
               loc.includes('kamakura');
    }).length;
    if (shintoMissionsCount >= 3) {
        unlockBadge('espiritu_shinto');
    }

    // 16. usuario_frecuente_jr: 3 misiones en trenes o estaciones
    const jrMissionsCount = approvedMissions.filter(m => {
        const title = m.config.title.toLowerCase();
        const loc = (m.config.location || '').toLowerCase();
        return title.includes('tren') || title.includes('estación') || title.includes('estacion') || 
               title.includes('metro') || title.includes('shinkansen') || title.includes('monorriel') || 
               title.includes('andén') || title.includes('anden') || title.includes('viaje') ||
               loc.includes('estación') || loc.includes('estacion') || loc.includes('tren') || 
               loc.includes('metro') || loc.includes('shinkansen');
    }).length;
    if (jrMissionsCount >= 3) {
        unlockBadge('usuario_frecuente_jr');
    }

    // 17. bilingue_expres: 3 misiones de escritura o audio
    const bilingueMissionsCount = approvedMissions.filter(m => {
        return m.config.tag === 'writing' || m.config.tag === 'audio';
    }).length;
    if (bilingueMissionsCount >= 3) {
        unlockBadge('bilingue_expres');
    }

    // 18. ahorrador_inteligente: 1000 yenes en el monedero
    if ((gameState[kidId].wallet || 0) >= 1000) {
        unlockBadge('ahorrador_inteligente');
    }

    // 19. comprador_compulsivo: al menos un upgrade comprado
    if (counters.upgradesBought >= 1) {
        unlockBadge('comprador_compulsivo');
    }

    // 20. rango_madrugador: Envía misión antes de las 7:00 AM hora local
    if (config) {
        const hour = new Date().getHours();
        if (hour < 7) {
            unlockBadge('rango_madrugador');
        }
    }

    // 21. lechuza_nocturna: Envía misión después de las 23:00 PM hora local
    if (config) {
        const hour = new Date().getHours();
        if (hour >= 23) {
            unlockBadge('lechuza_nocturna');
        }
    }

    // 22. super_cooperativo: 10 misiones conjuntas completadas
    const jointApprovedCount = approvedMissions.filter(m => m.config.role === 'both').length;
    if (jointApprovedCount >= 10) {
        unlockBadge('super_cooperativo');
    }

    // 23. nivel_ascendente: Alcanza el Nivel 3
    if ((gameState[kidId].level || 0) >= 3) {
        unlockBadge('nivel_ascendente');
    }

    // 24. casi_maestro: Alcanza el Nivel 6
    if ((gameState[kidId].level || 0) >= 6) {
        unlockBadge('casi_maestro');
    }

    // 25. avatar_supremo: Alcanza el Nivel 10
    if ((gameState[kidId].level || 0) >= 9) {
        unlockBadge('avatar_supremo');
    }

    // --- RACHAS DIARIAS ---
    const dailyActivity = counters.dailyActivity || {};
    
    // 26. racha_misiones_dia: Completa todas las misiones de un día en su fecha correspondiente
    let rachaMisionesDiaUnlocked = false;
    for (let dayNum = 1; dayNum <= 24; dayNum++) {
        const targetDate = new Date(TRIP_START_DATE.getTime());
        targetDate.setDate(TRIP_START_DATE.getDate() + (dayNum - 1));
        const targetDateStr = targetDate.toDateString();
        
        const dayMissions = Object.keys(MISSIONS_CONFIG).filter(k => 
            MISSIONS_CONFIG[k].day === dayNum && 
            (MISSIONS_CONFIG[k].role === kidId || MISSIONS_CONFIG[k].role === 'both')
        );
        
        if (dayMissions.length > 0) {
            let allApprovedOnDay = true;
            for (let mId of dayMissions) {
                const state = gameState[kidId].missions[mId];
                if (!state || state.status !== 'approved' || state.approvedDateStr !== targetDateStr) {
                    allApprovedOnDay = false;
                    break;
                }
            }
            if (allApprovedOnDay) {
                rachaMisionesDiaUnlocked = true;
                break;
            }
        }
    }
    if (rachaMisionesDiaUnlocked) {
        unlockBadge('racha_misiones_dia');
    }

    // 27. racha_minijuegos_dia: Juega 10 minijuegos en un solo día
    let maxMinigamesInSingleDay = 0;
    Object.keys(dailyActivity).forEach(dateStr => {
        maxMinigamesInSingleDay = Math.max(maxMinigamesInSingleDay, dailyActivity[dateStr].minigamesPlayed || 0);
    });
    if (maxMinigamesInSingleDay >= 10) {
        unlockBadge('racha_minijuegos_dia');
    }

    // 28. racha_fotos_dia: Sube 3 fotos o sonidos en un solo día
    let maxPhotosInSingleDay = 0;
    Object.keys(dailyActivity).forEach(dateStr => {
        maxPhotosInSingleDay = Math.max(maxPhotosInSingleDay, dailyActivity[dateStr].photosAdded || 0);
    });
    if (maxPhotosInSingleDay >= 3) {
        unlockBadge('racha_fotos_dia');
    }

    // 29. racha_ejercicio_dia: Al menos 2 misiones físicas aprobadas en un mismo día
    let maxPhysicalInSingleDay = 0;
    Object.keys(dailyActivity).forEach(dateStr => {
        maxPhysicalInSingleDay = Math.max(maxPhysicalInSingleDay, dailyActivity[dateStr].physicalCompleted || 0);
    });
    if (maxPhysicalInSingleDay >= 2) {
        unlockBadge('racha_ejercicio_dia');
    }

    // 30. racha_idioma_dia: Al menos 2 misiones de idioma aprobadas en un mismo día
    let maxLanguageInSingleDay = 0;
    Object.keys(dailyActivity).forEach(dateStr => {
        maxLanguageInSingleDay = Math.max(maxLanguageInSingleDay, dailyActivity[dateStr].languageCompleted || 0);
    });
    if (maxLanguageInSingleDay >= 2) {
        unlockBadge('racha_idioma_dia');
    }

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

    // Mostrar candado en cabecera en todos los perfiles, ocultarlo solo en modo Juez
    const btnLock = document.getElementById('btn-header-lock');
    if (btnLock) {
        if (viewId === 'view-judge') {
            btnLock.classList.add('hidden');
        } else {
            btnLock.classList.remove('hidden');
        }
    }

    // Lógica Bottom Nav y Botón Volver Dinámicos para Perfiles Fijos
    const deviceRole = localStorage.getItem('japanMissionsDeviceRole') || 'all';
    const isLockedKid = (deviceRole === 'kid9' || deviceRole === 'kid14');
    
    // Ocultar botón Volver si estamos en el selector de días de un niño con perfil fijo
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        if (viewId === 'view-days' && currentDay === null && isLockedKid) {
            btnBack.classList.add('hidden');
        } else {
            btnBack.classList.remove('hidden');
        }
    }

    const bottomNav = document.getElementById('bottom-nav');
    if (viewId === 'view-days' || viewId === 'view-passport' || viewId === 'view-album' || viewId === 'view-album-category') {
        bottomNav.classList.remove('hidden');
        
        // Ocultar pestaña Inicio si el perfil está fijo
        const navHome = document.getElementById('nav-btn-home');
        if (navHome) {
            if (isLockedKid) {
                navHome.classList.add('hidden');
            } else {
                navHome.classList.remove('hidden');
            }
        }

        // Actualizar tabs activas
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        if (viewId === 'view-days') document.getElementById('nav-btn-missions').classList.add('active');
        if (viewId === 'view-passport') document.getElementById('nav-btn-passport').classList.add('active');
    } else {
        bottomNav.classList.add('hidden');
    }
}

function renderDaysList(role) {
    window.currentSubView = 'days';
    window.activeMissionId = null;
    currentUser = role;
    currentDay = null;
    currentDayMissions = [];
    const list = document.getElementById('days-list');
    list.innerHTML = '';
    
    // Aplicar Tema Dinámico
    document.body.className = role === 'kid9' ? 'theme-laura' : 'theme-ivan';

    // Configurar visibilidad de la tienda hacker y actualizar cartera
    const shopBtn = document.getElementById('btn-open-shop');
    if (shopBtn) {
        if (role === 'kid9' || role === 'kid14') {
            shopBtn.classList.remove('hidden');
        } else {
            shopBtn.classList.add('hidden');
        }
    }
    const walletText = document.getElementById('user-wallet-amount');
    if (walletText) {
        walletText.innerText = gameState[role].wallet || 0;
    }
    
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

        const card = document.createElement('div');
        card.className = 'card';
        
        const titleHtml = `Día ${dayNum} ${allApproved ? '✅' : '🚀'} <span style="font-size:0.8rem; font-weight:normal; opacity:0.75; float:right;">${getDayDateString(dayNum)}</span>`;
        
        card.innerHTML = `
            <div class="card-title">${titleHtml}</div>
            <p style="font-size:0.9rem; color:var(--color-gray-dark)">${mKeys.length} misiones</p>
        `;
        card.addEventListener('click', () => {
            renderDayMissions(role, dayNum, mKeys);
        });
        list.appendChild(card);

        prevDayApproved = allApproved; // Para el día siguiente
    });

    updateSpecialEventsBanner(role);
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
    window.currentSubView = 'day-detail';
    window.activeMissionId = null;
    currentDay = dayNum;
    currentDayMissions = missionKeys;
    const list = document.getElementById('days-list');
    list.innerHTML = ''; // Reutilizamos el contenedor para mostrar las misiones del día

    missionKeys.forEach(k => {
        const conf = MISSIONS_CONFIG[k];
        const state = gameState[role].missions[k];
        const card = document.createElement('div');
        card.className = 'card';
        
        if (conf.tag === 'special') {
            card.style.border = '2px solid #ff9800';
            card.style.background = 'linear-gradient(135deg, var(--color-card-bg) 70%, rgba(255, 152, 0, 0.08) 100%)';
            card.style.boxShadow = '0 4px 15px rgba(255, 152, 0, 0.12)';
        }
        
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

        let timeHtml = '';
        if (conf.tag === 'special' && conf.startTime && conf.endTime) {
            timeHtml = `<div style="font-size:0.8rem; color:#e65100; font-weight:bold; margin-top:4px; margin-bottom:5px; display:flex; align-items:center; gap:4px;">⏱️ Rango: ${conf.startTime} - ${conf.endTime}</div>`;
        }

        card.innerHTML = `
            ${tagHtml}
            <div class="card-title">${conf.title} <span style="font-size:0.8rem; color:var(--color-accent)">+${conf.xp}XP</span></div>
            <div style="font-size:0.8rem; color:var(--color-gray-dark); margin-bottom:5px;">📍 ${conf.location || 'Cualquier lugar'}</div>
            ${timeHtml}
            ${statusHtml}
            ${feedbackHtml}
        `;
        
        card.addEventListener('click', () => {
            renderMissionDetail(k, role);
        });
        
        list.appendChild(card);
    });

    switchView('view-days', true, `Día ${dayNum}`);
}

function renderMissionDetail(missionId, role, preserveTimer = false) {
    window.currentSubView = 'mission-detail';
    window.activeMissionId = missionId;

    // Limpiar recursos de la misión anterior si no se preserva el timer
    if (!preserveTimer) {
        if (window._missionCleanup) { window._missionCleanup(); window._missionCleanup = null; }
        
        // Iniciar contadores para medir intentos y tiempo empleado (con persistencia en localStorage)
        let savedStart = localStorage.getItem(`mission_start_${missionId}`);
        if (savedStart) {
            window._missionStartTime = parseInt(savedStart);
        } else {
            window._missionStartTime = Date.now();
            localStorage.setItem(`mission_start_${missionId}`, window._missionStartTime);
        }
        window._missionAttempts = 1;
        console.log(`Misión iniciada: ${missionId}. Temporizador e intentos reiniciados.`);
    }

    const conf = MISSIONS_CONFIG[missionId];
    const container = document.getElementById('mission-content');
    
    const state = gameState[role].missions[missionId];
    let warningHtml = '';
    const isPending = state && state.status === 'pending';
    const isApproved = state && state.status === 'approved';
    const isLocked = isDayLocked(conf.day);
    
    let isTimeLocked = false;
    let timeLockMessage = '';
    
    if (conf.tag === 'special' && conf.startTime && conf.endTime) {
        const now = new Date();
        const currentHourMin = now.getHours() * 100 + now.getMinutes();
        
        const startParts = conf.startTime.split(':');
        const endParts = conf.endTime.split(':');
        const startVal = parseInt(startParts[0], 10) * 100 + parseInt(startParts[1], 10);
        const endVal = parseInt(endParts[0], 10) * 100 + parseInt(endParts[1], 10);
        
        if (currentHourMin < startVal || currentHourMin > endVal) {
            isTimeLocked = true;
            timeLockMessage = `Este evento especial solo se puede realizar en el rango de horas de <b>${conf.startTime}</b> a <b>${conf.endTime}</b> (hora local). Actualmente son las <b>${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}</b> y la entrega de pruebas está bloqueada fuera de este horario.`;
        }
    }
    
    if (isLocked) {
        warningHtml = `
            <div class="mission-warning-card" style="background: rgba(156, 39, 176, 0.1); border: 2px solid #9c27b0; border-radius: var(--radius-main); padding: 15px; margin-bottom: 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; flex-direction: column;">
                <span style="font-size: 2rem;">🔒</span>
                <div>
                    <strong style="color: #9c27b0; font-size: 1.05rem;">Prueba Bloqueada Temporalmente</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9; line-height: 1.4; color: var(--color-text);">Esta misión corresponde al día de viaje programado (${getDayDateString(conf.day)}). No se puede realizar ni enviar la prueba antes de esa fecha, pero puedes jugar al minijuego para practicar.</p>
                </div>
            </div>
        `;
    } else if (isTimeLocked) {
        warningHtml = `
            <div class="mission-warning-card" style="background: rgba(244, 67, 54, 0.1); border: 2px solid #f44336; border-radius: var(--radius-main); padding: 15px; margin-bottom: 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; flex-direction: column;">
                <span style="font-size: 2rem;">⏰</span>
                <div>
                    <strong style="color: #f44336; font-size: 1.05rem;">Fuera de Horario Permitido</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9; line-height: 1.4; color: var(--color-text);">${timeLockMessage}</p>
                </div>
            </div>
        `;
    } else if (isPending) {
        warningHtml = `
            <div class="mission-warning-card" style="background: rgba(33, 150, 243, 0.1); border: 2px solid #2196f3; border-radius: var(--radius-main); padding: 15px; margin-bottom: 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; flex-direction: column;">
                <span style="font-size: 2rem;">⏳</span>
                <div>
                    <strong style="color: #2196f3; font-size: 1.05rem;">Prueba en Revisión</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">El Juez Supremo está evaluando tu entrega. No puedes realizar la prueba de nuevo en este momento, pero puedes jugar al minijuego para practicar.</p>
                </div>
            </div>
        `;
    } else if (state && state.status === 'approved') {
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
                    <strong style="color: #b91c1c; font-size: 1.05rem;">Prueba Con Feedback</strong>
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
        let descText = 'Esta misión dispone de un minijuego independiente al que puedes jugar para divertirte y ganar yenes para tu cartera:';
        if (isLocked) {
            descText = 'Esta misión está bloqueada temporalmente para su entrega. Sin embargo, puedes jugar al minijuego aquí:';
        }
        minigameButtonHtml = `
            <div class="minigame-promo-card" style="margin: 15px 0; padding: 15px; background: linear-gradient(135deg, rgba(255, 123, 84, 0.15) 0%, rgba(255, 154, 158, 0.05) 100%); border: 2px solid var(--color-primary); border-radius: var(--radius-main); text-align: center; box-shadow: var(--shadow-soft);">
                <span style="font-size: 1.6rem; display: block; margin-bottom: 5px;">🎮 Minijuego Independiente</span>
                <p style="margin: 0 0 12px 0; font-size: 0.85rem; opacity: 0.9; line-height: 1.4; color: var(--color-text);">${descText}</p>
                <button id="btn-replay-minigame-direct" class="btn-secondary" style="width:100%; background: #ff7b54; border-color: #ff7b54; color: white; font-weight: bold; border-radius: 20px; box-shadow: 0 4px 10px rgba(255,123,84,0.25); cursor:pointer;">🎮 Jugar Minijuego (Entrenamiento)</button>
            </div>
        `;
    }

    let locationTimeSub = `📍 ${conf.location || 'Cualquier lugar'}`;
    if (conf.tag === 'special' && conf.startTime && conf.endTime) {
        locationTimeSub += ` | ⏱️ Horario: ${conf.startTime} - ${conf.endTime}`;
    }

    const isCompleted = isPending || isApproved;
    container.innerHTML = `
        <h2 class="mission-title">${conf.title}</h2>
        <div style="text-align:center; color:var(--color-accent); margin-bottom:15px; font-weight:bold;">${locationTimeSub}</div>
        ${warningHtml}
        <div id="mission-submitted-photo-container"></div>
        ${minigameButtonHtml}
        <div id="mission-form-wrapper" style="${isCompleted || isLocked || isTimeLocked ? 'display: none;' : ''}">
            ${conf.render(role)}
        </div>
    `;
    switchView('view-mission', true, "Misión");
    conf.attachEvents(role);

    // Si la misión tiene una foto en su entrega, recuperarla y mostrarla en la previsualización
    if (state && state.submission) {
        const submission = state.submission;
        const photoContainer = document.getElementById('mission-submitted-photo-container');
        
        (async () => {
            try {
                let photoHtml = '';
                if (submission.type === 'photo') {
                    const photoData = await getPhotoFromDB(submission.data);
                    if (photoData) {
                        photoHtml = `
                            <div style="margin: 15px 0; text-align: center; border: 1px solid var(--color-gray-dark); padding: 8px; background: var(--color-card-bg); border-radius: var(--radius-main); box-shadow: var(--shadow-soft);">
                                <strong style="display:block; margin-bottom:8px; font-size:0.9rem; color:var(--color-primary);">📸 Tu foto entregada:</strong>
                                <img src="${photoData}" alt="Evidencia entregada" style="width:100%; max-height:250px; object-fit:contain; border-radius:8px; background:#eaeaea;">
                            </div>
                        `;
                    }
                } else if (submission.type === 'photo_choice' && submission.data && submission.data.photoId) {
                    const photoData = await getPhotoFromDB(submission.data.photoId);
                    if (photoData) {
                        photoHtml = `
                            <div style="margin: 15px 0; text-align: center; border: 1px solid var(--color-gray-dark); padding: 8px; background: var(--color-card-bg); border-radius: var(--radius-main); box-shadow: var(--shadow-soft);">
                                <strong style="display:block; margin-bottom:8px; font-size:0.9rem; color:var(--color-primary);">📸 Tu foto entregada:</strong>
                                <img src="${photoData}" alt="Evidencia entregada" style="width:100%; max-height:250px; object-fit:contain; border-radius:8px; background:#eaeaea;">
                                <div style="margin-top:6px; font-size:0.85rem; font-weight:bold;">Elección: ${submission.data.choice}</div>
                            </div>
                        `;
                    }
                } else if (submission.type === 'photos' && Array.isArray(submission.data)) {
                    let imgHtml = '';
                    for (let i = 0; i < submission.data.length; i++) {
                        const photoId = submission.data[i];
                        if (photoId) {
                            const photoData = await getPhotoFromDB(photoId);
                            if (photoData) {
                                imgHtml += `<img src="${photoData}" alt="Evidencia ${i+1}" style="flex:1; min-width:80px; max-width:120px; height:80px; object-fit:cover; border-radius:6px; margin:4px; background:#eaeaea;">`;
                            }
                        }
                    }
                    if (imgHtml) {
                        photoHtml = `
                            <div style="margin: 15px 0; text-align: center; border: 1px solid var(--color-gray-dark); padding: 8px; background: var(--color-card-bg); border-radius: var(--radius-main); box-shadow: var(--shadow-soft);">
                                <strong style="display:block; margin-bottom:8px; font-size:0.9rem; color:var(--color-primary);">📸 Fotos entregadas:</strong>
                                <div style="display:flex; flex-wrap:wrap; justify-content:center;">${imgHtml}</div>
                            </div>
                        `;
                    }
                } else if (submission.type === 'mixed' && typeof submission.data === 'string') {
                    let parts = submission.data.split('. Foto ID: ');
                    if (parts.length === 1) parts = submission.data.split('. Foto: ');
                    if (parts.length > 1) {
                        const photoData = await getPhotoFromDB(parts[parts.length - 1]);
                        const textData = parts.slice(0, -1).join('. ');
                        if (photoData) {
                            photoHtml = `
                                <div style="margin: 15px 0; text-align: center; border: 1px solid var(--color-gray-dark); padding: 8px; background: var(--color-card-bg); border-radius: var(--radius-main); box-shadow: var(--shadow-soft);">
                                    <strong style="display:block; margin-bottom:8px; font-size:0.9rem; color:var(--color-primary);">📸 Foto entregada:</strong>
                                    <img src="${photoData}" alt="Evidencia entregada" style="width:100%; max-height:250px; object-fit:contain; border-radius:8px; background:#eaeaea; margin-bottom:6px;">
                                    <div style="font-size:0.85rem; font-weight:bold;">${textData}</div>
                                </div>
                            `;
                        }
                    }
                }
                
                if (photoContainer && photoHtml) {
                    photoContainer.innerHTML = photoHtml;
                }
            } catch (err) {
                console.error("Error al cargar la foto de la entrega:", err);
            }
        })();
    }
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
    const conf = MISSIONS_CONFIG[missionId];
    if (conf && conf.role === 'both') {
        isFamily = true;
    }
    if (conf && isDayLocked(conf.day)) {
        showAlert('Prueba Bloqueada', `No puedes enviar la prueba de esta misión hasta el día del viaje correspondiente (${getDayDateString(conf.day)}).`);
        return;
    }

    // Validación de respuesta vacía
    if (submissionData) {
        const type = submissionData.type;
        const data = submissionData.data;
        const isFailedAutoSubmit = submissionData.failed === true;

        if (!isFailedAutoSubmit) {
            if (type === 'number' || type === 'text') {
                if (data === undefined || data === null || String(data).trim() === '') {
                    showAlert('RESPUESTA VACÍA', 'Por favor, escribe tu respuesta en el campo antes de enviarla al Juez.');
                    return;
                }
            } else if (type === 'photo') {
                if (!data || String(data).trim() === '' || String(data).toLowerCase().includes('pendiente') || String(data).toLowerCase().includes('vacía')) {
                    showAlert('FOTO VACÍA', 'Por favor, realiza la captura de foto requerida antes de enviarla al Juez.');
                    return;
                }
            } else if (type === 'video') {
                if (!data || String(data).trim() === '' || String(data).toLowerCase().includes('pendiente') || String(data).toLowerCase().includes('vacía') || String(data).toLowerCase().includes('localmente')) {
                    showAlert('VÍDEO VACÍO', 'Por favor, realiza la grabación de vídeo requerida antes de enviarla al Juez.');
                    return;
                }
            } else if (type === 'audio') {
                if (!data || String(data).trim() === '' || String(data).toLowerCase().includes('pendiente') || String(data).toLowerCase().includes('vacía')) {
                    showAlert('AUDIO VACÍO', 'Por favor, realiza la grabación de audio requerida antes de enviarla al Juez.');
                    return;
                }
            } else if (type === 'mixed') {
                if (!data || String(data).trim() === '' || String(data).toLowerCase().includes('pendiente') || String(data).toLowerCase().includes('vacía')) {
                    showAlert('ENTREGA VACÍA', 'Por favor, completa los campos requeridos antes de enviarla al Juez.');
                    return;
                }
            }
        }
    }

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

    // Desactivado: el minijuego es independiente y ya no intercepta el envío al juez.
    // Todas las pruebas se envían directamente al juez al finalizar.

    const timeTaken = window._missionStartTime ? Math.round((Date.now() - window._missionStartTime) / 1000) : null;
    const attempts = window._missionAttempts || 1;
    
    // Limpiar de localStorage
    localStorage.removeItem(`mission_start_${missionId}`);

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
                gameState[kid].missions[missionId].statusUpdatedAt = Date.now();
            }
        });
        
        // Guardar timestamps locales
        gameState['kid9'].lastUpdated = Date.now();
        gameState['kid14'].lastUpdated = Date.now();
        localStorage.setItem('japanMissionsState', JSON.stringify(gameState));

        // Limpiar contadores globales
        window._missionStartTime = null;
        window._missionAttempts = 1;

        // Sincronizar remotamente ambos perfiles con el campo específico
        if (window.FirebaseSync && window.FirebaseSync.isConnected()) {
            const changes9 = {};
            changes9[`missions.${missionId}`] = gameState['kid9'].missions[missionId];
            window.FirebaseSync.syncProfileFields('kid9', changes9);

            const changes14 = {};
            changes14[`missions.${missionId}`] = gameState['kid14'].missions[missionId];
            window.FirebaseSync.syncProfileFields('kid14', changes14);
        }
    } else {
        gameState[role].missions[missionId].status = 'pending';
        gameState[role].missions[missionId].submission = enrichedSubmission;
        gameState[role].missions[missionId].feedback = null; // Limpiar feedback anterior
        gameState[role].missions[missionId].statusUpdatedAt = Date.now();

        // Limpiar contadores globales
        window._missionStartTime = null;
        window._missionAttempts = 1;

        const changes = {};
        changes[`missions.${missionId}`] = gameState[role].missions[missionId];
        saveState(changes);
    }
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
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = async () => {
                    try {
                        const videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                        await savePhotoToDB(videoId, reader.result);
                        submitMission(missionId, {type: 'video', data: videoId}, role, isFamily);
                    } catch (err) {
                        console.error(err);
                        showAlert('Error', 'No se pudo guardar el vídeo en IndexedDB. Reinténtalo.');
                        btn.innerText = originalText;
                        btn.disabled = false;
                    }
                };
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

function getMissionDescription(config, role) {
    if (!config || typeof config.render !== 'function') return '';
    try {
        const html = config.render(role);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Eliminar elementos interactivos y controles para dejar solo las indicaciones
        const elementsToRemove = tempDiv.querySelectorAll('button, input, select, textarea, canvas, script, style, .hidden-camera-input');
        elementsToRemove.forEach(el => el.remove());
        
        return tempDiv.textContent.replace(/\s+/g, ' ').trim();
    } catch (e) {
        console.error("Error extracting description:", e);
        return '';
    }
}

function getMissionExpectedAnswer(missionId) {
    const answers = {
        "day_1_clouds": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_1_customs": "Límite legal: 1.000.000 ¥ (Un millón de yenes) para entrar sin declarar.",
        "day_1_bingo": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_1_balance": "Evidencia del cumplimiento de la actividad.",
        "day_1_engine": "Una grabación de audio limpia donde se perciba el sonido solicitado.",
        "day_1_navigator": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_1_timezone": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_1_exchange": "Cotización real del yen por 1 Euro (rango realista actual: entre 150 y 170 yenes).",
        "day_1_bets": "Tres predicciones divertidas, originales o curiosas redactadas por el grupo.",
        "day_2_vending": "Refresco con sabor original japonés (ej. melón, uva, té verde o poción de vending).",
        "day_2_maze": "Evidencia del cumplimiento de la actividad.",
        "day_2_kanji": "Trazado correcto en el lienzo de los kanjis de Persona (人) y Montaña (山).",
        "day_2_audit": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_2_yokai": "Una de las siguientes opciones válidas: Tsukumogami (Espíritu de objeto inanimado), Kitsune/Tanuki (Espíritu animal con poderes), Oni/Tengu (Gigante, demonio o espíritu de la montaña), Yūrei (Fantasma o aparición humana).",
        "day_2_posture": "Evidencia del cumplimiento de la actividad.",
        "day_2_melody": "Una de las siguientes opciones válidas: -- Elige el instrumento --, Campanillas / Xilófono cristalino, Sintetizador electrónico futurista, Piano / Clavicordio clásico, -- Elige la velocidad --, Rápido y alegre (¡Apúrate que se va!), Lento y relajante.",
        "day_2_shogun": "Captura del mapa interactivo con la ruta del foso del Castillo de Osaka completada.",
        "day_2_ekistamp": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_3_glico": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_3_ninja": "Cruzar el pasillo 'ruiseñor' del Castillo Nijo en absoluto silencio sin registrar ruidos en el sensor.",
        "day_3_bridge": "Recuento de pasos correcto del niño al cruzar el puente de madera tradicional.",
        "day_3_umeda": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_3_architect": "Altura oficial del Umeda Sky Building: exactamente 173 metros.",
        "day_3_neon": "Fotografía del famoso cartel de luces de neón de Glico Man en Dotonbori.",
        "day_3_rush": "Pasos de carrera registrados al cruzar rápidamente los fosos del Castillo de Osaka.",
        "day_3_flow": "Frecuencia de parpadeo del neón medida con el sensor de luz en Hz.",
        "day_3_reflect": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_4_bestiary": "Lista de todos los yokais localizados y capturados en el mapa digital del barrio.",
        "day_4_gachapon": "Una de las siguientes opciones válidas: -- Elige la categoría --, Personaje de Anime / Manga / Videojuegos, Animal kawaii (gato, perro, criatura...), Objeto miniatura / Comida realista / Llavero raro, Otro tipo de juguete.",
        "day_4_vending_roulette": "Captura de pantalla de la bebida sorpresa obtenida tras girar la ruleta de vending virtual.",
        "day_4_crab": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_4_knife": "Tipo de cuchillo tradicional elegido y su precio estimado coherente en yenes.",
        "day_4_500yen": "Lista de compra de snacks en el Konbini por un importe total menor a 500 yenes.",
        "day_4_isshinji": "Redacción de la historia o curiosidad sobre las estatuas construidas con cenizas en Isshin-ji.",
        "day_4_tracker": "Análisis comparativo escrito sobre la diferencia de precios de los productos en Kuromon.",
        "day_4_yakiniku": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_5_gymnast": "Fotografía haciendo la pose de gimnasia e indicando la respuesta de la trivia: Shika-senbei (galletas de ciervo).",
        "day_5_investor": "Justificación del souvenir más rentable de Nara, calculando un ROI realista y coherente.",
        "day_5_mochi": "Fotografía o vídeo del mochi rápido tradicional machacado a golpes en Nakatanidou.",
        "day_5_monk": "El pedestal de bronce del Gran Buda de Todai-ji tiene exactamente 56 pétalos.",
        "day_5_deer_galaxy": "Evidencia de haber finalizado con éxito el minijuego digital de alimentar a los ciervos.",
        "day_5_ribbon": "Puntuación en el juego interactivo de danza de cinta simulada.",
        "day_5_zen": "Dibujo con el trazado correcto y legible del kanji de meditación zen.",
        "day_5_engineer": "Cálculo aproximado del volumen del Gran Buda de Todai-ji.",
        "day_5_guardian": "Foto o texto confirmando que el orificio del pilar tiene el tamaño de la fosa nasal del Gran Buda.",
        "day_6_evasion": "Cruzar el puente de madera con sigilo sin activar los sensores de movimiento del móvil.",
        "day_6_clan": "Fotografía familiar imitando la pose de los antiguos clanes feudales.",
        "day_6_seal": "Dibujo digital del sello imperial de Nara trazado en el lienzo de la pantalla.",
        "day_6_clouds": "Dibujo de la silueta de nube tradicional japonesa trazado en la pantalla.",
        "day_6_ninja_steps": "Secuencia de movimientos de sigilo ninja completada.",
        "day_6_tactical": "Reporte táctico sobre la arquitectura defensiva del Castillo Nijo.",
        "day_6_edict": "Mensaje secreto del edicto del Shogun descifrado a partir de las pistas.",
        "day_6_time_travel": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_6_ring": "El número de anillos de crecimiento del ciprés centenario del jardín es de 10.",
        "day_7_kimono": "Fotografía vistiendo kimono con el cruce correcto (siempre la solapa izquierda sobre la derecha).",
        "day_7_kintsugi": "Plato restaurado virtualmente en el minijuego mediante la técnica tradicional del Kintsugi.",
        "day_7_tea": "Mantener la inclinación sin derramar la taza de té en el sensor del dispositivo.",
        "day_7_stone_guardian": "Fotografía de los faroles de piedra tradicionales en el santuario de Gion.",
        "day_7_structural": "La histórica Pagoda de Yasaka tiene exactamente 5 pisos.",
        "day_7_survival": "Tres reglas básicas de supervivencia ante un sismo redactadas por el niño.",
        "day_7_anti_quake": "Estructura estabilizada correctamente en el simulador digital de sismos.",
        "day_7_stairs": "El número de escalones de Sannenzaka es de 17 escalones principales (se acepta cualquier número positivo que indique el conteo realizado).",
        "day_7_geisha": "Fotografía respetuosa de una Geisha o Maiko en el barrio de Gion.",
        "day_8_kid14_wave_sync": "Sincronización de ondas de frecuencia completada en la interfaz.",
        "day_8_kid9_pose": "Fotografía imitando la pose divertida de una de las estatuas de Otagi Nenbutsu-ji.",
        "day_8_kid14_bosque": "El número estimado de pasos para los 2.7 km debe estar entre 2.000 y 6.000 pasos de zancada humana.",
        "day_8_kid14_arashiyama": "Informe escrito de campo sensorial describiendo el bosque de bambú de Arashiyama.",
        "day_8_kid9_wind": "Grabación de audio de 4 segundos del susurro del viento en Arashiyama.",
        "day_8_kid9_bamboo_clock": "Número de nudos contados en el bambú y estimación coherente de su edad.",
        "day_8_kid9_giants": "Fotografía contrapicada creativa del bosque de bambú.",
        "day_8_kid9_monk": "Grabación de audio cantando el mantra y tocando el cuenco tibetano.",
        "day_8_kid9_rake": "Dibujo de ondas zen concéntricas y paralelas trazadas en el rastrillo virtual.",
        "day_8_fam_squad": "Fotografía familiar artística ocultándose entre las cañas de bambú.",
        "day_9_kid14_gravity": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_9_kid14_angulo": "Una de las siguientes opciones válidas: Efecto Moiré de interferencia, Punto de Fuga de perspectiva, Proyección Isométrica de planos.",
        "day_9_kid9_scratch": "Evidencia del cumplimiento de la actividad.",
        "day_9_kid14_torii": "Evidencia del cumplimiento de la actividad.",
        "day_9_kid9_zorros": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_9_kid14_ave": "Evidencia del cumplimiento de la actividad.",
        "day_9_kid9_altar": "Una de las siguientes opciones válidas: Estatuas de Zorros de piedra (Kitsune), Minicapillas o mini arcos Torii rojos, Monedas y tazas de Sake/Agua, Varias de las anteriores / Mezclado.",
        "day_9_kid14_tunnel": "El cálculo correcto requiere dividir la longitud total del tramo por el espaciado de cada arco torii (100 / 0.5). Reajusta tu estimación.",
        "day_9_fam_portal": "Evidencia del cumplimiento de la actividad.",
        "day_10_kid9_nishiki": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_10_fam_sayonara": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_10_kid9_bento": "Evidencia del cumplimiento de la actividad.",
        "day_10_kid9_dragon": "Una de las siguientes opciones válidas: Se sirven frescos y crudos al momento, Fermentados en sal, salvado de arroz o vinagre, Hervidos a altas temperaturas con azúcar.",
        "day_10_kid14_milla": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_10_kid14_crypto": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_10_kid9_rainbow": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_10_kid9_matcha": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_10_kid14_tako": "El valor introducido debe ser una cotización de yenes realista (100 - 2000 ¥).",
        "day_11_onsen": "Evidencia del cumplimiento de la actividad.",
        "day_11_tea": "Evidencia del cumplimiento de la actividad.",
        "day_11_yukata": "Una de las siguientes opciones válidas: Seda pesada formal, Lana gruesa de invierno, Algodón ligero y transpirable.",
        "day_11_tatami": "Una de las siguientes opciones válidas: Hojas de Bambú gigante machacado, Paja de Junco (Igusa) y paja de arroz, Corteza seca de árbol de sakura.",
        "day_11_kaiseki": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_11_spring": "Evidencia del cumplimiento de la actividad.",
        "day_11_architecture": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_11_economy": "Evidencia del cumplimiento de la actividad.",
        "day_11_geta": "Evidencia del cumplimiento de la actividad.",
        "day_12_silence": "Evidencia del cumplimiento de la actividad.",
        "day_12_sugidama": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_12_wood": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_12_hida": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_12_carving": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_12_sake": "Antigüedad de la destilería Funasaka: exactamente 323 años (Destilería fundada en 1703).",
        "day_12_patrol": "Madera seleccionada en la trivia: Cedro Japonés (Sugi) o Ciprés (Hinoki).",
        "day_12_appraisal": "Evidencia del cumplimiento de la actividad.",
        "day_12_bridge": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_13_stairs": "La Pagoda Chureito tiene exactamente 398 escalones de subida.",
        "day_13_manhole": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_13_icecream": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_13_yokai": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_13_perspective": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_13_tunnels": "Evidencia del cumplimiento de la actividad.",
        "day_13_volcano": "El año de la última erupción registrada del Monte Fuji fue 1707.",
        "day_13_triangulation": "Distancia estimada al cráter del Fuji: aproximadamente 26 km (entre 20 y 30 km).",
        "day_13_oishi": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_14_rock": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_14_kid9_echo": "Una grabación de audio limpia donde se perciba el sonido solicitado.",
        "day_14_root": "Una de las siguientes opciones válidas: Perforan verticalmente la roca de lava hasta el agua, Se extienden horizontalmente buscando musgo y suelo superficial, Absorben agua directamente del aire y no usan raíces.",
        "day_14_compass": "Evidencia del cumplimiento de la actividad.",
        "day_14_radar": "Evidencia del cumplimiento de la actividad.",
        "day_14_pressure": "Evidencia del cumplimiento de la actividad.",
        "day_14_altimeter": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_14_kid14_echo": "Las rocas de lava basáltica de Aokigahara son altamente porosas y absorben las ondas de sonido, eliminando el eco.",
        "day_14_oxygen": "Evidencia del cumplimiento de la actividad.",
        "day_15_waterfall": "Una grabación de audio limpia donde se perciba el sonido solicitado.",
        "day_15_thatch": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_15_fish": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_15_shogun": "El nombre de la deidad sintoísta del monte Fuji a la que está consagrada la base es Konohanasakuya-hime.",
        "day_15_deity": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_15_honcho": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_15_flow": "Caudal regular estimado de la cascada Shiraito (rango regular de 1.000 a 2.000 L/s).",
        "day_15_roof": "Inclinación empinada de los tejados Gassho-zukuri (60 grados para evitar el colapso por la nieve pesada del invierno).",
        "day_15_dragon": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_16_cat": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_16_skyscraper": "Evidencia del cumplimiento de la actividad.",
        "day_16_colors": "Evidencia del cumplimiento de la actividad.",
        "day_16_traffic": "Una grabación de audio limpia donde se perciba el sonido solicitado.",
        "day_16_vortex": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_16_combat": "Evidencia del cumplimiento de la actividad.",
        "day_16_shinjuku": "Evidencia del cumplimiento de la actividad.",
        "day_16_density": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_16_tocho": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_17_omikuji": "Evidencia del cumplimiento de la actividad.",
        "day_17_incense": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_17_gashapon": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_17_p2p_receiver": "Evidencia del cumplimiento de la actividad.",
        "day_17_retro": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_17_skytree": "Evidencia del cumplimiento de la actividad.",
        "day_17_p2p_sender": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_17_height": "Altura de la Tokyo Skytree: exactamente 634 metros.",
        "day_17_sumida": "Evidencia del cumplimiento de la actividad.",
        "day_18_shibuya": "Evidencia del cumplimiento de la actividad.",
        "day_18_hachiko": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_18_ema": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_18_crepe": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_18_radio": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_18_trend": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_18_flow": "Tránsito estimado en el cruce de Shibuya: aprox. 3.000 personas por ciclo verde.",
        "day_18_silence": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_18_crossing": "Evidencia del cumplimiento de la actividad.",
        "day_19_gundam": "Evidencia del cumplimiento de la actividad.",
        "day_19_color": "Evidencia del cumplimiento de la actividad.",
        "day_19_teamlab": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_19_liberty": "Una de las siguientes opciones válidas: Nueva York (copia donada por el alcalde de Nueva York), París (réplica francesa instalada por el Año de Francia en Japón), Tokio (un diseño hecho por artesanos locales en metal reciclado).",
        "day_19_crypto": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_19_mirrors": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_19_weight": "El peso aproximado del Unicorn Gundam gigante escala 1:1 es de 49 toneladas.",
        "day_19_monorail": "Evidencia del cumplimiento de la actividad.",
        "day_19_immersive": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_20_bento": "Evidencia del cumplimiento de la actividad.",
        "day_20_potion": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_20_pond": "Una de las siguientes opciones válidas: -- Elige un elemento --, 🦆 Un Pato Gracioso, 🪷 Una Flor de Loto Hermosa, -- Elige respuesta --, Ánade azulón (Magamo) - Cuello verde metálico, Pato mandarín (Oshidori) - Colores de fantasía, Pleno Verano (Julio - Agosto), Pleno Invierno (Diciembre - Enero).",
        "day_20_weight": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_20_change": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_20_museum": "Tu reseña debe ser más descriptiva (al menos 30 caracteres) para analizar el contraste del edificio Honkan.",
        "day_20_vintage": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_20_stairs": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_20_tasting": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_21_monkeys": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_21_dragon": "Evidencia del cumplimiento de la actividad.",
        "day_21_slash": "Evidencia del cumplimiento de la actividad.",
        "day_21_jizo": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_21_buddha": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_21_gold": "El peso introducido no es correcto. Multiplica la superficie (200 m²) por el grosor (0,0001 m) y por la densidad del oro (19.300 kg/m³) para obtener la masa total real.",
        "day_21_tracking": "Evidencia del cumplimiento de la actividad.",
        "day_21_defense": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_21_silence": "Una grabación de audio limpia donde se perciba el sonido solicitado.",
        "day_22_shout": "Una grabación de audio limpia donde se perciba el sonido solicitado.",
        "day_22_car": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_22_elevator": "Evidencia del cumplimiento de la actividad.",
        "day_22_tower": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_22_jewel": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_22_numbers": "Código incorrecto. Escribe 123 para calibrar el audio.",
        "day_22_fish": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_22_compare": "La altura total de la Torre de Tokio es de 333 metros.",
        "day_22_neon": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_23_kitkat": "Evidencia del cumplimiento de la actividad.",
        "day_23_pokedex": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_23_coins": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_23_mascot": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_23_tetris": "Evidencia del cumplimiento de la actividad.",
        "day_23_audit": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_23_security": "El tiempo registrado de paso de seguridad no coincide con los parámetros de la cola del aeropuerto (debe ser entre 10s y 300s).",
        "day_23_weight": "Un valor numérico coherente que responda a la estimación o conteo solicitado.",
        "day_23_stamp": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_24_meal": "Una fotografía clara, nítida y real tomada en el lugar.",
        "day_24_clouds": "Un texto redactado con coherencia y sentido (mínimo de caracteres requerido).",
        "day_24_turbulence": "Evidencia del cumplimiento de la actividad.",
        "day_24_badges": "Evidencia del cumplimiento de la actividad.",
        "day_24_timezones": "La diferencia horaria en verano entre Japón y España debe ser exactamente de 7 horas (Ej: 22:00 Japón = 15:00 España).",
        "day_24_distance": "La distancia de vuelo real de vuelta a casa desde Japón es de entre 9.000 km y 12.000 km.",
        "day_24_speed": "Velocidad media de crucero de un avión comercial: entre 700 y 1.100 km/h.",
        "day_24_log": "Una bitácora final detallada describiendo las experiencias del viaje por parte del niño.",
        "day_24_sayonara": "Tres mejores recuerdos en familia elegidos por votación y redactados."
};
    return answers[missionId] || "";
}

function getMissionEvaluationCriteria(missionId) {
    const criteria = {
        "day_1_clouds": "Comprobar que la foto enviada muestre nítidamente Formas en las Nubes en Avión y que corresponda a lo solicitado.",
        "day_1_customs": "Comprobar que el niño responda 1.000.000 ¥ como límite legal permitido para entrar sin declarar.",
        "day_1_bingo": "Comprobar que la foto enviada muestre nítidamente Bingo Aeroportuario en Aeropuerto y que corresponda a lo solicitado.",
        "day_1_balance": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Equilibrio a 10.000 Metros en Avión.",
        "day_1_engine": "Escuchar el audio para comprobar que se perciba claramente el sonido de El Escáner de Frecuencias en Avión.",
        "day_1_navigator": "Comprobar la estimación numérica ingresada para el reto de Navegante de Altura en Avión.",
        "day_1_timezone": "Comprobar la estimación numérica ingresada para el reto de Reloj Samurái del Sueño en Avión.",
        "day_1_exchange": "Comprobar que el niño haya investigado el tipo de cambio del euro a yenes actual (entre 150 y 170 yenes).",
        "day_1_bets": "Revisar las tres predicciones divertidas o alocadas para el viaje y verificar que muestren originalidad.",
        "day_2_vending": "Evaluar si la foto muestra un refresco original japonés comprado en una máquina de vending.",
        "day_2_maze": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Infiltración en la Terminal en Aeropuerto KIX.",
        "day_2_kanji": "Evaluar si los kanjis de Persona (人) y Montaña (山) están bien trazados y legibles.",
        "day_2_audit": "Comprobar la estimación numérica ingresada para el reto de Auditoría de Vending en Calle.",
        "day_2_yokai": "Comprobar que la foto enviada muestre nítidamente Caza del Yōkai Oficial en Calle y que corresponda a lo solicitado.",
        "day_2_posture": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Equilibrio Silencioso en Hotel.",
        "day_2_melody": "Escuchar el audio para comprobar que se perciba claramente el sonido de Melodía del Konbini en Konbini.",
        "day_2_shogun": "Verificar la ruta interactiva por el foso del Castillo de Osaka completada en la captura.",
        "day_2_ekistamp": "Comprobar que la foto enviada muestre nítidamente Coleccionista de Eki-Stamps en Aeropuerto KIX (Estación) y que corresponda a lo solicitado.",
        "day_3_glico": "Comprobar que la foto enviada muestre nítidamente Glico Man en Dotonbori y que corresponda a lo solicitado.",
        "day_3_ninja": "Verificar si cruzó el pasillo del Castillo Nijo en absoluto silencio sin activar el sensor.",
        "day_3_bridge": "Comprobar el recuento de pasos al cruzar el puente tradicional.",
        "day_3_umeda": "Comprobar que la foto enviada muestre nítidamente Umeda Sky (Superhéroe) en Umeda Sky y que corresponda a lo solicitado.",
        "day_3_architect": "Verificar si la respuesta del niño corresponde a la altura del Umeda Sky Building (173 metros).",
        "day_3_neon": "Evaluar la foto del famoso neón de Glico Man en el puente de Dotonbori.",
        "day_3_rush": "Comprobar si el niño completó el asalto rápido corriendo entre los fosos del Castillo de Osaka.",
        "day_3_flow": "Verificar la medición de parpadeo de neón en hercios tomada con el sensor.",
        "day_3_reflect": "Comprobar que la foto enviada muestre nítidamente El Reflejo Infinito en Osaka y que corresponda a lo solicitado.",
        "day_4_bestiary": "Revisar los yokais capturados en el mapa interactivo en la evidencia del reporte.",
        "day_4_gachapon": "Comprobar que la foto enviada muestre nítidamente Gachapon en Tiendas y que corresponda a lo solicitado.",
        "day_4_vending_roulette": "Verificar si la foto muestra la bebida sorpresa obtenida tras participar en la ruleta.",
        "day_4_crab": "Comprobar que la foto enviada muestre nítidamente Paso del Cangrejo en Puente / Calles y que corresponda a lo solicitado.",
        "day_4_knife": "Verificar el tipo de cuchillo tradicional seleccionado y su precio estimado coherente en yenes.",
        "day_4_500yen": "Evaluar si armó una lista de snacks del Konbini por menos de 500 yenes.",
        "day_4_isshinji": "Revisar el texto redactado sobre la curiosidad de las estatuas hechas con cenizas de difuntos.",
        "day_4_tracker": "Verificar el análisis comparativo de precios en el mercado de Kuromon.",
        "day_4_yakiniku": "Comprobar que la foto enviada muestre nítidamente Maestro Yakiniku en Restaurante y que corresponda a lo solicitado.",
        "day_5_gymnast": "Evaluar la foto de la pose de gimnasia y la respuesta de la trivia: Shika-senbei (galletas de ciervo).",
        "day_5_investor": "Evaluar si el explorador analizó correctamente un souvenir de Nara, calculando un ROI realista y justificando su viabilidad comercial.",
        "day_5_mochi": "Revisar la foto o vídeo del mochi rápido machacado de forma tradicional en Nakatanidou.",
        "day_5_monk": "Evaluar que el explorador haya respondido correctamente que la base del Buda tiene 56 pétalos.",
        "day_5_deer_galaxy": "Verificar que el niño haya completado el minijuego digital de alimentar ciervos en Nara.",
        "day_5_ribbon": "Comprobar la puntuación obtenida en el juego de danza de cinta.",
        "day_5_zen": "Evaluar la legibilidad y trazado del kanji de meditación zen.",
        "day_5_engineer": "Verificar la fórmula o aproximación matemática del volumen corporal del Gran Buda de bronce.",
        "day_5_guardian": "Evaluar si la foto o descripción del orificio confirma que tiene las dimensiones de la fosa nasal del Buda.",
        "day_6_evasion": "Comprobar que el niño cruzó el puente sigilosamente sin activar el acelerómetro del móvil.",
        "day_6_clan": "Evaluar si la foto familiar recrea de forma divertida una pose de los antiguos clanes feudales.",
        "day_6_seal": "Evaluar el dibujo digital del sello imperial de Nara trazado en la pantalla.",
        "day_6_clouds": "Evaluar el trazo digital de la silueta de nube tradicional japonesa.",
        "day_6_ninja_steps": "Verificar que se completó con éxito la secuencia de movimientos ninja.",
        "day_6_tactical": "Revisar el informe técnico escrito sobre la arquitectura y defensas del Castillo Nijo.",
        "day_6_edict": "Verificar si el mensaje secreto descifrado a partir del edicto del Shogun es correcto.",
        "day_6_time_travel": "Comprobar que la foto enviada muestre nítidamente Viaje en el Tiempo en Castillo de Nijo y que corresponda a lo solicitado.",
        "day_6_ring": "Verificar que el niño responda 10 como número de anillos del ciprés centenario.",
        "day_7_kimono": "Comprobar que el niño vista el kimono con la solapa izquierda sobre la derecha en la foto.",
        "day_7_kintsugi": "Verificar el plato restaurado mediante Kintsugi en el minijuego virtual.",
        "day_7_tea": "Comprobar la estabilidad del té servido medida con el giroscopio del móvil.",
        "day_7_stone_guardian": "Verificar la foto de los faroles de piedra tradicionales en el santuario.",
        "day_7_structural": "Comprobar que el niño responda exactamente 5 pisos para la Pagoda de Yasaka.",
        "day_7_survival": "Revisar las tres reglas de supervivencia escritas por el niño para un sismo.",
        "day_7_anti_quake": "Verificar el éxito en el simulador digital de sismos.",
        "day_7_stairs": "Comprobar el recuento de escalones de Sannenzaka ingresado por el niño (la cifra real son 17 escalones).",
        "day_7_geisha": "Evaluar la foto tomada de la Geisha o Maiko en el barrio de Gion.",
        "day_8_kid14_wave_sync": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Sincronización de Frecuencias en Arashiyama.",
        "day_8_kid9_pose": "Comprobar que la foto enviada muestre nítidamente El Trono de Piedra en Templo Otagi Nenbutsu-ji y que corresponda a lo solicitado.",
        "day_8_kid14_bosque": "Verificar la estimación de pasos del niño para los 2.7 km de Arashiyama (debe estar en el rango de 2000 a 6000).",
        "day_8_kid14_arashiyama": "Leer el reporte sensorial escrito del bosque de bambú de Arashiyama.",
        "day_8_kid9_wind": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Susurro del Viento en Arashiyama.",
        "day_8_kid9_bamboo_clock": "Comprobar la estimación numérica ingresada para el reto de El Reloj de Bambú en Arashiyama.",
        "day_8_kid9_giants": "Comprobar que la foto enviada muestre nítidamente Perspectiva de Gigantes en Bosque de Bambú y que corresponda a lo solicitado.",
        "day_8_kid9_monk": "Escuchar el audio para comprobar que se perciba claramente el sonido de El Mensaje del Monje en Tenryu-ji.",
        "day_8_kid9_rake": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Rastrillo del Jardinero en Tenryu-ji.",
        "day_8_fam_squad": "Comprobar que la foto enviada muestre nítidamente Escuadrón Bambú en Arashiyama y que corresponda a lo solicitado.",
        "day_9_kid14_gravity": "Comprobar la estimación numérica ingresada para el reto de Física del Kinkaku-ji en Kinkaku-ji.",
        "day_9_kid14_angulo": "Comprobar que la foto enviada muestre nítidamente Ángulo Imposible en Fushimi Inari y que corresponda a lo solicitado.",
        "day_9_kid9_scratch": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Limpia el Reflejo de Oro en Kinkaku-ji.",
        "day_9_kid14_torii": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Laberinto de Torii en Fushimi Inari.",
        "day_9_kid9_zorros": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente La Escalada de los Zorros en Fushimi Inari-taisha.",
        "day_9_kid14_ave": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de La Postura del Ave Dorada en Kinkaku-ji.",
        "day_9_kid9_altar": "Comprobar que la foto enviada muestre nítidamente El Altar Secreto en Fushimi Inari y que corresponda a lo solicitado.",
        "day_9_kid14_tunnel": "Comprobar que la foto enviada muestre nítidamente El Túnel Infinito en Fushimi Inari y que corresponda a lo solicitado.",
        "day_9_fam_portal": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de La Puerta a Otro Mundo en Fushimi Inari.",
        "day_10_kid9_nishiki": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Maestro Chatarra en Nishiki.",
        "day_10_fam_sayonara": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Sayonara Kioto en Kioto.",
        "day_10_kid9_bento": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Maestro del Bento en Mercado Nishiki.",
        "day_10_kid9_dragon": "Comprobar que se haya elegido la opción correcta para responder sobre El Dragón del Mercado.",
        "day_10_kid14_milla": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente La Milla del Samurái en Ribera del Río Kamo.",
        "day_10_kid14_crypto": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Protocolo de Enlace Cifrado en Hotel.",
        "day_10_kid9_rainbow": "Comprobar que la foto enviada muestre nítidamente El Snack Arcoíris en Nishiki y que corresponda a lo solicitado.",
        "day_10_kid9_matcha": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Poción de Matcha en Nishiki.",
        "day_10_kid14_tako": "Comprobar la estimación numérica ingresada para el reto de Comida Bizarra en Nishiki.",
        "day_11_onsen": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Código Onsen en Okuhida.",
        "day_11_tea": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Té Intacto en Ryokan.",
        "day_11_yukata": "Comprobar que se haya elegido la opción correcta para responder sobre Cazadora de Yukatas.",
        "day_11_tatami": "Comprobar que la foto enviada muestre nítidamente La Textura del Tatami en Ryokan y que corresponda a lo solicitado.",
        "day_11_kaiseki": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Catador de Kaiseki en Ryokan.",
        "day_11_spring": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Rastreador de Manantiales en Okuhida.",
        "day_11_architecture": "Comprobar la estimación numérica ingresada para el reto de Arquitectura Termal en Ryokan.",
        "day_11_economy": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Economía Alpina en Ryokan.",
        "day_11_geta": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Equilibrio del Yukata en Ryokan.",
        "day_12_silence": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Silencio de los Kami en Takayama.",
        "day_12_sugidama": "Comprobar que la foto enviada muestre nítidamente La Bola de Cedro en Takayama y que corresponda a lo solicitado.",
        "day_12_wood": "Comprobar que la foto enviada muestre nítidamente Detective de Madera en Takayama y que corresponda a lo solicitado.",
        "day_12_hida": "Comprobar la estimación numérica ingresada para el reto de Degustadora de Hida en Takayama.",
        "day_12_carving": "Comprobar que la foto enviada muestre nítidamente Talla en Madera en Takayama y que corresponda a lo solicitado.",
        "day_12_sake": "Comprobar la antigüedad calculada de la destilería Funasaka (debe ser exactamente 323 años).",
        "day_12_patrol": "Verificar la madera tradicional del distrito seleccionada en la opción (Ciprés/Cedro).",
        "day_12_appraisal": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Tasador Feudal en Takayama.",
        "day_12_bridge": "Comprobar que la foto enviada muestre nítidamente Cruzando el Miyagawa en Takayama y que corresponda a lo solicitado.",
        "day_13_stairs": "Comprobar que el niño responda exactamente 398 escalones para la Pagoda Chureito.",
        "day_13_manhole": "Comprobar que la foto enviada muestre nítidamente El Sello del Lago en Kawaguchiko y que corresponda a lo solicitado.",
        "day_13_icecream": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Sabores del Fuji en Kawaguchiko.",
        "day_13_yokai": "Comprobar que la foto enviada muestre nítidamente Filtro de Yōkai en Kawaguchiko y que corresponda a lo solicitado.",
        "day_13_perspective": "Comprobar que la foto enviada muestre nítidamente Perspectiva del Gigante en Monte Fuji y que corresponda a lo solicitado.",
        "day_13_tunnels": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Navegantes del Asfalto en Kawaguchiko.",
        "day_13_volcano": "Verificar el año de erupción registrado para el Monte Fuji (debe ser exactamente 1707).",
        "day_13_triangulation": "Verificar la distancia estimada en kilómetros al cráter del Fuji (alrededor de 26 km).",
        "day_13_oishi": "Comprobar que la foto enviada muestre nítidamente Oishi Park en Flor en Oishi Park y que corresponda a lo solicitado.",
        "day_14_rock": "Comprobar que la foto enviada muestre nítidamente Aliento de Volcán en Monte Fuji (5ª Estación) y que corresponda a lo solicitado.",
        "day_14_kid9_echo": "Escuchar el audio para comprobar que se perciba claramente el sonido de El Sonido que Muere en Bosque Aokigahara.",
        "day_14_root": "Comprobar que la foto enviada muestre nítidamente Guardián del Bosque en Bosque Aokigahara y que corresponda a lo solicitado.",
        "day_14_compass": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Brújula al Cráter en Fuji.",
        "day_14_radar": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Radar de Altitud Cero en Fuji.",
        "day_14_pressure": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de La Ley de la Presión en Fuji.",
        "day_14_altimeter": "Comprobar la estimación numérica ingresada para el reto de Altímetro Hacker en Fuji.",
        "day_14_kid14_echo": "Comprobar la justificación escrita sobre por qué las rocas de lava de Aokigahara absorben el sonido.",
        "day_14_oxygen": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Oxígeno Alpino en Fuji.",
        "day_15_waterfall": "Escuchar el audio para comprobar que se perciba claramente el sonido de Melodía de Shiraito en Cascada Shiraito.",
        "day_15_thatch": "Comprobar que la foto enviada muestre nítidamente La Aldea de Paja en Iyashi no Sato y que corresponda a lo solicitado.",
        "day_15_fish": "Comprobar que la foto enviada muestre nítidamente Pez de Cristal en Estanques y que corresponda a lo solicitado.",
        "day_15_shogun": "Verificar el nombre de la deidad sintoísta del monte Fuji ingresada (Konohanasakuya-hime).",
        "day_15_deity": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Santuario Escondido en Fujisan Hongu Sengen Taisha.",
        "day_15_honcho": "Comprobar que la foto enviada muestre nítidamente Perspectiva Honcho Street en Honcho Street y que corresponda a lo solicitado.",
        "day_15_flow": "Verificar la estimación del caudal de agua de la cascada Shiraito (rango de 1.000 a 2.000 L/s).",
        "day_15_roof": "Comprobar la explicación del ángulo de 60 grados de los tejados Gassho-zukuri contra la nieve.",
        "day_15_dragon": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente La Leyenda del Dragón en Lago Kawaguchi.",
        "day_16_cat": "Comprobar que la foto enviada muestre nítidamente El Gato Oculto en Kagurazaka y que corresponda a lo solicitado.",
        "day_16_skyscraper": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Escalada Urbana en Tokio.",
        "day_16_colors": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Colores de Shinjuku en Shinjuku.",
        "day_16_traffic": "Escuchar el audio para comprobar que se perciba claramente el sonido de Sonido del Semáforo en Tokio.",
        "day_16_vortex": "Comprobar que la foto enviada muestre nítidamente Vórtice Temporal en Kagurazaka y que corresponda a lo solicitado.",
        "day_16_combat": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Calibración de Androide en Shinjuku.",
        "day_16_shinjuku": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Supervivencia Shinjuku en Estación de Shinjuku.",
        "day_16_density": "Comprobar que la foto enviada muestre nítidamente Densidad Poblacional en Tokio y que corresponda a lo solicitado.",
        "day_16_tocho": "Comprobar que la foto enviada muestre nítidamente El Observatorio Gratuito en Mirador del Ayuntamiento y que corresponda a lo solicitado.",
        "day_17_omikuji": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Destino Omikuji en Senso-ji.",
        "day_17_incense": "Comprobar que la foto enviada muestre nítidamente Humo de la Fortuna en Senso-ji y que corresponda a lo solicitado.",
        "day_17_gashapon": "Comprobar que la foto enviada muestre nítidamente Gashapon Perfecto en Akihabara y que corresponda a lo solicitado.",
        "day_17_p2p_receiver": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Sincronización P2P (Receptor) en Akihabara.",
        "day_17_retro": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Arqueología Gamer en Akihabara.",
        "day_17_skytree": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Cervicales de Acero en Skytree.",
        "day_17_p2p_sender": "Comprobar la estimación numérica ingresada para el reto de Sincronización P2P (Emisor) en Akihabara.",
        "day_17_height": "Comprobar que el niño responda exactamente 634 metros para la altura de la Tokyo Skytree.",
        "day_17_sumida": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Navegando el Sumida en Río Sumida.",
        "day_18_shibuya": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de La Marea Humana en Shibuya.",
        "day_18_hachiko": "Comprobar que la foto enviada muestre nítidamente Guardián Hachiko en Shibuya y que corresponda a lo solicitado.",
        "day_18_ema": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Mensaje del Emperador en Meiji Jingu.",
        "day_18_crepe": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Crepe de Harajuku en Harajuku.",
        "day_18_radio": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Intercepción de Radio en Harajuku.",
        "day_18_trend": "Comprobar que la foto enviada muestre nítidamente Cazatendencias en Harajuku y que corresponda a lo solicitado.",
        "day_18_flow": "Verificar el modelado del tránsito de Shibuya (debe ser de aprox. 3000 personas por ciclo verde).",
        "day_18_silence": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Silencio en la Ciudad en Meiji Jingu.",
        "day_18_crossing": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Cruzando Shibuya en Shibuya.",
        "day_19_gundam": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Piloto de Mechas en Odaiba.",
        "day_19_color": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Cazador de Luz en TeamLab.",
        "day_19_teamlab": "Comprobar que la foto enviada muestre nítidamente Sueños Digitales en TeamLab y que corresponda a lo solicitado.",
        "day_19_liberty": "Comprobar que la foto enviada muestre nítidamente La Libertad Nipona en Odaiba y que corresponda a lo solicitado.",
        "day_19_crypto": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Desencriptar Protocolo en Odaiba.",
        "day_19_mirrors": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Lógica de Iluminación en TeamLab.",
        "day_19_weight": "Comprobar el peso estimado del robot Unicorn Gundam gigante (debe ser de aprox. 49 toneladas).",
        "day_19_monorail": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Monorriel Yurikamome en Tren.",
        "day_19_immersive": "Comprobar que la foto enviada muestre nítidamente Inmersión Total en TeamLab y que corresponda a lo solicitado.",
        "day_20_bento": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Maestro del Bento (Cooperativo) en Ueno.",
        "day_20_potion": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Poción Gatuna en Yanaka Ginza.",
        "day_20_pond": "Comprobar que la foto enviada muestre nítidamente El Pato del Estanque en Ueno y que corresponda a lo solicitado.",
        "day_20_weight": "Comprobar que la foto enviada muestre nítidamente El Peso del Tesoro en Ameyoko y que corresponda a lo solicitado.",
        "day_20_change": "Comprobar la estimación numérica ingresada para el reto de Regateo en Ameyoko en Ameyoko.",
        "day_20_museum": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Arquitectura del Museo en Ueno.",
        "day_20_vintage": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Análisis de Precios Retro en Ameyoko.",
        "day_20_stairs": "Comprobar la estimación numérica ingresada para el reto de Escaleras del Atardecer en Yanaka Ginza.",
        "day_20_tasting": "Comprobar que la foto enviada muestre nítidamente Degustación Callejera en Calle y que corresponda a lo solicitado.",
        "day_21_monkeys": "Comprobar que la foto enviada muestre nítidamente Los Tres Monos en Nikko y que corresponda a lo solicitado.",
        "day_21_dragon": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Latido del Dragón en Nikko.",
        "day_21_slash": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de El Tajo del Samurái en Kamakura.",
        "day_21_jizo": "Comprobar que la foto enviada muestre nítidamente Guardián de Piedra en Kamakura y que corresponda a lo solicitado.",
        "day_21_buddha": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Ingeniero Imperial en Kamakura.",
        "day_21_gold": "Comprobar la estimación numérica ingresada para el reto de Análisis de Pan de Oro en Templo.",
        "day_21_tracking": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Rastreo de la Naturaleza en Nikko.",
        "day_21_defense": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Defensa del Shogunato en Templo/Castillo.",
        "day_21_silence": "Escuchar el audio para comprobar que se perciba claramente el sonido de La Paz de la Montaña en Templo/Tumba.",
        "day_22_shout": "Escuchar el audio para comprobar que se perciba claramente el sonido de Grito de Pescadero en Toyosu.",
        "day_22_car": "Comprobar que la foto enviada muestre nítidamente Vehículo de Lujo en Ginza y que corresponda a lo solicitado.",
        "day_22_elevator": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Ascensor Infinito en Roppongi.",
        "day_22_tower": "Comprobar que la foto enviada muestre nítidamente Réplica Eiffel en Torre de Tokio y que corresponda a lo solicitado.",
        "day_22_jewel": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente La Joya de Ginza en Ginza.",
        "day_22_numbers": "Comprobar la estimación numérica ingresada para el reto de Intercepción Numérica en Calle.",
        "day_22_fish": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Logística del Pescado en Toyosu.",
        "day_22_compare": "Verificar la altura calculada para la Torre de Tokio (debe ser exactamente 333 metros).",
        "day_22_neon": "Comprobar que la foto enviada muestre nítidamente Luces de Neón en Ginza/Roppongi y que corresponda a lo solicitado.",
        "day_23_kitkat": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Buscador de KitKat en Don Quijote.",
        "day_23_pokedex": "Leer la respuesta escrita para comprobar que el niño describa y justifique correctamente Pokédex de Supermercado en Tienda.",
        "day_23_coins": "Comprobar que la foto enviada muestre nítidamente Oráculo de Monedas en Calle y que corresponda a lo solicitado.",
        "day_23_mascot": "Comprobar que la foto enviada muestre nítidamente Mascotas de Viaje en Hotel y que corresponda a lo solicitado.",
        "day_23_tetris": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Tetris de Maletas en Hotel.",
        "day_23_audit": "Comprobar la estimación numérica ingresada para el reto de Auditoría Final en Hotel.",
        "day_23_security": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Protocolo de Embarque en Aeropuerto.",
        "day_23_weight": "Comprobar la estimación numérica ingresada para el reto de Peso de Carga en Aeropuerto.",
        "day_23_stamp": "Comprobar que la foto enviada muestre nítidamente El Sello Final en Aeropuerto y que corresponda a lo solicitado.",
        "day_24_meal": "Comprobar que la foto enviada muestre nítidamente Comida Aérea en Avión y que corresponda a lo solicitado.",
        "day_24_clouds": "Comprobar que la foto enviada muestre nítidamente Nubes sobre Europa en Avión y que corresponda a lo solicitado.",
        "day_24_turbulence": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Cinturón Abrochado en Avión.",
        "day_24_badges": "Verificar que la evidencia confirme que el niño ha completado con éxito la actividad de Recuento de Sellos en Avión.",
        "day_24_timezones": "Comprobar el cálculo de diferencia de 7 horas en formato de 24 horas.",
        "day_24_distance": "Verificar el kilometraje registrado de vuelo de vuelta a casa (entre 9.000 km y 12.000 km).",
        "day_24_speed": "Comprobar la velocidad media de vuelo a reacción ingresada (entre 700 y 1.100 km/h).",
        "day_24_log": "Leer la bitácora final del explorador describiendo las experiencias del viaje.",
        "day_24_sayonara": "Revisar los tres mejores momentos familiares del viaje redactados."
};
    return criteria[missionId] || "";
}

function generateJudgeGuide(p) {
    const kidName = gameState[p.kid] ? gameState[p.kid].name : p.kid;
    const isKid9 = p.kid === 'kid9';
    const tag = p.config ? p.config.tag : 'generic';
    
    // 1. Explicación de la prueba (Qué evalúas)
    let explanation = '';
    const customCriteria = getMissionEvaluationCriteria(p.missionId);
    if (customCriteria) {
        explanation = customCriteria;
    } else {
        const mTitle = p.config ? p.config.title : '';
        const tagText = tag === 'photo' ? 'fotografía' :
                        tag === 'audio' ? 'grabación de sonido' :
                        tag === 'writing' ? 'respuesta escrita' :
                        tag === 'sensors' ? 'validación física de sensores' :
                        tag === 'versus' ? 'minijuego/reto familiar competitivo' :
                        tag === 'economy' ? 'cálculo matemático/económico' :
                        tag === 'game' ? 'minijuego lógico interactivo' : 'actividad general';
                        
        if (mTitle) {
            explanation = `Esta es una prueba de tipo ${tagText} llamada "${mTitle}". Evalúa la evidencia entregada para asegurar que se ha completado la tarea conforme a las instrucciones especificadas.`;
        } else {
            explanation = `Esta es una prueba de tipo ${tagText}. Evalúa la respuesta enviada para asegurar que se ha completado la tarea con honestidad.`;
        }
    }

    // 2. Respuesta esperada sugerida
    let expected = '';
    const customExpected = getMissionExpectedAnswer(p.missionId);
    if (customExpected) {
        expected = customExpected;
    } else if (p.config && p.config.correctAnswer) {
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
    const settingsTab = document.getElementById('btn-judge-tab-settings');
    
    const selectAllTabs = () => [pendingTab, approvedTab, settingsTab];
    const selectAllSections = () => [
        document.getElementById('judge-pending-section'),
        document.getElementById('judge-approved-section'),
        document.getElementById('judge-settings-section')
    ];
    
    if (pendingTab && approvedTab && settingsTab) {
        const switchTab = (activeTab, activeSection, tabKey) => {
            currentJudgeTab = tabKey;
            selectAllTabs().forEach(t => {
                if (t) {
                    t.classList.remove('active');
                    t.style.borderBottomColor = 'transparent';
                    t.style.color = 'var(--color-gray-dark)';
                }
            });
            activeTab.classList.add('active');
            activeTab.style.borderBottomColor = 'var(--color-primary)';
            activeTab.style.color = 'var(--color-primary)';
            
            selectAllSections().forEach(s => { if (s) s.classList.add('hidden'); });
            activeSection.classList.remove('hidden');
            
            if (tabKey === 'settings') {
                // Rellenar campos de configuración en el formulario
                const selectRole = document.getElementById('select-device-role');
                if (selectRole) selectRole.value = localStorage.getItem('japanMissionsDeviceRole') || 'all';
                
                const firebaseInput = document.getElementById('firebase-config-input');
                if (firebaseInput) {
                    const savedConfig = localStorage.getItem('japanMissionsFirebaseConfig') || '';
                    try {
                        firebaseInput.value = savedConfig ? JSON.stringify(JSON.parse(savedConfig), null, 2) : '';
                    } catch (e) {
                        firebaseInput.value = savedConfig;
                    }
                }
            } else {
                renderJudgePanel();
            }
        };
        
        pendingTab.addEventListener('click', () => switchTab(pendingTab, document.getElementById('judge-pending-section'), 'pending'));
        approvedTab.addEventListener('click', () => switchTab(approvedTab, document.getElementById('judge-approved-section'), 'approved'));
        settingsTab.addEventListener('click', () => switchTab(settingsTab, document.getElementById('judge-settings-section'), 'settings'));
        
        // Configurar botones del formulario de configuración de ajustes de juez (sólo una vez)
        document.getElementById('btn-save-device-role').addEventListener('click', () => {
            const selected = document.getElementById('select-device-role').value;
            localStorage.setItem('japanMissionsDeviceRole', selected);
            alert("Perfil de dispositivo fijado con éxito. La aplicación se recargará para aplicar.");
            location.reload();
        });
        
        document.getElementById('btn-save-firebase-config').addEventListener('click', () => {
            const configText = document.getElementById('firebase-config-input').value.trim();
            if (!configText) {
                alert("Por favor, introduce el JSON de configuración.");
                return;
            }
            if (window.FirebaseSync) {
                window.FirebaseSync.saveFirebaseConfig(configText);
            }
        });
        
        document.getElementById('btn-disconnect-firebase').addEventListener('click', () => {
            if (window.FirebaseSync) {
                window.FirebaseSync.disconnect();
            }
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
    } else if (submission.type === 'video') {
        let srcUrl = submission.data;
        if (srcUrl && !srcUrl.startsWith('data:video/') && !srcUrl.startsWith('data:application/')) {
            srcUrl = await getPhotoFromDB(submission.data);
        }
        if (srcUrl) {
            dataHtml = `<video controls src="${srcUrl}" style="width:100%; border-radius:10px; max-height:250px; background:#000; margin-top:10px;"></video>`;
        } else {
            dataHtml = `<b>Evidencia Vídeo:</b> ${submission.data}`;
        }
    } else if (submission.type === 'audio') {
        let srcUrl = submission.data;
        if (srcUrl && !srcUrl.startsWith('data:audio/')) {
            srcUrl = await getPhotoFromDB(submission.data);
        }
        if (srcUrl) {
            dataHtml = `<audio controls src="${srcUrl}" style="width:100%; margin-top:10px;"></audio>`;
        } else {
            dataHtml = `<b>Evidencia Audio:</b> ${submission.data}`;
        }
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

    // Renderizado de metadatos adicionales si existen
    if (submission.metadata) {
        let metaHtml = '<div style="margin-top:8px; font-size:0.82rem; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 10px; border-radius:6px; color:#475569; line-height:1.4; text-align:left;">';
        metaHtml += '<div style="font-weight:bold; color:#1e293b; margin-bottom:4px; border-bottom:1px dashed #cbd5e1; padding-bottom:2px;">📋 Datos y Selección de la Prueba:</div>';
        for (const [key, value] of Object.entries(submission.metadata)) {
            const prettyKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            metaHtml += `<div>&bull; <b>${prettyKey}:</b> ${value}</div>`;
        }
        metaHtml += '</div>';
        dataHtml += metaHtml;
    }

    return dataHtml;
}

async function renderJudgePanel() {
    currentUser = 'judge';
    initJudgeTabListeners();

    if (currentJudgeTab === 'pending') {
        const list = document.getElementById('pending-missions-list');
        const pendings = getPendingMissions();
        list.innerHTML = '';

        // Banner de diagnóstico de sincronización
        const fbConnected = window.FirebaseSync && window.FirebaseSync.isConnected();
        const k9Pending = Object.values((gameState.kid9 && gameState.kid9.missions) || {}).filter(m => m.status === 'pending').length;
        const k14Pending = Object.values((gameState.kid14 && gameState.kid14.missions) || {}).filter(m => m.status === 'pending').length;
        const diagColor = fbConnected ? '#4caf50' : '#e53935';
        const diagIcon = fbConnected ? '🟢' : '🔴';
        
        const diagHtml = `
            <div style="background: rgba(0,0,0,0.03); border: 1px solid ${diagColor}; border-radius: 10px; padding: 10px 14px; margin-bottom: 15px; font-size: 0.8rem; line-height: 1.5;">
                <div>${diagIcon} Firebase: <b>${fbConnected ? 'Conectado' : 'Desconectado'}</b> | Laura: <b>${k9Pending}</b> pendientes | Iván: <b>${k14Pending}</b> pendientes</div>
                <div style="margin-top:6px;">
                    <button id="btn-judge-force-sync" style="background:${diagColor}; color:white; border:none; border-radius:6px; padding:6px 14px; font-size:0.8rem; font-weight:bold; cursor:pointer;">🔄 Forzar sincronización</button>
                </div>
            </div>
        `;
        list.insertAdjacentHTML('beforebegin', diagHtml);
        
        // Eliminar banner anterior si existe
        const oldDiag = document.querySelectorAll('#btn-judge-force-sync');
        if (oldDiag.length > 1) {
            oldDiag[0].closest('div').parentElement.removeChild(oldDiag[0].closest('div'));
        }

        document.getElementById('btn-judge-force-sync')?.addEventListener('click', async () => {
            if (window.FirebaseSync && window.FirebaseSync.isConnected()) {
                await window.FirebaseSync.forceDownloadFromCloud();
                renderJudgePanel();
            } else {
                alert('Firebase no está conectado. Asegúrate de tener conexión a internet.');
            }
        });
        
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
                const missionDescription = getMissionDescription(p.config, p.kid);
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

                const isFailed = p.data.submission.failed === true;
                const failedBannerHtml = isFailed ? `
                    <div style="background: #ffebee; border: 1px solid #ffcdd2; color: #c62828; border-radius: 8px; padding: 10px 14px; font-size: 0.85rem; font-weight: bold; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; text-align: left;">
                        <span>⚠️</span> <span>¡EL NIÑO AGOTÓ LOS INTENTOS Y LA MISIÓN FALLÓ! Evidencia enviada automáticamente.</span>
                    </div>
                ` : '';

                card.innerHTML = `
                    ${failedBannerHtml}
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
                        ${missionDescription ? `
                            <div style="font-weight: 900; color: var(--color-primary-dark); margin-bottom: 2px;">📋 Instrucciones de la prueba:</div>
                            <p style="margin: 0 0 10px 0; opacity: 0.95; color: #3e2723;">${missionDescription}</p>
                            <hr style="border:0; border-top:1px solid rgba(0,0,0,0.08); margin:8px 0;">
                        ` : ''}
                        <div style="font-weight: 900; color: #795548; margin-bottom: 2px;">📖 Qué evalúas:</div>
                        <p style="margin: 0 0 8px 0; opacity: 0.95; color: #4e342e;">${guide.explanation}</p>
                        <div style="font-weight: 900; color: var(--color-accent); margin-bottom: 2px;">💡 Respuesta correcta esperada:</div>
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

function recordDailyActivityAndMetadata(kid, missionId) {
    const todayStr = getJapanCurrentDate().toDateString();
    if (!gameState[kid].counters) gameState[kid].counters = {};
    if (!gameState[kid].counters.dailyActivity) gameState[kid].counters.dailyActivity = {};
    if (!gameState[kid].counters.dailyActivity[todayStr]) {
        gameState[kid].counters.dailyActivity[todayStr] = { minigamesPlayed: 0, photosAdded: 0, physicalCompleted: 0, languageCompleted: 0 };
    }
    
    const config = MISSIONS_CONFIG[missionId];
    if (config) {
        if (config.tag === 'physical') {
            gameState[kid].counters.dailyActivity[todayStr].physicalCompleted = (gameState[kid].counters.dailyActivity[todayStr].physicalCompleted || 0) + 1;
        }
        if (config.tag === 'writing' || config.tag === 'audio') {
            gameState[kid].counters.dailyActivity[todayStr].languageCompleted = (gameState[kid].counters.dailyActivity[todayStr].languageCompleted || 0) + 1;
        }
    }
    
    // Almacenamos el día en que se aprobó para racha_misiones_dia
    if (gameState[kid].missions[missionId]) {
        gameState[kid].missions[missionId].approvedDateStr = todayStr;
    }
}

window.approveMission = (kid, missionId, xp, isFamily) => {
    const conf = MISSIONS_CONFIG[missionId];
    if (conf && conf.role === 'both') {
        isFamily = true;
    }
    let leveledUp = false;
    let newBadges = [];

    let yenEarned = xp * 5;
    if (isFamily) {
        recordDailyActivityAndMetadata('kid9', missionId);
        recordDailyActivityAndMetadata('kid14', missionId);

        gameState['kid9'].missions[missionId].status = 'approved';
        gameState['kid14'].missions[missionId].status = 'approved';
        gameState['kid9'].missions[missionId].awardedXP = xp;
        gameState['kid14'].missions[missionId].awardedXP = xp;
        gameState['kid9'].missions[missionId].statusUpdatedAt = Date.now();
        gameState['kid14'].missions[missionId].statusUpdatedAt = Date.now();
        gameState['kid9'].xp += xp;
        gameState['kid14'].xp += xp;
        gameState['kid9'].wallet = (gameState['kid9'].wallet || 0) + yenEarned;
        gameState['kid14'].wallet = (gameState['kid14'].wallet || 0) + yenEarned;
        
        let l1 = checkLevelUp('kid9');
        let l2 = checkLevelUp('kid14');
        leveledUp = l1 || l2;
        
        let b1 = checkBadges('kid9', missionId);
        let b2 = checkBadges('kid14', missionId);
        if(b1.length) newBadges.push(...b1);
        if(b2.length) newBadges.push(...b2);

    } else {
        recordDailyActivityAndMetadata(kid, missionId);

        gameState[kid].missions[missionId].status = 'approved';
        gameState[kid].missions[missionId].awardedXP = xp;
        gameState[kid].missions[missionId].statusUpdatedAt = Date.now();
        gameState[kid].xp += xp;
        gameState[kid].wallet = (gameState[kid].wallet || 0) + yenEarned;
        
        leveledUp = checkLevelUp(kid);
        newBadges = checkBadges(kid, missionId);
    }
    
    if (isFamily) {
        const changes9 = {
            [`missions.${missionId}`]: gameState['kid9'].missions[missionId],
            xp: gameState['kid9'].xp,
            wallet: gameState['kid9'].wallet,
            level: gameState['kid9'].level,
            badges: gameState['kid9'].badges,
            counters: gameState['kid9'].counters
        };
        saveAndSyncJudgeDecision('kid9', changes9);

        const changes14 = {
            [`missions.${missionId}`]: gameState['kid14'].missions[missionId],
            xp: gameState['kid14'].xp,
            wallet: gameState['kid14'].wallet,
            level: gameState['kid14'].level,
            badges: gameState['kid14'].badges,
            counters: gameState['kid14'].counters
        };
        saveAndSyncJudgeDecision('kid14', changes14);
    } else {
        const changes = {
            [`missions.${missionId}`]: gameState[kid].missions[missionId],
            xp: gameState[kid].xp,
            wallet: gameState[kid].wallet,
            level: gameState[kid].level,
            badges: gameState[kid].badges,
            counters: gameState[kid].counters
        };
        saveAndSyncJudgeDecision(kid, changes);
    }
    
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
    const conf = MISSIONS_CONFIG[missionId];
    let isFamily = conf && conf.role === 'both';
    if (!isFamily) {
        const missionState = gameState[kid].missions[missionId];
        isFamily = missionState && missionState.submission && missionState.submission.type === 'family';
    }

    if (isFamily) {
        ['kid9', 'kid14'].forEach(k => {
            if (gameState[k].missions[missionId]) {
                gameState[k].missions[missionId].status = 'unlocked';
                gameState[k].missions[missionId].submission = null;
                gameState[k].missions[missionId].feedback = reason;
                gameState[k].missions[missionId].statusUpdatedAt = Date.now();
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
        gameState[kid].missions[missionId].statusUpdatedAt = Date.now();
        
        // Si falla, rompemos las rachas (para medalla olimpica o criptografo_elite)
        if(gameState[kid].counters) {
            gameState[kid].counters.physicalStreak = 0;
            if(MISSIONS_CONFIG[missionId] && (MISSIONS_CONFIG[missionId].tag === 'expert' || MISSIONS_CONFIG[missionId].title.includes('Terminal'))) {
                gameState[kid].counters.cryptoSolvedFirstTry = false;
            }
        }
    }
    
    if (isFamily) {
        const changes9 = {
            [`missions.${missionId}`]: gameState['kid9'].missions[missionId],
            counters: gameState['kid9'].counters
        };
        saveAndSyncJudgeDecision('kid9', changes9);

        const changes14 = {
            [`missions.${missionId}`]: gameState['kid14'].missions[missionId],
            counters: gameState['kid14'].counters
        };
        saveAndSyncJudgeDecision('kid14', changes14);
    } else {
        const changes = {
            [`missions.${missionId}`]: gameState[kid].missions[missionId],
            counters: gameState[kid].counters
        };
        saveAndSyncJudgeDecision(kid, changes);
    }
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
    const conf = MISSIONS_CONFIG[missionId];
    let isFamily = conf && conf.role === 'both';
    if (!isFamily) {
        isFamily = m.submission && m.submission.type === 'family';
    }

    if (isFamily) {
        ['kid9', 'kid14'].forEach(k => {
            const km = gameState[k].missions[missionId];
            if (km && km.status === 'approved') {
                const kXpToSubtract = km.awardedXP !== undefined ? km.awardedXP : xpToSubtract;
                gameState[k].xp = Math.max(0, gameState[k].xp - kXpToSubtract);
                km.status = 'pending';
                km.feedback = null;
                km.statusUpdatedAt = Date.now();
                recalculateLevel(k);
            }
        });
        showAlert('Deshecho', 'Se ha devuelto la misión conjunta al estado pendiente y restado la experiencia a ambos exploradores.');
    } else {
        gameState[kid].xp = Math.max(0, gameState[kid].xp - xpToSubtract);
        m.status = 'pending';
        m.feedback = null;
        m.statusUpdatedAt = Date.now();
        recalculateLevel(kid);
        showAlert('Deshecho', `Se ha devuelto la misión al estado pendiente y restado la experiencia a ${gameState[kid].name}.`);
    }

    if (isFamily) {
        const changes9 = {
            [`missions.${missionId}`]: gameState['kid9'].missions[missionId],
            xp: gameState['kid9'].xp,
            level: gameState['kid9'].level
        };
        saveAndSyncJudgeDecision('kid9', changes9);

        const changes14 = {
            [`missions.${missionId}`]: gameState['kid14'].missions[missionId],
            xp: gameState['kid14'].xp,
            level: gameState['kid14'].level
        };
        saveAndSyncJudgeDecision('kid14', changes14);
    } else {
        const changes = {
            [`missions.${missionId}`]: gameState[kid].missions[missionId],
            xp: gameState[kid].xp,
            level: gameState[kid].level
        };
        saveAndSyncJudgeDecision(kid, changes);
    }
    renderJudgePanel();
};

// ==========================================
// 6. EVENT LISTENERS Y ARRANQUE
// ==========================================

const showJudgePINModal = () => {
    document.getElementById('judge-modal').classList.remove('hidden');
    document.getElementById('judge-pin-input').value = '';
    setTimeout(() => {
        const inp = document.getElementById('judge-pin-input');
        if (inp) inp.focus();
    }, 100);
};

document.getElementById('btn-judge-secret').addEventListener('click', showJudgePINModal);

const btnHeaderLock = document.getElementById('btn-header-lock');
if (btnHeaderLock) {
    btnHeaderLock.addEventListener('click', showJudgePINModal);
}

document.getElementById('btn-judge-cancel').addEventListener('click', () => {
    document.getElementById('judge-modal').classList.add('hidden');
});

document.getElementById('btn-judge-login').addEventListener('click', async () => {
    const pin = document.getElementById('judge-pin-input').value;
    if (pin === gameState.judgePIN) {
        document.getElementById('judge-modal').classList.add('hidden');
        currentUser = 'judge';
        
        if (window.FirebaseSync && window.FirebaseSync.isConnected()) {
            const list = document.getElementById('pending-missions-list');
            if (list) {
                list.innerHTML = '<p style="text-align:center; padding:20px; font-weight:bold; color:var(--color-primary);">⏳ Descargando últimos datos de los exploradores...</p>';
            }
            try {
                await window.FirebaseSync.forceDownloadFromCloud();
            } catch(e) {
                console.warn("[JudgeLogin] Error en descarga inicial:", e);
            }
        }
        renderJudgePanel();
    } else {
        showAlert('Error', 'PIN incorrecto');
    }
});

document.getElementById('btn-judge-reset-all').addEventListener('click', () => {
    if (confirm("⚠️ ¿Estás COMPLETAMENTE seguro de que quieres resetear TODA la aplicación? Se perderá todo el progreso de ambos niños (Laura e Iván), sus niveles, recompensas, fotos, audios y dibujos guardados. También se restablecerá el dispositivo a multiusuario. Esta acción es irreversible.")) {
        // 1. Limpiar localStorage
        localStorage.removeItem('japanMissionsState');
        localStorage.removeItem('japanMissionsDeviceRole');
        
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
    
    const deviceRole = localStorage.getItem('japanMissionsDeviceRole') || 'all';
    const isLockedKid = (deviceRole === 'kid9' || deviceRole === 'kid14');
    
    if (currentUser === 'judge') {
        if (isLockedKid) {
            // Si el dispositivo está bloqueado a un niño, volver a su perfil de días
            currentUser = deviceRole;
            renderDaysList(deviceRole);
        } else {
            switchView('view-home', false);
            currentUser = null;
        }
    } else if (currentUser) {
        const isMissionView = !document.getElementById('view-mission').classList.contains('hidden');
        const isPassportView = !document.getElementById('view-passport').classList.contains('hidden');
        const isShopView = !document.getElementById('view-shop').classList.contains('hidden');
        const isAlbumView = !document.getElementById('view-album').classList.contains('hidden');
        const isAlbumCatView = !document.getElementById('view-album-category').classList.contains('hidden');
        
        if (isMissionView) {
            renderDayMissions(currentUser, currentDay, currentDayMissions);
        } else if (isPassportView || isShopView || isAlbumView) {
            renderDaysList(currentUser);
        } else if (isAlbumCatView) {
            switchView('view-album', true, "Álbum del Coleccionista");
        } else {
            // Estamos en view-days
            if (currentDay !== null) {
                renderDaysList(currentUser);
            } else {
                if (isLockedKid) {
                    // Si el perfil está fijo, no dejamos salir al menú inicial
                    renderDaysList(currentUser);
                } else {
                    switchView('view-home', false);
                    currentUser = null;
                }
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
    'medalla_olimpica': { title: 'Medalla Olímpica', icon: '🥇', points: 150, desc: 'Completa 5 desafíos físicos (🏃) seguidos.' },
    'bateria_inagotable': { title: 'Batería Inagotable', icon: '🔋', points: 100, desc: 'Envía 3 pruebas al Juez antes de las 8:00 o después de las 22:00.' },
    'sincronizacion_perfecta': { title: 'Sincronización Perfecta', icon: '🤝', points: 150, desc: 'Completa 5 misiones conjuntas aprobadas.' },
    'estomago_acero': { title: 'Estómago de Acero', icon: '🍜', points: 100, desc: 'Completa 3 misiones de probar platos extraños, snacks o bento.' },
    'criptografo_elite': { title: 'Criptógrafo de Élite', icon: '🔐', points: 200, desc: 'Supera 3 misiones de código/Terminal al primer intento.' },
    'primer_paso': { title: 'Primer Paso', icon: '🚶', points: 50, desc: 'Completa tu primera misión en tierras niponas.' },
    'explorador_novato': { title: 'Explorador Novato', icon: '🗺️', points: 100, desc: 'Ten 10 misiones aprobadas en total.' },
    'veterano_tokio': { title: 'Veterano de Tokio', icon: '🗼', points: 200, desc: 'Ten 25 misiones aprobadas en total.' },
    'leyenda_viaje': { title: 'Leyenda del Viaje', icon: '✈️', points: 350, desc: 'Ten 50 misiones aprobadas en total.' },
    'cazador_recuerdos': { title: 'Cazador de Recuerdos', icon: '📸', points: 150, desc: 'Guarda 5 fotos o sonidos en el Álbum del Coleccionista.' },
    'coleccionista_supremo': { title: 'Coleccionista Supremo', icon: '🗂️', points: 250, desc: 'Completa 3 categorías del álbum con al menos 3 elementos.' },
    'amigo_animales': { title: 'Amigo de los Animales', icon: '🦌', points: 100, desc: 'Completa 3 misiones de ciervos, zorros, gatos o monos.' },
    'maestro_palillos': { title: 'Maestro de los Palillos', icon: '🥢', points: 100, desc: 'Completa 3 misiones gastronómicas japonesas.' },
    'hacker_neon': { title: 'Hacker del Neón', icon: '💾', points: 150, desc: 'Supera 5 misiones en Akihabara, Odaiba, Shibuya o Shinjuku.' },
    'espiritu_shinto': { title: 'Espíritu Shinto', icon: '⛩️', points: 150, desc: 'Completa 3 misiones en templos o santuarios.' },
    'usuario_frecuente_jr': { title: 'Usuario Frecuente JR', icon: '🚄', points: 150, desc: 'Completa 3 misiones en trenes o estaciones.' },
    'bilingue_expres': { title: 'Bilingüe Express', icon: '🗣️', points: 150, desc: 'Completa 3 misiones de escritura o hablar en japonés.' },
    'ahorrador_inteligente': { title: 'Ahorrador Inteligente', icon: '👛', points: 100, desc: 'Acumula 1.000 ¥ en tu monedero a la vez.' },
    'comprador_compulsivo': { title: 'Comprador de Akihabara', icon: '🛒', points: 100, desc: 'Compra tu primera mejora en la Tienda Hacker.' },
    'rango_madrugador': { title: 'Rayo de Sol Naciente', icon: '🌅', points: 100, desc: 'Envía una misión aprobada antes de las 7:00 AM.' },
    'lechuza_nocturna': { title: 'Lechuza de Shinjuku', icon: '🦉', points: 100, desc: 'Envía una misión aprobada después de las 23:00 PM.' },
    'super_cooperativo': { title: 'Fuerza de Élite', icon: '🔥', points: 200, desc: 'Completa 10 misiones conjuntas.' },
    'nivel_ascendente': { title: 'Poder Desbloqueado', icon: '⚡', points: 100, desc: 'Alcanza el Nivel 3.' },
    'casi_maestro': { title: 'Camino de la Maestría', icon: '🔮', points: 200, desc: 'Alcanza el Nivel 6.' },
    'avatar_supremo': { title: 'Avatar Supremo', icon: '👑', points: 350, desc: 'Alcanza el Nivel 10 (Rango máximo).' },
    'racha_misiones_dia': { title: 'Perfeccionista de Calendario', icon: '📅', points: 200, desc: 'Completa todas las misiones de un día en su fecha correspondiente.' },
    'racha_minijuegos_dia': { title: 'Maratón de Arcade', icon: '🕹️', points: 150, desc: 'Juega 10 minijuegos en un solo día.' },
    'racha_fotos_dia': { title: 'Paparazzi de Tokio', icon: '📷', points: 150, desc: 'Sube 3 fotos o sonidos al Álbum en un solo día.' },
    'racha_ejercicio_dia': { title: 'Espíritu Activo', icon: '🏃', points: 150, desc: 'Completa al menos 2 misiones físicas en un mismo día.' },
    'racha_idioma_dia': { title: 'Estudioso Diario', icon: '✍️', points: 150, desc: 'Completa al menos 2 misiones de idioma japonés en un mismo día.' }
};

const REWARDS_CONFIG = {
    "combini_sweet": {
        id: "combini_sweet",
        title: "Dulce del Combini",
        desc: "Elegir un helado o dulce en Lawson/FamilyMart/7-Eleven o máquina.",
        pointsRequired: 250,
        icon: "🍦"
    },
    "refresco_raro": {
        id: "refresco_raro",
        title: "Refresco de Máquina",
        desc: "Elegir una bebida misteriosa de una máquina expendedora japonesa.",
        pointsRequired: 400,
        icon: "🍹"
    },
    "musica_viaje": {
        id: "musica_viaje",
        title: "DJ del Viaje",
        desc: "Tener el control de la música de los auriculares compartidos/coche por 2 horas.",
        pointsRequired: 600,
        icon: "🎵"
    },
    "desayuno_vip": {
        id: "desayuno_vip",
        title: "Desayuno de Reyes",
        desc: "Que el Juez te traiga un desayuno premium o compre tu bollo favorito.",
        pointsRequired: 800,
        icon: "🥞"
    },
    "dinner_choice": {
        id: "dinner_choice",
        title: "Elección de Cena",
        desc: "Elegir el restaurante o plato para la cena de hoy.",
        pointsRequired: 1100,
        icon: "🍣"
    },
    "pase_salto_mision": {
        id: "pase_salto_mision",
        title: "Pase de Escape de Misión",
        desc: "Auto-completar una misión difícil (hasta 15 XP) y recibir los puntos.",
        pointsRequired: 1500,
        icon: "🎫"
    },
    "tarde_libre": {
        id: "tarde_libre",
        title: "Siesta de Oro / Tarde Libre",
        desc: "Descanso en el hotel jugando o leyendo en vez de una caminata opcional.",
        pointsRequired: 2000,
        icon: "🛌"
    },
    "gachapon_extra": {
        id: "gachapon_extra",
        title: "Gachapon Extra",
        desc: "Una tirada extra de gachapon (300-400 yenes) pagada por el Juez.",
        pointsRequired: 2500,
        icon: "🧸"
    },
    "snacks_caja": {
        id: "snacks_caja",
        title: "Cofre de Snacks Japoneses",
        desc: "Una caja variada de snacks dulces y salados de Don Quijote.",
        pointsRequired: 3000,
        icon: "🍿"
    },
    "maquina_garra": {
        id: "maquina_garra",
        title: "Intento de Gancho",
        desc: "3 intentos extra en las máquinas de gancho (UFO Catcher) de un arcade.",
        pointsRequired: 3400,
        icon: "🕹️"
    },
    "souvenir_tienda": {
        id: "souvenir_tienda",
        title: "Capricho de Tienda",
        desc: "Un recuerdo de hasta 500 yenes de cualquier templo, tienda o museo.",
        pointsRequired: 3800,
        icon: "⛩️"
    },
    "supreme_wish": {
        id: "supreme_wish",
        title: "Deseo Supremo",
        desc: "Un deseo especial concedido por el Juez Supremo (dentro de lo razonable).",
        pointsRequired: 4300,
        icon: "👑"
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
    const changes = {};
    changes[`rewards.${rewardId}`] = 'requested';
    saveState(changes);
    showAlert('Reclamado', '¡Se ha enviado tu solicitud al Juez Supremo!');
    renderPassportView(kidId);
};

window.approveReward = (kidId, rewardId) => {
    if (!gameState[kidId].rewards) gameState[kidId].rewards = {};
    gameState[kidId].rewards[rewardId] = 'claimed';
    const changes = {};
    changes[`rewards.${rewardId}`] = 'claimed';
    saveAndSyncJudgeDecision(kidId, changes);
    launchConfetti();
    showAlert('Recompensa Otorgada', `Has concedido la recompensa "${REWARDS_CONFIG[rewardId].title}" a ${gameState[kidId].name}.`);
    renderJudgePanel();
};

window.rejectReward = (kidId, rewardId) => {
    if (!gameState[kidId].rewards) gameState[kidId].rewards = {};
    gameState[kidId].rewards[rewardId] = 'unlocked';
    const changes = {};
    changes[`rewards.${rewardId}`] = 'unlocked';
    saveAndSyncJudgeDecision(kidId, changes);
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
    achievementsTitle.innerText = `Logros (${kidData.badges.length} / ${Object.keys(BADGES_CONFIG).length})`;
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
            
            // Auxiliares calculados dinámicamente para el progreso:
            const approvedMissions = [];
            Object.keys(kidData.missions || {}).forEach(mId => {
                if (kidData.missions[mId] && kidData.missions[mId].status === 'approved') {
                    const conf = MISSIONS_CONFIG[mId];
                    if (conf) approvedMissions.push(conf);
                }
            });
            const countApproved = approvedMissions.length;

            let totalPhotos = 0;
            const albumCategoriesWithAtLeast3 = [];
            if (kidData.album) {
                Object.keys(kidData.album).forEach(catId => {
                    const arr = kidData.album[catId];
                    if (Array.isArray(arr)) {
                        totalPhotos += arr.length;
                        if (arr.length >= 3) {
                            albumCategoriesWithAtLeast3.push(catId);
                        }
                    }
                });
            }

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
            } else if (badgeId === 'primer_paso') {
                currentProg = countApproved;
                maxProg = 1;
            } else if (badgeId === 'explorador_novato') {
                currentProg = countApproved;
                maxProg = 10;
            } else if (badgeId === 'veterano_tokio') {
                currentProg = countApproved;
                maxProg = 25;
            } else if (badgeId === 'leyenda_viaje') {
                currentProg = countApproved;
                maxProg = 50;
            } else if (badgeId === 'cazador_recuerdos') {
                currentProg = totalPhotos;
                maxProg = 5;
            } else if (badgeId === 'coleccionista_supremo') {
                currentProg = albumCategoriesWithAtLeast3.length;
                maxProg = 3;
            } else if (badgeId === 'amigo_animales') {
                currentProg = approvedMissions.filter(m => {
                    const title = m.title.toLowerCase();
                    const loc = (m.location || '').toLowerCase();
                    return title.includes('ciervo') || title.includes('zorro') || title.includes('gato') || 
                           title.includes('mono') || title.includes('animal') || title.includes('kitsune') || 
                           loc.includes('nara') || loc.includes('nikko') || title.includes('fauna');
                }).length;
                maxProg = 3;
            } else if (badgeId === 'maestro_palillos') {
                currentProg = approvedMissions.filter(m => {
                    const title = m.title.toLowerCase();
                    return title.includes('comida') || title.includes('plato') || title.includes('cena') || 
                           title.includes('restaurante') || title.includes('probar') || title.includes('snack') || 
                           title.includes('bento') || title.includes('mochi') || title.includes('sushi') || 
                           title.includes('ramen') || title.includes('dulce') || title.includes('comer') || 
                           title.includes('takoyaki') || title.includes('bebida') || title.includes('gastronom');
                }).length;
                maxProg = 3;
            } else if (badgeId === 'hacker_neon') {
                currentProg = approvedMissions.filter(m => {
                    const loc = (m.location || '').toLowerCase();
                    const title = m.title.toLowerCase();
                    return loc.includes('akihabara') || loc.includes('odaiba') || loc.includes('shinjuku') || 
                           loc.includes('shibuya') || title.includes('neón') || title.includes('neon') || 
                           title.includes('hacker') || title.includes('arcade') || title.includes('retro');
                }).length;
                maxProg = 5;
            } else if (badgeId === 'espiritu_shinto') {
                currentProg = approvedMissions.filter(m => {
                    const title = m.title.toLowerCase();
                    const loc = (m.location || '').toLowerCase();
                    return title.includes('templo') || title.includes('santuario') || title.includes('torii') || 
                           title.includes('monje') || title.includes('jizo') || title.includes('amuleto') || 
                           title.includes('deseo') || title.includes('ema') || title.includes('omikuji') || 
                           title.includes('omamori') || loc.includes('templo') || loc.includes('santuario') || 
                           loc.includes('senso') || loc.includes('fushimi') || loc.includes('meiji') || 
                           loc.includes('kamakura');
                }).length;
                maxProg = 3;
            } else if (badgeId === 'usuario_frecuente_jr') {
                currentProg = approvedMissions.filter(m => {
                    const title = m.title.toLowerCase();
                    const loc = (m.location || '').toLowerCase();
                    return title.includes('tren') || title.includes('estación') || title.includes('estacion') || 
                           title.includes('metro') || title.includes('shinkansen') || title.includes('monorriel') || 
                           title.includes('andén') || title.includes('anden') || title.includes('viaje') ||
                           loc.includes('estación') || loc.includes('estacion') || loc.includes('tren') || 
                           loc.includes('metro') || loc.includes('shinkansen');
                }).length;
                maxProg = 3;
            } else if (badgeId === 'bilingue_expres') {
                currentProg = approvedMissions.filter(m => m.tag === 'writing' || m.tag === 'audio').length;
                maxProg = 3;
            } else if (badgeId === 'ahorrador_inteligente') {
                currentProg = kidData.wallet || 0;
                maxProg = 1000;
            } else if (badgeId === 'comprador_compulsivo') {
                currentProg = counters.upgradesBought || 0;
                maxProg = 1;
            } else if (badgeId === 'rango_madrugador') {
                currentProg = 0;
                maxProg = 1;
            } else if (badgeId === 'lechuza_nocturna') {
                currentProg = 0;
                maxProg = 1;
            } else if (badgeId === 'super_cooperativo') {
                currentProg = approvedMissions.filter(m => m.role === 'both').length;
                maxProg = 10;
            } else if (badgeId === 'nivel_ascendente') {
                currentProg = kidData.level || 0;
                maxProg = 3;
            } else if (badgeId === 'casi_maestro') {
                currentProg = kidData.level || 0;
                maxProg = 6;
            } else if (badgeId === 'avatar_supremo') {
                currentProg = kidData.level || 0;
                maxProg = 9;
            } else if (badgeId === 'racha_misiones_dia') {
                currentProg = 0;
                maxProg = 1;
            } else if (badgeId === 'racha_minijuegos_dia') {
                const dailyActivity = counters.dailyActivity || {};
                let maxMinigames = 0;
                Object.keys(dailyActivity).forEach(dateStr => {
                    maxMinigames = Math.max(maxMinigames, dailyActivity[dateStr].minigamesPlayed || 0);
                });
                currentProg = maxMinigames;
                maxProg = 10;
            } else if (badgeId === 'racha_fotos_dia') {
                const dailyActivity = counters.dailyActivity || {};
                let maxPhotos = 0;
                Object.keys(dailyActivity).forEach(dateStr => {
                    maxPhotos = Math.max(maxPhotos, dailyActivity[dateStr].photosAdded || 0);
                });
                currentProg = maxPhotos;
                maxProg = 3;
            } else if (badgeId === 'racha_ejercicio_dia') {
                const dailyActivity = counters.dailyActivity || {};
                let maxPhysical = 0;
                Object.keys(dailyActivity).forEach(dateStr => {
                    maxPhysical = Math.max(maxPhysical, dailyActivity[dateStr].physicalCompleted || 0);
                });
                currentProg = maxPhysical;
                maxProg = 2;
            } else if (badgeId === 'racha_idioma_dia') {
                const dailyActivity = counters.dailyActivity || {};
                let maxLanguage = 0;
                Object.keys(dailyActivity).forEach(dateStr => {
                    maxLanguage = Math.max(maxLanguage, dailyActivity[dateStr].languageCompleted || 0);
                });
                currentProg = maxLanguage;
                maxProg = 2;
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

window.onload = async () => {
    // Inyectar eventos especiales en el configurador de misiones
    Object.assign(MISSIONS_CONFIG, {
        'ev_conjunto_1': {
            tag: 'special',
            day: 1,
            title: '🌟 EVENTO: El Abrazo de Despegue',
            location: 'Aeropuerto (Salida)',
            xp: 30,
            role: 'both',
            startTime: '14:00',
            endTime: '15:00',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">✨ ¡Momento del Despegue! ✨</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Da un abrazo conjunto a toda la familia, desead a todos un viaje inolvidable, e inmortalizad el momento con una foto familiar.</p>
                    <button id="btn-ev-1" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Abrazo</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-1', 'ev_conjunto_1', role, true);
            }
        },
        'ev_ivan_1': {
            tag: 'special',
            day: 3,
            title: '🌟 EVENTO: La Infiltración en el Castillo',
            location: 'Castillo de Osaka',
            xp: 30,
            role: 'kid14',
            startTime: '10:30',
            endTime: '11:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🕵️‍♂️ ¡Misión de Infiltración! 🕵️‍♂️</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Juega a infiltrarte en el Castillo como un sigiloso ninja o ronin. Hazte una foto escondido detrás de un árbol o roca con el castillo de fondo.</p>
                    <button id="btn-ev-2" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Infiltración</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-2', 'ev_ivan_1', role, false);
            }
        },
        'ev_conjunto_2': {
            tag: 'special',
            day: 6,
            title: '🌟 EVENTO: Los Vigilantes del Shinkansen',
            location: 'Tren Bala (Osaka ➔ Kioto)',
            xp: 30,
            role: 'both',
            startTime: '11:15',
            endTime: '12:15',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🚄 ¡Vigilantes del Tren Bala! 🚄</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Disfrutad del trayecto rápido. A las 11:15 AM, tomaos una foto conjunta sosteniendo vuestros billetes junto a la ventana a toda velocidad.</p>
                    <button id="btn-ev-3" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Billete y Viaje</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-3', 'ev_conjunto_2', role, true);
            }
        },
        'ev_laura_1': {
            tag: 'special',
            day: 7,
            title: '🌟 EVENTO: La Danza del Zorro Kitsune',
            location: 'Santuario Fushimi Inari',
            xp: 30,
            role: 'kid9',
            startTime: '10:30',
            endTime: '11:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🦊 Pose del Kitsune 🦊</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Encuentra una estatua de zorro con un objeto en su hocico en Fushimi Inari e imita su pose mística para una foto divertida.</p>
                    <button id="btn-ev-4" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Pose</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-4', 'ev_laura_1', role, false);
            }
        },
        'ev_conjunto_3': {
            tag: 'special',
            day: 8,
            title: '🌟 EVENTO: El Murmullo del Bosque de Bambú',
            location: 'Arashiyama (Kioto)',
            xp: 30,
            role: 'both',
            startTime: '09:30',
            endTime: '10:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🍃 Conexión Zen en Arashiyama 🍃</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Buscad un rincón tranquilo, cerrad los ojos durante 1 minuto para escuchar el sonido del bambú y grabad un audio conjunto de 10 segundos en susurros.</p>
                    <button id="btn-ev-5" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">🎙️ Registrar Audio (Voz)</button>
                </div>
            `,
            attachEvents: (role) => {
                const btn = document.getElementById('btn-ev-5');
                if (btn) {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'audio/*,video/*';
                    input.className = 'hidden-camera-input';
                    input.style.display = 'none';
                    btn.parentNode.insertBefore(input, btn.nextSibling);
                    input.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        btn.innerText = '⏳ Procesando...';
                        btn.disabled = true;
                        try {
                            const reader = new FileReader();
                            reader.onload = async (re) => {
                                const audioId = 'audio_' + Date.now();
                                await savePhotoToDB(audioId, re.target.result);
                                submitMission('ev_conjunto_3', {type: 'audio', data: audioId}, role, true);
                            };
                            reader.readAsDataURL(file);
                        } catch (err) {
                            showAlert('Error', 'Inténtalo de nuevo.');
                            btn.innerText = '🎙️ Registrar Audio (Voz)';
                            btn.disabled = false;
                        }
                    });
                    btn.addEventListener('click', () => input.click());
                }
            }
        },
        'ev_conjunto_4': {
            tag: 'special',
            day: 11,
            title: '🌟 EVENTO: La Ofrenda de Deseos del Ryokan',
            location: 'Ryokan (Alpes)',
            xp: 30,
            role: 'both',
            startTime: '20:30',
            endTime: '21:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🏮 Ceremonia de los Deseos 🏮</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Vestidos con la Yukata tradicional, escribid en papel vuestros deseos de viaje. Haced una foto del sobre o de vosotros entregándoselo al Juez Supreme tras hacer una reverencia de 30°.</p>
                    <button id="btn-ev-6" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Ofrenda</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-6', 'ev_conjunto_4', role, true);
            }
        },
        'ev_conjunto_5': {
            tag: 'special',
            day: 14,
            title: '🌟 EVENTO: El Saludo al Gigante Sagrado',
            location: 'Kawaguchiko (Fuji)',
            xp: 30,
            role: 'both',
            startTime: '08:30',
            endTime: '09:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🗻 El Triángulo del Fuji 🗻</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Imitad la forma clásica del Monte Fuji con vuestras manos sobre la cabeza en forma de pico, con el Fuji real de fondo, y haced una foto.</p>
                    <button id="btn-ev-7" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Pose Fuji</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-7', 'ev_conjunto_5', role, true);
            }
        },
        'ev_laura_2': {
            tag: 'special',
            day: 17,
            title: '🌟 EVENTO: El Amuleto Protector de Asakusa',
            location: 'Templo Senso-ji (Asakusa)',
            xp: 30,
            role: 'kid9',
            startTime: '11:30',
            endTime: '12:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🙏 Humo Sagrado e Incienso 🙏</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Dirígete al gran incensario (Jokoro), abanícate el humo curativo hacia tu cabeza y tómate una foto sosteniendo un amuleto Omamori del templo.</p>
                    <button id="btn-ev-8" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Amuleto</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-8', 'ev_laura_2', role, false);
            }
        },
        'ev_ivan_2': {
            tag: 'special',
            day: 17,
            title: '🌟 EVENTO: La Captura Tecnológica de Akihabara',
            location: 'Akihabara Town',
            xp: 30,
            role: 'kid14',
            startTime: '17:30',
            endTime: '18:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🔋 ¡Curiosidad de Akiba! 🔋</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Encuentra una máquina expendedora que venda algo que no sea bebida (o un escaparate de videojuegos retro de neón) y hazte una foto con expresión cibernética de asombro.</p>
                    <button id="btn-ev-9" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Captura</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-9', 'ev_ivan_2', role, false);
            }
        },
        'ev_laura_3': {
            tag: 'special',
            day: 18,
            title: '🌟 EVENTO: La Pose Kawaii de Harajuku',
            location: 'Takeshita Street',
            xp: 30,
            role: 'kid9',
            startTime: '15:30',
            endTime: '16:30',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🍭 Estilo Harajuku 🍭</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Con tu crepe gigante o algodón de azúcar colorido en la mano, hazte una foto posando de manera divertida "kawaii" en la calle Takeshita antes del primer bocado.</p>
                    <button id="btn-ev-10" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Crepe Kawaii</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-10', 'ev_laura_3', role, false);
            }
        },
        'ev_ivan_3': {
            tag: 'special',
            day: 22,
            title: '🌟 EVENTO: El Despertar del Mecha Gigante',
            location: 'DiverCity Odaiba',
            xp: 30,
            role: 'kid14',
            startTime: '14:00',
            endTime: '15:00',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🤖 ¡Saludo de Piloto de Mecha! 🤖</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Sitúate frente al Gundam Unicornio Gigante a las 14:00 PM (hora de transformación). Hazte una foto haciendo una pose solemne de piloto o saludo militar.</p>
                    <button id="btn-ev-11" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Saludo Gundam</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-11', 'ev_ivan_3', role, false);
            }
        },
        'ev_conjunto_6': {
            tag: 'special',
            day: 23,
            title: '🌟 EVENTO: La Ceremonia del Sayonara',
            location: 'Aeropuerto (Regreso)',
            xp: 30,
            role: 'both',
            startTime: '18:00',
            endTime: '19:00',
            render: (role) => `
                <div class="special-event-box" style="padding: 15px; background: rgba(255, 152, 0, 0.05); border: 2px dashed #ff9800; border-radius: 12px; text-align: center; color: var(--color-text);">
                    <p style="font-weight: bold; margin-bottom: 8px;">🌸 Sayonara, Nihon! 🌸</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">Haced un recuento en familia. Compartid vuestro recuerdo favorito y agradeced en voz alta algo especial a cada uno. Subid una foto final abrazando a toda la familia.</p>
                    <button id="btn-ev-12" class="btn-primary" style="background:#ff9800; border-color:#ff9800; border-radius: 20px; font-weight: bold; width: 100%;">📸 Registrar Ceremonia Final</button>
                </div>
            `,
            attachEvents: (role) => {
                attachCameraFlow('btn-ev-12', 'ev_conjunto_6', role, true);
            }
        }
    });

    loadState();
    if (window.initIndexedDB) await window.initIndexedDB();
    
    // Inicializar Sincronización Firebase
    if (window.FirebaseSync) {
        window.FirebaseSync.init();
    }
    
    // Leer el rol fijado del dispositivo
    const deviceRole = localStorage.getItem('japanMissionsDeviceRole') || 'all';
    
    if (deviceRole === 'kid9' || deviceRole === 'kid14') {
        currentUser = deviceRole;
        renderDaysList(currentUser);
    } else {
        switchView('view-home', false);
    }
    
    // Comprobación de versión automática al iniciar la app
    setTimeout(() => {
        checkAppUpdates(false);
    }, 1000);
};

// ==========================================
// LÓGICA DE LA TIENDA HACKER DE LAURA
// ==========================================
document.getElementById('btn-open-shop').addEventListener('click', () => {
    if (!currentUser || currentUser === 'judge') return;
    renderShop();
});

function renderShop() {
    const userWallet = gameState[currentUser].wallet || 0;
    
    // Actualizar monedero en la vista de la tienda
    document.getElementById('shop-wallet-amount').innerText = userWallet;
    
    let purchases = {};
    if (gameState[currentUser] && gameState[currentUser].purchases) {
        purchases = gameState[currentUser].purchases;
    } else {
        try {
            purchases = JSON.parse(localStorage.getItem('minigames_shop_purchases') || '{}');
        } catch(e) {}
        if (gameState[currentUser]) {
            gameState[currentUser].purchases = purchases;
        }
    }
    
    // Botón de galletas
    const btnCookie = document.getElementById('btn-buy-cookie');
    if (purchases.cookie) {
        btnCookie.innerText = "✓ Adquirido";
        btnCookie.disabled = true;
        btnCookie.style.background = "#2e7d32";
    } else {
        btnCookie.innerText = "Adquirir Modificación (250 ¥)";
        btnCookie.disabled = false;
        btnCookie.style.background = "#8e24aa";
    }
    
    // Botón de kintsugi
    const btnKintsugi = document.getElementById('btn-buy-kintsugi');
    if (purchases.kintsugi) {
        btnKintsugi.innerText = "✓ Adquirido";
        btnKintsugi.disabled = true;
        btnKintsugi.style.background = "#2e7d32";
    } else {
        btnKintsugi.innerText = "Adquirir Modificación (400 ¥)";
        btnKintsugi.disabled = false;
        btnKintsugi.style.background = "#8e24aa";
    }
    
    // Botón de pescados
    const btnFish = document.getElementById('btn-buy-fish');
    if (purchases.fish) {
        btnFish.innerText = "✓ Adquirido";
        btnFish.disabled = true;
        btnFish.style.background = "#2e7d32";
    } else {
        btnFish.innerText = "Adquirir Modificación (500 ¥)";
        btnFish.disabled = false;
        btnFish.style.background = "#8e24aa";
    }
    
    switchView('view-shop', true, "Tienda Hacker");
}

window.buyUpgrade = (itemKey, cost) => {
    if (!currentUser || (currentUser !== 'kid9' && currentUser !== 'kid14')) {
        alert("Solo Laura e Iván pueden adquirir estas modificaciones tecnológicas.");
        return;
    }
    
    let wallet = gameState[currentUser].wallet || 0;
    if (wallet < cost) {
        alert("No tienes suficientes Yenes para adquirir esta modificación.");
        return;
    }
    
    // Deducir dinero de la cartera
    gameState[currentUser].wallet = wallet - cost;
    
    // Incrementar contador de mejoras compradas
    if (!gameState[currentUser].counters) gameState[currentUser].counters = {};
    gameState[currentUser].counters.upgradesBought = (gameState[currentUser].counters.upgradesBought || 0) + 1;
    
    // Registrar compra en gameState y localStorage
    if (!gameState[currentUser].purchases) gameState[currentUser].purchases = {};
    gameState[currentUser].purchases[itemKey] = true;
    
    localStorage.setItem('minigames_shop_purchases', JSON.stringify(gameState[currentUser].purchases));
    
    // Sincronizar campos específicos
    const changes = {
        wallet: gameState[currentUser].wallet,
        [`counters.upgradesBought`]: gameState[currentUser].counters.upgradesBought,
        [`purchases.${itemKey}`]: true
    };
    saveState(changes);
    
    // Comprobar logros
    const newBadges = checkBadges(currentUser, null);
    if (newBadges && newBadges.length > 0) {
        showNewBadges(newBadges);
        const badgeChanges = {
            badges: gameState[currentUser].badges
        };
        saveState(badgeChanges);
    }
    
    // Reproducir sonido si está disponible
    if (window.playProceduralSound) window.playProceduralSound('success');
    
    // Refrescar tienda
    renderShop();
    
    alert("¡Modificación tecnológica activada con éxito!");
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
                    const changes = {};
                    changes[`album.${categoryId}`] = gameState[currentUser].album[categoryId];
                    saveState(changes);
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
                                    const changes = {};
                                    changes[`album.${categoryId}`] = gameState[currentUser].album[categoryId];
                                    saveState(changes);
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
                    
                    const recordAlbumUploadAndCheck = () => {
                        const todayStr = getJapanCurrentDate().toDateString();
                        if (!gameState[currentUser].counters) gameState[currentUser].counters = {};
                        if (!gameState[currentUser].counters.dailyActivity) gameState[currentUser].counters.dailyActivity = {};
                        if (!gameState[currentUser].counters.dailyActivity[todayStr]) {
                            gameState[currentUser].counters.dailyActivity[todayStr] = { minigamesPlayed: 0, photosAdded: 0, physicalCompleted: 0, languageCompleted: 0 };
                        }
                        gameState[currentUser].counters.dailyActivity[todayStr].photosAdded = (gameState[currentUser].counters.dailyActivity[todayStr].photosAdded || 0) + 1;
                        
                        const changes = {
                            [`album.${categoryId}`]: gameState[currentUser].album[categoryId],
                            counters: gameState[currentUser].counters
                        };
                        saveState(changes);
                        
                        const newBadges = checkBadges(currentUser, null);
                        if (newBadges && newBadges.length > 0) {
                            showNewBadges(newBadges);
                            const badgeChanges = {
                                badges: gameState[currentUser].badges
                            };
                            saveState(badgeChanges);
                        }
                    };
                    
                    try {
                        let resultDataUrl = "";
                        if (file.type.startsWith('audio/')) {
                            const reader = new FileReader();
                            reader.onload = async (re) => {
                                await window.saveMedia(slotId, re.target.result);
                                if (!savedIndexes.includes(i)) savedIndexes.push(i);
                                recordAlbumUploadAndCheck();
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
                            recordAlbumUploadAndCheck();
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
    const updateBtn = document.getElementById('btn-update-now');
    if (updateBtn) {
        updateBtn.disabled = true;
        updateBtn.innerText = 'Actualizando...';
    }
    try {
        // 1. Desregistrar TODOS los Service Workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const reg of registrations) {
                await reg.unregister();
                console.log('Service Worker desregistrado.');
            }
        }
        // 2. Borrar TODAS las cachés
        if ('caches' in window) {
            const keys = await caches.keys();
            for (const key of keys) {
                await caches.delete(key);
                console.log('Caché borrada:', key);
            }
        }
        // 3. Recargar forzando descarga desde servidor
        console.log('Recargando desde servidor...');
        window.location.href = window.location.pathname + '?t=' + Date.now();
    } catch (err) {
        console.error('Error durante actualización:', err);
        // Fallback: recargar de todos modos
        window.location.href = window.location.pathname + '?t=' + Date.now();
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
