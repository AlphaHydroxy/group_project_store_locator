var MongoClient = require('mongodb').MongoClient;

var CommentQuery = function(){
  this.url = "mongodb://localhost:27017/pubs";
};

CommentQuery.prototype = {
      all: function(callback){
    MongoClient.connect(this.url, function(err, db){
      var collection = db.collection('comments');
      collection.find().toArray(function(err, result){
        callback(result);
      });
    });
  },
    add: function(commentToAdd, onQueryFinished){
        MongoClient.connect(this.url, function(err, db){
            if(db){
                var collection = db.collection('comments');
                collection.insert(commentToAdd);
                collection.find().toArray(function(err, docs){
                    // console.log(docs);
                    onQueryFinished(docs);
                });
            };
        });
    }
}

module.exports = CommentQuery;