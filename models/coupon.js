const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    couponCode:{
        type:String,
        required:true,
        unique:true
    },
    DiscountValue:{
        type:Number,
        required:true
    },
    couponType:{
        type:String,
        enum: ['Minimum Purchase','First Order','Seasonal Promotion offer'],
        required:true
    },
    Expiry: {
        type: Date,
        required: true,
    },
    minimumPurchaseAmount: {
        type: Number,
        required: true,
    },
    status:{
        type:String,
        enum:['Active','Expired','Not Active']
    },
    isActive:{
        type:Boolean,
        default:true
    },
    
})

const coupon = mongoose.model('coupon', couponSchema);

module.exports = coupon;