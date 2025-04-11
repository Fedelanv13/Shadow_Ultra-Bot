import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys'; import yts from 'yt-search'; import fs from 'fs'; import { format } from 'date-fns'; import { es } from 'date-fns/locale';

const handler = async (m, { conn, text, usedPrefix: prefijo }) => { const device = await getDevice(m.key.id);

if (!text) return conn.reply(m.chat, '🤍 Ingresa el nombre de una canción de YouTube.', m);

const results = await yts(text);
const videos = results.videos.slice(0, 20);

if (device !== 'desktop' && device !== 'web') {
    const video = videos[Math.floor(Math.random() * videos.length)];
    const messa = await prepareWAMessageMedia({ image: { url: video.thumbnail }}, { upload: conn.waUploadToServer });

    const interactiveMessage = {
        body: {
            text: `▶️ *YT: ${video.title}*

⏱️ Duración: ${video.duration.timestamp} 🎙️ Autor: ${video.author.name} 📅 Publicado: ${video.ago} 🔗 Enlace: ${video.url}}, footer: { text: '✦ Código editado por Wirk' }, header: { hasMediaAttachment: true, imageMessage: messa.imageMessage }, nativeFlowMessage: { buttons: [ { name: 'single_select', buttonParamsJson: JSON.stringify({ title: '✨ Elige una opción de descarga:', sections: videos.map((v) => ({ title: v.title, rows: [ { header: v.title, title: v.author.name, description: 'MP3 - Solo Audio', id:${prefijo}ytmp3 ${v.url}}, { header: v.title, title: v.author.name, description: 'MP4 - Solo Video', id:${prefijo}ytmp4 ${v.url}}, { header: v.title, title: v.author.name, description: 'Documento MP3', id:${prefijo}ytmp3doc ${v.url}` } ] })) }) } ], messageParamsJson: '' } };

let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: { message: { interactiveMessage } }
    }, { userJid: conn.user.jid, quoted: null });

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

} else {
    const idioma = global.db.data.users[m.sender].language;
    const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`));
    const traductor = _translate.plugins.buscador_yts;

    const list = results.all.filter(v => v.type === 'video').map(v => {
        return `*${v.title}*

🔗 ${v.url} ⏱️ ${v.timestamp} 📅 ${v.ago} 👁️ ${v.views}`; }).join('\n\n──────────────\n\n');

conn.sendFile(m.chat, results.all[0].thumbnail, 'thumb.jpg', list.trim(), m);
}

};

handler.help = ['play <nombre>']; handler.tags = ['descargas']; handler.command = ['play']; handler.register = true;

export default handler;

