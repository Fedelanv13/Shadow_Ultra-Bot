
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { fileTypeFromBuffer } from 'file-type'

let handler = async (m, { conn }) => {
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    if (!mime) return m.reply('Responde a un archivo/imagen/video para subirlo a la web')
    
    m.reply('⌛ Cargando archivo a la web...')
    
    let media = await quoted.download()
    let { ext, mime: fileMime } = await fileTypeFromBuffer(media) || {}
    
    try {
        let link = ''
        if (mime.startsWith('image/')) {
            link = await uploadImage(media)
        } else {
            link = await uploadFile(media)
        }
        m.reply(`✅ Archivo subido exitosamente!\n\n📎 Link: ${link}`)
    } catch (e) {
        console.error(e)
        m.reply('❌ Error al subir el archivo')
    }
}

handler.help = ['subir']
handler.tags = ['herramientas']
handler.command = /^(subir)$/i

export default handler
