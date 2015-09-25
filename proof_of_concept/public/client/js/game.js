var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');

var socket = io();

  // socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
var mainState = {
  preload: function () {
    game.stage.backgroundColor = '#666';
    game.load.image('player', 'assets/player.png'); 
    game.load.image('ground', 'assets/ground.png');
    game.stage.disableVisibilityChange = true;
  },
  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player2 = this.game.add.sprite(200, 245, 'player');
        game.physics.arcade.enable(this.player2);
        this.player2.body.gravity.y = 1000; 
        this.player2.body.bounce.y = 0.5;
        this.player2.body.collideWorldBounds = true;
        


    this.player = this.game.add.sprite(100, 245, 'player');
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000; 
    this.player.body.bounce.y = 0.5;
    this.player.body.collideWorldBounds = true;
    
    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    
    this.ground = [];
    for (var i = 0; i < game.world.width; i+=70) {
      this.ground.push(this.platforms.create(i, game.world.height - 70, 'ground'));
    }
    for (var j = 0; j < this.ground.length; j++) {
      this.ground[j].body.immovable = true;
    }
    var that = this;
    socket.on("left button", function(data){
          console.log(data.payload)
          that.player.body.velocity.x = -200;
     });

    socket.on("right button", function(data){
          console.log(data.payload)
          that.player.body.velocity.x = 200;
     });
    
    socket.on("up button", function(data){
          console.log(data.payload)
          that.player.body.velocity.y = -600;
     });

    socket.on("down button", function(data){
          console.log(data.payload)
          that.player.body.velocity.y = -600;
     });
  },
  update: function () {
    for (var i = 0; i < this.ground.length; i++) {
      game.physics.arcade.collide(this.player, this.ground[i]);
      game.physics.arcade.collide(this.player2, this.ground[i]);

    }
    this.player.body.velocity.x = 0;
    this.player2.body.velocity.x = 0;

    var cursors = game.input.keyboard.createCursorKeys();
    if (cursors.left.isDown)
    { 
        socket.emit("left button", {somedata:"some value"});
        this.player.body.velocity.x = -150;
        this.player2.body.velocity.x = -150;

    }
    else if (cursors.right.isDown)
    {
        this.player.body.velocity.x = 150;
        // cursors.up.isDown = false;

    }
    if (cursors.up.isDown && this.player.body.touching.down)
    {
        socket.emit("up button", {somedata:"some value"});

        this.player.body.velocity.y = -600;
    }
  }
};

game.state.add('main', mainState);
game.state.start('main');