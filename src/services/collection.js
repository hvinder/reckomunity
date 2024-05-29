const {
  sequelize,
  Collection,
  CollectionRecommendation,
  Recommendation,
} = require("../model");
const { BadRequestError, NotFoundError } = require("../utils/error");
const { RecommendationService } = require("./");

class CollectionService {
  constructor() {
    this.Collection = Collection;
    this.CollectionRecommendation = CollectionRecommendation;
    this.Recommendation = Recommendation;
    this.RecommendationService = RecommendationService;
  }

  create = async ({ name, description, userId }) => {
    try {
      if (!name) {
        throw BadRequestError("Name is required");
      }
      return await this.Collection.create({
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
      return await this.Collection.findOne({
        where: { id: collectionId, ...(userId && { user_id: userId }) },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getWithRecommendations = async ({ collectionId, userId }) => {
    try {
      return await this.Collection.findOne({
        where: {
          id: collectionId,
          user_id: userId,
        },
        include: [
          {
            model: this.Recommendation,
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
      return await this.Collection.findAndCountAll({
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

  addRecommendation = async ({ collectionId, recommendationId, userId }) => {
    try {
      const collection = await this.getById({
        collectionId,
        userId: userId,
      });
      if (!collection) {
        throw NotFoundError("Collection not found");
      }

      const recommendation = await this.RecommendationService.getById({
        recommendationId,
        userId: userId,
      });
      if (!recommendation) {
        throw NotFoundError("Recommendation not found");
      }

      await collection.addRecommendation(recommendation, {
        through: this.CollectionRecommendation,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  removeRecommendation = async ({ collectionId, recommendationId, userId }) => {
    try {
      const collection = await this.getById({
        collectionId,
        userId: userId,
      });
      if (!collection) {
        throw NotFoundError("Collection not found");
      }

      const recommendation = await this.RecommendationService.getById({
        recommendationId,
      });
      if (!recommendation) {
        throw NotFoundError("Recommendation not found");
      }

      const collectionRecommendation = await this.getCollectionRecommendation({
        collectionId: collection.id,
        recommendationId: recommendationId,
      });
      if (!collectionRecommendation) {
        throw NotFoundError("Recommendation not found in collection");
      }

      await collectionRecommendation.destroy();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  delete = async ({ collectionId, userId }) => {
    try {
      const collection = await this.getById({
        collectionId,
        userId: userId,
      });

      if (!collection) {
        throw NotFoundError("Collection not found");
      }

      await sequelize.transaction(async (t) => {
        await collection.destroy({ transaction: t });
        await this.CollectionRecommendation.destroy({
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
      return await this.CollectionRecommendation.findOne({
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
