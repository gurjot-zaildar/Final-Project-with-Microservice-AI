require("dotenv").config();
const mongoose= require("mongoose")

async function connectDB(){ // ye function call keya hai server file mai db se connect krne k lye
    try{
       await mongoose.connect(process.env.MONGO_URI) // iss mai uri dali hai zo env file mai store hai
            console.log("connected to DB")
    }catch(err){
        console.error("database connection fail : ",err)
    }
}

module.exports=connectDB;