import fetch from 'node-fetch';
import yts from 'yt-search';

// API para obtener el enlace de descarga en MP4
const mp4ApiUrl = "https://api.vreden.my.id/api/ytmp4?url=";

// Función para obtener el enlace de descarga MP4
const getDownloadLink = async (videoUrl) => {
  const response = await fetch(`${mp4ApiUrl}${encodeURIComponent(videoUrl)}`);
  const data = await response.json();
  if (data.status === "success" && data.result?.video?.url) {
    return data.result.video.url; // Aquí obtenemos el enlace directo de descarga MP4
  }
  throw new Error("No se pudo obtener el enlace de descarga del video.");
};

let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) return;

  try {
    // Reaccionar al mensaje inicial con 🕒
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar en YouTube
    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Obtener el enlace de descarga MP4
    const videoUrl = video.url;
    const downloadLink = await getDownloadLink(videoUrl);
    if (!downloadLink) throw new Error("No se pudo obtener el enlace de descarga del video.");

    // Enviar el video
    await conn.sendMessage(m.chat, {
      video: { url: downloadLink },
      mimetype: "video/mp4",
      fileName: `${video.title}.mp4`,
    }, { quoted: m });

    // Reaccionar al mensaje original con ✅
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);

    // Reaccionar al mensaje original con ❌
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

// Cambia el Regex para que reconozca ".play2"
handler.command = ['play2'];
handler.help = ['play2'];
handler.tags = ['play'];

export default handler;
