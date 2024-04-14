// services/rewardPointsService.js
const rewardPoints = require('../models/rewardPoints'); // Adjust the path according to your project structure

class RewardPointsService {
  static async getRewardPointsByUserId(userId) {
    try {
      return await rewardPoints.findOne({
        where: { user_id: userId }
      });
    } catch (error) {
      throw new Error('Unable to retrieve reward points: ' + error.message);
    }
  }

  static async updateRewardPoints(userId, updateData) {
    try {
      let rewardPoints = await rewardPoints.findOne({
        where: { user_id: userId }
      });
      if (!rewardPoints) {
        throw new Error('Reward points record not found');
      }
      return await rewardPoints.update(updateData);
    } catch (error) {
      throw new Error('Unable to update reward points: ' + error.message);
    }
  }
}

module.exports = RewardPointsService;
