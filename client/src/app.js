var MapWrapper = require('./mapWrapper');
var Venues = require('./models/venues');

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
    mainMapWrapper.addInitListener(onMapInitialised)
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
        mapWrapper.addMarker(place.geometry.location);
        fetchVenues(place.geometry.location, mapWrapper);
    }
}

function fetchVenues(position, mapWrapper){
    var venues = new Venues();
    venues.nearby(position, function(result){        
        var jsonString = this.responseText;
        var results = JSON.parse(jsonString);

        var container = document.querySelector('#pub-list-flex-container');
        container.innerHTML = "";
        results.near.forEach(function(venue){
            mapWrapper.addMarker({lat: venue.coords.lat, lng: venue.coords.long});
            createVenueResultList(venue);
        })
    });
}

function createVenueResultList(venue){
    var pubListContainer = document.querySelector('#pub-list-flex-container');
    
    var h1 = document.createElement("h1");
    h1.innerText = venue.name;

    var ulPubDetails = document.createElement("ul");

    var li1Add1 = document.createElement("li");
    li1Add1.innerHTML = venue.addressLine1;
    var li2Add2 = document.createElement("li");
    li2Add2.innerHTML = venue.addressLine2;
    var li3Town = document.createElement("li");
    li3Town.innerHTML = venue.town;
    var li4Region = document.createElement("li");
    li4Region.innerHTML = venue.region;
    var li5Postcode = document.createElement("li");
    li5Postcode.innerHTML = venue.postCode;
    var li6Phone = document.createElement("li");
    li6Phone.innerHTML = venue.phone;
    var li7Email = document.createElement("li");
    li7Email.innerHTML = venue.email;
    var li8Facilities = document.createElement("li");
    li8Facilities.innerHTML = venue.facilites;

    var openingTimesButtonContainer = document.createElement("div")
    openingTimesButtonContainer.id = "btn-container";

    var actualButton = document.createElement("button");
    actualButton.onclick = "toggleOpeningHours('opening-hours-panel')";
    actualButton.innerHTML = "More times...<span id='arrow'>&#9662</span>"

    var openingTimesContainer = document.createElement("div");
    openingTimesContainer.id = "opening-hours-panel";

    var ulOpeningTimes = document.createElement("ul");
    ulOpeningTimes.id = "slide-panel";

    var openingMonday = document.createElement("li");
    openingMonday.innerHTML = venue.openingTimes.monday[0] + " : " + venue.openingTimes.monday[1];
    var openingTuesday = document.createElement("li");
    openingTuesday.innerHTML = venue.openingTimes.tuesday[0] + " : " + venue.openingTimes.tuesday[1];
    var openingWednesday = document.createElement("li");
    openingWednesday.innerHTML = venue.openingTimes.wednesday[0] + " : " + venue.openingTimes.wednesday[1];
    var openingThursday = document.createElement("li");
    openingThursday.innerHTML = venue.openingTimes.thursday[0] + " : " + venue.openingTimes.thursday[1];
    var openingFriday = document.createElement("li");
    openingFriday.innerHTML = venue.openingTimes.friday[0] + " : " + venue.openingTimes.friday[1];
    var openingSaturday = document.createElement("li");
    openingSaturday.innerHTML = venue.openingTimes.saturday[0] + " : " + venue.openingTimes.saturday[1];
    var openingSunday = document.createElement("li");
    openingSunday.innerHTML = venue.openingTimes.sunday[0] + " : " + venue.openingTimes.sunday[1];

    pubListContainer.appendChild(h1);
    pubListContainer.appendChild(ulPubDetails);
    ulPubDetails.appendChild(li1Add1)
    ulPubDetails.appendChild(li2Add2);
    ulPubDetails.appendChild(li3Town);
    ulPubDetails.appendChild(li4Region);
    ulPubDetails.appendChild(li5Postcode);
    ulPubDetails.appendChild(li6Phone);
    ulPubDetails.appendChild(li7Email);
    ulPubDetails.appendChild(li8Facilities);

    ulPubDetails.appendChild(openingTimesButtonContainer);
    openingTimesButtonContainer.appendChild(actualButton);
   
    ulPubDetails.appendChild(openingTimesContainer);
    ulOpeningTimes.appendChild(openingMonday);
    ulOpeningTimes.appendChild(openingTuesday);
    ulOpeningTimes.appendChild(openingWednesday);
    ulOpeningTimes.appendChild(openingThursday);
    ulOpeningTimes.appendChild(openingFriday);
    ulOpeningTimes.appendChild(openingSaturday);
    ulOpeningTimes.appendChild(openingSunday);
    openingTimesContainer.appendChild(ulOpeningTimes);
}




function showVenuesOnMap(venues){

}

window.addEventListener('load', app);