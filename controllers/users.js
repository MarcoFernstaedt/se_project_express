const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const Users = require("../models/user");
const {
  NOT_FOUND,
  INVALID_DATA,
  UNAUTHORIZED,
  OK,
  SERVER_ERROR,
  CONFLICT,
  CREATED,
} = require("../utils/errors");

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(INVALID_DATA)
        .send({ message: "Email and password are required" });
    }

    const user = await Users.findUserByCredentials(email, password);

    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return only essential user information in the response
    const responseData = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };

    return res.status(OK).send({ token, user: responseData });
  } catch (err) {
    // Add specific handling for 401 status code
    if (err.statusCode === 401) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password." });
    }

    // General error handling
    return res
      .status(err.statusCode || SERVER_ERROR)
      .send({ message: err.message || "An error has occurred on the Server." });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.send({ data: users });
  } catch (err) {
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
    if (err.name === "CastError") {
      res.status(INVALID_DATA).send({ message: "Invalid user ID provided" });
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const responseData = Users.findByIdAndUpdate(req.body._id, { name, avatar}, {new: true, runValidators: true})

    return res.status(OK).send({ data: responseData });
  } catch (err) {
    // Handle specific errors
    if (err.name === "ValidationError") {
      return res.status(INVALID_DATA).send({ message: "Validation error" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(CONFLICT).send({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    // Exclude the hashed password from the response
    const responseData = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };

    return res.status(CREATED).send({ data: responseData });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid data provided for creating a user" });
    }

    // Add specific handling for 409 status code
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(CONFLICT).send({ message: "Email is already in use" });
    }

    return res
      .status(err.statusCode || SERVER_ERROR)
      .send({ message: err.message || "An error has occurred on the server." });
  }
};
