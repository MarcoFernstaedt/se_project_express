const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const {
  NOT_FOUND,
  SERVER_ERROR,
  INVALID_DATA,
  CREATED,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findUserByCredentials(email, password);
    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(CREATED).send({ token, user });
  } catch (err) {
    console.log(`error login ${err}`);
    res
      .status(err.statusCode || SERVER_ERROR)
      .send({ message: err.message || "An error has occoured on the Server." });
  }
};

module.exports.getUsers = async (req, res) => {
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

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);
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

// controllers/users.js

module.exports.updateUserProfile = async (req, res) => {
  try {
    // Validate the allowed fields for update
    const allowedUpdates = ["name", "avatar"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid updates provided" });
    }

    // Update the user profile
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send({ data: req.user });
  } catch (err) {
    // Handle specific errors
    if (err.name === "ValidationError") {
      res.status(INVALID_DATA).send({ message: "Validation error" });
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

module.exports.createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return res.status(CONFLICT).send({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({ name, avatar, email, password: hashedPassword });
    const { password: hashedPasswordInResponse, ...userWithoutPassword } = user.toObject();
    res.status(CREATED).send({ data: userWithoutPassword });
  } catch (err) {
    console.log(`createUser ${err}`)
    if (err.name === "ValidationError") {
      res
        .status(INVALID_DATA)
        .send({ message: "Invalid data provided for creating a user" });
    } else {
      res
        .status(err.statusCode || SERVER_ERROR)
        .send({ message: err.message || "An error has occurred on the server." });
    }
  }
};
