const transporter = require('../config/nodemailer');

async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    text
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail }; 