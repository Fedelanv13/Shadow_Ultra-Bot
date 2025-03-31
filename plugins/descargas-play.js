import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, '*[ ℹ️ ] Ingresa un título de Youtube.*\n\n*[ 💡 ] Ejemplo:* Corazón Serrano - Mix Poco Yo', m);

    await m.react('🔍');
    try {
        const searchResults = await searchVideos(args.join(" "));
        
        if (searchResults.length === 0) throw new Error('No se encontraron resultados.');

        const video = searchResults[0];
        const thumbnail = await (await fetch(video.miniatura)).buffer();

        const messageText = formatMessage(video);

        const buttons = [
            {
                buttonId: `${usedPrefix}ytmp3 ${video.url}`,
                buttonText: { displayText: '🎶 Audio' },
                type: 1
            },
            {
                buttonId: `${usedPrefix}tmp4 ${video.url}`,
                buttonText: { displayText: '🎥 Vídeo' },
                type: 1
            }
        ];

        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: messageText,
            footer: dev,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 0,
                isForwarded: true
            },
            buttons,
            headerType: 1,
            viewOnce: true
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        conn.reply(m.chat, '*`Error al buscar el video.`*', m);
    }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play', 'lay'];
handler.customPrefix = /p|@|./i;

handler.before = async (m, { conn }) => {
    const text = m.text?.toLowerCase()?.trim();
    if (['play', 'hd'].includes(text)) {
        return handler(m, { conn });
    }
};

export default handler;

async function searchVideos(query) {
    try {
        const res = await yts(query);
        return res.videos.slice(0, 10).map(video => ({
            titulo: video.title,
            url: video.url,
            miniatura: video.thumbnail,
            canal: video.author.name,
            publicado: video.timestamp || 'No disponible',
            vistas: video.views || 'No disponible',
            duracion: video.duration.timestamp || 'No disponible'
        }));
    } catch (error) {
        console.error('Error en yt-search:', error.message);
        return [];
    }
}

function formatMessage(video) {
    let message = `🔹 *DESCARGAS - PLAY* 🔹\n\n`;
    message += `${video.titulo}\n\n`;
    message += `*⌛ Duración:* ${video.duracion || 'No disponible'}\n`;
    message += `*👤 Autor:* ${video.canal || 'Desconocido'}\n`;
    message += `*📆 Publicado:* ${convertTimeToSpanish(video.publicado)}\n`;
    message += `*🖇️ Url:* ${video.url}\n`;
    return message;
}

function convertTimeToSpanish(timeText) {
    return timeText
        .replace(/year/, 'año').replace(/years/, 'años')
        .replace(/month/, 'mes').replace(/months/, 'meses')
        .replace(/day/, 'día').replace(/days/, 'días')
        .replace(/hour/, 'hora').replace(/hours/, 'horas')
        .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
}
