
//"use strict"

var Game = new Phaser.Game(700, 480, Phaser.CANVAS, 'game', this, false, false);

//console.log(Phaser.version);

Game.state.add("game", Solitario);
//
Game.state.start("game");