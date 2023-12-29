
const regexAlphanumeric = /^[a-zA-Z0-9]+$/;
const regexAlphabetic = /^[a-zA-Z]+$/;
const regexNumeric = /^[0-9]+$/;


const validateFields =  (req,res,next) => {

    const { bookname,language, author, aboutauthor, publisher, binding,bookoverview} = req.body;
    if (!regexAlphabetic.test(bookname)) {
        res.render('add-products',{validErr:'Invalid characters in fields. Only alphabets are allowed.', genres:[], error: '',ISBNerror:''});
      
    }
    if (!regexAlphabetic.test(language)) {
        res.render('add-products',{validErr:'Invalid characters in fields. Only alphabets are allowed.',genres:[], error: '',ISBNerror:''});
    }

    if (!regexAlphabetic.test(author)) {
        res.render('add-products',{validErr:'Invalid characters in fields. Only alphabets are allowed.', genres:[], error: '',ISBNerror:''});
    }
    if (!regexAlphabetic.test(aboutauthor)) {
        res.render('add-products',{validErr:'Invalid characters in fields. Only alphabets are allowed.', genres:[], error: '',ISBNerror:''});
    }
    if (!regexAlphabetic.test(publisher)) {
        res.render('add-products',{validErr:'Invalid characters in fields. Only alphabets are allowed.', genres:[], error: '',ISBNerror:''});
    }
    if (!regexAlphabetic.test(binding)) {
        res.render('add-products',{validErr:'Invalid characters in fields. Only alphabets are allowed.', genres:[], error: '',ISBNerror:''});
    }

    if (!regexAlphabetic.test(bookoverview)) {
        res.render('add-products',{validErr:'Invalid characters in fields. Only alphabets are allowed.', genres:[], error: '',ISBNerror:''});
    }
  
    next();
};

 

module.exports = validateFields
