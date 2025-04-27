
import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  await m.react('🕓')
  
  try {
    // Configurar el comportamiento de git pull
    execSync('git config pull.rebase false')
    
    // Intentar el pull
    let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : '')).toString().trim()
    
    let mensaje = stdout.includes('Already up to date') 
      ? '*[ ℹ️ ] El repositorio del bot está actualizado.*' 
      : '*[ ℹ️ ] Se actualizó con éxito el repositorio del bot.*\n\n' + stdout

    await conn.reply(m.chat, mensaje, m)
    await m.react('✅')
    
  } catch (err) {
    // Manejar errores específicos
    if (err.message.includes('divergent branches')) {
      try {
        // Forzar el pull
        execSync('git reset --hard && git pull')
        await conn.reply(m.chat, '*[ ℹ️ ] Actualización forzada exitosa.*', m)
        await m.react('✅')
      } catch (e) {
        await conn.reply(m.chat, `*[ ❌ ] Error en la actualización forzada:*\n${e.message}`, m)
        await m.react('❌')
      }
    } else {
      await conn.reply(m.chat, `*[ ❌ ] Error al actualizar:*\n${err.message}`, m)
      await m.react('❌')
    }
  }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'fix', 'pdate'] 
handler.customPrefix = /u|@|./
handler.rowner = true

export default handler
