const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Yout must enter a valid Email address",
    },
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 30,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, this.password).then((matched) => {
        if (!matched) {
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
