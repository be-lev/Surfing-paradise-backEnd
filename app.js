global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const fileUpload = require("express-fileupload");
const expressRateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require ("cors");
const sanitize = require("./middleware/sanitize");
const socketHelper = require("./helpers/socket-helper");
const server = express(); 
const path= require("path");
const authController = require("./controllers-layer/auth-controller");
const usersController = require("./controllers-layer/users-controller");
const vacationsController = require("./controllers-layer/vacations-controller");


// Defend against DOS attack:
server.use("/api/vacations", expressRateLimit({
    windowMs: 3000, // 1 sec window
    max: 50, // limit each IP to 2 requests per windowMs
    message: "Hi m8 how are you? you feeling kinda strange to me..."
}));


// server.use(cookieParser()); // Enable sending an receiving cookies from the front:
server.use(express.json()); // Create "body" property from the given JSON.
server.use(sanitize); // Strip Tags:
server.use(cors()) // Enable CORS
server.use(fileUpload()); // Middleware for getting files sent from the client:

server.use("/api/auth", authController);
server.use("/api/users", usersController);
server.use("/api/vacations", vacationsController);


const port= process.env.port || 3001

const expressListener = server.listen(port, () => console.log("Listening to " + port + "..."));
socketHelper.init(expressListener);