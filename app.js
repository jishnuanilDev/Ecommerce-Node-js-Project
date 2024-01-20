const express=require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const fs=require('fs');
const ejs=require('ejs');
const path=require('path');
const bodyparser=require('body-parser');
const flash = require('express-flash');
const fileUpload = require('express-fileupload');
const app =express();
const Model = require('./models/userschema');
const nocache =require('nocache')
require('dotenv').config();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const userroute=require('./routes/userroute');
const adminroute=require('./routes/adminroute');


const mongoose = require('mongoose');
const session = require('express-session');





app.use(flash());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assetsss',express.static(path.join(__dirname,'public/assetsss')))
app.use('/assetsproductform',express.static(path.join(__dirname,'public/assetsproductform')))
app.use(express.static('public'))

mongoose.connect('mongodb://0.0.0.0:27017/User')
.then(()=>{  
    console.log("Database connected");
}).catch((err)=>{
    console.error('Error connecting to the database:', err);
})

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.use(nocache())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
// Configure express-session
app.use(
  session({
    secret: 'SESSION_SECRET',
    resave: false,
    saveUninitialized: false,
  })
);




 
app.use('/user', userroute);
app.use('/admin', adminroute);




const port=process.env.PORT || 3000;
app.listen(port,()=>console.log('server started'));