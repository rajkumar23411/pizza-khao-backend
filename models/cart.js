const mongoose = require("mongoose");
const Product = require("./product");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
      size: { type: String, required: true, default: "regular" },
    },
  ],
  totalPrice: { type: Number, required: true },
});
cartSchema.pre("save", async function (next) {
  try {
    let totalPrice = 0;

    for (const item of this.items) {
      const product = await Product.findById(item.product);
      const price = product.getPriceBySize(item.size);
      totalPrice += price * item.quantity;
    }

    this.totalPrice = totalPrice;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = mongoose.model("Cart", cartSchema);
