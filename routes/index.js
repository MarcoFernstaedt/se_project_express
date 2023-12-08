const router = require("express").Router();

const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

// Catch-all non-existant routes.
router.use("*", (req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
