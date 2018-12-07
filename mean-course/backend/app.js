const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRouts = require('./routes/posts');
const userRouts = require('./routes/user');

const app = express();
mongoose.connect('mongodb://localhost:27017/node-angular', { useNewUrlParser: true })
.then(() => {
  console.log('Connected to database');
})
.catch(() => {
  console.log('connection failed!')
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join("images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Orgin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  )
  next();
});

app.use("/api/posts", postRouts);
app.use("/api/user", userRouts);

module.exports = app;
