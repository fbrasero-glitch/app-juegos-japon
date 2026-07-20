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

function triggerDeviceDownload(id, dataUrl) {
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
        try {
            const parts = dataUrl.split(',');
            const mime = parts[0].match(/:(.*?);/)[1];
            const bstr = atob(parts[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            const url = URL.createObjectURL(blob);
            
            const role = window.currentUser || 'explorador';
            const userName = (window.gameState && window.gameState[role]) ? window.gameState[role].name : 'Japon';
            
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
            const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
            
            const filename = `${userName}_${id}_${dateStr}_${timeStr}.jpg`;
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => URL.revokeObjectURL(url), 300);
            console.log(`Foto autodescargada en dispositivo: ${filename}`);
        } catch (e) {
            console.error("Error disparando autodescarga de foto:", e);
        }
    }
}

window.savePhotoToDB = async function(id, dataUrl) {
    return saveMedia(id, dataUrl);
};

window.saveMedia = async function(id, dataUrl) {
    try {
        const db = await initDB();
        
        // Intentar guardar en galería (carpeta Descargas de Android) de forma automática
        triggerDeviceDownload(id, dataUrl);
        
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
