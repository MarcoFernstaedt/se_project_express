const ClothingItems = require("../models/clothingItem");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getClothingItems = async (req, res) => {
  try {
    const items = await ClothingItems.find({});
    res.send({ data: items });
  } catch (err) {
    console.error(
      `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({ message: "Requested clothing item not found" });
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    }
  }
};

module.exports.createClothingItem = async (req, res) => {
  try {
    const { name, weatherType, imageUrl } = req.body;
    const userId = req.user._id;

    const item = await ClothingItems.create({ name, weatherType, imageUrl, owner: userId });
    res.send({ data: item });
  } catch (err) {
    console.error(
      `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === "ValidationError") {
      res.status(INVALID_DATA).send({
        message: "Invalid data provided for creating a clothing item",
      });
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    }
  }
};

module.exports.deleteClothingItem = async (req, res) => {
  try {
    const item = await ClothingItems.findByIdAndDelete(req.params.id);
    res.send({ data: item });
  } catch (err) {
    console.error(
      `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({ message: "Requested clothing item not found" });
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    }
  }
};
