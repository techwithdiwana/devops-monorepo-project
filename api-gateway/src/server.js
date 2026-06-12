const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || 'http://auth-service:8000';

const LOG_LEVEL =
  process.env.LOG_LEVEL || 'INFO';

const API_KEY =
  process.env.API_KEY || 'not-set';

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'api-gateway',
    auth_service_url: AUTH_SERVICE_URL,
    log_level: LOG_LEVEL
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