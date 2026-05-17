# 🎮 INSTRUCCIONES CORREGIDAS PARA EL AGENTE DE PROGRAMACIÓN  
## App de Misiones Japón 2026 (Offline‑First, Vanilla JS, sin Firebase)

**⛩️ Contexto:** Ya tienes desarrollada una PWA en **Vanilla JavaScript** que funciona offline, guarda el progreso en **localStorage** (con `gameState`) y usa **IndexedDB** para almacenar las misiones completadas. El código actual maneja dos perfiles: `kid9` (Laura) y `kid14` (Iván).  
**🚨 Requisito fundamental:** No se debe migrar a React Native, Firebase, Firestore ni ninguna base de datos en la nube. La app debe seguir siendo 100% offline‑first y funcionar sin conexión a Internet (ideal para zonas sin cobertura en Japón).

---

## 📋 Objetivos de esta actualización

1. **Sistema de niveles personalizados** por perfil (Laura → Senda de la Kitsune; Iván → Protocolo del Ronin) con umbrales de XP y títulos distintos.
2. **Nuevos valores de XP** para cada misión (según la tabla de rebalanceo proporcionada).
3. **Insignias de mérito** (badges) que se desbloquean por acciones concretas, no por XP.
4. **Barra de progreso** y animación de subida de nivel.
5. **Comparativa entre hermanos** – 

---

## 🧒 Perfiles y claves en `localStorage`

Mantén las claves existentes. No cambies los nombres.

