
// Depends on: images.js

function makeEntity(x, y) {
	var entity = {
		// x & y are position within grid, used for physics
		x: x,
		y: y,
		// TODO gx & gy are graphical position, where to actually draw on screen
		setImage: function (imageCategory, imageName) {
			this.image = Images.getImage(imageCategory, imageName);
		},
		draw: function (ctx) {
			ctx.drawImage(this.image, this.x, this.y, this.sx, this.sy);
		},
		update: function (mod) {
			// no-op, 'subclasses' can override
		}
	};
	return entity;
}

function makeEnemy(x, y, imageName) {
	var imageCategory = 'enemy';
	var enemy = makeEntity(x, y);
	enemy.setImage(imageCategory, imageName);
	return enemy;
}

// TODO remove testing code
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
