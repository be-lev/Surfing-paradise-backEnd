const express = require("express");
const usersLogic = require("../business-vacations-logic/users-logic");
const errorsHelper = require("../helpers/errors-helper");
const router = express.Router();

// Get user by uuid:
router.get("/:uuid", async (request, response) => {
  try {
    const uuid = request.params.uuid;
    const user = await usersLogic.getOneUserAsync(uuid);
    response.json(user);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

// Update user by uuid:
router.patch("/:uuid", async (request, response) => {
  try {
    const uuid = request.params.uuid;
    request.body.uuid = uuid;
    const updatedUser = await usersLogic.updateUserAsync(request.body);
    response.json(updatedUser);
  } catch (err) {
    response.status(500).send(errorsHelper.getError(err));
  }
});

module.exports = router;
