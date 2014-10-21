/* 
* GameClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function GameClient(){
	this.map = null;				
	this.initMap = function(mapHtml, wrapperMapHtml, gameInfoHtml){
		this.map = new MapClient(mapHtml, wrapperMapHtml, gameInfoHtml);
		this.map.generateRandomCandy();
		this.map.initPlayers();
		this.map.draw();
		this.map.displayScore();
	}				
}