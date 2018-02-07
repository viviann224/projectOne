// Initialize Firebase

var config = {
apiKey: "AIzaSyDzH6GmH4AivIfB6ukE5sxHQ6vSPFOlfVQ",
authDomain: "project-one-80dc8.firebaseapp.com",
databaseURL: "https://project-one-80dc8.firebaseio.com",
projectId: "project-one-80dc8",
storageBucket: "",
messagingSenderId: "195526743097"
};
firebase.initializeApp(config);

var database = firebase.database();


// conversion table logic
function convert (a, b, c) {
  console.log(a, b, c)
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  var builtString = "https://neutrinoapi.com/convert?from-value="+a+"&from-type="+b+"&to-type="+c+"&userId=PMMIV&apiKey=lxAaqP7fkM6ZjKHg0fnvmkF192s1vmihtuGtY381Ls6xHsNs";
  console.log(builtString);
  $.get(proxyUrl + builtString, function(response) {
    console.log(response);
    var noOutput = response.result
    $('.results').text(a + " " + b + " = " + noOutput + " " + c);
  }).fail(function(error){
    console.log(error);
    $('.results').text("I'm sorry. We may have exceeded our conversion limit today.");
  })
};

$('.convertSub').click(function(event) {
  event.preventDefault();
  var noInput = $('#noInput').val();
  var typeInput = $('#typeInput').val();
  var typeOutput = $('#typeOutput').val();
  convert(noInput, typeInput, typeOutput);
});
// List of diet/allergy
// --------------------
// 396^Dairy-Free
// 393^Gluten-Free
// 394^Peanut-Free
// 400^Soy-Free
// 397^Egg-Free
// 401^Sulfite-Free
// 395^Tree Nut-Free
// 390^Pescetarian
// 386^Vegan
// 403^Paleo
// 387^Lacto-ovo vegetarian


//creates an array of recipe id's that matches with the user input
var recipeArray = [];
// create initial array for titles of recipes
var titleArray = [];
// create initial array for image_urls
var imageArray = [];

var ingredArray = [];

var restrictArray = [];

var imgStr;
// create a varaible to store the amount of recipes returned from api
var count = 0;

var restrictString = "&allowedAllergy[]=";

var dietString = "&allowedDiet[]=";

var allergyRequest = "";

var dietRequest = "";


// when a check button is clicked and it has the allergy class, add to allergyRequest.
$(".foodOptions").on("click", ".allergy", function(){
  var restrict = $(this).val().trim();
  allergyRequest += (restrictString + restrict);
  console.log("allergy", allergyRequest);

});

// when a check button is clicked and it has the diet class, add to dietRequest.
$(".foodOptions").on("click", ".diet", function(){
  var restrict = $(this).val().trim();
  dietRequest += (dietString + restrict);
  console.log("diet", dietRequest);
});


// call function when submit button is pressed
$("#inputBtn").on("click", function(event){
  // prevent page refresh when submit is pressed
  event.preventDefault();  
  // create initial array for recipe_ids
  recipeArray = [];
  // create initial array for titles of recipes
  titleArray = [];
  // create initial array for image_urls
  imageArray = [];

  ingredArray =[];

  imgStr;
  // create a varaible to store the amount of recipes returned from api
  count = 0;


  $(".outputArea").empty();

//  // grab user's input value and store in new variable
  var userInput = $("#foodSearch").val().trim();
  console.log(userInput);

  // website url for ajax to pull from
  var myURL="http://api.yummly.com/v1/api/recipes?_app_id=87e47442&_app_key=11e4aadcc3dddb10fa26ae2968e1ce03&q=" + userInput + allergyRequest + dietRequest;

  console.log(myURL);

   //calling the ajax class to pass the url, and the
   //GET method to return the myObj object
  $.ajax({
     url:myURL,
     method:"GET"
  //once myObj object returns, pass in myObj to the next function
  }).then(function(myObj){

    var newObj = myObj.matches;
    console.log(newObj);


    // set the count value to the count property in the object
    count = newObj.length;

    // initiate a for loop to store recipe_id property and image_url property into their arrays
    for (var i = 0; i < count; i++) {
      recipeArray.push(newObj[i].id);
      imageArray.push(newObj[i].imageUrlsBySize[90]);
      ingredArray.push(newObj[i].ingredients);
      titleArray.push(newObj[i].recipeName);
    }
    console.log(ingredArray);

    // create a for-loop to pull, resize, and reassign photos in the image array
    for (var j = 0; j < imageArray.length; j++){
      imgStr = imageArray[j];
      //part of the image src that specifies the size of the image
      imgStr = imgStr.replace("s90", "s500");
      imageArray.splice(j, 1, imgStr)
    }

    console.log(imageArray);

    // initiate another for loop to display image properties
    for (var i = 0; i < imageArray.length; i++) {
      // var newContainer = $("<div class='container'");
      var newCard = $("<div class='card' style='width: 18rem;'>");
      var newImage = $("<img class='card-img-top'>");
      var cardBody = $("<div class='card-body'>");
      var cardTitle = $("<h5 class='card-title'>");

      // newCard.attr("style", "width: 18rem");
      cardTitle.text(titleArray[i]);
      newImage.attr("src", imageArray[i]);
      
      cardBody.append(cardTitle);
      
      newCard.append(newImage);
      
      newCard.append(cardBody);
      // newContainer.append(newCard);
      $(".outputArea").append(newCard);
    }
  });
});