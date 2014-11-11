
// Depends on: entity.js

/*
 * Projectile entities go here.
 */

function makeProjectile(gx, gy, imageName) {
    var imageCategory = 'projectile';
    var projectile = makeEntity(gx, gy, imageCategory, imageName);
    return projectile;
}

// TODO projectiles
