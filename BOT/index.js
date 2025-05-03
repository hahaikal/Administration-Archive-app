const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { blue, green, cyan, red } = require('chalk');
const { createInterface } = require('readline');
const chalk = require('chalk');
const qrcode = require('qrcode-terminal');
const { handleIncomingMessage } = require('./services/whatsAppService');

const usePairingCode = false

async function connectToWhatsApp () {
  console.log(blue('Connecting to WhatsApp...'))
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

  const bot = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    version: [2, 3000, 1015901307]
  })

  bot.ev.on('creds.update', saveCreds)

  bot.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) {
      console.log(cyan('QR Code received, scan please:'))
      qrcode.generate(qr, { small: true })
    }
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