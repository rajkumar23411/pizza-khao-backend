require("dotenv").config();
const CustomErrorHandler = require("../middlewares/CustomErrorHandler.js");
// const twilio = require("twilio")(process.env.accountSid, process.env.authToken);

// const sendMsg = async (otp, phone) => {
//   await twilio.messages
//     .create({
//       body: `Your OTP is ${otp}`,
//       from: process.env.messageNum,
//       to: phone,
//     })
//     .then((msg) => console.log(`Message send to ${msg.to} successfully`))
//     .catch((err) => console.log(`Could not send message beacuse ` + err));
// };

// module.exports = sendMsg;

const Nexmo = require("nexmo");
const nexmo = new Nexmo({
  apiKey: process.env.nexmo_api_key,
  apiSecret: process.env.nexmo_secret,
});

const sendMsg = async (otp, phone) => {
  const from = "Pizza-Khao";
  const to = "91" + phone;
  nexmo.message.sendSms(from, to, `Your OTP is ${otp}`, (err, responseData) => {
    if (err) {
      return next(CustomErrorHandler.serverError(err));
    }
  });
};
module.exports = sendMsg;
