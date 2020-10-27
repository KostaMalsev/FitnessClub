
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
    const url_ = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=MVPaBrywVMVDkVehW8DCZ2AjcbJhEJhfVpfGq1im&query="
    let options = {
        method: 'GET',
        url: `${url_}${food_name}`,
        data: ''
    };
    //Call cross cors request:
    doCORSRequest(options, function printResult(result) {
        HandleResult(JSON.parse(result));
    });
}

//Handgle result from API:
function HandleResult(result)
{
    let main_div = document.getElementById('main');
    document.getElementById('result').innerHTML = result;
    const p = document.createElement('p');
    let name_ = result.foods[0].description;

    let str = name_;
    let total_weight = 0;
    let scale=0;
    /*
    Protein
    fat
    Carbohydrate
    Fiber
    Sugars
     */
    let content = {Protein:0,Fat:0,Carbon:0,Fiber:0,Sugar:0,Water:0,VitaminsMinerals:0};//[gr]
    //Run on all nutrients
    result.foods[0].foodNutrients.forEach(nutrient=>{
        if(nutrient.value>0)
        {
            str += ` ${nutrient.nutrientName}=${nutrient.value}[${nutrient.unitName}]`;

            scale=0;
            if (nutrient.unitName == 'G') scale = 1;
            if (nutrient.unitName == 'MG') scale = 0.001;
            if (nutrient.unitName == 'UG') scale = 1 / 1000000;
            total_weight+= parseFloat(nutrient.value)*scale;
            //Collect the gram by basic nutrition components:
            content.Protein += nutrient.nutrientName.search('Protein')!=-1?parseFloat(nutrient.value):0;
            content.Fat += (nutrient.nutrientName.search('fat')!=-1)?parseFloat(nutrient.value):0;
            content.Carbon += (nutrient.nutrientName.search('Carbohydrate')!=-1)?parseFloat(nutrient.value):0;
            content.Fiber += (nutrient.nutrientName.search('Fiber')!=-1)?parseFloat(nutrient.value):0;
            content.Sugar += (nutrient.nutrientName.search('Sugars')!=-1)?parseFloat(nutrient.value):0;
        }
    });
    p.innerText = str + `Water=${(100-total_weight).toFixed(0)}[gr], TotalWeight:${total_weight.toFixed(1)}[gram]`;

    content.Water = (100-total_weight);
    //value/100[gr]*100[%]=1
    content.VitaminsMinerals = total_weight - (content.Protein + content.Fat +
        content.Carbon + content.Fiber + content.Sugar);
    const p1 = document.createElement('p');

    //Returns keys Object.keys(person);
    //Returns values Object.values(person);
    let Nutrientn = Object.keys(content);
    let Nutrientv = Object.values(content);

    Nutrientn.forEach(function(el,index){
        if(Nutrientv[index]>0) {
        p1.innerHTML += `${el} ${(Nutrientv[index]).toFixed(0)}%<br>`;
    }
    });

    main_div.appendChild(p);
    main_div.appendChild(p1);
    /*
    p1.innerHTML =
`Protein ${(content.Protein).toFixed(0)}%
Fat ${(content.Fat).toFixed(0)}%
Carbon ${(content.Carbon).toFixed(0)}%
Fiber ${(content.Fiber).toFixed(0)}%
Sugar ${(content.Sugar).toFixed(0)}%
Water ${(content.Water).toFixed(0)}%
Vitamins ${(content.VitaminsMinerals).toFixed(0)}%
`;
*/
}


//Create meal preview
//100% is the amount of the whole meal, the amount of nutient famalies is the relative in [%]
/*
function MealPreview(MealArr)
{
    let stm=1;
    /*Meal arr[0]={
    FoodName: FoodName,
    Food amount: 5 [gr]
    Calories:
    Carbs:
    Fat:
    Protein
    vitamins&minerals:
    Water

}
 */






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
    //x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //x.setRequestHeader("x-rapidapi-host", "nutritionix-api.p.rapidapi.com");
    //x.setRequestHeader("x-rapidapi-key", "5477ac9d35msh43acf850db9a5f0p12aa01jsn4821878eda80");
    x.send(options.data);
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

//index for kind of nutrients
    /*
    let nutrients = results.food[0].foodNutrients[0].value;
    let nutrient_name = results.food[0].foodNutrients[0].nutrientName;
    let nutrient_unit_name = results.food[0].foodNutrients[0].unitName;
    let nutrient_unit_deviation_code = results.food[0].deviationCode;
    */
//result.hits[0].fields.nf_calories
// result.hits[0].fields.nf_serving_size_qty
// result.hits[0].fields.nf_total_fat
// result.hits[0].fields.nf_serving_size_unit
//p.innerText = `${result.hits[0].fields.nf_calories}[kcalories],${result.hits[0].fields.nf_total_fat}[fat]`;
//Nutirtion value for 100 grams
/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
//<script src="/__/firebase/7.23.0/firebase-app.js"></script>
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