let mongoose = require('mongoose');


let userSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    phone:String,
    isBlocked:{
        type: Boolean,
        default: false
    },
    
    address:[{
        name:String,
        phone:Number,
   email:String,
        streetaddress:String,
        city: String,
        zipcode: String,
        state: String,
        addressline1:String,
        addressline2:String,
        country:String,
        landmark:String
    }
    ]
    
})

const User = mongoose.model('User',userSchema);

module.exports = User;