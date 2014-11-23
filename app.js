var app         = require('express')(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server, { log: false }),
    fs          = require('fs'),
	Player	    = require('./class/Player'),
    Map         = require('./class/Map'),
    Game        = require('./class/Game');

var game        = new Game(),
    clients     = new Array();

// Routes leading to different resources required client side
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/jquery-2.1.1.min.js', function (req, res) {
  res.sendfile(__dirname + '/jquery-2.1.1.min.js');
});
app.get('/css/style.css', function (req, res) {
  res.sendfile(__dirname + '/css/style.css');
});
app.get('/class/Render.js', function (req, res) {
    res.sendfile(__dirname + '/class/Render.js');
});
app.get('/test', function (req, res) {
    res.sendfile(__dirname + '/test.html');
});
app.get('/zomby.html', function (req, res) {
    res.sendfile(__dirname + '/zomby.html');
});


io.sockets.on('connection', function (socket) {

    // If it's the first player, init the game
    if(!game.isInit()){
        console.info("PASS");
        game.initGame();
    }

    // If game is not full ask client's name
    if (game.isNotFullOfPlayers()) {
        socket.emit('sendYourName', '');
    } else {
        socket.emit('gameFull', '');
    }

    // Sending map for drawing
    socket.emit('gameConfiguration', game.getMap());

    // Waiting for player name
    socket.on('playerName', function (playerName) {

        // If it's the first player, init the game
        if(!game.isInit()){
            game.initGame();
        }

        if(game.playerAlreadyInGame(socket)){
            return;
        }

        // If game not started and game not full
        if (game.isNotFullOfPlayers()) {

            // Creating the player and sendind info to others players
            var player = new Player();
            player.name = playerName;
            player = game.addNewPlayer(player, socket);

            socket.emit('aboutMe', player);
            socket.broadcast.emit('newPlayer', player);
        
            // If enough players to start game
            if (game.isEnoughtPlayersToStart()) {

                // Reset countdown if already started
                game.resetCountDown();

                var callback = function () {                    
                    // End of countdown then stop accepting players
                    game.stopAcceptingPlayers();         
                    // Server sends to everybody the candies positions
                    io.sockets.emit('candiesPositions', game.getCandies());                    
                    // Server sends ready steady go countdown
                    console.log("startCountdownGameStartTime");
                    io.sockets.emit('startCountdownGameStartTime', game.getCountdownGameStartTime());    
                    setTimeout(function () {                        
                        // End of readySteadyGo countdown then server accept players movements
                        game.startAcceptingPlayersMovements();
                    }, game.countdownGameStartTime);
                };

                // If full of players else waiting for others
                if(game.isFullOfPlayers()){
                    callback();
                }else{
                    // Starting coutdown for game beginning and sending info to all players
                    console.log("startCountdownPlayersTime");
                    io.sockets.emit('startCountdownPlayersTime', game.getCountdownPlayersTime());
                    game.countdown = setTimeout(callback, game.countdownPlayersTime);
                }
            }

        }

    });
    

    //On player move, broadcast its new position
    socket.on('playerMove', function(player) {
        if(game.acceptPlayersMovements){
            game.movePlayer(player);
            io.sockets.emit('playerMove', game.getPlayer(player.id));
            //We check if the candy was available and if the player is on eating of them
            var candy = game.map.checkIfPlayerOverCandy(player.id);
            if(candy){
                game.decrementCandies();
                //Send to clients to remove the candy from the gaming area
                io.sockets.emit('candyCaught', candy);
                io.sockets.emit('playersPoints', game.map.players);
                // Check if there are remaining candies
                if(game.nbRemainingCandies == 0){
                    io.sockets.emit('gameOver', game.map.players);
                    //Reset players & candies arrays
                    for(var i=0;i<game.map.players.length;i++){
                        io.sockets.emit('deletePlayer', game.map.players[i]); 
                    }
                    game.resetGame();
                    game.initGame();           
                    io.sockets.emit('gameConfiguration', game.getMap());
                }
                
            }
        }

    });

    socket.on('disconnect', function(){
        if(game.isInit()){
            var gameIsEmpty = true;
            for(var i=0;i<game.map.players.length;i++){
                if(game.clients[i] == socket){
                   io.sockets.emit('deletePlayer', game.map.players[i]); 
                   game.map.players[i] = null;
                   game.clients[i] = null;
                }
                if(game.map.players[i] != null){
                    gameIsEmpty = false;
                }
            }
            if(gameIsEmpty){
                game.resetGame();
            }
        }
    });

});

server.listen(8080);
