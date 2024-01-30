const Model = require('../models/userschema');
require('dotenv').config();
let userlogin
let adminlogin


let adminLogincontroller={};
//adminlogin get
adminLogincontroller.showAdminLoginInfo = (req,res)=>{
    if (req.session.adminlogin) {
        res.redirect('/admin/adminpanel');
    } else {
res.render('adminlogpage',{errorMessage:''});
    }
}


//adminlogin post

adminLogincontroller.PostAdminLoginInfo = (req,res)=>{
    const credentials = {
        username:process.env.adminuser,
        password:process.env.adminpass
    }
    
    const {username,password} = req.body;

    if(credentials.username!==username){
        res.render('adminlogpage',{ errorMessage: 'Invalid Username' }); 
    
    } if(credentials.password!==password){
        res.render('adminlogpage',{ errorMessage: 'Invalid Password' });
    
    }

    req.session.adminlogin = true; 
    res.render('adminpanel',{books:''});

}






module.exports = adminLogincontroller;