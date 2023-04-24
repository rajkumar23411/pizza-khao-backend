const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  image: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  prices: {
    regular: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true },
    extralarge: { type: Number, required: true },
  },
  description: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  category: { type: [String], required: true },
  numOfReviews: { type: String, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      addedAt: { type: Date, default: Date.now() },
    },
  ],
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
productSchema.methods.getPriceBySize = function (size) {
  switch (size) {
    case "medium":
      return this.prices.medium;
    case "large":
      return this.prices.large;
    case "extralarge":
      return this.prices.extralarge;
    default:
      return this.prices.regular;
  }
};
module.exports = mongoose.model("Product", productSchema);
