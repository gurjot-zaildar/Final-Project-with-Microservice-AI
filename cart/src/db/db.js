const mongoose = require("mongoose")

async function connectDB(){
    try{
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connected to DB")
        })

    }catch(err){
        console.error("error connected to DB:",err)
    }
}

module.exports=connectDB;