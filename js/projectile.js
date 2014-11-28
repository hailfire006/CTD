
// Depends on: entity.js

/*
 * Projectile entities go here.
 */
// TODO make projectiles more visible by adding a "fade" effect before vanishing, faster = more fade
function makeProjectile(tower, targetx, targety, imageName, damage, speed) {
    var imageCategory = 'projectile';
    var projectile = makeEntity(tower.gx, tower.gy, imageCategory, imageName);
    projectile.owner = tower;
    projectile.speed = speed;
    projectile.damage = damage;
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
    var damage = 100;
    var speed = 800;
    var projectile = makeProjectile(tower,targetx,targety,imageName,damage,speed);
    projectile.additionalEffects = function(enemy) {
        // Mark of Fire - Every 3 hits, deals +300% damage
        var triggerHitCount = 3;
        var triggerDamageMultiplier = 3;
        if (!enemy.markOfFire) {
            enemy.markOfFire = 0;
        }
        enemy.markOfFire++;
        if (enemy.markOfFire >= triggerHitCount) {
            enemy.takeDamage(this.damage * triggerDamageMultiplier);
            enemy.markOfFire = 0;
        }
    };
    return projectile;
}
function makeSprayProjectile(tower,targetx,targety) {
    var imageName = "bluefire.png";
    var damage = 10;
    var speed = 1000;
    // Just Attacks Very Fast
    var projectile = makeProjectile(tower,targetx,targety,imageName,damage,speed);
    return projectile;
}
function makeLightningProjectile(tower,targetx,targety) {
    var imageName = "lightningbolt.png";
    var damage = 800;
    var speed = 3000;
    // Long Range, High Speed, High Damage
    var projectile = makeProjectile(tower,targetx,targety,imageName,damage,speed);
    return projectile;
}
function makeMagicProjectile(tower,targetx,targety) {
    var imageName = "magicTrick.png";
    var damage = 30;
    var speed = 700;
    var projectile = makeProjectile(tower,targetx,targety,imageName,damage,speed);
    projectile.additionalEffects = function(enemy) {
        // Melt Armor
        enemy.armor -= 5;
    };
    return projectile;
}
function makeKingProjectile(tower,targetx,targety) {
    var imageName = "kingCrown.png";
    var damage = 500;
    var speed = 2000;
    var projectile = makeProjectile(tower,targetx,targety,imageName,damage,speed);
    projectile.additionalEffects = function(enemy) {
        // Bow Before The King - Reduces all stats
        if (enemy.regen > 0) {
            enemy.regen -= this.damage / 100;
            enemy.regen = Math.max(0, enemy.regen);
        }
        if (enemy.armor > 0) {
            enemy.armor -= this.damage / 100;
            enemy.armor = Math.max(0, enemy.armor);
        }
        if (enemy.speed > 0) {
            enemy.speed -= this.damage / 100;
            enemy.speed = Math.max(0, enemy.speed);
        }
    };
    return projectile;
}
function makeSpookyProjectile(tower,targetx,targety) {
    var imageName = "spookySkull.png";
    var damage = 70;
    var speed = 800;
    var projectile = makeProjectile(tower,targetx,targety,imageName,damage,speed);
    projectile.additionalEffects = function(enemy) {
        // Spooky Death - Poison damage
        enemy.regen -= this.damage / 2;
    };
    return projectile;
}
function makeSpikyGemProjectile(tower,targetx,targety) {
    var imageName = "spikyGem.png";
    var damage = 30;
    var speed = 900;
    var projectile = makeProjectile(tower,targetx,targety,imageName,damage,speed);
    projectile.additionalEffects = function(enemy) {
        // Crystallize - Slows enemy
        var speedMultiplier = .8;
        var newSpeed = Math.floor(enemy.speed * speedMultiplier);
        enemy.speed = Math.max(10, newSpeed);
    };
    return projectile;
}

