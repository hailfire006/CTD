
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
        var towerTile = grid.graphicalToTileCoords(tower.gx, tower.gy);
        var targetTileX = towerTile.tx + tileOffsetX;
        var targetTileY = towerTile.ty + tileOffsetY;
        var graphicalCoords = grid.tileToGraphicalCoords(targetTileX, targetTileY);
        return graphicalCoords;
    };
    // Returns array of (gx, gy) for every tile in a given range, AND are in grid bounds
    tower.getAllCoordsInSquareRange = function(range) {
        var towerTile = this.getCurrentTileCoords();
        var towerTileX = towerTile.tx;
        var towerTileY = towerTile.ty;
        var coordsInRange = []; // graphical coords
        // Look in a square around tower tile
        if (range >= 0) {
            // top-left corner = (towerTileX - range, towerTileY - range)
            var startTileX = Math.max(0, towerTileX - range);
            var startTileY = Math.max(0, towerTileY - range);
            // bottom-right corner = (towerTileX + range, towerTileY + range)
            var endTileX = Math.min(grid.width, towerTileX + range);
            var endTileY = Math.min(grid.height, towerTileY + range);
            // TODO add each tile in range ONLY if in grid bounds
            for (var tileX = startTileX; tileX <= endTileX; tileX++) {
                for (var tileY = startTileY; tileY <= endTileY; tileY++) {
                    var curTileCoords = {
                        tx: tileX,
                        ty: tileY
                    };
                    if (grid.inBounds(curTileCoords)) {
                        var curGraphicalCoords = grid.tileToGraphicalCoords(tileX, tileY);
                        coordsInRange.push(curGraphicalCoords);
                    }
                }
            }
        }
        return coordsInRange;
    };
    // tower functions
    tower.upgrade = function () {
        // TODO upgrade stats, change image
    };
    tower.fire = function () {
        var targetTile = this.getTargetTile();
        var projectile = this.makeProjectile(targetTile.gx, targetTile.gy);
        grid.addEntity(projectile);
    };
    tower.update = function (mod) {
        tower.coolDownTimer -= mod;
        if (tower.coolDownTimer <= 0) {
            tower.fire();
            tower.coolDownTimer += tower.coolDown;
        }
    };
    // Should be overwritten by towers
    tower.getTargetTile = function() {
        // fire to the right
        var targetCoords = this.getRelativeTileCoords(6, 7);
        return targetCoords;
    };
    tower.makeProjectile = function (gx, gy) {
        return makeTestFireProjectile(this, gx, gy);
    };
    // TODO add tower.update check if there are enemies within the tiles in range, then tower.fire()
    return tower;
}
function makeFireTower(gx,gy) {
    var tower = makeTower(gx,gy,"fireball.png", 2, 1.5);
    return tower;
}
function makeWaterTower(gx,gy) {
    var tower = makeTower(gx,gy,"bluefire.png", 2, 1.5);
    tower.getTargetTile = function() {
        var possibleTargets = this.getAllCoordsInSquareRange(1);
        var randomTarget = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
        return randomTarget;
    };
    tower.makeProjectile = function (gx, gy) {
        return makeSprayProjectile(tower, gx, gy)
    }
    return tower;
}
function makeLightningTower(gx,gy) {
    var tower = makeTower(gx,gy,"lightningbolt.png",2,1.5)
    tower.getTargetTile = function() {
        var possibleTargets = this.getAllCoordsInSquareRange(1);
        var randomTarget = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
        return randomTarget;
    };
    tower.makeProjectile = function (gx, gy) {
        return makeLightningProjectile(tower, gx, gy)
    }
    return tower;
}

// TODO towers
