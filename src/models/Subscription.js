const mongoose = require("mongoose");
 
const subscriptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan_name: {
    type: String,
    required: true,
    enum: ["basic", "premium", "elite"],
    default: "basic",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  starts_at: {
    type: Date,
    default: Date.now,
  },
  ends_at: {
    type: Date,
    required: true,
  },
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});
 
module.exports = mongoose.model("Subscription", subscriptionSchema);