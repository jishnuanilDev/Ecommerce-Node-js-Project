const express = require('express');
const app = express()
const router = express.Router();
const Model = require('../models/userschema');
const loginController = require('../Controller/logincontroller');
const signUpController = require('../Controller/signupcontroller'); 
const userHomeController = require('../Controller/userhomeontroller');
const cartController = require('../Controller/cartController');
const paymentController = require('../Controller/paymentController');
const exploreBookController = require('../Controller/explorebookcontroller');
const checkBlocked = require('../middleware/userBlocked');
const  validateFields  = require('../middleware/ValidateFields');



// const imageValidate = require('../middleware/imagevalidation.js');


// router.get('/',index.showIndex); // userhome page without login

router.get('/', checkBlocked, loginController.showLoginInfo);  // get user loginpage

router.get('/signin', loginController.signin);  // get user loginpage ony

router.post('/login', loginController.forLoginInfo); 

router.get('/userForgotPassword', loginController.userForgotPasswordEmail);   

router.post('/userForgotPassword',loginController.userForgotPasswordEmailpost); 

router.get('/coupons', cartController.coupons);  


router.get('/signup', signUpController.showSignupInfo);  //get signup
router.get('/register', signUpController.register);  //get signup only

router.post('/signup', signUpController.signUp);


router.post('/verifyotp', signUpController.verifyOTP);

router.post('/verifyOTPF',  loginController.ForgorPasswordOTPverify);


router.post('/passwordReset',  loginController.userPasswordReset);

router.get('/resend-OTP',signUpController.resendOTP);

router.get('/userhomepage', checkBlocked, userHomeController.showHomeInfo); //userhomepage access

router.get('/userhomepage-books', userHomeController.userExplorebooks); //userhomepage access

router.get('/filter-genre', exploreBookController.userFilterGenre); //userhomepage access

router.get('/filter-book/:publisher',exploreBookController.userFilterBook); //userhomepage access

router.get('/userSearch', userHomeController.userSearch); 


router.get('/books/bookInfo/:id', checkBlocked, userHomeController.bookPageInfo);


router.post('/books/bookInfo/:id',cartController.addToCart); 

router.get('/userviewcart', cartController.viewcart);  

router.get('/updateTotalSum', cartController.cartSummary); 

router.get('/check',cartController.checkCart);


router.get('/userviewwishlist', cartController.viewwishlist);

router.post('/books/addwishlist', cartController.addToWishlist);


router.get('/removewishlist/:id', cartController.removeWishlist); 

router.get('/removecart/:id', cartController.removeCart); 

router.get('/userPayment', paymentController.userPayment);  /// view cart

router.post('/confirmCheckoutCOD',paymentController.confirmCheckoutCOD)  

router.post('/orderConfirm',paymentController.orderConfirm)  

router.get('/orderplaced',paymentController.orderPlaced)

router.get('/userinvoice',paymentController.userInvoice) 




// router.post('/cart-update-quantity/:productId', cartController.updateQuantity);
router.put('/updateQuantity/:bookId/:quantity', cartController.quantityUpdate);

router.get('/user-myOrders', userHomeController.userorders);

router.post('/orders/cancel-order/:id', userHomeController.userOrderCancel); 

router.post('/orders/return-order/:id', userHomeController.userOrderReturn);



router.get('/userLogout', userHomeController.logoutUser); //logoutUser
router.get('/userprofile', userHomeController.userProfile); //user profile
router.post('/userprofile', userHomeController.userProfileEdit); //user profile

router.post('/userPassword', userHomeController.userPasswordChange); //post address 

router.get('/useraddress', userHomeController.userAddress); //user address
router.post('/useraddress', userHomeController.userAddressPost); //post address   

router.get('/useraddaddress',  userHomeController.userAddAddress);

router.get('/userWallet',  userHomeController.userWalletPage);

router.post('/updateWallet', userHomeController.userWalletUpdate);
router.post('/useraddress-delete',  userHomeController.userAddressDelete); //user address

router.get('/useraddress-edit',    userHomeController.userAddressEdit); //user address

router.post('/useraddress-edit',    userHomeController.userAddressEditPost); //user address

router.get('/userChangePassword', userHomeController.userPasswordSection); //user profile


module.exports = router; 