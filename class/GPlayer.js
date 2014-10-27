/*
* PlayerClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function GPlayer(){
	//Logical part
	this.id			= 0;
	this.name		= "test";
	this.xCoord 	= 0;
	this.yCoord 	= 0;
	this.score 		= 0;

	//Graphical part
	this.radius 	= 20;
	this.stateMouth = true;
	this.direction 	= "right";
	this.color		= "blue";

	//Graphical part

	this.moveLeft = function(distance){
		this.xCoord--;
		this.direction = "left";
		this.stateMouth = !this.stateMouth;
	}
	this.moveUp = function(){
		this.yCoord--;
		this.direction = "up";
		this.stateMouth = !this.stateMouth;
	}
	this.moveRight = function(){
		this.xCoord++;
		this.direction = "right";
		this.stateMouth = !this.stateMouth;
	}
	this.moveDown = function(){
		this.yCoord++;
		this.direction = "down";
		this.stateMouth = !this.stateMouth;
	}

	this.getHtml = function(){
		return '<div class="Player pacman" id="'+this.name+'-player'+'">&nbsp;</div>';
	}

	this.draw = function(squareSize){
		console.log("Drawing a player");
		if($("#"+this.name+"-player")){
			$("#"+this.name+"-player").css({"top": ((this.yCoord*squareSize)-this.radius)+"px", "left": ((this.xCoord*squareSize)-this.radius)+"px"});
			$("#"+this.name+"-player").removeClass("pacman-left");
			$("#"+this.name+"-player").removeClass("pacman-up");
			$("#"+this.name+"-player").removeClass("pacman-right");
			$("#"+this.name+"-player").removeClass("pacman-down");
			$("#"+this.name+"-player").addClass("pacman-"+this.direction);
			$("#"+this.name+"-player").addClass("pacman-"+this.color);
			$("#"+this.name+"-player").removeClass("pacman-mouth-open");
			$("#"+this.name+"-player").removeClass("pacman-mouth-close");
			$("#"+this.name+"-player").addClass("pacman-mouth-"+this.stateMouthText());
		}
	}

	this.stateMouthText = function(){
		return this.stateMouth ? "open" : "close";
	}

}
