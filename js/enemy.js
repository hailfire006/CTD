
// Depends on: entity.js

/*
 * Enemy entities go here.
 */

function makeEnemy(gx, gy, imageName) {
    var imageCategory = 'enemy';
    var enemy = makeEntity(gx, gy, imageCategory, imageName);
	enemy.hostile = true;
    enemy.health = 1;
    enemy.speed = 30;
    enemy.direction = {
        multiplierX: 1,
        multiplierY: 0
    };
    // pre & post update can be modified
    enemy.preUpdate = function(mod) {
    };
    enemy.postUpdate = function(mod) {
    };
    enemy.update = function (mod) {
        enemy.preUpdate(mod);
        enemy.move(mod);
        if (enemy.health <= 0) {
            grid.removeEntity(this);
        }
        enemy.postUpdate(mod);
    };
    enemy.move = function(mod) {
        var dx = this.speed * this.direction.multiplierX;
        var dy = this.speed * this.direction.multiplierY;
        enemy.gx += mod * dx;
        enemy.gy += mod * dy;
		// change direction on certain tiles
		var currentTileCoords = this.getCurrentTileCoords();
		var currentTile = grid.getTileAtCoords(currentTileCoords);
		if (currentTile && this.fullyInsideTile(currentTileCoords)) {
			this.faceDirection(currentTile.direction);
		}
    };
	enemy.fullyInsideTile = function(tileCoords) {
		// check if 100% inside tile
		var minGraphicalX = tileCoords.tx * TILE_WIDTH;
		var minGraphicalY = tileCoords.ty * TILE_HEIGHT;
		var maxGraphicalX = (tileCoords.tx + 1) * TILE_WIDTH;
		var maxGraphicalY = (tileCoords.ty + 1) * TILE_HEIGHT;
		var movingLeft = this.direction.multiplierX < 0;
		var movingRight = this.direction.multiplierX > 0;
		var movingUp = this.direction.multiplierY < 0;
		var movingDown = this.direction.multiplierY > 0;
		if (movingLeft) {
			if (this.gx > minGraphicalX) {
				return false;
			}
		} else if (movingRight) {
			if (this.gx + this.sx < maxGraphicalX) {
				return false;
			}
		}
		if (movingUp) {
			if (this.gy > minGraphicalY) {
				return false;
			}
		} else if (movingDown) {
			if (this.gy + this.sy < maxGraphicalY) {
				return false;
			}
		}
		return true;
	};
	enemy.faceDirection = function(direction) {
		if (direction) {
			this.direction.multiplierX = direction.x;
			this.direction.multiplierY = direction.y;
		}
	};
    return enemy;
}

function makeGlarefish(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'glarefish.png');
    enemy.speed = 30;
    return enemy;
}

function makeChomper(gx, gy) {
    var enemy = makeEnemy(gx, gy, 'chomper.png');
    enemy.speed = 100;
    return enemy;
}
