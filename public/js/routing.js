var routing = {};

//mapping callbacks
routing.home = function(){
  $("#content").load("partials/home.html");
}
routing.page1 = function(){
  $("#content").load("partials/page1.html");
}
routing.page2 = function(){
  $("#content").load("partials/page2.html");
}
