const express= require("express");
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const productController = require("../controllers/product.controller")
const { createProductValidators } = require("../validators/product.validator");

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage()});

//product create kr rahe hai
router.post("/",
    createAuthMiddleware(["admin","seller"]),
    upload.array("images",5), // only 5 images upload kr skte hai
    createProductValidators,
    productController.createProduct,
)

//get products 
router.get("/",productController.getProducts)


//get products by id 
router.get("/:id",productController.getProductById)



module.exports = router;