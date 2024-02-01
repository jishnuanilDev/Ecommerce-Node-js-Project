// // generateOTP.js
// const otpGenerator = require('otp-generator');

// function generateOTP() {
//   return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
// }

// module.exports = generateOTP;


function generateNumericOTP(length) {
  let otp = '';
  const digits = '0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits.charAt(randomIndex);
  }

  return otp;
}
  
  module.exports = generateNumericOTP;
//   console.log('Generated Numeric OTP:', numericOTP);
  