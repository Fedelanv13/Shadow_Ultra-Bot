import axios from 'axios';
import crypto from 'crypto';

const savetube = {
  // ... (el resto de tu código savetube permanece igual)
};

const handler = async (m, { conn, args, command }) => {
  if (args.length < 1) return m.reply(`*[ ℹ️ ] Ingresa una URL de un video o audio de YouTube*`);

  let url = args[0];
  let format = command === 'ytmp3' ? 'mp3' : args[1] || '720';

  if (!savetube.isUrl(url)) return m.reply("Por favor, ingresa un link válido de YouTube.");

  try {
    await m.reply('⏳ Descargando audio, por favor espera...'); // Mensaje de espera inicial
    await m.react('🕒');
    let res = await savetube.download(url, format);
    if (!res.status) {
      await m.react('✖️');
      return m.reply(`*Error:* ${res.error}`);
    }

    let { title, download, type } = res.result;

    if (type === 'video') {
      await conn.sendMessage(m.chat, {
        video: { url: download }
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });
    }
    await m.react('✅');
  } catch (e) {
    await m.react('✖️');
    m.reply(`*¡Fallo en la descarga!*`);
  }
};

handler.help = ['ytmp4 *<url>*', 'ytmp3 *<url>*'];
handler.command = ['ytmp4', 'ytmp3'];
handler.tags = ['dl']
handler.customPrefix = /p|@|./i;

export default handler;
