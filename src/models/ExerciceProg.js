const mongoose = require("mongoose");
 
const exerciceProgSchema = new mongoose.Schema({
  program_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersonalProg",
    required: true,
  },
  exo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercice",
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
  complete: {
    type: Boolean,
    default: false,
  },
});
 
module.exports = mongoose.model("ExerciceProg", exerciceProgSchema);