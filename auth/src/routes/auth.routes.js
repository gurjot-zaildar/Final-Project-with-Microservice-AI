const express = require("express")
const validators = require("../middlewares/validator.middleware")
const authController = require("../controllers/auth.controllers") 
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/register",validators.registerUserValidations,authController.registerUser) //ye user register krne ki api hai with validator middleware or auth controller mai asli kaam ho raha hai user register krne k

router.post('/login', validators.loginUserValidations, authController.loginUser); // yaha pr login hoga user aa kr puri security lga rakhi hai middleware mai

router.get("/me",authMiddleware.authMiddleware,authController.getCurrentUser) // ye user ka data lekr aa raha hai 


module.exports= router;