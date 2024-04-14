const User = require('../models/user'); // Adjust the path to your User model

const authMiddleware = async (req, res, next) => {
 // Check if the session has a user_id
 if (!req.session.user_id) {
    return res.status(403).json({ message: 'No session provided.' });
 }

 try {
    // Fetch the user from the database using the user ID from the session
    const user = await User.findByPk(req.session.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach the user object to the request for use in other routes
    req.user = user;
    next();
 } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
 }
};

module.exports = authMiddleware;
