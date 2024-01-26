const express = require('express');
const User = require('../models/userschema');
const productSchema = require('../models/productschema');  
const genreSchema = require('../models/genreschema');
const orderSchema = require('../models/order');


const PDFDocument = require('pdfkit'); 


function generateSalesReport() {

    const doc = new PDFDocument();





    return doc;
}


module.exports = { generateSalesReport };

