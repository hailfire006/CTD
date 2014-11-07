
// Depends on: entity.js

function makeEnemy(x, y, imageName) {
	var imageCategory = 'enemy';
	var enemy = makeEntity(x, y, imageCategory, imageName);
	return enemy;
}

// TODO remove testing code when real enemies are done
function makeTestEnemy(x, y) {
	var enemy = makeEnemy(x, y, 'glarefish.png');
	enemy.sx = 50;
	enemy.sy = 50;
	enemy.update = function (mod) {
		enemy.x++;
	}
	// TODO auto set size from image? probably not
	return enemy;
}
