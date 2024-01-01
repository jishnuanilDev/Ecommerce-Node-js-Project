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
let userHomeController = {};







userHomeController.showHomeInfo = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (req.session.userlogin) {




      const books = await productSchema.find({});
      res.render("userhomepage", { books,});
    } else {

      res.redirect('/');
    }

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send('Internal Server Error');
  }
};





userHomeController.userExplorebooks = async(req,res)=>{
  try{
    if(req.session.userlogin){


      const page = parseInt(req.query.page) || 1; // Get the requested page number or default to 1
    const pageSize = 12; // Number of books per page
    
    const skip = (page - 1) * pageSize;

    const books = await productSchema.find({}).skip(skip).limit(pageSize);
    const totalBooks = await productSchema.countDocuments({});

    const totalPages = Math.ceil(totalBooks / pageSize);

   
      const userId = req.session.userId;

  
      const genres = await genreSchema.find({})
      

      if(!books){
        res.send('book not found');
      }
      if(!genres){
        res.send('genre not found');
      }
res.render('bookexplore',{books,genres,message:'',totalPages,currentPage: page});

    }
  }catch (err) {
    console.error("Error:", err);
    return res.status(500).send('Internal Server Error');
  }
}





userHomeController.bookPageInfo = async (req, res) => {   /// Userhome bookpage info
  if (req.session.userlogin) {
    try {
      const bookId = req.params.id;
      const userId = req.session.userId;

      const bookpage = await productSchema.findById(bookId);
      const cart = await Cart.findOne({ userId });

      const isInCart = cart && cart.items && cart.items.some(item => item.productId._id.equals(bookpage._id));

      if (isInCart) {
        console.log("This book is in the cart");
        const inCart = true
        res.render('bookinfo', { bookpage, cart, userId, inCart })
      } else {
        console.log("This book is not in the cart");
        const inCart = false
        res.render('bookinfo', { bookpage, cart, userId, inCart })
      }


    } catch (err) {
      console.error(":", err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/')
  }


}


userHomeController.userProfile = async (req, res) => {   //UserProfilepage
  if (req.session.userlogin) {
    const userId = req.session.userId

    const user = await User.findById(userId);

    res.render('userprofile', { user });
  } else {
    res.redirect('/');
  }
};




userHomeController.userProfileEdit = async (req, res) => {
  try {
    if (req.session.userlogin) {
      const { firstname, lastname, email } = req.body;
      const userId = req.session.userId
      const user = await User.findById(userId)

      if (!user) {
        res.send('user not found');
      }
      await User.findByIdAndUpdate(userId, { firstname: firstname, lastname: lastname, email: email })
      res.redirect('/userprofile')
    } else {
      res.redirect('/')
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send('Internal Server Error');
  }
}





userHomeController.userPasswordSection = (req, res) => {  /// UserpasswordPage
  if (req.session.userlogin) {
    res.render('userchangepassword', { Perror: '', Perror2: '', Perror3: '' })
  } else {
    res.redirect('/');
  }

}

userHomeController.userAddress = async (req, res) => {
  if (req.session.userlogin) {
    const userId = req.session.userId;
    try {
      const user = await User.findById(userId);

      if (!user) {
        // Handle case where user is not found
        return res.status(404).send('User not found');
      }

      const addresses = user.address;


      res.render('useraddress', { addresses });
    } catch (err) {
      console.error("Error fetching user address:", err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/');
  }
};


userHomeController.userAddAddress = (req, res) => {
  try {


    if (req.session.userlogin) {

      // const Countries = Country.getAllCountries()
      //  const States = State.getAllStates()

      const States = State.getStatesOfCountry('IN')



      res.render('addaddress', { States });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error("Error fetching user address:", err);
    res.status(500).send('Internal Server Error');
  }

}



userHomeController.userAddressPost = async (req, res) => {
  if (req.session.userlogin) {
    try {
      const userId = req.session.userId;
      const { name, phone, email, streetaddress, landmark, country, state, city, addressline1, addressline2, zipcode } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        // Handle case where user is not found
        return res.status(404).send('User not found');
      }
      const userAdr = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            address: {
              name,
              phone,
              email,
              streetaddress,
              landmark,
              country,
              state,
              city,
              addressline1,
              addressline2,
              zipcode
            },
          },
        },
        { new: true }
      );




      if (!userAdr) {
        return res.status(404).send('User not found');
      }




      user.address.push({

      });




      res.redirect('/useraddress');
    } catch (err) {
      console.error("Error saving user address:", err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/')
  }


};



userHomeController.userAddressDelete = async (req, res) => {
  if (req.session.userlogin) {

    const userId = req.session.userId;

    const addressIdToDelete = req.body.addressId;
    console.log(addressIdToDelete);
    try {
      const user = await User.findById(userId);
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { address: { _id: addressIdToDelete } } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.redirect('/useraddress')

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.redirect('/');
  }

};




userHomeController.userAddressEdit = async (req, res) => {
  try {
    if (req.session.userlogin) {


      const addressIndex = req.query.addressIndex;

      const userId = req.session.userId;
      const user = await User.findById(userId)


      if (!user) {
        return res.status(404).json({ error: 'Address not found' });
      }

      const userAddress = user.address[addressIndex];
      const States = State.getStatesOfCountry('IN')


      res.render('editaddress', { userAddress, States })

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}





userHomeController.userAddressEditPost = async (req, res) => {
  if (req.session.userlogin) {
    try {
      const userId = req.session.userId;
      const { name, phone, email, streetaddress, landmark, country, state, city, addressline1, addressline2, zipcode } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        // Handle case where user is not found
        return res.status(404).send('User not found');
      }
      const userAdr = await User.findByIdAndUpdate(
        userId,
        {

          address: {
            name: name,
            phone: phone,
            email: email,
            streetaddress: streetaddress,
            landmark: landmark,
            country: country,
            state: state,
            city: city,
            addressline1: addressline1,
            addressline2: addressline2,
            zipcode: zipcode

          },
        },
        { new: true }
      );




      if (!userAdr) {
        return res.status(404).send('User not found');
      }


      res.redirect('/useraddress');
    } catch (err) {
      console.error("Error saving user address:", err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/')
  }


};






userHomeController.userPasswordChange = async (req, res) => {
  try {
    if (req.session.userlogin) {
      const userId = req.session.userId;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      const user = await User.findById(userId);

      if (!user) {

        return res.status(404).render('error404');
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.render('userchangepassword', { Perror: 'Please enter your correct password', Perror2: '', Perror3: '' });
      }

      if (newPassword !== confirmNewPassword) {
        return res.render('userchangepassword', { Perror2: 'Passwords not match', Perror: '', Perror3: '' });
      }

      if (newPassword === currentPassword) {
        return res.render('userchangepassword', { Perror2: 'Passwords do not match', Perror: '', Perror3: 'This is your current password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await User.findByIdAndUpdate(userId, { password: hashedPassword });

      return res.redirect('/userhomepage');
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



userHomeController.userorders = async (req, res) => {
  try {
    if (req.session.userlogin) {
      const userId = req.session.userId;

      // Assuming orderSchema has a field like "userId" to link orders to users
      const orders = await orderSchema
        .find({ userId: userId })
        .populate('items.productId');



      // Iterate over orders and log productId


      // orders.forEach(order => {
      //   order.items.forEach(item => {
      //     console.log('Product ID:', item.productId._id); // Accessing the ObjectId of the product
      //     console.log('Book Name:', item.productId.bookname); // Accessing the bookname property of the product
      //   });
      // })

      res.render('userorders', { orders }); // Pass orders as an object to the view

    } else {
      res.redirect('/');
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};






userHomeController.userOrderCancel = async (req, res) => {
  try {
    if (req.session.userlogin) {
      const userId = req.session.userId;
      const orderId = req.params.id;

      // Find the order and check if it belongs to the user
      const order = await orderSchema.findOne({ userId, _id: orderId });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if the order can be canceled based on your business logic
      if (order.status !== 'Cancelled') {
        // Update order status to "canceled"
        order.status = 'Cancelled';
        await order.save();

       res.redirect('/user-myOrders')

  
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }else{
    res.redirect('/')
  }
 } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}




userHomeController.userSearch = async (req, res) => {
  const { search } = req.query; 
  console.log(search);

  try {
      const books = await productSchema.find({
          bookname: new RegExp("^" + search, "i"),
      });

      console.log(books);
      if (req.session.userlogin) {
          if (books.length > 0) {
              res.render("bookexplore", { books});
          
          } else {
              res.render("sampleuserhome");
          }

      } else {
          res.redirect('/adminlogin')
      }


  } catch (error) {
      console.error("Error searching for users:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}








userHomeController.logoutUser = (req, res) => {

  req.session.userlogin = false;

  // Redirect to the home page or any other appropriate page
  res.render('loginpage', { errorMessage: '', logout: 'Logout Successfully', blocked: '' });

};










module.exports = userHomeController;


//         const userId = req.session.userId;

//         const user = await User.findById(userId);

// if(user && user.isBlocked==true) {
//     req.session.userlogin = false;
//     res.redirect("/");
// }