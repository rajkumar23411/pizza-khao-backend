const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: { type: String, required: true },
  contact: { type: Number, required: true },
  pinCode: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  locality: { type: String, required: true },
  landMark: String,
  alternatContact: String,
  userId: { type: mongoose.Types.ObjectId, required: true },
});

module.exports = mongoose.model("address", addressSchema);
