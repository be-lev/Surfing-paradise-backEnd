const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");
const uuid = require("uuid");
const jwtHelper = require("../helpers/jwt-helper");

async function registerAsync(user) {

    // Hash user password: 
    user.password = cryptoHelper.hash(user.password);

    // Create new UUID for that user: 
    user.uuid = uuid.v4();

    // Solve SQL injection:
    const sql = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?, DEFAULT)";

     await dal.executeAsync(sql, [user.uuid, user.firstName, user.lastName, user.username, user.password]);

   
    // Delete the password: 
    delete user.password;

    // Generate JWT token to return to frontend:
    user.token = jwtHelper.getNewToken({ user });

    return user;
}

async function loginAsync(credentials) {

    // Hash user password: 
    credentials.password = cryptoHelper.hash(credentials.password);

    // Solve SQL injection by sending sql + values:
    const sql = "SELECT uuid, firstName, lastName, username, isAdmin FROM users WHERE username = ? AND password = ?";

    const users = await dal.executeAsync(sql, [credentials.username, credentials.password]);
    if (users.length === 0) return null;
    const user = users[0];

    // Generate JWT token to return to frontend:
    user.token = jwtHelper.getNewToken({ user });

    return user;
}

module.exports = {
    registerAsync,
    loginAsync
};