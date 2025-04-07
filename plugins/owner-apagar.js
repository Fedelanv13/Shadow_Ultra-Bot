
let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) {
    global.dfail('owner', m, conn)
    throw false
  }

  let time = args[0] ? parseInt(args[0]) : 0
  
  if (isNaN(time)) {
    return m.reply('🚫 Por favor ingresa un número válido de segundos.')
  }

  if (time > 0) {
    m.reply(`🔌 El bot se apagará en ${time} segundos...`)
    setTimeout(() => {
      m.reply('⚡ Apagando el Bot...')
      conn.ws.close()
      process.exit()
    }, time * 1000)
  } else {
    await m.reply('🔌 Apagando el Bot...')
    conn.ws.close()
    process.exit()
  }
}

handler.help = ['apagar <segundos>']
handler.tags = ['owner']
handler.command = /^(apagar|off|shutdown)$/i
handler.rowner = true

export default handler
