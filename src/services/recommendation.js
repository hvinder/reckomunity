const { Recommendation } = require("../model");

class RecommendationService {
  constructor() {
    this.Recommendation = Recommendation;
  }
  getById = async ({ recommendationId, userId }) => {
    try {
      return await this.Recommendation.findOne({
        where: { id: recommendationId, ...(userId && { user_id: userId }) },
      });
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while getting the recommendation");
    }
  };
}

const recommendationService = new RecommendationService();

module.exports = recommendationService;
