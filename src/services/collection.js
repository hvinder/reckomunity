const {
  Collection,
  CollectionRecommendation,
  Recommendation,
} = require("../model");
const { BadRequestError } = require("../utils/error");

class CollectionService {
  create = async ({ name, description, userId }) => {
    try {
      if (!name) {
        throw BadRequestError("Name is required");
      }
      return await Collection.create({
        name,
        description,
        user_id: userId,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getById = async ({ collectionId, userId }) => {
    try {
      return await Collection.findOne({
        where: { id: collectionId, ...(userId && { user_id: userId }) },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getWithRecommendations = async ({ collectionId, userId }) => {
    try {
      return await Collection.findOne({
        where: {
          id: collectionId,
          user_id: userId,
        },
        include: [
          {
            model: Recommendation,
            through: { attributes: [] }, // To exclude the join table attributes
          },
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getAllWithPagination = async ({ userId, limit, page }) => {
    try {
      return await Collection.findAndCountAll({
        where: {
          user_id: userId,
        },
        limit,
        offset: (page - 1) * limit,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  addRecommendation = async (collection, recommendation) => {
    try {
      await collection.addRecommendation(recommendation, {
        through: CollectionRecommendation,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  delete = async (collection) => {
    try {
      await sequelize.transaction(async (t) => {
        await collection.destroy({ transaction: t });
        await CollectionRecommendation.destroy({
          where: { collection_id: collection.id },
          transaction: t,
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getCollectionRecommendation = async ({ collectionId, recommendationId }) => {
    try {
      return await CollectionRecommendation.findOne({
        where: {
          collection_id: collectionId,
          recommendation_id: recommendationId,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

const collectionService = new CollectionService();

module.exports = collectionService;
