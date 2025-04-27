
import { execSync } from 'child_process'

let updateInterval;

const performUpdate = async (m, conn) => {
  try {
    execSync('git config pull.rebase false')
    let stdout = execSync('git pull').toString().trim()
    
    if (!stdout.includes('Already up to date')) {
      let message = '*[ ℹ️ ] Se actualizó automáticamente el repositorio del bot.*\n\n' + stdout
      if (m && m.chat) {
        await conn.reply(m.chat, message, m)
      }
    }
  } catch (err) {
    console.error('Error en actualización automática:', err)
    if (m && m.chat) {
      await conn.reply(m.chat, `*[ ❌ ] Error en actualización automática:*\n${err.message}`, m)
    }
  }
}

let handler = async (m, { conn, text }) => {
  await m.react('🕓')
  
  if (text === 'on') {
    if (updateInterval) {
      await conn.reply(m.chat, '*[ ℹ️ ] La actualización automática ya está activada.*', m)
      return
    }
    updateInterval = setInterval(() => performUpdate(m, conn), 60000) // 60000 ms = 1 minuto
    await conn.reply(m.chat, '*[ ℹ️ ] Actualización automática activada.*', m)
    await m.react('✅')
    return
  }
  
  if (text === 'off') {
    if (!updateInterval) {
      await conn.reply(m.chat, '*[ ℹ️ ] La actualización automática ya está desactivada.*', m)
      return
    }
    clearInterval(updateInterval)
    updateInterval = null
    await conn.reply(m.chat, '*[ ℹ️ ] Actualización automática desactivada.*', m)
    await m.react('✅')
    return
  }
  
  // Actualización manual
  try {
    execSync('git config pull.rebase false')
    let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : '')).toString().trim()
    let mensaje = stdout.includes('Already up to date') 
      ? '*[ ℹ️ ] El repositorio del bot está actualizado.*' 
      : '*[ ℹ️ ] Se actualizó con éxito el repositorio del bot.*\n\n' + stdout

    await conn.reply(m.chat, mensaje, m)
    await m.react('✅')
  } catch (err) {
    await conn.reply(m.chat, `*[ ❌ ] Error al actualizar:*\n${err.message}`, m)
    await m.react('❌')
  }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'fix', 'pdate'] 
handler.customPrefix = /u|@|./
handler.rowner = true

export default handler
