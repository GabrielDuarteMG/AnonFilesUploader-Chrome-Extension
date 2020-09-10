var w = 800;
var h = 600;

chrome.windows.getCurrent(function (e) {
  var left = e.width / 2 - w / 2;
  var top = e.height / 2 - h / 2;
  chrome.windows.create(
    {
      url: "/src/page_action/main.html",
      type: "popup",
      width: w,
      height: h,
      left: left,
      top: top,
    },
    function (window) {}
  );
});

this.close();
