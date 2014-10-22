/*
* GameClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function Game(){
	this.map = null;
	this.initMap = function(mapHtml, wrapperMapHtml, gameInfoHtml){
		this.map = new Map(mapHtml, wrapperMapHtml, gameInfoHtml);
		this.map.generateRandomCandy();
		this.map.initPlayers();
		this.map.draw();
		this.map.displayScore();
	}
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = Game;
}
