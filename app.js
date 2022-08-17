const express = require("express");
const {
  getTopics,
  getArticleById,
  updateVotes,
  getUsers,
  getArticles,
  getComments,
  postComment,
  deleteComment,
  fetchApi,
} = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateVotes);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api", fetchApi);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    res.status(500).send({ msg: "internal server error" });
  }
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Sorry, request invalid.." });
});

module.exports = app;
