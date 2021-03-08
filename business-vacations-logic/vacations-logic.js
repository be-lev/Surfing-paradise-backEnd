const dal = require("../data-access-layer/dal");
const uuid = require("uuid");

async function getAllVacationsAsync() {
  const sql = `SELECT v.*, count(distinct f.userId) as followCount 
  FROM vacations v left outer join followedvacations f 
  on v.vacationId = f.vacationId
  GROUP BY 
  v.destination, v.description, v.fromDate, v.toDate, v.price, v.imageName order by followCount desc`;
  const vacations = await dal.executeAsync(sql);
  return vacations;
}

async function getOneVacationsAsync(id) {
  const sql = `SELECT *
    FROM vacations WHERE vacationId = ${id}`;
  const vacations = await dal.executeAsync(sql);
  return vacations[0];
}

async function addVacationAsync(vacation, image) {
  let newFileName = null;
  //save image at server side
  if (image) {
    const extension = image.name.substr(image.name.lastIndexOf("."));
    newFileName = uuid.v4() + extension;
    await image.mv("./images/" + newFileName);
  }
  const sql = `INSERT INTO vacations VALUES(
        DEFAULT,
        '${vacation.destination}',
        '${vacation.description}',
        '${vacation.fromDate}',
        '${vacation.toDate}',
        '${vacation.price}',
        '${newFileName}'
    )`;

  const info = await dal.executeAsync(sql);
  vacation.vacationId = info.insertId;
  vacation.imageName = newFileName;
  return vacation;
}

async function updateVacationAsync(vacation, image) {
    console.log(vacation);
    let newFileName = null;
    //save image at server side
    if (image) {
      const extension = image.name.substr(image.name.lastIndexOf("."));
      newFileName = uuid.v4() + extension;
      await image.mv("./images/" + newFileName);
    }
  const sql = `UPDATE vacations SET
    destination='${vacation.destination}',
    description='${vacation.description}',
    fromDate= '${vacation.fromDate}',
    toDate= '${vacation.toDate}',
    price= '${vacation.price}'
    '${newFileName}'
    WHERE vacationId = ${vacation.vacationId}`;
    console.log("helloe" + sql);
  const info = await dal.executeAsync(sql);
  vacation.imageName = newFileName;
  return info.affectedRows === 0 ? null : vacation;
}

async function deleteVacationAsync(id) {
  const sql = `DELETE FROM vacations WHERE vacationId= ${id}`;
  await dal.executeAsync(sql);
}

async function AddFollowVacationAsync(followedVacationAndUserObject) {
  const getUserIdFromUuid = `SELECT userId 
                                      FROM users 
                                      WHERE uuid= '${followedVacationAndUserObject.user.uuid}'`;

  const userId = await dal.executeAsync(getUserIdFromUuid);
  const vacationId = followedVacationAndUserObject.singleVacation.vacationId;
  const sql = `INSERT INTO followedvacations (userId, vacationId) 
              VALUES ('${userId[0].userId}', '${vacationId}')`;
  await dal.executeAsync(sql);
}

async function deleteFollowedVacationAsync(id) {
  const sql = `DELETE FROM followedvacations WHERE vacationId= ${id}`;
  await dal.executeAsync(sql);
}



module.exports = {
  getAllVacationsAsync,
  getOneVacationsAsync,
  addVacationAsync,
  updateVacationAsync,
  deleteVacationAsync,
  AddFollowVacationAsync,
  deleteFollowedVacationAsync,

};
