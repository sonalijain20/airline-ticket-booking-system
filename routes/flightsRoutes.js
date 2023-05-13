"use strict";

const router = require("express").Router();
const AuthTokenMiddleware = require("../middleware/authTokenMiddleware");
const FlightController = require("../controllers/flightController");
const FlightControllerInstance = new FlightController();

router.get(
  "/search",
  AuthTokenMiddleware.verifyPassenger,
  async function (req, res) {
    return await FlightControllerInstance.flightSearch(req, res);
  }
);

router.post(
  "/insert",
  AuthTokenMiddleware.verifyAdmin,
  async function (req, res) {
    // return await FlightControllerInstance.flightSearch(req, res);
    return;
  }
);

module.exports = router;
