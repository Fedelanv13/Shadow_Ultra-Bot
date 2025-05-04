const handler = async (m, { conn }) => {
  const texto = `
╭─〔 *🌐 GRUPOS OFICIALES* 〕─╮

📌 *Grupo Principal:*
https://chat.whatsapp.com/GYTJqKhf6z1HBsyyidsBUs

📌 *Grupo Secundario:*
https://chat.whatsapp.com/L6Aiv7yk9YNEcmgGn4Sw7u

╰───────────────────────╯

╭─〔 *📣 CANALES * 〕─╮

✨ https://whatsapp.com/channel/0029Vb5oaHFCBtxIGWefdp0n  
✨ https://whatsapp.com/channel/0029Vb5oaHFCBtxIGWefdp0n

╰──────────────────────────╯

╭─〔 *🤝 CANAL AMIGO* 〕─╮

❤️ https://whatsapp.com/channel/0029Vb5oaHFCBtxIGWefdp0n

╰──────────────────────╯
`.trim();

  conn.reply(m.chat, texto, m);
};

handler.help = ['grupos'];
handler.tags = ['info'];
handler.command = ['grupos', 'info'];

export default handler;
