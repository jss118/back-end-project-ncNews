const db = require("../db/connection");
const {
  checkArticleExists,
  checkUsernameExists,
  checkTopicExists,
  checkCommentExists,
} = require("../dbUtils/dbUtils");

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
  return db.query("SELECT * FROM users;").then(({ rows }) => rows);
};

exports.fetchArticles = async (column, order, topic) => {
  if (column === undefined) {
    column = "created_at";
  }
  if (order === undefined) {
    order = "desc";
  }

  if (
    ![
      "title",
      "created_at",
      "topic",
      "author",
      "created_at",
      "votes",
      "comment_count",
      "article_id",
    ].includes(column) ||
    !["asc", "desc"].includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const queryValues = [];

  if (topic !== undefined) {
    const topicExists = await checkTopicExists(topic);

    if (!topicExists) {
      return Promise.reject({ status: 404, msg: "topic does not exist" });
    }
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${column} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => rows);
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
  const articleExists = checkArticleExists(id);
  const usernameExists = checkUsernameExists(comment.author);
  return Promise.all([articleExists, usernameExists])
    .then(() => {
      return db.query(
        "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
        [comment.author, comment.body, id]
      );
    })
    .then(({ rows }) => rows);
};

exports.removeComment = async id => {
  await checkCommentExists(id);
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [id]);
};
