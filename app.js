var app         = require('express')(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    fs          = require('fs'),
	Candy	    = require('./class/Candy'),
	Player	    = require('./class/Player'),
    Map         = require('./class/Map'),
    countdown   = null,
    waitingTime = 10000, //10s wait until starting 3 2 1 timer
    readySteady = 3000, //3s wait until starting the game
    acceptPlayer= true,
    constraints	= new Map(),
    candies  	= [],
	nbCandies	= constraints.nbCandy,
    players		= [],
    acceptMove  = false,
    nbMinPlayers= 2,
    nbMaxPlayers= 4;

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/jquery-2.1.1.min.js', function (req, res) {
  res.sendfile(__dirname + '/jquery-2.1.1.min.js');
});
app.get('/class/Candy.js', function (req, res) {
  res.sendfile(__dirname + '/class/Candy.js');
});
app.get('/class/Player.js', function (req, res) {
  res.sendfile(__dirname + '/class/Player.js');
});
app.get('/class/Game.js', function (req, res) {
  res.sendfile(__dirname + '/class/Game.js');
});
app.get('/class/Map.js', function (req, res) {
  res.sendfile(__dirname + '/class/Map.js');
});

io.sockets.on('connection', function (socket, id) {
    if(candies === []){
    	generateRandomCandiesPositions(gameAreaSizes);
    }
	if(players.length < nbMaxPlayers && acceptPlayer){
        socket.emit('sendYourName', "");
	} else {
		socket.emit('gameFull', "");
        acceptPlayer = false;
	}
    socket.on('playerName', function(datas) {
        var p = new Player();
		initPlayer(p, constraints, datas);
		players.push(p);
        socket.broadcast.emit('newPlayer', JSON.stringify(players.last));
        if(players.length >= nbMinPlayers){
            //We [re]initialize the timeout if a new player send is name
            clearTimeout(countdown);
            //Everybody wait 10s if a new player want to play
            io.sockets.emit('tenSecondsCountdown', "");
            countdown = setTimeout(function(){
                //if 10s seconds past, we stop accepting players
                acceptPlayer = false;
                //Server sends to everybody the candies positions
                io.sockets.emit('candiesPositions', JSON.stringify(candies));
                //Server sends ready steady go countdown
                io.sockets.emit('readySteadyGo', "");
                setTimeout(function(){
                    //Server accept players moves when the countdown is over
                    acceptMove = true;
                }, readySteady);
            }, waitingTime);
        } else if(players.length === nbMaxPlayers){
            //Server sends to everybody the candies positions
            io.sockets.emit('candiesPositions', JSON.stringify(candies));
            //Server sends ready steady go countdown
            io.sockets.emit('readySteadyGo', "");
            setTimeout(function(){
                //Server accept players moves when the countdown is over
                acceptMove = true;
            }, readySteady);
        }
    });

    //On player move, broadcast its new position
    socket.on('playerMove', function(datas) {
        if(acceptMove){
            socket.broadcast.emit('playerMove', datas);
            //We check if the candy was available and if the player is on eating of them
            var candy = checkIfACandyIsCollected(datas, candies);
            if(candy){
                nbCandies--;
                if(nbCandies === 0){
                    io.sockets.emit('gameOver', JSON.stringify(players));
                }
                //Send to clients to remove the candy from the gaming area
                io.sockets.emit('candyCatched', JSON.stringify(candy));
                socket.emit('addPoint', JSON.stringify(datas));
                io.sockets.emit('playersPoints', JSON.stringify(players));
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
function generateRandomCandiesPositions(nb, size){
	for(var i=0 ; i<size ; i++){
		var findGoodCoords = false;
		var candy = new Candy();
		while(!findGoodCoords){
			candy.xCoord = Math.floor(Math.random() * (size.x + 1));
			candy.yCoord = Math.floor(Math.random() * (size.y + 1));
			findGoodCoords = true;
			for(var j=0 ; j<candies.length ; j++){
				if(candy.checkIfOverCandy(candies[j])){
					findGoodCoords = false;
					break;
				}
			}
		}
		candy.id 	= i;
		candy.state = true;
		candies.push(candy);
	}
}

/**
 * Method to initialize players' positions depending of the gaming's area size
 * First player's position : left top corner
 * Second player's position : right bottom corner
 * Third player's position : left bottom corner
 * Fourth player's poistion : right top corner
 * Other player's position : random in the gaming area
 */
function initPlayerPosition(size, padding, nbPlayers){
    if(nbPlayers === 1){
        return {x:padding.x, y:padding.y};
    } else if(nbPlayers === 2){
        return {x:size.x-padding.x, y:size.y-padding.y};
    } else if(nbPlayers === 3){
        return {x:padding.x, y:size.y-padding.y};
    } else if(nbPlayers === 4){
        return {x:size.x-padding.x, y:padding.y};
    } else {
        return {x:Math.floor(Math.random() * size.x), y:Math.floor(Math.random() * size.y)};
    }
}

/**
 * Method that check if the player is eating a candy
 * player	Player	The player who moved
 * candies	Candy[]	The array of candies to check
 */
function checkIfACandyIsCollected(player, candies){
    for(candy in candies){
        //check if the player is in one of the candies, return the candy if true, else return false
		if(candy.xCoord == player.x && candy.yCoord == player.y && candy.state){
			candy.state = false;
			player.points++;
			return candy;
		}
    }
	return false;
}

/**
 * Method to set the color of a player
 */
function initPlayer(player, constraints, name){
	if(players.length == 1){
		player.color 	= "red";
		player.xCoord 	= constraints.squareWidth;
		player.yCoord	= constraints.squareHeight;
		player.direction= "left";
	} else if(players.length == 2){
		player.color 	= "green";
		player.yCoord	= constraints.squareHeight;
		player.direction= "up";
	} else if(players.length == 3){
		player.color 	= "yellow";
		player.xCoord 	= constraints.squareWidth;
		player.direction= "down";
	} else {
		player.color 	= "white";
	}
    p.name = name;
}

function startReadySteadyGo(socket){
    socket.broadcast.emit("");
}

function startGame(){

}

server.listen(8080);
