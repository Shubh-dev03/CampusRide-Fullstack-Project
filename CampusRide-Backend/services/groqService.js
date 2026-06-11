const Groq = require("groq-sdk");

const client = new Groq({
  apikey: process.env.GROQ_API_KEY,
});

module.exports = client;
