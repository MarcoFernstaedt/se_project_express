const router = require("express").Router();
// importing controllers
const {
  getCurrentUser,
  getUsers,
  createUser,
} = require("../controllers/users");
// importingg auth middleware
const { authorizationMiddleware } = require("../middleware/auth");

// routes
router.get("/users/me", authorizationMiddleware, getCurrentUser);

module.exports = router;
