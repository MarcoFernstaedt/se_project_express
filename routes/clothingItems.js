const router = require("express").Router();
const { authorizationMiddleware } = require("../middlewares/auth");
const { validateId } = require("../middlewares/validation");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", authorizationMiddleware, createClothingItem);
router.delete(
  "/:itemId",
  validateId,
  authorizationMiddleware,
  deleteClothingItem,
);
router.put("/:itemId/likes", validateId, authorizationMiddleware, likeItem);
router.delete(
  "/:itemId/likes",
  validateId,
  authorizationMiddleware,
  dislikeItem,
);

module.exports = router;
