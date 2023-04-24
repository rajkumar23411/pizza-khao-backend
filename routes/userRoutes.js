const {
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  verifyLoginOTP,
} = require("../controllers/userController");
const {
  register,
  login,
  logOut,
  me,
  updateUserName,
  loginUsingContact,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

const userRoute = require("express").Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/logout", [auth], logOut);
userRoute.get("/me", [auth], me);
userRoute.post("/update/name", [auth], updateUserName);
userRoute.post("/login/contact", loginUsingContact); //send login otp
userRoute.post("/verify/login/otp", verifyLoginOTP); // verify the otp and log in the user
userRoute.post("/forgot/password", forgotPassword); // send reset password OTP
userRoute.post("/verify/forgot/password/otp", verifyForgotPasswordOTP); // verify the otp and reset the password
userRoute.post("/reset/password", resetPassword); // reset the user's password

module.exports = userRoute;
