/*
* PlayerClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

module.exports = function Player(){
	//Logical part
	this.id			= 0;
	this.name		= "test";
	this.xCoord 	= 0;
	this.yCoord 	= 0;
	this.score 		= 0;

	/**
	 * Function to increase player's score by one point
	 */
	this.increaseScore = function(){
		this.score++;
	}

	this.setPosition = function(x, y){
		this.xCoord = x;
		this.yCoord = y;
	}

}
