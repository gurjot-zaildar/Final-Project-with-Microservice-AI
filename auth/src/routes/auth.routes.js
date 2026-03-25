const express = require("express")
const validators = require("../middlewares/validator.middleware")
const authController = require("../controllers/auth.controllers") 
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()
//ye user register krne ki api hai with validator middleware or auth controller mai asli kaam ho raha hai user register krne k

router.post("/register",validators.registerUserValidations,authController.registerUser) 
 // yaha pr login hoga user aa kr puri security lga rakhi hai middleware mai

 router.post('/login', validators.loginUserValidations, authController.loginUser);
// ye user ka data lekr aa raha hai 

router.get("/me",authMiddleware.authMiddleware,authController.getCurrentUser) 

//logout ki api
router.get("/logout",authController.logoutUser)

//yaha pr user ka address fetch keya ha, first token verify keya auth middleware mai
router.get('/users/me/addresses', authMiddleware.authMiddleware, authController.getUserAddresses);

// yaha pr user ka address add ho raha hai
router.post("/users/me/addresses", validators.addUserAddressValidations, authMiddleware.authMiddleware, authController.addUserAddress)

// yaha pr user ka address delete hoga addressId ki help se
router.delete("/users/me/addresses/:addressId", authMiddleware.authMiddleware, authController.deleteUserAddress)

module.exports= router;