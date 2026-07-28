const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
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
  slot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AvailabilitySlot",
    default: null,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected", "cancelled"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);