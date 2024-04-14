const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser'); // Import body-parser module
const helmet = require('helmet'); // Import helmet module
const morgan = require('morgan'); // Import morgan module
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./db');
// const SessionModel = require('./models/sessionModel');
const config = require('./config');
const userRoutes = require('./routes/users');
const investmentRoutes = require('./routes/investment');
const transactionsRoutes = require('./routes/transactions');
const savingsRoutes = require('./routes/savings');
const loansRoutes = require('./routes/loans');
const programsRoutes = require('./routes/programs');
const rewardPointsRoutes = require('./routes/rewardpoints');
const userprogramsRoutes = require('./routes/userprograms');
const bankAccountRoutes = require('./routes/BankAccount');
const cors = require('cors');


const app = express();
app.use(helmet());
app.use(morgan('dev')); 


const corsOptions = {
  origin: '*',
  credentials: true, // This allows session cookies to be sent back and forth
};
app.use(cors(corsOptions));


app.use(session({
  secret: 'empower360SecretKey123!@#',
  resave: false,
  saveUninitialized: true,
  store: new session.MemoryStore(), // For development; consider a persistent store for production
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Global middleware to ensure session data is accessible across the app
app.use(async (req, res, next) => {
  // Example of handling a custom session ID
  const customSessionId = req.headers['x-session-id'] || req.query.sessionId;
  if (customSessionId) {
    req.session.customSessionId = customSessionId;
  }

  // Automatically load user data if a user_id is stored in the session
  if (req.session.user_id) {
    try {
      // Assuming you have a function to get user data based on ID
      // Adjust the path to your User model and method as necessary
      const User = require('./models/user');
      const user = await User.findByPk(req.session.user_id);
      
      if (user) {
        // Attach user data to the request object for global access
        req.user = user;
      } else {
        // Handle case where user not found (e.g., might want to clear the session)
        console.log('User not found, invalid session.user_id');
      }
    } catch (error) {
      console.error('Error loading user from session:', error);
      // Consider how you want to handle errors here, possibly clear session or just log
    }
  }

  next();
});



// Routes

app.use('/users', userRoutes);
app.use('/investment', investmentRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/loans', loansRoutes);
app.use('/savings', savingsRoutes);
app.use('/programs', programsRoutes);
app.use('/rewardPoints', rewardPointsRoutes);
app.use('/userprograms', userprogramsRoutes);
app.use('/bankaccounts', bankAccountRoutes);

// Global error handler for handling all errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!'); // Send an appropriate error message
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
