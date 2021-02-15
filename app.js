global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const fileUpload = require("express-fileupload");
const expressRateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require ("cors");
const sanitize = require("./middleware/sanitize");
const server = express(); 
const path= require("path");
const authController = require("./controllers-layer/auth-controller");
const usersController = require("./controllers-layer/users-controller");
const vacationsController = require("./controllers-layer/vacations-controller");


// Defend against DOS attack:
server.use("/api/", expressRateLimit({
    windowMs: 1000, // 1 sec window
    max: 2, // limit each IP to 2 requests per windowMs
    message: "Hi m8 how are you? you feeling kinda of strange to me..."
}));


server.use(cookieParser()); // Enable sending an receiving cookies from the front:
server.use(express.json()); // Create "body" property from the given JSON.
server.use(sanitize); // Strip Tags:
server.use(cors()) // Enable CORS


server.use(express.static(path.join(__dirname, "./frontend")));
server.use(fileUpload());

server.use("/api/auth", authController);
server.use("/api/users", usersController);
server.use("/api/vacations", vacationsController);

// react front end 
server.use("*", (request, response) => {
    //response.status(404).send("Route not found");
    response.sendFile(path.join(__dirname + "./frontend/index.html"))
});

// server.get("/users/edit/:uuid", (request, response) => response.sendFile(__dirname + "./frontend/edit.html"));
// server.get("/login", (request, response) => response.sendFile(__dirname + "./frontend/login.html"));
// server.get("/register", (request, response) => response.sendFile(__dirname + "./frontend/register.html"));


const port= process.env.port || 3001

server.listen(port, () => console.log("Listening to" + port +"..."));