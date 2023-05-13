"use strict";

const express = require("express");
const router = express.Router();
const authenticateRoutes = require("./authenticateRoutes");
const flightsRoutes = require("./flightsRoutes");
const airlineRoutes = require("./airlineRoutes");
const bookingRoutes= require("./bookingRoutes")

router.use("/authenticate", authenticateRoutes);

router.use("/flights", flightsRoutes);

router.use("/airlines", airlineRoutes);
router.use("/bookings", bookingRoutes )
module.exports = router;
