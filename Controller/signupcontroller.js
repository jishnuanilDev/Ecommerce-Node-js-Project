const express= require('express');
const Model = require('../models/userschema');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyparser = require('body-parser');
const sendEmail  = require('../Controller/otpmailer');
const generateOTP = require('../Controller/otp-generator');
let userlogin
let adminlogin

const signUpController={};





signUpController.showSignupInfo = (req, res) => {   /// sigup page 

  if (req.session.userlogin) {
      res.redirect('/user/userhomepage');
  }
  else {
      res.render('signuppage',{error:''});
  }
};



signUpController.register = (req, res) => {
  res.redirect('/user/signup');
 };
 





signUpController.signUp = async (req,res)=>{
  const {firstname,lastname,email,password} = req.body;

req.session.useremail = email;
  try {

    const existingUser = await Model.findOne({email})
    
    if(existingUser){
      res.render('signuppage',{error:'User already exists'});
    }

    const hashedPassword = await process.env.bcrypt 

    const OTP = generateOTP(6);
    const subject = 'Your OTP for verification';
    const text = `Your OTP is: ${OTP}. Please use this code to verify your identity.`;
 
    sendEmail(req.session.useremail, subject, text);

  const newUser = {
    firstname,
    lastname,
    email,
    password:hashedPassword,
    OTP
  }

  req.session.userData = newUser; 

   

    res.render('verify-otp',{errorOTP:""});

  } catch (err) {
    console.error("Error during signup:", err);
    res.redirect('/user/signup');
  }
} 









  signUpController.verifyOTP = async (req, res) => {
    console.log('clicked');
    try { 
      const enteredOTP = req.body.enteredOTP; // Assuming the OTP is part of the request body
      const storedUserData = req.session.userData;

  console.log('userentered:',enteredOTP);
  console.log('generated:',storedUserData.OTP);
    
      if (enteredOTP === storedUserData.OTP) {

const newUser = new Model({
  firstname: storedUserData.firstname,
  lastname:  storedUserData.lastname,
  email:storedUserData.email,
  password: storedUserData.password
})

        newUser.save()
          .then(() => {
            req.session.userlogin = true;
            req.session.userId = newUser._id;
            if (req.session.userlogin) {
              res.redirect('/user/userhomepage');
            } else {
              res.redirect('/user');
            }
          })
          .catch((err) => {
          
              res.status(500).send('Internal Server Error 1'); 
              console.error("Error during update:", err);
            }
          );
      } else {
        return res.render('verify-otp', { errorOTP: 'Invalid OTP' });
      }
      
      
    
      // Clear the OTP from stored data
      // Assuming there's a field named 'otp' in storedUserData, set it to undefined
      storedUserData.OTP = undefined;
    
      
    } catch (err) {
      res.status(500).send('Internal Server Error 2');
        console.error("Error during update:", err);
    }
  }
    




  signUpController.resendOTP = (req,res)=> {
    try{
      const email = req.session.useremail
      const OTP = generateOTP(6);
      const subject = 'Your OTP for verification';
      const text = `Your OTP is: ${OTP}. Please use this code to verify your identity.`;
    
      sendEmail(email, subject, text);
    
      res.render('verify-otp',{errorOTP:""});
    }catch (err) {
      console.error("Error during signup:", err);
      res.redirect('/user/signup');
    }
     
    }

module.exports = signUpController;