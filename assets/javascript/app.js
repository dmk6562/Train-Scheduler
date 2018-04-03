$(document).ready(function() {
/* global moment firebase */
// Initialize Firebase

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDY8ky5iVgRX4-ckXr0qJfUwh_jEBhRqF8",
    authDomain: "train-scheduler-bc6bb.firebaseapp.com",
    databaseURL: "https://train-scheduler-bc6bb.firebaseio.com",
    projectId: "train-scheduler-bc6bb",
    storageBucket: "",
    messagingSenderId: "497991133049"
  };

   firebase.initializeApp(config);

  // Create a variable to reference the database.
  var database = firebase.database();

  // var trainData = database.ref("/trainData")

  //Initial Values
  var trainName = "";
  var destination = "";
  var firstTrainTime = 0000;
  var frequency = 00;


// Capture button click
$("#submit-train").on("click", function(e) {
  event.preventDefault();
  
  // Get the input values
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
//   var firstTrainTime = ($("#train-time").val().trim(), "HH:mm");
  var firstTrainTime = ($("#train-time").val().trim());
  var frequency = $("#frequency").val().trim();

console.log(trainName);
console.log(destination);
console.log(firstTrainTime);
console.log(frequency);


//Setting values in the database

database.ref().push ({
  	trainname: trainName,
  	destination: destination,
  	firstTrainTime: firstTrainTime,
  	frequency: frequency
});

// Clears all of the text-boxes
$("#train-name").val("");
$("#destination").val("");
$("#train-time").val("");
$("#frequency").val("");

});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());
  
  // Store everything into a variable.
  var trnName = childSnapshot.val().trainName;
  var trnDestination = childSnapshot.val().destination;
  var trnTime = childSnapshot.val().firstTrainTime;
  var trnFrequency = childSnapshot.val().frequency;

  var currentTime = moment();

  console.log("Current Time: " + moment(currentTime).format("HH:mm"));

// First train time (pushed back 1 year to make sure it comes before current time)    
var convertedFirstTime = moment(trnTime, "HH:mm").subtract(1, "years");

    console.log(convertedFirstTime);

// Difference between the start time and the current time //
var diffTime = moment().diff(moment(convertedFirstTime), "minutes");

  console.log("Difference in the time: " + diffTime) ;

// Getting the time apart remainder 

var tRemainder = diffTime % trnFrequency;

    console.log(tRemainder);

// The estimated arrival of the next train

var minutesAway = trnFrequency - tRemainder; 

    console.log("Minutes until train " + minutesAway);

// The estimated arrival of the next train

var nextTrain = moment().add(minutesAway, "minutes");

    console.log(nextTrain);

// next train

var nextArrival = moment(nextTrain, "HH:mm").format("HH:mm");

//Adds each train's data into the table

var row = $('<tr>');

row.append('<td>' + trnName + "</td>")
row.append('<td>' + trnDestination + "</td>")
row.append('<td>' + trnFrequency + "</td>")
row.append('<td>' + nextArrival + "</td>")
row.append('<td>' + minutesAway + "</td>")

$("#train-table > tbody").append(row)

});

});