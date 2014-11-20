
// Depends on: hud.js, grid.js, settings.js

/*
 * Entrance point for the game application.
 *  draw(ctx): calls draw(ctx) on game grid, also draws HUD on top
 *  update(): calls update() on game grid
 */

///// globals
var Game = { // TODO move all globals into Game namespace
    //var runIntervalId // interval
    time: Date.now() // last time run() was called
};
var grid = makeGrid(14, 12);

//canvas - this might be used by other js files
var canvas = document.getElementById('gameCanvas');

//functions
function run() {
    // update game state, draw game state, repeat
    var secondsElapsed = (Date.now() - Game.time) / 1000;
    update(secondsElapsed);
    draw();
    Game.time = Date.now();
}
function update(mod) {
    grid.update(mod);
}
function draw() {
    var ctx = canvas.getContext("2d");
    clearScreen(ctx);
    grid.draw(ctx);
    drawHud(ctx);
}
function clearScreen(ctx) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function addFocusListeners() {
    if (PAUSE_ON_FOCUS_LOSS) {
        // window focus gained
        window.addEventListener("focus", function(event) {
            unpauseGame();
            if (Game.runIntervalId) {
            }
        }, false);
        // window focus lost
        window.addEventListener("blur", function(event) {
            pauseGame();
        }, false);
    }
}
function pauseGame() {
    if (Game.runIntervalId) {
        clearInterval(Game.runIntervalId);
        delete Game.runIntervalId;
    }
}
function unpauseGame() {
    if (!Game.runIntervalId) {
        Game.time = Date.now(); // avoid queueing up update
        Game.runIntervalId = setInterval(run, RUN_INTERVAL);
    }
}
function initGrid() {
    grid.addEntity(makeGlarefish(300,450));
    grid.addEntity(makeGlarefish(150,150));
    grid.addEntity(makeGlarefish(350,50));
    grid.addEntity(makeGlarefish(350,250));
    for (var y = 1; y < grid.height - 1; y++) {
        grid.addSpawnPoint(0, y);
    }
}
function startGame() {
    addFocusListeners();
    initGrid();
    initHud();
    unpauseGame();
}
startGame();