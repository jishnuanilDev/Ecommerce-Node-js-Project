const mongoose = require('mongoose')
const genre = require('./genreschema')


let productSchema = mongoose.Schema({
    bookname:{
        type:String, 
        unique:true
    },
    genrename: {
 type:String
    //  type: mongoose.Schema.Types.ObjectId,
    //     ref: 'genre'
    },
    language:String,
    Image:[{
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
    price:Number,
    quantity:{
        type:Number,
        min:0
    },
    status:String,
    isListed:{
        type:Boolean,
        default:true
    }
})
// productSchema.index({ genrename: 1 }, { unique: true });
const product = mongoose.model('products',productSchema);
 
module.exports = product
