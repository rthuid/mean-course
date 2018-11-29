const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();
mongoose.connect('mongodb://localhost:27017/node-angular', { useNewUrlParser: true })
.then(() => {
  console.log('Connected to database');
})
.catch(() => {
  console.log('connection failed!')
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Orgin, X-Requested-With, Content-Type, Accept"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  )
  next();
});
// cFuw9TOWTDUIGAeV
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message : "post added seccessfully",
      postId: result._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(document => {
    res.status(200).json({
      message: 'Post fetched seccesfully!',
      posts: document
    })
  })
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post delete!"});
  })
});

module.exports = app;
