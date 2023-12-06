const ClothingItems = require("../models/clothingItem");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR, CREATED, OK } = require("../utils/errors");

module.exports.getClothingItems = async (req, res) => {
  try {
    const items = await ClothingItems.find({});
    res.send({ data: items });
  } catch (err) {
    console.error(
      `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === 'CastError') {
      res.status(INVALID_DATA).send({ message: 'Invalid user ID provided' });
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
      return;
    }
  }
};

module.exports.createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const userId = req.user._id;

    const item = await ClothingItems.create({ name, weather, imageUrl, owner: userId });
    res.status(CREATED).send({ data: item });
  } catch (err) {
    console.error(
      `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === "ValidationError") {
      res.status(INVALID_DATA).send({
        message: "Invalid data provided for creating a clothing item",
      });
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
      return;
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
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
      return;
    }
  }
};

module.exports.likeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const userId = req.user._id;

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    res.status(OK).send({ data: updatedItem });
  } catch (err) {
    console.error(
      `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
    );
    if (err.name === 'ValidationError') {
      res.status(NOT_FOUND).send({ message: "Invalid Data was provided."})
      return;
    } else if (err.name === 'CastError') {
      res.status(INVALID_DATA).send({ message: "Item cannot be found."})
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
      return;
    }
  }
};

module.exports.dislikeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const userId = req.user._id;

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedItem) {
      res.status(NOT_FOUND).send({ message: "Requested clothing item not found" });
      return;
    }

    res.status(OK).send({ data: updatedItem });
  } catch (err) {
    console.error(
      `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
    );
    if (err.name === 'ValidationError') {
      res.status(NOT_FOUND).send({ message: "Invalid Data was provided."})
      return;
    } else if (err.name === 'CastError') {
      res.status(INVALID_DATA).send({ message: "Item cannot be found."})
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
      return;
    }
  }
};
