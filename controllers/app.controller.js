const { fetchTopics, fetchArticle } = require("../models/app.model");

exports.getTopics = (req, res) => {
  fetchTopics().then(topics => res.send(topics));
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticle(id)
    .then(([article]) => {
      if (!article) {
        res.status(404).send({ msg: "Sorry, endpoint doesn't exist" });
      }
      res.send(article);
    })
    .catch(next);
};
