// // generateOTP.js
// const otpGenerator = require('otp-generator');

// function generateOTP() {
//   return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
// }

// module.exports = generateOTP;

require('dotenv').config();
function generateNumericOTP(length) {
    let otp = '';
    const digits = process.env.otpDigits;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = process.env.randomIndex
      otp += digits.charAt(randomIndex);
    }
  
    return otp;
  }
  
  module.exports = generateNumericOTP;
//   console.log('Generated Numeric OTP:', numericOTP);
  