var dog,sadDog,happyDog;
var feed;
var foodObj;
var database;
var foodS;
var lastFed;

function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000,400);
  
  database = firebase.database();
  foodObj = new Food();
  foodStock = database.ref('food')
  foodStock.on("value",readStock)
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  database.ref("feedTime").on("value",function(data){
    lastFed = data.val();
  })
  fill(255,255,254)
  textSize(15);
  if(lastFed>=12){
    text("last Feed : "+lastFed%12 + "PM",270,50);
  }else if(lastFed==100){
    text("Last Feed : 12 AM",270,50);
  }else{
    text("Last Feed : "+lastFed+"AM",270,50);
  }
  foodObj.display();
  drawSprites();
}

//function to read food Stock
function feedDog(){
  dog.addImage(happyDog);
   foodObj.deductFood();
  if(foodObj.getFoodStoock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  database.ref("/").update({
    food:foodS,
    feedTime:hour()
  })
}

//function to update food stock and last fed time
function readStock(data){
 foodS = data.val()
 foodObj.updateFoodStock(foodS) 

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}