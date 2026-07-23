const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, required: true, trim: true },
  experience: { type: String, default: null },
  diplomes: { type: String, default: null },
  specialite: { type: String, required: true },
  image: { type: String, default: null },
  color: { type: String, default: "#C8A84B" },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Coach", coachSchema);