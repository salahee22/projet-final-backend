const mongoose = require("mongoose");

const exerciceProgSchema = new mongoose.Schema({
  program_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersonalProg",
    required: true,
  },
  week_num: {
    type: Number,
    required: true,
    min: 1,
  },
  day_num: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sets: {
    type: Number,
    min: 0,
    default: null,
  },
  reps: {
    type: String,
    trim: true,
    default: null,
  },
  rest: {
    type: String,
    trim: true,
    default: null,
  },
  notes: {
    type: String,
    trim: true,
    default: null,
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ExerciceProg", exerciceProgSchema);