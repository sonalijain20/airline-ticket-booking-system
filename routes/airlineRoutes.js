"use strict";

const router = require("express").Router();
const AuthTokenMiddleware = require("../middleware/authTokenMiddleware");
const AirlineController = require("../controllers/airlineController");
const AirlineControllerInstance = new AirlineController();

router.post(
  "/insert",
  AuthTokenMiddleware.verifyAdmin,
  async function (req, res) {
    return await AirlineControllerInstance.addAirline(req, res);
  }
);

router.get(
    "/list",
    AuthTokenMiddleware.verifyUser,
    async function (req, res) {
      return await AirlineControllerInstance.getList(req, res);
    }
  );

module.exports = router;
