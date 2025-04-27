
const handler = async (m, { conn, text }) => {
    if (!m.isGroup) {
        throw '⚠️ Este comando solo puede ser usado en grupos.';
    }
    
    // Verificar si es admin
    const isAdmin = m.isGroup ? await conn.groupAdmin(m.chat).includes(m.sender) : false;
    const isBotAdmin = m.isGroup ? await conn.groupAdmin(m.chat).includes(conn.user.jid) : false;
    
    if (!isAdmin) {
        throw '⚠️ Este comando solo puede ser usado por administradores.';
    }
    
    if (!isBotAdmin) {
        throw '⚠️ El bot necesita ser administrador para usar este comando.';
    }

    try {
        // Obtener todos los mensajes del chat
        const messages = await conn.loadAllMessages(m.chat);
        
        // Enviar mensaje de confirmación
        await m.reply('🗑️ Eliminando todos los mensajes del chat...');
        
        // Eliminar mensajes uno por uno
        for (const msg of messages) {
            if (msg.key.fromMe) {
                await conn.sendMessage(m.chat, { delete: msg.key });
            }
        }
        
        await m.reply('✅ Chat limpiado exitosamente.');
    } catch (error) {
        console.error(error);
        await m.reply('❌ Ocurrió un error al intentar limpiar el chat.');
    }
};

handler.help = ['.delall'];
handler.tags = ['tools'];
handler.command = /^(delall|clearall|limpiar)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
