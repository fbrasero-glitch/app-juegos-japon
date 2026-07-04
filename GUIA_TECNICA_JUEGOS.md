# 🎮 GUÍA TÉCNICA Y DE DESARROLLO DE JUEGOS Y MINIJUEGOS 🇯🇵

Esta guía contiene la documentación técnica completa, el flujo de desarrollo, la arquitectura de programación y la descripción detallada de cada minijuego y juego interactivo integrado en la **PWA de Pasaporte de Misiones Japón**.

## 🏗️ Arquitectura General del Motor de Minijuegos (`games.js`)

El motor de minijuegos está programado en **Vanilla JavaScript** utilizando la API de **HTML5 Canvas (2D)** para la renderización procedimental de gráficos, partículas, pantallas con vibración (screenshake), sintonizadores de audio y simuladores de física offline.

### 🔄 Ciclo de Vida del Minijuego

1. **Inicialización (`launch(missionId)`):** Limpia el estado, activa la vista de pantalla completa en el contenedor DOM `#view-minigame`, ajusta el Canvas a su resolución nativa de 800x600 y carga la configuración específica del juego.
2. **Configuración (`setupGame(missionId)`):** Crea el estado de datos en `MinigamesManager.gameData` (jugador, obstáculos, temporizadores, puntuación meta).
3. **Bucle de Juego (`loop(timestamp)`):** Ejecuta `updateGame(dt)` para simular la física y lógica, y luego `drawFrame()` para dibujar el frame actual. Mantiene el refresco de pantalla mediante `requestAnimationFrame`.
4. **Entrada de Usuario (`handlePress/handleRelease/onMouseMove`):** Traduce coordenadas táctiles/ratón a coordenadas locales del Canvas de 800x600 para gestionar interacciones orgánicas.
5. **Resolución (`submit()` / `gameOver()`):** Al alcanzar la meta, guarda el estado de éxito y devuelve el control a la aplicación para el registro de XP y actualización del estado del viaje.

---

## 📅 DETALLE DE MINIJUEGOS POR DÍA Y POR NIÑO

## 🗓️ DÍA 3

### 🦊 Laura (Kid - 9 años)

