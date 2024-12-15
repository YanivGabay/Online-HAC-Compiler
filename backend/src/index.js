import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(json());

const COMPILER_URL = process.env.COMPILER_URL || 'http://compiler:3002';

app.post('/compile', async (req, res) => {
  const { code, compiler, stdin } = req.body;

  if (!code || !compiler) {
    return res.status(400).json({ success: false, error: 'Code and compiler are required.' });
  }

  if (!['gcc', 'g++'].includes(compiler)) {
    return res.status(400).json({ success: false, error: 'Unsupported compiler type. Use "gcc" or "g++".' });
  }

  try {
    const response = await fetch(`${COMPILER_URL}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, compiler, stdin }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ success: false, error: text });
    }

    const result = await response.json();
    return res.json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown backend error'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
