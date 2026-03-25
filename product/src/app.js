const express = require("express");
const app = express();
const productsRoutes = require("./routes/product.routes")

app.use(express.json())

app.use("/api/products",productsRoutes)


module.exports=app;