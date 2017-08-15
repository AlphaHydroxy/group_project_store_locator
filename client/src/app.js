var MapWrapper = require('./mapWrapper');
var Venues = require('./models/venues');
var Icons = require('./models/icons');
var iconList = new Icons();
var Weekdays = require('./models/weekDays');
var weekDayFinder = new Weekdays();

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

    // Adds the getPlaceChangedHandler to the autocomplete box
    // The handler runs whenever the user updates the value in the box
    autocomplete.addListener('place_changed', function(){
        return onPlaceChanged(autocomplete, mapWrapper);
    });

    // This creates an event handler on the map which updates the autocompleting textbox whenever 
    // the map's boundaries change. After updating, the results returned in the textbox are more relevant
    // to that area.
    mapWrapper.addBoundsChangedListener(autocomplete);

    // Fetch near/far venues around user's position
    fetchVenues(mapWrapper.getCenter(), mapWrapper);
};


var onPlaceChanged = function(autoCompleteBox, mapWrapper){
    var place = autoCompleteBox.getPlace();
    if (!place.geometry) {
        debugger;
        var close = document.getElementById('alert');
        close.style.display = "block";
        // Ji - We finish up in here when the user's entered something daft into the 
        // search box. Can we do something - pop up an alert, change the colour of something...?

        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        
        return;
    }
    
    mapWrapper.setCenter(place.geometry.location);
    mapWrapper.setZoom(12);
    mapWrapper.clearMarkers();

    mapWrapper.addMarker(place.geometry.location, iconList.pathTo["user"]);
    fetchVenues(place.geometry.location, mapWrapper);
};

// Fetches a collection of venues around the user's location
function fetchVenues(position, mapWrapper){
    var venues = new Venues();
    venues.nearby(position, function(result){        
        onNearbyComplete(result, mapWrapper, this);
    });
}

var onNearbyComplete = function(result, mapWrapper, context){
    var jsonString = context.responseText;
    var results = JSON.parse(jsonString);

    var pubList = refreshPubList();

    addMarkersWithIcons(mapWrapper, results.near, "near");
    addMarkersWithIcons(mapWrapper, results.far, "far");

    createVenueResultList(results, pubList);
};

var addMarkersWithIcons = function(mapWrapper, positions, iconKey){
    positions.forEach(function(venue){
        mapWrapper.addMarker({lat: venue.coords.lat, lng: venue.coords.long}, iconList.pathTo[iconKey])
    });
};

function createVenueResultList(venues, pubList){
    venues.near.forEach(function(venue){
        var pubItem = document.createElement('li');

        pubItem.appendChild(getHeader(venue.name));
        pubItem.appendChild(getDetailsList(venue));
        pubItem.appendChild(getOpeningDetails(venue.openingTimes));

        pubList.appendChild(pubItem);
    });

    // var ulOpeningTimes = document.createElement("ul");
    // ulOpeningTimes.id = "slide-panel";
    // createOpeningTimes(ulOpeningTimes, venue);
    // var openingTimesContainer = document.createElement("div");
    // openingTimesContainer.id = "opening-hours-panel";
    // openingTimesContainer.appendChild(ulOpeningTimes);
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

    var monday = document.createElement('li');
    monday.innerHTML = 'Mon ' + openingTimes.monday[0] + ' - ' + openingTimes.monday[1];
    var tuesday = document.createElement('li');
    tuesday.innerHTML = 'Mon ' + openingTimes.tuesday[0] + ' - ' + openingTimes.tuesday[1];
    var wednesday = document.createElement('li');
    wednesday.innerHTML = 'Mon ' + openingTimes.wednesday[0] + ' - ' + openingTimes.wednesday[1];
    var thursday = document.createElement('li');
    thursday.innerHTML = 'Mon ' + openingTimes.thursday[0] + ' - ' + openingTimes.thursday[1];
    var friday = document.createElement('li');
    friday.innerHTML = 'Mon ' + openingTimes.friday[0] + ' - ' + openingTimes.friday[1];
    var saturday = document.createElement('li');
    saturday.innerHTML = 'Mon ' + openingTimes.saturday[0] + ' - ' + openingTimes.saturday[1];
    var sunday = document.createElement('li');
    sunday.innerHTML = 'Mon ' + openingTimes.sunday[0] + ' - ' + openingTimes.sunday[1];

    ul.appendChild(monday);
    ul.appendChild(tuesday);
    ul.appendChild(wednesday);
    ul.appendChild(thursday);
    ul.appendChild(friday);
    ul.appendChild(saturday);
    ul.appendChild(sunday);

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

// var createOpeningTimes = function(ul, venue){
//     appendListItem(ul, venue.openingTimes.monday[0] + " : " + venue.openingTimes.monday[1]);
//     appendListItem(ul, venue.openingTimes.tuesday[0] + " : " + venue.openingTimes.tuesday[1]);
//     appendListItem(ul, venue.openingTimes.wednesday[0] + " : " + venue.openingTimes.wednesday[1]);
//     appendListItem(ul, venue.openingTimes.thursday[0] + " : " + venue.openingTimes.thursday[1]);
//     appendListItem(ul, venue.openingTimes.friday[0] + " : " + venue.openingTimes.friday[1]);
//     appendListItem(ul, venue.openingTimes.saturday[0] + " : " + venue.openingTimes.saturday[1]);
//     appendListItem(ul, venue.openingTimes.sunday[0] + " : " + venue.openingTimes.sunday[1]);
// };

window.addEventListener('load', app);