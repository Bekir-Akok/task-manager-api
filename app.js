const express = require("express");
const cors = require("cors");
const queryParser = require("./middleware/query-parser");
require("dotenv").config();
require("./db/database").connect();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

module.exports = app;
