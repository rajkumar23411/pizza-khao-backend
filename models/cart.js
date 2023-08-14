const mongoose = require("mongoose");
const Product = require("./product");
const Coupon = require("./coupon");
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
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    discountAmount: { type: Number },
});
cartSchema.pre("save", async function (next) {
    try {
        let totalPrice = 0;
        let discountAmount = 0;

        for (const item of this.items) {
            const product = await Product.findById(item.product);
            const price = product.getPriceBySize(item.size);
            totalPrice += price * item.quantity;
        }
        if (this.coupon) {
            const coupon = await Coupon.findById(this.coupon);
            discountAmount = (this.totalPrice * coupon.discount) / 100;
            totalPrice -= discountAmount;
        }
        this.totalPrice = totalPrice;
        this.discountAmount = discountAmount;
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.model("Cart", cartSchema);
