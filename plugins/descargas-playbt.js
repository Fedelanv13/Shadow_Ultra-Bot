import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '✏️ *Por favor ingresa un título de YouTube para buscar.*\nEjemplo:\n> *Corazón Serrano - Mix Poco Yo*', m);
  }

  await m.react('🔍');  // Reacción de búsqueda

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
    
    // Lógica para sugerir videos relacionados automáticamente
    const relatedVideos = searchResults.slice(1, 3).map((video, index) => `🎶 ${video.title}`).join('\n');

    const messageWithSuggestions = `${messageText}\n\n🔍 *Sugerencias relacionadas:* \n${relatedVideos || 'No hay sugerencias.'}`;

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: messageWithSuggestions,
      footer: `✨ Bot editado por: Wirk - ¡Tu bot personalizado!`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 500,
        isForwarded: true
      },
      buttons: generateButtons(video, usedPrefix),
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    // Sistema de logros:
    const user = global.db.data.users[m.sender];
    let achievedLogros = user.achievements || [];

    // Logros por búsqueda
    if (!user.hasSearched) {
      user.hasSearched = true;
      achievedLogros.push('🏆 Logro desbloqueado: Primera Búsqueda');
    }

    // Logros por interacción con botones
    if (!user.hasPressedButton) {
      user.hasPressedButton = true;
      achievedLogros.push('🎉 Logro desbloqueado: Primera Interacción con Botones');
    }

    // Logros por realizar ciertas actividades
    const logrosExtra = [
      '🔍 Logro desbloqueado: Buscar más de 3 videos',
      '📂 Logro desbloqueado: Guardar tu primer video',
      '🎥 Logro desbloqueado: Descargar tu primer video',
      '🎧 Logro desbloqueado: Escuchar música más de 5 veces',
      '🌍 Logro desbloqueado: Buscar música internacional'
      // Aquí puedes seguir agregando logros personalizados.
    ];

    // Añadir estos logros al usuario
    achievedLogros.push(...logrosExtra);

    // Actualiza los logros
    user.achievements = achievedLogros;

    // Enviar los logros al usuario
    const achievementsMessage = `🎉 ¡Felicidades! Has desbloqueado los siguientes logros:\n\n${achievedLogros.join('\n')}`;
    conn.reply(m.chat, achievementsMessage, m);

    await m.react('✅');  // Reacción de éxito

  } catch (e) {
    console.error(e);
    await m.react('❌');  // Reacción de error
    conn.reply(m.chat, '*❗ Ocurrió un error al buscar el video.*', m);
  }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];

export default handler;

// Función para realizar la búsqueda de videos en YouTube
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

// Función para formatear el texto del mensaje con los detalles del video
function formatMessageText(video) {
  return `🎶 *RESULTADO ENCONTRADO*\n\n` +
         `*• Título:* ${video.title}\n` +
         `*• Duración:* ${video.duration || 'No disponible'}\n` +
         `*• Canal:* ${video.channel || 'Desconocido'}\n` +
         `*• Publicado:* ${convertTimeToSpanish(video.published)}\n` +
         `*• Vistas:* ${video.views || 'No disponible'}\n\n` +
         `🌐 *Enlace:* ${video.url}`;
}

// Función para generar los botones de interacción
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

// Función para convertir el tiempo de publicación a español
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
