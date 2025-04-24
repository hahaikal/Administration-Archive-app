const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const FormData = require('form-data');
const { askGemini } = require('../gemini/aiController');
const axios = require('axios');

const downloadsDir = path.join(__dirname, '..', 'downloads');

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

async function handleIncomingMessage(sock, msg) {
  const sender = msg.key.remoteJid;
  const messageContent = msg.message;

  if (messageContent?.conversation) {
    const prompt = messageContent.conversation;
    const reply = await askGemini(prompt);
    await sock.sendMessage(sender, { text: reply });
  }

  if (messageContent?.documentMessage?.mimetype === 'application/pdf') {
    const buffer = await downloadMediaMessage(msg, 'buffer', {}, {
      logger: console,
      reuploadRequest: sock.updateMediaMessage
    });

    const fileName = `${Date.now()}.pdf`;
    const filePath = path.join(downloadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const data = await pdfParse(buffer);
    const textFromPDF = data.text;

    const reply = await askGemini(`Beritahu saya hanya judul, nomor dan tanggal pdf ini. formatnya hanya \njudul: (jika tidak yakin bikin not found)\n nomor: (hanya nomor yang didapat \n tanggal:) :\n\n${textFromPDF}`);

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
      const response = await axios.post('http://localhost:5000/botwa/uploadFromWhatsApp', formData, {
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
      await sock.sendMessage(sender, { text: `eror: Gagal mengirim file` });
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
