var Icons = require('./models/icons');
var iconList = new Icons();

var MapWrapper = function(container, center, zoomLevel){
    this.markers = [];
    this.map = new google.maps.Map(container, {
        center: center,
        zoom: zoomLevel
    });
    this.hasGeolocation = false;
};

MapWrapper.prototype.getMap = function(){
    return this.map;
};

MapWrapper.prototype.getMarkers = function(){
    return this.markers;
};

MapWrapper.prototype.getCenter = function(){
    return this.map.getCenter();
}

MapWrapper.prototype.addInitListener = function(outerCallback, innerCallback){
    // The shame. 
    var self = this;

    // addListenerOnce adds an event handler that will fire exactly once
    // The Google Maps idle event happens when the map has been loaded
    google.maps.event.addListenerOnce(this.map, 'idle', function(){

        // Sourced from: https://developers.google.com/maps/documentation/javascript/geolocation
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            self.hasGeolocation = true;

            navigator.geolocation.getCurrentPosition(
                function(position) {

                    // User's current position
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    console.log("Geolocation center is: " + pos.lat + ', ' + pos.lng);

                    // Clear any existing markers
                    self.clearMarkers();
                    // Add a marker to indicate the user's position
                    self.addMarker(pos, iconList.icons["user"]);
                    // Re-center the map at the user's co-ordinates
                    self.setCenter(pos);
                    // Set map zoom to show a decent area around the user
                    self.setZoom(12);

                    innerCallback(pos, self);
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

        outerCallback(self);
    });

    function handleLocationError(browserHasGeolocation) {
        // Do stuff if user declines geolocation or something bad has happened
        console.log("Geolocation error occurred. browserHasGeolocation is: " + browserHasGeolocation.message);
    };
};

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

// Sets a 'bounds changed' event handler on an autocomplete box
// Event handler fires whenever the map boundaries change, allowing for 
// better targeted search results
MapWrapper.prototype.addBoundsChangedListener = function(autocomplete){
    google.maps.event.addListener(this,'bounds_changed', function() {
        autocomplete.bindTo(this, 'bounds');
    });
};

module.exports = MapWrapper;