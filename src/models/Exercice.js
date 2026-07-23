const mongoose = require("mongoose");

const textSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [{ type: String }],
}, { _id: false });

const exerciceSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
  description: { type: String, required: true },
  objective: { type: String, required: true, trim: true },
  material: { type: String, trim: true, default: null },
  theme: {
    type: String,
    enum: [
      "Passe", "Tir", "Dribble", "Conduite de balle", "Contrôle",
      "Jeu collectif", "Vitesse", "Endurance", "Coordination",
      "Prise de balle", "Plongeons", "Relance", "Placement", "Réflexes", "Sorties aériennes",
    ],
    required: true,
  },
  age: {
    type: String,
    enum: ["U7", "U9", "U11", "U13", "U15", "U17", "Senior"],
    required: true,
  },
  level: {
    type: String,
    enum: ["Débutant", "Intermédiaire", "Avancé"],
    default: "Débutant",
  },
  type: {
    type: String,
    enum: ["field", "goalkeeper"],
    default: "field",
  },
  duration: { type: String, default: "15 min" },
  image: { type: String, default: null },
  images: [{ type: String }],
  video: { type: String, default: null },

  // Contenu long structuré (page détail)
  detail_image: { type: String, default: null },
  sections: [{
    title: { type: String, required: true },
    paragraphs: [{ type: String }],
  }],
  planImages: [{
    id: { type: String, default: null },
    caption: { type: String, default: null },
    img: { type: String, default: null },
    _id: false,
  }],
  organisation: textSectionSchema,
  consignes: textSectionSchema,
  roles: textSectionSchema,
  categories: [{ type: String }],
  subThemes: [{ type: String }],

  published_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exercice", exerciceSchema);