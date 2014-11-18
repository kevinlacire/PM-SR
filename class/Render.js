/*
* PlayerClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function Render(constraints, container, wrapper){

	this.candyRadius = 15;
	this.playerRadius = 20;

	this.printMap = function(wrapperMapHtml, mapHtml, squareHeight, squareWidth, squareSize, wrapperPadding){
		wrapperMapHtml.css({"height": ((squareHeight*squareSize)+(2*wrapperPadding))+"px", "width": ((squareWidth*squareSize)+(2*wrapperPadding))+"px"});
		mapHtml.css({"height": (squareHeight*squareSize)+"px", "width": (squareWidth*squareSize)+"px", "margin":wrapperPadding+"px"});
	}

	this.editPlayerPosition = function(player, map, container){
		var selector = $("#"+player.id+"-player");
		if(selector.length === 0){
			$(container).append('<div class="Player pacman" id="'+player.id+'-player">&nbsp;</div>');
			selector = $("#"+player.id+"-player");
		}

		// style general
		selector.css({
			"top": ((player.yCoord*map.squareSize)-this.playerRadius)+"px",
			"left": ((player.xCoord*map.squareSize)-this.playerRadius)+"px",
			"border-top-left-radius": this.playerRadius+"px",
			"border-top-right-radius": this.playerRadius+"px",
			"border-bottom-left-radius": this.playerRadius+"px",
			"border-bottom-right-radius": this.playerRadius+"px"
		});

		// style direction
		if(player.direction == "left"){
			selector.css({
				"border-left": this.playerRadius+"px solid transparent",
				"border-top": this.playerRadius+"px solid "+player.color,
				"border-right": this.playerRadius+"px solid "+player.color,
				"border-bottom": this.playerRadius+"px solid "+player.color
			});
		}else if (player.direction == "up"){
			selector.css({
				"border-left": this.playerRadius+"px solid "+player.color,
				"border-top": this.playerRadius+"px solid transparent",
				"border-right": this.playerRadius+"px solid "+player.color,
				"border-bottom": this.playerRadius+"px solid "+player.color
			});
		}else if (player.direction == "right"){
			selector.css({
				"border-left": this.playerRadius+"px solid "+player.color,
				"border-top": this.playerRadius+"px solid "+player.color,
				"border-right": this.playerRadius+"px solid transparent",
				"border-bottom": this.playerRadius+"px solid "+player.color
			});
		}else if (player.direction == "down"){
			selector.css({
				"border-left": this.playerRadius+"px solid "+player.color,
				"border-top": this.playerRadius+"px solid "+player.color,
				"border-right": this.playerRadius+"px solid "+player.color,
				"border-bottom": this.playerRadius+"px solid transparent"
			});
		}	

		// style mouth 
		if(player.stateMouth){
			selector.css({
				"background-color": "transparent"
			});
		}else{
			selector.css({
				"background-color": player.color
			});
		}
	}

	this.deletePlayer = function(player, map, container){
		$("#"+player.id+"-player").remove();
	}

	this.removePlayer = function(player){
		$('#'+player.id+'-player').remove();
	}

	this.editCandy = function(candy, map, container){
		if (candy.state) {
			$(container).append('<div class="Candy" id="'+candy.id+'-candy'+'">&nbsp;</div>');
			$("#" + candy.id + "-candy").css({
				"top": ((candy.yCoord * map.squareSize) - this.candyRadius) + "px",
				"left": ((candy.xCoord * map.squareSize) - this.candyRadius) + "px",
				"height": ((this.candyRadius * 2) + 1) + "px",
				"width": ((this.candyRadius * 2) + 1) + "px"
			});
		} else {
			$('#' + candy.id + '-candy').fadeOut('slow');
		}
	}
	
}
