var toggleOpeningHours = function(element){
  var panel = document.getElementById(element);
  if(panel.style.height == maxHeight){
    panel.style.height = '0px';
  }
  else{
    panel.style.height = maxHeight;
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