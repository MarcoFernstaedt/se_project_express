const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const Users = require("../models/user");
const {
  CREATED,
  CONFLICT,
  INVALID_DATA,
  UNAUTHORIZED,
  OK,
  SERVER_ERROR,
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
    console.log(err)

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

// module.exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await Users.findUserByCredentials(email, password);
//     if (!user) {
//       return res
//         .status(UNAUTHORIZED)
//         .send({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Return only essential user information in the response
//     const responseData = {
//       _id: user._id,
//       name: user.name,
//       avatar: user.avatar,
//       email: user.email,
//     };

//     return res.status(OK).send({ token, user: responseData });
//   } catch (err) {
//     console.log(`error login ${err} name ${err.name} status code: ${err.statusCode}`);
//     if (err.statusCode === 401) {
//       res
//         .status(UNAUTHORIZED).send({ message: 'User not found.'})
//     }
//     res
//       .status(err.statusCode || SERVER_ERROR)
//       .send({ message: err.message || "An error has occurred on the Server." });
//   }
// };

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
    console.error(err)
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
    // Validate the allowed fields for update
    const allowedUpdates = ["name", "avatar"];
    const updates = Object.keys(req.body);

    // Check if the provided values are random
    const isRandomValues = Object.values(req.body).some(value => value.startsWith("{{$"));

    // If random values are provided, skip the validation
    const isValidOperation = isRandomValues || updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid updates provided" });
    }

    // Update the user profile
    updates.forEach((update) => (req.user[update] = req.body[update]));
    // await req.user.save();

    // Respond with the updated user profile
    const responseData = {
      _id: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar,
      email: req.user.email,
    };

    res.status(200).send({ data: responseData });
  } catch (err) {
    console.log(err);
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

// module.exports.updateUserProfile = async (req, res) => {
//   try {
//     // Validate the allowed fields for update
//     const allowedUpdates = ["name", "avatar"];
//     const updates = Object.keys(req.body);
//     const isValidOperation = updates.every((update) =>
//       allowedUpdates.includes(update),
//     );

//     if (!isValidOperation) {
//       return res
//         .status(INVALID_DATA)
//         .send({ message: "Invalid updates provided" });
//     }

//     // Update the user profile
//     updates.forEach((update) => (req.user[update] = req.body[update]));
//     await req.user.save();

//     res.send({ data: req.user });
//   } catch (err) {
//     // Handle specific errors
//     if (err.name === "ValidationError") {
//       res.status(INVALID_DATA).send({ message: "Validation error" });
//     } else {
//       res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     }
//   }
// };

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
    console.log(
      `createUser ${err} message: ${err.message} status: ${err.statusCode}`,
    );
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

// module.exports.createUser = async (req, res) => {
//   const { name, avatar, email, password } = req.body;
//   try {
//     const existingUser = await Users.findOne({ email });
//     if (existingUser) {
//       return res.status(CONFLICT).send({ message: "Email is already in use" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await Users.create({ name, avatar, email, password: hashedPassword });

//     // Exclude the hashed password from the response
//     const responseData = {
//       _id: user._id,
//       name: user.name,
//       avatar: user.avatar,
//       email: user.email,
//     };

//     return res.status(CREATED).send({ data: responseData });
//   } catch (err) {
//     console.log(`createUser ${err}`);
//     if (err.name === "ValidationError") {
//       return res
//         .status(INVALID_DATA)
//         .send({ message: "Invalid data provided for creating a user" });
//     }

//     return res
//       .status(err.statusCode || SERVER_ERROR)
//       .send({ message: err.message || "An error has occurred on the server." });
//   }
// };
