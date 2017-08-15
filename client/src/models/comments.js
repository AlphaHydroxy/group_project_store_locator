var Comment = require('./comment');

var Comments = function() {
}

Comments.prototype.makeRequest = function(url, callback){
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', callback);
    request.send();
};
Comments.prototype.makePostRequest = function(url, callback, payload){
        var request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-type", "application/json");
        request.onload = callback;
        request.send(payload);
};
Comments.prototype.add = function(newComment, callback){
        var commentToAdd = JSON.stringify(newComment);
        console.log("New Comment", commentToAdd);
        this.makePostRequest("http://localhost:3000/api/comments", commentToAdd, 
        callback);
};


module.exports = Comments;