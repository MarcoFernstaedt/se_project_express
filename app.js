const express = require("express");
const app = express();
const userRoutes = require('./routes/users');
const clothingItemRoutes = require('./routes/clothingItems');

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use('/users', userRoutes);
app.use('/items', clothingItemRoutes);

// Catch-all non-existant routes.
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Requested resource not found' })
});

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
  console.log('hot reload test.')
});
