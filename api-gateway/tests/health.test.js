const request = require("supertest");
const app = require("../src/app");

describe("API Gateway Health Endpoint", () => {

    test("GET /health should return 200 OK", async () => {

        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("status", "UP");

        expect(response.body).toHaveProperty("service", "api-gateway");

    });

});