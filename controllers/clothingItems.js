const mongoose = require("mongoose");
const validator = require("validator");
const ClothingItems = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request");
const UnAuthorizedError = require("../errors/unauthorized");
const NotFoundError = require("../errors/not-found");
const ConflictError = require("../errors/conflict");
const ForbiddenError = require("../errors/forbidden");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  CREATED,
  OK,
  FORBIDDEN,
} = require("../utils/errors");

module.exports.getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItems.find({});
    res.send({ data: items });
  } catch (err) {
    next(err);
  }
};

module.exports.createClothingItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const userId = req.user._id;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError(
        "Name, Weather and ImageUrl are required fields",
      );
    }

    // Check if imageUrl is a valid URL
    if (!validator.isURL(imageUrl)) {
      throw new BadRequestError("Invalid imageUrl format");
    }

    // Check if the name meets the minimum length requirement
    if (name.length < 2 || name.length > 30) {
      throw new BadRequestError("Name must be at least 2 characters long");
    }

    const item = await ClothingItems.create({
      name,
      weather,
      imageUrl,
      owner: userId,
    });

    return res.status(CREATED).send({ data: item });
  } catch (err) {
    return next(err);
  }
};

module.exports.deleteClothingItem = async (req, res, next) => {
  try {
    // Find the clothing item by ID
    const item = await ClothingItems.findById(req.params.itemId).orFail(() => {
      // If the item is not found, create and throw a 404 error
      throw new NotFoundError();
    });

    // Check if the logged-in user is the owner of the item
    if (item.owner.toString() !== req.user._id.toString()) {
      // If not, return a 403 (Forbidden) error
      throw new ForbiddenError(
        "You do not have permission to delete this item",
      );
    }

    // If the user is the owner, delete the item and send a success response
    const deletedItem = await item.remove();
    res.send({ data: deletedItem });
  } catch (err) {
    next(err);
  }
};

module.exports.likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new BadRequestError("Invalid Item ID");
      // return res.status(INVALID_DATA).send({ message: "Invalid Item ID" });
    }

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedItem) {
      throw new NotFoundError("Item not found");
    }

    return res.status(OK).send({ data: updatedItem });
  } catch (err) {
    return next(err);
  }
};

module.exports.dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new BadRequestError("Invalid Item ID");
    }

    const updatedItem = await ClothingItems.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError("Item ID not found");
    });

    return res.status(OK).send({ data: updatedItem });
  } catch (err) {
    return next(err);
  }
};
