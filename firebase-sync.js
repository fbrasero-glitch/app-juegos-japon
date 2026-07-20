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
                    this.handleRemoteUpdate(kidId, data);
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
        const shouldApply = isJudge || !isActiveUser || (remoteTime > localTime);

        if (shouldApply) {
            console.log(`[FirebaseSync] Novedades remotas aplicadas para ${kidId} (remoto: ${remoteTime}, local: ${localTime})`);

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

                // 4. Copiar y guardar estado localmente
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
    }
};

window.FirebaseSync = FirebaseSync;
