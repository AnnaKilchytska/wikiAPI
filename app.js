//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) res.send(foundArticles);
      if (err) res.send(err);
    })
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err) => {
      if (!err) res.send('Successfully added a new article!');
      if (err) res.send(err);
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send('Successfully deleted all the articles!')
      } else {
        res.send(err);
      }
    })
  });

///////////////////////////// Requests targeting a specific article ////////////////////////////////////////

app.route('/articles/:articleTitle')
  .get((req, res) => {

    Article.findOne({
      title: req.params.articleTitle
    }, (err, foundArticle) => {
      if (foundArticle) res.send(foundArticle);
      if (!foundArticle) res.send('No articles matching that title was found!')
    })
  })
  .put((req, res) => {
    Article.replaceOne({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, (err) => {
      if (!err) res.send('Successfully updated an article!')
    })
  })
  .patch((req, res) => {
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, (err, results) => {
      if (!err) res.send('The article was successfully updated!');
      if (err) res.send(err)
    })
  })
  .delete((req, res) => {
    Article.findOneAndDelete({title: req.params.articleTitle}, (err) => {
      if (!err) res.send('Successfully deleted an article!')
      if (err) res.send(err);
    })
  });









app.listen(3000, () => {
  console.log('Server is running on port 3000!');
})
