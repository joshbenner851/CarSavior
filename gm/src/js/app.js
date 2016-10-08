

function processData(data) {
  console.log('got vehicle data: ', data);
  if (data.teen_drowsy_alerts > 3) {
    //Your teen is sleepy
    console.log(data.teen_drowsy_alerts);
  }
  if(data.airbag_deployed > 1){
    //Text their parent
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
};

$(document).ready(function() {
    
    gm.info.watchVehicleData(showSpeed, ['average_speed']);
    gm.info.getVehicleData(showSpeed, ['average_speed']);

    // gm.ui.showAlert({
    //   alertTitle: 'Hey Jude',
    //   alertDetail: 'Don\'t let me down',
    //   primaryButtonText: 'I won\t!',
    //   primaryAction: function stayAndPractice() {},
    //   secondaryButtonText: 'Sorry, Paul',
    //   secondaryAction: function hangWithYoko() {}
    // });

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
