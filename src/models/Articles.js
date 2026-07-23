const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  label: { type: String, default: null },
  theme: { type: String, default: null },
  title: { type: String, required: true },
  image: { type: String, default: null },
  paragraphs: [{ type: String }],
  quote: { type: String, default: null },
}, { _id: false });

const sidebarSchema = new mongoose.Schema({
  expert: {
    name: { type: String, default: null },
    role: { type: String, default: null },
    description: { type: String, default: null },
    keyFigures: [{
      value: { type: String, default: null },
      label: { type: String, default: null },
      _id: false,
    }],
  },
  parcours: {
    title: { type: String, default: null },
    items: [{
      year: { type: String, default: null },
      text: { type: String, default: null },
      _id: false,
    }],
  },
}, { _id: false });

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
  summary: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Technique", "Tactique", "Physique", "Mental", "Nutrition"],
    default: "Technique",
  },
  age: {
    type: String,
    enum: ["U7", "U9", "U11", "U13", "U15", "U17", "Senior"],
    default: null,
  },
  image: {
    type: String,
    default: null,
  },

  images: [{ type: String }],   

  video: {
    type: String,
    default: null,
  },
  read_time: {
    type: String,
    default: "5 min",
  },
  tag: {
    type: String,
    default: null,
  },

  // Contenu long structuré
  intro: {
    label: { type: String, default: "INTRODUCTION" },
    subtitle: { type: String, default: null },
    paragraphs: [{ type: String }],
  },
  chapters: [chapterSchema],
  conclusion: {
    label: { type: String, default: "CONCLUSION" },
    theme: { type: String, default: null },
    title: { type: String, default: null },
    paragraph: [{ type: String }],
  },
  sidebar: sidebarSchema,

  published_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Article", articleSchema);