const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

module.exports.validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .message({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      })
      .required(),
    imageUrl: Joi.string()
      .custom(this.validateURL)
      .message({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      })
      .required(),
  }),
});

module.exports.validateUserInof = celebrate({
  body: Joi.object.keys({
    name: Joi.string
      .min(2)
      .max(30)
      .message({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      })
      .required(),
    avatar: Joi.string()
      .message({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      })
      .required(),
    email: Joi.string()
      .custom(this.validateEmail)
      .message({
        "string.empty": 'The "Email" field must be filled in',
        "string.email": 'the "Email" field must be a valid Email pattern',
      })
      .required(),
    password: Joi.string()
      .message({
        "string.empty": 'The "Passowrd" field must be filled in',
      })
      .required(),
  }),
});

module.exports.validateSigninIngo = celebrate({
  body: Joi.object.keys({
    email: Joi.string()
      .custom(this.validateEmail)
      .message({
        "string.empty": 'The "Email" field must be filled in',
        "string.email": 'the "Email" field must be a valid Email pattern',
      })
      .required(),
    password: Joi.string()
      .message({
        "string.empty": 'The "Passowrd" field must be filled in',
      })
      .required(),
  }),
});
