import fetch from "node-fetch";
import yts from "yt-search";

// API en formato Base64
const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";

// Función para decodificar la URL de la API
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");

// Función para obtener datos de la API con reintentos
const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data.result?.download?.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  throw new Error("No se pudo obtener la música después de varios intentos.");
};

// Handler principal
let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) return;

  try {
    // Reaccionar al mensaje inicial con una reacción profesional
    await conn.sendMessage(m.chat, { react: { text: "🔄", key: m.key } });

    // Buscar en YouTube
    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Enviar mensaje de espera con el título, la imagen del video y un mensaje profesional
    await conn.sendMessage(m.chat, {
      text: `*Solicitud en progreso...* ⏳\n\n*Descargando el audio de:* \n\n\`\`\`🎧 ${video.title}\`\`\`\n\n*Por favor, espera mientras preparamos el archivo.*\n\n_Imagen del video:_`,
      image: { url: video.thumbnail },
      quoted: m
    });

    // Obtener datos de descarga de forma asíncrona
    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Enviar el audio inmediatamente después de obtener la URL de descarga
    const audioMessage = {
      audio: { url: apiData.download.url },
      mimetype: "audio/mpeg", ptt: true,
      fileName: `${video.title}.mp3`,
    };

    // Enviar el audio
    await conn.sendMessage(m.chat, audioMessage, { quoted: m });

    // Reaccionar con una confirmación profesional
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);

    // Reaccionar con un error profesional
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

handler.command = ['play', 'mp3', 'playaudio'];
handler.help = ['play'];
handler.tags = ['play'];

export default handler;
