
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
        var healthBarHeight = 5;
        ctx.fillStyle = "green";
        ctx.fillRect(this.gx,this.gy,this.sx,healthBarHeight);
        ctx.fillStyle = "red";
        var healthPercentage = this.health / this.maxHealth;
        var healthWidth = Math.max(this.sx * healthPercentage, 0);
        ctx.fillRect(this.gx+healthWidth,this.gy,this.sx-healthWidth,healthBarHeight);
    };
    enemy.update = function (mod) {
        this.preUpdate(mod);
        this.move(mod);
        this.health += enemy.regen * mod;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        if (this.health <= 0) {
            grid.removeEntity(this);
        }
        this.postUpdate(mod);
    };
    enemy.move = function(mod) {
        var dx = this.speed * this.direction.multiplierX;
        var dy = this.speed * this.direction.multiplierY;
        this.gx += mod * dx;
        this.gy += mod * dy;
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
    var enemy = makeEnemy(gx, gy, 'glarefish.png', 200, 30);
    enemy.armor = 0;
    return enemy;
}

function makeChomper(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'chomper.png', 500, 80);
    enemy.armor = 0;
    return enemy;
}

function makeGolem(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'staregolem.png', 1000, 15);
    enemy.armor = 2;
    return enemy;
}

function makeBug(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'smugbug.png', 100, 120);
    enemy.armor = 0;
    enemy.regen = 20;
    return enemy;
}

function makeBeetle(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'smilebeetle.png', 150, 50);
    enemy.armor = 1;
    enemy.regen = 15;
    return enemy;
}

function makeRandomEnemy(gx, gy) {
    var possibleEnemyFunctions = [makeGlarefish, makeChomper, makeGolem, makeBug, makeBeetle];
    var makeRandomEnemyFunction = Utility.getRandomElementFromArray(possibleEnemyFunctions);
    return makeRandomEnemyFunction(gx, gy);
}
