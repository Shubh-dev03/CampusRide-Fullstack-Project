const client = require("../services/groqService.js");
const { SYSTEM_PROMPT } = require("../utils/systemPrompt.js");

const chatRoute = async (req, res) => {
  try {
    const { messages } = req.body;

    // Edge case: missing or wrong type
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Edge case: validate each message shape
    const isValid = messages.every(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    );
    if (!isValid) {
      return res.status(400).json({ error: "Invalid message format." });
    }

    const contents = messages.slice(-20).map((msg) => ({
      role: msg.role, // "user" or "assistant" — Groq accepts both as-is
      content: msg.content.trim(),
    }));

    if (contents[contents.length - 1].role !== "user") {
      return res
        .status(400)
        .json({ error: "Last message must be from the user." });
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b", // free and fast on Groq
      max_tokens: 1024,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...contents],
    });

    const reply = response.choices?.[0]?.message?.content;

    // Edge case: empty reply
    if (!reply || !reply.trim()) {
      return res
        .status(502)
        .json({ error: "No response from AI. Please try again." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Full Groq Error:");
    console.dir(error, { depth: null });

    if (error.status === 400) {
      return res
        .status(400)
        .json({ error: "Invalid request sent to AI service." });
    }
    if (error.status === 429) {
      return res.status(429).json({
        error: "Too many requests. Please wait 60 seconds and try again.",
        retryAfter: 60,
      });
    }
    if (error.status === 401 || error.status === 403) {
      return res
        .status(500)
        .json({ error: "AI service authentication failed. Contact support." });
    }

    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports = { chatRoute };
