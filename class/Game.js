/*
* GameClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

var Map = require('./Map');

module.exports = function Game(){
	
	this.map 						= null;
	this.nbRemainingCandies 		= null;	
    this.countdown   				= null;
    this.countdownPlayersTime 		= 5000;    	// in ms
    this.countdownGameStartTime 	= 3000;     // in ms
    this.acceptPlayers				= null;
    this.acceptPlayersMovements 	= null;
    this.nbMinPlayers				= 1;
    this.nbMaxPlayers				= 4;
    this.clients					= null;

	this.initGame = function(){
		this.map = new Map();
		this.map.generateRandomCandies();
		this.acceptPlayers 				= true;
		this.acceptPlayersMovements 	= false;
		this.nbRemainingCandies			= this.map.nbCandies;
		this.clients					= new Array();
	}

	this.isNotFullOfPLayers = function(){
		return (this.map.players.length < this.nbMaxPlayers) && this.acceptPlayers;
	}

	this.isFullOfPLayers = function(){
		return (this.map.players.length == this.nbMaxPlayers) || !this.acceptPlayers;
	}

	this.isInit = function(){
		return this.map != null;
	}

	this.resetGame = function(){
		this.map 					= null;
		this.acceptPlayers 			= null;
		this.acceptPlayersMovements = null;
		this.nbRemainingCandies 	= null;
		this.clients 				= null;
	}

	this.addNewPlayer = function(player, socket){
		this.clients[this.map.nbPlayers()] = socket;
		return this.map.addNewPlayer(player);
	}

	this.isEnoughtPlayersToStart = function(){
		return (this.nbMinPlayers <= this.map.nbPlayers() && this.map.nbPlayers() <= this.nbMaxPlayers)
	}

	this.resetCountDown = function(){
		if(this.countdown != null){
            clearTimeout(this.countdown);
        }
	}

	this.getCountdownPlayersTime = function(){
		return this.countdownPlayersTime / 1000;
	}

	this.getCountdownGameStartTime = function(){
		return this.countdownGameStartTime / 1000;
	}

	this.movePlayer = function(player){
		this.map.movePlayer(player);
	}

	this.getMap = function(){
		return this.map;
	}

	this.getCandies = function(){
		return this.map.getCandies();
	}

	this.getPlayer = function(playerId){
		return this.map.getPlayer(playerId);
	}

}