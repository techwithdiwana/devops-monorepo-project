const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'api-gateway'
  });
});

app.get('/version', (req, res) => {
  res.json({
    version: 'v1.0.0'
  });
});

app.get('/users', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Diwana'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});