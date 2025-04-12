import yts from 'yt-search';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) return m.reply(`✏️ *Escribe el título de una canción o video de YouTube.*\n\n*Ejemplo:* ${usedPrefix}play Mix de Bad Bunny`);

  await m.react('🔍');
  m.reply(`⏱️ *Buscando en YouTube...*`);

  try {
    const results = await searchYouTube(args.join(' '));
    if (!results.length) throw 'No se encontró ningún video.';

    const video = results[0];
    const mensaje = `*🎬 Título:* ${video.title}\n*⏱ Duración:* ${video.duration}\n*📺 Canal:* ${video.channel}\n*🌐 Enlace:* ${video.url}`;

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: mensaje,
      buttons: [
        { buttonId: `${usedPrefix}ytmp3doc ${video.url}`, buttonText: { displayText: '🎧 MP3DOC 📓' }, type: 1 },
        { buttonId: `${usedPrefix}ytmp4doc ${video.url}`, buttonText: { displayText: '🎬 MP4DOC 🌻' }, type: 1 }
      ],
      footer: 'ShadowBot Ultra',
      viewOnce: true
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ *No se pudo obtener resultados. Intenta con otro título.*');
  }
};

handler.help = ['play2'];
handler.tags = ['descargas'];
handler.command = ['play2'];

export default handler;

async function searchYouTube(query) {
  const res = await yts(query);
  return res.videos.slice(0, 5).map(video => ({
    title: video.title,
    url: video.url,
    thumbnail: video.thumbnail,
    channel: video.author.name,
    duration: video.timestamp || 'Desconocida'
  }));
}