const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header and remove 'Bearer ' prefix
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user with matching id
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = auth;