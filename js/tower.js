
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

function makeTower(gx, gy, imageName, damage, coolDown, range) {
    var imageCategory = 'tower';
    var tower = makeEntity(gx, gy, imageCategory, imageName);
    tower.building = true;
    tower.range = range;
    tower.coolDown = coolDown;
    tower.coolDownTimer = 0;
    tower.damage = damage; // sets projectile damage
    tower.level = 1; // TODO draw level if > 1
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
        range = Math.floor(range);
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
    // tower upgrade
    tower.upgrade = function () {
        tower.level++;
        if (this.boostPerLevel.damage) {
            tower.damage += this.boostPerLevel.damage;
            tower.damage = Math.round(tower.damage * 100) / 100;
        }
        if (this.boostPerLevel.coolDownMult) {
            tower.coolDown *= this.boostPerLevel.coolDownMult;
            tower.coolDown = Math.round(tower.coolDown * 100) / 100;
        }
        if (this.boostPerLevel.range) {
            tower.range += this.boostPerLevel.range;
            tower.range = Math.round(tower.range * 100) / 100;
        }
    };
    tower.getUpgradeCost = function() {
        return Math.floor(Math.pow(tower.level, 2)) * TOWER_COST;
    };
    // tower attack
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
    var tower = makeTower(gx,gy,"fireball.png", 100, 1, 3);
    tower.boostPerLevel = {
        damage: tower.damage,
        coolDownMult: .75,
        range: 1
    };
    tower.name = "Fire";
    tower.desc = '3rd hit on same enemy is aoe';
    tower.makeProjectile = function (gx, gy) {
        return makeFireProjectile(tower, gx, gy);
    };
    return tower;
}
function makeWaterTower(gx,gy) {
    var tower = makeTower(gx,gy,"bluefire.png", 10, .1, 1);
    tower.boostPerLevel = {
        damage: tower.damage,
        coolDownMult: .9,
        range: .25
    };
    tower.name = "Water";
    tower.desc = 'Short ranged, fast firing';
    tower.makeProjectile = function (gx, gy) {
        return makeSprayProjectile(tower, gx, gy);
    };
    return tower;
}
function makeLightningTower(gx,gy) {
    var tower = makeTower(gx,gy,"lightningbolt.png",1000,5,10);
    tower.boostPerLevel = {
        damage: tower.damage / 2,
        range: 2.5,
        coolDownMult: .7
    };
    tower.name = "Lightning";
    tower.desc = 'Long ranged, slow but powerful';
    tower.makeProjectile = function (gx, gy) {
        return makeLightningProjectile(tower, gx, gy);
    };
    return tower;
}
function makeMagicTower(gx,gy) {
    var tower = makeTower(gx,gy,"magicTrick.png", 40, .45, 4, 10);
    tower.boostPerLevel = {
        damage: tower.damage / 8,
        coolDownMult: .9
    };
    tower.name = "Magic";
    tower.desc = 'Reduces enemy armor';
    tower.makeProjectile = function (gx, gy) {
        return makeMagicProjectile(tower, gx, gy);
    };
    return tower;
}
function makeKingTower(gx,gy) {
    var tower = makeTower(gx,gy,"kingCrown.png", 500, 3, 7);
    tower.boostPerLevel = {
        damage: tower.damage / 2,
        coolDownMult: .7,
        range: 1.5
    };
    tower.name = "King";
    tower.desc = 'Poisons, slows, reduces armor';
    tower.makeProjectile = function (gx, gy) {
        return makeKingProjectile(tower, gx, gy);
    };
    return tower;
}
function makeSpikyGemTower(gx,gy) {
    var tower = makeTower(gx,gy,"spikyGem.png", 30, .75, 4, 10);
    tower.boostPerLevel = {
        damage: tower.damage,
        coolDownMult: .85,
        range: .75
    };
    tower.name = "Gem";
    tower.desc = 'Slows enemy';
    tower.makeProjectile = function (gx, gy) {
        return makeSpikyGemProjectile(tower, gx, gy);
    };
    return tower;
}
function makeSpookyTower(gx,gy) {
    var tower = makeTower(gx,gy,"spookySkull.png", 80, 1, 3);
    tower.boostPerLevel = {
        damage: tower.damage,
        coolDownMult: .75,
        range: .75
    };
    tower.name = "Spooky";
    tower.desc = 'Poisons enemy';
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
