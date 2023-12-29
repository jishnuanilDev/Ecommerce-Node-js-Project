const express = require('express');
const router = express.Router();
const Model = require('../models/userschema');
const loginController = require('../Controller/logincontroller');
const signUpController = require('../Controller/signupcontroller'); 
const adminHomeController = require('../Controller/adminhomecontroller');
const userHomeController = require('../Controller/userhomeontroller');
const adminLoginController = require('../Controller/adminlogincontroller');
const cartController = require('../Controller/cartController');
const paymentController = require('../Controller/paymentController');
const checkBlocked = require('../middleware/userBlocked');
const  validateFields  = require('../middleware/ValidateFields');

// const imageValidate = require('../middleware/imagevalidation.js');
paymentController

// router.get('/',index.showIndex); // userhome page without login

router.get('/', checkBlocked, loginController.showLoginInfo);  // get user loginpage

router.get('/signin', loginController.signin);  // get user loginpage ony

router.post('/login', loginController.forLoginInfo); 

router.get('/userForgotPassword', loginController.userForgotPasswordEmail);   

router.post('/userForgotPassword',loginController.userForgotPasswordEmailpost); 

router.post('',loginController.userForgotPasswordEmailpost); 

router.get('/signup', signUpController.showSignupInfo);  //get signup
router.get('/register', signUpController.register);  //get signup only

router.post('/signup', signUpController.signUp);


router.post('/verifyotp', signUpController.verifyOTP);

router.post('/verifyOTPF',  loginController.ForgorPasswordOTPverify);


router.post('/passwordReset',  loginController.userPasswordReset);

router.get('/resend-OTP',signUpController.resendOTP);

router.get('/userhomepage', checkBlocked, userHomeController.showHomeInfo); //userhomepage access

router.get('/books/bookInfo/:id', checkBlocked, userHomeController.bookPageInfo); // get bookdetails info


router.post('/books/bookInfo/:id',cartController.addToCart); //post cart 

router.get('/userviewcart', cartController.viewcart);  /// view cart
router.get('/updateTotalSum', cartController.cartSummary); 



router.get('/userPayment', paymentController.userPayment);  /// view cart
router.post('/confirmCheckoutCOD',paymentController.confirmCheckoutCOD)

// router.post('/cart-update-quantity/:productId', cartController.updateQuantity);
router.put('/updateQuantity/:bookId/:quantity', cartController.quantityUpdate);
router.get('/user-myOrders', userHomeController.userorders);


router.get('/userLogout', userHomeController.logoutUser); //logoutUser
router.get('/userprofile', userHomeController.userProfile); //user profile
router.post('/userprofile', userHomeController.userProfileEdit); //user profile

router.post('/userPassword', userHomeController.userPasswordChange); //post address 

router.get('/useraddress', userHomeController.userAddress); //user address
router.post('/useraddress', userHomeController.userAddressPost); //post address   

router.get('/useraddaddress',  userHomeController.userAddAddress);


router.post('/useraddress-delete',  userHomeController.userAddressDelete); //user address

router.get('/useraddress-edit',    userHomeController.userAddressEdit); //user address

router.post('/useraddress-edit',    userHomeController.userAddressEditPost); //user address

router.get('/userChangePassword', userHomeController.userPasswordSection); //user profile

router.get('/adminlogin', adminLoginController.showAdminLoginInfo); //get admin login page

router.post('/adminlogin', adminLoginController.PostAdminLoginInfo); //post admin login page

router.get('/adminpanel', adminHomeController.adminPageInfo); //get admin login page

router.get('/adminorders', adminHomeController.adminOrdersInfo);  // admin orders

router.get('/adminusers',  adminHomeController.adminUsersInfo)  // admin users info


router.get('/adminusers/block/:id', adminHomeController.blockUser); // block management user

router.get('/adminusers/unblock/:id', adminHomeController.unBlockUser); // unblock management user


router.get('/adminbooks', adminHomeController.booksInfo); // admin books/genres management

router.get('/admin/productunlist/:id', adminHomeController.productUnlist); // admin product/books unlisting

router.get('/admin/productlist/:id', adminHomeController.productList ); // admin product/books unlisting

router.get('/admin/bookedit/:id', adminHomeController.editBookInfo); // admin edit books management

router.post('/admin/bookedit/:id', adminHomeController.postUpdateInfo) // post products update

router.get('/admin/bookview/:id', adminHomeController.viewbookdetails); // admin view booksdetails management

router.get('/admingenres', adminHomeController.genresInfo); // admin books/genres management

router.get('/add-products', adminHomeController.addProduct); // add products page -admin

router.post('/add-products',adminHomeController.postProduct); // post products - admin


router.get('/add-genres', adminHomeController.addGenre);

router.post('/add-genres', adminHomeController.postGenre);

router.get('/admin/genreunlist/:id', adminHomeController.genreUnlist);

router.get('/admin/genrelist/:id', adminHomeController.genreList)

router.get('/admin/genreedit/:id', adminHomeController.editGenre)

router.post('/admin/genreedit/:id', adminHomeController.postEditGenre)

router.get('/admin/genredelete/:id', adminHomeController.deleteGenre)

router.get('/admin/bookdelete/:id', adminHomeController.deleteBook)

router.get('/adminLogout', adminHomeController.logoutAdmin);


module.exports = router; 