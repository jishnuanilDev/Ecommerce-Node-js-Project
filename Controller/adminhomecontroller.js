const express = require('express');
const Model = require('../models/userschema');
const productSchema = require('../models/productschema');  
const genreSchema = require('../models/genreschema');
const fileUpload = require('express-fileupload');
const router = express.Router();
let userlogin
let adminlogin
router.use(fileUpload());



let adminHomeController = {};


adminHomeController.adminPageInfo = (req, res) => {  // adminpanel
    try {
        if (req.session.adminlogin) {
            res.render('adminpanel');
        } else {
            res.redirect('/adminlogin');
        }
    } catch (error) {
        console.error('Error toggling user block status:', error);
        res.status(500).send('Internal Server Error');
    }

}





adminHomeController.adminOrdersInfo = (req, res) => { // list user orders in admin panel
    try {
        if (req.session.adminlogin) {
            res.render('adminorders');
        } else {
            res.redirect('/adminlogin');
        }
    } catch (error) {
        console.error('Error toggling user block status:', error);
        res.status(500).send('Internal Server Error');
    }

}





adminHomeController.adminUsersInfo = async (req, res) => {  // list users in admin panel

    try {
        if (req.session.adminlogin) {
            const users = await Model.find({})
            res.render('adminusers', { users });
        } else {
            res.redirect('/adminlogin');
        }
    } catch (error) {
        console.error('Error toggling user block status:', error);
        res.status(500).send('Internal Server Error');
    }


}


adminHomeController.blockUser = async (req, res) => {   // blockuser list

    try {

        if (req.session.adminlogin) {
            const userId = req.params.id;

            const user = await Model.findById(userId)

            if (user) {
                user.isBlocked = true;
                await user.save();
                res.redirect('/adminusers')
            }

        } else {
            res.redirect('/adminlogin');
        }
    } catch (error) {
        console.error('Error toggling user block status:', error);
        res.status(500).send('Internal Server Error');
    }
}









adminHomeController.unBlockUser = async (req, res) => {  // unblock userlist


    try {

        if (req.session.adminlogin) {
            const userId = req.params.id;

            const user = await Model.findById(userId)

            if (user) {
                user.isBlocked = false;
                await user.save();
                res.redirect('/adminusers');
            }


        } else {
            res.redirect('/adminlogin');
        }
    } catch (error) {
        console.error('Error toggling user block status:', error);
        res.status(500).send('Internal Server Error');
    }
}






adminHomeController.booksInfo = (req, res) => {

    if (req.session.adminlogin) {
        productSchema.find({}).then((books) => {
            res.render('adminbooks', { books });

        }).catch((error) => {
            console.error('Error fetching user data:', error);
            res.status(500).render('error', { error: 'Internal server error' });
        });

    } else {
        res.redirect('/adminlogin');
    }
}



// adminHomeController.genresInfo = (req, res) => {
//     if (req.session.adminlogin) {
//     res.render('admingenres');
// }else{
//     res.redirect('/adminlogin');
// }
// }


adminHomeController.genresInfo = (req, res) => {

    if (req.session.adminlogin) {
        genreSchema.find({}).then((genres) => {
            res.render('admingenres', { genres });
        }).catch((error) => {
            console.error('Error fetching user data:', error);
            res.status(500).render('error', { error: 'Internal server error' });
        });

    } else {
        res.redirect('/adminlogin');
    }
}



adminHomeController.addProduct = (req, res) => {

    if (req.session.adminlogin) {
        genreSchema.find({}).then((genres) => {
            res.render('add-products', { genres, error: '', ISBNerror: '', errorIN: "" });
        }).catch((error) => {
            console.error('Error fetching user data:', error);
            res.status(500).render('error', { error: 'Internal server error' });
        });

    } else {
        res.redirect('/adminlogin');
    }
}



