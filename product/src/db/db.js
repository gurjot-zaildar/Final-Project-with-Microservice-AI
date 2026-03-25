const mongoose = require("mongoose");

async function connectDB(){
    try{

        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connected to DB")
        })
    }catch(err){
        console.log("failed to connect DB: ",err)
    }
}

module.exports= connectDB;