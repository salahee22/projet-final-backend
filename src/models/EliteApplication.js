const mongoose = require("mongoose");

const eliteApplicationSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  poste: { type: String, required: true },
  niveau: { type: String, required: true },
  club: { type: String, default: null },
  telephone: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  message: { type: String, default: null },
  offre: {
    type: String,
    enum: ["elite1", "elite2", "elite3"],
    required: true,
  },
  status: {
    type: String,
    enum: ["nouvelle", "contactee", "acceptee", "refusee"],
    default: "nouvelle",
  },
  created_at: { type: Date, default: Date.now },
  checkout_id: { type: String, default: null },
  payment_status: {
  type: String,
  enum: ["en_attente", "paye", "echoue", "annule", "expire"],
  default: "en_attente",
},
});

module.exports = mongoose.model("EliteApplication", eliteApplicationSchema);