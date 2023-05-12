'use strict'

const express = require('express');
const router = express.Router();
const AuthenticateController= require('../controllers/authenticateController')
const AuthControllerInstance = new AuthenticateController();


router.post('/register', async function(req,res){
    return await AuthControllerInstance.register(req,res)
})

router.post('/login', async function(req,res){
    return await AuthControllerInstance.login(req,res)
})
module.exports=router;