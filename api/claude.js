// Vercel Serverless Function — /api/claude
// Fa da proxy tra il client React e l'API Anthropic.
// La chiave API (CLAUDE_API_KEY) è una variabile d'ambiente del server:
// non è mai inclusa nel bundle JS del client.

module.exports = async function handler(req, res) {
  // Solo POST ammesso
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    console.error("[api/claude] CLAUDE_API_KEY non trovata nelle variabili d'ambiente");
    return res.status(500).json({ error: { message: "Chiave API mancante sul server" } });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[api/claude] Errore Anthropic:", data);
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[api/claude] Errore proxy:", error);
    return res.status(500).json({ error: { message: "Errore del server proxy: " + error.message } });
  }
};
