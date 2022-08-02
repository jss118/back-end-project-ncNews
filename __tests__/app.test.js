const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("ALL /*", () => {
  test("Status: 404 with an error message for an invalid endpoint", () => {
    return request(app)
      .get("/api/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, request invalid..");
      });
  });
});

describe("GET /api/topics", () => {
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
});

describe("GET /api/articles/:article_id", () => {
  test("Status: 200 GETS an article object with the correct properties", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(typeof body).toBe("object");
    expect(body.author).toEqual(expect.any(String));
    expect(body.title).toEqual(expect.any(String));
    expect(body.article_id).toEqual(expect.any(Number));
    expect(body.topic).toEqual(expect.any(String));
    expect(body.created_at).toBe("2020-07-09T20:11:00.000Z");
    expect(body.votes).toEqual(expect.any(Number));
  });
  test("Status: 400 recieves an error when a bad request is made", async () => {
    const { body } = await request(app).get("/api/articles/one").expect(400);
    expect(body.msg).toBe("Bad request");
  });
  test("Status: 404 with an error message for a valid, but none-existing endpoint", async () => {
    const { body } = await request(app).get("/api/articles/1000").expect(404);

    expect(body.msg).toBe("Sorry, endpoint doesn't exist");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Status: 200 responds with the updated article which has 1 vote added to the votes property", async () => {
    const votesUpdate = { inc_votes: 1 };
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(200);
    expect(body.votes).toBe(101);
  });
  test("Status: 200 responds with the updated article with -1 votes when 101 votes are taken away from the votes property", async () => {
    const votesUpdate = { inc_votes: -101 };
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(200);
    expect(body.votes).toBe(-1);
  });
  test("Status: 400 responds with msg object when vote update object has and invalid value type", async () => {
    const votesUpdate = { inc_votes: "one" };
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(400);
    expect(body.msg).toBe("Bad request");
  });
});
