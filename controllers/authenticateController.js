'use-strict';
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {knex}=require('../schema/utils/knex')
const saltRounds = process.env.SALT_ROUNDS || 10;


module.exports=class AuthenticateController{
    constructor(){
        this.table='users';
    }

    async register(req,res){
        try{
            const validationErrors = this.validatePayload(req.body);

            if(validationErrors.errors.length) {
                return res.status(400).json(validationErrors);
            }
            else{

                const userExists = await knex(this.table).select(`*`).where({
                    email:req.body.email
                })

                if(userExists.length){
                    return res.status(400).json({
                        statusCode: 400,
                        message: 'User already exists with provided email'
                    })
                }else{
                    const { email, firstName, lastName, isAdmin=false } = req.body

                    //encrypt the password 
                    const hash = await bcrypt.hash(req.body.password, saltRounds);   
                    const insertResult= await knex(this.table).insert({
                        email,
                        firstName,
                        lastName,
                        isAdmin,
                        password:hash
                    }).returning('*');
                    return res.status(200).json({
                        statusCode: 200,
                        message: 'Registered successfully! Please Login to continue'
                    })
                }
            }
        }
        catch(err){
            console.log("Error happened while registeration: ", err)
        }
    }
    validatePayload(payload){
        const validationErrors = {
            errors: []
        };

        //validate email address
        if (!payload.email) {
            validationErrors.errors.push({
                field: 'email',
                error: 'Email address is mising'
            })
        } else if (!emailValidator.validate(payload.email)) {
            validationErrors.errors.push({
                field: 'email',
                error: 'Email address is mising'
            })
        }

        //validate password
        if (!payload.password) {
            validationErrors.errors.push({
                field: 'password',
                error: 'password is mising'
            })
        } else if (payload.password.length < 8) {
            validationErrors.errors.push({
                field: 'password',
                error: 'password length should be atleast 8 characters'
            })
        }

        //validate last name
        if (payload.lastName && typeof payload.lastName !== 'string') {
            validationErrors.errors.push({
                field: 'Last name',
                error: 'Invalid last name'
            })
        }
        //validate first name
        if (payload.firstName && typeof payload.firstName !== 'string') {
            validationErrors.errors.push({
                field: 'First name',
                error: 'Invalid first name'
            })
        }

        if(payload.hasOwnProperty('isAdmin') && typeof payload.isAdmin !='boolean'){
            validationErrors.errors.push({
                field: 'isAdmin',
                error: 'Must be true or false'
            })
        }
        return validationErrors;
    }

    async login(req,res){
        try {
            const validationErrors = await this.validatePayload(req.body);

            if (validationErrors.errors.length) {
                return res.status(400).json(validationErrors)                           //validation errors, return 400
            }
            else{
                const userInfo = await knex(this.table).select(`*`).where({
                    email:req.body.email
                })

                if (!userInfo.length) {
                    return res.status(400).json({
                        statusCode: 400,
                        message: 'User does not already exists with provided email'
                    })
                } 
                else {
                    const passwordMatch = await bcrypt.compare(req.body.password, userInfo[0].password);             //compare password
                    if (passwordMatch) {
                        const accessToken = await this.generateJWToken(userInfo[0])                                       // generate JWT token
                        if (accessToken) {
                            const user = {
                                email: userInfo[0].email,
                                id: userInfo[0].id,
                                accessToken,
                                issuedAt: new Date()
                            }
                            return res.status(200).json({
                                message: 'Login Successful!',
                                statusCode: 200,
                                user
                            })
                        }
                    }
                    else {
                        return res.json({
                            statusCode: 401,
                            message: 'Incorrect password'
                        })
                    }
                }

            }
            
        } catch (error) {
            console.log("Error while login: ",error)
        }
    }

    async generateJWToken(userInfo) {
        try {
            return await jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
        } catch (err) {
            console.log("Error while generating token: ", err);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }
}