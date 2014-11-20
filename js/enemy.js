
// Depends on: entity.js

/*
 * Enemy entities go here.
 */

function makeEnemy(gx, gy, imageName, health, speed) {
    var imageCategory = 'enemy';
    var enemy = makeEntity(gx, gy, imageCategory, imageName);
    enemy.hostile = true;
    enemy.health = health;
    enemy.speed = speed;
    enemy.direction = {
        multiplierX: 1,
        multiplierY: 0
    };
    // pre & post update can be modified
    enemy.preUpdate = function(mod) {
    };
    enemy.postUpdate = function(mod) {
    };
    enemy.update = function (mod) {
        enemy.preUpdate(mod);
        enemy.move(mod);
        if (enemy.health <= 0) {
            grid.removeEntity(this);
        }
        enemy.postUpdate(mod);
    };
    enemy.move = function(mod) {
        var dx = this.speed * this.direction.multiplierX;
        var dy = this.speed * this.direction.multiplierY;
        enemy.gx += mod * dx;
        enemy.gy += mod * dy;
        // change direction on certain tiles
        var currentTileCoords = this.getCurrentTileCoords();
        var currentTile = grid.getTileAtCoords(currentTileCoords);
        if (currentTile && this.fullyInsideTileUsingDirection(currentTileCoords)) {
            this.faceDirection(currentTile.direction);
        }
    };
    enemy.fullyInsideTileUsingDirection = function(tileCoords) {
        return this.fullyInsideTile(tileCoords, this.direction.multiplierX, this.direction.multiplierY);
    };
    enemy.faceDirection = function(direction) {
        if (direction) {
            this.direction.multiplierX = direction.x;
            this.direction.multiplierY = direction.y;
        }
    };
    return enemy;
}

function makeGlarefish(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'glarefish.png', 100, 30);
    return enemy;
}

function makeChomper(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'chomper.png', 200, 100);
    return enemy;
}
