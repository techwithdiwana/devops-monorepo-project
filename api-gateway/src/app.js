const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://auth-service:8000";

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "api-gateway",
    auth_service_url: process.env.AUTH_SERVICE_URL,
    log_level: process.env.LOG_LEVEL
  });
});

app.get("/version", (req, res) => {
  res.json({
    version: "v1.0.0"
  });
});

app.get("/users", async (req, res) => {

  try {

    const response = await axios.get(
      `${AUTH_SERVICE_URL}/users`
    );

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch users from auth service",
      details: error.message
    });

  }

});

module.exports = app;