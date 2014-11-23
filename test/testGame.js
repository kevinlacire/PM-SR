var expect = require('chai').expect;
var Game = require('../class/Game');
var Player = require('../class/Player');
var Map = require('../class/Map');

describe('Game', function(){

	describe('#initGame()', function(){
		
		it('map should be instance of Map', function(){
			var game = new Game();
			game.initGame();			
			expect(game.map).to.be.an.instanceof(Map);
		});

		it('nbRemainingCandies should not be null', function(){
			var game = new Game();
			game.initGame();			
			expect(game.nbRemainingCandies).to.not.equal(null);
		});

		it('tab of clients should be an instance of Array', function(){
			var game = new Game();
			game.initGame();			
			expect(game.clients).to.be.an.instanceof(Array);
		});

	});

	describe('#isInit()', function(){
		
		it('should return false if not init', function(){
			var game = new Game();
			expect(game.isInit()).to.equal(false);
		});

		it('should return true if init', function(){
			var game = new Game();
			game.initGame();
			expect(game.isInit()).to.equal(true);
		});

	});

	describe('#resetGame()', function(){
		
		it('game should not be initialized if game resetted', function(){
			var game = new Game();
			game.initGame();
			game.resetGame();
			expect(game.isInit()).to.equal(false);
		});

	});

	describe('#isFullOfPlayers()', function(){
		
		it('should return true if game started', function(){
			var game = new Game();
			game.initGame();
			game.stopAcceptingPlayers();
			expect(game.isFullOfPlayers()).to.equal(true);
		});

		it('should return true if max player', function(){
			var game = new Game();
			game.initGame();
			var player = new Player();
			for(var i=0;i<game.nbMaxPlayers;i++){				
				game.addNewPlayer(player);
			}
			expect(game.isFullOfPlayers()).to.equal(true);
		});

		it('should return false if not max player and game not started', function(){
			var game = new Game();
			game.initGame();
			expect(game.isFullOfPlayers()).to.equal(false);
		});

	});

	describe('#isEnoughtPlayersToStart()', function(){
		
		it('should return false if zero player', function(){
			var game = new Game();
			game.initGame();
			expect(game.isEnoughtPlayersToStart()).to.equal(false);
		});

		it('should return true if there are nbMinPlayers players', function(){
			var game = new Game();
			game.initGame();
			var player = new Player();
			for(var i=0;i<game.nbMinPlayers;i++){				
				game.addNewPlayer(player);
			}
			expect(game.isEnoughtPlayersToStart()).to.equal(true);
		});

	});

});