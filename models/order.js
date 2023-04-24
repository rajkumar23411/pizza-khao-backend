const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "address",
  },
  itemsPrice: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  paymentInfo: {
    transactionId: { type: String },
    transactionStatus: { type: String },
    paidAt: { type: Date },
  },
  orderDate: { type: Date, default: Date.now() },
  orderStatus: { type: String, required: true, default: "Order Placed" },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  orderedAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("order", orderSchema);
