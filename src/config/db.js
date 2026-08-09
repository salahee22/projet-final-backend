const mongoose = require("mongoose");
require("dotenv").config();

const getMongoUri = () => {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.MongoDB_URL ||
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    process.env.MONGODB_CONNECTION_STRING ||
    process.env.MONGODB
  );
};

const handleConnectDB = async () => {
  const maxRetries = 5;
  const delayMs = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000);
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error(
      "MongoDB URI is undefined. Set one of: MONGODB_URI, MONGODB_URL, MongoDB_URL, MONGO_URI, MONGO_URL in Render environment variables."
    );
  }

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(mongoUri, {
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