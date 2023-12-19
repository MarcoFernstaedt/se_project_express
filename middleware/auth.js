const jwt = require("jsonwebtoken");
const { UNAUTHORIZED, SERVER_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.authorizationMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Unauthorized - Missing Token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    res
      .status(err.statusCode || SERVER_ERROR)
      .send({ message: err.message || "Internal sever error" });
  }
};
