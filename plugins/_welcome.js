import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://files.catbox.moe/dgvj76.jpg'

  if (chat.welcome) {
    let img
    try {
      let pp = await conn.profilePictureUrl(who, 'image')
      img = await (await fetch(pp)).buffer()
    } catch {
      img = await (await fetch(defaultImage)).buffer()
    }

    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'sin descripción'

    // Nueva bienvenida
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let text = chat.sWelcome
        ? chat.sWelcome
            .replace(/@user/g, taguser)
            .replace(/@group/g, groupName)
            .replace(/@desc/g, groupDesc)
        : `🦋✧ 𝗕𝗶𝗲𝗻𝘃𝗲𝗻𝗶𝗱𝗼 𝗮𝗹 𝗴𝗿𝘂𝗽𝗼 ✧🦋
  
🎉 *${taguser}* acaba de unirse al grupo! 🎉
  
📌 𝗡𝗼𝗺𝗯𝗿𝗲 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼: *${groupName}*
📜 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝗰𝗶𝗼́𝗻: *${groupDesc}*
  
¡Esperamos que disfrutes tu tiempo aquí! 💫✨`

      await conn.sendMessage(m.chat, { image: img, caption: text, mentions: [who] }, { quoted: fkontak })
    } 
    // Nueva despedida
    else if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      let text = chat.sBye
        ? chat.sBye
            .replace(/@user/g, taguser)
            .replace(/@group/g, groupName)
            .replace(/@desc/g, groupDesc)
        : `⚡️👋 *Adiós, ${taguser}* 👋⚡️

¡Te vamos a extrañar, pero te deseamos lo mejor! ✨

📌 *${groupName}* siempre te recordará. ¡Mantente en contacto! 💖`

      await conn.sendMessage(m.chat, { image: img, caption: text, mentions: [who] }, { quoted: fkontak })
    }
  }

  return true
                                      }
