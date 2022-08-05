const db = require("../db/connection");

exports.checkArticleExists = async id => {
  const dbOutput = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [id]
  );
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "article does not exist" });
  }
  return true;
};

exports.checkUsernameExists = async username => {
  const dbOutput = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "user does not exist" });
  }
  return true;
};
