import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://files.catbox.moe/dgvj76.jpg';

  if (chat.welcome) {
    let img
    try {
      let pp = await conn.profilePictureUrl(who, 'image')
      img = await (await fetch(pp)).buffer()
    } catch {
      img = await (await fetch(defaultImage)).buffer()
    }

    const welcomeMessage = global.db.data.chats[m.chat]?.welcomeMessage || 'Bienvenido/a :'

    let captionText = ''
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      captionText = `╭─────────────╮\n  *¡NUEVO INTEGRANTE!*\n╰─────────────╯\n\n🌟 Bienvenido/a ${taguser}\n📍 Grupo: *${groupMetadata.subject}*\n\nEsperamos que la pases bien, comparte buena vibra y sé parte de esta pequeña gran familia.\n\n༄ ── 「 Powered by Moon Force Team 」`
    } else if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      captionText = `╭─────────────╮\n  *ADIÓS, GUERRERO*\n╰─────────────╯\n\n${taguser} ha dejado el grupo.\n\n✨ Siempre recordaremos tus memes (o no).\n¡Que la fuerza te acompañe fuera de ${groupMetadata.subject}!\n\n༄ ── 「 Powered by Moon Force Team 」`
    } else return true

    await conn.sendMessage(m.chat, {
      image: img,
      caption: captionText,
      mentions: [who],
      footer: 'Moon Force Bot',
      templateButtons: [
        { index: 1, quickReplyButton: { displayText: '📜 Menú', id: '.menu' } }
      ]
    })
  }

  return true
}
