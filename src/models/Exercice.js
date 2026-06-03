const mongoose = require("mongoose");
 
const exerciceSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["basic", "development", "elite", "physical", "technical", "tactical", "goalkeeping"],
    default: "basic",
  },
  img: {
    type: String,
    default: null,
  },
  video: {
    type: String,
    default: null,
  },
  level: {
    type: String,
    enum: ["U6-U12", "U12-U17", "senior", "elite"],
    default: "U6-U12",
  },
  is_goalkeeper: {
    type: Boolean,
    default: false,
  },
  equipements: {
    type: String,
    default: null,
  },
  published_at: {
    type: Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model("Exercice", exerciceSchema);