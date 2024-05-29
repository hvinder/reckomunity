const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const router = require("./routes");
const syncDB = require("./scripts/syncDBjs");

syncDB();

const app = express();
app.use(bodyParser.json());

app.use(router);

module.exports = app;
