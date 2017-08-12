var MapWrapper = require('./mapWrapper.js');

// Start point for code that runs whenever the browser hits this page
var app = function(){
    createMap();
};

var createMap = function(){
    var mapDiv = document.querySelector('#map');
    // Default map to center somewhere in the middle of the UK
    var center = {lat: 54.606520, lng: -2.547321};
    // Default map zoom to something that shows the entire country
    var zoom = 5;
    var mainMap = new MapWrapper(mapDiv, center, zoom);
};

window.addEventListener('load', app);