const dal = require("../data-access-layer/dal");
const uuid = require("uuid");

//Get all vacations
async function getAllVacationsAsync() {
  const sql = `SELECT v.*, count(distinct f.userId) as followCount 
  FROM vacations v left outer join followedvacations f 
  on v.vacationId = f.vacationId
  GROUP BY 
  v.destination, v.description, v.fromDate, v.toDate, v.price, v.imageName order by followCount desc`;
  const vacations = await dal.executeAsync(sql);
  return vacations;
}

//Get one vacation by id
async function getOneVacationsAsync(id) {
  const sql = `SELECT *
    FROM vacations WHERE vacationId = ${id}`;
  const vacations = await dal.executeAsync(sql);
  return vacations[0];
}

// Add one vacation
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

//Update one vacation
async function updateVacationAsync(vacation, image) {
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
  const info = await dal.executeAsync(sql);
  vacation.imageName = newFileName;
  return info.affectedRows === 0 ? null : vacation;
}

//Delete vacation
async function deleteVacationAsync(id) {
  const sql = `DELETE FROM vacations WHERE vacationId= ${id}`;
  await dal.executeAsync(sql);
}

//Add follow vacation && translate uuid to userId
async function AddFollowVacationAsync(followedVacationAndUserObject) {
  const uuid = followedVacationAndUserObject.user.uuid;
  const vacationId = followedVacationAndUserObject.singleVacation.vacationId;
  const sql = `INSERT INTO followedvacations (userId, vacationId) 
              VALUES ((select userId from users where uuid = '${uuid}'), '${vacationId}')`;
  await dal.executeAsync(sql);
}

//Delete follow && translate uuid to userId
async function deleteFollowedVacationAsync(vacationId, uuid) {
  const sql = `DELETE FROM followedvacations 
  where vacationId = '${vacationId}' 
  and userId = (select userId from users where uuid = '${uuid}')`;
  await dal.executeAsync(sql);
}

//send true or falls by checking if user is following the vacation
async function vacationIsFollowedAsync(vacationId, uuid) {
    const sql = `SELECT count(*) as count
    FROM followedvacations 
    where vacationId = '${vacationId}' 
    and userId = (select userId from users where uuid = '${uuid}')`
    const isFollowedVacation = await dal.executeAsync(sql);
    return !!isFollowedVacation[0].count //true or falls;
  }

module.exports = {
  getAllVacationsAsync,
  getOneVacationsAsync,
  addVacationAsync,
  updateVacationAsync,
  deleteVacationAsync,
  AddFollowVacationAsync,
  deleteFollowedVacationAsync,
  vacationIsFollowedAsync
};
