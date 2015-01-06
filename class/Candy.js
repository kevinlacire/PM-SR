/*
/*
* CandyClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

module.exports = function Candy(){

	this.id 	= null;
	this.xCoord = null;
	this.yCoord = null;
	this.state 	= true;
    this.points = 0;
    this.color  = null;
    this.colors = ['CandyOnePoint', 'CandyTwoPoint', 'CandyThreePoint'];

    /**
     * Method that create a candy, set its value, set its color and link an image to it
     * @returns {Candy} the initialized candy
     */
    this.initCandy = function(){
        var candy   = new Candy();
        var index   = Math.floor(Math.random()*this.colors.length);
        candy.color = this.colors[index];
        candy.points= index+1;
        return candy;
    }

	/**
	* Method that check if a candy is over another candy (used by the disposition algorithm)
	* @param anotherCandy the other candy to check
	*/
	this.checkIfOverCandy = function(anotherCandy){
		return (this.xCoord==anotherCandy.xCoord && this.yCoord==anotherCandy.yCoord);
	}

	this.toJSONBackup = function(){
		return {
			"id": this.id,
			"xCoord": this.xCoord,
			"yCoord": this.yCoord,
			"state": this.state,
			"points": this.points,
			"color": this.color
		};
	};

	this.restoreBackup = function(candy){
		this.id 	= candy.id;
		this.xCoord = candy.xCoord;
		this.yCoord = candy.yCoord;
		this.state 	= candy.state;
		this.points = candy.points;
		this.color 	= candy.color;
		return this;
	}
}