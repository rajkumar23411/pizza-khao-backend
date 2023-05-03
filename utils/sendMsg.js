require("dotenv").config();
const CustomErrorHandler = require("../middlewares/CustomErrorHandler.js");
const Nexmo = require("nexmo");
const nexmo = new Nexmo({
  apiKey: process.env.nexmo_api_key,
  apiSecret: process.env.nexmo_secret,
});

const sendMsg = async (otp, phone) => {
  const from = "Pizza-Khao";
  const to = "+91" + phone;
  console.log(to);
  nexmo.message.sendSms(
    from,
    to,
    `Your OTP is ${otp}. It will be valid for next 10 minutes.`,
    (err, responseData) => {
      if (responseData) {
        console.log(responseData);
      }
      if (err) {
        console.log(err);
        return next(CustomErrorHandler.serverError(err));
      }
    }
  );
};
module.exports = sendMsg;
