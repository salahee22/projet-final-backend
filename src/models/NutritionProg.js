const mongoose = require("mongoose");

const nutritionProgSchema = new mongoose.Schema({
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
  meal_type: {
    type: String,
    enum: ["petit_dejeuner", "collation_matin", "dejeuner", "collation_apres_midi", "diner"],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("NutritionProg", nutritionProgSchema);