/*
/*
* CandyClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

function GCandy(id, x, y, state){

	this.id 	= id;
	this.xCoord = x;
	this.yCoord = y;
	this.state 	= state;

	this.getHtml = function(){
		return '<div class="Candy" id="'+this.id+'-candy'+'">&nbsp;</div>';
	}

	this.draw = function(squareSize){
		if($("#"+this.id+"-candy")){
			if(this.state){
				$("#"+this.id+"-candy").css({"top": ((this.yCoord*squareSize)-this.radius)+"px", "left": ((this.xCoord*squareSize)-this.radius)+"px", "height": ((this.radius*2)+1)+"px", "width": ((this.radius*2)+1)+"px"});

			}else{
				$("#"+this.id+"-candy").fadeOut("slow", function() {});
			}
		}
	}
}