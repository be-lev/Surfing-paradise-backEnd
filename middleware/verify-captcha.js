const cryptoHelper = require("../helpers/crypto-helper");

function verifyCaptcha(request, response, next) {

    if(!request.body.captchaText) {
        response.status(400).send("Missing CAPTCHA");
        return;
    }

    if (cryptoHelper.hash(request.body.captchaText) !== request.cookies.captchaText) {
        response.status(400).send("CAPTCHA not valid!");
        return;
    }

    next();
}

module.exports = verifyCaptcha;