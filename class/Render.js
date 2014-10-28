/*
* PlayerClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function Render(constraints, container, wrapper){

	this.radius = 15;

	this.printMap = function(wrapperMapHtml, mapHtml, squareHeight, squareWidth, squareSize, wrapperPadding){
		wrapperMapHtml.css({"height": ((squareHeight*squareSize)+(2*wrapperPadding))+"px", "width": ((squareWidth*squareSize)+(2*wrapperPadding))+"px"});
		mapHtml.css({"height": (squareHeight*squareSize)+"px", "width": (squareWidth*squareSize)+"px", "margin":wrapperPadding+"px"});
	}

	this.editPlayerPosition = function(player, map, container){
		var selector = $("#"+player.id+"-player");
		if(selector.length === 0){
			$(container).append('<div class="Player pacman" id="'+player.id+'-player">&nbsp;</div>');
		}
		selector.css({
			"top": ((player.yCoord*map.squareSize)-this.radius)+"px",
			"left": ((player.xCoord*map.squareSize)-this.radius)+"px"
		});
		selector.removeClass("pacman-left");
		selector.removeClass("pacman-up");
		selector.removeClass("pacman-right");
		selector.removeClass("pacman-down");
		selector.addClass("pacman-"+player.direction);
		selector.addClass("pacman-"+player.color);
		selector.removeClass("pacman-mouth-open");
		selector.removeClass("pacman-mouth-close");
		selector.addClass("pacman-mouth-"+(player.stateMouth ? "open" : "close"));
	}

	this.removePlayer = function(player){
		$('#'+player.id+'-player').remove();
	}

	this.editCandy = function(candy, map, container){
		if (candy.state) {
			$(container).append('<div class="Candy" id="'+candy.id+'-candy'+'">&nbsp;</div>');
			$("#" + candy.id + "-candy").css({
				"top": ((candy.yCoord * map.squareSize) - this.radius) + "px",
				"left": ((candy.xCoord * map.squareSize) - this.radius) + "px",
				"height": ((this.radius * 2) + 1) + "px",
				"width": ((this.radius * 2) + 1) + "px"
			});
		} else {
			$('#' + candy.id + '-candy').fadeOut('slow');
		}
	}

}
