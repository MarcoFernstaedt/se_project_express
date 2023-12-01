const ClothingItems = require('../models/clothingItem');

module.exports.getClothingItems = (req, res) => {
  ClothingItems.find({})
};

module.exports.createClothingItem = (req, res) => {
  // const { name, weatherType, imageUrl, _id } = req.body
  console.log(req.user._id)
  // ClothingItems.create({ name, weatherType, imageUrl, _id })
  //   .then((item) => res.send({ data: item}))
  //   .catch((err) => res.status(500).send({ message: 'Error'}))
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItems.findByIdAndDelete(req.params.id)
    .then((item) => res.send({ data: item}))
    .catch((err) => res.status(500).send({ message: 'Error'}))
};