adminHomeController.postProduct = async (req, res) => {
    if (req.session.adminlogin) {
        try {

            const genres = await genreSchema.find({})

            const { bookname, genrename, language, author, aboutauthor, publisher, binding, ISBN, publicationdate, pages, bookoverview, price, quantity, status } = req.body;





            const existingBook = await productSchema.findOne({
                bookname: {
                    $regex: new RegExp('^' + bookname + '$', 'i')
                }
            })
            const existingISBN = await productSchema.findOne({ ISBN })

            if (existingBook || existingISBN) {
                // Genre with the same name already exists
                return res.render('add-products', { error: 'Book with the same details already exists', ISBNerror: 'Book with the same ISBN already exists', genres, errorIN: '' });
            }



            const Image = req.files.Image;


            const imagePath = './public/product-Images/' + Date.now() + '_' + Image.name;

            Image.mv(imagePath, function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
            });


            const newProduct = new productSchema({
                bookname,
                genrename,
                language, author, aboutauthor,
                publisher, binding, ISBN,
                publicationdate, pages, bookoverview, price, quantity, status,
                Image: imagePath,
            })


            newProduct.save()
                .then(() => {
                    res.redirect('/adminbooks');
                })



        }
        catch (err) {
            console.error('Error saving book:', err);
            res.status(500).send('Internal server error');
        }
    } else {
        res.redirect('/adminlogin')
    }



}


// /////////////////////////////////////////////////////////////////////////////////////////


adminHomeController.addGenre = (req, res) => {
    if (req.session.adminlogin) {
        res.render('add-genres', { error: '', genre: '' });
    } else {
        res.redirect('/adminlogin');
    }
}


// ////////////////////////////////////////////////////////////////////////////////////////



