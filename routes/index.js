'use strict';

const express = require('express');
const router = express.Router();
const authenticateRoutes= require('./authenticateRoutes')
const flightsRoutes= require('./flightsRoutes')


router.use('/authenticate', authenticateRoutes);

router.use('/flights', flightsRoutes);

module.exports=router