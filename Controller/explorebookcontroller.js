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






// exploreBookController.userFilterGenre = async (req, res) => {
//     try {
//         if (req.session.userlogin) {
//             const genrename = req.query.data;
//             console.log(genrename);

//             const books = await productSchema.find({ genrename: genrename });
//             const genres = await genreSchema.find({});

//             if (!books || books.length === 0) {
//                 return res.render('bookexplore', { books: [], genres, message: 'No Results Found', totalPages: '', currentPage: "" });
//             }

//             return res.render('bookexplore', { books, genres, message: "", totalPages: '', currentPage: "" });
//         } else {
//             return res.redirect('/user');
//         }
//     } catch (err) {
//         console.error('Error:', err);
//         // Send an error response only if no response has been sent before
//         if (!res.headersSent) {
//             return res.status(500).send('Internal Server Error');
//         }
//     }
// }


exploreBookController.userFilterGenre = async (req, res) => {
    try {
        if (req.session.userlogin) {

        
                const genrename = req.query.data;
                
                console.log('CheckBoxFetch:',genrename);
    
                const books = await productSchema.find({ genrename: genrename });
                console.log('books ind:',books)
                const genres = await genreSchema.find({});
                if (!books || books.length === 0) {
                    return res.json('No Results Found')
                }


                res.json({books});
        
         
           
        } else {
                return res.redirect('/user');
            }
    } catch (err) {
        console.error('Error:', err);
        // Send an error response only if no response has been sent before
        if (!res.headersSent) {
            return res.status(500).send('Internal Server Error');
        }
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
            res.redirect('/user');
        }
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Internal Server Error');
    }
}



module.exports = exploreBookController;