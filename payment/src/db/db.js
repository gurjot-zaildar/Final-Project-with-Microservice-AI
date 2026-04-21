const mongoose = require("mongoose")

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connected to db")
        })
    }catch(err){
        console.log("db connection failed:",err)
    }
}

module.exports=connectDB;