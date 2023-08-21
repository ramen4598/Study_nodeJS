var Body = {
  setBackgroundColor: function (color) {
    document.querySelector("body").style.backgroundColor = color;
  },
  setColor: function (color) {
    document.querySelector("body").style.color = color;
  },
};
var Links = {
  setColor: function (color) {
    var aList = document.querySelectorAll("a");
    for (var i = 0; i < aList.length; i++) {
      aList[i].style.color = color;
    }
  },
};
var Lists = {
  setColor: function (color) {
    var Lists = document.querySelectorAll("li");
    for (var i = 0; i < Lists.length; i++) {
      Lists[i].style.backgroundColor = color;
    }
  },
}
const NightDayBtn = {
  getValue: ()=>{
    let btn = document.getElementById("nightDayBtn");
    console.log(btn.value);
    return btn.value;
  },
  setValue: ()=>{
    let btn = document.getElementById("nightDayBtn");
    if(getCookie('darkMode') === 'true'){
      btn.value = "day";
    }else{
      btn.value = "night";
    }
    console.log(btn.value);
  }
}
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function nightDayHandler() {
  if(getCookie('darkMode') === 'true'){
    Body.setBackgroundColor("black");
    Body.setColor("white");
    Links.setColor("white");
    Lists.setColor("black");
    NightDayBtn.setValue();
  } else {
    Body.setBackgroundColor("white");
    Body.setColor("black");
    Links.setColor("black");
    Lists.setColor("white");
    NightDayBtn.setValue();
  }
}
function changeDarkMode() {
  if (NightDayBtn.getValue() === "night") {
    document.cookie = "darkMode=true; Path=/"; 
  } else {
    document.cookie = "darkMode=false; Path=/"; 
  }
  nightDayHandler();
}