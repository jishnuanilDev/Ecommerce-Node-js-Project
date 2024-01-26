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

module.exports = Wishlist
