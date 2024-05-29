const { CollectionService } = require("../services");
const { NotFoundError } = require("../utils/error");

const createCollection = async (req, res) => {
  try {
    const { user } = req;
    const { name, description } = req.body;

    const collection = await CollectionService.create({
      name,
      description,
      userId: user.id,
    });

    res.status(201).send(collection);
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send({
      error: error.message || "An error occurred while creating the collection",
    });
  }
};

const addRecommendationToCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId, recommendationId } = req.params;

    await CollectionService.addRecommendation({
      collectionId,
      recommendationId,
      userId: user.id,
    });

    res.status(201).send({ message: "Recommendation added to collection" });
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send({
      error:
        error.message || "An error occurred while adding the recommendation",
    });
  }
};

const removeRecommendationFromCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId, recommendationId } = req.params;

    await CollectionService.removeRecommendation({
      collectionId,
      recommendationId,
      userId: user.id,
    });

    res.send({ message: "Recommendation removed from collection" });
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send({
      error:
        error.message || "An error occurred while removing the recommendation",
    });
  }
};

const getCollections = async (req, res) => {
  try {
    const { user } = req;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const { rows: data, count: total } =
      await CollectionService.getAllWithPagination({
        userId: user.id,
        limit,
        page,
      });

    res.send({ page, limit, total, data });
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send({
      error:
        error.message || "An error occurred while fetching the collections",
    });
  }
};

const getCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId } = req.params;

    const collection = await CollectionService.getWithRecommendations({
      collectionId,
      userId: user.id,
    });

    if (!collection) {
      throw NotFoundError("Collection not found");
    }

    res.send(collection);
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send({
      error: error.message || "An error occurred while fetching the collection",
    });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { user } = req;
    const { collectionId } = req.params;

    await CollectionService.delete({ collectionId, userId: user.id });

    res.send({ message: "Collection deleted" });
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send({
      error: error.message || "An error occurred while deleting the collection",
    });
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
