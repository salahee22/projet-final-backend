const mongoose = require("mongoose");
 
const personalProgSchema = new mongoose.Schema({
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  videos: {
    type: String,
    default: null,
  },
  level: {
    type: String,
    enum: [ "elite"],
    default: "elite",
  },
  image: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model("PersonalProg", personalProgSchema);