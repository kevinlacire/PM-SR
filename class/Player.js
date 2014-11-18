/*
* PlayerClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

module.exports = function Player(){

	this.id			= 0;
	this.name		= "test";
	this.xCoord 	= 0;
	this.yCoord 	= 0;
	this.score 		= 0;
	this.direction	= "left";
	this.stateMouth = false;

	/**
	 * Function to increase player's score by one point
	 */
	this.increaseScore = function(){
		this.score++;
	}

	this.move = function(axe, map){
		//check to not overpass game's limits
		var newXCoord = this.xCoord;
		var newYCoord = this.yCoord;

		if(axe === 'left' && newXCoord > 0){
			newXCoord--;
		} else if(axe === 'up' && newYCoord > 0){
			newYCoord--;
		} else if(axe === 'right' && newXCoord < map.squareWidth){
			newXCoord++;
		} else if(axe === 'down' && newYCoord < map.squareHeight){
			newYCoord++;
		}

		//check if there is no player already at the new position
		var flagPlayerOverAnotherPlayer = false;
		for(var i=0;i<map.players.length;i++){
			if(map.players[i].xCoord == newXCoord && map.players[i].yCoord == newYCoord){
				flagPlayerOverAnotherPlayer = true;
			}
		}

		if(!flagPlayerOverAnotherPlayer){
			console.log("PLAYER MV : "+this.name+" - "+this.xCoord+"x "+this.yCoord+"y");
			this.xCoord = newXCoord;
			this.yCoord = newYCoord;
			this.direction	= axe;
			this.stateMouth = !this.stateMouth;
		}
		
	}

}
