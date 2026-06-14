// This file becomes a serverless function automatically when deployed on Vercel.
// It keeps your Anthropic API key on the server — never exposed to the browser.
//
// The frontend calls "/api/claude" with the same body shape the Anthropic
// /v1/messages endpoint expects ({ model, max_tokens, system, messages }).
// We attach the secret API key here and forward the request.

export default async function handler(req, res) {
  // Allow simple local testing tools (Thunder Client, curl, etc.)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // No key configured yet — the frontend will automatically fall back
    // to its built-in offline AI engine when this happens.
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY is not set on the server.",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to reach the Anthropic API",
      details: err.message,
    });
  }
}
