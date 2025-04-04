import fetch from 'node-fetch';
import yts from 'yt-search';

// URL de la API para obtener el video en MP4
const mp4ApiUrl = "https://api.vreden.my.id/api/ytmp4?url=";

// Función para obtener el enlace de descarga del video en MP4
const getVideoDownloadLink = async (url) => {
  try {
    const response = await fetch(`${mp4ApiUrl}${encodeURIComponent(url)}`);
    const data = await response.json();
    if (data.status === 'success' && data.result?.video?.url) {
      return data.result.video.url; // Enlace directo al video MP4
    }
    throw new Error('No se pudo obtener el enlace de descarga.');
  } catch (error) {
    console.error('Error obteniendo el enlace de descarga:', error);
    throw error;
  }
};

let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) {
    return conn.sendMessage(m.chat, {
      text: "❗ *Ingresa un término de búsqueda para encontrar el video.*\n\n*Ejemplo:* `.play2 Despacito`",
    });
  }

  try {
    // Reaccionar al mensaje inicial con 🕒
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar el video en YouTube
    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) {
      throw new Error('No se encontraron resultados.');
    }

    // Obtener el enlace de descarga MP4 utilizando la API
    const downloadLink = await getVideoDownloadLink(video.url);
    if (!downloadLink) {
      throw new Error('No se pudo obtener el enlace de descarga del video.');
    }

    // Enviar el video utilizando el enlace MP4
    await conn.sendMessage(m.chat, {
      video: { url: downloadLink },
      mimetype: 'video/mp4',
      fileName: `${video.title}.mp4`,
    }, { quoted: m });

    // Reaccionar al mensaje original con ✅
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);

    // Reaccionar al mensaje original con ❌
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

// Cambiar el comando a "play2"
handler.command = ['play2'];
handler.help = ['play2'];
handler.tags = ['play'];

export default handler;
