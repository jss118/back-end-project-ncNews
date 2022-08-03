const {
  fetchTopics,
  fetchArticle,
  fetchUpdatedArticle,
  fetchUsers,
} = require("../models/app.model");

exports.getTopics = (req, res) => {
  fetchTopics().then(topics => res.send(topics));
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticle(id)
    .then(article => {
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
