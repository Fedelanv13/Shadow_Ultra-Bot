import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '✏️ *Ingresa el título de una canción o video de YouTube.*\n\nEjemplo:\n> *Corazón Serrano - Mix Poco Yo*', m);
  }

  await m.react('🔍');

  await conn.sendMessage(m.chat, {
    text: '⌛ *Buscando en YouTube...*',
    tts: true
  }, { quoted: m });

  try {
    const searchResults = await searchVideos(args.join(" "));

    if (!searchResults.length) {
      throw new Error('No se encontraron resultados.');
    }

    const video = searchResults[0];
    const thumbnail = await (await fetch(video.thumbnail)).buffer();

    const messageText = formatMessageText(video);

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: messageText,
      footer: `✨ 𝚎𝚍𝚒𝚝𝚊𝚍𝚘 𝚙𝚘𝚛: Wirk`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 500,
        isForwarded: true
      },
      buttons: generateButtons(video, usedPrefix),
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, '*❗ Ocurrió un error al buscar el video.*', m);
  }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];

export default handler;

async function searchVideos(query) {
  try {
    const res = await yts(query);
    return res.videos.slice(0, 10).map(video => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      channel: video.author.name,
      published: video.timestamp || 'No disponible',
      views: video.views || 'No disponible',
      duration: video.duration.timestamp || 'No disponible'
    }));
  } catch (error) {
    console.error('Error en yt-search:', error.message);
    return [];
  }
}

function formatMessageText(video) {
  return `🎶 *RESULTADO ENCONTRADO*\n\n` +
         `*• Título:* ${video.title}\n` +
         `*• Duración:* ${video.duration || 'No disponible'}\n` +
         `*• Canal:* ${video.channel || 'Desconocido'}\n` +
         `*• Publicado:* ${convertTimeToSpanish(video.published)}\n` +
         `*• Vistas:* ${video.views || 'No disponible'}\n\n` +
         `🌐 *Enlace:* ${video.url}`;
}

function generateButtons(video, usedPrefix) {
  return [
    {
      buttonId: `${usedPrefix}ytmp3 ${video.url}`,
      buttonText: { displayText: '🎧 Descargar Audio (MP3)' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}ytmp4 ${video.url}`,
      buttonText: { displayText: '🎬 Descargar Video (MP4)' },
      type: 1
    }
  ];
}

function convertTimeToSpanish(timeText) {
  return timeText
    .replace(/year/, 'año')
    .replace(/years/, 'años')
    .replace(/month/, 'mes')
    .replace(/months/, 'meses')
    .replace(/day/, 'día')
    .replace(/days/, 'días')
    .replace(/hour/, 'hora')
    .replace(/hours/, 'horas')
    .replace(/minute/, 'minuto')
    .replace(/minutes/, 'minutos');
}
