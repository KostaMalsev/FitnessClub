
//Firebase Globals:
//var firebase=null;
var db = null;
var msgRef=null;


//Function ititialize firebase:
function InitFirebase()
{
    // Initialize Firebase
    //firebase.initializeApp(firebaseConfig);
    //firebase.analytics();
    db = firebase.database();
    msgRef = db.ref("/user");
    //to store data in the msgs folder by creating a reference in database

    // Retrieve new posts as they are added to our database
    msgRef.on("child_added", function(snapshot, prevChildKey) {
        var newPost = snapshot.val();
        HandleHookFromFirebase(newPost);
        //console.log("Author: " + newPost.author);
        //console.log("Title: " + newPost.title);
        //console.log("Previous Post ID: " + prevChildKey);
    });
}

//Initialize Firebase connection
InitFirebase();


//Function handles write event from firebase
function HandleHookFromFirebase(post)
{
    let wrap = document.getElementById("person_wrap");
    const p = document.createElement('p');
    p.innerText =`Name is ${post.text.name} and his strength is ${post.text.strength}`;
    wrap.appendChild(p);
}


//Writes data to firebase:
function StorePerson()
{
    let details = {
        name: document.getElementById('person').value,
        strength: document.getElementById('strength').value
    };


    WriteToFirebaseDB(details);
}
//Function writes messages and data to Firebase db
function WriteToFirebaseDB(details)
{
    let text=details;
    const msg = {
        name: name,
        text: text
    };
    msgRef.push(msg);
    //msgInput.value = "";
}


//Get nutrient value of food:
function GetNutrients() {
//Adding the api to nutrition

    let food_name = document.getElementById('result').value;
    //?fields=nf_calories%2Cnf_total_fat
    let options = {
        method: 'GET',
        url: `https://rapidapi.p.rapidapi.com/v1_1/search/${food_name}?fields=nf_calories%2Cnf_total_fat`,
        data: ''
    };
    //Call cross cors request:
    doCORSRequest(options, function printResult(result) {
        HandleResult(JSON.parse(result));
    });
}


//Utility to overcome CORS limitations in GET and POST:
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function() {
        printResult(
            (x.responseText || '')
        );
    };
    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    x.setRequestHeader("x-rapidapi-host", "nutritionix-api.p.rapidapi.com");
    x.setRequestHeader("x-rapidapi-key", "5477ac9d35msh43acf850db9a5f0p12aa01jsn4821878eda80");
    x.send(options.data);
}

//Handgle result from API:
function HandleResult(result)
{
    let main_div = document.getElementById('main');
    document.getElementById('result').innerHTML = result;
    const p = document.createElement('p');
    //result.hits[0].fields.nf_calories
    // result.hits[0].fields.nf_serving_size_qty
    // result.hits[0].fields.nf_total_fat
    // result.hits[0].fields.nf_serving_size_unit
    p.innerText = `${result.hits[0].fields.nf_calories}[kcalories],${result.hits[0].fields.nf_total_fat}[fat]`;
    main_div.appendChild(p);
}


//PUT: adding to DB
function PUTRequest(theUrl, data, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            callback(response);
        }
    }
    xmlhttp.open("PUT", theUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(data));
}

function getRequest(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            callback(response);
        }
    }
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
}







/*

<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="/__/firebase/7.23.0/firebase-app.js"></script>
<!-- TODO: Add SDKs for Firebase products that you want to use
https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="/__/firebase/7.23.0/firebase-analytics.js"></script>
<!-- Initialize Firebase -->
<script src="/__/firebase/init.js"></script>

<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js"></script>

     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.23.0/firebase-analytics.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use

 */