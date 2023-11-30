const router = require('express').Router();

const userRoutes = require('./users');
const clothingItemRoutes = require('./clothingItems');

router.use('/users', userRoutes);
router.use('/items', clothingItemRoutes);

// Catch-all non-existant routes.
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Requested resource not found' })
});

module.exports = router;