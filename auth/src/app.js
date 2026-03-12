const express = require("express")
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")

const app = express()  // server bnaya hai yaha pr

app.use(express.json())  // agar ye nahi lagaya to json data nahi read hoga
app.use(cookieParser())  // cookie ko parse kne k lye 

app.use("/api/auth",authRoutes); // yahi main api hai yaha se hi routes aage add ho kr register wale work kre gi


module.exports=app;