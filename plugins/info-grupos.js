const handler = async (m, { conn }) => {
  const texto = `
╭───〘  *GRUPOS OFICIALES*  〙───╮
│ 
│ 1. *Grupo Principal:*
│ https://chat.whatsapp.com/FCS6htvAmlT7nq006lxU4I
│ 
│ 2. *Grupo Secundario:*
│ https://chat.whatsapp.com/If3WAOMJqZp2WLqDp9n4Cw
│
╰──────────────────────────────╯

╭───〘  *CANALES OFICIALES*  〙───╮
│ 
│ 1. https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f
│ 2. https://whatsapp.com/channel/0029VauTE8AHltY1muYir31n
│
╰──────────────────────────────╯

╭───〘  *CANAL AMIGO*  〙───╮
│ https://whatsapp.com/channel/0029Vb5UmxhFi8xetiTDal0f
╰────────────────────────╯
`.trim();

  conn.reply(m.chat, texto, m);
};

handler.help = ['grupos'];
handler.tags = ['info'];
handler.command = ['grupos', 'info'];

export default handler;