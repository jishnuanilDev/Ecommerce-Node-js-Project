const express = require("express");
const router = express.Router();
const User = require("../models/userschema");
const productSchema = require("../models/productschema");
const genreSchema = require("../models/genreschema");
const { Cart, clearCart } = require("../models/cart");
const orderSchema = require("../models/order");
const couponSchema = require("../models/coupon");
const Wallet = require("../models/wallet");
const cartModule = require("../models/cart");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { log } = require("console");
const { userorders } = require("./userhomeontroller");
const { ObjectId } = require('mongodb');

let userlogin;
let adminlogin;
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

let paymentController = {};

paymentController.userPayment = async (req, res) => {
  try {
    if (req.session.userlogin) {
      const userId = req.session.userId;
      const user = await User.findById(userId);
      const addresses = user.address;

      let userWallet = await Wallet.findOne({ userId });

      if (!userWallet) {
        userWallet = new Wallet({
          userId,
          balance: 0, 
          transactionHistory: [],
        });
  
        await userWallet.save();
      }
      const coupons = await couponSchema.find({});
      const cart = await Cart.findOne({ userId }).populate("items.productId");

      res.render("checkoutpage", { addresses, cart, coupons, userWallet });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

paymentController.confirmCheckoutCOD = async (req, res) => {
  try {
    if (req.session.userlogin) {
      const userId = req.session.userId;
      const selectedAddressIndex = req.body.selectedAddressIndex;
      console.log('addressIndex:',selectedAddressIndex)
      const paymentSelect = req.body.paymentMethod;
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      const user = await User.findById(userId);

      if (paymentSelect === "onlinePayment") {

        console.log('hey online payment got here ');
        // let totalAmount = 0;
        // const orderItems = cart.items.map(item => {
        //   totalAmount += item.productId.price+50 * item.quantity;
        //   return { productId: item.productId._id, quantity: item.quantity };
        // });

        let totalAmount = 51;

        const orderItems = cart.items.forEach((book) => {
          totalAmount += book.productId.discountPrice * book.quantity;
        });

        const Orders = cart.items.map((book) => ({
          productId: book.productId._id,
          quantity: book.quantity,
        }));

        console.log("Orders:", Orders);

        const orderResponse = await razorpay.orders.create({
          amount: totalAmount*100,
          currency: "INR",
          receipt: "dkndkomd548888scs",
          payment_capture: 1,
        });

        const orderId = orderResponse.id;
        const orderAmount = orderResponse.amount; 
 
        res.render('razorpayPage' ,{ orderId, orderAmount, user, Orders });
      } else if(paymentSelect === "cashOnDelivery"){
        let totalAmount = 51;
        const orderItems = cart.items.forEach((book) => {
          totalAmount += book.productId.discountPrice * book.quantity;
        });


        const Orders = cart.items.map((book) => ({
          productId: book.productId._id,
          quantity: book.quantity,
        }));

const userAddress = user.address[selectedAddressIndex];
console.log('getttted address of user:', userAddress);
        const order = new orderSchema({
          userId,
          items: Orders,
          totalAmount,
          address:{
            name:userAddress.name,
            phone:userAddress.phone,
            email:userAddress.email,
            streetaddress: userAddress.streetaddress,
            landmark:userAddress.landmark,
            city: userAddress.city,
            pincode: userAddress.zipcode,
            state: userAddress.state
          }
        });
        order.paymentMethod = 'Cash On Delivery'
        order.status = 'Order Placed'
        order.shippingFee = 51;
        await order.save();

        for (const item of Orders) {
          const product = await productSchema.findById(item.productId);

          if (product) {
            product.quantity -= item.quantity; 

            await product.save();
          } else {
            console.error("Product not found:", item.productId);
          }
        }

        await cartModule.clearCart(userId);

        res.render("orderplaced");
      }else{
        return;
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

paymentController.orderConfirm = async (req, res) => {
  try {
    console.log("hI got here ");
    const orderId = req.body.orderId;
    const userId = req.session.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  

    const Orders = cart.items.map((book) => ({
      productId: book.productId._id,
      quantity: book.quantity,
    }));
    const order = new orderSchema({
      userId,
      items: Orders,
      totalAmount: req.body.orderDetails.totalAmount/100,
      address:{
        name:userAddress.name,
        phone:userAddress.phone,
        email:userAddress.email,
        streetaddress: userAddress.streetaddress,
        landmark:userAddress.landmark,
        city: userAddress.city,
        pincode: userAddress.zipcode,
        state: userAddress.state
      }
    });


    console.log('orderrrrrr',req.body.orderDetails.totalAmount)

    order.status = 'Order Placed'
    order.paymentMethod = 'Online Payment'
 

    console.log("Received order items:", req.body.orderDetails.items);

    await order.save();

    await cartModule.clearCart(userId);

    res.render("orderplaced");
  } catch (error) {
    console.error("Error marking order as paid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


paymentController.orderPlaced = async (req, res) => {
  try {
if(req.session.userlogin){
  const userId = req.session.userId;
  const order = await orderSchema
    .findOne({ userId: userId})
    res.render("orderplaced");


}else{
  res.redirect('/')
}
  
    
  } catch (error) {
    console.error("Error marking order as paid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }


};



paymentController.userInvoice =  async (req,res)=>{

  try {
    let userDetails;
    let userAddress;
    let productDetails = [];  // Array to store product details for each item
    let   paymentMethod;
    let  totalAmount;
    let  shippingFee;
  
    console.log('gottttttttcha');
  
    if (req.session.userlogin) {
      const userId = req.session.userId;
      const idOrder = req.query.orderId;
  
  
      const userOrder = await orderSchema.find({ _id: idOrder });
  
      
  
      for (const order of userOrder) {
        orderDate = order.orderDate;
        paymentMethod = order.paymentMethod;
        totalAmount = order.totalAmount;
        shippingFee = order.shippingFee;
  
        const user = await User.findById(order.userId);
        userAddress = user.address;

        userDetails = user;
  

  
        const itemDetails = await Promise.all(order.items.map(async (item) => {
       
     
          console.log('item price:', item.price);
          const product = await productSchema.findById(item.productId);
          return {
            productname: product.bookname,
            quantity: item.quantity,
            price: product.discountPrice
         
          };
      
        }));
  
        productDetails.push(...itemDetails);
      }
  
 
  
      res.json({
        userDetails: userDetails,
        userAddress: userAddress,
        productDetails: productDetails,
        orderDate: orderDate,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        shippingFee: shippingFee
      });
    }
  } catch (error) {
    console.error("Error marking order as paid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
}



/////////////////////////////////////////////////////////////


paymentController.walletCheckout = async (req, res) => {
  try {
    if (req.session.userlogin) {
      let userId = req.session.userId;
      userId =new ObjectId(userId)
      console.log("USER : ",userId)
      const selectedAddressIndex = req.query.AdressIndex;
      console.log("working2");
      console.log('walletAddressIndex:',selectedAddressIndex);
  
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      const user = await User.findById(userId);

 
        let totalAmount = 51;
        const orderItems = cart.items.forEach((book) => {
          totalAmount += book.productId.discountPrice * book.quantity;
        });


        const Orders = cart.items.map((book) => ({
          productId: book.productId._id,
          quantity: book.quantity,
        }));

const userAddress = user.address[selectedAddressIndex];
console.log('getttted address of user:', userAddress);
        const order = new orderSchema({
          userId,
          items: Orders,
          totalAmount,
          address:{
            name:userAddress.name,
            phone:userAddress.phone,
            email:userAddress.email,
            streetaddress: userAddress.streetaddress,
            landmark:userAddress.landmark,
            city: userAddress.city,
            pincode: userAddress.zipcode,
            state: userAddress.state
          },
          paymentMethod :'Wallet Payment',
          status:'Order Placed',
          shippingFee:51

        });
   
        await order.save();

        const wallet = await Wallet.findOne({userId:userId});
        console.log('find wallet:',wallet)
        console.log('walletBal:',wallet.balance);
        const walletError = 'You have insufficient funds.';
        if (wallet.balance < totalAmount) {
          return res.redirect(`/userPayment?error=${encodeURIComponent(walletError)}`);
        }else{
let newWalletBal = wallet.balance-totalAmount;
wallet.balance = newWalletBal;

        }
        

        for (const item of Orders) {
          const product = await productSchema.findById(item.productId);

          if (product) {
            product.quantity -= item.quantity; 

            await product.save();
          } else {
            console.error("Product not found:", item.productId);
          }
        }

        await cartModule.clearCart(userId);

        res.render("orderplaced");
      
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = paymentController;