```javascript
// Estructura ACTUAL del gameState (debes respetar)
gameState = {
  kid9: {   // Laura
    totalXP: 0,
    currentLevel: 0,          // índice del nivel (0..9)
    completedMissions: {},    // { missionId: { approved: true, timestamp, ... } }
    badges: [],               // array de strings con ids de insignias
    counters: {               // para insignias condicionales
      physicalStreak: 0,
      earlyLateSubmissions: 0,
      perfectJointMissions: 0,
      cryptoSolvedFirstTry: true
    }
  },
  kid14: {  // Iván
    // ... misma estructura
  },
  settings: { judgePassword: "1234" }  // opcional
};
Importante: Cada vez que se complete una misión (desde el Modo Juez), se actualizará el totalXP del kid correspondiente y se disparará la comprobación de nivel.

🌸 Perfil Laura – “La Senda de la Kitsune”
Estilo visual: Colores cálidos, iconos de naturaleza, barra de progreso con motivos de flores o bambú, tipografía redondeada.

Nivel	XP mínimo	Título	Icono
0	0	Pasajera Curiosa	✈️
1	100	Cazadora de Yōkais	👻
2	200	Aprendiz de Kitsune	🦊
3	350	Acróbata del Bambú	🎋
4	550	Domadora de Ciervos	🦌
5	800	Gimnasta del Templo	⛩️
6	1150	Bailarina del Kintsugi	✨
7	1450	Guardiana de la Montaña	🗻
8	1800	Maga de los Elementos	🌪️
9	2200	Leyenda del Sol Naciente	👑
💻 Perfil Iván – “El Protocolo del Ronin”
Estilo visual: Tema oscuro (negro/verde), tipografía monoespaciada, barra de progreso “fragmentada” o tipo terminal.

Nivel	XP mínimo	Título	Icono
0	0	Recluta de Datos	💾
1	100	Analista Callejero	📊
2	200	Hacker de Neón	🔌
3	350	Operativo en las Sombras	🗡️
4	550	Mercenario de Rango C	⚔️
5	800	Estratega del Shogunato	🏯
6	1150	Superviviente de la Niebla	🌫️
7	1450	Replicante de Combate	🤖
8	1800	Maestro de la Materia	🔮
9	2200	Ronin Legendario	👑
📊 Nuevos valores de XP para las misiones
Debes reemplazar el XP de cada misión por los valores de la tabla de rebalanceo (se adjunta como JSON al final de este documento). Aplica los cambios directamente en el array de misiones que ya tienes.

Criterio resumido:

10 XP: selfies rápidas, fotos muy sencillas.

15 XP: fotos con búsqueda, grabar sonidos cortos.

20 XP: ejercicios físicos cortos, minijuegos.

25 XP: coordinación física (equilibrio, pasos silenciosos), uso de Google Maps.

30 XP: GPS, sensores de precisión, retos físicos prolongados.

35‑40 XP: misiones complejas (GPS + desplazamiento, desencriptación con búsqueda física).

50 XP: misión final “Sayonara Japón”.

🏆 Insignias de Mérito (badges)
No dependen del XP total. Se desbloquean al cumplir condiciones y se guardan en el array badges del perfil.

ID interno	Nombre	Condición	Icono
medalla_olimpica	Medalla Olímpica	5 desafíos físicos (misión con 🏃) seguidos sin fallar	🥇
criptografo_elite	Criptógrafo de Élite	Superar todas las misiones tipo “Terminal Hacker” al primer intento	🔐
estomago_acero	Estómago de Acero	Completar misiones de probar platos extraños, snacks raros, takoyaki	🍜
bateria_inagotable	Batería Inagotable	Enviar 3 pruebas al Juez antes de 8:00 o después de 22:00	🔋
sincronizacion_perfecta	Sincronización Perfecta	5 misiones conjuntas con nota “perfecto” del Juez	🤝
El código debe llevar contadores internos en gameState.kidX.counters para rastrear estas condiciones.

🧠 Lógica de subida de nivel (disparador)
Evento gatillo: Justo después de que el Modo Juez apruebe una misión y se sume el XP correspondiente a totalXP del niño.

Función obligatoria: function checkLevelUp(kidId)

Recibe "kid9" o "kid14".

Recorre la tabla de niveles de ese perfil y determina el nuevo índice de nivel.

Si el nuevo índice es mayor que el anterior:

Actualiza currentLevel.

Lanza una animación visual inmersiva:

Para Laura: <canvas> con partículas doradas y pétalos de cerezo.

Para Iván: animación de código verde “desencriptándose” (líneas de texto que caen).

Muestra un modal con el nuevo título, icono y un mensaje tipo:
“¡Has alcanzado el rango de Gimnasta del Templo!”

Reproduce un sonido (opcional, usar Web Audio API).

Guarda el estado actualizado en localStorage.

Barra de progreso:
Porcentaje = (XP_total - umbral_actual) / (umbral_siguiente - umbral_actual) * 100.
Si está en nivel máximo, mostrar “Nivel máximo”.

 – comparativa entre hermanos


La comparativa (leaderboard) se mostrará únicamente dentro del panel del Modo Juez y la podrán ver cada niño en su panel de logro, 

z.

Implementación técnica:

En la pantalla de logros del niño, una sección “Clasificación hermanos” que lea gameState.kid9 y gameState.kid14 y muestre:

Nivel actual y XP de cada uno.

Insignias conseguidas (íconos).

Barra de progreso hacia el siguiente nivel.

No se necesitan peticiones de red ni sincronización entre dispositivos.

🎨 Requisitos visuales diferenciales (CSS)
Para Laura:

Fondo suave (crema o #fff0e6), bordes redondeados, sombras.

Barra de progreso con degradado naranja → rosa y pequeñas hojas que se iluminan.

Tipografía: "Quicksand", "M PLUS Rounded 1c", sans-serif.

Para Iván:

Fondo negro (#0a0e12), texto #00ff99.

Barra de progreso con efecto de “carga” (líneas verdes horizontales).

Tipografía: "Fira Code", "Courier New", monospace.

Tema dinámico: Al seleccionar el perfil (Laura o Iván), toda la interfaz cambia al estilo correspondiente (colores, tipografía, barra, efectos).

💾 Almacenamiento y persistencia (offline‑first)
localStorage para gameState, misiones completadas, contadores, badges.

IndexedDB para almacenar las fotos/vídeos de evidencia (opcional, si se quiere guardar localmente).

No se usa Firebase, Firestore, ni ninguna API externa.

Toda la lógica de validación de misiones, suma de XP y subida de nivel ocurre en el navegador.

📦 Entregables esperados
Código fuente completo (Vanilla JS, HTML5, CSS3, Service Worker para PWA).

Archivo manifest.json para instalación como app.

El array de misiones actualizado con los nuevos XP (se adjunta JSON).

Funciones documentadas: completeMission(kidId, missionId, judgeNote), checkLevelUp(kidId), unlockBadge(kidId, badgeId).

Instrucciones de prueba: cómo simular un viaje offline.

📎 Anexo: JSON con los nuevos XP de las misiones
(Aquí debes incluir el listado completo de misiones con sus IDs y el XP corregido, según la tabla de rebalanceo que ya proporcionaste. Por brevedad se muestra un ejemplo, pero tú debes adjuntar el archivo completo o copiarlo en el prompt.)

json
[
  { "id": "dia1_bingo", "nombre": "Bingo Aeroportuario", "xp": 15 },
  { "id": "dia1_equilibrio", "nombre": "Equilibrio a 10.000 Metros", "xp": 25 },
  { "id": "dia1_escaner", "nombre": "El Escáner de Frecuencias", "xp": 15 },
  ...
  { "id": "dia24_sayonara", "nombre": "Sayonara Japón", "xp": 50 }
]
Nota final: No modifiques la estructura base de la PWA ni el sistema de almacenamiento offline. Agrega las nuevas funcionalidades respetando el código existente.