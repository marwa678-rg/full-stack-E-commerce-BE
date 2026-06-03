
//Imports
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:{type:String,required:true},

  description:{type:String,required:true,trim:true},

  price:{type:Number,required:true,min:0,},

  discountPrice:{type:Number,default:0},

  category:{type:String,required:true},

  brand:{type:String,required:true},

  stock:{type:Number,required:true,min:0,default:0},

  imageCover:{type:String,required:true},

  images:[String],

  ratingsAverage:{type:Number,default:0,min:0,max:5},

  ratingsQuantity:{type:Number,default:0},

  isFeatured:{type:Boolean,default:false},

  isActive:{type:Boolean,default:true},

  createdBy:{type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  }

  
},{timestamps:true});

const Product = mongoose.model("Product",productSchema)
module.exports={Product};