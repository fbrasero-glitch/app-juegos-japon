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

            const deviceRole = localStorage.getItem('japanMissionsDeviceRole') || 'all';
            if (deviceRole === 'judge' || deviceRole === 'all') {
                // Para Juez / all: descargar forzosamente desde la nube en el arranque
                console.log("[FirebaseSync] Dispositivo en modo Juez/all: descargando datos desde la nube.");
                setTimeout(() => {
                    this.forceDownloadFromCloud();
                }, 500);
            } else {
                console.log("[FirebaseSync] Dispositivo de niño registrado. Conexión en tiempo real activa.");
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

    mergeProfileData: function(local, remote) {
        if (!local) return remote;
        if (!remote) return local;

        const merged = { ...remote }; // Usamos remote como base

        // 1. Nombre (string)
        merged.name = remote.name || local.name;

        // 2. XP y Nivel (siempre tomamos el máximo)
        merged.xp = Math.max(remote.xp || 0, local.xp || 0);
        merged.level = Math.max(remote.level || 0, local.level || 0);

        // 3. Wallet y compras (Purchases)
        merged.purchases = { ...(remote.purchases || {}), ...(local.purchases || {}) };
        
        let localOnlyPurchasesCost = 0;
        const UPGRADE_COSTS = {
            cookie: 50,
            kintsugi: 150,
            fish: 100,
            omikuji: 75,
            origami: 50,
            bamboo: 120,
            temple_pass: 200,
            badge_booster: 150,
            ramen_ticket: 250,
            shinkansen_upgrade: 500
        };
        Object.keys(local.purchases || {}).forEach(item => {
            if (local.purchases[item] && (!remote.purchases || !remote.purchases[item])) {
                localOnlyPurchasesCost += UPGRADE_COSTS[item] || 0;
            }
        });
        
        merged.wallet = Math.max(0, (remote.wallet || 0) - localOnlyPurchasesCost);
        if (local.wallet > merged.wallet && localOnlyPurchasesCost === 0) {
            merged.wallet = local.wallet;
        }

        // 4. Insignias (unión)
        const badgeSet = new Set([...(remote.badges || []), ...(local.badges || [])]);
        merged.badges = Array.from(badgeSet);

        // 5. Contadores
        merged.counters = { ...(remote.counters || {}), ...(local.counters || {}) };

        // 6. Álbum (hacemos unión de fotos por categoría)
        merged.album = {};
        const catIds = new Set([...Object.keys(remote.album || {}), ...Object.keys(local.album || {})]);
        catIds.forEach(catId => {
            const remotePhotos = remote.album[catId] || [];
            const localPhotos = local.album[catId] || [];
            const photoMap = {};
            remotePhotos.forEach(p => photoMap[p] = true);
            localPhotos.forEach(p => photoMap[p] = true);
            merged.album[catId] = Object.keys(photoMap).map(k => isNaN(k) ? k : parseInt(k, 10));
        });

        // 7. Recompensas (Rewards)
        merged.rewards = { ...(remote.rewards || {}), ...(local.rewards || {}) };

        // 8. Misiones (fusión fina por statusUpdatedAt)
        merged.missions = { ...(remote.missions || {}) };
        Object.keys(local.missions || {}).forEach(mId => {
            const remoteM = remote.missions[mId];
            const localM = local.missions[mId];
            if (!remoteM) {
                merged.missions[mId] = localM;
            } else {
                merged.missions[mId] = this.mergeMission(localM, remoteM);
            }
        });

        merged.lastUpdated = Math.max(remote.lastUpdated || 0, local.lastUpdated || 0);
        return merged;
    },

    mergeMission: function(localM, remoteM) {
        const localTime = localM.statusUpdatedAt || 0;
        const remoteTime = remoteM.statusUpdatedAt || 0;
        
        if (localTime > remoteTime) {
            return localM;
        } else if (remoteTime > localTime) {
            return remoteM;
        } else {
            // Tiempos iguales: resolver empates priorizando estados más avanzados
            const statusPriority = { unlocked: 0, pending: 1, approved: 2 };
            const localPri = statusPriority[localM.status] || 0;
            const remotePri = statusPriority[remoteM.status] || 0;
            
            if (localPri > remotePri) {
                return localM;
            } else if (remotePri > localPri) {
                return remoteM;
            } else {
                // Si tienen el mismo estado, mezclar sus campos
                return {
                    ...remoteM,
                    submission: remoteM.submission || localM.submission,
                    feedback: remoteM.feedback || localM.feedback
                };
            }
        }
    },

    handleRemoteUpdate: function(kidId, remoteData) {
        if (!window.gameState) return;
        const localKid = window.gameState[kidId];
        if (!localKid) return;

        const remoteTime = remoteData.lastUpdated || 0;
        const localTime = localKid.lastUpdated || 0;

        // Mezclar local y remoto de forma inteligente
        const mergedData = this.mergeProfileData(localKid, remoteData);

        const isActiveUser = (window.currentUser === kidId);
        const isKid = (kidId === 'kid9' || kidId === 'kid14');
        const shouldApply = true;

        if (shouldApply) {
            console.log(`[FirebaseSync] Mezclando datos remotos para ${kidId} (remoto: ${remoteTime}, local: ${localTime}, user: ${window.currentUser})`);

            let newlyApprovedMissions = [];
            let newlyRejectedMissions = [];

            if (isActiveUser && isKid) {
                // 1. Detectar transiciones de estado de misiones
                Object.keys(mergedData.missions || {}).forEach(missionId => {
                    const mergedM = mergedData.missions[missionId];
                    const localM = localKid.missions[missionId] || { status: 'unlocked' };

                    if (mergedM.status === 'approved' && localM.status !== 'approved') {
                        newlyApprovedMissions.push(missionId);
                    } else if (mergedM.status === 'unlocked' && mergedM.feedback && localM.status === 'pending') {
                        newlyRejectedMissions.push({ id: missionId, feedback: mergedM.feedback });
                    }
                });

                // 2. Detectar logros Xbox desbloqueados de forma remota
                const newlyUnlockedBadges = [];
                if (mergedData.badges) {
                    mergedData.badges.forEach(bId => {
                        if (!localKid.badges || !localKid.badges.includes(bId)) {
                            newlyUnlockedBadges.push(bId);
                        }
                    });
                }

                // 3. Detectar subidas de nivel
                const oldLevel = localKid.level || 0;
                const newLevel = mergedData.level || 0;

                // 4. Copiar y guardar estado localmente
                window.gameState[kidId] = mergedData;
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
                window.gameState[kidId] = mergedData;
                localStorage.setItem('japanMissionsState', JSON.stringify(window.gameState));
            }

            // Subir cambios locales si los hay (merged es más nuevo que el servidor)
            // SOLO si somos el dispositivo de un niño (el Juez no sube automáticamente)
            const deviceRole = localStorage.getItem('japanMissionsDeviceRole') || 'all';
            if ((deviceRole === 'kid9' || deviceRole === 'kid14') && mergedData.lastUpdated > remoteTime) {
                console.log(`[FirebaseSync] Subiendo cambios locales autodetectados para ${kidId}...`);
                this.syncProfile(kidId, mergedData);
            }

            // Refrescar la vista actual de la UI de forma reactiva
            if (typeof window.refreshCurrentView === 'function') {
                window.refreshCurrentView();
            }
        }
    },

    syncProfile: async function(kidId, profileData) {
        if (!this.active || !this.db) return;
        console.log(`[FirebaseSync] Subiendo perfil ${kidId} a la nube con fusión...`);
        try {
            const docRef = this.db.collection('profiles').doc(kidId);
            const doc = await docRef.get({ source: 'server' }).catch(() => docRef.get());
            let remoteData = doc.exists ? doc.data() : null;
            
            let mergedData = profileData;
            if (remoteData) {
                mergedData = this.mergeProfileData(profileData, remoteData);
            }
            
            // Forzar actualización del timestamp
            mergedData.lastUpdated = Date.now();
            
            await docRef.set(mergedData);
            console.log(`[FirebaseSync] Perfil ${kidId} sincronizado con éxito (set).`);
            
            // Actualizar localmente por si la fusión trajo cambios remotos nuevos
            if (window.gameState) {
                window.gameState[kidId] = mergedData;
                localStorage.setItem('japanMissionsState', JSON.stringify(window.gameState));
            }
        } catch (err) {
            console.error(`[FirebaseSync] Error al subir perfil ${kidId}:`, err);
        }
    },

    syncProfileFields: function(kidId, changes) {
        if (!this.active || !this.db) return;
        console.log(`[FirebaseSync] Sincronizando campos para ${kidId}:`, Object.keys(changes));
        
        // Agregar timestamp de actualización
        changes.lastUpdated = Date.now();

        this.db.collection('profiles').doc(kidId).update(changes)
            .then(() => console.log(`[FirebaseSync] Campos del perfil ${kidId} actualizados en la nube.`))
            .catch(err => {
                console.error(`[FirebaseSync] Error al actualizar campos para ${kidId}:`, err);
                if (err.code === 'not-found') {
                    // Si el documento no existe en Firestore, lo creamos con set({ merge: true })
                    console.log(`[FirebaseSync] Perfil ${kidId} no encontrado. Creándolo con set...`);
                    this.db.collection('profiles').doc(kidId).set(changes, { merge: true });
                }
            });
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
                            window.gameState[kidId] = this.mergeProfileData(window.gameState[kidId], remoteData);
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
                                    window.gameState[kidId] = this.mergeProfileData(window.gameState[kidId], remoteData);
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
