const express = require('express');
const router = express.Router();
const User = require('../models/userschema');
const productSchema = require('../models/productschema');
const genreSchema = require('../models/genreschema');
const { Cart, clearCart } = require('../models/cart');
let userlogin;
let adminlogin;


let cartController = {};

cartController.quantityUpdate = async (req, res) => {
    try {
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

            res.redirect(`/books/bookInfo/${bookId}`);
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error("Error during addToCart:", err);
        res.status(500).send('Internal Server Error');
    }
};



// cartController.addToCart = async (req, res) => {
//     const userId = req.session.userId;
//     const productId = req.params.id;
//     const quantity = req.body.quantityValue || 1;

//     console.log("product ID: ", productId);

//     if (!userId) {
//         res.redirect('/');
//     }

//     try {
//         let userCart = await cart.findOne({ userId });

//         if (!userCart) {
//             userCart = new cart({ userId });
//             await userCart.save();
//         }
//         const isProductInCart = userCart.items.some(item => item && item.productId && item.productId.equals(productId));

//         if (!isProductInCart) {
//             userCart.items.push({ productId,quantity });
//             await userCart.save();
//         }

//         res.redirect(`/product-page/${productId}`);
//     } catch (error) {
//         console.error('Error adding product to cart:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };




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
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



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

            res.redirect('/userviewcart');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//   cartController.viewcart = async (req, res) => {
//     try {
//         if(req.session.userlogin){


//         const userId = req.session.userId;
//         const userCart = await cartSchema.findOne({ userId }).populate('items.productId');
//         // const categories = await category.find()

//         if (userCart) {
//             const items = userCart.items || [];
//             userCart.items.forEach(product => {

//             });

//           res.render("usercart", { items, userId});
//             }

//         }else{
//             res.redirect('/')
//         }

//    }catch (err) {
//         console.log("Error in showing data", err);
//         res.status(500).send("Internal Server Error");
//     }
// };




cartController.updateQuantity = async (req, res) => {
    console.log('Update quantity request received');
    const userId = req.session.userId;
    const productId = req.params.productId;
    const newQuantity = req.body.quantity;

    // Add validation for userId and newQuantity
    if (!userId || isNaN(newQuantity)) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { userId, 'items.productId': productId },
            { $set: { 'items.$.quantity': newQuantity } },
            { new: true }
        );

        if (updatedCart) {
            res.status(200).json({ message: 'Quantity updated successfully' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// cartController.viewcart = async (req, res) => {
//     try {

//         if(req.session.userlogin) {


//         const userId = req.session.userId;
//         const userCart = await cartSchema.findOne({ userId }).populate('items.productId');

//         if (userCart) {
//             const items = userCart.items || [];
//             const totalPrice = calculateTotalPrice(items);


//                 res.render("usercart", { items, userId, totalPrice, isEmptyCart: items.length === 0 });


//         } else {

//                 res.render("usercart", { items: [], userId, totalPrice: 0, isEmptyCart: true });

//         }
//     }else{
//         res.redirect('/')
//     }
//     } catch (err) {
//         console.log("Error in showing data", err);
//         res.status(500).send("Internal Server Error");
//     }
// };










cartController.updateQuantity = async (req, res) => {
    try {
        const productId = req.params.productId;
        const newQuantity = parseInt(req.params.newQuantity);

        // Assuming you have a Cart model with a method to update quantity
        const updatedCart = await Cart.updateQuantity(req.session.userId, productId, newQuantity);

        // Send the updated cart details back to the client
        res.json({
            success: true,
            cart: updatedCart,
        });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = cartController;
