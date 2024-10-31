const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const UNAUTHORIZED = require("../errors/unauthorized");

module.exports.authorizationMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return new UNAUTHORIZED("Unauthorized - Missing Token");
    // res
    //   .status(UNAUTHORIZED)
    //   .json({ message:  });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (err) {
    return new UNAUTHORIZED(err.message || "Internal sever error");
    // res
    //   .status(UNAUTHORIZED)
    //   .send({ message:  });
  }
};
