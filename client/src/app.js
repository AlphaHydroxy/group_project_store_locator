var MapWrapper = require('./mapWrapper');
var Venues = require('./models/venues');
var Icons = require('./models/icons');
var iconList = new Icons();

// Start point for code that runs whenever the browser hits this page
var app = function(){
    var mainMapWrapper = getMapWrapper();
};

// Puts a map on the page, sets default position, tries to establish user location and jump there
var getMapWrapper = function(){
    var mapDiv = document.querySelector('#map');

    // Default map to center somewhere in the middle of the UK
    var center = {lat: 54.606520, lng: -2.547321};
    // Default map zoom to something that shows the entire country
    var zoom = 5;

    var mainMapWrapper = new MapWrapper(mapDiv, center, zoom);

    // Puts an event handler on the map that catches when it's first loaded.
    // Event handler returns to onMapInitialised when complete
    mainMapWrapper.addInitListener(onMapInitialised, fetchVenues);
    return mainMapWrapper;
};

// Runs after the map has finished its initial loading
function onMapInitialised(mapWrapper){
    var input = document.querySelector('#search-bar');
    var autocomplete = new google.maps.places.Autocomplete(input);
    var handler = getPlaceChangedHandler(autocomplete, mapWrapper);

    // Adds the getPlaceChangedHandler to the autocomplete box
    // The handler runs whenever the user updates the value in the box
    autocomplete.addListener('place_changed', handler);

    // This creates an event handler on the map which updates the autocompleting textbox whenever 
    // the map's boundaries change. After updating, the results returned in the textbox are more relevant
    // to that area.
    mapWrapper.addBoundsChangedListener(autocomplete);

    fetchVenues(mapWrapper.getCenter(), mapWrapper);
};

// Updates the map whenever the user enters a new location in the automplete box
function getPlaceChangedHandler(autoCompleteBox, mapWrapper){
    return function(){
        var place = autoCompleteBox.getPlace();
        if (!place.geometry) {
            // Ji - We finish up in here when the user's entered something daft into the 
            // search box. Can we do something - pop up an alert, change the colour of something...?

            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            
            return;
        }
        
        mapWrapper.setCenter(place.geometry.location);
        mapWrapper.setZoom(12);
        mapWrapper.clearMarkers();
        mapWrapper.addMarker(place.geometry.location, iconList.icons["user"]);

        fetchVenues(place.geometry.location, mapWrapper);
    }
}

// Fetches and displays a collection of venues around the user's location
function fetchVenues(position, mapWrapper){
    var venues = new Venues();
    venues.nearby(position, function(result){        
        var jsonString = this.responseText;
        var results = JSON.parse(jsonString);

        results.near.forEach(function(venue){
            mapWrapper.addMarker({lat: venue.coords.lat, lng: venue.coords.long}, iconList.icons["near"]);
        });

        results.far.forEach(function(venue){
            mapWrapper.addMarker({lat: venue.coords.lat, lng: venue.coords.long}, iconList.icons["far"]);
        });
    });
};

window.addEventListener('load', app);