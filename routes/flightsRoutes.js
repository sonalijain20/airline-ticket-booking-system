"use strict";

const router = require("express").Router();
const AuthTokenMiddleware = require("../middleware/authTokenMiddleware");
const FlightController = require("../controllers/flightController");
const FlightControllerInstance = new FlightController();

router.get(
  "/list",
  AuthTokenMiddleware.verifyUser,
  async function (req, res) {
    return await FlightControllerInstance.getFights(req, res);
  }
);

router.post(
  "/insert",
  AuthTokenMiddleware.verifyAdmin,
  async function (req, res) {
    return await FlightControllerInstance.addFlight(req, res);
  }
);

module.exports = router;
