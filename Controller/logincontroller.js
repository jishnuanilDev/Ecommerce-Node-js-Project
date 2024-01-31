const express = require('express');
const User = require('../models/userschema');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();
const sendEmail = require('../Controller/otpmailer');
const generateOTP = require('../Controller/otp-generator');
let userlogin
let adminlogin
const loginController = {};




loginController.showLoginInfo = (req, res) => { /// login get

    if (req.session.userlogin) {
        res.redirect('/userhomepage')
    } else {

        res.render('loginpage', { errorMessage: '', logout: '', blocked: '' ,reset:''});
      
    }
};





loginController.signin = (req, res) => {
    res.redirect('/');
};





loginController.forLoginInfo = async (req, res) => {
    const { email, password } = req.body;
    try {



        const user = await User.findOne({ email });



        if (!user) {
            return res.render('loginpage', { errorMessage: 'Invalid email', logout: '', blocked: '' ,reset:''});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.render('loginpage', { errorMessage: 'Invalid password', logout: '', blocked: '' ,reset:''});
        }

        if (user && user.isBlocked) {
            // User is blocked, logout and show login page with a blocked message
            req.session.userlogin = false;
            return res.render('loginpage', { blocked: "Your account was blocked by Admin", errorMessage: '', logout: '' ,reset:''});
        }

        req.session.userlogin = true;
        req.session.userId = user._id;
        res.redirect('/userhomepage');
    } catch (err) {
        console.error('Error during user login:', err);
        // res.status(500).send('Internal Server Error');
        res.render('serverError')
    }
};



loginController.userForgotPasswordEmail = (req, res) => {
    try {
        res.render('forgotPassword', { userError: '' });
    } catch (err) {
        console.error('Error rendering forgotpass page:', err);
        res.render('serverError')
    }

};



loginController.userForgotPasswordEmailpost = async (req, res) => {

    try {

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {

            const OTP = generateOTP(6);
            const subject = 'Your OTP for verification';
            const text = `Your OTP is: ${OTP}. Please use this code to verify your identity.`;

            sendEmail(email, subject, text);

            const PasswordReset = {
                email,
                OTP
            }

            req.session.userOTP = PasswordReset;

            res.render('verify-OTPF', { OTPError: '' });

        } else {
            res.render('forgotpassword', { userError: 'User not exist' })
        }
    } catch (error) {
        // Handle any errors that occurred during the database query
        console.error('Error finding user by email:', error);
       
        res.render('serverError')
    }

};





loginController.ForgorPasswordOTPverify = async (req, res) => {
    console.log('clicked');
    try {
        const enteredOTP = req.body.enteredOTP;
        const storedOTP = req.session.userOTP;

        console.log('userentered:', enteredOTP);
        console.log('generated:', storedOTP.OTP);

        if (enteredOTP === storedOTP.OTP) {
            res.render('passwordResetForm',{PError:''});
        } else {
            return res.render('verify-OTPF', { OTPError: 'Invalid OTP' });
        }



        // Clear the OTP from stored data
        // Assuming there's a field named 'otp' in storedUserData, set it to undefined



    } catch (err) {
       
        console.error("Error verify otp:", err);
        res.render('serverError')
    }
}






loginController.userPasswordReset = async (req, res) => {
    try {
        const storedData = req.session.userOTP;

     

        const { newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.render('passwordResetForm', { PError: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const userEmail = storedData.email;

        // Find the user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.render('passwordResetForm', { PError: 'User not found' });
        }

        // Update the user's password
        user.password = hashedPassword;

        // Save the updated user to the database
        await user.save();

        // You may also want to clear the userOTP from the session or handle it as needed

        res.render('loginpage',{reset:'Password Reseted',blocked:"",logout:'',errorMessage:''}); // Render a success page or redirect
    } catch (err) {
        console.error('Error during password reset:', err);
        res.render('serverError')
    }
};








module.exports = loginController;