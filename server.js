var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: "path/to/serviceAccountCredentials.json",
  databaseURL: "https://mhacks8-c0c8a.firebaseio.com/"
});

// The app only has access to public data as defined in the Security Rules
var db = firebase.database();
var ref = db.ref("/some_public_resource");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

//data will be stored at this database reference:
var db = firebase.database();
var ref = db.ref("server/saving-data/fireblog");


var camsRef = ref.child("cameras");
camsRef.child().set({
    cam_number: cam_num,
    time_activated: trigger_time,
    location: geodata
});
