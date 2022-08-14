const e = require("express");
const {
  fetchTopics,
  fetchArticle,
  fetchUpdatedArticle,
  fetchUsers,
  fetchArticles,
  fetchComments,
  sendComment,
  removeComment,
} = require("../models/app.model");

exports.getTopics = (req, res) => {
  fetchTopics().then(topics => res.send(topics));
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticle(id)
    .then(([article]) => {
      res.send(article);
    })
    .catch(err => next(err));
};

exports.updateVotes = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body.inc_votes;
  fetchUpdatedArticle(id, votes)
    .then(([article]) => res.send(article))
    .catch(err => next(err));
};

exports.getUsers = (req, res) => {
  fetchUsers().then(users => res.send(users));
};

exports.getArticles = (req, res, next) => {
  const column = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;

  fetchArticles(column, order, topic)
    .then(articles => res.send(articles))
    .catch(err => next(err));
};

exports.getComments = (req, res, next) => {
  const id = req.params.article_id;
  fetchComments(id)
    .then(comments => res.send(comments))
    .catch(err => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const id = req.params.article_id;
  const comment = req.body;

  sendComment(id, comment)
    .then(([sentComment]) => res.status(201).send(sentComment))
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;

  removeComment(id)
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
};
