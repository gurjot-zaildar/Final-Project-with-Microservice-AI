const express = require("express");
const app = express();
const productsRoutes = require("./routes/product.routes")
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())  // cookie ko parse kne k lye 

app.use("/api/products",productsRoutes)


module.exports=app;