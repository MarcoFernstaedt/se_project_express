const Users = require("../models/user");
const { USER_NOT_FOUND, SERVER_ERROR, INVALID_DATA } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
      res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(USER_NOT_FOUND).send({ message: 'User not found' });
      }
    })
    .catch((err) => {
      console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
      res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  Users.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(`Error ${err.name} with the message ${err.message} has occurred while executing the code`);
      if (err.name === 'ValidationError') {
        res.status(INVALID_DATA).send({ message: 'Invalid data provided for creating a user' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
      }
    });
};