#### 🎮 Glico Rooftop Runner 🏃‍♂️💨
- **Identificador de Misión:** `day_3_glico`
- **Puntuación Meta/Objetivo:** `300`
- **Instrucciones de Pantalla:** *"¡Siente la velocidad de Dotonbori! Toca la pantalla para saltar y esquivar. Si saltas de nuevo en el aire harás un salto doble con estela de viento. ¡Consigue 300 metros!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_glico')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_glico':
                return {
                    title: "Glico Rooftop Runner 🏃‍♂️💨",
                    emoji: "🏃‍♂️",
                    instructions: "¡Siente la velocidad de Dotonbori! Toca la pantalla para saltar y esquivar. Si saltas de nuevo en el aire harás un salto doble con estela de viento. ¡Consigue 300 metros!",
                    goal: 300,
                    color: "#ff7b54"
                };
            case 'day_3_ninja':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_glico':
                this.inputGlico();
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_glico':
                this.inputGlico();
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_glico':
                this.inputGlico();
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `300` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Sombras Shinobi: Tiro Arqueado 🥷🎯
- **Identificador de Misión:** `day_3_ninja`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"¡Arrastra hacia atrás y apunta para lanzar shurikens! Las guías te ayudarán a trazar la parábola. Derriba ninjas enemigos y salva a los zorritos Kitsune de oro."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_ninja')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_ninja':
                return {
                    title: "Sombras Shinobi: Tiro Arqueado 🥷🎯",
                    emoji: "🏹",
                    instructions: "¡Arrastra hacia atrás y apunta para lanzar shurikens! Las guías te ayudarán a trazar la parábola. Derriba ninjas enemigos y salva a los zorritos Kitsune de oro.",
                    goal: 10,
                    color: "#ff5722"
                };
            case 'day_3_bridge':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_ninja':
                this.releaseNinja(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_ninja':
                this.releaseNinja(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_ninja':
                this.releaseNinja(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Puente Mágico del Moat 🏯🌸
- **Identificador de Misión:** `day_3_bridge`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Reconstruye el puente. Toca las piezas del canal para rotarlas. Al conectarlas, el agua mágica fluirá. ¡Haz que Laura Chibi camine de orilla a orilla!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_bridge')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_bridge':
                return {
                    title: "El Puente Mágico del Moat 🏯🌸",
                    emoji: "🌸",
                    instructions: "Reconstruye el puente. Toca las piezas del canal para rotarlas. Al conectarlas, el agua mágica fluirá. ¡Haz que Laura Chibi camine de orilla a orilla!",
                    goal: 1,
                    color: "#009688"
                };
            case 'day_3_umeda':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_bridge':
                this.inputBridge(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_bridge':
                this.inputBridge(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_bridge':
                this.inputBridge(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Salto Estelar Umeda Sky 🏢✨
- **Identificador de Misión:** `day_3_umeda`
- **Puntuación Meta/Objetivo:** `1500`
- **Instrucciones de Pantalla:** *"¡Ayuda a Laura a volar alto! Arrastra el dedo horizontalmente para moverla. Rebota en las vigas del edificio Umeda y atrapa globos propulsores para llegar a 1500m."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_umeda')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_umeda':
                return {
                    title: "Salto Estelar Umeda Sky 🏢✨",
                    emoji: "🚀",
                    instructions: "¡Ayuda a Laura a volar alto! Arrastra el dedo horizontalmente para moverla. Rebota en las vigas del edificio Umeda y atrapa globos propulsores para llegar a 1500m.",
                    goal: 1500,
                    color: "#607d8b"
                };
            case 'day_3_reflect':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_umeda':
                this.gameData = {
                    player: { x: 380, y: 400, vx: 0, vy: -12, w: 32, h: 32 },
                    platforms: [
                        { x: 300, y: 550, w: 200, h: 16, type: 'normal', broken: false },
                        { x: 160, y: 440, w: 120, h: 16, type: 'normal', broken: false },
                        { x: 500, y: 350, w: 120, h: 16, type: 'bouncy', broken: false },
                        { x: 200, y: 240, w: 140, h: 16, type: 'moving', vx: 2.5, broken: false },
                        { x: 440, y: 120, w: 120, h: 16, type: 'normal', broken: false }
                    ],
                    balloons: [],
                    cameraY: 0,
                    highestY: 400,
                    stars: []
                };
                for(let i=0; i<45; i++) {
                    this.gameData.stars.push({ x: Math.random()*800, y: Math.random()*2000, size: 1.2 + Math.random()*1.8 });
                }
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_umeda':
                this.gameData = {
                    player: { x: 380, y: 400, vx: 0, vy: -12, w: 32, h: 32 },
                    platforms: [
                        { x: 300, y: 550, w: 200, h: 16, type: 'normal', broken: false },
                        { x: 160, y: 440, w: 120, h: 16, type: 'normal', broken: false },
                        { x: 500, y: 350, w: 120, h: 16, type: 'bouncy', broken: false },
                        { x: 200, y: 240, w: 140, h: 16, type: 'moving', vx: 2.5, broken: false },
                        { x: 440, y: 120, w: 120, h: 16, type: 'normal', broken: false }
                    ],
                    balloons: [],
                    cameraY: 0,
                    highestY: 400,
                    stars: []
                };
                for(let i=0; i<45; i++) {
                    this.gameData.stars.push({ x: Math.random()*800, y: Math.random()*2000, size: 1.2 + Math.random()*1.8 });
                }
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_umeda':
                this.gameData = {
                    player: { x: 380, y: 400, vx: 0, vy: -12, w: 32, h: 32 },
                    platforms: [
                        { x: 300, y: 550, w: 200, h: 16, type: 'normal', broken: false },
                        { x: 160, y: 440, w: 120, h: 16, type: 'normal', broken: false },
                        { x: 500, y: 350, w: 120, h: 16, type: 'bouncy', broken: false },
                        { x: 200, y: 240, w: 140, h: 16, type: 'moving', vx: 2.5, broken: false },
                        { x: 440, y: 120, w: 120, h: 16, type: 'normal', broken: false }
                    ],
                    balloons: [],
                    cameraY: 0,
                    highestY: 400,
                    stars: []
                };
                for(let i=0; i<45; i++) {
                    this.gameData.stars.push({ x: Math.random()*800, y: Math.random()*2000, size: 1.2 + Math.random()*1.8 });
                }
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1500` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Asedio del Castillo: Catapulta Geométrica 🏯☄️
- **Identificador de Misión:** `day_3_architect`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Ajusta el ángulo y la fuerza de la catapulta arrastrando hacia atrás. ¡Debes superar el foso de agua y hacer blanco en la muralla del castillo 3 veces!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_architect')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_architect':
                return {
                    title: "Asedio del Castillo: Catapulta Geométrica 🏯☄️",
                    emoji: "☄️",
                    instructions: "Ajusta el ángulo y la fuerza de la catapulta arrastrando hacia atrás. ¡Debes superar el foso de agua y hacer blanco en la muralla del castillo 3 veces!",
                    goal: 3,
                    color: "#00ff99"
                };
            case 'day_3_neon':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_architect':
                this.inputArchitectPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_architect':
                this.inputArchitectPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_architect':
                this.inputArchitectPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Hackeo de Cripto-Neón Akihabara 🔌👾
- **Identificador de Misión:** `day_3_neon`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Para piratear la red de neones, rota los cables segmentados haciendo clic sobre ellos. Conecta la terminal de energía (izq) con el mainframe central (der) antes de que se agote el tiempo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_neon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_neon':
                return {
                    title: "Hackeo de Cripto-Neón Akihabara 🔌👾",
                    emoji: "👾",
                    instructions: "Para piratear la red de neones, rota los cables segmentados haciendo clic sobre ellos. Conecta la terminal de energía (izq) con el mainframe central (der) antes de que se agote el tiempo.",
                    goal: 1,
                    color: "#ff007f"
                };
            case 'day_3_rush':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_neon':
                this.inputNeonPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_neon':
                this.inputNeonPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_neon':
                this.inputNeonPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Infiltración Shinobi Osaka 🥷🏯
- **Identificador de Misión:** `day_3_rush`
- **Puntuación Meta/Objetivo:** `500`
- **Instrucciones de Pantalla:** *"Mantén pulsado para correr hacia el castillo. ¡Pero cuidado! Cuando veas el aviso 🚨 y la linterna de los guardias se mueva, ¡deja de correr para esconderte! Si te mueves bajo la luz, te atraparán."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_rush')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_rush':
                return {
                    title: "Infiltración Shinobi Osaka 🥷🏯",
                    emoji: "🥷",
                    instructions: "Mantén pulsado para correr hacia el castillo. ¡Pero cuidado! Cuando veas el aviso 🚨 y la linterna de los guardias se mueva, ¡deja de correr para esconderte! Si te mueves bajo la luz, te atraparán.",
                    goal: 500,
                    color: "#ffd700"
                };
            case 'day_3_flow':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_rush':
                this.inputRushPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_rush':
                this.inputRushPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_rush':
                this.inputRushPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `500` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Sintonizador de Ondas Dotonbori 📻⚡
- **Identificador de Misión:** `day_3_flow`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"Sintoniza la frecuencia de la gran valla publicitaria. Ajusta los deslizadores de Frecuencia y Amplitud para que tu onda (verde) encaje perfectamente con la señal objetivo (roja discontinua). Mantén la alineación hasta sincronizar al 100%."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_flow')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_flow':
                return {
                    title: "Sintonizador de Ondas Dotonbori 📻⚡",
                    emoji: "⚡",
                    instructions: "Sintoniza la frecuencia de la gran valla publicitaria. Ajusta los deslizadores de Frecuencia y Amplitud para que tu onda (verde) encaje perfectamente con la señal objetivo (roja discontinua). Mantén la alineación hasta sincronizar al 100%.",
                    goal: 100,
                    color: "#00ffff"
                };
            case 'day_4_bestiary':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_flow': this.inputFlowPressDay3(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_flow': this.inputFlowPressDay3(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_flow': this.inputFlowPressDay3(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Reflexión Cyberpunk Dotonbori 📡⚡
- **Identificador de Misión:** `day_3_reflect`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Guía el rayo láser de neón. Toca y rota los prismas reflectores en la cuadrícula de Dotonbori para esquivar barreras y encender el receptor del cartel."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_3_reflect')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_3_reflect':
                return {
                    title: "Reflexión Cyberpunk Dotonbori 📡⚡",
                    emoji: "⚡",
                    instructions: "Guía el rayo láser de neón. Toca y rota los prismas reflectores en la cuadrícula de Dotonbori para esquivar barreras y encender el receptor del cartel.",
                    goal: 1,
                    color: "#8d6e63"
                };
            case 'day_3_architect':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_3_reflect':
                this.inputReflect(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_3_reflect':
                this.inputReflect(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_3_reflect':
                this.inputReflect(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 4

### 🦊 Laura (Kid - 9 años)

#### 🎮 Escáner Alienígena Kuromon 🐙🔎
- **Identificador de Misión:** `day_4_bestiary`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Encuentra y clasifica las criaturas mutantes en el mercado de Kuromon! Arrastra el visor del escáner y mantenlo sobre una criatura brillante para analizarla. ¡Cuidado con los peces normales!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_bestiary')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_bestiary':
                return {
                    title: "Escáner Alienígena Kuromon 🐙🔎",
                    emoji: "🔎",
                    instructions: "¡Encuentra y clasifica las criaturas mutantes en el mercado de Kuromon! Arrastra el visor del escáner y mantenlo sobre una criatura brillante para analizarla. ¡Cuidado con los peces normales!",
                    goal: 5,
                    color: "#fbc02d"
                };
            case 'day_4_gachapon':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_bestiary':
                this.inputBestiaryPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_bestiary':
                this.inputBestiaryPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_bestiary':
                this.inputBestiaryPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Garra Gachapon Legendaria 🔮🏗️
- **Identificador de Misión:** `day_4_gachapon`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Atrapa las cápsulas de juguete! La garra oscila sola. Toca el canvas para soltarla. Esquiva los engranajes rotatorios que rompen la garra. ¡Encesta 3 cápsulas en la rampa izquierda!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_gachapon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_gachapon':
                return {
                    title: "Garra Gachapon Legendaria 🔮🏗️",
                    emoji: "🏗️",
                    instructions: "¡Atrapa las cápsulas de juguete! La garra oscila sola. Toca el canvas para soltarla. Esquiva los engranajes rotatorios que rompen la garra. ¡Encesta 3 cápsulas en la rampa izquierda!",
                    goal: 3,
                    color: "#0288d1"
                };
            case 'day_4_vending_roulette':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_gachapon':
                this.inputGachaponPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_gachapon':
                this.inputGachaponPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_gachapon':
                this.inputGachaponPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Conexión de Refrescos Kawaii 🥤⚡
- **Identificador de Misión:** `day_4_vending_roulette`
- **Puntuación Meta/Objetivo:** `35`
- **Instrucciones de Pantalla:** *"¡Une las latas iguales! Arrastra el dedo sobre latas adyacentes del mismo tipo (horizontal, vertical o diagonal) para conectarlas. ¡Combina 3 o más y suéltalas para servirlas! Logra 35."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_vending_roulette')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_vending_roulette':
                return {
                    title: "Conexión de Refrescos Kawaii 🥤⚡",
                    emoji: "🥤",
                    instructions: "¡Une las latas iguales! Arrastra el dedo sobre latas adyacentes del mismo tipo (horizontal, vertical o diagonal) para conectarlas. ¡Combina 3 o más y suéltalas para servirlas! Logra 35.",
                    goal: 35,
                    color: "#ff9800"
                };
            case 'day_4_crab':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_vending_roulette':
                this.inputVendingPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_vending_roulette':
                this.inputVendingPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_vending_roulette':
                this.inputVendingPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `35` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Carrera del Cangrejo de Dotonbori 🦀🏃‍♂️
- **Identificador de Misión:** `day_4_crab`
- **Puntuación Meta/Objetivo:** `300`
- **Instrucciones de Pantalla:** *"¡Camina de lado y esquiva obstáculos! Toca para saltar sobre las bolas de takoyaki y patos. ¡El doble salto te salvará en el aire! Colecciona monedas para ganar metros. Llega a 300m."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_crab')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_crab':
                return {
                    title: "Carrera del Cangrejo de Dotonbori 🦀🏃‍♂️",
                    emoji: "🦀",
                    instructions: "¡Camina de lado y esquiva obstáculos! Toca para saltar sobre las bolas de takoyaki y patos. ¡El doble salto te salvará en el aire! Colecciona monedas para ganar metros. Llega a 300m.",
                    goal: 300,
                    color: "#f44336"
                };
            case 'day_4_knife':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_crab':
                this.inputCrabPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_crab':
                this.inputCrabPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_crab':
                this.inputCrabPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `300` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Corte de Precisión: Chef de Doguyasuji 🔪🥢
- **Identificador de Misión:** `day_4_knife`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Demuestra tu técnica con el acero! Toca la pantalla para bajar el cuchillo y cortar los ingredientes. Consigue un corte PERFECTO sincronizando el momento en que cruzan la línea de corte. ¡Cuidado con las piedras de afilar y cuchillos rotos que dañan tu hoja! Consigue 15."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_knife')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_knife':
                return {
                    title: "Corte de Precisión: Chef de Doguyasuji 🔪🥢",
                    emoji: "🔪",
                    instructions: "¡Demuestra tu técnica con el acero! Toca la pantalla para bajar el cuchillo y cortar los ingredientes. Consigue un corte PERFECTO sincronizando el momento en que cruzan la línea de corte. ¡Cuidado con las piedras de afilar y cuchillos rotos que dañan tu hoja! Consigue 15.",
                    goal: 15,
                    color: "#ff5722"
                };
            case 'day_4_500yen':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_knife':
                this.inputKnifePress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_knife':
                this.inputKnifePress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_knife':
                this.inputKnifePress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Kombini Dash: Reto 500 Yenes 🍙🛒
- **Identificador de Misión:** `day_4_500yen`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Atrapa los snacks sin pasarte del presupuesto! Arrastra el carro de la compra horizontalmente para recoger Onigiris (150¥), té (130¥), melonpan (160¥) y chocolate (180¥). Si superas los 500¥, la cesta se sobrecargará y se vaciará. ¡Reúne entre 400¥ y 500¥ y pulsa 'PAGAR'!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_500yen')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_500yen':
                return {
                    title: "Kombini Dash: Reto 500 Yenes 🍙🛒",
                    emoji: "🛒",
                    instructions: "¡Atrapa los snacks sin pasarte del presupuesto! Arrastra el carro de la compra horizontalmente para recoger Onigiris (150¥), té (130¥), melonpan (160¥) y chocolate (180¥). Si superas los 500¥, la cesta se sobrecargará y se vaciará. ¡Reúne entre 400¥ y 500¥ y pulsa 'PAGAR'!",
                    goal: 1,
                    color: "#00ff99"
                };
            case 'day_4_isshinji':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_500yen':
                this.input500YenPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_500yen':
                this.input500YenPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_500yen':
                this.input500YenPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Infiltración de Datos: Templo Isshinji 🏯💾
- **Identificador de Misión:** `day_4_isshinji`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Extrae la información oculta de los archivos del templo! Controla el nodo verde de infiltración táctica. Recoge las 3 claves de datos doradas y alcanza la base de datos central (salida) evitando las patrullas rojas del cortafuegos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_isshinji')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_isshinji':
                return {
                    title: "Infiltración de Datos: Templo Isshinji 🏯💾",
                    emoji: "💾",
                    instructions: "¡Extrae la información oculta de los archivos del templo! Controla el nodo verde de infiltración táctica. Recoge las 3 claves de datos doradas y alcanza la base de datos central (salida) evitando las patrullas rojas del cortafuegos.",
                    goal: 1,
                    color: "#e91e63"
                };
            case 'day_4_tracker':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_isshinji':
                this.inputIsshinjiPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_isshinji':
                this.inputIsshinjiPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_isshinji':
                this.inputIsshinjiPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Visor Táctico: Kuromon Wagyu Hunter 🥩🎯
- **Identificador de Misión:** `day_4_tracker`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"¡Busca y cataloga los puestos de brochetas de Wagyu en el mercado! Arrastra o mueve el visor táctico y haz clic sobre los puestos de Wagyu para escanearlos. ¡No escanees los civiles ni puestos falsos (como pulpos o helados)!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_tracker')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_tracker':
                return {
                    title: "Visor Táctico: Kuromon Wagyu Hunter 🥩🎯",
                    emoji: "🎯",
                    instructions: "¡Busca y cataloga los puestos de brochetas de Wagyu en el mercado! Arrastra o mueve el visor táctico y haz clic sobre los puestos de Wagyu para escanearlos. ¡No escanees los civiles ni puestos falsos (como pulpos o helados)!",
                    goal: 10,
                    color: "#00ffff"
                };
            case 'day_4_yakiniku':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_tracker':
                this.inputTrackerPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_tracker':
                this.inputTrackerPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_tracker':
                this.inputTrackerPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Maestro del Yakiniku 🔥🥩
- **Identificador de Misión:** `day_4_yakiniku`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"¡Grilla Wagyu para la familia! Toca las carnes crudas en la parrilla para darles la vuelta cuando estén bien doradas. Toca de nuevo para servirlas cuando ambos lados estén perfectos. ¡Que no se quemen!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_4_yakiniku')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_4_yakiniku':
                return {
                    title: "Maestro del Yakiniku 🔥🥩",
                    emoji: "🥩",
                    instructions: "¡Grilla Wagyu para la familia! Toca las carnes crudas en la parrilla para darles la vuelta cuando estén bien doradas. Toca de nuevo para servirlas cuando ambos lados estén perfectos. ¡Que no se quemen!",
                    goal: 10,
                    color: "#e65100"
                };
            case 'day_5_mochi':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_4_yakiniku':
                this.inputYakinikuPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_4_yakiniku':
                this.inputYakinikuPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_4_yakiniku':
                this.inputYakinikuPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 5

### 🦊 Laura (Kid - 9 años)

#### 🎮 Pose de la Gacela de Nara 🤸‍♀️🦌
- **Identificador de Misión:** `day_5_gymnast`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Completa las acrobacias con ritmo! Sigue la secuencia de poses gimnásticas que avanzan por la pantalla. Toca el botón con la pose correcta en el instante exacto en que cruza el área activa central para impresionar a los ciervos. Consigue 15."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_gymnast')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_gymnast':
                return {
                    title: "Pose de la Gacela de Nara 🤸‍♀️🦌",
                    emoji: "🤸‍♀️",
                    instructions: "¡Completa las acrobacias con ritmo! Sigue la secuencia de poses gimnásticas que avanzan por la pantalla. Toca el botón con la pose correcta en el instante exacto en que cruza el área activa central para impresionar a los ciervos. Consigue 15.",
                    goal: 15,
                    color: "#f06292"
                };
            case 'day_5_monk':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_gymnast':
                this.inputGymnastPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_gymnast':
                this.inputGymnastPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_gymnast':
                this.inputGymnastPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Meditación Zen del Buda 🧘🪷
- **Identificador de Misión:** `day_5_monk`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Consigue el autocontrol de un monje zen! Te encuentras meditando sobre una hoja de loto en un estanque. El viento sopla en ráfagas. Toca a la izquierda o derecha de la pantalla para equilibrar tu centro de gravedad. ¡Resiste 15 segundos sin caerte al agua!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_monk')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_monk':
                return {
                    title: "Meditación Zen del Buda 🧘🪷",
                    emoji: "🪷",
                    instructions: "¡Consigue el autocontrol de un monje zen! Te encuentras meditando sobre una hoja de loto en un estanque. El viento sopla en ráfagas. Toca a la izquierda o derecha de la pantalla para equilibrar tu centro de gravedad. ¡Resiste 15 segundos sin caerte al agua!",
                    goal: 15,
                    color: "#8d6e63"
                };
            case 'day_5_deer_galaxy':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_monk':
                this.inputMonkPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_monk':
                this.inputMonkPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_monk':
                this.inputMonkPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Alimentando Ciervos en Nara 🦌🌾
- **Identificador de Misión:** `day_5_deer_galaxy`
- **Puntuación Meta/Objetivo:** `12`
- **Instrucciones de Pantalla:** *"¡Reparte galletas Shika Senbei! Toca a los ciervos hambrientos que corren por el prado para lanzarles una galleta. ¡Cuidado con los cuervos y mapaches ladrones! Si les lanzas galletas o te roban, perderás vidas. Consigue 12."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_deer_galaxy')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_deer_galaxy':
                return {
                    title: "Alimentando Ciervos en Nara 🦌🌾",
                    emoji: "🦌",
                    instructions: "¡Reparte galletas Shika Senbei! Toca a los ciervos hambrientos que corren por el prado para lanzarles una galleta. ¡Cuidado con los cuervos y mapaches ladrones! Si les lanzas galletas o te roban, perderás vidas. Consigue 12.",
                    goal: 12,
                    color: "#00acc1"
                };
            case 'day_5_ribbon':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_deer_galaxy':
                this.inputDeerPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_deer_galaxy':
                this.inputDeerPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_deer_galaxy':
                this.inputDeerPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `12` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Danza de la Cinta Sagrada 🌀🪄
- **Identificador de Misión:** `day_5_ribbon`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Toma la cinta rítmica y traza las constelaciones mágicas! Sigue el recorrido de la plantilla de neón de una sola pasada manteniendo pulsado el cursor/dedo sin desviarte. ¡Completa 3 constelaciones con más de 80% de precisión!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_ribbon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_ribbon':
                return {
                    title: "Danza de la Cinta Sagrada 🌀🪄",
                    emoji: "🪄",
                    instructions: "¡Toma la cinta rítmica y traza las constelaciones mágicas! Sigue el recorrido de la plantilla de neón de una sola pasada manteniendo pulsado el cursor/dedo sin desviarte. ¡Completa 3 constelaciones con más de 80% de precisión!",
                    goal: 3,
                    color: "#0288d1"
                };
            case 'day_5_investor':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_ribbon':
                this.inputRibbonPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_ribbon':
                this.inputRibbonPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_ribbon':
                this.inputRibbonPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Especulador de Recuerdos de Nara 📊💰
- **Identificador de Misión:** `day_5_investor`
- **Puntuación Meta/Objetivo:** `2000`
- **Instrucciones de Pantalla:** *"¡Consigue duplicar tus fondos! Monitorea la gráfica financiera en tiempo real de los souvenirs locales (Omamori, peluches y té Matcha). Compra barato (BUY) y vende caro (SELL) para lograr llevar tu saldo de 1,000¥ a 2,000¥ antes de que el mercado cierre."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_investor')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_investor':
                return {
                    title: "Especulador de Recuerdos de Nara 📊💰",
                    emoji: "📊",
                    instructions: "¡Consigue duplicar tus fondos! Monitorea la gráfica financiera en tiempo real de los souvenirs locales (Omamori, peluches y té Matcha). Compra barato (BUY) y vende caro (SELL) para lograr llevar tu saldo de 1,000¥ a 2,000¥ antes de que el mercado cierre.",
                    goal: 2000,
                    color: "#ffb300"
                };
            case 'day_5_zen':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_investor':
                this.inputInvestorPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_investor':
                this.inputInvestorPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_investor':
                this.inputInvestorPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2000` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Caligrafía Shodo Digital 🖌️✍️
- **Identificador de Misión:** `day_5_zen`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"¡Domina el pincel zen! Sigue con cuidado las líneas guía y el orden de los trazos para escribir los Kanjis sagrados de Persona (人) y Montaña (山). Si te sales de la trayectoria el trazo fallará. ¡Completa los 2 Kanjis!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_zen')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_zen':
                return {
                    title: "Caligrafía Shodo Digital 🖌️✍️",
                    emoji: "✍️",
                    instructions: "¡Domina el pincel zen! Sigue con cuidado las líneas guía y el orden de los trazos para escribir los Kanjis sagrados de Persona (人) y Montaña (山). Si te sales de la trayectoria el trazo fallará. ¡Completa los 2 Kanjis!",
                    goal: 2,
                    color: "#cddc39"
                };
            case 'day_5_engineer':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_zen':
                this.inputZenPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_zen':
                this.inputZenPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_zen':
                this.inputZenPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Constructor de la Gran Pagoda 🏗️🏯
- **Identificador de Misión:** `day_5_engineer`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Apila las secciones de la pagoda de Todai-ji sin usar un solo clavo! Suelta cada sección en el momento justo para alinearla con la anterior. Si se desvía, la estructura tambaleará. Al final, ¡deberá soportar un sismo de prueba!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_engineer')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_engineer':
                return {
                    title: "Constructor de la Gran Pagoda 🏗️🏯",
                    emoji: "🏯",
                    instructions: "¡Apila las secciones de la pagoda de Todai-ji sin usar un solo clavo! Suelta cada sección en el momento justo para alinearla con la anterior. Si se desvía, la estructura tambaleará. Al final, ¡deberá soportar un sismo de prueba!",
                    goal: 5,
                    color: "#00bcd4"
                };
            case 'day_5_guardian':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_engineer':
                this.inputEngineerPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_engineer':
                this.inputEngineerPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_engineer':
                this.inputEngineerPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Abrazo de la Suerte Todai-ji 🪵🤗
- **Identificador de Misión:** `day_5_guardian`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Saca fuerzas para atravesar el pilar de Buda! Toca alternadamente y rápido a la izquierda y derecha para avanzar y deslizarte por la cavidad de la madera. ¡Cuidado con el polvo y las astillas que caen y te ralentizan!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_guardian')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_guardian':
                return {
                    title: "El Abrazo de la Suerte Todai-ji 🪵🤗",
                    emoji: "🤗",
                    instructions: "¡Saca fuerzas para atravesar el pilar de Buda! Toca alternadamente y rápido a la izquierda y derecha para avanzar y deslizarte por la cavidad de la madera. ¡Cuidado con el polvo y las astillas que caen y te ralentizan!",
                    goal: 3,
                    color: "#ff9800"
                };
            // ==========================================================
            // DAY 6 MINIGAMES - NIJO & IMPERIAL PALACE
            // ==========================================================
            case 'day_6_evasion':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_guardian':
                this.inputGuardianPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_guardian':
                this.inputGuardianPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_guardian':
                this.inputGuardianPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 El Ritmo del Mochi Nakatanidou 🔨🍡
- **Identificador de Misión:** `day_5_mochi`
- **Puntuación Meta/Objetivo:** `20`
- **Instrucciones de Pantalla:** *"¡Sincroniza el amasado a toda velocidad! Las notas de Mazo (🔨) y Mano (🤚) descienden. Toca los botones inferiores correspondientes exactamente cuando crucen los círculos de golpe. ¡Consigue 20 aciertos sin cometer más de 3 fallos!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_5_mochi')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_5_mochi':
                return {
                    title: "El Ritmo del Mochi Nakatanidou 🔨🍡",
                    emoji: "🍡",
                    instructions: "¡Sincroniza el amasado a toda velocidad! Las notas de Mazo (🔨) y Mano (🤚) descienden. Toca los botones inferiores correspondientes exactamente cuando crucen los círculos de golpe. ¡Consigue 20 aciertos sin cometer más de 3 fallos!",
                    goal: 20,
                    color: "#4caf50"
                };
            case 'day_5_gymnast':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_5_mochi':
                this.inputMochiPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_5_mochi':
                this.inputMochiPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_5_mochi':
                this.inputMochiPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `20` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 6

### 🦊 Laura (Kid - 9 años)

#### 🎮 Silencio en el Puente de Nijo 🥷🌉
- **Identificador de Misión:** `day_6_evasion`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Cruza el puente en silencio absoluto! Mantén presionado para caminar. Avanza con cuidado. Si el guardia del Shogun gira la cabeza (parpadea ⚠️), ¡suelta y quédate inmóvil!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_evasion')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_evasion':
                return {
                    title: "Silencio en el Puente de Nijo 🥷🌉",
                    emoji: "🌉",
                    instructions: "¡Cruza el puente en silencio absoluto! Mantén presionado para caminar. Avanza con cuidado. Si el guardia del Shogun gira la cabeza (parpadea ⚠️), ¡suelta y quédate inmóvil!",
                    goal: 100,
                    color: "#81c784"
                };
            case 'day_6_seal':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_evasion':
                this.inputEvasionPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_evasion':
                this.inputEvasionPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_evasion':
                this.inputEvasionPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Sello Oculto del Shogun 📸🔍
- **Identificador de Misión:** `day_6_seal`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Busca los emblemas dorados Tokugawa ocultos en las salas del palacio! Mueve tu linterna por la pantalla oscura y haz clic sobre los 5 sellos brillantes antes de que se acabe el tiempo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_seal')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_seal':
                return {
                    title: "El Sello Oculto del Shogun 📸🔍",
                    emoji: "🔍",
                    instructions: "¡Busca los emblemas dorados Tokugawa ocultos en las salas del palacio! Mueve tu linterna por la pantalla oscura y haz clic sobre los 5 sellos brillantes antes de que se acabe el tiempo.",
                    goal: 5,
                    color: "#ffd700"
                };
            case 'day_6_clouds':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_seal':
                this.inputSealPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_seal':
                this.inputSealPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_seal':
                this.inputSealPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Jardín de Pinos-Nube 🌲☁️
- **Identificador de Misión:** `day_6_clouds`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Encuentra la forma del animal en la nube de los pinos! Arrastra y encaja las piezas de animales en la silueta correcta del pino podado en el Palacio Imperial."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_clouds')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_clouds':
                return {
                    title: "Jardín de Pinos-Nube 🌲☁️",
                    emoji: "☁️",
                    instructions: "¡Encuentra la forma del animal en la nube de los pinos! Arrastra y encaja las piezas de animales en la silueta correcta del pino podado en el Palacio Imperial.",
                    goal: 3,
                    color: "#4db6ac"
                };
            case 'day_6_ninja_steps':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_clouds':
                this.inputCloudsPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_clouds':
                this.inputCloudsPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_clouds':
                this.inputCloudsPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Pasos Rítmicos de Ninja 🥷👞
- **Identificador de Misión:** `day_6_ninja_steps`
- **Puntuación Meta/Objetivo:** `20`
- **Instrucciones de Pantalla:** *"¡Cruza el suelo ruiseñor sin hacer sonar sus duelas! Toca los botones de pasos exactamente cuando crucen los círculos de silencio inferior. ¡Consigue 20 aciertos sin despertar al guardia!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_ninja_steps')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_ninja_steps':
                return {
                    title: "Pasos Rítmicos de Ninja 🥷👞",
                    emoji: "🥷",
                    instructions: "¡Cruza el suelo ruiseñor sin hacer sonar sus duelas! Toca los botones de pasos exactamente cuando crucen los círculos de silencio inferior. ¡Consigue 20 aciertos sin despertar al guardia!",
                    goal: 20,
                    color: "#ff7043"
                };
            case 'day_6_tactical':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_ninja_steps':
                this.inputNinjaStepsPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_ninja_steps':
                this.inputNinjaStepsPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_ninja_steps':
                this.inputNinjaStepsPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `20` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Infiltración Táctica Nijo 🧭🏰
- **Identificador de Misión:** `day_6_tactical`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Planifica tu ruta hacia el tejado del castillo! Dibuja un camino seguro tocando los nodos. Evita que Iván entre en los conos de visión amarillos de los guardias de patrulla."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_tactical')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_tactical':
                return {
                    title: "Infiltración Táctica Nijo 🧭🏰",
                    emoji: "🏰",
                    instructions: "¡Planifica tu ruta hacia el tejado del castillo! Dibuja un camino seguro tocando los nodos. Evita que Iván entre en los conos de visión amarillos de los guardias de patrulla.",
                    goal: 1,
                    color: "#78909c"
                };
            case 'day_6_edict':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_tactical':
                this.inputTacticalPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_tactical':
                this.inputTacticalPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_tactical':
                this.inputTacticalPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Edicto Imperial del Emperador 📜✍️
- **Identificador de Misión:** `day_6_edict`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Redacta la ley más divertida de Kioto! Desplaza la canasta a los lados para atrapar las palabras imperiales que caen y armar la frase. Evita las palabras rojas prohibidas."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_edict')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_edict':
                return {
                    title: "Edicto Imperial del Emperador 📜✍️",
                    emoji: "📜",
                    instructions: "¡Redacta la ley más divertida de Kioto! Desplaza la canasta a los lados para atrapar las palabras imperiales que caen y armar la frase. Evita las palabras rojas prohibidas.",
                    goal: 5,
                    color: "#ffd54f"
                };
            case 'day_6_time_travel':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_edict':
                this.inputEdictPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_edict':
                this.inputEdictPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_edict':
                this.inputEdictPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Fotografía de Kyoto 1600 📸⏳
- **Identificador de Misión:** `day_6_time_travel`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"¡Inmortaliza la calle Sannenzaka en el año 1600! Toca para borrar todos los elementos modernos que arruinan la toma histórica (cables, postes de luz, teléfonos y turistas)."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_time_travel')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_time_travel':
                return {
                    title: "Fotografía de Kyoto 1600 📸⏳",
                    emoji: "⏳",
                    instructions: "¡Inmortaliza la calle Sannenzaka en el año 1600! Toca para borrar todos los elementos modernos que arruinan la toma histórica (cables, postes de luz, teléfonos y turistas).",
                    goal: 10,
                    color: "#ffab91"
                };
            case 'day_6_ring':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_time_travel':
                this.inputTimeTravelPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_time_travel':
                this.inputTimeTravelPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_time_travel':
                this.inputTimeTravelPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Ritmo del Paso Imperial 🏃‍♂️⏱️
- **Identificador de Misión:** `day_6_ring`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Mide tu velocidad imperial! Toca la pantalla manteniendo un tempo constante y regular con el metrónomo. Si te aceleras o retrasas, tropezarás. Completa 100 pasos perfectos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_ring')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_ring':
                return {
                    title: "El Ritmo del Paso Imperial 🏃‍♂️⏱️",
                    emoji: "⏱️",
                    instructions: "¡Mide tu velocidad imperial! Toca la pantalla manteniendo un tempo constante y regular con el metrónomo. Si te aceleras o retrasas, tropezarás. Completa 100 pasos perfectos.",
                    goal: 100,
                    color: "#26a69a"
                };
            case 'day_6_clan':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_ring':
                this.inputRingPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_ring':
                this.inputRingPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_ring':
                this.inputRingPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Retrato Marcial del Clan 📸🛡️
- **Identificador de Misión:** `day_6_clan`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Posa en familia con expresión seria de samurái! Toca a cada miembro del clan para cambiar su pose y hacer que todos adopten la pose marcial correcta antes de que el temporizador saque la foto."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_6_clan')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_6_clan':
                return {
                    title: "Retrato Marcial del Clan 📸🛡️",
                    emoji: "🛡️",
                    instructions: "¡Posa en familia con expresión seria de samurái! Toca a cada miembro del clan para cambiar su pose y hacer que todos adopten la pose marcial correcta antes de que el temporizador saque la foto.",
                    goal: 1,
                    color: "#e53935"
                };
            // ==========================================================
            // DAY 7 MINIGAMES - KIYOMIZU-DERA & GION
            // ==========================================================
            case 'day_7_kimono':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_6_clan':
                this.inputClanPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_6_clan':
                this.inputClanPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_6_clan':
                this.inputClanPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 7

### 🦊 Laura (Kid - 9 años)

#### 🎮 Cazadora de Kimonos en Gion 📸👘
- **Identificador de Misión:** `day_7_kimono`
- **Puntuación Meta/Objetivo:** `8`
- **Instrucciones de Pantalla:** *"¡Retrata los coloridos vestidos tradicionales! Toca la pantalla para capturar una foto con la cámara justo cuando un paseante con kimono tradicional cruce la mira central."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_kimono')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_kimono':
                return {
                    title: "Cazadora de Kimonos en Gion 📸👘",
                    emoji: "👘",
                    instructions: "¡Retrata los coloridos vestidos tradicionales! Toca la pantalla para capturar una foto con la cámara justo cuando un paseante con kimono tradicional cruce la mira central.",
                    goal: 8,
                    color: "#f06292"
                };
            case 'day_7_kintsugi':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_kimono':
                this.inputKimonoPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_kimono':
                this.inputKimonoPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_kimono':
                this.inputKimonoPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `8` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Arte del Kintsugi Dorado 🏺✨
- **Identificador de Misión:** `day_7_kintsugi`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Restaura la vasija rota con resina de oro! Arrastra tu dedo o ratón a lo largo de las grietas con precisión sin salirte del camino. ¡Une los fragmentos!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_kintsugi')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_kintsugi':
                return {
                    title: "Arte del Kintsugi Dorado 🏺✨",
                    emoji: "🏺",
                    instructions: "¡Restaura la vasija rota con resina de oro! Arrastra tu dedo o ratón a lo largo de las grietas con precisión sin salirte del camino. ¡Une los fragmentos!",
                    goal: 3,
                    color: "#ffd700"
                };
            case 'day_7_tea':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_kintsugi':
                this.inputKintsugiPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_kintsugi':
                this.inputKintsugiPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_kintsugi':
                this.inputKintsugiPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Ceremonia del Té Matcha 🍵🚶‍♀️
- **Identificador de Misión:** `day_7_tea`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Lvl la bandeja de té Matcha hirviendo al Shogun! Mantén el té equilibrado arrastrando la bandeja para contrarrestar la inercia del movimiento. ¡No derrames el té Matcha!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_tea')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_tea':
                return {
                    title: "La Ceremonia del Té Matcha 🍵🚶‍♀️",
                    emoji: "🍵",
                    instructions: "¡Lvl la bandeja de té Matcha hirviendo al Shogun! Mantén el té equilibrado arrastrando la bandeja para contrarrestar la inercia del movimiento. ¡No derrames el té Matcha!",
                    goal: 15,
                    color: "#4caf50"
                };
            case 'day_7_stone_guardian':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_tea': this.inputTeaPressDay7(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_tea': this.inputTeaPressDay7(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_tea': this.inputTeaPressDay7(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Abrazo al Pilar Sagrado 🪵🤗
- **Identificador de Misión:** `day_7_stone_guardian`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Mide el diámetro del pilar gigante! Mantén presionado para abrir los brazos de Laura y suelta la pantalla en el instante exacto en que coincida con el borde del pilar."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_stone_guardian')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_stone_guardian':
                return {
                    title: "Abrazo al Pilar Sagrado 🪵🤗",
                    emoji: "🤗",
                    instructions: "¡Mide el diámetro del pilar gigante! Mantén presionado para abrir los brazos de Laura y suelta la pantalla en el instante exacto en que coincida con el borde del pilar.",
                    goal: 3,
                    color: "#ff9800"
                };
            case 'day_7_structural':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_stone_guardian':
                this.inputStoneGuardianPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_stone_guardian':
                this.inputStoneGuardianPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_stone_guardian':
                this.inputStoneGuardianPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Defensor de la Terraza de Madera 🏗️🏯
- **Identificador de Misión:** `day_7_structural`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Soporta el peso estructural de la terraza de Kiyomizu-dera! Mueve los pilares de soporte horizontalmente para bloquear las esferas de carga pesada que caen."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_structural')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_structural':
                return {
                    title: "Defensor de la Terraza de Madera 🏗️🏯",
                    emoji: "🏯",
                    instructions: "¡Soporta el peso estructural de la terraza de Kiyomizu-dera! Mueve los pilares de soporte horizontalmente para bloquear las esferas de carga pesada que caen.",
                    goal: 15,
                    color: "#00acc1"
                };
            case 'day_7_survival':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_structural':
                this.inputStructuralPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_structural':
                this.inputStructuralPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_structural':
                this.inputStructuralPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Supervivencia al Maleficio 🎒🧪
- **Identificador de Misión:** `day_7_survival`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"¡Has tropezado en Sannenzaka y te acecha el maleficio! Arrastra el objeto defensivo correcto de tu mochila para anular cada onda mágica: Matcha (Fuego), Omamori (Espíritu), Antídoto (Veneno)."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_survival')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_survival':
                return {
                    title: "Supervivencia al Maleficio 🎒🧪",
                    emoji: "🧪",
                    instructions: "¡Has tropezado en Sannenzaka y te acecha el maleficio! Arrastra el objeto defensivo correcto de tu mochila para anular cada onda mágica: Matcha (Fuego), Omamori (Espíritu), Antídoto (Veneno).",
                    goal: 10,
                    color: "#7e57c2"
                };
            case 'day_7_anti_quake':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_survival':
                this.inputSurvivalPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_survival':
                this.inputSurvivalPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_survival':
                this.inputSurvivalPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Yasaka Pagoda Anti-Sismo 🏗️🌋
- **Identificador de Misión:** `day_7_anti_quake`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Terremoto en Kioto! Estabiliza la pagoda Yasaka. Arrastra el gran pilar central (Shinbashira) para contrarrestar las ondas sísmicas rojas y evitar el derrumbe durante 15 segundos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_anti_quake')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_anti_quake':
                return {
                    title: "Yasaka Pagoda Anti-Sismo 🏗️🌋",
                    emoji: "🌋",
                    instructions: "¡Terremoto en Kioto! Estabiliza la pagoda Yasaka. Arrastra el gran pilar central (Shinbashira) para contrarrestar las ondas sísmicas rojas y evitar el derrumbe durante 15 segundos.",
                    goal: 15,
                    color: "#ff3d00"
                };
            case 'day_7_stairs':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_anti_quake':
                this.inputAntiQuakePress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_anti_quake':
                this.inputAntiQuakePress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_anti_quake':
                this.inputAntiQuakePress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Conquista de las Escaleras 🏃‍♂️🪜
- **Identificador de Misión:** `day_7_stairs`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Sube las empinadas escaleras de Kiyomizu! Salta (toca una vez) o doble salta (toca dos veces) para superar farolas y turistas distraídos. ¡Alcanza los 100 escalones!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_stairs')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_stairs':
                return {
                    title: "Conquista de las Escaleras 🏃‍♂️🪜",
                    emoji: "🪜",
                    instructions: "¡Sube las empinadas escaleras de Kiyomizu! Salta (toca una vez) o doble salta (toca dos veces) para superar farolas y turistas distraídos. ¡Alcanza los 100 escalones!",
                    goal: 100,
                    color: "#009688"
                };
            case 'day_7_geisha':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_stairs': this.inputStairsPressDay7(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_stairs': this.inputStairsPressDay7(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_stairs': this.inputStairsPressDay7(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 El Código de Faroles de Gion 🏮🎶
- **Identificador de Misión:** `day_7_geisha`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Memoriza la melodía de los farolillos! Observa la secuencia de iluminación de los faroles Chōchin tradicionales y repítela haciendo clic en el orden correcto."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_7_geisha')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_7_geisha':
                return {
                    title: "El Código de Faroles de Gion 🏮🎶",
                    emoji: "🏮",
                    instructions: "¡Memoriza la melodía de los farolillos! Observa la secuencia de iluminación de los faroles Chōchin tradicionales y repítela haciendo clic en el orden correcto.",
                    goal: 5,
                    color: "#ff9800"
                };
            case 'day_8_kid9_rake':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_7_geisha':
                this.inputGeishaPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_7_geisha':
                this.inputGeishaPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_7_geisha':
                this.inputGeishaPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 8

### 🦊 Laura (Kid - 9 años)

#### 🎮 El Rastrillo del Jardinero 🎋🌸
- **Identificador de Misión:** `day_8_kid9_rake`
- **Puntuación Meta/Objetivo:** `85`
- **Instrucciones de Pantalla:** *"¡Dibuja ondas zen en la arena del jardín Tenryu-ji! Arrastra tu dedo o ratón para rastrillar la arena. ¡Cubre el 85% de la superficie para completar el jardín!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid9_rake')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid9_rake':
                return {
                    title: "El Rastrillo del Jardinero 🎋🌸",
                    emoji: "🎋",
                    instructions: "¡Dibuja ondas zen en la arena del jardín Tenryu-ji! Arrastra tu dedo o ratón para rastrillar la arena. ¡Cubre el 85% de la superficie para completar el jardín!",
                    goal: 85,
                    color: "#81c784"
                };
            case 'day_8_kid14_wave_sync':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid9_rake':
                this.inputRakePress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid9_rake':
                this.inputRakePress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid9_rake':
                this.inputRakePress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `85` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Trono de Piedra 🗿👤
- **Identificador de Misión:** `day_8_kid9_pose`
- **Puntuación Meta/Objetivo:** `90`
- **Instrucciones de Pantalla:** *"Alinea las articulaciones del muñeco arrastrando los puntos amarillos para imitar la pose exacta de la estatua Rakan."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid9_pose')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid9_pose':
                return {
                    title: "El Trono de Piedra 🗿👤",
                    emoji: "🗿",
                    instructions: "Alinea las articulaciones del muñeco arrastrando los puntos amarillos para imitar la pose exacta de la estatua Rakan.",
                    goal: 90,
                    color: "#8d6e63"
                };
            case 'day_8_kid9_wind':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid9_pose':
                this.inputPosePress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid9_pose':
                this.inputPosePress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid9_pose':
                this.inputPosePress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `90` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Susurro del Viento 🍃🌬️
- **Identificador de Misión:** `day_8_kid9_wind`
- **Puntuación Meta/Objetivo:** `25`
- **Instrucciones de Pantalla:** *"¡El bosque te escucha! Arrastra tu ratón/dedo para crear ráfagas de viento y barrer las hojas de bambú fuera de la pantalla."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid9_wind')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid9_wind':
                return {
                    title: "El Susurro del Viento 🍃🌬️",
                    emoji: "🍃",
                    instructions: "¡El bosque te escucha! Arrastra tu ratón/dedo para crear ráfagas de viento y barrer las hojas de bambú fuera de la pantalla.",
                    goal: 25,
                    color: "#a1c4fd"
                };
            case 'day_8_kid9_bamboo_clock':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid9_wind':
                this.setupWind();
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid9_wind':
                this.setupWind();
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid9_wind':
                this.setupWind();
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `25` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Reloj de Bambú 🎋⏰
- **Identificador de Misión:** `day_8_kid9_bamboo_clock`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"¡Toca la pantalla justo cuando el nodo de bambú en crecimiento se alinee perfectamente con el círculo objetivo!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid9_bamboo_clock')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid9_bamboo_clock':
                return {
                    title: "El Reloj de Bambú 🎋⏰",
                    emoji: "🎋",
                    instructions: "¡Toca la pantalla justo cuando el nodo de bambú en crecimiento se alinee perfectamente con el círculo objetivo!",
                    goal: 10,
                    color: "#4caf50"
                };
            case 'day_8_kid9_giants':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid9_bamboo_clock':
                this.inputBambooClockPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid9_bamboo_clock':
                this.inputBambooClockPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid9_bamboo_clock':
                this.inputBambooClockPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Perspectiva de Gigantes 📸🎋
- **Identificador de Misión:** `day_8_kid9_giants`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"Arrastra la cámara verticalmente para alinear la altura visual de las 3 copas de bambú gigantes. Mantén la alineación por 2 segundos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid9_giants')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid9_giants':
                return {
                    title: "Perspectiva de Gigantes 📸🎋",
                    emoji: "📸",
                    instructions: "Arrastra la cámara verticalmente para alinear la altura visual de las 3 copas de bambú gigantes. Mantén la alineación por 2 segundos.",
                    goal: 2,
                    color: "#81c784"
                };
            case 'day_8_kid9_monk':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid9_giants':
                this.setupGiants();
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid9_giants':
                this.setupGiants();
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid9_giants':
                this.setupGiants();
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Mensaje del Monje 🔔🧘
- **Identificador de Misión:** `day_8_kid9_monk`
- **Puntuación Meta/Objetivo:** `6`
- **Instrucciones de Pantalla:** *"Observa la secuencia en la que el monje golpea los cuencos tibetanos y repítela pulsando los cuencos correctos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid9_monk')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid9_monk':
                return {
                    title: "El Mensaje del Monje 🔔🧘",
                    emoji: "🧘",
                    instructions: "Observa la secuencia en la que el monje golpea los cuencos tibetanos y repítela pulsando los cuencos correctos.",
                    goal: 6,
                    color: "#78909c"
                };
            case 'day_8_kid14_bosque':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid9_monk':
                this.inputKid9MonkPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid9_monk':
                this.inputKid9MonkPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid9_monk':
                this.inputKid9MonkPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `6` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Sincronización de Frecuencias ⚡📶
- **Identificador de Misión:** `day_8_kid14_wave_sync`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Ajusta Amplitud (arriba/abajo), Frecuencia (izq/der) y Fase (deslizar horizontal) para sincronizar tu onda verde con la del bosque! (3 niveles)"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid14_wave_sync')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid14_wave_sync':
                return {
                    title: "Sincronización de Frecuencias ⚡📶",
                    emoji: "⚡",
                    instructions: "¡Ajusta Amplitud (arriba/abajo), Frecuencia (izq/der) y Fase (deslizar horizontal) para sincronizar tu onda verde con la del bosque! (3 niveles)",
                    goal: 3,
                    color: "#00e676"
                };
            case 'day_9_kid9_scratch':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid14_wave_sync':
                this.inputWaveSyncPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid14_wave_sync':
                this.inputWaveSyncPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid14_wave_sync':
                this.inputWaveSyncPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Bosque de 2.7km 🏃🎋
- **Identificador de Misión:** `day_8_kid14_bosque`
- **Puntuación Meta/Objetivo:** `250`
- **Instrucciones de Pantalla:** *"¡Esquiva los obstáculos del camino! Pulsa los lados izquierdo/derecho de la pantalla para mover al corredor shinobi por los carriles."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid14_bosque')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid14_bosque':
                return {
                    title: "El Bosque de 2.7km 🏃🎋",
                    emoji: "🏃",
                    instructions: "¡Esquiva los obstáculos del camino! Pulsa los lados izquierdo/derecho de la pantalla para mover al corredor shinobi por los carriles.",
                    goal: 250,
                    color: "#2e7d32"
                };
            case 'day_8_kid14_arashiyama':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid14_bosque':
                this.inputBosquePress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid14_bosque':
                this.inputBosquePress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid14_bosque':
                this.inputBosquePress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `250` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Guardián del Bambú 🎋🪓
- **Identificador de Misión:** `day_8_kid14_arashiyama`
- **Puntuación Meta/Objetivo:** `30`
- **Instrucciones de Pantalla:** *"Corta trozos del bambú pulsando en la parte izquierda/derecha de la pantalla. ¡Esquiva las ramas que caen!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_kid14_arashiyama')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_kid14_arashiyama':
                return {
                    title: "El Guardián del Bambú 🎋🪓",
                    emoji: "🪓",
                    instructions: "Corta trozos del bambú pulsando en la parte izquierda/derecha de la pantalla. ¡Esquiva las ramas que caen!",
                    goal: 30,
                    color: "#4caf50"
                };
            case 'day_8_fam_squad':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_kid14_arashiyama':
                this.inputArashiyamaGamePress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_kid14_arashiyama':
                this.inputArashiyamaGamePress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_kid14_arashiyama':
                this.inputArashiyamaGamePress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `30` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Escuadrón Bambú 👥🎋
- **Identificador de Misión:** `day_8_fam_squad`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Misión de escuadrón camuflado! Haz clic para ocultar/agachar a los miembros de la familia justo cuando los bambúes pasen."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_8_fam_squad')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_8_fam_squad':
                return {
                    title: "Escuadrón Bambú 👥🎋",
                    emoji: "👥",
                    instructions: "¡Misión de escuadrón camuflado! Haz clic para ocultar/agachar a los miembros de la familia justo cuando los bambúes pasen.",
                    goal: 5,
                    color: "#81c784"
                };
            case 'day_9_kid9_zorros':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_8_fam_squad':
                this.inputFamSquadPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_8_fam_squad':
                this.inputFamSquadPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_8_fam_squad':
                this.inputFamSquadPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 9

### 🦊 Laura (Kid - 9 años)

#### 🎮 Limpia el Reflejo de Oro ⛩️✨
- **Identificador de Misión:** `day_9_kid9_scratch`
- **Puntuación Meta/Objetivo:** `90`
- **Instrucciones de Pantalla:** *"¡Limpia el lodo y hojas del estanque de Kinkaku-ji! Arrastra tu dedo para limpiar la superficie y revelar el Pabellón Dorado."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid9_scratch')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid9_scratch':
                return {
                    title: "Limpia el Reflejo de Oro ⛩️✨",
                    emoji: "⛩️",
                    instructions: "¡Limpia el lodo y hojas del estanque de Kinkaku-ji! Arrastra tu dedo para limpiar la superficie y revelar el Pabellón Dorado.",
                    goal: 90,
                    color: "#ffd700"
                };
            case 'day_9_kid14_torii':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid9_scratch':
                this.inputScratchPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid9_scratch':
                this.inputScratchPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid9_scratch':
                this.inputScratchPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `90` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Escalada de los Zorros 🦊⛰️
- **Identificador de Misión:** `day_9_kid9_zorros`
- **Puntuación Meta/Objetivo:** `150`
- **Instrucciones de Pantalla:** *"Ayuda al pequeño kitsune a trepar el Monte Inari saltando entre plataformas. Pulsa izquierda/derecha para moverlo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid9_zorros')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid9_zorros':
                return {
                    title: "La Escalada de los Zorros 🦊⛰️",
                    emoji: "🦊",
                    instructions: "Ayuda al pequeño kitsune a trepar el Monte Inari saltando entre plataformas. Pulsa izquierda/derecha para moverlo.",
                    goal: 150,
                    color: "#ff9800"
                };
            case 'day_9_kid9_altar':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid9_zorros':
                this.inputZorrosPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid9_zorros':
                this.inputZorrosPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid9_zorros':
                this.inputZorrosPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `150` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Altar Secreto 🏮🔮
- **Identificador de Misión:** `day_9_kid9_altar`
- **Puntuación Meta/Objetivo:** `4`
- **Instrucciones de Pantalla:** *"Arrastra las ofrendas (sake 🍶, arroz 🍚 y velas 🕯️) a sus altares elementales correspondientes para activar el flujo espiritual."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid9_altar')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid9_altar':
                return {
                    title: "El Altar Secreto 🏮🔮",
                    emoji: "🔮",
                    instructions: "Arrastra las ofrendas (sake 🍶, arroz 🍚 y velas 🕯️) a sus altares elementales correspondientes para activar el flujo espiritual.",
                    goal: 4,
                    color: "#e65100"
                };
            case 'day_9_kid14_gravity':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid9_altar':
                this.inputAltarPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid9_altar':
                this.inputAltarPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid9_altar':
                this.inputAltarPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `4` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Laberinto de Torii ⛩️🧩
- **Identificador de Misión:** `day_9_kid14_torii`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Alinea las puertas Torii para guiar la energía sagrada! Toca cada pieza del laberinto para rotarla y conectar la entrada con la salida."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid14_torii')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid14_torii':
                return {
                    title: "Laberinto de Torii ⛩️🧩",
                    emoji: "⛩️",
                    instructions: "¡Alinea las puertas Torii para guiar la energía sagrada! Toca cada pieza del laberinto para rotarla y conectar la entrada con la salida.",
                    goal: 1,
                    color: "#ff5722"
                };
            case 'day_10_kid9_bento':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid14_torii':
                this.inputToriiPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid14_torii':
                this.inputToriiPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid14_torii':
                this.inputToriiPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Piedra Gravedad 🪨⏱️
- **Identificador de Misión:** `day_9_kid14_gravity`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Pulsa para soltar la piedra de gravedad de Arashiyama. Vuelve a pulsar en el instante exacto en que cruza la línea objetivo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid14_gravity')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid14_gravity':
                return {
                    title: "Piedra Gravedad 🪨⏱️",
                    emoji: "🪨",
                    instructions: "Pulsa para soltar la piedra de gravedad de Arashiyama. Vuelve a pulsar en el instante exacto en que cruza la línea objetivo.",
                    goal: 3,
                    color: "#ff5722"
                };
            case 'day_9_kid14_angulo':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid14_gravity':
                this.inputGravityPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid14_gravity':
                this.inputGravityPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid14_gravity':
                this.inputGravityPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Ángulo Imposible 📐📡
- **Identificador de Misión:** `day_9_kid14_angulo`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"Arrastra y rota el espejo central del canvas para guiar el haz láser de luz sagrada hasta el receptor rojo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid14_angulo')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid14_angulo':
                return {
                    title: "Ángulo Imposible 📐📡",
                    emoji: "📐",
                    instructions: "Arrastra y rota el espejo central del canvas para guiar el haz láser de luz sagrada hasta el receptor rojo.",
                    goal: 2,
                    color: "#00e676"
                };
            case 'day_9_kid14_ave':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid14_angulo':
                this.inputAnguloPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid14_angulo':
                this.inputAnguloPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid14_angulo':
                this.inputAnguloPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Postura del Ave Dorada 🦅⚖️
- **Identificador de Misión:** `day_9_kid14_ave`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"Mantén el equilibrio del Fénix de oro. Pulsa a la izquierda/derecha para compensar la barra de balance y evitar que caiga."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid14_ave')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid14_ave':
                return {
                    title: "La Postura del Ave Dorada 🦅⚖️",
                    emoji: "🦅",
                    instructions: "Mantén el equilibrio del Fénix de oro. Pulsa a la izquierda/derecha para compensar la barra de balance y evitar que caiga.",
                    goal: 10,
                    color: "#ffd700"
                };
            case 'day_9_kid14_tunnel':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid14_ave':
                this.inputAvePress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid14_ave':
                this.inputAvePress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid14_ave':
                this.inputAvePress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Túnel Infinito ⛩️🕳️
- **Identificador de Misión:** `day_9_kid14_tunnel`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"Vuela a través del túnel interminable. Esquiva los arcos Torii rojos deslizándote a la izquierda/derecha y cruza los verdes."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_kid14_tunnel')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_kid14_tunnel':
                return {
                    title: "El Túnel Infinito ⛩️🕳️",
                    emoji: "⛩️",
                    instructions: "Vuela a través del túnel interminable. Esquiva los arcos Torii rojos deslizándote a la izquierda/derecha y cruza los verdes.",
                    goal: 15,
                    color: "#ff3d00"
                };
            case 'day_9_fam_portal':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_kid14_tunnel':
                this.inputTunnelPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_kid14_tunnel':
                this.inputTunnelPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_kid14_tunnel':
                this.inputTunnelPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 La Puerta a Otro Mundo ⛩️🌀
- **Identificador de Misión:** `day_9_fam_portal`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Toca las 4 gemas del portal Torii en la secuencia exacta en que parpadean para abrir la puerta de energía mística."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_9_fam_portal')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_9_fam_portal':
                return {
                    title: "La Puerta a Otro Mundo ⛩️🌀",
                    emoji: "🌀",
                    instructions: "Toca las 4 gemas del portal Torii en la secuencia exacta en que parpadean para abrir la puerta de energía mística.",
                    goal: 3,
                    color: "#ffd700"
                };
            case 'day_10_kid9_nishiki':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_9_fam_portal':
                this.inputFamPortalPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_9_fam_portal':
                this.inputFamPortalPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_9_fam_portal':
                this.inputFamPortalPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 10

### 🦊 Laura (Kid - 9 años)

#### 🎮 El Maestro del Bento 🍱🍣
- **Identificador de Misión:** `day_10_kid9_bento`
- **Puntuación Meta/Objetivo:** `4`
- **Instrucciones de Pantalla:** *"¡Prepara la caja Bento perfecta! Arrastra cada ingrediente desde la bandeja inferior hasta su compartimento correspondiente."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid9_bento')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid9_bento':
                return {
                    title: "El Maestro del Bento 🍱🍣",
                    emoji: "🍱",
                    instructions: "¡Prepara la caja Bento perfecta! Arrastra cada ingrediente desde la bandeja inferior hasta su compartimento correspondiente.",
                    goal: 4,
                    color: "#c0392b"
                };
            case 'day_10_kid14_crypto':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid9_bento': this.inputBentoPressDay10(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid9_bento': this.inputBentoPressDay10(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid9_bento': this.inputBentoPressDay10(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `4` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Maestro Chatarra 🍤🧺
- **Identificador de Misión:** `day_10_kid9_nishiki`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"Recoge los deliciosos mariscos 🍤 y mochis 🍡 desplazando la cesta con el ratón. Evita recoger las latas y basura."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid9_nishiki')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid9_nishiki':
                return {
                    title: "Maestro Chatarra 🍤🧺",
                    emoji: "🧺",
                    instructions: "Recoge los deliciosos mariscos 🍤 y mochis 🍡 desplazando la cesta con el ratón. Evita recoger las latas y basura.",
                    goal: 15,
                    color: "#f7c948"
                };
            case 'day_10_kid9_dragon':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid9_nishiki':
                this.setupNishiki();
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid9_nishiki':
                this.setupNishiki();
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid9_nishiki':
                this.setupNishiki();
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Dragón del Mercado 🐉🍎
- **Identificador de Misión:** `day_10_kid9_dragon`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"Guía al dragón del festival para comer linternas. ¡Cada linterna lo hará más largo! Evita chocar contra los bordes de la pantalla."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid9_dragon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid9_dragon':
                return {
                    title: "El Dragón del Mercado 🐉🍎",
                    emoji: "🐉",
                    instructions: "Guía al dragón del festival para comer linternas. ¡Cada linterna lo hará más largo! Evita chocar contra los bordes de la pantalla.",
                    goal: 10,
                    color: "#ff5722"
                };
            case 'day_10_kid9_rainbow':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid9_dragon': this.inputDragonPressDay10(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid9_dragon': this.inputDragonPressDay10(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid9_dragon': this.inputDragonPressDay10(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Snack Arcoíris 🍡🌈
- **Identificador de Misión:** `day_10_kid9_rainbow`
- **Puntuación Meta/Objetivo:** `12`
- **Instrucciones de Pantalla:** *"Arrastra rápidamente cada snack (rosa, verde o amarillo) al plato de su color correspondiente antes de que toquen el suelo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid9_rainbow')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid9_rainbow':
                return {
                    title: "El Snack Arcoíris 🍡🌈",
                    emoji: "🌈",
                    instructions: "Arrastra rápidamente cada snack (rosa, verde o amarillo) al plato de su color correspondiente antes de que toquen el suelo.",
                    goal: 12,
                    color: "#e91e63"
                };
            case 'day_10_kid9_matcha':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid9_rainbow':
                this.inputRainbowPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid9_rainbow':
                this.inputRainbowPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid9_rainbow':
                this.inputRainbowPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `12` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Poción de Matcha 🍵🥄
- **Identificador de Misión:** `day_10_kid9_matcha`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"Mueve el batidor de bambú arrastrando rápidamente de izquierda a derecha de forma continua para levantar espuma en el té."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid9_matcha')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid9_matcha':
                return {
                    title: "Poción de Matcha 🍵🥄",
                    emoji: "🍵",
                    instructions: "Mueve el batidor de bambú arrastrando rápidamente de izquierda a derecha de forma continua para levantar espuma en el té.",
                    goal: 100,
                    color: "#4caf50"
                };
            case 'day_10_kid14_milla':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid9_matcha':
                this.setupMatcha();
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid9_matcha':
                this.setupMatcha();
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid9_matcha':
                this.setupMatcha();
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Enlace Cifrado del Shinobi 🔒💻
- **Identificador de Misión:** `day_10_kid14_crypto`
- **Puntuación Meta/Objetivo:** `11`
- **Instrucciones de Pantalla:** *"¡Hackea la terminal de acceso! Pulsa o dispara a las letras flotantes correctas en orden para deletrear la clave: KYOTO_ANNEX."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid14_crypto')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid14_crypto':
                return {
                    title: "Enlace Cifrado del Shinobi 🔒💻",
                    emoji: "🔒",
                    instructions: "¡Hackea la terminal de acceso! Pulsa o dispara a las letras flotantes correctas en orden para deletrear la clave: KYOTO_ANNEX.",
                    goal: 11,
                    color: "#00e5ff"
                };
            case 'day_8_kid9_pose':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid14_crypto': this.inputCryptoPressDay10(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid14_crypto': this.inputCryptoPressDay10(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid14_crypto': this.inputCryptoPressDay10(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `11` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Milla del Samurái 🏃⚔️
- **Identificador de Misión:** `day_10_kid14_milla`
- **Puntuación Meta/Objetivo:** `300`
- **Instrucciones de Pantalla:** *"¡Carrera de entrenamiento samurái! Pulsa la pantalla para saltar sobre los barriles y carros en Nishiki Market."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid14_milla')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid14_milla':
                return {
                    title: "La Milla del Samurái 🏃⚔️",
                    emoji: "⚔️",
                    instructions: "¡Carrera de entrenamiento samurái! Pulsa la pantalla para saltar sobre los barriles y carros en Nishiki Market.",
                    goal: 300,
                    color: "#e91e63"
                };
            case 'day_10_kid14_tako':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid14_milla':
                this.inputMillaPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid14_milla':
                this.inputMillaPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid14_milla':
                this.inputMillaPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `300` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Comida Bizarra 🐙🍢
- **Identificador de Misión:** `day_10_kid14_tako`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Ensarta los pulpos en Nishiki! Golpea (haz click) sobre los pulpos bebé que asoman de las cajas antes de que vuelvan a esconderse."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_kid14_tako')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_kid14_tako':
                return {
                    title: "Comida Bizarra 🐙🍢",
                    emoji: "🐙",
                    instructions: "¡Ensarta los pulpos en Nishiki! Golpea (haz click) sobre los pulpos bebé que asoman de las cajas antes de que vuelvan a esconderse.",
                    goal: 15,
                    color: "#bf360c"
                };
            case 'day_10_fam_sayonara':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_kid14_tako':
                this.inputTakoPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_kid14_tako':
                this.inputTakoPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_kid14_tako':
                this.inputTakoPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Sayonara Kioto 🌸🧩
- **Identificador de Misión:** `day_10_fam_sayonara`
- **Puntuación Meta/Objetivo:** `6`
- **Instrucciones de Pantalla:** *"Encuentra las parejas de cartas memorizando sus posiciones. Toca las cartas de dos en dos para descubrir los iconos iguales."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_10_fam_sayonara')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_10_fam_sayonara':
                return {
                    title: "Sayonara Kioto 🌸🧩",
                    emoji: "🌸",
                    instructions: "Encuentra las parejas de cartas memorizando sus posiciones. Toca las cartas de dos en dos para descubrir los iconos iguales.",
                    goal: 6,
                    color: "#ff8a80"
                };
            // DIA 11
            case 'day_11_onsen':
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_10_fam_sayonara':
                this.inputSayonaraPress(x, y);
                break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_10_fam_sayonara':
                this.inputSayonaraPress(x, y);
                break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_10_fam_sayonara':
                this.inputSayonaraPress(x, y);
                break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `6` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 11

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 El Código Onsen ♨️🧼
- **Identificador de Misión:** `day_11_onsen`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Ducha a Laura frotando la suciedad y ajusta las válvulas (caliente izquierda, fría derecha) para mantener la temperatura entre 40°C y 42°C!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_onsen')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_onsen':
                return { title: "El Código Onsen ♨️🧼", emoji: "♨️", instructions: "¡Ducha a Laura frotando la suciedad y ajusta las válvulas (caliente izquierda, fría derecha) para mantener la temperatura entre 40°C y 42°C!", goal: 100, color: "#4facfe" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_onsen': this.inputOnsenPress(x, y); break;
            case 'day_11_yukata': this.inputYukataPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_onsen': this.inputOnsenPress(x, y); break;
            case 'day_11_yukata': this.inputYukataPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_onsen': this.inputOnsenPress(x, y); break;
            case 'day_11_yukata': this.inputYukataPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Té Intacto 🍵⚖️
- **Identificador de Misión:** `day_11_tea`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"Mueve el dedo/ratón para equilibrar la bandeja de matcha. ¡Evita que el tazón se caiga con las ráfagas de viento!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_tea')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_tea':
                return { title: "El Té Intacto 🍵⚖️", emoji: "🍵", instructions: "Mueve el dedo/ratón para equilibrar la bandeja de matcha. ¡Evita que el tazón se caiga con las ráfagas de viento!", goal: 100, color: "#8a9a5b" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_tea': this.setupTeaDay11(); break;
            case 'day_11_yukata': this.setupYukata(); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_tea': this.setupTeaDay11(); break;
            case 'day_11_yukata': this.setupYukata(); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_tea': this.setupTeaDay11(); break;
            case 'day_11_yukata': this.setupYukata(); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Cazadora de Yukatas 👘🔎
- **Identificador de Misión:** `day_11_yukata`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"Toca únicamente a las personas que lleven yukatas tradicionales. ¡Cuidado con los turistas y los traviesos monos!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_yukata')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_yukata':
                return { title: "Cazadora de Yukatas 👘🔎", emoji: "👘", instructions: "Toca únicamente a las personas que lleven yukatas tradicionales. ¡Cuidado con los turistas y los traviesos monos!", goal: 10, color: "#f50057" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_yukata': this.inputYukataPress(x, y); break;
            case 'day_11_tatami': this.inputTatamiPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_yukata': this.inputYukataPress(x, y); break;
            case 'day_11_tatami': this.inputTatamiPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_yukata': this.inputYukataPress(x, y); break;
            case 'day_11_tatami': this.inputTatamiPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Textura del Tatami 🟫🧩
- **Identificador de Misión:** `day_11_tatami`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Cubre toda la habitación arrastrando los tatamis (2x1). Toca un tatami para rotarlo. Evita solapamientos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_tatami')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_tatami':
                return { title: "La Textura del Tatami 🟫🧩", emoji: "🟫", instructions: "Cubre toda la habitación arrastrando los tatamis (2x1). Toca un tatami para rotarlo. Evita solapamientos.", goal: 1, color: "#d2b48c" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_tatami': this.inputTatamiPress(x, y); break;
            case 'day_11_kaiseki': this.inputKaisekiPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_tatami': this.inputTatamiPress(x, y); break;
            case 'day_11_kaiseki': this.inputKaisekiPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_tatami': this.inputTatamiPress(x, y); break;
            case 'day_11_kaiseki': this.inputKaisekiPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Catador de Kaiseki 🍱🧠
- **Identificador de Misión:** `day_11_kaiseki`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Memoria Kaiseki: observa el orden de los platos tradicionales y, cuando desaparezcan, colócalos en la posición correcta."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_kaiseki')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_kaiseki':
                return { title: "Catador de Kaiseki 🍱🧠", emoji: "🍱", instructions: "Memoria Kaiseki: observa el orden de los platos tradicionales y, cuando desaparezcan, colócalos en la posición correcta.", goal: 3, color: "#ff9100" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_kaiseki': this.inputKaisekiPress(x, y); break;
            case 'day_11_spring': this.inputSpringPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_kaiseki': this.inputKaisekiPress(x, y); break;
            case 'day_11_spring': this.inputSpringPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_kaiseki': this.inputKaisekiPress(x, y); break;
            case 'day_11_spring': this.inputSpringPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Rastreador de Manantiales 📡🔥
- **Identificador de Misión:** `day_11_spring`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Pulsa en el mapa de Okuhida para enviar señales de sonar. Encuentra los 3 puntos de calor volcánico."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_spring')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_spring':
                return { title: "Rastreador de Manantiales 📡🔥", emoji: "📡", instructions: "Pulsa en el mapa de Okuhida para enviar señales de sonar. Encuentra los 3 puntos de calor volcánico.", goal: 3, color: "#00e676" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_spring': this.inputSpringPress(x, y); break;
            case 'day_11_architecture': this.inputArchitecturePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_spring': this.inputSpringPress(x, y); break;
            case 'day_11_architecture': this.inputArchitecturePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_spring': this.inputSpringPress(x, y); break;
            case 'day_11_architecture': this.inputArchitecturePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Arquitectura Termal 🎋💧
- **Identificador de Misión:** `day_11_architecture`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Une las tuberías de bambú rotándolas para hacer fluir el agua termal de la cascada hacia el baño de madera."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_architecture')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_architecture':
                return { title: "Arquitectura Termal 🎋💧", emoji: "🎋", instructions: "Une las tuberías de bambú rotándolas para hacer fluir el agua termal de la cascada hacia el baño de madera.", goal: 1, color: "#4db6ac" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_architecture': this.inputArchitecturePress(x, y); break;
            case 'day_11_economy': this.inputEconomyPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_architecture': this.inputArchitecturePress(x, y); break;
            case 'day_11_economy': this.inputEconomyPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_architecture': this.inputArchitecturePress(x, y); break;
            case 'day_11_economy': this.inputEconomyPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Economía Alpina 💰🏪
- **Identificador de Misión:** `day_11_economy`
- **Puntuación Meta/Objetivo:** `1000`
- **Instrucciones de Pantalla:** *"Ryokan Tycoon: compra carbón para las calderas y hospeda a los clientes rápidamente para ganar 1000¥."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_economy')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_economy':
                return { title: "Economía Alpina 💰🏪", emoji: "💰", instructions: "Ryokan Tycoon: compra carbón para las calderas y hospeda a los clientes rápidamente para ganar 1000¥.", goal: 1000, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_economy': this.inputEconomyPress(x, y); break;
            case 'day_11_geta': this.inputGetaPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_economy': this.inputEconomyPress(x, y); break;
            case 'day_11_geta': this.inputGetaPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_economy': this.inputEconomyPress(x, y); break;
            case 'day_11_geta': this.inputGetaPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1000` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Equilibrio del Yukata 👣👡
- **Identificador de Misión:** `day_11_geta`
- **Puntuación Meta/Objetivo:** `40`
- **Instrucciones de Pantalla:** *"Toca los pies alternativamente siguiendo el ritmo y mantén la aguja de equilibrio al centro."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_11_geta')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_11_geta':
                return { title: "El Equilibrio del Yukata 👣👡", emoji: "👣", instructions: "Toca los pies alternativamente siguiendo el ritmo y mantén la aguja de equilibrio al centro.", goal: 40, color: "#8d6e63" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_11_geta': this.inputGetaPress(x, y); break;
            // DIA 12
            case 'day_12_sugidama': this.inputSugidamaPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_11_geta': this.inputGetaPress(x, y); break;
            // DIA 12
            case 'day_12_sugidama': this.inputSugidamaPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_11_geta': this.inputGetaPress(x, y); break;
            // DIA 12
            case 'day_12_sugidama': this.inputSugidamaPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `40` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 12

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Silencio de los Kami 😴🌲
- **Identificador de Misión:** `day_12_silence`
- **Puntuación Meta/Objetivo:** `200`
- **Instrucciones de Pantalla:** *"Mantén pulsado para correr. Suelta cuando los picos de sonido suban o cuando pases cerca de un Kami durmiente."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_silence')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_silence':
                return { title: "Silencio de los Kami 😴🌲", emoji: "🌲", instructions: "Mantén pulsado para correr. Suelta cuando los picos de sonido suban o cuando pases cerca de un Kami durmiente.", goal: 200, color: "#2e7d32" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_silence': this.setupSilenceDay12(); break;
            case 'day_12_sugidama': this.setupSugidama(); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_silence': this.setupSilenceDay12(); break;
            case 'day_12_sugidama': this.setupSugidama(); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_silence': this.setupSilenceDay12(); break;
            case 'day_12_sugidama': this.setupSugidama(); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `200` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Bola de Cedro 🟤✂️
- **Identificador de Misión:** `day_12_sugidama`
- **Puntuación Meta/Objetivo:** `95`
- **Instrucciones de Pantalla:** *"Recorta el arbusto de cedro para darle una forma esférica perfecta. Poda las hojas salientes."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_sugidama')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_sugidama':
                return { title: "La Bola de Cedro 🟤✂️", emoji: "🟤", instructions: "Recorta el arbusto de cedro para darle una forma esférica perfecta. Poda las hojas salientes.", goal: 95, color: "#795548" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_sugidama': this.inputSugidamaPress(x, y); break;
            case 'day_12_wood': this.inputWoodPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_sugidama': this.inputSugidamaPress(x, y); break;
            case 'day_12_wood': this.inputWoodPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_sugidama': this.inputSugidamaPress(x, y); break;
            case 'day_12_wood': this.inputWoodPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `95` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Detective de Madera 🐅🧩
- **Identificador de Misión:** `day_12_wood`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"Restaura la talla de madera tradicional de Takayama rotando las piezas hasta revelar el relieve animal."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_wood')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_wood':
                return { title: "Detective de Madera 🐅🧩", emoji: "🐅", instructions: "Restaura la talla de madera tradicional de Takayama rotando las piezas hasta revelar el relieve animal.", goal: 2, color: "#8d6e63" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_wood': this.inputWoodPress(x, y); break;
            case 'day_12_hida': this.inputHidaPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_wood': this.inputWoodPress(x, y); break;
            case 'day_12_hida': this.inputHidaPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_wood': this.inputWoodPress(x, y); break;
            case 'day_12_hida': this.inputHidaPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Degustadora de Hida 🥩🔥
- **Identificador de Misión:** `day_12_hida`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"Cocina Wagyu de Hida. Coloca en la parrilla, voltéalas cuando estén doradas y sírvelas en su punto exacto."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_hida')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_hida':
                return { title: "Degustadora de Hida 🥩🔥", emoji: "🥩", instructions: "Cocina Wagyu de Hida. Coloca en la parrilla, voltéalas cuando estén doradas y sírvelas en su punto exacto.", goal: 5, color: "#ff3d00" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_hida': this.inputHidaPress(x, y); break;
            case 'day_12_carving': this.inputCarvingPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_hida': this.inputHidaPress(x, y); break;
            case 'day_12_carving': this.inputCarvingPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_hida': this.inputHidaPress(x, y); break;
            case 'day_12_carving': this.inputCarvingPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Talla en Madera 🪓木
- **Identificador de Misión:** `day_12_carving`
- **Puntuación Meta/Objetivo:** `85`
- **Instrucciones de Pantalla:** *"Cincela el tronco golpeándolo para esculpir la forma del kanji sagrado de la madera: 木."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_carving')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_carving':
                return { title: "Talla en Madera 🪓木", emoji: "🪓", instructions: "Cincela el tronco golpeándolo para esculpir la forma del kanji sagrado de la madera: 木.", goal: 85, color: "#5c4033" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_carving': this.inputCarvingPress(x, y); break;
            case 'day_12_sake': this.inputSakePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_carving': this.inputCarvingPress(x, y); break;
            case 'day_12_sake': this.inputSakePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_carving': this.inputCarvingPress(x, y); break;
            case 'day_12_sake': this.inputSakePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `85` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Maestro Destilador 🍶🌡️
- **Identificador de Misión:** `day_12_sake`
- **Puntuación Meta/Objetivo:** `20`
- **Instrucciones de Pantalla:** *"Recoge arroz y levadura con tu cuba y controla las válvulas de vapor para fermentar el sake en su temperatura ideal."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_sake')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_sake':
                return { title: "Maestro Destilador 🍶🌡️", emoji: "🍶", instructions: "Recoge arroz y levadura con tu cuba y controla las válvulas de vapor para fermentar el sake en su temperatura ideal.", goal: 20, color: "#3f51b5" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_sake': this.inputSakePress(x, y); break;
            case 'day_12_patrol': this.inputPatrolPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_sake': this.inputSakePress(x, y); break;
            case 'day_12_patrol': this.inputPatrolPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_sake': this.inputSakePress(x, y); break;
            case 'day_12_patrol': this.inputPatrolPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `20` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Patrulla Sanmachi Suji 🚲🛢️
- **Identificador de Misión:** `day_12_patrol`
- **Puntuación Meta/Objetivo:** `500`
- **Instrucciones de Pantalla:** *"Esquiva barriles y obstáculos en tu bicicleta cambiando de carril, y limpia las calles feudales de Takayama."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_patrol')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_patrol':
                return { title: "Patrulla Sanmachi Suji 🚲🛢️", emoji: "🚲", instructions: "Esquiva barriles y obstáculos en tu bicicleta cambiando de carril, y limpia las calles feudales de Takayama.", goal: 500, color: "#455a64" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_patrol': this.inputPatrolPress(x, y); break;
            case 'day_12_appraisal': this.inputAppraisalPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_patrol': this.inputPatrolPress(x, y); break;
            case 'day_12_appraisal': this.inputAppraisalPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_patrol': this.inputPatrolPress(x, y); break;
            case 'day_12_appraisal': this.inputAppraisalPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `500` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Tasador Feudal ⚖️🏡
- **Identificador de Misión:** `day_12_appraisal`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Coloca las monedas Koban en la balanza para tasar correctamente el coste de restauración del patrimonio."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_appraisal')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_appraisal':
                return { title: "Tasador Feudal ⚖️🏡", emoji: "🏡", instructions: "Coloca las monedas Koban en la balanza para tasar correctamente el coste de restauración del patrimonio.", goal: 3, color: "#ffb300" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_appraisal': this.inputAppraisalPress(x, y); break;
            case 'day_12_bridge': this.inputBridgePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_appraisal': this.inputAppraisalPress(x, y); break;
            case 'day_12_bridge': this.inputBridgePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_appraisal': this.inputAppraisalPress(x, y); break;
            case 'day_12_bridge': this.inputBridgePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Cruzando el Miyagawa 🌉 logs
- **Identificador de Misión:** `day_12_bridge`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Miyagawa Crossing: ayuda a Laura e Iván a saltar sobre los troncos flotantes hasta llegar a la otra orilla."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_12_bridge')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_12_bridge':
                return { title: "Cruzando el Miyagawa 🌉 logs", emoji: "🌉", instructions: "Miyagawa Crossing: ayuda a Laura e Iván a saltar sobre los troncos flotantes hasta llegar a la otra orilla.", goal: 1, color: "#e53935" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_12_bridge': this.inputBridgePress(x, y); break;
            // DIA 13
            case 'day_13_stairs': this.inputStairsPressDay13(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_12_bridge': this.inputBridgePress(x, y); break;
            // DIA 13
            case 'day_13_stairs': this.inputStairsPressDay13(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_12_bridge': this.inputBridgePress(x, y); break;
            // DIA 13
            case 'day_13_stairs': this.inputStairsPressDay13(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 13

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 La Escalada Chureito ⛩️🏃‍♀️
- **Identificador de Misión:** `day_13_stairs`
- **Puntuación Meta/Objetivo:** `398`
- **Instrucciones de Pantalla:** *"Sube los 398 escalones hacia la Pagoda. Salta grietas y monos que tiran piñas (toca dos veces para doble salto)."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_stairs')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_stairs':
                return { title: "La Escalada Chureito ⛩️🏃‍♀️", emoji: "⛩️", instructions: "Sube los 398 escalones hacia la Pagoda. Salta grietas y monos que tiran piñas (toca dos veces para doble salto).", goal: 398, color: "#00b0ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_stairs': this.inputStairsPressDay13(x, y); break;
            case 'day_13_manhole': this.inputManholePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_stairs': this.inputStairsPressDay13(x, y); break;
            case 'day_13_manhole': this.inputManholePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_stairs': this.inputStairsPressDay13(x, y); break;
            case 'day_13_manhole': this.inputManholePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `398` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Sello del Lago 🎨🎨
- **Identificador de Misión:** `day_13_manhole`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"Colorea la alcantarilla de Kawaguchiko. Moja tu rodillo y pinta cada sección con su esmalte correspondiente."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_manhole')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_manhole':
                return { title: "El Sello del Lago 🎨🎨", emoji: "🎨", instructions: "Colorea la alcantarilla de Kawaguchiko. Moja tu rodillo y pinta cada sección con su esmalte correspondiente.", goal: 100, color: "#ab47bc" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_manhole': this.inputManholePress(x, y); break;
            case 'day_13_icecream': this.inputIcecreamPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_manhole': this.inputManholePress(x, y); break;
            case 'day_13_icecream': this.inputIcecreamPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_manhole': this.inputManholePress(x, y); break;
            case 'day_13_icecream': this.inputIcecreamPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Helados Exóticos 🍦🗼
- **Identificador de Misión:** `day_13_icecream`
- **Puntuación Meta/Objetivo:** `6`
- **Instrucciones de Pantalla:** *"Apila bolas de helado de wasabi y lavanda en el cono. Mantén el centro de gravedad alineado para no caer."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_icecream')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_icecream':
                return { title: "Helados Exóticos 🍦🗼", emoji: "🍦", instructions: "Apila bolas de helado de wasabi y lavanda en el cono. Mantén el centro de gravedad alineado para no caer.", goal: 6, color: "#f06292" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_icecream': this.inputIcecreamPress(x, y); break;
            case 'day_13_yokai': this.inputYokaiPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_icecream': this.inputIcecreamPress(x, y); break;
            case 'day_13_yokai': this.inputYokaiPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_icecream': this.inputIcecreamPress(x, y); break;
            case 'day_13_yokai': this.inputYokaiPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `6` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Filtro de Yōkai 👻🔎
- **Identificador de Misión:** `day_13_yokai`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"Mueve tu visor espectral para revelar a los Yokai invisibles en el bosque y tócalos para sellarlos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_yokai')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_yokai':
                return { title: "Filtro de Yōkai 👻🔎", emoji: "👻", instructions: "Mueve tu visor espectral para revelar a los Yokai invisibles en el bosque y tócalos para sellarlos.", goal: 5, color: "#7c4dff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_yokai': this.inputYokaiPress(x, y); break;
            case 'day_13_perspective': this.inputPerspectivePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_yokai': this.inputYokaiPress(x, y); break;
            case 'day_13_perspective': this.inputPerspectivePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_yokai': this.inputYokaiPress(x, y); break;
            case 'day_13_perspective': this.inputPerspectivePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Perspectiva del Gigante 🗻🧍
- **Identificador de Misión:** `day_13_perspective`
- **Puntuación Meta/Objetivo:** `90`
- **Instrucciones de Pantalla:** *"Ajusta la posición y zoom de la foto para alinear a Laura con el Monte Fuji y lograr un efecto óptico."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_perspective')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_perspective':
                return { title: "Perspectiva del Gigante 🗻🧍", emoji: "🗻", instructions: "Ajusta la posición y zoom de la foto para alinear a Laura con el Monte Fuji y lograr un efecto óptico.", goal: 90, color: "#00ffff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_perspective': this.inputPerspectivePress(x, y); break;
            case 'day_13_tunnels': this.inputTunnelsPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_perspective': this.inputPerspectivePress(x, y); break;
            case 'day_13_tunnels': this.inputTunnelsPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_perspective': this.inputPerspectivePress(x, y); break;
            case 'day_13_tunnels': this.inputTunnelsPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `90` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Navegantes del Asfalto 🚗⚡
- **Identificador de Misión:** `day_13_tunnels`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Conduce por la autopista del Fuji. Esquiva barreras en la oscuridad y recoge cargas de batería de neón."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_tunnels')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_tunnels':
                return { title: "Navegantes del Asfalto 🚗⚡", emoji: "🚗", instructions: "Conduce por la autopista del Fuji. Esquiva barreras en la oscuridad y recoge cargas de batería de neón.", goal: 3, color: "#1de9b6" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_tunnels': this.inputTunnelsPress(x, y); break;
            case 'day_13_volcano': this.inputVolcanoPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_tunnels': this.inputTunnelsPress(x, y); break;
            case 'day_13_volcano': this.inputVolcanoPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_tunnels': this.inputTunnelsPress(x, y); break;
            case 'day_13_volcano': this.inputVolcanoPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Análisis Vulcanológico 🌋🎈
- **Identificador de Misión:** `day_13_volcano`
- **Puntuación Meta/Objetivo:** `30`
- **Instrucciones de Pantalla:** *"Pop/elimina las burbujas de gas en la cámara de magma y abre las válvulas para que la presión no llegue al 100%."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_volcano')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_volcano':
                return { title: "Análisis Vulcanológico 🌋🎈", emoji: "🌋", instructions: "Pop/elimina las burbujas de gas en la cámara de magma y abre las válvulas para que la presión no llegue al 100%.", goal: 30, color: "#d50000" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_volcano': this.inputVolcanoPress(x, y); break;
            case 'day_13_triangulation': this.inputTriangulationPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_volcano': this.inputVolcanoPress(x, y); break;
            case 'day_13_triangulation': this.inputTriangulationPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_volcano': this.inputVolcanoPress(x, y); break;
            case 'day_13_triangulation': this.inputTriangulationPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `30` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Triangulación del Fuji 📡💻
- **Identificador de Misión:** `day_13_triangulation`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Ajusta las antenas de los 3 satélites para que sus haces de microondas confluyan exactamente en la cima del Fuji."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_triangulation')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_triangulation':
                return { title: "Triangulación del Fuji 📡💻", emoji: "📡", instructions: "Ajusta las antenas de los 3 satélites para que sus haces de microondas confluyan exactamente en la cima del Fuji.", goal: 1, color: "#2979ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_triangulation': this.inputTriangulationPress(x, y); break;
            case 'day_13_oishi': this.inputOishiPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_triangulation': this.inputTriangulationPress(x, y); break;
            case 'day_13_oishi': this.inputOishiPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_triangulation': this.inputTriangulationPress(x, y); break;
            case 'day_13_oishi': this.inputOishiPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Oishi Park en Flor 🌸📸
- **Identificador de Misión:** `day_13_oishi`
- **Puntuación Meta/Objetivo:** `80`
- **Instrucciones de Pantalla:** *"Espera a que se vayan las nubes del Fuji y cruce una mariposa para tomar la foto perfecta del parque en flor."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_13_oishi')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_13_oishi':
                return { title: "Oishi Park en Flor 🌸📸", emoji: "🌸", instructions: "Espera a que se vayan las nubes del Fuji y cruce una mariposa para tomar la foto perfecta del parque en flor.", goal: 80, color: "#7cb342" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_13_oishi': this.inputOishiPress(x, y); break;

            // DIA 14
            case 'day_14_rock': this.inputRockPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_13_oishi': this.inputOishiPress(x, y); break;

            // DIA 14
            case 'day_14_rock': this.inputRockPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_13_oishi': this.inputOishiPress(x, y); break;

            // DIA 14
            case 'day_14_rock': this.inputRockPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `80` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 14

### 🦊 Laura (Kid - 9 años)

#### 🎮 Eco del Silencio 🌲🤫
- **Identificador de Misión:** `day_14_kid9_echo`
- **Puntuación Meta/Objetivo:** `8`
- **Instrucciones de Pantalla:** *"Toca las zonas boscosas para silenciar y absorber la onda de sonido antes de que llegue al final."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_kid9_echo')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_kid9_echo':
                return { title: "Eco del Silencio 🌲🤫", emoji: "🤫", instructions: "Toca las zonas boscosas para silenciar y absorber la onda de sonido antes de que llegue al final.", goal: 8, color: "#2e7d32" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_kid9_echo': this.inputEchoPress(x, y); break;
            case 'day_14_root': this.inputRootPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_kid9_echo': this.inputEchoPress(x, y); break;
            case 'day_14_root': this.inputRootPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_kid9_echo': this.inputEchoPress(x, y); break;
            case 'day_14_root': this.inputRootPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `8` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 🐉 Iván (Teen - 14 años)

#### 🎮 Laberinto de Absorción 🥽🔇
- **Identificador de Misión:** `day_14_kid14_echo`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Coloca paneles absorbentes para atrapar y amortiguar el sonido en el laberinto de Aokigahara antes de que rebote."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_kid14_echo')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_kid14_echo':
                return { title: "Laberinto de Absorción 🥽🔇", emoji: "🔇", instructions: "Coloca paneles absorbentes para atrapar y amortiguar el sonido en el laberinto de Aokigahara antes de que rebote.", goal: 1, color: "#c8e6c9" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_kid14_echo': this.inputEcho2Press(x, y); break;
            case 'day_14_oxygen': this.inputOxygenPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_kid14_echo': this.inputEcho2Press(x, y); break;
            case 'day_14_oxygen': this.inputOxygenPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_kid14_echo': this.inputEcho2Press(x, y); break;
            case 'day_14_oxygen': this.inputOxygenPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Buscador de Magma 🌋🪨
- **Identificador de Misión:** `day_14_rock`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"Arrastra las piedras volcánicas a los contenedores superiores del mismo color (Amarillo, Naranja, Gris). ¡Evita tocar las burbujas de gas de azufre!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_rock')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_rock':
                return { title: "Buscador de Magma 🌋🪨", emoji: "🪨", instructions: "Arrastra las piedras volcánicas a los contenedores superiores del mismo color (Amarillo, Naranja, Gris). ¡Evita tocar las burbujas de gas de azufre!", goal: 10, color: "#ff5722" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_rock': this.inputRockPress(x, y); break;
            case 'day_14_kid9_echo': this.inputEchoPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_rock': this.inputRockPress(x, y); break;
            case 'day_14_kid9_echo': this.inputEchoPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_rock': this.inputRockPress(x, y); break;
            case 'day_14_kid9_echo': this.inputEchoPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Raíces del Guardián 🌳🌱
- **Identificador de Misión:** `day_14_root`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Dibuja el camino de la raíz para recoger las 3 esferas de agua y llegar al suelo fértil. ¡Esquiva rocas y lava!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_root')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_root':
                return { title: "Raíces del Guardián 🌳🌱", emoji: "🌱", instructions: "Dibuja el camino de la raíz para recoger las 3 esferas de agua y llegar al suelo fértil. ¡Esquiva rocas y lava!", goal: 1, color: "#81c784" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_root': this.inputRootPress(x, y); break;
            case 'day_14_compass': this.inputCompassPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_root': this.inputRootPress(x, y); break;
            case 'day_14_compass': this.inputCompassPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_root': this.inputRootPress(x, y); break;
            case 'day_14_compass': this.inputCompassPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Vuelo a la Cima 🗻🎈
- **Identificador de Misión:** `day_14_compass`
- **Puntuación Meta/Objetivo:** `6000`
- **Instrucciones de Pantalla:** *"Ajusta la brújula/dirección del viento para esquivar ráfagas y nubes de tormenta hasta alcanzar el cráter."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_compass')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_compass':
                return { title: "Vuelo a la Cima 🗻🎈", emoji: "🎈", instructions: "Ajusta la brújula/dirección del viento para esquivar ráfagas y nubes de tormenta hasta alcanzar el cráter.", goal: 6000, color: "#00bcd4" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_compass': this.inputCompassPress(x, y); break;
            case 'day_14_radar': this.inputRadarPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_compass': this.inputCompassPress(x, y); break;
            case 'day_14_radar': this.inputRadarPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_compass': this.inputCompassPress(x, y); break;
            case 'day_14_radar': this.inputRadarPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `6000` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Punto Ciego de Datos 📡🛰️
- **Identificador de Misión:** `day_14_radar`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"Mueve tu nodo para ocultarte en las sombras de los edificios y evitar los haces de los satélites mientras descargas datos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_radar')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_radar':
                return { title: "Punto Ciego de Datos 📡🛰️", emoji: "🛰️", instructions: "Mueve tu nodo para ocultarte en las sombras de los edificios y evitar los haces de los satélites mientras descargas datos.", goal: 100, color: "#00ff99" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_radar': this.inputRadarPress(x, y); break;
            case 'day_14_pressure': this.inputPressurePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_radar': this.inputRadarPress(x, y); break;
            case 'day_14_pressure': this.inputPressurePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_radar': this.inputRadarPress(x, y); break;
            case 'day_14_pressure': this.inputPressurePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Presurizador Alpino 🎒🎈
- **Identificador de Misión:** `day_14_pressure`
- **Puntuación Meta/Objetivo:** `20`
- **Instrucciones de Pantalla:** *"Toca las moléculas de aire calientes (rojo brillante) para enfriarlas y estabilizar la presión de la bolsa de patatas antes de que explote."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_pressure')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_pressure':
                return { title: "Presurizador Alpino 🎒🎈", emoji: "🎈", instructions: "Toca las moléculas de aire calientes (rojo brillante) para enfriarlas y estabilizar la presión de la bolsa de patatas antes de que explote.", goal: 20, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_pressure': this.inputPressurePress(x, y); break;
            case 'day_14_altimeter': this.inputAltimeterPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_pressure': this.inputPressurePress(x, y); break;
            case 'day_14_altimeter': this.inputAltimeterPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_pressure': this.inputPressurePress(x, y); break;
            case 'day_14_altimeter': this.inputAltimeterPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `20` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Hackeo de Altímetro 📟💻
- **Identificador de Misión:** `day_14_altimeter`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Ajusta las ondas de frecuencia para sintonizar el diferencial vertical exacto del Monte Fuji (1.476 metros)."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_altimeter')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_altimeter':
                return { title: "Hackeo de Altímetro 📟💻", emoji: "📟", instructions: "Ajusta las ondas de frecuencia para sintonizar el diferencial vertical exacto del Monte Fuji (1.476 metros).", goal: 3, color: "#00e5ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_altimeter': this.inputAltimeterPress(x, y); break;
            case 'day_14_kid14_echo': this.inputEcho2Press(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_altimeter': this.inputAltimeterPress(x, y); break;
            case 'day_14_kid14_echo': this.inputEcho2Press(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_altimeter': this.inputAltimeterPress(x, y); break;
            case 'day_14_kid14_echo': this.inputEcho2Press(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Sincronía de Apnea 🫁⏱️
- **Identificador de Misión:** `day_14_oxygen`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"Toca la pantalla cuando ambos pulmones en expansión coincidan exactamente en la zona verde central para sincronizar el oxígeno familiar."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_14_oxygen')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_14_oxygen':
                return { title: "Sincronía de Apnea 🫁⏱️", emoji: "🫁", instructions: "Toca la pantalla cuando ambos pulmones en expansión coincidan exactamente en la zona verde central para sincronizar el oxígeno familiar.", goal: 15, color: "#b2ebf2" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_14_oxygen': this.inputOxygenPress(x, y); break;
            // DIA 15
            case 'day_15_waterfall': this.inputWaterfallPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_14_oxygen': this.inputOxygenPress(x, y); break;
            // DIA 15
            case 'day_15_waterfall': this.inputWaterfallPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_14_oxygen': this.inputOxygenPress(x, y); break;
            // DIA 15
            case 'day_15_waterfall': this.inputWaterfallPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 15

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Arpa de Shiraito 🌊🎵
- **Identificador de Misión:** `day_15_waterfall`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"Desliza el dedo por las cuerdas de agua justo cuando las notas brillantes toquen la línea inferior para tocar la melodía."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_waterfall')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_waterfall':
                return { title: "Arpa de Shiraito 🌊🎵", emoji: "🎵", instructions: "Desliza el dedo por las cuerdas de agua justo cuando las notas brillantes toquen la línea inferior para tocar la melodía.", goal: 15, color: "#00acc1" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_waterfall': this.inputWaterfallPress(x, y); break;
            case 'day_15_thatch': this.inputThatchPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_waterfall': this.inputWaterfallPress(x, y); break;
            case 'day_15_thatch': this.inputThatchPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_waterfall': this.inputWaterfallPress(x, y); break;
            case 'day_15_thatch': this.inputThatchPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Techador de Shirakawa 🏠🌾
- **Identificador de Misión:** `day_15_thatch`
- **Puntuación Meta/Objetivo:** `8`
- **Instrucciones de Pantalla:** *"Suelta los fardos de paja oscilantes para construir el tejado inclinado. ¡Mantén el equilibrio a ambos lados!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_thatch')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_thatch':
                return { title: "Techador de Shirakawa 🏠🌾", emoji: "🌾", instructions: "Suelta los fardos de paja oscilantes para construir el tejado inclinado. ¡Mantén el equilibrio a ambos lados!", goal: 8, color: "#d2b48c" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_thatch': this.inputThatchPress(x, y); break;
            case 'day_15_fish': this.inputFishPressDay15(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_thatch': this.inputThatchPress(x, y); break;
            case 'day_15_fish': this.inputFishPressDay15(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_thatch': this.inputThatchPress(x, y); break;
            case 'day_15_fish': this.inputFishPressDay15(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `8` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Pez de Cristal 🐟💧
- **Identificador de Misión:** `day_15_fish`
- **Puntuación Meta/Objetivo:** `4`
- **Instrucciones de Pantalla:** *"Toca el agua para crear ondas y guiar suavemente a los peces koi hacia las zonas seguras brillantes de agua cristalina."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_fish')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_fish':
                return { title: "El Pez de Cristal 🐟💧", emoji: "🐟", instructions: "Toca el agua para crear ondas y guiar suavemente a los peces koi hacia las zonas seguras brillantes de agua cristalina.", goal: 4, color: "#e0f7fa" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_fish': this.inputFishPressDay15(x, y); break;
            case 'day_15_shogun': this.inputShogunPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_fish': this.inputFishPressDay15(x, y); break;
            case 'day_15_shogun': this.inputShogunPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_fish': this.inputFishPressDay15(x, y); break;
            case 'day_15_shogun': this.inputShogunPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `4` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Equilibrio del Shogun 👑🧘
- **Identificador de Misión:** `day_15_shogun`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"Laura Chibi debe meditar. Toca los objetos flotantes que caen para desviarlos y mantener el centro de gravedad del trono."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_shogun')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_shogun':
                return { title: "Equilibrio del Shogun 👑🧘", emoji: "👑", instructions: "Laura Chibi debe meditar. Toca los objetos flotantes que caen para desviarlos y mantener el centro de gravedad del trono.", goal: 15, color: "#d4af37" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_shogun': this.inputShogunPress(x, y); break;
            case 'day_15_deity': this.inputDeityPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_shogun': this.inputShogunPress(x, y); break;
            case 'day_15_deity': this.inputDeityPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_shogun': this.inputShogunPress(x, y); break;
            case 'day_15_deity': this.inputDeityPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Sello de los Cerezos 🌸⛩️
- **Identificador de Misión:** `day_15_deity`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"Traza una línea continua conectando los pétalos flotantes en el orden de las letras K-O-N-O-H-A-N-A para romper el sello."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_deity')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_deity':
                return { title: "Sello de los Cerezos 🌸⛩️", emoji: "⛩️", instructions: "Traza una línea continua conectando los pétalos flotantes en el orden de las letras K-O-N-O-H-A-N-A para romper el sello.", goal: 2, color: "#fbc02d" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_deity': this.inputDeityPress(x, y); break;
            case 'day_15_honcho': this.inputHonchoPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_deity': this.inputDeityPress(x, y); break;
            case 'day_15_honcho': this.inputHonchoPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_deity': this.inputDeityPress(x, y); break;
            case 'day_15_honcho': this.inputHonchoPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Encuadre de Perspectiva 📏📷
- **Identificador de Misión:** `day_15_honcho`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"Mueve y rota los diales de la cámara para enfocar el Fuji y alinear perfectamente la perspectiva lineal de la calle Honcho."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_honcho')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_honcho':
                return { title: "Encuadre de Perspectiva 📏📷", emoji: "📷", instructions: "Mueve y rota los diales de la cámara para enfocar el Fuji y alinear perfectamente la perspectiva lineal de la calle Honcho.", goal: 100, color: "#ffffff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_honcho': this.inputHonchoPress(x, y); break;
            case 'day_15_flow': this.inputFlowPressDay15(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_honcho': this.inputHonchoPress(x, y); break;
            case 'day_15_flow': this.inputFlowPressDay15(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_honcho': this.inputHonchoPress(x, y); break;
            case 'day_15_flow': this.inputFlowPressDay15(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Control de Caudal 🚰🌊
- **Identificador de Misión:** `day_15_flow`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"Regula las compuertas de salida de los tanques para mantener el nivel de agua en el punto medio estable sin desbordarse."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_flow')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_flow':
                return { title: "Control de Caudal 🚰🌊", emoji: "🚰", instructions: "Regula las compuertas de salida de los tanques para mantener el nivel de agua en el punto medio estable sin desbordarse.", goal: 15, color: "#009688" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_flow': this.inputFlowPressDay15(x, y); break;
            case 'day_15_roof': this.inputRoofPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_flow': this.inputFlowPressDay15(x, y); break;
            case 'day_15_roof': this.inputRoofPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_flow': this.inputFlowPressDay15(x, y); break;
            case 'day_15_roof': this.inputRoofPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Ingeniería de Nieve ❄️🏘️
- **Identificador de Misión:** `day_15_roof`
- **Puntuación Meta/Objetivo:** `20`
- **Instrucciones de Pantalla:** *"Ajusta la inclinación del tejado Gassho-zukuri para que la nieve resbale antes de que el peso colapse la estructura de paja."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_roof')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_roof':
                return { title: "Ingeniería de Nieve ❄️🏘️", emoji: "❄️", instructions: "Ajusta la inclinación del tejado Gassho-zukuri para que la nieve resbale antes de que el peso colapse la estructura de paja.", goal: 20, color: "#81c784" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_roof': this.inputRoofPress(x, y); break;
            case 'day_15_dragon': this.inputDragonPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_roof': this.inputRoofPress(x, y); break;
            case 'day_15_dragon': this.inputDragonPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_roof': this.inputRoofPress(x, y); break;
            case 'day_15_dragon': this.inputDragonPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `20` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Vuelo del Dragón 🐉🌊
- **Identificador de Misión:** `day_15_dragon`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"Controla al dragón de Kawaguchiko manteniéndolo pulsado para ascender y soltándolo para descender. Recoge 15 gemas de fuego."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_15_dragon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_15_dragon':
                return { title: "El Vuelo del Dragón 🐉🌊", emoji: "🐉", instructions: "Controla al dragón de Kawaguchiko manteniéndolo pulsado para ascender y soltándolo para descender. Recoge 15 gemas de fuego.", goal: 15, color: "#f57f17" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_15_dragon': this.inputDragonPress(x, y); break;
            // DIA 16
            case 'day_16_cat': this.inputCatPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_15_dragon': this.inputDragonPress(x, y); break;
            // DIA 16
            case 'day_16_cat': this.inputCatPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_15_dragon': this.inputDragonPress(x, y); break;
            // DIA 16
            case 'day_16_cat': this.inputCatPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 16

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Linterna del Neko 🐱🏮
- **Identificador de Misión:** `day_16_cat`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"Guía el foco de tu linterna japonesa en los callejones oscuros y toca a los gatitos ocultos cuando parpadeen."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_cat')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_cat':
                return { title: "Linterna del Neko 🐱🏮", emoji: "🏮", instructions: "Guía el foco de tu linterna japonesa en los callejones oscuros y toca a los gatitos ocultos cuando parpadeen.", goal: 5, color: "#efebe9" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_cat': this.inputCatPress(x, y); break;
            case 'day_16_skyscraper': this.inputSkyscraperPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_cat': this.inputCatPress(x, y); break;
            case 'day_16_skyscraper': this.inputSkyscraperPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_cat': this.inputCatPress(x, y); break;
            case 'day_16_skyscraper': this.inputSkyscraperPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Ascensor de la Torre 🏢⚡
- **Identificador de Misión:** `day_16_skyscraper`
- **Puntuación Meta/Objetivo:** `50`
- **Instrucciones de Pantalla:** *"Impulsa el ascensor de cristal a izquierda y derecha con los propulsores para mantenerlo en el riel central contra el viento."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_skyscraper')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_skyscraper':
                return { title: "Ascensor de la Torre 🏢⚡", emoji: "🏢", instructions: "Impulsa el ascensor de cristal a izquierda y derecha con los propulsores para mantenerlo en el riel central contra el viento.", goal: 50, color: "#c8e6c9" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_skyscraper': this.inputSkyscraperPress(x, y); break;
            case 'day_16_colors': this.inputColorsPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_skyscraper': this.inputSkyscraperPress(x, y); break;
            case 'day_16_colors': this.inputColorsPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_skyscraper': this.inputSkyscraperPress(x, y); break;
            case 'day_16_colors': this.inputColorsPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `50` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Mezclador de Neón 🎨⚡
- **Identificador de Misión:** `day_16_colors`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"Inyecta las proporciones exactas de colores primarios (Rojo, Verde, Azul) en los tubos para conseguir el tono del cartel solicitado."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_colors')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_colors':
                return { title: "Mezclador de Neón 🎨⚡", emoji: "⚡", instructions: "Inyecta las proporciones exactas de colores primarios (Rojo, Verde, Azul) en los tubos para conseguir el tono del cartel solicitado.", goal: 5, color: "#ff007f" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_colors': this.inputColorsPress(x, y); break;
            case 'day_16_traffic': this.inputTrafficPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_colors': this.inputColorsPress(x, y); break;
            case 'day_16_traffic': this.inputTrafficPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_colors': this.inputColorsPress(x, y); break;
            case 'day_16_traffic': this.inputTrafficPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Cruce Shibuya 🚦🚶
- **Identificador de Misión:** `day_16_traffic`
- **Puntuación Meta/Objetivo:** `12`
- **Instrucciones de Pantalla:** *"Dibuja caminos seguros para los peatones y dales prisa para cruzar antes de que giren los taxis de Tokio."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_traffic')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_traffic':
                return { title: "Cruce Shibuya 🚦🚶", emoji: "🚶", instructions: "Dibuja caminos seguros para los peatones y dales prisa para cruzar antes de que giren los taxis de Tokio.", goal: 12, color: "#ef5350" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_traffic': this.inputTrafficPress(x, y); break;
            case 'day_16_vortex': this.inputVortexPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_traffic': this.inputTrafficPress(x, y); break;
            case 'day_16_vortex': this.inputVortexPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_traffic': this.inputTrafficPress(x, y); break;
            case 'day_16_vortex': this.inputVortexPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `12` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Filtro Temporal 🌀⏰
- **Identificador de Misión:** `day_16_vortex`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Arrastra y rota el vórtice temporal para alinear la arquitectura tradicional de Edo con los edificios futuristas."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_vortex')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_vortex':
                return { title: "Filtro Temporal 🌀⏰", emoji: "🌀", instructions: "Arrastra y rota el vórtice temporal para alinear la arquitectura tradicional de Edo con los edificios futuristas.", goal: 3, color: "#00ff99" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_vortex': this.inputVortexPress(x, y); break;
            case 'day_16_combat': this.inputCombatPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_vortex': this.inputVortexPress(x, y); break;
            case 'day_16_combat': this.inputCombatPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_vortex': this.inputVortexPress(x, y); break;
            case 'day_16_combat': this.inputCombatPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Corte Kenjutsu ⚔️🤖
- **Identificador de Misión:** `day_16_combat`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"Desliza el dedo por la pantalla imitando los cortes vectoriales indicados (tajos horizontales, verticales y diagonales)."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_combat')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_combat':
                return { title: "Corte Kenjutsu ⚔️🤖", emoji: "⚔️", instructions: "Desliza el dedo por la pantalla imitando los cortes vectoriales indicados (tajos horizontales, verticales y diagonales).", goal: 10, color: "#00ffff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_combat': this.inputCombatPress(x, y); break;
            case 'day_16_shinjuku': this.inputShinjukuPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_combat': this.inputCombatPress(x, y); break;
            case 'day_16_shinjuku': this.inputShinjukuPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_combat': this.inputCombatPress(x, y); break;
            case 'day_16_shinjuku': this.inputShinjukuPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Escape de Shinjuku 🚶🏢
- **Identificador de Misión:** `day_16_shinjuku`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"Guía a tu grupo en el laberinto de la estación siguiendo las flechas amarillas y evitando la multitud contraria."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_shinjuku')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_shinjuku':
                return { title: "Escape de Shinjuku 🚶🏢", emoji: "🚶", instructions: "Guía a tu grupo en el laberinto de la estación siguiendo las flechas amarillas y evitando la multitud contraria.", goal: 1, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_shinjuku': this.inputShinjukuPress(x, y); break;
            case 'day_16_density': this.inputDensityPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_shinjuku': this.inputShinjukuPress(x, y); break;
            case 'day_16_density': this.inputDensityPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_shinjuku': this.inputShinjukuPress(x, y); break;
            case 'day_16_density': this.inputDensityPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Contador Shibuya 👥📊
- **Identificador de Misión:** `day_16_density`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"Observa la multitud que cruza y selecciona la estimación de personas del color indicado."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_density')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_density':
                return { title: "Contador Shibuya 👥📊", emoji: "📊", instructions: "Observa la multitud que cruza y selecciona la estimación de personas del color indicado.", goal: 5, color: "#81c784" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_density': this.inputDensityPress(x, y); break;
            case 'day_16_tocho': this.inputTochoPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_density': this.inputDensityPress(x, y); break;
            case 'day_16_tocho': this.inputTochoPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_density': this.inputDensityPress(x, y); break;
            case 'day_16_tocho': this.inputTochoPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Constelación de Tokio 🌃⭐
- **Identificador de Misión:** `day_16_tocho`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"Desde el mirador del Tocho, conecta las estrellas del cielo nocturno para dibujar las siluetas de monumentos tradicionales."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_16_tocho')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_16_tocho':
                return { title: "Constelación de Tokio 🌃⭐", emoji: "⭐", instructions: "Desde el mirador del Tocho, conecta las estrellas del cielo nocturno para dibujar las siluetas de monumentos tradicionales.", goal: 3, color: "#3f51b5" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_16_tocho': this.inputTochoPress(x, y); break;

            // DIA 17
            case 'day_17_omikuji': this.inputOmikujiPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_16_tocho': this.inputTochoPress(x, y); break;

            // DIA 17
            case 'day_17_omikuji': this.inputOmikujiPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_16_tocho': this.inputTochoPress(x, y); break;

            // DIA 17
            case 'day_17_omikuji': this.inputOmikujiPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 17

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Destino Omikuji ⛩️🔮
- **Identificador de Misión:** `day_17_omikuji`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Agita la caja tradicional de madera! Arrastra/desliza la caja rápidamente a los lados para sacar los palos de la suerte. Si obtienes Mala Suerte, átalo al poste para ahuyentar la mala fortuna."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_omikuji')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_omikuji':
                return { title: "Destino Omikuji ⛩️🔮", emoji: "🔮", instructions: "¡Agita la caja tradicional de madera! Arrastra/desliza la caja rápidamente a los lados para sacar los palos de la suerte. Si obtienes Mala Suerte, átalo al poste para ahuyentar la mala fortuna.", goal: 3, color: "#e53935" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_omikuji': this.inputOmikujiPress(x, y); break;
            case 'day_17_incense': this.inputIncensePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_omikuji': this.inputOmikujiPress(x, y); break;
            case 'day_17_incense': this.inputIncensePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_omikuji': this.inputOmikujiPress(x, y); break;
            case 'day_17_incense': this.inputIncensePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Humo de la Fortuna 💨✨
- **Identificador de Misión:** `day_17_incense`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Báñate en el humo sagrado del Jokoro! Mueve a Laura de lado a lado para recolectar las partículas de humo flotantes. Esquiva las cenizas rojas calientes."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_incense')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_incense':
                return { title: "Humo de la Fortuna 💨✨", emoji: "✨", instructions: "¡Báñate en el humo sagrado del Jokoro! Mueve a Laura de lado a lado para recolectar las partículas de humo flotantes. Esquiva las cenizas rojas calientes.", goal: 100, color: "#78909c" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_incense': this.inputIncensePress(x, y); break;
            case 'day_17_gashapon': this.inputGashaponPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_incense': this.inputIncensePress(x, y); break;
            case 'day_17_gashapon': this.inputGashaponPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_incense': this.inputIncensePress(x, y); break;
            case 'day_17_gashapon': this.inputGashaponPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Gashapon Perfecto 🎰🎁
- **Identificador de Misión:** `day_17_gashapon`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Gira la manivela para conseguir cápsulas! Arrastra en círculos para rotar el dial 360 grados. Luego abre la cápsula para revelar tu figura coleccionable."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_gashapon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_gashapon':
                return { title: "Gashapon Perfecto 🎰🎁", emoji: "🎰", instructions: "¡Gira la manivela para conseguir cápsulas! Arrastra en círculos para rotar el dial 360 grados. Luego abre la cápsula para revelar tu figura coleccionable.", goal: 3, color: "#ec407a" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_gashapon': this.inputGashaponPress(x, y); break;
            case 'day_17_p2p_receiver': this.inputP2PReceiverPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_gashapon': this.inputGashaponPress(x, y); break;
            case 'day_17_p2p_receiver': this.inputP2PReceiverPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_gashapon': this.inputGashaponPress(x, y); break;
            case 'day_17_p2p_receiver': this.inputP2PReceiverPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Sincronización P2P: Receptor 📡🛰️
- **Identificador de Misión:** `day_17_p2p_receiver`
- **Puntuación Meta/Objetivo:** `20`
- **Instrucciones de Pantalla:** *"¡Captura los bits de datos! Mueve el receptor de izquierda a derecha para recoger las señales de colores que caen por los cables."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_p2p_receiver')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_p2p_receiver':
                return { title: "Sincronización P2P: Receptor 📡🛰️", emoji: "📡", instructions: "¡Captura los bits de datos! Mueve el receptor de izquierda a derecha para recoger las señales de colores que caen por los cables.", goal: 20, color: "#00e5ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_p2p_receiver': this.inputP2PReceiverPress(x, y); break;
            case 'day_17_retro': this.inputRetroPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_p2p_receiver': this.inputP2PReceiverPress(x, y); break;
            case 'day_17_retro': this.inputRetroPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_p2p_receiver': this.inputP2PReceiverPress(x, y); break;
            case 'day_17_retro': this.inputRetroPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `20` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Arqueología Gamer 🎮👾
- **Identificador de Misión:** `day_17_retro`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Explora Super Potato! Limpia el polvo arrastrando sobre los cartuchos para encontrar los juegos de oro legendarios. ¡Cómpralos dentro de tu presupuesto!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_retro')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_retro':
                return { title: "Arqueología Gamer 🎮👾", emoji: "👾", instructions: "¡Explora Super Potato! Limpia el polvo arrastrando sobre los cartuchos para encontrar los juegos de oro legendarios. ¡Cómpralos dentro de tu presupuesto!", goal: 3, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_retro': this.inputRetroPress(x, y); break;
            case 'day_17_skytree': this.inputSkytreePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_retro': this.inputRetroPress(x, y); break;
            case 'day_17_skytree': this.inputSkytreePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_retro': this.inputRetroPress(x, y); break;
            case 'day_17_skytree': this.inputSkytreePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Cervicales de Acero 🏢🌪️
- **Identificador de Misión:** `day_17_skytree`
- **Puntuación Meta/Objetivo:** `634`
- **Instrucciones de Pantalla:** *"¡Ascensor al cielo! Desliza horizontalmente para estabilizar el ascensor en la guía vertical contra los vientos huracanados. Esquiva obstáculos de la estructura."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_skytree')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_skytree':
                return { title: "Cervicales de Acero 🏢🌪️", emoji: "🏢", instructions: "¡Ascensor al cielo! Desliza horizontalmente para estabilizar el ascensor en la guía vertical contra los vientos huracanados. Esquiva obstáculos de la estructura.", goal: 634, color: "#03a9f4" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_skytree': this.inputSkytreePress(x, y); break;
            case 'day_17_p2p_sender': this.inputP2PSenderPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_skytree': this.inputSkytreePress(x, y); break;
            case 'day_17_p2p_sender': this.inputP2PSenderPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_skytree': this.inputSkytreePress(x, y); break;
            case 'day_17_p2p_sender': this.inputP2PSenderPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `634` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Sincronización P2P: Emisor ⚡💻
- **Identificador de Misión:** `day_17_p2p_sender`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Conecta los nodos de datos! Arrastra cables de colores para unir los puertos de la red sin cruzarlos y transmite a máxima potencia."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_p2p_sender')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_p2p_sender':
                return { title: "Sincronización P2P: Emisor ⚡💻", emoji: "💻", instructions: "¡Conecta los nodos de datos! Arrastra cables de colores para unir los puertos de la red sin cruzarlos y transmite a máxima potencia.", goal: 3, color: "#00ff99" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_p2p_sender': this.inputP2PSenderPress(x, y); break;
            case 'day_17_height': this.inputHeightPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_p2p_sender': this.inputP2PSenderPress(x, y); break;
            case 'day_17_height': this.inputHeightPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_p2p_sender': this.inputP2PSenderPress(x, y); break;
            case 'day_17_height': this.inputHeightPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Altura del Cielo 🔭📡
- **Identificador de Misión:** `day_17_height`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Calibra la Skytree! Gira las perillas analógicas (calibración gruesa y fina) para apuntar exactamente al emisor superior a 634 metros."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_height')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_height':
                return { title: "Altura del Cielo 🔭📡", emoji: "🔭", instructions: "¡Calibra la Skytree! Gira las perillas analógicas (calibración gruesa y fina) para apuntar exactamente al emisor superior a 634 metros.", goal: 3, color: "#8e44ad" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_height': this.inputHeightPress(x, y); break;
            case 'day_17_sumida': this.inputSumidaPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_height': this.inputHeightPress(x, y); break;
            case 'day_17_sumida': this.inputSumidaPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_height': this.inputHeightPress(x, y); break;
            case 'day_17_sumida': this.inputSumidaPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Navegando el Sumida 🚢🌉
- **Identificador de Misión:** `day_17_sumida`
- **Puntuación Meta/Objetivo:** `4`
- **Instrucciones de Pantalla:** *"¡Conduce el Water Bus Himiko! Esquiva obstáculos en el río Sumida y navega exactamente bajo el centro de los puentes históricos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_17_sumida')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_17_sumida':
                return { title: "Navegando el Sumida 🚢🌉", emoji: "🚢", instructions: "¡Conduce el Water Bus Himiko! Esquiva obstáculos en el río Sumida y navega exactamente bajo el centro de los puentes históricos.", goal: 4, color: "#009688" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_17_sumida': this.inputSumidaPress(x, y); break;

            // DIA 18
            case 'day_18_shibuya': this.inputShibuyaPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_17_sumida': this.inputSumidaPress(x, y); break;

            // DIA 18
            case 'day_18_shibuya': this.inputShibuyaPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_17_sumida': this.inputSumidaPress(x, y); break;

            // DIA 18
            case 'day_18_shibuya': this.inputShibuyaPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `4` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 18

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 La Marea Humana 👥📊
- **Identificador de Misión:** `day_18_shibuya`
- **Puntuación Meta/Objetivo:** `20`
- **Instrucciones de Pantalla:** *"¡Censo de Shibuya! Toca rápidamente sobre los peatones que lleven gafas de sol en el scramble crossing. ¡No te equivoques de peatón!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_shibuya')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_shibuya':
                return { title: "La Marea Humana 👥📊", emoji: "👥", instructions: "¡Censo de Shibuya! Toca rápidamente sobre los peatones que lleven gafas de sol en el scramble crossing. ¡No te equivoques de peatón!", goal: 20, color: "#ff5722" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_shibuya': this.inputShibuyaPress(x, y); break;
            case 'day_18_hachiko': this.inputHachikoPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_shibuya': this.inputShibuyaPress(x, y); break;
            case 'day_18_hachiko': this.inputHachikoPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_shibuya': this.inputShibuyaPress(x, y); break;
            case 'day_18_hachiko': this.inputHachikoPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `20` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Guardián Hachiko 🐕🌸
- **Identificador de Misión:** `day_18_hachiko`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Mima a Hachiko! Acaricia su cabeza frotando suavemente y aparta la lluvia y las hojas otoñales que caen sobre él para mantenerlo feliz."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_hachiko')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_hachiko':
                return { title: "Guardián Hachiko 🐕🌸", emoji: "🐕", instructions: "¡Mima a Hachiko! Acaricia su cabeza frotando suavemente y aparta la lluvia y las hojas otoñales que caen sobre él para mantenerlo feliz.", goal: 100, color: "#ffb74d" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_hachiko': this.inputHachikoPress(x, y); break;
            case 'day_18_ema': this.inputEmaPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_hachiko': this.inputHachikoPress(x, y); break;
            case 'day_18_ema': this.inputEmaPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_hachiko': this.inputHachikoPress(x, y); break;
            case 'day_18_ema': this.inputEmaPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Deseo en el Ema ⛩️📜
- **Identificador de Misión:** `day_18_ema`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Cuelga la tablilla de los deseos! Toca cuando la tablilla oscilante esté perfectamente alineada con el gancho del altar del templo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_ema')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_ema':
                return { title: "Deseo en el Ema ⛩️📜", emoji: "📜", instructions: "¡Cuelga la tablilla de los deseos! Toca cuando la tablilla oscilante esté perfectamente alineada con el gancho del altar del templo.", goal: 3, color: "#b57c1e" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_ema': this.inputEmaPress(x, y); break;
            case 'day_18_crepe': this.inputCrepePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_ema': this.inputEmaPress(x, y); break;
            case 'day_18_crepe': this.inputCrepePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_ema': this.inputEmaPress(x, y); break;
            case 'day_18_crepe': this.inputCrepePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Crepe de Harajuku 🥞🍓
- **Identificador de Misión:** `day_18_crepe`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Prepara un crepe gigante! Mueve el cono de lado a lado para apilar fresas, nata, helado y toppings. ¡Evita los ingredientes podridos!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_crepe')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_crepe':
                return { title: "Crepe de Harajuku 🥞🍓", emoji: "🥞", instructions: "¡Prepara un crepe gigante! Mueve el cono de lado a lado para apilar fresas, nata, helado y toppings. ¡Evita los ingredientes podridos!", goal: 15, color: "#f8bbd0" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_crepe': this.inputCrepePress(x, y); break;
            case 'day_18_radio': this.inputRadioPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_crepe': this.inputCrepePress(x, y); break;
            case 'day_18_radio': this.inputRadioPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_crepe': this.inputCrepePress(x, y); break;
            case 'day_18_radio': this.inputRadioPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Intercepción de Radio 📻🌊
- **Identificador de Misión:** `day_18_radio`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Sintoniza la frecuencia! Arrastra los diales de Frecuencia y Amplitud para hacer coincidir tu onda de neón con la señal interceptada."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_radio')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_radio':
                return { title: "Intercepción de Radio 📻🌊", emoji: "📻", instructions: "¡Sintoniza la frecuencia! Arrastra los diales de Frecuencia y Amplitud para hacer coincidir tu onda de neón con la señal interceptada.", goal: 3, color: "#4db6ac" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_radio': this.inputRadioPress(x, y); break;
            case 'day_18_trend': this.inputTrendPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_radio': this.inputRadioPress(x, y); break;
            case 'day_18_trend': this.inputTrendPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_radio': this.inputRadioPress(x, y); break;
            case 'day_18_trend': this.inputTrendPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Cazatendencias 📸👗
- **Identificador de Misión:** `day_18_trend`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Reporte de Takeshita Street! Toma fotos de los transeúntes que lleven el estilo del target de moda en la esquina superior."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_trend')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_trend':
                return { title: "Cazatendencias 📸👗", emoji: "📸", instructions: "¡Reporte de Takeshita Street! Toma fotos de los transeúntes que lleven el estilo del target de moda en la esquina superior.", goal: 5, color: "#ec407a" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_trend': this.inputTrendPress(x, y); break;
            case 'day_18_flow': this.inputFlow18Press(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_trend': this.inputTrendPress(x, y); break;
            case 'day_18_flow': this.inputFlow18Press(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_trend': this.inputTrendPress(x, y); break;
            case 'day_18_flow': this.inputFlow18Press(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Flujo del Cruce 🚦🚶
- **Identificador de Misión:** `day_18_flow`
- **Puntuación Meta/Objetivo:** `50`
- **Instrucciones de Pantalla:** *"¡Controla Shibuya! Alterna los semáforos para evacuar peatones y coches. Dale prisa a los peatones lentos y evita accidentes."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_flow')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_flow':
                return { title: "Flujo del Cruce 🚦🚶", emoji: "🚦", instructions: "¡Controla Shibuya! Alterna los semáforos para evacuar peatones y coches. Dale prisa a los peatones lentos y evita accidentes.", goal: 50, color: "#e53935" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_flow': this.inputFlow18Press(x, y); break;
            case 'day_18_silence': this.inputSilencePressDay18(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_flow': this.inputFlow18Press(x, y); break;
            case 'day_18_silence': this.inputSilencePressDay18(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_flow': this.inputFlow18Press(x, y); break;
            case 'day_18_silence': this.inputSilencePressDay18(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `50` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Silencio en la Ciudad 🌲🤫
- **Identificador de Misión:** `day_18_silence`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Protege el Santuario Meiji! Planta árboles protectores en el sendero para amortiguar y disolver las ondas de ruido urbano de la ciudad."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_silence')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_silence':
                return { title: "Silencio en la Ciudad 🌲🤫", emoji: "🌲", instructions: "¡Protege el Santuario Meiji! Planta árboles protectores en el sendero para amortiguar y disolver las ondas de ruido urbano de la ciudad.", goal: 5, color: "#2e7d32" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_silence': this.inputSilencePressDay18(x, y); break;
            case 'day_18_crossing': this.inputCrossingPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_silence': this.inputSilencePressDay18(x, y); break;
            case 'day_18_crossing': this.inputCrossingPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_silence': this.inputSilencePressDay18(x, y); break;
            case 'day_18_crossing': this.inputCrossingPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Cruzando Shibuya 🚶💨
- **Identificador de Misión:** `day_18_crossing`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Guía a la familia! Cruza Shibuya Scramble esquivando la masa de transeúntes a contracorriente, paraguas y turistas."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_18_crossing')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_18_crossing':
                return { title: "Cruzando Shibuya 🚶💨", emoji: "🚶", instructions: "¡Guía a la familia! Cruza Shibuya Scramble esquivando la masa de transeúntes a contracorriente, paraguas y turistas.", goal: 1, color: "#78909c" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_18_crossing': this.inputCrossingPress(x, y); break;

            // DIA 19
            case 'day_19_gundam': this.inputGundamPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_18_crossing': this.inputCrossingPress(x, y); break;

            // DIA 19
            case 'day_19_gundam': this.inputGundamPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_18_crossing': this.inputCrossingPress(x, y); break;

            // DIA 19
            case 'day_19_gundam': this.inputGundamPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 19

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Piloto de Mechas 🤖🎯
- **Identificador de Misión:** `day_19_gundam`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Defiende el Unicorn Gundam! Controla la retícula de la cabina táctica para fijar y destruir drones enemigos con pulsos láser."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_gundam')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_gundam':
                return { title: "Piloto de Mechas 🤖🎯", emoji: "🤖", instructions: "¡Defiende el Unicorn Gundam! Controla la retícula de la cabina táctica para fijar y destruir drones enemigos con pulsos láser.", goal: 15, color: "#3f51b5" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_gundam': this.inputGundamPress(x, y); break;
            case 'day_19_color': this.inputColorPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_gundam': this.inputGundamPress(x, y); break;
            case 'day_19_color': this.inputColorPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_gundam': this.inputGundamPress(x, y); break;
            case 'day_19_color': this.inputColorPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Cazador de Luz 🎨🔮
- **Identificador de Misión:** `day_19_color`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Colores de TeamLab! Observa el color de la sala y salta rápidamente sobre las columnas de luz del color correspondiente. ¡Evita colores incorrectos!"*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_color')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_color':
                return { title: "Cazador de Luz 🎨🔮", emoji: "🔮", instructions: "¡Colores de TeamLab! Observa el color de la sala y salta rápidamente sobre las columnas de luz del color correspondiente. ¡Evita colores incorrectos!", goal: 15, color: "#bb86fc" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_color': this.inputColorPress(x, y); break;
            case 'day_19_teamlab': this.inputTeamLabPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_color': this.inputColorPress(x, y); break;
            case 'day_19_teamlab': this.inputTeamLabPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_color': this.inputColorPress(x, y); break;
            case 'day_19_teamlab': this.inputTeamLabPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Sueños Digitales 🌸🦋
- **Identificador de Misión:** `day_19_teamlab`
- **Puntuación Meta/Objetivo:** `95`
- **Instrucciones de Pantalla:** *"¡Arte digital interactivo! Pinta flores en la pantalla y toca las mariposas para que propaguen polen brillante de crecimiento fractal."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_teamlab')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_teamlab':
                return { title: "Sueños Digitales 🌸🦋", emoji: "🦋", instructions: "¡Arte digital interactivo! Pinta flores en la pantalla y toca las mariposas para que propaguen polen brillante de crecimiento fractal.", goal: 95, color: "#00e5ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_teamlab': this.inputTeamLabPress(x, y); break;
            case 'day_19_liberty': this.inputLibertyPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_teamlab': this.inputTeamLabPress(x, y); break;
            case 'day_19_liberty': this.inputLibertyPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_teamlab': this.inputTeamLabPress(x, y); break;
            case 'day_19_liberty': this.inputLibertyPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `95` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Libertad Nipona 🗽📏
- **Identificador de Misión:** `day_19_liberty`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"¡Ilusión óptica de Odaiba! Ajusta la posición de la mano y el zoom del Rainbow Bridge para alinear la antorcha con tu dedo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_liberty')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_liberty':
                return { title: "La Libertad Nipona 🗽📏", emoji: "🗽", instructions: "¡Ilusión óptica de Odaiba! Ajusta la posición de la mano y el zoom del Rainbow Bridge para alinear la antorcha con tu dedo.", goal: 2, color: "#00acc1" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_liberty': this.inputLibertyPress(x, y); break;
            case 'day_19_crypto': this.inputCryptoPressDay19(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_liberty': this.inputLibertyPress(x, y); break;
            case 'day_19_crypto': this.inputCryptoPressDay19(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_liberty': this.inputLibertyPress(x, y); break;
            case 'day_19_crypto': this.inputCryptoPressDay19(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Desencriptar Protocolo 📟🔓
- **Identificador de Misión:** `day_19_crypto`
- **Puntuación Meta/Objetivo:** `4`
- **Instrucciones de Pantalla:** *"¡Hackea la interfaz del Gundam! Selecciona los bloques numéricos que caen para que sumen el valor de clave indicado en cada puerto."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_crypto')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_crypto':
                return { title: "Desencriptar Protocolo 📟🔓", emoji: "🔓", instructions: "¡Hackea la interfaz del Gundam! Selecciona los bloques numéricos que caen para que sumen el valor de clave indicado en cada puerto.", goal: 4, color: "#00e676" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_crypto': this.inputCryptoPressDay19(x, y); break;
            case 'day_19_mirrors': this.inputMirrorsPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_crypto': this.inputCryptoPressDay19(x, y); break;
            case 'day_19_mirrors': this.inputMirrorsPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_crypto': this.inputCryptoPressDay19(x, y); break;
            case 'day_19_mirrors': this.inputMirrorsPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `4` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Lógica de Iluminación 📐💡
- **Identificador de Misión:** `day_19_mirrors`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Cámara de espejos! Coloca y rota espejos en la cuadrícula de TeamLab para desviar el haz láser y activar el receptor central."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_mirrors')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_mirrors':
                return { title: "Lógica de Iluminación 📐💡", emoji: "💡", instructions: "¡Cámara de espejos! Coloca y rota espejos en la cuadrícula de TeamLab para desviar el haz láser y activar el receptor central.", goal: 3, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_mirrors': this.inputMirrorsPress(x, y); break;
            case 'day_19_weight': this.inputWeightPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_mirrors': this.inputMirrorsPress(x, y); break;
            case 'day_19_weight': this.inputWeightPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_mirrors': this.inputMirrorsPress(x, y); break;
            case 'day_19_weight': this.inputWeightPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Estructura de Gundam 🏗️🤖
- **Identificador de Misión:** `day_19_weight`
- **Puntuación Meta/Objetivo:** `8`
- **Instrucciones de Pantalla:** *"¡Ensambla el mecha! Deja caer las piezas de acero balanceadas por la grúa una sobre otra. Alinea los centros de gravedad."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_weight')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_weight':
                return { title: "Estructura de Gundam 🏗️🤖", emoji: "🏗️", instructions: "¡Ensambla el mecha! Deja caer las piezas de acero balanceadas por la grúa una sobre otra. Alinea los centros de gravedad.", goal: 8, color: "#cfd8dc" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_weight': this.inputWeightPress(x, y); break;
            case 'day_19_monorail': this.inputMonorailPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_weight': this.inputWeightPress(x, y); break;
            case 'day_19_monorail': this.inputMonorailPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_weight': this.inputWeightPress(x, y); break;
            case 'day_19_monorail': this.inputMonorailPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `8` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Monorriel Yurikamome 🚝🏁
- **Identificador de Misión:** `day_19_monorail`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Conduce por Odaiba! Controla la aceleración y frenada del tren autónomo. Frena suavemente dentro de los límites del andén."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_monorail')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_monorail':
                return { title: "Monorriel Yurikamome 🚝🏁", emoji: "🚝", instructions: "¡Conduce por Odaiba! Controla la aceleración y frenada del tren autónomo. Frena suavemente dentro de los límites del andén.", goal: 3, color: "#4facfe" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_monorail': this.inputMonorailPress(x, y); break;
            case 'day_19_immersive': this.inputImmersivePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_monorail': this.inputMonorailPress(x, y); break;
            case 'day_19_immersive': this.inputImmersivePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_monorail': this.inputMonorailPress(x, y); break;
            case 'day_19_immersive': this.inputImmersivePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Inmersión Total 🌌🌊
- **Identificador de Misión:** `day_19_immersive`
- **Puntuación Meta/Objetivo:** `30`
- **Instrucciones de Pantalla:** *"¡Cascada de luz de TeamLab! Toca y desvía los chorros luminosos para canalizarlos y envolver a la familia en auras brillantes."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_19_immersive')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_19_immersive':
                return { title: "Inmersión Total 🌌🌊", emoji: "🌌", instructions: "¡Cascada de luz de TeamLab! Toca y desvía los chorros luminosos para canalizarlos y envolver a la familia en auras brillantes.", goal: 30, color: "#b388ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_19_immersive': this.inputImmersivePress(x, y); break;

            // DIA 20
            case 'day_20_bento': this.inputBentoPressDay20(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_19_immersive': this.inputImmersivePress(x, y); break;

            // DIA 20
            case 'day_20_bento': this.inputBentoPressDay20(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_19_immersive': this.inputImmersivePress(x, y); break;

            // DIA 20
            case 'day_20_bento': this.inputBentoPressDay20(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `30` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 20

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Maestro del Bento 🍱✨
- **Identificador de Misión:** `day_20_bento`
- **Puntuación Meta/Objetivo:** `4`
- **Instrucciones de Pantalla:** *"¡Físicas del Bento! Haz clic en los divisores para rotarlos y guiar los ingredientes que caen hacia sus celdas correspondientes en la parte inferior."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_bento')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_bento':
                return { title: "Maestro del Bento 🍱✨", emoji: "🍱", instructions: "¡Físicas del Bento! Haz clic en los divisores para rotarlos y guiar los ingredientes que caen hacia sus celdas correspondientes en la parte inferior.", goal: 4, color: "#e53935" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_bento': this.inputBentoPressDay20(x, y); break;
            case 'day_20_potion': this.inputPotionPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_bento': this.inputBentoPressDay20(x, y); break;
            case 'day_20_potion': this.inputPotionPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_bento': this.inputBentoPressDay20(x, y); break;
            case 'day_20_potion': this.inputPotionPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `4` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Alquimia Gatuna 🐾🔮
- **Identificador de Misión:** `day_20_potion`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Alquimia de Yanaka Ginza! Conecta 3 o más huellas de gato iguales en línea para cargar el caldero místico."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_potion')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_potion':
                return { title: "Alquimia Gatuna 🐾🔮", emoji: "🐾", instructions: "¡Alquimia de Yanaka Ginza! Conecta 3 o más huellas de gato iguales en línea para cargar el caldero místico.", goal: 100, color: "#ff80ab" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_potion': this.inputPotionPress(x, y); break;
            case 'day_20_pond': this.inputPondPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_potion': this.inputPotionPress(x, y); break;
            case 'day_20_pond': this.inputPondPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_potion': this.inputPotionPress(x, y); break;
            case 'day_20_pond': this.inputPondPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Pato del Estanque 🦆🪷
- **Identificador de Misión:** `day_20_pond`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Fotografía en Ueno! Mueve el visor y dispara cuando el pato haga una pose especial bajo el anillo verde."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_pond')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_pond':
                return { title: "El Pato del Estanque 🦆🪷", emoji: "🦆", instructions: "¡Fotografía en Ueno! Mueve el visor y dispara cuando el pato haga una pose especial bajo el anillo verde.", goal: 3, color: "#4caf50" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_pond': this.inputPondPress(x, y); break;
            case 'day_20_weight': this.inputWeight20Press(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_pond': this.inputPondPress(x, y); break;
            case 'day_20_weight': this.inputWeight20Press(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_pond': this.inputPondPress(x, y); break;
            case 'day_20_weight': this.inputWeight20Press(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Peso del Tesoro ⚖️ Souvenir
- **Identificador de Misión:** `day_20_weight`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Balanza física! Arrastra pesas al platillo derecho hasta equilibrar el souvenir del platillo izquierdo."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_weight')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_weight':
                return { title: "El Peso del Tesoro ⚖️ Souvenir", emoji: "⚖️", instructions: "¡Balanza física! Arrastra pesas al platillo derecho hasta equilibrar el souvenir del platillo izquierdo.", goal: 3, color: "#009688" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_weight': this.inputWeight20Press(x, y); break;
            case 'day_20_change': this.inputChangePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_weight': this.inputWeight20Press(x, y); break;
            case 'day_20_change': this.inputChangePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_weight': this.inputWeight20Press(x, y); break;
            case 'day_20_change': this.inputChangePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Regateo en Ameyoko 💰🛒
- **Identificador de Misión:** `day_20_change`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Devuelve cambio rápido! Selecciona monedas para dar el cambio exacto antes de que el cliente pierda la paciencia."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_change')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_change':
                return { title: "Regateo en Ameyoko 💰🛒", emoji: "💰", instructions: "¡Devuelve cambio rápido! Selecciona monedas para dar el cambio exacto antes de que el cliente pierda la paciencia.", goal: 5, color: "#ffb300" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_change': this.inputChangePress(x, y); break;
            case 'day_20_museum': this.inputMuseumPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_change': this.inputChangePress(x, y); break;
            case 'day_20_museum': this.inputMuseumPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_change': this.inputChangePress(x, y); break;
            case 'day_20_museum': this.inputMuseumPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Arquitectura del Museo 🏛️📐
- **Identificador de Misión:** `day_20_museum`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"¡Plano digital! Une los nodos numerados dibujando líneas bajo chispas de soldadura."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_museum')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_museum':
                return { title: "Arquitectura del Museo 🏛️📐", emoji: "🏛️", instructions: "¡Plano digital! Une los nodos numerados dibujando líneas bajo chispas de soldadura.", goal: 2, color: "#8d6e63" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_museum': this.inputMuseumPress(x, y); break;
            case 'day_20_vintage': this.inputVintagePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_museum': this.inputMuseumPress(x, y); break;
            case 'day_20_vintage': this.inputVintagePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_museum': this.inputMuseumPress(x, y); break;
            case 'day_20_vintage': this.inputVintagePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Análisis de Precios Retro 🕹️🔍
- **Identificador de Misión:** `day_20_vintage`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Inspección en Super Potato! Usa la lupa de rayos X para contar fallas y clasificar las consolas (A, B o C)."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_vintage')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_vintage':
                return { title: "Análisis de Precios Retro 🕹️🔍", emoji: "🕹️", instructions: "¡Inspección en Super Potato! Usa la lupa de rayos X para contar fallas y clasificar las consolas (A, B o C).", goal: 5, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_vintage': this.inputVintagePress(x, y); break;
            case 'day_20_stairs': this.inputStairsPressDay20(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_vintage': this.inputVintagePress(x, y); break;
            case 'day_20_stairs': this.inputStairsPressDay20(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_vintage': this.inputVintagePress(x, y); break;
            case 'day_20_stairs': this.inputStairsPressDay20(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Escaleras del Atardecer 🌅🏃
- **Identificador de Misión:** `day_20_stairs`
- **Puntuación Meta/Objetivo:** `36`
- **Instrucciones de Pantalla:** *"¡Paso rítmico en Yuyake Dandan! Presiona izquierda o derecha al ritmo de las huellas que bajan por las escaleras."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_stairs')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_stairs':
                return { title: "Escaleras del Atardecer 🌅🏃", emoji: "🌅", instructions: "¡Paso rítmico en Yuyake Dandan! Presiona izquierda o derecha al ritmo de las huellas que bajan por las escaleras.", goal: 36, color: "#ff7043" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_stairs': this.inputStairsPressDay20(x, y); break;
            case 'day_20_tasting': this.inputTastingPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_stairs': this.inputStairsPressDay20(x, y); break;
            case 'day_20_tasting': this.inputTastingPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_stairs': this.inputStairsPressDay20(x, y); break;
            case 'day_20_tasting': this.inputTastingPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `36` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Degustación Callejera 🍡🍢
- **Identificador de Misión:** `day_20_tasting`
- **Puntuación Meta/Objetivo:** `8`
- **Instrucciones de Pantalla:** *"¡Chef de Brochetas! Prepara pinchos de dango, asalos en la plancha y sírvelos cuando el indicador esté verde."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_20_tasting')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_20_tasting':
                return { title: "Degustación Callejera 🍡🍢", emoji: "🍡", instructions: "¡Chef de Brochetas! Prepara pinchos de dango, asalos en la plancha y sírvelos cuando el indicador esté verde.", goal: 8, color: "#ff9800" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_20_tasting': this.inputTastingPress(x, y); break;

            // DIA 21
            case 'day_21_monkeys': this.inputMonkeysPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_20_tasting': this.inputTastingPress(x, y); break;

            // DIA 21
            case 'day_21_monkeys': this.inputMonkeysPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_20_tasting': this.inputTastingPress(x, y); break;

            // DIA 21
            case 'day_21_monkeys': this.inputMonkeysPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `8` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 21

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Los Tres Monos 🙈🙉🙊
- **Identificador de Misión:** `day_21_monkeys`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Simón Dice en Nikko! Memoriza y repite la secuencia de gestos de los monos (ojos, oídos, boca)."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_monkeys')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_monkeys':
                return { title: "Los Tres Monos 🙈🙉🙊", emoji: "🙈", instructions: "¡Simón Dice en Nikko! Memoriza y repite la secuencia de gestos de los monos (ojos, oídos, boca).", goal: 5, color: "#8d6e63" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_monkeys': this.inputMonkeysPress(x, y); break;
            case 'day_21_dragon': this.inputDragonPressDay21(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_monkeys': this.inputMonkeysPress(x, y); break;
            case 'day_21_dragon': this.inputDragonPressDay21(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_monkeys': this.inputMonkeysPress(x, y); break;
            case 'day_21_dragon': this.inputDragonPressDay21(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Latido del Dragón 🐉💓
- **Identificador de Misión:** `day_21_dragon`
- **Puntuación Meta/Objetivo:** `10`
- **Instrucciones de Pantalla:** *"¡Rito en el Templo! Toca en sincronía exacta cuando las ondas de latido converjan en la joya central."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_dragon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_dragon':
                return { title: "El Latido del Dragón 🐉💓", emoji: "🐉", instructions: "¡Rito en el Templo! Toca en sincronía exacta cuando las ondas de latido converjan en la joya central.", goal: 10, color: "#d500f9" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_dragon': this.inputDragonPressDay21(x, y); break;
            case 'day_21_slash': this.inputSlashPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_dragon': this.inputDragonPressDay21(x, y); break;
            case 'day_21_slash': this.inputSlashPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_dragon': this.inputDragonPressDay21(x, y); break;
            case 'day_21_slash': this.inputSlashPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `10` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Tajo del Samurái ⚔️🎋
- **Identificador de Misión:** `day_21_slash`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Entrenamiento de Katana! Rebana con cortes rápidos en el ángulo indicado para cortar los bambúes."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_slash')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_slash':
                return { title: "El Tajo del Samurái ⚔️🎋", emoji: "⚔️", instructions: "¡Entrenamiento de Katana! Rebana con cortes rápidos en el ángulo indicado para cortar los bambúes.", goal: 15, color: "#2e7d32" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_slash': this.inputSlashPress(x, y); break;
            case 'day_21_jizo': this.inputJizoPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_slash': this.inputSlashPress(x, y); break;
            case 'day_21_jizo': this.inputJizoPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_slash': this.inputSlashPress(x, y); break;
            case 'day_21_jizo': this.inputJizoPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Guardián de Piedra 🗿🛡️
- **Identificador de Misión:** `day_21_jizo`
- **Puntuación Meta/Objetivo:** `30`
- **Instrucciones de Pantalla:** *"¡Defensa espiritual! Dibuja barreras de neón en el aire para desviar el fuego espectral rojo fuera de los Jizos."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_jizo')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_jizo':
                return { title: "Guardián de Piedra 🗿🛡️", emoji: "🗿", instructions: "¡Defensa espiritual! Dibuja barreras de neón en el aire para desviar el fuego espectral rojo fuera de los Jizos.", goal: 30, color: "#4caf50" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_jizo': this.inputJizoPress(x, y); break;
            case 'day_21_buddha': this.inputBuddhaPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_jizo': this.inputJizoPress(x, y); break;
            case 'day_21_buddha': this.inputBuddhaPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_jizo': this.inputJizoPress(x, y); break;
            case 'day_21_buddha': this.inputBuddhaPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `30` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Ingeniero Imperial 🏯⛲
- **Identificador de Misión:** `day_21_buddha`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Fundición en Kamakura! Rota los conductos para verter bronce líquido en el molde gigante del Gran Buda."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_buddha')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_buddha':
                return { title: "Ingeniero Imperial 🏯⛲", emoji: "🏯", instructions: "¡Fundición en Kamakura! Rota los conductos para verter bronce líquido en el molde gigante del Gran Buda.", goal: 100, color: "#00e676" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_buddha': this.inputBuddhaPress(x, y); break;
            case 'day_21_gold': this.inputGoldPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_buddha': this.inputBuddhaPress(x, y); break;
            case 'day_21_gold': this.inputGoldPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_buddha': this.inputBuddhaPress(x, y); break;
            case 'day_21_gold': this.inputGoldPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Análisis de Pan de Oro 🔨✨
- **Identificador de Misión:** `day_21_gold`
- **Puntuación Meta/Objetivo:** `12`
- **Instrucciones de Pantalla:** *"¡Laminador de Oro! Golpea el martillo cuando la aguja esté en la zona verde para aplanar el pan de oro."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_gold')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_gold':
                return { title: "Análisis de Pan de Oro 🔨✨", emoji: "🔨", instructions: "¡Laminador de Oro! Golpea el martillo cuando la aguja esté en la zona verde para aplanar el pan de oro.", goal: 12, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_gold': this.inputGoldPress(x, y); break;
            case 'day_21_tracking': this.inputTrackingPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_gold': this.inputGoldPress(x, y); break;
            case 'day_21_tracking': this.inputTrackingPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_gold': this.inputGoldPress(x, y); break;
            case 'day_21_tracking': this.inputTrackingPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `12` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Rastreo de la Naturaleza 🌲📡
- **Identificador de Misión:** `day_21_tracking`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Sonar en la niebla! Camina por el bosque guiado por los barridos del radar, esquivando trampas."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_tracking')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_tracking':
                return { title: "Rastreo de la Naturaleza 🌲📡", emoji: "📡", instructions: "¡Sonar en la niebla! Camina por el bosque guiado por los barridos del radar, esquivando trampas.", goal: 3, color: "#00b0ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_tracking': this.inputTrackingPress(x, y); break;
            case 'day_21_defense': this.inputDefensePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_tracking': this.inputTrackingPress(x, y); break;
            case 'day_21_defense': this.inputDefensePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_tracking': this.inputTrackingPress(x, y); break;
            case 'day_21_defense': this.inputDefensePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Defensa del Shogunato 🏰🔥
- **Identificador de Misión:** `day_21_defense`
- **Puntuación Meta/Objetivo:** `45`
- **Instrucciones de Pantalla:** *"¡Asedio Odawara! Conjura hechizos de roca, viento y fuego para frenar a los invasores en la senda."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_defense')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_defense':
                return { title: "Defensa del Shogunato 🏰🔥", emoji: "🏰", instructions: "¡Asedio Odawara! Conjura hechizos de roca, viento y fuego para frenar a los invasores en la senda.", goal: 45, color: "#ff3d00" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_defense': this.inputDefensePress(x, y); break;
            case 'day_21_silence': this.inputSilencePressDay21(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_defense': this.inputDefensePress(x, y); break;
            case 'day_21_silence': this.inputSilencePressDay21(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_defense': this.inputDefensePress(x, y); break;
            case 'day_21_silence': this.inputSilencePressDay21(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `45` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Paz de la Montaña 🪷🧘
- **Identificador de Misión:** `day_21_silence`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Meditación Zen! Pulsa y suelta para sincronizar tu respiración con el halo armónico del loto."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_21_silence')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_21_silence':
                return { title: "La Paz de la Montaña 🪷🧘", emoji: "🪷", instructions: "¡Meditación Zen! Pulsa y suelta para sincronizar tu respiración con el halo armónico del loto.", goal: 15, color: "#00b0ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_21_silence': this.inputSilencePressDay21(x, y); break;

            // DIA 22
            case 'day_22_shout': this.inputShoutPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_21_silence': this.inputSilencePressDay21(x, y); break;

            // DIA 22
            case 'day_22_shout': this.inputShoutPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_21_silence': this.inputSilencePressDay21(x, y); break;

            // DIA 22
            case 'day_22_shout': this.inputShoutPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 22

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Grito de Pescadero 🐟📣
- **Identificador de Misión:** `day_22_shout`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Grito de Toyosu! Ajusta la altura de tu onda sonora para encajar con el grito del pescadero."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_shout')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_shout':
                return { title: "Grito de Pescadero 🐟📣", emoji: "📣", instructions: "¡Grito de Toyosu! Ajusta la altura de tu onda sonora para encajar con el grito del pescadero.", goal: 3, color: "#00acc1" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_shout': this.inputShoutPress(x, y); break;
            case 'day_22_car': this.inputCarPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_shout': this.inputShoutPress(x, y); break;
            case 'day_22_car': this.inputCarPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_shout': this.inputShoutPress(x, y); break;
            case 'day_22_car': this.inputCarPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Vehículo de Lujo 🏎️💨
- **Identificador de Misión:** `day_22_car`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Carreras en Ginza! Cambia de marcha soltando el embrague cuando las RPM toquen la zona dorada."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_car')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_car':
                return { title: "Vehículo de Lujo 🏎️💨", emoji: "🏎️", instructions: "¡Carreras en Ginza! Cambia de marcha soltando el embrague cuando las RPM toquen la zona dorada.", goal: 1, color: "#ff1744" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_car': this.inputCarPress(x, y); break;
            case 'day_22_elevator': this.inputElevatorPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_car': this.inputCarPress(x, y); break;
            case 'day_22_elevator': this.inputElevatorPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_car': this.inputCarPress(x, y); break;
            case 'day_22_elevator': this.inputElevatorPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Ascensor Infinito 🏢🚀
- **Identificador de Misión:** `day_22_elevator`
- **Puntuación Meta/Objetivo:** `52`
- **Instrucciones de Pantalla:** *"¡Cohete de Roppongi Hills! Controla la aceleración lateral para evitar mareos en la subida ultrarrápida."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_elevator')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_elevator':
                return { title: "Ascensor Infinito 🏢🚀", emoji: "🚀", instructions: "¡Cohete de Roppongi Hills! Controla la aceleración lateral para evitar mareos en la subida ultrarrápida.", goal: 52, color: "#00e5ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_elevator': this.inputElevatorPress(x, y); break;
            case 'day_22_tower': this.inputTowerPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_elevator': this.inputElevatorPress(x, y); break;
            case 'day_22_tower': this.inputTowerPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_elevator': this.inputElevatorPress(x, y); break;
            case 'day_22_tower': this.inputTowerPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `52` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Réplica Eiffel 🗼🤏
- **Identificador de Misión:** `day_22_tower`
- **Puntuación Meta/Objetivo:** `2`
- **Instrucciones de Pantalla:** *"¡Alineación óptica! Escala y rota la mano en perspectiva para pinzar la punta de la Torre de Tokio."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_tower')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_tower':
                return { title: "Réplica Eiffel 🗼🤏", emoji: "🗼", instructions: "¡Alineación óptica! Escala y rota la mano en perspectiva para pinzar la punta de la Torre de Tokio.", goal: 2, color: "#ff5252" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_tower': this.inputTowerPress(x, y); break;
            case 'day_22_jewel': this.inputJewelPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_tower': this.inputTowerPress(x, y); break;
            case 'day_22_jewel': this.inputJewelPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_tower': this.inputTowerPress(x, y); break;
            case 'day_22_jewel': this.inputJewelPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `2` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 La Joya de Ginza 💎🚨
- **Identificador de Misión:** `day_22_jewel`
- **Puntuación Meta/Objetivo:** `4`
- **Instrucciones de Pantalla:** *"¡Esquiva láseres! Guía la sonda física sorteando barreras radiales para hackear los 4 terminales."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_jewel')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_jewel':
                return { title: "La Joya de Ginza 💎🚨", emoji: "💎", instructions: "¡Esquiva láseres! Guía la sonda física sorteando barreras radiales para hackear los 4 terminales.", goal: 4, color: "#d500f9" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_jewel': this.inputJewelPress(x, y); break;
            case 'day_22_numbers': this.inputNumbersPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_jewel': this.inputJewelPress(x, y); break;
            case 'day_22_numbers': this.inputNumbersPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_jewel': this.inputJewelPress(x, y); break;
            case 'day_22_numbers': this.inputNumbersPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `4` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Intercepción Numérica 🔢🔓
- **Identificador de Misión:** `day_22_numbers`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Kanji Crypto! Escucha los números en japonés y ordena los bloques de Kanjis correctos en la clave."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_numbers')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_numbers':
                return { title: "Intercepción Numérica 🔢🔓", emoji: "🔓", instructions: "¡Kanji Crypto! Escucha los números en japonés y ordena los bloques de Kanjis correctos en la clave.", goal: 3, color: "#00e676" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_numbers': this.inputNumbersPress(x, y); break;
            case 'day_22_fish': this.inputFishPressDay22(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_numbers': this.inputNumbersPress(x, y); break;
            case 'day_22_fish': this.inputFishPressDay22(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_numbers': this.inputNumbersPress(x, y); break;
            case 'day_22_fish': this.inputFishPressDay22(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Logística del Pescado 📦🚂
- **Identificador de Misión:** `day_22_fish`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Cruce de Toyosu! Conmuta agujas de vía férrea para enviar los palets de atún al muelle correcto."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_fish')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_fish':
                return { title: "Logística del Pescado 📦🚂", emoji: "📦", instructions: "¡Cruce de Toyosu! Conmuta agujas de vía férrea para enviar los palets de atún al muelle correcto.", goal: 15, color: "#ff9100" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_fish': this.inputFishPressDay22(x, y); break;
            case 'day_22_compare': this.inputComparePress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_fish': this.inputFishPressDay22(x, y); break;
            case 'day_22_compare': this.inputComparePress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_fish': this.inputFishPressDay22(x, y); break;
            case 'day_22_compare': this.inputComparePress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Altura Relativa 🗼🏢
- **Identificador de Misión:** `day_22_compare`
- **Puntuación Meta/Objetivo:** `8`
- **Instrucciones de Pantalla:** *"¡Stacker de la Torre! Apila bloques respetando la gravedad para comparar el tamaño con la Skytree."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_compare')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_compare':
                return { title: "Altura Relativa 🗼🏢", emoji: "🗼", instructions: "¡Stacker de la Torre! Apila bloques respetando la gravedad para comparar el tamaño con la Skytree.", goal: 8, color: "#cfd8dc" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_compare': this.inputComparePress(x, y); break;
            case 'day_22_neon': this.inputNeon22Press(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_compare': this.inputComparePress(x, y); break;
            case 'day_22_neon': this.inputNeon22Press(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_compare': this.inputComparePress(x, y); break;
            case 'day_22_neon': this.inputNeon22Press(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `8` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Luces de Neón 🌟🌃
- **Identificador de Misión:** `day_22_neon`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Conexión de Neón! Conecta cables elásticos de neones sin cruzarlos para encender el letrero familiar."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_22_neon')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_22_neon':
                return { title: "Luces de Neón 🌟🌃", emoji: "🌃", instructions: "¡Conexión de Neón! Conecta cables elásticos de neones sin cruzarlos para encender el letrero familiar.", goal: 1, color: "#ea580c" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_22_neon': this.inputNeon22Press(x, y); break;

            // DIA 23
            case 'day_23_kitkat': this.inputKitkatPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_22_neon': this.inputNeon22Press(x, y); break;

            // DIA 23
            case 'day_23_kitkat': this.inputKitkatPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_22_neon': this.inputNeon22Press(x, y); break;

            // DIA 23
            case 'day_23_kitkat': this.inputKitkatPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


## 🗓️ DÍA 23

### 🦊 Laura (Kid - 9 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 🐉 Iván (Teen - 14 años)

*No hay minijuegos de Canvas registrados para este rol en este día.*

### 👨‍👩‍👧‍👦 Familiar / Conjunta

#### 🎮 Buscador de KitKat 🍫🔍
- **Identificador de Misión:** `day_23_kitkat`
- **Puntuación Meta/Objetivo:** `15`
- **Instrucciones de Pantalla:** *"¡Supermercado Match-3! Intercambia y combina KitKats para cosechar 15 combinaciones exóticas."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_kitkat')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_kitkat':
                return { title: "Buscador de KitKat 🍫🔍", emoji: "🍫", instructions: "¡Supermercado Match-3! Intercambia y combina KitKats para cosechar 15 combinaciones exóticas.", goal: 15, color: "#cc0000" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_kitkat': this.inputKitkatPress(x, y); break;
            case 'day_23_pokedex': this.inputPokedexPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_kitkat': this.inputKitkatPress(x, y); break;
            case 'day_23_pokedex': this.inputPokedexPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_kitkat': this.inputKitkatPress(x, y); break;
            case 'day_23_pokedex': this.inputPokedexPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `15` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Pokédex de Supermercado 🔎🏷️
- **Identificador de Misión:** `day_23_pokedex`
- **Puntuación Meta/Objetivo:** `5`
- **Instrucciones de Pantalla:** *"¡Alineación de Escáner! Calibra el ancho del haz láser para coincidir con los códigos de barras móviles."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_pokedex')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_pokedex':
                return { title: "Pokédex de Supermercado 🔎🏷️", emoji: "🔎", instructions: "¡Alineación de Escáner! Calibra el ancho del haz láser para coincidir con los códigos de barras móviles.", goal: 5, color: "#40c4ff" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_pokedex': this.inputPokedexPress(x, y); break;
            case 'day_23_coins': this.inputCoinsPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_pokedex': this.inputPokedexPress(x, y); break;
            case 'day_23_coins': this.inputCoinsPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_pokedex': this.inputPokedexPress(x, y); break;
            case 'day_23_coins': this.inputCoinsPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `5` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Oráculo de Monedas 🪙⛲
- **Identificador de Misión:** `day_23_coins`
- **Puntuación Meta/Objetivo:** `3`
- **Instrucciones de Pantalla:** *"¡Deseos en el Templo! Sopla y crea corrientes de agua para guiar la moneda de 100¥ al cuenco dorado."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_coins')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_coins':
                return { title: "Oráculo de Monedas 🪙⛲", emoji: "🪙", instructions: "¡Deseos en el Templo! Sopla y crea corrientes de agua para guiar la moneda de 100¥ al cuenco dorado.", goal: 3, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_coins': this.inputCoinsPress(x, y); break;
            case 'day_23_mascot': this.inputMascotPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_coins': this.inputCoinsPress(x, y); break;
            case 'day_23_mascot': this.inputMascotPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_coins': this.inputCoinsPress(x, y); break;
            case 'day_23_mascot': this.inputMascotPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `3` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Mascotas de Viaje 🧸🏗️
- **Identificador de Misión:** `day_23_mascot`
- **Puntuación Meta/Objetivo:** `1`
- **Instrucciones de Pantalla:** *"¡Garra de Hotel! Suelta la garra oscilante con inercia para rescatar tu peluche favorito."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_mascot')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_mascot':
                return { title: "Mascotas de Viaje 🧸🏗️", emoji: "🧸", instructions: "¡Garra de Hotel! Suelta la garra oscilante con inercia para rescatar tu peluche favorito.", goal: 1, color: "#ffecd2" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_mascot': this.inputMascotPress(x, y); break;
            case 'day_23_tetris': this.inputTetrisPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_mascot': this.inputMascotPress(x, y); break;
            case 'day_23_tetris': this.inputTetrisPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_mascot': this.inputMascotPress(x, y); break;
            case 'day_23_tetris': this.inputTetrisPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `1` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Tetris de Maletas 🧳🧩
- **Identificador de Misión:** `day_23_tetris`
- **Puntuación Meta/Objetivo:** `100`
- **Instrucciones de Pantalla:** *"¡Organiza equipaje! Arrastra y rota piezas poligonales para encajarlas en el compartimento de la maleta."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_tetris')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_tetris':
                return { title: "Tetris de Maletas 🧳🧩", emoji: "🧳", instructions: "¡Organiza equipaje! Arrastra y rota piezas poligonales para encajarlas en el compartimento de la maleta.", goal: 100, color: "#00e676" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_tetris': this.inputTetrisPress(x, y); break;
            case 'day_23_audit': this.inputAuditPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_tetris': this.inputTetrisPress(x, y); break;
            case 'day_23_audit': this.inputAuditPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_tetris': this.inputTetrisPress(x, y); break;
            case 'day_23_audit': this.inputAuditPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `100` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Auditoría Final 📊💸
- **Identificador de Misión:** `day_23_audit`
- **Puntuación Meta/Objetivo:** `6`
- **Instrucciones de Pantalla:** *"¡Conversión Financiera! Une recibos de Yenes con su valor equivalente en Euros usando ligas elásticas."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_audit')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_audit':
                return { title: "Auditoría Final 📊💸", emoji: "📊", instructions: "¡Conversión Financiera! Une recibos de Yenes con su valor equivalente en Euros usando ligas elásticas.", goal: 6, color: "#ffd700" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_audit': this.inputAuditPress(x, y); break;
            case 'day_23_security': this.inputSecurityPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_audit': this.inputAuditPress(x, y); break;
            case 'day_23_security': this.inputSecurityPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_audit': this.inputAuditPress(x, y); break;
            case 'day_23_security': this.inputSecurityPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `6` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Protocolo de Embarque 🛫🛂
- **Identificador de Misión:** `day_23_security`
- **Puntuación Meta/Objetivo:** `12`
- **Instrucciones de Pantalla:** *"¡Rayos X de Aeropuerto! Toca y requisa objetos no permitidos antes de que salgan de la pantalla."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_security')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_security':
                return { title: "Protocolo de Embarque 🛫🛂", emoji: "🛫", instructions: "¡Rayos X de Aeropuerto! Toca y requisa objetos no permitidos antes de que salgan de la pantalla.", goal: 12, color: "#ff3d00" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_security': this.inputSecurityPress(x, y); break;
            case 'day_23_weight': this.inputWeight23Press(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_security': this.inputSecurityPress(x, y); break;
            case 'day_23_weight': this.inputWeight23Press(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_security': this.inputSecurityPress(x, y); break;
            case 'day_23_weight': this.inputWeight23Press(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `12` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 Peso de Carga 🧳⚖️
- **Identificador de Misión:** `day_23_weight`
- **Puntuación Meta/Objetivo:** `23`
- **Instrucciones de Pantalla:** *"¡Equipaje de bodega! Carga maletas en la aeronave balanceando los pesos en ambos lados."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_weight')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_weight':
                return { title: "Peso de Carga 🧳⚖️", emoji: "⚖️", instructions: "¡Equipaje de bodega! Carga maletas en la aeronave balanceando los pesos en ambos lados.", goal: 23, color: "#78909c" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_weight': this.inputWeight23Press(x, y); break;
            case 'day_23_stamp': this.inputStampPress(x, y); break;
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_weight': this.inputWeight23Press(x, y); break;
            case 'day_23_stamp': this.inputStampPress(x, y); break;
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_weight': this.inputWeight23Press(x, y); break;
            case 'day_23_stamp': this.inputStampPress(x, y); break;
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `23` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---

#### 🎮 El Sello Final 🔴📜
- **Identificador de Misión:** `day_23_stamp`
- **Puntuación Meta/Objetivo:** `6`
- **Instrucciones de Pantalla:** *"¡Estampado de pasaporte! Recarga de tinta los sellos y colócalos con la presión exacta sobre el papel."*

##### 📝 Descripción del Juego (Consiste en):
El jugador interactúa a través de la pantalla táctil para lograr el objetivo propuesto. Este juego representa un aspecto cultural o de exploración del viaje en este día concreto, adaptado a la narrativa del explorador.

##### 🚀 Inicialización y Comienzo:
Se activa al pulsar "Comenzar Minijuego" en la vista de la misión. El motor inicializa `MinigamesManager.state = 'playing'` y llama a `setupGame('day_23_stamp')`, cargando los siguientes valores predeterminados en el estado local del juego:
```javascript
case 'day_23_stamp':
                return { title: "El Sello Final 🔴📜", emoji: "🔴", instructions: "¡Estampado de pasaporte! Recarga de tinta los sellos y colócalos con la presión exacta sobre el papel.", goal: 6, color: "#d4af37" };
```

##### ⚙️ Mecánicas y Programación (Cómo funciona):
- **Entrada / Interacción:**
```javascript
// Al tocar / presionar la pantalla:
case 'day_23_stamp': this.inputStampPress(x, y); break;
        }
    },

    handleRelease(x, y) {
        switch(this.activeGame) {
            case 'day_3_ninja':
```

- **Actualización y Física (`updateGame`):**
```javascript
case 'day_23_stamp': this.inputStampPress(x, y); break;
        }
    },

    handleRelease(x, y) {
        switch(this.activeGame) {
            case 'day_3_ninja':
```

- **Renderizado y Gráficos (`drawFrame`):**
```javascript
case 'day_23_stamp': this.inputStampPress(x, y); break;
        }
    },

    handleRelease(x, y) {
        switch(this.activeGame) {
            case 'day_3_ninja':
```

##### 🏁 Finalización y Victoria:
El juego finaliza con éxito llamando a `this.win()` cuando se cumple la condición de victoria (alcanzar la meta de `6` puntos, metros, aciertos o superar el tiempo estipulado). Si hay vidas y se reducen a 0, se llama a `this.gameOver()` permitiendo al jugador reintentar la misión.

---


