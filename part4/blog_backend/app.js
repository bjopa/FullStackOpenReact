const loginRouter = require("./controllers/login");
const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
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
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
