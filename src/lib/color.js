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
function nightDayHandler(self) {
  if (self.value === "night") {
    Body.setBackgroundColor("black");
    Body.setColor("white");
    self.value = "day";
    Links.setColor("white");
    Lists.setColor("black");
  } else {
    Body.setBackgroundColor("white");
    Body.setColor("black");
    self.value = "night";
    Links.setColor("black");
    Lists.setColor("white");
  }
}