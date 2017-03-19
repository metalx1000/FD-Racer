var game = new Phaser.Game(360, 640, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update});
var centerx = game.width / 2;
var centery = game.height / 2;
var players;
var gameOver = false,go;
var cars, carTimer, carE = false, music;
var lastLane = 0;
var ispeed = 10;
var lanes = [.1,.4,.65,.9];
var tileSpeed = ispeed * .1; 
var road, score = 0, text;
var sprites = [
  "eng",
  "car1",
  "car2",
  "car3",
  "car4",
  "car5",
  "car6",
  "car7",
  "road",
  "gameOver"
];

function preload() {
  //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; 
  //Music by Simon Wessel https://youtu.be/9qU9ieI2bbM
  game.load.audio('music', [ 'sounds/music.wav', 'sounds/music.ogg', 'sounds/music.mp3']);
  //Car Crash sound by Cam Martinez http://soundbible.com/1757-Car-Brake-Crash.html
  game.load.audio('crash', [ 'sounds/crash.ogg', 'sounds/crash.mp3']);

  sprites.forEach(function(sprite){
    game.load.image(sprite,'res/'+sprite+'.png');
  });
}

function create() {
  score = 0;
  music = game.add.audio('music');
  music.play();
  music.loop = true;
  road = game.add.tileSprite(0, 0, game.width, game.height, 'road');
  players = game.add.group(); 
  players.enableBody = true;
  createPlayer(150);
  game.input.onDown.add(go_fullscreen, this);
  cars = game.add.group();
  cars.enableBody = true;

  //text for score
    var style = { font: "bold 32px Arial",
      fill: "#fff",
      boundsAlignH: "left", 
      boundsAlignV: "top" 
    };

    //  The Text is positioned at 0, 100
    text = game.add.text(0, 0, "0", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
    text.setTextBounds(0, 0, 800, 100);

  dispatch();
  //add cars if not already exist
  if(!carE){createCar()};
}

function update(){
  if(gameOver != true){
    score += 1;
    text.text = "SCORE: " + score;
  }
  //if player and enemy collide kill player
  game.physics.arcade.overlap(players, cars, hitPlayer, null, this);

  movePlayers();
  moveTile();
}

function moveTile(){
  if(gameOver != true){
    tileSpeed = ispeed * .1;
    if(tileSpeed > .2){titleSpeed = .2}
    road.tilePosition.y += tileSpeed;
  }
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
  var player = players.create(game.width/2, game.height - y, "eng");
  player.posY = game.height - y;
  player.anchor.set(0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE); 
  
}

function go_fullscreen(){
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.startFullScreen();
}

function createCar(){
  carE = true;
  //time until next car
  var t = Math.floor(Math.random() * 4000) + 1000;
  t = t - ispeed * 10;
  if(t < 500){t=500}; 
  carTimer = game.time.events.add(t, createCar, this);
  ispeed += 5;
  var n = Math.floor(Math.random() * 7) + 1;
  var l = Math.floor(Math.random() * 4);
  if( lastLane != l ){
    lastLane = l;
    var car = cars.create(game.width * lanes[l] + Math.floor(Math.random()* 20) -20, -100, "car" + n);
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

function hitPlayer(){
  if(!gameOver){
    var crash = game.add.audio('crash');
    crash.play();
    carTimer.timer.clearPendingEvents();
    go = game.add.sprite(game.width/2, game.height/2, 'gameOver');
    go.anchor.setTo(.5,.5);
    gameOver = true;
    music.stop();
    game.physics.arcade.isPaused = true;
    setTimeout(function(){reset()},3000)
  };
}

function reset(){ 
  //reset
  game.physics.arcade.isPaused = false;
  gameOver = false;
  go.destroy;
  ispeed = 10; 
  players.destroy(true,false);
  cars.destroy(true,false);
  create();
}

//dispatch
function dispatch(){
  var eng = random(20,24);
  var addnum = random(100,999);
  var street = ["pine","maple","palm","elm"];
  street = street[Math.floor(Math.random() * street.length)];
  var streetType = ["road","street","lane","circle","way"];
  streetType = streetType[Math.floor(Math.random()*streetType.length)];
  if ('speechSynthesis' in window) {
    var msg = new SpeechSynthesisUtterance('Engine ' + eng + " structure fire. " + addnum + " " + street + " " + streetType);
    msg.volume = .5;
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  }
}

function random(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
