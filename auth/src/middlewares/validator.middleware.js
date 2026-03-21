const {body , validationResult } = require("express-validator")

const responseWithValidationErrors =(req,res,next)=>{
    const errors = validationResult(req);  // yaha pr errors store ho rahe hai 

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(errors) // yaha pr errors display krwa raha hu
        })
    }
    next(); // aage chalo
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
    responseWithValidationErrors // jo const kr k variable bnaya hai wo hai ye
]

const loginUserValidations = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email address'),
    body('username')
        .optional()
        .isString()
        .withMessage('Username must be a string'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        // koi ik to hona hi chaheye email ya username mai se nahi to error aye ga
        if (!req.body.email && !req.body.username) { 
            return res.status(400).json({ errors: [ { msg: 'Either email or username is required' } ] });
        }
       responseWithValidationErrors(req, res, next);
    }
]

module.exports={
    registerUserValidations,
    loginUserValidations
}