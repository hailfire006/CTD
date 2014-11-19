
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
        projectile.gx += mod * Math.cos(angle) * projectile.speed;
        projectile.gy += mod * Math.sin(angle) * projectile.speed;
        var firstEnemy = grid.getFirstEnemy(targetx,targety);
        var projectileTile = grid.graphicalToTileCoords(projectile.gx,projectile.gy);
        var targetTileCoords = grid.graphicalToTileCoords(targetx,targety);
        if (this.fullyInsideTile(targetTileCoords, Math.cos(angle), Math.sin(angle))) {
            grid.removeEntity(projectile)
            if (firstEnemy) {
                firstEnemy.health -= projectile.damage;
            }
        }
    }
    return projectile;
}

function makeFireProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "fireball.png", 600, 50);
    return projectile;
}
function makeSprayProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "bluefire.png", 600, 10);
    return projectile;
}
function makeLightningProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,
        "lightningbolt.png", 1300, 100);
    return projectile;
}
