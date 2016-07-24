  var config = {
    apiKey: "AIzaSyC_LhZFZVhPfE08M_E-jvvFRX1mwWzPYdk",
    authDomain: "transport-7ece1.firebaseapp.com",
    databaseURL: "https://transport-7ece1.firebaseio.com",
    storageBucket: "",
  };

var fulldata = []
var lat_long;
// Initialize your Firebase app
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 3,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });
  map.addListener('click', function(e) {
  var marker = new google.maps.Marker({
    position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
    map: map
  });
  lat_long = e.latLng.lat().toFixed(2)+"_"+e.latLng.lng().toFixed(2);
  var flag = 0;
  for(var i=0; i<fulldata.length -1;i++){
    if(fulldata[i]["id"] == lat_long){
      flag = 1;
    }
  }
  if(!flag)
    fulldata.push({"id": lat_long, "comments" : []})
  console.log("After Init :: "+fulldata);
  loadComments(lat_long);
//  firebase.push({lat: e.latLng.lat(), lng: e.latLng.lng()});
});
}
function loadComments(new_lat_long){
  console.log("loaded comments")
  console.log(new_lat_long+JSON.stringify(fulldata));

  for(var i=0; i<fulldata.length;i++){
    var ele = fulldata[i];

    if(ele["id"] == new_lat_long){
    var formattedstr = ""
    for(var j=0;j<ele["comments"].length;j++){
    formattedstr += ele["comments"][j]
    formattedstr +=  "<br/><br/>"
    formattedstr+=new Date().toUTCString()+"<br/>";
  }
  }
  }
  document.getElementById("comment1").innerHTML = formattedstr;
}
firebase.initializeApp(config);

// Reference to the recommendations object in your Firebase database
var recommendations = firebase.database().ref("recommendations");

// Save a new recommendation to the database, using the input in the form
var submitRecommendation = function () {

  // Get input values from each of the form elements
  var comments = $("#comments").val();
  var name = $("#name").val();

  // Push a new recommendation to the database using those values
  recommendations.push({
    "user": name,
    "comments": comments,
    "lat_long" : lat_long
  });
  console.log("hey"+JSON.stringify(fulldata)+ fulldata.length);


  for(var i=0; i<fulldata.length;i++){
    var ele = fulldata[i];
    console.log("inside" + JSON.stringify(ele));
    if(ele["id"] == lat_long){
    fulldata[i]["comments"].push(comments+" by "+name)
  }
  }

};


recommendations.limitToLast(10).on('child_added', function(childSnapshot) {
 console.log("logging on?")
  recommendation = childSnapshot.val();
  loadComments(lat_long);

  $("#link").attr("href", recommendation.link)
});
$(window).load(function () {


  $( "#a1" ).click(function() {
    console.log("Clicked:::")
    submitRecommendation()
});

});
