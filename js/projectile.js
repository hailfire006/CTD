
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
        var targetTile = grid.graphicalToTileCoords(targetx,targety);
        if (projectileTile.tx == targetTile.tx && projectileTile.ty == targetTile.ty) {
            grid.removeEntity(projectile)
            if (firstEnemy) {
                firstEnemy.health -= projectile.damage;
            }
        }
    }
    return projectile;
}

function makeFishProjectile(tower,targetx,targety) {
    var projectile = makeProjectile(tower.gx,tower.gy,targetx,targety,"glarefish.png",200, 10);
    return projectile;
}
// TODO projectiles
