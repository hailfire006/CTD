
// Depends on: entity.js

/*
 * Enemy entities go here.
 */

function makeEnemy(gx, gy, imageName) {
    var imageCategory = 'enemy';
    var enemy = makeEntity(gx, gy, imageCategory, imageName);
    enemy.health = 1;
    enemy.speed = 30;
    enemy.direction = {
        multiplierX: 1,
        multiplierY: 0
    };
    // pre & post update can be modified
    enemy.preUpdate = function(mod) {
    };
    enemy.postUpdate = function(mod) {
    };
    enemy.faceUp = function() {
        this.direction.multiplierX = 0;
        this.direction.multiplierY = -1;
    };
    enemy.faceDown = function() {
        this.direction.multiplierX = 0;
        this.direction.multiplierY = 1;
    };
    enemy.faceLeft = function() {
        this.direction.multiplierX = -1;
        this.direction.multiplierY = 0;
    };
    enemy.faceRight = function() {
        this.direction.multiplierX = 1;
        this.direction.multiplierY = 0;
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
    };
    return enemy;
}

function makeGlarefish(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'glarefish.png');
    enemy.speed = 30;
    return enemy;
}
