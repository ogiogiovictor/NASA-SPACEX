const request = require("supertest");
const app = require("../../app");

describe("GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
        const response = await request(app).get("/launches");
        expect(response.statusCode).toBe(200);
    });
});


describe('Test POST /v1/launches', () => {
    test('It should respond with 201 created', async () => {
        const response = await request(app)
        .post("/launches")
        .send({
            mission: 'USS Enterprise',
            rocket: 'NCC-1701-D',
            target: 'Kepler-186 f',
            launchDate: 'January 4, 2028'
        })
        .expect('Content-Type', /json/)
        .expect(201);

    });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
            .post("/v1/launches")

        });

        test('It should catch invalid dates', async () => {

        });
 
    });