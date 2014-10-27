/*
* GameClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

module.exports = function Game(){
	this.map = null;

	this.initMap = function(mapHtml, wrapperMapHtml, gameInfoHtml){
		this.map = new Map(mapHtml, wrapperMapHtml, gameInfoHtml);
		this.map.generateRandomCandy();
		this.map.newPlayer(this.map.players.length);
		this.map.draw();
		this.map.displayScore(this.map.players.length);
	}
}