const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("/api/topics", () => {
  test("Status: 200 GETS array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
        body.forEach(() => {
          expect.objectContaining({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("Status: 404 with an error message for if the endpoint the user is searching for doesn't exist in the database", () => {
    return request(app)
      .get("/api/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, request invalid..");
      });
  });
});
