const express = require("express");
const {
  getTopics,
  getArticleById,
  updateVotes,
  getUsers,
  getArticles,
  getComments,
} = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateVotes);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article/comments", getComments);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(404).send({ status: err.status, msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Sorry, request invalid.." });
});

module.exports = app;
