let mongoose = require('mongoose')
const products= require('./productschema')
let genreSchema = new mongoose.Schema({
    genrename:{
        type:String,
     
    },
    lowercaseGenrename: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
      },
    products: [{
      
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        
    }],
    isListed:{
        type: Boolean,
        default: true
    }
});


// genreSchema.pre('save', function (next) {
//     this.lowercaseGenrename = this.genrename.toLowerCase();
//     next();
//   });
// // Remove existing index
// genreSchema.index({ genrename: 1 }, { unique: true, dropDups: true });

// // Reapply unique index
// genreSchema.index({ genrename: 1 }, { unique: true });



const genre = mongoose.model('genres',genreSchema)
module.exports = genre;