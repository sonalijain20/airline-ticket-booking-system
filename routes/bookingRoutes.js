"use strict";

const router = require("express").Router();
const BookingController = require('../controllers/bookingController');
const { verifyUser } = require("../middleware/authTokenMiddleware");
const BookingControllerInstance = new BookingController();

router.post('/:passengerId', verifyUser, async function(req, res){
    return await BookingController.bookSeats(req, res)
})

module.exports= router;
