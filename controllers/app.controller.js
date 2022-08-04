const {
  fetchTopics,
  fetchArticle,
  fetchUpdatedArticle,
  fetchUsers,
  fetchArticles,
  fetchComments,
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

exports.getArticles = (req, res) => {
  fetchArticles().then(articles => res.send(articles));
};

exports.getComments = (req, res, next) => {
  const id = req.params.article;
  fetchComments(id)
    .then(comments => res.send(comments))
    .catch(err => next(err));
};
