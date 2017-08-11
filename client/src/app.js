var MapWrapper = require('./mapWrapper.js');

// Start point for code that runs whenever the browser hits this page
var app = function(){
    // Get a reference to an element rendered in index.html
    // var exampleElement = document.querySelector('#some-element');
    // Set the onchange method of the element to onExampleElementChanged
    // exampleElement.onchange = onExampleElementChanged;

    createMap();
}

var createMap = function(){
    var mapDiv = document.querySelector('#map');
    var center = {lat: 54.606520, lng: -2.547321};
    var zoom = 18;
    var mainMap = new MapWrapper(mapDiv, center, zoom);
};

// var onExampleElementChanged = function(){
//     // Do stuff when exampleElement is changed
// };

window.addEventListener('load', app);