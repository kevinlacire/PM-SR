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

	/**
	 * Function to increase player's score by one point
	 */
	this.increaseScore = function(){
		this.score++;
	}

	this.move = function(axe, map){
		//check to not overpass game's limits
		if(axe === 'left'){
			this.xCoord--;
		} else if(axe === 'up'){
			this.yCoord--;
		} else if(axe === 'right'){
			this.xCoord++;
		} else {
			this.yCoord++;
		}
		this.direction	= axe;
		this.stateMouth = !this.stateMouth;
	}

}
