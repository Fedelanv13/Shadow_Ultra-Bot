
let handler = async (m, { conn, __dirname }) => {
  try {
    const pp = './media/menus/Menu.jpg'
    let _package = JSON.parse(await fs.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let taguser = '@' + m.sender.split('@s.whatsapp.net')[0]

    let str = `
╭═══〘 ✯✯✯✯✯✯✯✯✯ 〙══╮
║    𝐒𝐇𝐀𝐃𝐎𝐖 𝐁𝐎𝐓 - 𝐌𝐃
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡║
║➤ *¡Hola ${taguser}!*
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡║
║➤ *Creador:* ANDRESV27728
║➤ *Fecha:* ${date}
║➤ *Tiempo activo:* ${uptime}
║➤ *Usuarios:* ${Object.keys(global.db.data.users).length}
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡║
║➤ *Exp:* ${exp}
║➤ *Nivel:* ${level}
║➤ *Rol:* ${role}
╰═══╡✯✯✯✯✯✯✯✯✯╞═══╯

┏━━━━━━━━━━━━━━━━┓
┃ *< COMANDOS PRINCIPALES />*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃

📱 *COMANDOS*
┃ • .allmenu - Ver todos los comandos
┃ • .menu - Menú principal
┃ • .help - Ayuda general
┃ • .test - Probar bot

👥 *GRUPOS*
┃ • .add - Añadir miembros
┃ • .kick - Eliminar miembros
┃ • .promote - Dar admin
┃ • .demote - Quitar admin
┃ • .link - Link del grupo
┃ • .hidetag - Mencionar a todos
┃ • .tagall - Etiquetar a todos
┃ • .welcome - Bienvenida

🎮 *JUEGOS Y DIVERSIÓN*
┃ • .tictactoe - Tres en raya
┃ • .simi - Chatbot
┃ • .top - Rankings
┃ • .gay - Medir gay
┃ • .pregunta - Preguntas
┃ • .verdad - Verdad o reto
┃ • .fake - Crear imagen falsa
┃ • .attp - Sticker con texto
┃ • .emojimix - Mezclar emojis

⬇️ *DESCARGAS*
┃ • .play - Descargar música
┃ • .playvid - Descargar video
┃ • .tiktok - Descargar TikTok
┃ • .instagram - Descargar Instagram
┃ • .facebook - Descargar Facebook
┃ • .spotify - Descargar Spotify
┃ • .pinterest - Descargar Pinterest
┃ • .mediafire - Descargar Mediafire
┃ • .gdrive - Descargar Google Drive

🔍 *BÚSQUEDA*
┃ • .google - Buscar en Google
┃ • .yts - Buscar en YouTube
┃ • .lyrics - Buscar letras
┃ • .playstore - Buscar apps
┃ • .mercadolibre - Buscar productos

🛠️ *HERRAMIENTAS*
┃ • .toimg - Sticker a imagen
┃ • .tomp3 - Video a MP3
┃ • .tovideo - Sticker a video
┃ • .sticker - Crear sticker
┃ • .translate - Traducir texto
┃ • .ocr - Texto de imagen
┃ • .tts - Texto a voz

👮‍♂️ *ADMIN*
┃ • .enable - Activar funciones
┃ • .disable - Desactivar funciones
┃ • .antifake - Anti números falsos
┃ • .antilink - Anti enlaces
┃ • .antispam - Anti spam
┃ • .antiprivado - Anti chat privado
┃ • .modoadmin - Solo admins

📊 *SISTEMA*
┃ • .ping - Velocidad
┃ • .runtime - Tiempo activo
┃ • .status - Estado del bot
┃ • .info - Información
┃ • .owner - Creador
┃ • .script - Repositorio

🔞 *NSFW* 
┃ • .nsfw - Activar contenido +18
┃ • .nsfwmenu - Menú NSFW
┃ • .loli - Imágenes loli
┃ • .waifu - Imágenes waifu
┃ • .hentai - Contenido hentai
┃ • .rule34 - Regla 34

🎲 *FREE FIRE*
┃ • .bermuda - Mapa Bermuda
┃ • .kalahari - Mapa Kalahari
┃ • .alpes - Mapa Alpes
┃ • .nexterra - Mapa Nexterra
┃ • .inmasc4 - VS Masculino 4v4
┃ • .infem4 - VS Femenino 4v4
┃ • .inmixto4 - VS Mixto 4v4
┃ • .inmasc6 - VS Masculino 6v6
┃ • .infem6 - VS Femenino 6v6
┃ • .inmixto6 - VS Mixto 6v6
┃ • .sala - Crear sala
┃ • .encuesta - Hacer encuesta

----------------------------
🔰 *NOTAS*
• Usa . al inicio de cada comando
• No hagas spam de comandos
• No uses el bot en privado
• Reporta errores con .report
┗━━━━━━━━━━━━━━━━┛
    `.trim()

    conn.sendMessage(m.chat, { image: { url: pp }, caption: str, mentions: [m.sender] }, { quoted: m })

  } catch (e) {
    console.error(e)
    throw e
  }
}

handler.help = ['allmenu']
handler.tags = ['main'] 
handler.command = ['allmenu', 'listamenu']

export default handler
