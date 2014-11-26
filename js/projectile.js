
// Depends on: entity.js

/*
 * Projectile entities go here.
 */
// TODO make projectiles more visible by adding a "fade" effect before vanishing, faster = more fade
function makeProjectile(gx, gy, targetx, targety, imageName, speed, damage) {
    var imageCategory = 'projectile';
    var projectile = makeEntity(gx, gy, imageCategory, imageName);
    projectile.speed = speed;
    projectile.damage = damage;
    projectile.update = function (mod) {
        var angle = Math.atan2(targety - gy,targetx - gx);
        this.gx += mod * Math.cos(angle) * projectile.speed;
        this.gy += mod * Math.sin(angle) * projectile.speed;
        var projectileTile = grid.graphicalToTileCoords(projectile.gx,projectile.gy);
        var targetTileCoords = grid.graphicalToTileCoords(targetx,targety);
        if (this.fullyInsideTile(targetTileCoords, Math.cos(angle), Math.sin(angle))) {
            this.reachTile(targetx, targety);
        }
    };
    projectile.reachTile = function(targetx, targety) {
        var firstEnemy = grid.getFirstEnemy(targetx,targety);
        grid.removeEntity(projectile)
        if (firstEnemy) {
            firstEnemy.takeDamage(projectile.damage);
            this.additionalEffects(firstEnemy);
        }
    };
    // Towers can override for additional effects
    projectile.additionalEffects = function(enemy) {
    };
    return projectile;
}

function makeFireProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "fireball.png", 1500, 100);
    return projectile;
}
function makeSprayProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "bluefire.png", 1500, 10);
    return projectile;
}
function makeLightningProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "lightningbolt.png", 5000, 800);
    return projectile;
}
function makeMagicProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "magicTower.png", 1500, 30);
    projectile.additionalEffects = function(enemy) {
        // Melt Armor
        enemy.armor -= 5;
    };
    return projectile;
}
function makeKingProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "kingTower.png", 3500, 500);
    projectile.additionalEffects = function(enemy) {
        // Bow Before The King - Reduces all stats
        if (enemy.regen > 0) {
            enemy.regen -= 5;
            enemy.regen = Math.max(0, enemy.regen);
        }
        if (enemy.armor > 0) {
            enemy.armor -= 5;
            enemy.armor = Math.max(0, enemy.armor);
        }
        if (enemy.speed > 0) {
            enemy.speed -= 5;
            enemy.speed = Math.max(0, enemy.speed);
        }
    };
    return projectile;
}
function makeSpookyProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "spookyTower.png", 1500, 70);
    projectile.additionalEffects = function(enemy) {
        enemy.regen -= 10;
    };
    return projectile;
}
function makeSpikyGemProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "spikyGemTower.png", 1500, 30);
    projectile.additionalEffects = function(enemy) {
        var speedMultiplier = .8;
        var newSpeed = Math.floor(enemy.speed * speedMultiplier);
        if (newSpeed > 0) {
            enemy.speed = newSpeed;
        }
    };
    return projectile;
}

