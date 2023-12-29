
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jishnuanil255@gmail.com',
    pass: 'rfqg bmfs ztce jkwv',
  },
});

function sendEmail(Email, subject, text) {
  const mailOptions = {
    from: 'jishnuanil255@gmail.com',
    to: Email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}





module.exports = sendEmail;
