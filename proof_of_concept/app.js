var express = require('express'); 
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Player = require("./Player").Player;
var path = require('path');

var players = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/style', express.static(path.join(__dirname, 'public/style')));


io.on('connection', function(socket){
//Event listeners

  socket.on('chat message', function(msg){
    console.log("message from client", msg);
    io.emit('wazzle', msg + Math.random());
  });

  socket.on('disconnect', onClientDisconnect);

  socket.on("new player", onNewPlayer);  

  socket.on("move player", onMovePlayer);


});

app.set('port', process.env.PORT || 3000);

var port = process.env.PORT || 3000;

server.listen(app.get("port"), function(){
  console.log('listening on port', port);
});

/* Click handler callbacks */

function onClientDisconnect() {

  var removePlayer = playerById(this.id);

  // Player not found
  if (!removePlayer) {
    console.log("Player not found: "+this.id);
    return;
  };

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  this.broadcast.emit("remove player", {id: this.id});
};


function onNewPlayer(data) {
  // Create a new player
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;
  console.log("\n\n**NEW PLAYER ADDED", this.id);
  // Broadcast new player to connected socket clients
  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

  // Send existing players to the new player
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
  };
    
  // Add new player to the players array
  players.push(newPlayer);

  console.log("These are our players", players);
};


function onMovePlayer(data) {
  // Find player in array
  var movePlayer = playerById(this.id);

  // Player not found
  if (!movePlayer) {
    console.log("Player not found: "+this.id);
    return;
  };

  // Update player position
  movePlayer.setX(data.x);
  movePlayer.setY(data.y);

  // Broadcast updated position to connected socket clients
  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};

/** Find player obj by ID **/

function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id == id)
      return players[i];
  };
  
  return false;
};