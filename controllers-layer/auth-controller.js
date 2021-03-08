const express = require("express");
const authLogic = require("../business-vacations-logic/auth-logic");
const router = express.Router();
const errorsHelper = require("../helpers/errors-helper");
const svgCaptcha = require("svg-captcha");
const cryptoHelper = require("../helpers/crypto-helper");
const verifyCaptcha = require("../middleware/verify-captcha");
const verifyLoggedIn = require("../middleware/verify-logged-in");
// GET /api/auth/captcha
router.get("/captcha", (request, response) => {

    const captcha = svgCaptcha.create();
    const captchaText = captcha.text; // text
    const captchaImage = captcha.data; // image

    // Send back the hashed text in a cookie: 
    response.cookie("captchaText", cryptoHelper.hash(captchaText), { maxAge: 1000 * 60 * 5 });

    // Send back the CAPTCHA image: 
    response.type("svg").send(captchaImage);
});

// Verify user captcha:
router.post("/register", async (request, response) => {
    try {
        const newUser = request.body
        const addedUser = await authLogic.registerAsync(newUser);
        response.status(201).json(addedUser);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/login", async (request, response) => {
    try {
        const loggedInUser = await authLogic.loginAsync(request.body);
        if (!loggedInUser) return response.status(401).send("Incorrect username or password.");
        response.json(loggedInUser);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.get("/isJwt",verifyLoggedIn, (request, response) => {
  response.send("Green light")
});

module.exports = router;