import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '[ ℹ️ ] ¡Por favor ingresa un título de YouTube para buscar!\n\nEjemplo: *Corazón Serrano - Mix Poco Yo*', m);
  }

  await m.react('📓'); // Reacción de espera

  // Enviar mensaje de espera con TTS
  await conn.sendMessage(m.chat, {
    text: '❒ ∆ *¡Un momento, por favor!* ▶\n\n☑ *Estamos buscando tu video...* ✯',
    tts: true
  }, { quoted: m });

  try {
    const searchResults = await searchVideos(args.join(" "));
    if (!searchResults.length) {
      throw new Error('No se encontraron resultados. Intenta con otro título.');
    }

    const video = searchResults[0];
    const thumbnail = await (await fetch(video.thumbnail)).buffer();
    const messageText = formatMessageText(video);

    const sections = searchResults.map(video => ({
      title: `🎬 ${video.title}`,
      rows: [
        {
          header: 'Audio (MP3)',
          title: '🎵 Descargar como Audio',
          description: 'Calidad buena, formato MP3',
          id: `${usedPrefix}ytmp3 ${video.url}`
        },
        {
          header: 'Video (MP4)',
          title: '🎥 Descargar como Video',
          description: 'Calidad estándar, formato MP4',
          id: `${usedPrefix}ytmp4 ${video.url}`
        },
        {
          header: 'Audio Documento',
          title: '🗂️ MP3 como Documento',
          description: 'Ideal para reenviar sin compresión',
          id: `${usedPrefix}ytmp3doc ${video.url}`
        }
      ]
    }));

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: messageText,
      footer: '✦ Codigo Editado por: Wirk ✦',
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      },
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '✨ Selecciona un formato de descarga:',
            sections
          })
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('✖️');
    conn.reply(m.chat, '*`Hubo un error al buscar el video.`*', m);
  }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];

export default handler;

// Buscar videos en YouTube
async function searchVideos(query) {
  try {
    const res = await yts(query);
    return res.videos.slice(0, 10).map(video => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      author: { name: video.author.name },
      published: video.timestamp || 'No disponible',
      views: video.views || 'No disponible',
      duration: video.duration.timestamp || 'No disponible'
    }));
  } catch (error) {
    console.error('Error en yt-search:', error.message);
    return [];
  }
}

// Formatear mensaje principal
function formatMessageText(video) {
  let messageText = `*🍌 Resultado de búsqueda para:* ${video.title}\n\n`;
  messageText += `⌛ *Duración:* ${video.duration || 'No disponible'}\n`;
  messageText += `📺 *Canal:* ${video.author.name || 'Desconocido'}\n`;
  messageText += `📅 *Publicado:* ${convertTimeToSpanish(video.published)}\n`;
  messageText += `👁️ *Vistas:* ${video.views || 'No disponible'}\n`;
  messageText += `🔗 *Enlace:* ${video.url}\n`;
  return messageText;
}

// Convertir texto de tiempo al español
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
