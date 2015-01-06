/*
* Map class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

var Candy = require('./Candy');
var Player = require('./Player');
var uuid = require('node-uuid');

module.exports = function Map(){

	//Logical part
	this.gridHeight  	= 20;
	this.gridWidth	    = 25;
	this.candies      	= new Array();
	this.players        = new Array();
	this.nbCandies      = 30;

	this.restoreBackup = function(map){
		for(var i=0 ; i<map.candies.length ; i++){
			var c = new Candy();
			c = c.restoreBackup(map.candies[i]);
			this.candies.push(c);
		}
		for(var i=0 ; i<map.players.length ; i++){
			var p = new Player();
			p = p.restoreBackup(map.players[i]);
			this.players.push(p);
		}
		return this;
	}

	/**
	 * Method to initialize players' positions depending of the gaming's area size
	 * First player's position : left top corner
	 * Second player's position : right bottom corner
	 * Third player's position : left bottom corner
	 * Fourth player's position : right top corner
	 * @param player
	 */
	this.addNewPlayer = function(player){
		player.id = this.nbPlayers();
		player.key = uuid.v1();
		if(player.id === 0) {
			player.color = "yellow";
			player.xCoord	= 0;
			player.yCoord	= 0;
			player.direction = "right";
		} else if(player.id === 1){
			player.color 	= "white";
			player.xCoord 	= this.gridWidth;
			player.yCoord	= this.gridHeight;
			player.direction= "left";
		} else if(player.id === 2){
			player.color 	= "green";
			player.xCoord	= 0;
			player.yCoord	= this.gridHeight;
			player.direction= "up";
		} else if(player.id === 3){
			player.color 	= "blue";
			player.xCoord 	= this.gridWidth;
			player.yCoord 	= 0;
			player.direction= "down";
		}
		this.players.push(player);
		return this.players[this.nbPlayers()-1];
	}

	this.checkIfPlayerOverCandy = function(playerId){
		for(var j=0 ; j<this.candies.length ; j++){
			if(this.candies[j].state && (this.players[""+playerId].xCoord == this.candies[j].xCoord) && (this.players[playerId].yCoord == this.candies[j].yCoord)){
				this.candies[j].state=false;
				this.players[playerId].increaseScore(this.candies[j].points);
				return this.candies[j];
			}
		}
		return false;
	}

	/**
	 * Method to generate candies object depending of the gaming area dimensions
	 */
	this.generateRandomCandies = function(){
	    for(var i=0 ; i<this.nbCandies ; i++){
	    	var candy = new Candy().initCandy();
	        if(this.nbCandies>((this.gridHeight+1)*(this.gridWidth+1))){
		        this.nbCandies = (this.gridHeight+1)*(this.gridWidth+1);
		    }
		    var findGoodCoords = false;
		    while (!findGoodCoords) {
		        candy.xCoord = Math.floor(Math.random() * (this.gridWidth + 1));
		        candy.yCoord = Math.floor(Math.random() * (this.gridHeight + 1));
		        findGoodCoords = true;
		        for (var j = 0; j < this.candies.length; j++) {
		            if (candy.checkIfOverCandy(this.candies[j])) {
		                findGoodCoords = false;
		                break;
		            }
		        }
		    }
		    candy.id = this.candies.length;
		    this.candies.push(candy);
		}
	}

	this.nbPlayers = function(){
		return this.players.length;
	}

    /**
     * Method that moves on one of the 4 axes the position of the player passed in parameter
     * @param player        the player to move
     * @returns {boolean}   true if the update is allowed else false
     */
	this.movePlayer = function(player){
        this.theClosestCandy(player);
        if(this.players[player.id] != null){
            //check to not overpass game's limits
            var newXCoord = this.players[player.id].xCoord;
            var newYCoord = this.players[player.id].yCoord;

			if(player.direction === 'left' && newXCoord > 0){
				newXCoord--;
			} else if(player.direction === 'up' && newYCoord > 0){
				newYCoord--;
			} else if(player.direction === 'right' && newXCoord < this.gridWidth){
				newXCoord++;
			} else if(player.direction === 'down' && newYCoord < this.gridHeight){
				newYCoord++;
			} else {
				return false;
			}

            //check if there is no player already at the new position
            var flagPlayerOverAnotherPlayer = false;
            for(var i=0;i<this.players.length;i++){
                if(this.players[i] != null && this.players[i].xCoord == newXCoord && this.players[i].yCoord == newYCoord){
                    flagPlayerOverAnotherPlayer = true;
                }
            }

			if(!flagPlayerOverAnotherPlayer){
				this.players[player.id].xCoord = newXCoord;
				this.players[player.id].yCoord = newYCoord;
				this.players[player.id].direction = player.direction;
				this.players[player.id].stateMouth = !this.players[player.id].stateMouth;
				return true;
			}
			return false;
        }
	}

	this.getCandies = function(){
		return this.candies;
	}

	this.getPlayer = function(playerId){
		return this.players[playerId];
	}

    /**
     * Method to get the candy the closest to the player's position
     * @param player    Player  the player's position to find the closest candy
     */
    this.theClosestCandy = function(player){
        var tmp = [];
        for(var i=0 ; i<this.candies.length ; i++){
            tmp.push({'pos':Math.abs(this.candies[i].xCoord - player.xCoord)+Math.abs(this.candies[i].yCoord - player.yCoord), 'candy':this.candies[i]});
        }
        tmp.sort(function(c1, c2){
            return c1.pos-c2.pos;
        });
        return tmp[0];
    }

    /**
     * Method to get the candy the farest to the player's position
     * @param player    Player  the player's position to find the farest candy
     */
    this.theFarestCandy = function(player){

    }

	/**
	 * Return the useful values to restore a backup
	 * @returns {string}	the object with variable value
	 */
	this.toJSONBackup = function(){
		var candies = [];
		var players = [];

		for(var i=0 ; i<this.candies.length ; i++){
			candies.push(this.candies[i].toJSONBackup());
		}

		for(var i=0; i<this.players.length ; i++){
			players.push(this.players[i].toJSONBackup());
		}

		return {
			"candies":candies,
			"players":players
		};
	}

}