import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://files.catbox.moe/dgvj76.jpg';

  if (chat.welcome) {
    let img;
    try {
      let pp = await conn.profilePictureUrl(who, 'image');
      img = await (await fetch(pp)).buffer();
    } catch {
      img = await (await fetch(defaultImage)).buffer();
    }

  const welcomeMessage = global.db.data.chats[m.chat]?.welcomeMessage || 'Bienvenido/a :';

if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
  let bienvenida = `╭─────────────╮\n  *¡NUEVO INTEGRANTE!*\n╰─────────────╯\n\n🌟 Bienvenido/a @${m.messageStubParameters[0].split`@`[0]}\n📍 Grupo: *${groupMetadata.subject}*\n\nEsperamos que la pases bien, comparte buena vibra y sé parte de esta pequeña gran familia.\n\n༄ ── 「 Powered by Moon Force Team 」`;

  await conn.sendMessage(m.chat, {
    image: img,
    caption: bienvenida,
    mentions: [who],
    buttons: [
      { buttonId: '.menu', buttonText: { displayText: '📜 Menú' }, type: 1 }
    ]
  }, { quoted: fkontak });

} else if (
  m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || 
  m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
) {
  const despMessage = global.db.data.chats[m.chat]?.despMessage || 'Se fue...';

  let bye = `╭─────────────╮\n  *ADIÓS, GUERRERO*\n╰─────────────╯\n\n@${m.messageStubParameters[0].split`@`[0]} ha dejado el grupo.\n\n✨ Siempre recordaremos tus memes (o no).\n¡Que la fuerza te acompañe fuera de ${groupMetadata.subject}!\n\n༄ ── 「 Powered by Moon Force Team 」`;

  await conn.sendMessage(m.chat, {
    image: img,
    caption: bye,
    mentions: [who],
    buttons: [
      { buttonId: '.menu', buttonText: { displayText: '📜 Menú' }, type: 1 }
    ]
  }, { quoted: fkontak });
}
  }

  return true
}
