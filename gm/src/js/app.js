var longitude = maxLong = minLong = -83.114405;
var latitude = maxLat = minLat =  42.435412;
var numOfCrimes;

//Total area: 398.21 mi² (1,031.36 km²)
var sqMiles = 398.21;
var key = "AIzaSyCDW-naC3PPNM6OE_3Xii6vfiLs9Vwe7nY";
var APITokenDetroitCrime = "X6GrU2jxr5ISyxSK5OJU8YjuY";
var crimeAverage;

var blockToLatitude = .5 / 69;
var blockToLongitude = .5 / 69;
var avgCrimePerSqMi, avgCrimePer8thMi;
var mileRatioInBlock = .5; //half mile blocks

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

// Don't  think we actually use this
function processPosition(position){
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
}

// Returns ajax promise of crime just for your area. 
function getMyAreaCrime(data)
{
  var baseUrlString = "https://data.detroitmi.gov/resource/8p3f-52zg.json?$where=within_circle(location, " + latitude + ", "+ longitude +", 500)";
  var dateParamter = "AND incidentdate between '2014-01-10T12:00:00' and '2014-12-10T14:00:00'";
  var finalUrlString = baseUrlString.concat(dateParamter);
  return $.ajax({
        url: finalUrlString,
        type: "GET",
        data: {
          "$$app_token" : APITokenDetroitCrime
        }
    }).success(function(response) {
      alert("Retrieved " + response.length + " crime records from the dataset in your area! (Not Weighted)");
      alert("The weighted value of this is " +getRankedCrimesForDistrict(response) );
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
//function initMap()
//{
//  var center = new google.maps.LatLng(42.351517,-83.0705137);
//  var mapOptions = {
//    zoom: 8,
//    center: center
//  }
//  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
//}

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
    }

    ).success(function(resp){
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
}


$(document).ready(function() 
{
  $('#second').hide();
  $('#headlightTitle').hide();
  $('#headlightVideo').hide();
  $('#oilTitle').hide();
  $('#oilVideo').hide();
  
  $('#next').click(function() {
     $('#first').toggle();
     $('#second').toggle();
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

  // Makes the "Is it safe to park" button actually do things. Basically rattles off statistics 
  $( "#safe" ).click(function() {
    // getCrimeStatistics();
    getMyAreaCrime();

  });
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

// ).then(function( records ) {
  //   var weightedCrimeOfRecords = getRankedCrimesForDistrict(records);
  //   alert("Retrieved " + weightedCrimeOfRecords + " records from the dataset in a surrounding district (weighted)");
  //   return weightedCrimeOfRecords;

  // });
// returns the numerical value of crime for a district. 
// not really valid anymore because I just made the other function return an actual numeric value instead of ajax promise
// function getDistrictCrime(latitude, longitude)
// {
//   var districtCrimes = getCrimeDataByCoordinates(latitude, longitude);
//   Promise.all([districtCrimes]).then(values => {

//     return getRankedCrimesForDistrict(values[0]);
//   });
// }

// Returns the weighted value of a districts crime rate
function getRankedCrimesForDistrict(crimeObjects)
{
  var i =0;
  var weightedTotal = 0;
  for (i; i < crimeObjects.length; i++)
  {
    var crimeLevel = parseInt(crimeObjects[i].stateoffensefileclass);
    if (crimeLevel >= 25000 && crimeLevel < 32000 ) weightedTotal += 1;
    else if (crimeLevel >= 15000 && crimeLevel < 25000 ) weightedTotal += 2;
    else if (crimeLevel < 15000) weightedTotal += 3;
  }
  return weightedTotal;
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

function getCrimeDataByCoordinatesLatLong(lati, longi)
{
  var baseUrlString = "https://data.detroitmi.gov/resource/8p3f-52zg.json?$where=within_circle(location, " + lati + ", "+ longi +", 804.672)";
  var dateParamter = "AND incidentdate between '2014-01-10T12:00:00' and '2014-12-10T14:00:00'";
  var finalUrlString = baseUrlString.concat(dateParamter);
  return $.ajax({
        url: finalUrlString,
        type: "GET",
        data: {
          "$$app_token" : APITokenDetroitCrime
        },
    }).success(function(response){
      if(response.length > 0 ){
        alert("Retrieved " + response.length + " records from the dataset! Damn thats a lot of crime!");
      }
      console.log(response);
    })
  // Gets crime statistics for the entire detroit region, data set for 2014
//       if(response.length > 0 ){
//         alert("Retrieved " + response.length + " records from the dataset! Damn thats a lot of crime!");
//       }
//       //return response.length;
//     });  
// }
  
}

function getDistrictCrime(latitude, longitude)
{
  var districtCrimes = getCrimeDataByCoordinates(latitude, longitude);
  Promise.all([districtCrimes]).then(function(values){
    return values[0].length;
  });
}

function getRankedCrimes(rank)
{
  if (rank == 3) // Worst crimes, murder  etc
  {
    var upperBound = 32000;
    var lowerBound = 25000; 

  }
  else if (rank == 2) // armed robberies etc.
  {
    var upperBound = 24999;
    var lowerBound = 15001;   
  }
  else if (rank == 1)

  {
    var upperBound = 15000;
    var lowerBound = 8000; 
  }

  var baseUrlString = "https://data.detroitmi.gov/resource/8p3f-52zg.json?$where=stateoffensefileclass between " + lowerBound + " and " + upperBound;
  var dateParameter = "AND incidentdate between '2014-01-10T12:00:00' and '2014-12-10T14:00:00'";
  var finalUrlString = baseUrlString.concat(dateParameter);
  return $.ajax({
        url: finalUrlString,
        type: "GET",
        data: {
          "$$app_token" : APITokenDetroitCrime
        }
    }).success(function(responseFilteredRank) {
      // alert("Retrieved " + responseFilteredRank.length + " of rank " + rank + ".");
      console.log(responseFilteredRank);
    });

}

//var density = Average Crime pts per sq mile
//Convert to Crime pts per .125 of a mile = aka var density =/ 8

// p value = Avg/.125mi - Avg 
// Divided by the std dev

//1 degree latitude = 69 miles
// X degree's latitude = .125 miles


function getCrimeStatistics() {
  var rankedCrimes = []
  rankedCrimes.push(getRankedCrimes(1));
  rankedCrimes.push(getRankedCrimes(2));
  rankedCrimes.push(getRankedCrimes(3));

  Promise.all(rankedCrimes).then(function(values) { 
    var crimeWeightedTotal = 0;
    var i = 1;
    $.each( values, function() {
      crimeWeightedTotal += ($(this).length)*i;
      i++;
    });
     alert("Crime Total: "+ crimeWeightedTotal);
     var crimePoints = crimeWeightedTotal;
     avgCrimePerSqMi = crimePoints / sqMiles;
     //We'll be pulling data around you by the 8th of a mile radius so we need to convert
     avgCrimePer8thMi = avgCrimePerSqMi / mileRatioInBlock;
     getVariance();
  });
}

//MinLat: 42.2556 MaxLat: 42.5442 MinLong: -83.2975 MaxLong: -82.9099
function getVariance()
{
  var sumDifferences = 0;
  var numOfDistricts = 0;
  console.log("start adding shit");
  var getDistricts = [];
  var diff = 0;
  //Loop through the whole block of lat/longs that we have to calculate the 
  for(var i = minLat; i < minLat + blockToLatitude*3; i += blockToLatitude)
  {
    for(var x = minLong; x < minLong + blockToLongitude * 3; x += blockToLongitude)
    {
      //Fix this to take any coordinates;
      //Return the crime points for that district
      //.125 
      //This is returning null for some reason, the getCrimeData is being weird. I think it has to do with the function
      //calling a promise and it not returning in time
      getDistricts.push(getCrimeDataByCoordinatesLatLong(i,x));
      // var avgForDistrict = getCrimeDataByCoordinatesLatLong(i,x);
      numOfDistricts++;
    }
  }

  Promise.all(getDistricts).then(function(values) 
  {
    var i = 0;
    $.each( values, function(item) {
      diff = Math.pow((item.length - avgCrimePer8thMi),2);
      sumDifferences += diff;
      i++;
    });
    console.log("finished adding shit" , numOfDistricts);
    console.log("sumDifferences: " + sumDifferences);
    var variance = sumDifferences / numOfDistricts;
    console.log("Variance is: " + variance);
    var std = Math.pow(variance,.5);
  });
  

}
//variance = sum(# - Avg) / radius

//Have to calculate the the Crime points for every radius of .125
//We should make a significant amount of calls unless filtering is going to be easier(highly doubtful)

//FUCK MY LIFE
function calculateStatistics(stuff)
{
  
  var p = (num - avgCrimePer8thMi) / stdDev;



}
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

