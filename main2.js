const fs = require("fs");
const chalk = require("chalk");
const { isOwner, setPrefix, allowedPrefixes } = require("./config");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const os = require("os");
const path = require("path");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExif,
  toAudio,
} = require("./libs/fuctions");

const rpgFile = "./rpg.json";
if (!fs.existsSync(rpgFile)) {
  const rpgDataInicial = {
    usuarios: {},
    tiendaMascotas: [],
    tiendaPersonajes: [],
    mercadoPersonajes: [],
  };
  fs.writeFileSync(rpgFile, JSON.stringify(rpgDataInicial, null, 2));
}
let rpgData = JSON.parse(fs.readFileSync(rpgFile, "utf-8"));
function saveRpgData() {
  fs.writeFileSync(rpgFile, JSON.stringify(rpgData, null, 2));
}

const configFilePath = "./config.json";
function loadPrefix() {
  if (fs.existsSync(configFilePath)) {
    let configData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    global.prefix = configData.prefix || ".";
  } else {
    global.prefix = ".";
  }
}
loadPrefix();
console.log(`📌 Prefijo actual: ${global.prefix}`);

function isValidPrefix(prefix) {
  return (
    typeof prefix === "string" &&
    (prefix.length === 1 || (prefix.length > 1 && [...prefix].length === 1))
  );
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function loadPlugins() {
  const plugins = [];
  const pluginDir = path.join(__dirname, "plugins");
  if (!fs.existsSync(pluginDir)) return plugins;

  const files = fs.readdirSync(pluginDir).filter((f) => f.endsWith(".js"));
  for (const file of files) {
    const plugin = require(path.join(pluginDir, file));
    if (plugin && plugin.command) plugins.push(plugin);
  }
  return plugins;
}

const plugins = loadPlugins();

async function handleCommand(sock, msg, command, args, sender) {
  const lowerCommand = command.toLowerCase();
  const text = args.join(" ");
  global.viewonce = true;

  sock.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?;base64,/i.test(path)
      ? Buffer.from(path.split(",")[1], "base64")
      : /^https?:\/\//.test(path)
      ? await (await getBuffer(path))
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }

    await sock.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      {
        quoted: quoted ? quoted : msg,
        ephemeralExpiration: 24 * 60 * 1000,
        disappearingMessagesInChat: 24 * 60 * 1000,
      }
    );
    return buffer;
  };

  const plugin = plugins.find((p) => p.command.includes(lowerCommand));
  if (plugin) {
    return plugin(msg, {
      conn: sock,
      text,
      args,
      command: lowerCommand,
      usedPrefix: global.prefix,
    });
  }
}

module.exports = { handleCommand, rpgData, saveRpgData };