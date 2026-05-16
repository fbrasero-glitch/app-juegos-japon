BLOQUE COMPLETO DE MISIONES (DÍAS 11 AL 24)

Añade todas las misiones descritas a continuación a la app. Cada misión debe integrarse en el sistema de perfiles (kid9, kid14), el Modo Juez (unlocked → pending → approved/rejected) y el almacenamiento en localStorage/IndexedDB. Cada misión aparece en la pantalla de su día correspondiente, con su propia UI, botón "Enviar al Juez" y liberación de recursos al salir.

INSTRUCCIONES IMPORTANTES PARA EL DESARROLLADOR:
- Las misiones descritas aquí son COMPLETAS. No dependen de código escrito para días anteriores.
- Si alguna mecánica es similar a otra (ej. dos misiones usan cronómetro), puedes reutilizar internamente la misma función, pero cada misión debe tener su propia entrada en el gameState y su propia UI.
- Cada misión incluye todos los detalles necesarios: concepto, UI exacta, técnica de implementación, validación y feedback.

---

## DÍA 11: Alpes y Relax (Okuhida / Kazeya Ryokan)

### MISIÓN 1: "El Código Onsen" (Lógica) | Niña 9 años | 15 XP
Concepto: Antes de entrar al onsen, la niña debe conocer las 3 reglas sagradas.
UI (.ui-kids): 3 checkboxes con textos: "✅ Me duché antes de entrar", "✅ No llevo bañador (solo la toalla pequeña)", "✅ La toalla no toca el agua". Un botón "Validar reglas".
Técnica: Cuando pulsa "Validar reglas", la app comprueba que los 3 checkboxes estén marcados. Si falta alguno, muestra un mensaje "Falta una regla. ¡Revísa!" y no deja enviar. Si los 3 están marcados, se activa el botón "Enviar al Juez".
Validación Juez: El Juez ve que las 3 reglas están marcadas y aprueba. Guardar en gameState.kid9.missions.day_11_onsen.

### MISIÓN 2: "El Té Intacto" (Experto - DeviceOrientation) | Niña 9 años | 25 XP
Concepto: Caminar 20 segundos desde la habitación hasta el onsen con el móvil nivelado como una bandeja de té.
UI (.ui-kids): Una taza de té matcha vista desde arriba (círculo verde con borde de cerámica). El líquido se mueve en tiempo real según la inclinación. Temporizador regresivo de 20 segundos. Botón "Empezar a caminar".
Técnica: Al pulsar "Empezar", registrar los ángulos beta y gamma iniciales (posición de referencia). En cada evento 'deviceorientation', calcular |beta - beta_inicial| y |gamma - gamma_inicial|. Si cualquiera supera 8 grados, el té se derrama: el líquido se vuelve gris (cambio de color CSS), aparece el mensaje "¡Oh no! El té se ha derramado..." y la misión falla. Si mantiene los ángulos dentro del umbral durante 20 segundos, el té emite vapor (CSS animation), aparece "¡El té sigue intacto! Eres una maestra del equilibrio." y el botón "Enviar al Juez". Guardar en gameState.kid9.missions.day_11_tea.

### MISIÓN 3: "Cazadora de Yukatas" (Contador) | Niña 9 años | 15 XP
Concepto: Contar cuántas personas ve vistiendo el yukata del ryokan durante la tarde.
UI (.ui-kids): Contador con botones + y -. Texto: "¿Cuántas personas con yukata has visto?" Botón "Enviar recuento".
Validación Juez: El Juez ve el número y aprueba si es realista (mínimo 2 personas). Guardar en gameState.kid9.missions.day_11_yukata.

### MISIÓN 4: "La Textura del Tatami" (Foto Macro) | Niña 9 años | 15 XP
Concepto: Acercar el móvil al suelo de la habitación y fotografiar el trenzado del tatami.
UI (.ui-kids): Cámara. Texto: "Arrodíllate y haz una foto muy de cerca al suelo de tatami. ¡Que se vea el trenzado!"
Validación Juez: El Juez ve la foto macro. Guardar en gameState.kid9.missions.day_11_tatami.

### MISIÓN 5: "Catador de Kaiseki" (Texto) | Niño 14 años | 20 XP
Concepto: Durante la cena kaiseki, probar el plato más extraño y describirlo como un crítico gastronómico.
UI (.ui-terminal): 3 inputs de texto con etiquetas: "Nombre del plato", "Adjetivo 1", "Adjetivo 2", "Adjetivo 3". Un input adicional: "Si tuvieras que maridarlo con una bebida, ¿cuál sería?". Botón "Enviar cata".
Validación Juez: El Juez lee la cata y aprueba si hay un mínimo de esfuerzo descriptivo. Guardar en gameState.kid14.missions.day_11_kaiseki.

### MISIÓN 6: "Rastreador de Manantiales" (Experto - Geolocation) | Niño 14 años | 25 XP
Concepto: Encontrar el punto de origen del agua termal usando solo coordenadas y una brújula textual.
UI (.ui-terminal): Texto: ">>> RASTREANDO MANANTIAL. Objetivo: Nodo Termal." La app muestra en tiempo real: "Distancia al nodo: Xm" (calculada con Haversine). Un botón "Marcar posición".
Técnica: Coordenada objetivo predefinida (ej: lat 36.225, lon 137.550, ajustable según el ryokan). Usar watchPosition con enableHighAccuracy: true. Calcular distancia con la fórmula de Haversine. Si la distancia es < 15 metros, se activa el botón "Enviar al Juez". Si no, muestra ">>> Señal débil. Acércate al origen."
Validación Juez: El Juez ve la distancia final. Guardar en gameState.kid14.missions.day_11_spring.

### MISIÓN 7: "Arquitectura Termal" (Cálculo) | Niño 14 años | 20 XP
Concepto: Medir aproximadamente la piscina del onsen y calcular su volumen en litros.
UI (.ui-terminal): 3 inputs numéricos: "Largo (metros)", "Ancho (metros)", "Profundidad (metros)". Un botón "Calcular". La app muestra: "Volumen estimado: X m³ = X litros".
Validación Juez: El Juez ve las medidas y el cálculo (no busca precisión, solo razonabilidad). Guardar en gameState.kid14.missions.day_11_architecture.

### MISIÓN 8: "Economía Alpina" (Deducción) | Niño 14 años | 15 XP
Concepto: Estimar cuánto cuesta mantener el ryokan un día (personal, comida, agua termal, electricidad).
UI (.ui-terminal): Input numérico: "Coste diario estimado (yenes)". Texto de ayuda: "Piensa en cuánta gente trabaja aquí, la comida, la luz, el agua..."
Validación Juez: El Juez ve la cifra. Cualquier cantidad > 50000 yenes es razonable. Guardar en gameState.kid14.missions.day_11_economy.

### MISIÓN 9 (Conjunta): "El Equilibrio del Yukata" (Física) | Ambos | 20 XP c/u
Concepto: Caminar 30 pasos en línea recta con las zapatillas de madera (geta) sin tropezar.
UI (pantalla compartida): Botón "Iniciar" y botón "¡Terminé!". Un contador de pasos (el niño pulsa +1 por cada paso).
Validación Juez: El Juez observa la prueba y aprueba si completó los 30 pasos sin caerse. Guardar en gameState.kid9.missions.day_11_geta y gameState.kid14.missions.day_11_geta.

---

## DÍA 12: Takayama Feudal

### MISIÓN 1: "El Silencio de los Kami" (Experto - Audio) | Niña 9 años | 25 XP
Concepto: En los templos de Takayama, permanecer en silencio absoluto durante 10 segundos. La app detecta si se rompe el silencio.
UI (.ui-kids): Un círculo central con un emoji de espíritu del bosque durmiendo 😴💤. Texto: "No despiertes al Kami... guarda silencio." Barra de progreso circular de 10 segundos.
Técnica: Al pulsar "Iniciar", getUserMedia({ audio: true }), crear AudioContext y AnalyserNode. En cada requestAnimationFrame, leer analyser.getByteFrequencyData y calcular la media del array. Si la media supera el UMBRAL (30), el espíritu se despierta (círculo rojo palpitante, emoji 😱) y el contador se reinicia. Si mantiene la media por debajo del umbral durante 10 segundos, el espíritu brilla dorado y aparece "¡El Kami te bendice!".
Validación Juez: La app valida automáticamente. Guardar en gameState.kid9.missions.day_12_silence. Liberar AudioContext al salir.

### MISIÓN 2: "La Bola de Cedro" (Foto) | Niña 9 años | 15 XP
Concepto: Las tiendas de sake cuelgan una Sugidama (bola de ramas de cedro) en la entrada. Encontrar una y fotografiarla.
UI (.ui-kids): Cámara. Texto: "Busca una bola gigante de ramas colgando de una tienda de sake. ¡Se llama Sugidama!"
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_12_sugidama.

### MISIÓN 3: "Detective de Madera" (Observación) | Niña 9 años | 15 XP
Concepto: Las fachadas de Takayama tienen tallas de madera con animales y criaturas. Encontrar la más divertida.
UI (.ui-kids): Cámara + input de texto: "¿Qué animal es? ¿Dónde estaba?".
Validación Juez: El Juez ve la foto y la descripción. Guardar en gameState.kid9.missions.day_12_wood.

