
"use strict";

const RATIO = window.devicePixelRatio;
const Escala = {
	chica: 0.8,
	normal: 1-0,
};

var Game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', this, false, false);
//var Game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game', this, false, false);

//console.log(Phaser.version);

console.log(Game.scale);

Game.state.add("game", Solitario);
//
Game.state.start("game");