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
    this.directionsDisplay;
    this.directionsService;
};

MapWrapper.prototype.getMap = function(){
    return this.map;
};

MapWrapper.prototype.getAutoComplete = function(){
    return this.autoComplete;
}

MapWrapper.prototype.getDirectionsService = function(){
    return this.directionsService;
}

MapWrapper.prototype.getDirectionsDisplay = function(){
    return this.directionsDisplay;
}

MapWrapper.prototype.getMarkers = function(){
    return this.markers;
};

MapWrapper.prototype.getCenter = function(){
    return this.map.getCenter();
};

MapWrapper.prototype.connectDirections = function(){
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsService = new google.maps.DirectionsService;

    this.directionsDisplay.setMap(this.map);
};

MapWrapper.prototype.showRoute = function(origin, destination){
    this.directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING
    }, function(response, status){
        if(status === 'OK'){
            this.directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    }.bind(this));
};

MapWrapper.prototype.clearRoute = function(){
    this.directionsDisplay.set('directions', null);
}

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

MapWrapper.prototype.handleMarkerClick = function(marker, context){
    var destinationMarker = context.markers.find(function(markerElement){
        return markerElement.icon === '../img/user.png';
    });

    context.clearRoute();
    context.showRoute(marker.position, destinationMarker.position);
}

// Adds a marker to the map at the given co-ordinates
MapWrapper.prototype.addMarker = function(coords, iconPath, isVenue){
    var marker = new google.maps.Marker({
        position: coords,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: iconPath
    });
    
    if(isVenue){
        var self = this;
        marker.addListener('click', function(){
            self.handleMarkerClick(marker, self);
        });
    };

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