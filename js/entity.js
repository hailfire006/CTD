
// Depends on: images.js

/*
 * Entities are contained inside tiles, they are enemies, towers and trees
 * Entities are the most-used class in this game project
 *  draw(ctx): draws image specified by setImage(String,String)
 *  update(): does nothing, 'subclasses' can override to do something every game frame
 */
// TODO consider making entities have free motion, but able to collide with tiles
function makeEntity(gx, gy, imageCategory, imageName) {
	var entity = {
		// TODO x & y are position within grid, used for physics? possibly not needed here
		// gx & gy are graphical position, where to draw on screen
		gx: gx,
		gy: gy,
		image: Images.getImage(imageCategory, imageName),
		draw: function (ctx) {
			ctx.drawImage(this.image, this.gx, this.gy, this.sx, this.sy);
		},
		update: function (mod) {
			// no-op, 'subclasses' can override
		}
	};
	return entity;
}
