var express = require('express');
var app = express();
var commentRouter = express.Router();

var Comment = require('../client/src/models/comment')

var CommentQuery = require('../client/db/commentQuery');
var commentQuery = new CommentQuery();


commentRouter.post('/', function(req, res){
    console.log(req.body)
    var comment = new Comment({
        name: req.body.name,
        email: req.body.email,
        title: req.body.title,
        comment: req.body.comment
    });
    commentQuery.add(comment, function(){
        res.redirect("/")
    })
    console.log(newComment);
});

module.exports = commentRouter;





