const dal = require("../data-access-layer/dal")
const uuid = require("uuid");

async function getAllVacationsAsync(){
const sql = `SELECT vacationId, destination, description, fromDate, toDate, imageFileName FROM vacations`
const vacations = await dal.executeAsync(sql);
return vacations;
}

async function getOneVacationsAsync(id) {
    const sql = `SELECT vacationId, destination,
    fromDate, toDate, imageFileName
    FROM vacations WHERE vacationId = ${id}`;
    const vacations = await dal.executeAsync(sql);
    return vacations[0];
}


async function addVacationAsync(vacation,image){

    let newFileName = null;
    if(image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        newFileName = uuid.v4() + extension;
        await image.mv("./images/" + newFileName);
    }

    const sql= `INSERT INTO vacations(destination, description, fromDate, toDate, imageFileName) VALUES(
        DEFAULT,
        '${vacation.destination}',
        '${vacation.description}',
        '${vacation.fromDate}',
        '${vacation.toDate}',
        '${newFileName}'
    )`;
    const info = await dal.executeAsync(sql);
    vacation.vacationId = info.insertId;
    product.imageFileName = newFileName;
    return vacation
}

async function updateVacationAsync(vacation){
    const sql= `UPDATE vacations SET
    destination='${vacation.destination}',
    description='${vacation.description}',
    fromDate= '${vacation.fromDate}',
    toDate='${vacation.toDate}'
    WHERE vacationId = ${vacation.vacationId}`;
    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : vacation;
}

async function deleteVacationAsync(id){
    const sql = `DELETE FROM vacations WHERE vacationId= ${id}`
    await dal.executeAsync(sql)
}



module.exports = {
    getAllVacationsAsync,
    getOneVacationsAsync,
    addVacationAsync,
    updateVacationAsync,
    deleteVacationAsync
}