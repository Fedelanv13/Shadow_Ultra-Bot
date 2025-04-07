
import { promises as fs } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import { plugins } from '../lib/plugins.js'

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

    let str = `
╭═══〘 ✯✯✯✯✯✯✯✯✯ 〙══╮
║    *TIBURON-BETA*
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡║
║➤ *¡Hola ${name}!*
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
┃ *< LISTA DE COMANDOS />*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃

📱 *COMANDOS PRINCIPALES*
┃ • .allmenu - Mostrar todos los comandos
┃ • .menu - Mostrar menú principal
┃ • .help - Obtener ayuda
┃ • .test - Probar funcionalidad del bot

👥 *GESTIÓN DE GRUPOS*
┃ • .add <número> - Añadir miembro
┃ • .kick - Eliminar miembro
┃ • .promote - Hacer admin
┃ • .demote - Quitar admin
┃ • .setdesc - Establecer descripción
┃ • .setname - Cambiar nombre
┃ • .hidetag - Etiquetar invisiblemente
┃ • .link - Obtener link del grupo
┃ • .tagall - Etiquetar a todos
┃ • .botcontrol - Activar/desactivar bot
┃ • .afk [razón] - Activar modo ausente

🎮 *DIVERSIÓN Y JUEGOS*
┃ • .kiss - Enviar sticker de beso
┃ • .pat - Acariciar a alguien
┃ • .slap - Dar una bofetada
┃ • .emojimix - Mezclar emojis
┃ • .tictactoe - Jugar TicTacToe
┃ • .cr7 - Contenido de CR7
┃ • .messi - Contenido de Messi

⬇️ *DESCARGAS*
┃ • .play - Reproducir música
┃ • .spotify - Descargar de Spotify
┃ • .fb - Descargar video de Facebook
┃ • .tiktok - Descargar video de TikTok
┃ • .ig - Descargar de Instagram
┃ • .twitter - Descargar de Twitter
┃ • .yt - Descargar video de YouTube
┃ • .mediafire - Descargar de MediaFire
┃ • .gdrive - Descargar de Google Drive
┃ • .pinterest - Descargar de Pinterest

🔍 *BÚSQUEDA*
┃ • .google - Buscar en Google
┃ • .lyrics - Buscar letras de canciones
┃ • .yts - Buscar en YouTube
┃ • .pinterest - Buscar imágenes
┃ • .playstore - Buscar apps
┃ • .mercadolibre - Buscar productos
┃ • .animeinfo - Buscar info de anime

🛠️ *HERRAMIENTAS*
┃ • .toimg - Convertir sticker a imagen
┃ • .tomp3 - Convertir video a audio
┃ • .tovideo - Convertir a formato video
┃ • .sticker - Crear sticker
┃ • .ip - Información de IP
┃ • .wallpaper - Obtener fondos de pantalla

👮‍♂️ *CONTROL DE ADMIN*
┃ • .enable - Activar funciones
┃ • .disable - Desactivar funciones
┃ • .antivirus - Protección antivirus
┃ • .antilink - Protección antilink
┃ • .antitoxic - Filtro anti-tóxico
┃ • .antiprivado - Anti mensajes privados
┃ • .welcome - Control mensaje bienvenida

📊 *SISTEMA E INFO*
┃ • .ping - Revisar latencia del bot
┃ • .runtime - Tiempo activo del bot
┃ • .status - Estado del bot
┃ • .creator - Mostrar info del creador
┃ • .infobot - Información del bot

---
🔰 *Notas Importantes*
• Todos los comandos empiezan con .
• Algunos comandos requieren privilegios de admin
• Reporta cualquier error al creador: ANDRESV27728
┗━━━━━━━━━━━━━━━━┛`.trim()

    conn.sendMessage(m.chat, { image: { url: pp }, caption: str }, { quoted: m })
  } catch (e) {
    conn.reply(m.chat, '*[❗] Lo siento, ocurrió un error al mostrar el menú.*', m)
    console.error(e)
  }
}

handler.help = ['allmenu']
handler.tags = ['main']
handler.command = /^(allmenu|menuall|allcmd|cmdall)$/i

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
