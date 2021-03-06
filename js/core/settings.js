
/*
 * Provides constants for game.js & grid.js
 */

// PERFORMANCE
var RUN_INTERVAL = 50; // # ms between game frames
var PAUSE_ON_FOCUS_LOSS = true; // pause game when in another window/tab?

var MAX_FRAME_TIMESTEP = .2; // in seconds, used to prevent jumping off path & other bugs w/ large timesteps

// GAMEPLAY
// tile dimensions affect tile size in grid and entity size
var TILE_WIDTH = 50;
var TILE_HEIGHT = 50;

var STARTING_HEALTH = 4*60 + 20 + .5; // in seconds
var STARTING_MONEY = 500;

var STARTING_PAUSE = 3; // in seconds, how long before game actually starts

var STARTING_SPAWN_RATE = 60; // % chance for an enemy to spawn per second, if >100, can spawn multiple enemies
var SPAWN_RATE_DELTA = 20; // how much starting spawn rate should change per difficulty
var INCREASING_DIFFICULTY = true; // whether difficulty should increase over time
var BOSS_CHANCE = 2; // chance for an enemy spawn to spawn a more powerful version instead

var TOWER_COST = 100;
var TOWER_UPGRADE_EXPONENT = 1.5;
var MONEY_PER_SECOND = 1; // money gained passively
var MONEY_FROM_ENEMY_KILLS = 3.5; // money gained per enemy killed
var HEALTH_FROM_ENEMY_KILLS = .4; // health gained per enemy killed, in seconds
var ENEMY_HEALTH_DAMAGE_MULTIPLIER = 1; // health lost in seconds when enemy escapes, multiplied by difficulty level

// AESTHETIC - general
var UI_BACKGROUND_COLOR = '#55A8C9'; // color of hud background w/o buttons, also sidebar background
var BACKGROUND_COLOR = '#55A85B'; // color of a blank screen, unused unless graphics code is messed up

var SHOW_ENEMY_HEALTH = true; // whether to show a health bar for enemies
var HEALTH_BAR_HEIGHT = 3; // height in pixels of enemy health bars

var BOSS_SIZE_MULTIPLIER = 1.2; // scale of boss enemy images

// AESTHETIC - grid
var UI_SELECTED_BUILDABLE_TILE_COLOR = "orange"; // color of currently moused-over tile, if tile can be built on
var UI_SELECTED_UNBUILDABLE_TILE_COLOR = "red"; // color of currently moused-over tile, if tile can't be built on
var UI_SELECTED_TOWER_TILE_COLOR = "black"; // color of currently selected tower's tile outline

// AESTHETIC - sidebar
var UI_TOWER_INFO_TEXT_COLOR = "black"; // color of tower information text
var UI_TOWER_PREVIEW_TEXT_COLOR = "white"; // color of tower to be built text
var SIDEBAR_WIDTH = 2 * TILE_WIDTH;

// AESTHETIC - hud
var HUD_HEIGHT = TILE_HEIGHT; // height of hud at top
var HEALTH_DISPLAY_COLOR = 'green';
var HEALTH_LOW_DISPLAY_COLOR = 'red';
var HEALTH_EMPTY_DISPLAY_COLOR = 'black';
var HEALTH_LOW_THRESHOLD = 15; // in seconds
var DIFFICULTY_DISPLAY_COLOR = 'blue';
var MONEY_DISPLAY_COLOR = 'yellow';

// DEBUGGING - gameplay
var ETERNAL_LIFE = false; // prevents lifetime from decrementing
var FREE_TOWERS = false; // removes cost from towers & tower upgrades

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
    SHOW_ENEMY_DIRECTION = false;
    SHOW_ENEMY_SPAWN = false;
}
