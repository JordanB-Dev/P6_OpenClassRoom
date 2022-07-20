const express = require("express");
const helmet = require("helmet");
require("dotenv").config({ path: "./config/.env" });
require("./config/database");

const userRoutes = require("./routes/user");
const path = require("path");

const app = express();

app.use(express.json());

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);

module.exports = app;
