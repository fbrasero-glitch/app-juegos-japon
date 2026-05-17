# 🔧 GUÍA DE AUDITORÍA DE MISIONES — Japan Mission Passport PWA

## ⚠️ INSTRUCCIONES PARA EL AGENTE
**Lee este archivo COMPLETO antes de hacer nada.** Contiene el contexto, la metodología y el estado exacto del trabajo de auditoría de calidad de las misiones. Si el usuario te pide "continuar la auditoría" o "seguir con el siguiente bloque", sigue las instrucciones de este archivo.

---

## 📋 CONTEXTO DEL PROYECTO

- **App**: PWA offline-first en Vanilla JS (NO React, NO Firebase)
- **Archivos clave**:
  - `missions.js` — Contiene TODAS las misiones en un objeto `MISSIONS_CONFIG`
  - `app.js` — Lógica de estado, navegación, panel del juez, XP/niveles
  - `dbHelper.js` — IndexedDB para media (fotos, vídeos, audio)
  - `index.html` — Estructura HTML
  - `styles.css` — Estilos
  - `sw.js` — Service Worker
- **Perfiles**: `kid9` (Laura, 9 años, "Kitsune") y `kid14` (Iván, 14 años, "Ronin/Hacker")
- **Total misiones objetivo**: 24 días × 9 misiones = 216 misiones limpias
- **Estado actual**: 274 misiones (los días 8-21 tienen exceso de duplicados)

---

## 🎯 TAREA DE AUDITORÍA

La auditoría tiene **2 fases** por cada bloque de días:

### FASE 1: Purga de duplicados
Cada día debe tener **exactamente 9 misiones**. Los días 8-21 tienen entre 10-18 misiones porque hay versiones viejas (con `tag: undefined` o keys con formato `day_XX_kidYY_nombre`) mezcladas con las versiones definitivas.

**Cómo purgar**:
1. Identificar las 9 misiones correctas según `BLOQUE COMPLETO DE MISIONES 10-24.md`
2. Las misiones con `tag: undefined` o keys tipo `day_XX_kid9_xxx` / `day_XX_kid14_xxx` son las VIEJAS → eliminar
3. Las misiones con keys tipo `day_XX_nombre` (sin kid9/kid14 en la key) son las NUEVAS → conservar
4. Usar un script Node.js que splice las líneas del archivo (NO usar string replace porque los \r\n causan problemas)

### FASE 2: Auditoría de calidad UX/narrativa
Para cada misión del bloque, evaluar 3 criterios:

| Criterio | kid9 (Laura) | kid14 (Iván) |
|----------|-------------|-------------|
| **Narrativa** | Misterio, magia, aventura, emojis grandes | Táctico, hacker, terminal verde, `>>>` |
| **UX/Visual** | Gradientes coloridos, emojis 3rem+, fondos vivos | Terminal oscuro, border `#0f03`, inputs `background:#111 color:#0f0` |
| **Claridad** | Un niño de 9 años debe saber qué hacer al ver la pantalla | Un chaval de 14 debe sentir que "hackea" algo |

**Veredictos posibles**:
- ✅ **OK** — Dejar como está
- ⚠️ **MEJORABLE** — Reescribir render (narrativa + visual)
- 🔴 **REESCRIBIR** — Reescribir render + attachEvents (prototipo puro)

---

## 🔨 METODOLOGÍA TÉCNICA (cómo hacer los cambios)

### Paso 1: Localizar líneas
```bash
node -e "const fs=require('fs'); const lines=fs.readFileSync('missions.js','utf8').split('\n'); lines.forEach((l,i)=>{if(l.includes('day_XX')) console.log((i+1)+': '+l.trim().substring(0,80));});"
```

