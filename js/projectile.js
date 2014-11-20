
// Depends on: entity.js

/*
 * Projectile entities go here.
 */

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
            firstEnemy.health -= projectile.damage;
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
        "fireball.png", 800, 100);
    return projectile;
}
function makeSprayProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "bluefire.png", 800, 10);
    return projectile;
}
function makeLightningProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "lightningbolt.png", 1900, 300);
    return projectile;
}
function makeMagicProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "magicTower.png", 800, 30);
    return projectile;
}
function makeKingProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "kingTower.png", 1000, 500);
    return projectile;
}
function makeSpookyProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "spookyTower.png", 800, 70);
    return projectile;
}
function makeSpikyGemProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "spikyGemTower.png", 1000, 30);
    projectile.additionalEffects = function(enemy) {
        var speedMultiplier = .8;
        var newSpeed = Math.floor(enemy.speed * speedMultiplier);
        if (newSpeed > 0) {
            enemy.speed = newSpeed;
        }
    };
    return projectile;
}

