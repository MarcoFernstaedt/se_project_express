# WTWR (What to Wear?) - Backend

## Overview
This project serves as the backend setup for the "WTWR" (What to Wear?) application. The primary goal is to establish a server using Express, connect it to a MongoDB database, and configure routes and controllers for handling API functionality. Additionally, this project focuses on incorporating security measures using the Helmet middleware and follows best practices for coding and linting.

##Live Site##
- **Front-End: https://www.wtwrweatherapp.twilightparadox.com

## Scripts
- **Start Server**: `npm start` (Runs the server using `node app.js`).
- **Development Mode**: `npm run dev` (Runs the server in development mode using `nodemon`).
- **Linting**: `npm run lint` (Checks and lints the code using ESLint).

## Technologies Used
- **Express.js**: A minimalist web framework for Node.js.
- **Helmet**: A middleware to secure HTTP headers for enhanced security.
- **MongoDB**: A NoSQL database for efficient data storage.
- **Mongoose**: An ODM library for MongoDB and Node.js.
- **Validator**: A library for data validation.
- **bcrypt**: A library for hashing passwords.
- **jsonwebtoken**: Allows use of JWT for authentication.
- **CORS**:

## Development Setup
1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up your MongoDB connection and configure it in the appropriate environment file.
4. Run the server using either `npm start` or `npm run dev` for development.

## Dependencies
- **express**: ^4.18.2
- **helmet**: ^7.1.0
- **mongoose**: ^6.6.1
- **validator**: ^13.11.0

## Development Dependencies
- **eslint**: ^8.54.0
- **eslint-config-airbnb-base**: ^15.0.0
- **eslint-config-prettier**: ^9.0.0
- **eslint-plugin-import**: ^2.29.0
- **nodemon**: ^3.0.1
- **prettier**: ^3.1.0

## Author
- Marco Fernstaedt

---
