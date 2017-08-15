var toggleOpeningHours = function(element){
  var panel = document.getElementById(element), navarrow = document.getElementById("navarrow"), maxHeight = "200px";
  if(panel.style.height == maxHeight){
    panel.style.height = '0px';
    navarrow.innerHTML = "&#9662;";
  }
  else{
    panel.style.height = maxHeight;
    navarrow.innerHTML = "&#9652;";
  }
}

var toggleDropDown = function(element){
  var menuPanel = document.getElementById(element);
  var menuHeight = "169px";

  if(menuPanel.style.height == menuHeight){
    menuPanel.style.height = '0px';
  }
  else{
    menuPanel.style.height = menuHeight;
  }

}

console.log("client/build/javascript");