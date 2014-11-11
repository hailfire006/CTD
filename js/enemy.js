
// Depends on: entity.js

/*
 * Enemy entities go here.
 */

function makeEnemy(x, y, imageName) {
    var imageCategory = 'enemy';
    var enemy = makeEntity(x, y, imageCategory, imageName);
    return enemy;
}

// TODO remove testing code when real enemies are done
function makeTestEnemy(x, y) {
    var enemy = makeEnemy(x, y, 'glarefish.png');
    enemy.update = function (mod) {
        enemy.gx += mod * 30;
        // TODO use speed instead
    }
    return enemy;
}
