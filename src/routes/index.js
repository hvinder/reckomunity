const express = require("express");
const collectionsRouter = require("./collection.js");

const router = express.Router();

router.use("/contracts", collectionsRouter);

module.exports = router;
