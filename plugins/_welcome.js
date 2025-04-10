import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

export async function before(m, { conn, groupMetadata }) {
  // Asegurarse de que sea un grupo y que el mensaje tiene tipo de stub
  if (!m.messageStubType || !m.isGroup) return;

  const chat = global.db.data.chats[m.chat] || {};
  if (!chat.welcome) return;  // Si no está habilitada la bienvenida, no hacer nada

  const who = m.messageStubParameters?.[0];  // Obtener al usuario que entró o salió
  if (!who) return;

  const taguser = `@${who.split('@')[0]}`;  // Crear el tag del usuario
  const defaultImage = 'https://files.catbox.moe/dgvj76.jpg';  // Imagen por defecto

  let img;
  try {
    // Intentamos obtener la foto de perfil del usuario
    const pp = await conn.profilePictureUrl(who, 'image');
    img = await (await fetch(pp)).buffer();
  } catch {
    // Si no se obtiene la foto de perfil, usamos la imagen por defecto
    img = await (await fetch(defaultImage)).buffer();
  }

  const fkontak = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
      contactMessage: {
        displayName: 'Bot',
        vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Bot\nEND:VCARD'
      }
    }
  };

  // Mensaje de bienvenida cuando un nuevo participante entra al grupo
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const bienvenida = `╭─────────────╮\n  *¡NUEVO INTEGRANTE!*\n╰─────────────╯\n\n🌟 Bienvenido/a ${taguser}\n📍 Grupo: *${groupMetadata.subject}*\n\nEstamos felices de tenerte con nosotros. ¡Disfruta y sé parte de esta gran familia!\n\n༄ ── 「 Powered by Moon Force Team 」`;

    // Preparamos el mensaje multimedia con imagen, texto y botones
    const message = await prepareWAMessageMedia({
      image: img,
      caption: bienvenida,
      footer: 'Moon Force Team',
    }, { upload: conn.waUploadToServer });

    // Creamos los botones para el mensaje
    const buttons = [
      {
        buttonId: '.menu',
        buttonText: { displayText: '📜 Menú' },
        type: 1
      }
    ];

    // Generamos el mensaje con los botones
    const templateMessage = generateWAMessageFromContent(m.chat, {
      templateMessage: {
        hydratedTemplate: {
          imageMessage: message.imageMessage,
          hydratedFooterText: 'Moon Force Team',
          hydratedButtons: buttons
        }
      }
    }, { quoted: fkontak });

    // Enviamos el mensaje al grupo
    await conn.relayWAMessage(templateMessage);

  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || 
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    // Mensaje de despedida cuando un participante deja el grupo
    const despedida = `╭─────────────╮\n  *ADIÓS, GUERRERO*\n╰─────────────╯\n\n${taguser} ha dejado el grupo.\n\n🌟 ¡Te extrañaremos! ¡Que te vaya bien fuera de *${groupMetadata.subject}*!\n\n༄ ── 「 Powered by Moon Force Team 」`;

    // Preparamos el mensaje multimedia con imagen, texto y botones
    const message = await prepareWAMessageMedia({
      image: img,
      caption: despedida,
      footer: 'Moon Force Team',
    }, { upload: conn.waUploadToServer });

    // Creamos los botones para el mensaje
    const buttons = [
      {
        buttonId: '.menu',
        buttonText: { displayText: '📜 Menú' },
        type: 1
      }
    ];

    // Generamos el mensaje con los botones
    const templateMessage = generateWAMessageFromContent(m.chat, {
      templateMessage: {
        hydratedTemplate: {
          imageMessage: message.imageMessage,
          hydratedFooterText: 'Moon Force Team',
          hydratedButtons: buttons
        }
      }
    }, { quoted: fkontak });

    // Enviamos el mensaje al grupo
    await conn.relayWAMessage(templateMessage);
  }

  return true;
}
