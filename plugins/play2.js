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
  throw new Error("No se pudo obtener el video después de varios intentos.");
};

// Handler principal
let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) return;

  try {
    // Reaccionar al mensaje inicial con 🕒
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar en YouTube
    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Obtener datos de descarga (debe ser el enlace directo del video)
    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);
    const videoUrl = apiData?.download?.url;
    if (!videoUrl) throw new Error("No se pudo obtener la URL de descarga del video.");

    // Enviar el video
    const videoMessage = {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: `${video.title}.mp4`,
    };

    await conn.sendMessage(m.chat, videoMessage, { quoted: m });

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
