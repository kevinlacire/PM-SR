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
		if(axe === 'left' && this.xCoord > 0){
			this.xCoord--;
		} else if(axe === 'up' && this.yCoord > 0){
			this.yCoord--;
		} else if(axe === 'right' && this.xCoord < map.squareWidth){
			this.xCoord++;
		} else if(axe === 'down' && this.yCoord < map.squareHeight){
			this.yCoord++;
		}
		console.info(this.yCoord , map.squareHeight);
		this.direction	= axe;
		this.stateMouth = !this.stateMouth;
	}

}
