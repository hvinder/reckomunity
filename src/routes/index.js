const express = require("express");
const collectionsRouter = require("./collection.js");
const { verifyUser } = require("../middlewares");

const router = express.Router();

router.use("/collections", verifyUser, collectionsRouter);

module.exports = router;
