var toggleOpeningHours = function(x){
  var panel = document.getElementById(x), navarrow = document.getElementById("navarrow"), maxHeight = "100px";
  if(panel.style.height == maxHeight){
    panel.style.height = '0px';
    navarrow.innerHTML = "&#9662;";
  }
  else{
    panel.style.height = maxHeight;
    navarrow.innerHTML = "&#9652;";
  }
}

console.log("hello world");