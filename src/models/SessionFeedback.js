const mongoose = require("mongoose");

const sessionFeedbackSchema = new mongoose.Schema({
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  program_id: { type: mongoose.Schema.Types.ObjectId, ref: "PersonalProg", required: true },
  week_num: { type: Number, required: true },
  day_num: { type: Number, required: true },
  feeling: {
    type: String,
    enum: ["fatigue", "moyen", "en_forme"],
    required: true,
  },
  load_preference: {
    type: String,
    enum: ["baisser", "garder", "augmenter"],
    default: "garder",
  },
  comment: { type: String, trim: true, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SessionFeedback", sessionFeedbackSchema);