

// const  validationResult  = require('express-validator');
// const fileType = require('file-type');

// const validateFile = (req, res, next) => {

//   if (!req.files || !req.files.Image) {
//     return res.status(400).json({ error: 'Image file is required' });
//   }

//   const imageFile = req.files.Image;

//   const fileTypeResult = fileType(imageFile.data);

//   if (!fileTypeResult || !fileTypeResult.mime.startsWith('image/')) {
//     return res.status(400).json({ error: 'Invalid file format. Only image files are allowed.' });
//   }

//   next();
// };

// module.exports = validateFile;  
