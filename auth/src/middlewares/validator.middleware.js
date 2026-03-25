const {body , validationResult } = require("express-validator")

//subhi ke errors yaha pr aye ge last mai agar koi hua to agar nahi hua to bhi yahi se next hoga handle 
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
    body("role")
        .optional()
        .isIn(["user","seller"])
        .withMessage("role must be either user or seller"),
    responseWithValidationErrors
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

const addUserAddressValidations= [
    body('street')
        .isString()
        .withMessage('Street must be a string')
        .notEmpty()
        .withMessage('Street is required'),
    body('city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City is required'),
    body('state')
        .isString()
        .withMessage('State must be a string')
        .notEmpty()
        .withMessage('State is required'),
    body('pincode')
        .isString()
        .withMessage('Pincode must be a string')
        .notEmpty()
        .withMessage('Pincode is required')
        .bail()
        .matches(/^\d{4,}$/)
        .withMessage('Pincode must be at least 4 digits'),
    body('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Country is required'),
    body('phone')
        .optional()
        .isString()
        .withMessage('Phone must be a string')
        .bail()
        .matches(/^\d{10}$/)
        .withMessage('Phone must be a valid 10-digit number'),
    body('isDefault')
        .optional()
        .isBoolean()
        .withMessage('isDefault must be a boolean'),
    responseWithValidationErrors
]

module.exports={
    registerUserValidations,
    loginUserValidations,
    addUserAddressValidations
}