adminHomeController.postGenre = async (req, res) => {
    if (req.session.adminlogin) {
        const { genrename } = req.body;

        try {

            const existingGenre = await genreSchema.findOne({
                genrename: {
                    $regex: new RegExp('^' + genrename + '$', 'i')
                }
            });
            if (existingGenre) {
                // Genre with the same name already exists
                return res.render('add-genres', { error: 'Genre with the same name already exists', genre: '' });
            }
            const Alphabetic = /^[a-zA-Z]+$/;
            if (!Alphabetic.test(genrename)) {
                // Invalid characters in genrename. Only alphabets are allowed.
                return res.render('add-genres', { error: 'Invalid characters in Genre Name. ', genre: '' });
            }
            // If the genre is unique, save it
            const newGenre = new genreSchema({
                genrename
            });




            await newGenre.save();
            res.redirect('/admingenres');
        } catch (err) {
            console.error('Error saving genre:', err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/adminlogin')
    }

};




adminHomeController.editBookInfo = async (req, res) => {
    const bookId = req.params.id;


    if (req.session.adminlogin) {
        try {
            const item = await productSchema.findById(bookId);
            const genres = await genreSchema.find({})

            // if (!bookdetails) {

            //     res.render('error', { error: 'Book not found' });
            //     return;
            // }


            res.render('bookedit', { item, error: '', genres });
        }
        catch (error) {
            console.error('Error fetching book details:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {

        res.redirect('/adminlogin');

    }
}






adminHomeController.postUpdateInfo = async (req, res) => {
    try {
        if (req.session.adminlogin) {
            const { bookname, genrename, language, author, aboutauthor, publisher, binding, ISBN, publicationdate, pages, bookoverview, price, quantity, status } = req.body;
            const bookId = req.params.id;

            console.log(genrename)

            const existingbook = await productSchema.findOne({
                bookname,
                _id: { $ne: bookId },
            });

            const genres = await genreSchema.find({})

            if (existingbook) {
                return res.render('bookedit', { error: 'Book with the same name already exists', item: "", genres });
            }




            let imagePath; // Initialize imagePath variable

            if (req.files && req.files.Image) {
                const Image = req.files.Image;

                imagePath = './public/product-Images/' + Date.now() + '_' + Image.name;

                Image.mv(imagePath, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            }

            const updatedBook = await productSchema.findByIdAndUpdate(bookId, {
                bookname,
                genrename,
                language,
                author,
                aboutauthor,
                publisher,
                binding,
                ISBN,
                publicationdate,
                pages,
                bookoverview,
                price,
                quantity,
                status,
                Image: imagePath,
            });

            res.redirect('/adminbooks');
        }
        else {
            res.redirect('/adminlogin')
        }



    } catch (err) {
        // Handle database update error
        if (err.code === 11000) {
            res.render('bookedit', { error: 'Book with the same name already exists' });
        } else {
            res.status(500).send('Internal Server Error');
            console.error('Error during update:', err);
        }
    }
}



adminHomeController.deleteGenre = async (req, res) => {
    try {
        if (req.session.adminlogin) {
            const genreId = req.params.id

            await genreSchema.findByIdAndDelete(genreId);

            res.redirect('/admingenres')
        } else {
            res.redirect('/adminlogin')
        }


    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send('Internal Server Error');
    }
}





adminHomeController.editGenre = async (req, res) => {
    try {
        if (req.session.adminlogin) {
            const genreId = req.params.id;

            const genre = await genreSchema.findById(genreId);
            res.render('genreedit', { genre, error: '' });
        } else {
            res.redirect('/adminlogin')
        }

    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send('Internal Server Error');
    }

}


// adminHomeController.postEditGenre = (req,res)=>{
//     const {genrename} = req.body;

//     const existingg = await productSchema.findOne({ bookname });

// }




adminHomeController.postEditGenre = async (req, res) => {
    try {
        if (req.session.adminlogin) {
            const { genrename } = req.body;
            const genreId = req.params.id;



            const existingGenre = await genreSchema.findOne({ genrename, _id: { $ne: genreId } });


            if (existingGenre) {
                return res.render('genreedit', { error: 'Genre with the same name already exists', genre: '' });

            }

            const Alphabetic = /^[a-zA-Z]+$/;
            if (!Alphabetic.test(genrename)) {
                // Invalid characters in genrename. Only alphabets are allowed.
                return res.render('genreedit', { error: 'Invalid characters in Genre Name', genre: '' });
            }

            const updatedGenre = await genreSchema.findByIdAndUpdate(genreId, {

                genrename

            });

            res.redirect('/admingenres');
        } else {
            res.redirect('/adminlogin');
        }
    } catch (err) {
        // Handle database update error
        if (err.code === 11000) {
            res.render('genreedit', { error: "User already exists" });
        } else {
            res.status(500).send('Internal Server Error');
            console.error("Error during update:", err);
        }
    }
};



adminHomeController.productUnlist = async (req, res) => {     /// product unlist 
    if (req.session.adminlogin) {


        try {
            const bookId = req.params.id;

            const book = await productSchema.findById(bookId);

            if (book) {
                book.isListed = false;
                await book.save()
                res.redirect('/adminbooks')
            }
        } catch (error) {
            console.error('Error toggling user block status:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/adminlogin')
    }

}




adminHomeController.productList = async (req, res) => {     /// product unlist 
    if (req.session.adminlogin) {


        try {
            const bookId = req.params.id;

            const book = await productSchema.findById(bookId);

            if (book) {
                book.isListed = true;
                await book.save()
                res.redirect('/adminbooks')
            }
        } catch (error) {
            console.error('Error toggling user block status:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/adminlogin')
    }

}




adminHomeController.genreUnlist = async (req, res) => {     /// genre unlist 
    if (req.session.adminlogin) {


        try {
            const genreId = req.params.id;

            const genre = await genreSchema.findById(genreId);

            if (genre) {
                genre.isListed = false;
                await genre.save()
                res.redirect('/admingenres')
            }
        } catch (error) {
            console.error('Error toggling user block status:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/adminlogin')
    }

}




adminHomeController.genreList = async (req, res) => {     /// genre unlist 



    try {
        if (req.session.adminlogin) {
            const genreId = req.params.id;

            const genre = await genreSchema.findById(genreId);

            if (genre) {
                genre.isListed = true;
                await genre.save()
                res.redirect('/admingenres')
            }
        } else {
            res.redirect('/adminlogin')
        }

    } catch (error) {
        console.error('Error toggling user block status:', error);
        res.status(500).send('Internal Server Error');
    }


}







adminHomeController.viewbookdetails = async (req, res) => {
    try {
        if (req.session.adminlogin) {
            const bookId = req.params.id
            const item = await productSchema.findById(bookId);
            res.render('viewmorebook', { item });
        } else {
            res.redirect('/adminlogin')
        }

    } catch (error) {
        console.error('Error toggling user block status:', error);
        res.status(500).send('Internal Server Error');
    }

}





adminHomeController.deleteBook = async (req, res) => {
    try {

        if (req.session.adminlogin) {
            const bookId = req.params.id

            await productSchema.findByIdAndDelete(bookId);

            res.redirect('/adminbooks')
            // res.render('admingenres', { genres});

        } else {
            res.redirect('/adminlogin')
        }


    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send('Internal Server Error');
    }
}



adminHomeController.logoutAdmin = (req, res) => {


    req.session.adminlogin = false;


    res.redirect('/adminlogin');

};




module.exports = adminHomeController;


