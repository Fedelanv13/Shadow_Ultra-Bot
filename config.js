import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

global.owner = [
   ['5491156178758', '𝘧𝘦𝘥𝘦𝘭𝘢𝘯𝘠𝘛 ‍', true],
   ['13124976342', 'Josue', true],
   ['5491126852241', 'fede', true]
]

global.creadorbot = [
   ['5491156178758', '𝘧𝘦𝘥𝘦𝘭𝘢𝘯𝘠𝘛 ‍', true]
]

global.mods = ['51990841568', '51965911060']
global.prems = ['51965911060']


global.packname = 'ShadowUtra'
global.botname = '(✦◠‿◠)ShadowBot-Bot'
global.wm = '⏤͟͟͞͞⋆⬪࣪ꥈ☕★ ׄ ꒱ Shadow ୭'
global.author = 'Edited By 𝘧𝘦𝘥𝘦𝘭𝘢𝘯𝘠𝘛'
global.dev = '© Powered by 𝘧𝘦𝘥𝘦𝘭𝘢𝘯𝘠𝘛'
global.errorm = 'Error: ${error.message}'
global.nombrebot = '💙𝖲𝗁ᥲძ᥆𝗐 𝖴ᥣ𝗍𝗋ᥲ 𝐁𝐨𝐭💙'
global.textbot = `┊ꦿ🎄⿻ 𝖲𝗁ᥲძ᥆𝗐 𝖴ᥣ𝗍𝗋ᥲ 𝐁𝐨𝐭 ❜ೃ`
global.vs = '3.0.0'


global.imagen1 = fs.readFileSync('./media/menus/Menu.jpg')
global.imagen2 = fs.readFileSync('./media/menus/Menu2.jpg')
global.imagen3 = fs.readFileSync('./media/menus/Menu3.jpg')
global.welcome = fs.readFileSync('./media/welcome.jpg')
global.adios = fs.readFileSync('./media/adios.jpg')
global.catalogo = fs.readFileSync('./media/catalogo.jpg')
global.shadowurl = fs.readFileSync('./media/shadowurl.jpg')


global.repobot = 'https://github.com/CrxstianEscobar/ShadowUltra-MD'
global.grupo = 'https://chat.whatsapp.com/FCS6htvAmlT7nq006lxU4I'
global.comu = 'https://chat.whatsapp.com/Kn1pPVAO08pFRo7qJnKuh6'
global.channel = 'https://whatsapp.com/channel/0029VauTE8AHltY1muYir31n'
global.insta = 'https://www.instagram.com/shadowbot.md'


global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "543876577197-120363317332020195@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: 'MOONFORCE 乂 TEAM', orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}


global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment        


global.multiplier = 69 
global.maxwarn = '3'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
