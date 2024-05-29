const express = require("express");
const {
  createCollection,
  addRecommendationToCollection,
  removeRecommendationFromCollection,
  getCollections,
  getCollection,
  deleteCollection,
} = require("../controllers/collection");

const collectionsRouter = express.Router();

collectionsRouter.post("/", createCollection);
collectionsRouter.post(
  "/:collectionId/recommendations/:recommendationId",
  addRecommendationToCollection
);
collectionsRouter.delete(
  "/:collectionId/recommendations/:recommendationId",
  removeRecommendationFromCollection
);
collectionsRouter.get("/", getCollections);
collectionsRouter.get("/:collectionId", getCollection);
collectionsRouter.delete("/:collectionId", deleteCollection);

module.exports = collectionsRouter;
