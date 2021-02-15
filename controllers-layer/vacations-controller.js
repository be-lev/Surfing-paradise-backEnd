const express = require("express");
const vacationLogic = require("../business-vacations-logic/vacations-logic");
const Vacation = require("../models/vacation");
const path = require("path")
const verifyLoggedIn = require("../middleware/verify-logged-in");
const verifyAdmin = require("../middleware/verify-admin");
const errorsHelper = require("../helpers/errors-helper");
const router = express.Router();


// Get all vacations - all logged-in users can enter:
router.get("/", verifyLoggedIn, async (request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacationsAsync();
        response.json(vacations);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

// Get one vacation - all logged-in users can enter:
router.get("/:id", verifyLoggedIn, async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = await vacationLogic.getOneVacationsAsync();
        if(!vacation) {
            response.status(404).send(`id ${id} not found.`);
            return;
        }response.json(vacation);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

// POST: Add new vacation - only admin can enter: 
router.post("/", verifyAdmin, async (request, response) => {
    try {
        const vacation = new Vacation(request.body);
        const error = vacation.validatePost();
        if(error) {
            response.status(400).send(errorsHelper.getError(err));
            return;
        }
        const addedVacation = await vacationLogic.addVacationAsync(vacation, request.files ? request.files.image : null);
        response.status(201).json(addedVacation);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});


//PUT - update full vacation  - only admin can enter:
router.put("/:id", verifyAdmin,async (request, response) => {
    try {
        const vacation = new Vacation(request.body);
        vacation.id = +request.params.id;
        const error = vacation.validatePut();
        if(error) {
            response.status(400).send(errorsHelper.getError(err));
            return;
        }
        const updatedVacation = await vacationLogic.updateVacationAsync(vacation);
        if(!updatedVacation) {
            response.status(404).send(`id ${vacation.id} not found.`);
            return;
        }
        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});


// DELETE  - delete vacation  - only admin can enter
router.delete("/:id", verifyAdmin, async (request, response) => {
    try {
        const id = +request.params.id;
        await vacationLogic.deleteVacationAsync(id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

//get image from image folder into URL
router.get("/images/:imageName", verifyLoggedIn, (request, response) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "images", imageName);
        response.sendFile(absolutePath);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;

