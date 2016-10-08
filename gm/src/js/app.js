var longitude = -83.045754;
var latitude = 42.331427;
var key = "AIzaSyCDW-naC3PPNM6OE_3Xii6vfiLs9Vwe7nY";
var APITokenDetroitCrime = "8OPUdNc6B2smGxTa8vDn8Rpki";
// Longitude and Latitude
    function success(position) {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;
      console.log("lat:", latitude);
      if ((longitude != undefined) && (latitude != undefined)) {
          var longText = document.getElementById('long');
          var latiText = document.getElementById('lati');
          // longText.innerHTML = longitude;
          // latiText.innerHTML = latitude;
      }
      $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," +  longitude + "&key=" + key,
      }).success(function(response)
      {
          console.log(response.results[0].formatted_address);
          $.ajax({
            type: "POST",
            url: "https://maker.ifttt.com/trigger/crash_teen/with/key/d-_zxVjZpr34awx2JXkRXM",
            data: {"value1" : response.results[0].formatted_address},
          });
      });
      
    }

function processData(data) {
  console.log('got vehicle data: ', data);
  if (data.teen_drowsy_alerts > 3) {
    //Your teen is sleepy
    console.log(data.teen_drowsy_alerts);
  }
  if(data.airbag_deployed >= 1){
    //Text their parent
    gm.info.getCurrentPosition(success, true);
    
    console.log("Your teen was in a crash");
  }
}

<<<<<<< HEAD
// Intialize our map
  function initMap(){
    var center = new google.maps.LatLng(42.351517,-83.0705137);
    var mapOptions = {
      zoom: 8,
      center: center
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
=======
function showSpeed(data) {
  console.log(data);
  var speed = data.average_speed;
  if (speed !== undefined) {
    var speedText = document.getElementById('speed');
    // speedText.innerHTML = speed;
>>>>>>> master
  }

function getCrimeDataByCoordinates(longitude, latitude)
{


    
    
    // Retrieve our data and plot it
    $.ajax({
        url: "https://data.detroitmi.gov/resource/8p3f-52zg.json?$where=incidentdate between '2014-01-10T12:00:00' and '2014-12-10T14:00:00'",
        // https://data.detroitmi.gov/resource/8p3f-52zg.json?incidentdate=2012-12-27T00:00:00.000
        type: "GET",
        data: {
          //"$limit" : 5000,
          "$$app_token" : "8OPUdNc6B2smGxTa8vDn8Rpki"
        }
    }).success(function(resp){
        $.each(resp, function(i, entry) {
              var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(entry.location.coordinates[1], 
                                                   entry.location.coordinates[0]),
                  setMap: map,
              });
          });
    });

    // $.ajax({
    //     url: "https://data.detroitmi.gov/resource/8p3f-52zg.json?$where=incidentdate between '2014-01-10T12:00:00' and '2014-12-10T14:00:00'",
    //     // https://data.detroitmi.gov/resource/8p3f-52zg.json?incidentdate=2012-12-27T00:00:00.000
    //     type: "GET",
    //     data: {
    //       //"$limit" : 5000,
    //       "$$app_token" : "8OPUdNc6B2smGxTa8vDn8Rpki"
    //     }
    // }).success(function(response) {
    //   //build datastructures by distance away from us
    //   console.log(response[0].location.coordinates);
    //   var closeLocations = _.filter(response, function(response){ return  (response.location.coordinates[0] - longitude) <= 2 });
    //   console.log(closeLocations);
    //   // alert("Retrieved " + response.length + " records from the dataset!");
    //   // console.log(response);
    // });
}

$(document).ready(function() {
    

    // Call processData will all available signals. Expect a 5+ second delay before callback is triggered
    gm.info.getVehicleData(processData);

    var id = gm.info.watchVehicleData(processData, ['teen_drowsy_alerts','airbag_deployed']);


    //Teen Active Alerter
    function showActive(data) {
        if (data.teen_driver_active == '$1') {
            $.post("https://maker.ifttt.com/trigger/active_teen/with/key/d-_zxVjZpr34awx2JXkRXM");
            gm.info.getCurrentPosition(success, true);
        }
    }
    
    gm.info.watchVehicleData(showActive, ['teen_driver_active']);

    // Commented for testing purposes. Hard coded longitude / latitude above
   //gm.info.watchPosition(success, true);
    
});

function processPosition(position){
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
}

<<<<<<< HEAD

=======
function getCrimeDataByCoordinates(data)
{
  var baseUrlString = "https://data.detroitmi.gov/resource/8p3f-52zg.json?$where=within_circle(location, " + latitude + ", "+ longitude +", 500)";
  var dateParamter = "AND incidentdate between '2014-01-10T12:00:00' and '2014-12-10T14:00:00'";
  var finalUrlString = baseUrlString.concat(dateParamter);
    $.ajax({
        url: finalUrlString,
        type: "GET",
        data: {
          "$$app_token" : APITokenDetroitCrime
        }
    }).success(function(response) {
      alert("Retrieved " + response.length + " records from the dataset!");

      console.log(response);
    });
}
>>>>>>> master

