const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const redis = require("../db/redis")


async function registerUser(req,res){
    const { username , email, password , fullName: { firstName, lastName }, role } = req.body;
 
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
        },
        role: role || "user" // default role is user
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

//  yaha pr to bus user ka data show hoga
async function getCurrentUser(req,res){
    return res.status(200).json({
        message:"current user fetched successfully",
        user:req.user
    })
}

//logoutUser ka controller
async function logoutUser(req,res){

    const token = req.cookies.token;

    //agar token hai to mai use blacklist kr raha hu redis DB mai store kr k
    if(token){
        await redis.set(`blacklist:${token}`, 'true', 'EX', 24*60*60) // ik din mai expire krwa deya
    }

    //cookies clear kr de browser mai se
    res.clearCookie("token",{
        httpOnly:true,
        secure: true,
    });

    return res.status(200).json({
        message:"logged out successfully"
    })
}

//user ka address show hoga yaha pr
async function getUserAddresses(req,res){

    const id = req.user.id;
    //user mai se only address select keya id ke help se
    const user = await userModel.findById(id).select("addresses")

    //agar user nahi hai 
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    return res.status(200).json({
        message:"user addresses fetch successfully",
        addresses: user.addresses
    });
}

//yaha pr user ka address creat ho raha hai
async function addUserAddress(req,res) {
    
    const id = req.user.id;

    const { street, city, state, pincode, country, isDefault } = req.body;

    const user= await userModel.findOneAndUpdate({ _id: id},{
        $push: {
            addresses: {
                street,
                city,
                state,
                pincode,
                country,
                isDefault
            }
        }
    },{new:true});

    if(!user){
        return res.status(404).json({
            message:"user not found"
        });
    }

    return res.status(201).json({
        message:"address added successfully",
        address: user.addresses[user.addresses.length - 1], // jo last mai new address add hua hai wo dekhe ga
    })

}

// yaha pr user ka address delete hoga
async function deleteUserAddress(req,res){

    const id = req.user.id;
    const {addressId} = req.params;
    // first user dekh rahe hai hai bhi hai ya nahi or uss mai address hai
    const user = await userModel.findById(id).select('addresses');

    //agar user nahi hai to
    if(!user){
        return res.status(404).json({
            message: "user not found"
        });
    }
    // address hai user mai?
    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId);

    //agar address nahi hai too
    if(!addressExists){
        return res.status(404).json({
            message: "address not found"
        });
    }

    // yaha pr address delete ho raha hai
    const updated = await userModel.findOneAndUpdate({_id: id}, {
        $pull: {
             addresses: { _id: addressId }
             }
    }, { new: true });

    // agar update nahi hua
    if(!updated){
        return res.status(500).json({
            message: "failed to delete address"
        });
    }

    // 2nd time verify krwa raha hu
    const stillExists = updated.addresses.some(addr => addr._id.toString() === addressId);
    if(stillExists){
        return res.status(500).json({
            message: "failed to delete address"
        });
    }

    return res.status(200).json({
        message: "address deleted successfully",
        addresses: updated.addresses
    });
}

module.exports={
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getUserAddresses,
    addUserAddress,
    deleteUserAddress,
}