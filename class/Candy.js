/*
/*
* CandyClient class definition
* by Richard LE TERRIER & Kévin LACIRE
*/

module.exports = function Candy(){

	//Attributes

	//Logical part
	this.id 	= null;
	this.xCoord = null;
	this.yCoord = null;
	this.state 	= true;

	//Graphical part
	this.radius = 15;

	//Methods

	/*
	* Return true if a candy is over another candy
	* @param the other candy to check
	*/
	this.checkIfOverCandy = function(anotherCandy){
		return (this.xCoord==anotherCandy.xCoord && this.yCoord==anotherCandy.yCoord);
	}
}