
// Depends on: images.js

/*
 * Entities are contained inside tiles, they are enemies, towers and trees
 * Entities are the most-used class in this game project
 *  draw(ctx): draws image specified by setImage(String,String)
 *  update(): does nothing, 'subclasses' can override to do something every game frame
 */
function makeEntity(x, y, imageCategory, imageName) {
	var entity = {
		// x & y are position within grid, used for physics
		x: x,
		y: y,
		// TODO gx & gy are graphical position, where to actually draw on screen
		image: Images.getImage(imageCategory, imageName),
		draw: function (ctx) {
			ctx.drawImage(this.image, this.x, this.y, this.sx, this.sy);
		},
		update: function (mod) {
			// no-op, 'subclasses' can override
		}
	};
	return entity;
}
