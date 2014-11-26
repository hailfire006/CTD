
// Depends on: entity.js

/*
 * Enemy entities go here.
 */

function makeEnemy(gx, gy, imageName, health, speed) {
    var imageCategory = 'enemy';
    var enemy = makeEntity(gx, gy, imageCategory, imageName);
    enemy.hostile = true;
    enemy.direction = {
        multiplierX: 1,
        multiplierY: 0
    };
    enemy.maxHealth = health;
    enemy.health = health;
    enemy.armor = 0;
    enemy.regen = 0;
    enemy.speed = speed;
    // pre & post update can be modified
    enemy.preUpdate = function(mod) {
    };
    enemy.postUpdate = function(mod) {
    };
    enemy.buffDifficulty = function (difficulty) {
        var propertyMultiplier = 1 + difficulty / 5;
        this.health = Math.floor(this.health * propertyMultiplier);
        this.maxHealth = Math.floor(this.maxHealth * propertyMultiplier);
        this.armor = Math.floor(this.armor * propertyMultiplier);
        this.regen = Math.floor(this.regen * propertyMultiplier);
    };
    enemy.takeDamage = function (damage) {
        var adjustedDamage = Math.max(damage - this.armor, 1);
        this.health -= adjustedDamage;
    };
    enemy.postDraw = function (ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.gx,this.gy,this.sx,5);
        ctx.fillStyle = "red";
        var healthPercentage = this.health / this.maxHealth;
        var missingHealthPercentage = 1 - healthPercentage;
        ctx.fillRect(this.gx+(this.sx*healthPercentage),this.gy,this.sx-(this.sx*healthPercentage),5);
    };
    enemy.update = function (mod) {
        enemy.preUpdate(mod);
        enemy.move(mod);
        enemy.health += enemy.regen;
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
    var enemy = makeEnemy(gx, gy, 'glarefish.png', 500, 30);
    enemy.armor = 0;
    return enemy;
}

function makeChomper(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'chomper.png', 1000, 100);
    enemy.armor = 0;
    return enemy;
}

function makeGolem(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'golem.png', 3000, 20);
    enemy.armor = 2;
    return enemy;
}

function makeBug(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'bug.png', 400, 300);
    enemy.armor = 0;
    return enemy;
}

function makeBeetle(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'beetle.png', 1500, 20);
    enemy.armor = 3;
    enemy.regen = 3;
    return enemy;
}

