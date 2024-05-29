const { Recommendation } = require("../model");

class RecommendationService {
  getById = async ({ recommendationId, userId }) => {
    try {
      return await Recommendation.findOne({
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
