const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/:userId", getUser);

router.post("/users", createUser);

router.use((req, res, next) => {
  res.status(404).json({ message: "Requested resource not found" });
});
