const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

//////////////////////Requesting targetting all articles

app.route("/articles")
.get(function(req, res) {

    Article.find({}, function(err, articles) {
        if(!err) {
            res.send(articles);
        }
        else {
            res.send(err);
        }
    });
})

.post(function(req, res) {

    const article = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    article.save(function(err) {
        if(!err) {
            res.send("Successfully added a new article!")
        }
        else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {

    Article.deleteMany({}, function(err) {
        if(!err) {
            res.send("Successfully deleted all the articles!");
        }
        else {
            res.send(err);
        }
    });
});

///////////////////////Requesting targeting specific articles

app.route("/articles/:topic")
.get(function(req, res) {

    Article.findOne({title: req.params.topic}, function(err, foundArticle) {
        if(foundArticle) {
            res.send(foundArticle);
        }
        else {
            res.send("No articles matching that title was found!")
        }
    });
})

.put(function(req, res) {

    Article.updateOne(
        {title: req.params.topic},
        {title: req.body.title, content: req.body.content},
        function(err) {
            if(!err) {
                res.send("Successfully updated the article!");
            }
        }
    );
})

.patch(function(req, res) {

    Article.updateOne(
        {title: req.params.topic},
        {$set: req.body},
        function(err) {
            if(!err) {
                res.send("Successfully updated the article!");
            }
            else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {

    Article.deleteOne(
        {title: req.params.topic},
        function(err) {
            if(!err) {
                res.send("Successfully deleted the article!");
            }
            else {
                res.send(err);
            }
        }
    );
});


app.listen(3000, function() {
    console.log("Server started at port 3000");
});