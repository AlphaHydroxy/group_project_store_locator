var toggleOpeningHours = function(x){
  var panel = document.getElementById(x), arrow = document.getElementById("arrow"), maxHeight = "180px";
  if(panel.style.height == maxHeight){
    panel.style.height = '0px';
    arrow.innerHTML = "&#9662;";
  }
  else{
    panel.style.height = maxHeight;
    arrow.innerHTML = "&#9652;";
  }
}