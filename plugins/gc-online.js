let handler = async (m, { conn, participants }) => {
  let online = []
  let onlineList = ''
  
  // Obtener usuarios en línea
  for (let user of participants) {
    if (user.presence?.lastKnownPresence === 'available') {
      online.push(user)
      onlineList += `╎❒ @${user.id.split('@')[0]}\n`
    }
  }

  // Formatear mensaje 
  let msg = `╭⌇───── ∘°❈°∘ ─────⌇
╰➤ ⚡ *𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎 𝙀𝙉 𝙇𝙄𝙉𝙀𝘼:* ${online.length}

${onlineList}
╰⌇───── ∘°❈°∘ ─────⌇`

  // Enviar mensaje mencionando usuarios
  conn.reply(m.chat, msg, m, { mentions: online.map(user => user.id) })
}

handler.help = ['online']
handler.tags = ['group']
handler.command = /^(online|listonline)$/i
handler.group = true

export default handler