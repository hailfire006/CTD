
// Depends on: hud.js, grid.js, settings.js

/*
 * Entrance point for the game application.
 *  draw(ctx): calls draw(ctx) on game grid, also draws HUD on top
 *  update(): calls update() on game grid
 */

///// globals
var Game = { // TODO move all globals into Game namespace
    // Time & Difficulty
    //var runIntervalId // interval
    time: Date.now(), // last time run() was called
    totalSeconds: 0, // total seconds since game start
    getDifficulty: function() {
        // divide to make initial difficulty last for a few seconds
        return Math.floor(Math.pow(this.totalSeconds / 10, .4));
    },
    // Player Info
    lifeTimeSeconds: STARTING_HEALTH, // seconds left until game over, the equivalent of life
    money: STARTING_MONEY // money used to build towers
};
var grid = makeGrid(14, 11);

//canvas - this might be used by other js files
var canvas = document.getElementById('gameCanvas');

//functions
function run() {
    // update game state, draw game state, repeat
    if (PAUSE_ON_FOCUS_LOSS && !document.hasFocus()) {
        // this check is also necessary in case focus/blur events don't fire
        Game.time = Date.now(); // avoid queueing up update
        return;
    }
    var secondsElapsed = (Date.now() - Game.time) / 1000;
    update(secondsElapsed);
    draw();
    Game.time = Date.now();
    if (!ETERNAL_LIFE) {
        Game.lifeTimeSeconds -= secondsElapsed;
    }
    Game.totalSeconds += secondsElapsed;
}
function update(mod) {
    grid.update(mod);
    updateDifficulty(grid);
    Game.money += mod;
}
function draw() {
    var ctx = canvas.getContext("2d");
    clearScreen(ctx);
    grid.draw(ctx);
    drawHud(ctx);
    drawSidebar(ctx);
}
function clearScreen(ctx) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, TILE_HEIGHT, canvas.width, canvas.height);
}
function addFocusListeners() {
    if (PAUSE_ON_FOCUS_LOSS) {
        // window focus gained
        window.addEventListener("focus", function(event) {
            unpauseGame();
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
function updateDifficulty() {
    var newSpawnChance = STARTING_SPAWN_RATE;
    var newEnemyBoost = 0;
    // increases difficulty if set, otherwise resets multiplier & spawn rate
    if (INCREASING_DIFFICULTY) {
        newSpawnChance += Game.getDifficulty();
        newEnemyBoost = Game.getDifficulty();
    }
    grid.enemyPower = newEnemyBoost;
    grid.spawnChance = newSpawnChance;
}
function resetGame() {
    Game.totalSeconds = 0;
    Game.money = STARTING_MONEY;
    grid.entities = [];
    // grid.generateBlankMap();
    // grid.generateRandomMap();
    loadGrid();
}
function saveGrid() {
    var jsonString = JSON.stringify(grid.asJsonObject());
    console.log(jsonString);
    return jsonString;
}
function loadGrid() {
    var goodDemoLevel = "{\"grid\":[[{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_noup.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":250,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":250,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":350,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":350,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":450,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":450,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}}],[{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"}}]],\"spawnPoints\":[{\"tx\":0,\"ty\":9},{\"tx\":0,\"ty\":5},{\"tx\":0,\"ty\":2}]}";
    grid.fromJsonString(goodDemoLevel);
}
function initGrid() {
    resetGame();
}
function startGame() {
    addFocusListeners();
    initGrid();
    initSidebar();
    unpauseGame();
}
startGame();