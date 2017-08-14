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

        var container = document.querySelector('#pub-list-flex-container');
        container.innerHTML = "";
        results.near.forEach(function(venue){
            mapWrapper.addMarker({lat: venue.coords.lat, lng: venue.coords.long}, iconList.icons["near"]);
            createVenueResultList(venue);
        });
        results.far.forEach(function(venue){
            mapWrapper.addMarker({lat: venue.coords.lat, lng: venue.coords.long}, iconList.icons["far"]);
        });
    });
}

function createVenueResultList(venue){
    var pubListContainer = document.querySelector('#pub-list-flex-container');
    
    var h1 = document.createElement("h1");
    h1.innerText = venue.name;

    var ulPubDetails = document.createElement("ul");
    createPubDetails(ulPubDetails, venue);
    pubListContainer.appendChild(ulPubDetails);

    var ulOpeningTimes = document.createElement("ul");
    ulOpeningTimes.id = "slide-panel";
    createOpeningTimes(ulOpeningTimes, venue);
    var openingTimesContainer = document.createElement("div");
    openingTimesContainer.id = "opening-hours-panel";
    openingTimesContainer.appendChild(ulOpeningTimes);
}


var createListItem = function(text){
    var li = document.createElement("li");
    li.innerHTML = text;
    return li;
};

var appendListItem = function(element, text) {
    var li = createListItem(text);
    element.appendChild(li);
};

var createPubDetails = function(ul, venue) {
    appendListItem(ul, venue.name);
    appendListItem(ul, venue.addressLine1);
    appendListItem(ul, venue.addressLine2);
    appendListItem(ul, venue.town);
    appendListItem(ul, venue.region);
    appendListItem(ul, venue.postCode);
    appendListItem(ul, venue.phone);
    appendListItem(ul, venue.email);
    appendListItem(ul, venue.facilites);
    // button?
};

var createOpeningTimes = function(ul, venue){
    appendListItem(ul, venue.openingTimes.monday[0] + " : " + venue.openingTimes.monday[1]);
    appendListItem(ul, venue.openingTimes.tuesday[0] + " : " + venue.openingTimes.tuesday[1]);
    appendListItem(ul, venue.openingTimes.wednesday[0] + " : " + venue.openingTimes.wednesday[1]);
    appendListItem(ul, venue.openingTimes.thursday[0] + " : " + venue.openingTimes.thursday[1]);
    appendListItem(ul, venue.openingTimes.friday[0] + " : " + venue.openingTimes.friday[1]);
    appendListItem(ul, venue.openingTimes.saturday[0] + " : " + venue.openingTimes.saturday[1]);
    appendListItem(ul, venue.openingTimes.sunday[0] + " : " + venue.openingTimes.sunday[1]);
};

window.addEventListener('load', app);