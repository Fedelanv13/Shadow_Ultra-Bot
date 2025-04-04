import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '✧ Ingresa el nombre de la música a descargar.', m);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    if (!videoInfo) {
      return m.reply('No se pudo obtener información del video.');
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    if (!title || !thumbnail || !timestamp || !views || !ago || !url || !author) {
      return m.reply('Información incompleta del video.');
    }

    const vistas = formatViews(views);
    const canal = author.name ? author.name : 'Desconocido';

    const thumb = (await conn.getFile(thumbnail))?.data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    if (command === 'play2' || command === 'mp4' || command === 'playvideo') {
      try {
        const response = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`);
        const json = await response.json();
        const resultado = json.result?.download.url;

        if (!resultado) throw new Error('El enlace de video no se generó correctamente.');

        await conn.sendMessage(m.chat, { video: { url: resultado }, fileName: json.result.title, mimetype: 'video/mp4', caption: dev }, { quoted: m });
      } catch (e) {
        console.error('Error al enviar el video:', e.message);
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Intenta nuevamente más tarde.', m);
      }
    } else {
      return conn.reply(m.chat, '⚠︎ Comando no reconocido.', m);
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`);
  }
};

handler.command = handler.help = ['play2', 'mp4', 'playvideo'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (views === undefined) { return "No disponible"; }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  }
  return views.toString();
}
