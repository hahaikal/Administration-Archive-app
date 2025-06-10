const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const FormData = require('form-data');
const { askGemini } = require('../gemini/aiController');
const axios = require('axios');
require('dotenv').config();

const downloadsDir = path.join(__dirname, '..', 'downloads');

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

async function handleIncomingMessage(sock, msg) {
  if (msg.key.fromMe) {
    return;
  }

  const sender = msg.key.remoteJid;
  const messageContent = msg.message;
  const prompt = messageContent?.conversation || messageContent?.extendedTextMessage?.text;
  if (prompt) {
    const reply = await askGemini(prompt);
    try {
      await sock.sendMessage(sender, { text: reply });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  if (messageContent?.documentMessage?.mimetype === 'application/pdf') {
    const phoneNumber = sender.split('@')[0];
    try {
      await axios.post(process.env.API_GET_PHONE_NUMBER , { sender: phoneNumber });
    } catch (error) {
      await sock.sendMessage(sender, { text: "Nomor HP Anda tidak terdaftar di sistem." });
      console.error("Error validating phone number:", error.message);
      return;
    }

    const buffer = await downloadMediaMessage(msg, 'buffer', {}, {
      logger: console,
      reuploadRequest: sock.updateMediaMessage
    }); 

    const fileName = `${Date.now()}.pdf`;
    const filePath = path.join(downloadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const data = await pdfParse(buffer);
    const textFromPDF = data.text;

    const reply = await askGemini(`Beritahu saya hanya judul, nomor dan tanggal pdf ini. formatnya hanya \njudul: (jika tidak yakin bikin not found)\n nomor: (hanya nomor yang didapat) \n tanggal (hanya tanggal, contoh: 1 januari 2025):) :\n\n${textFromPDF}`);
    const judulMatch = reply.match(/Judul:\s*(.*)/i);
    const nomorMatch = reply.match(/Nomor:\s*(.*)/i);
    const tanggalMatch = reply.match(/Tanggal:\s*(.*)/i);

    let judul = judulMatch ? judulMatch[1].trim() : 'Tidak ditemukan';
    const nomor = nomorMatch ? nomorMatch[1].trim() : 'Tidak ditemukan';
    const tanggal = tanggalMatch ? tanggalMatch[1].trim() : 'Tidak ditemukan';

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('nomor', nomor);
    formData.append('tanggal', tanggal);
    formData.append('file', fs.createReadStream(filePath));

    try {
      const response = await axios.post(process.env.API_SEND_FILE , formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      if (response.status === 201) {
        fs.unlinkSync(filePath);
        await sock.sendMessage(sender, { text: response.data.message });
      } else {
        fs.unlinkSync(filePath);
        await sock.sendMessage(sender, { text: `Gagal mengirim file: ${response.statusText}` });
      }
    } catch (error) {
      await sock.sendMessage(sender, { text: error.response.data.message || 'Gagal mengirim file' });
      fs.unlinkSync(filePath);
      if (error.response) {
        console.error('Error uploading file to API:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received from API:', error.request);
      } else {
        console.error('Error setting up request to API:', error.message);
      }
    }
  }
}

module.exports = {
  handleIncomingMessage
};
