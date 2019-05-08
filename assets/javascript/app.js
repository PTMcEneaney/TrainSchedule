$(document).ready(function () {
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
    // var childName = database.ref().child();

    $('#submitBtn').on("click", function (event) {
        var name = $('#name').val().trim();
        var destination = $('#destination').val().trim();
        var time = $('#time').val().trim();
        var frequency = $('#frequency').val().trim();
        if (name !== "" && destination !== "" && time ==! "" && frequency !== ""){
            

            database.ref().push({
                "name": name,
                "destination": destination,
                "time": time,
                "frequency": frequency,
                "dateAdded": firebase.database.ServerValue.TIMESTAMP,
            });
        } else {
            event.preventDefault();
            alert("Please enter values in each field");
        }

    });

    $(document.body).on("click", '.close', function () {
        $(this).parent().parent().addClass("d-none");
    });


    database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (childSnapshot) {

        var sv = childSnapshot.val();
        var name = sv.name;
        var destination = sv.destination;
        var time = sv.time;
        var frequency = sv.frequency;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        var closeBtn = '<button type="button" class="close text-light float-left" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

        var dataSet = ("<tr><td>" + closeBtn +
            "</td><td data='name'>" + name +
            "</td><td data='destination'>" + destination +
            "</td><td data='frequency'>" + frequency +
            "</td><td data='time'>" + moment(nextTrain).format("hh:mm a") +
            "</td><td>" + tMinutesTillTrain + "</td></tr>");

        $("#tbody").append(dataSet);

        // contenteditable='true'

    });

    database.ref().on("child_added", function (snapshot) {
        var sv = snapshot.val();
        console.log(sv);

    });

});