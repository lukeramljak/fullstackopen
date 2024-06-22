const express = require("express");
const app = express();
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
