var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update});
var centerx = game.width / 2;
var centery = game.height / 2;
var players = [];
var sprites = [
  "eng",
  "car1",
  "car2",
  "car3",
  "car4",
  "car5",
  "car6",
  "car7"
];

function preload() {
  sprites.forEach(function(sprite){
    game.load.image(sprite,'res/'+sprite+'.png');
  });
}

function create() {
  createPlayer(150);
}

function update(){
  movePlayers();
}

function movePlayers(){
  players.forEach(function(player){
    if(player.body.x != game.input.x){
      game.physics.arcade.moveToPointer(player, 400);
    }
    player.body.y = player.posY;
    //stop movement when player reaches cursor 
    /*
    if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
    {   
        player.body.velocity.setTo(0, 0);
    }
    */
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
