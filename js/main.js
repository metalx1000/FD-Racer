var game = new Phaser.Game(360, 640, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update});
var centerx = game.width / 2;
var centery = game.height / 2;
var players = [];
var cars;
var lastLane = 0;
var ispeed = 10;
var lanes = [.1,.4,.65,.9];
var tileSpeed = ispeed * .1; 
var road;
var sprites = [
  "eng",
  "car1",
  "car2",
  "car3",
  "car4",
  "car5",
  "car6",
  "car7",
  "road"
];

function preload() {
  sprites.forEach(function(sprite){
    game.load.image(sprite,'res/'+sprite+'.png');
  });
}

function create() {
  road = game.add.tileSprite(0, 0, game.width, game.height, 'road');
  createPlayer(150);
  game.input.onDown.add(go_fullscreen, this);
  cars = game.add.group();
  cars.enableBody = true;

  //add cars on loop
  game.time.events.add(3000, createCar, this);
}

function update(){
  movePlayers();

  tileSpeed = ispeed * .1;
  if(tileSpeed > 3){titleSpeed = 3}
  road.tilePosition.y += tileSpeed;
}

function movePlayers(){
  players.forEach(function(player){
    if(player.body.x != game.input.x){
      game.physics.arcade.moveToPointer(player, 400);
    }
    player.body.y = player.posY;
    //stop movement when player reaches cursor 
    if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
    {   
        player.body.velocity.setTo(0, 0);
    }
  })
}

function createPlayer(y){
  var player = game.add.sprite(game.width/2, game.height - y, "eng");
  console.log(player);
  player.posY = game.height - y;
  players.push(player);
  player.anchor.set(0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE); 
  
}

function go_fullscreen(){
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.startFullScreen();
}

function createCar(){
  //time until next car
  var t = Math.floor(Math.random() * 4000) + 1000;
  t = t - ispeed * 10;
  if(t < 200){t=200}; 
  game.time.events.add(t, createCar, this);
  ispeed += 5;
  var n = Math.floor(Math.random() * 7) + 1;
  var l = Math.floor(Math.random() * 4);
  if( lastLane != l ){
    lastLane = l;
    var car = cars.create(game.width * lanes[l], -100, "car" + n);
    car.anchor.setTo(.5,.5);
    if(l < 2){
      car.angle = 180;
      var speed = 150 + ispeed;
    }else{
      var speed = 50 + ispeed;
    }
    car.body.velocity.y = Math.floor(Math.random() * 30) + speed;
  }
}
