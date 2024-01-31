let mongoose = require("mongoose");
const products = require("./productschema");
const genre = require("./genreschema");
const users = require("./userschema");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    },
  ],
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);
const  clearWishlist = async (userId) => {
  try {
 
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true } 
    );

    if (!updatedWishlist) {
    
      console.error('User wioshlist not found for userId:', userId);
      return null; 
    }

   
    console.log('User Wishlist cleared for userId:', userId);
    return updatedWishlist;
  } catch (error) {
    console.error('Error clearing user Wishlist:', error);
    throw error;
  }
};





module.exports = {
  Wishlist,
  clearWishlist
};
