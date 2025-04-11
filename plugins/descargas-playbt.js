import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '✏️ *Por favor ingresa un título de YouTube para buscar.*\n\n*Ejemplo:* \n> *Corazón Serrano - Mix Poco Yo*', m);
  }

  await m.react('🔍');

  await conn.sendMessage(m.chat, {
    text: '⏳ *Buscando el mejor resultado para ti...*',
    tts: true
  }, { quoted: m });

  try {
    const searchResults = await searchVideos(args.join(" "));

    if (!searchResults.length) throw new Error('No se encontraron resultados.');

    const video = searchResults[0];
    const thumbnail = await (await fetch(video.thumbnail)).buffer();

    const messageText = formatMessageText(video);

    // Mezclar sugerencias aleatorias
    const shuffledSuggestions = shuffleArray(searchResults.slice(1)).slice(0, 5);
    const relatedVideos = shuffledSuggestions
      .map((v, i) => `   ${i + 1}. ✰ ${fancyText(v.title)}`)
      .join('\n');

    // Tendencias aleatorias
    const tendencias = shuffleArray([
      '🎤 Peso Pluma - La Durango',
      '🎶 Bad Bunny - Oasis 2',
      '🌕 Karol G - Luna Llena',
      '🔥 Feid - Fumeteo 3000',
      '⚡ Rauw Alejandro - Eclipse',
      '🎧 Bizarrap Music Sessions #63',
      '⭐ Young Miko - Alienígena',
      '🌍 J Balvin - Mundo Real',
      '🌀 Trueno - La Resistencia',
      '🚀 Quevedo - El Último Rayo'
    ]).slice(0, 3).map((t, i) => `   ${i + 1}. ✰ ${fancyText(t)}`).join('\n');

    const fullMessage = `╭─〘 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝘼𝘿𝙊 〙─╮\n${messageText}\n╰────────────────────╯\n\n` +
                        `╭───⊷ *🔎 Sugerencias Relacionadas:*\n${relatedVideos}\n╰──────────────╯\n\n` +
                        `╭───⊷ *🎶 Tendencias 𝟐𝟎𝟐𝟓:*\n${tendencias}\n╰──────────────╯`;

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: fullMessage,
      footer: `🧠 Bot editado por Wirk | Mejora continua...`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
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

// Función de búsqueda YouTube
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

// Formateo visual
function formatMessageText(video) {
  return `\n*╭📺 Título:* 『 ${video.title} 』\n` +
         `*├⏱ Duración:* ${video.duration || 'No disponible'}\n` +
         `*├👤 Canal:* ${video.channel || 'Desconocido'}\n` +
         `*├🕒 Publicado:* ${convertTimeToSpanish(video.published)}\n` +
         `*├👁 Vistas:* ${video.views || 'No disponible'}\n` +
         `*╰🌐 Enlace:* ${video.url}`;
}

// Botones decorativos
function generateButtons(video, usedPrefix) {
  return [
    {
      buttonId: `${usedPrefix}ytmp3 ${video.url}`,
      buttonText: { displayText: '🎧 Descargar MP3' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}ytmp4 ${video.url}`,
      buttonText: { displayText: '🎬 Descargar MP4' },
      type: 1
    }
  ];
}

// Traducir fechas
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

// Array aleatorio
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Fancy font para sugerencias/tendencias
const fancyAlphabet = {
  a: 'ᥲ', b: 'ᑲ', c: 'ᥴ', d: 'ძ', e: 'ᥱ', f: '𝖿', g: 'ց', h: 'һ',
  i: 'і', j: 'ȷ', k: 'ƙ', l: 'ᥣ', m: '𝖒', n: 'ᥙ', o: '𝖔', p: 'ρ',
  q: '𝗊', r: '𝗋', s: '𝗌', t: '𝗍', u: '𝗎', v: '𝗏', w: '𝗐', x: '𝗑',
  y: '𝗒', z: '𝗓',
  A: 'ᗩ', B: 'ᗷ', C: 'ᑕ', D: 'ᗪ', E: 'ᕮ', F: 'ᖴ', G: 'ᘜ', H: 'ᕼ',
  I: 'ᘐ', J: 'ᒍ', K: 'K', L: 'ᒪ', M: 'ᗰ', N: 'ᑎ', O: 'O', P: 'ᑭ',
  Q: 'ᑫ', R: 'ᖇ', S: 'ᔕ', T: 'T', U: 'ᑌ', V: 'ᐯ', W: 'ᗯ', X: '᙭',
  Y: 'Y', Z: 'ᘔ'
};

function fancyText(text) {
  return text.split('').map(c => fancyAlphabet[c] || c).join('');
}
