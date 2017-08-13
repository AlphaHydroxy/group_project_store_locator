var Venue = require('./venue');

var Venues = function(){

};

Venues.prototype.makeRequest = function(url, callback){
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', callback);
    request.send();
};

Venues.prototype.makePostRequest = function(url, callback, payload){
    var request = new XMLHttpRequest();
    request.open('POST', url);
    request.setRequestHeader('Content-type', 'application/json');
    request.addEventListener('load', callback);
    request.send(payload);
};

// Venues.prototype.allCoords = function(callback){
//     this.makeRequest('http://localhost:3000/api/venues/coords', function(){
//       if(this.status !== 200){
//         return;
//       };
//       var jsonString = this.responseText;
//       var results = JSON.parse(jsonString);
      
//       var venues = Venues.prototype.populateVenues(results);
//       callback(venues);
//     });
// };

Venues.prototype.nearby = function(currentPos, callback){
    var currentPosString = JSON.stringify(currentPos);
    this.makePostRequest('http://localhost:3000/api/venues/nearby', callback, currentPosString);
}

Venues.prototype.populateVenues = function(results){
    var venues = [];
    for(var result of results){
      var venue = new Venue(result);
      venues.push(venue);
    };
    return venues;
};

module.exports = Venues;