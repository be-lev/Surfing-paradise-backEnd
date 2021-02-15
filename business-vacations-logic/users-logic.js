const dal = require("../data-access-layer/dal");

async function getOneUserAsync(uuid) {
    // Don't get back password, don't get back id (only uuid):
    const sql = `SELECT uuid, firstName, lastName, username, isAdmin FROM users WHERE uuid = '${uuid}'`;
    const users = await dal.executeAsync(sql);
    return users[0];
}

async function updateUserAsync(user) {

    // Get user by uuid and not by id:
    const sql = `UPDATE users SET firstName = '${user.firstName}', lastName = '${user.lastName}', username = '${user.username}' WHERE uuid = '${user.uuid}'`;
    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : user;
}

module.exports = {
    getOneUserAsync,
    updateUserAsync
};