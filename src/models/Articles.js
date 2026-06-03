const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["fundamentals", "training", "tactics", "goalkeeping", "news", "other"],
    default: "other",
  },
  img: {
    type: String,
    default: null,
  },
  video: {
    type: String,
    default: null,
  },
  published_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Article", articleSchema);