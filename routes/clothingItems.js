const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);

router.post("/", createClothingItem);

router.delete("/:itemid", deleteClothingItem);

module.exports = router;