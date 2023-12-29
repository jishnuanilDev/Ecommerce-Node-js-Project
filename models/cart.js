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
            min:1
        }
    }],
})

const Cart = mongoose.model('cart',cartSchema)


const clearCart = async (userId) => {
    try {
      // Find the user's cart and update it to remove all items
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true } // Return the updated cart
      );
  
      if (!updatedCart) {
        // Handle the case where the user's cart is not found
        console.error('User cart not found for userId:', userId);
        return null; // or throw an error, redirect, etc.
      }
  
      // Optionally, you can log or return the updated cart
      console.log('User cart cleared for userId:', userId);
      return updatedCart;
    } catch (error) {
      console.error('Error clearing user cart:', error);
      throw error; // Handle the error as needed
    }
  };
  module.exports = {
    Cart,
    clearCart
  };