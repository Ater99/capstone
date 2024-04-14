const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/UserModel'); // Make sure this path is correct
const nodemailer = require('nodemailer');

class UserService {
  static async createUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        name: name, 
        email,
        password: hashedPassword,
      });
      return user; // Sequelize returns the model instance for the created user
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

static async loginUser(email, password) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { isAuthenticated: false, message: 'Invalid email or password' };
    }

    const match = await bcrypt.compare(password, user.password);
    return { isAuthenticated: match, message: match ? 'Login successful' : 'Invalid email or password' };
  } catch (error) {
    throw new Error('Login error: ' + error.message);
  }
}


  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  static async updateUser(userId, userData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const updatedUser = await user.update(userData);
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await User.destroy({ where: { id: userId } });
      if (user === 0) { // destroy() returns the number of destroyed rows
        throw new Error('User not found or already deleted');
      }
      return { message: 'User successfully deleted' };
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }

  static async generateResetToken(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const token = crypto.randomBytes(20).toString('hex');
      const expirationTime = new Date(Date.now() + 3600000); // 1 hour from now

      await user.update({
        reset_password_token: token,
        reset_password_expires: expirationTime,
      });

      await sendResetTokenEmail(email, token);
      return token;
    } catch (error) {
      throw new Error('Error generating reset token: ' + error.message);
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        where: {
          reset_password_token: token,
          reset_password_expires: { [Sequelize.Op.gt]: new Date() },
        },
      });

      if (!user) {
        throw new Error('Invalid or expired token');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await user.update({
        password: hashedNewPassword,
        reset_password_token: null,
        reset_password_expires: null,
      });

      return { message: 'Password successfully reset' };
    } catch (error) {
      throw new Error('Error resetting password: ' + error.message);
    }
  }
}

const sendResetTokenEmail = async (email, token) => {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "your.smtp.host",
    port: 587,
    secure: false,
    auth: {
      user: "your.email@example.com",
      pass: "yourpassword",
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Your Name or Company" <your.email@example.com>',
    to: email,
    subject: "Password Reset",
    text: `Here is your password reset token: ${token}`,
    html: `<b>Here is your password reset token: ${token}</b>`,
  });
};

module.exports = UserService;
