
// Depends on: hud.js, grid.js, settings.js

/*
 * Entrance point for the game application.
 *  draw(ctx): calls draw(ctx) on game grid, also draws HUD on top
 *  update(): calls update() on game grid
 */

///// globals
var Game = {
    //var runIntervalId // interval used to pause/unpause game loop
    // Grid canvas - this might be used by other js files
    canvas: document.getElementById('gameCanvas'),
    // Grid dimension calculations
    getGridWidthInTiles: function() {
        return (this.canvas.width - SIDEBAR_WIDTH) / TILE_WIDTH;
    },
    getGridHeightInTiles: function() {
        return (this.canvas.height - HUD_HEIGHT) / TILE_HEIGHT;
    },
    // Time & Difficulty
    time: Date.now(), // last time run() was called
    timestepOverflow: 0, // how many seconds should be added to the next game step
    startingPauseSeconds: STARTING_PAUSE, // seconds of pause remaining before game starts
    totalSeconds: 0, // total seconds since game start
    getDifficulty: function() { // difficulty starts from 0
        // increase difficulty every few seconds
        return Math.floor(this.totalSeconds / 30);
    },
    // Player Stats
    lifeTimeSeconds: STARTING_HEALTH, // seconds left until game over, the equivalent of life
    money: STARTING_MONEY, // money used to build towers
    tryToPay: function(cost) {
        if (this.money >= cost || FREE_TOWERS) {
            if (!FREE_TOWERS) {
                this.money -= cost;
            }
            return true;
        }
        return false;
    },
    gainHealth: function(healthGain) {
        this.lifeTimeSeconds += healthGain;
    },
    loseHealth: function(healthDamage) {
        if (!ETERNAL_LIFE) {
            this.lifeTimeSeconds -= healthDamage;
        }
    },
    // Player Session Stats
    enemiesEscaped: 0
};

// Game grid is drawn & updated continuously, also used by other js files
var grid = makeGrid(Game.getGridWidthInTiles(), Game.getGridHeightInTiles());
// TODO move grid global into Game namespace, if possible

var audio;

//functions
function run() {
    // update game state, draw game state, repeat
    if (PAUSE_ON_FOCUS_LOSS && !document.hasFocus()) {
        // this check is also necessary in case focus/blur events don't fire
        Game.time = Date.now(); // avoid queueing up update
        return;
    }
    var secondsElapsed = (Date.now() - Game.time) / 1000;
    if (Game.startingPauseSeconds > 0) {
        Game.startingPauseSeconds -= secondsElapsed;
        if (Game.startingPauseSeconds < 0) {
            secondsElapsed = -Game.startingPauseSeconds;
        } else {
            secondsElapsed = 0;
        }
    }
    // prevent timestep from being too high, can cause path bugs
    secondsElapsed += Game.timestepOverflow;
    Game.timestepOverflow = 0;
    if (secondsElapsed > MAX_FRAME_TIMESTEP) {
        Game.timestepOverflow += secondsElapsed - (secondsElapsed % MAX_FRAME_TIMESTEP);
        secondsElapsed %= MAX_FRAME_TIMESTEP;
    }
    // main game loop
    update(secondsElapsed);
    draw();
    Game.time = Date.now();
    if (Game.lifeTimeSeconds > 0) {
        Game.loseHealth(secondsElapsed);
        Game.totalSeconds += secondsElapsed;
    } else {
        Game.lifeTimeSeconds = 0;
    }
}
function update(mod) {
    if (Game.lifeTimeSeconds > 0) {
        grid.update(mod);
        updateDifficulty(grid);
        Game.money += mod * MONEY_PER_SECOND;
    }
}
function draw() {
    var ctx = Game.canvas.getContext("2d");
    clearScreen(ctx);
    grid.draw(ctx);
    drawHud(ctx);
    drawSidebar(ctx);
}
function clearScreen(ctx) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, TILE_HEIGHT, Game.canvas.width, Game.canvas.height);
}
function addFocusListeners() {
    // window focus gained
    window.addEventListener("focus", function(event) {
        unpauseGame();
    }, false);
    // window focus lost
    window.addEventListener("blur", function(event) {
        if (PAUSE_ON_FOCUS_LOSS) {
            pauseGame();
        }
    }, false);
}
function pauseGame() {
    if (Game.runIntervalId) {
        clearInterval(Game.runIntervalId);
        delete Game.runIntervalId;
        pauseMusic();
    }
}
function unpauseGame() {
    if (!Game.runIntervalId) {
        Game.time = Date.now(); // avoid queueing up update
        Game.runIntervalId = setInterval(run, RUN_INTERVAL);
        playMusic();
    }
}
function updateDifficulty() {
    var newSpawnChance = STARTING_SPAWN_RATE;
    var newEnemyBoost = 0;
    // increases difficulty if set, otherwise resets multiplier & spawn rate
    if (INCREASING_DIFFICULTY) {
        newSpawnChance += Game.getDifficulty() * SPAWN_RATE_DELTA;
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
    var goodDemoLevel = "{\"grid\":[[{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":0,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":0,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_noup.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":50,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":50,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":100,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":100,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":150,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":150,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":200,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":200,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":250,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":250,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":250,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":300,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":300,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":350,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":350,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":350,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":400,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":400,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":450,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":450,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":450,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_upright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":500,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":500,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":550,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":550,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}}],[{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":600,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":1}},{\"buildable\":false,\"terrain\":{\"gx\":600,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_downright.png\"},\"direction\":{\"x\":1,\"y\":0}}],[{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":0,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":50,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightdown.png\"},\"direction\":{\"x\":-1,\"y\":0}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":100,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":150,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":200,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_vertical.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":250,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_rightup.png\"},\"direction\":{\"x\":0,\"y\":-1}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":300,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":350,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":400,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":true,\"terrain\":{\"gx\":650,\"gy\":450,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"grass.png\"}},{\"buildable\":false,\"terrain\":{\"gx\":650,\"gy\":500,\"sx\":50,\"sy\":50,\"imageCategory\":\"terrain\",\"imageName\":\"road_horizontal.png\"},\"direction\":{\"x\":1,\"y\":0}}]],\"spawnPoints\":[{\"tx\":0,\"ty\":9},{\"tx\":0,\"ty\":5},{\"tx\":0,\"ty\":1}]}";
    grid.fromJsonString(goodDemoLevel);
}
function initGrid() {
    resetGame();
}
function playMusic() {
    if (audio) {
        audio.play();
    }
}
function pauseMusic() {
    if (audio) {
        audio.pause();
    }
}
function startGame() {
    addFocusListeners();
    initGrid();
    initSidebar();
    draw(); // avoid blank screen if game starts w/o focus
    //audio = new Audio('audio/watching.ogg');
    unpauseGame();
    console.log('Type \"PAUSE_ON_FOCUS_LOSS = false\" without quotes to disable auto-pause.');
}
startGame();