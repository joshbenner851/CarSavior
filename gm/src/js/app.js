// Your code goes here


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

$(document).ready(function(){


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



});
