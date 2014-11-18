var app         = require('express')(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    fs          = require('fs'),
	Candy	    = require('./class/Candy'),
	Player	    = require('./class/Player'),
    Map         = require('./class/Map'),
    countdown   = null,
    waitingTime = 5000,    //10s wait until starting 3 2 1 timer
    readySteady = 3000,     //3s wait until starting the game
    acceptPlayer= true,
    globalMap   = new Map(),
    acceptMove  = false;
    nbCandies   = globalMap.nbCandies,
    nbMinPlayers= 1,
    nbMaxPlayers= 4;
    clients     = new Array();

// Chargement de la page index.html
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

    var playerCreated = false;

    // If it's the first player creating candies
    if (globalMap.candies.length === 0) {
        for(var i=0 ; i<globalMap.nbCandies ; i++){
            generateRandomCandy(new Candy(), globalMap);
        }
    }

    // If game not started and game not full
    if ((globalMap.players.length < nbMaxPlayers) && acceptPlayer) {
        socket.emit('sendYourName', '');
    } else {
        socket.emit('gameFull', '');
    }

    // Sending map for drawing
    socket.emit('gameConfiguration', globalMap);

    // Waiting for player name
    socket.on('playerName', function (datas) {

        // If game not started and game not full
        if ((globalMap.players.length < nbMaxPlayers) && acceptPlayer) {

            // Creating the player and sendind info to others players
            globalMap.newPlayer(new Player(), datas, globalMap.players.length);
            clients[globalMap.players.length-1] = socket;
            socket.emit('aboutMe', globalMap.players[globalMap.players.length-1]);
            socket.broadcast.emit('newPlayer', globalMap.players[globalMap.players.length-1]);
        
            // If enough players to start game
            if (nbMinPlayers <= globalMap.players.length && globalMap.players.length <= nbMaxPlayers) {

                // Reset countdown if already started
                if(countdown != null){
                    clearTimeout(countdown);
                }
                // Starting coutdown for game beginning and sending info to all players
                console.log("Starting 10 seconds countdown");
                io.sockets.emit('tenSecondsCountdown', (waitingTime/1000));
                countdown = setTimeout(function () {                    
                    // End of countdown then stop accepting players
                    acceptPlayer = false;                   
                    // Server sends to everybody the candies positions
                    io.sockets.emit('candiesPositions', globalMap.candies);                    
                    // Server sends ready steady go countdown
                    console.log("Starting go countdown");
                    io.sockets.emit('readySteadyGo', (readySteady/1000));    
                    setTimeout(function () {                        
                        // End of readySteadyGo countdown then server accept players movements
                        acceptMove = true;
                    }, readySteady);
                }, waitingTime);
            }

        }

    });
    

    //On player move, broadcast its new position
    socket.on('playerMove', function(datas) {
        
        if(acceptMove){
            globalMap.players[datas.id].move(datas.direction, globalMap);
            //console.info(datas.id, datas);
            io.sockets.emit('playerMove', globalMap.players[datas.id]);
            //We check if the candy was available and if the player is on eating of them
            var candy = globalMap.checkIfPlayerOverCandy(datas.id);
            if(candy){
                nbCandies--;
                if(nbCandies == 0){
                    io.sockets.emit('gameOver', globalMap.players);
                    //Reset players & candies arrays
                    for(var i=0;i<globalMap.players.length;i++){
                        io.sockets.emit('deletePlayer', globalMap.players[i]); 
                    }
                    globalMap.players = new Array();
                    clients           = new Array();
                    globalMap.candies = new Array();
                    for(var i=0 ; i<globalMap.nbCandies ; i++){
                        generateRandomCandy(new Candy(), globalMap);
                    }                    
                    acceptMove = false;
                    acceptPlayer = true;
                }
                //Send to clients to remove the candy from the gaming area
                io.sockets.emit('candyCaught', candy);
                io.sockets.emit('playersPoints', globalMap.players);
            }
        }

    });

    socket.on('replay', function(datas) {
        //Retrieve player's name
    });

    socket.on('disconnect', function(){
        var gameIsEmpty = true;
        for(var i=0;i<globalMap.players.length;i++){
            if(clients[i] == socket){
               io.sockets.emit('deletePlayer', globalMap.players[i]); 
               globalMap.players[i] = null;
               clients[i] = null;
               break;
            }
            if(globalMap.players[i] != null){
                gameIsEmpty = false;
            }
        }
        if(gameIsEmpty){
            //Reset players & candies arrays
            globalMap.players = new Array();
            clients           = new Array();
            globalMap.candies = new Array();
            for(var i=0 ; i<globalMap.nbCandies ; i++){
                generateRandomCandy(new Candy(), globalMap);
            }                    
            acceptMove = false;
            acceptPlayer = true;
        }
    });

});

/**
 * Method to generate candies object depending of the gaming's area size
 */
function generateRandomCandy(candy, map){
    if(map.nbCandies>((map.squareHeight+1)*(map.squareWidth+1))){
        map.nbCandies = (map.squareHeight+1)*(map.squareWidth+1);
    }
    var findGoodCoords = false;
    while (!findGoodCoords) {
        candy.xCoord = Math.floor(Math.random() * (map.squareWidth + 1));
        candy.yCoord = Math.floor(Math.random() * (map.squareHeight + 1));
        findGoodCoords = true;
        for (var j = 0; j < map.candies.length; j++) {
            if (candy.checkIfOverCandy(map.candies[j])) {
                findGoodCoords = false;
                break;
            }
        }
    }
    candy.id = map.candies.length;
    map.candies.push(candy);
}

server.listen(8080);
