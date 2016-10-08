var longitude,latitude;
var key = "AIzaSyCDW-naC3PPNM6OE_3Xii6vfiLs9Vwe7nY"
// Longitude and Latitude
    function success(position) {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;
      console.log("lat:", latitude);
      if ((longitude != undefined) && (latitude != undefined)) {
          var longText = document.getElementById('long');
          var latiText = document.getElementById('lati');
          longText.innerHTML = longitude;
          latiText.innerHTML = latitude;
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
    speedText.innerHTML = speed;
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

    
    

    gm.info.watchPosition(success, true);
    
});
