const axios = require("axios");
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
    auth_service_url: process.env.AUTH_SERVICE_URL,
    log_level: process.env.LOG_LEVEL
  });

});

app.get('/version', (req, res) => {
  res.json({
    version: 'v1.0.0'
  });
});

app.get('/users', async (req, res) => {

  try {

    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || "http://auth-service:8000";

    const response = await axios.get(
      `${authServiceUrl}/users`
    );

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch users from auth service",
      details: error.message
    });

  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});