const express = require("express")
const validators = require("../middlewares/validator.middleware")
const authController = require("../controllers/auth.controllers") 

const router = express.Router()

router.post("/register",validators.registerUserValidations,authController.registerUser) //ye user register krne ki api hai with validator middleware or auth controller mai asli kaam ho raha hai user register krne k

module.exports= router;