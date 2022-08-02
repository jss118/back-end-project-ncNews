const express = require("express");
const {
  getTopics,
  getArticleById,
  updateVotes,
} = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateVotes);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Sorry, request invalid.." });
});

module.exports = app;
