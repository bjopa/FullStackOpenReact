const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to MongoDB-Blogs...");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB - Blogs");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB - Blogs:", error.message);
  });

app.use(cors());
// app.use(express.static("dist")); //TODO OM frontend finns senare
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
