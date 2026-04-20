const jwt = require("jsonwebtoken")

function createAuthMiddleware(role = ["user"]){

    return function authMiddleware(req,res,next){

        const authHeader = req.headers?.authorization;
        const token = req.cookies?.token || (authHeader ? authHeader.split(" ")[1] : undefined);

        if(!token){
            return res.status(401).json({
                message:"unauthorized: no token provided",
            })
        }

        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            if(!role.includes(decoded.role)){
                return res.status(403).json({
                    message:"forbidden: insufficent permissions"
                })
            }
            req.user = decoded;
            next();

        }catch(err){
            return res.status(401).json({
                message:"unauthorized : invalid token"
            })
        }
    }
}

module.exports= createAuthMiddleware