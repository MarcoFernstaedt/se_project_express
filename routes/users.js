const router = require("express").Router();
// importing controllers
const { getUsers, getUser, createUser } = require("../controllers/users");

module.exports = router;
