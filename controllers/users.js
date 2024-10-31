const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const Users = require("../models/user");
const BadRequestError = require("../errors/bad-request");
const UnAuthorizedError = require("../errors/unauthorized");
const NotFoundError = require("../errors/not-found");
const ConflictError = require("../errors/conflict");
const { OK, CREATED, INVALID_DATA } = require("../utils/errors");

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      throw new BadRequestError("Email and passwrod are reuired");
      // return res
      //   .status(INVALID_DATA)
      //   .send({ message: "Email and password are required" });
    }

    const user = await Users.findUserByCredentials(email, password);

    if (!user) {
      throw UnAuthorizedError("Invalid email or password");
      // return res
      //   .status(UNAUTHORIZED)
      //   .send({ message: "Invalid email or password" });
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
    return next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);
    if (user) {
      res.send({ data: user });
    } else {
      throw new NotFoundError("User not found");
      // res.status(NOT_FOUND).send({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const responseData = await Users.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true },
    );

    return res.status(OK).send({
      data: {
        name: responseData.name,
        avatar: responseData.avatar,
        email: responseData.email,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid data provided" });
    }
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      throw new ConflictError("Email is already in use");
      // return res.status(CONFLICT).send({ message: "Email is already in use" });
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
        .send({ message: "Invalid data provided" });
    }
    return next(err);
  }
};
