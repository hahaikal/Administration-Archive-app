const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const chalk = require('chalk')
const readline = require('readline')
require('dotenv').config();

const API = process.env.BACKEND_API_URL

// metode pairing
const usePairingCode = true

// Prompt inpu terminal
async function qustion (quest) {
  process.stdout.write(quest)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => rl.question('', (answer) => {
    rl.close()
    resolve(answer)
  }))
}

// koneksi ke whatsapp
async function connectToWhatsApp () {
  console.log(chalk.blue('Connecting to WhatsApp...'))
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

  const bot = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    version: [2, 3000, 1015901307]
  })

  // metode pair
  if (usePairingCode && !bot.authState.creds.registered) {
    console.log(chalk.green('Masukkan nomor dengan awal 62, contoh: 6281234567890'))
    const phoneNumber = await qustion('> ')
    const code = await bot.requestPairingCode(phoneNumber.trim())
    console.log(chalk.cyan('Pairing code: ' + code))
  }

  // menyimpan sesi login
  bot.ev.on('creds.update', saveCreds)

  // informasi koneksi
  bot.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error)?.output?.statusCode !== 401) {
        console.log(chalk.red('Connection closed. Reconnecting...'))
        connectToWhatsApp()
      } else {
        console.log(chalk.red('Connection closed. Please scan the QR code again.'))
      }
    } else if (connection === 'open') {
      console.log(chalk.green('Connected to WhatsApp!'))
    }
  })
}

// jalankan koneksi
connectToWhatsApp()