const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);
    await transporter.verify();

    await transporter.sendMail({
      from: `"Arsip Surat App" <no-reply@arsip-surat.com>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Email not sent:', error);
    if (error.response) {
      console.error('Response:', error.response);
    }
    if (error.responseCode) {
      console.error('Response Code:', error.responseCode);
    }
    if (error.responseHeaders) {
      console.error('Response Headers:', error.responseHeaders);
    }
    console.error('Check if you have enabled "Less secure app access" or use an App Password if 2FA is enabled on your Gmail account.');
  }
};

module.exports = sendEmail;
