const {
  sequelize,
  Collection,
  CollectionRecommendation,
  Recommendation,
} = require("../model.js");

const createCollection = async (req, res) => {
  try {
    const { user } = req;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }

    const collection = await Collection.create({
      name,
      description,
      user_id: user.id,
    });

    res.status(201).send(collection);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating the collection" });
  }
};

const addRecommendationToCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId, recommendationId } = req.params;

    const collection = await Collection.findOne({
      where: { id: collectionId, user_id: user.id },
    });
    if (!collection) {
      return res.status(404).send({ error: "Collection not found" });
    }

    const recommendation = await Recommendation.findOne({
      where: { id: recommendationId, user_id: user.id },
    });
    if (!recommendation) {
      return res.status(404).send({ error: "Recommendation not found" });
    }

    await collection.addRecommendation(recommendation, {
      through: CollectionRecommendation,
    });

    res.status(201).send({ message: "Recommendation added to collection" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while adding the recommendation" });
  }
};

const removeRecommendationFromCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId, recommendationId } = req.params;

    const collection = await Collection.findOne({
      where: { id: collectionId, user_id: user.id },
    });
    if (!collection) {
      return res.status(404).send({ error: "Collection not found" });
    }

    const recommendation = await Recommendation.findOne({
      where: { id: recommendationId, user_id: user.id },
    });
    if (!recommendation) {
      return res.status(404).send({ error: "Recommendation not found" });
    }

    const collectionRecommendation = await CollectionRecommendation.findOne({
      where: {
        collection_id: collection.id,
        recommendation_id: recommendationId,
      },
    });
    if (!collectionRecommendation) {
      return res
        .status(404)
        .send({ error: "Recommendation not found in collection" });
    }

    await collectionRecommendation.destroy();
    res.send({ message: "Recommendation removed from collection" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while removing the recommendation" });
  }
};

const getCollections = async (req, res) => {
  try {
    const { user } = req;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const { rows: data, count: total } = await Collection.findAndCountAll({
      where: {
        user_id: user.id,
      },
      limit,
      offset: (page - 1) * limit,
    });

    res.send({ page, limit, total, data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the collections" });
  }
};

const getCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const collection = await Collection.findOne({
      where: {
        id: collectionId,
        user_id: user.id,
      },
      include: [
        {
          model: Recommendation,
          through: { attributes: [] }, // To exclude the join table attributes
        },
      ],
    });

    res.send(collection);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the collection" });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId } = req.params;

    const collection = await Collection.findOne({
      where: {
        id: collectionId,
        user_id: user.id,
      },
    });

    if (!collection) {
      return res.status(404).send({ error: "Collection not found" });
    }

    await sequelize.transaction(async (t) => {
      await collection.destroy({ transaction: t });
      await CollectionRecommendation.destroy({
        where: { collection_id: collection.id },
        transaction: t,
      });
    });

    res.send({ message: "Collection deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the collection" });
  }
};

module.exports = {
  createCollection,
  addRecommendationToCollection,
  removeRecommendationFromCollection,
  getCollections,
  getCollection,
  deleteCollection,
};
