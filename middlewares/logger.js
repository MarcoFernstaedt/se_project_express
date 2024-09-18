const winston = require("winston");
const expressWinston = require("express-winston");

// const messageFormat = winston.format.combine(
//   winston.format.timestamp(),
//   winston.format.printf(
//     ({ level, message, meta, timestamp }) =>
//       `${timestamp} ${level}: ${meta.error?.stack || message}`,
//   ),
// );

// create a request logger
module.exports.requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
});

// error logger
module.exports.errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});
