var longitude = maxLong = minLong = -83.114405;
var latitude = maxLat = minLat =  42.435412;
var numOfCrimes;
//Total area: 398.21 mi² (1,031.36 km²)
var sqMiles = 398.21;
var key = "AIzaSyCDW-naC3PPNM6OE_3Xii6vfiLs9Vwe7nY";
var APITokenDetroitCrime = "8OPUdNc6B2smGxTa8vDn8Rpki";
var crimeAverage;
// Longitude and Latitude
function success(position) 
{
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
      alert("Retrieved " + response.length + " records from the dataset!");

      console.log(response);
    });
}

function showHelpHeadlight() {
    $('#headlightVideo').toggle();
}

function showHelpOil() {
    $('#oilVideo').toggle();
}

function showHelpHeadlight() {
    $('#headlightVideo').toggle();
}

function showHelpOil() {
    $('#oilVideo').toggle();
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

// Intialize our map
function initMap()
{
  var center = new google.maps.LatLng(42.351517,-83.0705137);
  var mapOptions = {
    zoom: 8,
    center: center
  }
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}


/*function showSpeed(data) {
>>>>>>> master
=======
/*function showSpeed(data) {
>>>>>>> master
  console.log(data);
  var speed = data.average_speed;
  if (speed !== undefined) {
    var speedText = document.getElementById('speed');
    // speedText.innerHTML = speed;
  }
}*/ 
    
    //gm.info.watchVehicleData(showSpeed, ['average_speed']);
    //gm.info.getVehicleData(showSpeed, ['average_speed']);



//var density = Average Crime pts per sq mile
//Convert to Crime pts per .125 of a mile = aka var density =/ 8

// p value = Avg/.125mi - Avg 
// Divided by the std dev

//variance = sum(# - Avg) / radius

/*
Longitude
Latitude
*/
function getCrimeDataByYear()
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
        console.log(resp.length);
        var count = 0;
        _.each(resp,function(item){
          //longitude
          var longit = item.location.coordinates[0];
          var latit = item.location.coordinates[1];
          if(longit < minLong && longit >= -180){minLong = longit;}
          else if(longit > maxLong && longit <= 180){maxLong = longit;}
          //Latitude
          else if(latit < minLat && latit >= -180){minLat = latit;}
          else if(latit > maxLat && latit <= 180)
          {
            maxLat = latit;
          }
          count++;
        });
        console.log(count);
        console.log("MinLat: " + minLat + " MaxLat: " + maxLat + " MinLong: " + minLong + " MaxLong: " + maxLong);
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

$(document).ready(function() 
{
  $('#second').hide();
  $('#headlightTitle').hide();
  $('#headlightVideo').hide();
  $('#oilTitle').hide();
  $('#oilVideo').hide();
  
  $('#next').click(function() {
     $('#first').fadeToggle();
     $('#second').fadeToggle();
     $(this).text(function(i, text){
        return text === "Main Menu" ? "Repair" : "Main Menu";
    });
  });
  // Call processData will all available signals. Expect a 5+ second delay before callback is triggered
  gm.info.getVehicleData(processData);

  var id = gm.info.watchVehicleData(processData, ['teen_drowsy_alerts','airbag_deployed']);

  gm.info.watchVehicleData(showActive, ['teen_driver_active']);

  // Commented for testing purposes. Hard coded longitude / latitude above
 //gm.info.watchPosition(success, true);
  
  gm.info.watchVehicleData(getHeadlight, ['bulb_center_fail']);
  gm.info.watchVehicleData(getOil, ['change_oil_ind']);
  
});

//Teen Active Alerter
  function showActive(data) {
      if (data.teen_driver_active == '$1') {
          $.post("https://maker.ifttt.com/trigger/active_teen/with/key/d-_zxVjZpr34awx2JXkRXM");
          gm.info.getCurrentPosition(success, true);
      }
  }

//Watch Headlight Malfunction
  function getHeadlight(data) {
      if (data.bulb_center_fail == 1) {
          $('#headlightTitle').fadeIn(100);
      }
  }
  
  //Watch Oil Change
  function getOil(data) {
      if (data.change_oil_ind == '$1') {
          $('#oilTitle').fadeIn(100);
      }
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



function calculateStatistics(stuff)
{
  var avgCrimePerSqMi = crimePoints / sqMiles;
  //We'll be pulling data around you by the 8th of a mile radius so we need to convert
  var avgCrimePer8thMi = avgCrimePerSqMi / 8;
  var p = (num - avgCrimePer8thMi) / stdDev;



}

