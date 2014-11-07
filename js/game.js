
// Depends on: grid.js

/*
 * Entrance point for the game application.
 *  draw(ctx): calls draw(ctx) on game grid, also draws HUD on top
 *  update(): calls update() on game grid
 */
 
///// constants
var RUN_INTERVAL = 100; // # ms between game frames
var BACKGROUND_COLOR = '#55A85B';

///// globals
var time = Date.now(); // last time run() was called
var grid = makeGrid(16, 12);

//canvas - this might be used by other js files
var canvas = document.getElementById('gameCanvas');

//functions
function run() {
	// update game state, draw game state, repeat
    var secondsElapsed = (Date.now() - time) / 1000;
    update(secondsElapsed);
    draw();
    time = Date.now();
}
function update(mod) {
	grid.update(mod);
}
function draw() {
	var ctx = canvas.getContext("2d");
	clearScreen(ctx);
	grid.draw(ctx);
}
function clearScreen(ctx) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function initGrid() {
	grid.setEntity(makeTestEnemy(50,50), 5, 3);
}
function startGame() {
    setInterval(run, RUN_INTERVAL);
	initGrid();
}
startGame();