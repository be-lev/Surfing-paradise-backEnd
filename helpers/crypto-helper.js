const crypto = require("crypto");

const salt = "ShhhhThisIsASecret";

function hash(plainText) {

    // Hashing with salt:
    return crypto.createHmac("sha512", salt).update(plainText).digest("hex");
}

module.exports = {
    hash
};