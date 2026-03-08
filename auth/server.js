require("dotenv").config()  // ye env file ko read krta hai 
const app=require("./src/app")
const connectDB = require("./src/db/db")

connectDB() // db yaha pr chalu keya hai

app.listen(3000,()=>{  //server yaha pr chalu keya hai
    console.log("server is running on port 3000")
})