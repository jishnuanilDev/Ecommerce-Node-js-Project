const express = require("express");
const User = require("../models/userschema");
const productSchema = require("../models/productschema");
const genreSchema = require("../models/genreschema");
const orderSchema = require("../models/order");
const couponSchema = require("../models/coupon");
const offerSchema = require("../models/offers");
const fileUpload = require("express-fileupload");
const PDFDocument = require('pdfkit'); 
const ExcelJS = require('exceljs'); 
const pdfGenerator = require("../Controller/PDFgenerator");
const excelGenerator = require("../Controller/EXCELgenerator");
const fs = require('fs');
const path = require('path');


const router = express.Router();
let userlogin;
let adminlogin;
router.use(fileUpload());

let adminHomeController = {};

adminHomeController.adminPageInfo = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const orders = await orderSchema.find();
      res.render("adminpanel");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.adminOrdersInfo = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const orders = await orderSchema
        .find({})
        .populate("userId")
        .populate("items.productId"); // Populate the userId field and produc

      res.render("adminorders", { orders });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.updateOrderStatus = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const updateStatus = req.body.status; // Assuming your status is present in req.body.status
      const orderId = req.params.id;

      // Use the { new: true } option to get the updated document after the update
      const updatedOrder = await orderSchema.findByIdAndUpdate(
        orderId,
        { status: updateStatus },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).send("Order not found");
      }

      res.redirect("/admin/adminorders");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.adminUsersInfo = async (req, res) => {
  // list users in admin panel

  try {
    if (req.session.adminlogin) {
      const users = await User.find({});
      res.render("adminusers", { users });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.blockUser = async (req, res) => {

  try {
    if (req.session.adminlogin) {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (user) {
        user.isBlocked = true;
        await user.save();
        res.redirect("/admin/adminusers");
      }
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.unBlockUser = async (req, res) => {
  // unblock userlist

  try {
    if (req.session.adminlogin) {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (user) {
        user.isBlocked = false;
        await user.save();
        res.redirect("/admin/adminusers");
      }
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.booksInfo = async (req, res) => {
  if (req.session.adminlogin) {
    const page = parseInt(req.query.page) || 1; // Get the requested page number or default to 1
    const pageSize = 6; // Number of books per page

    const skip = (page - 1) * pageSize;

    const books = await productSchema.find({}).skip(skip).limit(pageSize);
    const totalBooks = await productSchema.countDocuments({});

    const totalPages = Math.ceil(totalBooks / pageSize);

    productSchema
      .find({})
      .then((books) => {
        res.render("adminbooks", { books, totalPages, currentPage: page });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        res.status(500).render("error", { error: "Internal server error" });
      });
  } else {
    res.redirect("/admin");
  }
};

// adminHomeController.genresInfo = (req, res) => {
//     if (req.session.adminlogin) {
//     res.render('admingenres');
// }else{
//     res.redirect('/adminlogin');
// }
// }

adminHomeController.genresInfo = (req, res) => {
  if (req.session.adminlogin) {
    genreSchema
      .find({})
      .then((genres) => {
        res.render("admingenres", { genres });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        res.status(500).render("error", { error: "Internal server error" });
      });
  } else {
    res.redirect("/admin");
  }
};

adminHomeController.addProduct = (req, res) => {
  if (req.session.adminlogin) {
    genreSchema
      .find({})
      .then((genres) => {
        res.render("add-products", {
          genres,
          error: "",
          ISBNerror: "",
          errorIN: "",
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        res.status(500).render("error", { error: "Internal server error" });
      });
  } else {
    res.redirect("/admin");
  }
};

adminHomeController.postProduct = async (req, res) => {
  if (req.session.adminlogin) {
    try {
      const genres = await genreSchema.find({});

      const {
        bookname,
        genrename,
        language,
        author,
        aboutauthor,
        publisher,
        binding,
        ISBN,
        publicationdate,
        pages,
        bookoverview,
        originalPrice,
        quantity,
        status,
      } = req.body;

      const existingBook = await productSchema.findOne({
        bookname: {
          $regex: new RegExp("^" + bookname + "$", "i"), 
        },
      });
      const existingISBN = await productSchema.findOne({ ISBN });

      if (existingBook || existingISBN) {
     
        return res.render("add-products", {
          error: "Book with the same details already exists",
          ISBNerror: "Book with the same ISBN already exists",
          genres,
          errorIN: "",
        });
      }

      let imagePath;

      try {
          const images = req.files.Image;
          console.log('multiple Images:',images)
      
          if (!images) {
              return res.status(400).json({ error: "No images provided" });
          }
      
          for (const image of images) {
              imagePath = "./public/product-Images/" + Date.now() + "_" + image.name;
      
              await image.mv(imagePath);
     
          }
      
       
      } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Failed to upload image" });
      }

 
      const newProduct = new productSchema({
        bookname,
        genrename,
        language,
        author,
        aboutauthor,
        publisher,
        binding,
        ISBN,
        publicationdate,
        pages,
        bookoverview,
        originalPrice,
        quantity,
        status,
        Image: imagePath,
      });

      newProduct.save().then(() => {
        res.redirect("/admin/adminbooks");
      });
    } catch (err) {
      console.error("Error saving book:", err);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/admin");
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////

adminHomeController.addGenre = (req, res) => {
  if (req.session.adminlogin) {
    res.render("add-genres", { error: "", genre: "" });
  } else {
    res.redirect("/admin");
  }
};

// ////////////////////////////////////////////////////////////////////////////////////////

adminHomeController.postGenre = async (req, res) => {
  if (req.session.adminlogin) {
    const { genrename } = req.body;

    try {
      const existingGenre = await genreSchema.findOne({
        genrename: {
          $regex: new RegExp("^" + genrename + "$", "i"),
        },
      });
      if (existingGenre) {
        // Genre with the same name already exists
        return res.render("add-genres", {
          error: "Genre with the same name already exists",
          genre: "",
        });
      }
      const Alphabetic = /^[a-zA-Z]+$/;
      if (!Alphabetic.test(genrename)) {
        // Invalid characters in genrename. Only alphabets are allowed.
        return res.render("add-genres", {
          error: "Invalid characters in Genre Name. ",
          genre: "",
        });
      }
      // If the genre is unique, save it
      const newGenre = new genreSchema({
        genrename,
      });

      await newGenre.save();
      res.redirect("/admin/admingenres");
    } catch (err) {
      console.error("Error saving genre:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/admin");
  }
};

adminHomeController.editBookInfo = async (req, res) => {
  const bookId = req.params.id;

  if (req.session.adminlogin) {
    try {
      const item = await productSchema.findById(bookId);
      const genres = await genreSchema.find({});

      // if (!bookdetails) {

      //     res.render('error', { error: 'Book not found' });
      //     return;
      // }

      res.render("bookedit", { item, error: "", genres });
    } catch (error) {
      console.error("Error fetching book details:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/admin");
  }
};

adminHomeController.postUpdateInfo = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const {
        bookname,
        genrename,
        language,
        author,
        aboutauthor,
        publisher,
        binding,
        ISBN,
        publicationdate,
        pages,
        bookoverview,
        originalPrice,
        quantity,
        status,
      } = req.body;
      const bookId = req.params.id;

      const existingbook = await productSchema.findOne({
        bookname,
        _id: { $ne: bookId },
      });

      const genres = await genreSchema.find({});

      if (existingbook) {
        return res.render("bookedit", {
          error: "Book with the same name already exists",
          item: "",
          genres,
        });
      }

      let imagePath;

      if (req.files && req.files.Image) {

      try {
          const images = req.files.Image;
          console.log('multiple Images:',images)
      
          for (const image of images) {
              imagePath = "./public/product-Images/" + Date.now() + "_" + image.name;
      
              await image.mv(imagePath);
     
          }
      
       
      } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Failed to upload image" });
      }

 
      }

      const updatedBook = await productSchema.findByIdAndUpdate(bookId, {
        bookname,
        genrename,
        language,
        author,
        aboutauthor,
        publisher,
        binding,
        ISBN,
        publicationdate,
        pages,
        bookoverview,
        originalPrice,
        quantity,
        status,
        Image: imagePath,
      });

      res.redirect("/admin/adminbooks");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    // Handle database update error
    if (err.code === 11000) {
      res.render("bookedit", {
        error: "Book with the same name already exists",
      });
    } else {
      res.status(500).send("Internal Server Error");
      console.error("Error during update:", err);
    }
  }
};

adminHomeController.deleteGenre = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const genreId = req.params.id;

      await genreSchema.findByIdAndDelete(genreId);

      res.redirect("/admin/admingenres");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.editGenre = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const genreId = req.params.id;

      const genre = await genreSchema.findById(genreId);
      res.render("genreedit", { genre, error: "" });
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

// adminHomeController.postEditGenre = (req,res)=>{
//     const {genrename} = req.body;

//     const existingg = await productSchema.findOne({ bookname });

// }

adminHomeController.postEditGenre = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const { genrename } = req.body;
      const genreId = req.params.id;

      const existingGenre = await genreSchema.findOne({
        genrename,
        _id: { $ne: genreId },
      });

      if (existingGenre) {
        return res.render("genreedit", {
          error: "Genre with the same name already exists",
          genre: "",
        });
      }

      const Alphabetic = /^[a-zA-Z]+$/;
      if (!Alphabetic.test(genrename)) {
        // Invalid characters in genrename. Only alphabets are allowed.
        return res.render("genreedit", {
          error: "Invalid characters in Genre Name",
          genre: "",
        });
      }

      const updatedGenre = await genreSchema.findByIdAndUpdate(genreId, {
        genrename,
      });

      res.redirect("/admin/admingenres");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    // Handle database update error
    if (err.code === 11000) {
      res.render("genreedit", { error: "User already exists" });
    } else {
      res.status(500).send("Internal Server Error");
      console.error("Error during update:", err);
    }
  }
};

adminHomeController.productUnlist = async (req, res) => {
  /// product unlist
  if (req.session.adminlogin) {
    try {
      const bookId = req.params.id;

      const book = await productSchema.findById(bookId);

      if (book) {
        book.isListed = false;
        await book.save();
        res.redirect("/admin/adminbooks");
      }
    } catch (error) {
      console.error("Error toggling user block status:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/admin");
  }
};

adminHomeController.productList = async (req, res) => {
  /// product unlist
  if (req.session.adminlogin) {
    try {
      const bookId = req.params.id;

      const book = await productSchema.findById(bookId);

      if (book) {
        book.isListed = true;
        await book.save();
        res.redirect("/admin/adminbooks");
      }
    } catch (error) {
      console.error("Error toggling user block status:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/admin");
  }
};

adminHomeController.genreUnlist = async (req, res) => {
  /// genre unlist
  if (req.session.adminlogin) {
    try {
      const genreId = req.params.id;

      const genre = await genreSchema.findById(genreId);

      if (genre) {
        genre.isListed = false;
        await genre.save();
        res.redirect("/admin/admingenres");
      }
    } catch (error) {
      console.error("Error toggling user block status:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/admin");
  }
};

adminHomeController.genreList = async (req, res) => {
  /// genre unlist

  try {
    if (req.session.adminlogin) {
      const genreId = req.params.id;

      const genre = await genreSchema.findById(genreId);

      if (genre) {
        genre.isListed = true;
        await genre.save();
        res.redirect("/admin/admingenres");
      }
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.viewbookdetails = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const bookId = req.params.id;
      const item = await productSchema.findById(bookId);
      res.render("viewmorebook", { item });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.deleteBook = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const bookId = req.params.id;

      await productSchema.findByIdAndDelete(bookId);

      res.redirect("/admin/adminbooks");
      // res.render('admingenres', { genres});
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.couponsList = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      console.log("Working");
      const coupons = await couponSchema.find({});

      res.render("admincoupons", { coupons });
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.getAddCoupon = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const coupons = await couponSchema.find({});
      res.render("addcoupon");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.getPostcoupon = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const {
        couponType,
        DiscountValue,
        minimumPurchaseAmount,
        Expiry,
        couponCode,
      } = req.body;

      const newCoupon = new couponSchema({
        couponType,
        DiscountValue,
        minimumPurchaseAmount,
        Expiry,
        couponCode,
      });
      console.log(newCoupon);
      await newCoupon.save();
      res.redirect("/admin/admincoupons");
    }
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.deleteCoupon = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const couponId = req.params.id;

      await couponSchema.findByIdAndDelete(couponId);

      res.redirect("/admin/admincoupons");
      // res.render('admingenres', { genres});
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.logoutAdmin = (req, res) => {
  req.session.adminlogin = false;

  res.redirect("/admin");
};

adminHomeController.adminOfferModule = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const offers = await offerSchema.find({});
      res.render("adminoffermodule", { offers });
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.addOfferModule = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const genres = await genreSchema.find({});
      const books = await productSchema.find({});
      res.render("addoffers", { genres, books });
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.addOfferModulePost = async (req, res) => {
  try {
    console.log("offer post reached");
    if (req.session.adminlogin) {
      const {
        offerName,
        discountOn,
        discountValue,
        startDate,
        endDate,
        selectedGenre,
        selectedBook,
      } = req.body;
      console.log("req.body:", req.body);

      const selectedValue = selectedGenre || selectedBook;
      console.log('offer Selected value:',selectedValue);

      const newOffer = new offerSchema({
        offerName,
        discountOn,
        discountValue,
        startDate,
        endDate,
        selectedField: selectedValue,
      });

      await newOffer.save();

      const percentage = discountValue / 100;

      console.log("percentage:", percentage);

      if (discountOn === "Genres") {
        const products = await productSchema.find(
          { genrename: selectedValue }
        );

    console.log('offer products for:',products)
        for (const book of products) {

          const discount = book.originalPrice - book.originalPrice * percentage;
      
      
          await productSchema.updateOne(
            { _id: book.id, genrename: selectedValue },
            { $set: { discountPrice: discount } }
          );
      
        }

        if (!products) {
          res.send("error updating price  based on Genres");
        }
      } else {
        const products = await productSchema.find(
          { genrename: selectedValue }
        );

        for (const book of products) {
          const discount = book.originalPrice - book.originalPrice * percentage;
      
      
          await productSchema.updateOne(
            { _id: book.id, bookname: selectedValue },
            { $set: { discountPrice: discount } }
          );
      
        }

        if (!products) {
          res.send("error updating price based on Books");
        }
      }

      res.redirect("/admin/adminoffermodule");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error :", err);
    res.status(500).send("Internal Server Error");
  }
};

adminHomeController.addOfferModuleEdit = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const offerId = req.params.id;
      const offer = await offerSchema.findById(offerId);
      const genres = await genreSchema.find({});
      const books = await productSchema.find({});
      res.render("adminofferedit", { offer, genres, books,error:'' });
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};


adminHomeController.addOfferModulePostEdit = async (req, res) => {
  try {
    console.log("offer edit post reached");
    if (req.session.adminlogin) {

      const offerId = req.params.id;
      console.log('offerIdParams:',offerId);
      const {
        offerName,
        discountOn,
        discountValue,
        startDate,
        endDate,
        selectedGenre,
        selectedBook,
      } = req.body;
      console.log("req.body edit:", req.body);

      const selectedValue = selectedGenre || selectedBook;
      const genres = await genreSchema.find({});
      const books = await productSchema.find({});
      const offer = await offerSchema.findById(offerId);
      const existingOffer = await offerSchema.findOne({offerName,_id:{$ne:offerId}})
      if(existingOffer){
        return res.render("adminofferedit", {
          error: "Offer with the same name already exists",genres,books,
        });
      }
const Offer = await offerSchema.findByIdAndUpdate(offerId,{
  offerName,
  discountOn,
  discountValue,
  startDate,
  endDate,
  selectedField: selectedValue,
})
   

      await Offer.save();

      const percentage = discountValue / 100;

      console.log("percentage:", percentage);

      if (discountOn === "Genres") {
        const products = await productSchema.find(
          { genrename: selectedValue }
        );

    
        for (const book of products) {
          const discount = book.originalPrice - book.originalPrice * percentage;
      
      
          const updateDiscount = await productSchema.updateOne(
            { _id: book._id, genrename: selectedValue },
            { $set: { discountPrice: discount } }
          );
      
        }

        if (!products) {
          res.send("error updating price  based on Genres");
        }
      } else {
        const products = await productSchema.find(
          { genrename: selectedValue }
        );
        
        for (const book of products) {
          const discount = book.originalPrice - book.originalPrice * percentage;
      
      
          const updateDiscount = await productSchema.updateOne(
            { _id: book._id, bookname: selectedValue },
            { $set: { discountPrice: discount } }
          );
      
        }

        if (!products) {
          res.send("error updating price based on Books");
        }
      }

      res.redirect("/admin/adminoffermodule");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error :", err);
    res.status(500).send("Internal Server Error");
  }
};




adminHomeController.OfferDeactivate = async (req, res) => {
  try {
    
    if (req.session.adminlogin) {
      console.log("offer deactivate reached");
      const offerId = req.params.id;

   const offer = await offerSchema.findById(offerId);
   console.log('deactivate offer:',offer);

   const offervalue = offer.selectedField;

  if(offer){
    offer.isActive=false;
  }

  offer.save();

   console.log('kiiti offervalue:',offervalue);

   const products = await productSchema.find({
    $or: [
      { genrename: offervalue },
      { bookname: offervalue }
    ]
  });

  if (!products) {
    res.send("error updating price based on Books");
  }
  
  for (const book of products) {

    const discount = book.originalPrice - book.originalPrice*0 ;


    await productSchema.updateOne(
      {
        _id: book.id,
        $or: [
          { genrename: offervalue },
          { bookname: offervalue }
        ]
      },
      { $set: { discountPrice: discount } }
    );
    

  }

      res.redirect("/admin/adminoffermodule");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error :", err);
    res.status(500).send("Internal Server Error");
  }
};


adminHomeController.OfferActivate = async (req, res) => {
  try {
    
    if (req.session.adminlogin) {
      console.log("offer deactivate reached");
      const offerId = req.params.id;

   const offer = await offerSchema.findById(offerId);
   console.log('deactivate offer:',offer);

   const offervalue = offer.selectedField;
const offerDiscount = offer.discountValue;
const percentage = offerDiscount/100;
  if(offer){
    offer.isActive=true;
  }

  offer.save();

   console.log('kiiti offervalue:',offervalue);

   const products = await productSchema.find({
    $or: [
      { genrename: offervalue },
      { bookname: offervalue }
    ]
  });

  if (!products) {
    res.send("error updating price based on Books");
  }
  
  for (const book of products) {

    const discount = book.originalPrice - book.originalPrice*percentage;


    await productSchema.updateOne(
      {
        _id: book.id,
        $or: [
          { genrename: offervalue },
          { bookname: offervalue }
        ]
      },
      { $set: { discountPrice: discount } }
    );
    

  }

      res.redirect("/admin/adminoffermodule");
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.error("Error :", err);
    res.status(500).send("Internal Server Error");
  }
};






adminHomeController.orderGraph = async (req, res) => {
  try {
    const selectedDate = req.query.date;

    console.log('lastCheckGraphDate:',selectedDate)

    const result = await orderSchema.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(selectedDate),
            $lt: new Date(selectedDate + "T23:59:59"),
          },
        },
      },
      {
        $group: {
          _id: "$orderDate",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("result graph:", result);
    res.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

adminHomeController.orderGraphYear = async (req, res) => {
  try {
    const orders = await orderSchema.find({}).sort({ orderdate: 1 }).exec();

    const result = orders.reduce((acc, order) => {
      const year = order.orderDate.getFullYear();

      if (!acc[year]) {
        acc[year] = 1;
      } else {
        acc[year] += 1;
      }

      return acc;
    }, {});

    console.log("result graph:", result);
    res.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

adminHomeController.orderGraphMonth = async (req, res) => {
  try {
    const year = req.query.year;
    console.log("year:", year);

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const orders = await orderSchema
      .find({
        orderDate: {
          $gte: startDate,
          $lt: endDate,
        },
      })
      .sort({ orderdate: 1 })
      .exec();


    const result = orders.reduce((acc, order) => {
      const month = order.orderDate.getUTCMonth() + 1;

      if (!acc[month]) {
        acc[month] = 1;
      } else {
        acc[month] += 1;
      }

      return acc;
    }, {});

   
    res.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

adminHomeController.recentDate = async (req, res) => {
  try {
    const RecentOrder = await orderSchema
      .findOne()
      .sort({ orderDate: -1 })
      .limit(1);

    if (RecentOrder) {
      const recentDate = RecentOrder.orderDate.toISOString().split("T")[0];

      RecentOrder.date = recentDate;

      console.log("recent date:", RecentOrder.date);

      res.json(recentDate);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error("Error fetching most recent date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

adminHomeController.salesReportPdf = async (req, res) => {
  try {
    if (req.session.adminlogin) {
      const year = req.query.year;


const doc = new PDFDocument();
const filename = 'sales_report.pdf'
const folder = 'reports'
const filePath = path.join(__dirname,  folder,filename);
let orders=[];
      
if(year){
   
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  orders = await orderSchema
      .find({
        orderDate: {
          $gte: startDate,
          $lt: endDate,
        },
      })


    }else {
         orders = await orderSchema.find({}).sort({ orderdate: 1 }).exec();
      
    }
      

      let orderCount = 0;
      doc.text(`Sales Reports `);

      orders.forEach((order) => {
        orderCount++;

        doc.moveDown();
        doc.text(`Order ${orderCount} Details:`);
       
        doc.moveDown();
        doc.text(`Order ID: ${order._id}`);
        doc.text(`User ID: ${order.userId}`);
        doc.text(`Total Amount: ${order.totalAmount}`);
        doc.text(`Order Date: ${order.orderDate.toDateString()}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.text(`Shipping Fee: ${order.shippingFee}`);
 
      });
      
   
      res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
      res.setHeader("Content-Type", "application/pdf");
      
      console.log('got end')
    
   doc.pipe(res);
   
      doc.end();
      
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("Error getting salesPdf:", error);
    res.status(500).json({ error: "Error generating sales report PDF" });
  }
};




adminHomeController.salesReportExcel = async (req, res) => {
    try {
      if (req.session.adminlogin) {
        console.log('excellll');
        const year = req.query.year;


        const filename = 'sales_report.xlsx'
        const folder = 'reports'
        const filePath = path.join(__dirname,  folder,filename);
        let orders=[];
              
        if(year){
           
            const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
            const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        
          orders = await orderSchema
              .find({
                orderDate: {
                  $gte: startDate,
                  $lt: endDate,
                },
              })
        
        
            }else {
                 orders = await orderSchema.find({}).sort({ orderdate: 1 }).exec();
              
            }
let orderCount=0;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');
  

        worksheet.addRow(['Order NO', 'Order Id', 'Customer Id','Book Name','Total Amount','Order Date','Payment Method',`Shipping Fee`]);
        orders.forEach((order) => {
            orderCount++;
            worksheet.addRow([`${orderCount}`,`${order.userId}`, `${order.userId}`,` `,`${order.totalAmount} `,`${order.orderDate.toDateString()} `,`${order.paymentMethod}`,`${order.shippingFee}`]);
    });
      

        res.setHeader("Content-Disposition", "attachment; filename=sales_report.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");



        workbook.xlsx.write(res).then(() => {
          res.end();
        });
      }
    } catch (error) {
      console.error("Error getting salesExcel:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };




module.exports = adminHomeController;
