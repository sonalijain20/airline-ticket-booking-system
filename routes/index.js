"use strict";

const express = require("express");
const router = express.Router();
const authenticateRoutes = require("./authenticateRoutes");
const flightsRoutes = require("./flightsRoutes");
const airlineRoutes = require("./airlineRoutes");

router.use("/authenticate", authenticateRoutes);

router.use("/flights", flightsRoutes);

router.use("/airline", airlineRoutes);
module.exports = router;
