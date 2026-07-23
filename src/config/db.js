const mongoose = require("mongoose");
require("dotenv").config();

const handleConnectDB = async () => {
  const maxRetries = 5;
  const delayMs = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000);

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(process.env.MongoDB_URL, {
        serverSelectionTimeoutMS: delayMs,
      });
      console.log("mongodb connected successfully");
      return;
    } catch (error) {
      console.error(`MongoDB connection failed (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

module.exports = { handleConnectDB };