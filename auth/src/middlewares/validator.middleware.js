const {body , validationResult } = require("express-validator")

const responseWithValidationErrors =(req,res,next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(errors)
        })
    }
    next();
}

const registerUserValidations = [
    body("username")
        .isString()
        .withMessage("username must be a string")
        .isLength({min : 3})
        .withMessage("username must be at least 3 characters long"),
    body("email")
        .isEmail()
        .withMessage("invalid email address"),
    body("password")
        .isLength({min:6})
        .withMessage("password must be at least 6 character long"),
    body("fullName.firstName")
        .isString()
        .withMessage("first name must be a string")
        .notEmpty()
        .withMessage("first name is required"),
    body("fullName.lastName")
        .isString()
        .withMessage("last name must be a string")
        .notEmpty()
        .withMessage("last name is required"),
    responseWithValidationErrors
]

module.exports={
    registerUserValidations
}