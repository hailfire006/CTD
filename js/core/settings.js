
/*
 * Provides constants for game.js & grid.js
 */

// PERFORMANCE
var RUN_INTERVAL = 50; // # ms between game frames
var PAUSE_ON_FOCUS_LOSS = true; // pause game when in another window/tab?

// GAMEPLAY
// tile dimensions affect tile size in grid and entity size
var TILE_WIDTH = 50;
var TILE_HEIGHT = 50;

var STARTING_SPAWN_RATE = 3; // out of 100, % chance for an enemy to spawn on any given frame
var INCREASING_DIFFICULTY = true; // whether difficulty should increase over time
var STARTING_HEALTH = 60; // in seconds
var STARTING_MONEY = 500;

// AESTHETIC - general
var UI_BACKGROUND_COLOR = '#55A8C9'; // color of hud background w/o buttons, also sidebar background
var BACKGROUND_COLOR = '#55A85B'; // color of a blank screen, unused unless graphics code is messed up
var UI_SELECTED_BUILDABLE_TILE_COLOR = "orange"; // color of currently moused-over tile, if tile can be built on
var UI_SELECTED_UNBUILDABLE_TILE_COLOR = "red"; // color of currently moused-over tile, if tile can't be built on

var SHOW_ENEMY_HEALTH = true; // whether to show a health bar for enemies
var HEALTH_BAR_HEIGHT = 5; // height in pixels of enemy health bars

// AESTHETIC - hud
var HUD_HEIGHT = TILE_HEIGHT; // height of hud at top
var HEALTH_DISPLAY_COLOR = 'green';
var HEALTH_LOW_DISPLAY_COLOR = 'red';
var HEALTH_LOW_THRESHOLD = 15; // in seconds
var MONEY_DISPLAY_COLOR = 'yellow';

// DEBUGGING - gameplay
var ETERNAL_LIFE = true; // prevents lifetime from decrementing

// DEBUGGING - code
var HIGHLIGHT_ENTITY_HITBOXES = true; // entity hitboxes shown in white
var HIGHLIGHT_TILES_WITH_ENTITIES = true; // tiles with entities colored red
var SHOW_GRID = true; // whether to show grid lines around each tile
var SHOW_PATH_DIST = false; // whether to show distance to end of path on each tile, for tower targetting
var SHOW_ENEMY_DIRECTION = true; // whether to show enemy path directions on tiles
var SHOW_ENEMY_SPAWN = true; // whether to show where enemies spawn

// MULTI-TOGGLE
var DEMO = true;

if (DEMO) {
    HIGHLIGHT_ENTITY_HITBOXES = false;
    HIGHLIGHT_TILES_WITH_ENTITIES = false;
    SHOW_GRID = false;
    SHOW_ENEMY_DIRECTION = true;
    SHOW_ENEMY_SPAWN = false;
}
