const router = require("express").Router();
// Importing routes
const { login, createUser } = require("../controllers/users");
const {
  validateUserBody,
  validateLoginBody,
} = require("../middlewares/validation");
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
// Importing error codes
const NotFoundError = require("../errors/not-found");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Routes
router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

// Catch-all non-existant routes.
router.use("*", () => {
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
