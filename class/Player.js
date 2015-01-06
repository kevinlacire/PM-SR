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
	this.key 				= "";
	this.color				= null;

	this.restoreBackup = function(player){
		this.id 		= player.id;
		this.name 		= player.name;
		this.xCoord 	= player.xCoord;
		this.yCoord 	= player.yCoord;
		this.direction 	= player.direction;
		this.stateMouth = player.stateMouth;
		this.key 		= player.key;
		this.color		= player.color;
		this.score 		= player.score;
		return this;
	}

	/**
	 * Function to increase player's score by one point
	 */
	this.increaseScore = function(nbPoints){
		this.score += nbPoints;
	}

	/**
	 * Return the useful values to restore a backup
	 * @returns {string}	the object with variable value
	 */
	this.toJSONBackup = function(){
		return {
			"id": this.id,
			"name": this.name,
			"xCoord": this.xCoord,
			"yCoord": this.yCoord,
			"direction": this.direction,
			"stateMouth": this.stateMouth,
			"key": this.key,
			"color": this.color,
			"score": this.score
		};
	}


}
