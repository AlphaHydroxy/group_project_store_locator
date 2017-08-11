var MapWrapper = function(container, center, zoomLevel){
    this.googleMap = new google.maps.Map(container, {
        center: center,
        zoom: zoomLevel
    });
    this.markers = [];

    // Sourced from: https://developers.google.com/maps/documentation/javascript/geolocation
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        this.googleMap.setCenter(pos);
        }, function() {
        handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    };

    function handleLocationError(browserHasGeolocation, pos) {
        // Do stuff if use declines geolocation or something bad has happened
        console.log("Geolocation error occurred");
    };
};

MapWrapper.prototype.addMarker = function(coords, map){
    var marker = new google.maps.Marker({
        position: coords,
        map: this.googleMap
    });

    marker.addListener('click', this.handleMarkerClick);
    this.markers.push(marker);
}

MapWrapper.prototype.addClickEvent = function(){
    google.maps.event.addListener(this.googleMap, 'click', function(event){
        console.log(event.latLng.lng());
        console.log(event.latLng.lat());

        var coords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        // this.addMarker(coords, this.googleMap);
    }.bind(this));
};

MapWrapper.prototype.bounceMarkers = function(){
    this.markers.forEach(function(marker){
        marker.setAnimation(google.maps.Animation.BOUNCE);
    });
};


// CORS request code based on: https://www.html5rocks.com/en/tutorials/cors/ 
// Lightbulb/facepalm moment provided by: https://stackoverflow.com/a/23952300
MapWrapper.prototype.handleMarkerClick = function(){
    
};

MapWrapper.prototype.setCenter = function(coords){
    this.googleMap.setCenter(coords);
};