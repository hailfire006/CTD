
// Depends on: entity.js, game.js

/*
 * Enemy entities move along a path and are targetted by towers.
 * Give player money and health if killed, steal health if escape offscreen.
 * Primary attributes are health, armor, regen, and speed.
 * The first three increase as game progresses.
 */

var Enemies = { // Enemy listing used to auto-generate hud buttons in admin menu
    allEnemyFunctions: [], // list: makeEnemy functions
    enemyListing: {}, // map: (imageCategory, imageName) -> makeEnemy function
    addEnemyListing: function(imageName, makeFunction) {
        this.allEnemyFunctions.push(makeFunction);
        this.enemyListing[imageName] = makeFunction;
    }
};

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
    enemy.makeBoss = function (difficulty) { // bosses are larger & stronger
        var bossBonusDifficulty = 5;
        enemy.buffDifficulty(difficulty + bossBonusDifficulty);
        this.sx = Math.min(this.sx * BOSS_SIZE_MULTIPLIER);
        this.sy = Math.min(this.sy * BOSS_SIZE_MULTIPLIER);
    };
    enemy.takeDamage = function (damage) {
        var adjustedDamage = Math.max(damage - this.armor, 1);
        this.health -= adjustedDamage;
    };
    enemy.postDraw = function (ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.gx,this.gy,this.sx,HEALTH_BAR_HEIGHT);
        ctx.fillStyle = "red";
        var healthPercentage = this.health / this.maxHealth;
        var healthWidth = Math.max(this.sx * healthPercentage, 0);
        ctx.fillRect(this.gx+healthWidth,this.gy,this.sx-healthWidth,HEALTH_BAR_HEIGHT);
    };
    enemy.update = function (mod) {
        this.preUpdate(mod);
        this.move(mod);
        this.health += enemy.regen * mod;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        if (this.health <= 0) {
            this.die();
            grid.removeEntity(this);
        }
        this.postUpdate(mod);
    };
    // Die & award player
    enemy.die = function() {
        Game.money += MONEY_FROM_ENEMY_KILLS;
        Game.gainHealth(HEALTH_FROM_ENEMY_KILLS);
    };
    // Escaped offscreen - player loses health
    enemy.escape = function() {
        // game difficulty stats at 0, don't multiply by 0
        var healthDamage = ENEMY_HEALTH_DAMAGE_MULTIPLIER * (Game.getDifficulty() + 1);
        Game.loseHealth(healthDamage);
        Game.enemiesEscaped++;
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

function makeGlareFish(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'glarefish.png', 200, 30);
    enemy.armor = 0;
    return enemy;
}

function makeChomper(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'chomper.png', 500, 80);
    enemy.armor = -5;
    return enemy;
}

function makeStareGolem(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'staregolem.png', 750, 15);
    enemy.armor = 2;
    return enemy;
}

function makeSmugBug(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'smugbug.png', 100, 110);
    enemy.armor = 0;
    enemy.regen = 15;
    return enemy;
}

function makeSmileBeetle(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'smilebeetle.png', 150, 50);
    enemy.armor = 1;
    enemy.regen = 10;
    return enemy;
}

function makeRandomEnemy(gx, gy) {
    var possibleEnemyFunctions = Enemies.allEnemyFunctions;
    var makeRandomEnemyFunction = Utility.getRandomElementFromArray(possibleEnemyFunctions);
    return makeRandomEnemyFunction(gx, gy);
}

function addEnemyListing() { // add new enemies in here to generate hud buttons for admin menu
    Enemies.addEnemyListing('glarefish.png', makeGlareFish);
    Enemies.addEnemyListing('chomper.png', makeChomper);
    Enemies.addEnemyListing('staregolem.png', makeStareGolem);
    Enemies.addEnemyListing('smugbug.png', makeSmugBug);
    Enemies.addEnemyListing('smilebeetle.png', makeSmileBeetle);
}
addEnemyListing();
