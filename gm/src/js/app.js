// Your code goes here
$(document).ready(function() {
    
    //Teen Active Alerter
    function showActive(data) {
        if (data.teen_driver_active == '$1') {
            $.post("https://maker.ifttt.com/trigger/active_teen/with/key/d-_zxVjZpr34awx2JXkRXM");
            gm.info.getCurrentPosition(success, true);
        }
    }
    
    gm.info.watchVehicleData(showActive, ['teen_driver_active']);

    
    // Longitude and Latitude
    function success(position) {
      var long = position.coords.longitude;
      var lati = position.coords.latitude;
      if ((long != undefined) && (lati != undefined)) {
          var longText = document.getElementById('long');
          var latiText = document.getElementById('lati');
          longText.innerHTML = long;
          latiText.innerHTML = lati;
      }
    }

    gm.info.watchPosition(success, true);
    
    // Speed
    /*function showSpeed(data) {
        var speed = data.average_speed;
        if (speed != undefined) {
            var speedText = document.getElementById('speed');
            speedText.innerHTML = speed;
        }
    }*/
});