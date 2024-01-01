const express = require('express');
const router = express.Router();
const Model = require('../models/userschema');
const adminLoginController = require('../Controller/adminlogincontroller');
const adminHomeController = require('../Controller/adminhomecontroller');

router.get('/', adminLoginController.showAdminLoginInfo); //get admin login page

router.post('/adminlogin', adminLoginController.PostAdminLoginInfo); //post admin login page

router.get('/adminpanel', adminHomeController.adminPageInfo); //get admin login page

router.get('/adminorders', adminHomeController.adminOrdersInfo);  // admin orders

router.post('/updateOrderStatus/:id',adminHomeController.updateOrderStatus);

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