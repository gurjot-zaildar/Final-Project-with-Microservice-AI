const mongoose= require("mongoose")

async function connectDB(){ // ye function call keya hai server file mai db se connect krne k lye
    try{
       await mongoose.connect(process.env.MONGODB_URI) // iss mai uri dali hai zo env file mai store hai
            console.log("connected to DB")
    }catch(err){
        console.error("data base connection fail : ",err)
    }
}

module.exports=connectDB;