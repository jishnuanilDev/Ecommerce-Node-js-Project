const mongoose = require('mongoose')
const genre = require('./genreschema')


let productSchema = mongoose.Schema({
    bookname:{
        type:String, 
        unique:true
    },
    genrename: {
 type:String
    
    },
    language:String,
    Image:[{
        type:String
    }],
    img:[{
        type:String
    }],
    author:String,
    aboutauthor:String,
    publisher:String,
    binding:String,
    ISBN:{
        type:Number,
        unique:true
    },
    publicationdate:Date,
    pages:Number,
    bookoverview:String,
    originalPrice:Number,
    quantity:{
        type:Number,
        min:0
    },
    status:String,
    isListed:{
        type:Boolean,
        default:true
    }, discountPrice: {
        type: Number,
        default: 0
      }
})

// productSchema.index({ genrename: 1 }, { unique: true });
const product = mongoose.model('products',productSchema);
 
module.exports = product
