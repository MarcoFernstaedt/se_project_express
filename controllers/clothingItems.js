const mongoose = require("mongoose");
const validator = require("validator");
const ClothingItems = require("../models/clothingItem");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  CREATED,
  OK,
  FORBIDDEN,
} = require("../utils/errors");

module.exports.getClothingItems = async (req, res) => {
  try {
    const items = await ClothingItems.find({});
    res.send({ data: items });
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

module.exports.createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const userId = req.user._id;

    if (!name || !weather || !imageUrl) {
      return res.status(INVALID_DATA).send({
        message: "Name, weather, and imageUrl are required fields",
      });
    }

    // Check if imageUrl is a valid URL
    if (!validator.isURL(imageUrl)) {
      return res.status(INVALID_DATA).send({
        message: "Invalid imageUrl format",
      });
    }

    // Check if the name meets the minimum length requirement
    if (name.length < 2 || name.length > 30) {
      return res.status(INVALID_DATA).send({
        message: "Name must be at least 2 characters long",
      });
    }

    const item = await ClothingItems.create({
      name,
      weather,
      imageUrl,
      owner: userId,
    });

    return res.status(CREATED).send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(INVALID_DATA).send({
        message: "Invalid data provided for creating a clothing item",
      });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.deleteClothingItem = async (req, res) => {
  try {
    // Find the clothing item by ID
    const item = await ClothingItems.findById(req.params.itemId).orFail(() => {
      // If the item is not found, create and throw a 404 error
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    // Check if the logged-in user is the owner of the item
    if (item.owner.toString() !== req.user._id.toString()) {
      // If not, return a 403 (Forbidden) error
      const error = new Error("You do not have permission to delete this item");
      error.statusCode = FORBIDDEN;
      throw error;
    }

    // If the user is the owner, delete the item and send a success response
    const deletedItem = await item.remove();
    res.send({ data: deletedItem });
  } catch (err) {
    if (err.name === "CastError") {
      // Handle the case where an invalid ID is provided
      res
        .status(INVALID_DATA)
        .send({ message: "Invalid clothing item ID provided" });
    } else if (err.statusCode === NOT_FOUND || err.statusCode === FORBIDDEN) {
      // Handle 404 or 403 errors
      res.status(err.statusCode).send({ message: err.message });
    } else {
      // Handle other errors, return a 500 response
      res.status(err.statusCode || SERVER_ERROR).send({
        message: err.message || "An error has occurred on the Server.",
      });
    }
  }
};

module.exports.likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(INVALID_DATA).send({ message: "Invalid Item ID" });
    }

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedItem) {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    }

    return res.status(OK).send({ data: updatedItem });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid Data was provided." });
    } if (err.name === "CastError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Item cannot be found." });
    } if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    } 
      return res.status(err.statusCode || SERVER_ERROR).send({
        message: err.message || "An error has occurred on the Server.",
      });
    
  }
};

module.exports.dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(INVALID_DATA).send({ message: "Invalid Item ID" });
    }

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.status(OK).send({ data: updatedItem });
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid Data or Item not found." });
    } if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({
        message: "Item not found.",
        statusCode: NOT_FOUND,
      });
    } 
      return res.status(err.statusCode || SERVER_ERROR).send({
        message: err.message || "An error has occurred on the Server.",
      });
    
  }
};
