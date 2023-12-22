const router = require("express").Router();
// importing controllers
const {
  getCurrentUser,
  updateUserProfile,
  // getUsers,
  // createUser,
} = require("../controllers/users");
// importingg auth middleware
const { authorizationMiddleware } = require("../middlewares/auth");

// routes
router.get("/me", authorizationMiddleware, getCurrentUser);
router.patch("/me", authorizationMiddleware, updateUserProfile);

module.exports = router;
