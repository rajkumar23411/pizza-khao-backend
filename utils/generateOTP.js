const optGenerator = require("otp-generator");

const generateOTP = () => {
  const otp = optGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  return otp;
};

module.exports = generateOTP;
