const sequelize = require('./db'); // Adjust the path as necessary
const User = require('./models/user'); // Adjust the path as necessary
const Loan = require('./models/loan'); // Adjust the path as necessary

// Check if the environment is not production
if (process.env.NODE_ENV !== 'production') {
 sequelize.sync({ alter: true })
    .then(() => console.log('Database & models are synced'))
    .catch(err => console.error('Unable to sync database:', err));
} else {
 console.log('Skipping database sync in production environment.');
}
