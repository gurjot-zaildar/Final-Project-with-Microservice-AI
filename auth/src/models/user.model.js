const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({  // yaha pr address ka alag se schema bna leya jo neche address mai use keya hai
    street:String,
    city: String,
    state: String,
    zip: String,
    country: String,
});

const userSchema = new mongoose.Schema({  // blueprint tyar kr leya zaha pr user ka data store hoga
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
    },
    fullName:{
        firstName:{
            type:String,
            required: true
        },
        lastName:{
            type:String,
            required: true
        }
    },
    role:{
        type:String,
        enum:["user","seller"],
        default: "user"
    },
    addresses: [ addressSchema ]  // yaha pr address schema use keya hai jo uper bnaya tha 
})

const userModel = mongoose.model("user",userSchema)  // "user" mai store hoga data yaha se compass(atlas) mai

module.exports = userModel;