/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = {};

db.connection = mongoose.connection;
db.mongoose = mongoose;

db.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Get all files in the model folder
const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".js"));

// Scan all files to get model files and save them in db object
modelFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  const modelName = path.basename(file, ".js");
  const capitalizedModelName =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);
  db[capitalizedModelName.split(".")[0]] = require(filePath);
});

module.exports = db;
