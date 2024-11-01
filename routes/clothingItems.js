const router = require("express").Router();
const { authorizationMiddleware } = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", authorizationMiddleware, validateCardBody, createClothingItem);
router.delete(
  "/:itemId",
  authorizationMiddleware,
  validateId,
  deleteClothingItem,
);
router.put("/:itemId/likes", validateId, authorizationMiddleware, likeItem);
router.delete(
  "/:itemId/likes",
  authorizationMiddleware,
  validateId,
  dislikeItem,
);

module.exports = router;
