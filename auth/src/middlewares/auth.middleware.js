const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authMiddleware(req,res,next) {
    //yaha pr token aye ga
    const token = req.cookies.token; 
    // token check ho raha hai hai bhi ya nahi
    if(!token){ 
        return res.status(401).json({
            message:"unauthorized"
        })
    }

    try{
        // jo token mai dala tha wo decoded mai aa gya veryfy kr k
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        // user mai store krwa deya data 
        const user = decoded;
        // ab user ko req.user mai store krwa deya (wahi dat hai jo decoded mai tha)
        req.user = user

        next()
    } catch(err){
        return res.status(401).json({
            message:"unauthorized"
        })
    }

}

module.exports={
    authMiddleware
}