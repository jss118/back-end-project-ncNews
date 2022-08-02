const { fetchTopics } = require("../models/app.model");

exports.getTopics = (req, res, next) => {
  fetchTopics().then(topics => res.send(topics));
};
