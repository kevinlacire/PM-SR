var app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    fs      = require('fs'),
	Candy	= require('./class/Candy'),
	Player	= require('./class/Player'),
	Map		= require('./class/Map'),
	id		= 0,
    constraints	= new Map(),
    candies  	= [],
	nbCandies	= constraints.nbCandy,
    players		= [],
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
app.get('/css/style.css', function (req, res) {
  res.sendfile(__dirname + '/css/style.css');
});

io.sockets.on('connect', function (socket, id) {

    if(candies === []){
    	generateRandomCandiesPositions(gameAreaSizes);
    }
	if(players.length < nbMaxPlayers){
		var p = new Player();
		initPlayer(p, constraints);
		players.push(p);
		socket.emit('playerMove', JSON.stringify(players.last));
		socket.emit('candiesPositions', JSON.stringify(candies));
	} else {
		socket.emit('gameFull', "");
	}

    //On player move, broadcast its new position
    socket.on('playerMove', function(datas) {
        socket.broadcast.emit('playerMove', datas);
        var candy = checkIfACandyIsCollected(datas, candies);
        if(candy){
			nbCandies--;
			if(nbCandies === 0){
				socket.broadcast.emit('gameOver', JSON.stringify(players));
			}
            //Send to client to remove the candy from the gaming area
            socket.broadcast.emit('candyCatched', JSON.stringify(candy));
			socket.emit('addPoint', JSON.stringify(datas));
			socket.broadcast.emit('playersPoints', JSON.stringify(players));
        }
    });

    socket.on('replay', function(datas) {

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
function initPlayer(player, constraints){
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
}

server.listen(8080);
