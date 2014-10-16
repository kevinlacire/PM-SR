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
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('playerPosition', function(datas) {
        /*socket.set('playerID', pseudo);
        socket.broadcast.emit('nouveau_client', pseudo);*/
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.get('pseudo', function (error, pseudo) {
            socket.broadcast.emit('message', {pseudo: pseudo, message: message});
        });
    });
});

function generateRandomPosition(size){
    return {x:Math.floor(Math.random() * size.x), y:Math.floor(Math.random() * size.y)};
}

function initPlayerPosition(padding, ){
    return {x:padding.x, y:padding.y};
}

server.listen(8080);
