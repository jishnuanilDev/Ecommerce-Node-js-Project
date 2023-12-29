const Model = require('../models/userschema');

const checkBlocked = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const user = await Model.findById(userId);

        if (user && user.isBlocked) {
            res.redirect('/');
            return;
        }

        next();
    } catch (error) {
        console.error('Error in checkBlocked middleware:', error);
        next(error); // Call next with the error to trigger error handling middleware
    }
};

module.exports = checkBlocked