### Paso 2: Crear script de reemplazo
Crear un archivo `upgrade_dayXX.js` con este patrón:
```javascript
const fs = require('fs');
let lines = fs.readFileSync('missions.js', 'utf8').split('\n');

function replaceMission(key, newCode) {
    const start = lines.findIndex(l => l.includes(`"${key}"`));
    if (start === -1) { console.log('NOT FOUND: ' + key); return; }
    let end = start, depth = 0;
    for (let i = start; i < lines.length; i++) {
        depth += (lines[i].match(/{/g)||[]).length - (lines[i].match(/}/g)||[]).length;
        if (depth <= 0 && i > start) { end = i; break; }
    }
    lines.splice(start, end - start + 1, ...newCode.split('\n'));
    console.log(`Replaced ${key} (was lines ${start+1}-${end+1})`);
}

// Para cada misión:
replaceMission('day_XX_nombre', `    "day_XX_nombre": {
    tag: "...",
    day: XX,
    title: "...",
    role: "kid9|kid14|both",
    xp: NN,
    location: "...",
    render: () => \`
        <!-- HTML inmersivo aquí -->
    \`,
    attachEvents: (role) => {
        // Lógica interactiva aquí
    }
},`);

fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
```

### Paso 3: Ejecutar y verificar
```bash
node upgrade_dayXX.js
node -c missions.js          # Verificar sintaxis
node -e "...count missions"  # Verificar 9 por día
```

### ⚠️ ERRORES COMUNES A EVITAR
1. **NO usar `replace_file_content` de la herramienta** — Los `\r\n` del archivo causan que el target no se encuentre
2. **NO usar `&&` en PowerShell** — Usar `;` en su lugar
3. **Siempre usar el patrón `replaceMission()` con splice** — Es el único que funciona fiable
4. **Template literals**: Escapar `\${variable}` dentro de template literals anidados
5. **Tras cada cambio**: verificar `node -c missions.js` (sintaxis) y contar misiones

---

## 📊 ESTADO DE LA AUDITORÍA POR BLOQUES

### ✅ Bloque 1: Días 1-7 (COMPLETADO)
- 9 misiones por día ✅
- Calidad UX verificada ✅
- `day_1_clouds` mejorada ✅

### ✅ Bloque 2: Días 8-14 (COMPLETADO)
- 58 duplicados purgados (junto con Bloque 3) ✅
- Misiones SHORT mejoradas: `day_9_kid14_gravity`, `day_9_kid14_angulo`, `day_9_kid14_tunnel`, `day_9_kid9_altar`, `day_10_kid9_nishiki`, `day_10_fam_sayonara`, `day_11_tatami`, `day_12_sugidama`, `day_13_manhole`, `day_13_perspective`, `day_14_rock`, `day_14_root` ✅
- `day_8_kid14_arashiyama` tag:undefined → tag:writing ✅

### ✅ Bloque 3: Días 15-21 (COMPLETADO)
- Misiones SHORT mejoradas: `day_15_thatch`, `day_15_shogun`, `day_17_incense`, `day_17_gashapon`, `day_18_hachiko`, `day_19_liberty`, `day_20_pond`, `day_21_monkeys` ✅

### ✅ Bloque 4: Días 22-24 (COMPLETADO)
- 25 de 27 misiones reescritas con calidad comercial ✅
- 2 conservadas (ya tenían calidad suficiente) ✅

---

## 🏁 RESULTADO FINAL

| Métrica | Valor |
|---------|-------|
| **Días** | 24/24 con 9 misiones cada uno ✅ |
| **Total misiones** | 216 (objetivo cumplido) ✅ |
| **Tags undefined** | 0 ✅ |
| **Renders SHORT (<200 chars)** | 0 ✅ |
| **Duplicados eliminados** | 58 ✅ |
| **Misiones reescritas (calidad)** | ~47 ✅ |

---

## 📁 ARCHIVOS DE REFERENCIA IMPORTANTES
- `BLOQUE COMPLETO DE MISIONES 10-24.md` — Especificación de diseño de cada misión (días 11-24)
- `GUIA_MISIONES_COMPLETA.md` — Guía exportada de todas las misiones
- `xp.md` — Sistema de XP, niveles e insignias

