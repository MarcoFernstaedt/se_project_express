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
      `Error getClothingItems ${err} `,
    );

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

    const item = await ClothingItems.create({
      name,
      weather,
      imageUrl,
      owner: userId,
    });
    res.status(CREATED).send({ data: item });
  } catch (err) {
    console.error(
      `Error ${err}`,
    );

    if (err.name === "ValidationError") {
      res.status(INVALID_DATA).send({
        message: "Invalid data provided for creating a clothing item",
      });
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

module.exports.deleteClothingItem = async (req, res) => {
  try {
    const item = await ClothingItems.findByIdAndDelete(req.params.id).orFail(
      () => {
        const error = new Error("Item ID not found");
        error.statusCode = NOT_FOUND;
        throw error;
      },
    );

    res.status(OK).send({ data: item });
  } catch (err) {
    console.error(
      `Error deleteClothingItem ${err}`,
    );

    if (err.name === "CastError") {
      // Invalid ID provided, return a 400 response
      res
        .status(INVALID_DATA)
        .send({ message: "Invalid clothing item ID provided" });
    } else if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND).send({ message: 'ID not found'})
    } else {
      // Other errors, return a 500 response
      res
        .status(err.statusCode || SERVER_ERROR)
        .send({ message: err.message || "An error has occoured on the Server."});
    }
  }
};

module.exports.likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    // Check if the item exists and was updated
    if (updatedItem === null) {
      return res.status(NOT_FOUND).send({ message: "invalid id" });
    }

    res.status(OK).send({ data: updatedItem });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(NOT_FOUND).send({ message: "Invalid Data was provided." });
    } else if (err.name === "CastError") {
      res.status(INVALID_DATA).send({ message: "Item cannot be found." });
    } else if (err.statusCode= 404) {
      res.status(NOT_FOUND).send({ message: 'Item ID not found'})
    } else {
      res
        .status(err.statusCode || SERVER_ERROR)
        .send({ message: err.message || "An error has occoured on the Server."});
    }
    console.error(
      `Error likeItem ${err} `);
  }
};

module.exports.dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND; // Set the status code to 404
      throw error;
    });

    res.status(OK).send({ data: updatedItem });
  } catch (err) {
    console.error(`Error dislikeItem ${err}`);

    if (err.name === "ValidationError" || err.name === "CastError") {
      res
        .status(INVALID_DATA)
        .send({ message: "Invalid Data or Item not found." }); // Change status code to 400
    } else if (err.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({ message: "Item not found." });
    } else {
      res
        .status(err.statusCode || SERVER_ERROR)
        .send({ message: err.message || "An error has occoured on the Server."});
    }
  }
};
