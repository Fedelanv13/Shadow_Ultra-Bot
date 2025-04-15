import fs from 'fs';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const handler = async (m, { args, conn }) => {
  if (
    !m.quoted ||
    !m.quoted.message ||
    !m.quoted.mtype
  ) {
    return conn.reply(m.chat, '❌ *Error:* Responde a una imagen, video, audio, sticker o documento con una palabra clave para guardarlo. 📂', m);
  }

  const saveKey = args.join(' ').trim().toLowerCase();
  if (!saveKey) {
    return conn.reply(m.chat, '⚠️ *Escribe una palabra clave para guardar este multimedia.* 📝', m);
  }

  if (!fs.existsSync('./guar.json')) {
    fs.writeFileSync('./guar.json', JSON.stringify({}, null, 2));
  }

  let guarData = JSON.parse(fs.readFileSync('./guar.json', 'utf-8'));
  if (guarData[saveKey]) {
    return conn.reply(m.chat, `⚠️ *La palabra clave* "${saveKey}" *ya existe.* Usa otra diferente. ❌`, m);
  }

  const quotedMsg = m.quoted;
  let mediaType, fileExtension, mimetype;

  if (quotedMsg.imageMessage) {
    mediaType = 'image';
    fileExtension = 'jpg';
    mimetype = quotedMsg.imageMessage.mimetype;
  } else if (quotedMsg.videoMessage) {
    mediaType = 'video';
    fileExtension = 'mp4';
    mimetype = quotedMsg.videoMessage.mimetype;
  } else if (quotedMsg.audioMessage) {
    mediaType = 'audio';
    fileExtension = 'mp3';
    mimetype = quotedMsg.audioMessage.mimetype;
  } else if (quotedMsg.stickerMessage) {
    mediaType = 'sticker';
    fileExtension = 'webp';
    mimetype = quotedMsg.stickerMessage.mimetype || 'image/webp';
  } else if (quotedMsg.documentMessage) {
    mediaType = 'document';
    fileExtension = quotedMsg.documentMessage.mimetype?.split('/')[1] || 'bin';
    mimetype = quotedMsg.documentMessage.mimetype;
  } else {
    return conn.reply(m.chat, '❌ *Solo puedes guardar imágenes, videos, audios, stickers o documentos.*', m);
  }

  const mediaStream = await downloadContentFromMessage(quotedMsg, mediaType);
  let mediaBuffer = Buffer.alloc(0);
  for await (const chunk of mediaStream) {
    mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
  }

  guarData[saveKey] = {
    buffer: mediaBuffer.toString('base64'),
    mimetype,
    extension: fileExtension,
    savedBy: m.sender
  };

  fs.writeFileSync('./guar.json', JSON.stringify(guarData, null, 2));

  return conn.reply(m.chat, `✅ *Listo:* El archivo fue guardado con la clave: *"${saveKey}"*. 🎉`, m);
};

handler.help = ['guar <clave>'];
handler.tags = ['herramientas'];
handler.command = ['guar'];

export default handler;