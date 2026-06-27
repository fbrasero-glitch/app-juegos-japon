/**
 * Pasaporte Japón - Premium Minigames Engine (Senior Dev Grade)
 * 100% Procedural graphics, particle engines, screenshake, advanced sound synths, and organic animations.
 * Custom built for Laura's Day 3.
 */

window.MinigamesManager = {
    activeGame: null,
    canvas: null,
    ctx: null,
    animationFrameId: null,
    
    // Core engine variables
    state: 'intro', // 'intro', 'playing', 'gameover', 'victory'
    score: 0,
    goal: 100,
    lives: 3,
    particles: [],
    gameTime: 0,
    lastTime: 0,
    isTraining: false,
    screenShake: 0,
    
    // Touch/Mouse positions
    mouse: { x: 0, y: 0, isDown: false, startX: 0, startY: 0 },
    
    // Game-specific configurations and runtime data
    gameData: {},

    init() {
        this.canvas = document.getElementById('minigame-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Bind DOM elements
        this.btnStart = document.getElementById('btn-start-minigame');
        this.btnRetry = document.getElementById('btn-retry-minigame');
        this.btnSubmit = document.getElementById('btn-submit-minigame');
        this.btnClose = document.getElementById('btn-close-minigame');
        
        // Listeners
        if (this.btnStart) this.btnStart.onclick = () => this.start();
        if (this.btnRetry) this.btnRetry.onclick = () => this.restart();
        if (this.btnSubmit) this.btnSubmit.onclick = () => this.submit();
        if (this.btnClose) this.btnClose.onclick = () => this.close();
        
        // Crisp Retina scaling
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Bind input events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.onMouseDown(e.touches[0]);
        }, { passive: false });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.onMouseMove(e.touches[0]);
        }, { passive: false });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.onMouseUp(e);
        }, { passive: false });
    },

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = 800;
        this.canvas.height = 600;
    },

    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / rect.width) * 800,
            y: ((e.clientY - rect.top) / rect.height) * 600
        };
    },

    onMouseDown(e) {
        const coords = this.getCanvasCoords(e);
        this.mouse.x = coords.x;
        this.mouse.y = coords.y;
        this.mouse.startX = coords.x;
        this.mouse.startY = coords.y;
        this.mouse.isDown = true;
        
        if (this.state === 'playing') {
            this.handlePress(coords.x, coords.y);
        }
    },

    onMouseMove(e) {
        const coords = this.getCanvasCoords(e);
        this.mouse.x = coords.x;
        this.mouse.y = coords.y;
    },

    onMouseUp(e) {
        this.mouse.isDown = false;
        if (this.state === 'playing') {
            this.handleRelease(this.mouse.x, this.mouse.y);
        }
    },

    launch(missionId) {
        if (!this.canvas) this.init();
        
        this.isTraining = !window.pendingSubmission;
        this.activeGame = missionId;
        this.state = 'intro';
        this.score = 0;
        this.lives = 3;
        this.particles = [];
        this.gameTime = 0;
        this.screenShake = 0;
        this.lastTime = performance.now();
        this.gameData = {};
        
        // Show view & overlays
        document.getElementById('view-minigame').classList.remove('hidden');
        document.getElementById('minigame-intro').classList.remove('hidden');
        document.getElementById('minigame-outro').classList.add('hidden');
        
        const config = this.getGameConfig(missionId);
        this.goal = config.goal;
        
        document.getElementById('minigame-title').innerText = config.title;
        document.getElementById('minigame-intro-title').innerText = config.title;
        document.getElementById('minigame-intro-desc').innerText = config.instructions;
        document.getElementById('minigame-intro-emoji').innerText = config.emoji;
        
        document.getElementById('minigame-score').innerText = `Puntos: 0`;
        document.getElementById('minigame-goal').innerText = `Meta: ${this.goal}`;
        
        const container = document.getElementById('minigame-container');
        container.style.borderColor = config.color;
        
        this.setupGame(missionId);
        this.drawFrame(0);
    },

    getGameConfig(missionId) {
        switch(missionId) {
            case 'day_3_glico':
                return {
                    title: "Glico Rooftop Runner 🏃‍♂️💨",
                    emoji: "🏃‍♂️",
                    instructions: "¡Siente la velocidad de Dotonbori! Toca la pantalla para saltar y esquivar. Si saltas de nuevo en el aire harás un salto doble con estela de viento. ¡Consigue 300 metros!",
                    goal: 300,
                    color: "#ff7b54"
                };
            case 'day_3_ninja':
                return {
                    title: "Sombras Shinobi: Tiro Arqueado 🥷🎯",
                    emoji: "🏹",
                    instructions: "¡Arrastra hacia atrás y apunta para lanzar shurikens! Las guías te ayudarán a trazar la parábola. Derriba ninjas enemigos y salva a los zorritos Kitsune de oro.",
                    goal: 10,
                    color: "#ff5722"
                };
            case 'day_3_bridge':
                return {
                    title: "El Puente Mágico del Moat 🏯🌸",
                    emoji: "🌸",
                    instructions: "Reconstruye el puente. Toca las piezas del canal para rotarlas. Al conectarlas, el agua mágica fluirá. ¡Haz que Laura Chibi camine de orilla a orilla!",
                    goal: 1,
                    color: "#009688"
                };
            case 'day_3_umeda':
                return {
                    title: "Salto Estelar Umeda Sky 🏢✨",
                    emoji: "🚀",
                    instructions: "¡Ayuda a Laura a volar alto! Arrastra el dedo horizontalmente para moverla. Rebota en las vigas del edificio Umeda y atrapa globos propulsores para llegar a 1500m.",
                    goal: 1500,
                    color: "#607d8b"
                };
            case 'day_3_reflect':
                return {
                    title: "Reflexión Cyberpunk Dotonbori 📡⚡",
                    emoji: "⚡",
                    instructions: "Guía el rayo láser de neón. Toca y rota los prismas reflectores en la cuadrícula de Dotonbori para esquivar barreras y encender el receptor del cartel.",
                    goal: 1,
                    color: "#8d6e63"
                };
            case 'day_3_architect':
                return {
                    title: "Asedio del Castillo: Catapulta Geométrica 🏯☄️",
                    emoji: "☄️",
                    instructions: "Ajusta el ángulo y la fuerza de la catapulta arrastrando hacia atrás. ¡Debes superar el foso de agua y hacer blanco en la muralla del castillo 3 veces!",
                    goal: 3,
                    color: "#00ff99"
                };
            case 'day_3_neon':
                return {
                    title: "Hackeo de Cripto-Neón Akihabara 🔌👾",
                    emoji: "👾",
                    instructions: "Para piratear la red de neones, rota los cables segmentados haciendo clic sobre ellos. Conecta la terminal de energía (izq) con el mainframe central (der) antes de que se agote el tiempo.",
                    goal: 1,
                    color: "#ff007f"
                };
            case 'day_3_rush':
                return {
                    title: "Infiltración Shinobi Osaka 🥷🏯",
                    emoji: "🥷",
                    instructions: "Mantén pulsado para correr hacia el castillo. ¡Pero cuidado! Cuando veas el aviso 🚨 y la linterna de los guardias se mueva, ¡deja de correr para esconderte! Si te mueves bajo la luz, te atraparán.",
                    goal: 500,
                    color: "#ffd700"
                };
            case 'day_3_flow':
                return {
                    title: "Sintonizador de Ondas Dotonbori 📻⚡",
                    emoji: "⚡",
                    instructions: "Sintoniza la frecuencia de la gran valla publicitaria. Ajusta los deslizadores de Frecuencia y Amplitud para que tu onda (verde) encaje perfectamente con la señal objetivo (roja discontinua). Mantén la alineación hasta sincronizar al 100%.",
                    goal: 100,
                    color: "#00ffff"
                };
            case 'day_4_bestiary':
                return {
                    title: "Escáner Alienígena Kuromon 🐙🔎",
                    emoji: "🔎",
                    instructions: "¡Encuentra y clasifica las criaturas mutantes en el mercado de Kuromon! Arrastra el visor del escáner y mantenlo sobre una criatura brillante para analizarla. ¡Cuidado con los peces normales!",
                    goal: 5,
                    color: "#fbc02d"
                };
            case 'day_4_gachapon':
                return {
                    title: "Garra Gachapon Legendaria 🔮🏗️",
                    emoji: "🏗️",
                    instructions: "¡Atrapa las cápsulas de juguete! La garra oscila sola. Toca el canvas para soltarla. Esquiva los engranajes rotatorios que rompen la garra. ¡Encesta 3 cápsulas en la rampa izquierda!",
                    goal: 3,
                    color: "#0288d1"
                };
            case 'day_4_vending_roulette':
                return {
                    title: "Conexión de Refrescos Kawaii 🥤⚡",
                    emoji: "🥤",
                    instructions: "¡Une las latas iguales! Arrastra el dedo sobre latas adyacentes del mismo tipo (horizontal, vertical o diagonal) para conectarlas. ¡Combina 3 o más y suéltalas para servirlas! Logra 35.",
                    goal: 35,
                    color: "#ff9800"
                };
            case 'day_4_crab':
                return {
                    title: "Carrera del Cangrejo de Dotonbori 🦀🏃‍♂️",
                    emoji: "🦀",
                    instructions: "¡Camina de lado y esquiva obstáculos! Toca para saltar sobre las bolas de takoyaki y patos. ¡El doble salto te salvará en el aire! Colecciona monedas para ganar metros. Llega a 300m.",
                    goal: 300,
                    color: "#f44336"
                };
            case 'day_4_knife':
                return {
                    title: "Corte de Precisión: Chef de Doguyasuji 🔪🥢",
                    emoji: "🔪",
                    instructions: "¡Demuestra tu técnica con el acero! Toca la pantalla para bajar el cuchillo y cortar los ingredientes. Consigue un corte PERFECTO sincronizando el momento en que cruzan la línea de corte. ¡Cuidado con las piedras de afilar y cuchillos rotos que dañan tu hoja! Consigue 15.",
                    goal: 15,
                    color: "#ff5722"
                };
            case 'day_4_500yen':
                return {
                    title: "Kombini Dash: Reto 500 Yenes 🍙🛒",
                    emoji: "🛒",
                    instructions: "¡Atrapa los snacks sin pasarte del presupuesto! Arrastra el carro de la compra horizontalmente para recoger Onigiris (150¥), té (130¥), melonpan (160¥) y chocolate (180¥). Si superas los 500¥, la cesta se sobrecargará y se vaciará. ¡Reúne entre 400¥ y 500¥ y pulsa 'PAGAR'!",
                    goal: 1,
                    color: "#00ff99"
                };
            case 'day_4_isshinji':
                return {
                    title: "Infiltración de Datos: Templo Isshinji 🏯💾",
                    emoji: "💾",
                    instructions: "¡Extrae la información oculta de los archivos del templo! Controla el nodo verde de infiltración táctica. Recoge las 3 claves de datos doradas y alcanza la base de datos central (salida) evitando las patrullas rojas del cortafuegos.",
                    goal: 1,
                    color: "#e91e63"
                };
            case 'day_4_tracker':
                return {
                    title: "Visor Táctico: Kuromon Wagyu Hunter 🥩🎯",
                    emoji: "🎯",
                    instructions: "¡Busca y cataloga los puestos de brochetas de Wagyu en el mercado! Arrastra o mueve el visor táctico y haz clic sobre los puestos de Wagyu para escanearlos. ¡No escanees los civiles ni puestos falsos (como pulpos o helados)!",
                    goal: 10,
                    color: "#00ffff"
                };
            case 'day_4_yakiniku':
                return {
                    title: "Maestro del Yakiniku 🔥🥩",
                    emoji: "🥩",
                    instructions: "¡Grilla Wagyu para la familia! Toca las carnes crudas en la parrilla para darles la vuelta cuando estén bien doradas. Toca de nuevo para servirlas cuando ambos lados estén perfectos. ¡Que no se quemen!",
                    goal: 10,
                    color: "#e65100"
                };
            case 'day_5_mochi':
                return {
                    title: "El Ritmo del Mochi Nakatanidou 🔨🍡",
                    emoji: "🍡",
                    instructions: "¡Sincroniza el amasado a toda velocidad! Las notas de Mazo (🔨) y Mano (🤚) descienden. Toca los botones inferiores correspondientes exactamente cuando crucen los círculos de golpe. ¡Consigue 20 aciertos sin cometer más de 3 fallos!",
                    goal: 20,
                    color: "#4caf50"
                };
            case 'day_5_gymnast':
                return {
                    title: "Pose de la Gacela de Nara 🤸‍♀️🦌",
                    emoji: "🤸‍♀️",
                    instructions: "¡Completa las acrobacias con ritmo! Sigue la secuencia de poses gimnásticas que avanzan por la pantalla. Toca el botón con la pose correcta en el instante exacto en que cruza el área activa central para impresionar a los ciervos. Consigue 15.",
                    goal: 15,
                    color: "#f06292"
                };
            case 'day_5_monk':
                return {
                    title: "Meditación Zen del Buda 🧘🪷",
                    emoji: "🪷",
                    instructions: "¡Consigue el autocontrol de un monje zen! Te encuentras meditando sobre una hoja de loto en un estanque. El viento sopla en ráfagas. Toca a la izquierda o derecha de la pantalla para equilibrar tu centro de gravedad. ¡Resiste 15 segundos sin caerte al agua!",
                    goal: 15,
                    color: "#8d6e63"
                };
            case 'day_5_deer_galaxy':
                return {
                    title: "Alimentando Ciervos en Nara 🦌🌾",
                    emoji: "🦌",
                    instructions: "¡Reparte galletas Shika Senbei! Toca a los ciervos hambrientos que corren por el prado para lanzarles una galleta. ¡Cuidado con los cuervos y mapaches ladrones! Si les lanzas galletas o te roban, perderás vidas. Consigue 12.",
                    goal: 12,
                    color: "#00acc1"
                };
            case 'day_5_ribbon':
                return {
                    title: "Danza de la Cinta Sagrada 🌀🪄",
                    emoji: "🪄",
                    instructions: "¡Toma la cinta rítmica y traza las constelaciones mágicas! Sigue el recorrido de la plantilla de neón de una sola pasada manteniendo pulsado el cursor/dedo sin desviarte. ¡Completa 3 constelaciones con más de 80% de precisión!",
                    goal: 3,
                    color: "#0288d1"
                };
            case 'day_5_investor':
                return {
                    title: "Especulador de Recuerdos de Nara 📊💰",
                    emoji: "📊",
                    instructions: "¡Consigue duplicar tus fondos! Monitorea la gráfica financiera en tiempo real de los souvenirs locales (Omamori, peluches y té Matcha). Compra barato (BUY) y vende caro (SELL) para lograr llevar tu saldo de 1,000¥ a 2,000¥ antes de que el mercado cierre.",
                    goal: 2000,
                    color: "#ffb300"
                };
            case 'day_5_zen':
                return {
                    title: "Caligrafía Shodo Digital 🖌️✍️",
                    emoji: "✍️",
                    instructions: "¡Domina el pincel zen! Sigue con cuidado las líneas guía y el orden de los trazos para escribir los Kanjis sagrados de Persona (人) y Montaña (山). Si te sales de la trayectoria el trazo fallará. ¡Completa los 2 Kanjis!",
                    goal: 2,
                    color: "#cddc39"
                };
            case 'day_5_engineer':
                return {
                    title: "Constructor de la Gran Pagoda 🏗️🏯",
                    emoji: "🏯",
                    instructions: "¡Apila las secciones de la pagoda de Todai-ji sin usar un solo clavo! Suelta cada sección en el momento justo para alinearla con la anterior. Si se desvía, la estructura tambaleará. Al final, ¡deberá soportar un sismo de prueba!",
                    goal: 5,
                    color: "#00bcd4"
                };
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
                return {
                    title: "Silencio en el Puente de Nijo 🥷🌉",
                    emoji: "🌉",
                    instructions: "¡Cruza el puente en silencio absoluto! Mantén presionado para caminar. Avanza con cuidado. Si el guardia del Shogun gira la cabeza (parpadea ⚠️), ¡suelta y quédate inmóvil!",
                    goal: 100,
                    color: "#81c784"
                };
            case 'day_6_seal':
                return {
                    title: "El Sello Oculto del Shogun 📸🔍",
                    emoji: "🔍",
                    instructions: "¡Busca los emblemas dorados Tokugawa ocultos en las salas del palacio! Mueve tu linterna por la pantalla oscura y haz clic sobre los 5 sellos brillantes antes de que se acabe el tiempo.",
                    goal: 5,
                    color: "#ffd700"
                };
            case 'day_6_clouds':
                return {
                    title: "Jardín de Pinos-Nube 🌲☁️",
                    emoji: "☁️",
                    instructions: "¡Encuentra la forma del animal en la nube de los pinos! Arrastra y encaja las piezas de animales en la silueta correcta del pino podado en el Palacio Imperial.",
                    goal: 3,
                    color: "#4db6ac"
                };
            case 'day_6_ninja_steps':
                return {
                    title: "Pasos Rítmicos de Ninja 🥷👞",
                    emoji: "🥷",
                    instructions: "¡Cruza el suelo ruiseñor sin hacer sonar sus duelas! Toca los botones de pasos exactamente cuando crucen los círculos de silencio inferior. ¡Consigue 20 aciertos sin despertar al guardia!",
                    goal: 20,
                    color: "#ff7043"
                };
            case 'day_6_tactical':
                return {
                    title: "Infiltración Táctica Nijo 🧭🏰",
                    emoji: "🏰",
                    instructions: "¡Planifica tu ruta hacia el tejado del castillo! Dibuja un camino seguro tocando los nodos. Evita que Iván entre en los conos de visión amarillos de los guardias de patrulla.",
                    goal: 1,
                    color: "#78909c"
                };
            case 'day_6_edict':
                return {
                    title: "Edicto Imperial del Emperador 📜✍️",
                    emoji: "📜",
                    instructions: "¡Redacta la ley más divertida de Kioto! Desplaza la canasta a los lados para atrapar las palabras imperiales que caen y armar la frase. Evita las palabras rojas prohibidas.",
                    goal: 5,
                    color: "#ffd54f"
                };
            case 'day_6_time_travel':
                return {
                    title: "Fotografía de Kyoto 1600 📸⏳",
                    emoji: "⏳",
                    instructions: "¡Inmortaliza la calle Sannenzaka en el año 1600! Toca para borrar todos los elementos modernos que arruinan la toma histórica (cables, postes de luz, teléfonos y turistas).",
                    goal: 10,
                    color: "#ffab91"
                };
            case 'day_6_ring':
                return {
                    title: "El Ritmo del Paso Imperial 🏃‍♂️⏱️",
                    emoji: "⏱️",
                    instructions: "¡Mide tu velocidad imperial! Toca la pantalla manteniendo un tempo constante y regular con el metrónomo. Si te aceleras o retrasas, tropezarás. Completa 100 pasos perfectos.",
                    goal: 100,
                    color: "#26a69a"
                };
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
                return {
                    title: "Cazadora de Kimonos en Gion 📸👘",
                    emoji: "👘",
                    instructions: "¡Retrata los coloridos vestidos tradicionales! Toca la pantalla para capturar una foto con la cámara justo cuando un paseante con kimono tradicional cruce la mira central.",
                    goal: 8,
                    color: "#f06292"
                };
            case 'day_7_kintsugi':
                return {
                    title: "Arte del Kintsugi Dorado 🏺✨",
                    emoji: "🏺",
                    instructions: "¡Restaura la vasija rota con resina de oro! Arrastra tu dedo o ratón a lo largo de las grietas con precisión sin salirte del camino. ¡Une los fragmentos!",
                    goal: 3,
                    color: "#ffd700"
                };
            case 'day_7_tea':
                return {
                    title: "La Ceremonia del Té Matcha 🍵🚶‍♀️",
                    emoji: "🍵",
                    instructions: "¡Lvl la bandeja de té Matcha hirviendo al Shogun! Mantén el té equilibrado arrastrando la bandeja para contrarrestar la inercia del movimiento. ¡No derrames el té Matcha!",
                    goal: 15,
                    color: "#4caf50"
                };
            case 'day_7_stone_guardian':
                return {
                    title: "Abrazo al Pilar Sagrado 🪵🤗",
                    emoji: "🤗",
                    instructions: "¡Mide el diámetro del pilar gigante! Mantén presionado para abrir los brazos de Laura y suelta la pantalla en el instante exacto en que coincida con el borde del pilar.",
                    goal: 3,
                    color: "#ff9800"
                };
            case 'day_7_structural':
                return {
                    title: "Defensor de la Terraza de Madera 🏗️🏯",
                    emoji: "🏯",
                    instructions: "¡Soporta el peso estructural de la terraza de Kiyomizu-dera! Mueve los pilares de soporte horizontalmente para bloquear las esferas de carga pesada que caen.",
                    goal: 15,
                    color: "#00acc1"
                };
            case 'day_7_survival':
                return {
                    title: "Supervivencia al Maleficio 🎒🧪",
                    emoji: "🧪",
                    instructions: "¡Has tropezado en Sannenzaka y te acecha el maleficio! Arrastra el objeto defensivo correcto de tu mochila para anular cada onda mágica: Matcha (Fuego), Omamori (Espíritu), Antídoto (Veneno).",
                    goal: 10,
                    color: "#7e57c2"
                };
            case 'day_7_anti_quake':
                return {
                    title: "Yasaka Pagoda Anti-Sismo 🏗️🌋",
                    emoji: "🌋",
                    instructions: "¡Terremoto en Kioto! Estabiliza la pagoda Yasaka. Arrastra el gran pilar central (Shinbashira) para contrarrestar las ondas sísmicas rojas y evitar el derrumbe durante 15 segundos.",
                    goal: 15,
                    color: "#ff3d00"
                };
            case 'day_7_stairs':
                return {
                    title: "Conquista de las Escaleras 🏃‍♂️🪜",
                    emoji: "🪜",
                    instructions: "¡Sube las empinadas escaleras de Kiyomizu! Salta (toca una vez) o doble salta (toca dos veces) para superar farolas y turistas distraídos. ¡Alcanza los 100 escalones!",
                    goal: 100,
                    color: "#009688"
                };
            case 'day_7_geisha':
                return {
                    title: "El Código de Faroles de Gion 🏮🎶",
                    emoji: "🏮",
                    instructions: "¡Memoriza la melodía de los farolillos! Observa la secuencia de iluminación de los faroles Chōchin tradicionales y repítela haciendo clic en el orden correcto.",
                    goal: 5,
                    color: "#ff9800"
                };
            case 'day_8_kid9_rake':
                return {
                    title: "El Rastrillo del Jardinero 🎋🌸",
                    emoji: "🎋",
                    instructions: "¡Dibuja ondas zen en la arena del jardín Tenryu-ji! Arrastra tu dedo o ratón para rastrillar la arena. ¡Cubre el 85% de la superficie para completar el jardín!",
                    goal: 85,
                    color: "#81c784"
                };
            case 'day_8_kid14_wave_sync':
                return {
                    title: "Sincronización de Frecuencias ⚡📶",
                    emoji: "⚡",
                    instructions: "¡Ajusta Amplitud (arriba/abajo), Frecuencia (izq/der) y Fase (deslizar horizontal) para sincronizar tu onda verde con la del bosque! (3 niveles)",
                    goal: 3,
                    color: "#00e676"
                };
            case 'day_9_kid9_scratch':
                return {
                    title: "Limpia el Reflejo de Oro ⛩️✨",
                    emoji: "⛩️",
                    instructions: "¡Limpia el lodo y hojas del estanque de Kinkaku-ji! Arrastra tu dedo para limpiar la superficie y revelar el Pabellón Dorado.",
                    goal: 90,
                    color: "#ffd700"
                };
            case 'day_9_kid14_torii':
                return {
                    title: "Laberinto de Torii ⛩️🧩",
                    emoji: "⛩️",
                    instructions: "¡Alinea las puertas Torii para guiar la energía sagrada! Toca cada pieza del laberinto para rotarla y conectar la entrada con la salida.",
                    goal: 1,
                    color: "#ff5722"
                };
            case 'day_10_kid9_bento':
                return {
                    title: "El Maestro del Bento 🍱🍣",
                    emoji: "🍱",
                    instructions: "¡Prepara la caja Bento perfecta! Arrastra cada ingrediente desde la bandeja inferior hasta su compartimento correspondiente.",
                    goal: 4,
                    color: "#c0392b"
                };
            case 'day_10_kid14_crypto':
                return {
                    title: "Enlace Cifrado del Shinobi 🔒💻",
                    emoji: "🔒",
                    instructions: "¡Hackea la terminal de acceso! Pulsa o dispara a las letras flotantes correctas en orden para deletrear la clave: KYOTO_ANNEX.",
                    goal: 11,
                    color: "#00e5ff"
                };
            case 'day_8_kid9_pose':
                return {
                    title: "El Trono de Piedra 🗿👤",
                    emoji: "🗿",
                    instructions: "Alinea las articulaciones del muñeco arrastrando los puntos amarillos para imitar la pose exacta de la estatua Rakan.",
                    goal: 90,
                    color: "#8d6e63"
                };
            case 'day_8_kid9_wind':
                return {
                    title: "El Susurro del Viento 🍃🌬️",
                    emoji: "🍃",
                    instructions: "¡El bosque te escucha! Arrastra tu ratón/dedo para crear ráfagas de viento y barrer las hojas de bambú fuera de la pantalla.",
                    goal: 25,
                    color: "#a1c4fd"
                };
            case 'day_8_kid9_bamboo_clock':
                return {
                    title: "El Reloj de Bambú 🎋⏰",
                    emoji: "🎋",
                    instructions: "¡Toca la pantalla justo cuando el nodo de bambú en crecimiento se alinee perfectamente con el círculo objetivo!",
                    goal: 10,
                    color: "#4caf50"
                };
            case 'day_8_kid9_giants':
                return {
                    title: "Perspectiva de Gigantes 📸🎋",
                    emoji: "📸",
                    instructions: "Arrastra la cámara verticalmente para alinear la altura visual de las 3 copas de bambú gigantes. Mantén la alineación por 2 segundos.",
                    goal: 2,
                    color: "#81c784"
                };
            case 'day_8_kid9_monk':
                return {
                    title: "El Mensaje del Monje 🔔🧘",
                    emoji: "🧘",
                    instructions: "Observa la secuencia en la que el monje golpea los cuencos tibetanos y repítela pulsando los cuencos correctos.",
                    goal: 4,
                    color: "#78909c"
                };
            case 'day_8_kid14_bosque':
                return {
                    title: "El Bosque de 2.7km 🏃🎋",
                    emoji: "🏃",
                    instructions: "¡Esquiva los obstáculos del camino! Pulsa los lados izquierdo/derecho de la pantalla para mover al corredor shinobi por los carriles.",
                    goal: 250,
                    color: "#2e7d32"
                };
            case 'day_8_kid14_arashiyama':
                return {
                    title: "El Guardián del Bambú 🎋🪓",
                    emoji: "🪓",
                    instructions: "Corta trozos del bambú pulsando en la parte izquierda/derecha de la pantalla. ¡Esquiva las ramas que caen!",
                    goal: 30,
                    color: "#4caf50"
                };
            case 'day_8_fam_squad':
                return {
                    title: "Escuadrón Bambú 👥🎋",
                    emoji: "👥",
                    instructions: "¡Misión de escuadrón camuflado! Haz clic para ocultar/agachar a los miembros de la familia justo cuando los bambúes pasen.",
                    goal: 5,
                    color: "#81c784"
                };
            case 'day_9_kid9_zorros':
                return {
                    title: "La Escalada de los Zorros 🦊⛰️",
                    emoji: "🦊",
                    instructions: "Ayuda al pequeño kitsune a trepar el Monte Inari saltando entre plataformas. Pulsa izquierda/derecha para moverlo.",
                    goal: 150,
                    color: "#ff9800"
                };
            case 'day_9_kid9_altar':
                return {
                    title: "El Altar Secreto 🏮🔮",
                    emoji: "🔮",
                    instructions: "Arrastra las ofrendas (sake 🍶, arroz 🍚 y velas 🕯️) a sus altares elementales correspondientes para activar el flujo espiritual.",
                    goal: 4,
                    color: "#e65100"
                };
            case 'day_9_kid14_gravity':
                return {
                    title: "Piedra Gravedad 🪨⏱️",
                    emoji: "🪨",
                    instructions: "Pulsa para soltar la piedra de gravedad de Arashiyama. Vuelve a pulsar en el instante exacto en que cruza la línea objetivo.",
                    goal: 3,
                    color: "#ff5722"
                };
            case 'day_9_kid14_angulo':
                return {
                    title: "Ángulo Imposible 📐📡",
                    emoji: "📐",
                    instructions: "Arrastra y rota el espejo central del canvas para guiar el haz láser de luz sagrada hasta el receptor rojo.",
                    goal: 2,
                    color: "#00e676"
                };
            case 'day_9_kid14_ave':
                return {
                    title: "La Postura del Ave Dorada 🦅⚖️",
                    emoji: "🦅",
                    instructions: "Mantén el equilibrio del Fénix de oro. Pulsa a la izquierda/derecha para compensar la barra de balance y evitar que caiga.",
                    goal: 10,
                    color: "#ffd700"
                };
            case 'day_9_kid14_tunnel':
                return {
                    title: "El Túnel Infinito ⛩️🕳️",
                    emoji: "⛩️",
                    instructions: "Vuela a través del túnel interminable. Esquiva los arcos Torii rojos deslizándote a la izquierda/derecha y cruza los verdes.",
                    goal: 15,
                    color: "#ff3d00"
                };
            case 'day_9_fam_portal':
                return {
                    title: "La Puerta a Otro Mundo ⛩️🌀",
                    emoji: "🌀",
                    instructions: "Toca las 4 gemas del portal Torii en la secuencia exacta en que parpadean para abrir la puerta de energía mística.",
                    goal: 3,
                    color: "#ffd700"
                };
            case 'day_10_kid9_nishiki':
                return {
                    title: "Maestro Chatarra 🍤🧺",
                    emoji: "🧺",
                    instructions: "Recoge los deliciosos mariscos 🍤 y mochis 🍡 desplazando la cesta con el ratón. Evita recoger las latas y basura.",
                    goal: 15,
                    color: "#f7c948"
                };
            case 'day_10_kid9_dragon':
                return {
                    title: "El Dragón del Mercado 🐉🍎",
                    emoji: "🐉",
                    instructions: "Guía al dragón del festival para comer linternas. ¡Cada linterna lo hará más largo! Evita chocar contra los bordes de la pantalla.",
                    goal: 10,
                    color: "#ff5722"
                };
            case 'day_10_kid9_rainbow':
                return {
                    title: "El Snack Arcoíris 🍡🌈",
                    emoji: "🌈",
                    instructions: "Arrastra rápidamente cada snack (rosa, verde o amarillo) al plato de su color correspondiente antes de que toquen el suelo.",
                    goal: 12,
                    color: "#e91e63"
                };
            case 'day_10_kid9_matcha':
                return {
                    title: "Poción de Matcha 🍵🥄",
                    emoji: "🍵",
                    instructions: "Mueve el batidor de bambú arrastrando rápidamente de izquierda a derecha de forma continua para levantar espuma en el té.",
                    goal: 100,
                    color: "#4caf50"
                };
            case 'day_10_kid14_milla':
                return {
                    title: "La Milla del Samurái 🏃⚔️",
                    emoji: "⚔️",
                    instructions: "¡Carrera de entrenamiento samurái! Pulsa la pantalla para saltar sobre los barriles y carros en Nishiki Market.",
                    goal: 300,
                    color: "#e91e63"
                };
            case 'day_10_kid14_tako':
                return {
                    title: "Comida Bizarra 🐙🍢",
                    emoji: "🐙",
                    instructions: "¡Ensarta los pulpos en Nishiki! Golpea (haz click) sobre los pulpos bebé que asoman de las cajas antes de que vuelvan a esconderse.",
                    goal: 15,
                    color: "#bf360c"
                };
            case 'day_10_fam_sayonara':
                return {
                    title: "Sayonara Kioto 🌸🧩",
                    emoji: "🌸",
                    instructions: "Encuentra las parejas de cartas memorizando sus posiciones. Toca las cartas de dos en dos para descubrir los iconos iguales.",
                    goal: 6,
                    color: "#ff8a80"
                };
            default:
                return { title: "Minijuego", emoji: "🎮", instructions: "Completa el desafío.", goal: 100, color: "#ffd700" };
        }
    },

    start() {
        document.getElementById('minigame-intro').classList.add('hidden');
        this.state = 'playing';
        if (window.playProceduralSound) window.playProceduralSound('success');
        
        this.lastTime = performance.now();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
    },

    restart() {
        this.launch(this.activeGame);
        this.start();
    },

    loop(timestamp) {
        if (this.state !== 'playing') return;
        
        let dt = (timestamp - this.lastTime) / 1000;
        if (dt > 0.1) dt = 0.1;
        this.lastTime = timestamp;
        this.gameTime += dt;
        
        if (this.screenShake > 0) {
            this.screenShake -= dt * 15;
            if (this.screenShake < 0) this.screenShake = 0;
        }
        
        try {
            this.updateGame(dt);
            this.drawFrame(dt);
        } catch (error) {
            console.error("Game loop error:", error);
            this.state = 'error';
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(0, 0, 800, 600);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText("CRITICAL GAME ERROR:", 50, 100);
            this.ctx.fillText(error.message, 50, 140);
            this.ctx.fillText(error.stack ? error.stack.split('\n')[0] : "", 50, 180);
            return;
        }
        
        this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
    },

    close() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        document.getElementById('view-minigame').classList.add('hidden');
        if (window.playProceduralSound) window.playProceduralSound('click');
        if (typeof switchView === 'function') switchView('view-mission', true, "Misión");
    },

    submit() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        document.getElementById('view-minigame').classList.add('hidden');
        
        if (!this.isTraining && window.pendingSubmission) {
            const p = window.pendingSubmission;
            window.pendingSubmission = null;
            if (typeof submitMission === 'function') {
                submitMission(p.missionId, p.submissionData, p.role, p.isFamily, true);
            }
        } else {
            if (typeof switchView === 'function') switchView('view-mission', true, "Misión");
        }
    },

    win() {
        this.state = 'victory';
        if (window.playProceduralSound) window.playProceduralSound('win');
        
        const outro = document.getElementById('minigame-outro');
        outro.classList.remove('hidden');
        document.getElementById('minigame-outro-emoji').innerText = "🏆";
        document.getElementById('minigame-outro-title').innerText = "¡Victoria Total!";
        document.getElementById('minigame-outro-title').style.color = "#00ff99";
        
        let msg = `¡Increíble habilidad! Has completado el juego de forma excelente.`;
        if (this.isTraining) msg += ` (Entrenamiento completado)`;
        document.getElementById('minigame-outro-desc').innerText = msg;
        
        this.btnSubmit.innerText = this.isTraining ? "Volver a la Misión" : "Enviar al Juez Supremo";
    },

    gameOver() {
        this.state = 'gameover';
        if (window.playProceduralSound) window.playProceduralSound('error');
        
        const outro = document.getElementById('minigame-outro');
        outro.classList.remove('hidden');
        document.getElementById('minigame-outro-emoji').innerText = "💀";
        document.getElementById('minigame-outro-title').innerText = "Partida Perdida";
        document.getElementById('minigame-outro-title').style.color = "#ff3333";
        document.getElementById('minigame-outro-desc').innerText = "¡Oh no! No te rindas. Vuelve a intentarlo para superar el desafío.";
        this.btnSubmit.innerText = "Continuar";
    },

    triggerShake(amount = 8) {
        this.screenShake = amount;
    },

    createExplosion(x, y, color, count = 15, sizeScale = 1) {
        for(let i=0; i<count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: (2 + Math.random() * 4) * sizeScale,
                color: color,
                life: 1.0,
                decay: 0.015 + Math.random() * 0.025
            });
        }
    },

    updateParticles(dt) {
        for(let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    drawParticles() {
        this.ctx.save();
        for(let p of this.particles) {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    },

    // ==========================================================
    // INPUT ROUTING
    // ==========================================================
    handlePress(x, y) {
        switch(this.activeGame) {
            case 'day_3_glico':
                this.inputGlico();
                break;
            case 'day_3_bridge':
                this.inputBridge(x, y);
                break;
            case 'day_3_reflect':
                this.inputReflect(x, y);
                break;
            case 'day_3_architect':
                this.inputArchitectPress(x, y);
                break;
            case 'day_3_neon':
                this.inputNeonPress(x, y);
                break;
            case 'day_3_rush':
                this.inputRushPress(x, y);
                break;
            case 'day_3_flow':
                this.inputFlowPress(x, y);
                break;
            case 'day_4_bestiary':
                this.inputBestiaryPress(x, y);
                break;
            case 'day_4_gachapon':
                this.inputGachaponPress(x, y);
                break;
            case 'day_4_vending_roulette':
                this.inputVendingPress(x, y);
                break;
            case 'day_4_crab':
                this.inputCrabPress(x, y);
                break;
            case 'day_4_knife':
                this.inputKnifePress(x, y);
                break;
            case 'day_4_500yen':
                this.input500YenPress(x, y);
                break;
            case 'day_4_isshinji':
                this.inputIsshinjiPress(x, y);
                break;
            case 'day_4_tracker':
                this.inputTrackerPress(x, y);
                break;
            case 'day_4_yakiniku':
                this.inputYakinikuPress(x, y);
                break;
            case 'day_5_mochi':
                this.inputMochiPress(x, y);
                break;
            case 'day_5_gymnast':
                this.inputGymnastPress(x, y);
                break;
            case 'day_5_monk':
                this.inputMonkPress(x, y);
                break;
            case 'day_5_deer_galaxy':
                this.inputDeerPress(x, y);
                break;
            case 'day_5_ribbon':
                this.inputRibbonPress(x, y);
                break;
            case 'day_5_investor':
                this.inputInvestorPress(x, y);
                break;
            case 'day_5_zen':
                this.inputZenPress(x, y);
                break;
            case 'day_5_engineer':
                this.inputEngineerPress(x, y);
                break;
            case 'day_5_guardian':
                this.inputGuardianPress(x, y);
                break;
            // Day 6
            case 'day_6_evasion':
                this.inputEvasionPress(x, y);
                break;
            case 'day_6_seal':
                this.inputSealPress(x, y);
                break;
            case 'day_6_clouds':
                this.inputCloudsPress(x, y);
                break;
            case 'day_6_ninja_steps':
                this.inputNinjaStepsPress(x, y);
                break;
            case 'day_6_tactical':
                this.inputTacticalPress(x, y);
                break;
            case 'day_6_edict':
                this.inputEdictPress(x, y);
                break;
            case 'day_6_time_travel':
                this.inputTimeTravelPress(x, y);
                break;
            case 'day_6_ring':
                this.inputRingPress(x, y);
                break;
            case 'day_6_clan':
                this.inputClanPress(x, y);
                break;
            // Day 7
            case 'day_7_kimono':
                this.inputKimonoPress(x, y);
                break;
            case 'day_7_kintsugi':
                this.inputKintsugiPress(x, y);
                break;
            case 'day_7_tea':
                this.inputTeaPress(x, y);
                break;
            case 'day_7_stone_guardian':
                this.inputStoneGuardianPress(x, y);
                break;
            case 'day_7_structural':
                this.inputStructuralPress(x, y);
                break;
            case 'day_7_survival':
                this.inputSurvivalPress(x, y);
                break;
            case 'day_7_anti_quake':
                this.inputAntiQuakePress(x, y);
                break;
            case 'day_7_stairs':
                this.inputStairsPress(x, y);
                break;
            case 'day_7_geisha':
                this.inputGeishaPress(x, y);
                break;
            case 'day_8_kid9_rake':
                this.inputRakePress(x, y);
                break;
            case 'day_8_kid14_wave_sync':
                this.inputWaveSyncPress(x, y);
                break;
            case 'day_9_kid9_scratch':
                this.inputScratchPress(x, y);
                break;
            case 'day_9_kid14_torii':
                this.inputToriiPress(x, y);
                break;
            case 'day_10_kid9_bento':
                this.inputBentoPress(x, y);
                break;
            case 'day_10_kid14_crypto':
                this.inputCryptoPress(x, y);
                break;
            case 'day_8_kid9_pose':
                this.inputPosePress(x, y);
                break;
            case 'day_8_kid9_bamboo_clock':
                this.inputBambooClockPress(x, y);
                break;
            case 'day_8_kid9_monk':
                this.inputMonkPress(x, y);
                break;
            case 'day_8_kid14_bosque':
                this.inputBosquePress(x, y);
                break;
            case 'day_8_kid14_arashiyama':
                this.inputArashiyamaGamePress(x, y);
                break;
            case 'day_8_fam_squad':
                this.inputFamSquadPress(x, y);
                break;
            case 'day_9_kid9_zorros':
                this.inputZorrosPress(x, y);
                break;
            case 'day_9_kid9_altar':
                this.inputAltarPress(x, y);
                break;
            case 'day_9_kid14_gravity':
                this.inputGravityPress(x, y);
                break;
            case 'day_9_kid14_angulo':
                this.inputAnguloPress(x, y);
                break;
            case 'day_9_kid14_ave':
                this.inputAvePress(x, y);
                break;
            case 'day_9_kid14_tunnel':
                this.inputTunnelPress(x, y);
                break;
            case 'day_9_fam_portal':
                this.inputFamPortalPress(x, y);
                break;
            case 'day_10_kid9_dragon':
                this.inputDragonPress(x, y);
                break;
            case 'day_10_kid9_rainbow':
                this.inputRainbowPress(x, y);
                break;
            case 'day_10_kid14_milla':
                this.inputMillaPress(x, y);
                break;
            case 'day_10_kid14_tako':
                this.inputTakoPress(x, y);
                break;
            case 'day_10_fam_sayonara':
                this.inputSayonaraPress(x, y);
                break;
        }
    },

    handleRelease(x, y) {
        switch(this.activeGame) {
            case 'day_3_ninja':
                this.releaseNinja(x, y);
                break;
            case 'day_3_architect':
                this.releaseArchitect(x, y);
                break;
            case 'day_3_rush':
                this.releaseRush(x, y);
                break;
            case 'day_4_vending_roulette':
                this.releaseVending(x, y);
                break;
            case 'day_5_ribbon':
                this.releaseRibbon(x, y);
                break;
            case 'day_5_zen':
                this.releaseZen(x, y);
                break;
            case 'day_6_evasion':
                this.releaseEvasion(x, y);
                break;
            case 'day_7_kintsugi':
                this.releaseKintsugi(x, y);
                break;
            case 'day_7_stone_guardian':
                this.releaseStoneGuardian(x, y);
                break;
            case 'day_7_anti_quake':
                this.releaseAntiQuake(x, y);
                break;
            case 'day_8_kid9_rake':
                this.releaseRake(x, y);
                break;
            case 'day_8_kid9_pose':
                this.releasePose(x, y);
                break;
            case 'day_9_kid9_scratch':
                this.releaseScratch(x, y);
                break;
            case 'day_9_kid9_altar':
                this.releaseAltar(x, y);
                break;
            case 'day_10_kid9_bento':
                this.releaseBento(x, y);
                break;
            case 'day_10_kid9_rainbow':
                this.releaseRainbow(x, y);
                break;
        }
    },

    // ==========================================================
    // GAME INITIALIZER, UPDATE AND DRAW ROUTERS
    // ==========================================================
    setupGame(missionId) {
        this.ctx.clearRect(0,0,800,600);
        this.mouse.x = 400;
        this.mouse.y = 300;
        this.mouse.isDown = false;
        
        switch(missionId) {
            case 'day_3_glico':
                this.gameData = {
                    player: { x: 100, y: 400, vy: 0, w: 40, h: 70, jumping: false, jumps: 0, health: 3, invuln: 0 },
                    platforms: [
                        { x: 0, y: 480, w: 550, h: 220 },
                        { x: 650, y: 420, w: 320, h: 220 },
                        { x: 1080, y: 460, w: 450, h: 220 }
                    ],
                    obstacles: [
                        { x: 780, y: 380, w: 30, h: 40, hit: false }
                    ],
                    items: [
                        { x: 700, y: 310, w: 24, h: 24, collected: false },
                        { x: 1250, y: 360, w: 24, h: 24, collected: false }
                    ],
                    bgScroll: 0,
                    neonScroll: 0
                };
                break;
                
            case 'day_3_ninja':
                this.gameData = {
                    shurikens: [],
                    targets: [],
                    spawnTimer: 0,
                    score: 0,
                    kitsuneHit: 0
                };
                break;
                
            case 'day_3_bridge':
                this.gameData = {
                    grid: [
                        [ {type:'S', angle: 0}, {type:'E'}, {type:'E'}, {type:'E'} ], 
                        [ {type:'L', angle: 90}, {type:'S', angle: 90}, {type:'L', angle: 0}, {type:'E'} ],
                        [ {type:'E'}, {type:'L', angle: 180}, {type:'S', angle: 90}, {type:'L', angle: 270} ],
                        [ {type:'S', angle: 90}, {type:'S', angle: 0}, {type:'L', angle: 90}, {type:'L', angle: 90} ],
                        [ {type:'L', angle: 180}, {type:'S', angle: 0}, {type:'E'}, {type:'S', angle: 0} ]  
                    ],
                    completed: false,
                    walkProgress: 0,
                    path: [],
                    petals: []
                };
                // Initialize floating sakura petals
                for (let i = 0; i < 15; i++) {
                    this.gameData.petals.push({
                        x: Math.random() * 800,
                        y: Math.random() * 600,
                        size: 5 + Math.random() * 8,
                        speed: 12 + Math.random() * 18,
                        sway: Math.random() * 100,
                        angle: Math.random() * Math.PI
                    });
                }
                // Randomly rotate elements at start
                for(let col=0; col<5; col++) {
                    for(let row=0; row<4; row++) {
                        const cell = this.gameData.grid[col][row];
                        if (cell.type !== 'E' && (col > 0 || row > 0)) {
                            cell.angle = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
                        }
                    }
                }
                this.solveBridge();
                break;
                
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
                
            case 'day_3_reflect':
                this.gameData = this.generateReflectPuzzle();
                this.traceLaser();
                break;
            case 'day_3_architect':
                this.setupArchitect();
                break;
            case 'day_3_neon':
                this.setupNeon();
                break;
            case 'day_3_rush':
                this.setupRush();
                break;
            case 'day_3_flow':
                this.setupFlow();
                break;
            case 'day_4_bestiary':
                this.setupBestiary();
                break;
            case 'day_4_gachapon':
                this.setupGachapon();
                break;
            case 'day_4_vending_roulette':
                this.setupVending();
                break;
            case 'day_4_crab':
                this.setupCrab();
                break;
            case 'day_4_knife':
                this.setupKnife();
                break;
            case 'day_4_500yen':
                this.setup500Yen();
                break;
            case 'day_4_isshinji':
                this.setupIsshinji();
                break;
            case 'day_4_tracker':
                this.setupTracker();
                break;
            case 'day_4_yakiniku':
                this.setupYakiniku();
                break;
            case 'day_5_mochi':
                this.setupMochi();
                break;
            case 'day_5_gymnast':
                this.setupGymnast();
                break;
            case 'day_5_monk':
                this.setupMonk();
                break;
            case 'day_5_deer_galaxy':
                this.setupDeer();
                break;
            case 'day_5_ribbon':
                this.setupRibbon();
                break;
            case 'day_5_investor':
                this.setupInvestor();
                break;
            case 'day_5_zen':
                this.setupZen();
                break;
            case 'day_5_engineer':
                this.setupEngineer();
                break;
            case 'day_5_guardian':
                this.setupGuardian();
                break;
            // Day 6
            case 'day_6_evasion':
                this.setupEvasion();
                break;
            case 'day_6_seal':
                this.setupSeal();
                break;
            case 'day_6_clouds':
                this.setupClouds();
                break;
            case 'day_6_ninja_steps':
                this.setupNinjaSteps();
                break;
            case 'day_6_tactical':
                this.setupTactical();
                break;
            case 'day_6_edict':
                this.setupEdict();
                break;
            case 'day_6_time_travel':
                this.setupTimeTravel();
                break;
            case 'day_6_ring':
                this.setupRing();
                break;
            case 'day_6_clan':
                this.setupClan();
                break;
            // Day 7
            case 'day_7_kimono':
                this.setupKimono();
                break;
            case 'day_7_kintsugi':
                this.setupKintsugi();
                break;
            case 'day_7_tea':
                this.setupTea();
                break;
            case 'day_7_stone_guardian':
                this.setupStoneGuardian();
                break;
            case 'day_7_structural':
                this.setupStructural();
                break;
            case 'day_7_survival':
                this.setupSurvival();
                break;
            case 'day_7_anti_quake':
                this.setupAntiQuake();
                break;
            case 'day_7_stairs':
                this.setupStairs();
                break;
            case 'day_7_geisha':
                this.setupGeisha();
                break;
            case 'day_8_kid9_rake':
                this.setupRake();
                break;
            case 'day_8_kid14_wave_sync':
                this.setupWaveSync();
                break;
            case 'day_9_kid9_scratch':
                this.setupScratch();
                break;
            case 'day_9_kid14_torii':
                this.setupTorii();
                break;
            case 'day_10_kid9_bento':
                this.setupBento();
                break;
            case 'day_10_kid14_crypto':
                this.setupCrypto();
                break;
            case 'day_8_kid9_pose':
                this.setupPose();
                break;
            case 'day_8_kid9_wind':
                this.setupWind();
                break;
            case 'day_8_kid9_bamboo_clock':
                this.setupBambooClock();
                break;
            case 'day_8_kid9_giants':
                this.setupGiants();
                break;
            case 'day_8_kid9_monk':
                this.setupMonk();
                break;
            case 'day_8_kid14_bosque':
                this.setupBosque();
                break;
            case 'day_8_kid14_arashiyama':
                this.setupArashiyamaGame();
                break;
            case 'day_8_fam_squad':
                this.setupFamSquad();
                break;
            case 'day_9_kid9_zorros':
                this.setupZorros();
                break;
            case 'day_9_kid9_altar':
                this.setupAltar();
                break;
            case 'day_9_kid14_gravity':
                this.setupGravity();
                break;
            case 'day_9_kid14_angulo':
                this.setupAngulo();
                break;
            case 'day_9_kid14_ave':
                this.setupAve();
                break;
            case 'day_9_kid14_tunnel':
                this.setupTunnel();
                break;
            case 'day_9_fam_portal':
                this.setupFamPortal();
                break;
            case 'day_10_kid9_nishiki':
                this.setupNishiki();
                break;
            case 'day_10_kid9_dragon':
                this.setupDragon();
                break;
            case 'day_10_kid9_rainbow':
                this.setupRainbow();
                break;
            case 'day_10_kid9_matcha':
                this.setupMatcha();
                break;
            case 'day_10_kid14_milla':
                this.setupMilla();
                break;
            case 'day_10_kid14_tako':
                this.setupTako();
                break;
            case 'day_10_fam_sayonara':
                this.setupSayonara();
                break;
        }
    },

    updateGame(dt) {
        switch(this.activeGame) {
            case 'day_3_glico':
                this.updateGlico(dt);
                break;
            case 'day_3_ninja':
                this.updateNinja(dt);
                break;
            case 'day_3_bridge':
                this.updateBridge(dt);
                break;
            case 'day_3_umeda':
                this.updateUmeda(dt);
                break;
            case 'day_3_reflect':
                this.updateReflect(dt);
                break;
            case 'day_3_architect':
                this.updateArchitect(dt);
                break;
            case 'day_3_neon':
                this.updateNeon(dt);
                break;
            case 'day_3_rush':
                this.updateRush(dt);
                break;
            case 'day_3_flow':
                this.updateFlow(dt);
                break;
            case 'day_4_bestiary':
                this.updateBestiary(dt);
                break;
            case 'day_4_gachapon':
                this.updateGachapon(dt);
                break;
            case 'day_4_vending_roulette':
                this.updateVending(dt);
                break;
            case 'day_4_crab':
                this.updateCrab(dt);
                break;
            case 'day_4_knife':
                this.updateKnife(dt);
                break;
            case 'day_4_500yen':
                this.update500Yen(dt);
                break;
            case 'day_4_isshinji':
                this.updateIsshinji(dt);
                break;
            case 'day_4_tracker':
                this.updateTracker(dt);
                break;
            case 'day_4_yakiniku':
                this.updateYakiniku(dt);
                break;
            case 'day_5_mochi':
                this.updateMochi(dt);
                break;
            case 'day_5_gymnast':
                this.updateGymnast(dt);
                break;
            case 'day_5_monk':
                this.updateMonk(dt);
                break;
            case 'day_5_deer_galaxy':
                this.updateDeer(dt);
                break;
            case 'day_5_ribbon':
                this.updateRibbon(dt);
                break;
            case 'day_5_investor':
                this.updateInvestor(dt);
                break;
            case 'day_5_zen':
                this.updateZen(dt);
                break;
            case 'day_5_engineer':
                this.updateEngineer(dt);
                break;
            case 'day_5_guardian':
                this.updateGuardian(dt);
                break;
            // Day 6
            case 'day_6_evasion':
                this.updateEvasion(dt);
                break;
            case 'day_6_seal':
                this.updateSeal(dt);
                break;
            case 'day_6_clouds':
                this.updateClouds(dt);
                break;
            case 'day_6_ninja_steps':
                this.updateNinjaSteps(dt);
                break;
            case 'day_6_tactical':
                this.updateTactical(dt);
                break;
            case 'day_6_edict':
                this.updateEdict(dt);
                break;
            case 'day_6_time_travel':
                this.updateTimeTravel(dt);
                break;
            case 'day_6_ring':
                this.updateRing(dt);
                break;
            case 'day_6_clan':
                this.updateClan(dt);
                break;
            // Day 7
            case 'day_7_kimono':
                this.updateKimono(dt);
                break;
            case 'day_7_kintsugi':
                this.updateKintsugi(dt);
                break;
            case 'day_7_tea':
                this.updateTea(dt);
                break;
            case 'day_7_stone_guardian':
                this.updateStoneGuardian(dt);
                break;
            case 'day_7_structural':
                this.updateStructural(dt);
                break;
            case 'day_7_survival':
                this.updateSurvival(dt);
                break;
            case 'day_7_anti_quake':
                this.updateAntiQuake(dt);
                break;
            case 'day_7_stairs':
                this.updateStairs(dt);
                break;
            case 'day_7_geisha':
                this.updateGeisha(dt);
                break;
            case 'day_8_kid9_rake':
                this.updateRake(dt);
                break;
            case 'day_8_kid14_wave_sync':
                this.updateWaveSync(dt);
                break;
            case 'day_9_kid9_scratch':
                this.updateScratch(dt);
                break;
            case 'day_9_kid14_torii':
                this.updateTorii(dt);
                break;
            case 'day_10_kid9_bento':
                this.updateBento(dt);
                break;
            case 'day_10_kid14_crypto':
                this.updateCrypto(dt);
                break;
            case 'day_8_kid9_pose':
                this.updatePose(dt);
                break;
            case 'day_8_kid9_wind':
                this.updateWind(dt);
                break;
            case 'day_8_kid9_bamboo_clock':
                this.updateBambooClock(dt);
                break;
            case 'day_8_kid9_giants':
                this.updateGiants(dt);
                break;
            case 'day_8_kid9_monk':
                this.updateMonk(dt);
                break;
            case 'day_8_kid14_bosque':
                this.updateBosque(dt);
                break;
            case 'day_8_kid14_arashiyama':
                this.updateArashiyamaGame(dt);
                break;
            case 'day_8_fam_squad':
                this.updateFamSquad(dt);
                break;
            case 'day_9_kid9_zorros':
                this.updateZorros(dt);
                break;
            case 'day_9_kid9_altar':
                this.updateAltar(dt);
                break;
            case 'day_9_kid14_gravity':
                this.updateGravity(dt);
                break;
            case 'day_9_kid14_angulo':
                this.updateAngulo(dt);
                break;
            case 'day_9_kid14_ave':
                this.updateAve(dt);
                break;
            case 'day_9_kid14_tunnel':
                this.updateTunnel(dt);
                break;
            case 'day_9_fam_portal':
                this.updateFamPortal(dt);
                break;
            case 'day_10_kid9_nishiki':
                this.updateNishiki(dt);
                break;
            case 'day_10_kid9_dragon':
                this.updateDragon(dt);
                break;
            case 'day_10_kid9_rainbow':
                this.updateRainbow(dt);
                break;
            case 'day_10_kid9_matcha':
                this.updateMatcha(dt);
                break;
            case 'day_10_kid14_milla':
                this.updateMilla(dt);
                break;
            case 'day_10_kid14_tako':
                this.updateTako(dt);
                break;
            case 'day_10_fam_sayonara':
                this.updateSayonara(dt);
                break;
        }
        this.updateParticles(dt);
    },

    drawFrame(dt) {
        try {
            this.ctx.save();
            
            // Apply Screenshake translate transformations
            if (this.screenShake > 0) {
                const dx = (Math.random() - 0.5) * this.screenShake;
                const dy = (Math.random() - 0.5) * this.screenShake;
                this.ctx.translate(dx, dy);
            }
            
            this.ctx.fillStyle = '#0a0a14';
            this.ctx.fillRect(0, 0, 800, 600);
            
            switch(this.activeGame) {
                case 'day_3_glico':
                    this.drawGlico();
                    break;
                case 'day_3_ninja':
                    this.drawNinja();
                    break;
                case 'day_3_bridge':
                    this.drawBridge();
                    break;
                case 'day_3_umeda':
                    this.drawUmeda();
                    break;
                case 'day_3_reflect':
                    this.drawReflect();
                    break;
                case 'day_3_architect':
                    this.drawArchitect();
                    break;
                case 'day_3_neon':
                    this.drawNeon();
                    break;
                case 'day_3_rush':
                    this.drawRush();
                    break;
                case 'day_3_flow':
                    this.drawFlow();
                    break;
                case 'day_4_bestiary':
                    this.drawBestiary();
                    break;
                case 'day_4_gachapon':
                    this.drawGachapon();
                    break;
                case 'day_4_vending_roulette':
                    this.drawVending();
                    break;
                case 'day_4_crab':
                    this.drawCrab();
                    break;
                case 'day_4_knife':
                    this.drawKnife();
                    break;
                case 'day_4_500yen':
                    this.draw500Yen();
                    break;
                case 'day_4_isshinji':
                    this.drawIsshinji();
                    break;
                case 'day_4_tracker':
                    this.drawTracker();
                    break;
                case 'day_4_yakiniku':
                    this.drawYakiniku();
                    break;
                case 'day_5_mochi':
                    this.drawMochi();
                    break;
                case 'day_5_gymnast':
                    this.drawGymnast();
                    break;
                case 'day_5_monk':
                    this.drawMonk();
                    break;
                case 'day_5_deer_galaxy':
                    this.drawDeer();
                    break;
                case 'day_5_ribbon':
                    this.drawRibbon();
                    break;
                case 'day_5_investor':
                    this.drawInvestor();
                    break;
                case 'day_5_zen':
                    this.drawZen();
                    break;
                case 'day_5_engineer':
                    this.drawEngineer();
                    break;
                case 'day_5_guardian':
                    this.drawGuardian();
                    break;
                // Day 6
                case 'day_6_evasion':
                    this.drawEvasion();
                    break;
                case 'day_6_seal':
                    this.drawSeal();
                    break;
                case 'day_6_clouds':
                    this.drawClouds();
                    break;
                case 'day_6_ninja_steps':
                    this.drawNinjaSteps();
                    break;
                case 'day_6_tactical':
                    this.drawTactical();
                    break;
                case 'day_6_edict':
                    this.drawEdict();
                    break;
                case 'day_6_time_travel':
                    this.drawTimeTravel();
                    break;
                case 'day_6_ring':
                    this.drawRing();
                    break;
                case 'day_6_clan':
                    this.drawClan();
                    break;
                // Day 7
                case 'day_7_kimono':
                    this.drawKimono();
                    break;
                case 'day_7_kintsugi':
                    this.drawKintsugi();
                    break;
                case 'day_7_tea':
                    this.drawTea();
                    break;
                case 'day_7_stone_guardian':
                    this.drawStoneGuardian();
                    break;
                case 'day_7_structural':
                    this.drawStructural();
                    break;
                case 'day_7_survival':
                    this.drawSurvival();
                    break;
                case 'day_7_anti_quake':
                    this.drawAntiQuake();
                    break;
                case 'day_7_stairs':
                    this.drawStairs();
                    break;
                case 'day_7_geisha':
                    this.drawGeisha();
                    break;
                case 'day_8_kid9_rake':
                    this.drawRake();
                    break;
                case 'day_8_kid14_wave_sync':
                    this.drawWaveSync();
                    break;
                case 'day_9_kid9_scratch':
                    this.drawScratch();
                    break;
                case 'day_9_kid14_torii':
                    this.drawTorii();
                    break;
                case 'day_10_kid9_bento':
                    this.drawBento();
                    break;
                case 'day_10_kid14_crypto':
                    this.drawCrypto();
                    break;
                case 'day_8_kid9_pose':
                    this.drawPose();
                    break;
                case 'day_8_kid9_wind':
                    this.drawWind();
                    break;
                case 'day_8_kid9_bamboo_clock':
                    this.drawBambooClock();
                    break;
                case 'day_8_kid9_giants':
                    this.drawGiants();
                    break;
                case 'day_8_kid9_monk':
                    this.drawMonk();
                    break;
                case 'day_8_kid14_bosque':
                    this.drawBosque();
                    break;
                case 'day_8_kid14_arashiyama':
                    this.drawArashiyamaGame();
                    break;
                case 'day_8_fam_squad':
                    this.drawFamSquad();
                    break;
                case 'day_9_kid9_zorros':
                    this.drawZorros();
                    break;
                case 'day_9_kid9_altar':
                    this.drawAltar();
                    break;
                case 'day_9_kid14_gravity':
                    this.drawGravity();
                    break;
                case 'day_9_kid14_angulo':
                    this.drawAngulo();
                    break;
                case 'day_9_kid14_ave':
                    this.drawAve();
                    break;
                case 'day_9_kid14_tunnel':
                    this.drawTunnel();
                    break;
                case 'day_9_fam_portal':
                    this.drawFamPortal();
                    break;
                case 'day_10_kid9_nishiki':
                    this.drawNishiki();
                    break;
                case 'day_10_kid9_dragon':
                    this.drawDragon();
                    break;
                case 'day_10_kid9_rainbow':
                    this.drawRainbow();
                    break;
                case 'day_10_kid9_matcha':
                    this.drawMatcha();
                    break;
                case 'day_10_kid14_milla':
                    this.drawMilla();
                    break;
                case 'day_10_kid14_tako':
                    this.drawTako();
                    break;
                case 'day_10_fam_sayonara':
                    this.drawSayonara();
                    break;
            }
            
            this.drawParticles();
            this.ctx.restore();
        } catch (error) {
            console.error("Error drawing frame:", error);
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(0, 0, 800, 600);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText("CRITICAL DRAW ERROR:", 50, 100);
            this.ctx.fillText(error.message, 50, 140);
            this.ctx.fillText(error.stack ? error.stack.split('\n')[0] : "", 50, 180);
            this.ctx.restore();
        }
    },

    // ==========================================================
    // 1. GLICO ROOFTOP RUNNER
    // ==========================================================
    inputGlico() {
        const p = this.gameData.player;
        if (p.jumps < 2) {
            p.vy = -16;
            p.jumps++;
            p.jumping = true;
            if (window.playProceduralSound) window.playProceduralSound('jump');
            
            const color = p.jumps === 2 ? '#e0f7fa' : '#ffffff';
            this.createExplosion(p.x + p.w/2, p.y + p.h, color, 12, p.jumps === 2 ? 1.5 : 1);
        }
    },

    updateGlico(dt) {
        const p = this.gameData.player;
        p.vy += 0.85; // Gravity
        p.y += p.vy;
        
        if (p.invuln > 0) p.invuln -= dt;
        
        if (p.y > 600) {
            this.triggerShake(15);
            this.gameOver();
            return;
        }
        
        const speed = 5.0 + (this.gameTime * 0.05);
        this.gameData.bgScroll -= speed * 0.15;
        this.gameData.neonScroll -= speed * 0.4;
        
        // Platform collisions
        for (let plat of this.gameData.platforms) {
            plat.x -= speed;
            if (p.x + p.w > plat.x && p.x < plat.x + plat.w) {
                if (p.y + p.h >= plat.y && p.y + p.h - p.vy <= plat.y + 20) {
                    p.y = plat.y - p.h;
                    p.vy = 0;
                    p.jumps = 0;
                    p.jumping = false;
                }
            }
        }
        
        // Obstacles
        for (let obs of this.gameData.obstacles) {
            obs.x -= speed;
            if (!obs.hit && p.x + p.w > obs.x && p.x < obs.x + obs.w && p.y + p.h > obs.y && p.y < obs.y + obs.h) {
                obs.hit = true;
                if (p.invuln <= 0) {
                    this.triggerShake(12);
                    p.health--;
                    p.invuln = 1.0;
                    if (window.playProceduralSound) window.playProceduralSound('damage');
                    this.createExplosion(obs.x + obs.w/2, obs.y + obs.h/2, '#ff3333', 20, 1.5);
                    
                    if (p.health <= 0) {
                        this.gameOver();
                        return;
                    }
                }
            }
        }
        
        // Items collection
        for (let item of this.gameData.items) {
            item.x -= speed;
            if (!item.collected && p.x + p.w > item.x && p.x < item.x + item.w && p.y + p.h > item.y && p.y < item.y + item.h) {
                item.collected = true;
                this.score += 50;
                document.getElementById('minigame-score').innerText = `Puntos: ${Math.floor(this.score)}`;
                if (window.playProceduralSound) window.playProceduralSound('collect');
                this.createExplosion(item.x + item.w/2, item.y + item.h/2, '#ffd700', 16, 1.2);
            }
        }
        
        this.score += dt * 10;
        const currentMeters = Math.floor(this.score);
        document.getElementById('minigame-score').innerText = `Distancia: ${currentMeters}m`;
        
        if (currentMeters >= this.goal) {
            this.win();
            return;
        }
        
        // Recycle platforms ahead
        const lastPlat = this.gameData.platforms[this.gameData.platforms.length - 1];
        if (lastPlat.x < 800) {
            const nextW = 200 + Math.random() * 300;
            const nextY = 380 + Math.random() * 120;
            const nextGap = 90 + Math.random() * 120;
            
            this.gameData.platforms.push({
                x: lastPlat.x + lastPlat.w + nextGap,
                y: nextY,
                w: nextW,
                h: 220
            });
            
            if (Math.random() > 0.45) {
                this.gameData.obstacles.push({
                    x: lastPlat.x + lastPlat.w + nextGap + (nextW / 2) - 15,
                    y: nextY - 40,
                    w: 30,
                    h: 40,
                    hit: false
                });
            } else {
                this.gameData.items.push({
                    x: lastPlat.x + lastPlat.w + nextGap + (nextW / 2) - 12,
                    y: nextY - 65,
                    w: 24,
                    h: 24,
                    collected: false
                });
            }
        }
        
        if (this.gameData.platforms[0].x + this.gameData.platforms[0].w < -100) this.gameData.platforms.shift();
        this.gameData.obstacles = this.gameData.obstacles.filter(o => o.x > -100);
        this.gameData.items = this.gameData.items.filter(i => i.x > -100);
    },

    drawGlico() {
        const ctx = this.ctx;
        const data = this.gameData;
        const p = data.player;
        
        let sky = ctx.createLinearGradient(0, 0, 0, 600);
        sky.addColorStop(0, '#04040a');
        sky.addColorStop(1, '#0e0b1c');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        for(let i=0; i<30; i++) {
            const sx = (Math.sin(i * 452) * 5000 + data.bgScroll * 0.1) % 800;
            const sy = (Math.cos(i * 324) * 300) + 150;
            ctx.fillRect(sx, sy, 1.5, 1.5);
        }
        
        ctx.save();
        ctx.translate(data.bgScroll * 0.15 % 800, 0);
        ctx.fillStyle = '#110c22';
        for(let i=0; i<15; i++) {
            const h = 100 + Math.sin(i * 587) * 80;
            const w = 60 + Math.sin(i * 324) * 30;
            ctx.fillRect(i * 120, 500 - h, w, h + 100);
            
            ctx.fillStyle = i % 2 === 0 ? '#ff1493' : '#00e5ff';
            ctx.fillRect(i * 120 + w/2 - 2, 500 - h + 10, 4, 30);
            ctx.fillStyle = '#110c22';
        }
        ctx.restore();
        
        let canal = ctx.createLinearGradient(0, 480, 0, 600);
        canal.addColorStop(0, '#0a0a14');
        canal.addColorStop(1, '#651fff');
        ctx.fillStyle = canal;
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillRect(0, 480, 800, 120);
        ctx.restore();
        
        for (let plat of data.platforms) {
            ctx.fillStyle = '#1d1a2f';
            ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
            
            ctx.save();
            ctx.strokeStyle = '#ff7b54';
            ctx.shadowColor = '#ff7b54';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(plat.x, plat.y);
            ctx.lineTo(plat.x + plat.w, plat.y);
            ctx.stroke();
            ctx.restore();
            
            ctx.fillStyle = '#0f0c1a';
            for (let wx = plat.x + 20; wx < plat.x + plat.w - 20; wx += 40) {
                for (let wy = plat.y + 30; wy < 600; wy += 50) {
                    ctx.fillRect(wx, wy, 20, 30);
                }
            }
        }
        
        for (let obs of data.obstacles) {
            if (obs.hit) continue;
            ctx.save();
            ctx.translate(obs.x + obs.w/2, obs.y + obs.h/2);
            
            ctx.shadowColor = '#ff3333';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#ff3333';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.arc(0, 0, obs.w/2, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px sans-serif';
            ctx.fillText('🔥', -8, 5);
            ctx.restore();
        }
        
        for (let item of data.items) {
            if (item.collected) continue;
            ctx.save();
            ctx.translate(item.x + item.w/2, item.y + item.h/2 + Math.sin(this.gameTime*6)*6);
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 18;
            ctx.fillStyle = '#ffd700';
            ctx.font = '26px sans-serif';
            ctx.fillText('👟', -13, 9);
            ctx.restore();
        }
        
        ctx.save();
        ctx.translate(p.x, p.y);
        
        if (p.invuln > 0 && Math.floor(this.gameTime * 20) % 2 === 0) {
            ctx.globalAlpha = 0.3;
        }
        
        ctx.shadowColor = '#ff7b54';
        ctx.shadowBlur = 12;
        
        ctx.fillStyle = '#ff7b54';
        ctx.beginPath();
        ctx.arc(p.w/2, 12, 10, 0, Math.PI*2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.w/2, 8, 8, 3);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.w/2 - 5, 22, 10, 26);
        
        ctx.fillStyle = '#ff7b54';
        ctx.fillRect(p.w/2 - 6, 45, 12, 10);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.w/2 - 4, 25);
        ctx.lineTo(3, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.w/2 + 4, 25);
        ctx.lineTo(p.w - 3, 4);
        ctx.stroke();
        
        const runAngle = this.gameTime * 18;
        const leftLegOffset = Math.sin(runAngle) * 16;
        const rightLegOffset = -Math.sin(runAngle) * 16;
        
        ctx.strokeStyle = '#ff7b54';
        ctx.lineWidth = 4.5;
        if (p.jumping) {
            ctx.beginPath();
            ctx.moveTo(p.w/2 - 3, 52);
            ctx.lineTo(6, 68);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.w/2 + 3, 52);
            ctx.lineTo(p.w - 4, 62);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(p.w/2 - 3, 52);
            ctx.lineTo(p.w/2 - 8 + leftLegOffset * 0.5, 62);
            ctx.lineTo(p.w/2 - 12 + leftLegOffset, 70);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.w/2 + 3, 52);
            ctx.lineTo(p.w/2 + 8 + rightLegOffset * 0.5, 62);
            ctx.lineTo(p.w/2 + 12 + rightLegOffset, 70);
            ctx.stroke();
        }
        ctx.restore();
        
        ctx.fillStyle = '#ff3333';
        ctx.font = '22px sans-serif';
        ctx.fillText(`Vidas: ${'❤️'.repeat(p.health)}`, 20, 40);
    },

    // ==========================================================
    // 2. SHINOBI SHADOW SHURIKEN
    // ==========================================================
    releaseNinja(x, y) {
        const dx = this.mouse.startX - x;
        const dy = this.mouse.startY - y;
        
        const dist = Math.min(Math.sqrt(dx*dx + dy*dy), 150);
        if (dist < 10) return;
        
        const angle = Math.atan2(dy, dx);
        const power = (dist / 150) * 22;
        
        this.gameData.shurikens.push({
            x: 400,
            y: 540,
            vx: Math.cos(angle) * power,
            vy: Math.sin(angle) * power,
            rotation: 0,
            active: true
        });
        
        if (window.playProceduralSound) window.playProceduralSound('jump');
    },

    updateNinja(dt) {
        const data = this.gameData;
        data.spawnTimer += dt;
        if (data.spawnTimer > 1.4) {
            data.spawnTimer = 0;
            const isEnemy = Math.random() > 0.35;
            
            data.targets.push({
                x: 120 + Math.random() * 560,
                y: 100 + Math.random() * 260,
                w: 70,
                h: 90,
                type: isEnemy ? 'enemy' : 'kitsune',
                active: true,
                scale: 0,
                state: 'popin',
                timer: 0,
                maxTime: 1.8 + Math.random() * 1.5,
                bob: Math.random() * 100
            });
        }
        
        for (let shur of data.shurikens) {
            shur.x += shur.vx;
            shur.y += shur.vy;
            shur.vy += 0.25; 
            shur.rotation += 0.5;
            
            if (shur.y > 600 || shur.x < 0 || shur.x > 800) {
                shur.active = false;
            }
            
            if (shur.active) {
                for (let tar of data.targets) {
                    if (tar.active && tar.scale > 0.3) {
                        const dx = shur.x - (tar.x + tar.w/2);
                        const dy = shur.y - (tar.y + tar.h/2);
                        const distance = Math.sqrt(dx*dx + dy*dy);
                        
                        if (distance < 45) {
                            shur.active = false;
                            tar.active = false;
                            
                            if (tar.type === 'enemy') {
                                this.score++;
                                document.getElementById('minigame-score').innerText = `Ninjas: ${this.score}`;
                                if (window.playProceduralSound) window.playProceduralSound('success');
                                this.createExplosion(shur.x, shur.y, '#a832fc', 22, 1.2);
                                
                                if (this.score >= this.goal) {
                                    this.win();
                                    return;
                                }
                            } else {
                                this.triggerShake(12);
                                data.kitsuneHit++;
                                if (window.playProceduralSound) window.playProceduralSound('damage');
                                this.createExplosion(shur.x, shur.y, '#ffd700', 30, 1.4);
                                
                                if (data.kitsuneHit >= 3) {
                                    this.gameOver();
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        for (let tar of data.targets) {
            tar.timer += dt;
            if (tar.state === 'popin') {
                tar.scale += dt * 4;
                if (tar.scale >= 1) {
                    tar.scale = 1;
                    tar.state = 'idle';
                    tar.timer = 0;
                }
            } else if (tar.state === 'idle') {
                if (tar.timer >= tar.maxTime) {
                    tar.state = 'popout';
                    tar.timer = 0;
                }
            } else if (tar.state === 'popout') {
                tar.scale -= dt * 4;
                if (tar.scale <= 0) {
                    tar.active = false;
                }
            }
        }
        
        data.shurikens = data.shurikens.filter(s => s.active);
        data.targets = data.targets.filter(t => t.active);
    },

    drawNinja() {
        const ctx = this.ctx;
        const data = this.gameData;
        
        let bg = ctx.createRadialGradient(400, 300, 50, 400, 300, 500);
        bg.addColorStop(0, '#1c1b35');
        bg.addColorStop(1, '#080512');
        ctx.fillStyle = bg;
        ctx.fillRect(0,0,800,600);
        
        ctx.save();
        ctx.shadowColor = '#ffe082';
        ctx.shadowBlur = 45;
        ctx.fillStyle = '#ffecb3';
        ctx.beginPath();
        ctx.arc(400, 160, 100, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#ffb74d';
        for(let i=0; i<25; i++) {
            const px = (Math.sin(i * 128) * 4000 + this.gameTime * 40) % 800;
            const py = (Math.cos(i * 242) * 300 + this.gameTime * 15) % 600;
            ctx.fillRect(px, py, 2.5, 2.5);
        }
        
        ctx.fillStyle = '#06030c';
        ctx.fillRect(0, 500, 800, 100);
        ctx.beginPath();
        ctx.moveTo(120, 500);
        ctx.lineTo(280, 500);
        ctx.lineTo(240, 450);
        ctx.lineTo(160, 450);
        ctx.closePath();
        ctx.fill();
        
        for(let tar of data.targets) {
            ctx.save();
            ctx.translate(tar.x + tar.w/2, tar.y + tar.h/2 + Math.sin(this.gameTime * 4 + tar.bob)*6);
            ctx.scale(tar.scale, tar.scale);
            
            if (tar.type === 'enemy') {
                ctx.fillStyle = '#170e28';
                ctx.strokeStyle = '#b388ff';
                ctx.lineWidth = 3.5;
                ctx.shadowColor = '#b388ff';
                ctx.shadowBlur = 15;
                
                ctx.beginPath();
                ctx.arc(0, -20, 22, 0, Math.PI*2);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#e040fb';
                ctx.fillRect(-12, -2, 24, 6);
                
                ctx.fillStyle = '#ff1744';
                ctx.beginPath();
                ctx.arc(-8, -20, 3, 0, Math.PI*2);
                ctx.arc(8, -20, 3, 0, Math.PI*2);
                ctx.fill();
                
                ctx.fillStyle = '#170e28';
                ctx.beginPath();
                ctx.moveTo(-32, 30);
                ctx.lineTo(-18, -6);
                ctx.lineTo(18, -6);
                ctx.lineTo(32, 30);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#ffd54f';
                ctx.lineWidth = 4;
                ctx.shadowColor = '#ffd54f';
                ctx.shadowBlur = 20;
                
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.lineTo(-24, -26); 
                ctx.lineTo(-8, -18);
                ctx.lineTo(0, -32); 
                ctx.lineTo(8, -18);
                ctx.lineTo(24, -26); 
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(0, 18, 24, 0, Math.PI*2);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#ffd54f';
                ctx.beginPath();
                ctx.arc(-8, -10, 4, 0, Math.PI*2);
                ctx.arc(8, -10, 4, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.restore();
        }
        
        for (let shur of data.shurikens) {
            ctx.save();
            ctx.translate(shur.x, shur.y);
            ctx.rotate(shur.rotation);
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#f0fdfa';
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 2.5;
            
            ctx.beginPath();
            for(let i=0; i<4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.moveTo(0, 0);
                ctx.lineTo(-6, -22);
                ctx.lineTo(0, -9);
                ctx.lineTo(6, -22);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        
        ctx.fillStyle = '#1c1b35';
        ctx.beginPath();
        ctx.arc(400, 540, 22, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        if (this.mouse.isDown && this.state === 'playing') {
            const dx = this.mouse.startX - this.mouse.x;
            const dy = this.mouse.startY - this.mouse.y;
            const dist = Math.min(Math.sqrt(dx*dx + dy*dy), 150);
            
            if (dist > 10) {
                const angle = Math.atan2(dy, dx);
                
                ctx.save();
                ctx.strokeStyle = 'rgba(255,152,0,0.6)';
                ctx.shadowColor = '#ff9800';
                ctx.shadowBlur = 10;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(400, 540);
                ctx.lineTo(400 - Math.cos(angle)*dist, 540 - Math.sin(angle)*dist);
                ctx.stroke();
                
                ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
                ctx.setLineDash([4, 6]);
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                let px = 400;
                let py = 540;
                let vx = Math.cos(angle) * (dist / 150) * 22;
                let vy = Math.sin(angle) * (dist / 150) * 22;
                
                ctx.moveTo(px, py);
                for(let t=0; t<25; t++) {
                    px += vx;
                    py += vy;
                    vy += 0.25; 
                    ctx.lineTo(px, py);
                }
                ctx.stroke();
                ctx.restore();
            }
        }
        
        ctx.fillStyle = '#ffd54f';
        ctx.font = '22px sans-serif';
        ctx.fillText(`Kitsunes Restantes: ${'🦊'.repeat(3 - data.kitsuneHit)}${'💀'.repeat(data.kitsuneHit)}`, 20, 45);
    },

    // ==========================================================
    // 3. PUENTE DEL CASTILLO
    // ==========================================================
    inputBridge(clickX, clickY) {
        if (this.gameData.completed) return;
        
        const gridX = Math.floor((clickX - 100) / 120);
        const gridY = Math.floor((clickY - 100) / 110);
        
        if (gridX >= 0 && gridX < 5 && gridY >= 0 && gridY < 4) {
            const cell = this.gameData.grid[gridX][gridY];
            if (cell.type !== 'E' && (gridX > 0 || gridY > 0)) {
                cell.angle = (cell.angle + 90) % 360;
                if (window.playProceduralSound) window.playProceduralSound('rotate');
                this.solveBridge();
            }
        }
    },

    solveBridge() {
        const grid = this.gameData.grid;
        
        // 1. Try to find an exact path from start (0,0) to end (4,3)
        const visitedExact = Array.from({length: 5}, () => Array(4).fill(false));
        const exactPath = [];
        
        const checkConnection = (x, y, fromDir) => {
            if (x < 0 || x >= 5 || y < 0 || y >= 4) return false;
            if (visitedExact[x][y]) return false;
            
            const cell = grid[x][y];
            if (cell.type === 'E') return false;
            
            const cellPorts = this.getCellPorts(cell.type, cell.angle);
            const entryPort = { x: -fromDir.x, y: -fromDir.y };
            
            const hasEntry = cellPorts.some(p => p.x === entryPort.x && p.y === entryPort.y);
            if (!hasEntry) return false;
            
            visitedExact[x][y] = true;
            exactPath.push({col: x, row: y});
            
            // Check if we reached (4, 3) and it has a right exit port (to Castle shore)
            if (x === 4 && y === 3) {
                const exits = cellPorts.filter(p => p.x === 1 && p.y === 0);
                if (exits.length > 0) return true;
            }
            
            for (let exit of cellPorts) {
                if (exit.x === entryPort.x && exit.y === entryPort.y) continue;
                const nextX = x + exit.x;
                const nextY = y + exit.y;
                if (checkConnection(nextX, nextY, exit)) return true;
            }
            
            exactPath.pop();
            return false;
        };
        
        const success = checkConnection(0, 0, {x: 1, y: 0});
        
        if (success) {
            this.gameData.path = exactPath;
            this.gameData.completed = true;
            this.score = 1;
            document.getElementById('minigame-score').innerText = `Puente: ¡Completado!`;
        } else {
            // 2. If not complete, find all connected pieces from start (0,0) for glowing feedback
            const visitedConnected = Array.from({length: 5}, () => Array(4).fill(false));
            const connectedList = [];
            
            const findConnected = (x, y, fromDir) => {
                if (x < 0 || x >= 5 || y < 0 || y >= 4) return;
                if (visitedConnected[x][y]) return;
                
                const cell = grid[x][y];
                if (cell.type === 'E') return;
                
                const cellPorts = this.getCellPorts(cell.type, cell.angle);
                const entryPort = { x: -fromDir.x, y: -fromDir.y };
                
                const hasEntry = cellPorts.some(p => p.x === entryPort.x && p.y === entryPort.y);
                if (!hasEntry) return;
                
                visitedConnected[x][y] = true;
                connectedList.push({col: x, row: y});
                
                for (let exit of cellPorts) {
                    if (exit.x === entryPort.x && exit.y === entryPort.y) continue;
                    const nextX = x + exit.x;
                    const nextY = y + exit.y;
                    findConnected(nextX, nextY, exit);
                }
            };
            
            findConnected(0, 0, {x: 1, y: 0});
            this.gameData.path = connectedList;
            this.gameData.completed = false;
            document.getElementById('minigame-score').innerText = `Puente: Conectado: ${connectedList.length} piezas`;
        }
    },

    getCellPorts(type, angle) {
        let base = [];
        if (type === 'S') {
            base = [ {x:-1, y:0}, {x:1, y:0} ];
        } else if (type === 'L') {
            base = [ {x:0, y:1}, {x:1, y:0} ];
        }
        
        const rad = (angle * Math.PI) / 180;
        return base.map(p => {
            const rx = Math.round(p.x * Math.cos(rad) - p.y * Math.sin(rad));
            const ry = Math.round(p.x * Math.sin(rad) + p.y * Math.cos(rad));
            return { x: rx, y: ry };
        });
    },

    updateBridge(dt) {
        // Update sakura petals drift
        if (this.gameData.petals) {
            for (let p of this.gameData.petals) {
                p.y += p.speed * dt;
                p.x += (p.speed * 0.4 + Math.sin(this.gameTime * 2 + p.sway) * 12) * dt;
                p.angle += dt * 0.8;
                
                if (p.y > 600 || p.x > 820) {
                    p.y = -20;
                    p.x = Math.random() * 800 - 200;
                    p.size = 5 + Math.random() * 8;
                    p.speed = 12 + Math.random() * 18;
                }
            }
        }

        if (this.gameData.completed) {
            this.gameData.walkProgress += dt * 0.7;
            if (this.gameData.walkProgress >= 1.0) {
                this.win();
            }
        }
    },

    drawBridge() {
        const ctx = this.ctx;
        const grid = this.gameData.grid;
        
        // Deep blue/indigo water gradient background
        let waterGrad = ctx.createLinearGradient(0, 0, 0, 600);
        waterGrad.addColorStop(0, '#040d1a');
        waterGrad.addColorStop(1, '#0b2035');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, 0, 800, 600);
        
        // Draw water ripples
        ctx.save();
        for (let i = 0; i < 5; i++) {
            const rx = (Math.sin(i * 987) * 250 + 400);
            const ry = (Math.cos(i * 742) * 180 + 300);
            const maxRadius = 50 + i * 15;
            const radius = (this.gameTime * 20 + i * 25) % maxRadius;
            const opacity = 1 - (radius / maxRadius);
            
            ctx.strokeStyle = `rgba(0, 245, 255, ${opacity * 0.12})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(rx, ry, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();

        // Draw floating sakura petals
        if (this.gameData.petals) {
            for (let p of this.gameData.petals) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.scale(1, 0.6); // Scale to draw an ellipse using standard arc
                ctx.fillStyle = '#ff80ab';
                ctx.shadowColor = '#ff80ab';
                ctx.shadowBlur = 3;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Draw Header Instructions
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌸 ROTAR PUENTES: Conecta el Muelle Izquierdo con la Puerta Torii del Castillo 🌸', 400, 40);

        // Draw cells and bridge tiles
        for(let col=0; col<5; col++) {
            for(let row=0; row<4; row++) {
                const cell = grid[col][row];
                const cx = 100 + col * 120;
                const cy = 100 + row * 110;
                
                // Draw water tile background
                ctx.fillStyle = 'rgba(10, 25, 40, 0.45)';
                ctx.fillRect(cx + 4, cy + 4, 112, 102);
                ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
                ctx.lineWidth = 1;
                ctx.strokeRect(cx + 4, cy + 4, 112, 102);
                
                if (cell.type === 'E') continue;
                
                const isPart = this.gameData.path.some(p => p.col === col && p.row === row);
                
                ctx.save();
                ctx.translate(cx + 60, cy + 55);
                ctx.rotate((cell.angle * Math.PI) / 180);
                
                // Wooden deck base styling
                ctx.fillStyle = '#4e342e'; // Rich dark wood
                ctx.strokeStyle = '#1d0c00'; // Dark board outlines
                ctx.lineWidth = 3.5;
                
                if (cell.type === 'S') {
                    ctx.fillRect(-60, -22, 120, 44);
                    ctx.strokeRect(-60, -22, 120, 44);
                    
                    // Wood planks texture lines
                    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                    ctx.lineWidth = 1.5;
                    for(let x=-40; x<=40; x+=20) {
                        ctx.beginPath();
                        ctx.moveTo(x, -22);
                        ctx.lineTo(x, 22);
                        ctx.stroke();
                    }
                } else if (cell.type === 'L') {
                    // Curved bridge corner piece
                    ctx.beginPath();
                    ctx.arc(60, 60, 82, Math.PI*1.5, Math.PI, true);
                    ctx.lineTo(22, 60);
                    ctx.arc(60, 60, 38, Math.PI, Math.PI*1.5, false);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    
                    // Wood planks curve guidelines
                    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(60, 60, 60, Math.PI*1.5, Math.PI, true);
                    ctx.stroke();
                }
                
                // Draw Magic Flow
                if (isPart) {
                    ctx.strokeStyle = '#00ffcc';
                    ctx.shadowColor = '#00ffcc';
                    ctx.shadowBlur = 14;
                    ctx.lineWidth = 8;
                    ctx.lineCap = 'round';
                    
                    ctx.beginPath();
                    if (cell.type === 'S') {
                        ctx.moveTo(-60, 0);
                        ctx.lineTo(60, 0);
                    } else if (cell.type === 'L') {
                        ctx.arc(60, 60, 60, Math.PI*1.5, Math.PI, true);
                    }
                    ctx.stroke();
                    
                    // Inner bright white magic channel
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 0;
                    ctx.stroke();
                    
                    // Flowing river animated overlay
                    ctx.strokeStyle = 'rgba(0, 255, 204, 0.7)';
                    ctx.lineWidth = 4;
                    ctx.setLineDash([12, 18]);
                    ctx.lineDashOffset = -this.gameTime * 75;
                    ctx.beginPath();
                    if (cell.type === 'S') {
                        ctx.moveTo(-60, 0);
                        ctx.lineTo(60, 0);
                    } else if (cell.type === 'L') {
                        ctx.arc(60, 60, 60, Math.PI*1.5, Math.PI, true);
                    }
                    ctx.stroke();
                    ctx.setLineDash([]); // reset dash style
                }
                
                // Draw port metallic connectors
                const drawPortClamp = (px, py) => {
                    ctx.save();
                    ctx.fillStyle = '#ffb300'; // Gold brackets
                    ctx.strokeStyle = '#5d4037';
                    ctx.lineWidth = 1.5;
                    
                    // Center on the edge
                    const edgeX = px * 60;
                    const edgeY = py * 55;
                    ctx.translate(edgeX, edgeY);
                    
                    ctx.rotate(Math.atan2(py, px));
                    
                    // Metal bracket shape
                    ctx.fillRect(-6, -12, 6, 24);
                    ctx.strokeRect(-6, -12, 6, 24);
                    
                    // Glowing LED connector dot
                    ctx.fillStyle = isPart ? '#00ffcc' : '#a0a0ab';
                    if (isPart) {
                        ctx.shadowColor = '#00ffcc';
                        ctx.shadowBlur = 8;
                    }
                    ctx.beginPath();
                    ctx.arc(-3, 0, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                };
                
                if (cell.type === 'S') {
                    drawPortClamp(-1, 0);
                    drawPortClamp(1, 0);
                } else if (cell.type === 'L') {
                    drawPortClamp(1, 0);
                    drawPortClamp(0, 1);
                }
                
                ctx.restore(); // Restore grid rotation
                
                // Render small 🔄 icon as rotation hint (except start cell)
                if (col > 0 || row > 0) {
                    ctx.fillStyle = 'rgba(255,255,255,0.45)';
                    ctx.font = '14px sans-serif';
                    ctx.textAlign = 'right';
                    ctx.fillText('🔄', cx + 106, cy + 96);
                }
            }
        }
        
        // Draw Start Bank Shore (INICIO) aligned with Row 0
        ctx.save();
        ctx.fillStyle = '#37474f'; // stone bank
        ctx.fillRect(0, 100, 100, 110);
        ctx.fillStyle = '#2e7d32'; // grass top
        ctx.fillRect(0, 100, 95, 12);
        
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 112);
        ctx.lineTo(95, 112);
        ctx.stroke();
        
        ctx.strokeStyle = '#4e342e'; // wooden fence border
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(95, 100);
        ctx.lineTo(95, 210);
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 4;
        ctx.fillText('INICIO 🌸', 48, 162);
        ctx.restore();
        
        // Draw Castle Bank Shore (CASTILLO) aligned with Row 3
        ctx.save();
        ctx.fillStyle = '#37474f'; // stone bank
        ctx.fillRect(700, 430, 100, 110);
        ctx.fillStyle = '#2e7d32'; // grass top
        ctx.fillRect(705, 430, 95, 12);
        
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(705, 442);
        ctx.lineTo(800, 442);
        ctx.stroke();
        
        ctx.strokeStyle = '#4e342e'; // wooden fence border
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(705, 430);
        ctx.lineTo(705, 540);
        ctx.stroke();
        
        // Draw beautiful red Torii Gate at the Castle Shore
        ctx.translate(750, 480);
        ctx.fillStyle = '#d84315'; // Red-orange posts
        ctx.fillRect(-22, -35, 6, 45); // Left pillar
        ctx.fillRect(16, -35, 6, 45); // Right pillar
        
        ctx.fillStyle = '#212121'; // Black lintel top
        ctx.fillRect(-32, -42, 64, 8);
        ctx.fillStyle = '#d84315';
        ctx.fillRect(-28, -38, 56, 5);
        
        ctx.fillStyle = '#ffd700'; // Golden text
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CASTILLO', 0, 26);
        ctx.restore();
        
        // Draw Laura Walking when completed
        if (this.gameData.completed && this.gameData.path && this.gameData.path.length > 0) {
            ctx.save();
            const stepIndex = Math.floor(this.gameData.walkProgress * this.gameData.path.length);
            const currentStep = this.gameData.path[Math.min(stepIndex, this.gameData.path.length - 1)];
            if (currentStep) {
                const charX = 100 + currentStep.col * 120 + 60;
                const charY = 100 + currentStep.row * 110 + 55;
                ctx.translate(charX, charY + Math.sin(this.gameTime * 10)*3);
                
                ctx.fillStyle = '#ff7b54';
                ctx.beginPath();
                ctx.arc(0, -18, 15, 0, Math.PI*2);
                ctx.fill();
                
                ctx.moveTo(-10, -28); ctx.lineTo(-16, -38); ctx.lineTo(-2, -30);
                ctx.moveTo(10, -28); ctx.lineTo(18, -38); ctx.lineTo(2, -30);
                ctx.fill();
                
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(0, -14, 10, 0, Math.PI*2);
                ctx.fill();
                
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#c62828';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-12, 16);
                ctx.lineTo(-5, -4);
                ctx.lineTo(5, -4);
                ctx.lineTo(12, 16);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }
    },

    // ==========================================================
    // 4. JUMPING platform UMEDA SKY
    // ==========================================================
    updateUmeda(dt) {
        const p = this.gameData.player;
        
        if (this.mouse.isDown) {
            const dragDiff = this.mouse.x - p.x - p.w/2;
            p.vx = dragDiff * 0.18; 
        }
        
        p.vy += 0.45; 
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92; 
        
        if (p.x < 0) p.x = 800;
        if (p.x > 800) p.x = 0;
        
        for(let plat of this.gameData.platforms) {
            if (plat.type === 'moving') {
                plat.x += plat.vx;
                if (plat.x < 0 || plat.x + plat.w > 800) plat.vx *= -1;
            }
            
            if (p.vy > 0 && p.x + p.w > plat.x && p.x < plat.x + plat.w) {
                if (p.y + p.h >= plat.y && p.y + p.h - p.vy <= plat.y + 12) {
                    p.y = plat.y - p.h;
                    
                    if (plat.type === 'bouncy') {
                        p.vy = -18; 
                        if (window.playProceduralSound) window.playProceduralSound('success');
                        this.createExplosion(plat.x + plat.w/2, plat.y, '#00ff99', 16, 1.3);
                    } else if (plat.type === 'cracked') {
                        p.vy = -10.5;
                        plat.broken = true; 
                        if (window.playProceduralSound) window.playProceduralSound('damage');
                        this.createExplosion(plat.x + plat.w/2, plat.y + 6, '#b0bec5', 15, 1.1);
                    } else {
                        p.vy = -12; 
                        if (window.playProceduralSound) window.playProceduralSound('jump');
                    }
                }
            }
        }
        
        this.gameData.platforms = this.gameData.platforms.filter(plat => !plat.broken);
        
        // Balloon collisions
        if (this.gameData.balloons) {
            for (let b of this.gameData.balloons) {
                if (!b.collected) {
                    const dist = Math.hypot((p.x + p.w/2) - b.x, (p.y + p.h/2) - b.y);
                    if (dist < 28) {
                        b.collected = true;
                        p.vy = -23; // Super jump/boost!
                        if (window.playProceduralSound) window.playProceduralSound('success');
                        this.createExplosion(b.x, b.y, '#ff4081', 20, 1.5);
                        this.screenShake = 12;
                    }
                }
            }
            this.gameData.balloons = this.gameData.balloons.filter(b => !b.collected);
        }
        
        if (p.y < this.gameData.highestY) {
            this.gameData.highestY = p.y;
            this.score = Math.floor(400 - p.y);
            document.getElementById('minigame-score').innerText = `Altura: ${this.score}m`;
            
            if (this.score >= this.goal) {
                this.win();
                return;
            }
        }
        
        const targetCamY = 350 - p.y;
        if (targetCamY > this.gameData.cameraY) {
            this.gameData.cameraY += (targetCamY - this.gameData.cameraY) * 0.1;
        }
        
        if (350 - p.y < this.gameData.cameraY - 260) {
            this.gameOver();
            return;
        }
        
        const highestPlat = this.gameData.platforms.reduce((prev, curr) => prev.y < curr.y ? prev : curr);
        if (highestPlat.y - p.y > -800) {
            const seed = Math.random();
            let type = 'normal';
            if (seed > 0.8) type = 'bouncy';
            else if (seed > 0.65) type = 'moving';
            else if (seed > 0.5) type = 'cracked';
            
            const gap = 75 + Math.random() * 50; // 75 to 125 px gap
            const platY = highestPlat.y - gap;
            const platX = Math.random() * 660;
            const platW = 90 + Math.random() * 50;
            
            this.gameData.platforms.push({
                x: platX,
                y: platY,
                w: platW,
                h: 16,
                type: type,
                vx: type === 'moving' ? (Math.random() > 0.5 ? 3 : -3) : 0,
                broken: false
            });
            
            // If the platform is cracked, spawn a normal alternative platform at a similar height
            if (type === 'cracked') {
                this.gameData.platforms.push({
                    x: (platX + 350) % 660,
                    y: platY + (Math.random() * 20 - 10),
                    w: 85 + Math.random() * 30,
                    h: 16,
                    type: 'normal',
                    vx: 0,
                    broken: false
                });
            } else {
                // Otherwise, spawn a booster balloon with 15% chance
                if (Math.random() < 0.15 && this.gameData.balloons) {
                    this.gameData.balloons.push({
                        x: platX + platW / 2,
                        y: platY - 25,
                        w: 20,
                        h: 26,
                        collected: false
                    });
                }
            }
        }
        
        this.gameData.platforms = this.gameData.platforms.filter(plat => 350 - plat.y > this.gameData.cameraY - 350);
        if (this.gameData.balloons) {
            this.gameData.balloons = this.gameData.balloons.filter(b => 350 - b.y > this.gameData.cameraY - 350);
        }
    },
    
    drawUmeda() {
        const ctx = this.ctx;
        const camY = this.gameData.cameraY;
        const p = this.gameData.player;
        
        let grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, '#020205');
        grad.addColorStop(1, '#0b1626');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,800,600);
        
        for(let star of this.gameData.stars) {
            const sy = (star.y + camY * 0.4) % 1800; 
            if (sy >= 0 && sy <= 600) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(this.gameTime*5 + star.x)*0.3})`;
                ctx.fillRect(star.x, sy, star.size, star.size);
            }
        }
        
        ctx.save();
        const goalY = 350 - this.goal + camY;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 15;
        ctx.setLineDash([10, 15]);
        ctx.beginPath();
        ctx.moveTo(0, goalY);
        ctx.lineTo(800, goalY);
        ctx.stroke();
        ctx.restore();
        
        for (let plat of this.gameData.platforms) {
            const py = plat.y + camY;
            ctx.save();
            ctx.translate(plat.x, py);
            
            if (plat.type === 'bouncy') {
                ctx.fillStyle = '#00e576';
                ctx.strokeStyle = '#a3ffd6';
                ctx.shadowColor = '#00ff99';
                ctx.shadowBlur = 10;
            } else if (plat.type === 'moving') {
                ctx.fillStyle = '#ffca28';
                ctx.strokeStyle = '#fff59d';
            } else if (plat.type === 'cracked') {
                ctx.fillStyle = '#b0bec5';
                ctx.strokeStyle = '#eceff1';
            } else {
                ctx.fillStyle = '#455a64';
                ctx.strokeStyle = '#78909c';
            }
            
            ctx.lineWidth = 2.5;
            ctx.fillRect(0, 0, plat.w, plat.h);
            ctx.strokeRect(0, 0, plat.w, plat.h);
            
            if (plat.type === 'cracked') {
                ctx.strokeStyle = '#37474f';
                ctx.beginPath();
                ctx.moveTo(plat.w/3, 0); ctx.lineTo(plat.w/2, plat.h);
                ctx.moveTo(plat.w*2/3, 0); ctx.lineTo(plat.w*0.6, plat.h);
                ctx.stroke();
            }
            ctx.restore();
        }
        
        // Draw booster balloons
        if (this.gameData.balloons) {
            for (let b of this.gameData.balloons) {
                const by = b.y + camY;
                ctx.save();
                ctx.translate(b.x, by);
                
                // Glow
                ctx.shadowColor = '#ff4081';
                ctx.shadowBlur = 12;
                
                // Balloon body (oval)
                ctx.fillStyle = '#ff4081';
                ctx.beginPath();
                if (ctx.ellipse) {
                    ctx.ellipse(0, 0, 10, 13, 0, 0, Math.PI * 2);
                } else {
                    ctx.scale(1, 1.3);
                    ctx.arc(0, 0, 10, 0, Math.PI * 2);
                }
                ctx.fill();
                
                // Tie at the bottom of the balloon
                ctx.beginPath();
                ctx.moveTo(-3, 13);
                ctx.lineTo(3, 13);
                ctx.lineTo(0, 16);
                ctx.closePath();
                ctx.fillStyle = '#ff4081';
                ctx.fill();
                
                // String
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(0, 16);
                ctx.quadraticCurveTo(3, 22, -2, 28);
                ctx.stroke();
                
                ctx.restore();
            }
        }
        
        ctx.save();
        ctx.translate(p.x, p.y + camY);
        
        ctx.shadowColor = '#ff7b54';
        ctx.shadowBlur = 14;
        
        let trail = ctx.createLinearGradient(0, p.h, 0, p.h + 20);
        trail.addColorStop(0, 'rgba(255, 123, 84, 0.8)');
        trail.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = trail;
        ctx.fillRect(2, p.h - 5, p.w - 4, 25);
        
        ctx.fillStyle = '#ff7b54';
        ctx.beginPath();
        ctx.arc(p.w/2, 10, 10, 0, Math.PI*2);
        ctx.fill();
        ctx.moveTo(2, 2); ctx.lineTo(-2, -8); ctx.lineTo(6, -2);
        ctx.moveTo(p.w - 2, 2); ctx.lineTo(p.w + 2, -8); ctx.lineTo(p.w - 6, -2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(4, 18);
        ctx.lineTo(0, p.h);
        ctx.lineTo(p.w, p.h);
        ctx.lineTo(p.w - 4, 18);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    },

    // ==========================================================
    // 5. CYBERPUNK LASER PRISM PUZZLE
    // ==========================================================
    inputReflect(clickX, clickY) {
        if (this.gameData.completed) return;
        
        const col = Math.floor((clickX - 100) / 100);
        const row = Math.floor((clickY - 80) / 75);
        
        if (col >= 0 && col < 6 && row >= 0 && row < 6) {
            const mirror = this.gameData.mirrors.find(m => m.col === col && m.row === row);
            if (mirror) {
                mirror.angle = (mirror.angle + 45) % 360;
                if (window.playProceduralSound) window.playProceduralSound('rotate');
                this.traceLaser();
            }
        }
    },

    traceLaser() {
        const em = this.gameData.emitter;
        const rec = this.gameData.receiver;
        const mirrors = this.gameData.mirrors;
        const obstacles = this.gameData.obstacles;
        
        let path = [ {col: em.col, row: em.row} ];
        let curPos = { col: em.col + em.dir.x, row: em.row + em.dir.y };
        let curDir = { x: em.dir.x, y: em.dir.y };
        
        let steps = 0;
        let success = false;
        
        while(steps < 35) {
            steps++;
            
            if (curPos.col < 0 || curPos.col >= 6 || curPos.row < 0 || curPos.row >= 6) {
                path.push({col: curPos.col, row: curPos.row});
                break;
            }
            
            path.push({col: curPos.col, row: curPos.row});
            
            if (curPos.col === rec.col && curPos.row === rec.row) {
                success = true;
                break;
            }
            
            if (obstacles.some(o => o.col === curPos.col && o.row === curPos.row)) {
                break;
            }
            
            const mirror = mirrors.find(m => m.col === curPos.col && m.row === curPos.row);
            if (mirror) {
                const angle = mirror.angle;
                let nx = curDir.x;
                let ny = curDir.y;
                
                if (angle === 45 || angle === 225) {
                    nx = -curDir.y;
                    ny = -curDir.x;
                } else if (angle === 135 || angle === 315) {
                    nx = curDir.y;
                    ny = curDir.x;
                } else {
                    break;
                }
                curDir = { x: nx, y: ny };
            }
            
            curPos = { col: curPos.col + curDir.x, row: curPos.row + curDir.y };
        }
        
        this.gameData.laserPath = path;
        
        if (success) {
            this.gameData.completed = true;
            this.score = 1;
            document.getElementById('minigame-score').innerText = `Láser: ¡Conectado!`;
        }
    },

    updateReflect(dt) {
        if (this.gameData.completed) {
            if (Math.random() > 0.75 && this.gameData.laserPath.length > 0) {
                const node = this.gameData.laserPath[Math.floor(Math.random() * this.gameData.laserPath.length)];
                const px = 100 + node.col * 100 + 50;
                const py = 80 + node.row * 75 + 37;
                this.createExplosion(px, py, '#00ff99', 4, 1);
            }
            
            setTimeout(() => this.win(), 1000);
        }
    },

    drawReflect() {
        const ctx = this.ctx;
        const data = this.gameData;
        
        ctx.fillStyle = '#06050b';
        ctx.fillRect(0,0,800,600);
        
        ctx.strokeStyle = '#120f26';
        ctx.lineWidth = 1;
        for(let col=0; col<=6; col++) {
            ctx.beginPath();
            ctx.moveTo(100 + col*100, 80);
            ctx.lineTo(100 + col*100, 530);
            ctx.stroke();
        }
        for(let row=0; row<=6; row++) {
            ctx.beginPath();
            ctx.moveTo(100, 80 + row*75);
            ctx.lineTo(700, 80 + row*75);
            ctx.stroke();
        }
        
        for (let obs of data.obstacles) {
            const ox = 100 + obs.col * 100;
            const oy = 80 + obs.row * 75;
            
            ctx.fillStyle = '#181428';
            ctx.strokeStyle = '#e91e63';
            ctx.lineWidth = 3.5;
            ctx.fillRect(ox + 8, oy + 6, 84, 63);
            ctx.strokeRect(ox + 8, oy + 6, 84, 63);
            
            ctx.beginPath();
            ctx.moveTo(ox + 10, oy + 8);
            ctx.lineTo(ox + 90, oy + 67);
            ctx.moveTo(ox + 90, oy + 8);
            ctx.lineTo(ox + 10, oy + 67);
            ctx.stroke();
        }
        
        const em = data.emitter;
        const ex = 100 + em.col * 100 + 50;
        const ey = 80 + em.row * 75 + 37;
        ctx.save();
        ctx.fillStyle = '#ff5722';
        ctx.shadowColor = '#ff5722';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ex, ey, 18, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText('⚡', ex - 5, ey + 5);
        
        const rec = data.receiver;
        const rx = 100 + rec.col * 100 + 50;
        const ry = 80 + rec.row * 75 + 37;
        ctx.save();
        ctx.fillStyle = data.completed ? '#00e576' : '#2d3748';
        ctx.shadowColor = data.completed ? '#00ff99' : '#000';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(rx, ry, 20, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('🎯', rx - 8, ry + 6);
        
        if (data.laserPath.length > 1) {
            ctx.save();
            ctx.strokeStyle = data.completed ? '#00e576' : '#ff007f';
            ctx.shadowColor = data.completed ? '#00e576' : '#ff007f';
            ctx.shadowBlur = 16 + Math.sin(this.gameTime * 15) * 5; 
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            for(let i=1; i<data.laserPath.length; i++) {
                const node = data.laserPath[i];
                const nx = 100 + node.col * 100 + 50;
                const ny = 80 + node.row * 75 + 37;
                ctx.lineTo(nx, ny);
            }
            ctx.stroke();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
            ctx.restore();
        }
        
        for(let mir of data.mirrors) {
            const mx = 100 + mir.col * 100 + 50;
            const my = 80 + mir.row * 75 + 37;
            
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate((mir.angle * Math.PI) / 180);
            
            ctx.fillStyle = 'rgba(30, 20, 50, 0.4)';
            ctx.strokeStyle = '#ffb300';
            ctx.lineWidth = 2.5;
            ctx.fillRect(-34, -26, 68, 52);
            ctx.strokeRect(-34, -26, 68, 52);
            
            ctx.strokeStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 8;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-24, 0);
            ctx.lineTo(24, 0);
            ctx.stroke();
            ctx.restore();
        }
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    findReflectPath(emitter, cols, rows) {
        const maxPathLength = 14;
        const minTurns = 3;
        const maxTurns = 5;
        const minLength = 7;
        
        let steps = 0;
        const maxSteps = 1000;
        const self = this;
        
        function dfs(c, r, dx, dy, currentPath, turns, visited) {
            steps++;
            if (steps > maxSteps) return null;
            if (currentPath.length > maxPathLength) return null;
            
            const isBoundary = (c === 0 || c === cols - 1 || r === 0 || r === rows - 1);
            const isStart = (c === emitter.col && r === emitter.row);
            
            if (isBoundary && !isStart) {
                if (turns >= minTurns && turns <= maxTurns && currentPath.length >= minLength) {
                    return [...currentPath];
                }
            }
            
            const moves = [];
            if (currentPath.length === 1) {
                moves.push({ nc: c + dx, nr: r + dy, ndx: dx, ndy: dy, isTurn: false });
            } else {
                moves.push({ nc: c + dx, nr: r + dy, ndx: dx, ndy: dy, isTurn: false });
                moves.push({ nc: c - dy, nr: r + dx, ndx: -dy, ndy: dx, isTurn: true });
                moves.push({ nc: c + dy, nr: r - dx, ndx: dy, ndy: -dx, isTurn: true });
            }
            
            self.shuffleArray(moves);
            
            for (let move of moves) {
                const { nc, nr, ndx, ndy, isTurn } = move;
                
                if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
                
                const key = `${nc},${nr}`;
                if (visited.has(key)) continue;
                
                const newTurns = turns + (isTurn ? 1 : 0);
                if (newTurns > maxTurns) continue;
                
                visited.add(key);
                currentPath.push({ col: nc, row: nr });
                
                const result = dfs(nc, nr, ndx, ndy, currentPath, newTurns, visited);
                if (result) return result;
                
                currentPath.pop();
                visited.delete(key);
            }
            return null;
        }
        
        const startVisited = new Set();
        startVisited.add(`${emitter.col},${emitter.row}`);
        
        return dfs(emitter.col, emitter.row, emitter.dir.x, emitter.dir.y, [{ col: emitter.col, row: emitter.row }], 0, startVisited);
    },

    generateReflectPuzzle() {
        const cols = 6;
        const rows = 6;
        
        const potentialEmitters = [
            { col: 1, row: 0, dir: { x: 0, y: 1 } },
            { col: 2, row: 0, dir: { x: 0, y: 1 } },
            { col: 3, row: 0, dir: { x: 0, y: 1 } },
            { col: 4, row: 0, dir: { x: 0, y: 1 } },
            { col: 1, row: 5, dir: { x: 0, y: -1 } },
            { col: 2, row: 5, dir: { x: 0, y: -1 } },
            { col: 3, row: 5, dir: { x: 0, y: -1 } },
            { col: 4, row: 5, dir: { x: 0, y: -1 } },
            { col: 0, row: 1, dir: { x: 1, y: 0 } },
            { col: 0, row: 2, dir: { x: 1, y: 0 } },
            { col: 0, row: 3, dir: { x: 1, y: 0 } },
            { col: 0, row: 4, dir: { x: 1, y: 0 } },
            { col: 5, row: 1, dir: { x: -1, y: 0 } },
            { col: 5, row: 2, dir: { x: -1, y: 0 } },
            { col: 5, row: 3, dir: { x: -1, y: 0 } },
            { col: 5, row: 4, dir: { x: -1, y: 0 } }
        ];
        
        this.shuffleArray(potentialEmitters);
        
        let path = null;
        let emitter = null;
        let receiver = null;
        
        for (let entry of potentialEmitters) {
            emitter = { col: entry.col, row: entry.row, dir: entry.dir };
            path = this.findReflectPath(emitter, cols, rows);
            if (path) {
                receiver = path[path.length - 1];
                break;
            }
        }
        
        if (!path) {
            return {
                mirrors: [
                    { col: 1, row: 2, angle: 0 },  
                    { col: 1, row: 4, angle: 90 },
                    { col: 4, row: 4, angle: 180 },
                    { col: 4, row: 2, angle: 270 }
                ],
                obstacles: [
                    { col: 2, row: 2 },
                    { col: 3, row: 2 }
                ],
                emitter: { col: 0, row: 2, dir: { x: 1, y: 0 } },
                receiver: { col: 5, row: 2 },
                laserPath: [],
                completed: false
            };
        }
        
        const pathSet = new Set(path.map(p => `${p.col},${p.row}`));
        const mirrors = [];
        
        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];
            
            const inDir = { x: curr.col - prev.col, y: curr.row - prev.row };
            const outDir = { x: next.col - curr.col, y: next.row - curr.row };
            
            if (inDir.x !== outDir.x || inDir.y !== outDir.y) {
                let correctAngle = 45;
                if (-inDir.y === outDir.x && -inDir.x === outDir.y) {
                    correctAngle = 45;
                } else {
                    correctAngle = 135;
                }
                
                const angles = [0, 45, 90, 135, 180, 225, 270, 315];
                const incorrectAngles = angles.filter(a => (a % 180) !== (correctAngle % 180));
                const startAngle = incorrectAngles[Math.floor(Math.random() * incorrectAngles.length)];
                
                mirrors.push({
                    col: curr.col,
                    row: curr.row,
                    angle: startAngle
                });
            }
        }
        
        const emptyCells = [];
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const isEmitter = (c === emitter.col && r === emitter.row);
                const isReceiver = (c === receiver.col && r === receiver.row);
                const isOnPath = pathSet.has(`${c},${r}`);
                if (!isEmitter && !isReceiver && !isOnPath) {
                    emptyCells.push({ col: c, row: r });
                }
            }
        }
        
        this.shuffleArray(emptyCells);
        
        const obstacles = [];
        const numObstacles = Math.min(emptyCells.length, Math.floor(Math.random() * 3) + 4);
        for (let i = 0; i < numObstacles; i++) {
            const cell = emptyCells.pop();
            obstacles.push({ col: cell.col, row: cell.row });
        }
        
        const numDecoys = Math.min(emptyCells.length, Math.floor(Math.random() * 2) + 3);
        for (let i = 0; i < numDecoys; i++) {
            const cell = emptyCells.pop();
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            const randAngle = angles[Math.floor(Math.random() * angles.length)];
            mirrors.push({
                col: cell.col,
                row: cell.row,
                angle: randAngle
            });
        }
        
        return {
            mirrors,
            obstacles,
            emitter,
            receiver,
            laserPath: [],
            completed: false
        };
    },

    // ==========================================================
    // 6. ASADIO DEL CASTILLO: CATAPULTA (IVÁN DÍA 3)
    // ==========================================================
    setupArchitect() {
        this.gameData = {
            catapult: { x: 120, y: 440, r: 25 },
            projectile: null,
            target: { x: 680, y: 320, w: 30, h: 90 },
            dragStart: null,
            moat: { x: 200, w: 420 },
            wind: (Math.round((Math.random() - 0.5) * 8 * 10) / 10),
            shotsLeft: 6,
            hits: 0,
            completed: false,
            message: "¡Arrastra la catapulta para apuntar!",
            messageColor: "#00ff99"
        };
    },

    updateArchitect(dt) {
        const gd = this.gameData;
        if (!gd) return;

        if (gd.projectile) {
            gd.projectile.vy += 0.25;
            gd.projectile.vx += gd.wind * 0.02;
            gd.projectile.x += gd.projectile.vx;
            gd.projectile.y += gd.projectile.vy;

            gd.projectile.trail.push({ x: gd.projectile.x, y: gd.projectile.y });
            if (gd.projectile.trail.length > 15) gd.projectile.trail.shift();

            if (gd.projectile.y >= 500 && gd.projectile.x >= gd.moat.x && gd.projectile.x <= gd.moat.x + gd.moat.w) {
                this.createExplosion(gd.projectile.x, 500, "#00aaff", 15, 1.5);
                if (window.playProceduralSound) window.playProceduralSound('error');
                gd.projectile = null;
                gd.message = "¡Splash! ¡Cayó en el foso de agua!";
                gd.messageColor = "#ff3333";
                this.checkArchitectGameOver();
            }
            else if (gd.projectile.x >= gd.target.x && gd.projectile.x <= gd.target.x + gd.target.w &&
                     gd.projectile.y >= gd.target.y && gd.projectile.y <= gd.target.y + gd.target.h) {
                this.createExplosion(gd.projectile.x, gd.projectile.y, "#00ff99", 25, 2.0);
                if (window.playProceduralSound) window.playProceduralSound('win');
                gd.hits++;
                gd.score = gd.hits;
                document.getElementById('minigame-score').innerText = `Puntos: ${gd.hits}`;
                gd.projectile = null;
                gd.message = "🎯 ¡BLANCO DIRECTO! 🎯";
                gd.messageColor = "#ffd700";
                
                gd.wind = (Math.round((Math.random() - 0.5) * 8 * 10) / 10);
                gd.target.y = 150 + Math.random() * 220;

                if (gd.hits >= 3) {
                    gd.completed = true;
                    setTimeout(() => this.win(), 1000);
                } else {
                    this.checkArchitectGameOver();
                }
            }
            else if (gd.projectile.y > 600 || gd.projectile.x > 800 || gd.projectile.x < 0) {
                gd.projectile = null;
                gd.message = "¡Tiro errado fuera de los límites!";
                gd.messageColor = "#aaaaaa";
                this.checkArchitectGameOver();
            }
        }
    },

    checkArchitectGameOver() {
        const gd = this.gameData;
        if (gd.hits < 3 && gd.shotsLeft <= 0 && !gd.projectile) {
            setTimeout(() => this.gameOver(), 1000);
        }
    },

    drawArchitect() {
        const gd = this.gameData;
        if (!gd) return;

        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, 480);
        skyGrad.addColorStop(0, '#050c18');
        skyGrad.addColorStop(1, '#152238');
        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, 800, 600);

        this.ctx.fillStyle = "rgba(255,255,255,0.4)";
        for (let i = 0; i < 20; i++) {
            let x = (i * 137) % 800;
            let y = (i * 73) % 250;
            this.ctx.fillRect(x, y, 1.5, 1.5);
        }

        this.ctx.fillStyle = "#1e3820";
        this.ctx.fillRect(0, 480, gd.moat.x, 120);
        this.ctx.fillRect(gd.moat.x + gd.moat.w, 480, 800 - (gd.moat.x + gd.moat.w), 120);

        const waterGrad = this.ctx.createLinearGradient(gd.moat.x, 490, gd.moat.x, 600);
        waterGrad.addColorStop(0, '#0055ff');
        waterGrad.addColorStop(1, '#001144');
        this.ctx.fillStyle = waterGrad;
        this.ctx.fillRect(gd.moat.x, 490, gd.moat.w, 110);

        this.ctx.strokeStyle = "rgba(255,255,255,0.15)";
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            let ry = 510 + i * 18;
            let speedOffset = (this.gameTime * 25) % 120;
            this.ctx.beginPath();
            this.ctx.moveTo(gd.moat.x + speedOffset, ry);
            this.ctx.lineTo(gd.moat.x + speedOffset + 60, ry);
            this.ctx.moveTo(gd.moat.x + ((speedOffset + 200) % gd.moat.w), ry + 8);
            this.ctx.lineTo(gd.moat.x + ((speedOffset + 260) % gd.moat.w), ry + 8);
            this.ctx.stroke();
        }

        this.ctx.fillStyle = "#4a4e52";
        this.ctx.fillRect(gd.target.x, 80, 120, 400);
        this.ctx.strokeStyle = "#383b3e";
        this.ctx.lineWidth = 1;
        for (let y = 80; y <= 480; y += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(gd.target.x, y);
            this.ctx.lineTo(gd.target.x + 120, y);
            this.ctx.stroke();
        }

        this.ctx.save();
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#ff3333";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(gd.target.x, gd.target.y, gd.target.w, gd.target.h);
        this.ctx.fillStyle = "#ff3333";
        this.ctx.fillRect(gd.target.x, gd.target.y + 15, gd.target.w, gd.target.h - 30);
        this.ctx.fillStyle = "#ffd700";
        this.ctx.fillRect(gd.target.x, gd.target.y + 35, gd.target.w, gd.target.h - 70);
        this.ctx.restore();

        this.ctx.fillStyle = "#8d6e63";
        this.ctx.fillRect(gd.catapult.x - 30, gd.catapult.y, 60, 40);
        this.ctx.beginPath();
        this.ctx.arc(gd.catapult.x, gd.catapult.y, gd.catapult.r, 0, Math.PI * 2);
        this.ctx.stroke();

        if (gd.dragStart && this.mouse.isDown) {
            const dx = this.mouse.x - gd.catapult.x;
            const dy = this.mouse.y - gd.catapult.y;
            const dist = Math.min(Math.sqrt(dx*dx + dy*dy), 100);
            const angle = Math.atan2(dy, dx);
            const pullX = gd.catapult.x + Math.cos(angle) * dist;
            const pullY = gd.catapult.y + Math.sin(angle) * dist;

            this.ctx.strokeStyle = "#ff0055";
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(gd.catapult.x - 15, gd.catapult.y - 10);
            this.ctx.lineTo(pullX, pullY);
            this.ctx.moveTo(gd.catapult.x + 15, gd.catapult.y - 10);
            this.ctx.lineTo(pullX, pullY);
            this.ctx.stroke();

            this.ctx.fillStyle = "#ffd700";
            this.ctx.beginPath();
            this.ctx.arc(pullX, pullY, 8, 0, Math.PI * 2);
            this.ctx.fill();

            const vx = -dx * 0.15;
            const vy = -dy * 0.15;
            let px = gd.catapult.x;
            let py = gd.catapult.y - 10;
            let pvy = vy;
            let pvx = vx;
            this.ctx.fillStyle = "rgba(0, 255, 153, 0.6)";
            for (let i = 0; i < 30; i++) {
                pvy += 0.25;
                pvx += gd.wind * 0.02;
                px += pvx;
                py += pvy;
                if (py > 480 && px >= gd.moat.x && px <= gd.moat.x + gd.moat.w) {
                    this.ctx.fillRect(px - 2, py - 2, 4, 4);
                    break;
                }
                if (px > 800 || py > 600 || px < 0) break;
                if (i % 2 === 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(px, py, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        } else {
            this.ctx.strokeStyle = "#8d6e63";
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.moveTo(gd.catapult.x, gd.catapult.y);
            this.ctx.lineTo(gd.catapult.x + 15, gd.catapult.y - 30);
            this.ctx.stroke();
            this.ctx.fillStyle = "#aaaaaa";
            this.ctx.beginPath();
            this.ctx.arc(gd.catapult.x + 15, gd.catapult.y - 30, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }

        if (gd.projectile) {
            this.ctx.strokeStyle = "rgba(0, 255, 153, 0.3)";
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            for (let i = 0; i < gd.projectile.trail.length; i++) {
                let p = gd.projectile.trail[i];
                if (i === 0) this.ctx.moveTo(p.x, p.y);
                else this.ctx.lineTo(p.x, p.y);
            }
            this.ctx.stroke();

            this.ctx.fillStyle = "#ffd700";
            this.ctx.beginPath();
            this.ctx.arc(gd.projectile.x, gd.projectile.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = "rgba(0,0,0,0.6)";
        this.ctx.fillRect(0, 0, 800, 50);

        this.ctx.font = "bold 16px monospace";
        this.ctx.fillStyle = "#00ff99";
        this.ctx.fillText(`Aciertos: ${gd.hits}/3`, 20, 30);

        this.ctx.fillStyle = "#ffd700";
        this.ctx.fillText(`Proyectiles: ${gd.shotsLeft}`, 200, 30);

        this.ctx.fillStyle = "#00ffff";
        const windDir = gd.wind > 0 ? "➡️" : gd.wind < 0 ? "⬅️" : "";
        this.ctx.fillText(`Viento: ${Math.abs(gd.wind)} m/s ${windDir}`, 400, 30);

        this.ctx.fillStyle = gd.messageColor;
        this.ctx.textAlign = "center";
        this.ctx.fillText(gd.message, 400, 560);
        this.ctx.textAlign = "left";
    },

    inputArchitectPress(x, y) {
        const gd = this.gameData;
        if (!gd || gd.projectile || gd.completed || gd.shotsLeft <= 0) return;
        
        const dist = Math.sqrt((x - gd.catapult.x)*(x - gd.catapult.x) + (y - gd.catapult.y)*(y - gd.catapult.y));
        if (dist < 60) {
            gd.dragStart = { x: x, y: y };
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
    },

    releaseArchitect(x, y) {
        const gd = this.gameData;
        if (!gd || !gd.dragStart) return;

        const dx = x - gd.catapult.x;
        const dy = y - gd.catapult.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist > 15) {
            const limitDist = Math.min(dist, 100);
            const angle = Math.atan2(dy, dx);
            
            const vx = -Math.cos(angle) * limitDist * 0.15;
            const vy = -Math.sin(angle) * limitDist * 0.15;

            gd.projectile = {
                x: gd.catapult.x,
                y: gd.catapult.y - 10,
                vx: vx,
                vy: vy,
                trail: []
            };

            gd.shotsLeft--;
            gd.message = "¡Fuego!";
            gd.messageColor = "#00ffff";
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
        gd.dragStart = null;
    },

    // ==========================================================
    // 7. HACKEO DE CRIPTO-NEÓN (IVÁN DÍA 3)
    // ==========================================================
    setupNeon() {
        this.gameData = {
            grid: [
                [ {type:'E', angle:0}, {type:'L', angle:90}, {type:'I', angle:90}, {type:'L', angle:180}, {type:'E', angle:0} ],
                [ {type:'I', angle:0}, {type:'L', angle:0},  {type:'E', angle:0},  {type:'L', angle:90},  {type:'I', angle:0} ],
                [ {type:'I', angle:0}, {type:'I', angle:0},  {type:'I', angle:0},  {type:'I', angle:0},  {type:'I', angle:0} ],
                [ {type:'E', angle:0}, {type:'L', angle:270}, {type:'I', angle:90}, {type:'L', angle:0},  {type:'E', angle:0} ]
            ],
            entry: { col: 0, row: 2 },
            exit: { col: 4, row: 2 },
            timeLeft: 35,
            completed: false
        };

        const angles = [0, 90, 180, 270];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = this.gameData.grid[r][c];
                if (cell.type !== 'E' && !(c === 0 && r === 2) && !(c === 4 && r === 2)) {
                    cell.angle = angles[Math.floor(Math.random() * angles.length)];
                }
            }
        }
        this.solveNeon();
    },

    getCellPorts(cell) {
        if (cell.type === 'E') return [];
        if (cell.type === '+') return [0, 1, 2, 3];
        if (cell.type === 'I') {
            const a = (cell.angle % 180);
            return a === 0 ? [1, 3] : [0, 2];
        }
        if (cell.type === 'L') {
            const a = (cell.angle % 360);
            if (a === 0) return [1, 2];
            if (a === 90) return [2, 3];
            if (a === 180) return [3, 0];
            if (a === 270) return [0, 1];
        }
        return [];
    },

    solveNeon() {
        const gd = this.gameData;
        if (!gd) return;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 5; c++) {
                gd.grid[r][c].powered = false;
            }
        }

        const queue = [];
        const startCell = gd.grid[gd.entry.row][gd.entry.col];
        startCell.powered = true;
        queue.push(gd.entry);

        while(queue.length > 0) {
            const curr = queue.shift();
            const currCell = gd.grid[curr.row][curr.col];
            const currPorts = this.getCellPorts(currCell);

            const dirs = [
                { dr: -1, dc: 0, port: 0, oppPort: 2 },
                { dr: 0, dc: 1, port: 1, oppPort: 3 },
                { dr: 1, dc: 0, port: 2, oppPort: 0 },
                { dr: 0, dc: -1, port: 3, oppPort: 1 }
            ];

            for (const d of dirs) {
                const nr = curr.row + d.dr;
                const nc = curr.col + d.dc;

                if (nr >= 0 && nr < 4 && nc >= 0 && nc < 5) {
                    const neighCell = gd.grid[nr][nc];
                    if (!neighCell.powered && neighCell.type !== 'E') {
                        const neighPorts = this.getCellPorts(neighCell);
                        
                        if (currPorts.includes(d.port) && neighPorts.includes(d.oppPort)) {
                            neighCell.powered = true;
                            queue.push({ row: nr, col: nc });
                        }
                    }
                }
            }
        }

        if (gd.grid[gd.exit.row][gd.exit.col].powered && !gd.completed) {
            gd.completed = true;
            if (window.playProceduralSound) window.playProceduralSound('success');
            setTimeout(() => this.win(), 1000);
        }
    },

    updateNeon(dt) {
        const gd = this.gameData;
        if (!gd || gd.completed) return;

        gd.timeLeft -= dt;
        if (gd.timeLeft <= 0) {
            gd.timeLeft = 0;
            this.gameOver();
        }
    },

    drawNeon() {
        const gd = this.gameData;
        if (!gd) return;

        this.ctx.fillStyle = '#060309';
        this.ctx.fillRect(0, 0, 800, 600);

        this.ctx.strokeStyle = 'rgba(255, 0, 127, 0.05)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, 600); this.ctx.stroke();
        }
        for (let y = 0; y < 600; y += 40) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(800, y); this.ctx.stroke();
        }

        this.ctx.strokeStyle = '#ff007f';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(20, 60, 760, 520);
        this.ctx.fillStyle = 'rgba(255, 0, 127, 0.02)';
        this.ctx.fillRect(20, 60, 760, 520);

        const timeRatio = gd.timeLeft / 35;
        this.ctx.fillStyle = timeRatio > 0.3 ? '#00f0ff' : '#ff3333';
        this.ctx.fillRect(20, 570, 760 * timeRatio, 10);

        this.ctx.font = 'bold 18px monospace';
        this.ctx.fillStyle = '#ff007f';
        this.ctx.fillText('CRIPTO-NEON ENLACE DE DATOS', 40, 40);

        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillText(`TIEMPO LÍMITE: ${Math.ceil(gd.timeLeft)}s`, 550, 40);

        this.ctx.save();
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(100, 120 + 2 * 100 + 20, 40, 60);
        this.ctx.font = 'bold 12px monospace';
        this.ctx.fillStyle = '#050508';
        this.ctx.fillText('PWR', 108, 120 + 2 * 100 + 55);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.shadowBlur = gd.grid[gd.exit.row][gd.exit.col].powered ? 20 : 5;
        this.ctx.shadowColor = gd.grid[gd.exit.row][gd.exit.col].powered ? '#ff007f' : '#333333';
        this.ctx.fillStyle = gd.grid[gd.exit.row][gd.exit.col].powered ? '#ff007f' : '#222222';
        this.ctx.fillRect(660, 120 + 2 * 100 + 20, 40, 60);
        this.ctx.fillStyle = gd.grid[gd.exit.row][gd.exit.col].powered ? '#ffffff' : '#555555';
        this.ctx.fillText('DATA', 665, 120 + 2 * 100 + 55);
        this.ctx.restore();

        const offsetX = 160;
        const offsetY = 120;
        const cellSize = 100;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = gd.grid[r][c];
                const cx = offsetX + c * cellSize;
                const cy = offsetY + r * cellSize;

                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(cx, cy, cellSize, cellSize);

                if (cell.type === 'E') continue;

                this.ctx.save();
                if (cell.powered) {
                    this.ctx.shadowBlur = 12;
                    this.ctx.shadowColor = '#00f0ff';
                    this.ctx.strokeStyle = '#00f0ff';
                    this.ctx.lineWidth = 8;
                } else {
                    this.ctx.strokeStyle = '#382247';
                    this.ctx.lineWidth = 6;
                }

                this.ctx.translate(cx + cellSize/2, cy + cellSize/2);
                this.ctx.rotate((cell.angle * Math.PI) / 180);

                if (cell.type === 'I') {
                    this.ctx.beginPath();
                    this.ctx.moveTo(-cellSize/2, 0);
                    this.ctx.lineTo(cellSize/2, 0);
                    this.ctx.stroke();
                } else if (cell.type === 'L') {
                    this.ctx.beginPath();
                    this.ctx.moveTo(cellSize/2, 0);
                    this.ctx.lineTo(0, 0);
                    this.ctx.lineTo(0, cellSize/2);
                    this.ctx.stroke();
                } else if (cell.type === '+') {
                    this.ctx.beginPath();
                    this.ctx.moveTo(-cellSize/2, 0);
                    this.ctx.lineTo(cellSize/2, 0);
                    this.ctx.moveTo(0, -cellSize/2);
                    this.ctx.lineTo(0, cellSize/2);
                    this.ctx.stroke();
                }

                this.ctx.fillStyle = cell.powered ? '#ffffff' : '#553c6e';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.restore();
            }
        }
    },

    inputNeonPress(x, y) {
        const gd = this.gameData;
        if (!gd || gd.completed || gd.timeLeft <= 0) return;

        const offsetX = 160;
        const offsetY = 120;
        const cellSize = 100;

        const col = Math.floor((x - offsetX) / cellSize);
        const row = Math.floor((y - offsetY) / cellSize);

        if (col >= 0 && col < 5 && row >= 0 && row < 4) {
            const cell = gd.grid[row][col];
            if (cell.type !== 'E' && !(col === 0 && row === 2) && !(col === 4 && row === 2)) {
                cell.angle = (cell.angle + 90) % 360;
                if (window.playProceduralSound) window.playProceduralSound('click');
                this.solveNeon();
            }
        }
    },

    // ==========================================================
    // 8. INFILTRACIÓN SHINOBI (IVÁN DÍA 3)
    // ==========================================================
    setupRush() {
        this.gameData = {
            distance: 0,
            goal: 500,
            player: { x: 150, y: 430, running: false, caught: false },
            guard: { state: 'patrolling', stateTimer: 2.0 },
            lives: 3,
            completed: false,
            bgScroll: 0
        };
    },

    updateRush(dt) {
        const gd = this.gameData;
        if (!gd || gd.completed) return;

        gd.player.running = this.mouse.isDown && !gd.player.caught;

        if (gd.player.running) {
            gd.distance += 45 * dt;
            gd.bgScroll = (gd.bgScroll - 150 * dt) % 800;
            if (gd.distance >= gd.goal) {
                gd.distance = gd.goal;
                gd.completed = true;
                if (window.playProceduralSound) window.playProceduralSound('success');
                setTimeout(() => this.win(), 1000);
            }

            if (Math.random() < 0.2) {
                this.particles.push({
                    x: gd.player.x - 10,
                    y: gd.player.y + 25,
                    vx: -2 - Math.random() * 2,
                    vy: -Math.random() * 1,
                    size: 4 + Math.random() * 6,
                    color: "rgba(255,255,255,0.2)",
                    life: 0.8,
                    decay: 0.04
                });
            }
        }

        gd.guard.stateTimer -= dt;
        if (gd.guard.stateTimer <= 0) {
            if (gd.guard.state === 'patrolling') {
                gd.guard.state = 'warning';
                gd.guard.stateTimer = 1.0 + Math.random() * 0.8;
                if (window.playProceduralSound) window.playProceduralSound('click');
            } else if (gd.guard.state === 'warning') {
                gd.guard.state = 'sweeping';
                gd.guard.stateTimer = 1.2;
            } else if (gd.guard.state === 'sweeping') {
                gd.guard.state = 'patrolling';
                gd.guard.stateTimer = 1.8 + Math.random() * 1.5;
            }
        }

        if (gd.guard.state === 'sweeping' && gd.player.running && !gd.player.caught) {
            gd.player.caught = true;
            this.triggerShake(12);
            gd.lives--;
            if (window.playProceduralSound) window.playProceduralSound('error');

            gd.distance = Math.max(0, gd.distance - 60);

            this.createExplosion(gd.player.x, gd.player.y, '#ff3333', 25, 2);

            if (gd.lives <= 0) {
                setTimeout(() => this.gameOver(), 1000);
            } else {
                setTimeout(() => {
                    gd.player.caught = false;
                }, 1500);
            }
        }
    },

    drawRush() {
        const gd = this.gameData;
        if (!gd) return;

        this.ctx.fillStyle = '#06050a';
        this.ctx.fillRect(0, 0, 800, 600);

        this.ctx.fillStyle = '#11101a';
        for (let i = 0; i < 3; i++) {
            let sx = (gd.bgScroll * 0.4) + i * 400;
            this.ctx.fillRect(sx, 200, 180, 280);
            this.ctx.fillRect(sx - 30, 250, 240, 230);
        }

        this.ctx.fillStyle = '#221e35';
        this.ctx.fillRect(0, 450, 800, 150);

        this.ctx.save();
        this.ctx.translate(gd.player.x, gd.player.y);

        if (gd.player.caught) {
            this.ctx.fillStyle = '#ff3333';
            this.ctx.fillRect(-15, -25, 30, 50);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.strokeRect(-18, -28, 36, 56);
        } else if (gd.player.running) {
            const bounce = Math.sin(this.gameTime * 18) * 4;
            this.ctx.translate(0, bounce);
            this.ctx.rotate(0.08);

            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillRect(-12, -22, 24, 6);
            this.ctx.fillStyle = '#2196f3';
            this.ctx.fillRect(-15, -16, 30, 32);

            const legSwing = Math.sin(this.gameTime * 18) * 12;
            this.ctx.fillStyle = '#0d47a1';
            this.ctx.fillRect(-10, 16, 8, 12 + legSwing);
            this.ctx.fillRect(2, 16, 8, 12 - legSwing);
        } else {
            this.ctx.translate(0, 10);
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 25, Math.PI, 0);
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = '#0d47a1';
            this.ctx.fillRect(-10, -5, 20, 15);
        }
        this.ctx.restore();

        const lightX = 700;
        const lightY = 50;
        let targetX = 0;
        let beamColor = 'rgba(0, 170, 255, 0.15)';

        if (gd.guard.state === 'warning') {
            beamColor = 'rgba(255, 120, 0, 0.25)';
            targetX = 300 + Math.sin(this.gameTime * 15) * 50;
        } else if (gd.guard.state === 'sweeping') {
            beamColor = 'rgba(255, 0, 50, 0.4)';
            targetX = 150 + Math.sin(this.gameTime * 12) * 80;
        } else {
            targetX = 500 + Math.sin(this.gameTime * 3) * 150;
        }

        this.ctx.fillStyle = gd.guard.state === 'sweeping' ? '#ff3333' : gd.guard.state === 'warning' ? '#ff9800' : '#00aaff';
        this.ctx.beginPath();
        this.ctx.arc(lightX, lightY, 15, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = beamColor;
        this.ctx.beginPath();
        this.ctx.moveTo(lightX, lightY);
        this.ctx.lineTo(targetX - 70, 450);
        this.ctx.lineTo(targetX + 70, 450);
        this.ctx.closePath();
        this.ctx.fill();

        if (gd.guard.state === 'sweeping') {
            this.ctx.font = 'bold 24px monospace';
            this.ctx.fillStyle = '#ff003c';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🚨 ¡BARRIDO DE GUARDIA ACTIVADO! ¡ALTO! 🚨', 400, 120);
        } else if (gd.guard.state === 'warning') {
            this.ctx.font = 'bold 20px monospace';
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('⚠️ ALERTA: Guardia detectando firma óptica... ⚠️', 400, 120);
        }
        this.ctx.textAlign = 'left';

        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, 800, 50);

        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fillText(`Distancia: ${Math.floor(gd.distance)}m / ${gd.goal}m`, 20, 31);

        this.ctx.fillStyle = '#ff3333';
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        this.ctx.fillText(`Vidas: ${hearts}`, 550, 31);

        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(0, 520, 800, 80);
        this.ctx.font = 'bold 16px sans-serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        if (this.mouse.isDown) {
            this.ctx.fillText('🏃 CORRIENDO HASTA EL CASTILLO... (¡Suelta la pantalla para camuflarte!)', 400, 555);
        } else {
            this.ctx.fillText('👥 OCULTO EN LAS SOMBRAS. (¡Pulsa y mantén para avanzar!)', 400, 555);
        }
        this.ctx.textAlign = 'left';
    },

    inputRushPress(x, y) {
    },

    releaseRush(x, y) {
    },

    // ==========================================================
    // 9. SINTONIZADOR DE ONDAS (IVÁN DÍA 3)
    // ==========================================================
    setupFlow() {
        this.gameData = {
            targetFreq: 3.0 + Math.random() * 4.0,
            targetAmp: 60 + Math.random() * 90,
            playerFreq: 1.5,
            playerAmp: 40,
            syncProgress: 0,
            completed: false,
            freqSlider: { x: 120, y: 500, w: 200, val: 0.1 },
            ampSlider: { x: 480, y: 500, w: 200, val: 0.2 },
            dragSlider: null
        };
    },

    updateFlow(dt) {
        const gd = this.gameData;
        if (!gd || gd.completed) return;

        gd.playerFreq = 1.0 + gd.freqSlider.val * 8.0;
        gd.playerAmp = 20 + gd.ampSlider.val * 160;

        if (this.mouse.isDown) {
            const mx = this.mouse.x;
            const my = this.mouse.y;

            if (gd.dragSlider === 'freq' || (!gd.dragSlider && my >= 470 && my <= 530 && mx >= gd.freqSlider.x && mx <= gd.freqSlider.x + gd.freqSlider.w)) {
                gd.dragSlider = 'freq';
                const normVal = Math.max(0, Math.min(1, (mx - gd.freqSlider.x) / gd.freqSlider.w));
                gd.freqSlider.val = normVal;
            } else if (gd.dragSlider === 'amp' || (!gd.dragSlider && my >= 470 && my <= 530 && mx >= gd.ampSlider.x && mx <= gd.ampSlider.x + gd.ampSlider.w)) {
                gd.dragSlider = 'amp';
                const normVal = Math.max(0, Math.min(1, (mx - gd.ampSlider.x) / gd.ampSlider.w));
                gd.ampSlider.val = normVal;
            }
        } else {
            gd.dragSlider = null;
        }

        const freqDiff = Math.abs(gd.playerFreq - gd.targetFreq);
        const ampDiff = Math.abs(gd.playerAmp - gd.targetAmp);

        if (freqDiff < 0.35 && ampDiff < 12) {
            gd.syncProgress += 25 * dt;
            if (gd.syncProgress >= 100) {
                gd.syncProgress = 100;
                gd.completed = true;
                gd.score = 100;
                document.getElementById('minigame-score').innerText = `Puntos: 100`;
                if (window.playProceduralSound) window.playProceduralSound('success');
                setTimeout(() => this.win(), 1000);
            }
        } else {
            gd.syncProgress = Math.max(0, gd.syncProgress - 10 * dt);
        }
    },

    drawFlow() {
        const gd = this.gameData;
        if (!gd) return;

        this.ctx.fillStyle = '#060e0a';
        this.ctx.fillRect(0, 0, 800, 600);

        this.ctx.strokeStyle = 'rgba(0, 255, 100, 0.08)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, 400); this.ctx.stroke();
        }
        for (let y = 0; y < 400; y += 40) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(800, y); this.ctx.stroke();
        }

        this.ctx.strokeStyle = 'rgba(0, 255, 100, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 200);
        this.ctx.lineTo(800, 200);
        this.ctx.stroke();

        const phase = this.gameTime * 5;

        this.ctx.strokeStyle = '#ff3333';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 8]);
        this.ctx.beginPath();
        for (let x = 0; x < 800; x += 5) {
            let y = 200 + Math.sin(x * gd.targetFreq * 0.03 + phase) * gd.targetAmp;
            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.save();
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ff66';
        this.ctx.strokeStyle = '#00ff66';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        for (let x = 0; x < 800; x += 5) {
            let y = 200 + Math.sin(x * gd.playerFreq * 0.03 + phase) * gd.playerAmp;
            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.fillStyle = '#101614';
        this.ctx.fillRect(0, 400, 800, 200);
        this.ctx.strokeStyle = '#00ff66';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 400);
        this.ctx.lineTo(800, 400);
        this.ctx.stroke();

        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.fillText(`FRECUENCIA (Hz): ${gd.playerFreq.toFixed(2)}`, gd.freqSlider.x, 460);

        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(gd.freqSlider.x, gd.freqSlider.y, gd.freqSlider.w, 10);
        this.ctx.fillStyle = '#00ff66';
        this.ctx.fillRect(gd.freqSlider.x, gd.freqSlider.y, gd.freqSlider.w * gd.freqSlider.val, 10);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(gd.freqSlider.x + gd.freqSlider.w * gd.freqSlider.val - 8, gd.freqSlider.y - 5, 16, 20);

        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillText(`AMPLITUD (V): ${gd.playerAmp.toFixed(1)}`, gd.ampSlider.x, 460);

        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(gd.ampSlider.x, gd.ampSlider.y, gd.ampSlider.w, 10);
        this.ctx.fillStyle = '#00ff66';
        this.ctx.fillRect(gd.ampSlider.x, gd.ampSlider.y, gd.ampSlider.w * gd.ampSlider.val, 10);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(gd.ampSlider.x + gd.ampSlider.w * gd.ampSlider.val - 8, gd.ampSlider.y - 5, 16, 20);

        const barX = 350;
        const barY = 480;
        const barW = 100;
        const barH = 50;

        this.ctx.fillStyle = 'rgba(0,255,100,0.05)';
        this.ctx.fillRect(barX, barY, barW, barH);
        this.ctx.strokeStyle = gd.syncProgress > 5 ? '#00ff66' : '#555';
        this.ctx.strokeRect(barX, barY, barW, barH);

        this.ctx.font = 'bold 12px monospace';
        this.ctx.fillStyle = '#888';
        this.ctx.fillText('SINCRONÍA', barX + 18, barY + 18);
        this.ctx.font = 'bold 18px monospace';
        this.ctx.fillStyle = gd.syncProgress > 0 ? '#00ff66' : '#888';
        this.ctx.fillText(`${Math.floor(gd.syncProgress)}%`, barX + 32, barY + 38);

        const freqDiff = Math.abs(gd.playerFreq - gd.targetFreq);
        const ampDiff = Math.abs(gd.playerAmp - gd.targetAmp);

        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        if (freqDiff < 0.35 && ampDiff < 12) {
            this.ctx.fillStyle = '#00ff66';
            this.ctx.fillText('⚡ ¡SEÑALES ACOPLADAS! MANTÉN LA POSICIÓN ⚡', 400, 565);
        } else {
            this.ctx.fillStyle = '#ff3333';
            this.ctx.fillText('❌ SEÑAL DESACOPLADA - AJUSTA LOS DIALES ❌', 400, 565);
        }
        this.ctx.textAlign = 'left';
    },

    inputFlowPress(x, y) {
    },

    // ==========================================================
    // 10. ESCÁNER ALIENÍGENA KUROMON (day_4_bestiary)
    // ==========================================================
    setupBestiary() {
        this.gameData = {
            timeLeft: 60,
            scanner: { x: 400, y: 300, radius: 55, progress: 0, target: null },
            creatures: [],
            bubbles: [],
            scannedList: []
        };
        
        // Spawn alien creatures
        const alienNames = ["Tentaculoide-X", "Soplador de Fuego", "Manta-Neon", "Cangrejo Mutante", "Medusa Estelar", "Molusco-Gamma"];
        const alienColors = ["#39ff14", "#ff007f", "#00ffff", "#ffd700", "#ff00ff", "#7e57c2"];
        for (let i = 0; i < 6; i++) {
            this.gameData.creatures.push({
                id: i,
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 400,
                vx: (Math.random() - 0.5) * 120,
                vy: (Math.random() - 0.5) * 120,
                radius: 35,
                type: 'alien',
                name: alienNames[i],
                color: alienColors[i],
                scanned: false,
                swimAngle: Math.random() * Math.PI * 2,
                swimSpeed: 1.5 + Math.random() * 1.5
            });
        }
        
        // Spawn normal fish
        const normalNames = ["Atún Kuromon", "Pargo Rojo", "Sardina Común", "Fugu Común", "Calamar Blanco"];
        for (let i = 0; i < 5; i++) {
            this.gameData.creatures.push({
                id: i + 10,
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 400,
                vx: (Math.random() - 0.5) * 100,
                vy: (Math.random() - 0.5) * 100,
                radius: 28,
                type: 'normal',
                name: normalNames[i % normalNames.length],
                color: '#607d8b',
                scanned: false,
                swimAngle: Math.random() * Math.PI * 2,
                swimSpeed: 1.0 + Math.random() * 1.0
            });
        }
        
        // Bubbles
        for (let i = 0; i < 20; i++) {
            this.gameData.bubbles.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                radius: 2 + Math.random() * 5,
                vy: 20 + Math.random() * 40
            });
        }
    },

    updateBestiary(dt) {
        const gd = this.gameData;
        if (!gd) return;

        gd.timeLeft -= dt;
        if (gd.timeLeft <= 0) {
            this.gameOver();
            return;
        }

        // Move scanner smoothly towards mouse
        const sc = gd.scanner;
        sc.x += (this.mouse.x - sc.x) * 0.15;
        sc.y += (this.mouse.y - sc.y) * 0.15;

        // Move bubbles
        for (let b of gd.bubbles) {
            b.y -= b.vy * dt;
            if (b.y < -10) {
                b.y = 610;
                b.x = Math.random() * 800;
            }
        }

        // Move creatures
        for (let c of gd.creatures) {
            // Apply organic wavy swim motion
            c.swimAngle += dt * c.swimSpeed;
            let currentVx = c.vx + Math.cos(c.swimAngle) * 20;
            let currentVy = c.vy + Math.sin(c.swimAngle) * 20;
            
            c.x += currentVx * dt;
            c.y += currentVy * dt;

            // Bounce off boundaries
            if (c.x - c.radius < 0) { c.x = c.radius; c.vx = -c.vx; }
            if (c.x + c.radius > 800) { c.x = 800 - c.radius; c.vx = -c.vx; }
            if (c.y - c.radius < 0) { c.y = c.radius; c.vy = -c.vy; }
            if (c.y + c.radius > 600) { c.y = 600 - c.radius; c.vy = -c.vy; }
        }

        // Find creature currently being scanned
        let target = null;
        let minDist = 999999;
        
        for (let c of gd.creatures) {
            if (c.scanned) continue;
            let dist = Math.hypot(c.x - sc.x, c.y - sc.y);
            if (dist < sc.radius + c.radius) {
                if (dist < minDist) {
                    minDist = dist;
                    target = c;
                }
            }
        }

        if (target) {
            if (sc.target === target) {
                sc.progress += dt * 80; // ~1.25 seconds to complete
                // Create scan sparks
                if (Math.random() < 0.35) {
                    this.createExplosion(target.x, target.y, target.color, 1, 0.4);
                }
                
                if (sc.progress >= 100) {
                    sc.progress = 0;
                    sc.target = null;
                    target.scanned = true;
                    
                    if (target.type === 'alien') {
                        this.score++;
                        document.getElementById('minigame-score').innerText = `Registrados: ${this.score}/5`;
                        if (window.playProceduralSound) window.playProceduralSound('collect');
                        this.createExplosion(target.x, target.y, '#39ff14', 25, 1.8);
                        gd.scannedList.push(target.name);
                        
                        if (this.score >= this.goal) {
                            if (window.launchConfetti) window.launchConfetti();
                            this.win();
                            return;
                        }
                    } else {
                        // Scan penalty for scanning normal fish!
                        if (window.playProceduralSound) window.playProceduralSound('error');
                        this.triggerShake(12);
                        gd.timeLeft -= 10; // Penalty
                        this.createExplosion(target.x, target.y, '#ff3333', 20, 1.5);
                    }
                }
            } else {
                sc.target = target;
                sc.progress = 0;
            }
        } else {
            sc.target = null;
            sc.progress = 0;
        }
    },

    drawBestiary() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Background water gradient
        let water = ctx.createLinearGradient(0, 0, 0, 600);
        water.addColorStop(0, '#001a2d');
        water.addColorStop(1, '#00070d');
        ctx.fillStyle = water;
        ctx.fillRect(0, 0, 800, 600);

        // Draw radar circles / sonar grids in background
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.05)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(400, 300, 150, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(400, 300, 300, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 300); ctx.lineTo(800, 300); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(400, 0); ctx.lineTo(400, 600); ctx.stroke();

        // Sonar beam sweep animation
        let sweepAngle = this.gameTime * 1.5;
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(400, 300);
        ctx.lineTo(400 + Math.cos(sweepAngle)*500, 300 + Math.sin(sweepAngle)*500);
        ctx.stroke();

        // Draw bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let b of gd.bubbles) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
            ctx.fill();
        }

        // Draw creatures
        for (let c of gd.creatures) {
            if (c.scanned && c.type === 'alien') continue; // Hidden once scanned

            ctx.save();
            ctx.translate(c.x, c.y);
            
            // Swim rotation based on speed vector
            let angle = Math.atan2(c.vy, c.vx);
            ctx.rotate(angle);

            if (c.type === 'alien') {
                // Glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = c.color;
                ctx.fillStyle = c.color;
                
                // Draw cute alien jellyfish/octopus shape
                ctx.beginPath();
                ctx.arc(0, 0, c.radius - 8, Math.PI, 0); // Head
                ctx.lineTo(c.radius - 8, c.radius - 12);
                ctx.quadraticCurveTo(0, c.radius - 2, -(c.radius - 8), c.radius - 12);
                ctx.closePath();
                ctx.fill();

                // Tentacles/Legs waving
                let wave = Math.sin(this.gameTime * 6 + c.id) * 6;
                ctx.strokeStyle = c.color;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(-12, 5); ctx.quadraticCurveTo(-18 + wave, 20, -12, 30);
                ctx.moveTo(0, 5); ctx.quadraticCurveTo(0 + wave, 22, wave, 32);
                ctx.moveTo(12, 5); ctx.quadraticCurveTo(18 + wave, 20, 12, 30);
                ctx.stroke();

                // Eyes
                ctx.fillStyle = '#000000';
                ctx.beginPath(); ctx.arc(-6, -4, 3, 0, Math.PI*2); ctx.arc(6, -4, 3, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(-5, -5, 1, 0, Math.PI*2); ctx.arc(7, -5, 1, 0, Math.PI*2); ctx.fill();
            } else {
                // Normal fish
                ctx.fillStyle = '#455a64';
                // Tail
                ctx.beginPath();
                ctx.moveTo(-c.radius + 6, 0);
                ctx.lineTo(-c.radius - 6, -10);
                ctx.lineTo(-c.radius - 6, 10);
                ctx.closePath();
                ctx.fill();
                
                // Body
                ctx.beginPath();
                ctx.ellipse(0, 0, c.radius - 4, c.radius - 12, 0, 0, Math.PI*2);
                ctx.fill();

                // Eye
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(c.radius - 12, -3, 3, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath(); ctx.arc(c.radius - 11, -3, 1.5, 0, Math.PI*2); ctx.fill();
            }
            ctx.restore();
        }

        // Draw Scanner Visor
        const sc = gd.scanner;
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = sc.target ? (sc.target.type === 'alien' ? '#39ff14' : '#ff3333') : '#ffffff';
        ctx.strokeStyle = sc.target ? (sc.target.type === 'alien' ? '#39ff14' : '#ff3333') : 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 3;
        
        // Main crosshair circle
        ctx.beginPath();
        ctx.arc(sc.x, sc.y, sc.radius, 0, Math.PI*2);
        ctx.stroke();

        // Crosshairs lines
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sc.x - sc.radius - 8, sc.y); ctx.lineTo(sc.x - sc.radius + 6, sc.y);
        ctx.moveTo(sc.x + sc.radius - 6, sc.y); ctx.lineTo(sc.x + sc.radius + 8, sc.y);
        ctx.moveTo(sc.x, sc.y - sc.radius - 8); ctx.lineTo(sc.x, sc.y - sc.radius + 6);
        ctx.moveTo(sc.x, sc.y + sc.radius - 6); ctx.lineTo(sc.x, sc.y + sc.radius + 8);
        ctx.stroke();

        // Draw HUD overlay in scanner
        if (sc.target) {
            ctx.fillStyle = sc.target.type === 'alien' ? '#39ff14' : '#ff3333';
            ctx.font = '10px monospace';
            ctx.fillText(sc.target.type === 'alien' ? "MUTACIÓN DETECTADA" : "PECES COMUNES", sc.x - 45, sc.y - sc.radius - 14);
            ctx.font = 'bold 12px monospace';
            ctx.fillText(sc.target.name.toUpperCase(), sc.x - 45, sc.y - sc.radius - 4);

            // Circular progress bar
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(sc.x, sc.y, sc.radius - 4, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * (sc.progress/100)));
            ctx.stroke();
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = '10px monospace';
            ctx.fillText("BUSCANDO...", sc.x - 30, sc.y - sc.radius - 10);
        }
        ctx.restore();

        // Draw general HUD info
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 800, 45);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 45); ctx.lineTo(800, 45); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🎯 Clasificados: ${this.score} / ${this.goal}`, 25, 28);
        
        ctx.textAlign = 'right';
        ctx.fillStyle = gd.timeLeft < 15 ? '#ff3333' : '#ffd700';
        ctx.fillText(`⏱️ Tiempo Restante: ${Math.max(0, Math.ceil(gd.timeLeft))}s`, 775, 28);
        ctx.textAlign = 'left';

        // Draw list of scanned aliens on the side
        if (gd.scannedList.length > 0) {
            ctx.fillStyle = 'rgba(10, 25, 20, 0.6)';
            ctx.fillRect(25, 70, 180, 25 + gd.scannedList.length * 20);
            ctx.strokeStyle = '#39ff14';
            ctx.strokeRect(25, 70, 180, 25 + gd.scannedList.length * 20);
            
            ctx.fillStyle = '#39ff14';
            ctx.font = 'bold 11px monospace';
            ctx.fillText("CRÍPTIDOS CATALOGADOS:", 35, 88);
            ctx.fillStyle = '#ffffff';
            ctx.font = '11px monospace';
            gd.scannedList.forEach((name, i) => {
                ctx.fillText(`✔️ ${name}`, 38, 108 + i * 20);
            });
        }
    },

    inputBestiaryPress(x, y) {
        // Warp scanner immediately on press
        const gd = this.gameData;
        if (gd) {
            gd.scanner.x = x;
            gd.scanner.y = y;
        }
    },

    // ==========================================================
    // 11. GARRA GACHAPON LEGENDARIA (day_4_gachapon)
    // ==========================================================
    setupGachapon() {
        this.gameData = {
            timeLeft: 60,
            lives: 3,
            claw: {
                x: 400,
                y: 80,
                state: 'scan', // 'scan', 'extend', 'retract', 'carry', 'deposit'
                vx: 240, // scan speed
                length: 0,
                maxExtend: 410,
                grab: null,
                targetX: 400
            },
            capsules: [],
            obstacles: [
                { x: 280, y: 260, radius: 45, angle: 0, rotSpeed: 2.2 },
                { x: 520, y: 310, radius: 50, angle: 0, rotSpeed: -1.8 }
            ],
            chute: { x: 45, y: 480, w: 110, h: 120 },
            toysCollected: [],
            toyAnnounce: "",
            toyAnnounceTimer: 0
        };

        // Spawn Gachapon capsules at the bottom
        const capColors = [
            ['#f44336', '#ffffff'], // Poke-style
            ['#ffd700', '#ff8f00'], // Golden
            ['#9c27b0', '#e91e63'], // Legend purple/pink
            ['#00bcd4', '#ffffff'], // Cyan/white
            ['#4caf50', '#ffffff'], // Green/white
            ['#ff5722', '#3f51b5'], // Fire/water
            ['#ffeb3b', '#ffffff']  // Yellow/white
        ];
        
        const toyPool = ["Laura Chibi Dorada 🦊", "Gato de la Suerte 🐱", "Mini Castillo Osaka 🏯", "Dotonbori Takoyaki Toy 🧆", "Ciervo Sagrado Nara 🦌", "Shogun Ninja de Juguete 🥷", "Moneda de 500 Yenes Cohete 🪙"];
        
        for (let i = 0; i < 7; i++) {
            this.gameData.capsules.push({
                id: i,
                x: 220 + i * 75,
                y: 510 + (i % 2) * 15,
                radius: 26,
                colors: capColors[i % capColors.length],
                toy: toyPool[i % toyPool.length],
                vx: 0,
                vy: 0,
                angle: Math.random() * Math.PI,
                ground: 510 + (i % 2) * 15
            });
        }
    },

    updateGachapon(dt) {
        const gd = this.gameData;
        if (!gd) return;

        gd.timeLeft -= dt;
        if (gd.timeLeft <= 0 || gd.lives <= 0) {
            this.gameOver();
            return;
        }

        if (gd.toyAnnounceTimer > 0) {
            gd.toyAnnounceTimer -= dt;
        }

        // Animate obstacle gears
        for (let obs of gd.obstacles) {
            obs.angle += obs.rotSpeed * dt;
        }

        // Claw FSM
        const cl = gd.claw;
        if (cl.state === 'scan') {
            cl.x += cl.vx * dt;
            // Bounce scan horizontal limits
            if (cl.x < 200) { cl.x = 200; cl.vx = -cl.vx; }
            if (cl.x > 720) { cl.x = 720; cl.vx = -cl.vx; }
        }
        else if (cl.state === 'extend') {
            cl.length += 320 * dt; // extend speed
            
            // Check collisions with gears
            let tipX = cl.x;
            let tipY = cl.y + cl.length;
            
            for (let obs of gd.obstacles) {
                let dist = Math.hypot(tipX - obs.x, tipY - obs.y);
                if (dist < obs.radius + 8) {
                    // Hits obstacle gear!
                    if (window.playProceduralSound) window.playProceduralSound('damage');
                    this.triggerShake(15);
                    gd.lives--;
                    cl.state = 'retract';
                    this.createExplosion(tipX, tipY, '#ff3333', 15, 1.2);
                    break;
                }
            }

            // Check collision with capsules
            if (cl.state === 'extend') {
                for (let cap of gd.capsules) {
                    if (cap.collected) continue;
                    let dist = Math.hypot(tipX - cap.x, tipY - cap.y);
                    if (dist < cap.radius + 12) {
                        // Grab capsule
                        cl.grab = cap;
                        cl.state = 'retract';
                        if (window.playProceduralSound) window.playProceduralSound('collect');
                        this.createExplosion(tipX, tipY, '#ffd700', 10, 0.8);
                        break;
                    }
                }
            }

            // Max extension reached
            if (cl.length >= cl.maxExtend) {
                cl.state = 'retract';
            }
        }
        else if (cl.state === 'retract') {
            cl.length -= 240 * dt;
            if (cl.grab) {
                cl.grab.x = cl.x;
                cl.grab.y = cl.y + cl.length;
            }
            if (cl.length <= 0) {
                cl.length = 0;
                if (cl.grab) {
                    cl.state = 'carry';
                } else {
                    cl.state = 'scan';
                }
            }
        }
        else if (cl.state === 'carry') {
            // Carry capsule to exit chute at x=100
            cl.x -= 200 * dt;
            if (cl.grab) {
                cl.grab.x = cl.x;
                cl.grab.y = cl.y;
            }
            if (cl.x <= 100) {
                cl.x = 100;
                cl.state = 'deposit';
            }
        }
        else if (cl.state === 'deposit') {
            // Drop grab
            if (cl.grab) {
                const dropped = cl.grab;
                cl.grab = null;
                dropped.vy = 80; // gravity speed drop
                // Keep falling loop
                dropped.isFalling = true;
            }
            // Return claw to center
            cl.x += 200 * dt;
            if (cl.x >= 400) {
                cl.x = 400;
                cl.state = 'scan';
            }
        }

        // Update falling dropped capsules physics
        for (let cap of gd.capsules) {
            if (cap.isFalling) {
                cap.vy += 450 * dt; // Gravity
                cap.y += cap.vy * dt;
                
                // Check prize chute
                if (cap.y > 480) {
                    cap.isFalling = false;
                    cap.vy = 0;
                    
                    if (cap.x >= gd.chute.x && cap.x <= gd.chute.x + gd.chute.w) {
                        // Success exit
                        cap.collected = true;
                        gd.toysCollected.push(cap.toy);
                        gd.toyAnnounce = `🎉 ¡OBTENIDO: ${cap.toy}! 🎉`;
                        gd.toyAnnounceTimer = 2.5;
                        
                        this.score++;
                        document.getElementById('minigame-score').innerText = `Juguetes: ${this.score}/3`;
                        
                        if (window.playProceduralSound) window.playProceduralSound('success');
                        if (window.launchConfetti) window.launchConfetti();
                        this.createExplosion(cap.x, cap.y, '#00ff99', 30, 2.0);
                        
                        if (this.score >= this.goal) {
                            this.win();
                            return;
                        }
                    } else {
                        // Missed chute, falls to bottom floor, bounce back to pile
                        if (window.playProceduralSound) window.playProceduralSound('error');
                        cap.x = 220 + Math.random() * 450;
                        cap.y = cap.ground;
                    }
                }
            }
        }
    },

    drawGachapon() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Draw arcade chassis
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 800, 600);
        
        // Glass container background
        let glassBg = ctx.createLinearGradient(0, 80, 0, 480);
        glassBg.addColorStop(0, '#021526');
        glassBg.addColorStop(1, '#032541');
        ctx.fillStyle = glassBg;
        ctx.fillRect(150, 80, 600, 400);

        // Grid lines in glass
        ctx.strokeStyle = 'rgba(2, 136, 209, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 150; x < 750; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 80); ctx.lineTo(x, 480); ctx.stroke();
        }
        for (let y = 80; y < 480; y += 50) {
            ctx.beginPath(); ctx.moveTo(150, y); ctx.lineTo(750, y); ctx.stroke();
        }

        // Draw exit chute on bottom-left
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(gd.chute.x, gd.chute.y, gd.chute.w, gd.chute.h);
        ctx.strokeStyle = '#0288d1';
        ctx.lineWidth = 4;
        ctx.strokeRect(gd.chute.x, gd.chute.y, gd.chute.w, gd.chute.h);

        // Arrow indicator pointing to chute
        ctx.fillStyle = this.gameTime % 1.0 > 0.5 ? '#00e676' : '#0288d1';
        ctx.font = 'bold 20px monospace';
        ctx.fillText("⬇️ EXTRAC", 48, 530);

        // Draw obstacles (gears)
        for (let obs of gd.obstacles) {
            ctx.save();
            ctx.translate(obs.x, obs.y);
            ctx.rotate(obs.angle);
            
            // Draw gear outer spikes
            ctx.fillStyle = '#64748b';
            for (let i = 0; i < 8; i++) {
                ctx.rotate(Math.PI / 4);
                ctx.fillRect(-10, -obs.radius - 8, 20, 16);
            }
            
            // Draw gear body
            ctx.beginPath();
            ctx.arc(0, 0, obs.radius, 0, Math.PI*2);
            ctx.fillStyle = '#475569';
            ctx.fill();
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Core
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI*2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            
            ctx.restore();
        }

        // Draw capsules
        for (let cap of gd.capsules) {
            if (cap.collected) continue;
            ctx.save();
            ctx.translate(cap.x, cap.y);
            ctx.rotate(cap.angle);

            // Shadow/Glow
            ctx.shadowBlur = 8;
            ctx.shadowColor = cap.colors[0];

            // Top half
            ctx.fillStyle = cap.colors[0];
            ctx.beginPath();
            ctx.arc(0, 0, cap.radius, Math.PI, 0);
            ctx.fill();

            // Bottom half
            ctx.fillStyle = cap.colors[1];
            ctx.beginPath();
            ctx.arc(0, 0, cap.radius, 0, Math.PI);
            ctx.fill();

            // Divider seam line
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-cap.radius, 0);
            ctx.lineTo(cap.radius, 0);
            ctx.stroke();

            // Glare shine highlight
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(-8, -8, 6, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();
        }

        // Draw Claw Crane Mechanism
        const cl = gd.claw;
        ctx.save();
        
        // Steel cable
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cl.x, cl.y);
        ctx.lineTo(cl.x, cl.y + cl.length);
        ctx.stroke();

        // Top carriage
        ctx.fillStyle = '#0288d1';
        ctx.fillRect(cl.x - 30, cl.y - 12, 60, 24);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(cl.x - 30, cl.y - 12, 60, 24);

        // Claw tip node
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(cl.x, cl.y + cl.length, 12, 0, Math.PI*2);
        ctx.fill();

        // 3 metal claws spreading or closing
        let openAngle = cl.state === 'extend' ? 0.6 : (cl.grab ? 0.2 : 0.4);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        
        for (let i = -1; i <= 1; i++) {
            if (i === 0) continue;
            ctx.save();
            ctx.translate(cl.x, cl.y + cl.length);
            ctx.rotate(i * openAngle);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(i * 18, 16, i * 14, 38);
            ctx.stroke();
            
            ctx.restore();
        }
        
        ctx.restore();

        // Glass reflection sheen
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.beginPath();
        ctx.moveTo(150, 80);
        ctx.lineTo(380, 80);
        ctx.lineTo(150, 480);
        ctx.fill();

        // Frame borders
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 15;
        ctx.strokeRect(150, 80, 600, 400);
        ctx.strokeStyle = '#0288d1';
        ctx.lineWidth = 6;
        ctx.strokeRect(150, 80, 600, 400);

        // Header Panel HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 800, 48);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🔮 Capturados: ${this.score} / ${this.goal}`, 25, 29);

        // Lives indicators (Hearts)
        let hearts = "";
        for(let l=0; l<gd.lives; l++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 240, 29);

        ctx.textAlign = 'right';
        ctx.fillStyle = gd.timeLeft < 15 ? '#ff3333' : '#ffd700';
        ctx.fillText(`⏱️ Tiempo: ${Math.max(0, Math.ceil(gd.timeLeft))}s`, 775, 29);
        ctx.textAlign = 'left';

        // Prize collection text/display
        if (gd.toyAnnounceTimer > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.fillRect(0, 220, 800, 100);
            ctx.strokeStyle = '#00ff99';
            ctx.lineWidth = 3;
            ctx.strokeRect(0, 220, 800, 100);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.toyAnnounce, 400, 276);
            ctx.textAlign = 'left';
        }

        // Display Case of toys on bottom control panel
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(200, 500, 550, 75);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(200, 500, 550, 75);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText("ESTANTERÍA DE PREMIOS:", 215, 520);
        
        ctx.font = '12px Quicksand, sans-serif';
        ctx.fillStyle = '#ffffff';
        if (gd.toysCollected.length === 0) {
            ctx.fillStyle = '#475569';
            ctx.fillText("Estantería vacía... ¡Captura cápsulas para rellenarla!", 220, 548);
        } else {
            gd.toysCollected.forEach((toy, idx) => {
                ctx.fillText(`🏆 ${toy}`, 220 + idx * 170, 550);
            });
        }
    },

    inputGachaponPress(x, y) {
        const gd = this.gameData;
        if (gd && gd.claw.state === 'scan') {
            gd.claw.state = 'extend';
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
    },

    // ==========================================================
    // 12. CONEXIÓN DE REFRESCOS KAWAII (day_4_vending_roulette)
    // ==========================================================
    setupVending() {
        this.gameData = {
            timeLeft: 60,
            gridCols: 7,
            gridRows: 6,
            cellSize: 65,
            gridOffsetX: 180,
            gridOffsetY: 120,
            selected: [], // stores {r, c} objects
            grid: [],
            bubbles: [],
            isDragging: false
        };

        const gd = this.gameData;
        
        // Spawn bubbles in background
        for (let i = 0; i < 15; i++) {
            gd.bubbles.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                radius: 2 + Math.random() * 4,
                vy: 30 + Math.random() * 40
            });
        }

        // Fill grid with random types 0 to 4
        // 0: Matcha 🍵, 1: Naranja 🍊, 2: Uva 🍇, 3: Fresa 🍓, 4: Calpis/Leche 🥛
        for (let r = 0; r < gd.gridRows; r++) {
            gd.grid[r] = [];
            for (let c = 0; c < gd.gridCols; c++) {
                gd.grid[r][c] = Math.floor(Math.random() * 5);
            }
        }
    },

    updateVending(dt) {
        const gd = this.gameData;
        if (!gd) return;

        gd.timeLeft -= dt;
        if (gd.timeLeft <= 0) {
            this.gameOver();
            return;
        }

        // Bubbles rise
        for (let b of gd.bubbles) {
            b.y -= b.vy * dt;
            if (b.y < -10) {
                b.y = 610;
                b.x = Math.random() * 800;
            }
        }

        // Gravity check for grid (let tiles fall to fill null cells)
        let gridChanged = false;
        for (let c = 0; c < gd.gridCols; c++) {
            // Read column bottom-to-top
            for (let r = gd.gridRows - 1; r >= 0; r--) {
                if (gd.grid[r][c] === null) {
                    // Pull from above
                    let found = false;
                    for (let tr = r - 1; tr >= 0; tr--) {
                        if (gd.grid[tr][c] !== null) {
                            gd.grid[r][c] = gd.grid[tr][c];
                            gd.grid[tr][c] = null;
                            found = true;
                            gridChanged = true;
                            break;
                        }
                    }
                    // If no block found above, spawn a new random tile at the top
                    if (!found) {
                        gd.grid[r][c] = Math.floor(Math.random() * 5);
                        gridChanged = true;
                    }
                }
            }
        }

        // If mouse is down, check dragging selection
        if (this.mouse.isDown && gd.gridOffsetY) {
            // Find grid cell coordinates
            const col = Math.floor((this.mouse.x - gd.gridOffsetX) / gd.cellSize);
            const row = Math.floor((this.mouse.y - gd.gridOffsetY) / gd.cellSize);

            if (col >= 0 && col < gd.gridCols && row >= 0 && row < gd.gridRows) {
                const cellVal = gd.grid[row][col];
                if (cellVal !== null) {
                    if (gd.selected.length === 0) {
                        gd.selected.push({ r: row, c: col, val: cellVal });
                        if (window.playProceduralSound) window.playProceduralSound('click');
                    } else {
                        const last = gd.selected[gd.selected.length - 1];
                        const typeMatch = (cellVal === last.val);
                        const isAdjacent = Math.abs(row - last.r) <= 1 && Math.abs(col - last.c) <= 1;
                        
                        // Prevent connecting the exact same cell twice consecutively
                        const alreadyInListIdx = gd.selected.findIndex(item => item.r === row && item.c === col);
                        
                        if (typeMatch && isAdjacent) {
                            if (alreadyInListIdx === -1) {
                                // Add to connection list
                                gd.selected.push({ r: row, c: col, val: cellVal });
                                if (window.playProceduralSound) window.playProceduralSound('click');
                            } else if (alreadyInListIdx === gd.selected.length - 2) {
                                // Dragged back to previous cell: pop/undo last cell
                                gd.selected.pop();
                                if (window.playProceduralSound) window.playProceduralSound('click');
                            }
                        }
                    }
                }
            }
        }
    },

    drawVending() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Vending Machine interior background
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, 800, 600);

        // Draw bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let b of gd.bubbles) {
            ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2); ctx.fill();
        }

        // Draw Vending Frame bezel
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(100, 60, 600, 520);
        ctx.fillStyle = '#0f172a'; // black screen behind grid
        ctx.fillRect(150, 100, 500, 420);
        
        ctx.strokeStyle = '#e65100';
        ctx.lineWidth = 12;
        ctx.strokeRect(100, 60, 600, 520);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(150, 100, 500, 420);

        // Draw grid items (Sodas)
        const emojiMap = ["🍵", "🍊", "🍇", "🍓", "🥛"];
        const colorMap = ["#2e7d32", "#ef6c00", "#6a1b9a", "#ad1457", "#00838f"];
        const labelMap = ["Matcha", "Orange", "Grape", "Berry", "Soda"];

        for (let r = 0; r < gd.gridRows; r++) {
            for (let c = 0; c < gd.gridCols; c++) {
                const val = gd.grid[r][c];
                if (val === null) continue;

                let cellX = gd.gridOffsetX + c * gd.cellSize;
                let cellY = gd.gridOffsetY + r * gd.cellSize;

                // Check if selected
                const isSel = gd.selected.some(item => item.r === r && item.c === c);

                // Draw can body
                ctx.save();
                ctx.translate(cellX + gd.cellSize/2, cellY + gd.cellSize/2);
                if (isSel) {
                    ctx.scale(1.1, 1.1);
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = colorMap[val];
                }

                // Can outline
                ctx.fillStyle = colorMap[val];
                ctx.fillRect(-20, -26, 40, 52);
                
                // Can rim top/bottom
                ctx.fillStyle = '#b0bec5';
                ctx.fillRect(-20, -29, 40, 3);
                ctx.fillRect(-20, 26, 40, 3);
                
                // Emoji label
                ctx.fillStyle = '#ffffff';
                ctx.font = '22px Quicksand, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(emojiMap[val], 0, 8);

                // Text label
                ctx.font = 'bold 8px monospace';
                ctx.fillText(labelMap[val].toUpperCase(), 0, 20);

                ctx.restore();
            }
        }

        // Draw dragging connecting lines
        if (gd.selected.length > 0) {
            ctx.save();
            ctx.strokeStyle = colorMap[gd.selected[0].val];
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Neon glow line
            ctx.shadowBlur = 15;
            ctx.shadowColor = colorMap[gd.selected[0].val];

            ctx.beginPath();
            gd.selected.forEach((sel, idx) => {
                let x = gd.gridOffsetX + sel.c * gd.cellSize + gd.cellSize/2;
                let y = gd.gridOffsetY + sel.r * gd.cellSize + gd.cellSize/2;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.restore();
        }

        // Draw vending dispenser exit at the bottom
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(250, 530, 300, 40);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.strokeRect(250, 530, 300, 40);

        // Header Panel HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 800, 48);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🥤 Servidos: ${this.score} / ${this.goal}`, 25, 29);

        ctx.textAlign = 'right';
        ctx.fillStyle = gd.timeLeft < 15 ? '#ff3333' : '#ffd700';
        ctx.fillText(`⏱️ Tiempo: ${Math.max(0, Math.ceil(gd.timeLeft))}s`, 775, 29);
        ctx.textAlign = 'left';
    },

    inputVendingPress(x, y) {
        // Drag starts automatically on mousedown. Handled in update loop.
    },

    releaseVending(x, y) {
        const gd = this.gameData;
        if (!gd) return;

        if (gd.selected.length >= 3) {
            // Match success! Clear items
            for (let sel of gd.selected) {
                gd.grid[sel.r][sel.c] = null;
                
                // Explode particles
                let cellX = gd.gridOffsetX + sel.c * gd.cellSize + gd.cellSize/2;
                let cellY = gd.gridOffsetY + sel.r * gd.cellSize + gd.cellSize/2;
                const colors = ["#4caf50", "#ff9800", "#9c27b0", "#e91e63", "#00bcd4"];
                this.createExplosion(cellX, cellY, colors[sel.val], 8, 0.7);
            }

            this.score += gd.selected.length;
            document.getElementById('minigame-score').innerText = `Servidos: ${this.score}/${this.goal}`;
            
            if (window.playProceduralSound) window.playProceduralSound('collect');
            this.triggerShake(6);

            if (this.score >= this.goal) {
                if (window.launchConfetti) window.launchConfetti();
                this.win();
            }
        }
        
        // Clear selection
        gd.selected = [];
    },

    // ==========================================================
    // 13. CARRERA DEL CANGREJO DE DOTONBORI (day_4_crab)
    // ==========================================================
    setupCrab() {
        this.gameData = {
            player: {
                x: 120,
                y: 450,
                vy: 0,
                w: 64,
                h: 45,
                jumping: false,
                jumps: 0,
                health: 3,
                invuln: 0,
                animFrame: 0
            },
            obstacles: [],
            coins: [],
            bgOffset: 0,
            canalOffset: 0,
            spawnTimer: 0
        };
        
        this.score = 0; // Metros recorridos
    },

    updateCrab(dt) {
        const gd = this.gameData;
        if (!gd) return;

        const p = gd.player;

        // Metros increase based on time
        this.score += dt * 11;
        document.getElementById('minigame-score').innerText = `Distancia: ${Math.floor(this.score)}m`;

        if (this.score >= this.goal) {
            this.win();
            return;
        }

        // Invulnerabilidad tick
        if (p.invuln > 0) p.invuln -= dt;

        // Player physics
        p.vy += 0.85; // Gravity
        p.y += p.vy;

        if (p.y > 450) {
            p.y = 450;
            p.vy = 0;
            p.jumping = false;
            p.jumps = 0;
        }

        // Frame animations legs
        p.animFrame += dt * 12;

        // Scrolling backgrounds
        gd.bgOffset = (gd.bgOffset - dt * 25) % 800;
        gd.canalOffset = (gd.canalOffset - dt * 90) % 800;

        // Obstacles & coins spawn logic
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.3 + Math.random() * 1.5;
            
            if (Math.random() > 0.35) {
                // Spawn takoyaki obstacle
                gd.obstacles.push({
                    x: 850,
                    y: 465,
                    radius: 20,
                    speed: 250 + Math.random() * 150,
                    angle: 0
                });
            } else {
                // Spawn float coin
                gd.coins.push({
                    x: 850,
                    y: 280 + Math.random() * 130,
                    w: 24,
                    h: 24,
                    collected: false
                });
            }
        }

        // Update obstacles
        for (let i = gd.obstacles.length - 1; i >= 0; i--) {
            let obs = gd.obstacles[i];
            obs.x -= obs.speed * dt;
            obs.angle -= dt * (obs.speed / 15); // Rotate roll

            // Check collision box-to-circle
            let dist = Math.hypot(obs.x - (p.x + p.w/2), obs.y - (p.y + p.h/2));
            if (dist < obs.radius + 20) {
                // Hit!
                if (p.invuln <= 0) {
                    p.health--;
                    p.invuln = 1.5; // Flashing
                    if (window.playProceduralSound) window.playProceduralSound('damage');
                    this.triggerShake(12);
                    this.createExplosion(obs.x, obs.y, '#ff3333', 15, 1.2);
                    
                    if (p.health <= 0) {
                        this.gameOver();
                        return;
                    }
                }
            }
            if (obs.x < -50) gd.obstacles.splice(i, 1);
        }

        // Update coins
        for (let i = gd.coins.length - 1; i >= 0; i--) {
            let cn = gd.coins[i];
            cn.x -= 200 * dt;

            // Check collect
            if (!cn.collected && p.x + p.w > cn.x && p.x < cn.x + cn.w && p.y + p.h > cn.y && p.y < cn.y + cn.h) {
                cn.collected = true;
                this.score += 25; // Boost meters
                if (window.playProceduralSound) window.playProceduralSound('collect');
                this.createExplosion(cn.x + 12, cn.y + 12, '#ffd700', 12, 1.0);
            }
            if (cn.x < -50 || cn.collected) gd.coins.splice(i, 1);
        }
    },

    drawCrab() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Sky gradient
        let sky = ctx.createLinearGradient(0, 0, 0, 400);
        sky.addColorStop(0, '#020208');
        sky.addColorStop(1, '#0e0b29');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 800, 600);

        // Parallax buildings and Glico Man neon sign
        ctx.fillStyle = '#08061a';
        ctx.fillRect(0, 200, 800, 250);
        
        ctx.fillStyle = '#130e2e';
        // Draw some building rects based on scroll
        for (let i = 0; i < 4; i++) {
            let bx = (gd.bgOffset + i * 280) % 1120 - 100;
            ctx.fillRect(bx, 150, 140, 300);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
            // Windows
            ctx.fillRect(bx + 20, 180, 20, 30);
            ctx.fillRect(bx + 80, 180, 20, 30);
            ctx.fillRect(bx + 20, 260, 20, 30);
            ctx.fillRect(bx + 80, 260, 20, 30);
            ctx.fillStyle = '#130e2e';
        }

        // Draw Glico Man style neon silhouette in center of backdrop
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffcc';
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Runner body outline (chibi representation)
        ctx.arc(400, 230, 20, 0, Math.PI*2); // head
        ctx.moveTo(400, 250); ctx.lineTo(400, 300); // spine
        ctx.moveTo(400, 260); ctx.lineTo(370, 220); // left hand V
        ctx.moveTo(400, 260); ctx.lineTo(430, 220); // right hand V
        ctx.moveTo(400, 300); ctx.lineTo(380, 340); // left leg
        ctx.moveTo(400, 300); ctx.lineTo(420, 340); // right leg
        ctx.stroke();
        ctx.restore();

        // Giant Kani Doraku Crab hanging sign silhouette (outline)
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff3333';
        ctx.strokeStyle = '#ff3333';
        ctx.lineWidth = 4;
        ctx.beginPath();
        let kx = 600, ky = 180;
        ctx.arc(kx, ky, 35, 0, Math.PI*2); // Body
        ctx.moveTo(kx - 35, ky); ctx.quadraticCurveTo(kx - 65, ky - 30, kx - 55, ky - 50); // Left claw
        ctx.moveTo(kx + 35, ky); ctx.quadraticCurveTo(kx + 65, ky - 30, kx + 55, ky - 50); // Right claw
        // Legs
        ctx.moveTo(kx - 25, ky + 25); ctx.lineTo(kx - 45, ky + 45);
        ctx.moveTo(kx - 10, ky + 33); ctx.lineTo(kx - 25, ky + 55);
        ctx.moveTo(kx + 25, ky + 25); ctx.lineTo(kx + 45, ky + 45);
        ctx.moveTo(kx + 10, ky + 33); ctx.lineTo(kx + 25, ky + 55);
        ctx.stroke();
        ctx.restore();

        // Dotonbori Canal Water at bottom
        ctx.fillStyle = '#022329';
        ctx.fillRect(0, 495, 800, 105);
        
        // Neon reflections in canal water
        ctx.fillStyle = 'rgba(255,51,51,0.15)';
        ctx.fillRect(520, 495, 160, 105);
        ctx.fillStyle = 'rgba(0,255,200,0.12)';
        ctx.fillRect(320, 495, 160, 105);

        // Ground Platform/Bridge path
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, 480, 800, 20);
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 490, 800, 5);

        // Coins
        for (let cn of gd.coins) {
            ctx.save();
            ctx.translate(cn.x + 12, cn.y + 12);
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffd700';
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(0, 0, 11, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#ff8f00';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText("¥", 0, 3);
            ctx.restore();
        }

        // Obstacles (Takoyakis)
        for (let obs of gd.obstacles) {
            ctx.save();
            ctx.translate(obs.x, obs.y);
            ctx.rotate(obs.angle);
            
            // Ball body
            ctx.fillStyle = '#a0522d';
            ctx.beginPath(); ctx.arc(0, 0, obs.radius, 0, Math.PI*2); ctx.fill();

            // Sauce stripes
            ctx.strokeStyle = '#4e2409';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-12, -12); ctx.lineTo(12, 12);
            ctx.moveTo(-6, -15); ctx.lineTo(15, 6);
            ctx.stroke();

            // Seaweed/Sparks flakes
            ctx.fillStyle = '#2e7d32';
            ctx.fillRect(-8, 5, 4, 4);
            ctx.fillRect(6, -10, 5, 3);

            ctx.restore();
        }

        // Draw Player Crab
        const p = gd.player;
        ctx.save();
        ctx.translate(p.x, p.y);

        // Invulnerable flashing
        if (p.invuln > 0 && Math.floor(this.gameTime * 15) % 2 === 0) {
            ctx.globalAlpha = 0.35;
        }

        // Leg walk animation offsets
        let walkOffset1 = Math.sin(p.animFrame) * 4;
        let walkOffset2 = Math.cos(p.animFrame) * 4;

        // Legs
        ctx.strokeStyle = '#d32f2f';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        // Left legs
        ctx.moveTo(10, 35); ctx.lineTo(4 + walkOffset1, 44);
        ctx.moveTo(18, 35); ctx.lineTo(14 + walkOffset2, 44);
        // Right legs
        ctx.moveTo(46, 35); ctx.lineTo(42 + walkOffset2, 44);
        ctx.moveTo(54, 35); ctx.lineTo(50 + walkOffset1, 44);
        ctx.stroke();

        // Main Shell body
        ctx.fillStyle = '#f44336';
        ctx.beginPath();
        ctx.ellipse(32, 24, 26, 16, 0, 0, Math.PI*2);
        ctx.fill();

        // Eye stalks
        ctx.strokeStyle = '#f44336';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, 12); ctx.lineTo(20, 4);
        ctx.moveTo(44, 12); ctx.lineTo(44, 4);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(20, 3, 5, 0, Math.PI*2); ctx.arc(44, 3, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(20, 3, 2, 0, Math.PI*2); ctx.arc(44, 3, 2, 0, Math.PI*2); ctx.fill();

        // Pincers / Claws (opening/closing)
        let clawOpen = Math.sin(p.animFrame * 0.8) * 8;
        ctx.save();
        ctx.translate(6, 16);
        ctx.rotate(-0.3);
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(-10, -8, 14, 12); // joint
        ctx.beginPath();
        ctx.arc(-8, -6 - clawOpen/3, 8, 0, Math.PI*2); // top claw
        ctx.arc(-8, 2 + clawOpen/3, 8, 0, Math.PI*2); // bottom claw
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(58, 16);
        ctx.rotate(0.3);
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(-4, -8, 14, 12);
        ctx.beginPath();
        ctx.arc(8, -6 - clawOpen/3, 8, 0, Math.PI*2);
        ctx.arc(8, 2 + clawOpen/3, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        ctx.restore();

        // Header Panel HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 800, 48);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🦀 Distancia: ${Math.floor(this.score)}m / ${this.goal}m`, 25, 29);

        // Hearts
        let heartsHtml = "";
        for(let l=0; l<p.health; l++) heartsHtml += "❤️ ";
        ctx.fillText(`Vidas: ${heartsHtml}`, 350, 29);
    },

    inputCrabPress(x, y) {
        const gd = this.gameData;
        if (gd) {
            const p = gd.player;
            if (p.jumps < 2) {
                p.vy = -16.5; // Jump strength
                p.jumps++;
                p.jumping = true;
                if (window.playProceduralSound) window.playProceduralSound('click');
            }
        }
    },

    // ==========================================================
    // 14. MAESTRO DEL YAKINIKU (day_4_yakiniku)
    // ==========================================================
    setupYakiniku() {
        this.gameData = {
            lives: 3,
            slots: [
                { id: 0, x: 260, y: 200, active: false, meat: null },
                { id: 1, x: 540, y: 200, active: false, meat: null },
                { id: 2, x: 260, y: 400, active: false, meat: null },
                { id: 3, x: 540, y: 400, active: false, meat: null }
            ],
            spawnTimer: 1.0,
            smokeParticles: [],
            feedbackText: "",
            feedbackTextTimer: 0,
            feedbackColor: "#00ff99"
        };
        this.score = 0; // Perfect cooked meats served
    },

    updateYakiniku(dt) {
        const gd = this.gameData;
        if (!gd) return;

        if (gd.lives <= 0) {
            this.gameOver();
            return;
        }

        if (gd.feedbackTextTimer > 0) {
            gd.feedbackTextTimer -= dt;
        }

        // Spawn smoke particles
        gd.slots.forEach(slot => {
            if (slot.active && slot.meat) {
                const mt = slot.meat;
                if (Math.random() < 0.15) {
                    gd.smokeParticles.push({
                        x: slot.x + (Math.random() - 0.5) * 40,
                        y: slot.y + (Math.random() - 0.5) * 20,
                        vy: 40 + Math.random() * 60,
                        size: 6 + Math.random() * 12,
                        opacity: 0.7,
                        color: mt.burnProgress > 0 ? '#4a4a4a' : '#e2e8f0' // Darker smoke if burning
                    });
                }
            }
        });

        // Update smoke particles
        for (let i = gd.smokeParticles.length - 1; i >= 0; i--) {
            let sp = gd.smokeParticles[i];
            sp.y -= sp.vy * dt;
            sp.opacity -= dt * 0.9;
            sp.size += dt * 8;
            if (sp.opacity <= 0) gd.smokeParticles.splice(i, 1);
        }

        // Spawn raw meat in empty slots
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 2.0 + Math.random() * 1.5;
            
            // Find empty slots
            const emptySlots = gd.slots.filter(s => !s.active);
            if (emptySlots.length > 0) {
                const choice = emptySlots[Math.floor(Math.random() * emptySlots.length)];
                choice.active = true;
                
                const types = ['beef', 'shiitake', 'onion'];
                choice.meat = {
                    type: types[Math.floor(Math.random() * types.length)],
                    side: 1, // cooking side 1 or 2
                    cookProgress: 0,
                    burnProgress: 0,
                    side1Done: false,
                    side2Done: false,
                    flipProgress: 1.0 // for animation scaling
                };
            }
        }

        // Update active cooking meats
        gd.slots.forEach(slot => {
            if (slot.active && slot.meat) {
                const mt = slot.meat;
                
                // Flip animation scaling
                if (mt.flipProgress < 1.0) {
                    mt.flipProgress = Math.min(1.0, mt.flipProgress + dt * 5);
                }

                // Cook progress increase
                mt.cookProgress += dt * 26; // ~3.5 seconds to grill perfectly
                
                if (mt.cookProgress > 100) {
                    mt.burnProgress += dt * 32; // ~3 seconds to burn completely
                }
            }
        });
    },

    drawYakiniku() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Wooden table background texture
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.strokeStyle = '#2d1b18';
        ctx.lineWidth = 4;
        for (let y = 50; y < 600; y += 80) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
        }

        // Circular Charcoal Grill Bezel
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#000000';
        ctx.fillStyle = '#212121';
        ctx.beginPath(); ctx.arc(400, 300, 260, 0, Math.PI*2); ctx.fill();

        // Hot Coals glow inside
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff3c00';
        ctx.fillStyle = '#d50000';
        ctx.beginPath(); ctx.arc(400, 300, 220, 0, Math.PI*2); ctx.fill();

        // Draw grill grid wire mesh lines
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = 3;
        for (let x = 190; x < 610; x += 22) {
            let dist = Math.abs(x - 400);
            let chord = Math.sqrt(240*240 - dist*dist);
            ctx.beginPath();
            ctx.moveTo(x, 300 - chord);
            ctx.lineTo(x, 300 + chord);
            ctx.stroke();
        }
        for (let y = 90; y < 510; y += 22) {
            let dist = Math.abs(y - 300);
            let chord = Math.sqrt(240*240 - dist*dist);
            ctx.beginPath();
            ctx.moveTo(300 - chord, y);
            ctx.lineTo(300 + chord, y);
            ctx.stroke();
        }

        // Draw smoke particles
        ctx.save();
        for (let sp of gd.smokeParticles) {
            ctx.globalAlpha = sp.opacity;
            ctx.fillStyle = sp.color;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.restore();

        // Draw slots with meats
        gd.slots.forEach(slot => {
            if (!slot.active) {
                // Empty slot placement indicator
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(slot.x, slot.y, 40, 0, Math.PI*2);
                ctx.stroke();
                return;
            }

            const mt = slot.meat;
            ctx.save();
            ctx.translate(slot.x, slot.y);
            ctx.scale(mt.flipProgress, 1.0); // Flip scaling animation

            // Meat color mapping based on cook & burn values
            let color = '#ef5350'; // Raw pink
            if (mt.cookProgress > 0) {
                let factor = Math.min(1.0, mt.cookProgress / 100);
                // Mix from pink (#ef5350) to golden grill brown (#795548)
                color = this.lerpColor('#ef5350', '#795548', factor);
            }
            if (mt.burnProgress > 0) {
                let factor = Math.min(1.0, mt.burnProgress / 100);
                // Mix from brown to black carbon (#1a0d00 to #000000)
                color = this.lerpColor(color, '#121212', factor);
            }

            // Draw meat shapes
            if (mt.type === 'beef') {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(-45, -20);
                ctx.bezierCurveTo(-20, -32, 20, -25, 45, -15);
                ctx.bezierCurveTo(38, 25, -20, 35, -45, 10);
                ctx.closePath();
                ctx.fill();

                // Marbling lines / grill lines
                ctx.strokeStyle = mt.cookProgress > 60 ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.4)';
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.moveTo(-20, -18); ctx.lineTo(-10, 18);
                ctx.moveTo(0, -22); ctx.lineTo(10, 22);
                ctx.moveTo(20, -18); ctx.lineTo(30, 18);
                ctx.stroke();
            }
            else if (mt.type === 'shiitake') {
                ctx.fillStyle = mt.burnProgress > 20 ? '#1b1b1b' : (mt.cookProgress > 60 ? '#3e2723' : '#a1887f');
                ctx.beginPath();
                ctx.arc(0, 0, 32, 0, Math.PI*2);
                ctx.fill();
                
                // Mushroom top cross cuts
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(-15, 0); ctx.lineTo(15, 0);
                ctx.moveTo(0, -15); ctx.lineTo(0, 15);
                ctx.stroke();
            }
            else if (mt.type === 'onion') {
                // Onion ring
                ctx.strokeStyle = color;
                ctx.lineWidth = 14;
                ctx.beginPath();
                ctx.arc(0, 0, 28, 0, Math.PI*2);
                ctx.stroke();

                ctx.strokeStyle = '#ffeb3b';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 24, 0, Math.PI*2);
                ctx.stroke();
            }

            ctx.restore();

            // Progress Indicators circles on side
            ctx.save();
            ctx.translate(slot.x, slot.y);

            let statusColor = '#2196f3'; // blue: raw
            let text = `LADO ${mt.side}`;
            if (mt.cookProgress >= 60 && mt.cookProgress <= 100) {
                statusColor = '#00ff99'; // green: PERFECT
                text = "¡AL PUNTO!";
            } else if (mt.cookProgress > 100 && mt.burnProgress < 80) {
                statusColor = '#ff9800'; // orange: overcooked
                text = "CUIDADO";
            } else if (mt.burnProgress >= 80) {
                statusColor = '#ff3333'; // red: BURNT
                text = "QUEMADO";
            }

            // Draw indicator bar ring
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.lineWidth = 6;
            ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI*2); ctx.stroke();
            
            ctx.strokeStyle = statusColor;
            ctx.lineWidth = 4;
            let barProgress = mt.burnProgress > 0 ? (mt.burnProgress/100) : (mt.cookProgress/100);
            ctx.beginPath();
            ctx.arc(0, 0, 48, -Math.PI/2, (-Math.PI/2) + Math.PI*2 * Math.min(1.0, barProgress));
            ctx.stroke();

            // HUD text on slots
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(text, 0, 5);

            ctx.restore();
        });

        // Floating feedback text
        if (gd.feedbackTextTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 26px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 10;
            ctx.shadowColor = gd.feedbackColor;
            ctx.fillText(gd.feedbackText, 400, 90 + gd.feedbackTextTimer * 10);
            ctx.restore();
        }

        // Header Panel HUD
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 800, 48);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🥩 Platos Perfectos: ${this.score} / ${this.goal}`, 25, 29);

        // Hearts / Lives
        let heartsHtml = "";
        for(let l=0; l<gd.lives; l++) heartsHtml += "❤️ ";
        ctx.fillText(`Vidas: ${heartsHtml}`, 350, 29);
    },

    inputYakinikuPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;

        // Find which slot was clicked
        let clickedSlot = null;
        for (let s of gd.slots) {
            if (s.active) {
                let dist = Math.hypot(x - s.x, y - s.y);
                if (dist < 50) {
                    clickedSlot = s;
                    break;
                }
            }
        }

        if (clickedSlot) {
            const mt = clickedSlot.meat;
            if (mt.side === 1) {
                // Flip meat
                mt.side = 2;
                mt.side1Done = (mt.cookProgress >= 60 && mt.cookProgress <= 100 && mt.burnProgress < 80);
                mt.cookProgress = 0;
                mt.burnProgress = 0;
                mt.flipProgress = 0.1; // trigger flip scaling anim
                
                if (window.playProceduralSound) window.playProceduralSound('click');
            } else {
                // Serve meat!
                mt.side2Done = (mt.cookProgress >= 60 && mt.cookProgress <= 100 && mt.burnProgress < 80);
                
                if (mt.side1Done && mt.side2Done) {
                    // Perfect serving!
                    this.score++;
                    document.getElementById('minigame-score').innerText = `Platos Perfectos: ${this.score}/${this.goal}`;
                    gd.feedbackText = "✨ ¡PERFECTO! WAGYU EXCELENTE A5 😋 ✨";
                    gd.feedbackColor = "#00ff99";
                    gd.feedbackTextTimer = 2.0;

                    if (window.playProceduralSound) window.playProceduralSound('success');
                    if (window.launchConfetti) window.launchConfetti();
                    this.createExplosion(clickedSlot.x, clickedSlot.y, '#00ff99', 20, 1.4);

                    if (this.score >= this.goal) {
                        this.win();
                    }
                } else {
                    // Burned or raw serving!
                    gd.lives--;
                    let errType = (mt.burnProgress >= 80) ? "¡QUEMADO! 🔥" : "¡CRUDO! 🥶";
                    gd.feedbackText = `💥 ${errType} MAL SERVICIO 🤢 💥`;
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTextTimer = 2.0;
                    
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    this.triggerShake(12);
                    this.createExplosion(clickedSlot.x, clickedSlot.y, '#ff3333', 20, 1.4);
                }

                // Empty the slot
                clickedSlot.active = false;
                clickedSlot.meat = null;
            }
        }
    },

    // ==========================================================
    // 15. CORTE DE PRECISIÓN (day_4_knife)
    // ==========================================================
    setupKnife() {
        this.gameData = {
            lives: 3,
            chefKnife: { x: 250, y: 150, targetY: 150, state: 'idle' },
            ingredients: [],
            spawnTimer: 0.5,
            cutLineX: 250,
            feedbackText: "",
            feedbackTimer: 0,
            feedbackColor: "#ff5722",
            score: 0
        };
        this.score = 0;
    },

    updateKnife(dt) {
        const gd = this.gameData;
        if (!gd) return;

        if (gd.lives <= 0) {
            this.gameOver();
            return;
        }

        if (gd.feedbackTimer > 0) {
            gd.feedbackTimer -= dt;
        }

        // Spawn ingredients
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.0 + Math.random() * 1.3;
            const types = ['tuna', 'cucumber', 'shiitake', 'wasabi', 'stone', 'broken_blade'];
            const choice = types[Math.floor(Math.random() * types.length)];
            gd.ingredients.push({
                id: Math.random(),
                x: 850,
                y: 470,
                type: choice,
                speed: 240 + Math.random() * 90,
                hit: false,
                missed: false,
                splitTimer: 0
            });
        }

        // Update ingredients
        gd.ingredients.forEach(item => {
            if (!item.hit) {
                item.x -= item.speed * dt;
                if (item.x < 130 && !item.missed) {
                    item.missed = true;
                }
            } else {
                item.splitTimer += dt;
            }
        });

        // Remove offscreen
        gd.ingredients = gd.ingredients.filter(item => item.x > -50 && item.splitTimer < 1.0);

        // Update knife swing
        const knife = gd.chefKnife;
        if (knife.state === 'swinging') {
            knife.y += 1800 * dt;
            if (knife.y >= 460) {
                knife.y = 460;
                knife.state = 'returning';

                // Hit detection on the closest item
                let closest = null;
                let minDist = Infinity;
                gd.ingredients.forEach(item => {
                    if (!item.hit) {
                        const dist = Math.abs(item.x - gd.cutLineX);
                        if (dist < minDist) {
                            minDist = dist;
                            closest = item;
                        }
                    }
                });

                if (closest && minDist <= 50) {
                    closest.hit = true;
                    if (closest.type === 'stone' || closest.type === 'broken_blade') {
                        gd.lives--;
                        gd.feedbackText = "💥 ¡HOJA DAÑADA POR OBSTÁCULO! Vidas -1 💥";
                        gd.feedbackColor = "#ff3333";
                        gd.feedbackTimer = 1.5;
                        this.triggerShake(15);
                        if (window.playProceduralSound) window.playProceduralSound('damage');
                        this.createExplosion(closest.x, closest.y, '#90a4ae', 20, 1.3);
                    } else {
                        // Sliced item
                        const precision = Math.abs(closest.x - gd.cutLineX);
                        if (precision <= 18) {
                            this.score++;
                            document.getElementById('minigame-score').innerText = `Cortes Perfectos: ${this.score}/${this.goal}`;
                            gd.feedbackText = "✨ ¡CORTE PERFECTO! +1 ✨";
                            gd.feedbackColor = "#00ff99";
                            gd.feedbackTimer = 1.0;
                            if (window.playProceduralSound) window.playProceduralSound('success');
                            this.createExplosion(closest.x, closest.y, '#00ff99', 15, 1.1);
                            if (window.launchConfetti && this.score >= this.goal) window.launchConfetti();
                            if (this.score >= this.goal) {
                                setTimeout(() => this.win(), 800);
                            }
                        } else {
                            gd.feedbackText = "⚠️ ¡CORTE IMPRECISO! Sin puntos ⚠️";
                            gd.feedbackColor = "#ffaa00";
                            gd.feedbackTimer = 1.0;
                            if (window.playProceduralSound) window.playProceduralSound('click');
                            this.createExplosion(closest.x, closest.y, '#ffaa00', 8, 0.9);
                        }
                    }
                }
            }
        } else if (knife.state === 'returning') {
            knife.y -= 1000 * dt;
            if (knife.y <= 150) {
                knife.y = 150;
                knife.state = 'idle';
            }
        }
    },

    drawKnife() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Wooden board / kitchen back
        ctx.fillStyle = '#efebe9';
        ctx.fillRect(0, 0, 800, 600);

        // Conveyor belt track
        ctx.fillStyle = '#b0bec5';
        ctx.fillRect(0, 440, 800, 60);
        ctx.fillStyle = '#78909c';
        ctx.fillRect(0, 495, 800, 5);

        // Wooden cutting board shadow zone
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(200, 435, 100, 70);
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 3;
        ctx.strokeRect(200, 435, 100, 70);

        // Red/dashed cutting line
        ctx.strokeStyle = '#ff3333';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gd.cutLineX, 400);
        ctx.lineTo(gd.cutLineX, 510);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw ingredients
        gd.ingredients.forEach(item => {
            const emojis = {
                tuna: '🐟', cucumber: '🥒', shiitake: '🍄', wasabi: '🥦',
                stone: '🪨', broken_blade: '🔧'
            };
            const emoji = emojis[item.type] || '🍣';

            if (!item.hit) {
                ctx.save();
                ctx.translate(item.x, item.y);
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(0,0,0,0.2)';
                
                // Plate/wrapper
                ctx.fillStyle = item.type === 'stone' || item.type === 'broken_blade' ? '#cfd8dc' : '#fff';
                ctx.strokeStyle = item.type === 'stone' || item.type === 'broken_blade' ? '#78909c' : '#ffd54f';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 24, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Emoji
                ctx.font = '24px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(emoji, 0, 0);
                ctx.restore();
            } else {
                // Draw split falling halves
                ctx.save();
                const offset = item.splitTimer * 60;
                const rot = item.splitTimer * Math.PI;

                // Left Half
                ctx.save();
                ctx.translate(item.x - offset, item.y + offset * 0.5);
                ctx.rotate(-rot);
                ctx.font = '24px sans-serif';
                ctx.fillText(emoji, -6, 0);
                ctx.restore();

                // Right Half
                ctx.save();
                ctx.translate(item.x + offset, item.y + offset * 0.5);
                ctx.rotate(rot);
                ctx.font = '24px sans-serif';
                ctx.fillText(emoji, 6, 0);
                ctx.restore();

                ctx.restore();
            }
        });

        // Draw Chef Knife
        const knife = gd.chefKnife;
        ctx.save();
        ctx.translate(knife.x, knife.y);

        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';

        // Blade (silver shiny metal)
        ctx.fillStyle = '#eceff1';
        ctx.strokeStyle = '#b0bec5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, -110);
        ctx.lineTo(12, -110);
        ctx.lineTo(12, -10);
        ctx.quadraticCurveTo(8, 0, -6, -2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shiny reflect line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(3, -105);
        ctx.lineTo(3, -12);
        ctx.stroke();

        // Wooden handle
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(-4, -165, 8, 55);

        ctx.restore();

        // HUD & alerts
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 800, 50);

        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`CORTES: ${this.score}/${this.goal}`, 20, 31);

        ctx.fillStyle = '#ff3333';
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Hoja: ${hearts}`, 550, 31);

        if (gd.feedbackTimer > 0) {
            ctx.font = 'bold 22px sans-serif';
            ctx.fillStyle = gd.feedbackColor;
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 300);
            ctx.textAlign = 'left';
        }
    },

    inputKnifePress(x, y) {
        const gd = this.gameData;
        if (gd && gd.chefKnife.state === 'idle') {
            gd.chefKnife.state = 'swinging';
            if (window.playProceduralSound) window.playProceduralSound('jump');
        }
    },

    // ==========================================================
    // 16. RETO 500 YENES (day_4_500yen)
    // ==========================================================
    setup500Yen() {
        this.gameData = {
            lives: 3,
            totalBudget: 0,
            cart: { x: 400, y: 520, w: 130, h: 50 },
            items: [],
            spawnTimer: 0.5,
            feedbackText: "",
            feedbackTimer: 0,
            feedbackColor: "#00ff99",
            checkoutBtn: { x: 620, y: 15, w: 160, h: 42 }
        };
        this.score = 0;
    },

    update500Yen(dt) {
        const gd = this.gameData;
        if (!gd) return;

        if (gd.lives <= 0) {
            this.gameOver();
            return;
        }

        if (gd.feedbackTimer > 0) {
            gd.feedbackTimer -= dt;
        }

        // Cart X matches mouse bounded
        gd.cart.x = Math.max(65, Math.min(735, this.mouse.x));

        // Spawn items
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 0.7 + Math.random() * 0.7;
            const pool = [
                { type: 'onigiri', price: 150, emoji: '🍙' },
                { type: 'greentea', price: 130, emoji: '🍵' },
                { type: 'melonpan', price: 160, emoji: '🍞' },
                { type: 'pocky', price: 180, emoji: '🍫' },
                { type: 'rotten', price: 0, emoji: '🤢' }
            ];
            const choice = pool[Math.floor(Math.random() * pool.length)];
            gd.items.push({
                x: 50 + Math.random() * 700,
                y: -40,
                type: choice.type,
                price: choice.price,
                emoji: choice.emoji,
                speed: 160 + Math.random() * 100
            });
        }

        // Update items
        gd.items.forEach(item => {
            item.y += item.speed * dt;
        });

        // Collisions
        for (let i = gd.items.length - 1; i >= 0; i--) {
            const it = gd.items[i];
            const c = gd.cart;

            if (it.y >= c.y - 25 && it.y <= c.y + 25 && it.x >= c.x - c.w/2 && it.x <= c.x + c.w/2) {
                // Catch item!
                gd.items.splice(i, 1);

                if (it.type === 'rotten') {
                    gd.lives--;
                    gd.feedbackText = "🤢 ¡PRODUCTO CADUCADO EN MAL ESTADO! Vidas -1 🤮";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.8;
                    this.triggerShake(12);
                    if (window.playProceduralSound) window.playProceduralSound('damage');
                    this.createExplosion(it.x, it.y, '#8d6e63', 15, 1.2);
                } else {
                    gd.totalBudget += it.price;
                    if (window.playProceduralSound) window.playProceduralSound('collect');
                    this.createExplosion(it.x, it.y, '#00ff99', 10, 1.0);

                    if (gd.totalBudget > 500) {
                        gd.lives--;
                        gd.totalBudget = 0;
                        gd.feedbackText = "💥 ¡CESTA SOBRECARGADA! MÁXIMO 500¥ SUPERADO 💥";
                        gd.feedbackColor = "#ff3333";
                        gd.feedbackTimer = 1.8;
                        this.triggerShake(15);
                        if (window.playProceduralSound) window.playProceduralSound('error');
                    } else {
                        gd.feedbackText = `+${it.price}¥ (${it.emoji})`;
                        gd.feedbackColor = "#00ff99";
                        gd.feedbackTimer = 1.0;
                    }
                }
                continue;
            }

            if (it.y > 650) {
                gd.items.splice(i, 1);
            }
        }
    },

    draw500Yen() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Kombini background neon styling
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, 800, 600);

        // Draw light grids
        ctx.strokeStyle = 'rgba(0, 255, 150, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
        }

        // Draw convenience store shelves outline in background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(20, 80, 200, 400);
        ctx.fillRect(580, 80, 200, 400);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeRect(20, 80, 200, 400);
        ctx.strokeRect(580, 80, 200, 400);

        // Draw falling items
        gd.items.forEach(it => {
            ctx.save();
            ctx.translate(it.x, it.y);

            // Item bubble
            ctx.fillStyle = it.type === 'rotten' ? '#4e342e' : '#1f2937';
            ctx.strokeStyle = it.type === 'rotten' ? '#ff3333' : '#00ff99';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.fill(); ctx.stroke();

            // Emoji
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(it.emoji, 0, -3);

            // Price tag
            if (it.type !== 'rotten') {
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 11px monospace';
                ctx.fillText(`${it.price}¥`, 0, 16);
            } else {
                ctx.fillStyle = '#ff3333';
                ctx.font = 'bold 11px monospace';
                ctx.fillText(`CADUCADO`, 0, 16);
            }

            ctx.restore();
        });

        // Draw Cart/Basket
        ctx.save();
        ctx.translate(gd.cart.x, gd.cart.y);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff99';

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#00ff99';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-gd.cart.w/2, -15);
        ctx.lineTo(gd.cart.w/2, -15);
        ctx.lineTo(gd.cart.w/2 - 10, 20);
        ctx.lineTo(-gd.cart.w/2 + 10, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Basket handle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, -15, 30, Math.PI, 0);
        ctx.stroke();

        ctx.restore();

        // HUD panel at the top
        ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
        ctx.fillRect(0, 0, 800, 75);
        ctx.strokeStyle = '#00ff99';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 75); ctx.lineTo(800, 75); ctx.stroke();

        // Stats
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`PRESUPUESTO: `, 20, 42);
        
        let sumColor = '#ffd700';
        if (gd.totalBudget >= 400 && gd.totalBudget <= 500) sumColor = '#00ff99';
        ctx.fillStyle = sumColor;
        ctx.fillText(`${gd.totalBudget} ¥ / 500 ¥`, 160, 42);

        // Hearts
        ctx.fillStyle = '#ff3333';
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 380, 42);

        // Checkout Button
        const btn = gd.checkoutBtn;
        const active = gd.totalBudget >= 400 && gd.totalBudget <= 500;
        ctx.save();
        if (active) {
            ctx.shadowBlur = Math.sin(this.gameTime * 8) * 6 + 8;
            ctx.shadowColor = '#00ff99';
            ctx.fillStyle = '#00ff99';
            ctx.strokeStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#374151';
            ctx.strokeStyle = '#4b5563';
        }
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = active ? '#0c1117' : '#9ca3af';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("💳 PAGAR (400-500)", btn.x + btn.w/2, btn.y + btn.h/2);
        ctx.restore();

        // Feedback text
        if (gd.feedbackTimer > 0) {
            ctx.font = 'bold 22px sans-serif';
            ctx.fillStyle = gd.feedbackColor;
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 300);
            ctx.textAlign = 'left';
        }
    },

    input500YenPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;
        const btn = gd.checkoutBtn;

        if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
            if (gd.totalBudget >= 400 && gd.totalBudget <= 500) {
                this.score = 1;
                document.getElementById('minigame-score').innerText = `Presupuesto optimizado: 1/1`;
                if (window.playProceduralSound) window.playProceduralSound('success');
                if (window.launchConfetti) window.launchConfetti();
                this.win();
            } else {
                if (window.playProceduralSound) window.playProceduralSound('error');
                gd.feedbackText = "❌ PRESUPUESTO INADECUADO: Reúne al menos 400¥ ❌";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.8;
                this.triggerShake(6);
            }
        }
    },

    // ==========================================================
    // 17. INFILTRACIÓN DE DATOS (day_4_isshinji)
    // ==========================================================
    setupIsshinji() {
        this.gameData = {
            lives: 3,
            score: 0,
            player: { gridX: 0, gridY: 5, x: 50, y: 440, targetX: 50, targetY: 440 },
            exit: { gridX: 7, gridY: 0, x: 750, y: 40 },
            keys: [
                { gridX: 1, gridY: 1, collected: false },
                { gridX: 6, gridY: 4, collected: false },
                { gridX: 4, gridY: 2, collected: false }
            ],
            enemies: [
                { gridX: 3, gridY: 0, startGridY: 0, endGridY: 4, dir: 1, type: 'col', x: 350, y: 40, speed: 2.0 },
                { gridX: 5, gridY: 5, startGridY: 1, endGridY: 5, dir: -1, type: 'col', x: 550, y: 440, speed: 2.5 },
                { gridX: 0, gridY: 3, startGridX: 1, endGridX: 6, dir: 1, type: 'row', x: 150, y: 280, speed: 3.0 }
            ],
            feedbackText: "",
            feedbackTimer: 0,
            feedbackColor: "#e91e63"
        };
        this.score = 0;
    },

    updateIsshinji(dt) {
        const gd = this.gameData;
        if (!gd) return;

        if (gd.lives <= 0) {
            this.gameOver();
            return;
        }

        if (gd.feedbackTimer > 0) {
            gd.feedbackTimer -= dt;
        }

        // Interpolate player position
        const p = gd.player;
        p.x += (p.targetX - p.x) * 12 * dt;
        p.y += (p.targetY - p.y) * 12 * dt;

        // Update enemies
        gd.enemies.forEach(e => {
            if (e.type === 'col') {
                e.gridY += e.dir * e.speed * dt;
                if (e.gridY >= e.endGridY) {
                    e.gridY = e.endGridY;
                    e.dir = -1;
                } else if (e.gridY <= e.startGridY) {
                    e.gridY = e.startGridY;
                    e.dir = 1;
                }
                e.y = e.gridY * 80 + 40;
                e.x = e.gridX * 100 + 50;
            } else if (e.type === 'row') {
                e.gridX += e.dir * e.speed * dt;
                if (e.gridX >= e.endGridX) {
                    e.gridX = e.endGridX;
                    e.dir = -1;
                } else if (e.gridX <= e.startGridX) {
                    e.gridX = e.startGridX;
                    e.dir = 1;
                }
                e.x = e.gridX * 100 + 50;
                e.y = e.gridY * 80 + 40;
            }
        });

        // Check player-enemy collisions
        for (let e of gd.enemies) {
            const dist = Math.hypot(p.x - e.x, p.y - e.y);
            if (dist < 32) {
                // Collided!
                gd.lives--;
                p.gridX = 0;
                p.gridY = 5;
                p.x = 50;
                p.y = 440;
                p.targetX = 50;
                p.targetY = 440;

                gd.feedbackText = "💥 ¡CORTAFUEGOS ACTIVO! Conexión reiniciada 🚨";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 2.0;
                this.triggerShake(15);
                if (window.playProceduralSound) window.playProceduralSound('damage');
                this.createExplosion(e.x, e.y, '#ff3333', 20, 1.4);
                break;
            }
        }

        // Collect keys
        gd.keys.forEach(k => {
            if (!k.collected && p.gridX === k.gridX && p.gridY === k.gridY) {
                k.collected = true;
                gd.score++;
                this.score = gd.score;
                document.getElementById('minigame-score').innerText = `Claves extraídas: ${this.score}/3`;
                gd.feedbackText = `🔑 Clave de datos descifrada (${this.score}/3)`;
                gd.feedbackColor = "#00ff99";
                gd.feedbackTimer = 1.2;
                if (window.playProceduralSound) window.playProceduralSound('collect');
                this.createExplosion(p.x, p.y, '#ffd700', 12, 1.1);
            }
        });

        // Exit check
        if (p.gridX === gd.exit.gridX && p.gridY === gd.exit.gridY) {
            if (gd.score >= 3) {
                if (window.playProceduralSound) window.playProceduralSound('win');
                if (window.launchConfetti) window.launchConfetti();
                this.win();
            }
        }
    },

    drawIsshinji() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Dark tech grid background
        ctx.fillStyle = '#06050a';
        ctx.fillRect(0, 0, 800, 480);

        // Draw grid boundaries
        ctx.strokeStyle = 'rgba(233, 30, 99, 0.05)';
        ctx.lineWidth = 1;
        for (let col = 0; col <= 8; col++) {
            ctx.beginPath(); ctx.moveTo(col * 100, 0); ctx.lineTo(col * 100, 480); ctx.stroke();
        }
        for (let row = 0; row <= 6; row++) {
            ctx.beginPath(); ctx.moveTo(0, row * 80); ctx.lineTo(800, row * 80); ctx.stroke();
        }

        // Draw start zone marker
        ctx.fillStyle = 'rgba(0, 255, 100, 0.03)';
        ctx.fillRect(0, 400, 100, 80);
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 402, 96, 76);

        // Draw keys
        gd.keys.forEach(k => {
            if (!k.collected) {
                ctx.save();
                ctx.translate(k.gridX * 100 + 50, k.gridY * 80 + 40);
                
                // Outer gold rotating square
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2;
                ctx.rotate(this.gameTime * 2);
                ctx.strokeRect(-16, -16, 32, 32);

                // Center node
                ctx.fillStyle = '#ffd700';
                ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();

                // Key emoji
                ctx.font = '14px sans-serif';
                ctx.fillText("🔑", -8, 5);

                ctx.restore();
            }
        });

        // Draw Exit (Core database)
        ctx.save();
        ctx.translate(gd.exit.gridX * 100 + 50, gd.exit.gridY * 80 + 40);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';

        ctx.fillStyle = gd.score >= 3 ? '#00ffff' : '#374151';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.font = gd.score >= 3 ? 'bold 16px monospace' : '12px monospace';
        ctx.fillStyle = gd.score >= 3 ? '#06050a' : '#9ca3af';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(gd.score >= 3 ? "CORE" : "LOCK", 0, 0);
        ctx.restore();

        // Draw Enemies
        gd.enemies.forEach(e => {
            ctx.save();
            ctx.translate(e.x, e.y);
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff3333';

            // Security core
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI*2);
            ctx.fill();

            // Rotating scanner shield lines
            ctx.strokeStyle = 'rgba(255, 51, 81, 0.4)';
            ctx.lineWidth = 2;
            ctx.rotate(-this.gameTime * 4);
            ctx.beginPath();
            ctx.arc(0, 0, 24, 0, Math.PI/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 24, Math.PI, Math.PI*1.5);
            ctx.stroke();

            ctx.restore();
        });

        // Draw Player
        const p = gd.player;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00ff99';

        // Cyan/Green probe
        ctx.fillStyle = '#00ff99';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI*2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI*2);
        ctx.stroke();

        ctx.restore();

        // Bottom HUD / Terminal dashboard panel
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 480, 800, 120);
        ctx.strokeStyle = '#e91e63';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 480); ctx.lineTo(800, 480); ctx.stroke();

        ctx.font = 'bold 15px monospace';
        ctx.fillStyle = '#e91e63';
        ctx.fillText("TEMPLO ISSHINJI // TERMINAL DE EXTRACCIÓN DE DATOS ANCESTRALES", 20, 515);

        ctx.fillStyle = '#ffffff';
        ctx.font = '13px monospace';
        ctx.fillText(`CLAVES DE DATOS EXTRAÍDAS: ${gd.score}/3`, 20, 545);
        ctx.fillText("PULSA EN LAS CASILLAS ADYACENTES PARA MOVER TU PROBE HACIA LA SALIDA.", 20, 570);

        ctx.fillStyle = '#ff3333';
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Conexión: ${hearts}`, 550, 545);

        // Draw feedback text
        if (gd.feedbackTimer > 0) {
            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = gd.feedbackColor;
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 240);
            ctx.textAlign = 'left';
        }
    },

    inputIsshinjiPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;
        const p = gd.player;

        // Verify click is within grid zone
        if (y >= 480) return;

        const gridX = Math.floor(x / 100);
        const gridY = Math.floor(y / 80);

        // Check adjacency cardinally
        const diffX = Math.abs(gridX - p.gridX);
        const diffY = Math.abs(gridY - p.gridY);
        if (diffX + diffY === 1) {
            p.gridX = gridX;
            p.gridY = gridY;
            p.targetX = gridX * 100 + 50;
            p.targetY = gridY * 80 + 40;

            if (window.playProceduralSound) window.playProceduralSound('rotate');
        }
    },

    // ==========================================================
    // 18. VISOR TÁCTICO WAGYU HUNTER (day_4_tracker)
    // ==========================================================
    setupTracker() {
        this.gameData = {
            lives: 3,
            score: 0,
            stalls: [],
            spawnTimer: 0.5,
            feedbackText: "",
            feedbackTimer: 0,
            feedbackColor: "#00ffff",
            scrollOffset: 0
        };
        this.score = 0;
    },

    updateTracker(dt) {
        const gd = this.gameData;
        if (!gd) return;

        if (gd.lives <= 0) {
            this.gameOver();
            return;
        }

        if (gd.feedbackTimer > 0) {
            gd.feedbackTimer -= dt;
        }

        // Scroll offset
        gd.scrollOffset += 60 * dt;

        // Spawn stalls
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 0.9 + Math.random() * 1.3;
            const types = ['wagyu', 'fish', 'matcha', 'civilian'];
            const choice = types[Math.floor(Math.random() * types.length)];
            const labels = {
                wagyu: '🥩 BROCHETAS WAGYU',
                fish: '🐙 MARISCO CRUDO',
                matcha: '🍦 HELADO MATCHA',
                civilian: '👤 COMPRADOR'
            };
            gd.stalls.push({
                x: 850,
                y: 120 + Math.random() * 260,
                type: choice,
                label: labels[choice],
                speedX: -(140 + Math.random() * 90),
                w: 130,
                h: 90,
                scanned: false
            });
        }

        // Update stalls
        gd.stalls.forEach(st => {
            st.x += st.speedX * dt;
        });

        // Filter out offscreen
        gd.stalls = gd.stalls.filter(st => st.x > -160);
    },

    drawTracker() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Dark grey metal market background
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, 800, 600);

        // Draw market wood pillars scrolling
        ctx.fillStyle = '#443d38';
        ctx.fillRect(0, 80, 800, 20);
        ctx.fillRect(0, 500, 800, 20);

        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 4;
        let xStart = -(Math.floor(gd.scrollOffset) % 150);
        for (let x = xStart; x < 900; x += 150) {
            ctx.beginPath(); ctx.moveTo(x, 80); ctx.lineTo(x, 520); ctx.stroke();
        }

        // Draw stalls
        gd.stalls.forEach(st => {
            ctx.save();
            ctx.translate(st.x, st.y);

            // Stall shape base
            ctx.fillStyle = st.scanned ? 'rgba(40,40,40,0.5)' : '#2e2a24';
            ctx.strokeStyle = st.scanned ? '#22c55e' : '#78716c';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(0, 0, st.w, st.h, 6);
            ctx.fill();
            ctx.stroke();

            // Red/White banner canopy at top of stall
            ctx.fillStyle = st.type === 'wagyu' ? '#dc2626' : '#2563eb';
            ctx.fillRect(3, 3, st.w - 6, 18);
            ctx.fillStyle = '#ffffff';
            for (let i = 10; i < st.w; i += 24) {
                ctx.fillRect(i, 3, 10, 18);
            }

            // Draw content emoji
            ctx.font = '28px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let emoji = '🛒';
            if (st.type === 'wagyu') emoji = '🥩';
            else if (st.type === 'fish') emoji = '🐙';
            else if (st.type === 'matcha') emoji = '🍦';
            else if (st.type === 'civilian') emoji = '👤';
            ctx.fillText(emoji, st.w/2, st.h/2 + 8);

            // Draw label
            ctx.fillStyle = '#f5f5f4';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(st.label, 8, st.h - 10);

            if (st.scanned) {
                // Large neon tick
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(st.w/2 - 12, st.h/2 + 5);
                ctx.lineTo(st.w/2 - 2, st.h/2 + 15);
                ctx.lineTo(st.w/2 + 15, st.h/2 - 5);
                ctx.stroke();
            }

            ctx.restore();
        });

        // Visor crosshair following mouse
        ctx.save();
        ctx.translate(this.mouse.x, this.mouse.y);
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f0ff';

        // Outer cyan scanner ring
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI*2);
        ctx.stroke();

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 4;
        // Draw crosshair ticks
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-30, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(50, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(0, -30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(0, 50); ctx.stroke();

        // Center dot
        ctx.fillStyle = '#ff007f';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill();

        ctx.restore();

        // HUD panel
        ctx.fillStyle = 'rgba(10, 10, 15, 0.85)';
        ctx.fillRect(0, 0, 800, 55);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 55); ctx.lineTo(800, 55); ctx.stroke();

        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`WAGYU ESCANEADO: `, 20, 34);
        ctx.fillStyle = '#00ffff';
        ctx.fillText(`${this.score} / ${this.goal}`, 180, 34);

        ctx.fillStyle = '#ff3333';
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Batería Visor: ${hearts}`, 530, 34);

        // Feedback text
        if (gd.feedbackTimer > 0) {
            ctx.font = 'bold 22px sans-serif';
            ctx.fillStyle = gd.feedbackColor;
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 300);
            ctx.textAlign = 'left';
        }
    },

    inputTrackerPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;

        let hitAny = false;
        // Hit detection on overlapping unscanned stalls
        for (let i = gd.stalls.length - 1; i >= 0; i--) {
            const st = gd.stalls[i];
            if (!st.scanned && x >= st.x && x <= st.x + st.w && y >= st.y && y <= st.y + st.h) {
                st.scanned = true;
                hitAny = true;

                if (st.type === 'wagyu') {
                    this.score++;
                    document.getElementById('minigame-score').innerText = `Wagyus Escaneados: ${this.score}/${this.goal}`;
                    gd.feedbackText = "🥩 ¡WAGYU CERTIFICADO A5! Escaneo Guardado 🟢";
                    gd.feedbackColor = "#00ff99";
                    gd.feedbackTimer = 1.2;
                    if (window.playProceduralSound) window.playProceduralSound('success');
                    this.createExplosion(x, y, '#00ff99', 15, 1.2);
                    if (window.launchConfetti && this.score >= this.goal) window.launchConfetti();
                    if (this.score >= this.goal) {
                        setTimeout(() => this.win(), 800);
                    }
                } else if (st.type === 'civilian') {
                    gd.lives--;
                    gd.feedbackText = "🚨 ¡INFRACCIÓN! Escaneo de Civil Prohibido ❌";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.5;
                    this.triggerShake(12);
                    if (window.playProceduralSound) window.playProceduralSound('damage');
                    this.createExplosion(x, y, '#ff3333', 20, 1.4);
                } else {
                    gd.lives--;
                    gd.feedbackText = "⚠️ ¡FALLO DE SEÑAL! El objetivo no es Wagyu ⚠️";
                    gd.feedbackColor = "#ffaa00";
                    gd.feedbackTimer = 1.2;
                    this.triggerShake(8);
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    this.createExplosion(x, y, '#ffaa00', 10, 1.0);
                }
                break;
            }
        }

        if (!hitAny) {
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
    },

    // ==========================================================
    // DAY 5 MINIGAMES - NARA (LAURA & IVÁN)
    // ==========================================================

    setupMochi() {
        this.gameData = {
            lives: 3,
            notes: [],
            spawnTimer: 1.0,
            feedbackText: "",
            feedbackColor: "#00ff99",
            feedbackTimer: 0.0,
            streak: 0,
            multiplier: 1,
            btnLeft: { x: 300, y: 520, r: 40, active: false, timer: 0 },
            btnRight: { x: 500, y: 520, r: 40, active: false, timer: 0 },
            charMallet: { state: 'up', timer: 0 },
            charHand: { state: 'out', timer: 0 }
        };
        this.score = 0;
    },

    updateMochi(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;
        if (gd.btnLeft.timer > 0) gd.btnLeft.timer -= dt;
        if (gd.btnRight.timer > 0) gd.btnRight.timer -= dt;
        if (gd.charMallet.timer > 0) {
            gd.charMallet.timer -= dt;
            if (gd.charMallet.timer <= 0) gd.charMallet.state = 'up';
        }
        if (gd.charHand.timer > 0) {
            gd.charHand.timer -= dt;
            if (gd.charHand.timer <= 0) gd.charHand.state = 'out';
        }

        // Spawn notes
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            const delay = Math.max(0.7, 1.8 - (this.score * 0.04));
            gd.spawnTimer = delay + Math.random() * 0.4;
            const lane = Math.random() < 0.5 ? 0 : 1;
            gd.notes.push({
                y: -30,
                lane: lane,
                type: lane === 0 ? 'mallet' : 'hand',
                hit: false
            });
        }

        // Update notes
        const speed = 250 + Math.min(150, this.score * 8);
        for (let i = gd.notes.length - 1; i >= 0; i--) {
            const note = gd.notes[i];
            note.y += speed * dt;

            // Miss if note goes off screen
            if (note.y > 550) {
                if (!note.hit) {
                    gd.lives--;
                    gd.streak = 0;
                    gd.multiplier = 1;
                    gd.feedbackText = "¡FALLO!";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.0;
                    this.triggerShake(6);
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    if (gd.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                }
                gd.notes.splice(i, 1);
            }
        }
    },

    drawMochi() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        // Background: Traditional Tatami/Wood shop
        ctx.fillStyle = '#f5f5dc';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(0, 480, 800, 120); // Wooden floor

        // Draw note lanes
        ctx.strokeStyle = 'rgba(141, 110, 99, 0.4)';
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(300, 0); ctx.lineTo(300, 480); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(500, 0); ctx.lineTo(500, 480); ctx.stroke();

        // Target circles
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#4caf50';
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(300, 500, 32, 0, Math.PI*2); ctx.stroke();
        ctx.strokeStyle = '#f06292';
        ctx.shadowColor = '#f06292';
        ctx.beginPath(); ctx.arc(500, 500, 32, 0, Math.PI*2); ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Usu (wood mortar in center)
        ctx.fillStyle = '#d7ccc8';
        ctx.beginPath();
        ctx.moveTo(370, 480);
        ctx.lineTo(430, 480);
        ctx.lineTo(440, 540);
        ctx.lineTo(360, 540);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw Mochi inside Usu
        ctx.fillStyle = '#a5d6a7';
        ctx.beginPath();
        ctx.ellipse(400, 490, 25, 12, 0, 0, Math.PI*2);
        ctx.fill();

        // Characters Chibi: Mallet-pounder (left), Hand-folder (right)
        // Pounder (Left)
        ctx.save();
        ctx.translate(330, 460);
        ctx.fillStyle = '#1976d2'; // Blue tunic
        ctx.beginPath(); ctx.arc(0, -40, 18, 0, Math.PI*2); ctx.fill(); // Head
        ctx.fillRect(-15, -22, 30, 40); // Body
        ctx.fillStyle = '#ffe0b2'; // Skin
        ctx.fillRect(-10, -5, 20, 10);
        // Mallet drawing
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 4;
        if (gd.charMallet.state === 'down') {
            ctx.beginPath(); ctx.moveTo(-5, -10); ctx.lineTo(65, 30); ctx.stroke(); // Handle
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(60, 20, 15, 22);
        } else {
            ctx.beginPath(); ctx.moveTo(-5, -20); ctx.lineTo(15, -70); ctx.stroke(); // Handle
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(5, -75, 22, 15);
        }
        ctx.restore();

        // Folder (Right)
        ctx.save();
        ctx.translate(470, 470);
        ctx.fillStyle = '#e53935'; // Red tunic
        ctx.beginPath(); ctx.arc(0, -40, 18, 0, Math.PI*2); ctx.fill(); // Head
        ctx.fillRect(-15, -22, 30, 35); // Body
        // Hands
        ctx.fillStyle = '#ffe0b2';
        if (gd.charHand.state === 'in') {
            ctx.fillRect(-45, -12, 30, 10);
        } else {
            ctx.fillRect(10, -12, 10, 25);
        }
        ctx.restore();

        // Draw notes
        gd.notes.forEach(note => {
            ctx.save();
            ctx.shadowBlur = 12;
            if (note.type === 'mallet') {
                ctx.fillStyle = '#4caf50';
                ctx.strokeStyle = '#388e3c';
                ctx.shadowColor = '#4caf50';
                ctx.beginPath();
                ctx.arc(300, note.y, 22, 0, Math.PI*2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px serif';
                ctx.textAlign = 'center';
                ctx.fillText("🔨", 300, note.y + 6);
            } else {
                ctx.fillStyle = '#f06292';
                ctx.strokeStyle = '#c2185b';
                ctx.shadowColor = '#f06292';
                ctx.beginPath();
                ctx.arc(500, note.y, 22, 0, Math.PI*2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px serif';
                ctx.textAlign = 'center';
                ctx.fillText("🤚", 500, note.y + 6);
            }
            ctx.restore();
        });

        // Draw buttons at bottom
        // Left (Mallet) Button
        ctx.save();
        ctx.translate(gd.btnLeft.x, gd.btnLeft.y);
        ctx.fillStyle = gd.btnLeft.timer > 0 ? '#1b5e20' : '#4caf50';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, gd.btnLeft.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("🔨", 0, 8);
        ctx.restore();

        // Right (Hand) Button
        ctx.save();
        ctx.translate(gd.btnRight.x, gd.btnRight.y);
        ctx.fillStyle = gd.btnRight.timer > 0 ? '#880e4f' : '#f06292';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, gd.btnRight.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("🤚", 0, 8);
        ctx.restore();

        // HUD Header
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🍡 Amasados: ${this.score} / ${this.goal}`, 25, 29);
        ctx.fillText(`Multiplicador: x${gd.multiplier} (Streak: ${gd.streak})`, 240, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        // Feedback Floating Text
        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 36px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 15;
            ctx.shadowColor = gd.feedbackColor;
            ctx.fillText(gd.feedbackText, 400, 220);
            ctx.restore();
        }
    },

    inputMochiPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        // Check Mallet Button
        let distLeft = Math.hypot(x - gd.btnLeft.x, y - gd.btnLeft.y);
        if (distLeft <= gd.btnLeft.r) {
            gd.btnLeft.timer = 0.15;
            gd.charMallet.state = 'down';
            gd.charMallet.timer = 0.25;
            this.evaluateMochiHit(0);
            return;
        }

        // Check Hand Button
        let distRight = Math.hypot(x - gd.btnRight.x, y - gd.btnRight.y);
        if (distRight <= gd.btnRight.r) {
            gd.btnRight.timer = 0.15;
            gd.charHand.state = 'in';
            gd.charHand.timer = 0.25;
            this.evaluateMochiHit(1);
            return;
        }
    },

    evaluateMochiHit(lane) {
        const gd = this.gameData;
        if (!gd) return;

        let hitNote = null;
        let minDist = 9999;
        let index = -1;

        for (let i = 0; i < gd.notes.length; i++) {
            const note = gd.notes[i];
            if (note.lane === lane && !note.hit) {
                const d = Math.abs(note.y - 500);
                if (d < minDist) {
                    minDist = d;
                    hitNote = note;
                    index = i;
                }
            }
        }

        if (hitNote && minDist < 65) {
            hitNote.hit = true;
            this.createExplosion(lane === 0 ? 300 : 500, hitNote.y, lane === 0 ? '#4caf50' : '#f06292', 12, 1.2);
            
            if (minDist <= 22) {
                gd.score++;
                this.score++;
                gd.streak++;
                gd.multiplier = Math.min(5, 1 + Math.floor(gd.streak / 5));
                gd.feedbackText = "🔥 ¡PERFECTO! 🔥";
                gd.feedbackColor = "#00e676";
                gd.feedbackTimer = 0.8;
                if (window.playProceduralSound) window.playProceduralSound('collect');
            } else {
                gd.score++;
                this.score++;
                gd.streak++;
                gd.multiplier = Math.min(5, 1 + Math.floor(gd.streak / 5));
                gd.feedbackText = "👍 ¡BIEN! 👍";
                gd.feedbackColor = "#29b6f6";
                gd.feedbackTimer = 0.8;
                if (window.playProceduralSound) window.playProceduralSound('collect');
            }

            gd.notes.splice(index, 1);

            if (window.launchConfetti && this.score >= this.goal) window.launchConfetti();
            if (this.score >= this.goal) {
                setTimeout(() => this.win(), 600);
            }
        } else {
            gd.streak = 0;
            gd.multiplier = 1;
            gd.feedbackText = "❌ ¡FALLO! ❌";
            gd.feedbackColor = "#d50000";
            gd.feedbackTimer = 0.8;
            this.triggerShake(5);
            if (window.playProceduralSound) window.playProceduralSound('error');
        }
        document.getElementById('minigame-score').innerText = `Mochi Amasado: ${this.score}/${this.goal}`;
    },

    setupGymnast() {
        this.gameData = {
            lives: 3,
            poses: [],
            spawnTimer: 1.0,
            feedbackText: "",
            feedbackColor: "#ff4081",
            feedbackTimer: 0.0,
            chibi: { y: 360, targetY: 360, angle: 0, animState: 'idle', stateTimer: 0 },
            jury: [
                { x: 260, text: "🦌 10", show: false, timer: 0 },
                { x: 400, text: "🦌 10", show: false, timer: 0 },
                { x: 540, text: "🦌 10/10 🌟", show: false, timer: 0 }
            ],
            streak: 0
        };
        this.score = 0;
    },

    updateGymnast(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        // Update chibi animation
        if (gd.chibi.stateTimer > 0) {
            gd.chibi.stateTimer -= dt;
            if (gd.chibi.stateTimer <= 0) {
                gd.chibi.animState = 'idle';
                gd.chibi.angle = 0;
                gd.chibi.y = 360;
            } else {
                if (gd.chibi.animState === 'flip') {
                    gd.chibi.angle += Math.PI * 4 * dt;
                    gd.chibi.y = 360 - 80 * Math.sin((gd.chibi.stateTimer / 0.5) * Math.PI);
                } else if (gd.chibi.animState === 'split') {
                    gd.chibi.y = 390;
                }
            }
        }

        // Update jury cards
        gd.jury.forEach(j => {
            if (j.timer > 0) {
                j.timer -= dt;
                if (j.timer <= 0) j.show = false;
            }
        });

        // Spawn flowing pose icons from right
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.4 + Math.random() * 0.8 - Math.min(0.5, this.score * 0.03);
            const poseType = Math.floor(Math.random() * 3);
            gd.poses.push({
                x: 830,
                y: 490,
                type: poseType,
                hit: false
            });
        }

        // Move poses from right to left
        const speed = 200 + this.score * 5;
        for (let i = gd.poses.length - 1; i >= 0; i--) {
            const p = gd.poses[i];
            p.x -= speed * dt;

            // Miss if it goes too far left
            if (p.x < 80) {
                if (!p.hit) {
                    gd.lives--;
                    gd.streak = 0;
                    gd.feedbackText = "¡FALTA DE RITMO!";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 0.8;
                    this.triggerShake(5);
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    if (gd.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                }
                gd.poses.splice(i, 1);
            }
        }
    },

    drawGymnast() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        const grad = ctx.createLinearGradient(0, 0, 0, 400);
        grad.addColorStop(0, '#ff7043');
        grad.addColorStop(1, '#ffeb3b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 400);

        ctx.fillStyle = '#4caf50'; // Grass
        ctx.fillRect(0, 400, 800, 200);

        // Draw Zen Stone Pagoda
        ctx.fillStyle = '#78909c';
        ctx.fillRect(680, 260, 40, 140);
        ctx.fillRect(660, 290, 80, 15);
        ctx.fillRect(650, 340, 100, 15);

        // Draw Target area circle
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00e5ff';
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(200, 490, 30, 0, Math.PI*2); ctx.stroke();
        ctx.restore();

        // Draw flowing poses
        gd.poses.forEach(p => {
            ctx.save();
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#e91e63';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#e91e63';
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'center';
            const icon = p.type === 0 ? "🤸‍♀️" : (p.type === 1 ? "🧘‍♀️" : "🙆‍♀️");
            ctx.fillText(icon, p.x, p.y + 7);
            ctx.restore();
        });

        // Draw Chibi Laura
        ctx.save();
        ctx.translate(200, gd.chibi.y);
        ctx.rotate(gd.chibi.angle);
        
        ctx.fillStyle = '#e91e63'; // Pink suit
        if (gd.chibi.animState === 'split') {
            ctx.fillRect(-8, -40, 16, 25);
            ctx.fillStyle = '#ffe0b2';
            ctx.beginPath(); ctx.arc(0, -50, 14, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ffe0b2';
            ctx.fillRect(-35, -25, 70, 7);
        } else if (gd.chibi.animState === 'flip') {
            ctx.beginPath(); ctx.arc(0, -10, 15, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ffe0b2';
            ctx.beginPath(); ctx.arc(0, -25, 12, 0, Math.PI*2); ctx.fill();
        } else {
            ctx.fillRect(-8, -35, 16, 25);
            ctx.fillStyle = '#ffe0b2';
            ctx.beginPath(); ctx.arc(0, -48, 14, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ffe0b2';
            ctx.fillRect(-6, -10, 5, 20);
            ctx.fillRect(1, -10, 5, 20);
        }
        ctx.restore();

        // Draw Deer Jury members
        gd.jury.forEach(j => {
            ctx.fillStyle = '#8d6e63';
            ctx.font = '36px serif';
            ctx.fillText("🦌", j.x, 220);

            if (j.show) {
                ctx.save();
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2.5;
                ctx.fillRect(j.x - 20, 120, 70, 30);
                ctx.strokeRect(j.x - 20, 120, 70, 30);
                ctx.fillStyle = '#0a0a0a';
                ctx.font = 'bold 14px monospace';
                ctx.fillText(j.text, j.x - 15, 140);
                ctx.restore();
            }
        });

        // Draw buttons at the bottom
        const buttonX = [250, 400, 550];
        const emojis = ["🤸‍♀️", "🧘‍♀️", "🙆‍♀️"];
        const labels = ["VOLTERETA (A)", "EQUILIBRIO (S)", "ESTIRAR (D)"];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = '#eceff1';
            ctx.strokeStyle = '#e91e63';
            ctx.lineWidth = 3;
            ctx.fillRect(buttonX[i] - 60, 520, 120, 48);
            ctx.strokeRect(buttonX[i] - 60, 520, 120, 48);
            ctx.fillStyle = '#0a0a0a';
            ctx.font = '22px sans-serif';
            ctx.fillText(emojis[i], buttonX[i] - 12, 545);
            ctx.font = '9px monospace';
            ctx.fillText(labels[i], buttonX[i] - 40, 562);
        }

        // HUD Header
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🤸‍♀️ Poses Perfectas: ${this.score} / ${this.goal}`, 25, 29);
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 620, 29);

        // Feedback
        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 28px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 280);
            ctx.restore();
        }
    },

    inputGymnastPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const buttonX = [250, 400, 550];
        let clickedPose = -1;
        for (let i = 0; i < 3; i++) {
            if (x >= buttonX[i] - 60 && x <= buttonX[i] + 60 && y >= 520 && y <= 568) {
                clickedPose = i;
                break;
            }
        }

        if (clickedPose === -1) return;

        let target = null;
        let index = -1;
        let minDist = 9999;
        for (let i = 0; i < gd.poses.length; i++) {
            const p = gd.poses[i];
            if (!p.hit) {
                const dist = Math.abs(p.x - 200);
                if (dist < minDist) {
                    minDist = dist;
                    target = p;
                    index = i;
                }
            }
        }

        if (target && minDist < 45) {
            if (target.type === clickedPose) {
                target.hit = true;
                this.score++;
                gd.streak++;
                gd.feedbackText = "⭐ ¡EXCELENTE POSTURA! ⭐";
                gd.feedbackColor = "#00e676";
                gd.feedbackTimer = 0.8;
                this.createExplosion(target.x, target.y, '#ffd700', 12, 1.2);
                if (window.playProceduralSound) window.playProceduralSound('success');

                gd.chibi.animState = clickedPose === 0 ? 'flip' : 'split';
                gd.chibi.stateTimer = 0.5;

                gd.jury.forEach(j => {
                    j.show = true;
                    j.timer = 1.0;
                    const scores = ["9.5 🦌", "9.8 🦌", "10/10 🌟"];
                    j.text = scores[Math.floor(Math.random() * scores.length)];
                });

                gd.poses.splice(index, 1);

                if (window.launchConfetti && this.score >= this.goal) window.launchConfetti();
                if (this.score >= this.goal) {
                    setTimeout(() => this.win(), 600);
                }
            } else {
                gd.lives--;
                gd.streak = 0;
                gd.feedbackText = "❌ ¡POSE EQUIVOCADA! ❌";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 0.8;
                this.triggerShake(6);
                if (window.playProceduralSound) window.playProceduralSound('error');
            }
        } else {
            gd.lives--;
            gd.streak = 0;
            gd.feedbackText = "¡FALTA DE RITMO!";
            gd.feedbackColor = "#ffaa00";
            gd.feedbackTimer = 0.8;
            this.triggerShake(4);
            if (window.playProceduralSound) window.playProceduralSound('error');
        }

        document.getElementById('minigame-score').innerText = `Poses Realizadas: ${this.score}/${this.goal}`;
    },

    setupMonk() {
        this.gameData = {
            lives: 3,
            timer: 15.0,
            monkAngle: 0,
            monkAngularVel: 0,
            windForce: 0,
            windTimer: 0.8,
            ripples: [],
            feedbackText: "¡Mantén el Equilibrio!",
            feedbackColor: "#00e5ff",
            feedbackTimer: 1.5,
            petals: []
        };
        this.score = 15;
    },

    updateMonk(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.timer -= dt;
        this.score = Math.max(0, Math.ceil(gd.timer));
        document.getElementById('minigame-score').innerText = `Tiempo Restante: ${this.score}s`;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.timer <= 0) {
            if (window.launchConfetti) window.launchConfetti();
            this.win();
            return;
        }

        if (Math.random() < 0.08) {
            gd.ripples.push({ x: Math.random() * 800, y: Math.random() * 600, r: 5, alpha: 0.8 });
        }
        if (Math.random() < 0.12) {
            gd.petals.push({
                x: Math.random() * 800,
                y: -20,
                vx: -30 - Math.random() * 40,
                vy: 50 + Math.random() * 30,
                angle: Math.random() * Math.PI,
                rotSpeed: 1 + Math.random() * 2
            });
        }

        // Update ripples
        for (let i = gd.ripples.length - 1; i >= 0; i--) {
            const rp = gd.ripples[i];
            rp.r += dt * 45;
            rp.alpha -= dt * 1.2;
            if (rp.alpha <= 0) gd.ripples.splice(i, 1);
        }

        // Update petals
        for (let i = gd.petals.length - 1; i >= 0; i--) {
            const pt = gd.petals[i];
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.angle += pt.rotSpeed * dt;
            if (pt.y > 620 || pt.x < -20) gd.petals.splice(i, 1);
        }

        // Wind Gust logic
        gd.windTimer -= dt;
        if (gd.windTimer <= 0) {
            gd.windTimer = 1.6 + Math.random() * 1.5;
            gd.windForce = (0.7 + Math.random() * 0.9) * (Math.random() < 0.5 ? -1 : 1);
            gd.feedbackText = gd.windForce > 0 ? "💨 ¡RÁFAGA DESDE LA IZQUIERDA!" : "💨 ¡RÁFAGA DESDE LA DERECHA!";
            gd.feedbackColor = "#ffb74d";
            gd.feedbackTimer = 1.0;
            if (window.playProceduralSound) window.playProceduralSound('click');
        }

        const gravityFactor = 4.2;
        const accel = gravityFactor * Math.sin(gd.monkAngle) + gd.windForce;
        
        gd.monkAngularVel += accel * dt;
        gd.monkAngularVel -= gd.monkAngularVel * 0.45 * dt;
        gd.monkAngle += gd.monkAngularVel * dt;

        gd.windForce -= gd.windForce * 1.5 * dt;

        if (Math.abs(gd.monkAngle) > 0.65) {
            this.triggerShake(16);
            if (window.playProceduralSound) window.playProceduralSound('damage');
            this.createExplosion(400, 320, '#00b0ff', 35, 1.8);
            gd.lives--;

            if (gd.lives <= 0) {
                this.gameOver();
                return;
            }

            gd.monkAngle = 0;
            gd.monkAngularVel = 0;
            gd.windForce = 0;
            gd.windTimer = 1.5;
            gd.feedbackText = "🥶 ¡AL AGUA! Concéntrate...";
            gd.feedbackColor = "#ff3333";
            gd.feedbackTimer = 1.5;
        }
    },

    drawMonk() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#006064';
        ctx.fillRect(0, 0, 800, 600);

        ctx.lineWidth = 1.5;
        gd.ripples.forEach(rp => {
            ctx.strokeStyle = `rgba(128, 222, 234, ${rp.alpha})`;
            ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI*2); ctx.stroke();
        });

        gd.petals.forEach(pt => {
            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(pt.angle);
            ctx.fillStyle = '#ff80ab';
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        });

        // Draw central lotus pad
        ctx.save();
        ctx.translate(400, 380);
        ctx.rotate(gd.monkAngle * 0.4);
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath(); ctx.arc(0, 0, 75, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(Math.cos(i * Math.PI/4) * 75, Math.sin(i * Math.PI/4) * 75);
            ctx.stroke();
        }
        ctx.restore();

        // Draw Chibi Monk
        ctx.save();
        ctx.translate(400, 370);
        ctx.rotate(gd.monkAngle);

        ctx.fillStyle = '#ff6f00'; // Saffron
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.quadraticCurveTo(0, -60, 30, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(-15, -15, 30, 6);

        ctx.fillStyle = '#ffe0b2';
        ctx.beginPath(); ctx.arc(0, -60, 18, 0, Math.PI*2); ctx.fill();

        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(-7, -60, 3, 0, Math.PI, true); ctx.stroke();
        ctx.beginPath(); ctx.arc(7, -60, 3, 0, Math.PI, true); ctx.stroke();

        if (Math.abs(gd.monkAngle) > 0.28) {
            ctx.fillStyle = '#00b0ff';
            ctx.font = '16px serif';
            ctx.fillText("💧", gd.monkAngle > 0 ? 15 : -28, -75);
        }
        ctx.restore();

        // Draw Balance Indicator
        ctx.save();
        ctx.translate(400, 90);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(-120, -10, 240, 20);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(-120, -10, 240, 20);
        ctx.strokeStyle = '#00ff99';
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 10); ctx.stroke();

        let cursorX = (gd.monkAngle / 0.65) * 120;
        ctx.fillStyle = Math.abs(gd.monkAngle) > 0.28 ? '#ff3333' : '#ffd700';
        ctx.beginPath();
        ctx.moveTo(cursorX - 8, -15);
        ctx.lineTo(cursorX + 8, -15);
        ctx.lineTo(cursorX, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // HUD Header
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🧘‍♂️ Meditación Zen: ¡Sobrevive!`, 25, 29);
        ctx.fillText(`Tiempo: ${this.score}s`, 360, 29);

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        // Feedback
        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 24px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 180);
            ctx.restore();
        }
    },

    inputMonkPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const torque = 1.45;
        if (x < 400) {
            gd.monkAngularVel -= torque; // nudge left
            this.createExplosion(x, y, '#e0f7fa', 3, 0.6);
        } else {
            gd.monkAngularVel += torque; // nudge right
            this.createExplosion(x, y, '#e0f7fa', 3, 0.6);
        }
        if (window.playProceduralSound) window.playProceduralSound('click');
    },

    setupDeer() {
        this.gameData = {
            lives: 3,
            deers: [
                { x: 100, y: 380, vx: 70, w: 60, hunger: 1, state: 'walk', targetX: 200 },
                { x: 600, y: 440, vx: -50, w: 60, hunger: 2, state: 'walk', targetX: 400 }
            ],
            cookies: [],
            enemies: [],
            spawnTimer: 1.0,
            feedbackText: "",
            feedbackColor: "#00ff99",
            feedbackTimer: 0.0,
            crumbParticles: []
        };
        this.score = 0;
    },

    updateDeer(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.8 + Math.random() * 1.5;
            
            if (Math.random() < 0.75) {
                const side = Math.random() < 0.5 ? 0 : 1;
                const newX = side === 0 ? -70 : 870;
                const speed = (50 + Math.random() * 60) * (side === 0 ? 1 : -1);
                gd.deers.push({
                    x: newX,
                    y: 350 + Math.random() * 100,
                    vx: speed,
                    w: 60,
                    hunger: Math.floor(Math.random() * 2) + 1,
                    state: 'walk',
                    targetX: side === 0 ? 300 + Math.random() * 300 : 100 + Math.random() * 300
                });
            }

            if (Math.random() < 0.5) {
                gd.enemies.push({
                    x: 820,
                    y: 80 + Math.random() * 80,
                    vx: -150 - Math.random() * 70,
                    vy: 0,
                    w: 40,
                    type: 'crow',
                    age: 0
                });
            }
        }

        // Update Deer positions
        for (let i = gd.deers.length - 1; i >= 0; i--) {
            const d = gd.deers[i];
            if (d.state === 'walk') {
                d.x += d.vx * dt;
                if ((d.vx > 0 && d.x > 840) || (d.vx < 0 && d.x < -80)) {
                    gd.deers.splice(i, 1);
                    continue;
                }
            } else if (d.state === 'eat') {
                d.eatTimer -= dt;
                if (d.eatTimer <= 0) {
                    d.state = 'walk';
                }
            }
        }

        // Update enemies
        for (let i = gd.enemies.length - 1; i >= 0; i--) {
            const e = gd.enemies[i];
            e.age += dt;
            e.x += e.vx * dt;
            if (e.type === 'crow') {
                e.y += Math.sin(e.age * 5) * 2;
            }
            if (e.x < -50) {
                gd.enemies.splice(i, 1);
            }
        }

        // Update cookies
        for (let i = gd.cookies.length - 1; i >= 0; i--) {
            const c = gd.cookies[i];
            c.t += dt * 1.6;

            c.x = c.startX + (c.targetX - c.startX) * c.t;
            c.y = c.startY + (c.targetY - c.startY) * c.t - 140 * Math.sin(c.t * Math.PI);

            gd.enemies.forEach(e => {
                let dist = Math.hypot(c.x - e.x, c.y - e.y);
                if (dist < 32) {
                    gd.lives--;
                    gd.feedbackText = "🦅 ¡UN CUERVO TE ROBÓ LA GALLETA!";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.2;
                    this.triggerShake(8);
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    this.createExplosion(c.x, c.y, '#37474f', 12, 1.2);
                    gd.cookies.splice(i, 1);
                    return;
                }
            });

            if (c.t >= 1.0) {
                let fed = false;
                for (let d of gd.deers) {
                    let dist = Math.hypot(c.x - (d.x + d.w/2), c.y - d.y);
                    if (dist < 50 && d.hunger > 0) {
                        d.hunger--;
                        d.state = 'eat';
                        d.eatTimer = 1.0;
                        fed = true;

                        if (d.hunger === 0) {
                            this.score++;
                            this.createExplosion(c.x, c.y, '#ffd700', 12, 1.2);
                            if (window.playProceduralSound) window.playProceduralSound('win');
                        } else {
                            this.createExplosion(c.x, c.y, '#ff8a80', 8, 1.0);
                            if (window.playProceduralSound) window.playProceduralSound('collect');
                        }
                        break;
                    }
                }

                if (!fed) {
                    this.createExplosion(c.x, c.y, '#d7ccc8', 6, 0.7);
                    if (window.playProceduralSound) window.playProceduralSound('click');
                }

                gd.cookies.splice(i, 1);

                if (window.launchConfetti && this.score >= this.goal) window.launchConfetti();
                if (this.score >= this.goal) {
                    setTimeout(() => this.win(), 600);
                }
            }
        }
        document.getElementById('minigame-score').innerText = `Ciervos Alimentados: ${this.score}/${this.goal}`;
    },

    drawDeer() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#66bb6a';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#81d4fa';
        ctx.fillRect(0, 0, 800, 260);

        ctx.fillStyle = '#4db6ac';
        ctx.beginPath();
        ctx.moveTo(0, 260);
        ctx.lineTo(200, 180);
        ctx.lineTo(400, 260);
        ctx.lineTo(600, 150);
        ctx.lineTo(800, 260);
        ctx.closePath();
        ctx.fill();

        // Draw Basket
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(360, 530, 80, 70);
        ctx.fillStyle = '#8d6e63';
        ctx.lineWidth = 3;
        ctx.strokeRect(360, 530, 80, 70);
        ctx.fillStyle = '#a1887f';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.arc(380 + i * 12, 545, 10, 0, Math.PI*2); ctx.fill();
        }

        // Draw deers
        gd.deers.forEach(d => {
            ctx.save();
            ctx.translate(d.x, d.y);
            
            ctx.fillStyle = '#a1887f';
            ctx.fillRect(0, -30, d.w, 30);
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(15, -15, 3, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(30, -20, 3, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(45, -12, 3, 0, Math.PI*2); ctx.fill();

            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(10, 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(22, 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(38, 0); ctx.lineTo(38, 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(50, 20); ctx.stroke();

            ctx.fillStyle = '#a1887f';
            if (d.vx < 0) {
                ctx.fillRect(0, -50, 16, 25);
                ctx.beginPath();
                ctx.moveTo(-15, -55); ctx.lineTo(10, -55); ctx.lineTo(5, -38);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#5d4037';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(8, -52); ctx.lineTo(14, -68); ctx.lineTo(18, -62); ctx.stroke();
            } else {
                ctx.fillRect(d.w - 16, -50, 16, 25);
                ctx.beginPath();
                ctx.moveTo(d.w - 10, -55); ctx.lineTo(d.w + 15, -55); ctx.lineTo(d.w - 5, -38);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#5d4037';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(d.w - 8, -52); ctx.lineTo(d.w - 14, -68); ctx.lineTo(d.w - 18, -62); ctx.stroke();
            }

            if (d.state === 'eat') {
                ctx.fillStyle = '#ff4081';
                ctx.font = '16px sans-serif';
                ctx.fillText("❤️", d.w/2 - 8, -75);
            } else if (d.hunger === 2) {
                ctx.fillStyle = '#ffaa00';
                ctx.font = '15px sans-serif';
                ctx.fillText("🤤", d.w/2 - 8, -72);
            } else if (d.hunger === 1) {
                ctx.fillStyle = '#2196f3';
                ctx.font = '15px sans-serif';
                ctx.fillText("🤤", d.w/2 - 8, -72);
            }
            ctx.restore();
        });

        // Draw enemies
        gd.enemies.forEach(e => {
            ctx.save();
            ctx.translate(e.x, e.y);
            ctx.fillStyle = '#37474f';
            ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(10, -4, 6, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ffd54f';
            ctx.beginPath(); ctx.moveTo(14, -7); ctx.lineTo(24, -4); ctx.lineTo(14, -1); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#263238';
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(0, Math.sin(gd.timer * 12) > 0 ? -18 : 12);
            ctx.lineTo(4, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });

        // Draw cookies
        gd.cookies.forEach(c => {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.fillStyle = '#a1887f';
            ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#5d4037';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(-6, -4, 3, 3);
            ctx.fillRect(4, -2, 3, 3);
            ctx.fillRect(-2, 4, 3, 3);
            ctx.restore();
        });

        // HUD Header
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🌾 Ciervos Alimentados: ${this.score} / ${this.goal}`, 25, 29);

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 24px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 150);
            ctx.restore();
        }
    },

    inputDeerPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.cookies.push({
            startX: 400,
            startY: 540,
            x: 400,
            y: 540,
            targetX: x,
            targetY: y,
            t: 0.0
        });

        if (window.playProceduralSound) window.playProceduralSound('click');
    },

    setupRibbon() {
        const shapes = [
            this.generateInfinityPath(),
            this.generateSpiralPath(),
            this.generateStarPath()
        ];
        this.gameData = {
            lives: 3,
            shapes: shapes,
            currentShape: 0,
            drawing: false,
            trail: [],
            checkpoints: [],
            accuracyPoints: 0,
            totalTracedPoints: 0,
            feedbackText: "¡Mantén presionado y traza la línea!",
            feedbackColor: "#0288d1",
            feedbackTimer: 1.5
        };
        this.score = 0;
        this.loadRibbonShape(0);
    },

    generateInfinityPath() {
        const path = [];
        for (let t = 0; t <= Math.PI * 2; t += 0.08) {
            const scale = 220;
            const denom = 1 + Math.sin(t) * Math.sin(t);
            const x = 400 + (scale * Math.cos(t)) / denom;
            const y = 300 + (scale * Math.sin(t) * Math.cos(t)) / denom;
            path.push({ x, y });
        }
        return path;
    },

    generateSpiralPath() {
        const path = [];
        for (let theta = 0.5; theta < 14; theta += 0.15) {
            const r = 18 * theta;
            const x = 400 + r * Math.cos(theta);
            const y = 300 + r * Math.sin(theta);
            path.push({ x, y });
        }
        return path;
    },

    generateStarPath() {
        const path = [];
        const cx = 400, cy = 300;
        const outerR = 180, innerR = 75;
        const points = 5;
        for (let i = 0; i <= points * 2; i++) {
            const angle = (i * Math.PI) / points - Math.PI/2;
            const r = i % 2 === 0 ? outerR : innerR;
            path.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
        }
        const refinedPath = [];
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i+1];
            for (let f = 0; f < 1.0; f += 0.08) {
                refinedPath.push({
                    x: p1.x + (p2.x - p1.x) * f,
                    y: p1.y + (p2.y - p1.y) * f
                });
            }
        }
        refinedPath.push(path[path.length - 1]);
        return refinedPath;
    },

    loadRibbonShape(idx) {
        const gd = this.gameData;
        if (!gd) return;
        const path = gd.shapes[idx];
        gd.checkpoints = path.map((pt, i) => ({
            x: pt.x,
            y: pt.y,
            hit: false,
            index: i
        }));
        gd.accuracyPoints = 0;
        gd.totalTracedPoints = 0;
        gd.trail = [];
    },

    updateRibbon(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.trail.forEach(t => {
            t.life -= dt * 1.5;
        });
        gd.trail = gd.trail.filter(t => t.life > 0);

        if (gd.drawing) {
            const mx = this.mouse.x;
            const my = this.mouse.y;

            gd.trail.push({ x: mx, y: my, life: 1.0, color: `hsl(${(gd.totalTracedPoints * 5) % 360}, 100%, 70%)` });

            let minDistance = 999;
            let closestCp = null;

            gd.checkpoints.forEach(cp => {
                let dist = Math.hypot(mx - cp.x, my - cp.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestCp = cp;
                }
            });

            gd.totalTracedPoints++;
            if (minDistance < 42) {
                gd.accuracyPoints++;
                if (closestCp && !closestCp.hit) {
                    closestCp.hit = true;
                    this.createExplosion(closestCp.x, closestCp.y, '#e91e63', 3, 0.5);
                    if (window.playProceduralSound) window.playProceduralSound('collect');
                }
            } else {
                gd.drawing = false;
                gd.lives--;
                gd.feedbackText = "❌ ¡SE DESVIÓ DE LA RUTA! ❌";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.5;
                this.triggerShake(7);
                if (window.playProceduralSound) window.playProceduralSound('error');
                this.loadRibbonShape(gd.currentShape);

                if (gd.lives <= 0) {
                    this.gameOver();
                    return;
                }
            }
        }
    },

    drawRibbon() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#0d0d1a';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 30; i++) {
            const sx = (i * 37) % 800;
            const sy = (i * 73) % 600;
            ctx.fillRect(sx, sy, 2, 2);
        }

        ctx.save();
        ctx.strokeStyle = 'rgba(2, 136, 209, 0.15)';
        ctx.lineWidth = 14;
        ctx.beginPath();
        gd.checkpoints.forEach((cp, idx) => {
            if (idx === 0) ctx.moveTo(cp.x, cp.y);
            else ctx.lineTo(cp.x, cp.y);
        });
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();

        // Draw checkpoints
        gd.checkpoints.forEach((cp, idx) => {
            ctx.fillStyle = cp.hit ? '#00e676' : '#ffd700';
            ctx.beginPath();
            ctx.arc(cp.x, cp.y, cp.hit ? 6 : 4, 0, Math.PI*2);
            ctx.fill();

            if (idx === 0) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px monospace';
                ctx.fillText("INICIO ⛳", cp.x - 25, cp.y - 12);
            }
        });

        // Draw trail
        ctx.save();
        for (let i = 1; i < gd.trail.length; i++) {
            const p1 = gd.trail[i - 1];
            const p2 = gd.trail[i];
            ctx.strokeStyle = p2.color;
            ctx.lineWidth = 14 * p2.life;
            ctx.lineCap = 'round';
            ctx.globalAlpha = p2.life * 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
        ctx.restore();

        // Accuracy meter HUD
        let accuracy = gd.totalTracedPoints > 0 ? Math.round((gd.accuracyPoints / gd.totalTracedPoints) * 100) : 100;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🪄 Constelaciones: ${this.score} / ${this.goal}`, 25, 29);
        ctx.fillText(`Precisión: ${accuracy}%`, 300, 29);

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 24px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 160);
            ctx.restore();
        }
    },

    inputRibbonPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const start = gd.checkpoints[0];
        if (start && Math.hypot(x - start.x, y - start.y) < 55) {
            gd.drawing = true;
            start.hit = true;
            gd.totalTracedPoints = 1;
            gd.accuracyPoints = 1;
            if (window.playProceduralSound) window.playProceduralSound('collect');
        }
    },

    releaseRibbon(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.drawing) {
            gd.drawing = false;

            const allHit = gd.checkpoints.every(cp => cp.hit);
            let accuracy = gd.totalTracedPoints > 0 ? (gd.accuracyPoints / gd.totalTracedPoints) : 0;

            if (allHit && accuracy >= 0.8) {
                this.score++;
                this.createExplosion(x, y, '#e0f7fa', 22, 1.5);
                if (window.playProceduralSound) window.playProceduralSound('win');

                gd.currentShape++;
                if (gd.currentShape >= gd.shapes.length || this.score >= this.goal) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                } else {
                    gd.feedbackText = "⭐ ¡FIGURA COMPLETADA! Próxima constelación...";
                    gd.feedbackColor = "#00e676";
                    gd.feedbackTimer = 1.5;
                    this.loadRibbonShape(gd.currentShape);
                }
            } else {
                gd.lives--;
                gd.feedbackText = allHit ? "⚠️ ¡BAJA PRECISIÓN! Traza con más cuidado ⚠️" : "⚠️ ¡TRAZO INCOMPLETO! Cubre todos los puntos ⚠️";
                gd.feedbackColor = "#ffb74d";
                gd.feedbackTimer = 1.5;
                this.triggerShake(5);
                if (window.playProceduralSound) window.playProceduralSound('error');
                this.loadRibbonShape(gd.currentShape);

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }
        }
        document.getElementById('minigame-score').innerText = `Constelaciones Completadas: ${this.score}/${this.goal}`;
    },

    setupInvestor() {
        this.gameData = {
            balance: 1000,
            assets: [
                { id: 0, name: "Matching Matcha Matcha 🍵", emoji: "🍵", price: 150, history: [150], qty: 0, maxBounds: [50, 450] },
                { id: 1, name: "Peluches de Ciervo de Nara 🦌", emoji: "🦌", price: 300, history: [300], qty: 0, maxBounds: [100, 800] },
                { id: 2, name: "Templo Omamori de la Suerte ⛩️", emoji: "⛩️", price: 500, history: [500], qty: 0, maxBounds: [200, 1200] }
            ],
            selectedAsset: 0,
            marketTimer: 45.0,
            priceUpdateTimer: 0.8,
            newsText: "Mercado abierto. Compra barato (BUY) y vende caro (SELL).",
            newsTimer: 4.0,
            floatingTexts: []
        };
        this.score = 1000;
    },

    updateInvestor(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.marketTimer -= dt;
        this.score = gd.balance;
        document.getElementById('minigame-score').innerText = `Cartera: ${this.score}¥ / ${this.goal}¥`;

        for (let i = gd.floatingTexts.length - 1; i >= 0; i--) {
            const ft = gd.floatingTexts[i];
            ft.y -= dt * 40;
            ft.timer -= dt;
            if (ft.timer <= 0) gd.floatingTexts.splice(i, 1);
        }

        if (gd.marketTimer <= 0) {
            if (gd.balance >= this.goal) {
                if (window.launchConfetti) window.launchConfetti();
                this.win();
            } else {
                this.gameOver();
            }
            return;
        }

        if (gd.balance >= this.goal) {
            if (window.launchConfetti) window.launchConfetti();
            this.win();
            return;
        }

        if (gd.newsTimer > 0) {
            gd.newsTimer -= dt;
            if (gd.newsTimer <= 0) {
                gd.newsText = "Monitoreando el mercado bursátil de Nara...";
            }
        }

        gd.priceUpdateTimer -= dt;
        if (gd.priceUpdateTimer <= 0) {
            gd.priceUpdateTimer = 0.8;
            
            let eventHappened = false;
            let eventMsg = "";
            let eventAsset = -1;
            let multiplier = 1.0;

            if (Math.random() < 0.12) {
                eventHappened = true;
                eventAsset = Math.floor(Math.random() * 3);
                const isGood = Math.random() < 0.5;
                multiplier = isGood ? 1.45 : 0.55;
                eventMsg = isGood ? 
                    `🚀 FIEBRE DE COMPRAS: ¡La demanda de ${gd.assets[eventAsset].emoji} se dispara! (+45%)` : 
                    `🚨 SE desploma la demanda de ${gd.assets[eventAsset].emoji} (-45%)`;
                gd.newsText = eventMsg;
                gd.newsTimer = 4.0;
                if (window.playProceduralSound) window.playProceduralSound('click');
            }

            gd.assets.forEach((ast, idx) => {
                let change = (Math.random() - 0.5) * 0.14;
                if (eventHappened && idx === eventAsset) {
                    ast.price = Math.round(ast.price * multiplier);
                } else {
                    ast.price = Math.round(ast.price * (1 + change));
                }

                ast.price = Math.max(ast.maxBounds[0], Math.min(ast.maxBounds[1], ast.price));
                
                ast.history.push(ast.price);
                if (ast.history.length > 20) {
                    ast.history.shift();
                }
            });
        }
    },

    drawInvestor() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#0a0b10';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
        }
        for (let y = 0; y < 600; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
        }

        const chartW = 460;
        const chartH = 260;
        const chartX = 40;
        const chartY = 120;

        ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
        ctx.fillRect(chartX, chartY, chartW, chartH);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(chartX, chartY, chartW, chartH);

        const selAst = gd.assets[gd.selectedAsset];
        
        if (selAst.history.length > 1) {
            ctx.save();
            const maxVal = selAst.maxBounds[1];
            const minVal = selAst.maxBounds[0];
            const range = maxVal - minVal;

            ctx.strokeStyle = '#39ff14';
            ctx.lineWidth = 3.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#39ff14';
            ctx.beginPath();

            const stepX = chartW / 19;
            selAst.history.forEach((val, idx) => {
                const px = chartX + idx * stepX;
                const py = chartY + chartH - ((val - minVal) / range) * chartH;
                if (idx === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();
        }

        const cardX = 540;
        const cardW = 220;
        const cardH = 85;
        const cardYStart = 120;

        gd.assets.forEach((ast, idx) => {
            const cy = cardYStart + idx * (cardH + 12);
            const isSelected = gd.selectedAsset === idx;

            ctx.fillStyle = isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(30, 30, 45, 0.6)';
            ctx.strokeStyle = isSelected ? '#00f0ff' : '#455a64';
            ctx.lineWidth = isSelected ? 3.0 : 1.5;
            ctx.fillRect(cardX, cy, cardW, cardH);
            ctx.strokeRect(cardX, cy, cardW, cardH);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(`${ast.emoji} Recuerdo ${idx + 1}`, cardX + 15, cy + 25);
            ctx.font = '10px monospace';
            ctx.fillText(ast.name.slice(0, 24), cardX + 15, cy + 42);

            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = '#39ff14';
            ctx.fillText(`P: ${ast.price}¥`, cardX + 15, cy + 65);

            ctx.fillStyle = '#ffb74d';
            ctx.fillText(`Tengo: ${ast.qty}`, cardX + 130, cy + 65);
        });

        gd.floatingTexts.forEach(ft => {
            ctx.save();
            ctx.fillStyle = ft.color;
            ctx.font = 'bold 22px monospace';
            ctx.shadowBlur = 8;
            ctx.shadowColor = ft.color;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(40, 400, 720, 40);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40, 400, 720, 40);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`NOTICIAS: ${gd.newsText}`, 55, 424);

        const btnBuyX = 100;
        const btnSellX = 280;
        const btnW = 140;
        const btnH = 50;
        const btnY = 475;

        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(btnBuyX, btnY, btnW, btnH);
        ctx.strokeStyle = '#39ff14';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(btnBuyX, btnY, btnW, btnH);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText("COMPRAR (BUY)", btnBuyX + 14, btnY + 31);

        ctx.fillStyle = '#c62828';
        ctx.fillRect(btnSellX, btnY, btnW, btnH);
        ctx.strokeStyle = '#ff3333';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(btnSellX, btnY, btnW, btnH);
        ctx.fillStyle = '#ffffff';
        ctx.fillText("VENDER (SELL)", btnSellX + 16, btnY + 31);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`📊 Especulador de Recuerdos: ${gd.balance}¥ / ${this.goal}¥`, 25, 29);
        
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`Cierre de Mercado en: ${Math.max(0, Math.ceil(gd.marketTimer))}s`, 500, 29);
    },

    inputInvestorPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const cardX = 540;
        const cardW = 220;
        const cardH = 85;
        const cardYStart = 120;
        for (let i = 0; i < 3; i++) {
            const cy = cardYStart + i * (cardH + 12);
            if (x >= cardX && x <= cardX + cardW && y >= cy && y <= cy + cardH) {
                gd.selectedAsset = i;
                if (window.playProceduralSound) window.playProceduralSound('click');
                return;
            }
        }

        const selAst = gd.assets[gd.selectedAsset];
        const btnBuyX = 100;
        const btnSellX = 280;
        const btnW = 140;
        const btnH = 50;
        const btnY = 475;

        if (x >= btnBuyX && x <= btnBuyX + btnW && y >= btnY && y <= btnY + btnH) {
            if (gd.balance >= selAst.price) {
                gd.balance -= selAst.price;
                selAst.qty++;
                gd.floatingTexts.push({ x: x, y: y, text: `-${selAst.price}¥`, color: '#ff3333', timer: 0.8 });
                this.createExplosion(x + 70, y + 25, '#ff3333', 6, 0.8);
                if (window.playProceduralSound) window.playProceduralSound('collect');
            } else {
                if (window.playProceduralSound) window.playProceduralSound('error');
            }
        }

        if (x >= btnSellX && x <= btnSellX + btnW && y >= btnY && y <= btnY + btnH) {
            if (selAst.qty > 0) {
                gd.balance += selAst.price;
                selAst.qty--;
                gd.floatingTexts.push({ x: x, y: y, text: `+${selAst.price}¥`, color: '#39ff14', timer: 0.8 });
                this.createExplosion(x + 70, y + 25, '#39ff14', 8, 1.0);
                if (window.playProceduralSound) window.playProceduralSound('win');
            } else {
                if (window.playProceduralSound) window.playProceduralSound('error');
            }
        }
    },

    setupZen() {
        const kanjis = [
            {
                name: "人 (Persona)",
                strokes: [
                    [{ x: 400, y: 150 }, { x: 380, y: 200 }, { x: 340, y: 280 }, { x: 280, y: 380 }],
                    [{ x: 360, y: 240 }, { x: 400, y: 290 }, { x: 460, y: 350 }, { x: 520, y: 380 }]
                ]
            },
            {
                name: "山 (Montaña)",
                strokes: [
                    [{ x: 400, y: 140 }, { x: 400, y: 220 }, { x: 400, y: 300 }, { x: 400, y: 380 }],
                    [{ x: 280, y: 240 }, { x: 280, y: 320 }, { x: 280, y: 375 }, { x: 340, y: 375 }, { x: 400, y: 375 }, { x: 460, y: 375 }, { x: 520, y: 375 }],
                    [{ x: 520, y: 240 }, { x: 520, y: 300 }, { x: 520, y: 375 }]
                ]
            }
        ];
        this.gameData = {
            lives: 3,
            kanjis: kanjis,
            currentKanjiIdx: 0,
            currentStrokeIdx: 0,
            drawing: false,
            userBrushTrail: [],
            drawnStrokes: [],
            feedbackText: "Sigue los números y las flechas de trazo.",
            feedbackColor: "#616161",
            feedbackTimer: 2.0,
            hankoStamped: false,
            hankoTimer: 0
        };
        this.score = 0;
    },

    updateZen(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;
        if (gd.hankoTimer > 0) gd.hankoTimer -= dt;

        if (gd.drawing) {
            const mx = this.mouse.x;
            const my = this.mouse.y;
            gd.userBrushTrail.push({ x: mx, y: my });
        }
    },

    drawZen() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#f7f1e3';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = 'rgba(139, 125, 107, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(30, 30, 740, 540);

        const currentKanji = gd.kanjis[gd.currentKanjiIdx];

        if (currentKanji) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 171, 0, 0.25)';
            ctx.lineWidth = 26;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            
            const currentStroke = currentKanji.strokes[gd.currentStrokeIdx];
            if (currentStroke) {
                currentStroke.forEach((pt, idx) => {
                    if (idx === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                });
            }
            ctx.stroke();
            ctx.restore();

            if (currentStroke && currentStroke.length > 0) {
                ctx.fillStyle = '#ff6f00';
                ctx.font = 'bold 16px sans-serif';
                const start = currentStroke[0];
                ctx.fillText(`T${gd.currentStrokeIdx + 1} 🎯`, start.x - 28, start.y - 12);
            }
        }

        ctx.save();
        ctx.strokeStyle = '#212121';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        gd.drawnStrokes.forEach(stroke => {
            ctx.lineWidth = 14;
            ctx.beginPath();
            stroke.points.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
        });
        ctx.restore();

        if (gd.drawing && gd.userBrushTrail.length > 1) {
            ctx.save();
            ctx.strokeStyle = 'rgba(33, 33, 33, 0.85)';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            gd.userBrushTrail.forEach((pt, idx) => {
                ctx.lineWidth = 15 - Math.min(8, idx * 0.15);
                if (idx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
            ctx.restore();
        }

        if (gd.hankoStamped) {
            ctx.save();
            ctx.fillStyle = 'rgba(198, 40, 40, 0.9)';
            ctx.strokeStyle = '#c62828';
            ctx.lineWidth = 3;
            ctx.fillRect(660, 460, 60, 60);
            ctx.strokeRect(660, 460, 60, 60);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px serif';
            ctx.fillText("書", 678, 497);
            ctx.restore();
        }

        // HUD Header
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🖌️ Caligrafía Shodo: ${currentKanji ? currentKanji.name : ""}`, 25, 29);
        ctx.fillText(`Kanjis: ${this.score} / ${this.goal}`, 380, 29);

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 24px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 520);
            ctx.restore();
        }
    },

    inputZenPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const currentKanji = gd.kanjis[gd.currentKanjiIdx];
        if (!currentKanji) return;
        const currentStroke = currentKanji.strokes[gd.currentStrokeIdx];
        if (!currentStroke) return;

        const startPt = currentStroke[0];
        if (Math.hypot(x - startPt.x, y - startPt.y) < 55) {
            gd.drawing = true;
            gd.userBrushTrail = [{ x, y }];
            if (window.playProceduralSound) window.playProceduralSound('collect');
        }
    },

    releaseZen(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.drawing) {
            gd.drawing = false;

            const currentKanji = gd.kanjis[gd.currentKanjiIdx];
            const currentStroke = currentKanji.strokes[gd.currentStrokeIdx];

            let matches = true;
            let totalDeviation = 0;

            if (gd.userBrushTrail.length < 5) {
                matches = false;
            } else {
                const endPt = currentStroke[currentStroke.length - 1];
                const finalUserPt = gd.userBrushTrail[gd.userBrushTrail.length - 1];
                if (Math.hypot(finalUserPt.x - endPt.x, finalUserPt.y - endPt.y) > 65) {
                    matches = false;
                } else {
                    currentStroke.forEach(guidePt => {
                        let nearestDist = 999;
                        gd.userBrushTrail.forEach(userPt => {
                            let d = Math.hypot(userPt.x - guidePt.x, userPt.y - guidePt.y);
                            if (d < nearestDist) nearestDist = d;
                        });
                        totalDeviation += nearestDist;
                        if (nearestDist > 55) {
                            matches = false;
                        }
                    });
                }
            }

            if (matches) {
                gd.drawnStrokes.push({ points: gd.userBrushTrail });
                this.createExplosion(x, y, '#212121', 8, 1.0);
                if (window.playProceduralSound) window.playProceduralSound('success');

                gd.currentStrokeIdx++;
                if (gd.currentStrokeIdx >= currentKanji.strokes.length) {
                    this.score++;
                    gd.hankoStamped = true;
                    gd.hankoTimer = 2.0;
                    if (window.playProceduralSound) window.playProceduralSound('win');

                    gd.currentKanjiIdx++;
                    if (gd.currentKanjiIdx >= gd.kanjis.length || this.score >= this.goal) {
                        if (window.launchConfetti) window.launchConfetti();
                        setTimeout(() => this.win(), 850);
                    } else {
                        gd.feedbackText = "⛩️ ¡KANJI COMPLETADO! Siguiente...";
                        gd.feedbackColor = "#00e676";
                        gd.feedbackTimer = 2.0;
                        gd.currentStrokeIdx = 0;
                        gd.drawnStrokes = [];
                        gd.hankoStamped = false;
                    }
                } else {
                    gd.feedbackText = "✒️ ¡Buen Trazo!";
                    gd.feedbackColor = "#29b6f6";
                    gd.feedbackTimer = 1.0;
                }
            } else {
                gd.lives--;
                gd.feedbackText = "❌ TRAZO INCORRECTO. Sigue las guías.";
                gd.feedbackColor = "#d50000";
                gd.feedbackTimer = 1.5;
                this.triggerShake(5);
                if (window.playProceduralSound) window.playProceduralSound('error');

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }

            gd.userBrushTrail = [];
        }
        document.getElementById('minigame-score').innerText = `Kanjis Escritos: ${this.score}/${this.goal}`;
    },

    setupEngineer() {
        this.gameData = {
            lives: 3,
            levels: [],
            craneX: 400,
            craneSpeed: 2.2,
            craneTimer: 0.0,
            currentBlock: { x: 400, y: 100, w: 200, h: 50 },
            towerOffset: 0.0,
            state: 'playing',
            earthquakeTimer: 0.0,
            earthquakeAmp: 0.0,
            shakeX: 0
        };
        this.score = 0;
    },

    updateEngineer(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.state === 'playing') {
            gd.craneTimer += dt;
            gd.currentBlock.x = 400 + 190 * Math.sin(gd.craneTimer * gd.craneSpeed);
        }
        else if (gd.state === 'dropping') {
            gd.currentBlock.y += dt * 450;

            let landingY = 520;
            let targetX = 400;

            if (gd.levels.length > 0) {
                const prev = gd.levels[gd.levels.length - 1];
                landingY = prev.y - gd.currentBlock.h;
                targetX = prev.x;
            }

            if (gd.currentBlock.y >= landingY) {
                gd.currentBlock.y = landingY;
                const offset = gd.currentBlock.x - targetX;

                if (Math.abs(offset) > gd.currentBlock.w / 2 + 10) {
                    gd.lives--;
                    gd.state = 'playing';
                    gd.currentBlock.y = 100;
                    gd.currentBlock.w = Math.max(70, 200 - gd.levels.length * 30);
                    this.triggerShake(12);
                    if (window.playProceduralSound) window.playProceduralSound('error');

                    if (gd.lives <= 0) {
                        this.gameOver();
                    }
                } else {
                    gd.levels.push({
                        x: gd.currentBlock.x,
                        y: gd.currentBlock.y,
                        w: gd.currentBlock.w,
                        h: gd.currentBlock.h
                    });
                    this.score++;
                    gd.towerOffset += offset * 0.15;
                    this.createExplosion(gd.currentBlock.x, gd.currentBlock.y + gd.currentBlock.h, '#d7ccc8', 15, 1.2);
                    this.triggerShake(5);
                    if (window.playProceduralSound) window.playProceduralSound('collect');

                    if (gd.levels.length >= this.goal) {
                        gd.state = 'earthquake';
                        gd.earthquakeTimer = 3.0;
                        if (window.playProceduralSound) window.playProceduralSound('click');
                    } else {
                        gd.state = 'playing';
                        gd.currentBlock.y = 100;
                        gd.currentBlock.w = Math.max(70, 200 - gd.levels.length * 30);
                    }
                }
            }
        }
        else if (gd.state === 'earthquake') {
            gd.earthquakeTimer -= dt;
            this.triggerShake(15);

            gd.towerOffset += (gd.towerOffset > 0 ? 1 : -1) * dt * 10;
            gd.shakeX = (Math.random() - 0.5) * 12;

            if (Math.abs(gd.towerOffset) > 65) {
                gd.state = 'collapse';
                if (window.playProceduralSound) window.playProceduralSound('damage');
            }

            if (gd.earthquakeTimer <= 0) {
                if (window.launchConfetti) window.launchConfetti();
                this.win();
            }
        }
        else if (gd.state === 'collapse') {
            let allOut = true;
            gd.levels.forEach((lvl, idx) => {
                lvl.y += dt * 300;
                lvl.x += (idx % 2 === 0 ? 150 : -150) * dt;
                if (lvl.y < 650) allOut = false;
            });
            if (allOut) {
                this.gameOver();
            }
        }
        document.getElementById('minigame-score').innerText = `Secciones Apiladas: ${this.score}/${this.goal}`;
    },

    drawEngineer() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(0, 520, 800, 80);

        if (gd.state === 'playing') {
            ctx.strokeStyle = '#37474f';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(400, 0);
            ctx.lineTo(gd.currentBlock.x, gd.currentBlock.y);
            ctx.stroke();
        }

        gd.levels.forEach((lvl, idx) => {
            ctx.save();
            ctx.translate(lvl.x + (gd.state === 'earthquake' ? gd.shakeX : 0), lvl.y);
            
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(-lvl.w/2, 0, lvl.w, lvl.h);

            ctx.fillStyle = '#c62828';
            ctx.fillRect(-lvl.w/2 + 10, 0, 15, lvl.h);
            ctx.fillRect(lvl.w/2 - 25, 0, 15, lvl.h);

            ctx.fillStyle = '#ffd54f';
            ctx.beginPath();
            ctx.moveTo(-lvl.w/2 - 12, 0);
            ctx.lineTo(lvl.w/2 + 12, 0);
            ctx.lineTo(lvl.w/2 - 2, -10);
            ctx.lineTo(-lvl.w/2 + 2, -10);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });

        if (gd.state === 'playing' || gd.state === 'dropping') {
            ctx.save();
            ctx.translate(gd.currentBlock.x, gd.currentBlock.y);
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(-gd.currentBlock.w/2, 0, gd.currentBlock.w, gd.currentBlock.h);
            ctx.fillStyle = '#c62828';
            ctx.fillRect(-gd.currentBlock.w/2 + 10, 0, 15, gd.currentBlock.h);
            ctx.fillRect(gd.currentBlock.w/2 - 25, 0, 15, gd.currentBlock.h);
            ctx.fillStyle = '#ffd54f';
            ctx.beginPath();
            ctx.moveTo(-gd.currentBlock.w/2 - 12, 0);
            ctx.lineTo(gd.currentBlock.w/2 + 12, 0);
            ctx.lineTo(gd.currentBlock.w/2 - 2, -10);
            ctx.lineTo(-gd.currentBlock.w/2 + 2, -10);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        if (gd.state === 'earthquake') {
            ctx.fillStyle = 'rgba(255, 51, 51, 0.15)';
            ctx.fillRect(0,0,800,600);
            ctx.fillStyle = '#ff3333';
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("⚠️ ¡PRUEBA DE SISMO GRADO 7! ⚠️", 400, 220);
            ctx.font = '14px monospace';
            ctx.fillText("¡Resistiendo oscilación estructural!", 400, 250);
            ctx.textAlign = 'left';
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🏗️ Secciones Apiladas: ${this.score} / ${this.goal}`, 25, 29);

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);
    },

    inputEngineerPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.state === 'playing') {
            gd.state = 'dropping';
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
    },

    setupGuardian() {
        this.gameData = {
            progress: 0.0,
            lives: 3,
            lastTap: '',
            stunnedTimer: 0.0,
            debris: [],
            spawnTimer: 0.0,
            pillarIndex: 1,
            feedbackText: "¡Cruza el Pilar Sagrado!",
            feedbackColor: "#0288d1",
            feedbackTimer: 2.0
        };
        this.score = 1;
    },

    updateGuardian(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        this.score = gd.pillarIndex;
        document.getElementById('minigame-score').innerText = `Pilar Cruzado: ${gd.pillarIndex - 1}/3`;

        if (gd.stunnedTimer > 0) {
            gd.stunnedTimer -= dt;
            return;
        }

        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.0 + Math.random() * 1.2 - (gd.pillarIndex * 0.2);
            gd.debris.push({
                x: 360 + Math.random() * 80,
                y: -30,
                vy: 250 + Math.random() * 100,
                size: 20 + Math.random() * 20
            });
        }

        for (let i = gd.debris.length - 1; i >= 0; i--) {
            const deb = gd.debris[i];
            deb.y += deb.vy * dt;

            let dist = Math.hypot(deb.x - 400, deb.y - 340);
            if (dist < 40) {
                gd.lives--;
                gd.stunnedTimer = 1.5;
                gd.feedbackText = "💥 ¡GOLPE DE ASTILLA! Aturdido 💥";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.5;
                this.triggerShake(12);
                if (window.playProceduralSound) window.playProceduralSound('damage');
                this.createExplosion(deb.x, deb.y, '#8d6e63', 12, 1.0);
                gd.debris.splice(i, 1);

                if (gd.lives <= 0) {
                    this.gameOver();
                }
                return;
            }

            if (deb.y > 620) gd.debris.splice(i, 1);
        }
    },

    drawGuardian() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#263238';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(0, 0, 340, 600);
        ctx.fillRect(460, 0, 340, 600);

        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 6;
        for (let x = 60; x < 340; x += 80) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
        }
        for (let x = 480; x < 800; x += 80) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
        }

        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(340, 0, 120, 600);

        ctx.save();
        ctx.translate(400, 340);
        if (gd.stunnedTimer > 0) {
            ctx.fillStyle = '#ffe0b2';
            ctx.beginPath(); ctx.arc(0, -10, 16, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ffd54f';
            ctx.font = '14px sans-serif';
            ctx.fillText("💫", -10, -32);
        } else {
            ctx.fillStyle = '#1976d2';
            ctx.fillRect(-15, -15, 30, 40);
            ctx.fillStyle = '#ffe0b2';
            ctx.beginPath(); ctx.arc(0, -25, 14, 0, Math.PI*2); ctx.fill();
            
            ctx.font = '16px sans-serif';
            const face = gd.progress > 0.7 ? "😤" : (gd.progress > 0.4 ? "😫" : "😅");
            ctx.fillText(face, -10, -45);
        }
        ctx.restore();

        gd.debris.forEach(deb => {
            ctx.fillStyle = '#78909c';
            ctx.fillRect(deb.x - deb.size/2, deb.y - deb.size/2, deb.size, deb.size);
            ctx.strokeStyle = '#37474f';
            ctx.lineWidth = 2;
            ctx.strokeRect(deb.x - deb.size/2, deb.y - deb.size/2, deb.size, deb.size);
        });

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(300, 80, 20, 440);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(300, 80, 20, 440);
        ctx.fillStyle = '#00ff99';
        ctx.fillRect(300, 80 + 440 - (gd.progress * 440), 20, gd.progress * 440);

        ctx.fillStyle = '#b0bec5';
        ctx.fillRect(80, 500, 140, 50);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(80, 500, 140, 50);
        ctx.fillStyle = '#212121';
        ctx.font = 'bold 16px monospace';
        ctx.fillText("IZQUIERDA (A)", 95, 532);

        ctx.fillStyle = '#b0bec5';
        ctx.fillRect(580, 500, 140, 50);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(580, 500, 140, 50);
        ctx.fillStyle = '#212121';
        ctx.fillText("DERECHA (D)", 600, 532);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🪵 Pilar Sagrado Todai-ji: Pilar ${gd.pillarIndex} / 3`, 25, 29);

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 24px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 180);
            ctx.restore();
        }
    },

    inputGuardianPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.stunnedTimer > 0) return;

        let pressType = '';
        if (x >= 80 && x <= 220 && y >= 500 && y <= 550) {
            pressType = 'L';
        }
        if (x >= 580 && x <= 720 && y >= 500 && y <= 550) {
            pressType = 'R';
        }

        if (pressType === '') return;

        if (pressType !== gd.lastTap) {
            gd.lastTap = pressType;
            gd.progress += 0.045;
            this.createExplosion(400, 350, '#d7ccc8', 3, 0.5);
            if (window.playProceduralSound) window.playProceduralSound('collect');

            if (gd.progress >= 1.0) {
                if (window.playProceduralSound) window.playProceduralSound('success');
                gd.pillarIndex++;

                if (gd.pillarIndex > this.goal) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                } else {
                    gd.progress = 0.0;
                    gd.lastTap = '';
                    gd.feedbackText = `¡Pilar ${gd.pillarIndex - 1} Cruzado! Avanzando al siguiente...`;
                    gd.feedbackColor = "#00ff99";
                    gd.feedbackTimer = 2.0;
                }
            }
        } else {
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
        document.getElementById('minigame-score').innerText = `Pilares Cruzados: ${gd.pillarIndex - 1}/3`;
    },

    // ==========================================================
    // DAY 6 MINIGAMES - NIJO & IMPERIAL PALACE
    // ==========================================================

    setupEvasion() {
        this.gameData = {
            progress: 0.0,
            lives: 3,
            walking: false,
            guardTimer: 2.0,
            guardState: 'away', // 'away', 'alert', 'looking'
            guardStateTimer: 0.0,
            feedbackText: "Mantén presionado para avanzar en silencio.",
            feedbackColor: "#0288d1",
            feedbackTimer: 2.0,
            ripples: []
        };
        this.score = 0;
    },

    updateEvasion(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.guardStateTimer -= dt;
        if (gd.guardStateTimer <= 0) {
            if (gd.guardState === 'away') {
                gd.guardState = 'alert';
                gd.guardStateTimer = 0.8 + Math.random() * 0.6;
            } else if (gd.guardState === 'alert') {
                gd.guardState = 'looking';
                gd.guardStateTimer = 1.2 + Math.random() * 1.0;
            } else {
                gd.guardState = 'away';
                gd.guardStateTimer = 2.0 + Math.random() * 2.0;
            }
        }

        if (gd.walking) {
            if (gd.guardState === 'looking') {
                gd.lives--;
                gd.walking = false;
                gd.progress = Math.max(0, gd.progress - 15);
                gd.feedbackText = "🚨 ¡EL GUARDIA SE GIRÓ! Detente...";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.5;
                this.triggerShake(12);
                if (window.playProceduralSound) window.playProceduralSound('damage');
                if (gd.lives <= 0) {
                    this.gameOver();
                    return;
                }
            } else {
                gd.progress += dt * 10;
                this.score = Math.floor(gd.progress);
                if (Math.random() < 0.18) {
                    gd.ripples.push({ x: 130 + gd.progress * 5.0, y: 350 + (Math.random() - 0.5) * 15, r: 2, alpha: 0.8 });
                    if (window.playProceduralSound) window.playProceduralSound('click');
                }
            }
        }

        for (let i = gd.ripples.length - 1; i >= 0; i--) {
            const rp = gd.ripples[i];
            rp.r += dt * 30;
            rp.alpha -= dt * 1.5;
            if (rp.alpha <= 0) gd.ripples.splice(i, 1);
        }

        if (gd.progress >= 100) {
            if (window.launchConfetti) window.launchConfetti();
            this.win();
        }
        document.getElementById('minigame-score').innerText = `Progreso: ${Math.floor(gd.progress)}%`;
    },

    drawEvasion() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
        skyGrad.addColorStop(0, '#ff7043');
        skyGrad.addColorStop(1, '#ffca28');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#006064';
        ctx.fillRect(0, 320, 800, 280);

        gd.ripples.forEach(rp => {
            ctx.strokeStyle = `rgba(128, 222, 234, ${rp.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI*2); ctx.stroke();
        });

        ctx.fillStyle = '#90a4ae';
        ctx.beginPath();
        ctx.moveTo(100, 350);
        ctx.quadraticCurveTo(400, 240, 700, 350);
        ctx.lineTo(700, 410);
        ctx.quadraticCurveTo(400, 300, 100, 410);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#37474f';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.save();
        const lx = 130 + gd.progress * 5.0;
        const ly = 325 - 40 * Math.sin((gd.progress / 100) * Math.PI);
        ctx.translate(lx, ly);
        
        ctx.fillStyle = '#e91e63';
        ctx.fillRect(-12, -25, 24, 30);
        ctx.fillStyle = '#ffe0b2';
        ctx.beginPath(); ctx.arc(0, -35, 12, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(650, 320);
        ctx.fillStyle = '#263238';
        ctx.fillRect(-15, -30, 30, 36);
        ctx.fillStyle = '#ffe0b2';
        ctx.beginPath(); ctx.arc(0, -42, 14, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(-16, -55, 32, 15);

        if (gd.guardState === 'away') {
            ctx.fillStyle = '#00ff99';
            ctx.font = '14px sans-serif';
            ctx.fillText("De espaldas 💤", -40, -65);
        } else if (gd.guardState === 'alert') {
            ctx.fillStyle = '#ffb300';
            ctx.font = 'bold 22px sans-serif';
            ctx.fillText("⚠️", -10, -65);
        } else {
            ctx.fillStyle = '#ff3333';
            ctx.font = 'bold 22px sans-serif';
            ctx.fillText("👀 ¡MIRANDO!", -45, -65);
        }
        ctx.restore();

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🌉 Evasión en el Puente: ${Math.floor(gd.progress)}%`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 24px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 160);
            ctx.restore();
        }
    },

    inputEvasionPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;
        gd.walking = true;
    },

    releaseEvasion(x, y) {
        const gd = this.gameData;
        if (!gd) return;
        gd.walking = false;
    },

    setupSeal() {
        const seals = [];
        for (let i = 0; i < 5; i++) {
            seals.push({
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 400,
                found: false,
                scale: 1.0,
                pulseDir: 1
            });
        }
        this.gameData = {
            seals: seals,
            lives: 1,
            timer: 25.0,
            feedbackText: "¡Busca los 5 sellos Tokugawa con la linterna!",
            feedbackColor: "#ffd700",
            feedbackTimer: 2.0
        };
        this.score = 0;
    },

    updateSeal(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.timer -= dt;
        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.timer <= 0) {
            this.gameOver();
            return;
        }

        gd.seals.forEach(s => {
            s.scale += dt * 2.0 * s.pulseDir;
            if (s.scale > 1.3) s.pulseDir = -1;
            if (s.scale < 0.8) s.pulseDir = 1;
        });

        document.getElementById('minigame-score').innerText = `Sellos Encontrados: ${this.score}/5`;
    },

    drawSeal() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#1e1c18';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = 'rgba(100,80,40,0.18)';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, 700, 500);
        ctx.beginPath();
        ctx.moveTo(400, 50); ctx.lineTo(400, 550);
        ctx.stroke();

        const mx = this.mouse.x;
        const my = this.mouse.y;

        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, 110, 0, Math.PI*2);
        ctx.rect(800, 0, -800, 600);
        ctx.clip();
        ctx.fillStyle = 'rgba(0,0,0,0.96)';
        ctx.fillRect(0,0,800,600);
        ctx.restore();

        gd.seals.forEach(s => {
            const dist = Math.hypot(mx - s.x, my - s.y);
            const inRange = dist < 120;
            
            if (inRange || s.found) {
                ctx.save();
                ctx.translate(s.x, s.y);
                ctx.scale(s.scale, s.scale);
                
                ctx.shadowBlur = s.found ? 20 : 10;
                ctx.shadowColor = '#ffd700';
                ctx.fillStyle = '#ffd700';
                ctx.strokeStyle = '#b59300';
                ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                for (let a = 0; a < 3; a++) {
                    const angle = a * Math.PI * 2/3 - Math.PI/2;
                    ctx.beginPath();
                    ctx.ellipse(Math.cos(angle)*14, Math.sin(angle)*14, 10, 6, angle, 0, Math.PI*2);
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
            }
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🔍 Sello del Shogun: ${this.score} / ${this.goal}`, 25, 29);
        ctx.fillText(`Tiempo: ${Math.max(0, Math.ceil(gd.timer))}s`, 640, 29);
    },

    inputSealPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.seals.forEach(s => {
            if (!s.found && Math.hypot(x - s.x, y - s.y) < 36) {
                s.found = true;
                this.score++;
                this.createExplosion(s.x, s.y, '#ffd700', 16, 1.3);
                if (window.playProceduralSound) window.playProceduralSound('win');

                if (this.score >= this.goal) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                }
            }
        });
    },

    setupClouds() {
        const animals = [
            { name: "Dragón Volador 🐉", emoji: "🐉", scale: 1.0, rot: (Math.floor(Math.random() * 7) + 1) * Math.PI / 4, x: 200, y: 530 },
            { name: "Ciervo Sagrado 🦌", emoji: "🦌", scale: 1.0, rot: (Math.floor(Math.random() * 7) + 1) * Math.PI / 4, x: 400, y: 530 },
            { name: "Águila Imperial 🦅", emoji: "🦅", scale: 1.0, rot: (Math.floor(Math.random() * 7) + 1) * Math.PI / 4, x: 600, y: 530 }
        ];
        this.gameData = {
            animals: animals,
            selectedIdx: -1,
            targetSilhouette: 1, // Deer
            placed: false,
            feedbackText: "¡Arrastra y rota el animal correcto para que encaje en posición vertical!",
            feedbackColor: "#0288d1",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateClouds(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;
        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.selectedIdx !== -1 && this.mouse.isDown) {
            const an = gd.animals[gd.selectedIdx];
            // Smooth drag interpolation
            an.x += (this.mouse.x - an.x) * 0.3;
            an.y += (this.mouse.y - an.y) * 0.3;
        }

        // Check success condition continuously
        if (gd.selectedIdx === gd.targetSilhouette && this.score === 0) {
            const an = gd.animals[gd.selectedIdx];
            const dist = Math.hypot(an.x - 400, an.y - 240);
            
            // Normalize angle to [0, 2PI)
            let angle = an.rot % (Math.PI * 2);
            if (angle < 0) angle += Math.PI * 2;
            
            // Success if close to target position and rotation is vertical (0 or 2PI)
            const isCorrectAngle = angle < 0.1 || Math.abs(angle - Math.PI * 2) < 0.1;
            
            if (dist < 45 && isCorrectAngle) {
                this.score = 1;
                this.createExplosion(400, 240, '#ffd700', 30, 1.8);
                if (window.playProceduralSound) window.playProceduralSound('win');
                if (window.launchConfetti) window.launchConfetti();
                setTimeout(() => this.win(), 700);
            }
        }
        document.getElementById('minigame-score').innerText = `Objetivos encajados: ${this.score}/1`;
    },

    drawClouds() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#b2dfdb';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#004d40';
        ctx.fillRect(0, 420, 800, 180);

        ctx.save();
        ctx.translate(400, 240);
        ctx.fillStyle = 'rgba(0, 77, 64, 0.4)';
        ctx.strokeStyle = '#00796b';
        ctx.lineWidth = 5;
        
        ctx.beginPath();
        ctx.arc(0, -60, 45, 0, Math.PI*2);
        ctx.arc(-25, 0, 65, 0, Math.PI*2);
        ctx.fillRect(-15, 60, 12, 100);
        ctx.fillRect(15, 60, 12, 100);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        gd.animals.forEach((an, idx) => {
            const isSelected = gd.selectedIdx === idx;
            ctx.save();
            ctx.translate(an.x, an.y);
            ctx.rotate(an.rot);
            
            ctx.fillStyle = isSelected ? '#ff4081' : '#ffffff';
            ctx.strokeStyle = '#00796b';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            
            ctx.font = '36px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(an.emoji, 0, 12);
            ctx.restore();
        });

        if (gd.selectedIdx !== -1) {
            ctx.fillStyle = '#004d40';
            ctx.font = 'bold 13px monospace';
            ctx.fillText("Usa los botones [ROTAR] para ajustar el ángulo.", 40, 480);
            
            ctx.fillStyle = '#ff7043';
            ctx.fillRect(660, 450, 100, 40);
            ctx.fillStyle = '#ffffff';
            ctx.fillText("🔄 ROTAR", 680, 474);
        }

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🌲 Jardín de Nubes: Encaja el animal que representa el pino`, 25, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 100);
            ctx.restore();
        }
    },

    inputCloudsPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.selectedIdx !== -1 && x >= 660 && x <= 760 && y >= 450 && y <= 490) {
            const an = gd.animals[gd.selectedIdx];
            an.rot += Math.PI / 4;
            if (window.playProceduralSound) window.playProceduralSound('click');
            return;
        }

        gd.animals.forEach((an, idx) => {
            if (Math.hypot(x - an.x, y - an.y) < 40) {
                gd.selectedIdx = idx;
                if (window.playProceduralSound) window.playProceduralSound('click');
            }
        });

        if (gd.selectedIdx !== -1) {
            const an = gd.animals[gd.selectedIdx];
            an.x = x;
            an.y = y;
        }
        document.getElementById('minigame-score').innerText = `Objetivos encajados: ${this.score}/1`;
    },

    setupNinjaSteps() {
        this.gameData = {
            lives: 3,
            steps: [],
            spawnTimer: 1.0,
            feedbackText: "¡Pisa cuando los pies crucen la zona verde!",
            feedbackColor: "#00ff99",
            feedbackTimer: 2.0,
            streak: 0
        };
        this.score = 0;
    },

    updateNinjaSteps(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.6 + Math.random() * 0.5 - Math.min(0.6, this.score * 0.04);
            gd.steps.push({
                y: -40,
                x: 400 + (Math.random() < 0.5 ? -100 : 100),
                hit: false
            });
        }

        const speed = 200 + this.score * 6;
        for (let i = gd.steps.length - 1; i >= 0; i--) {
            const st = gd.steps[i];
            st.y += speed * dt;

            if (st.y > 540) {
                if (!st.hit) {
                    gd.lives--;
                    gd.streak = 0;
                    gd.feedbackText = "🔊 ¡CHIRRIDO! Suelo ruiseñor activado.";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.0;
                    this.triggerShake(8);
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    if (gd.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                }
                gd.steps.splice(i, 1);
            }
        }
        document.getElementById('minigame-score').innerText = `Pasos Completados: ${this.score}/${this.goal}`;
    },

    drawNinjaSteps() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 4;
        for (let x = 200; x < 700; x += 100) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
        }

        ctx.fillStyle = 'rgba(0, 230, 118, 0.2)';
        ctx.fillRect(250, 450, 300, 45);
        ctx.strokeStyle = '#00e676';
        ctx.lineWidth = 3;
        ctx.strokeRect(250, 450, 300, 45);

        gd.steps.forEach(st => {
            ctx.save();
            ctx.translate(st.x, st.y);
            ctx.fillStyle = '#ffb74d';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffb74d';
            
            ctx.beginPath();
            ctx.ellipse(0, 0, 14, 20, 0.05, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath(); ctx.arc(-10, -22, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(-3, -24, 4.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(4, -23, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(10, -20, 3, 0, Math.PI*2); ctx.fill();

            ctx.restore();
        });

        ctx.fillStyle = '#4caf50';
        ctx.fillRect(320, 520, 160, 55);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(320, 520, 160, 55);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText("🥷 PISAR (SPACE)", 332, 554);

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`👣 Pasos de Ninja: ${this.score} / ${this.goal}`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 22px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 200);
            ctx.restore();
        }
    },

    inputNinjaStepsPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (x >= 320 && x <= 480 && y >= 520 && y <= 575) {
            let nearest = null;
            let minDist = 999;
            let idx = -1;

            gd.steps.forEach((st, i) => {
                let dist = Math.abs(st.y - 472);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = st;
                    idx = i;
                }
            });

            if (nearest && minDist < 36) {
                nearest.hit = true;
                this.score++;
                gd.streak++;
                gd.feedbackText = "🤫 SIGILO PERFECTO";
                gd.feedbackColor = "#00e676";
                gd.feedbackTimer = 0.8;
                this.createExplosion(nearest.x, nearest.y, '#00ff99', 10, 1.1);
                if (window.playProceduralSound) window.playProceduralSound('collect');

                gd.steps.splice(idx, 1);

                if (window.launchConfetti && this.score >= this.goal) window.launchConfetti();
                if (this.score >= this.goal) {
                    setTimeout(() => this.win(), 600);
                }
            } else {
                gd.lives--;
                gd.streak = 0;
                gd.feedbackText = "🔊 ¡RUIDO DETECTADO! 🔊";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 0.8;
                this.triggerShake(7);
                if (window.playProceduralSound) window.playProceduralSound('error');

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    },

    setupTactical() {
        const guards = [
            { x: 300, y: 150, r: 120, sweepAngle: 0, speed: 2, range: [0, Math.PI] },
            { x: 500, y: 350, r: 110, sweepAngle: Math.PI, speed: 1.5, range: [Math.PI, Math.PI*2] }
        ];
        const nodes = [
            { x: 100, y: 500, state: 'visited' },
            { x: 220, y: 380, state: 'open' },
            { x: 150, y: 200, state: 'open' },
            { x: 380, y: 260, state: 'open' },
            { x: 550, y: 180, state: 'open' },
            { x: 680, y: 300, state: 'open' },
            { x: 700, y: 100, state: 'exit' }
        ];
        this.gameData = {
            guards: guards,
            nodes: nodes,
            currentNodeIdx: 0,
            lives: 3,
            feedbackText: "¡Toca los nodos conectados para llegar al tejado sin que te vean!",
            feedbackColor: "#0288d1",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateTactical(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.guards.forEach(g => {
            g.sweepAngle += dt * g.speed;
            
            const playerNode = gd.nodes[gd.currentNodeIdx];
            if (playerNode) {
                const dist = Math.hypot(playerNode.x - g.x, playerNode.y - g.y);
                if (dist < g.r) {
                    const relAngle = Math.atan2(playerNode.y - g.y, playerNode.x - g.x);
                    const diff = Math.abs(relAngle - (g.sweepAngle % (Math.PI*2)));
                    if (diff < 0.35) {
                        gd.lives--;
                        gd.currentNodeIdx = 0;
                        gd.feedbackText = "🚨 ¡DETECTADO POR GUARDIA!";
                        gd.feedbackColor = "#ff3333";
                        gd.feedbackTimer = 1.5;
                        this.triggerShake(12);
                        if (window.playProceduralSound) window.playProceduralSound('damage');
                        if (gd.lives <= 0) {
                            this.gameOver();
                        }
                    }
                }
            }
        });
        document.getElementById('minigame-score').innerText = `Nodo Actual: ${gd.currentNodeIdx + 1}/${gd.nodes.length}`;
    },

    drawTactical() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#eceff1';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#90a4ae';
        ctx.lineWidth = 15;
        ctx.strokeRect(30, 30, 740, 540);

        ctx.strokeStyle = 'rgba(0, 172, 193, 0.4)';
        ctx.lineWidth = 3.5;
        gd.nodes.forEach((n, idx) => {
            if (idx < gd.nodes.length - 1) {
                const next = gd.nodes[idx + 1];
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();
            }
        });

        gd.nodes.forEach((n, idx) => {
            const isCurrent = gd.currentNodeIdx === idx;
            ctx.fillStyle = isCurrent ? '#00e676' : (n.state === 'exit' ? '#e53935' : '#00b0ff');
            ctx.beginPath(); ctx.arc(n.x, n.y, isCurrent ? 14 : 10, 0, Math.PI*2); ctx.fill();
            
            if (n.state === 'exit') {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px sans-serif';
                ctx.fillText("TEJADO 🏯", n.x - 25, n.y - 18);
            }
        });

        gd.guards.forEach(g => {
            ctx.fillStyle = '#ff1744';
            ctx.beginPath(); ctx.arc(g.x, g.y, 8, 0, Math.PI*2); ctx.fill();

            ctx.save();
            ctx.translate(g.x, g.y);
            ctx.rotate(g.sweepAngle);
            
            const grad = ctx.createRadialGradient(0,0,10, 0,0,g.r);
            grad.addColorStop(0, 'rgba(255, 235, 59, 0.45)');
            grad.addColorStop(1, 'rgba(255, 235, 59, 0.0)');
            ctx.fillStyle = grad;
            
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.arc(0,0, g.r, -0.35, 0.35);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🧭 Infiltración Nijo: Esquiva las linternas`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 160);
            ctx.restore();
        }
    },

    inputTacticalPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.nodes.forEach((n, idx) => {
            if (Math.hypot(x - n.x, y - n.y) < 32) {
                if (idx === gd.currentNodeIdx + 1) {
                    gd.currentNodeIdx = idx;
                    if (window.playProceduralSound) window.playProceduralSound('collect');
                    this.createExplosion(n.x, n.y, '#00e676', 6, 0.8);

                    if (n.state === 'exit') {
                        this.score = 1;
                        if (window.launchConfetti) window.launchConfetti();
                        setTimeout(() => this.win(), 600);
                    }
                }
            }
        });
    },

    setupEdict() {
        this.gameData = {
            basketX: 400,
            words: [],
            spawnTimer: 1.0,
            lives: 3,
            sentence: [],
            feedbackText: "¡Atrapa palabras verdes/azules para formar el Edicto Imperial!",
            feedbackColor: "#ffd54f",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateEdict(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.basketX = Math.max(80, Math.min(720, this.mouse.x));

        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.2 + Math.random() * 0.6;
            const isForbidden = Math.random() < 0.35;
            const wordsList = isForbidden ? 
                ["IMPUESTO ❌", "GUERRA ❌", "CASTIGO ❌"] : 
                ["PROHIBIDO 📜", "LLORAR 📜", "SMILE 📜", "CORRER 📜", "COMER 📜", "SALTAR 📜"];
            
            gd.words.push({
                x: 100 + Math.random() * 600,
                y: -20,
                vy: 160 + Math.random() * 80,
                text: wordsList[Math.floor(Math.random() * wordsList.length)],
                forbidden: isForbidden
            });
        }

        for (let i = gd.words.length - 1; i >= 0; i--) {
            const w = gd.words[i];
            w.y += w.vy * dt;

            if (w.y >= 500 && w.y <= 540 && Math.abs(w.x - gd.basketX) < 65) {
                if (w.forbidden) {
                    gd.lives--;
                    gd.feedbackText = "❌ ¡PALABRA PROHIBIDA! Ley arruinada.";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.0;
                    this.triggerShake(10);
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    if (gd.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                } else {
                    const cleanWord = w.text.replace(" 📜", "");
                    gd.sentence.push(cleanWord);
                    this.score++;
                    this.createExplosion(w.x, w.y, '#ffd54f', 12, 1.2);
                    if (window.playProceduralSound) window.playProceduralSound('collect');

                    if (this.score >= this.goal) {
                        if (window.launchConfetti) window.launchConfetti();
                        setTimeout(() => this.win(), 800);
                    }
                }
                gd.words.splice(i, 1);
                continue;
            }

            if (w.y > 620) gd.words.splice(i, 1);
        }
        document.getElementById('minigame-score').innerText = `Leyes Redactadas: ${this.score}/${this.goal}`;
    },

    drawEdict() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#efebe9';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = 'rgba(141, 110, 99, 0.15)';
        ctx.lineWidth = 5;
        ctx.strokeRect(40, 40, 720, 520);

        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(60, 60, 680, 50);
        ctx.fillStyle = '#0a0a0a';
        ctx.font = 'bold 15px monospace';
        ctx.fillText(`DECRETO: Queda ${gd.sentence.join(" + ")}`, 80, 92);

        gd.words.forEach(w => {
            ctx.save();
            ctx.fillStyle = w.forbidden ? '#c62828' : '#1565c0';
            ctx.fillRect(w.x - 65, w.y - 16, 130, 32);
            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(w.x - 65, w.y - 16, 130, 32);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(w.text, w.x, w.y + 5);
            ctx.restore();
        });

        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(gd.basketX - 55, 520, 110, 25);
        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(gd.basketX - 60, 510, 120, 10);

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`📜 Edicto Imperial: Captura las palabras`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 200);
            ctx.restore();
        }
    },

    inputEdictPress(x, y) {
    },

    setupTimeTravel() {
        const items = [];
        const types = ["cable 🔌", "móvil 📱", "vending 🥤", "turista 🎒"];
        for (let i = 0; i < 10; i++) {
            items.push({
                x: 80 + Math.random() * 640,
                y: 120 + Math.random() * 320,
                type: types[i % types.length],
                removed: false
            });
        }
        this.gameData = {
            items: items,
            lives: 3,
            timer: 20.0,
            feedbackText: "¡Elimina los 10 objetos modernos para la foto de 1600!",
            feedbackColor: "#0288d1",
            feedbackTimer: 2.0
        };
        this.score = 0;
    },

    updateTimeTravel(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.timer -= dt;
        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.timer <= 0) {
            this.gameOver();
        }
        document.getElementById('minigame-score').innerText = `Elementos Limpiados: ${this.score}/10`;
    },

    drawTimeTravel() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(0, 450, 800, 150);
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(600, 200, 120, 250);

        gd.items.forEach(it => {
            if (!it.removed) {
                ctx.save();
                ctx.translate(it.x, it.y);
                ctx.fillStyle = '#e53935';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.fillRect(-35, -20, 70, 40);
                ctx.strokeRect(-35, -20, 70, 40);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(it.type, 0, 5);
                ctx.restore();
            }
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`📸 Sannenzaka 1600: Limpia los elementos modernos`, 25, 29);
        ctx.fillText(`Tiempo: ${Math.max(0, Math.ceil(gd.timer))}s`, 640, 29);
    },

    inputTimeTravelPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.items.forEach(it => {
            if (!it.removed && x >= it.x - 35 && x <= it.x + 35 && y >= it.y - 20 && y <= it.y + 20) {
                it.removed = true;
                this.score++;
                this.createExplosion(it.x, it.y, '#e53935', 15, 1.2);
                if (window.playProceduralSound) window.playProceduralSound('collect');

                if (this.score >= 10) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                }
            }
        });
    },

    setupRing() {
        this.gameData = {
            steps: 0,
            tempoTimer: 0.0,
            bpm: 80,
            targetAngle: 0.0,
            playerX: 400,
            feedbackText: "¡Toca la pantalla al compás del círculo que parpadea!",
            feedbackColor: "#0288d1",
            feedbackTimer: 2.0
        };
        this.score = 0;
    },

    updateRing(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.tempoTimer += dt;
        
        gd.pulseScale = 1.0 + 0.28 * Math.sin(gd.tempoTimer * (gd.bpm / 60) * Math.PI * 2);

        this.score = gd.steps;
        document.getElementById('minigame-score').innerText = `Pasos Registrados: ${gd.steps}/100`;
    },

    drawRing() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#eceff1';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#b0bec5';
        ctx.lineWidth = 3;
        for (let r = 80; r < 360; r += 60) {
            ctx.beginPath(); ctx.arc(400, 300, r, 0, Math.PI*2); ctx.stroke();
        }

        ctx.save();
        ctx.translate(400, 300);
        ctx.scale(gd.pulseScale, gd.pulseScale);
        ctx.strokeStyle = 'rgba(0, 150, 136, 0.4)';
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI*2); ctx.stroke();
        ctx.restore();

        ctx.save();
        const angle = gd.steps * (Math.PI * 2 / 100) - Math.PI/2;
        const cx = 400 + Math.cos(angle) * 180;
        const cy = 300 + Math.sin(angle) * 180;
        ctx.translate(cx, cy);

        ctx.fillStyle = '#1976d2';
        ctx.fillRect(-10, -25, 20, 26);
        ctx.fillStyle = '#ffe0b2';
        ctx.beginPath(); ctx.arc(0, -32, 10, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`⏱️ Paso Imperial: Sincroniza al ritmo`, 25, 29);
        ctx.fillText(`Pasos: ${gd.steps} / 100`, 360, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 140);
            ctx.restore();
        }
    },

    inputRingPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const cycle = (gd.bpm / 60) * Math.PI * 2;
        const val = Math.sin(gd.tempoTimer * cycle);
        
        if (val > 0.65) {
            gd.steps += 3;
            if (gd.steps > 100) gd.steps = 100;
            this.createExplosion(400, 300, '#009688', 5, 0.8);
            if (window.playProceduralSound) window.playProceduralSound('collect');

            if (gd.steps >= 100) {
                if (window.launchConfetti) window.launchConfetti();
                setTimeout(() => this.win(), 600);
            }
        } else {
            gd.steps = Math.max(0, gd.steps - 4);
            gd.feedbackText = "⚠️ ¡FUERA DE RITMO! Sigue la pulsación.";
            gd.feedbackColor = "#ff3333";
            gd.feedbackTimer = 0.8;
            this.triggerShake(4);
            if (window.playProceduralSound) window.playProceduralSound('error');
        }
    },

    setupClan() {
        this.gameData = {
            timer: 10.0,
            poses: [0, 1, 2, 0],
            targetPose: 1,
            feedbackText: "¡Haz que todos los miembros hagan la pose seria (pose 1)!",
            feedbackColor: "#ffd54f",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateClan(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.timer -= dt;
        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.timer <= 0) {
            const allMatched = gd.poses.every(p => p === gd.targetPose);
            if (allMatched) {
                this.score = 1;
                if (window.launchConfetti) window.launchConfetti();
                this.win();
            } else {
                this.gameOver();
            }
        }
        document.getElementById('minigame-score').innerText = `Temporizador Foto: ${Math.max(0, Math.ceil(gd.timer))}s`;
    },

    drawClan() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#455a64';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#b0bec5';
        ctx.fillRect(100, 100, 600, 350);

        const memberX = [200, 330, 470, 600];
        const colors = ['#e91e63', '#1976d2', '#ff9800', '#9c27b0'];
        const labels = ["LAURA 🦊", "IVÁN 🐉", "MAMÁ 👩", "PAPÁ 👨"];

        gd.poses.forEach((pose, idx) => {
            ctx.save();
            ctx.translate(memberX[idx], 360);
            
            ctx.fillStyle = colors[idx];
            if (pose === 0) {
                ctx.fillRect(-15, -40, 30, 45);
                ctx.fillStyle = '#ffe0b2';
                ctx.fillRect(-28, -35, 12, 10);
                ctx.fillRect(16, -35, 12, 10);
            } else if (pose === 1) {
                ctx.fillRect(-12, -45, 24, 50);
                ctx.fillStyle = '#5d4037';
                ctx.fillRect(-16, -30, 32, 12);
            } else {
                ctx.fillRect(-12, -40, 24, 45);
                ctx.fillStyle = '#ffe0b2';
                ctx.fillRect(14, -45, 10, 20);
            }

            ctx.fillStyle = '#ffe0b2';
            ctx.beginPath(); ctx.arc(0, -60, 16, 0, Math.PI*2); ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(labels[idx], -25, 30);
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`📸 Retrato de Familia: Sincroniza poses`, 25, 29);
        ctx.fillText(`Foto en: ${Math.max(0, Math.ceil(gd.timer))}s`, 640, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 160);
            ctx.restore();
        }
    },

    inputClanPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const memberX = [200, 330, 470, 600];
        for (let i = 0; i < 4; i++) {
            if (Math.abs(x - memberX[i]) < 45 && y >= 260 && y <= 420) {
                gd.poses[i] = (gd.poses[i] + 1) % 3;
                if (window.playProceduralSound) window.playProceduralSound('click');
                this.createExplosion(memberX[i], 320, '#ffffff', 5, 0.7);
                break;
            }
        }
    },

    // ==========================================================
    // DAY 7 MINIGAMES - KIYOMIZU-DERA & GION
    // ==========================================================

    setupKimono() {
        this.gameData = {
            visitors: [
                { x: -50, vx: 110, style: 'modern', active: true, width: 40 },
                { x: 900, vx: -95, style: 'kimono', active: true, width: 45 }
            ],
            spawnTimer: 1.0,
            lives: 3,
            feedbackText: "¡Saca una foto a los paseantes con KIMONO! (Toca para disparar)",
            feedbackColor: "#f06292",
            feedbackTimer: 2.5
        };
        this.score = 0;
    },

    updateKimono(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.4 + Math.random() * 1.2;
            const side = Math.random() < 0.5 ? 0 : 1;
            const style = Math.random() < 0.5 ? 'kimono' : 'modern';
            gd.visitors.push({
                x: side === 0 ? -60 : 860,
                vx: (80 + Math.random() * 70) * (side === 0 ? 1 : -1),
                style: style,
                active: true,
                width: style === 'kimono' ? 45 : 40
            });
        }

        for (let i = gd.visitors.length - 1; i >= 0; i--) {
            const v = gd.visitors[i];
            v.x += v.vx * dt;
            if ((v.vx > 0 && v.x > 880) || (v.vx < 0 && v.x < -80)) {
                gd.visitors.splice(i, 1);
            }
        }
        document.getElementById('minigame-score').innerText = `Fotos de Kimono: ${this.score}/${this.goal}`;
    },

    drawKimono() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#efebe9';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(620, 120, 80, 240);
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(600, 360, 120, 150);

        gd.visitors.forEach(v => {
            if (v.active) {
                ctx.save();
                ctx.translate(v.x, 380);
                
                if (v.style === 'kimono') {
                    ctx.fillStyle = '#f06292';
                    ctx.fillRect(-15, -40, 30, 45);
                    ctx.fillStyle = '#ffe0b2';
                    ctx.beginPath(); ctx.arc(0, -50, 12, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle = '#ffeb3b';
                    ctx.fillRect(-16, -26, 32, 8);
                } else {
                    ctx.fillStyle = '#1e88e5';
                    ctx.fillRect(-10, -20, 20, 25);
                    ctx.fillStyle = '#e53935';
                    ctx.fillRect(-10, -40, 20, 20);
                    ctx.fillStyle = '#ffe0b2';
                    ctx.beginPath(); ctx.arc(0, -48, 10, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
            }
        });

        ctx.strokeStyle = 'rgba(255, 64, 129, 0.4)';
        ctx.lineWidth = 3;
        ctx.strokeRect(300, 240, 200, 200);
        ctx.beginPath(); ctx.moveTo(400, 220); ctx.lineTo(400, 260); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(400, 380); ctx.lineTo(400, 420); ctx.stroke();

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`👘 Cazadora de Kimonos: ${this.score} / ${this.goal}`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 180);
            ctx.restore();
        }
    },

    inputKimonoPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        let hit = false;
        let penalty = false;

        for (let i = 0; i < gd.visitors.length; i++) {
            const v = gd.visitors[i];
            if (v.active && v.x >= 280 && v.x <= 520) {
                v.active = false;
                if (v.style === 'kimono') {
                    hit = true;
                    this.score++;
                    this.createExplosion(v.x, 360, '#f06292', 15, 1.3);
                    if (window.playProceduralSound) window.playProceduralSound('collect');

                    if (this.score >= this.goal) {
                        if (window.launchConfetti) window.launchConfetti();
                        setTimeout(() => this.win(), 600);
                    }
                } else {
                    penalty = true;
                }
                break;
            }
        }

        if (penalty) {
            gd.lives--;
            gd.feedbackText = "❌ ¡ERROR! Foto a turista moderno.";
            gd.feedbackColor = "#ff3333";
            gd.feedbackTimer = 1.0;
            this.triggerShake(7);
            if (window.playProceduralSound) window.playProceduralSound('error');

            if (gd.lives <= 0) {
                this.gameOver();
            }
        } else if (!hit) {
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
    },

    setupKintsugi() {
        const cracks = [
            [{ x: 250, y: 220 }, { x: 300, y: 260 }, { x: 350, y: 290 }, { x: 400, y: 300 }],
            [{ x: 400, y: 300 }, { x: 450, y: 320 }, { x: 500, y: 360 }, { x: 580, y: 420 }],
            [{ x: 550, y: 180 }, { x: 500, y: 230 }, { x: 450, y: 270 }, { x: 400, y: 300 }]
        ];
        this.gameData = {
            cracks: cracks,
            currentCrackIdx: 0,
            drawing: false,
            trail: [],
            accuracyPoints: 0,
            totalTracedPoints: 0,
            lives: 3,
            feedbackText: "¡Rellena las grietas del plato con resina de oro!",
            feedbackColor: "#ffd700",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateKintsugi(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.drawing) {
            const mx = this.mouse.x;
            const my = this.mouse.y;
            gd.trail.push({ x: mx, y: my });

            const activeCrack = gd.cracks[gd.currentCrackIdx];
            if (activeCrack) {
                let minD = 999;
                activeCrack.forEach(pt => {
                    let d = Math.hypot(mx - pt.x, my - pt.y);
                    if (d < minD) minD = d;
                });

                gd.totalTracedPoints++;
                if (minD < 38) {
                    gd.accuracyPoints++;
                    this.createExplosion(mx, my, '#ffd700', 1, 0.4);
                } else {
                    gd.drawing = false;
                    gd.lives--;
                    gd.feedbackText = "❌ ¡PULSO INESTABLE! Oro derramado.";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.5;
                    this.triggerShake(6);
                    if (window.playProceduralSound) window.playProceduralSound('error');
                    gd.trail = [];
                    gd.accuracyPoints = 0;
                    gd.totalTracedPoints = 0;

                    if (gd.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        document.getElementById('minigame-score').innerText = `Grietas Reparadas: ${this.score}/${this.goal}`;
    },

    drawKintsugi() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#3e2723';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#faf8f5';
        ctx.beginPath(); ctx.arc(400, 300, 180, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#d7ccc8';
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.save();
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        gd.cracks.forEach((cr, idx) => {
            const isCompleted = idx < gd.currentCrackIdx;
            ctx.strokeStyle = isCompleted ? '#ffd700' : 'rgba(93, 64, 55, 0.45)';
            ctx.lineWidth = isCompleted ? 7 : 3;
            
            ctx.beginPath();
            cr.forEach((pt, pidx) => {
                if (pidx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
        });
        ctx.restore();

        if (gd.drawing && gd.trail.length > 1) {
            ctx.save();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            gd.trail.forEach((pt, pidx) => {
                if (pidx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
            ctx.restore();
        }

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🏺 Restauración Kintsugi: ${this.score} / ${this.goal}`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 130);
            ctx.restore();
        }
    },

    inputKintsugiPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        const activeCrack = gd.cracks[gd.currentCrackIdx];
        if (activeCrack) {
            const startPt = activeCrack[0];
            if (Math.hypot(x - startPt.x, y - startPt.y) < 45) {
                gd.drawing = true;
                gd.trail = [{ x, y }];
                gd.totalTracedPoints = 1;
                gd.accuracyPoints = 1;
                if (window.playProceduralSound) window.playProceduralSound('collect');
            }
        }
    },

    releaseKintsugi(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.drawing) {
            gd.drawing = false;
            
            const activeCrack = gd.cracks[gd.currentCrackIdx];
            const endPt = activeCrack[activeCrack.length - 1];
            
            const reachedEnd = Math.hypot(x - endPt.x, y - endPt.y) < 48;
            const accuracy = gd.totalTracedPoints > 0 ? (gd.accuracyPoints / gd.totalTracedPoints) : 0;

            if (reachedEnd && accuracy >= 0.78) {
                this.score++;
                gd.currentCrackIdx++;
                this.createExplosion(x, y, '#ffd700', 16, 1.4);
                if (window.playProceduralSound) window.playProceduralSound('win');

                if (this.score >= this.goal) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                } else {
                    gd.feedbackText = "🏺 ¡GRIETA SELLADA CON ORO! Avanzando...";
                    gd.feedbackColor = "#00e676";
                    gd.feedbackTimer = 1.5;
                }
            } else {
                gd.lives--;
                gd.feedbackText = "❌ ¡TRAZO INCOMPLETO O INEXACTO!";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.5;
                this.triggerShake(7);
                if (window.playProceduralSound) window.playProceduralSound('error');

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }
            gd.trail = [];
        }
    },

    setupTea() {
        this.gameData = {
            timer: 15.0,
            cupX: 0.0,
            cupVelX: 0.0,
            trayAngle: 0.0,
            lives: 3,
            feedbackText: "Equilibra la taza de té en el centro de la bandeja.",
            feedbackColor: "#4caf50",
            feedbackTimer: 2.5
        };
        this.score = 15;
    },

    updateTea(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.timer -= dt;
        this.score = Math.max(0, Math.ceil(gd.timer));
        document.getElementById('minigame-score').innerText = `Tiempo: ${this.score}s`;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.timer <= 0) {
            if (window.launchConfetti) window.launchConfetti();
            this.win();
            return;
        }

        const offsetX = this.mouse.x - 400;
        gd.trayAngle = (offsetX / 400) * 0.45;

        const gravityEffect = 650;
        gd.cupVelX += Math.sin(gd.trayAngle) * gravityEffect * dt;
        gd.cupVelX -= gd.cupVelX * 1.5 * dt;
        gd.cupX += gd.cupVelX * dt;

        if (Math.abs(gd.cupX) > 155) {
            this.triggerShake(12);
            if (window.playProceduralSound) window.playProceduralSound('damage');
            this.createExplosion(400 + gd.cupX, 320, '#4caf50', 25, 1.4);

            gd.lives--;
            gd.cupX = 0.0;
            gd.cupVelX = 0.0;

            if (gd.lives <= 0) {
                this.gameOver();
            }
        }
    },

    drawTea() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#ffecb3';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#bcaaa4';
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, 720, 520);

        ctx.save();
        ctx.translate(400, 360);
        ctx.rotate(gd.trayAngle);
        
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(-160, -10, 320, 20);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 4;
        ctx.strokeRect(-160, -10, 320, 20);

        ctx.save();
        ctx.translate(gd.cupX, -30);
        
        ctx.fillStyle = '#faf8f5';
        ctx.beginPath();
        ctx.moveTo(-18, -15);
        ctx.lineTo(18, -15);
        ctx.lineTo(12, 20);
        ctx.lineTo(-12, 20);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#d7ccc8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.ellipse(0, -10, 14, 5, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '11px sans-serif';
        ctx.fillText("♨️", -7, -26);

        ctx.restore();
        ctx.restore();

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(250, 480, 300, 15);
        ctx.fillStyle = Math.abs(gd.cupX) > 100 ? '#ff3333' : '#00e676';
        ctx.fillRect(400 + (gd.cupX / 155) * 150 - 6, 475, 12, 25);

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🍵 Té para el Shogun: Equilibre la bandeja`, 25, 29);
        ctx.fillText(`Tiempo: ${this.score}s`, 360, 29);

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);
    },

    inputTeaPress(x, y) {
    },

    setupStoneGuardian() {
        this.gameData = {
            ringRadius: 180,
            shrinkSpeed: 160,
            direction: -1,
            targetRadius: 65,
            lives: 3,
            pressing: false,
            feedbackText: "¡Mantén presionado para cerrar los brazos en un abrazo perfecto!",
            feedbackColor: "#0288d1",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateStoneGuardian(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.pressing) {
            gd.ringRadius -= gd.shrinkSpeed * dt;
            if (gd.ringRadius < 10) {
                gd.ringRadius = 10;
                gd.pressing = false;
            }
        } else {
            gd.ringRadius = Math.min(220, gd.ringRadius + dt * 250);
        }
        document.getElementById('minigame-score').innerText = `Abrazos Completados: ${this.score}/${this.goal}`;
    },

    drawStoneGuardian() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#263238';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(320, 0, 160, 600);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 8;
        ctx.strokeRect(320, 0, 160, 600);

        ctx.save();
        ctx.translate(400, 300);
        ctx.strokeStyle = gd.pressing ? '#ffeb3b' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(0, 0, gd.ringRadius, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(400, 300);
        ctx.strokeStyle = '#00ff99';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, gd.targetRadius, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🤗 El Guardián de Piedra: Abraza el pilar`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 140);
            ctx.restore();
        }
    },

    inputStoneGuardianPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;
        gd.pressing = true;
        if (window.playProceduralSound) window.playProceduralSound('click');
    },

    releaseStoneGuardian(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.pressing) {
            gd.pressing = false;
            
            const diff = Math.abs(gd.ringRadius - gd.targetRadius);
            if (diff < 15) {
                this.score++;
                this.createExplosion(400, 300, '#00ff99', 20, 1.4);
                if (window.playProceduralSound) window.playProceduralSound('win');

                if (this.score >= this.goal) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                } else {
                    gd.feedbackText = "🔥 ¡ABRAZO PERFECTO! Sigue así.";
                    gd.feedbackColor = "#00e676";
                    gd.feedbackTimer = 1.2;
                }
            } else {
                gd.lives--;
                gd.feedbackText = "❌ ¡ABRAZO FLOJO O DEMASIADO FUERTE!";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.2;
                this.triggerShake(7);
                if (window.playProceduralSound) window.playProceduralSound('error');

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    },

    setupStructural() {
        this.gameData = {
            lives: 3,
            columnX: 400,
            weights: [],
            spawnTimer: 1.0,
            feedbackText: "¡Coloca los pilares para absorber las esferas de peso estructural!",
            feedbackColor: "#00e5ff",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateStructural(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.columnX = Math.max(100, Math.min(700, this.mouse.x));

        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.3 - Math.min(0.5, this.score * 0.03);
            gd.weights.push({
                x: 150 + Math.random() * 500,
                y: -30,
                vy: 200 + Math.random() * 120,
                r: 16
            });
        }

        for (let i = gd.weights.length - 1; i >= 0; i--) {
            const wt = gd.weights[i];
            wt.y += wt.vy * dt;

            if (wt.y >= 420 && wt.y <= 450 && Math.abs(wt.x - gd.columnX) < 55) {
                this.score++;
                this.createExplosion(wt.x, wt.y, '#00e5ff', 12, 1.1);
                if (window.playProceduralSound) window.playProceduralSound('collect');
                gd.weights.splice(i, 1);

                if (this.score >= this.goal) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                }
                continue;
            }

            if (wt.y > 480) {
                gd.lives--;
                gd.feedbackText = "⚠️ ¡IMPACTO! Tensiones estructurales al límite.";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.0;
                this.triggerShake(12);
                if (window.playProceduralSound) window.playProceduralSound('error');
                gd.weights.splice(i, 1);

                if (gd.lives <= 0) {
                    this.gameOver();
                    return;
                }
            }
        }
        document.getElementById('minigame-score').innerText = `Cargas Soportadas: ${this.score}/${this.goal}`;
    },

    drawStructural() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#b0bec5';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#ff7043';
        ctx.fillRect(0, 480, 800, 120);

        ctx.strokeStyle = '#c62828';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(150, 480); ctx.lineTo(150, 600);
        ctx.moveTo(650, 480); ctx.lineTo(650, 600);
        ctx.stroke();

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(gd.columnX - 35, 420, 70, 70);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 4;
        ctx.strokeRect(gd.columnX - 35, 420, 70, 70);

        gd.weights.forEach(wt => {
            ctx.fillStyle = '#37474f';
            ctx.strokeStyle = '#ff3d00';
            ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.arc(wt.x, wt.y, wt.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🏗️ Cálculo de Cargas: Soporte la terraza`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 150);
            ctx.restore();
        }
    },

    inputStructuralPress(x, y) {
    },

    setupSurvival() {
        this.gameData = {
            lives: 3,
            waves: [],
            spawnTimer: 1.0,
            feedbackText: "¡Usa Matcha (Fuego), Omamori (Alma), Antídoto (Veneno)!",
            feedbackColor: "#e57373",
            feedbackTimer: 3.0,
            inventory: [
                { type: 'matcha', emoji: "🍵", x: 200, y: 520, r: 35 },
                { type: 'omamori', emoji: "⛩️", x: 400, y: 520, r: 35 },
                { type: 'antidote', emoji: "🧪", x: 600, y: 520, r: 35 }
            ]
        };
        this.score = 0;
    },

    updateSurvival(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.spawnTimer = 1.8 + Math.random() * 0.6 - Math.min(0.6, this.score * 0.04);
            const types = ['fire', 'spirit', 'poison'];
            gd.waves.push({
                x: 400,
                y: -20,
                vy: 180 + Math.random() * 80,
                type: types[Math.floor(Math.random() * 3)]
            });
        }

        for (let i = gd.waves.length - 1; i >= 0; i--) {
            const w = gd.waves[i];
            w.y += w.vy * dt;

            if (w.y > 310) {
                gd.lives--;
                gd.feedbackText = "💥 ¡LA MALDICIÓN TE ALCANZÓ!";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.0;
                this.triggerShake(10);
                if (window.playProceduralSound) window.playProceduralSound('error');
                gd.waves.splice(i, 1);

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }
        }
        document.getElementById('minigame-score').innerText = `Hechizos Repelidos: ${this.score}/${this.goal}`;
    },

    drawSurvival() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#311b92';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#4a148c';
        ctx.lineWidth = 10;
        ctx.strokeRect(50, 50, 700, 420);

        ctx.save();
        ctx.translate(400, 350);
        ctx.fillStyle = '#ffe0b2';
        ctx.beginPath(); ctx.arc(0, -25, 12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#1976d2';
        ctx.fillRect(-12, -12, 24, 30);
        ctx.restore();

        gd.waves.forEach(w => {
            ctx.save();
            ctx.translate(w.x, w.y);
            
            let color = '#d32f2f';
            let icon = '🔥';
            if (w.type === 'spirit') { color = '#311b92'; icon = '👻'; }
            if (w.type === 'poison') { color = '#388e3c'; icon = '🤢'; }

            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(icon, 0, 6);
            ctx.restore();
        });

        gd.inventory.forEach(item => {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.fillStyle = '#eceff1';
            ctx.strokeStyle = '#5e35b1';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, 0, item.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            
            ctx.font = '34px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.emoji, 0, 11);
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🧪 Supervivencia al Maleficio: Repele hechizos`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 140);
            ctx.restore();
        }
    },

    inputSurvivalPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.waves.length > 0) {
            const currentSpell = gd.waves[0];
            
            let clickedType = '';
            gd.inventory.forEach(item => {
                if (Math.hypot(x - item.x, y - item.y) < item.r + 10) {
                    clickedType = item.type;
                }
            });

            if (clickedType === '') return;

            const matched = (clickedType === 'matcha' && currentSpell.type === 'fire') ||
                            (clickedType === 'omamori' && currentSpell.type === 'spirit') ||
                            (clickedType === 'antidote' && currentSpell.type === 'poison');

            if (matched) {
                this.score++;
                this.createExplosion(currentSpell.x, currentSpell.y, '#e0f7fa', 15, 1.2);
                if (window.playProceduralSound) window.playProceduralSound('collect');
                gd.waves.shift();

                if (this.score >= this.goal) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                }
            } else {
                gd.lives--;
                gd.feedbackText = "❌ ¡ERROR! Elemento incorrecto.";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.0;
                this.triggerShake(7);
                if (window.playProceduralSound) window.playProceduralSound('error');

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    },

    setupAntiQuake() {
        this.gameData = {
            timer: 15.0,
            shinX: 0.0,
            shinVel: 0.0,
            lives: 3,
            quakeWave: 0.0,
            quakeTimer: 0.0,
            feedbackText: "¡Arrastra el pilar central (Shinbashira) para contrarrestar el sismo!",
            feedbackColor: "#0288d1",
            feedbackTimer: 3.0
        };
        this.score = 15;
    },

    updateAntiQuake(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.timer -= dt;
        this.score = Math.max(0, Math.ceil(gd.timer));
        document.getElementById('minigame-score').innerText = `Tiempo: ${this.score}s`;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.timer <= 0) {
            if (window.launchConfetti) window.launchConfetti();
            this.win();
            return;
        }

        gd.quakeTimer += dt * 6.5;
        gd.quakeWave = 150 * Math.sin(gd.quakeTimer) * Math.cos(gd.quakeTimer * 0.5);

        const center = this.mouse.x - 400;
        gd.shinX = Math.max(-140, Math.min(140, center));

        const delta = gd.quakeWave + gd.shinX * 2.2;
        
        if (Math.abs(delta) > 280) {
            gd.lives -= dt * 1.5;
            this.triggerShake(12);
            if (Math.random() < 0.1) {
                if (window.playProceduralSound) window.playProceduralSound('damage');
                this.createExplosion(400 + gd.shinX, 300, '#ff3333', 5, 0.9);
            }
            if (gd.lives <= 0) {
                this.gameOver();
            }
        }
    },

    drawAntiQuake() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#ffcc80';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#c62828';
        ctx.lineWidth = 12;
        ctx.strokeRect(200, 50, 400, 500);

        ctx.strokeStyle = 'rgba(255, 61, 0, 0.45)';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(400, 300);
        ctx.lineTo(400 - gd.quakeWave, 300);
        ctx.stroke();

        ctx.save();
        ctx.translate(400 + gd.shinX, 300);
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(-22, -220, 44, 440);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 4;
        ctx.strokeRect(-22, -220, 44, 440);
        ctx.restore();

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🌋 Yasaka Pagoda: Amortigüe el Sismo`, 25, 29);
        ctx.fillText(`Tiempo: ${this.score}s`, 360, 29);

        let hearts = "";
        for (let i = 0; i < Math.ceil(gd.lives); i++) hearts += "❤️ ";
        ctx.fillText(`Estructura: ${hearts}`, 600, 29);
    },

    inputAntiQuakePress(x, y) {
    },

    releaseAntiQuake(x, y) {
    },

    setupStairs() {
        this.gameData = {
            progress: 0,
            lives: 3,
            vy: 0,
            y: 450,
            jumping: false,
            obstacles: [
                { x: 600, speed: 180, w: 20 },
                { x: 900, speed: 210, w: 20 }
            ],
            feedbackText: "¡Sube 100 escalones saltando farolas y turistas!",
            feedbackColor: "#0288d1",
            feedbackTimer: 3.0
        };
        this.score = 0;
    },

    updateStairs(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.jumping) {
            gd.vy += 22 * dt;
            gd.y += gd.vy;
            if (gd.y >= 450) {
                gd.y = 450;
                gd.jumping = false;
                gd.vy = 0;
            }
        }

        gd.obstacles.forEach(obs => {
            obs.x -= obs.speed * dt;
            if (obs.x < -30) {
                obs.x = 830 + Math.random() * 200;
                gd.progress += 8;
                this.score = Math.min(100, gd.progress);
                if (window.playProceduralSound) window.playProceduralSound('collect');

                if (gd.progress >= 100) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 600);
                }
            }

            if (obs.x >= 180 && obs.x <= 220 && gd.y >= 420) {
                gd.lives--;
                obs.x = 830 + Math.random() * 200;
                gd.feedbackText = "💥 ¡TROPEZÓN EN LA ESCALERA!";
                gd.feedbackColor = "#ff3333";
                gd.feedbackTimer = 1.0;
                this.triggerShake(10);
                if (window.playProceduralSound) window.playProceduralSound('error');

                if (gd.lives <= 0) {
                    this.gameOver();
                }
            }
        });
        document.getElementById('minigame-score').innerText = `Escalones Subidos: ${this.score}/100`;
    },

    drawStairs() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#90a4ae';
        ctx.lineWidth = 6;
        for (let y = 150; y < 600; y += 45) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y + 100); ctx.stroke();
        }

        ctx.fillStyle = '#78909c';
        ctx.fillRect(0, 480, 800, 120);

        ctx.save();
        ctx.translate(200, gd.y);
        ctx.fillStyle = '#1976d2';
        ctx.fillRect(-12, -30, 24, 30);
        ctx.fillStyle = '#ffe0b2';
        ctx.beginPath(); ctx.arc(0, -40, 12, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        gd.obstacles.forEach(obs => {
            ctx.save();
            ctx.translate(obs.x, 480);
            ctx.fillStyle = '#ffd54f';
            ctx.fillRect(-10, -50, 20, 50);
            ctx.fillStyle = '#ff7043';
            ctx.beginPath(); ctx.arc(0, -50, 14, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🪜 Conquista las Escaleras: Sube 100 escalones`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);
    },

    inputStairsPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (!gd.jumping) {
            gd.jumping = true;
            gd.vy = -11.5;
            if (window.playProceduralSound) window.playProceduralSound('click');
        }
    },

    setupGeisha() {
        this.gameData = {
            sequence: [],
            userSequence: [],
            phase: 'watch',
            timer: 0.0,
            activeIdx: -1,
            activeTimer: 0.0,
            lives: 3,
            stepIndex: 0,
            feedbackText: "¡Observa los faroles e imita la melodía!",
            feedbackColor: "#ffd54f",
            feedbackTimer: 3.0,
            lanterns: [
                { x: 120, y: 300, color: '#e53935', note: 'do' },
                { x: 260, y: 300, color: '#ffb300', note: 're' },
                { x: 400, y: 300, color: '#4caf50', note: 'mi' },
                { x: 540, y: 300, color: '#1e88e5', note: 'fa' },
                { x: 680, y: 300, color: '#9c27b0', note: 'sol' }
            ]
        };
        this.score = 0;
        this.startGeishaSequence();
    },

    startGeishaSequence() {
        const gd = this.gameData;
        if (!gd) return;
        gd.sequence.push(Math.floor(Math.random() * 5));
        gd.userSequence = [];
        gd.phase = 'watch';
        gd.stepIndex = 0;
        gd.timer = 0.5;
    },

    updateGeisha(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.activeTimer > 0) {
            gd.activeTimer -= dt;
            if (gd.activeTimer <= 0) {
                gd.activeIdx = -1;
            }
        }

        if (gd.phase === 'watch') {
            gd.timer -= dt;
            if (gd.timer <= 0) {
                if (gd.stepIndex < gd.sequence.length) {
                    const idx = gd.sequence[gd.stepIndex];
                    gd.activeIdx = idx;
                    gd.activeTimer = 0.5;
                    gd.stepIndex++;
                    gd.timer = 0.8;
                    
                    if (window.playProceduralSound) window.playProceduralSound('collect');
                } else {
                    gd.phase = 'play';
                    gd.userSequence = [];
                    gd.feedbackText = "¡Tu turno! Repite la melodía.";
                    gd.feedbackColor = "#00ff99";
                    gd.feedbackTimer = 1.5;
                }
            }
        }
        document.getElementById('minigame-score').innerText = `Secuencias Completadas: ${this.score}/5`;
    },

    drawGeisha() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#1a237e';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(50, 220); ctx.lineTo(750, 220); ctx.stroke();

        gd.lanterns.forEach((lan, idx) => {
            const isActive = gd.activeIdx === idx;
            ctx.save();
            ctx.translate(lan.x, lan.y);

            ctx.strokeStyle = '#000000';
            ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(0, -40); ctx.stroke();

            if (isActive) {
                const glowGrad = ctx.createRadialGradient(0,0,10, 0,0,70);
                glowGrad.addColorStop(0, '#ffeb3b');
                glowGrad.addColorStop(1, 'rgba(255,235,59,0.0)');
                ctx.fillStyle = glowGrad;
                ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI*2); ctx.fill();
            }

            ctx.fillStyle = isActive ? '#ffeb3b' : lan.color;
            ctx.beginPath();
            ctx.moveTo(-25, -40);
            ctx.lineTo(25, -40);
            ctx.lineTo(32, 20);
            ctx.lineTo(-32, 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#212121';
            ctx.fillRect(-18, -48, 36, 8);
            ctx.fillRect(-22, 20, 44, 8);

            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🏮 Código Geisha: Memoriza la melodía`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillText(`Vidas: ${hearts}`, 600, 29);

        if (gd.feedbackTimer > 0) {
            ctx.save();
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 140);
            ctx.restore();
        }
    },

    inputGeishaPress(x, y) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.phase !== 'play') return;

        gd.lanterns.forEach((lan, idx) => {
            if (x >= lan.x - 35 && x <= lan.x + 35 && y >= lan.y - 50 && y <= lan.y + 30) {
                gd.activeIdx = idx;
                gd.activeTimer = 0.35;
                gd.userSequence.push(idx);
                if (window.playProceduralSound) window.playProceduralSound('collect');
                this.createExplosion(lan.x, lan.y, '#ffd700', 5, 0.8);

                const step = gd.userSequence.length - 1;
                if (gd.userSequence[step] !== gd.sequence[step]) {
                    gd.lives--;
                    gd.feedbackText = "❌ ¡SECUENCIA INCORRECTA!";
                    gd.feedbackColor = "#ff3333";
                    gd.feedbackTimer = 1.5;
                    this.triggerShake(7);
                    if (window.playProceduralSound) window.playProceduralSound('error');

                    if (gd.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                    gd.phase = 'watch';
                    gd.userSequence = [];
                    gd.stepIndex = 0;
                    gd.timer = 1.0;
                } else {
                    if (gd.userSequence.length === gd.sequence.length) {
                        this.score++;
                        if (window.playProceduralSound) window.playProceduralSound('win');

                        if (this.score >= this.goal) {
                            if (window.launchConfetti) window.launchConfetti();
                            setTimeout(() => this.win(), 600);
                        } else {
                            gd.feedbackText = "🔥 ¡SECUENCIA CORRECTA! Avanzando...";
                            gd.feedbackColor = "#00e676";
                            gd.feedbackTimer = 1.2;
                            setTimeout(() => this.startGeishaSequence(), 1000);
                        }
                    }
                }
            }
        });
    },

    // ==========================================================
    // DAY 8 - LAURA (9): EL RASTRILLO DEL JARDINERO
    // ==========================================================
    setupRake() {
        const rows = 15;
        const cols = 20;
        const grid = [];
        for (let r = 0; r < rows; r++) {
            grid[r] = new Array(cols).fill(false);
        }
        
        const rocks = [
            { x: 180, y: 150, r: 40, color: '#9e9e9e' },
            { x: 600, y: 220, r: 50, color: '#757575' },
            { x: 380, y: 400, r: 35, color: '#8d6e63' }
        ];
        
        const leaves = [];
        for (let i = 0; i < 8; i++) {
            leaves.push({
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 400,
                angle: Math.random() * Math.PI * 2,
                size: 8 + Math.random() * 6
            });
        }

        this.gameData = {
            grid,
            rows,
            cols,
            cellW: 800 / cols,
            cellH: 600 / rows,
            rocks,
            leaves,
            rakedCount: 0,
            totalCells: rows * cols,
            drawing: false,
            score: 0
        };
    },

    updateRake(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.drawing && this.mouse.isDown) {
            const mx = this.mouse.x;
            const my = this.mouse.y;
            const brushR = 50; 

            for (let r = 0; r < gd.rows; r++) {
                for (let c = 0; c < gd.cols; c++) {
                    const cx = (c + 0.5) * gd.cellW;
                    const cy = (r + 0.5) * gd.cellH;
                    if (Math.hypot(mx - cx, my - cy) < brushR) {
                        if (!gd.grid[r][c]) {
                            gd.grid[r][c] = true;
                            gd.rakedCount++;
                            if (Math.random() < 0.15) {
                                this.createExplosion(cx, cy, '#d7ccc8', 1, 0.4);
                            }
                        }
                    }
                }
            }
            
            gd.score = Math.floor((gd.rakedCount / gd.totalCells) * 100);
            this.score = gd.score;
            document.getElementById('minigame-score').innerText = `Progreso: ${this.score}%`;

            if (this.score >= this.goal) {
                if (window.playProceduralSound) window.playProceduralSound('win');
                if (window.launchConfetti) window.launchConfetti();
                this.win();
            }
        }
    },

    drawRake() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#efebe9';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = 'rgba(141, 110, 99, 0.08)';
        ctx.lineWidth = 2;
        for (let x = 0; x < 800; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 600);
            ctx.stroke();
        }

        ctx.fillStyle = '#e0dcd5';
        ctx.strokeStyle = '#d7ccc8';
        ctx.lineWidth = 3;
        for (let r = 0; r < gd.rows; r++) {
            for (let c = 0; c < gd.cols; c++) {
                if (gd.grid[r][c]) {
                    const x = c * gd.cellW;
                    const y = r * gd.cellH;
                    ctx.fillRect(x, y, gd.cellW, gd.cellH);
                    
                    ctx.beginPath();
                    ctx.arc(x + gd.cellW/2, y + gd.cellH/2, gd.cellW/3, 0, Math.PI*2);
                    ctx.stroke();
                }
            }
        }

        gd.rocks.forEach(rock => {
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.fillStyle = rock.color;
            ctx.beginPath();
            ctx.arc(rock.x, rock.y, rock.r, 0, Math.PI*2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.beginPath();
            ctx.arc(rock.x - rock.r*0.2, rock.y - rock.r*0.2, rock.r*0.6, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        });

        ctx.fillStyle = '#ff8a80';
        gd.leaves.forEach(leaf => {
            ctx.save();
            ctx.translate(leaf.x, leaf.y);
            ctx.rotate(leaf.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🎋 Rastrillo Zen: Cubre la arena de Tenryu-ji`, 25, 29);
        ctx.fillText(`Progreso: ${this.score}%`, 380, 29);
        ctx.fillText(`Meta: ${this.goal}%`, 650, 29);
    },

    inputRakePress(x, y) {
        const gd = this.gameData;
        if (gd) gd.drawing = true;
    },

    releaseRake(x, y) {
        const gd = this.gameData;
        if (gd) gd.drawing = false;
    },

    // ==========================================================
    // DAY 8 - IVAN (14): SINCRONIZACION DE FRECUENCIAS
    // ==========================================================
    setupWaveSync() {
        this.gameData = {
            level: 1,
            amp: 30,
            freq: 0.02,
            phase: 0.0,
            targetAmp: 60,
            targetFreq: 0.05,
            targetPhase: Math.PI / 2,
            matchTimer: 0.0,
            syncStatus: false,
            time: 0,
            activeSlider: null,
            configs: [
                { targetAmp: 50, targetFreq: 0.04, targetPhase: 1.2 },
                { targetAmp: 90, targetFreq: 0.07, targetPhase: 3.8 },
                { targetAmp: 130, targetFreq: 0.10, targetPhase: 2.2 }
            ]
        };
        this.score = 0;
        this.applyWaveLevelConfig();
    },

    applyWaveLevelConfig() {
        const gd = this.gameData;
        const config = gd.configs[gd.level - 1];
        if (config) {
            gd.targetAmp = config.targetAmp;
            gd.targetFreq = config.targetFreq;
            gd.targetPhase = config.targetPhase;
            gd.matchTimer = 0.0;
            gd.syncStatus = false;
        }
    },

    updateWaveSync(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        gd.time += dt;

        if (this.mouse.isDown && gd.activeSlider) {
            const mx = this.mouse.x;
            const pct = Math.max(0, Math.min(1, (mx - 200) / 400));
            
            if (gd.activeSlider === 'amp') {
                gd.amp = 10 + pct * 140;
            } else if (gd.activeSlider === 'freq') {
                gd.freq = 0.01 + pct * 0.11;
            } else if (gd.activeSlider === 'phase') {
                gd.phase = pct * Math.PI * 2;
            }
        } else if (!this.mouse.isDown) {
            gd.activeSlider = null;
        }

        const dAmp = Math.abs(gd.amp - gd.targetAmp);
        const dFreq = Math.abs(gd.freq - gd.targetFreq);
        const dPhase = Math.abs(gd.phase - gd.targetPhase);

        if (dAmp < 8 && dFreq < 0.006 && dPhase < 0.4) {
            gd.syncStatus = true;
            gd.matchTimer += dt;
            if (gd.matchTimer >= 1.5) {
                if (window.playProceduralSound) window.playProceduralSound('win');
                if (gd.level < 3) {
                    this.createExplosion(400, 250, '#00ff99', 25, 1.3);
                    gd.level++;
                    this.score = gd.level - 1;
                    this.applyWaveLevelConfig();
                } else {
                    this.score = 3;
                    if (window.launchConfetti) window.launchConfetti();
                    this.win();
                }
            }
        } else {
            gd.syncStatus = false;
            gd.matchTimer = 0;
        }
        
        document.getElementById('minigame-score').innerText = `Fase: ${gd.level}/3`;
    },

    drawWaveSync() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#050a05';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#002200';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 400); ctx.stroke();
        }
        for (let y = 0; y < 400; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.lineTo(800, 200);
        ctx.stroke();

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 30, 30, 0.6)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff3333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const speedOffset = gd.time * 5;
        for (let x = 0; x < 800; x++) {
            const y = 200 + gd.targetAmp * Math.sin((x + speedOffset) * gd.targetFreq + gd.targetPhase);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = gd.syncStatus ? 'rgba(0, 255, 153, 0.95)' : 'rgba(50, 255, 50, 0.85)';
        ctx.shadowBlur = 12;
        ctx.shadowColor = gd.syncStatus ? '#00ff99' : '#00e676';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let x = 0; x < 800; x++) {
            const y = 200 + gd.amp * Math.sin((x + speedOffset) * gd.freq + gd.phase);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#081208';
        ctx.fillRect(0, 400, 800, 200);
        ctx.strokeStyle = '#005500';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(800, 400); ctx.stroke();

        const drawSlider = (y, label, val, minV, maxV, color) => {
            ctx.fillStyle = '#00e676';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(label, 60, y + 5);

            ctx.fillStyle = '#113311';
            ctx.fillRect(200, y - 4, 400, 8);
            
            const pct = (val - minV) / (maxV - minV);
            ctx.fillStyle = color;
            ctx.fillRect(200, y - 4, pct * 400, 8);

            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 6;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(200 + pct * 400, y, 12, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
        };

        drawSlider(440, "AMPLITUDE", gd.amp, 10, 150, '#ffeb3b');
        drawSlider(495, "FREQUENCY", gd.freq, 0.01, 0.12, '#00e676');
        drawSlider(550, "PHASE SHIFT", gd.phase, 0, Math.PI * 2, '#29b6f6');

        ctx.fillStyle = gd.syncStatus ? '#00ff99' : '#ff1744';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        if (gd.syncStatus) {
            const holdPct = Math.min(100, Math.floor((gd.matchTimer / 1.5) * 100));
            ctx.fillText(`>>> ESTABLE: SYNC AL ${holdPct}% <<<`, 400, 370);
            ctx.fillStyle = '#00ff99';
            ctx.fillRect(300, 380, holdPct * 2, 4);
        } else {
            ctx.fillText(">>> ENLACE DESINCRONIZADO <<<", 400, 370);
        }
        ctx.textAlign = 'left';

        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`⚡ Frecuencias de Arashiyama: Nivel ${gd.level}/3`, 25, 29);
        
        let hearts = "";
        for (let i = 0; i < 3; i++) hearts += "❤️ ";
        ctx.fillText(`Canal: ${hearts}`, 600, 29);
    },

    inputWaveSyncPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;

        const checkSlider = (sliderY) => {
            return (y >= sliderY - 15 && y <= sliderY + 15 && x >= 180 && x <= 620);
        };

        if (checkSlider(440)) gd.activeSlider = 'amp';
        else if (checkSlider(495)) gd.activeSlider = 'freq';
        else if (checkSlider(550)) gd.activeSlider = 'phase';
        
        if (gd.activeSlider && window.playProceduralSound) {
            window.playProceduralSound('click');
        }
    },

    // ==========================================================
    // DAY 9 - LAURA (9): LIMPIA EL REFLEJO DE ORO
    // ==========================================================
    setupScratch() {
        const rows = 12;
        const cols = 16;
        const grid = [];
        for (let r = 0; r < rows; r++) {
            grid[r] = new Array(cols).fill(false);
        }

        this.gameData = {
            grid,
            rows,
            cols,
            cellW: 800 / cols,
            cellH: 300 / rows,
            totalPondCells: rows * cols,
            clearedCount: 0,
            drawing: false,
            score: 0,
            sparkles: []
        };
        this.score = 0;
    },

    updateScratch(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        for (let i = gd.sparkles.length - 1; i >= 0; i--) {
            const s = gd.sparkles[i];
            s.y -= s.vy * dt;
            s.x += s.vx * dt;
            s.alpha -= dt * 0.8;
            if (s.alpha <= 0) gd.sparkles.splice(i, 1);
        }

        if (gd.drawing && this.mouse.isDown) {
            const mx = this.mouse.x;
            const my = this.mouse.y;

            if (my >= 280) {
                const py = my - 300;
                const brushRadius = 55;

                for (let r = 0; r < gd.rows; r++) {
                    for (let c = 0; c < gd.cols; c++) {
                        const cx = (c + 0.5) * gd.cellW;
                        const cy = (r + 0.5) * gd.cellH;
                        if (Math.hypot(mx - cx, py - cy) < brushRadius) {
                            if (!gd.grid[r][c]) {
                                gd.grid[r][c] = true;
                                gd.clearedCount++;
                                
                                if (Math.random() < 0.4) {
                                    gd.sparkles.push({
                                        x: cx,
                                        y: cy + 300,
                                        vx: (Math.random() - 0.5) * 80,
                                        vy: 50 + Math.random() * 100,
                                        alpha: 1.0,
                                        size: 4 + Math.random() * 6
                                    });
                                }
                            }
                        }
                    }
                }

                gd.score = Math.min(100, Math.floor((gd.clearedCount / gd.totalPondCells) * 100));
                this.score = gd.score;
                document.getElementById('minigame-score').innerText = `Reflejo Limpio: ${this.score}%`;

                if (this.score >= this.goal) {
                    if (window.playProceduralSound) window.playProceduralSound('win');
                    if (window.launchConfetti) window.launchConfetti();
                    this.win();
                }
            }
        }
    },

    drawScratch() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
        skyGrad.addColorStop(0, '#80deea');
        skyGrad.addColorStop(1, '#e0f7fa');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 300);

        ctx.fillStyle = '#4db6ac';
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.lineTo(150, 180);
        ctx.lineTo(380, 240);
        ctx.lineTo(550, 190);
        ctx.lineTo(800, 300);
        ctx.closePath();
        ctx.fill();

        const drawPagoda = (cx, cy, scale, isReflection = false) => {
            ctx.save();
            ctx.translate(cx, cy);
            if (isReflection) {
                ctx.scale(1, -1);
                ctx.globalAlpha = 0.65;
            }

            ctx.fillStyle = '#3e2723';
            ctx.fillRect(-60 * scale, -10 * scale, 120 * scale, 10 * scale);

            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-50 * scale, -40 * scale, 100 * scale, 30 * scale);
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(-52 * scale, -44 * scale, 104 * scale, 4 * scale);

            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-40 * scale, -75 * scale, 80 * scale, 31 * scale);
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(-30 * scale, -70 * scale, 12 * scale, 25 * scale);
            ctx.fillRect(18 * scale, -70 * scale, 12 * scale, 25 * scale);
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.moveTo(-48 * scale, -75 * scale);
            ctx.lineTo(48 * scale, -75 * scale);
            ctx.lineTo(60 * scale, -68 * scale);
            ctx.lineTo(-60 * scale, -68 * scale);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-25 * scale, -110 * scale, 50 * scale, 35 * scale);
            ctx.beginPath();
            ctx.moveTo(-32 * scale, -110 * scale);
            ctx.lineTo(32 * scale, -110 * scale);
            ctx.lineTo(42 * scale, -102 * scale);
            ctx.lineTo(-42 * scale, -102 * scale);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-3 * scale, -135 * scale, 6 * scale, 25 * scale);
            ctx.beginPath();
            ctx.arc(0, -135 * scale, 8 * scale, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();
        };

        drawPagoda(400, 300, 1.6, false);

        const pondGrad = ctx.createLinearGradient(0, 300, 0, 600);
        pondGrad.addColorStop(0, '#003366');
        pondGrad.addColorStop(1, '#001122');
        ctx.fillStyle = pondGrad;
        ctx.fillRect(0, 300, 800, 300);

        ctx.save();
        const ripple = Math.sin(gd.clearedCount * 0.1) * 3;
        drawPagoda(400 + ripple, 300, 1.6, true);
        ctx.restore();

        for (let r = 0; r < gd.rows; r++) {
            for (let c = 0; c < gd.cols; c++) {
                if (!gd.grid[r][c]) {
                    const x = c * gd.cellW;
                    const y = 300 + r * gd.cellH;
                    
                    ctx.fillStyle = 'rgba(74, 85, 76, 0.92)';
                    ctx.fillRect(x, y, gd.cellW, gd.cellH);
                    
                    ctx.fillStyle = 'rgba(40, 50, 42, 0.4)';
                    ctx.beginPath();
                    ctx.arc(x + gd.cellW/2, y + gd.cellH/2, gd.cellW*0.6, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let y = 320; y < 600; y += 30) {
            const shift = Math.sin(y + gd.clearedCount*0.05) * 15;
            ctx.beginPath();
            ctx.moveTo(40 + shift, y);
            ctx.lineTo(760 + shift, y);
            ctx.stroke();
        }

        gd.sparkles.forEach(s => {
            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = '#ffd700';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffea00';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`⛩️ Reflejo de Oro: Limpia las algas del templo`, 25, 29);
        ctx.fillText(`Limpio: ${this.score}%`, 380, 29);
        ctx.fillText(`Meta: ${this.goal}%`, 650, 29);
    },

    inputScratchPress(x, y) {
        const gd = this.gameData;
        if (gd) gd.drawing = true;
    },

    inputScratchRelease(x, y) {
        const gd = this.gameData;
        if (gd) gd.drawing = false;
    },

    // ==========================================================
    // DAY 9 - IVAN (14): LABERINTO DE TORII
    // ==========================================================
    setupTorii() {
        const tiles = [
            { type: 1, angle: 0 },   { type: 0, angle: 90 },  { type: 1, angle: 0 },
            { type: 0, angle: 90 },  { type: 1, angle: 180 }, { type: 0, angle: 0 },
            { type: 1, angle: 270 }, { type: 1, angle: 0 },   { type: 1, angle: 90 }
        ];

        tiles.forEach(tile => {
            tile.angle = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
        });

        this.gameData = {
            tiles,
            gridX: 250,
            gridY: 150,
            tileSize: 100,
            energyFlow: false,
            score: 0
        };
        this.score = 0;
        this.checkToriiMazeWin();
    },

    checkToriiMazeWin() {
        const gd = this.gameData;
        let matches = 0;
        
        gd.tiles.forEach((t, i) => {
            const r = t.angle % 360;
            if (i === 0 && r === 90) matches++;
            if (i === 1 && (r === 0 || r === 180)) matches++;
            if (i === 2 && r === 270) matches++;
            if (i === 3 && (r === 90 || r === 270)) matches++;
            if (i === 4 && r === 90) matches++;
            if (i === 5 && (r === 0 || r === 180)) matches++;
            if (i === 6 && r === 0) matches++;
            if (i === 7 && r === 270) matches++;
            if (i === 8 && r === 180) matches++;
        });

        if (matches >= 6) {
            gd.energyFlow = true;
            this.score = 1;
            if (window.playProceduralSound) window.playProceduralSound('win');
            if (window.launchConfetti) window.launchConfetti();
            setTimeout(() => this.win(), 1200);
        } else {
            gd.energyFlow = false;
            this.score = 0;
        }
    },

    updateTorii(dt) {
        const gd = this.gameData;
        if (!gd) return;
        document.getElementById('minigame-score').innerText = gd.energyFlow ? `¡COMPLETO!` : `Red inestable`;
    },

    drawTorii() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#0a050f';
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#ff3d00';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff3d00';
        
        ctx.fillRect(gd.gridX + gd.tileSize + 20, gd.gridY + gd.tileSize*3 + 10, 60, 20);
        ctx.fillStyle = gd.energyFlow ? '#ffd700' : '#888';
        ctx.shadowColor = gd.energyFlow ? '#ffd700' : 'transparent';
        ctx.font = '24px sans-serif';
        ctx.fillText("⛩️", gd.gridX + gd.tileSize + 35, gd.gridY + gd.tileSize*3 + 40);

        ctx.strokeStyle = gd.energyFlow ? '#ffd700' : '#ff3d00';
        ctx.lineWidth = 4;
        ctx.strokeRect(gd.gridX - 10, gd.gridY - 10, gd.tileSize*3 + 20, gd.tileSize*3 + 20);

        gd.tiles.forEach((t, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = gd.gridX + col * gd.tileSize;
            const y = gd.gridY + row * gd.tileSize;

            ctx.save();
            ctx.translate(x + gd.tileSize/2, y + gd.tileSize/2);
            ctx.rotate(t.angle * Math.PI / 180);

            ctx.fillStyle = '#1e1b26';
            ctx.fillRect(-gd.tileSize/2 + 2, -gd.tileSize/2 + 2, gd.tileSize - 4, gd.tileSize - 4);
            
            ctx.strokeStyle = '#322d3e';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-gd.tileSize/2 + 6, -gd.tileSize/2 + 6, gd.tileSize - 12, gd.tileSize - 12);

            ctx.strokeStyle = gd.energyFlow ? '#ff7b54' : '#5c382d';
            ctx.shadowBlur = gd.energyFlow ? 10 : 0;
            ctx.shadowColor = '#ff7b54';
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';

            if (t.type === 0) {
                ctx.beginPath();
                ctx.moveTo(0, -gd.tileSize/2);
                ctx.lineTo(0, gd.tileSize/2);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(gd.tileSize/2, gd.tileSize/2, gd.tileSize/2, Math.PI, Math.PI * 1.5);
                ctx.stroke();
            }

            ctx.fillStyle = '#ff3d00';
            ctx.font = '12px sans-serif';
            ctx.fillText("⛩️", -6, 4);

            ctx.restore();
        });

        ctx.fillStyle = '#ffd700';
        ctx.shadowBlur = gd.energyFlow ? 20 : 0;
        ctx.shadowColor = '#ffd700';
        ctx.font = '36px sans-serif';
        ctx.fillText("🔮", gd.gridX + gd.tileSize + 30, gd.gridY - 30);

        ctx.fillStyle = gd.energyFlow ? '#00ff99' : '#ffd700';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(gd.energyFlow ? ">>> ENLACE TRASPASADO CON EXITO <<<" : ">>> ALINEE LAS PUERTAS TORII <<<", 400, 520);
        ctx.textAlign = 'left';

        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`⛩️ Laberinto de Torii: Fushimi Inari`, 25, 29);
    },

    inputToriiPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;

        for (let i = 0; i < gd.tiles.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const tileX = gd.gridX + col * gd.tileSize;
            const tileY = gd.gridY + row * gd.tileSize;

            if (x >= tileX && x <= tileX + gd.tileSize && y >= tileY && y <= tileY + gd.tileSize) {
                gd.tiles[i].angle = (gd.tiles[i].angle + 90) % 360;
                if (window.playProceduralSound) window.playProceduralSound('collect');
                this.createExplosion(tileX + gd.tileSize/2, tileY + gd.tileSize/2, '#ff5722', 8, 0.8);
                this.checkToriiMazeWin();
                break;
            }
        }
    },

    // ==========================================================
    // DAY 10 - LAURA (9): EL MAESTRO DEL BENTO
    // ==========================================================
    setupBento() {
        this.gameData = {
            draggedIdx: -1,
            items: [
                { id: 'arroz', emoji: '🍚', x: 200, y: 500, startX: 200, startY: 500, placed: false, name: 'Arroz' },
                { id: 'pescado', emoji: '🐟', x: 320, y: 500, startX: 320, startY: 500, placed: false, name: 'Pescado' },
                { id: 'broccoli', emoji: '🥦', x: 440, y: 500, startX: 440, startY: 500, placed: false, name: 'Brócoli' },
                { id: 'mochi', emoji: '🍡', x: 560, y: 500, startX: 560, startY: 500, placed: false, name: 'Mochi' }
            ],
            slots: [
                { id: 'arroz', x: 280, y: 190, w: 110, h: 100, label: 'Arroz 🍚' },
                { id: 'pescado', x: 520, y: 190, w: 110, h: 100, label: 'Pescado 🐟' },
                { id: 'broccoli', x: 280, y: 320, w: 110, h: 100, label: 'Verdura 🥦' },
                { id: 'mochi', x: 520, y: 320, w: 110, h: 100, label: 'Postre 🍡' }
            ],
            score: 0,
            feedbackText: "¡Prepara la caja Bento!",
            feedbackColor: "#00ff99",
            feedbackTimer: 2.0
        };
        this.score = 0;
    },

    updateBento(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        if (gd.draggedIdx !== -1) {
            gd.items[gd.draggedIdx].x = this.mouse.x;
            gd.items[gd.draggedIdx].y = this.mouse.y;
        }

        document.getElementById('minigame-score').innerText = `Ingredientes: ${this.score}/4`;
    },

    drawBento() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#bcaaa4';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#a1887f';
        ctx.lineWidth = 4;
        for (let y = 100; y < 600; y += 120) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
        }

        ctx.fillStyle = '#c62828';
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.fillRect(180, 80, 440, 340);
        
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 10;
        ctx.strokeRect(180, 80, 440, 340);
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo(400, 80); ctx.lineTo(400, 420);
        ctx.moveTo(180, 250); ctx.lineTo(620, 250);
        ctx.stroke();

        gd.slots.forEach(slot => {
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(slot.x - slot.w/2, slot.y - slot.h/2, slot.w, slot.h);
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(slot.label, slot.x, slot.y + slot.h/2 - 10);
            ctx.textAlign = 'left';
        });

        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(100, 450, 600, 110);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 5;
        ctx.strokeRect(100, 450, 600, 110);

        gd.items.forEach((item, idx) => {
            if (item.placed) return;

            ctx.save();
            ctx.font = gd.draggedIdx === idx ? '55px sans-serif' : '45px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.shadowBlur = gd.draggedIdx === idx ? 12 : 3;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.fillText(item.emoji, item.x, item.y);
            ctx.restore();
        });

        gd.slots.forEach(slot => {
            const item = gd.items.find(it => it.id === slot.id);
            if (item && item.placed) {
                ctx.save();
                ctx.font = '55px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.emoji, slot.x, slot.y);
                ctx.restore();
            }
        });

        if (gd.feedbackTimer > 0) {
            ctx.fillStyle = gd.feedbackColor;
            ctx.font = 'bold 20px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gd.feedbackText, 400, 50);
            ctx.textAlign = 'left';
        }

        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🍱 El Maestro del Bento: Mercado Nishiki`, 25, 29);
        ctx.fillText(`Completado: ${this.score}/4`, 600, 29);
    },

    inputBentoPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;

        gd.items.forEach((item, idx) => {
            if (!item.placed) {
                if (Math.hypot(x - item.x, y - item.y) < 35) {
                    gd.draggedIdx = idx;
                    if (window.playProceduralSound) window.playProceduralSound('click');
                }
            }
        });
    },

    releaseBento(x, y) {
        const gd = this.gameData;
        if (!gd || gd.draggedIdx === -1) return;

        const item = gd.items[gd.draggedIdx];
        const slot = gd.slots.find(sl => sl.id === item.id);

        if (slot) {
            const isInside = (x >= slot.x - slot.w/2 && x <= slot.x + slot.w/2 &&
                              y >= slot.y - slot.h/2 && y <= slot.y + slot.h/2);

            if (isInside) {
                item.placed = true;
                this.score++;
                if (window.playProceduralSound) window.playProceduralSound('success');
                this.createExplosion(slot.x, slot.y, '#ffd700', 15, 1.2);
                gd.feedbackText = `¡${item.name} colocado!`;
                gd.feedbackColor = '#00ff99';
                gd.feedbackTimer = 1.5;

                if (this.score === 4) {
                    if (window.launchConfetti) window.launchConfetti();
                    setTimeout(() => this.win(), 800);
                }
            } else {
                item.x = item.startX;
                item.y = item.startY;
                if (window.playProceduralSound) window.playProceduralSound('error');
            }
        } else {
            item.x = item.startX;
            item.y = item.startY;
        }

        gd.draggedIdx = -1;
    },

    // ==========================================================
    // DAY 10 - IVAN (14): ENLACE CIFRADO DEL SHINOBI
    // ==========================================================
    setupCrypto() {
        const target = "KYOTO_ANNEX";
        const letters = [];
        
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
        for (let i = 0; i < 15; i++) {
            letters.push({
                char: chars[Math.floor(Math.random() * chars.length)],
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 260,
                vx: (Math.random() - 0.5) * 120,
                vy: (Math.random() - 0.5) * 120,
                r: 28
            });
        }

        this.gameData = {
            target,
            typed: "",
            letters,
            lives: 3,
            feedbackText: "HACKEANDO FIREWALL...",
            feedbackColor: "#00e5ff",
            feedbackTimer: 2.0,
            sparkles: []
        };
        
        this.score = 0;
        this.ensureRequiredLetters();
    },

    ensureRequiredLetters() {
        const gd = this.gameData;
        const nextChar = gd.target[gd.typed.length];
        if (!nextChar) return;

        const exists = gd.letters.some(l => l.char === nextChar);
        if (!exists) {
            const randIdx = Math.floor(Math.random() * gd.letters.length);
            gd.letters[randIdx].char = nextChar;
        }
    },

    updateCrypto(dt) {
        if (this.state !== 'playing') return;
        const gd = this.gameData;
        if (!gd) return;

        if (gd.feedbackTimer > 0) gd.feedbackTimer -= dt;

        for (let i = gd.sparkles.length - 1; i >= 0; i--) {
            const s = gd.sparkles[i];
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.alpha -= dt * 1.5;
            if (s.alpha <= 0) gd.sparkles.splice(i, 1);
        }

        gd.letters.forEach(l => {
            l.x += l.vx * dt;
            l.y += l.vy * dt;

            if (l.x - l.r < 30 || l.x + l.r > 770) {
                l.vx = -l.vx;
                l.x = l.x < 400 ? 30 + l.r : 770 - l.r;
            }
            if (l.y - l.r < 60 || l.y + l.r > 380) {
                l.vy = -l.vy;
                l.y = l.y < 200 ? 60 + l.r : 380 - l.r;
            }
        });

        document.getElementById('minigame-score').innerText = `Descifrado: ${gd.typed.length}/${gd.target.length}`;
    },

    drawCrypto() {
        const gd = this.gameData;
        if (!gd) return;
        const ctx = this.ctx;

        ctx.fillStyle = '#020b12';
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = '#032338';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
        }
        for (let y = 0; y < 600; y += 50) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
        }

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 55, 760, 335);

        gd.letters.forEach(l => {
            ctx.save();
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00e5ff';
            
            ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(l.x, l.y, l.r, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(l.char, l.x, l.y);
            ctx.restore();
        });

        ctx.fillStyle = '#011526';
        ctx.fillRect(0, 400, 800, 200);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(800, 400); ctx.stroke();

        ctx.fillStyle = '#052945';
        ctx.fillRect(100, 450, 600, 70);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 450, 600, 70);

        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < gd.target.length; i++) {
            const x = 150 + i * 46;
            const y = 485;
            const targetChar = gd.target[i];

            if (i < gd.typed.length) {
                ctx.fillStyle = '#00ff99';
                ctx.fillText(targetChar, x, y);
            } else {
                ctx.fillStyle = '#ff1744';
                ctx.fillText("_", x, y);
            }
        }
        ctx.textAlign = 'left';

        gd.sparkles.forEach(s => {
            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = s.color;
            ctx.fillRect(s.x, s.y, s.size, s.size);
            ctx.restore();
        });

        let hearts = "";
        for (let i = 0; i < gd.lives; i++) hearts += "❤️ ";
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`Escudos: ${hearts}`, 600, 29);

        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, 800, 48);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Quicksand, sans-serif';
        ctx.fillText(`🔒 Terminal Hack: Descifra Kyoto Hotel Firewall`, 25, 29);
        ctx.fillText(`Descifrado: ${gd.typed.length}/11`, 380, 29);
    },

    inputCryptoPress(x, y) {
        const gd = this.gameData;
        if (!gd) return;

        const nextChar = gd.target[gd.typed.length];
        if (!nextChar) return;

        let hit = false;
        for (let i = 0; i < gd.letters.length; i++) {
            const l = gd.letters[i];
            if (Math.hypot(x - l.x, y - l.y) < l.r + 5) {
                hit = true;
                if (l.char === nextChar) {
                    gd.typed += nextChar;
                    this.score = gd.typed.length;
                    if (window.playProceduralSound) window.playProceduralSound('success');
                    
                    for (let p = 0; p < 12; p++) {
                        gd.sparkles.push({
                            x: l.x,
                            y: l.y,
                            vx: (Math.random() - 0.5) * 150,
                            vy: (Math.random() - 0.5) * 150,
                            size: 4 + Math.random() * 5,
                            alpha: 1.0,
                            color: '#00ff99'
                        });
                    }

                    gd.letters.splice(i, 1);
                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
                    gd.letters.push({
                        char: chars[Math.floor(Math.random() * chars.length)],
                        x: 100 + Math.random() * 600,
                        y: 100 + Math.random() * 260,
                        vx: (Math.random() - 0.5) * 120,
                        vy: (Math.random() - 0.5) * 120,
                        r: 28
                    });

                    this.ensureRequiredLetters();

                    if (gd.typed === gd.target) {
                        if (window.launchConfetti) window.launchConfetti();
                        setTimeout(() => this.win(), 800);
                    }
                } else {
                    gd.lives--;
                    this.triggerShake(12);
                    if (window.playProceduralSound) window.playProceduralSound('error');

                    for (let p = 0; p < 15; p++) {
                        gd.sparkles.push({
                            x: l.x,
                            y: l.y,
                            vx: (Math.random() - 0.5) * 200,
                            vy: (Math.random() - 0.5) * 200,
                            size: 5 + Math.random() * 6,
                            alpha: 1.0,
                            color: '#ff1744'
                        });
                    }

                    if (gd.lives <= 0) {
                        this.gameOver();
                    }
                }
                break;
            }
        }
    },

    // ==========================================================
    // day_8_kid9_pose: El Trono de Piedra
    // ==========================================================
    setupPose() {
        this.gameData = {
            targetPose: [
                { x: 400, y: 150 },
                { x: 300, y: 220 },
                { x: 500, y: 350 },
                { x: 350, y: 400 },
                { x: 450, y: 400 }
            ],
            joints: [
                { x: 400, y: 200, name: 'Cabeza', id: 0 },
                { x: 360, y: 260, name: 'Mano Izq', id: 1 },
                { x: 440, y: 260, name: 'Mano Der', id: 2 },
                { x: 380, y: 380, name: 'Pie Izq', id: 3 },
                { x: 420, y: 380, name: 'Pie Der', id: 4 }
            ],
            draggingJoint: null
        };
        this.score = 0;
    },
    updatePose(dt) {
        const gd = this.gameData;
        if (gd.draggingJoint) {
            gd.draggingJoint.x = Math.max(100, Math.min(700, this.mouse.x));
            gd.draggingJoint.y = Math.max(100, Math.min(500, this.mouse.y));
        }
        
        let matched = 0;
        for (let i = 0; i < gd.joints.length; i++) {
            const j = gd.joints[i];
            const t = gd.targetPose[i];
            const dist = Math.hypot(j.x - t.x, j.y - t.y);
            if (dist < 45) matched++;
        }
        const score = Math.round((matched / gd.joints.length) * 100);
        this.score = score;
        if (score >= 90) {
            this.victory();
        }
    },
    drawPose() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#efebe9';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = 'rgba(141, 110, 99, 0.4)';
        ctx.beginPath();
        ctx.arc(gd.targetPose[0].x, gd.targetPose[0].y, 35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(141, 110, 99, 0.4)';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(400, 250);
        ctx.lineTo(gd.targetPose[0].x, gd.targetPose[0].y + 20);
        ctx.moveTo(400, 250);
        ctx.lineTo(gd.targetPose[1].x, gd.targetPose[1].y);
        ctx.moveTo(400, 250);
        ctx.lineTo(gd.targetPose[2].x, gd.targetPose[2].y);
        ctx.moveTo(400, 320);
        ctx.lineTo(gd.targetPose[3].x, gd.targetPose[3].y);
        ctx.moveTo(400, 320);
        ctx.lineTo(gd.targetPose[4].x, gd.targetPose[4].y);
        ctx.stroke();
        
        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.arc(gd.joints[0].x, gd.joints[0].y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(400, 250);
        ctx.lineTo(gd.joints[0].x, gd.joints[0].y + 15);
        ctx.moveTo(400, 250);
        ctx.lineTo(gd.joints[1].x, gd.joints[1].y);
        ctx.moveTo(400, 250);
        ctx.lineTo(gd.joints[2].x, gd.joints[2].y);
        ctx.moveTo(400, 320);
        ctx.lineTo(gd.joints[3].x, gd.joints[3].y);
        ctx.moveTo(400, 320);
        ctx.lineTo(gd.joints[4].x, gd.joints[4].y);
        ctx.stroke();
        
        gd.joints.forEach(j => {
            ctx.fillStyle = '#ffd700';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(j.x, j.y, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
        
        ctx.fillStyle = '#4e342e';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Imita la postura de la estatua Rakan de piedra", 400, 50);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText(`Coincidencia actual: ${this.score}% / 90%`, 400, 80);
    },
    inputPosePress(x, y) {
        const gd = this.gameData;
        for (let j of gd.joints) {
            if (Math.hypot(x - j.x, y - j.y) < 25) {
                gd.draggingJoint = j;
                if (window.playProceduralSound) playProceduralSound('click');
                break;
            }
        }
    },
    releasePose(x, y) {
        this.gameData.draggingJoint = null;
    },

    // ==========================================================
    // day_8_kid9_wind: El Susurro del Viento
    // ==========================================================
    setupWind() {
        this.gameData = {
            leaves: [],
            totalCleared: 0
        };
        for (let i = 0; i < 25; i++) {
            this.gameData.leaves.push({
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 400,
                vx: (Math.random() - 0.5) * 50,
                vy: (Math.random() - 0.5) * 50,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 2,
                size: 15 + Math.random() * 15
            });
        }
        this.score = 0;
    },
    updateWind(dt) {
        const gd = this.gameData;
        const mouse = this.mouse;
        
        gd.leaves.forEach(leaf => {
            if (mouse.isDown) {
                const dist = Math.hypot(leaf.x - mouse.x, leaf.y - mouse.y);
                if (dist < 120) {
                    const force = (120 - dist) / 120 * 400;
                    const angle = Math.atan2(leaf.y - mouse.y, leaf.x - mouse.x);
                    leaf.vx += Math.cos(angle) * force * dt;
                    leaf.vy += Math.sin(angle) * force * dt;
                    if (Math.random() < 0.1) {
                        this.particles.push({
                            x: mouse.x, y: mouse.y,
                            vx: Math.cos(angle) * 100, vy: Math.sin(angle) * 100,
                            life: 0.5, size: 3, color: '#e0f7fa'
                        });
                    }
                }
            }
            leaf.vx *= 0.98;
            leaf.vy *= 0.98;
            leaf.x += leaf.vx * dt;
            leaf.y += leaf.vy * dt;
            leaf.angle += leaf.rotSpeed * dt;
        });
        
        const beforeCount = gd.leaves.length;
        gd.leaves = gd.leaves.filter(l => l.x > -50 && l.x < 850 && l.y > -50 && l.y < 650);
        const cleared = beforeCount - gd.leaves.length;
        if (cleared > 0) {
            gd.totalCleared += cleared;
            this.score = gd.totalCleared;
            if (window.playProceduralSound) playProceduralSound('collect');
        }
        
        if (gd.totalCleared >= 25) {
            this.victory();
        }
    },
    drawWind() {
        const ctx = this.ctx;
        const gd = this.gameData;
        let grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, '#e0f2f1');
        grad.addColorStop(1, '#b2dfdb');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
        
        gd.leaves.forEach(l => {
            ctx.save();
            ctx.translate(l.x, l.y);
            ctx.rotate(l.angle);
            ctx.fillStyle = '#81c784';
            ctx.strokeStyle = '#2e7d32';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-l.size, 0);
            ctx.quadraticCurveTo(0, -l.size/3, l.size, 0);
            ctx.quadraticCurveTo(0, l.size/3, -l.size, 0);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });
        
        ctx.fillStyle = '#004d40';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Hojas sopladas fuera: ${gd.totalCleared} / 25`, 400, 60);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText("Arrastra para soplar viento y limpiar el bosque", 400, 90);
    },

    // ==========================================================
    // day_8_kid9_bamboo_clock: El Reloj de Bambú
    // ==========================================================
    setupBambooClock() {
        this.gameData = {
            currentHeight: 100,
            targetSize: 45,
            nodesTouched: 0,
            glow: 0
        };
        this.score = 0;
    },
    updateBambooClock(dt) {
        const gd = this.gameData;
        gd.currentHeight += 180 * dt;
        if (gd.currentHeight > 550) {
            gd.currentHeight = 100;
            if (window.playProceduralSound) playProceduralSound('damage');
        }
        if (gd.glow > 0) gd.glow -= dt * 4;
        
        if (gd.nodesTouched >= 10) {
            this.victory();
        }
    },
    drawBambooClock() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#1b5e20';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.strokeStyle = gd.glow > 0 ? '#ffd700' : '#81c784';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(400, 400, gd.targetSize, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(380, 600 - gd.currentHeight, 40, gd.currentHeight);
        
        ctx.fillStyle = '#2e7d32';
        let nodeY = 600 - gd.currentHeight;
        while (nodeY < 600) {
            ctx.fillRect(375, nodeY, 50, 8);
            nodeY += 100;
        }
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Nudos sincronizados: ${gd.nodesTouched} / 10`, 400, 80);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText("Toca la pantalla cuando un nudo pase por el círculo objetivo", 400, 110);
    },
    inputBambooClockPress(x, y) {
        const gd = this.gameData;
        const topNodeY = 600 - gd.currentHeight;
        const dist = Math.abs(topNodeY - 400);
        
        if (dist < 40) {
            gd.nodesTouched++;
            this.score = gd.nodesTouched;
            gd.glow = 1.0;
            gd.currentHeight = 100;
            if (window.playProceduralSound) playProceduralSound('success');
            for (let i = 0; i < 15; i++) {
                this.particles.push({
                    x: 400, y: 400,
                    vx: (Math.random() - 0.5) * 200, vy: (Math.random() - 0.5) * 200,
                    life: 0.8, size: 4, color: '#ffd700'
                });
            }
        } else {
            if (window.playProceduralSound) playProceduralSound('error');
            this.screenShake = 10;
        }
    },

    // ==========================================================
    // day_8_kid9_giants: Perspectiva de Gigantes
    // ==========================================================
    setupGiants() {
        this.gameData = {
            camY: 300,
            bamboos: [
                { x: 250, baseSpeed: 1.2, phase: 0, targetH: 450, curH: 450 },
                { x: 400, baseSpeed: 0.9, phase: Math.PI/2, targetH: 450, curH: 450 },
                { x: 550, baseSpeed: 1.5, phase: Math.PI, targetH: 450, curH: 450 }
            ],
            successTime: 0
        };
        this.score = 0;
    },
    updateGiants(dt) {
        const gd = this.gameData;
        if (this.mouse.isDown) {
            gd.camY += (this.mouse.y - gd.camY) * 0.1;
        }
        
        const time = Date.now() / 1000;
        gd.bamboos.forEach(b => {
            b.curH = 350 + Math.sin(time * b.baseSpeed + b.phase) * 120;
        });
        
        let aligned = true;
        gd.bamboos.forEach(b => {
            const tipY = 600 - b.curH;
            if (Math.abs(tipY - gd.camY) > 30) {
                aligned = false;
            }
        });
        
        if (aligned) {
            gd.successTime += dt;
            this.score = gd.successTime;
            if (gd.successTime >= 2.0) {
                this.victory();
            }
        } else {
            gd.successTime = Math.max(0, gd.successTime - dt * 2);
            this.score = gd.successTime;
        }
    },
    drawGiants() {
        const ctx = this.ctx;
        const gd = this.gameData;
        let grad = ctx.createRadialGradient(400, 300, 50, 400, 300, 550);
        grad.addColorStop(0, '#e0f7fa');
        grad.addColorStop(1, '#006064');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
        
        gd.bamboos.forEach((b, idx) => {
            ctx.fillStyle = '#4caf50';
            ctx.fillRect(b.x - 20, 600 - b.curH, 40, b.curH);
            ctx.fillStyle = '#1b5e20';
            ctx.beginPath();
            ctx.arc(b.x, 600 - b.curH, 35, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.strokeStyle = gd.successTime > 0 ? '#ffd700' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(100, gd.camY);
        ctx.lineTo(700, gd.camY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.strokeRect(100, gd.camY - 50, 600, 100);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Arrastra para subir/bajar la cámara y enfocar las copas juntas", 400, 50);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText(`Tiempo enfocado: ${Math.round((gd.successTime / 2) * 100)}%`, 400, 80);
    },

    // ==========================================================
    // day_8_kid9_monk: El Mensaje del Monje
    // ==========================================================
    setupMonk() {
        this.gameData = {
            bowls: [
                { x: 220, y: 350, r: 40, freq: 261.63, color: '#ffd700', active: 0, name: 'Do' },
                { x: 400, y: 350, r: 50, freq: 329.63, color: '#ff9800', active: 0, name: 'Mi' },
                { x: 580, y: 350, r: 60, freq: 392.00, color: '#e91e63', active: 0, name: 'Sol' }
            ],
            sequence: [],
            playerSequence: [],
            state: 'demo',
            seqIndex: 0,
            timer: 0.5,
            round: 1
        };
        this.score = 0;
        this.startMonkRound();
    },
    startMonkRound() {
        const gd = this.gameData;
        gd.sequence = [];
        gd.playerSequence = [];
        gd.state = 'demo';
        gd.seqIndex = 0;
        gd.timer = 0.5;
        const length = 2 + gd.round;
        for (let i = 0; i < length; i++) {
            gd.sequence.push(Math.floor(Math.random() * 3));
        }
    },
    updateMonk(dt) {
        const gd = this.gameData;
        gd.bowls.forEach(b => {
            if (b.active > 0) b.active -= dt * 4;
        });
        
        if (gd.state === 'demo') {
            gd.timer -= dt;
            if (gd.timer <= 0) {
                if (gd.seqIndex < gd.sequence.length) {
                    const bowlIdx = gd.sequence[gd.seqIndex];
                    const bowl = gd.bowls[bowlIdx];
                    bowl.active = 1.0;
                    if (window.playProceduralSound) playProceduralSound('click');
                    gd.seqIndex++;
                    gd.timer = 0.6;
                } else {
                    gd.state = 'play';
                    gd.playerSequence = [];
                }
            }
        }
        
        if (gd.round > 4) {
            this.victory();
        }
    },
    drawMonk() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#37474f';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.bowls.forEach((b, idx) => {
            ctx.save();
            ctx.shadowBlur = b.active > 0 ? 30 : 5;
            ctx.shadowColor = b.color;
            let grad = ctx.createRadialGradient(b.x, b.y, 5, b.x, b.y, b.r);
            grad.addColorStop(0, '#ffe082');
            grad.addColorStop(0.8, '#ffb300');
            grad.addColorStop(1, '#8d6e63');
            ctx.fillStyle = b.active > 0 ? '#ffffff' : grad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI, false);
            ctx.lineTo(b.x - b.r, b.y);
            ctx.fill();
            
            ctx.strokeStyle = '#ff8f00';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, b.r, b.r/5, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        });
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Ronda: ${gd.round} / 4`, 400, 80);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText(gd.state === 'demo' ? "Escucha la melodía del monje..." : "¡Tu turno! Repite la melodía tocando los cuencos", 400, 115);
    },
    inputMonkPress(x, y) {
        const gd = this.gameData;
        if (gd.state !== 'play') return;
        
        gd.bowls.forEach((b, idx) => {
            const dist = Math.hypot(x - b.x, y - b.y);
            if (dist < b.r + 20) {
                b.active = 1.0;
                gd.playerSequence.push(idx);
                if (window.playProceduralSound) playProceduralSound('click');
                
                const currentStep = gd.playerSequence.length - 1;
                if (gd.playerSequence[currentStep] !== gd.sequence[currentStep]) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    this.screenShake = 12;
                    gd.round = Math.max(1, gd.round - 1);
                    this.startMonkRound();
                } else if (gd.playerSequence.length === gd.sequence.length) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    gd.round++;
                    this.score = gd.round - 1;
                    setTimeout(() => {
                        this.startMonkRound();
                    }, 800);
                }
            }
        });
    },

    // ==========================================================
    // day_8_kid14_bosque: El Bosque de 2.7km
    // ==========================================================
    setupBosque() {
        this.gameData = {
            lane: 1,
            laneX: [250, 400, 550],
            playerX: 400,
            distance: 0,
            speed: 220,
            obstacles: [],
            spawnTimer: 0
        };
        this.score = 0;
    },
    updateBosque(dt) {
        const gd = this.gameData;
        gd.distance += gd.speed * dt * 0.1;
        this.score = Math.floor(gd.distance);
        
        const targetX = gd.laneX[gd.lane];
        gd.playerX += (targetX - gd.playerX) * 0.25;
        
        gd.obstacles.forEach(obs => {
            obs.y += gd.speed * dt;
        });
        
        gd.obstacles.forEach(obs => {
            if (obs.y > 470 && obs.y < 530 && obs.lane === gd.lane) {
                if (window.playProceduralSound) playProceduralSound('damage');
                this.screenShake = 15;
                gd.distance = Math.max(0, gd.distance - 40);
                obs.y = 999;
            }
        });
        
        gd.obstacles = gd.obstacles.filter(obs => obs.y < 650);
        
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.obstacles.push({
                lane: Math.floor(Math.random() * 3),
                y: -50,
                type: Math.random() < 0.5 ? 'rock' : 'log'
            });
            gd.spawnTimer = 1.0 + Math.random() * 0.8;
        }
        
        if (gd.distance >= 250) {
            this.victory();
        }
    },
    drawBosque() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.strokeStyle = '#a0522d';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(320, 0); ctx.lineTo(320, 600);
        ctx.moveTo(480, 0); ctx.lineTo(480, 600);
        ctx.stroke();
        
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(0, 0, 180, 600);
        ctx.fillRect(620, 0, 180, 600);
        
        gd.obstacles.forEach(obs => {
            ctx.fillStyle = obs.type === 'rock' ? '#78909c' : '#8d6e63';
            ctx.beginPath();
            const ox = gd.laneX[obs.lane];
            ctx.arc(ox, obs.y, 20, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.fillStyle = '#0d47a1';
        ctx.beginPath();
        ctx.arc(gd.playerX, 500, 22, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ff1744';
        ctx.fillRect(gd.playerX - 35, 495, 15, 6);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Distancia: ${this.score}m / 250m`, 400, 50);
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillText("Pulsa izquierda/derecha de la pantalla para cambiar de carril", 400, 80);
    },
    inputBosquePress(x, y) {
        const gd = this.gameData;
        if (x < 400) {
            gd.lane = Math.max(0, gd.lane - 1);
        } else {
            gd.lane = Math.min(2, gd.lane + 1);
        }
        if (window.playProceduralSound) playProceduralSound('click');
    },

    // ==========================================================
    // day_8_kid14_arashiyama: El Guardián del Bambú
    // ==========================================================
    setupArashiyamaGame() {
        this.gameData = {
            bambooSegments: [],
            branches: [],
            playerSide: 0,
            choppedCount: 0
        };
        for (let i = 0; i < 15; i++) {
            this.gameData.bambooSegments.push({ id: i });
            if (i > 2 && Math.random() < 0.4) {
                this.gameData.branches.push(Math.random() < 0.5 ? 0 : 1);
            } else {
                this.gameData.branches.push(null);
            }
        }
        this.score = 0;
    },
    updateArashiyamaGame(dt) {
        const gd = this.gameData;
        if (gd.branches[0] === gd.playerSide) {
            if (window.playProceduralSound) playProceduralSound('damage');
            this.screenShake = 18;
            gd.choppedCount = Math.max(0, gd.choppedCount - 5);
            this.score = gd.choppedCount;
            gd.branches[0] = null;
        }
        
        if (gd.choppedCount >= 30) {
            this.victory();
        }
    },
    drawArashiyamaGame() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#0f2027';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.lineWidth = 2;
        for (let i = 0; i < gd.bambooSegments.length; i++) {
            const by = 480 - i * 40;
            ctx.fillStyle = '#81c784';
            ctx.strokeStyle = '#1b5e20';
            ctx.fillRect(370, by, 60, 38);
            ctx.strokeRect(370, by, 60, 38);
            
            if (gd.branches[i] !== null) {
                ctx.fillStyle = '#2e7d32';
                ctx.fillRect(gd.branches[i] === 0 ? 250 : 430, by + 10, 120, 15);
            }
        }
        
        const px = gd.playerSide === 0 ? 300 : 500;
        ctx.fillStyle = '#e57373';
        ctx.beginPath();
        ctx.arc(px, 500, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Segmentos cortados: ${gd.choppedCount} / 30`, 400, 70);
    },
    inputArashiyamaGamePress(x, y) {
        const gd = this.gameData;
        gd.playerSide = x < 400 ? 0 : 1;
        gd.choppedCount++;
        this.score = gd.choppedCount;
        
        if (window.playProceduralSound) playProceduralSound('collect');
        
        gd.bambooSegments.shift();
        gd.branches.shift();
        
        gd.bambooSegments.push({ id: Date.now() });
        gd.branches.push(Math.random() < 0.4 ? (Math.random() < 0.5 ? 0 : 1) : null);
    },

    // ==========================================================
    // day_8_fam_squad: Escuadrón Bambú
    // ==========================================================
    setupFamSquad() {
        this.gameData = {
            members: [
                { name: 'Papá', hidden: false, key: 'papa' },
                { name: 'Mamá', hidden: false, key: 'mama' },
                { name: 'Laura', hidden: false, key: 'laura' },
                { name: 'Iván', hidden: false, key: 'ivan' }
            ],
            bamboos: [],
            spawnTimer: 0,
            successCount: 0
        };
        this.score = 0;
    },
    updateFamSquad(dt) {
        const gd = this.gameData;
        
        gd.bamboos.forEach(b => {
            b.x += b.vx * dt;
        });
        
        gd.bamboos.forEach(b => {
            if (b.x > 380 && b.x < 420) {
                gd.members.forEach(m => {
                    if (!m.hidden) {
                        if (window.playProceduralSound) playProceduralSound('error');
                        this.screenShake = 20;
                        gd.successCount = Math.max(0, gd.successCount - 1);
                        this.score = gd.successCount;
                        b.x = 999;
                    }
                });
            }
        });
        
        const beforeCount = gd.bamboos.length;
        gd.bamboos = gd.bamboos.filter(b => b.x < 900);
        const passed = beforeCount - gd.bamboos.length;
        if (passed > 0 && this.screenShake === 0) {
            gd.successCount++;
            this.score = gd.successCount;
            if (window.playProceduralSound) playProceduralSound('success');
        }
        
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.bamboos.push({
                x: -50,
                vx: 300 + Math.random() * 100
            });
            gd.spawnTimer = 1.8 + Math.random() * 1.0;
        }
        
        if (gd.successCount >= 5) {
            this.victory();
        }
    },
    drawFamSquad() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#33691e';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.members.forEach((m, idx) => {
            const mx = 200 + idx * 130;
            ctx.fillStyle = m.hidden ? '#757575' : '#ffd54f';
            ctx.beginPath();
            ctx.arc(mx, m.hidden ? 420 : 350, m.hidden ? 18 : 28, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(m.name, mx, 460);
        });
        
        gd.bamboos.forEach(b => {
            ctx.fillStyle = '#81c784';
            ctx.fillRect(b.x - 20, 0, 40, 600);
        });
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Camuflajes exitosos: ${gd.successCount} / 5`, 400, 70);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText("¡Toca la pantalla para ordenar agacharse/esconderse!", 400, 100);
    },
    inputFamSquadPress(x, y) {
        const gd = this.gameData;
        gd.members.forEach(m => {
            m.hidden = !m.hidden;
        });
        if (window.playProceduralSound) playProceduralSound('click');
    },

    // ==========================================================
    // day_9_kid9_zorros: La Escalada de los Zorros
    // ==========================================================
    setupZorros() {
        this.gameData = {
            fox: { x: 400, y: 500, vy: 0, r: 18 },
            platforms: [
                { x: 400, y: 550, w: 100 },
                { x: 300, y: 440, w: 90 },
                { x: 500, y: 330, w: 90 },
                { x: 350, y: 220, w: 90 },
                { x: 450, y: 110, w: 90 }
            ],
            height: 0,
            camY: 0
        };
        this.score = 0;
    },
    updateZorros(dt) {
        const gd = this.gameData;
        const fox = gd.fox;
        fox.vy += 800 * dt;
        fox.y += fox.vy * dt;
        
        if (this.mouse.isDown) {
            const side = this.mouse.x < 400 ? -1 : 1;
            fox.x += side * 280 * dt;
        }
        
        if (fox.x < 0) fox.x = 800;
        if (fox.x > 800) fox.x = 0;
        
        gd.platforms.forEach(p => {
            if (fox.vy > 0 && 
                fox.y + fox.r >= p.y && 
                fox.y - fox.r <= p.y + 10 && 
                fox.x >= p.x - p.w/2 && 
                fox.x <= p.x + p.w/2) {
                fox.vy = -620;
                if (window.playProceduralSound) playProceduralSound('jump');
            }
        });
        
        if (fox.y < 300) {
            const diff = 300 - fox.y;
            fox.y = 300;
            gd.height += diff;
            this.score = Math.floor(gd.height);
            gd.platforms.forEach(p => {
                p.y += diff;
            });
        }
        
        gd.platforms.forEach(p => {
            if (p.y > 620) {
                p.y = -20;
                p.x = 100 + Math.random() * 600;
                p.w = 80 + Math.random() * 20;
            }
        });
        
        if (fox.y > 650) {
            if (window.playProceduralSound) playProceduralSound('error');
            this.screenShake = 15;
            fox.x = 400;
            fox.y = 450;
            fox.vy = -500;
        }
        
        if (gd.height >= 150) {
            this.victory();
        }
    },
    drawZorros() {
        const ctx = this.ctx;
        const gd = this.gameData;
        let grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, '#e64a19');
        grad.addColorStop(1, '#ffcc80');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#78909c';
        gd.platforms.forEach(p => {
            ctx.fillRect(p.x - p.w/2, p.y, p.w, 15);
        });
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gd.fox.x, gd.fox.y, gd.fox.r, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.moveTo(gd.fox.x - 12, gd.fox.y - 12);
        ctx.lineTo(gd.fox.x - 4, gd.fox.y - 25);
        ctx.lineTo(gd.fox.x - 2, gd.fox.y - 12);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(gd.fox.x + 12, gd.fox.y - 12);
        ctx.lineTo(gd.fox.x + 4, gd.fox.y - 25);
        ctx.lineTo(gd.fox.x + 2, gd.fox.y - 12);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Altura escalada: ${this.score}m / 150m`, 400, 60);
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillText("Pulsa izquierda/derecha para dirigir al Kitsune", 400, 90);
    },

    // ==========================================================
    // day_9_kid9_altar: El Altar Secreto
    // ==========================================================
    setupAltar() {
        this.gameData = {
            altars: [
                { x: 180, y: 350, w: 80, color: '#ff5252', lit: false, name: 'Sake (Agua)' },
                { x: 400, y: 350, w: 80, color: '#ffd740', lit: false, name: 'Arroz (Tierra)' },
                { x: 620, y: 350, w: 80, color: '#69f0ae', lit: false, name: 'Vela (Fuego)' }
            ],
            items: [
                { x: 200, y: 500, r: 25, name: 'Sake', icon: '🍶', targetAltarIdx: 0, startX: 200, startY: 500 },
                { x: 400, y: 500, r: 25, name: 'Arroz', icon: '🍚', targetAltarIdx: 1, startX: 400, startY: 500 },
                { x: 600, y: 500, r: 25, name: 'Vela', icon: '🕯️', targetAltarIdx: 2, startX: 600, startY: 500 }
            ],
            draggingItem: null
        };
        this.score = 0;
    },
    updateAltar(dt) {
        const gd = this.gameData;
        if (gd.draggingItem) {
            gd.draggingItem.x = this.mouse.x;
            gd.draggingItem.y = this.mouse.y;
        }
        
        let litCount = 0;
        gd.altars.forEach(a => { if (a.lit) litCount++; });
        this.score = litCount;
        
        if (litCount === 3) {
            this.victory();
        }
    },
    drawAltar() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#2d1500';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.altars.forEach(a => {
            ctx.fillStyle = a.lit ? a.color : '#424242';
            ctx.fillRect(a.x - a.w/2, a.y, a.w, 40);
            
            if (a.lit) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = a.color;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(a.x, a.y - 15, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            ctx.fillStyle = '#fff';
            ctx.font = '12px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(a.name, a.x, a.y + 60);
        });
        
        gd.items.forEach(item => {
            ctx.fillStyle = '#ffab40';
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '24px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.icon, item.x, item.y + 8);
        });
        
        ctx.fillStyle = '#ffd180';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Ofrendas Sagradas: Ilumina los 3 Altares", 400, 80);
    },
    inputAltarPress(x, y) {
        const gd = this.gameData;
        for (let item of gd.items) {
            if (Math.hypot(x - item.x, y - item.y) < item.r + 10) {
                gd.draggingItem = item;
                if (window.playProceduralSound) playProceduralSound('click');
                break;
            }
        }
    },
    releaseAltar(x, y) {
        const gd = this.gameData;
        if (!gd.draggingItem) return;
        
        const item = gd.draggingItem;
        gd.draggingItem = null;
        
        const targetAltar = gd.altars[item.targetAltarIdx];
        if (Math.hypot(item.x - targetAltar.x, item.y - targetAltar.y) < 60) {
            targetAltar.lit = true;
            if (window.playProceduralSound) playProceduralSound('success');
            item.x = targetAltar.x;
            item.y = targetAltar.y - 15;
        } else {
            item.x = item.startX;
            item.y = item.startY;
            if (window.playProceduralSound) playProceduralSound('error');
        }
    },

    // ==========================================================
    // day_9_kid14_gravity: Piedra Gravedad
    // ==========================================================
    setupGravity() {
        this.gameData = {
            stoneY: 100,
            vy: 0,
            falling: false,
            targetY: 480,
            targetH: 40,
            hits: 0,
            glow: 0
        };
        this.score = 0;
    },
    updateGravity(dt) {
        const gd = this.gameData;
        if (gd.glow > 0) gd.glow -= dt * 4;
        
        if (gd.falling) {
            gd.vy += 980 * dt;
            gd.stoneY += gd.vy * dt;
            
            if (gd.stoneY > 600) {
                gd.stoneY = 100;
                gd.vy = 0;
                gd.falling = false;
                if (window.playProceduralSound) playProceduralSound('error');
            }
        }
        
        if (gd.hits >= 3) {
            this.victory();
        }
    },
    drawGravity() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#212121';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = gd.glow > 0 ? '#00e676' : 'rgba(255, 87, 34, 0.3)';
        ctx.fillRect(200, gd.targetY - gd.targetH/2, 400, gd.targetH);
        ctx.strokeStyle = '#ff5722';
        ctx.lineWidth = 3;
        ctx.strokeRect(200, gd.targetY - gd.targetH/2, 400, gd.targetH);
        
        ctx.fillStyle = '#78909c';
        ctx.beginPath();
        ctx.arc(400, gd.stoneY, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Impactos exitosos: ${gd.hits} / 3`, 400, 60);
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillText("Pulsa para soltar la piedra, y pulsa de nuevo al cruzar la zona naranja", 400, 95);
    },
    inputGravityPress(x, y) {
        const gd = this.gameData;
        if (!gd.falling) {
            gd.falling = true;
            if (window.playProceduralSound) playProceduralSound('click');
        } else {
            const dist = Math.abs(gd.stoneY - gd.targetY);
            if (dist <= gd.targetH/2) {
                gd.hits++;
                this.score = gd.hits;
                gd.glow = 1.0;
                if (window.playProceduralSound) playProceduralSound('success');
            } else {
                if (window.playProceduralSound) playProceduralSound('error');
                this.screenShake = 10;
            }
            gd.stoneY = 100;
            gd.vy = 0;
            gd.falling = false;
        }
    },

    // ==========================================================
    // day_9_kid14_angulo: Ángulo Imposible
    // ==========================================================
    setupAngulo() {
        this.gameData = {
            mirrorAngle: 45,
            emitter: { x: 100, y: 300 },
            receptor: { x: 400, y: 150 },
            alignedTime: 0
        };
        this.score = 0;
    },
    updateAngulo(dt) {
        const gd = this.gameData;
        if (this.mouse.isDown) {
            const angleRad = Math.atan2(this.mouse.y - 300, this.mouse.x - 400);
            gd.mirrorAngle = angleRad * (180 / Math.PI);
        }
        
        const targetAngle1 = -45;
        const targetAngle2 = 135;
        const diff1 = Math.abs(gd.mirrorAngle - targetAngle1) % 360;
        const diff2 = Math.abs(gd.mirrorAngle - targetAngle2) % 360;
        const minDiff = Math.min(diff1, 360 - diff1, diff2, 360 - diff2);
        
        if (minDiff < 5) {
            gd.alignedTime += dt;
            this.score = gd.alignedTime;
            if (gd.alignedTime >= 2.0) {
                this.victory();
            }
        } else {
            gd.alignedTime = Math.max(0, gd.alignedTime - dt * 2);
            this.score = gd.alignedTime;
        }
    },
    drawAngulo() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#1a237e';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#ff1744';
        ctx.fillRect(gd.emitter.x - 20, gd.emitter.y - 15, 30, 30);
        
        ctx.fillStyle = gd.alignedTime > 0 ? '#00e676' : '#9e9e9e';
        ctx.beginPath();
        ctx.arc(gd.receptor.x, gd.receptor.y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.save();
        ctx.translate(400, 300);
        ctx.rotate(gd.mirrorAngle * Math.PI / 180);
        ctx.fillStyle = '#e0f7fa';
        ctx.strokeStyle = '#00bcd4';
        ctx.lineWidth = 4;
        ctx.fillRect(-60, -10, 120, 20);
        ctx.strokeRect(-60, -10, 120, 20);
        ctx.restore();
        
        ctx.strokeStyle = '#ff1744';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(gd.emitter.x, gd.emitter.y);
        ctx.lineTo(400, 300);
        const angleRad = gd.mirrorAngle * Math.PI / 180;
        const rx = 400 + Math.cos(2 * angleRad) * 400;
        const ry = 300 + Math.sin(2 * angleRad) * 400;
        ctx.lineTo(rx, ry);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Guía el haz láser al receptor", 400, 50);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText(`Conexión: ${Math.round((gd.alignedTime / 2) * 100)}%`, 400, 85);
    },
    inputAnguloPress(x, y) {},

    // ==========================================================
    // day_9_kid14_ave: La Postura del Ave Dorada
    // ==========================================================
    setupAve() {
        this.gameData = {
            balance: 0.5,
            tiltSpeed: 0.05,
            direction: 1,
            successTime: 0
        };
        this.score = 0;
    },
    updateAve(dt) {
        const gd = this.gameData;
        gd.balance += gd.direction * gd.tiltSpeed * dt * 4;
        
        if (Math.random() < 0.02) {
            gd.direction = Math.random() < 0.5 ? -1 : 1;
            gd.tiltSpeed = 0.03 + Math.random() * 0.1;
        }
        
        if (gd.balance < 0 || gd.balance > 1) {
            if (window.playProceduralSound) playProceduralSound('damage');
            this.screenShake = 15;
            gd.balance = 0.5;
            gd.successTime = Math.max(0, gd.successTime - 2);
        }
        
        if (gd.balance > 0.35 && gd.balance < 0.65) {
            gd.successTime += dt;
            this.score = Math.floor(gd.successTime);
            if (gd.successTime >= 10.0) {
                this.victory();
            }
        }
    },
    drawAve() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#263238';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(150, 480, 500, 20);
        
        ctx.fillStyle = '#66bb6a';
        ctx.fillRect(150 + 500 * 0.35, 480, 500 * 0.3, 20);
        
        ctx.fillStyle = '#ffb300';
        ctx.beginPath();
        ctx.arc(150 + 500 * gd.balance, 490, 16, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.save();
        ctx.translate(400, 300);
        const angle = (gd.balance - 0.5) * 50 * Math.PI / 180;
        ctx.rotate(angle);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(0, 50);
        ctx.lineTo(-40, 20);
        ctx.lineTo(-80, -20);
        ctx.lineTo(-20, -10);
        ctx.lineTo(0, -60);
        ctx.lineTo(20, -10);
        ctx.lineTo(80, -20);
        ctx.lineTo(40, 20);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Equilibrio mantenido: ${Math.floor(gd.successTime)}s / 10s`, 400, 80);
        ctx.font = '15px Outfit, sans-serif';
        ctx.fillText("Pulsa en los extremos de la pantalla para compensar el peso", 400, 115);
    },
    inputAvePress(x, y) {
        const gd = this.gameData;
        if (x < 400) {
            gd.balance = Math.max(0, gd.balance - 0.15);
        } else {
            gd.balance = Math.min(1, gd.balance + 0.15);
        }
        if (window.playProceduralSound) playProceduralSound('click');
    },

    // ==========================================================
    // day_9_kid14_tunnel: El Túnel Infinito
    // ==========================================================
    setupTunnel() {
        this.gameData = {
            gates: [],
            playerX: 400,
            gatesPassed: 0,
            spawnTimer: 0
        };
        this.score = 0;
    },
    updateTunnel(dt) {
        const gd = this.gameData;
        gd.playerX += (this.mouse.x - gd.playerX) * 0.15;
        
        gd.gates.forEach(g => {
            g.scale += 2.2 * dt;
        });
        
        gd.gates.forEach(g => {
            if (g.scale > 5 && !g.passed) {
                g.passed = true;
                const inside = Math.abs(gd.playerX - g.targetX) < 90;
                if ((g.type === 'green' && inside) || (g.type === 'red' && !inside)) {
                    gd.gatesPassed++;
                    this.score = gd.gatesPassed;
                    if (window.playProceduralSound) playProceduralSound('success');
                } else {
                    if (window.playProceduralSound) playProceduralSound('damage');
                    this.screenShake = 18;
                    gd.gatesPassed = Math.max(0, gd.gatesPassed - 2);
                }
            }
        });
        
        gd.gates = gd.gates.filter(g => g.scale < 6.5);
        
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.gates.push({
                scale: 0.1,
                targetX: 200 + Math.random() * 400,
                type: Math.random() < 0.6 ? 'green' : 'red',
                passed: false
            });
            gd.spawnTimer = 1.2;
        }
        
        if (gd.gatesPassed >= 15) {
            this.victory();
        }
    },
    drawTunnel() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.gates.forEach(g => {
            ctx.save();
            ctx.translate(400 + (g.targetX - 400) * (g.scale / 5), 300);
            ctx.scale(g.scale, g.scale);
            ctx.strokeStyle = g.type === 'green' ? '#00e676' : '#ff1744';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-25, -20, 50, 40);
            ctx.restore();
        });
        
        ctx.fillStyle = '#00b0ff';
        ctx.beginPath();
        ctx.arc(gd.playerX, 480, 16, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Portales alineados: ${gd.gatesPassed} / 15`, 400, 65);
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillText("Mueve tu cursor horizontalmente para cruzar los arcos verdes y esquivar los rojos", 400, 95);
    },
    inputTunnelPress(x, y) {},

    // ==========================================================
    // day_9_fam_portal: La Puerta a Otro Mundo
    // ==========================================================
    setupFamPortal() {
        this.gameData = {
            buttons: [
                { x: 220, y: 220, r: 35, color: '#f44336', name: 'Fuego', active: 0 },
                { x: 580, y: 220, r: 35, color: '#2196f3', name: 'Agua', active: 0 },
                { x: 220, y: 440, r: 35, color: '#4caf50', name: 'Tierra', active: 0 },
                { x: 580, y: 440, r: 35, color: '#ffeb3b', name: 'Aire', active: 0 }
            ],
            sequence: [],
            playerSequence: [],
            state: 'demo',
            seqIndex: 0,
            timer: 0.5,
            round: 1
        };
        this.score = 0;
        this.startFamPortalRound();
    },
    startFamPortalRound() {
        const gd = this.gameData;
        gd.sequence = [];
        gd.playerSequence = [];
        gd.state = 'demo';
        gd.seqIndex = 0;
        gd.timer = 0.5;
        
        const len = 2 + gd.round;
        for (let i = 0; i < len; i++) {
            gd.sequence.push(Math.floor(Math.random() * 4));
        }
    },
    updateFamPortal(dt) {
        const gd = this.gameData;
        gd.buttons.forEach(b => {
            if (b.active > 0) b.active -= dt * 4;
        });
        
        if (gd.state === 'demo') {
            gd.timer -= dt;
            if (gd.timer <= 0) {
                if (gd.seqIndex < gd.sequence.length) {
                    const idx = gd.sequence[gd.seqIndex];
                    gd.buttons[idx].active = 1.0;
                    if (window.playProceduralSound) playProceduralSound('collect');
                    gd.seqIndex++;
                    gd.timer = 0.6;
                } else {
                    gd.state = 'play';
                }
            }
        }
        
        if (gd.round > 3) {
            this.victory();
        }
    },
    drawFamPortal() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#1a0633';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.strokeStyle = '#ff3d00';
        ctx.lineWidth = 12;
        ctx.strokeRect(300, 200, 200, 250);
        
        if (gd.round > 1) {
            ctx.fillStyle = 'rgba(156, 39, 176, 0.4)';
            ctx.beginPath();
            ctx.arc(400, 320, 60, 0, Math.PI * 2);
            ctx.fill();
        }
        
        gd.buttons.forEach((b, idx) => {
            ctx.fillStyle = b.active > 0 ? '#ffffff' : b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(b.name, b.x, b.y + 55);
        });
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Desbloqueo de Portal: Ronda ${gd.round} / 3`, 400, 70);
    },
    inputFamPortalPress(x, y) {
        const gd = this.gameData;
        if (gd.state !== 'play') return;
        
        gd.buttons.forEach((b, idx) => {
            if (Math.hypot(x - b.x, y - b.y) < b.r + 15) {
                b.active = 1.0;
                gd.playerSequence.push(idx);
                if (window.playProceduralSound) playProceduralSound('click');
                
                const cur = gd.playerSequence.length - 1;
                if (gd.playerSequence[cur] !== gd.sequence[cur]) {
                    if (window.playProceduralSound) playProceduralSound('error');
                    this.screenShake = 15;
                    gd.round = Math.max(1, gd.round - 1);
                    this.startFamPortalRound();
                } else if (gd.playerSequence.length === gd.sequence.length) {
                    if (window.playProceduralSound) playProceduralSound('success');
                    gd.round++;
                    this.score = gd.round - 1;
                    setTimeout(() => {
                        this.startFamPortalRound();
                    }, 800);
                }
            }
        });
    },

    // ==========================================================
    // day_10_kid9_nishiki: Maestro Chatarra
    // ==========================================================
    setupNishiki() {
        this.gameData = {
            basketX: 400,
            foodItems: [],
            scoreCount: 0,
            spawnTimer: 0
        };
        this.score = 0;
    },
    updateNishiki(dt) {
        const gd = this.gameData;
        gd.basketX += (this.mouse.x - gd.basketX) * 0.2;
        
        gd.foodItems.forEach(item => {
            item.y += 240 * dt;
        });
        
        gd.foodItems.forEach(item => {
            if (item.y > 480 && item.y < 520 && Math.abs(item.x - gd.basketX) < 55) {
                if (item.type === 'good') {
                    gd.scoreCount++;
                    this.score = gd.scoreCount;
                    if (window.playProceduralSound) playProceduralSound('collect');
                } else {
                    gd.scoreCount = Math.max(0, gd.scoreCount - 3);
                    this.score = gd.scoreCount;
                    if (window.playProceduralSound) playProceduralSound('damage');
                    this.screenShake = 15;
                }
                item.y = 999;
            }
        });
        
        gd.foodItems = gd.foodItems.filter(item => item.y < 600);
        
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            const isGood = Math.random() < 0.65;
            gd.foodItems.push({
                x: 100 + Math.random() * 600,
                y: -30,
                type: isGood ? 'good' : 'bad',
                icon: isGood ? (Math.random() < 0.5 ? '🍤' : '🍡') : '🥫'
            });
            gd.spawnTimer = 0.8 + Math.random() * 0.4;
        }
        
        if (gd.scoreCount >= 15) {
            this.victory();
        }
    },
    drawNishiki() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#ffecb3';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.foodItems.forEach(item => {
            ctx.font = '32px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.icon, item.x, item.y);
        });
        
        ctx.fillStyle = '#795548';
        ctx.fillRect(gd.basketX - 50, 500, 100, 30);
        
        ctx.fillStyle = '#5d4037';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Ingredientes recolectados: ${gd.scoreCount} / 15`, 400, 70);
    },
    inputNishikiPress(x, y) {},

    // ==========================================================
    // day_10_kid9_dragon: El Dragón del Mercado
    // ==========================================================
    setupDragon() {
        this.gameData = {
            dragon: [
                { x: 400, y: 300 },
                { x: 380, y: 300 },
                { x: 360, y: 300 }
            ],
            dirX: 1,
            dirY: 0,
            lantern: { x: 200, y: 200 },
            stepTimer: 0.15,
            lengthEarned: 0
        };
        this.score = 0;
        this.spawnDragonLantern();
    },
    spawnDragonLantern() {
        this.gameData.lantern = {
            x: 80 + Math.floor(Math.random() * 28) * 20,
            y: 80 + Math.floor(Math.random() * 20) * 20
        };
    },
    updateDragon(dt) {
        const gd = this.gameData;
        if (this.mouse.isDown) {
            const head = gd.dragon[0];
            const dx = this.mouse.x - head.x;
            const dy = this.mouse.y - head.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                gd.dirX = dx > 0 ? 1 : -1;
                gd.dirY = 0;
            } else {
                gd.dirX = 0;
                gd.dirY = dy > 0 ? 1 : -1;
            }
        }
        
        gd.stepTimer -= dt;
        if (gd.stepTimer <= 0) {
            gd.stepTimer = 0.15;
            for (let i = gd.dragon.length - 1; i > 0; i--) {
                gd.dragon[i].x = gd.dragon[i - 1].x;
                gd.dragon[i].y = gd.dragon[i - 1].y;
            }
            gd.dragon[0].x += gd.dirX * 20;
            gd.dragon[0].y += gd.dirY * 20;
            
            const head = gd.dragon[0];
            if (head.x < 20 || head.x > 780 || head.y < 20 || head.y > 580) {
                if (window.playProceduralSound) playProceduralSound('error');
                this.screenShake = 15;
                gd.dragon = [
                    { x: 400, y: 300 },
                    { x: 380, y: 300 },
                    { x: 360, y: 300 }
                ];
                gd.dirX = 1;
                gd.dirY = 0;
            }
            
            const dist = Math.hypot(head.x - gd.lantern.x, head.y - gd.lantern.y);
            if (dist < 20) {
                gd.lengthEarned++;
                this.score = gd.lengthEarned;
                if (window.playProceduralSound) playProceduralSound('success');
                gd.dragon.push({ x: gd.dragon[gd.dragon.length - 1].x, y: gd.dragon[gd.dragon.length - 1].y });
                this.spawnDragonLantern();
            }
        }
        
        if (gd.lengthEarned >= 10) {
            this.victory();
        }
    },
    drawDragon() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#880e4f';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, 760, 560);
        
        ctx.font = '30px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏮', gd.lantern.x, gd.lantern.y + 8);
        
        gd.dragon.forEach((seg, idx) => {
            ctx.fillStyle = idx === 0 ? '#ffea00' : '#d500f9';
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Largo del Dragón: ${gd.lengthEarned} / 10`, 400, 65);
    },
    inputDragonPress(x, y) {},

    // ==========================================================
    // day_10_kid9_rainbow: El Snack Arcoíris
    // ==========================================================
    setupRainbow() {
        this.gameData = {
            snacks: [],
            plates: [
                { x: 200, y: 500, color: '#f48fb1', name: 'Rosa' },
                { x: 400, y: 500, color: '#a5d6a7', name: 'Verde' },
                { x: 600, y: 500, color: '#ffe082', name: 'Amarillo' }
            ],
            draggingSnack: null,
            scoreCount: 0,
            spawnTimer: 0
        };
        this.score = 0;
    },
    updateRainbow(dt) {
        const gd = this.gameData;
        if (gd.draggingSnack) {
            gd.draggingSnack.x = this.mouse.x;
            gd.draggingSnack.y = this.mouse.y;
        }
        
        gd.snacks.forEach(s => {
            if (s !== gd.draggingSnack) {
                s.y += 110 * dt;
            }
        });
        
        const beforeLen = gd.snacks.length;
        gd.snacks = gd.snacks.filter(s => s.y < 580 || s === gd.draggingSnack);
        if (gd.snacks.length < beforeLen) {
            if (window.playProceduralSound) playProceduralSound('error');
        }
        
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            const plateIdx = Math.floor(Math.random() * 3);
            gd.snacks.push({
                x: 150 + Math.random() * 500,
                y: -20,
                plateIdx: plateIdx,
                color: gd.plates[plateIdx].color,
                r: 20
            });
            gd.spawnTimer = 1.5 + Math.random() * 0.8;
        }
        
        if (gd.scoreCount >= 12) {
            this.victory();
        }
    },
    drawRainbow() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#fce4ec';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.plates.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, 60, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#880e4f';
            ctx.font = 'bold 12px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(p.name, p.x, p.y + 35);
        });
        
        gd.snacks.forEach(s => {
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y - s.r);
            ctx.lineTo(s.x, s.y + s.r + 5);
            ctx.stroke();
        });
        
        ctx.fillStyle = '#880e4f';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Snacks clasificados: ${gd.scoreCount} / 12`, 400, 60);
    },
    inputRainbowPress(x, y) {
        const gd = this.gameData;
        for (let s of gd.snacks) {
            if (Math.hypot(x - s.x, y - s.y) < s.r + 15) {
                gd.draggingSnack = s;
                if (window.playProceduralSound) playProceduralSound('click');
                break;
            }
        }
    },
    releaseRainbow(x, y) {
        const gd = this.gameData;
        if (!gd.draggingSnack) return;
        
        const s = gd.draggingSnack;
        gd.draggingSnack = null;
        
        let matchedPlateIdx = -1;
        gd.plates.forEach((p, idx) => {
            if (Math.hypot(s.x - p.x, s.y - p.y) < 70) {
                matchedPlateIdx = idx;
            }
        });
        
        if (matchedPlateIdx === s.plateIdx) {
            gd.scoreCount++;
            this.score = gd.scoreCount;
            if (window.playProceduralSound) playProceduralSound('success');
            gd.snacks = gd.snacks.filter(item => item !== s);
        } else {
            s.y = 100;
            if (window.playProceduralSound) playProceduralSound('error');
        }
    },

    // ==========================================================
    // day_10_kid9_matcha: Poción de Matcha
    // ==========================================================
    setupMatcha() {
        this.gameData = {
            froth: 0,
            lastX: 400,
            speedAccum: 0
        };
        this.score = 0;
    },
    updateMatcha(dt) {
        const gd = this.gameData;
        if (this.mouse.isDown) {
            const dx = Math.abs(this.mouse.x - gd.lastX);
            if (this.mouse.y > 250 && this.mouse.y < 450) {
                gd.speedAccum += dx * 0.12;
            }
            gd.lastX = this.mouse.x;
        }
        
        gd.froth += gd.speedAccum * dt * 0.5;
        gd.speedAccum *= 0.92;
        gd.froth = Math.max(0, Math.min(100, gd.froth - dt * 4));
        this.score = Math.round(gd.froth);
        
        if (gd.froth >= 100) {
            this.victory();
        }
    },
    drawMatcha() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#e8f5e9';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.arc(400, 350, 150, 0, Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.arc(400, 350, 140, 0, Math.PI);
        ctx.fill();
        
        if (gd.froth > 10) {
            ctx.fillStyle = '#a5d6a7';
            ctx.beginPath();
            ctx.arc(400, 350, 140 * (gd.froth/100), 0, Math.PI);
            ctx.fill();
        }
        
        ctx.fillStyle = '#424242';
        ctx.fillRect(200, 520, 400, 20);
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(200, 520, 400 * (gd.froth/100), 20);
        
        ctx.fillStyle = '#1b5e20';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Espuma Matcha: ${Math.round(gd.froth)}% / 100%`, 400, 70);
    },
    inputMatchaPress(x, y) {
        this.gameData.lastX = x;
    },

    // ==========================================================
    // day_10_kid14_milla: La Milla del Samurái
    // ==========================================================
    setupMilla() {
        this.gameData = {
            distance: 0,
            playerY: 450,
            vy: 0,
            jumping: false,
            speed: 250,
            obstacles: [],
            spawnTimer: 0
        };
        this.score = 0;
    },
    updateMilla(dt) {
        const gd = this.gameData;
        gd.distance += gd.speed * dt * 0.1;
        this.score = Math.floor(gd.distance);
        
        if (gd.jumping) {
            gd.vy += 950 * dt;
            gd.playerY += gd.vy * dt;
            if (gd.playerY >= 450) {
                gd.playerY = 450;
                gd.jumping = false;
                gd.vy = 0;
            }
        }
        
        gd.obstacles.forEach(o => {
            o.x -= gd.speed * dt;
        });
        
        gd.obstacles.forEach(o => {
            if (o.x > 180 && o.x < 220 && gd.playerY > 400) {
                if (window.playProceduralSound) playProceduralSound('damage');
                this.screenShake = 15;
                gd.distance = Math.max(0, gd.distance - 40);
                o.x = -999;
            }
        });
        
        gd.obstacles = gd.obstacles.filter(o => o.x > -50);
        
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            gd.obstacles.push({ x: 850, type: 'barrel' });
            gd.spawnTimer = 1.3 + Math.random() * 0.8;
        }
        
        if (gd.distance >= 300) {
            this.victory();
        }
    },
    drawMilla() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#ffe0b2';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#bcaaa4';
        ctx.fillRect(0, 480, 800, 120);
        
        ctx.fillStyle = '#311b92';
        ctx.beginPath();
        ctx.arc(200, gd.playerY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        gd.obstacles.forEach(o => {
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(o.x - 15, 435, 30, 45);
        });
        
        ctx.fillStyle = '#4e342e';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Distancia: ${this.score}m / 300m`, 400, 70);
    },
    inputMillaPress(x, y) {
        const gd = this.gameData;
        if (!gd.jumping) {
            gd.jumping = true;
            gd.vy = -550;
            if (window.playProceduralSound) playProceduralSound('jump');
        }
    },

    // ==========================================================
    // day_10_kid14_tako: Comida Bizarra
    // ==========================================================
    setupTako() {
        this.gameData = {
            moles: [
                { x: 200, y: 220, active: false, time: 0, icon: '🐙' },
                { x: 400, y: 220, active: false, time: 0, icon: '🐙' },
                { x: 600, y: 220, active: false, time: 0, icon: '🐙' },
                { x: 200, y: 400, active: false, time: 0, icon: '🐙' },
                { x: 400, y: 400, active: false, time: 0, icon: '🐙' },
                { x: 600, y: 400, active: false, time: 0, icon: '🐙' }
            ],
            hitCount: 0,
            spawnTimer: 0
        };
        this.score = 0;
    },
    updateTako(dt) {
        const gd = this.gameData;
        gd.moles.forEach(m => {
            if (m.active) {
                m.time -= dt;
                if (m.time <= 0) {
                    m.active = false;
                }
            }
        });
        
        gd.spawnTimer -= dt;
        if (gd.spawnTimer <= 0) {
            const inactiveMoles = gd.moles.filter(m => !m.active);
            if (inactiveMoles.length > 0) {
                const pick = inactiveMoles[Math.floor(Math.random() * inactiveMoles.length)];
                pick.active = true;
                pick.time = 0.8 + Math.random() * 0.5;
            }
            gd.spawnTimer = 0.6 + Math.random() * 0.4;
        }
        
        if (gd.hitCount >= 15) {
            this.victory();
        }
    },
    drawTako() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.moles.forEach(m => {
            ctx.fillStyle = '#90a4ae';
            ctx.fillRect(m.x - 50, m.y - 10, 100, 60);
            if (m.active) {
                ctx.font = '38px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(m.icon, m.x, m.y - 20);
            }
        });
        
        ctx.fillStyle = '#263238';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Pulpos ensartados: ${gd.hitCount} / 15`, 400, 70);
    },
    inputTakoPress(x, y) {
        const gd = this.gameData;
        gd.moles.forEach(m => {
            if (m.active && Math.hypot(x - m.x, y - (m.y - 20)) < 45) {
                m.active = false;
                gd.hitCount++;
                this.score = gd.hitCount;
                if (window.playProceduralSound) playProceduralSound('collect');
                for (let i = 0; i < 10; i++) {
                    this.particles.push({
                        x: m.x, y: m.y - 20,
                        vx: (Math.random() - 0.5) * 150, vy: (Math.random() - 0.5) * 150,
                        life: 0.6, size: 3, color: '#e57373'
                    });
                }
            }
        });
    },

    // ==========================================================
    // day_10_fam_sayonara: Sayonara Kioto
    // ==========================================================
    setupSayonara() {
        const icons = ['⛩️', '🍣', '🐙', '🏯', '🍵', '🎋'];
        let cardList = [...icons, ...icons];
        cardList.sort(() => Math.random() - 0.5);
        
        this.gameData = {
            cards: cardList.map((icon, idx) => ({
                id: idx,
                icon: icon,
                flipped: false,
                matched: false
            })),
            selected: [],
            pairsFound: 0
        };
        this.score = 0;
    },
    updateSayonara(dt) {
        const gd = this.gameData;
        if (gd.pairsFound === 6) {
            this.victory();
        }
    },
    drawSayonara() {
        const ctx = this.ctx;
        const gd = this.gameData;
        ctx.fillStyle = '#ffe8e8';
        ctx.fillRect(0, 0, 800, 600);
        
        gd.cards.forEach((card, idx) => {
            const col = idx % 4;
            const row = Math.floor(idx / 4);
            const cx = 160 + col * 140;
            const cy = 160 + row * 130;
            
            ctx.fillStyle = (card.flipped || card.matched) ? '#ffffff' : '#f06292';
            ctx.strokeStyle = '#c2185b';
            ctx.lineWidth = 3;
            ctx.fillRect(cx - 50, cy - 50, 100, 100);
            ctx.strokeRect(cx - 50, cy - 50, 100, 100);
            
            if (card.flipped || card.matched) {
                ctx.font = '36px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(card.icon, cx, cy + 12);
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 20px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('🌸', cx, cy + 8);
            }
        });
        
        ctx.fillStyle = '#880e4f';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Parejas encontradas: ${gd.pairsFound} / 6`, 400, 75);
    },
    inputSayonaraPress(x, y) {
        const gd = this.gameData;
        if (gd.selected.length >= 2) return;
        
        gd.cards.forEach(card => {
            if (card.matched || card.flipped) return;
            
            const col = card.id % 4;
            const row = Math.floor(card.id / 4);
            const cx = 160 + col * 140;
            const cy = 160 + row * 130;
            
            if (x > cx - 50 && x < cx + 50 && y > cy - 50 && y < cy + 50) {
                card.flipped = true;
                gd.selected.push(card);
                if (window.playProceduralSound) playProceduralSound('click');
                
                if (gd.selected.length === 2) {
                    const first = gd.selected[0];
                    const second = gd.selected[1];
                    if (first.icon === second.icon) {
                        first.matched = true;
                        second.matched = true;
                        gd.pairsFound++;
                        this.score = gd.pairsFound;
                        gd.selected = [];
                        if (window.playProceduralSound) playProceduralSound('success');
                    } else {
                        setTimeout(() => {
                            first.flipped = false;
                            second.flipped = false;
                            gd.selected = [];
                            if (window.playProceduralSound) playProceduralSound('error');
                        }, 800);
                    }
                }
            }
        });
    },

    // Color interpolation helper
    lerpColor(a, b, amount) {
        let ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);
        return '#' + ((1 << 24) + (Math.round(rr) << 16) + (Math.round(rg) << 8) + Math.round(rb)).toString(16).slice(1);
    }
};
