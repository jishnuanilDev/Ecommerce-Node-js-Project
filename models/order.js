const mongoose = require('mongoose');
const products= require('./productschema');
const users = require('./userschema');

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
  address:{
    mobile:Number,
    houseName: String,
    street:String,
    city: String,
    pincode: String,
    state: String
  },
  items: [
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
          },
      quantity:{
        type:Number
      }
    }
  ],
  totalAmount: Number,
  status:{
    type:String,
    enum:['Order Placed','Shipped','Delivered','Cancelled','Returned'],
    default:'Order Placed'
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  paymentMethod: String,
  orderId:String
});

const order = mongoose.model('orders', orderSchema);

module.exports = order;