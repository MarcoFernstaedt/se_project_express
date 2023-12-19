const Users = require("../models/user");
const bcrypt = require('bcrypt');
const { NOT_FOUND, SERVER_ERROR, INVALID_DATA } = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.send({ data: users });
  } catch (err) {
    // console.error(`Error getUsers ${err.name} with the message ${err.message} has occurred while executing the code`);
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId);
    if (user) {
      res.send({ data: user });
    } else {
      res.status(NOT_FOUND).send({ message: "User not found" });
    }
  } catch (err) {
    // console.error(`Error getUser ${err.name} with the message ${err.message} has occurred while executing the code`);
    if (err.name === "CastError") {
      res.status(INVALID_DATA).send({ message: "Invalid user ID provided" });
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const existingUser = await  Users.find({email})
    if (!existingUser) {
      return res.status(CONFLICT).send({ message: 'Email is already in use' });
    };

    const hashedPassword = bcrypt.hash(password, 10);

    const user = await Users.create({ name, avatar, email, hashedPassword });
    res.send({ data: user });
  } catch (err) {
    // console.error(`Error createUser ${err.name} with the message ${err.message} has occurred while executing the code`);
    if (err.name === "ValidationError") {
      res
        .status(INVALID_DATA)
        .send({ message: "Invalid data provided for creating a user" });
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

module.exports = { getUsers, getUser, createUser };
