const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function registerUser(req,res){
    const { username , email, password , fullName: { firstName, lastName } } = req.body;
 
    const isUserAlreadyExists = await userModel.findOne({
        // koi ik sai find kr raha hu
        $or:[ 
            {username},
            {email}
        ]
    });

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: "username or email already exists"
        })
    };

    const hash = await bcrypt.hash( password, 10 ) // password ko secure kr deya hash kr k

    const user = await userModel.create({
        username,
        email,
        password: hash,
        fullName:{
            firstName,
            lastName
        }
    });

    //token bna deya 
    const token = jwt.sign({
         id: user._id,
         username: user.username,
         email: user.email,
         role: user.role
        }, process.env.JWT_SECRET, {expiresIn: "1d"});
//jo token uper bnaya hai wo browser cookies mai token mai store krwa deya 
        res.cookie("token",token, {
            httpOnly:true,
            secure:true,  // client side wale koi bhi access nahi kr paye ge 
            maxAge: 24*60*60*1000, // 1 day in milisec
        })


        res.status(201).json({
            message:"user register successfully",
            user: {
                id:user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                addresses: user.addresses
            }
        })

}

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // user ko find kr raha hu yaha pr password selected rakh kr
        const user = await userModel.findOne({
             $or: [ { email }, { username } ] 
            }).select('+password');  // hum nai password ko db schema mai selected fals keya tha iss leye ye krna pda

        if (!user) {
            return res.status(401).json({
                 message: 'Invalid credentials' 
                });
        }

        const isMatch = await bcrypt.compare(password, user.password || ''); //password ko hash wale password se match kr rahe hai
        if (!isMatch) {
            return res.status(401).json({
                 message: 'Invalid credentials'
                 });
        }

        // yaha pr fer se token bna rahe hai
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        // abbe token ko browser cookies mai stor kre ge
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // ye life time hai token ka millisec mai
        });

        return res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                addresses: user.addresses
            }
        });
    } catch (err) { // agar koi error hoga to console pr dekh lena 
        console.error('Error in loginUser:', err);
        return res.status(500).json({
             message: 'Internal server error' 
            });
    }
}

module.exports={
    registerUser,
    loginUser
}