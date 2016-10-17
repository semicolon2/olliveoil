var routing = {};

//mapping callbacks
routing.home = function(){
  $("#content").load("partials/home.html");
  console.log('load home');
}
routing.page1 = function(){
  $("#content").load("partials/page1.html");
}
routing.page2 = function(){
  $("#content").load("partials/page2.html");
}
