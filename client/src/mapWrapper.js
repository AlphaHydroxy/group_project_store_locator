var map; 

var MapWrapper = function(container, center, zoomLevel){
    map = new google.maps.Map(container, {
        center: center,
        zoom: zoomLevel
    });
    this.markers = [];

    // addListenerOnce adds an event handler that will fire exactly once
    // The Google Maps idle event happens when the map has been loaded
    google.maps.event.addListenerOnce(map, 'idle', function(){
        // Sourced from: https://developers.google.com/maps/documentation/javascript/geolocation
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log("Geolocation center is: " + pos.lat + ', ' + pos.lng);

                    // Add a marker to indicate the user's position
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: map
                    });

                    // Re-center the map at the user's co-ordinates
                    map.setCenter(pos);
                    // Set map zoom to show a decent area around the user
                    map.setZoom(12);
                }, 
                function(error) {
                    handleLocationError(error);
                },
                {timeout: 50000, enableHighAccuracy: true, maximumAge: 75000}
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false);
        };
    });
    
    function handleLocationError(browserHasGeolocation) {
        // Do stuff if user declines geolocation or something bad has happened
        console.log("Geolocation error occurred. browserHasGeolocation is: " + browserHasGeolocation.message);
    };
};

MapWrapper.prototype.addMarker = function(coords, map){
    var marker = new google.maps.Marker({
        position: coords,
        map: this
    });

    // marker.addListener('click', this.handleMarkerClick);
    this.markers.push(marker);
}

MapWrapper.prototype.setCenter = function(coords){
    this.googleMap.setCenter(coords);
};

module.exports = MapWrapper;