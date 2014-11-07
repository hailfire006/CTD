
// Depends on: entity.js, tile.js, terrain.js

/*
 * Grids are 2D arrays of Tiles
 *  draw(ctx): calls draw(ctx) on each contained tile
 *  update(): calls update() on each contained tile
 */
function makeGrid(width, height) {
	// Avoid issues with non-positive widths & heights
	width = Math.max(width, 1);
	height = Math.max(height, 1);
	// TODO tileWidth tileHeight
	var tileWidth = 50;
	var tileHeight = 50;
	// Initialize grid as 2d array
	var grid = new Array(width);
	for (var i = 0; i < width; i++) {
		grid[i] = new Array(height);
		// initialize tiles
		for (var j = 0; j < height; j++) {
			var grassTerrain = makeTerrain(i * tileWidth, j * tileHeight, 'grass.png');
			var tile = makeTile(true, grassTerrain);
			grid[i][j] = tile;
		}
	}
	// adding functions (fake OOP)
	grid.inBounds = function(x, y) {
		return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
	};
	grid.setEntity = function(entity, x, y) {
		if (this.inBounds(x, y)) {
			var tile = grid[x][y];
			tile.setEntity(entity);
			return true;
		}
		return false;
	};
	// draw & update just send draw & update function calls to every contained tile
	grid.draw = function(ctx) {
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid[i].length; j++) {
				var curTile = grid[i][j];
				curTile.draw(ctx);
			}
		}
	};
	grid.update = function(mod) {
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid[i].length; j++) {
				var curTile = grid[i][j];
				curTile.update(mod);
			}
		}
	};
	return grid;
}
// TODO tile size?
// TODO Sheng - flip width & height for iteration performance

// TODO grid convert graphical point to grid tile
// TODO grid convert grid tile to graphical point
