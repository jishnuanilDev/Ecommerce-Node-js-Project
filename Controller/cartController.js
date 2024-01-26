const express = require('express');
const easyinvoice = require('easyinvoice');
const router = express.Router();
const User = require('../models/userschema');
const productSchema = require('../models/productschema');
const Wishlist = require('../models/wishlist');
const couponSchema = require('../models/coupon');
const genreSchema = require('../models/genreschema');
const { Cart, clearCart } = require('../models/cart');
let userlogin;
let adminlogin;


let cartController = {};

cartController.quantityUpdate = async (req, res) => {
    try {
        if(req.session.userlogin){

    
        const { bookId, quantity } = req.params;
  
        // Find the cart item by bookId
        const cartItem = await Cart.findOneAndUpdate(
          { 'items.productId': bookId },
          { $set: { 'items.$.quantity': quantity } },
          { new: true }
        );
    
        if (!cartItem) {
          return res.status(404).json({ success: false, error: 'Book not found in the cart' });
        }
    
        // Send a success response
        res.json({ success: true, message: 'Quantity updated successfully', updatedCartItem: cartItem });
    }else{
        res.redirect('/user')
    }
      } catch (error) {
        console.error('Error updating quantity:', error);
    
        // Send an error response with a detailed message
        res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
      }
  };







cartController.cartSummary = async (req, res) => {
    try {
        const userId = req.session.userId;
    
       
        const cart = await Cart.findOne({ userId }).populate('items.productId');
    
        if (!cart) {
          return res.status(404).json({ success: false, error: 'Cart not found' });
        }
    
        
        let totalSum = 0;
        for (const item of cart.items) {
          totalSum += item.productId.price * item.quantity ;
        }
    
       
        cart.totalSum = totalSum;
        await cart.save();
    
     
        res.json({ success: true, totalSum });
      } catch (error) {
        console.error('Error updating total sum:', error);
        res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
      }
  };




cartController.addToCart = async (req, res) => {
    try {
        if (req.session.userlogin) {
            const userId = req.session.userId;
            const bookId = req.params.id;

            const existingCart = await Cart.findOne({ userId });

            const book = await productSchema.findById(bookId);

            if (!existingCart) {
       
                const newCart = new Cart({
                    userId: userId,
                    items: [{ productId: bookId, quantity: 1 }]
                });

                await newCart.save();
            } else {
               
                const existingCartItem = existingCart.items.find(item => item.productId.equals(bookId));

                if (existingCartItem) {
          
                    existingCartItem.quantity += 1;
                } else {
        
                    existingCart.items.push({ productId: bookId, quantity: 1 });
                }

                // Save the updated cart
                await existingCart.save();
            }

            res.redirect(`/user/books/bookInfo/${bookId}`);
        } else {
            res.redirect('/user');
        }
    } catch (err) {
        console.error("Error during addToCart:", err);
        res.status(500).send('Internal Server Error');
    }
};






cartController.checkCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        for (const item of cart.items) {
            console.log("ite")
            if (item.quantity == 0) {
                return res.json({ status: true });
            }
        }

        // If no item with quantity 0 is found, send status false
        res.json({ status: false });
    } catch (error) {
        console.error('Error checking cart:', error);
        res.status(500).send('Internal Server Error');
    }
};


cartController.viewcart = async (req, res) => {
    try {
        if (req.session.userlogin) {
            const userId = req.session.userId;

            const cart = await Cart.findOne({ userId }).populate('items.productId');
            
      
            // cart.items.forEach(cartItem => {
            //     console.log('productId:',cartItem.productId);
            // });

            res.render('usercart', { cart, userId });
        } else {
            res.redirect('/user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

cartController.coupons = async (req,res)=>{
    try{
        if(req.session.userlogin){
            const coupons = await couponSchema.find({})
            
            res.json(coupons);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

cartController.removeCart = async (req, res) => {
    try {
        if (req.session.userlogin) {
            const userId = req.session.userId;
            const bookId = req.params.id;

         
            const cart = await Cart.findOneAndUpdate(
                { userId },
                { $pull: { items: { _id: bookId } } },
                { new: true }
            );

            res.redirect('/user/userviewcart');
        } else {
            res.redirect('/user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




cartController.viewwishlist= async (req, res) => {
    try {
        if (req.session.userlogin) {
            const userId = req.session.userId;

            const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
            
      
            // cart.items.forEach(cartItem => {
            //     console.log('productId:',cartItem.productId);
            // });

            res.render('wishlist', { wishlist , userId });
        } else {
            res.redirect('/user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



cartController.addToWishlist = async (req, res) => {
    try {
        console.log('here got it tta')
        if (req.session.userlogin) {
            const userId = req.session.userId;
            const bookId = req.body.bookId;
            console.log(bookId);
            const isWishlisted = await Wishlist.findOne({userId:userId, "items.productId": bookId });
            console.log("Is wishlisted",isWishlisted)
            if(!isWishlisted){
                const wishlist = await Wishlist.findOneAndUpdate(
                    { userId },
                    { $addToSet: { "items": { productId: bookId } } },
                    { upsert: true, new: true }
                );
            }
           
        res.json({status:true})
           
        } else {
            res.redirect('/user');
        }
        
    } catch (err) {
        console.error("Error during addToCart:", err);
        res.status(500).send('Internal Server Error');
    }
};






cartController.removeWishlist = async (req, res) => {
    try {
        if (req.session.userlogin) {
            const userId = req.session.userId;
            const bookId = req.params.id;

         
            const wishlist = await Wishlist.findOneAndUpdate(
                { userId },
                { $pull: { items: { _id: bookId } } },
                { new: true }
            );

            res.redirect('/user/userviewwishlist');
        } else {
            res.redirect('/user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = cartController;
