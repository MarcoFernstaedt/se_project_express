const router = require("express").Router();
// importing controllers
const {
  getCurrentUser,
  updateUserProfile,
  // getUsers,
  // createUser,
} = require("../controllers/users");
// importingg auth middleware
const { authorizationMiddleware } = require("../middleware/auth");

// routes
router.get("/users/me", authorizationMiddleware, getCurrentUser);
router.patch("/users/me", authorizationMiddleware, updateUserProfile);

module.exports = router;
