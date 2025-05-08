import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = 'sk-proj-REPLACE_WITH_YOUR_REAL_KEY';

app.post('/spin', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Rewrite this for social media: "${prompt}"` }],
        max_tokens: 80
      })
    });

    const data = await openaiRes.json();
    return res.json({ result: data.choices?.[0]?.message?.content || '⚠️ No result from OpenAI' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZiiOZ AI Proxy running on port ${PORT}`));
