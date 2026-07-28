const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  last_message: {
    type: String,
    default: null,
  },
  last_message_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);