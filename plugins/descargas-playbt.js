import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, '*[ ℹ️ ] Ingresa un título de Youtube.*\n\n*[ 💡 ] Ejemplo:* Corazón Serrano - Mix Poco Yo', m);

    await m.react('🕓');
    try {
        let searchResults = await searchVideos(args.join(" "));

        if (!searchResults.length) throw new Error('No se encontraron resultados.');

        let video = searchResults[0];
        let thumbnail = await (await fetch(video.miniatura)).buffer();

        let messageText = `\`DESCARGAS - PLAY\`\n\n`;
        messageText += `${video.titulo}\n\n`;
        messageText += `*⌛ Duración:* ${video.duracion || 'No disponible'}\n`;
        messageText += `*👤 Autor:* ${video.canal || 'Desconocido'}\n`;
        messageText += `*📆 Publicado:* ${convertTimeToSpanish(video.publicado)}\n`;
        messageText += `*🖇️ Url:* ${video.url}\n`;
        messageText += `\n*Responde con "Audio" si lo quieres como audio o responde con "Video" si lo quieres en video.*`;

        // Enviar la miniatura y detalles
        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: messageText,
            footer: 'Dev',
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            },
        }, { quoted: m });

        // Esperar respuesta del usuario y ejecutar el comando correspondiente
        const filter = (response) => response.key.remoteJid === m.chat && /^(audio|video)$/i.test(response.text);
        const collected = await m.waitForMessage(filter, { timeout: 30000 });

        if (collected) {
            const response = collected.text.toLowerCase();

            // Si el usuario responde con 'audio', ejecutar el comando ytmp3
            if (response === 'audio') {
                await conn.reply(m.chat, `${usedPrefix}ytmp3 ${video.url}`, m);
                await m.react('✅');
            }

            // Si el usuario responde con 'video', ejecutar el comando ytmp4
            if (response === 'video') {
                await conn.reply(m.chat, `${usedPrefix}ytmp4 ${video.url}`, m);
                await m.react('✅');
            }
        } else {
            await conn.reply(m.chat, '*[ ✋ ] No se recibió respuesta a tiempo. Intenta de nuevo.*', m);
            await m.react('✖️');
        }
    } catch (e) {
        console.error(e);
        await m.react('✖️');
        conn.reply(m.chat, '*`Error al buscar el video.`*', m);
    }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];
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

function convertTimeToSpanish(timeText) {
    return timeText
        .replace(/year/, 'año').replace(/years/, 'años')
        .replace(/month/, 'mes').replace(/months/, 'meses')
        .replace(/day/, 'día').replace(/days/, 'días')
        .replace(/hour/, 'hora').replace(/hours/, 'horas')
        .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
}