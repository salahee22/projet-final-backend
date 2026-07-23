const { ChargilyClient } = require("@chargily/chargily-pay");

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode: process.env.CHARGILY_MODE || "test",
});

module.exports = client;
