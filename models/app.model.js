const db = require("../db/connection");
const { checkArticleExists } = require("../dbUtils/dbUtils");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => rows);
};

exports.fetchArticle = id => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ;",
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }

      return rows;
    });
};

exports.fetchUpdatedArticle = (id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votes, id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows;
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows }) => rows);
};

exports.fetchComments = id => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length) {
        return rows;
      } else {
        return checkArticleExists(id).then(exists => {
          if (exists) return rows;
        });
      }
    });
};

exports.sendComment = (id, comment) => {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
      [comment.author, comment.body, id]
    )
    .then(({ rows }) => {
      return checkArticleExists(id).then(exists => {
        if (exists) return rows;
      });
    });
};
