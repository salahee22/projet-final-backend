// config/chargily.js
const { ChargilyClient } = require('@chargily/chargily-pay');

const chargilyClient = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
});

module.exports = chargilyClient;