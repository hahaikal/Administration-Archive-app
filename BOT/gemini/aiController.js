const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(prompt) {
  try {
    const res = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            { text: "Gunakan bahasa Indonesia dalam semua jawaban Anda." },
            { text: prompt }
          ],
          role: 'user'
        }
      ]
    });

    const reply = res.data.candidates[0].content.parts[0].text;
    return reply;
  } catch (err) {
    console.error('❌ Gemini API Error:', err.message);
    return 'Maaf, ada kesalahan saat menghubungi AI.';
  }
}

module.exports = {
  askGemini
};