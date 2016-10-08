var longitude = -83.045754;
var latitude = 42.331427;
var key = "AIzaSyCDW-naC3PPNM6OE_3Xii6vfiLs9Vwe7nY";
var APITokenDetroitCrime = "8OPUdNc6B2smGxTa8vDn8Rpki";
var crimeAverage;
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

function showSpeed(data) {
  console.log(data);
  var speed = data.average_speed;
  if (speed !== undefined) {
    var speedText = document.getElementById('speed');
    // speedText.innerHTML = speed;
  }
}

$(document).ready(function() {
    
    gm.info.watchVehicleData(showSpeed, ['average_speed']);
    gm.info.getVehicleData(showSpeed, ['average_speed']);

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
      alert("Retrieved " + response.length + " records from the dataset! Damn thats a lot of crime!");

      console.log(response);
    });
}

function getRankedCrimes(rank)
{
  if (rank == 1)
  {
    var upperBound = 15000;
    var lowerBound = 9000;
  }
  else if (rank == 2)
  {
    var upperBound = 25000;
    var lowerBound = 15000;   
  }
  else //rank = 3
  {
    var upperBound = 32000;
    var lowerBound = 25000;   
  }

  var baseUrlString = "https://data.detroitmi.gov/resource/8p3f-52zg.json?$where=stateoffensefileclass between " + lowerBound + " and " + upperBound;
  var dateParameter = "AND incidentdate between '2014-01-10T12:00:00' and '2014-12-10T14:00:00'";
  var finalUrlString = baseUrlString.concat(dateParameter);
    $.ajax({
        url: finalUrlString,
        type: "GET",
        data: {
          "$$app_token" : APITokenDetroitCrime
        }
    }).success(function(responseFilteredRank) {

      alert("Retrieved " + responseFilteredRank.length + " of rank " + rank + ".");
      console.log(responseFilteredRank);

    });
}

