const jwt = require("jsonwebtoken");

const signToken = (data) => {
  const { id, email, role } = data;
  return jwt.sign({ id, email, role }, process.env.TOKEN_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
