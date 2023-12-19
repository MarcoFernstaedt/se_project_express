const router = require("express").Router();
const { authorizationMiddleware } = require("../middleware/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", authorizationMiddleware, createClothingItem);
router.delete("/:itemId", authorizationMiddleware, deleteClothingItem);
router.put("/:itemId/likes", authorizationMiddleware, likeItem);
router.delete("/:itemId/likes", authorizationMiddleware, dislikeItem);

module.exports = router;
