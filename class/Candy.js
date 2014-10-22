/*
/*
* CandyClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function Candy(){
	this.id 	= null;
	this.xCoord = null;
	this.yCoord = null;
	this.state 	= true;
	this.radius = 15;

	/*
	* Return true if candy is over anothercandy
	*/
	this.checkIfOverCandy = function(anotherCandy){
		return (this.xCoord==anotherCandy.xCoord && this.yCoord==anotherCandy.yCoord);
	}

	this.getHtml = function(){
		return '<div class="Candy" id="'+this.id+'-candy'+'">&nbsp;</div>';
	}

	this.draw = function(squareSize){
		console.log("Drawing a candy");
		if($("#"+this.id+"-candy")){
			if(this.state){
				$("#"+this.id+"-candy").css({"top": ((this.yCoord*squareSize)-this.radius)+"px", "left": ((this.xCoord*squareSize)-this.radius)+"px", "height": ((this.radius*2)+1)+"px", "width": ((this.radius*2)+1)+"px"});
			}else{
				$("#"+this.id+"-candy").fadeOut( "slow", function() {});
			}
		}
	}
}

if(typeof module !== 'undefined' && module.exports){
  module.exports = Candy;
}
