var MapWrapper = require('./mapWrapper');
var Venues = require('./models/venues');
var Icons = require('./models/icons');
var iconList = new Icons();

var mainMapWrapper;

// Start point for code that runs whenever the Google Maps API loads
var initMap = function(){
    // THIS IS INCREDIBLY IMPORTANT.
    // IT PREVENTS THE ENTER KEY ON THE SEARCH BOX FROM SUBMITTING THE FORM AND REFRESHING THE PAGE
    // DO NOT EVER, UNDER ANY CIRCUMSTANCES, EVER, TOUCH THIS.
    // Sourced from: https://stackoverflow.com/a/11795480
    var input = document.querySelector('#search-bar');
    google.maps.event.addDomListener(input, 'keydown', function(event) { 
        if (event.keyCode === 13) { 
            event.preventDefault(); 
        }
    }); 
    // END ARTICLE OF INCREDIBLE IMPORTANCE

    // Create the map
    mainMapWrapper = getMapWrapper();

    // Try to locate the user through geolocation and update map accordingly
    mainMapWrapper.locateUser(onLocatedUser);
};

// Puts a map on the page, sets default position
var getMapWrapper = function(){
    var mapDiv = document.querySelector('#map');

    // Default map to center somewhere in the middle of the UK
    var center = {lat: 54.606520, lng: -2.547321};

    // Default map zoom to something that shows the entire country
    var zoom = 5;

    var mapWrapper = new MapWrapper(mapDiv, center, zoom);

    // Hook up the Google autocomplete box to UI element
    mapWrapper.connectAutoComplete(document.querySelector('#search-bar'));

    // Establish event handler for user changing location in search box
    mapWrapper.setPlaceChangedHandler(onPlaceChanged);
    
    return mapWrapper;
};

// Handler for the user selecting a new location from the search box
function onPlaceChanged(){
    var place = mainMapWrapper.getAutoComplete().getPlace();

    if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
    }

    mainMapWrapper.clearMarkers();
    mainMapWrapper.setCenter(place.geometry.location);
    mainMapWrapper.setZoom(12);
    mainMapWrapper.addMarker(place.geometry.location, iconList.pathTo["user"]);

    fetchVenues(place.geometry.location);
}

function onLocatedUser(pos){
    // Clear any existing markers
    mainMapWrapper.clearMarkers();
    // Add a marker to indicate the user's position
    mainMapWrapper.addMarker(pos, iconList.pathTo["user"]);
    // Re-center the map at the user's co-ordinates
    mainMapWrapper.setCenter(pos);
    // Set map zoom to show a decent area around the user
    mainMapWrapper.setZoom(12);

    // Re-populate near/far venues around new user position
    fetchVenues(pos);
}

function fetchVenues(position){
    var venues = new Venues();
    venues.nearby(position, onFetchedVenues);
};

function onFetchedVenues(venueResult){
    var jsonString = this.responseText;
    var nearFar = JSON.parse(jsonString);

    addMarkersWithIcons(nearFar.near, "near");
    addMarkersWithIcons(nearFar.far, "far");

    var pubList = refreshPubList();
    createVenueResultList(nearFar, pubList);
}

var addMarkersWithIcons = function(positions, iconKey){
    positions.forEach(function(venue){
        mainMapWrapper.addMarker({lat: venue.coords.lat, lng: venue.coords.long}, iconList.pathTo[iconKey])
    });
};

var refreshPubList = function(){
    // Clear out venue details list before repopulating
    var container = document.querySelector('#pub-list-flex-container');
    container.innerHTML = "";

    // Create a new pub ul
    var pubList = document.createElement('ul');
    pubList.id = 'pub-list';

    // Add the pub ul to its container
    container.appendChild(pubList);

    return pubList;
}

function createVenueResultList(venues, pubList){
    venues.near.forEach(function(venue){
        var pubItem = document.createElement('li');

        pubItem.appendChild(getHeader(venue.name));
        pubItem.appendChild(getDetailsList(venue));
        pubItem.appendChild(getOpeningDetails(venue.openingTimes));

        pubList.appendChild(pubItem);
    });
};

var getHeader = function(text){
    var h1 = document.createElement("h1");
    h1.class = "pub-title";
    h1.innerText = text;

    return h1;
};

var getDetailsList = function(venue){
    var ul = document.createElement('ul');

    appendListItem(ul, round(venue.distance, 1) + ' miles');
    appendListItem(ul, venue.addressLine1);
    appendListItem(ul, venue.addressLine2);
    appendListItem(ul, venue.town);
    appendListItem(ul, venue.region);
    appendListItem(ul, venue.postCode);
    appendListItem(ul, venue.phone);
    appendListItem(ul, venue.email);

    var facilitiesList = getFacilitiesList(venue.facilities);
    ul.appendChild(facilitiesList);

    // Sourced from: https://stackoverflow.com/a/27347503
    var d = new Date();
    var today = d.toLocaleString(window.navigator.language, {weekday: 'long'}).toLowerCase();

    appendListItem(ul, 'Open today: ' + venue.openingTimes[today][0] + ' - ' + venue.openingTimes[today][1]);

    return ul;
};

var getOpeningDetails = function(openingTimes){
    var details = document.createElement('details');
    var summary = document.createElement('summary');
    var ul = document.createElement('ul');
    ul.id = 'slide-panel';

    summary.innerHTML = 'more times...';

    var shortDays = ['Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat ', 'Sun '];
    var longDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for(var i = 0; i < 7; i++){
        var li = document.createElement('li');
        li.innerHTML = shortDays[i] + openingTimes[longDays[i]][0] + ' - ' + openingTimes[longDays[i]][1];
        ul.appendChild(li);
    };

    details.appendChild(summary);
    details.appendChild(ul);

    return details;
}

var getFacilitiesList = function(facilities){
    var ul = document.createElement('ul');
    facilities.forEach(function(facility){
        appendListImgItem(ul, iconList.pathTo[facility]);
    });
    
    return ul;
};

var createListItem = function(text){
    var li = document.createElement("li");
    li.innerHTML = text;

    return li;
};

var appendListItem = function(element, text) {
    var li = createListItem(text);
    element.appendChild(li);
};

var createListImgItem = function(path){
    var li = document.createElement("li");
    var image = document.createElement("img");
    image.src = path;
    li.appendChild(image);

    return li;
}

var appendListImgItem = function(element, path){
    var li = createListImgItem(path);
    element.appendChild(li);
};

// Sourced from: http://www.jacklmoore.com/notes/rounding-in-javascript/
var round = function(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

window.initMap = initMap;