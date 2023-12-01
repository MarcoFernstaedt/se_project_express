const ClothingItems = require("../models/clothingItem");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
      );
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND)
          .send({ message: "Requested clothing item not found" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weatherType, imageUrl } = req.body;
  const userId = req.user._id;

  ClothingItems.create({ name, weatherType, imageUrl, owner: userId })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
      );
      if (err.name === "ValidationError") {
        res
          .status(INVALID_DATA)
          .send({
            message: "Invalid data provided for creating a clothing item",
          });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItems.findByIdAndDelete(req.params.id)
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
      );
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND)
          .send({ message: "Requested clothing item not found" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
