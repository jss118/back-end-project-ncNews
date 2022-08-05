const express = require("express");
const {
  getTopics,
  getArticleById,
  updateVotes,
  getUsers,
  getArticles,
  getComments,
  postComment,
} = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateVotes);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }

  if (err.code === "23503") {
    if (err.detail.includes("users")) {
      res.status(404).send({ msg: "user does not exist" });
    }
    res.status(404).send({ msg: "article does not exist" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Sorry, request invalid.." });
});

module.exports = app;
