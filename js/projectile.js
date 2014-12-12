
// Depends on: entity.js

/*
 * Projectile entities go here.
 */
// TODO make projectiles more visible by adding a "fade" effect before vanishing, faster = more fade
function makeProjectile(tower, targetx, targety, imageName, speed) {
    var imageCategory = 'projectile';
    var projectile = makeEntity(tower.gx, tower.gy, imageCategory, imageName);
    projectile.owner = tower;
    projectile.speed = speed;
    // projectile.damage set by tower
    projectile.targetEnemy = grid.getFirstEnemy(targetx,targety);
    projectile.update = function (mod) {
        var angle = Math.atan2(targety - this.gy,targetx - this.gx);
        this.gx += mod * Math.cos(angle) * projectile.speed;
        this.gy += mod * Math.sin(angle) * projectile.speed;
        var projectileTile = grid.graphicalToTileCoords(projectile.gx,projectile.gy);
        var targetTileCoords = grid.graphicalToTileCoords(targetx,targety);
        if (this.fullyInsideTile(targetTileCoords, Math.cos(angle), Math.sin(angle))) {
            this.reachTile(targetx, targety);
        }
    };
    projectile.reachTile = function(targetx, targety) {
        grid.removeEntity(projectile)
        if (this.targetEnemy.health > 0) { // hit target if still alive (homing)
            this.hitEnemy(this.targetEnemy); // removes miss chance against fast enemies
        } else { // otherwise just hit a random enemy in original target tile
            var firstEnemy = grid.getFirstEnemy(targetx,targety);
            if (firstEnemy) {
                this.hitEnemy(firstEnemy);
            }
        }
    };
    projectile.hitEnemy  = function(enemy) {
        enemy.takeDamage(this.damage);
        this.additionalEffects(enemy);
    };
    // Towers can override for additional effects
    projectile.additionalEffects = function(enemy) {
    };
    return projectile;
}

function makeFireProjectile(tower,targetx,targety) {
    var imageName = "fireball.png";
    var speed = 800;
    var projectile = makeProjectile(tower,targetx,targety,imageName,speed);
    projectile.additionalEffects = function(enemy) {
        // Mark of Fire - Every 3 hits on same target, extra attack to every enemy in tile
        var triggerHitCount = 3;
        if (!enemy.markOfFire) {
            enemy.markOfFire = 0;
        }
        enemy.markOfFire++;
        if (enemy.markOfFire >= triggerHitCount) {
            var enemies = grid.getAllEnemies(enemy.gx, enemy.gy);
            if (enemies) {
                enemies.forEach(function(enemy) {
                    enemy.takeDamage(this.damage);
                }, this);
            }
            enemy.markOfFire = 0;
        }
    };
    return projectile;
}
function makeSprayProjectile(tower,targetx,targety) {
    var imageName = "bluefire.png";
    var speed = 1000;
    // Just Attacks Very Fast
    var projectile = makeProjectile(tower,targetx,targety,imageName,speed);
    return projectile;
}
function makeLightningProjectile(tower,targetx,targety) {
    var imageName = "lightningbolt.png";
    var speed = 3000;
    // Long Range, High Speed, High Damage
    var projectile = makeProjectile(tower,targetx,targety,imageName,speed);
    return projectile;
}
function makeMagicProjectile(tower,targetx,targety) {
    var imageName = "magicTrick.png";
    var speed = 700;
    var projectile = makeProjectile(tower,targetx,targety,imageName,speed);
    projectile.additionalEffects = function(enemy) {
        // Melt Armor
        enemy.armor -= this.damage / 5;
    };
    return projectile;
}
function makeKingProjectile(tower,targetx,targety) {
    var imageName = "kingCrown.png";
    var speed = 2000;
    var reduceToMinimum = function(base, reduction, minimum) {
        var newVal = base;
        if (newVal > minimum) {
            newVal -= reduction;
            newVal = Math.max(newVal, minimum);
        }
        return newVal;
    }
    var projectile = makeProjectile(tower,targetx,targety,imageName,speed);
    projectile.additionalEffects = function(enemy) {
        // Bow Before The King - Reduces all stats
        var minRegen = -100;
        var minArmor = -100;
        var minSpeed = 1;
        var statReduction = this.damage / 20;
        enemy.regen = reduceToMinimum(enemy.regen, statReduction, minRegen);
        enemy.armor = reduceToMinimum(enemy.armor, statReduction, minArmor);
        enemy.speed = reduceToMinimum(enemy.speed, statReduction, minSpeed);
    };
    return projectile;
}
function makeSpikyGemProjectile(tower,targetx,targety) {
    var imageName = "spikyGem.png";
    var speed = 900;
    var projectile = makeProjectile(tower,targetx,targety,imageName,speed);
    projectile.additionalEffects = function(enemy) {
        // Crystallize - Slows enemy
        var speedMultiplier = 1 - Math.min(this.damage, .9);
        var minSpeed = 10;
        var newSpeed = Math.floor(enemy.speed * speedMultiplier);
        if (enemy.speed > minSpeed) {
            enemy.speed = Math.max(minSpeed, newSpeed);
        }
    };
    return projectile;
}
function makeSpookyProjectile(tower,targetx,targety) {
    var imageName = "spookySkull.png";
    var speed = 800;
    var projectile = makeProjectile(tower,targetx,targety,imageName,speed);
    projectile.additionalEffects = function(enemy) {
        // Spooky Death - Poison damage
        enemy.regen -= this.damage;
    };
    return projectile;
}

