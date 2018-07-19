
"use strict";

const RATIO = window.devicePixelRatio;
const Escala = {
	chica: 0.8,
	normal: 1-0,
};

const Conf = {
    width: 800,
    height: 600,
    renderer: Phaser.CANVAS,
    parent: 'game',
    transparent: false,
    antialias: false,
    state: this,
    //scaleMode: Phaser.ScaleManager.EXACT_FIT
};

var Game = new Phaser.Game(Conf);
//var Game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game', this, false, false);

//console.log(Phaser.version);

Game.state.add("game", Solitario);
//
Game.state.start("game");