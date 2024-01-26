const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    offerName:{
        type:String
    },
    discountOn:{
        type:String
    },
    discountValue:{
        type:Number
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    selectedGenre:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"genres"
    },
    selectedBook:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    selectedField: {
        type: String  
    },
    isActive: {
        type: Boolean,
        default: true,
    }
    

})

const offer = mongoose.model('offers',offerSchema)
module.exports = offer;