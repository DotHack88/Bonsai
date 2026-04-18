const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Per gestire immagini base64 grandi

app.post('/api/claude', async (req, res) => {
  try {
    const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: { message: 'Chiave API mancante' } });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: { message: 'Errore del server proxy' } });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});