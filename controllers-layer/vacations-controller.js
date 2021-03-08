const express = require("express");
const vacationLogic = require("../business-vacations-logic/vacations-logic");
const Vacation = require("../models/vacation");
const path = require("path");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const verifyAdmin = require("../middleware/verify-admin");
const errorsHelper = require("../helpers/errors-helper");
const socketHelper = require("../helpers/socket-helper");
const router = express.Router();

// Get all vacations - all logged-in users can enter:
router.get("/", verifyLoggedIn, async (request, response) => {
  try {
    const vacations = await vacationLogic.getAllVacationsAsync();
    response.json(vacations);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

// Get one vacation - all logged-in users can enter:
router.get("/:id", verifyLoggedIn, async (request, response) => {
  try {
    const id = +request.params.id;
    const vacation = await vacationLogic.getOneVacationsAsync(id);
    if (!vacation) {
      response.status(404).send(`id ${id} not found.`);
      return;
    }
    response.json(vacation);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

// POST: Add new vacation - only admin can enter:
router.post("/", verifyAdmin, async (request, response) => {
  try {
    const vacation = new Vacation(request.body);
    const error = vacation.validatePost();
    if (error) {
      response.status(400).send(error);
      return;
    }
    const addedVacation = await vacationLogic.addVacationAsync(
      vacation,
      request.files ? request.files.image : null
    );
    response.status(201).json(addedVacation);
    // Send socket.io added message to front:
    socketHelper.vacationAdded(addedVacation);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

//PUT - update full vacation  - only admin can enter:
router.put("/:id", verifyAdmin, async (request, response) => {
  try {
    const vacation = new Vacation(request.body);
    vacation.vacationId = +request.params.id;
    const error = vacation.validatePut();
    if (error) {
      response.status(400).send("Validation error: " + error);
      return;
    }
    const updatedVacation = await vacationLogic.updateVacationAsync(
      vacation,
      request.files ? request.files.image : null
    );
    if (!updatedVacation) {
      response.status(404).send(`id ${vacation.vacationId} not found.`);
      return;
    }
    response.json(updatedVacation);
    // Send socket.io added message to front:
    socketHelper.vacationUpdated(updatedVacation);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

// DELETE  - delete vacation  - only admin can enter
router.delete("/:id", verifyAdmin, async (request, response) => {
  try {
    const id = +request.params.id;
    await vacationLogic.deleteVacationAsync(id);
    response.sendStatus(204);
    // Send socket.io added message to front:
    socketHelper.vacationDeleted(id);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

//get image from image folder into URL - all logged in users
router.get("/images/:imageName", (request, response) => {
  try {
    const imageName = request.params.imageName;
    const absolutePath = path.join(__dirname, "..", "images", imageName);

    response.sendFile(absolutePath);
  } catch (err) {
    response.status(500).send(err.message);
  }
});

router.post("/followVacation", verifyLoggedIn, async (request, response) => {
  try {
    const followedVacationAndUserObject = request.body;
    const addedFollowedVacation = await vacationLogic.AddFollowVacationAsync(
      followedVacationAndUserObject
    );

    response.status(201).json(addedFollowedVacation);
    //Todo: updated socket
    socketHelper.VacationFollowed(addedFollowedVacation);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

router.delete(
  "/followVacation/:id",
  verifyLoggedIn,
  async (request, response) => {
    try {
      const id = +request.params.id;
      await vacationLogic.deleteFollowedVacationAsync(id);
      response.sendStatus(204);
      // Send socket.io added message to front:
      //Todo: updated socket
      // socketHelper.vacationFollowedDeleted(id)
    } catch (err) {
      response.status(500).send(errorsHelper.getError(err));
    }
  }
);

module.exports = router;
