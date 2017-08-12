var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var VenueQuery = function(){
  this.url = "mongodb://localhost:27017/group_project_store_locator";
};

VenueQuery.prototype = {
  all: function(callback){
    MongoClient.connect(this.url, function(err, db){
      var collection = db.collection('pubs');
      collection.find().toArray(function(err, result){
        callback(result);
      });   
    });
  },
  add: function(pubToAdd, callback){
    MongoClient.connect(this.url, function(err, db){
      if (db) {
        var collection = db.collection('pubs');
        collection.insert(pubToAdd);
        collection.find().toArray(function(err, results){
          callback(results);
        });
      };
    });
  },
  findById: function(id, callback){
     MongoClient.connect(this.url, function(err, db){
      var collection = db.collection('pubs');
      collection.findOne({"_id": new ObjectId(id)}, function(err, result) {
       callback(result);
           });
  });
  }
};

module.exports = VenueQuery;
