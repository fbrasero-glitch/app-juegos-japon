Quiero añadir a la app una nueva sección llamada "Álbum del Coleccionista". Es independiente de las misiones y del sistema de XP. Su objetivo es motivar a los niños a observar y descubrir cosas durante el viaje, sin presión de juego.

Funcionará como un diario visual donde cada niño puede ir añadiendo fotos de las cosas que encuentra, organizadas en 7 categorías temáticas.

---

## CONCEPTO GENERAL

Desde la pantalla principal de cada niño (donde se ve su perfil y el acceso a los días), quiero añadir un acceso al "Álbum del Coleccionista". Al entrar, el niño ve las 7 categorías como tarjetas. Al pulsar en una, entra en una cuadrícula donde puede ir añadiendo fotos de lo que va encontrando.

No hay recompensas, XP ni validación del Juez. Es simplemente una herramienta para que se fijen en cosas y las guarden como recuerdo. Que sea bonito y motivador, pero sin presión.

---

## LAS 7 CATEGORÍAS DEL ÁLBUM

### 1. Herbario de Sellos (Eki-Stamps)
En Japón, cada estación de tren, templo y aeropuerto tiene su propio sello de tinta para estampar en cuadernos. Esta categoría es para que los niños busquen estos sellos durante el viaje y los inmortalicen con una foto.

Cosas que pueden buscar: el sello de la estación de Shinjuku, el de Shibuya, el de la estación de Kioto, el del templo Senso-ji, el del aeropuerto antes de volver, etc. Que intenten conseguir todos los que puedan.

### 2. Catálogo de Tecnología (para el niño de 14 años)
Japón es un paraíso de la tecnología. Esta categoría es para que el adolescente documente máquinas expendedoras que vendan cosas raras (sopa caliente, paraguas, juguetes), latas de bebidas con diseños especiales de anime, figuras de robots gigantes como el Gundam de Odaiba, y consolas retro que encuentre en Akihabara.

### 3. Bestiario Mágico (para la niña de 9 años)
Durante el viaje se encontrarán con muchas criaturas, reales y mitológicas. Esta categoría es para que la niña fotografíe los ciervos de Nara, las estatuas de zorros Kitsune de Fushimi Inari, los guardianes Jizo con babero rojo, los tres monos de Nikko, gatos del barrio de Kagurazaka o cualquier mascota de tienda que vea.

### 4. Galería de Arte Urbano (Tapas de Alcantarilla)
En Japón, las tapas de alcantarilla son obras de arte: cada ciudad tiene diseños únicos con flores, monumentos o animales típicos. Esta categoría es para fotografiar las más bonitas que encuentren. La más famosa es la de Kawaguchiko con el Monte Fuji, pero en Osaka hay del castillo, en Kioto de bambú o geishas, en Nara de ciervos...

### 5. Almacén de Sabores Extraños
La gastronomía japonesa es muy diversa. Esta categoría es una checklist visual de cosas raras que han probado o encontrado: KitKats de sabores locos (matcha, sake, wasabi, fresa, melón), el pulpo con huevo de codorniz del mercado Nishiki, mariscos extraños del mercado Kuromon, crepes locas de Harajuku, o la carne de Hida en Takayama. Pueden marcar lo que han probado y añadir una foto.

### 6. Archivo de Simbolismo Sagrado
En templos y santuarios hay muchos objetos simbólicos. Esta categoría es para documentar los papeles de la suerte (omikuji) que saquen en templos como Senso-ji, las tablillas de madera (ema) donde la gente escribe sus deseos, los escudos familiares como las tres hojas de malva de los Tokugawa en el castillo Nijo, o los grandes Budas de Nara y Kamakura.

### 7. Auditoría de Texturas y Sonidos
Una categoría más sensorial. Por un lado, fotos macro de texturas que encuentren: la fibra del tatami del ryokan, la seda de un kimono en las calles de Kioto, la paja de los tejados tradicionales, la corteza del bambú en Arashiyama, o la madera tallada de Takayama. Por otro lado, una sección de sonidos donde puedan guardar las grabaciones de audio que hayan hecho en otras misiones: el motor del avión, las melodías de las estaciones de metro, la cascada de Shiraito o el sonido de los semáforos japoneses.

