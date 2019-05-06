$( document ).ready( function() {
    // Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDdZODkoCeaRFptBbnBb63tKBxQzZILnZ8",
    authDomain: "train-scheduler-346ff.firebaseapp.com",
    databaseURL: "https://train-scheduler-346ff.firebaseio.com",
    projectId: "train-scheduler-346ff",
    storageBucket: "train-scheduler-346ff.appspot.com",
    messagingSenderId: "433471485719",
    appId: "1:433471485719:web:7c35fbb9cbb7eb5d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();


$('#submitBtn').on("click", function () {

    var name = $('#name').val().trim();
    var destination = $('#destination').val().trim();
    var time = $('#time').val().trim();
    var frequency = $('#frequency').val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        time: time,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });

});



database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (childSnapshot) {

    var sv = childSnapshot.val();
    var name = sv.name;
    var destination = sv.destination;
    var time = sv.time;
    var frequency = sv.frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


    var dataSet = ("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");

    $("#tbody").append(dataSet);
});



});