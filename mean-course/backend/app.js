const express = require('express');

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Orgin, X-Requested-With, Content-Type, Accept"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  )
  next();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [{
      id: "sdfghjk",
      title: 'first',
      content: 'conntent ftom server'
    },
    {
      id: "sdfghjksfd",
      title: 'Second',
      content: 'conntent ftom server!'
    }
  ];
  res.status(200).json({
    message: 'Post fetched seccesfully!',
    posts: posts
  })
});

module.exports = app;
