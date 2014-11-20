
/*
 * Provides constants for game.js
 */

// PERFORMANCE
var RUN_INTERVAL = 50; // # ms between game frames
var PAUSE_ON_FOCUS_LOSS = true; // pause game when in another window/tab?

// GAMEPLAY
// tile dimensions affect tile size in grid and entity size
var TILE_WIDTH = 50;
var TILE_HEIGHT = 50;

// AESTHETIC
var HUD_BACKGROUND_COLOR = '#55A8C9'; // color of hud background w/o buttons
var BACKGROUND_COLOR = '#55A85B'; // color of a blank screen, mostly unused

// DEBUGGING
var HIGHLIGHT_ENTITY_HITBOXES = true; // entity hitboxes shown in white
var HIGHLIGHT_TILES_WITH_ENTITIES = true; // tiles with entities colored red
var SHOW_GRID = true; // whether to show grid lines around each tile
var SHOW_ENEMY_DIRECTION = true; // whether to show enemy path directions on tiles
var SHOW_ENEMY_SPAWN = true; // whether to show where enemies spawn
