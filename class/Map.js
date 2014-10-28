/*
* Map class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

module.exports = function Map(mapHtml, wrapperMapHtml, gameInfoHtml){

	//Logical part
	this.squareHeight   = 30;
	this.squareWidth    = 30;
	this.squareSize     = 20;
	this.candies      	= [];
	this.players        = [];
	this.nbCandies      = 30;
	this.wrapperPadding = 20;

	/**
	 * Method to initialize players' positions depending of the gaming's area size
	 * First player's position : left top corner
	 * Second player's position : right bottom corner
	 * Third player's position : left bottom corner
	 * Fourth player's position : right top corner
	 * Other player's position : random in the gaming area
	 * @param player
	 */
	this.newPlayer = function(player, name, pos){
		if(pos === 0) {
			player.color = "blue";
			player.direction = "right";
		} else if(pos === 1){
			player.color 	= "red";
			player.xCoord 	= this.squareWidth;
			player.yCoord	= this.squareHeight;
			player.direction= "left";
		} else if(pos === 2){
			player.color 	= "green";
			player.yCoord	= this.squareHeight;
			player.direction= "up";
		} else if(pos === 3){
			player.color 	= "yellow";
			player.xCoord 	= this.squareWidth;
			player.direction= "down";
		} else {
			player.color 	= "white";
			player.xCoord = Math.floor(Math.random() * (this.squareWidth + 1));
			player.yCoord = Math.floor(Math.random() * (this.squareHeight + 1));
		}
		player.id = pos;
		player.name = name;
		this.players.push(player);
	}

	this.checkIfPlayerOverCandy = function(i){
		for(var j=0 ; j<this.candies.length ; j++){
			if(this.candies[j].state && (this.players[i].xCoord == this.candies[j].xCoord) && (this.players[i].yCoord == this.candies[j].yCoord)){
				this.candies[j].state=false;
				this.players[i].increaseScore();
				return this.candies[j];
			}
		}
	}
}