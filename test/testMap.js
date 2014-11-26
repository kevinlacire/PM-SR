var expect = require('chai').expect;
var Map = require('../class/Map');
var Player = require('../class/Player');
var Candy = require('../class/Candy');

describe('Map', function(){

	describe('#addNewPlayer()', function(){
		
		it('player should have id=0 and be on top left if first', function(){
			var map = new Map();
			var player1 = new Player();
			player1 = map.addNewPlayer(player1);			
			expect(player1.id).to.be.equal(0);
			expect(player1.xCoord).to.be.equal(0);
			expect(player1.yCoord).to.be.equal(0);
		});

		it('player should have id=1 and be on bottom right if second', function(){
			var map = new Map();
			var player1 = new Player();
			var player2 = new Player();
			player1 = map.addNewPlayer(player1);			
			player2 = map.addNewPlayer(player2);			
			expect(player2.id).to.be.equal(1);
			expect(player2.xCoord).to.be.equal(map.gridWidth);
			expect(player2.yCoord).to.be.equal(map.gridHeight);
		});

		it('player should have id=2 and be on bottom left if third', function(){
			var map = new Map();
			var player1 = new Player();
			var player2 = new Player();
			var player3 = new Player();
			player1 = map.addNewPlayer(player1);			
			player2 = map.addNewPlayer(player2);		
			player3 = map.addNewPlayer(player3);		
			expect(player3.id).to.be.equal(2);
			expect(player3.xCoord).to.be.equal(0);
			expect(player3.yCoord).to.be.equal(map.gridHeight);
		});

		it('player should have id=3 and be on top right if fourth', function(){
			var map = new Map();
			var player1 = new Player();
			var player2 = new Player();
			var player3 = new Player();
			var player4 = new Player();
			player1 = map.addNewPlayer(player1);			
			player2 = map.addNewPlayer(player2);		
			player3 = map.addNewPlayer(player3);			
			player4 = map.addNewPlayer(player4);			
			expect(player4.id).to.be.equal(3);
			expect(player4.xCoord).to.be.equal(map.gridWidth);
			expect(player4.yCoord).to.be.equal(0);
		});

	});

	describe('#movePlayer()', function(){

		it('players cannot go beyond the limits', function(){
			var map = new Map();
			var player1 = new Player();
			var player2 = new Player();
			player1 = map.addNewPlayer(player1);		
			player2 = map.addNewPlayer(player2);		

			player1.direction = "left";
			expect(map.movePlayer(player1)).to.be.equal(false);

			player1.direction = "up";
			expect(map.movePlayer(player1)).to.be.equal(false);

			player2.direction = "right";
			expect(map.movePlayer(player2)).to.be.equal(false);

			player2.direction = "down";
			expect(map.movePlayer(player2)).to.be.equal(false);
		});

		it('players cannot move to a same position', function(){
			var map = new Map();
			var player1 = new Player();
			var player2 = new Player();
			player1 = map.addNewPlayer(player1);		
			player2 = map.addNewPlayer(player2);

			player1.direction = "right";
			for(var i=0;i<map.gridWidth;i++){
				map.movePlayer(player1);
			}

			player1 = map.getPlayer(player1.id);
			expect(player1.xCoord).to.be.equal(map.gridWidth);

			player1.direction = "down";
			for(var i=0;i<map.gridHeight-1;i++){
				map.movePlayer(player1);
			}

			player1 = map.getPlayer(player1.id);
			expect(player1.yCoord).to.be.equal(map.gridHeight-1);

			expect(map.movePlayer(player1)).to.be.equal(false);

		});

	});

	describe('#checkIfPlayerOverCandy()', function(){

		it('should return false if player is not over a candy', function(){
			var map = new Map();
			var player1 = new Player();
			player1 = map.addNewPlayer(player1);	
			expect(map.checkIfPlayerOverCandy(player1.id)).to.be.equal(false);
		});

		it('should return the candy if player is over an active candy', function(){
			var map = new Map();
			var player1 = new Player();
			player1 = map.addNewPlayer(player1);	
			var candy = new Candy();
			candy.xCoord = 0;
			candy.yCoord = 0;
			candy.state = true;
			map.candies.push(candy);
			expect(map.checkIfPlayerOverCandy(player1.id)).to.be.an.instanceof(Candy);
		});

		it('should return false if player is over an inactive candy', function(){
			var map = new Map();
			var player1 = new Player();
			player1 = map.addNewPlayer(player1);	
			var candy = new Candy();
			candy.xCoord = 0;
			candy.yCoord = 0;
			candy.state = false;
			map.candies.push(candy);
			expect(map.checkIfPlayerOverCandy(player1.id)).to.be.equal(false);
		});

        it("should pass if player's score is increased by the value of the ate candy", function(){
            var map = new Map();
            var player1 = new Player();
            player1 = map.addNewPlayer(player1);
            var candy = new Candy();
            candy.xCoord = 0;
            candy.yCoord = 0;
            candy.state = true;
            map.candies.push(candy);
            var ateCandy = map.checkIfPlayerOverCandy(player1.id);
            expect(ateCandy.points).to.be.equal(player1.score);
        });

	});

});