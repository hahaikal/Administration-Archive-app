const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { blue, green, cyan, red } = require('chalk');
const { createInterface } = require('readline');
const chalk = require('chalk');
const { handleIncomingMessage } = require('./services/whatsAppService');

const usePairingCode = true

async function qustion (quest) {
  process.stdout.write(quest)
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => rl.question('', (answer) => {
    rl.close()
    resolve(answer)
  }))
}

async function connectToWhatsApp () {
  console.log(blue('Connecting to WhatsApp...'))
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

  const bot = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    version: [2, 3000, 1015901307]
  })

  if (usePairingCode && !bot.authState.creds.registered) {
    console.log(green('Masukkan nomor dengan awal 62, contoh: 6281234567890'))
    const phoneNumber = await qustion('> ')
    const code = await bot.requestPairingCode(phoneNumber.trim())
    console.log(cyan('Pairing code: ' + code))
  }

  bot.ev.on('creds.update', saveCreds)

  bot.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error)?.output?.statusCode !== 401) {
        console.log(red('Connection closed. Reconnecting...'))
        connectToWhatsApp()
      } else {
        console.log(red('Connection closed. Please scan the QR code again.'))
      }
    } else if (connection === 'open') {
      console.log(green('Connected to WhatsApp!'))
    }
  })

  bot.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]
    if (!msg.message) return

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
    const sender = msg.key.remoteJid
    const pushname = msg.pushName || "Bot"

    console.log(
      chalk.green.bold('[' + new Date().toLocaleString() + '] '),
      chalk.blue(pushname),
      chalk.white('(' + sender.split('@')[0] + ')'),
      chalk.white('> '),
      chalk.white(body)
    )

    await handleIncomingMessage(bot, msg)
  })
}

connectToWhatsApp()