const ClothingItems = require('../models/clothingItem');

module.exports.getClothingItems = (req, res) => {
  ClothingItems.find(req.body)
};

module.exports.createClothingItem = (req, res) => {
  const { name, weatherType, imageUrl, userId } = req.body

  ClothingItems.create({ name, weatherType, imageUrl, userId })
    .then((item) => res.send({ data: item}))
    .catch((err) => res.status(500).send({ message: 'Error'}))
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItems.findByIdAndDelete(req.params.id)
    .then((item) => res.send({ data: item}))
    .catch((err) => res.status(500).send({ message: 'Error'}))
};