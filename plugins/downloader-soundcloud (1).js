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
  if (!text || !text.trim()) {
    await conn.sendMessage(m.chat, { react: { text: "❓", key: m.key } });
    return conn.reply(m.chat, '*[ ℹ️ ] Ingresa el nombre de una rola.*\n\n*[ 💡 ] Ejemplo:* Tren al sur', m);
  }

  try {
    // Reacción inicial indicando que está en proceso
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar en YouTube de forma asincrónica
    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Obtener datos de descarga de forma asíncrona
    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Comprobamos que apiData tenga los datos necesarios
    console.log("Datos de API:", apiData);

    // Extraemos los datos de música
    const { name, albumname, artist, url, thumb, duration, download } = apiData;

    if (!download) throw new Error("No se encontró la URL de descarga.");

    // Validamos si la miniatura (thumb) es una URL válida
    let thumbnailUrl = thumb;
    if (typeof thumb !== 'string') {
      console.log("El valor de 'thumb' no es una URL válida. Usando una miniatura predeterminada.");
      thumbnailUrl = "https://via.placeholder.com/150"; // URL predeterminada si no es válida
    }

    // Creamos el objeto del mensaje para enviar, usando la URL de la miniatura validada
    const doc = {
      audio: { url: download },
      mimetype: 'audio/mp4',
      fileName: `${name}.mp3`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: url,
          title: name,
          sourceUrl: url,
          thumbnail: thumbnailUrl // Usamos la URL de la miniatura validada
        }
      }
    };

    // Enviamos el mensaje de audio
    await conn.sendMessage(m.chat, doc, { quoted: m });

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error al procesar el mensaje:", error);

    // Enviar un mensaje de error y reacción
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.reply(m.chat, `Ocurrió un error: ${error.message}`, m);
  }
};

handler.customPrefix = /au|A|m/i;
handler.command = ['dio', 'udio', 'usica', 'usic'];
handler.help = ['play'];
handler.tags = ['play'];

export default handler;
