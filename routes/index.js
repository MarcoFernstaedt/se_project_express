const router = require("express").Router();
// Importing routes
// const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
// Iporting error codes
const { NOT_FOUND } = require("../utils/errors");

// Routes
app.post('/signin', login);
app.post('/signup', createUser);

// router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

// Catch-all non-existant routes.
router.use("*", (req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
