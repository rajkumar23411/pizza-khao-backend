const crypto = require("crypto");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();
const instances = new Razorpay({
  key_id: process.env.rzp_key_id,
  key_secret: process.env.rzp_key_secret,
});
const paymentController = {
  async createRazorpayOrder(req, res) {
    const amount = req.body.amount;
    console.log(amount);
    try {
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `Order${Date.now()}`,
      };
      const order = await instances.orders.create(options);

      res.status(200).json({ order, success: true });
    } catch (error) {
      console.log(error);
    }
  },

  async paymentVerification(req, res, next) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.rzp_key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.status(200).json({ success: true, razorpay_payment_id });
    } else {
      res.status(400).json({ success: false });
    }
  },
  async getApiKey(req, res) {
    res.status(200).json({
      key: process.env.rzp_key_id,
    });
  },
};
module.exports = paymentController;
