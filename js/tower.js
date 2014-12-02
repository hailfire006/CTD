
// Depends on: entity.js

/*
 * Tower entities go here.
 */

var Towers = { // Tower listing used to auto-generate hud buttons
    towerListing: {}, // map: (imageCategory, imageName) -> makeTower function
    addTowerListing: function(imageName, buildFunction) {
        this.towerListing[imageName] = buildFunction;
    }
};

function makeTower(gx, gy, imageName, range, coolDown, damage) {
    var imageCategory = 'tower';
    var tower = makeEntity(gx, gy, imageCategory, imageName);
    tower.building = true;
    tower.range = range;
    tower.coolDown = coolDown;
    tower.coolDownTimer = 0;
    tower.damage = damage; // sets projectile damage
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
            // add each tile in range ONLY if in grid bounds
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
    tower.getAllCoordsInRange = function() {
        return this.getAllCoordsInSquareRange(this.range);
    };
    // tower functions
    tower.upgrade = function () {
        // TODO upgrade stats, change image
    };
    tower.fire = function () {
        var targetCoords = this.getTargetCoords();
        if (targetCoords) {
            var projectile = this.makeProjectile(targetCoords.gx, targetCoords.gy);
            projectile.damage = this.damage;
            grid.addEntity(projectile);
        }
    };
    tower.update = function (mod) {
        this.coolDownTimer -= mod;
        if (this.coolDownTimer <= 0) {
            this.fire();
            this.coolDownTimer += this.coolDown;
        }
    };
    // Fire on enemy in range
    tower.getTargetCoords = function() {
        var coordsInRange = this.getAllCoordsInRange();
        // find enemy furthest on path
        var bestEnemyCoords;
        var bestEnemyDist;
        for (var i = 0; i < coordsInRange.length; i++) {
            var curCoords = coordsInRange[i];
            if (grid.hasEnemy(curCoords.gx, curCoords.gy)) {
                var curEnemyDist = grid.getDistToEnd(curCoords.gx, curCoords.gy);
                if (!bestEnemyDist || curEnemyDist < bestEnemyDist) {
                    bestEnemyCoords = curCoords;
                    bestEnemyDist = curEnemyDist;
                }
            }
        }
        return bestEnemyCoords;
    };
    return tower;
}
function makeFireTower(gx,gy) {
    var tower = makeTower(gx,gy,"fireball.png", 3, 1, 100);
    tower.name = "Fire";
    tower.makeProjectile = function (gx, gy) {
        return makeFireProjectile(tower, gx, gy);
    };
    return tower;
}
function makeWaterTower(gx,gy) {
    var tower = makeTower(gx,gy,"bluefire.png", 1, .1, 10);
    tower.name = "Water";
    tower.makeProjectile = function (gx, gy) {
        return makeSprayProjectile(tower, gx, gy);
    };
    return tower;
}
function makeLightningTower(gx,gy) {
    var tower = makeTower(gx,gy,"lightningbolt.png",10,5, 800);
    tower.name = "Lightning";
    tower.makeProjectile = function (gx, gy) {
        return makeLightningProjectile(tower, gx, gy);
    };
    return tower;
}
function makeMagicTower(gx,gy) {
    var tower = makeTower(gx,gy,"magicTrick.png",4,.45, 30);
    tower.name = "Magic";
    tower.makeProjectile = function (gx, gy) {
        return makeMagicProjectile(tower, gx, gy);
    };
    return tower;
}
function makeKingTower(gx,gy) {
    var tower = makeTower(gx,gy,"kingCrown.png",7,3, 500);
    tower.name = "King";
    tower.makeProjectile = function (gx, gy) {
        return makeKingProjectile(tower, gx, gy);
    };
    return tower;
}
function makeSpikyGemTower(gx,gy) {
    var tower = makeTower(gx,gy,"spikyGem.png",4,.75, 30);
    tower.name = "Gem";
    tower.makeProjectile = function (gx, gy) {
        return makeSpikyGemProjectile(tower, gx, gy);
    };
    return tower;
}
function makeSpookyTower(gx,gy) {
    var tower = makeTower(gx,gy,"spookySkull.png",3,1,70);
    tower.name = "Spooky";
    tower.makeProjectile = function (gx, gy) {
        return makeSpookyProjectile(tower, gx, gy);
    };
    return tower;
}
function addTowerListing() { // add new towers in here to generate hud buttons
    Towers.addTowerListing('fireball.png', makeFireTower);
    Towers.addTowerListing('bluefire.png', makeWaterTower);
    Towers.addTowerListing('lightningbolt.png', makeLightningTower);
    Towers.addTowerListing('magicTrick.png', makeMagicTower);
    Towers.addTowerListing('kingCrown.png', makeKingTower);
    Towers.addTowerListing('spikyGem.png', makeSpikyGemTower);
    Towers.addTowerListing('spookySkull.png', makeSpookyTower);
}
addTowerListing();
