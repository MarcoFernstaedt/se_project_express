const ClothingItems = require("../models/clothingItem");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  CREATED,
  OK,
} = require("../utils/errors");

module.exports.getClothingItems = async (req, res) => {
  try {
    const items = await ClothingItems.find({});
    res.send({ data: items });
  } catch (err) {
    console.error(
      `Error getClothingItems ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === "CastError") {
      res.status(INVALID_DATA).send({ message: "Invalid user ID provided" });
      return;
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
      return;
    }
  }
};

module.exports.createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const userId = req.user._id;

    const item = await ClothingItems.create({
      name,
      weather,
      imageUrl,
      owner: userId,
    });
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
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
      return;
    }
  }
};

module.exports.deleteClothingItem = async (req, res) => {
  try {
    const item = await ClothingItems.findByIdAndDelete(req.params.id)
      .orFail(() => {
        const error = new Error("Item ID not found");
        error.statusCode = 404;
        throw error;
      })
      .then((item) => {
        res.status(OK).send({ data: item });
      });

    // if (!item) {
    //   // Item not found, return a 404 response
    //   res.status(NOT_FOUND).send({ message: "Requested clothing item not found" });
    //   return;
    // }
  } catch (err) {
    console.error(
      `Error deleteClothingItem ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === "CastError") {
      // Invalid ID provided, return a 400 response
      res
        .status(INVALID_DATA)
        .send({ message: "Invalid clothing item ID provided" });
    } else {
      // Other errors, return a 500 response
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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
      { new: true },
    )
      .orFail(() => {
        const error = new Error("Item ID not found");
        error.statusCode = NOT_FOUND;
        throw error;
      })
      .then((updatedItem) => {
        res.status(OK).send({ data: updatedItem });
      });
  } catch (err) {
    console.error(
      `Error likeItem ${err.name} with the message ${err.message} has occurred while executing the code`,
    );
    if (err.name === "ValidationError") {
      res.status(NOT_FOUND).send({ message: "Invalid Data was provided." });
      return;
    } else if (err.name === "CastError") {
      res.status(INVALID_DATA).send({ message: "Item cannot be found." });
      return;
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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
      { new: true },
    )
      .orFail(() => {
        const error = new Error("Item ID not found");
        error.statusCode = 400;
        throw error;
      })
      .then((updatedItem) => {
        res.status(OK).send({ data: updatedItem });
      });

    // if (!updatedItem) {
    //   res.status(NOT_FOUND).send({ message: "Requested clothing item not found" });
    //   return;
    // }
  } catch (err) {
    console.error(
      `Error dislikeItem ${err.name} with the message ${err.message} has occurred while executing the code`,
    );

    if (err.name === "ValidationError" || err.name === "CastError") {
      res
        .status(NOT_FOUND)
        .send({ message: "Invalid Data or Item not found." });
      return;
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
      return;
    }
  }
};
