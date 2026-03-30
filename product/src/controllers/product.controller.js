const productModel = require("../model/product.model")
const {uploadImage} = require("../services/imagekit.service")
const mongoose = require("mongoose")

async function createProduct(req,res){
   try {
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
        const seller = req.user.id; // Extract seller from authenticated user

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency,
        };

        //subhi images sath mai upload hogi
        const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })));


        const product = await productModel.create({ title, description, price, seller, images });
        return res.status(201).json({
            message: 'Product created',
            data: product,
        });
    } catch (err) {
        console.error('Create product error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getProducts(req,res) {
    
    const {q,minprice , maxprice , skip=0 , limit = 20} = req.query;

    const filter ={}

    if(q){
        filter.$text = {$search: q}
    }

    if(minprice){
        filter["price.amount"]={...filter["price.amount"], $gte: Number(minprice)}
    }

    if(maxprice){
        filter["price.amount"]={...filter["price.amount"], $lte: Number(maxprice)}
    }

    const products = await productModel.find(filter)
        .skip(Number(skip))
        .limit(Math.min(Number(limit),20));
    
    return res.status(200).json({
        data: products
    })



}


async function getProductById(req,res) {
    const {id}=req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            message:"invalid product id"
        })
    }

    const product = await productModel.findById(id);

    if(!product){
        return res.status(404).json({
            message:"product not found"
        })
    }

    return res.status(200).json({
        data: product
    })


}

module.exports={
    createProduct,
    getProducts,
    getProductById,
}