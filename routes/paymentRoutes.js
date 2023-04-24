const {
  paymentVerification,
  getApiKey,
  createRazorpayOrder,
} = require("../controllers/paymentController");
const { auth } = require("../middlewares/auth");
const paymentRoutes = require("express").Router();

paymentRoutes.post("/create-rzp-order", auth, createRazorpayOrder);
paymentRoutes.post("/verifypayment", auth, paymentVerification);
paymentRoutes.get("/getapikey", auth, getApiKey);
module.exports = paymentRoutes;
