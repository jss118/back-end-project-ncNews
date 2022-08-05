const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
require("jest-sorted");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("ALL /*", () => {
  test("Status: 404 with an error message for a non-existing endpoint", () => {
    return request(app)
      .get("/api/non-existing-endpoint")
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
    expect(body.created_at).toEqual(expect.any(String));
    expect(body.votes).toEqual(expect.any(Number));
    expect(body.comment_count).toEqual(expect.any(Number));
  });
  test("Status: 200 Gets an article object which now includes a comment_count property with the value of the total amount of comments for the article with the same article_id", async () => {
    const {
      body: { comment_count },
    } = await request(app).get("/api/articles/1").expect(200);
    expect(comment_count).toBe(11);
  });
  test("Status: 400 recieves an error when a bad request is made", async () => {
    const { body } = await request(app).get("/api/articles/one").expect(400);
    expect(body.msg).toBe("Bad request");
  });
  test("Status: 404 with an error message for a valid, but none-existing endpoint", async () => {
    const { body } = await request(app).get("/api/articles/1000").expect(404);

    expect(body.msg).toBe("article does not exist");
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

  test("Status: 400 responds with msg object when the vote update object has an invalid value type", async () => {
    const votesUpdate = { inc_votes: "one" };
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(400);
    expect(body.msg).toBe("Bad request");
  });

  test("Status: 400 responds with msg object when an invalid endpoint has been entered in", async () => {
    const votesUpdate = { inc_votes: 1 };
    const { body } = await request(app)
      .patch("/api/articles/one")
      .send(votesUpdate)
      .expect(400);
    expect(body.msg).toBe("Bad request");
  });

  test("Status: 404 responds with msg object when the endpoint does not exist", async () => {
    const votesUpdate = { inc_votes: 1 };
    const { body } = await request(app)
      .patch("/api/articles/200")
      .send(votesUpdate)
      .expect(404);
    expect(body.msg).toBe("article does not exist");
  });
});

describe("GET /api/users", () => {
  test("Status: 200 responds with an array of user objects", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body).toHaveLength(4);
    body.forEach(user => {
      expect(user.username).toEqual(expect.any(String));
      expect(user.name).toEqual(expect.any(String));
      expect(user.avatar_url).toEqual(expect.any(String));
    });
  });
});

describe("GET /api/articles", () => {
  test("Status 200 responds with an array of article objects", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);

    body.forEach(article => {
      expect(article.author).toEqual(expect.any(String));
      expect(article.title).toEqual(expect.any(String));
      expect(article.article_id).toEqual(expect.any(Number));
      expect(article.topic).toEqual(expect.any(String));
      expect(article.created_at).toEqual(expect.any(String));
      expect(article.votes).toEqual(expect.any(Number));
      expect(article.comment_count).toEqual(expect.any(Number));
    });
    expect(body).toBeSortedBy("created_at", {
      descending: true,
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status: 200 responds with array of comment objects, all of which the article_id matches the id in the end point", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    body.forEach(comment => {
      expect(comment.comment_id).toEqual(expect.any(Number));
      expect(comment.votes).toEqual(expect.any(Number));
      expect(comment.created_at).toEqual(expect.any(String));
      expect(comment.author).toEqual(expect.any(String));
      expect(comment.body).toEqual(expect.any(String));
    });
  });
  test("Status: 200 responds with an empty array for a valid article that has no comments", async () => {
    const { body } = await request(app)
      .get("/api/articles/8/comments")
      .expect(200);
    expect(body.length).toBe(0);
  });
  test("Status: 404 responds with an error for a valid but non-existing article", async () => {
    const { body } = await request(app)
      .get("/api/articles/200/comments")
      .expect(404);
    expect(body.msg).toBe("article does not exist");
  });
  test("Status: 400 responds with an error for an invalid id", async () => {
    const { body } = await request(app)
      .get("/api/articles/articleone/comments")
      .expect(400);
    expect(body.msg).toBe("Bad request");
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Status: 201 responds with the comment that was posted", async () => {
    const newComment = {
      author: "icellusedkars",
      body: "make way, king of code coming through!",
    };
    const { body: comment } = await request(app)
      .post("/api/articles/8/comments")
      .send(newComment)
      .expect(201);

    expect(comment.author).toEqual(expect.any(String));
    expect(comment.body).toEqual(expect.any(String));
    expect(comment.comment_id).toEqual(expect.any(Number));
    expect(comment.article_id).toEqual(expect.any(Number));
    expect(comment.votes).toEqual(expect.any(Number));
    expect(comment.created_at).toEqual(expect.any(String));
  });
  test("Status: 404 responds with error when a user tries to post a comment to a non-existing article_id", async () => {
    const newComment = {
      author: "icellusedkars",
      body: "make way, king of code coming through!",
    };
    const { body } = await request(app)
      .post("/api/articles/200/comments")
      .send(newComment)
      .expect(404);

    expect(body.msg).toBe("article does not exist");
  });
  test("Status 400 responds with error when a user tries to post a comment to an invalid article_id", async () => {
    const newComment = {
      author: "icellusedkars",
      body: "make way, king of code coming through!",
    };
    const { body } = await request(app)
      .post("/api/articles/eight/comments")
      .send(newComment)
      .expect(400);
    expect(body.msg).toBe("Bad request");
  });
});
