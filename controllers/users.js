const Users = require("../models/user");

module.exports.getUsers = (req, res) => {
  Users.find(req.body)
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "User  Not Found!" }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  Users.create({ name, avatar }).then((user) => res.send({ data: user }));
};
