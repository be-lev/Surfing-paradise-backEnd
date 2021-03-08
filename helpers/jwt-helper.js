const jwt = require("jsonwebtoken");

const key = "WingsOfHell";
//enable token login application
function getNewToken(payload) {

    //add properties to the JWT
  return jwt.sign(payload, key, { expiresIn: "30m" });
}

module.exports = {
  getNewToken,
};
