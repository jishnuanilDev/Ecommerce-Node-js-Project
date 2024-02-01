
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.usermail,
    pass: process.env.usermailpass,
  },
});

function sendEmail(Email, subject, text) {
  const mailOptions = {
    from: 'biblioboutique.jisonline.site',
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
