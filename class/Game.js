/*
* GameClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

var Map = require('./Map');
var fs = require('fs');

module.exports = function Game(){
	
	this.map 						= null;
	this.nbRemainingCandies 		= null;	
    this.countdown   				= null;
    this.countdownPlayersTime 		= 5000;    	// in ms
    this.countdownGameStartTime 	= 3000;     // in ms
    this.countdownRestoreTime   	= 10000;
    this.acceptPlayers				= null;
    this.acceptPlayersMovements 	= null;
    this.nbMinPlayers				= 1;
    this.nbMaxPlayers				= 4;
    this.clients					= null;
    this.saveFilePath				= "saveJSON.json";

    /**
     * Method that initialize mayors variables
     */
	this.initGame = function(){
		this.map = new Map();
		this.map.generateRandomCandies();
		this.acceptPlayers 				= true;
		this.acceptPlayersMovements 	= false;
		this.nbRemainingCandies			= this.map.nbCandies;
		this.clients					= new Array();
		this.deleteJSONBackup();
	}

	this.startAcceptingPlayersMovements = function(){
		this.acceptPlayersMovements = true;
	}

	this.stopAcceptingPlayers = function(){
		this.acceptPlayers = false;          
	}

	this.decrementCandies = function(){
		this.nbRemainingCandies--;
		this.saveJSONBackup();		
	}

    /**
     * Method that check if the number of allowed players is not reached and the game can accept players
     * @returns {boolean}
     */
	this.isNotFullOfPlayers = function(){
		if(!this.isInit()){return false;}
		return (this.map.players.length < this.nbMaxPlayers) && this.acceptPlayers;
	}

    /**
     * Method that check if the number of allowed players is reached
     * @returns {boolean}
     */
	this.isFullOfPlayers = function(){		
		if(!this.isInit()){return false;}
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
		this.deleteJSONBackup();
	}

	this.addNewPlayer = function(player, socket){
		this.clients[this.map.nbPlayers()] = socket;
		return this.map.addNewPlayer(player);
	}

    /**
     * Method that check if there is enough player to start the game
     * @returns {boolean}
     */
	this.isEnoughPlayersToStart = function(){
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

	this.getCountdownRestoreTime = function(){		
		return this.countdownRestoreTime / 1000;
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

    /**
     * Method that check if the player is already in game
     * @param socket    the socket on which the player is connected
     * @returns {boolean}
     */
	this.playerAlreadyInGame = function(socket){
		if(this.clients === null){
			return false;
		}
		for(var i=0;i<this.clients.length;i++){
			if(this.clients[i] == socket){
				return true;
			}
		}
		return false;
	}

	this.toJSONBackup = function(){
		return {
			"nbRemainingCandies": this.nbRemainingCandies,
			"map": this.map.toJSONBackup()
		};
	}

	this.toStringBackup = function(){
		return JSON.stringify(this.toJSONBackup());
	}

	this.restoreBackup = function(game){
		this.nbRemainingCandies 	= game.nbRemainingCandies;
		this.acceptPlayers 			= false; // never accept news player before restore time out
		this.acceptPlayersMovements = false;
		this.map 					= new Map();
		this.map = this.map.restoreBackup(game.map);
		this.clients = new Array();
		return this;
	}

	this.saveJSONBackup = function(){
		fs.writeFile(this.saveFilePath, this.toStringBackup(), function(err) {
          if (err) {
            //console.log('FAIL: ' + err.message)
          } else {
            //console.log('OK');
          }
        });
	}

	this.deleteJSONBackup = function(){
		fs.unlink(this.saveFilePath, function(err) {
          if (err) {
            //console.log('FAIL: ' + err.message)
          } else {
            //console.log('OK');
          }
        });
	}

	this.restoreBackupFile = function(){	
		if(fs.existsSync(this.saveFilePath)){
			console.log('GAME RESTORED');
			var file  = fs.readFileSync(this.saveFilePath);
			return this.restoreBackup(JSON.parse(file));
		}else{
			console.log('NO RESTORE FILE');			
			return this;
		}
	}

	this.thereAreConnectedPlayers = function(){
		for(var i=0;i<this.map.players.length;i++){
			if(this.map.players[i].connected){
				return true;
			}
		}
	}

	this.cleanNoConnectedPlayer = function(){
		for(var i=0;i<this.map.players.length;i++){
			if(!this.map.players[i].connected){				
                io.sockets.emit('deletePlayer', this.map.players[i]); 
				this.map.players[i] = null;
                this.clients[i] = null;
            }
		}
	}

}