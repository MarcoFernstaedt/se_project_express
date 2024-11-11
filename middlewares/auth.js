const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.authorizationMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return new UnauthorizedError("UnauthorizedError - Missing Token");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (err) {
    return new UnauthorizedError("UnauthorizedError - Invalid Token");
  }
};
