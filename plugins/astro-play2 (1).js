import fetch from "node-fetch"; import yts from "yt-search";

const encodedApiUrl = "aHR0cHM6Ly9hcGkuYWdhdHoueHl6L2FwaS95dG1wNA=="; const officialBrand = "©Prohibido La Copia, Código Oficial De MediaHub™";

const verifyBrand = () => { const brand = "©Prohibido La Copia, Código Oficial De MediaHub™"; if (brand !== officialBrand) { throw new Error("❌ ERROR CRÍTICO: La marca oficial de MediaHub ha sido alterada. Restáurela para continuar usando el código."); } };

const fetchWithRetries = async (url, maxRetries = 2, timeout = 60000) => { let attempt = 0; while (attempt <= maxRetries) { try { const controller = new AbortController(); const timeoutId = setTimeout(() => controller.abort(), timeout);

const response = await fetch(url, { signal: controller.signal });  
  const data = await response.json();  

  clearTimeout(timeoutId);

  if (data && data.status === 200 && data.data && data.data.downloadUrl) {  
    return data.data;
  }  
} catch (error) {  
  console.error(`Error en el intento ${attempt + 1}:`, error.message);
  if (error.name === "AbortError") {  
    console.error("La solicitud fue cancelada debido al tiempo de espera.");  
  }  
}  
attempt++;

} throw new Error("No se pudo obtener una respuesta válida después de varios intentos."); };

let handler = async (m, { conn, text, usedPrefix, command }) => { try { verifyBrand();

if (!text) {
  const example =
    command === "ytmp4"
      ? `${usedPrefix}${command} https://youtu.be/URL_DEL_VIDEO`
      : `${usedPrefix}${command} Never Gonna Give You Up`;

  return conn.sendMessage(m.chat, {
    text: `⚠️ *¡Atención!*
    💡 *Por favor ingresa ${command === "play2" ? "un término de búsqueda" : "una URL válida de YouTube"}.*
    📌 *Ejemplo:* ${example}`,
  });
}

const searchResults = await yts(text);
const video = searchResults.videos[0];

if (!video) {
  return conn.sendMessage(m.chat, {
    text: `❌ *No se encontraron resultados para:* ${text}`,
  });
}

const { title, url: videoUrl, timestamp, views, ago, image } = video;
const apiUrl = `${Buffer.from(encodedApiUrl, "base64").toString("utf-8")}?url=${encodeURIComponent(videoUrl)}`;
const apiData = await fetchWithRetries(apiUrl, 2, 60000);
const { title: apiTitle, downloadUrl } = apiData;

await conn.sendMessage(m.chat, {
  image: { url: image },
  caption: `🎥 *Video Encontrado:* ${apiTitle}`,
});

await conn.sendMessage(m.chat, {
  video: { url: downloadUrl },
  mimetype: "video/mp4",
  fileName: apiTitle || `${title}.mp4`,
  caption: `🎥 *Video Descargado:*\n🎵 *Título:* ${apiTitle}`,
}, { quoted: m });

} catch (error) { console.error("Error:", error); conn.sendMessage(m.chat, { text: ❌ *Error crítico detectado:*\n${error.message || "Error desconocido."}, }); } };

handler.command = handler.help = ['ytmp4', 'play2', 'mp4']; handler.tags = ['downloader']; export default handler;

