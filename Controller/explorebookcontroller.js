const express = require('express');
const User = require('../models/userschema');
const productSchema = require('../models/productschema');
const genreSchema = require('../models/genreschema');
const { Cart, clearCart } = require('../models/cart');
const orderSchema = require('../models/order');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Country = require('country-state-city').Country
const State = require('country-state-city').State
let userlogin
let adminlogin
let exploreBookController = {};






exploreBookController.userFilterGenre = async (req, res) => {
    try {
        if (req.session.userlogin) {

         
            const genrename = req.params.genrename.toLowerCase(); // Convert to lowercase for case-insensitive matching

            console.log(genrename); // Correct variable name

     
      
            const books = await productSchema.find({ genrename:genrename });
    
         const genres = await genreSchema.find({})

            if (!books || books.length === 0) {
                res.render('bookexplore', { books:[] ,genres,message:'No Results Found',totalPages:'',currentPage: ""});
            }
            

            res.render('bookexplore', {books ,genres,message:"",totalPages:'',currentPage: ""});
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Internal Server Error');
    }
}





exploreBookController.userFilterBook = async (req, res) => {
    try {
        if (req.session.userlogin) {
            const publisher = req.params.publisher


            const books = await productSchema.find({ publisher:publisher });
        

         const genres = await genreSchema.find({})

            if (!books || books.length === 0) {
                res.render('bookexplore', { books:[] ,genres,message:'No Results Found',totalPages:"",currentPage:""});
             
            }
            

            res.render('bookexplore', {books,genres,message:'',totalPages:"",currentPage: ""});
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Internal Server Error');
    }
}



module.exports = exploreBookController;