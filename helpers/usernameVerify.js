const dal = require("../data-access-layer/dal");

async function verifyUsernameAsync(username) {
    try{
const sql = `select username from users where username = '${username}'`
const data = await dal.executeAsync(sql)
return !!data.length //return true or false
}catch(err){
console.log(err+ " something went wrong");
return err
}
  }

  module.exports = {
    verifyUsernameAsync
  };