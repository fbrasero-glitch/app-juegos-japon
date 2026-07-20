// ==========================================
// SERVICIO DE SINCRONIZACIÓN EN LA NUBE (FIREBASE)
// ==========================================

const FirebaseSync = {
    db: null,
    active: false,
    config: null,
    listeners: [],

    init: function() {
        console.log("[FirebaseSync] Iniciando servicio...");
        if (typeof firebase === 'undefined') {
            console.warn("[FirebaseSync] SDK de Firebase no detectado. Modo puramente local.");
            this.updateStatusLabel("No disponible (SDK faltante) 🔴");
            return;
        }

        const DEFAULT_CONFIG = {
            apiKey: "AIzaSyC9u6sFahn0FTK72sbzdVvRiXMZuAC8FgY",
            authDomain: "juegos-japon-1d7cc.firebaseapp.com",
            projectId: "juegos-japon-1d7cc",
            storageBucket: "juegos-japon-1d7cc.firebasestorage.app",
            messagingSenderId: "259128401921",
            appId: "1:259128401921:web:6c9baa293bd730e24be000"
        };

        let config = null;
        const savedConfig = localStorage.getItem('japanMissionsFirebaseConfig');
        if (savedConfig) {
            try {
                config = JSON.parse(savedConfig);
            } catch(e) {
                console.error("[FirebaseSync] Error parseando config guardada:", e);
            }
        }
        
        if (!config) {
            config = DEFAULT_CONFIG;
            console.log("[FirebaseSync] Usando configuración por defecto.");
        }

        try {
            if (firebase.apps.length === 0) {
                firebase.initializeApp(config);
            }
            
            this.db = firebase.firestore();
            
            // Habilitar persistencia local (offline-first)
            this.db.enablePersistence({ synchronizeTabs: true })
                .then(() => {
                    console.log("[FirebaseSync] Persistencia offline activada en Firestore.");
                })
                .catch(err => {
                    if (err.code === 'failed-precondition') {
                        console.warn("[FirebaseSync] Múltiples pestañas abiertas. Persistencia activa solo en la principal.");
                    } else if (err.code === 'unimplemented') {
                        console.warn("[FirebaseSync] El navegador no soporta persistencia offline.");
                    }
                });

            this.active = true;
            this.config = config;
            this.updateStatusLabel("Conectado 🟢");
            console.log("[FirebaseSync] Inicializado con éxito y conectado a Firestore.");
            
            // Iniciar escucha en tiempo real
            this.setupListeners();

            // SOLO subir estado local si el dispositivo es de un niño específico.
            // El Juez / modo 'all' NUNCA sube automáticamente para no machacar datos de los niños.
            const deviceRole = localStorage.getItem('japanMissionsDeviceRole') || 'all';
            if (deviceRole === 'kid9' || deviceRole === 'kid14') {
                setTimeout(() => {
                    this.uploadLocalStateToCloud();
                }, 1500);
            } else {
                // Para Juez / all: descargar forzosamente desde la nube en vez de subir
                console.log("[FirebaseSync] Dispositivo en modo Juez/all: descargando datos desde la nube (sin subir).");
                setTimeout(() => {
                    this.forceDownloadFromCloud();
                }, 500);
            }
        } catch (e) {
            console.error("[FirebaseSync] Error al parsear o inicializar Firebase:", e);
            this.updateStatusLabel("Error de conexión ⚠️");
        }
    },

    setupListeners: function() {
        // Limpiar escuchadores anteriores
        this.listeners.forEach(unsub => unsub());
        this.listeners = [];

        if (!this.db) return;

        ['kid9', 'kid14'].forEach(kidId => {
            console.log(`[FirebaseSync] Iniciando escucha de cambios en tiempo real para: ${kidId}`);
            const unsub = this.db.collection('profiles').doc(kidId).onSnapshot(doc => {
                if (doc.metadata.hasPendingWrites) {
                    // Ignorar cambios locales pendientes de confirmación en servidor
                    return;
                }
                if (doc.exists) {
                    const data = doc.data();
                    console.log(`[FirebaseSync] onSnapshot recibido para ${kidId}. Fuente: ${doc.metadata.fromCache ? 'CACHE' : 'SERVIDOR'}`);
                    this.handleRemoteUpdate(kidId, data);
                } else {
                    console.log(`[FirebaseSync] El documento ${kidId} no existe en la nube aún.`);
                }
            }, err => {
                console.error(`[FirebaseSync] Error escuchando perfil ${kidId}:`, err);
            });
            this.listeners.push(unsub);
        });
    },

    handleRemoteUpdate: function(kidId, remoteData) {
        if (!window.gameState) return;
        const localKid = window.gameState[kidId];
        if (!localKid) return;

        const remoteTime = remoteData.lastUpdated || 0;
        const localTime = localKid.lastUpdated || 0;

        const isActiveUser = (window.currentUser === kidId);
        const isJudge = (window.currentUser === 'judge');
        // SIEMPRE aplicar datos remotos. No hay razón para rechazarlos.
        const shouldApply = true;

        if (shouldApply) {
            console.log(`[FirebaseSync] Aplicando datos remotos para ${kidId} (remoto: ${remoteTime}, local: ${localTime}, user: ${window.currentUser})`);

            const isKid = (kidId === 'kid9' || kidId === 'kid14');

            let newlyApprovedMissions = [];
            let newlyRejectedMissions = [];

            if (isActiveUser && isKid) {
                // 1. Detectar transiciones de estado de misiones
                Object.keys(remoteData.missions || {}).forEach(missionId => {
                    const remoteM = remoteData.missions[missionId];
                    const localM = localKid.missions[missionId] || { status: 'unlocked' };

                    if (remoteM.status === 'approved' && localM.status !== 'approved') {
                        newlyApprovedMissions.push(missionId);
                    } else if (remoteM.status === 'unlocked' && remoteM.feedback && localM.status === 'pending') {
                        newlyRejectedMissions.push({ id: missionId, feedback: remoteM.feedback });
                    }
                });

                // 2. Detectar logros Xbox desbloqueados de forma remota
                const newlyUnlockedBadges = [];
                if (remoteData.badges) {
                    remoteData.badges.forEach(bId => {
                        if (!localKid.badges || !localKid.badges.includes(bId)) {
                            newlyUnlockedBadges.push(bId);
                        }
                    });
                }

                // 3. Detectar subidas de nivel
                const oldLevel = localKid.level || 0;
                const newLevel = remoteData.level || 0;

                // 4. Copiar y guardar estado localmente (SIN subir a Firebase para evitar bucles)
                window.gameState[kidId] = remoteData;
                localStorage.setItem('japanMissionsState', JSON.stringify(window.gameState));

                // Lanzar alertas y animaciones en diferido para evitar superposición
                // A. Subida de nivel
                if (newLevel > oldLevel) {
                    const levelsArr = kidId === 'kid9' ? window.LEVELS_LAURA : window.LEVELS_IVAN;
                    if (window.showLevelUpAnimation && levelsArr[newLevel]) {
                        window.showLevelUpAnimation(kidId, levelsArr[newLevel]);
                    }
                }
                // B. Logros Xbox
                if (newlyUnlockedBadges.length > 0 && window.showNewBadges) {
                    window.showNewBadges(newlyUnlockedBadges);
                }
                // C. Misiones aprobadas
                if (newlyApprovedMissions.length > 0) {
                    if (window.launchConfetti) window.launchConfetti();
                    if (window.playProceduralSound) window.playProceduralSound('success');
                    
                    const firstMId = newlyApprovedMissions[0];
                    const conf = window.MISSIONS_CONFIG[firstMId];
                    const mTitle = conf ? conf.title : firstMId;
                    window.showAlert('¡Misión Aprobada! 🎉', `El Juez Supremo ha aprobado tu misión: "${mTitle}"`);
                }
                // D. Misiones devueltas (rechazadas)
                if (newlyRejectedMissions.length > 0) {
                    const firstReject = newlyRejectedMissions[0];
                    const conf = window.MISSIONS_CONFIG[firstReject.id];
                    const mTitle = conf ? conf.title : firstReject.id;
                    window.showAlert('Misión Devuelta ⚠️', `El Juez ha devuelto la misión "${mTitle}" para corregir.\n\nMotivo: ${firstReject.feedback}`);
                }
            } else {
                // Si es el perfil del hermano o es el Juez, simplemente aplicamos el estado remoto completo
                // NO subir de vuelta a Firebase para evitar bucle de escritura
                window.gameState[kidId] = remoteData;
                localStorage.setItem('japanMissionsState', JSON.stringify(window.gameState));
            }

            // Refrescar la vista actual de la UI de forma reactiva
            if (typeof window.refreshCurrentView === 'function') {
                window.refreshCurrentView();
            }
        }
    },

    syncProfile: function(kidId, profileData) {
        if (!this.active || !this.db) return;
        console.log(`[FirebaseSync] Subiendo perfil ${kidId} a la nube...`);
        this.db.collection('profiles').doc(kidId).set(profileData)
            .then(() => console.log(`[FirebaseSync] Perfil ${kidId} sincronizado en la nube.`))
            .catch(err => console.error(`[FirebaseSync] Error al subir perfil ${kidId}:`, err));
    },

    syncPhoto: function(photoId, dataUrl) {
        if (!this.active || !this.db) return Promise.resolve();
        console.log(`[FirebaseSync] Subiendo archivo multimedia ${photoId} a Firestore...`);
        
        // Guardamos en un documento con id y el data url en Base64
        return this.db.collection('photos').doc(photoId).set({
            id: photoId,
            data: dataUrl,
            timestamp: Date.now()
        })
        .then(() => console.log(`[FirebaseSync] Archivo multimedia ${photoId} subido.`))
        .catch(err => console.error(`[FirebaseSync] Error al subir multimedia ${photoId}:`, err));
    },

    fetchPhoto: function(photoId) {
        if (!this.active || !this.db) return Promise.resolve(null);
        console.log(`[FirebaseSync] Descargando archivo multimedia ${photoId} desde Firestore...`);
        return this.db.collection('photos').doc(photoId).get()
            .then(doc => {
                if (doc.exists) {
                    console.log(`[FirebaseSync] Archivo multimedia ${photoId} descargado correctamente.`);
                    return doc.data().data;
                } else {
                    console.warn(`[FirebaseSync] No se encontró el multimedia ${photoId} en la nube.`);
                    return null;
                }
            })
            .catch(err => {
                console.error(`[FirebaseSync] Error al descargar multimedia ${photoId}:`, err);
                return null;
            });
    },

    isConnected: function() {
        return this.active && !!this.db;
    },

    saveFirebaseConfig: function(configText) {
        try {
            const config = JSON.parse(configText);
            localStorage.setItem('japanMissionsFirebaseConfig', JSON.stringify(config));
            alert("¡Configuración de Firebase guardada correctamente! La app se recargará para conectar.");
            location.reload();
        } catch (e) {
            alert("Error: El texto introducido no es un JSON válido. Asegúrate de copiar el objeto de configuración tal cual lo provee Firebase.");
        }
    },

    disconnect: function() {
        if (confirm("¿Estás seguro de que quieres desconectar la sincronización en la nube? El dispositivo volverá a modo puramente local.")) {
            localStorage.removeItem('japanMissionsFirebaseConfig');
            location.reload();
        }
    },

    updateStatusLabel: function(text) {
        setTimeout(() => {
            const el = document.getElementById('firebase-status-label');
            if (el) el.innerHTML = `Estado: ${text}`;
        }, 100);
    },

    // Solo para dispositivos de niños: sube su perfil específico a la nube
    uploadLocalStateToCloud: function() {
        if (!this.active || !this.db || !window.gameState) return;
        
        const deviceRole = localStorage.getItem('japanMissionsDeviceRole') || 'all';
        
        // SOLO subir si el dispositivo está asignado a un niño específico
        if (deviceRole === 'kid9' || deviceRole === 'kid14') {
            if (window.gameState[deviceRole]) {
                console.log(`[FirebaseSync] Subiendo estado local del perfil ${deviceRole} a la nube...`);
                if (!window.gameState[deviceRole].lastUpdated) {
                    window.gameState[deviceRole].lastUpdated = Date.now();
                }
                this.syncProfile(deviceRole, window.gameState[deviceRole]);
            }
        } else {
            // Juez / all: NO subir automáticamente. Solo descargar.
            console.log("[FirebaseSync] Dispositivo Juez/all: omitiendo subida automática.");
        }
    },

    // Descarga forzada desde Firestore (para el Juez / dispositivos en modo all)
    forceDownloadFromCloud: function() {
        if (!this.active || !this.db) return Promise.resolve();

        console.log("[FirebaseSync] Descarga forzada desde la nube...");
        
        const promises = ['kid9', 'kid14'].map(kidId => {
            return this.db.collection('profiles').doc(kidId).get({ source: 'server' })
                .then(doc => {
                    if (doc.exists) {
                        const remoteData = doc.data();
                        console.log(`[FirebaseSync] Descarga forzada: ${kidId} obtenido del SERVIDOR. lastUpdated: ${remoteData.lastUpdated}`);
                        if (window.gameState) {
                            window.gameState[kidId] = remoteData;
                        }
                    } else {
                        console.log(`[FirebaseSync] Descarga forzada: ${kidId} no existe en servidor.`);
                    }
                })
                .catch(err => {
                    console.warn(`[FirebaseSync] Descarga forzada fallida para ${kidId} (puede estar offline):`, err);
                    // Fallback: intentar desde cache
                    return this.db.collection('profiles').doc(kidId).get()
                        .then(doc => {
                            if (doc.exists) {
                                const remoteData = doc.data();
                                console.log(`[FirebaseSync] Descarga fallback (cache) para ${kidId}.`);
                                if (window.gameState) {
                                    window.gameState[kidId] = remoteData;
                                }
                            }
                        })
                        .catch(() => {});
                });
        });

        return Promise.all(promises).then(() => {
            if (window.gameState) {
                localStorage.setItem('japanMissionsState', JSON.stringify(window.gameState));
                console.log("[FirebaseSync] Estado local actualizado con datos de la nube.");
            }
        });
    }
};

window.FirebaseSync = FirebaseSync;
