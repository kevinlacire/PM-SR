/*
* Map class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function GMap(mapHtml, wrapperMapHtml, gameInfoHtml){

	//Logical part
	this.squareHeight   = 0;
	this.squareWidth    = 0;
	this.squareSize     = 0;
	this.candies      	= [];
	this.players        = [];
	this.nbCandies      = 0;

	//Graphical part
	this.mapHtml        = mapHtml;
	this.wrapperMapHtml = wrapperMapHtml;
	this.gameInfoHtml   = gameInfoHtml;
	this.wrapperPadding = 20;

	this.draw = function(){
		this.wrapperMapHtml.css({"height": ((this.squareHeight*this.squareSize)+(2*this.wrapperPadding))+"px", "width": ((this.squareWidth*this.squareSize)+(2*this.wrapperPadding))+"px"});
		this.mapHtml.css({"height": (this.squareHeight*this.squareSize)+"px", "width": (this.squareWidth*this.squareSize)+"px", "margin":this.wrapperPadding+"px"});
	}

	this.eventMoveLeft = function(i){
		if(this.players[i].xCoord > 0){
			this.players[i].moveLeft();
			this.players[i].draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}
	this.eventMoveUp = function(i){
		if(this.players[i].yCoord > 0){
			this.players[i].moveUp();
			this.players[i].draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}
	this.eventMoveRight = function(i){
		if(this.players[i].xCoord < this.squareWidth){
			this.players[i].moveRight();
			this.players[i].draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}
	this.eventMoveDown = function(i){
		if(this.players[i].yCoord < this.squareHeight){
			this.players[i].moveDown();
			this.players[i].draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}

	this.displayScore = function(i){
		this.gameInfoHtml.html("You ate "+this.players[i].score+" candy");
	}
}