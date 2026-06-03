
const mongoose = require("mongoose");
 
const savedSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "content_type_model",
  },
  content_type: {
    type: String,
    enum: ["article", "exercice"],
    required: true,
  },
  saved_at: {
    type: Date,
    default: Date.now,
  },
});
 
savedSchema.index({ user_id: 1, content_id: 1, content_type: 1 }, { unique: true });
 
module.exports = mongoose.model("Saved", savedSchema);