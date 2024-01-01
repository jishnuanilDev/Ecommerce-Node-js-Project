const express = require('express');
const router = express.Router();
const User = require('../models/userschema');
const productSchema = require('../models/productschema');
const genreSchema = require('../models/genreschema');
const { Cart, clearCart } = require('../models/cart');
const orderSchema = require('../models/order');
const cartModule = require('../models/cart');
let userlogin;
let adminlogin;


let paymentController = {};


paymentController.userPayment = async(req,res)=>{
try{
    if(req.session.userlogin){

        const userId = req.session.userId;
        const user = await User.findById(userId);
        const addresses = user.address;

   

        const cart = await Cart.findOne({ userId }).populate('items.productId');

        res.render('checkoutpage',{ addresses,cart});
    }else{
        res.redirect('/')
    }
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



paymentController.confirmCheckoutCOD = async (req, res) => {
    try {
      if (req.session.userlogin) {
        const userId = req.session.userId;
        const selectedAddressIndex = req.body.selectedAddressIndex;
  
        const cart = await Cart.findOne({ userId }).populate('items.productId');
  
        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
          totalAmount += item.productId.price * item.quantity;
          return { productId: item.productId._id, quantity: item.quantity };
        });
  
        const order = new orderSchema({
          userId,
          items: orderItems,
          totalAmount,
        });
  
        await order.save();
  
        // Update product quantities based on the items in the order
        for (const item of orderItems) {
          const product = await productSchema.findById(item.productId);
  
          if (product) {
            // Update product quantity
            product.quantity -= item.quantity;
  
            // Save the updated product
            await product.save();
          } else {
            console.error('Product not found:', item.productId);
          }
        }
  
        // Clear the user's cart
        await cartModule.clearCart(userId);
  
        res.render('orderplaced');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };







module.exports = paymentController;