const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyDPPkHh0huH-BIuG2Bik9doADu9jzfGM0g",
    authDomain: "mhacks8-c0c8a.firebaseapp.com",
    databaseURL: "https://mhacks8-c0c8a.firebaseio.com",
    storageBucket: "mhacks8-c0c8a.appspot.com",
    messagingSenderId: "768473290344",
    serviceAccount: "MHacks8-5286fa3c6dde.json"
};
firebase.initializeApp(config);



var state = "detecting";

//data will be stored at this database reference:

var db = firebase.database();
var camsRef = db.ref("cameras");


//MQTT
client.on('connect', () => {
  //if camera detects people, update density
  client.subscribe('camera/detecting', function(){
    console.log("camera is detecting!");
    var message = {
      camID: '2',
      time_activated: new Date(),
      density: 2
    };

    client.publish("camera/detecting", JSON.stringify(message));
    // if camID not recognized, add to firebase
  });
  //if camera falls asleep, set density to 0
  client.subscribe('camera/sleep', function(){
    console.log("camera is asleep!");
    var message = {
      camID: '1',
      density: 0,
    };
    client.publish("camera/sleep", JSON.stringify(message));
  });
});

client.on("message", function(topic, message){
  //message is a buffer
  console.log("topic: ", topic);
  console.log("message: ", JSON.parse(message.toString()));
  message = JSON.parse(message.toString());
  var camID = message.camID;
  var timeTriggered = message.time_activated;
  var density = message.density;
  if(topic == "camera/detecting"){
    camsRef.on("value", function(snapshot){
      if(!(snapshot.hasChild(camID))){
        camsRef.child(camID).set({
            cam_number: camID,
            time_activated: timeTriggered,
            location: 0, //geodata
            density: density
        });
      }
      console.log("updating child:");
      camsRef.child(camID).update({
        time_activated: timeTriggered,
        density: density
      });
    });
  }
  else if(topic == "camera/sleep"){
    camsRef.on("value", function(snapshot){
      camsRef.child(camID).update({
        density: 0
      });
    });
  }

});
