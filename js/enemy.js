
// Depends on: entity.js

/*
 * Enemy entities go here.
 */

function makeEnemy(gx, gy, imageName) {
    var imageCategory = 'enemy';
    var enemy = makeEntity(gx, gy, imageCategory, imageName);
    enemy.health = 1;
    return enemy;
}

// TODO remove testing code when real enemies are done
function makeTestEnemy(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'glarefish.png');
    enemy.update = function (mod) {
        enemy.gx += mod * 30;
        // TODO use speed instead
        if (enemy.health <= 0) {
            // TODO move into generic
            grid.removeEntity(this);
        }
    }
    return enemy;
}
