var app         = require('express')(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    fs          = require('fs'),
	Candy	    = require('./class/Candy'),
	Player	    = require('./class/Player'),
    Map         = require('./class/Map'),
    countdown   = null,
    waitingTime = 10000,    //10s wait until starting 3 2 1 timer
    readySteady = 3000,     //3s wait until starting the game
    acceptPlayer= true,
    globalMap   = new Map(),
    acceptMove  = false,
    nbCandies   = globalMap.nbCandies,
    nbMinPlayers= 2,
    nbMaxPlayers= 4;

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
app.get('/class/GMap.js', function (req, res) {
    res.sendfile(__dirname + '/class/GMap.js');
});
app.get('/class/GCandy.js', function (req, res) {
    res.sendfile(__dirname + '/class/GCandy.js');
});
app.get('/class/GPlayer.js', function (req, res) {
    res.sendfile(__dirname + '/class/GPlayer.js');
});

io.sockets.on('connection', function (socket) {
    var playerCreated = false;
    if (globalMap.candies.length === 0) {
        for(var i=0 ; i<globalMap.nbCandies ; i++){
            generateRandomCandy(new Candy(), globalMap);
        }
    }
    if ((globalMap.players.length < nbMaxPlayers) && acceptPlayer) {
        socket.emit('sendYourName', "");
    } else {
        socket.emit('gameFull', "");
        acceptPlayer = false;
    }
    socket.emit('gameConfiguration', globalMap);
    if (!playerCreated) {
        socket.on('playerName', function (datas) {
            playerCreated = true;
            globalMap.newPlayer(new Player(), datas, globalMap.players.length);
            io.sockets.emit('newPlayer', globalMap.players[globalMap.players.length-1]);
            if (globalMap.players.length >= nbMinPlayers) {
                //We [re]initialize the timeout if a new player send is name
                clearTimeout(countdown);
                //Everybody wait 10s if a new player want to play
                io.sockets.emit('tenSecondsCountdown', "");
                countdown = setTimeout(function () {
                    //if 10s seconds past, we stop accepting players
                    acceptPlayer = false;
                    //Server sends to everybody the candies positions
                    io.sockets.emit('candiesPositions', globalMap.candies);
                    //Server sends ready steady go countdown
                    io.sockets.emit('readySteadyGo', "");
                    setTimeout(function () {
                        //Server accept players moves when the countdown is over
                        acceptMove = true;
                    }, readySteady);
                }, waitingTime);
            } else if (globalMap.players.length === nbMaxPlayers) {
                //Server sends to everybody the candies positions
                io.sockets.emit('candiesPositions', globalMap.candies);
                //Server sends ready steady go countdown
                io.sockets.emit('readySteadyGo', "");
                setTimeout(function () {
                    //Server accept players moves when the countdown is over
                    acceptMove = true;
                }, readySteady);
            }
        });
    }

    //On player move, broadcast its new position
    socket.on('playerMove', function(datas) {
        if(acceptMove){
            socket.broadcast.emit('playerMove', datas);
            //We check if the candy was available and if the player is on eating of them
            var candy = globalMap.checkIfPlayerOverCandy(datas.id);
            if(candy){
                nbCandies--;
                if(nbCandies === 0){
                    io.sockets.emit('gameOver', globalMap.players);
                    //Reset players & candies arrays
                    globalMap.players.length = 0; globalMap.candies.length = 0;
                }
                //Send to clients to remove the candy from the gaming area
                io.sockets.emit('candyCatched', candy);
                socket.emit('addPoint', datas);
                io.sockets.emit('playersPoints', globalMap.players);
            }
        }
    });

    socket.on('replay', function(datas) {
        //Retrieve player's name
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
