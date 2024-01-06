let mongoose = require('mongoose');
const products= require('./productschema');
const genre = require('./genreschema');
const users = require('./userschema');



const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    items:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"products"
        },
        quantity:{
            type:Number, 
            default:1,
            min:0
        }
    }],
})

const Cart = mongoose.model('cart',cartSchema)


const clearCart = async (userId) => {
    try {
   
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true } 
      );
  
      if (!updatedCart) {
      
        console.error('User cart not found for userId:', userId);
        return null; 
      }
  
     
      console.log('User cart cleared for userId:', userId);
      return updatedCart;
    } catch (error) {
      console.error('Error clearing user cart:', error);
      throw error;
    }
  };
  module.exports = {
    Cart,
    clearCart
  };