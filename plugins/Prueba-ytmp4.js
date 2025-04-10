import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno de la lista disponible.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    };

    try {
      const response = await axios.request(config);
      if (response.data?.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, title, image: info.image, downloadUrl };
      } else {
        throw new Error("⛔ No se pudo obtener los detalles del video.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Verificar si el texto es un enlace de YouTube
    const isLink = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/.+$/.test(text.trim());
    let videoInfo;
    
    if (isLink) {
      // Si es un enlace, no hacer búsqueda, solo proceder con la descarga
      const url = text.trim();
      const search = await yts(url); // Usamos el link directamente para obtener la info

      if (!search.all.length) {
        return m.reply("⚠ No se encontraron resultados para el enlace proporcionado.");
      }

      videoInfo = search.all[0]; // Tomamos el primer resultado de la búsqueda
    } else {
      // Si no es un enlace, proceder a buscar como normalmente se hacía
      const search = await yts(text);
      if (!search.all.length) {
        return m.reply("⚠ No se encontraron resultados para tu búsqueda.");
      }
      videoInfo = search.all[0]; // Tomamos el primer resultado de la búsqueda
    }

    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    // Reacción de carga mientras se busca y descarga
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      await conn.sendMessage(m.chat, { audio: { url: api.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: fkontak });

    } else if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: "📓 Aquí tienes tu video descargado por *ShadowUltra* 👻",
              thumbnail: thumb
            }, { quoted: fkontak });
            break;
          }
        } catch (e) {
          console.error(`⚠ Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply("⛔ *Error:* No se encontró un enlace de descarga válido.");
      }
    } else {
      throw "❌ Comando no reconocido.";
    }

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);
    return m.reply(`⚠ Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ["ytmp4", "ytv"];
handler.tags = ["downloader"];

export default handler;

function formatViews(views) {
  return views >= 1000 ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")" : views.toString();
  }
