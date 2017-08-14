var toggleOpeningHours = function(element){
  var panel = document.getElementById(element);
  var arrow = document.getElementById("arrow");
  var maxHeight = "180px";
  if(panel.style.height == maxHeight){
    panel.style.height = '0px';
    arrow.innerHTML = "&#9662;";
  }
  else{
    panel.style.height = maxHeight;
    arrow.innerHTML = "&#9652;";
  }
}

var toggleDropDown = function(element){
  var menuPanel = document.getElementById(element);
  var menuHeight = "300px";

  if(menuPanel.style.height == menuHeight){
    menuPanel.style.height == '0px';
  }

}

console.log("client/src")