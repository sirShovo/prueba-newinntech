const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6h" });
}

const validateToken = (req, res, next) => {
  const accessToken = req.headers['authorization'] || req.query.accessToken;
  if (!accessToken) res.send('Access denied');

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.send('Access denied, token expired or incorrect');
    } else {
      req.user = user;
      next();
    }
  });
}

const getDataToken = (token) => {
  let data = null;
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Error, we can't get the token information");
    } else {
      data = user;
    }
  });
  return data;
}

module.exports = {
  generateAccessToken,
  validateToken,
  getDataToken
}
