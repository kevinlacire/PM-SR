/*
* PlayerClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

module.exports = function Player(){

	this.id					= 0;
	this.name				= "test";
	this.xCoord 			= 0;
	this.yCoord 			= 0;
	this.score 				= 0;
	this.direction			= "left";
	this.stateMouth 		= false;

	/**
	 * Function to increase player's score by one point
	 */
	this.increaseScore = function(){
		this.score++;
	}

}
