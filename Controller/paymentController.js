const express = require('express');
const router = express.Router();
const User = require('../models/userschema');
const productSchema = require('../models/productschema');
const genreSchema = require('../models/genreschema');
const { Cart, clearCart } = require('../models/cart');
const orderSchema = require('../models/order');
const cartModule = require('../models/cart');
const Razorpay = require('razorpay');
const crypto = require("crypto");
let userlogin;
let adminlogin;
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


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
        res.redirect('/user')
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
const paymentSelect = req.body.paymentMethod;

if(paymentSelect=== 'onlinePayment'){
  
  const orderResponse = await razorpay.orders.create({
    amount: totalAmount * 100, // Razorpay expects the amount in paise
    currency: 'INR',
    receipt: 'order_receipt_123', // Replace with your own receipt ID
    payment_capture: 1,
  });
  
  const orderId = orderResponse.id;
  

  

}else{
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


  for (const item of orderItems) {
    const product = await productSchema.findById(item.productId);

    if (product) {

      product.quantity -= item.quantity;

      await product.save();
    } else {
      console.error('Product not found:', item.productId);
    }
  }


  await cartModule.clearCart(userId);

  res.render('orderplaced');



}

}else{
  res.redirect('/user')

}

      
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };







module.exports = paymentController;