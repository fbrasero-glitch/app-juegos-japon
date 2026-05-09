import re

# Diccionario de descripciones narrativas mejoradas
NARRATIVE_OVERRIDES = {
    "day_1_fam_bet": "¡El viaje comienza sobre las nubes! Antes de aterrizar en tierras niponas, escribid 3 locuras o curiosidades que creéis que veréis. El día 23 las leeremos para ver quién tenía razón.",
    "day_1_kid9_bingo": "¡Bienvenida a Japón! El aeropuerto es un mundo lleno de sorpresas. Encuentra 4 objetos típicos (un gato de la suerte, un sushi, un farolillo...) para completar tu primer Bingo.",
    "day_1_kid14_nav": "Monitoriza nuestra llegada al Imperio del Sol Naciente. Anota la velocidad del Boeing y usa la brújula para orientar nuestro destino hacia el Norte.",
    "day_6_kid9_ruisenor": "Este suelo fue diseñado para 'cantar' y alertar de intrusos. Intenta caminar como un ninja en silencio absoluto, y luego graba el chirrido real para que el Juez lo escuche.",
    "day_7_fam_otowa": "Cuenta la leyenda que cada chorro de la Cascada Otowa otorga un don sagrado. Conecta con tu hermano y elegid con sabiduría: salud, amor o éxito en los estudios.",
    "day_8_fam_silencio": "Escucha el susurro del viento entre las cañas del Bosque de Bambú. Sincroniza tus sentidos con la naturaleza en este oasis Zen y graba el sonido de la paz.",
    "day_6_kid14_edicto": "Estás en el corazón del antiguo poder imperial. Como heraldo del Emperador, redacta un decreto solemne que cambie las leyes de tu familia para siempre.",
    "day_3_kid9_foso": "Los imponentes fosos del Castillo de Osaka protegían al Shogun. ¿Cuántos pasos de gigante necesitas para cruzar el puente que lleva a la fortaleza?",
    "day_4_kid9_cangrejo": "¡Sube el puente hiper-curvo Sorihashi con cuidado! ¿Lo lograste de lado como un ágil cangrejo o de frente como un samurái decidido?",
    "day_9_kid9_scratch": "El Pabellón Dorado se refleja en el estanque como un espejo de pureza. Limpia el reflejo virtual para revelar la belleza del Kinkaku-ji.",
    "day_7_kid14_anti_seismic": "Las grandes pagodas de madera ocultan secretos de ingeniería milenarios. Mantén el equilibrio y demuestra que tu pulso es tan estable como la estructura de Kiyomizu-dera.",
    "day_10_kid9_bento": "En el bullicioso Mercado Nishiki, los colores y olores son infinitos. Organiza tu propia caja Bento con los ingredientes más deliciosos de la cocina de Kioto.",
    "day_5_kid14_kanji": "Siente la fluidez del pincel sobre el papel de arroz. Dibuja el Kanji de AGUA (水) o MONTAÑA (山) con precisión y calma para demostrar tu maestría.",
    "day_2_kid14_protocol": "El sistema de trenes de Japón es el más puntual del mundo. Guía a tu familia a través de este laberinto de hierro y demuestra que eres un Shōgun de la logística.",
    "day_1_kid9_bingo": "¡Bienvenida a Japón! El aeropuerto es la puerta a un mundo de fantasía. Encuentra 4 objetos mágicos en este puerto espacial para sellar tu llegada.",
    "day_3_kid14_architect": "Usa tus herramientas digitales de última generación para medir la distancia desde el mundo moderno hasta el corazón de la historia en el Castillo de Osaka.",

}

# Mapping de títulos a localizaciones detalladas
LOCATION_OVERRIDES = {
    "day_1_fam_bet": "Vuelo Internacional ✈️",
    "day_1_kid9_bingo": "Aeropuerto de Osaka (KIX) 🛂",
    "day_1_kid14_nav": "A bordo del Boeing 777 🛰️",
    "day_3_kid9_foso": "Fosos del Castillo de Osaka 🏯",
    "day_4_kid9_cangrejo": "Gran Puente Curvo Sorihashi 🦀",
    "day_7_fam_otowa": "Gran Balcón de Kiyomizu-dera ⛩️",
    "day_8_fam_silencio": "Sendero del Bosque de Bambú 🎋",
    "day_9_kid9_scratch": "Estanque del Espejo (Kinkaku-ji) 🟡",
}

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Aplicar mejoras narrativas
for m_id, desc in NARRATIVE_OVERRIDES.items():
    # Buscar el bloque de la misión
    # Buscamos el ID y luego la etiqueta mission-desc
    pattern = rf'"{m_id}":\s*{{.*?<p class=\\"mission-desc\\">(.*?)</p>'
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, lambda m: m.group(0).replace(m.group(1), desc), content, flags=re.DOTALL)
    else:
        # Intentar sin escapar comillas
        pattern_plain = rf'"{m_id}":\s*{{.*?<p class="mission-desc">(.*?)</p>'
        content = re.sub(pattern_plain, lambda m: m.group(0).replace(m.group(1), desc), content, flags=re.DOTALL)

# Aplicar localizaciones detalladas
for m_id, loc in LOCATION_OVERRIDES.items():
    pattern = rf'"{m_id}":\s*{{.*?location:\s*"(.*?)"'
    content = re.sub(pattern, lambda m: m.group(0).replace(m.group(1), loc), content, flags=re.DOTALL)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Narrativa inmersiva y localizaciones geográficas aplicadas a app.js.")
