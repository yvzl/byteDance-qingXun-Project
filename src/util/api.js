
// backend/api.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

const cozeAPIConfig = {
  token: 'pat_iKmuFMcHK1R0L7YyDNrrsZ71RsbdsK2NfTeKa3QVXwKR5q2nPN3rxcHC9KVmITzL',
  baseURL: 'https://api.coze.cn',
  headers: {
    Authorization: `Bearer ${process.env.COZE_API_TOKEN}`,
  },
};

app.post('/api/coze/chat', async (req, res) => {
  try {
    const response = await axios.post(`${cozeAPIConfig.baseURL}/chat/stream`, {
      bot_id: '7461137983119949833',
    }, {
      headers: cozeAPIConfig.headers,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});