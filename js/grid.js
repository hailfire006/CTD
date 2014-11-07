
// Depends on: entity.js

// TODO add tiles that contain entities
// TODO tile size?
// TODO Sheng - flip width & height for iteration performance
function makeGrid(width, height) {
	width = Math.max(width, 1);
	height = Math.max(height, 1);
	var grid = new Array(width);
	for (var i = 0; i < width; i++) {
		grid[i] = new Array(height);
		// TODO grid[i][j] = tile
	}
	// adding functions (fake OOP)
	grid.inBounds = function(x, y) {
		return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
	};
	grid.setEntity = function(entity, x, y) {
		if (this.inBounds(x, y)) {
			grid[x][y] = entity;
			return true;
		}
		return false;
	};
	// draw & update just send draw & update function calls to every contained tile
	grid.draw = function(ctx) {
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid[i].length; j++) {
				// TODO curTile
				var curEntity = grid[i][j];
				if (curEntity) { // if defined
					curEntity.draw(ctx);
				}
			}
		}
	};
	grid.update = function(mod) {
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid[i].length; j++) {
				// TODO curTile
				var curEntity = grid[i][j];
				if (curEntity) { // if defined
					curEntity.update(mod);
				}
			}
		}
	};
	return grid;
}
// TODO grid convert graphical point to grid tile
// TODO grid convert grid tile to graphical point
