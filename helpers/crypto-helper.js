const crypto = require("crypto");

const salt = "ShhhhThisIsASecret";

//secret password crypto
function hash(plainText) {

    // Hashing with salt:
    return crypto.createHmac("sha512", salt).update(plainText).digest("hex");
}

module.exports = {
    hash
};