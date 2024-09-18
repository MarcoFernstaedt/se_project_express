const router = require("express").Router();
// Importing routes
const { login, createUser } = require("../controllers/users");
const {
  validateCardBody,
  validateUserBody,
  validateLoginBody,
} = require("../middlewares/validation");
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
// Importing error codes
const { NOT_FOUND } = require("../utils/errors");

// Routes
router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", validateUserBody, userRoutes);
router.use("/items", validateCardBody, clothingItemRoutes);

// Catch-all non-existant routes.
router.use("*", (req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
