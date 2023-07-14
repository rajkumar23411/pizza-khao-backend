const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  activeFrom: { type: Date, required: true },
  activeTo: { type: Date, required: true },
  status: { type: String, required: true, default: "inactive" },
  minOrderAmount: { type: Number, required: true, default: 0 },
  description: { type: String },
});

module.exports = mongoose.model("Coupon", CouponSchema);
