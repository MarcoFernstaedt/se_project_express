require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// app setup
const app = express();
// database setup
const mongoose = require("mongoose");
// input validation
const { errors } = require("celebrate");
// routes setup
const routes = require("./routes");
// loggers
const { requestLogger, errorLogger } = require("./middlewares/logger");
// Centralized Error Handling
const errorHandlingMiddleWare = require("./middlewares/error");

// Connects to database
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// allows server to recieve json
app.use(express.json());

// helmet security
app.use(helmet());
// cors to secure api request
app.use(cors());

// request logs
app.use(requestLogger);

// routes
app.use("/", routes);

// error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// set port
const { PORT = 3001 } = process.env;

// Centralized Error Handling
app.use(errorHandlingMiddleWare);

// set server to run on PORT
app.listen(PORT);
