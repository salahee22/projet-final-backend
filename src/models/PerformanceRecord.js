const mongoose = require("mongoose");
 
const performanceRecordSchema = new mongoose.Schema({
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  record_date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: null,
  },
  value: {
    type: Number,
    required: true,
  },
  unite: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
});
 
module.exports = mongoose.model("PerformanceRecord", performanceRecordSchema);