
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
    tower.upgrade = function () {
        // TODO upgrade stats, change image
    };
    tower.fire = function () {
        var towerTile = grid.graphicalToTileCoords(tower.gx,tower.gy);
        // fire to the right
        var targetTilex = towerTile.tx + 6;
        var targetTiley = towerTile.ty + 7;
        var targetx = targetTilex * TILE_WIDTH; 
        var targety = targetTiley * TILE_HEIGHT;
        var projectile = makeTestProjectile(this,targetx,targety);
        grid.addEntity(projectile);
    }
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
