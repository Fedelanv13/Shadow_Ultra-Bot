import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

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

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {  
      let text = chat.sWelcome  
        ? chat.sWelcome  
            .replace(/@user/g, taguser)  
            .replace(/@group/g, groupName)  
            .replace(/@desc/g, groupDesc)  
        : `𓆩°»｡˚ ∾･⁙･ ღ ➵ ⁘ ➵ ღ ･⁙･∾ ˚ ｡«°𓆪

❍⌇─➭ Wᴇʟᴄᴏᴍᴇ ᴛᴏ Gʀᴏᴜᴘ ::
๑ ˚ ͙۪۪̥${taguser} 👋🏻꒱

┌ `ɢʀᴏᴜᴘ::`
☕ ᩙᩞ✑ ${groupName}
└┬ ɴᴇᴡ ᴍᴇᴍʙᴇʀ
︱·˚🤍 Disfruta del grupo.
└╾ׅ╴ׂꨪ╌╼᪶╾᪶ ۪〫┄ׅ⃯፝֟╌╼᪶֘╾᪶╌ׅꨪ╶۪╼┘

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴏᴏɴ ғᴏʀᴄᴇ ᴛᴇᴀᴍ`

      const buttons = [
        {
          buttonId: `!join ${who}`,
          buttonText: { displayText: '📝 Unirte al chat' },
          type: 1
        }
      ];

      const buttonMessage = {
        image: img,
        caption: text,
        mentions: [who],
        footer: `© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴏᴏɴ ғᴏʀᴄᴇ ᴛᴇᴀᴍ`,
        buttons: buttons,
        headerType: 1
      };

      await conn.sendMessage(m.chat, buttonMessage, { quoted: fkontak });  
    } else if (  
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||  
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE  
    ) {  
      let text = chat.sBye  
        ? chat.sBye  
            .replace(/@user/g, taguser)  
            .replace(/@group/g, groupName)  
            .replace(/@desc/g, groupDesc)  
        : `𓆩°»｡˚ ∾･⁙･ ღ ➵ ⁘ ➵ ღ ･⁙･∾ ˚ ｡«°𓆪

❍⌇─➭ Sᴇᴇ ʏᴏᴜ Lᴀᴛᴇʀ ::
๑ ˚ ͙۪۪̥${taguser} 🖕🏻꒱

┌ `ᴘᴜᴛᴀ ᴇʟɪᴍɪɴᴀᴅᴀ`
└┬ ᴇx ᴍᴇᴍʙᴇʀ
︱·˚👻 Ojalá y lo violen los ngros.
└╾ׅ╴ׂꨪ╌╼᪶╾᪶ ۪〫┄ׅ⃯፝֟╌╼᪶֘╾᪶╌ׅꨪ╶۪╼┘

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴏᴏɴ ғᴏʀᴄᴇ ᴛᴇᴀᴍ`

      const buttons = [
        {
          buttonId: `!goodbye ${who}`,
          buttonText: { displayText: '💔 Despedirse' },
          type: 1
        }
      ];

      const buttonMessage = {
        image: img,
        caption: text,
        mentions: [who],
        footer: `© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴏᴏɴ ғᴏʀᴄᴇ ᴛᴇᴀᴍ`,
        buttons: buttons,
        headerType: 1
      };

      await conn.sendMessage(m.chat, buttonMessage, { quoted: fkontak });  
    }
  }

  return true;
}
