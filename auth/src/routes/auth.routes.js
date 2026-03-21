const express = require("express")
const validators = require("../middlewares/validator.middleware")
const authController = require("../controllers/auth.controllers") 

const router = express.Router()

router.post("/register",validators.registerUserValidations,authController.registerUser) //ye user register krne ki api hai with validator middleware or auth controller mai asli kaam ho raha hai user register krne k

router.post('/login', validators.loginUserValidations, authController.loginUser); // yaha pr login hoga user aa kr puri security lga rakhi hai middleware mai

module.exports= router;