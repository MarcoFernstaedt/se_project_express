const express = require("express");
const helmet = require("helmet");
// app setup
const app = express();
const mongoose = require("mongoose");
const routes = require("./routes");

// Connects to database
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// allows server to recieve json
app.use(express.json());

// helmet security
app.use(helmet());

// routes
app.use("/", routes);

// set port
const { PORT = 3001 } = process.env;

// set server to run on PORT
app.listen(PORT);
