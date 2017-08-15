var Icons = require('./models/icons');
var iconList = new Icons();

var MapWrapper = function(container, center, zoomLevel){
    this.markers = [];
    this.map = new google.maps.Map(container, {
        center: center,
        zoom: zoomLevel
    });
    this.hasGeolocation = false;
    this.autoComplete;
};

MapWrapper.prototype.getMap = function(){
    return this.map;
};

MapWrapper.prototype.getAutoComplete = function(){
    return this.autoComplete;
}

MapWrapper.prototype.getMarkers = function(){
    return this.markers;
};

MapWrapper.prototype.getCenter = function(){
    return this.map.getCenter();
};

MapWrapper.prototype.connectAutoComplete = function(element){
    this.autoComplete = new google.maps.places.Autocomplete(element);
    this.autoComplete.bindTo('bounds', this.map);
};

MapWrapper.prototype.setPlaceChangedHandler = function(handler){
    this.autoComplete.addListener('place_changed', handler);
};

MapWrapper.prototype.locateUser = function(callback){
    // Sourced from: https://developers.google.com/maps/documentation/javascript/geolocation
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // User's current position
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log("Geolocation center is: " + pos.lat + ', ' + pos.lng);

                callback(pos);
            }, 
            function(error) {
                handleLocationError(error);
            },
            {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
    };

    function handleLocationError(browserHasGeolocation) {
        // Do stuff if user declines geolocation or something bad has happened
        console.log("Geolocation error occurred. browserHasGeolocation is: " + browserHasGeolocation.message);
    };
}

// Adds a marker to the map at the given co-ordinates
MapWrapper.prototype.addMarker = function(coords, iconPath){
    var marker = new google.maps.Marker({
        position: coords,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: iconPath
    });

    this.markers.push(marker);
};

// Removes all markers from the map
MapWrapper.prototype.clearMarkers = function(){
    for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
    };

    this.markers = [];
};

// Moves the map center to the given co-ordinates
MapWrapper.prototype.setCenter = function(coords){
    this.map.setCenter(coords);
};

// Changes the map zoom level to the given value
MapWrapper.prototype.setZoom = function(zoomLevel){
    this.map.setZoom(zoomLevel);
};

module.exports = MapWrapper;