### MISIÓN 4: "Degustadora de Hida" (Votación) | Niña 9 años | 15 XP
Concepto: Probar la famosa carne de Hida y puntuarla.
UI (.ui-kids): Un slider de 1 a 5 estrellas (inputs radio con iconos de estrella). Texto: "Puntúa el sabor de la carne de Hida".
Validación Juez: El Juez ve la puntuación. Guardar en gameState.kid9.missions.day_12_hida.

### MISIÓN 5: "Talla en Madera" (Experto - Canvas) | Niño 14 años | 25 XP
Concepto: En Takayama, los artesanos tallan madera. El chico debe dibujar el kanji 木 (árbol) copiando una talla real.
UI (.ui-terminal): Canvas de 300x300px con fondo oscuro. Trazo grueso verde (#00FF41). La referencia del kanji 木 aparece en pequeño en una esquina. Botón "Borrar" y "Enviar trazo".
Técnica: touchstart, touchmove (con e.preventDefault()), touchend. Configurar ctx.lineCap = 'round' y ctx.lineJoin = 'round'. Al pulsar "Enviar trazo", guardar canvas.toDataURL().
Validación Juez: El Juez recibe el dibujo. Guardar en gameState.kid14.missions.day_12_carving.

### MISIÓN 6: "Maestro Destilador" (Matemáticas) | Niño 14 años | 20 XP
Concepto: La destilería de sake Funasaka fue fundada en 1703. El chico debe buscar esta fecha en los carteles y calcular cuántos años lleva funcionando.
UI (.ui-terminal): Input numérico: "Años de la destilería (2026 - año de fundación)". La app puede mostrar una pista tras el primer fallo: "Busca la fecha de fundación en los carteles de la destilería".
Validación Juez: La respuesta correcta es 2026 - 1703 = 323. El Juez ve el número. Guardar en gameState.kid14.missions.day_12_sake.

### MISIÓN 7: "Patrulla del Casco Antiguo" (Contador) | Niño 14 años | 15 XP
Concepto: Recorrer la calle Sanmachi Suji contando casas tradicionales de madera oscura.
UI (.ui-terminal): Contador con botones + y -. Texto: ">>> CASAS TRADICIONALES DETECTADAS: [número]". Botón "Enviar recuento".
Validación Juez: El Juez ve el número (mínimo 5 para aprobar). Guardar en gameState.kid14.missions.day_12_patrol.

### MISIÓN 8: "Tasador Feudal" (Deducción) | Niño 14 años | 15 XP
Concepto: Estimar cuánto costaría comprar una casa tradicional en Sanmachi Suji.
UI (.ui-terminal): Input numérico: "Precio estimado (euros)". Texto de ayuda: "Una casa tradicional de madera en una calle histórica protegida..."
Validación Juez: Cualquier cifra > 200.000 € muestra que ha pensado en el valor real. Guardar en gameState.kid14.missions.day_12_appraisal.

### MISIÓN 9 (Conjunta): "Cruzando el Miyagawa" (Foto) | Ambos | 20 XP c/u
Concepto: Selfie familiar en el puente rojo sobre el río Miyagawa.
UI (ambos perfiles): Checkbox "✅ Foto en el puente rojo hecha". Botón "Enviar".
Validación Juez: El Juez revisa la foto en la galería del móvil. Guardar en gameState.kid9.missions.day_12_bridge y gameState.kid14.missions.day_12_bridge.

---

## DÍA 13: Kawaguchiko y el Fuji

### MISIÓN 1: "La Escalada Chureito" (Física) | Niña 9 años | 20 XP
Concepto: Subir los casi 400 escalones hasta la Pagoda Chureito y contar mentalmente el número exacto.
UI (.ui-kids): Input numérico grande. Texto: "¿Cuántos escalones has subido? Escribe el número exacto". Rango aceptable: 390-405.
Validación Juez: El Juez ve el número (la respuesta real es 398). Si está en el rango, aprueba. Guardar en gameState.kid9.missions.day_13_stairs.

### MISIÓN 2: "El Sello del Lago" (Cultura) | Niña 9 años | 15 XP
Concepto: Las tapas de alcantarilla de Kawaguchiko llevan dibujos del Fuji, el lago y flores. Encontrar una y fotografiarla.
UI (.ui-kids): Cámara. Texto: "Busca una tapa de alcantarilla decorada con el Fuji. ¡Son obras de arte!"
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_13_manhole.

### MISIÓN 3: "Sabores del Fuji" (Color) | Niña 9 años | 15 XP
Concepto: Frente al lago, hay puestos de helados de sabores raros. Probar uno y clasificar su color.
UI (.ui-kids): Input de texto: "¿De qué sabor era el helado más raro?". 5 botones de color para elegir: 🟢 Verde (Matcha), 🟣 Morado (Taro), 🟡 Amarillo (Melón), 🔵 Azul (Blue Hawaii), ⚪ Blanco (Vainilla). Botón "Enviar sabor".
Validación Juez: El Juez ve el sabor y el color. Guardar en gameState.kid9.missions.day_13_icecream.

### MISIÓN 4: "Filtro de Yōkai" (Experto - Canvas Pixel) | Niña 9 años | 25 XP
Concepto: Usar la cámara del móvil como un "visor térmico" que invierte los colores para revelar espíritus ocultos en el bosque.
UI (.ui-kids): Un visor a pantalla completa: video + canvas superpuestos. Botón "Capturar espectro".
Técnica: getUserMedia({ video: { facingMode: 'environment' } }). El <video> debe tener playsinline autoplay muted. En cada requestAnimationFrame, dibujar el frame en un canvas, obtener ImageData, invertir cada píxel (255-R, 255-G, 255-B), y volcar con putImageData. Al pulsar "Capturar espectro", guardar canvas.toDataURL().
Validación Juez: El Juez recibe la imagen filtrada. Guardar en gameState.kid9.missions.day_13_yokai.

### MISIÓN 5: "Perspectiva del Gigante" (Arte) | Niño 14 años | 20 XP
Concepto: Foto de ilusión óptica donde parezca que está tocando la punta del Fuji con el dedo.
UI (.ui-terminal): Cámara. La app muestra una guía visual previa (silueta de mano junto a un dibujo del Fuji). Botón "Enviar ilusión".
Validación Juez: El Juez ve la foto. Guardar en gameState.kid14.missions.day_13_perspective.

### MISIÓN 6: "Navegantes del Asfalto" (OSINT) | Niño 14 años | 15 XP
Concepto: Durante el trayecto en coche, contar los túneles por los que pasan y anotarlos.
UI (.ui-terminal): Input numérico: ">>> TÚNELES ATRAVESADOS:". Botón "Enviar recuento".
Validación Juez: El Juez contrasta el número con la realidad (no hay mínimo, se valora la atención). Guardar en gameState.kid14.missions.day_13_tunnels.

### MISIÓN 7: "Análisis Vulcanológico" (Texto) | Niño 14 años | 20 XP
Concepto: Buscar en Google (tiene conexión en el lago) qué tipo de volcán es el Fuji y cuándo fue su última erupción.
UI (.ui-terminal): Dos inputs de texto: "Tipo de volcán" y "Última erupción (año)".
Validación Juez: Respuestas correctas: "estratovolcán" y "1707". Guardar en gameState.kid14.missions.day_13_volcano.

### MISIÓN 8: "Triangulación del Fuji" (Cálculo) | Niño 14 años | 20 XP
Concepto: Estimar a qué distancia en línea recta está la cima del Fuji desde su posición.
UI (.ui-terminal): La app muestra una breve explicación: "Si extiendes el brazo y el Fuji mide como tu pulgar, la distancia es unas 25 veces su altura (3776m)." Input numérico: "Distancia estimada (km)". Botón "Enviar estimación".
Validación Juez: Respuestas cercanas a 25-30 km son válidas. Guardar en gameState.kid14.missions.day_13_triangulation.

### MISIÓN 9 (Conjunta): "Oishi Park en Flor" (Foto) | Ambos | 20 XP c/u
Concepto: Foto familiar en el parque Oishi con las flores de temporada en primer plano y el Fuji al fondo.
UI (ambos perfiles): Checkbox "✅ Foto en Oishi Park". Botón "Enviar".
Validación Juez: El Juez revisa la foto. Guardar en gameState.kid9.missions.day_13_oishi y gameState.kid14.missions.day_13_oishi.

---

## DÍA 14: El Gigante Sagrado (Monte Fuji)

### MISIÓN 1: "Aliento de Volcán" (Observación) | Niña 9 años | 15 XP
Concepto: En la 5ª Estación, encontrar una piedra volcánica negra y porosa y hacerle una foto muy de cerca.
UI (.ui-kids): Cámara. Texto: "Encuentra una piedra negra con agujeritos. ¡Es lava solidificada! Hazle una foto muy de cerca."
Validación Juez: El Juez ve la foto macro. Guardar en gameState.kid9.missions.day_14_rock.

### MISIÓN 2: "El Sonido que Muere" (Audio) | Niña 9 años | 20 XP
Concepto: En el bosque Aokigahara, el sonido no rebota porque la roca volcánica lo absorbe. Dar una palmada y grabar el silencio que sigue.
UI (.ui-kids): Botón "Grabar palmada". La app graba 5 segundos con getUserMedia + MediaRecorder. Texto: "Da una palmada fuerte. ¿Escuchas cómo el sonido muere al instante?"
Validación Juez: El Juez escucha el audio. Si se oye la palmada y luego un silencio inusual, aprueba. Guardar en gameState.kid9.missions.day_14_echo. Liberar MediaStream al salir.

### MISIÓN 3: "El Guardián del Bosque" (Arte) | Niña 9 años | 15 XP
Concepto: En Aokigahara, las raíces crecen sobre la roca formando figuras extrañas. Fotografiar la más retorcida.
UI (.ui-kids): Cámara. Texto: "Las raíces aquí no pueden penetrar la roca. Encuentra la raíz más retorcida y fantasmal."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_14_root.

### MISIÓN 4: "Brújula al Cráter" (Experto - DeviceOrientation) | Niña 9 años | 25 XP
Concepto: En un mirador, orientar el móvil exactamente hacia la cima del Fuji usando el giroscopio.
UI (.ui-kids): Una brújula circular dibujada con CSS. Una flecha central que apunta hacia donde está orientado el móvil. Texto: "Apunta con el móvil hacia la cima del Fuji".
Técnica: Escuchar 'deviceorientation'. Calcular el azimuth (ángulo de orientación horizontal a partir de alpha, beta, gamma). La dirección correcta al Fuji desde la 5ª Estación está predefinida. Cuando el azimuth coincide (±10°), la pantalla se pone verde y aparece "¡Acertaste!".
Validación Juez: La app valida automáticamente. Guardar en gameState.kid9.missions.day_14_compass.

### MISIÓN 5: "Radar de Altitud Cero" (Experto - Geolocation) | Niño 14 años | 25 XP
Concepto: Alejarse de las tiendas hasta encontrar un punto geográfico ciego usando solo coordenadas.
UI (.ui-terminal): Texto: ">>> BUSCANDO NODO CIEGO." Muestra distancia en metros en tiempo real. Un medidor de intensidad de señal: "SEÑAL DÉBIL/MEDIA/FUERTE". Un "bip" visual (carácter █ parpadeante) que se acelera al acercarse.
Técnica: Coordenada objetivo fija cerca de la 5ª Estación. watchPosition + Haversine. La distancia se actualiza en cada lectura. Si distancia < 10m, misión completada.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid14.missions.day_14_radar.

### MISIÓN 6: "La Ley de la Presión" (Física) | Niño 14 años | 20 XP
Concepto: Grabar un vídeo de 5 segundos explicando por qué una bolsa de patatas se ha hinchado por la altitud.
UI (.ui-terminal): Botón "Grabar explicación" (getUserMedia + MediaRecorder). Previsualización del vídeo. Texto: "La bolsa de snacks está a punto de explotar. Grábate explicando por qué."
Validación Juez: El Juez ve el vídeo. Guardar en gameState.kid14.missions.day_14_pressure. Liberar MediaStream al salir.

### MISIÓN 7: "Altímetro Hacker" (Matemáticas) | Niño 14 años | 15 XP
Concepto: Sabiendo que la 5ª Estación está a unos 2300m y la cima a 3776m, calcular cuántos metros faltan.
UI (.ui-terminal): Input numérico: ">>> METROS HASTA LA CIMA:". La app puede mostrar un pequeño cálculo: 3776 - 2300 = ?
Validación Juez: La respuesta es aproximadamente 1476m. Guardar en gameState.kid14.missions.day_14_altimeter.

### MISIÓN 8: "Densidad de Aokigahara" (Deducción) | Niño 14 años | 15 XP
Concepto: Explicar por qué en el bosque Aokigahara no hay eco.
UI (.ui-terminal): Input de texto: ">>> ¿Por qué en este bosque no hay eco?".
Validación Juez: La respuesta correcta es que la roca volcánica porosa absorbe el sonido. Guardar en gameState.kid14.missions.day_14_echo.

### MISIÓN 9 (Conjunta): "Oxígeno Alpino" (Física) | Ambos | 20 XP c/u
Concepto: A 2300 metros, el aire tiene menos oxígeno. Toda la familia aguanta la respiración 15 segundos a la vez.
UI (ambos perfiles): Cronómetro regresivo de 15 segundos. Botón "Iniciar apnea familiar". Texto: "Todos juntos, aguantad la respiración 15 segundos."
Validación Juez: El Juez observa a la familia y aprueba. Guardar en gameState.kid9.missions.day_14_oxygen y gameState.kid14.missions.day_14_oxygen.

---

## DÍA 15: Alrededores del Fuji

### MISIÓN 1: "Melodía de Shiraito" (Audio) | Niña 9 años | 20 XP
Concepto: La cascada Shiraito mide 150m de ancho y el agua cae en finos hilos desde 20m. Grabar su sonido atronador.
UI (.ui-kids): Botón "Grabar cascada" (getUserMedia + MediaRecorder, 5 segundos). Previsualización del audio.
Validación Juez: El Juez escucha el audio. Guardar en gameState.kid9.missions.day_15_waterfall.

### MISIÓN 2: "La Aldea de Paja" (Foto) | Niña 9 años | 15 XP
Concepto: En el museo al aire libre Iyashi no Sato, fotografiar una casa tradicional con tejado de paja.
UI (.ui-kids): Cámara. Texto: "Fotografía una casa con tejado de paja, como las de los antiguos aldeanos del Fuji."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_15_thatch.

### MISIÓN 3: "El Misterio del Pez de Cristal" (Canvas) | Niña 9 años | 20 XP
Concepto: En los estanques de la zona, el agua es tan cristalina que los peces parecen flotar. Dibujar en un canvas el pez más bonito que haya visto.
UI (.ui-kids): Canvas táctil de 300x300px. Texto: "¿Has visto peces en el agua cristalina? Dibuja el más bonito con el dedo." Botón "Borrar" y "Enviar pez".
Validación Juez: El Juez recibe el dibujo. Guardar en gameState.kid9.missions.day_15_fish.

### MISIÓN 4: "El Trono del Shogun" (Imitación) | Niña 9 años | 15 XP
Concepto: En Iyashi no Sato, sentarse en una silla tradicional japonesa y posar como un antiguo señor feudal.
UI (.ui-kids): Cámara. Texto: "Encuentra una silla o un trono tradicional y posa como un shogun."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_15_shogun.

### MISIÓN 5: "Santuario Escondido" (OSINT) | Niño 14 años | 15 XP
Concepto: Buscar en internet el nombre de la deidad principal del Santuario Fujisan Hongu Sengen Taisha.
UI (.ui-terminal): Input de texto: ">>> DEIDAD DEL SENGEN TAISHA:".
Validación Juez: La respuesta es Konohanasakuya-hime. Guardar en gameState.kid14.missions.day_15_deity.

### MISIÓN 6: "Perspectiva Honcho Street" (Foto) | Niño 14 años | 20 XP
Concepto: Conseguir la famosa foto de la calle Honcho con el Fuji al fondo perfectamente centrado.
UI (.ui-terminal): Cámara. Texto: ">>> ENCUADRE PERFECTO: Alinea la calle Honcho con el Fuji al fondo."
Validación Juez: El Juez evalúa el encuadre. Guardar en gameState.kid14.missions.day_15_honcho.

### MISIÓN 7: "Aforo de la Cascada" (Cálculo) | Niño 14 años | 15 XP
Concepto: Estimar cuántos litros por segundo caen por la cascada Shiraito.
UI (.ui-terminal): Input numérico: ">>> LITROS POR SEGUNDO ESTIMADOS:".
Validación Juez: Cualquier respuesta > 500 L/s es válida. Guardar en gameState.kid14.missions.day_15_flow.

### MISIÓN 8: "Ingeniería Tradicional" (Deducción) | Niño 14 años | 15 XP
Concepto: Explicar por qué los techos de las casas en Iyashi no Sato son tan inclinados.
UI (.ui-terminal): Input de texto: ">>> ¿Por qué los techos son tan empinados?".
Validación Juez: La respuesta es que la nieve resbala fácilmente en invierno. Guardar en gameState.kid14.missions.day_15_roof.

### MISIÓN 9 (Conjunta): "La Leyenda del Dragón" (Narrativa) | Ambos | 20 XP c/u
Concepto: Escribir entre todos un cuento corto sobre un dragón que vive en el lago.
UI (pantalla compartida): Dos campos de texto (uno para cada niño). Cada uno escribe una parte del cuento (3-4 frases). Botón "Enviar leyenda".
Validación Juez: El Juez lee el cuento completo. Guardar en gameState.kid9.missions.day_15_dragon y gameState.kid14.missions.day_15_dragon.

---

## DÍA 16: Regreso a Tokio (Kagurazaka / Shinjuku)

### MISIÓN 1: "El Gato Oculto" (Observación) | Niña 9 años | 15 XP
Concepto: Kagurazaka es un barrio lleno de estatuas y dibujos de gatos. Encontrar uno y bautizarlo.
UI (.ui-kids): Cámara + input de texto: "Ponle un nombre japonés a este gato.".
Validación Juez: El Juez ve la foto y el nombre. Guardar en gameState.kid9.missions.day_16_cat.

### MISIÓN 2: "Escalada Urbana" (Matemáticas) | Niña 9 años | 15 XP
Concepto: Mirar hacia arriba y contar los pisos del rascacielos más alto visible. Multiplicar por 3 metros para estimar su altura.
UI (.ui-kids): Input numérico: "Número de pisos". La app multiplica automáticamente y muestra "Altura estimada: X metros". Botón "Enviar cálculo".
Validación Juez: El Juez ve la altura estimada. Guardar en gameState.kid9.missions.day_16_skyscraper.

### MISIÓN 3: "Los Colores de Shinjuku" (Observación) | Niña 9 años | 15 XP
Concepto: Observar las luces de neón de Shinjuku y elegir los 3 colores que más hayan llamado su atención.
UI (.ui-kids): 10 botones de colores grandes: rojo, naranja, amarillo, verde, azul, morado, rosa, blanco, dorado, plateado. La niña pulsa exactamente 3. Un contador muestra "Colores elegidos: X/3". Botón "Enviar colores".
Validación Juez: El Juez recibe en su panel los 3 colores seleccionados. El Juez (que está viendo los neones con ella) comprueba si coinciden con lo que hay en la calle y aprueba manualmente. NO hay validación automática. Guardar en gameState.kid9.missions.day_16_colors.

### MISIÓN 4: "Sonido del Semáforo" (Audio) | Niña 9 años | 15 XP
Concepto: Los semáforos japoneses emiten un sonido característico (pi-po, pi-po) para guiar a los peatones ciegos. Grabarlo.
UI (.ui-kids): Botón "Grabar semáforo" (getUserMedia + MediaRecorder, 5 segundos). Previsualización.
Validación Juez: El Juez escucha el audio. Guardar en gameState.kid9.missions.day_16_traffic.

### MISIÓN 5: "Vórtice Temporal" (Foto) | Niño 14 años | 20 XP
Concepto: Conseguir una foto donde convivan un templo antiguo y un rascacielos ultramoderno en el mismo encuadre.
UI (.ui-terminal): Cámara + input de texto: "Nombre del templo y del rascacielos". Botón "Enviar foto".
Validación Juez: El Juez ve la foto. Guardar en gameState.kid14.missions.day_16_vortex.

### MISIÓN 6: "Calibración de Androide" (Experto - DeviceMotion) | Niño 14 años | 25 XP
Concepto: Ejecutar un combo de tajos con el móvil: primero un tajo lateral y luego uno vertical.
UI (.ui-terminal): Texto: ">>> CALIBRACIÓN DE COMBATE". Paso 1: "Tajo lateral (horizontal)". Paso 2: "Tajo vertical". Advertencia: "⚠️ SUJETA EL MÓVIL CON LAS DOS MANOS".
Técnica: Escuchar 'devicemotion'. Calcular magnitud Math.sqrt(x² + y² + z²). Si magnitud > 12 m/s² y |x| > |y|, tajo lateral OK. Si magnitud > 12 m/s² y |y| > |x|, tajo vertical OK. Cada paso muestra confirmación. Sin límite de tiempo entre pasos.
Validación Juez: La app valida automáticamente cuando ambos tajos se detectan. Guardar en gameState.kid14.missions.day_16_combat.

### MISIÓN 7: "Supervivencia Shinjuku" (Física) | Niño 14 años | 25 XP
Concepto: En la estación de Shinjuku, la más grande del mundo, guiar a la familia hasta la salida correcta sin Google Maps y cronometrar el tiempo.
UI (.ui-terminal): Cronómetro (Date.now()). Botón "Iniciar misión" al bajar del tren. Botón "¡Salida encontrada!" al pisar la calle. Texto: ">>> SIGUE LOS CARTELES AMARILLOS. SIN GPS."
Validación Juez: El Juez ve el tiempo. Guardar en gameState.kid14.missions.day_16_shinjuku.

### MISIÓN 8: "Densidad Poblacional" (Estimación) | Niño 14 años | 15 XP
Concepto: En el cruce de Shibuya o Shinjuku, contar cuántas personas cruzan en un solo semáforo verde.
UI (.ui-terminal): Input numérico: ">>> PERSONAS EN UN CRUCE EN VERDE:".
Validación Juez: Cualquier número > 30 es razonable. Guardar en gameState.kid14.missions.day_16_density.

### MISIÓN 9 (Conjunta): "El Observatorio Gratuito" (Foto) | Ambos | 20 XP c/u
Concepto: Subir al mirador gratuito del Ayuntamiento de Tokio (Tocho) y hacer una foto nocturna de la familia con la ciudad iluminada de fondo.
UI (ambos perfiles): Checkbox "✅ Foto nocturna en Tocho". Botón "Enviar".
Validación Juez: El Juez revisa la foto. Guardar en gameState.kid9.missions.day_16_tocho y gameState.kid14.missions.day_16_tocho.

---

## DÍA 17: Asakusa, Skytree y Akihabara

### MISIÓN 1: "Destino Omikuji" (Elección) | Niña 9 años | 15 XP
Concepto: En el templo Senso-ji, sacar un papel de la suerte (omikuji) y registrar el resultado.
UI (.ui-kids): 3 botones: "🌟 Buena Suerte", "😐 Suerte Regular", "💀 Mala Suerte". Si pulsa "Mala Suerte", la app muestra un mensaje especial: "¡Átalo al poste del templo para que no te siga!" Botón "Enviar destino".
Validación Juez: El Juez ve la elección. Guardar en gameState.kid9.missions.day_17_omikuji.

### MISIÓN 2: "El Humo de la Fortuna" (Foto) | Niña 9 años | 15 XP
Concepto: En Senso-ji, el humo del gran pebetero de incienso se cree que cura enfermedades. Fotografiar el momento en que el humo envuelve a un miembro de la familia.
UI (.ui-kids): Cámara. Texto: "El humo del incienso trae buena salud. Captura el momento en que envuelve a alguien."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_17_incense.

### MISIÓN 3: "Gashapon Perfecto" (Foto) | Niña 9 años | 15 XP
Concepto: En Akihabara, comprar un Gashapon y fotografiar la cápsula junto al juguete que ha tocado.
UI (.ui-kids): Cámara. Texto: "¡Muestra tu tesoro! Foto de la cápsula y el juguete juntos."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_17_gashapon.

### MISIÓN 4: "Sincronización P2P" (Cooperativa - Hermana) | Niña 9 años | 25 XP
Concepto: Recibir un código secreto de colores de su hermano e introducirlo en su panel.
UI (.ui-kids): Panel con 4 botones de colores grandes: Rojo, Azul, Verde, Amarillo. Texto: "Tu hermano ha interceptado un código secreto. Míralo en su pantalla y pulsa los colores en el mismo orden." Un botón "Listo" para enviar la secuencia.
Técnica: El código secreto es FIJO y está hardcodeado en el código como una constante compartida: ['Rojo', 'Azul', 'Verde', 'Amarillo']. La app compara la secuencia introducida con esta constante. Si coinciden, la misión se aprueba automáticamente.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid9.missions.day_17_p2p_receiver.

### MISIÓN 5: "Arqueología Gamer" (Cálculo) | Niño 14 años | 20 XP
Concepto: En Super Potato (Akihabara), encontrar un juego retro, anotar su precio en yenes y convertirlo a euros.
UI (.ui-terminal): Input de texto: "Nombre del juego". Input numérico: "Precio en yenes". La app calcula automáticamente el precio en euros (tasa de cambio aproximada: 1 EUR = 160 JPY) y lo muestra. Botón "Enviar tasación".
Validación Juez: El Juez ve el juego y el precio. Guardar en gameState.kid14.missions.day_17_retro.

### MISIÓN 6: "Cervicales de Acero" (Experto - DeviceOrientation) | Niño 14 años | 20 XP
Concepto: Bajo la Skytree (634m), mantener el móvil apuntando casi verticalmente hacia arriba durante 10 segundos.
UI (.ui-terminal): Una barra de progreso que se llena cuando el ángulo de inclinación está entre 80° y 100°. Temporizador regresivo de 10 segundos. Texto: ">>> APUNTANDO A LA CIMA. Mantén el móvil hacia arriba."
Técnica: Escuchar 'deviceorientation'. Calcular la inclinación a partir de beta y gamma. Si la inclinación está en el rango, la barra se llena con setInterval. Si mantiene la barra llena 10 segundos, misión completada.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid14.missions.day_17_skytree.

### MISIÓN 7: "Sincronización P2P" (Cooperativa - Hermano) | Niño 14 años | 25 XP
Concepto: Resolver un acertijo matemático para desbloquear el código secreto que debe dictar a su hermana.
UI (.ui-terminal): Acertijo: "Una consola Famicom costaba 14.800 yenes. Otra Neo Geo costaba 58.000 yenes. ¿Cuánto costaban las dos juntas?". Input numérico para la respuesta. Si acierta (72.800), la terminal muestra el código secreto: ">>> CÓDIGO INTERCEPTADO: [cuatro cuadrados de colores: Rojo, Azul, Verde, Amarillo]".
Técnica: El código secreto es FIJO y está hardcodeado: ['Rojo', 'Azul', 'Verde', 'Amarillo']. Es el mismo array que usa la misión de la hermana. Al acertar, la terminal dibuja 4 rectángulos de colores en un pequeño canvas.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid14.missions.day_17_p2p_sender.

### MISIÓN 8: "Altura del Cielo" (Deducción) | Niño 14 años | 15 XP
Concepto: Buscar en los paneles informativos de la Skytree su altura exacta.
UI (.ui-terminal): Input numérico: ">>> ALTURA DE LA SKYTREE (metros):". Pista tras primer fallo: "El número se lee 'mu-sa-shi' como la antigua provincia."
Validación Juez: La respuesta es 634. Guardar en gameState.kid14.missions.day_17_height.

### MISIÓN 9 (Conjunta): "Navegando el Sumida" (Vídeo) | Ambos | 20 XP c/u
Concepto: Grabar un vídeo corto del paseo en barco por el río Sumida.
UI (ambos perfiles): Botón "Grabar paseo" (getUserMedia + MediaRecorder, 10 segundos). Previsualización.
Validación Juez: El Juez ve el vídeo. Guardar en gameState.kid9.missions.day_17_sumida y gameState.kid14.missions.day_17_sumida.

---

## DÍA 18: Shibuya y Harajuku

### MISIÓN 1: "La Marea Humana" (Contador) | Niña 9 años | 20 XP
Concepto: En un solo cruce en verde en Shibuya, contar todas las personas que vea con gafas de sol.
UI (.ui-kids): Contador con botón + (grande, táctil). Temporizador de 60 segundos (lo que dura el semáforo). Texto: "¡Cuenta solo a los que lleven gafas de sol 😎!". Cuando el temporizador llega a 0, se bloquea el contador y aparece "Recuento final: X personas".
Validación Juez: El Juez ve el número. Guardar en gameState.kid9.missions.day_18_shibuya.

### MISIÓN 2: "El Guardián Hachiko" (Foto) | Niña 9 años | 15 XP
Concepto: Foto con la estatua del perro Hachiko, el perro más fiel de Japón.
UI (.ui-kids): Cámara. Texto: "Busca la estatua del perro Hachiko y hazte una foto con él."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_18_hachiko.

### MISIÓN 3: "El Mensaje del Emperador" (Cultura) | Niña 9 años | 15 XP
Concepto: En el santuario Meiji Jingu, la gente escribe sus deseos en tablillas de madera (ema). Escribir un deseo para la familia.
UI (.ui-kids): Input de texto: "Escribe un deseo para nuestra familia, como en una tablilla ema del santuario." Botón "Enviar deseo".
Validación Juez: El Juez lee el deseo. Guardar en gameState.kid9.missions.day_18_ema.

### MISIÓN 4: "Crepe de Harajuku" (Texto) | Niña 9 años | 15 XP
Concepto: En Takeshita Street, comer un crepe gigante y describir sus ingredientes.
UI (.ui-kids): Input de texto grande: "Describe tu crepe: ¿qué llevaba dentro? ¿Estaba bueno?".
Validación Juez: El Juez lee la descripción. Guardar en gameState.kid9.missions.day_18_crepe.

### MISIÓN 5: "Intercepción de Radio" (Experto - Speech) | Niño 14 años | 25 XP
Concepto: El móvil emite una palabra en japonés con voz robótica. El chico debe escucharla y escribir su transcripción.
UI (.ui-terminal): Botón "Interceptar Señal". Al pulsarlo, speechSynthesis pronuncia una palabra al azar de un array: ['sushi', 'samurai', 'kawaii', 'Fuji', 'ramen'] con lang='ja-JP' y rate=0.8. Un input de texto para escribir la transcripción. Botón "Desencriptar". 3 intentos máximo.
Técnica: La app elige la palabra aleatoriamente y la guarda en una variable. Al pulsar "Desencriptar", compara el input con la palabra. Si coinciden, éxito. Si no, descuenta un intento.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid14.missions.day_18_radio.

### MISIÓN 6: "Cazatendencias" (Foto) | Niño 14 años | 20 XP
Concepto: En Harajuku, capturar discretamente a la persona con el estilo más atrevido y describir su look.
UI (.ui-terminal): Cámara + input de texto: "Describe el estilo de esta persona (ropa, colores, peinado...)".
Validación Juez: El Juez ve la foto y la descripción. Guardar en gameState.kid14.missions.day_18_trend.

### MISIÓN 7: "Flujo del Cruce" (Cálculo) | Niño 14 años | 15 XP
Concepto: Estimar cuántas personas cruzan Shibuya en una hora.
UI (.ui-terminal): Input numérico: ">>> PERSONAS POR HORA (estima):". Pista: "En un cruce en verde pasan unas 3000 personas. ¿Cuántos cruces hay en una hora?"
Validación Juez: Cualquier cifra > 50.000 es razonable. Guardar en gameState.kid14.missions.day_18_flow.

### MISIÓN 8: "Silencio en la Ciudad" (Deducción) | Niño 14 años | 15 XP
Concepto: Explicar por qué el santuario Meiji Jingu está tan aislado del ruido a pesar de estar junto a Shibuya.
UI (.ui-terminal): Input de texto: ">>> ¿Por qué no se oye la ciudad desde dentro del santuario?".
Validación Juez: La respuesta es que el bosque de 100.000 árboles plantados artificialmente crea una barrera acústica. Guardar en gameState.kid14.missions.day_18_silence.

### MISIÓN 9 (Conjunta): "Cruzando Shibuya" (Vídeo) | Ambos | 20 XP c/u
Concepto: Grabar un vídeo de la familia cruzando el famoso paso de cebra de Shibuya.
UI (ambos perfiles): Botón "Grabar cruce" (getUserMedia + MediaRecorder, 15 segundos). Previsualización.
Validación Juez: El Juez ve el vídeo. Guardar en gameState.kid9.missions.day_18_crossing y gameState.kid14.missions.day_18_crossing.

---

## DÍA 19: Odaiba (TeamLab y Gundam)

### MISIÓN 1: "Piloto de Mechas" (Vídeo) | Niña 9 años | 20 XP
Concepto: Grabar el momento exacto en que el Gundam Unicorn se transforma al modo Destroy.
UI (.ui-kids): Botón "Grabar transformación" (getUserMedia + MediaRecorder, 15 segundos). Texto: "¡El Gundam se transforma! Grábalo como si fueras un piloto de mechas." Previsualización del vídeo.
Validación Juez: El Juez ve el vídeo. Guardar en gameState.kid9.missions.day_19_gundam.

### MISIÓN 2: "Cazador de Luz" (Experto - Input Color) | Niña 9 años | 25 XP
Concepto: En TeamLab Planets, elegir una sala y usar el selector de color para igualar el color predominante.
UI (.ui-kids): <input type="color">. Un círculo grande en la pantalla muestra el color elegido en tiempo real. Texto: "Ajusta el color hasta que sea igual al de la sala en la que estás." Botón "Capturar color".
Validación Juez: El Juez ve el color seleccionado. Guardar en gameState.kid9.missions.day_19_color.

### MISIÓN 3: "Sueños Digitales" (Canvas) | Niña 9 años | 20 XP
Concepto: Después de TeamLab, dibujar en un canvas la proyección digital que más le haya gustado.
UI (.ui-kids): Canvas táctil de 300x300px. Texto: "Dibuja la luz o la forma que más te haya gustado del museo." Botón "Borrar" y "Enviar dibujo".
Validación Juez: El Juez recibe el dibujo. Guardar en gameState.kid9.missions.day_19_teamlab.

### MISIÓN 4: "La Libertad Nipona" (Foto) | Niña 9 años | 15 XP
Concepto: Foto de la Estatua de la Libertad de Odaiba.
UI (.ui-kids): Cámara. Texto: "Busca la Estatua de la Libertad de Odaiba y hazle una foto."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_19_liberty.

### MISIÓN 5: "Desencriptar Protocolo Mecha" (Experto - Crypto) | Niño 14 años | 25 XP
Concepto: El Gundam Unicorn tiene el número de modelo RX-0 grabado en el hombro. El chico debe introducir esta clave para desencriptar un mensaje.
UI (.ui-terminal): Texto: ">>> INTERCEPTA EL CÓDIGO DEL MECHA. Busca el número de modelo en el hombro del robot." Input de texto. Botón "Desencriptar".
Técnica: La palabra secreta es "RX-0". La app calcula el hash SHA-256 del input con crypto.subtle.digest y lo compara con el hash precalculado de "RX-0". Si coinciden, la terminal muestra ">>> SISTEMA COMPROMETIDO. Modo Juez Activado."
Validación Juez: La app valida automáticamente. Guardar en gameState.kid14.missions.day_19_crypto.

### MISIÓN 6: "Lógica de Iluminación" (Texto) | Niño 14 años | 20 XP
Concepto: Deducir y explicar cómo funcionan los espejos infinitos de TeamLab.
UI (.ui-terminal): Input de texto: ">>> Explica cómo crees que funcionan los espejos infinitos de TeamLab.".
Validación Juez: El Juez lee la explicación. Guardar en gameState.kid14.missions.day_19_mirrors.

### MISIÓN 7: "Estructura de Gundam" (Deducción) | Niño 14 años | 15 XP
Concepto: Buscar en internet cuánto pesa la estatua real del Gundam Unicorn.
UI (.ui-terminal): Input numérico: ">>> PESO DEL GUNDAM (toneladas):".
Validación Juez: La respuesta es 49 toneladas. Guardar en gameState.kid14.missions.day_19_weight.

### MISIÓN 8: "Monorriel Yurikamome" (Física) | Niño 14 años | 15 XP
Concepto: Cronometrar cuánto tarda el tren sin conductor entre dos estaciones.
UI (.ui-terminal): Cronómetro (Date.now()). Botón "Iniciar" al salir de una estación, botón "Llegada" al llegar a la siguiente. Texto: ">>> CRONOMETRANDO TREN AUTÓNOMO.".
Validación Juez: El Juez ve el tiempo. Guardar en gameState.kid14.missions.day_19_monorail.

### MISIÓN 9 (Conjunta): "Inmersión Total" (Foto) | Ambos | 20 XP c/u
Concepto: Foto artística de toda la familia rodeada de los LEDs o el agua de TeamLab.
UI (ambos perfiles): Checkbox "✅ Foto en TeamLab". Botón "Enviar".
Validación Juez: El Juez revisa la foto. Guardar en gameState.kid9.missions.day_19_immersive y gameState.kid14.missions.day_19_immersive.

---

## DÍA 20: Tokio Nostálgico (Ueno y Yanaka Ginza)

### MISIÓN 1: "Maestro del Bento" (Experto - Drag & Drop) | Niña 9 años | 25 XP
Concepto: Arrastrar 4 ingredientes japoneses a los compartimentos correctos de una caja bento usando solo touch events.
UI (.ui-kids): Una caja bento con 4 compartimentos vacíos. 4 ingredientes arrastrables: 🍚 Arroz, 🐟 Salmón, 🥒 Verduras, 🍳 Tamago. Los ingredientes se pueden arrastrar con el dedo (touchstart, touchmove, touchend). Al soltar un ingrediente, la app detecta si está sobre el compartimento correcto (getBoundingClientRect()).
Técnica: No usar la API Drag & Drop de HTML5. Usar exclusivamente touch events. Al soltar, calcular si el centro del ingrediente está dentro del área del compartimento. Si los 4 ingredientes están en compartimentos correctos, misión completada.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid9.missions.day_20_bento.

### MISIÓN 2: "Poción Gatuna" (Experto - Barcode) | Niña 9 años | 20 XP
Concepto: En Yanaka Ginza (la calle de los gatos), escanear el código de barras de un snack y "analizar sus ingredientes mágicos".
UI (.ui-kids): Marco de escáner con línea roja animada. Si 'BarcodeDetector' está soportado, usar la cámara. Si no, mostrar input numérico: "Escribe los números del código de barras". Tras el escaneo, input de texto: "¿Qué snack has encontrado?".
Validación Juez: El Juez ve el producto escaneado. Guardar en gameState.kid9.missions.day_20_potion.

### MISIÓN 3: "El Pato del Estanque" (Foto) | Niña 9 años | 15 XP
Concepto: En el estanque Shinobazu de Ueno, fotografiar las hojas de loto gigantes o las aves acuáticas.
UI (.ui-kids): Cámara. Texto: "Encuentra las hojas de loto gigantes o los patos del estanque Shinobazu."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_20_pond.

### MISIÓN 4: "El Peso del Tesoro" (Estimación) | Niña 9 años | 15 XP
Concepto: En el mercado Ameyoko, encontrar el objeto más pesado que quepa en una mano y estimar su peso.
UI (.ui-kids): Cámara + input numérico: "Peso estimado (gramos)". Texto: "Busca algo que pese mucho pero quepa en tu mano. Hazle una foto y adivina su peso."
Validación Juez: El Juez ve la foto y el peso estimado. Guardar en gameState.kid9.missions.day_20_weight.

### MISIÓN 5: "Regateo en Ameyoko" (Cálculo) | Niño 14 años | 20 XP
Concepto: Comprar algo en el mercado y calcular el cambio exacto antes de que el vendedor lo entregue.
UI (.ui-terminal): Input numérico: "Precio del producto (yenes)". Input numérico: "Billete con el que pagas". La app calcula el cambio y lo oculta. Input numérico: "¿Cuánto te tienen que devolver?". Botón "Comprobar". La app compara y dice si acertó.
Validación Juez: El Juez ve si el cálculo fue correcto. Guardar en gameState.kid14.missions.day_20_change.

### MISIÓN 6: "Arquitectura del Museo" (Deducción) | Niño 14 años | 15 XP
Concepto: Explicar qué diferencia el diseño clásico del Museo Nacional de Tokio de los rascacielos modernos.
UI (.ui-terminal): Input de texto: ">>> Diferencias arquitectónicas entre el Museo Nacional y los rascacielos de alrededor.".
Validación Juez: El Juez lee la explicación. Guardar en gameState.kid14.missions.day_20_museum.

### MISIÓN 7: "Análisis de Precios Retro" (Búsqueda) | Niño 14 años | 15 XP
Concepto: Buscar un objeto vintage (reloj, juguete, consola) en el mercado Ameyoko y anotar su precio.
UI (.ui-terminal): Input de texto: "Objeto encontrado". Input numérico: "Precio en yenes". Botón "Enviar tasación".
Validación Juez: El Juez ve el objeto y el precio. Guardar en gameState.kid14.missions.day_20_vintage.

### MISIÓN 8: "Escaleras del Atardecer" (Física) | Niño 14 años | 15 XP
Concepto: Contar los escalones de Yuyake Dandan, las famosas escaleras de Yanaka Ginza.
UI (.ui-terminal): Input numérico: ">>> ESCALONES CONTADOS:".
Validación Juez: La respuesta correcta es 36 (rango aceptable: 34-38). Guardar en gameState.kid14.missions.day_20_stairs.

### MISIÓN 9 (Conjunta): "Degustación Callejera" (Texto) | Ambos | 20 XP c/u
Concepto: Ambos escriben cuál ha sido el mejor snack del día en los puestos callejeros.
UI (ambos perfiles): Input de texto: "¿Cuál ha sido el mejor bocado del día?". Ambos envían su respuesta.
Validación Juez: El Juez lee las dos respuestas. Guardar en gameState.kid9.missions.day_20_tasting y gameState.kid14.missions.day_20_tasting.

---

## DÍA 21: Excursión Histórica (Kamakura / Nikko)

### MISIÓN 1: "Los Tres Monos" (Foto) | Niña 9 años | 15 XP
Concepto: En el establo sagrado de Toshogu (Nikko), fotografiar el famoso tallado de los tres monos sabios (no ver, no oír, no hablar).
UI (.ui-kids): Cámara. Texto: "Encuentra los tres monos sabios. ¿Puedes imitarlos?"
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_21_monkeys.

### MISIÓN 2: "El Latido del Dragón" (Experto - DOM Time) | Niña 9 años | 25 XP
Concepto: Acercarse a la tumba del Shogun y sentir el latido de un dragón a través de la app.
UI (.ui-kids): Una joya central (círculo dorado) que late con un pulso CSS (box-shadow y transform: scale). Texto: "Acércate a la tumba... ¿Sientes el latido del dragón?". Botón "Avanzar hacia el dragón".
Técnica: Al entrar, la joya late cada 2000ms. Cada vez que pulsa "Avanzar", el intervalo del latido se reduce en 300ms (mínimo 300ms). Tras 6 pulsaciones, el dragón despierta: la joya estalla en dorado, el fondo se ilumina y aparece "¡El dragón te ha sentido!". La misión se completa automáticamente.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid9.missions.day_21_dragon.

### MISIÓN 3: "El Tajo del Samurái" (Experto - DeviceMotion) | Niña 9 años | 25 XP
Concepto: Entrenar como un samurái dando un espadazo vertical con el móvil en la mano.
UI (.ui-kids): Cuenta atrás de 3 segundos. Texto: "¡Prepara tu tajo! Sujeta el móvil con las dos manos." Al llegar a 0, un icono de espada ⚔️. La niña tiene 2 segundos para ejecutar el movimiento.
Técnica: Escuchar 'devicemotion'. Calcular magnitud Math.sqrt(x² + y² + z²). Si la magnitud supera 12 m/s² y el eje Y es dominante (movimiento vertical), se detecta el tajo. Un div blanco con forma de línea aparece en diagonal durante 0.5 segundos simulando un corte.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid9.missions.day_21_slash.

### MISIÓN 4: "El Guardián de Piedra" (Cultura) | Niña 9 años | 15 XP
Concepto: Encontrar una estatua Jizo (con babero rojo) y escribir qué protege.
UI (.ui-kids): Cámara + input de texto: "¿A quién protege este guardián de piedra?".
Validación Juez: El Juez ve la foto y la respuesta (Jizo protege a los niños, viajeros y almas). Guardar en gameState.kid9.missions.day_21_jizo.

### MISIÓN 5: "Ingeniero Imperial" (Texto) | Niño 14 años | 20 XP
Concepto: Explicar de qué material está hecho el Gran Buda de Kamakura y cuándo fue construido.
UI (.ui-terminal): Dos inputs de texto: "Material del Gran Buda" y "Año de construcción".
Validación Juez: Respuestas correctas: bronce y 1252. Guardar en gameState.kid14.missions.day_21_buddha.

### MISIÓN 6: "Análisis de Pan de Oro" (Cálculo) | Niño 14 años | 20 XP
Concepto: Estimar cuántos kilos de oro se usaron para cubrir el Kinkaku-ji (u otro templo dorado).
UI (.ui-terminal): La app da los datos: "Superficie aprox: 200m², Grosor del pan de oro: 0.0001m, Densidad del oro: 19.300 kg/m³". Input numérico: "Kilos de oro estimados". Botón "Calcular". La app muestra el resultado correcto: ~386 kg.
Validación Juez: Cualquier cifra entre 300-500 kg es válida. Guardar en gameState.kid14.missions.day_21_gold.

### MISIÓN 7: "Rastreo de la Naturaleza" (Experto - Geolocation) | Niño 14 años | 25 XP
Concepto: Encontrar un punto geográfico exacto usando watchPosition + Haversine, similar a la misión del Día 14.
UI (.ui-terminal): Interfaz de radar textual con distancia en metros. Coordenada objetivo fija (ej: cascada Kegon o bosque de bambú Hokokuji).
Validación Juez: La app valida automáticamente cuando la distancia es < 15m. Guardar en gameState.kid14.missions.day_21_tracking.

### MISIÓN 8: "Defensa del Shogunato" (Lógica) | Niño 14 años | 15 XP
Concepto: Analizar la ubicación del templo/castillo y explicar por qué era tácticamente defendible.
UI (.ui-terminal): Input de texto: ">>> Análisis de defensa: ¿Por qué este lugar era difícil de atacar?".
Validación Juez: El Juez lee el análisis. Guardar en gameState.kid14.missions.day_21_defense.

### MISIÓN 9 (Conjunta): "La Paz de la Montaña" (Silencio) | Ambos | 20 XP c/u
Concepto: Todo el grupo guarda silencio absoluto durante 30 segundos frente a la tumba o el templo.
UI (ambos perfiles): Cronómetro regresivo de 30 segundos. Botón "Iniciar silencio".
Validación Juez: El Juez verifica de oído que se mantuvo el silencio. Guardar en gameState.kid9.missions.day_21_silence y gameState.kid14.missions.day_21_silence.

---

## DÍA 22: Toyosu, Ginza y Roppongi

### MISIÓN 1: "Grito de Pescadero" (Audio) | Niña 9 años | 20 XP
Concepto: Imitar el saludo enérgico de los vendedores japoneses: "¡Irasshaimase!".
UI (.ui-kids): Texto con la pronunciación: "¡EE-RA-SHAI-MA-SÉ!". Botón "Grabar grito" (getUserMedia + MediaRecorder, 3 segundos). Previsualización.
Validación Juez: El Juez escucha el audio y evalúa la energía. Guardar en gameState.kid9.missions.day_22_shout.

### MISIÓN 2: "El Vehículo de Lujo" (Foto) | Niña 9 años | 15 XP
Concepto: En la milla de oro de Ginza, fotografiar el coche más extravagante que pase.
UI (.ui-kids): Cámara. Texto: "En Ginza pasan los coches más lujosos del mundo. Captura el más espectacular."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_22_car.

### MISIÓN 3: "Ascensor Infinito" (Física) | Niña 9 años | 15 XP
Concepto: Cronometrar la subida en el ascensor de Roppongi Hills.
UI (.ui-kids): Cronómetro. Botón "Iniciar" al entrar al ascensor, botón "Llegué" al salir. Texto: "Cronometra cuánto tarda este ascensor ultrarrápido."
Validación Juez: El Juez ve el tiempo. Guardar en gameState.kid9.missions.day_22_elevator.

### MISIÓN 4: "Réplica Eiffel" (Foto) | Niña 9 años | 15 XP
Concepto: Foto creativa con la Torre de Tokio, obligando a que "entre" entre sus dedos (efecto perspectiva).
UI (.ui-kids): Cámara. Texto: "Apunta a la Torre de Tokio y haz que parezca que la sostienes entre tus dedos."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_22_tower.

### MISIÓN 5: "La Joya de Ginza" (Matemáticas) | Niño 14 años | 15 XP
Concepto: Encontrar el artículo más caro en un escaparate de Ginza y calcular cuántos años de su paga necesitaría para comprarlo.
UI (.ui-terminal): Input de texto: "Artículo encontrado". Input numérico: "Precio en yenes". La app pregunta: "¿Cuánto es tu paga mensual (euros)?" y calcula: "Necesitarías X años para comprarlo".
Validación Juez: El Juez ve el artículo y el cálculo. Guardar en gameState.kid14.missions.day_22_jewel.

### MISIÓN 6: "Intercepción Numérica" (Experto - Speech) | Niño 14 años | 25 XP
Concepto: La app dicta 3 números en japonés con voz robótica. El chico debe escuchar y escribir el código numérico.
UI (.ui-terminal): Botón "Interceptar Señal". La app genera 3 números aleatorios del 1 al 9, los traduce a japonés (ichi, ni, san...) y los reproduce con speechSynthesis. Input numérico de 3 dígitos. 3 intentos máximo.
Validación Juez: La app valida automáticamente si el código coincide. Guardar en gameState.kid14.missions.day_22_numbers.

### MISIÓN 7: "Logística del Pescado" (Lógica) | Niño 14 años | 15 XP
Concepto: Explicar por qué el mercado mayorista de pescado se trasladó de Tsukiji a Toyosu en 2018.
UI (.ui-terminal): Input de texto: ">>> Razones del traslado Tsukiji → Toyosu:".
Validación Juez: La respuesta debe mencionar: instalaciones modernas, cadena de frío, higiene, más espacio. Guardar en gameState.kid14.missions.day_22_fish.

### MISIÓN 8: "Altura Relativa" (Comparativa) | Niño 14 años | 15 XP
Concepto: Comparar la Torre de Tokio (332.9m) con la Skytree (634m). ¿Cuántas Torres de Tokio caben en una Skytree?
UI (.ui-terminal): Input numérico: ">>> Torres de Tokio = 1 Skytree:". La app muestra el cálculo: 634 / 332.9 ≈ 1.9.
Validación Juez: La respuesta es aproximadamente 2. Guardar en gameState.kid14.missions.day_22_compare.

### MISIÓN 9 (Conjunta): "Luces de Neón" (Foto) | Ambos | 20 XP c/u
Concepto: Selfie nocturno familiar con los rascacielos iluminados de Ginza o Roppongi de fondo.
UI (ambos perfiles): Checkbox "✅ Foto nocturna familiar". Botón "Enviar".
Validación Juez: El Juez revisa la foto. Guardar en gameState.kid9.missions.day_22_neon y gameState.kid14.missions.day_22_neon.

---

## DÍA 23: Sayonara Japón (Compras Finales)

### MISIÓN 1: "Buscador de KitKat" (Checkboxes) | Niña 9 años | 15 XP
Concepto: En Don Quijote, encontrar al menos 3 sabores raros de KitKat.
UI (.ui-kids): 5 checkboxes con emojis: 🍵 Matcha, 🍶 Sake, 🍓 Fresa, 🔥 Wasabi, 🍈 Melón. Texto: "Marca los sabores que encuentres (mínimo 3)". La app valida que haya al menos 3 marcados antes de enviar.
Validación Juez: El Juez ve los sabores marcados. Guardar en gameState.kid9.missions.day_23_kitkat.

### MISIÓN 2: "Pokédex de Supermercado" (Experto - Barcode) | Niña 9 años | 25 XP
Concepto: Escanear el código de barras del último snack japonés que compre.
UI (.ui-kids): Marco de escáner con línea roja animada. Si 'BarcodeDetector' está soportado, usar cámara. Si no, input numérico manual (8 dígitos mínimo). Tras el escaneo, input de texto: "¿Qué snack es?".
Validación Juez: El Juez ve el producto. Guardar en gameState.kid9.missions.day_23_pokedex.

### MISIÓN 3: "El Oráculo de las Monedas" (Azar) | Niña 9 años | 15 XP
Concepto: Lanzar al aire las monedas que le sobran en el monedero y fotografiar cómo caen. La app genera una predicción aleatoria.
UI (.ui-kids): Cámara. Tras la foto, la app elige una profecía de un array con Math.random(): ["Volverás a Japón antes de lo que crees", "Un gato te traerá suerte en casa", "Encontrarás un tesoro donde menos lo esperas", "El espíritu del Fuji te protege", "Tu próximo viaje será aún más épico"]. La profecía se muestra en pantalla con un efecto de texto revelándose.
Validación Juez: El Juez ve la foto de las monedas y la profecía. Guardar en gameState.kid9.missions.day_23_coins.

### MISIÓN 4: "Mascotas de Viaje" (Foto) | Niña 9 años | 15 XP
Concepto: Foto de su peluche o llavero favorito comprado durante el viaje, listo para volver a casa.
UI (.ui-kids): Cámara. Texto: "Haz una foto de tu compañero de viaje favorito antes de volver a casa."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_23_mascot.

### MISIÓN 5: "Tetris de Maletas" (Experto - Matriz Rotación) | Niño 14 años | 25 XP
Concepto: Minijuego de rotación. Las piezas ya están colocadas en una cuadrícula, pero están desordenadas en su rotación. Debe girarlas hasta que todas encajen correctamente.
UI (.ui-terminal): Una cuadrícula de 4x3 con 3 piezas geométricas (L, T, cuadrado) ya colocadas en sus posiciones. Cada pieza tiene un botón "Girar 🔄" que aplica una rotación de 90° (CSS transform). Las piezas empiezan en ángulos incorrectos.
Técnica: El array solución define la rotación correcta de cada pieza (ej: pieza1 = 90°, pieza2 = 270°, pieza3 = 0°). Cada clic suma 90° a la rotación actual. Cuando las 3 piezas coinciden con el array solución, la misión se completa automáticamente.
Validación Juez: La app valida automáticamente. Guardar en gameState.kid14.missions.day_23_tetris.

### MISIÓN 6: "Auditoría Final" (Cálculo) | Niño 14 años | 15 XP
Concepto: Sumar mentalmente el total de los 4 últimos tickets de compra del viaje.
UI (.ui-terminal): 4 inputs numéricos: "Ticket 1 (yenes)", "Ticket 2 (yenes)", "Ticket 3 (yenes)", "Ticket 4 (yenes)". Botón "Sumar". La app muestra el total y pregunta: "¿Es correcto?". Un botón "Enviar al Juez".
Validación Juez: El Juez comprueba que los tickets son reales. Guardar en gameState.kid14.missions.day_23_audit.

### MISIÓN 7: "Protocolo de Embarque" (Física) | Niño 14 años | 15 XP
Concepto: Cronometrar el paso por el control de seguridad del aeropuerto.
UI (.ui-terminal): Cronómetro (Date.now()). Botón "Iniciar" al entrar a la cola, botón "¡Pasado!" al recoger la bandeja.
Validación Juez: El Juez ve el tiempo. Guardar en gameState.kid14.missions.day_23_security.

### MISIÓN 8: "Peso de Carga" (Estimación) | Niño 14 años | 15 XP
Concepto: Adivinar el peso exacto de la maleta grande antes de ponerla en la báscula de facturación.
UI (.ui-terminal): Input numérico: ">>> PESO ESTIMADO (kg):". Tras pesar la maleta en la báscula real, el Juez introduce el peso real en su panel para comparar (o el chico lo escribe tras pesarla).
Validación Juez: El Juez ve la estimación y el peso real. Guardar en gameState.kid14.missions.day_23_weight.

### MISIÓN 9 (Conjunta): "El Sello Final" (Sello físico) | Ambos | 30 XP c/u
Concepto: Buscar un tampón de tinta (en el aeropuerto, una estación o una tienda de souvenirs) y sellar el pasaporte físico o un papel. Digitalizar el sello con una foto.
UI (ambos perfiles): Cámara. Texto: "Consigue el último sello de tu viaje. Busca un tampón de tinta y hazle una foto."
Validación Juez: El Juez ve la foto del sello. Guardar en gameState.kid9.missions.day_23_stamp y gameState.kid14.missions.day_23_stamp.

---

## DÍA 24: Regreso a Casa (Avión / Escalas)

### MISIÓN 1: "Comida Aérea" (Foto) | Niña 9 años | 10 XP
Concepto: Documentar la bandeja de comida del vuelo de regreso.
UI (.ui-kids): Cámara. Texto: "Fotografía tu última comida japonesa... en el aire."
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_24_meal.

### MISIÓN 2: "Nubes sobre Europa" (Foto) | Niña 9 años | 10 XP
Concepto: Foto artística del amanecer o atardecer desde la ventanilla.
UI (.ui-kids): Cámara. Texto: "Captura el cielo desde 10.000 metros. ¡La última foto del viaje!"
Validación Juez: El Juez ve la foto. Guardar en gameState.kid9.missions.day_24_clouds.

### MISIÓN 3: "Cinturón Abrochado" (Física) | Niña 9 años | 15 XP
Concepto: Cronometrar cuánto dura la turbulencia más larga del vuelo.
UI (.ui-kids): Cronómetro. Botón "Iniciar" cuando empieza la turbulencia, "Fin" cuando se apaga la señal del cinturón.
Validación Juez: El Juez ve el tiempo. Guardar en gameState.kid9.missions.day_24_turbulence.

### MISIÓN 4: "Recuento de Sellos" (Contador) | Niña 9 años | 15 XP
Concepto: La app consulta el gameState y muestra cuántas misiones ha completado en todo el viaje.
UI (.ui-kids): La app recorre gameState.kid9.missions y cuenta las que están en estado "approved". Muestra: "Has completado X misiones en este viaje. ¡Eres una leyenda!" Botón "Enviar recuento".
Validación Juez: El Juez ve el número. Guardar en gameState.kid9.missions.day_24_badges.

### MISIÓN 5: "Husos Horarios" (Cálculo) | Niño 14 años | 15 XP
Concepto: Escribir qué hora es simultáneamente en Japón, España y en el avión.
UI (.ui-terminal): 3 inputs de texto: "Hora en Japón", "Hora en España", "Hora actual en el avión". Botón "Enviar".
Validación Juez: El Juez comprueba que las diferencias horarias son correctas. Guardar en gameState.kid14.missions.day_24_timezones.

### MISIÓN 6: "Kilometraje Total" (Estimación) | Niño 14 años | 15 XP
Concepto: Anotar la distancia total del vuelo que marca la pantalla del asiento.
UI (.ui-terminal): Input numérico: ">>> DISTANCIA TOTAL (km):".
Validación Juez: El Juez ve el dato. Guardar en gameState.kid14.missions.day_24_distance.

### MISIÓN 7: "Velocidad de Retorno" (Física) | Niño 14 años | 15 XP
Concepto: Anotar la velocidad máxima que alcanza el avión (la muestra la pantalla del entretenimiento).
UI (.ui-terminal): Input numérico: ">>> VELOCIDAD MÁXIMA (km/h):".
Validación Juez: El Juez ve el dato. Guardar en gameState.kid14.missions.day_24_speed.

### MISIÓN 8: "Análisis del Viaje" (Texto) | Niño 14 años | 20 XP
Concepto: Redactar un párrafo estilo bitácora hacker resumiendo la efectividad de la misión "Japón 2026".
UI (.ui-terminal): Input de texto grande: ">>> BITÁCORA FINAL. Resume la misión Japón 2026 en un párrafo."
Validación Juez: El Juez lee el resumen. Guardar en gameState.kid14.missions.day_24_log.

### MISIÓN 9 (Conjunta): "Sayonara Japón" (Cierre Final) | Ambos | 50 XP c/u
Concepto: Escribir el TOP 3 de momentos favoritos del viaje. Al enviar, desbloquear el Sello Legendario.
UI (ambos perfiles): 3 inputs de texto cada uno: "Momento #1", "Momento #2", "Momento #3". Cuando ambos envían, la app muestra una pantalla de celebración con fuegos artificiales CSS y el mensaje "Habéis completado el Pasaporte de Misiones. ¡Sois LEYENDAS de Japón!".
Validación Juez: El Juez lee los 6 momentos. Guardar en gameState.kid9.missions.day_24_sayonara y gameState.kid14.missions.day_24_sayonara.

---

## NOTAS TÉCNICAS GLOBALES PARA EL DESARROLLADOR

- Crea un archivo separado llamado dbHelper.js con funciones simples basadas en Promesas para guardar y recuperar datos multimedia en IndexedDB (fotos, vídeos, audios, dibujos de canvas). Este archivo debe importarse en index.html. Las funciones principales deben ser: saveMedia(key, blob), getMedia(key), deleteMedia(key). Mantén app.js limpio usando estas funciones.

- Compatibilidad principal: Android (Chrome). En iOS, añadir fallbacks y permisos (requestPermission para DeviceOrientation/DeviceMotion).

- playsinline: Todo <video> que reciba un stream de getUserMedia DEBE tener los atributos playsinline autoplay muted. Sin playsinline, Safari abre el reproductor nativo a pantalla completa.

- Canvas táctil: En todos los canvas donde se dibuje con el dedo, usar e.preventDefault() en touchmove para evitar scroll. Calcular coordenadas relativas al canvas con getBoundingClientRect().

- Audio y Vídeo: Usar getUserMedia + MediaRecorder para todas las grabaciones dentro de la PWA. Al salir de la misión, detener las pistas con stream.getTracks().forEach(t => t.stop()) y liberar el MediaRecorder.

- Sensores: Desvincular siempre los event listeners de deviceorientation/devicemotion al salir de la misión.

- Almacenamiento del estado del juego: gameState en localStorage. Serializar/deserializar con JSON.stringify/parse.

- Sistema de XP: Cada 100 XP se sube de nivel. Al completar cada misión y ser aprobada por el Juez, se suman los XP al perfil correspondiente y se comprueba si hay subida de nivel.

- Códigos fijos para misiones P2P (Día 17): El código secreto para las misiones de sincronización es el array ['Rojo', 'Azul', 'Verde', 'Amarillo']. Ambos perfiles usan esta misma constante hardcodeada.