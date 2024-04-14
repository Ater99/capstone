// services/investmentService.js
const Investment = require('../models/Investment'); // Adjust the path according to your project structure

class InvestmentService {
  static async getAllInvestments() {
    try {
      return await Investment.findAll();
    } catch (error) {
      throw new Error('Unable to retrieve investments: ' + error.message);
    }
  }

  static async getInvestmentById(id) {
    try {
      const investment = await Investment.findByPk(id);
      if (!investment) {
        throw new Error('Investment not found');
      }
      return investment;
    } catch (error) {
      throw new Error('Unable to retrieve investment: ' + error.message);
    }
  }

  static async createInvestment(investmentData) {
    try {
      return await Investment.create(investmentData);
    } catch (error) {
      throw new Error('Unable to create investment: ' + error.message);
    }
  }

  static async updateInvestment(id, updatedData) {
    try {
      let investment = await Investment.findByPk(id);
      if (!investment) {
        throw new Error('Investment not found');
      }
      return await investment.update(updatedData);
    } catch (error) {
      throw new Error('Unable to update investment: ' + error.message);
    }
  }

  static async deleteInvestment(id) {
    try {
      let investment = await Investment.findByPk(id);
      if (!investment) {
        throw new Error('Investment not found');
      }
      await investment.destroy();
      return 'Investment successfully deleted';
    } catch (error) {
      throw new Error('Unable to delete investment: ' + error.message);
    }
  }
}

module.exports = InvestmentService;
