/*
* PlayerClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function Render(){

	this.candyRadius 			= 10;
	this.playerRadius 			= 15;
	this.interval 				= null;
	this.mapWrapperHtml 		= null;
	this.mapHtml 				= null;
	this.gridHeight 			= null;
	this.gridWidth				= null;
	this.squareSize  			= 20;
	this.wrapperPadding 		= 20;
	this.me 					= null;
	this.countDownWrapperHtml 	= null;
	this.countDownMessageHtml 	= null;
	this.countDownValueHtml	  	= null;
	this.stateGame				= false;

	this.printMap = function(){
		this.mapWrapperHtml.css({
				"height": ((this.gridHeight*this.squareSize)+(2*this.wrapperPadding))+"px",
				"width": ((this.gridWidth*this.squareSize)+(2*this.wrapperPadding))+"px"
			});
		this.mapHtml.css({
				"height": (this.gridHeight*this.squareSize)+"px",
				"width": (this.gridWidth*this.squareSize)+"px",
				"margin":this.wrapperPadding+"px"
			});
	}

	this.editPlayer = function(player){
		var selector = $("#"+player.id+"-player");
		if(selector.length === 0){
			this.mapHtml.append('<div class="Player pacman" id="'+player.id+'-player">&nbsp;</div>');
			selector = $("#"+player.id+"-player");
			this.insertPlayerScore(player);
		}

		// style general
		selector.css({
			"top": ((player.yCoord*this.squareSize)-this.playerRadius)+"px",
			"left": ((player.xCoord*this.squareSize)-this.playerRadius)+"px",
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

	this.deletePlayer = function(player){
		this.removePlayerScore(player);
		$("#"+player.id+"-player").remove();
		if(this.me != null && this.me.id == player.id){
			this.me = null;
		}
	}

	this.editCandy = function(candy){
		if (candy.state) {
			this.mapHtml.append('<div class="Candy" id="'+candy.id+'-candy'+'">&nbsp;</div>');
			$("#" + candy.id + "-candy").css({
				"top": ((candy.yCoord * this.squareSize) - this.candyRadius) + "px",
				"left": ((candy.xCoord * this.squareSize) - this.candyRadius) + "px",
				"height": ((this.candyRadius * 2) + 1) + "px",
				"width": ((this.candyRadius * 2) + 1) + "px"
			});
		} else {
			$('#' + candy.id + '-candy').fadeOut('slow');
		}
	}

    this.insertPlayerScore = function(player){
        document.querySelector("table tbody").innerHTML += '<tr id="player-score-'+player.id+'"><td class="pacman">'+player.name+'</td><td class="score">'+player.score+'</td></tr>';
    }

	this.editScore = function(player) {
        if (player != null) {
            document.querySelector('#player-score-' + player.id + ' td.pacman').innerHTML = player.name;
            document.querySelector('#player-score-' + player.id + ' td.score').innerHTML = player.score;
        }
    }

    this.removePlayerScore = function(player){
        document.querySelector('#player-score-'+player.id).remove();
    }

	this.startCountDown = function(message, time){
		if(this.interval != null){
			clearInterval(this.interval);
		}
		this.countDownWrapperHtml.show();
		this.countDownMessageHtml.html(message);				
		this.countDownValueHtml.html(time);
		var countDown = time-1;
		var _this = this;
		this.interval = setInterval(function() {
            if(countDown<0){
            	clearInterval(_this.interval);
            	_this.countDownWrapperHtml.hide();
				_this.countDownMessageHtml.html("");
		       	_this.countDownValueHtml.html("");
            }else{
	            _this.countDownValueHtml.html(countDown);
				countDown--;
            }
         }, 1000);
	}

}
