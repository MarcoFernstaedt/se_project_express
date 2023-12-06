const Users = require("../models/user");
const { NOT_FOUND, SERVER_ERROR, INVALID_DATA } = require('../utils/errors');

const getUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.send({ data: users });
  } catch (err) {
    console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
    res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId);
    if (user) {
      res.send({ data: user });
    } else {
      res.status(NOT_FOUND).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
    if (err.name === 'CastError') {
      res.status(INVALID_DATA).send({ message: 'Invalid user ID provided' });
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
      return;
    }
  }
};

const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await Users.create({ name, avatar });
    res.send({ data: user });
  } catch (err) {
    console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
    if (err.name === 'ValidationError') {
      res.status(INVALID_DATA).send({ message: 'Invalid data provided for creating a user' });
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
      return;
    }
  }
};

module.exports = { getUsers, getUser, createUser };
