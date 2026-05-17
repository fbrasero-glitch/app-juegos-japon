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

### ✅ Bloque 1: Días 1-7 (Auditado en sesiones anteriores)
- 9 misiones por día ✅
- Calidad UX verificada ✅

### ❌ Bloque 2: Días 8-14 (PENDIENTE)
| Día | Misiones actuales | Objetivo | Estado |
|-----|------------------|----------|--------|
| 8   | 18               | 9        | ❌ Purgar + Auditar |
| 9   | 16               | 9        | ❌ Purgar + Auditar |
| 10  | 10               | 9        | ❌ Purgar + Auditar |
| 11  | 13               | 9        | ❌ Purgar + Auditar |
| 12  | 13               | 9        | ❌ Purgar + Auditar |
| 13  | 12               | 9        | ❌ Purgar + Auditar |
| 14  | 14               | 9        | ❌ Purgar + Auditar |

### ❌ Bloque 3: Días 15-21 (PENDIENTE)
| Día | Misiones actuales | Objetivo | Estado |
|-----|------------------|----------|--------|
| 15  | 12               | 9        | ❌ Purgar + Auditar |
| 16  | 13               | 9        | ❌ Purgar + Auditar |
| 17  | 14               | 9        | ❌ Purgar + Auditar |
| 18  | 12               | 9        | ❌ Purgar + Auditar |
| 19  | 12               | 9        | ❌ Purgar + Auditar |
| 20  | 12               | 9        | ❌ Purgar + Auditar |
| 21  | 13               | 9        | ❌ Purgar + Auditar |

### ✅ Bloque 4: Días 22-24 (COMPLETADO)
- 9 misiones por día ✅
- Duplicados purgados ✅
- 25 de 27 misiones reescritas con calidad comercial ✅
- 2 conservadas (ya tenían calidad suficiente) ✅

---

## 🎨 PATRONES DE DISEÑO APLICADOS (copiar para nuevas misiones)

### Misión tipo FOTO (kid9)
```html
<p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">
    🎯 [EMOJI] [Narrativa inmersiva con contexto del lugar]
</p>
<div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#COLOR1,#COLOR2); border-radius:15px;">
    <p style="font-size:3rem;">[EMOJI GRANDE]</p>
    <p style="color:#fff; font-style:italic; margin-top:10px;">[Frase motivacional]</p>
</div>
<button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 [Acción específica]</button>
```

### Misión tipo TERMINAL (kid14)
```html
<div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
    <p style="color:#0f0;">>>> [TÍTULO TÁCTICO]</p>
    <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">[Contexto de misión hacker]</p>
    <label style="color:#0f0; font-size:0.8rem;">[LABEL]:</label>
    <input type="text" id="xxx" placeholder="Ej: ..." style="width:100%; margin-bottom:10px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px;">
    <button id="btn" class="btn-primary" style="width:100%">📤 [Acción terminal]</button>
</div>
```

### Misión tipo CRONÓMETRO
```html
<div style="background:linear-gradient(135deg,#1a1a2e,#2a1a3e); border-radius:15px; padding:20px; margin:15px 0; text-align:center;">
    <div id="timer" style="font-size:3.5rem; font-weight:bold; color:#00ff87; text-shadow:0 0 20px rgba(0,255,135,0.4); font-family:monospace;">0.0s</div>
</div>
<button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px; font-size:1.1rem; padding:15px;">🚀 [Iniciar]</button>
<button id="btn-end" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">🏁 [Finalizar]</button>
```

### Misión tipo CONJUNTA (both)
```html
<p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">👨‍👩‍👧‍👦 [Narrativa familiar]</p>
<div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(135deg,#COLOR1,#COLOR2); border-radius:15px; border:2px solid #d4af37;">
    <p style="font-size:4rem;">[EMOJIS]</p>
    <p style="color:#d4af37; font-weight:bold;">[Subtítulo épico]</p>
</div>
<!-- checkbox o cámara según tipo -->
```

---

## 📁 ARCHIVOS DE REFERENCIA IMPORTANTES
- `BLOQUE COMPLETO DE MISIONES 10-24.md` — Especificación de diseño de cada misión (días 11-24)
- `GUIA_MISIONES_COMPLETA.md` — Guía exportada de todas las misiones
- `xp.md` — Sistema de XP, niveles e insignias

---

## 🔄 FLUJO DE TRABAJO PARA CONTINUAR

1. **Leer este archivo** ← estás aquí
2. **Elegir el siguiente bloque** (Bloque 2 = Días 8-14, o Bloque 3 = Días 15-21)
3. **FASE 1**: Para cada día, listar misiones actuales, identificar duplicados, crear script de purga
4. **FASE 2**: Para cada misión restante, evaluar calidad → crear `upgrade_dayXX.js`
5. **Verificar**: `node -c missions.js` + contar misiones
6. **Commit + Push**: `git add -A; git commit -m "..."; git push origin master`
7. **Actualizar este archivo** con el estado del bloque completado
