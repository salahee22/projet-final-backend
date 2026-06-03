const mongoose = require("mongoose");
 
const profilPlayerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  birth_day: {
    type: Date,
    default: null,
  },
  position: {
    type: String,
    trim: true,
    default: null,
  },
  club: {
    type: String,
    trim: true,
    default: null,
  },
  height: {
    type: Number,
    min: 0,
    default: null,
  },
  weight: {
    type: Number,
    min: 0,
    default: null,
  },
  level: {
    type: String,
    enum: [ "elite"],
    default: "elite",
  },
  medical_info: {
    type: String,
    default: null,
  },
  upload_file: {
    type: String,
    default: null,
  },
});
 
module.exports = mongoose.model("ProfilPlayer", profilPlayerSchema);