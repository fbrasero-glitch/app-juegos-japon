const DB_NAME = 'JapanTravelDB';
const DB_VERSION = 1;
const STORE_NAME = 'mediaStore';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

window.initIndexedDB = initDB;

const downloadedMediaIds = new Set();

function triggerDeviceDownload(id, mediaSource, originalFile) {
    const sourceToDownload = originalFile || mediaSource;
    if (!sourceToDownload) return;

    if (id && downloadedMediaIds.has(id)) {
        console.log(`Media ${id} ya descargado previamente al dispositivo.`);
        return;
    }
    if (id) {
        downloadedMediaIds.add(id);
        if (downloadedMediaIds.size > 300) {
            const firstKey = downloadedMediaIds.values().next().value;
            downloadedMediaIds.delete(firstKey);
        }
    }

    try {
        let url = null;
        let isBlobUrl = false;
        let ext = 'jpg';

        if (sourceToDownload instanceof File || sourceToDownload instanceof Blob) {
            url = URL.createObjectURL(sourceToDownload);
            isBlobUrl = true;
            if (sourceToDownload.name && sourceToDownload.name.includes('.')) {
                ext = sourceToDownload.name.split('.').pop();
            } else if (sourceToDownload.type && sourceToDownload.type.includes('png')) {
                ext = 'png';
            } else if (sourceToDownload.type && sourceToDownload.type.includes('video')) {
                ext = 'mp4';
            }
        } else if (typeof sourceToDownload === 'string') {
            if (sourceToDownload.startsWith('data:image/')) {
                const parts = sourceToDownload.split(',');
                const mimeMatch = parts[0].match(/:(.*?);/);
                const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
                ext = mime.includes('png') ? 'png' : 'jpg';
                const bstr = atob(parts[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                url = URL.createObjectURL(blob);
                isBlobUrl = true;
            } else if (sourceToDownload.startsWith('data:video/')) {
                ext = 'mp4';
                const parts = sourceToDownload.split(',');
                const bstr = atob(parts[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: 'video/mp4' });
                url = URL.createObjectURL(blob);
                isBlobUrl = true;
            } else if (sourceToDownload.startsWith('blob:')) {
                url = sourceToDownload;
            }
        }

        if (!url) return;

        const role = window.currentUser || 'explorador';
        const userName = (window.gameState && window.gameState[role]) ? window.gameState[role].name : 'Japon';

        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

        const cleanId = (id || 'foto').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${userName}_${cleanId}_${dateStr}_${timeStr}.${ext}`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (isBlobUrl) {
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        console.log(`Foto/Vídeo autodescargado en dispositivo a MÁXIMA CALIDAD ORIGINAL: ${filename}`);
    } catch (e) {
        console.error("Error disparando autodescarga de foto en máxima calidad:", e);
    }
}

window.triggerDeviceDownload = triggerDeviceDownload;

window.savePhotoToDB = async function(id, dataUrl, originalFile) {
    return saveMedia(id, dataUrl, originalFile);
};

window.saveMedia = async function(id, dataUrl, originalFile) {
    try {
        const db = await initDB();
        
        // Guardar foto en almacenamiento/descargas del teléfono en MÁXIMA CALIDAD ORIGINAL
        triggerDeviceDownload(id, dataUrl, originalFile);
        
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put({ id: id, data: dataUrl });
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("Error saving media:", e);
    }
};

window.getMedia = async function(id) {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result ? req.result.data : null);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("Error getting media:", e);
        return null;
    }
};

window.deleteMedia = async function(id) {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("Error deleting media:", e);
    }
};
