
// Depends on: entity.js

/*
 * Tower entities go here.
 */

function makeTower(gx, gy, imageName, range, coolDown) {
    var imageCategory = 'tower';
    // TODO add tower.range fire within tower.range
    var tower = makeEntity(gx, gy, imageCategory, imageName);
    tower.coolDown = coolDown;
    tower.coolDownTimer = 0;
	// tower helper functions
	// Returns (gx, gy) for the tile offset relative to tower's tile
	tower.getRelativeTileCoords = function(tileOffsetX, tileOffsetY) {
        var towerTile = grid.graphicalToTileCoords(tower.gx,tower.gy);
        var targetTilex = towerTile.tx + tileOffsetX;
        var targetTiley = towerTile.ty + tileOffsetY;
        var targetX = targetTilex * TILE_WIDTH; 
        var targetY = targetTiley * TILE_HEIGHT;
		return {gx: targetX, gy: targetY};
	};
	// tower functions
    tower.upgrade = function () {
        // TODO upgrade stats, change image
    };
    tower.fire = function () {
        var towerTile = grid.graphicalToTileCoords(tower.gx,tower.gy);
        // fire to the right
		var targetCoords = this.getRelativeTileCoords(6, 7);
        var projectile = makeTestProjectile(this, targetCoords.gx, targetCoords.gy);
        grid.addEntity(projectile);
    };
    tower.update = function (mod) {
        tower.coolDownTimer -= mod;
        if (tower.coolDownTimer <= 0) {
            tower.fire();
            tower.coolDownTimer += tower.coolDown;
        }
    };
    // TODO add tower.update check if there are enemies within the tiles in range, then tower.fire()
    return tower;
}
function makeTestTower(gx,gy) {
    var tower = makeTower(gx,gy,"fireball.png", 2, 1.5);
    return tower;
}

// TODO towers
