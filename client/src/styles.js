var toggleOpeningHours = function(element){
<<<<<<< HEAD
  debugger;
  var panel = document.getElementById(element), navarrow = document.getElementById("navarrow"), maxHeight = "200px";
=======
  var panel = document.getElementById(element);
>>>>>>> htmlbranch
  if(panel.style.height == maxHeight){
    panel.style.height = '0px';
  }
  else{
    panel.style.height = maxHeight;
  }
}

var toggleDropDown = function(element){
  debugger;
  var menuPanel = document.getElementById(element);
  var menuHeight = "169px";

  if(menuPanel.style.height == menuHeight){
    menuPanel.style.height = '0px';
  }
  else{
    menuPanel.style.height = menuHeight;
  }
}