---

## FUNCIONAMIENTO

Cada categoría funciona como una cuadrícula de casillas. Las casillas están vacías al principio y el niño puede ir añadiendo contenido manualmente. Cuando pulsa una casilla vacía, se abre la cámara para hacer una foto (o el micrófono para grabar sonido, en el caso de la sección de sonidos). La foto se guarda en la casilla y ya queda como parte de su colección.

Cada categoría debe tener un nombre, un icono (emoji) y una breve descripción explicando qué tipo de cosas buscar.

Las casillas deben tener etiquetas con pistas para que el niño sepa qué buscar. Por ejemplo, en el Bestiario Mágico, una casilla diría "Ciervo Sagrado de Nara" y otra "Zorro Kitsune de Fushimi Inari". En los Sabores Extraños, "KitKat de Matcha", "KitKat de Sake", "Tako Tamago (pulpo con huevo)", etc.

El diseño debe ser atractivo para cada edad. Para la niña de 9 años, colores cálidos, emojis grandes, animaciones suaves. Para el niño de 14 años, un estilo más técnico, oscuro, con tipografía monoespaciada.

Quiero que los niños sientan que están creando su propio museo del viaje, no que están cumpliendo tareas. Que sea un espacio de creatividad y exploración.
---

## ESTADO DE IMPLEMENTACIÓN TÉCNICA (Progreso IA)

- [x] **1. Modificación de Estado (`app.js`)**:
  - Añadir objeto `album: {}` al `DEFAULT_STATE` de cada niño.
  - Asegurar la migración de datos para partidas existentes.
- [x] **2. Configuración (`app.js`)**:
  - Crear constante `ALBUM_CONFIG` con las 7 categorías, definiendo para cada una: `id`, `title`, `emoji`, `description`, `roles` (ej. `kid9` o `kid14` o ambos) y `hints` (las etiquetas para las casillas).
- [x] **. Interfaz (`index.html`)**:
  - Añadir un botón "📸 Álbum" en la vista principal del niño (`view-days`).
  - Crear el bloque `<div id="view-album">` para ver la lista de las categorías como tarjetas grandes.
  - Crear el bloque `<div id="view-album-category">` para ver el interior de una categoría (la cuadrícula de 9 huecos).
  - Integrar input oculto `<input type="file" id="album-camera-input" accept="image/*" capture="environment">` para captura nativa.
- [x] **. Estilos (`styles.css`)**:
  - Diseño del `album-grid` como "álbum de cromos" (casillas con bordes dashed).
  - Efectos visuales de polaroid cuando hay fotos.
  - Compatibilidad con el Glassmorphism (`theme-laura`) y Cyberpunk (`theme-ivan`).
- [x] **5. Álbum de Comidas Japonesas (`comidas`)**:
  - Añadida categoría "Gran Banquete Japonés" 🍱 con 35 pistas de platos típicos de Japón (Ramen, Sushi, Takoyaki, Okonomiyaki, Tempura, Tonkatsu, Gyoza, Yakitori, Katsudon, Udon, Soba, Kare, Onigiri, Yakisoba, Shabu-Shabu, Unagi, Miso, Edamame, Mochi, Taiyaki, Dango, Kakigori, Tamagoyaki, Karaage, Bento, Wagyu, Melonpan, Dorayaki, Omurice, Chawanmushi, Parfait Matcha, Kaiseki, Somen, Korokke, Kushikatsu).
- [x] **6. Guardado en Almacenamiento del Teléfono**:
  - `triggerDeviceDownload` exportado globalmente e integrado en `savePhotoToDB` / `saveMedia` para forzar la descarga de todas las imágenes tomadas en la app directamente a la carpeta de descargas/galería del teléfono.
- [x] **7. Gestión de Sonidos en Álbum**:
  - Botones "▶️ Oír" y "🗑️ Borrar" añadidos en las casillas de audio. Opción interactiva para eliminar cualquier audio guardado y así poder modificarlo o volver a grabarlo.
