const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
