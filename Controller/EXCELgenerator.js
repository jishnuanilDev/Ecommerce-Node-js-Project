const express = require('express');
const User = require('../models/userschema');
const productSchema = require('../models/productschema');  
const genreSchema = require('../models/genreschema');
const orderSchema = require('../models/order');

const ExcelJS = require('exceljs'); 

function generateSalesReport() {


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    worksheet.addRow(['Product', 'Quantity', 'Revenue']);
    worksheet.addRow(['Product A', 100, 5000]);
    return workbook.xlsx.writeBuffer();
}


module.exports = { generateSalesReport };