const express = require("express")


const app = express()  // server bnaya hai yaha pr

app.use(express.json())  // agar ye nahi lagaya to json data nahi read hoga

module.exports=app;