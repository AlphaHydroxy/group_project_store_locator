var express = require('express');
var app = express();
var venueRouter = express.Router();
const haversine = require('haversine');

var Venue = require('../client/src/models/venue');

var VenueQuery = require('../client/db/venueQuery');
var query = new VenueQuery();

// All venues returned, ids and co-ordinates only
venueRouter.post('/nearby', function(req, res){
    var start = {
        latitude: req.body.lat,
        longitude: req.body.lng
    };

    var venues = query.all(function(result){
        var nearFar = {
            near: [],
            far: []
        };

        result.forEach(function(venue){
            var end = {
                latitude: venue.coords.lat,
                longitude: venue.coords.long
            };

            venue.distance = haversine(start, end, {unit: 'mile'});

            if(venue.distance <= 3){
                nearFar.near.push(venue);
            } else {
                nearFar.far.push(venue);
            }
        });

        nearFar.near.sort(function(a, b) {
            return a.distance - b.distance;
        });

        nearFar.far.sort(function(a, b){
            return a.distance - b.distance;
        });

        res.json(nearFar);
    });
    
});

module.exports = venueRouter;