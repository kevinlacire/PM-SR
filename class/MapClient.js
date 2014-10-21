/* 
* MapClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function MapClient(mapHtml, wrapperMapHtml, gameInfoHtml){
	
	this.mapHtml = mapHtml;
	this.wrapperMapHtml = wrapperMapHtml;
	this.gameInfoHtml = gameInfoHtml;
	this.wrapperPadding = 20;
	this.squareHeight = 25;
	this.squareWidth = 30;
	this.squareSize = 20;
	this.candyList = new Array();
	this.player = null;
	this.otherPlayers = null;
	this.nbCandy = 30;
	
	this.generateRandomCandy = function(){
		console.log("Generating random candy");
		var nbCandyToCreate = this.nbCandy;
		if(nbCandyToCreate>((this.squareHeight+1)*(this.squareWidth+1))){
			nbCandyToCreate = (this.squareHeight+1)*(this.squareWidth+1);
		}
		this.candyList = new Array();
		for(var i=0;i<nbCandyToCreate;i++){
			var findGoodCoords = false;
			var candy = new CandyClient();	
			while(!findGoodCoords){
				var xRandom = Math.floor(Math.random() * (this.squareWidth - 0 + 1));
				var yRandom = Math.floor(Math.random() * (this.squareHeight - 0 + 1));
				candy.xCoord = xRandom;
				candy.yCoord = yRandom;								
				findGoodCoords = true;	
				for(var j=0;j<this.candyList.length;j++){
					if(candy.checkIfOverCandy(this.candyList[j])){
						findGoodCoords = false;
						break;
					}
				}						
			}										
			console.log("Adding a new candy");
			candy.id=i;
			this.mapHtml.append(candy.getHtml());
			this.candyList.push(candy);
		}
	};

	this.draw = function(){
		console.log("Drawing the map")

		this.wrapperMapHtml.css({"height": ((this.squareHeight*this.squareSize)+(2*this.wrapperPadding))+"px", "width": ((this.squareWidth*this.squareSize)+(2*this.wrapperPadding))+"px"});

		this.mapHtml.css({"height": (this.squareHeight*this.squareSize)+"px", "width": (this.squareWidth*this.squareSize)+"px", "margin":this.wrapperPadding+"px"});

		for(var i=0;i<this.candyList.length;i++){
			this.candyList[i].draw(this.squareSize);
		}

	}


	this.initPlayers = function(){
		this.player = new PlayerClient();
		this.mapHtml.append(this.player.getHtml());
		this.player.draw(this.squareSize);
	}

	this.eventMoveLeft = function(){
		console.log("Event move left");
		if(this.player.xCoord > 0){
			this.player.moveLeft();
			this.player.draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}
	this.eventMoveUp = function(){
		console.log("Event move up");
		if(this.player.yCoord > 0){
			this.player.moveUp();
			this.player.draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}
	this.eventMoveRight = function(){
		console.log("Event move right");
		if(this.player.xCoord < this.squareWidth){
			this.player.moveRight();
			this.player.draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}
	this.eventMoveDown = function(){
		console.log("Event move down");
		if(this.player.yCoord < this.squareHeight){
			this.player.moveDown();
			this.player.draw(this.squareSize);
			this.checkIfPlayerOverCandy();
		}
	}

	this.checkIfPlayerOverCandy = function(){
		console.log("Check if player over candy");
		for(var i=0;i<this.candyList.length;i++){
			if(this.candyList[i].state){
				if((this.player.xCoord == this.candyList[i].xCoord) && (this.player.yCoord == this.candyList[i].yCoord)){
					this.candyList[i].state=false;
					this.candyList[i].draw();
					this.player.addPoint();	
					this.displayScore();							
					break;
				}
			}
		}
	}

	this.displayScore = function(){
		this.gameInfoHtml.html("You ate "+this.player.points+" candy");
	}

}