var app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    fs      = require('fs'),
    gameAreaSizes   = {x:800, y:800},
    unitsPositions  = [],
    playersPositions= [],
    padding         = {x:10, y:10},
    nbOfPositions   = 10;

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connect', function (socket, id) {
    if(unitsPositions === []){
        for(var i=0 ; i<nbOfPositions ; i++){
            unitsPositions.push(generateRandomPosition(gameAreaSizes));
        }
    }
    socket.broadcast.emit('unitsPositions', JSON.stringify(unitsPositions));

    //On player move, broadcast its new position
    socket.on('playerPosition', function(datas) {
        socket.broadcast.emit('playerPosition', datas);
        var check = checkIfAUnitIsCollected(datas, unitsPositions)
        if(check){
            //Remove the unit from the gaming area
            socket.broadcast.emit('consumeUnit', JSON.stringify(unitsPositions));
        }
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.get('pseudo', function (error, pseudo) {
            socket.broadcast.emit('message', {pseudo: pseudo, message: message});
        });
    });
});

/**
 * Method to generate an coordinates object depending of the gaming's area size
 */
function generateRandomPosition(size){
    return {x:Math.floor(Math.random() * size.x), y:Math.floor(Math.random() * size.y)};
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

function checkIfAUnitIsCollected(player, units){
    for(u in units){
        //check if the player is in one of the units' area, return the unit if true, else return false
    }
}

server.listen(8080);
